// Grades 9 to 12: the words of each unit's theme, ten to a batch: literary analysis, rhetoric, the theater,
// government and law, scientific inquiry, modern history, poetic form and reflection.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, batchTopicWithPool, batchWords, wordPool } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

const literary: BatchSpec = {
  id: "words-for-literary-analysis",
  title: t("Words for Literary Analysis", "文学分析用词"),
  summary: t(
    "Ten words for writing about literature: ambiguity, motif, juxtaposition, archetype, protagonist, catharsis, satire and more.",
    "十个用于评论文学的词：ambiguity、motif、juxtaposition、archetype、protagonist、catharsis、satire 等。",
  ),
  intro: t(
    "In our book club's novel, the **protagonist** keeps dreaming of a red kite, a **motif** that returns in every chapter, and the last page ends in such **ambiguity** that we argued for an hour. These ten words help you explain how a story builds its meaning, from its characters and patterns to the feelings it leaves behind.",
    "读书会读的那本小说里，主人公（**protagonist**）总梦见一只红风筝，这个母题（**motif**）每章都会出现；最后一页的结局充满歧义（**ambiguity**），我们争论了一个小时。这十个词帮你说清一个故事怎样构建意义，从人物、反复出现的模式，到它留给读者的感受。",
  ),
  watchOut: {
    meanings: t(
      "An **epiphany** is a character's sudden understanding, while **catharsis** is the release of strong feeling, often the audience's; one is a flash of knowing, the other a flood of emotion let go.",
      "**epiphany** 是人物突然想明白，**catharsis** 是强烈情感（常是观众的）得到释放；一个是“想通了”，一个是“哭出来、放下了”。",
    ),
    use: t(
      "A **motif** is one image that keeps coming back inside a single work, but an **archetype** is a type found across many cultures' stories; and **satire** mocks with humor, while an **allegory** makes its characters stand for ideas.",
      "**motif** 是在同一部作品里反复出现的意象，**archetype** 是各种文化的故事里都有的类型；**satire** 用幽默嘲弄，**allegory** 让人物代表某种观念。",
    ),
    spelling: t(
      "**Archetype** begins arche- with a hard ch, **epiphany** spells its f sound ph, and **catharsis** puts th in the middle.",
      "**archetype** 开头 arche-，ch 读硬音 /k/；**epiphany** 的 /f/ 音写作 ph；**catharsis** 中间是 th。",
    ),
  },
  domain: ["how stories and their meanings are made", "故事及其意义是怎样构成的"],
  prerequisites: ["context-clues", "theme"],
  encompasses: fromClues,
  words: [
    {
      word: "ambiguity",
      forms: ["ambiguities", "ambiguous"],
      meaning: ["the quality of having more than one possible meaning", "歧义，模棱两可，有不止一种可能的含义"],
      sentences: [
        "The story ends with deliberate ___: we never learn whether the brothers forgive each other.",
        "Critics still argue about the ___ of the last line, which can be read as hope or as despair.",
        "The author leaves the stranger's motives in ___, so each reader must decide whether he can be trusted.",
      ],
      confusions: ["epiphany", "motif"],
      clues: [
        "an ending that never tells us whether the brothers forgive each other",
        "a last line that can be read as hope or as despair",
        "a stranger's motives left open for each reader to judge",
      ],
      contrast: [
        "ambiguity leaves a meaning open; an epiphany is a moment when something becomes suddenly clear",
        "ambiguity 让意思悬而未决；epiphany 是一下子想明白的时刻",
      ],
      conflicts: [
        [
          "epiphany is a sudden moment of clear understanding, the opposite of a meaning left open to doubt",
          "epiphany 是突然想明白的时刻，恰恰和意思悬而未决相反",
        ],
        [
          "motif is an image that keeps returning in a work, not the openness of a meaning that can be read two ways",
          "motif 是作品中反复出现的意象，不是可以两种读法的意思不确定",
        ],
      ],
      spelling: ["am · bi · gu · i · ty", "the u and i that both stay before the -ty ending", "结尾 -ty 前的 u 和 i 都要保留"],
    },
    {
      word: "motif",
      forms: ["motifs"],
      meaning: ["an image, object or idea that returns again and again in a work", "母题，反复出现的意象、事物或观念"],
      sentences: [
        "Locked doors are the central ___ of the novel; one appears in almost every chapter.",
        "The ___ of birds in cages returns whenever the heroine feels trapped by her family.",
        "Water is the central ___ of these poems: rain, rivers and tears appear in each of them.",
      ],
      confusions: ["archetype", "allegory"],
      clues: [
        "locked doors that appear in almost every chapter of a novel",
        "caged birds that return whenever a heroine feels trapped",
        "rain, rivers and tears appearing in every one of a set of poems",
      ],
      contrast: [
        "a motif repeats inside one work; an archetype is a pattern shared by stories across many cultures",
        "motif 在一部作品内部反复出现；archetype 是许多文化的故事共有的模式",
      ],
      conflicts: [
        [
          "archetype is a type of character or plot found in stories across many cultures, not an image repeated inside one work",
          "archetype 是许多文化的故事里都有的人物或情节类型，不是在一部作品里反复出现的意象",
        ],
        [
          "allegory is a whole story whose characters stand for ideas, not a single image that keeps coming back",
          "allegory 是人物代表观念的整个故事，不是一个反复出现的意象",
        ],
      ],
      spelling: ["mo · tif", "the ending -if with a single f, not -iff or -eef", "结尾 -if，只有一个 f，不写 -iff 或 -eef"],
    },
    {
      word: "juxtaposition",
      forms: ["juxtapositions"],
      meaning: [
        "placing two very different things side by side so that the contrast stands out",
        "并置，把截然不同的事物放在一起以突出对比",
      ],
      sentences: [
        "The ___ of the lavish wedding feast and the hungry children outside the gate makes the point without a word of comment.",
        "In the film, the ___ of a quiet lullaby with images of war is hard to forget.",
        "The poet uses ___ when she sets a newborn baby beside an old man on his deathbed.",
      ],
      confusions: ["ambiguity", "satire"],
      clues: [
        "a lavish wedding feast set next to hungry children at the gate",
        "a quiet lullaby played over images of war",
        "a newborn baby set beside an old man on his deathbed",
      ],
      contrast: [
        "juxtaposition sets two opposites side by side; satire mocks a target with humor",
        "juxtaposition 把两个对立的事物并排放置；satire 用幽默嘲弄某个对象",
      ],
      conflicts: [
        [
          "ambiguity is a meaning that can be read more than one way, not the placing of two opposite things side by side",
          "ambiguity 是可以有多种理解的意思，不是把两个对立的事物并排放置",
        ],
        [
          "satire mocks foolishness with humor and exaggeration, but setting two opposites next to each other needs no joke at all",
          "satire 用幽默和夸张嘲弄愚蠢，而把两个对立的事物并排放置根本不需要玩笑",
        ],
      ],
      spelling: [
        "jux · ta · po · si · tion",
        "the x of *jux* and the s, not z, of *position*",
        "*jux* 中的 x，以及 *position* 中的 s（不是 z）",
      ],
    },
    {
      word: "archetype",
      forms: ["archetypes", "archetypal"],
      meaning: [
        "a type of character, plot or symbol found in stories across many cultures and times",
        "原型，各种文化和时代的故事中都能找到的人物、情节或象征类型",
      ],
      sentences: [
        "The wise old teacher who guides the young hero fits an old ___ found from ancient myths to modern films.",
        "Readers in every culture recognize the hero who leaves home, faces a monster and returns changed, a character ___ as old as storytelling itself.",
        "The trickster is the ___ who shows up in Chinese, African and Native American legends alike.",
      ],
      confusions: ["motif", "protagonist"],
      clues: [
        "a wise old guide found from ancient myths to modern films",
        "a hero who leaves home, faces a monster and returns, known in every culture",
        "a trickster who appears in the legends of many peoples",
      ],
      contrast: [
        "an archetype is a type shared across many stories; a protagonist is the main character of one story",
        "archetype 是许多故事共有的类型；protagonist 是某一个故事的主人公",
      ],
      conflicts: [
        [
          "motif is an image that repeats inside one work, not a type of character known across many cultures and centuries",
          "motif 是在一部作品里反复出现的意象，不是许多文化、许多世纪都熟悉的人物类型",
        ],
        [
          "protagonist is the main character of a single story, not a type of character found in stories everywhere",
          "protagonist 是某一个故事的主人公，不是各地故事里都有的人物类型",
        ],
      ],
      spelling: ["ar · che · type", "the ch said like k and the word *type* at the end", "ch 读 /k/，结尾是 *type* 这个词"],
    },
    {
      word: "protagonist",
      forms: ["protagonists"],
      meaning: ["the main character of a story, whose goals drive the plot", "主人公，故事的主要人物，其目标推动情节发展"],
      sentences: [
        "The ___ of the novel, the girl whose story we follow from the first page, runs her family's shop after her father falls ill.",
        "We follow the ___ through every chapter, so we see the whole world through her choices.",
        "Unusually, the ___ of this play is not likable; we watch him make one selfish decision after another.",
      ],
      confusions: ["antagonist", "archetype"],
      clues: [
        "a girl whose story we follow from the first page of the novel",
        "a character we follow through every chapter and whose choices show us the world",
        "a main character who, unusually, is not likable",
      ],
      contrast: [
        "the protagonist is the main character we follow; the antagonist is the one who works against them",
        "protagonist 是我们一路跟随的主人公；antagonist 是与主人公作对的人物",
      ],
      conflicts: [
        [
          "antagonist is the character who works against the main character, not the one whose story we follow from start to end",
          "antagonist 是与主人公作对的人物，不是我们从头跟到尾的那个人",
        ],
        [
          "archetype is a type of character found in many cultures' stories, not the main character of this one work",
          "archetype 是许多文化的故事里都有的人物类型，不是这部作品的主人公",
        ],
      ],
      spelling: ["pro · tag · o · nist", "the -ist ending after *protagon-*, not -est", "*protagon-* 后的结尾是 -ist，不是 -est"],
    },
    {
      word: "antagonist",
      forms: ["antagonists"],
      meaning: ["the character or force that works against the main character", "反面人物，与主人公作对的人物或力量"],
      sentences: [
        "In the survival story, the ___ is not a person at all but the freezing mountain.",
        "The ___ spreads lies about the hero until the whole town turns against him.",
        "A good ___ has reasons of his own, so the reader understands him even while hoping he fails.",
      ],
      confusions: ["protagonist", "archetype"],
      clues: [
        "a freezing mountain that stands against the climbers of a survival story",
        "a character who spreads lies about the hero",
        "an opponent of the hero whom readers understand but hope will fail",
      ],
      contrast: [
        "the antagonist works against the hero; the protagonist is the hero",
        "antagonist 与主人公作对；protagonist 就是主人公本人",
      ],
      conflicts: [
        [
          "protagonist is the main character the story follows, not the force or person that works against the hero",
          "protagonist 是故事跟随的主人公，不是与主人公作对的人或力量",
        ],
        [
          "archetype is a type of character shared by many cultures, not the particular opponent of one story's hero",
          "archetype 是许多文化共有的人物类型，不是某个故事里主人公的具体对手",
        ],
      ],
      spelling: ["an · tag · o · nist", "the prefix ant-, not anti-", "前缀是 ant-，不是 anti-"],
    },
    {
      word: "catharsis",
      meaning: [
        "the release of strong feelings, such as pity and fear, that an audience feels at the end of a tragedy",
        "宣泄，悲剧结尾时观众强烈情感（如怜悯和恐惧）的释放",
      ],
      sentences: [
        "After the tragic final scene, many in the audience wept, and they left the theater feeling a strange ___.",
        "The ancient Greeks believed that watching a tragedy gave citizens the ___ that cleansed them of pity and fear.",
        "Writing the story of her grandfather's death gave her a kind of ___; afterward she could talk about him calmly.",
      ],
      confusions: ["epiphany", "ambiguity"],
      clues: [
        "an audience weeping at a tragic final scene and leaving lighter",
        "a tragedy cleansing its watchers of pity and fear",
        "writing about a grandfather's death until she could speak of him calmly",
      ],
      contrast: [
        "catharsis releases strong feelings; an epiphany is a sudden flash of understanding",
        "catharsis 是强烈情感的释放；epiphany 是突然的领悟",
      ],
      conflicts: [
        [
          "epiphany is a sudden moment of understanding, not the release of pent-up feelings like grief, pity and fear",
          "epiphany 是突然的领悟，不是悲伤、怜悯、恐惧等积压情感的释放",
        ],
        [
          "ambiguity is a meaning that stays open to doubt, not a feeling of relief after strong emotion",
          "ambiguity 是意思悬而未决，不是强烈情感过后的释然",
        ],
      ],
      spelling: ["ca · thar · sis", "the th in the middle and the -sis ending", "中间是 th，结尾是 -sis"],
    },
    {
      word: "epiphany",
      forms: ["epiphanies"],
      meaning: ["a sudden moment when a character understands something important", "顿悟，人物突然领悟到重要事情的时刻"],
      sentences: [
        "Standing at his father's grave, the son reaches his ___: he has become the cold man he always feared.",
        "The story turns on a small ___, when the girl realizes her best friend has been lying to protect her.",
        "Halfway up the mountain, he had his ___ and understood that he had climbed only to please others.",
      ],
      confusions: ["catharsis", "ambiguity"],
      clues: [
        "a son at his father's grave suddenly seeing he has become a cold man",
        "a girl suddenly realizing her friend lied to protect her",
        "a climber suddenly understanding he climbed only to please others",
      ],
      contrast: [
        "an epiphany is a sudden understanding; catharsis is a release of feeling",
        "epiphany 是突然想明白；catharsis 是情感的释放",
      ],
      conflicts: [
        [
          "catharsis is a release of strong feelings, not a sudden moment of seeing a hidden truth",
          "catharsis 是强烈情感的释放，不是突然看清隐藏真相的时刻",
        ],
        [
          "ambiguity is a meaning left unclear, the opposite of a moment when something becomes suddenly clear",
          "ambiguity 是意思不明确，恰恰与豁然开朗的时刻相反",
        ],
      ],
      spelling: ["e · piph · a · ny", "the ph that spells the f sound and the -any ending", "/f/ 音写作 ph，结尾是 -any"],
    },
    {
      word: "satire",
      forms: ["satires", "satirical"],
      meaning: [
        "writing that uses humor, irony and exaggeration to mock foolishness or wrongdoing",
        "讽刺作品，用幽默、反讽和夸张嘲弄愚蠢或恶行",
      ],
      sentences: [
        "The novel is a sharp ___ of school life, in which teachers hand out prizes for sitting perfectly still.",
        "Swift's famous ___ suggests a shocking solution to poverty in order to attack the cruelty of the rich.",
        "The comedy show uses ___ to mock politicians who promise everything and deliver nothing.",
      ],
      confusions: ["allegory", "juxtaposition"],
      clues: [
        "a novel that mocks school life with prizes for sitting still",
        "a shocking, exaggerated proposal that attacks the cruelty of the rich",
        "a comedy show mocking politicians who deliver nothing",
      ],
      contrast: [
        "satire mocks with humor and exaggeration; an allegory makes its characters stand for ideas",
        "satire 用幽默和夸张来嘲弄；allegory 让人物代表观念",
      ],
      conflicts: [
        [
          "allegory is a story whose characters stand for ideas, and it need not mock anyone or make anyone laugh",
          "allegory 是人物代表观念的故事，不一定嘲弄谁，也不一定让人发笑",
        ],
        [
          "juxtaposition is placing two opposites side by side, not mocking foolishness through humor and exaggeration",
          "juxtaposition 是把两个对立的事物并排放置，不是用幽默和夸张嘲弄愚蠢",
        ],
      ],
      spelling: ["sat · ire", "the ending -ire, as in *fire*, after a single t", "单写 t，结尾 -ire，同 *fire*"],
    },
    {
      word: "allegory",
      forms: ["allegories", "allegorical"],
      meaning: [
        "a story whose characters and events stand for ideas, often moral or political ones",
        "寓言，人物和事件代表某种观念（常为道德或政治观念）的故事",
      ],
      sentences: [
        "In this medieval ___, a knight named Faith fights a dragon named Despair, and every character stands for an idea.",
        "In the old ___, a traveler named Christian walks toward a heavenly city, and each place he passes stands for a test of faith.",
        "Read as the author's ___, the story of the flood stands for how a society rebuilds its rules after disaster.",
      ],
      confusions: ["satire", "motif"],
      clues: [
        "a knight named Faith fighting a dragon named Despair",
        "a traveler named Christian passing places that each stand for a test of faith",
        "a flood story that stands for a society rebuilding its rules",
      ],
      contrast: [
        "an allegory makes its people and events stand for ideas; satire mocks wrongdoing with humor",
        "allegory 让人物和事件代表观念；satire 用幽默嘲弄恶行",
      ],
      conflicts: [
        [
          "satire mocks foolishness with humor, but a story whose every figure stands for an idea need not be funny or mocking",
          "satire 用幽默嘲弄愚蠢，而每个形象都代表一种观念的故事不一定好笑，也不一定在嘲弄",
        ],
        [
          "motif is one image that repeats in a work, not a whole story in which each character stands for an idea",
          "motif 是作品中反复出现的一个意象，不是每个人物都代表观念的整个故事",
        ],
      ],
      spelling: ["al · le · go · ry", "the double l and the -ory ending", "双写 l，结尾是 -ory"],
    },
  ],
};

const rhetoric: BatchSpec = {
  id: "words-of-rhetoric",
  title: t("Words of Rhetoric", "修辞用词"),
  summary: t(
    "Ten words for talking about persuasion: rhetoric, anecdote, concession, analogy, euphemism, rebuttal, demagogue and more.",
    "十个谈论说服的词：rhetoric、anecdote、concession、analogy、euphemism、rebuttal、demagogue 等。",
  ),
  intro: t(
    "At the school debate, Mei opened with an **anecdote** about her grandmother, made one honest **concession** to the other team, and then delivered a **rebuttal** that took apart every number they had given. These ten words help you describe how people try to persuade, fairly or unfairly, in speeches, debates and writing.",
    "在学校辩论赛上，梅先讲了一个关于她奶奶的小故事（**anecdote**），坦然向对方作了一处让步（**concession**），接着发表反驳（**rebuttal**），把对方给出的每个数字都驳倒了。这十个词帮你描述人们在演讲、辩论和写作中怎样说服别人，无论手段正当与否。",
  ),
  watchOut: {
    meanings: t(
      "A **concession** grants that the other side has a point, while a **rebuttal** answers it and tries to prove it wrong; a debater often makes the first just before the second.",
      "**concession** 是承认对方有道理，**rebuttal** 是回击并试图证明对方错了；辩手常常先让步，紧接着再反驳。",
    ),
    use: t(
      "An **anecdote** is a short true story, but an **analogy** is a comparison of two things; and a **polemic** is a fierce attack, while a **demagogue** is the person who stirs a crowd's fears.",
      "**anecdote** 是简短的真实故事，**analogy** 是把两种事物作比较；**polemic** 是猛烈的抨击文字，**demagogue** 则是煽动群众恐惧的那个人。",
    ),
    spelling: t(
      "**Rebuttal** doubles its t, **euphemism** begins eu- and spells its f sound ph, and **demagogue** ends in -gogue with a silent ue.",
      "**rebuttal** 双写 t；**euphemism** 以 eu- 开头，/f/ 音写作 ph；**demagogue** 结尾是 -gogue，ue 不发音。",
    ),
  },
  domain: ["speeches, debates and persuasion", "演讲、辩论和说服"],
  prerequisites: ["context-clues", "authors-purpose"],
  encompasses: fromClues,
  words: [
    {
      word: "rhetoric",
      forms: ["rhetorical"],
      meaning: [
        "the art of using language to persuade, or language used mainly to impress",
        "修辞，用语言说服人的艺术，或主要为了打动人的言辞",
      ],
      sentences: [
        "Students of ___ in ancient Athens practiced speeches for hours each day.",
        "Voters grew tired of the senator's empty ___ and wanted to know what he would actually do.",
        "She had studied ___ for years, learning to shape every sentence to persuade, and even people who disagreed with her stayed to hear the end.",
      ],
      confusions: ["polemic", "anecdote"],
      clues: [
        "students in ancient Athens practicing speeches for hours",
        "a senator's fine-sounding words that promise no real action",
        "years of learning to shape every sentence to persuade",
      ],
      contrast: [
        "rhetoric is the whole art of persuasive language; a polemic is one fierce attack on an idea or person",
        "rhetoric 是用语言说服的整门艺术；polemic 是对某个观点或人物的一次猛烈抨击",
      ],
      conflicts: [
        [
          "polemic is one fierce attack on an idea or a person, not the general art of persuading with words",
          "polemic 是对观点或人物的一次猛烈抨击，不是用语言说服人的整门艺术",
        ],
        [
          "anecdote is a short story about a real event, not the skill or style of persuasive language",
          "anecdote 是关于真实事件的简短故事，不是说服性语言的技巧或风格",
        ],
      ],
      spelling: ["rhet · o · ric", "the silent h after the r and the -ic ending", "r 后的 h 不发音，结尾是 -ic"],
    },
    {
      word: "anecdote",
      forms: ["anecdotes", "anecdotal"],
      meaning: ["a short, interesting story about a real event or person", "轶事，关于真实事件或人物的简短趣事"],
      sentences: [
        "The speaker opened with a funny ___ about getting lost on her first day at the job.",
        "One ___, the story of a single patient who got better, is not enough to prove that a medicine works.",
        "Grandpa tells the same ___ about meeting the president at every family dinner.",
      ],
      confusions: ["analogy", "rhetoric"],
      clues: [
        "a funny story about getting lost on a first day at work",
        "the story of one patient who got better",
        "a grandfather's story about meeting the president, told at every dinner",
      ],
      contrast: [
        "an anecdote tells a short true story; an analogy compares one thing with another",
        "anecdote 讲一个简短的真实故事；analogy 把一事物与另一事物作比较",
      ],
      conflicts: [
        [
          "analogy is a comparison showing how one thing is like another, not a short story about something that really happened",
          "analogy 是说明两事物相似的比较，不是关于真实发生之事的小故事",
        ],
        [
          "rhetoric is the art of persuasive language, not one short story about a real person or event",
          "rhetoric 是用语言说服的艺术，不是关于真实人物或事件的一个小故事",
        ],
      ],
      spelling: ["an · ec · dote", "the c, not k, and the -dote ending, as in *dote*", "中间写 c 不写 k，结尾 -dote"],
    },
    {
      word: "concession",
      forms: ["concessions"],
      meaning: ["admitting that the other side has a fair point, before answering it", "让步，承认对方有道理之处，然后再回应"],
      sentences: [
        "Before defending the plan, she made a ___ to her opponents, admitting that the new bridge would cost a great deal.",
        "A wise ___, granting that the other side is partly right, shows the audience that you are fair.",
        "His only ___ was to admit that his own plan might take longer than he had promised.",
      ],
      confusions: ["rebuttal", "euphemism"],
      clues: [
        "admitting to opponents that the new bridge would cost a great deal",
        "granting that the other side is partly right",
        "admitting that his own plan might take longer than promised",
      ],
      contrast: [
        "a concession grants the other side a point; a rebuttal tries to prove the other side wrong",
        "concession 承认对方的一点道理；rebuttal 试图证明对方错了",
      ],
      conflicts: [
        [
          "rebuttal is an answer that tries to prove the other side wrong, the opposite of admitting that they have a fair point",
          "rebuttal 是试图证明对方错误的回答，和承认对方有道理恰恰相反",
        ],
        [
          "euphemism is a mild word that hides something harsh, not an honest admission that the other side is partly right",
          "euphemism 是掩盖刺耳事实的温和说法，不是坦白承认对方部分正确",
        ],
      ],
      spelling: ["con · ces · sion", "the c of *con-* followed by the double s of -cession", "*con-* 之后是 c，再接双写 s 的 -cession"],
    },
    {
      word: "analogy",
      forms: ["analogies"],
      meaning: [
        "a comparison that explains one thing by showing how it is like another",
        "类比，通过说明一事物与另一事物的相似之处来解释它",
      ],
      sentences: [
        "The teacher used a simple ___ to explain the heart: it works like a pump that never stops.",
        "Comparing the internet to a highway is an old ___, and it hides how different they are.",
        "His ___ between running a country and running a household fails, because a country can print money.",
      ],
      confusions: ["anecdote", "concession"],
      clues: [
        "explaining the heart as a pump that never stops",
        "comparing the internet to a highway",
        "comparing running a country with running a household",
      ],
      contrast: [
        "an analogy explains by comparing two things; an anecdote tells a short true story",
        "analogy 通过比较两事物来解释；anecdote 讲一个简短的真实故事",
      ],
      conflicts: [
        [
          "anecdote is a short story about a real event, not a comparison showing that one thing is like another",
          "anecdote 是关于真实事件的小故事，不是说明一事物像另一事物的比较",
        ],
        [
          "concession is admitting the other side has a point, not explaining one thing by likening it to another",
          "concession 是承认对方有道理，不是把一事物比作另一事物来解释",
        ],
      ],
      spelling: ["a · nal · o · gy", "the single n and l and the -gy ending, not -jy", "n 和 l 都单写，结尾 -gy，不写 -jy"],
    },
    {
      word: "euphemism",
      forms: ["euphemisms"],
      meaning: [
        "a mild or vague word used in place of one that seems harsh or unpleasant",
        "委婉语，代替刺耳或令人不快的词的温和或含糊说法",
      ],
      sentences: [
        'The company called the firing of two hundred workers a "restructuring," the kind of ___ that made the news sound less painful.',
        '"Passed away" is a gentle ___ for "died."',
        'Calling the war\'s civilian deaths "collateral damage" is the sort of ___ that hides real suffering.',
      ],
      confusions: ["analogy", "concession"],
      clues: [
        "the soft word *restructuring* used for firing two hundred workers",
        "the gentle phrase *passed away* used for *died*",
        "the vague phrase *collateral damage* used for civilian deaths",
      ],
      contrast: [
        "a euphemism swaps a harsh word for a mild one; an analogy compares two things to explain one of them",
        "euphemism 用温和的词替换刺耳的词；analogy 比较两事物来解释其一",
      ],
      conflicts: [
        [
          "analogy explains one thing by comparing it to another, not by putting a soft word in place of a harsh one",
          "analogy 通过与另一事物比较来解释，而不是用温和的词替换刺耳的词",
        ],
        [
          "concession is admitting that opponents have a fair point, not softening an unpleasant fact with a milder word",
          "concession 是承认对手有道理，不是用更温和的词淡化令人不快的事实",
        ],
      ],
      spelling: ["eu · phe · mism", "the eu- beginning said like *you* and the ph for the f sound", "开头 eu- 读作 *you*，/f/ 音写作 ph"],
    },
    {
      word: "inflammatory",
      meaning: ["likely to make people angry or violent", "煽动性的，可能激起愤怒或暴力的"],
      sentences: [
        "The editor refused to print the letter because its ___ language was meant to stir readers to violence.",
        "His ___ speech turned a peaceful crowd into an angry one within minutes.",
        "Posting ___ rumors about a rival school can lead to real fights.",
      ],
      confusions: ["eloquent", "candid"],
      clues: [
        "a letter whose language was meant to stir readers to violence",
        "a speech that turned a peaceful crowd angry within minutes",
        "rumors about a rival school that can lead to real fights",
      ],
      contrast: [
        "inflammatory words stir up anger; candid words are simply honest and direct",
        "inflammatory 的话激起愤怒；candid 的话只是诚实直接",
      ],
      conflicts: [
        [
          "eloquent means speaking clearly and movingly, a skill, not words chosen to stir up anger and violence",
          "eloquent 指说话清楚动人，是一种本领，不是故意挑起愤怒和暴力的话",
        ],
        [
          "candid means honest and direct, and honest words need not set out to make people angry or violent",
          "candid 指诚实直接，诚实的话并不是为了让人愤怒或动粗",
        ],
      ],
      spelling: ["in · flam · ma · to · ry", "the double m, which *inflame* does not have", "双写 m，而 *inflame* 只有一个 m"],
    },
    {
      word: "rebuttal",
      forms: ["rebuttals", "rebut"],
      meaning: ["an answer that tries to prove the other side's argument wrong", "反驳，试图证明对方论点错误的回答"],
      sentences: [
        "In her ___, the debater showed that her opponent's numbers were ten years out of date.",
        "Each team has two minutes for its ___, to answer the other side and show where its argument goes wrong.",
        "His ___ knocked down each of the other team's points in turn, until they had nothing left to say.",
      ],
      confusions: ["concession", "analogy"],
      clues: [
        "a debater showing that her opponent's numbers were out of date",
        "two minutes to answer the other side and show where it goes wrong",
        "knocking down each of the other team's points in turn",
      ],
      contrast: [
        "a rebuttal argues that the other side is wrong; a concession grants that they are partly right",
        "rebuttal 论证对方错了；concession 承认对方部分正确",
      ],
      conflicts: [
        [
          "concession admits that the other side has a fair point, the opposite of an answer that tries to prove them wrong",
          "concession 是承认对方有道理，和试图证明对方错误的回答正相反",
        ],
        [
          "analogy is a comparison between two things, not an answer aimed at disproving an opponent's argument",
          "analogy 是两事物之间的比较，不是针对驳倒对方论点的回答",
        ],
      ],
      spelling: ["re · but · tal", "the double t and the -al ending", "双写 t，结尾是 -al"],
    },
    {
      word: "polemic",
      forms: ["polemics", "polemical"],
      meaning: ["a strong written or spoken attack on an idea or a person", "论战文章，对观点或人物的猛烈抨击"],
      sentences: [
        "Before anyone else had spoken on the matter, she published a fierce ___, without a single joke, attacking the factories that poisoned the river.",
        "Her book is less a history than a ___: in deadly earnest, it launches its own attack on the generals on every page.",
        "His article began as a calm review and turned into a bitter, humorless ___ against modern art.",
      ],
      confusions: ["rebuttal", "satire"],
      clues: [
        "a fierce, joke-free attack published before anyone else had spoken",
        "a book that launches its own earnest attack on the generals",
        "a calm review that turned into a bitter, humorless attack",
      ],
      contrast: [
        "a polemic opens a fierce attack of its own; a rebuttal answers an argument someone else has made",
        "polemic 主动发起猛烈抨击；rebuttal 是回应别人已提出的论点",
      ],
      conflicts: [
        [
          "rebuttal is a reply that answers an argument someone has already made, not an attack that one launches unprompted",
          "rebuttal 是对别人已提出论点的回应，不是主动发起的抨击",
        ],
        [
          "satire attacks through humor and exaggeration, but this attack is earnest and contains no joke",
          "satire 借幽默和夸张来抨击，而这里的抨击严肃认真，毫无玩笑",
        ],
      ],
      spelling: ["po · lem · ic", "the single l and the -ic ending", "单写 l，结尾是 -ic"],
    },
    {
      word: "eloquent",
      forms: ["eloquence", "eloquently"],
      meaning: ["able to speak or write clearly, movingly and well", "雄辩的，能清楚、动人、出色地说话或写作的"],
      sentences: [
        "Even her opponents admitted that the young lawyer was ___, for her clear and moving closing speech left the jury in tears.",
        "The student's ___ letter, so clear and moving that two board members wept, persuaded the board to keep the music program.",
        "He stumbled over his words in conversation but became ___ whenever he stood up to speak about justice, his sentences flowing clear and strong.",
      ],
      confusions: ["inflammatory", "candid"],
      clues: [
        "a lawyer whose clear and moving closing speech left a jury in tears",
        "a letter so clear and moving that board members wept",
        "a man who stumbled over words but spoke in clear, flowing sentences about justice",
      ],
      contrast: [
        "eloquent describes skill in moving, well-made words; candid describes honesty, however plainly put",
        "eloquent 指语言动人、表达出色；candid 指诚实坦率，说得朴素也算",
      ],
      conflicts: [
        [
          "inflammatory means likely to stir anger or violence, not skilled at speaking clearly and movingly",
          "inflammatory 指容易激起愤怒或暴力，不是善于清楚动人地表达",
        ],
        [
          "candid means honest and direct, which says nothing about clear, flowing, moving speech",
          "candid 指诚实直接，并不说明话语清楚流畅、打动人心",
        ],
      ],
      spelling: ["el · o · quent", "the qu and the -ent ending, not -ant", "中间是 qu，结尾 -ent，不写 -ant"],
    },
    {
      word: "demagogue",
      forms: ["demagogues"],
      meaning: [
        "a leader who wins support by stirring people's fears and prejudices rather than by reason",
        "煽动家，靠激起人们的恐惧和偏见而非靠道理赢得支持的领袖",
      ],
      sentences: [
        "At every campaign rally, the ___ blamed every problem on foreigners and promised simple answers to hard questions.",
        "History warns us how quickly the ___, once elected by frightened voters, can turn them against their neighbors.",
        "Rather than explain her plan to the voters, the ___ shouted slogans and pointed at enemies.",
      ],
      confusions: ["polemic", "antagonist"],
      clues: [
        "a candidate at campaign rallies blaming foreigners for every problem",
        "a leader elected by frightened voters who turns them against their neighbors",
        "a politician shouting slogans at voters instead of explaining a plan",
      ],
      contrast: [
        "a demagogue is a real leader who stirs up fear; a polemic is a piece of writing or speech that attacks",
        "demagogue 是煽动恐惧的现实领袖；polemic 是一篇抨击性的文章或讲话",
      ],
      conflicts: [
        [
          "polemic is a written or spoken attack, a piece of text, not a person who campaigns, gets elected and shouts slogans",
          "polemic 是书面或口头的抨击，是一段文字，不是参加竞选、当选、喊口号的人",
        ],
        [
          "antagonist is the character who opposes the hero inside a story, not a real politician stirring up voters",
          "antagonist 是故事里与主人公作对的人物，不是煽动选民的现实政客",
        ],
      ],
      spelling: ["dem · a · gogue", "the -gogue ending with its silent ue", "结尾 -gogue，ue 不发音"],
    },
  ],
};

const theater: BatchSpec = {
  id: "words-of-the-theater",
  title: t("Words of the Theater", "戏剧用词"),
  summary: t(
    "Ten words of plays and the stage: playwright, soliloquy, monologue, aside, chorus, tragedy, hubris, farce, understudy and denouement.",
    "十个关于戏剧和舞台的词：playwright、soliloquy、monologue、aside、chorus、tragedy、hubris、farce、understudy 和 denouement。",
  ),
  intro: t(
    "On the night the lead actor fell ill, his **understudy** stepped in, delivered the king's **soliloquy** alone under one light, and brought the **tragedy** to its last bow without missing a line. These ten words help you talk about who makes a play, how its characters speak, and what kinds of plays there are.",
    "主演生病的那晚，他的替角（**understudy**）临时上场，在一束灯光下独自念完国王的独白（**soliloquy**），一句台词也没漏，把这出悲剧（**tragedy**）演到了最后谢幕。这十个词帮你谈论谁创作了一出戏、剧中人物怎样说话，以及戏剧有哪些种类。",
  ),
  watchOut: {
    meanings: t(
      "A **soliloquy** is spoken by a character alone on stage, a **monologue** is a long speech to other characters, and an **aside** is a quick remark to the audience that the others on stage do not hear.",
      "**soliloquy** 是人物独自在台上说的话，**monologue** 是对台上其他人物的长篇讲话，**aside** 则是对观众说的一句简短旁白，台上其他人听不见。",
    ),
    use: t(
      "The **playwright** writes the play, but the **understudy** learns another actor's part; and a **farce** ends in laughter after wild mix-ups, while a **tragedy** ends in ruin.",
      "**playwright** 是写剧本的人，**understudy** 是学会别人角色的替补演员；**farce** 经过一连串荒唐误会后以笑声收场，**tragedy** 则以毁灭告终。",
    ),
    spelling: t(
      "**Playwright** ends in -wright, the old word for a maker, not -write; **soliloquy** has three o's and ends -quy; and **denouement** keeps the silent e in -ouement.",
      "**playwright** 结尾是 -wright（古词，意为“制作者”），不是 -write；**soliloquy** 有三个 o，结尾 -quy；**denouement** 的 -ouement 中保留不发音的 e。",
    ),
  },
  domain: ["plays and the theater", "戏剧和剧场"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "playwright",
      forms: ["playwrights"],
      meaning: ["a person who writes plays", "剧作家"],
      sentences: [
        "The ___ sat in the back row on opening night, nervously watching how the audience took the lines she had written.",
        "Shakespeare is the most famous ___ in English, but he also acted in his own plays.",
        "The young ___ rewrote the last scene eleven times before the director was satisfied.",
      ],
      confusions: ["understudy", "chorus"],
      clues: [
        "a writer watching how the audience took the lines she wrote",
        "Shakespeare, who wrote plays and also acted in them",
        "a young writer rewriting the last scene eleven times",
      ],
      contrast: [
        "a playwright writes the play; an understudy learns a part in it, ready to replace an actor",
        "playwright 写剧本；understudy 学会其中一个角色，随时准备顶替演员",
      ],
      conflicts: [
        [
          "understudy is an actor who learns someone else's part, not the person who writes the play's lines and scenes",
          "understudy 是学会别人角色的演员，不是写剧本台词和场景的人",
        ],
        [
          "chorus is a group of performers who comment on the action, not the single writer who creates the play",
          "chorus 是评论剧情的一组演员，不是创作剧本的那位作者",
        ],
      ],
      spelling: [
        "play · wright",
        "the -wright ending, an old word for a maker, not *write*",
        "结尾 -wright（古词，“制作者”），不是 *write*",
      ],
    },
    {
      word: "soliloquy",
      forms: ["soliloquies"],
      meaning: ["a speech in which a character alone on stage speaks his or her thoughts aloud", "独白，人物独自在台上说出内心想法的台词"],
      sentences: [
        "Alone on the dark stage, the prince speaks his ___ about whether life is worth living.",
        "Alone in her room, in her long ___, the queen admits to herself the crime she has hidden from everyone.",
        "Because no other character hears the long ___, spoken alone on an empty stage, the audience learns secrets that the others never discover.",
      ],
      confusions: ["monologue", "aside"],
      clues: [
        "a prince alone on a dark stage, thinking aloud about life",
        "a queen alone in her room admitting a crime to herself",
        "a long speech given alone on an empty stage that no other character hears",
      ],
      contrast: [
        "a soliloquy is spoken alone, to oneself; a monologue is a long speech to other characters",
        "soliloquy 是独自一人对自己说；monologue 是对其他人物发表的长篇讲话",
      ],
      conflicts: [
        [
          "monologue is a long speech addressed to other characters who are listening, not thoughts spoken by someone alone",
          "monologue 是对在场其他人物说的长篇讲话，不是独自一人说出的内心想法",
        ],
        [
          "aside is a quick remark to the audience while others stand nearby, not a long speech by a character alone",
          "aside 是旁人在场时对观众说的一句简短话，不是人物独处时的长篇台词",
        ],
      ],
      spelling: ["so · lil · o · quy", "the three o's and the -quy ending", "共有三个 o，结尾是 -quy"],
    },
    {
      word: "monologue",
      forms: ["monologues"],
      meaning: ["a long speech by one character to others on stage", "长篇独白，一个人物对台上其他人发表的长篇讲话"],
      sentences: [
        "The general delivers his long ___ to his soldiers before the battle while they listen in silence.",
        "For her audition, she performed a two-minute ___ in which a mother lectures her three grown children.",
        "The father's angry ___ at the dinner table goes on for a full page, and no one dares to interrupt.",
      ],
      confusions: ["soliloquy", "aside"],
      clues: [
        "a general's long speech to his silent soldiers",
        "a two-minute speech in which a mother lectures her three children",
        "a father's angry page-long speech at the dinner table",
      ],
      contrast: [
        "a monologue is a long speech to listeners on stage; a soliloquy is spoken alone",
        "monologue 是对台上听者的长篇讲话；soliloquy 是独自说的话",
      ],
      conflicts: [
        [
          "soliloquy is spoken by a character alone, but this long speech is aimed at other characters who are listening",
          "soliloquy 是人物独自说的话，而这段长篇讲话是对着在场听着的其他人物说的",
        ],
        [
          "aside is a quick remark meant only for the audience, not a long speech that other characters hear",
          "aside 是只说给观众听的简短一句，不是其他人物都听得到的长篇讲话",
        ],
      ],
      spelling: ["mon · o · logue", "the -logue ending with its silent ue", "结尾 -logue，ue 不发音"],
    },
    {
      word: "aside",
      forms: ["asides"],
      meaning: [
        "a short remark a character makes to the audience that the other characters do not hear",
        "旁白，人物对观众说的、其他人物听不到的简短话语",
      ],
      sentences: [
        "In his quick ___, the servant turns from his master and tells the audience that he knows exactly where the money is hidden.",
        'The villain smiles at his victim, then turns to the crowd and whispers this ___: "Not for long, my friend."',
        "Each short ___, whispered while the others stand nearby, lets the audience in on a joke that the other characters miss.",
      ],
      confusions: ["soliloquy", "monologue"],
      clues: [
        "a servant turning from his master to tell the audience a secret",
        "a villain turning from his victim to whisper to the crowd",
        "short whispers to the audience while other characters stand nearby",
      ],
      contrast: [
        "an aside is a quick word to the audience with others on stage; a soliloquy is a long speech made alone",
        "aside 是旁人在场时对观众说的一句话；soliloquy 是独处时的长篇台词",
      ],
      conflicts: [
        [
          "soliloquy is a long speech by a character alone on stage, not a quick remark made while others stand nearby",
          "soliloquy 是人物独自在台上的长篇台词，不是旁人在场时的一句简短话",
        ],
        [
          "monologue is a long speech that the other characters hear, not a quick remark hidden from them",
          "monologue 是其他人物都听得到的长篇讲话，不是瞒着他们的一句简短话",
        ],
      ],
      spelling: ["a · side", "the single word, not *a side* written apart", "写成一个词，不要分开写成 *a side*"],
    },
    {
      word: "chorus",
      forms: ["choruses"],
      meaning: [
        "in ancient Greek drama, a group of performers who comment together on the action",
        "歌队，古希腊戏剧中一起评论剧情的一组演员",
      ],
      sentences: [
        "In Greek tragedy, the ___ warns the king again and again, but he does not listen.",
        "The ___ of old men steps forward to tell the audience what happened before the play began.",
        "Masked and moving as one, the ___ sang of the city's grief.",
      ],
      confusions: ["playwright", "farce"],
      clues: [
        "a group on the Greek stage warning the king again and again",
        "a group of old men telling the audience what happened before the play",
        "masked performers moving as one and singing of the city's grief",
      ],
      contrast: [
        "a chorus is a group of performers on stage; a playwright is the one person who wrote the play",
        "chorus 是台上的一组演员；playwright 是写剧本的那个人",
      ],
      conflicts: [
        [
          "playwright is the single person who writes a play, not a group of performers speaking together on stage",
          "playwright 是写剧本的那一个人，不是在台上齐声说话的一组演员",
        ],
        [
          "farce is a kind of comedy full of mix-ups, not a group of performers who comment on the action",
          "farce 是充满误会的一种喜剧，不是评论剧情的一组演员",
        ],
      ],
      spelling: ["cho · rus", "the ch said like k and the -us ending", "ch 读 /k/，结尾是 -us"],
    },
    {
      word: "tragedy",
      forms: ["tragedies", "tragic"],
      meaning: ["a serious play in which the main character falls from good fortune to ruin", "悲剧，主人公从顺境走向毁灭的严肃戏剧"],
      sentences: [
        "In a ___, the hero's own choices lead step by step to his destruction.",
        "Audiences cried at the end of the ___, when the young lovers both die.",
        "Unlike a comedy, which ends in a wedding, a ___ often ends in death.",
      ],
      confusions: ["farce", "hubris"],
      clues: [
        "a hero whose own choices lead step by step to his destruction",
        "a play that ends with both young lovers dying",
        "a kind of play that, unlike a comedy, often ends in death",
      ],
      contrast: [
        "a tragedy is a serious play ending in ruin; a farce is a comedy ending in laughter",
        "tragedy 是以毁灭告终的严肃戏剧；farce 是以笑声收场的喜剧",
      ],
      conflicts: [
        [
          "farce is a wild comedy of mix-ups that ends in laughter, not a serious play that ends in ruin and death",
          "farce 是以笑声收场的荒唐误会喜剧，不是以毁灭和死亡告终的严肃戏剧",
        ],
        [
          "hubris is a hero's excessive pride, one cause of a fall, not a kind of play",
          "hubris 是主人公的过度骄傲，是导致失败的原因之一，不是一种戏剧",
        ],
      ],
      spelling: ["trag · e · dy", "the g said like j and the -edy ending, not -idy", "g 读 /dʒ/，结尾 -edy，不写 -idy"],
    },
    {
      word: "hubris",
      meaning: [
        "too much pride, especially the pride that makes a person challenge the gods or fate",
        "狂妄自大，尤指使人挑战神明或命运的过度骄傲",
      ],
      sentences: [
        "The king's ___ made him believe that no prophecy could touch him.",
        "In the myth, the young man's ___ makes him laugh at his father's warning and fly too close to the sun.",
        "The coach's ___ cost them the final; he was so sure of winning that he never studied the other team.",
      ],
      confusions: ["tragedy", "resolve"],
      clues: [
        "a king who believed no prophecy could touch him",
        "a young man who laughed at his father's warning and flew too close to the sun",
        "a coach so sure of winning that he never studied the other team",
      ],
      contrast: [
        "hubris is pride that ignores every warning; resolve is firm determination, which can be wise",
        "hubris 是无视一切警告的狂妄；resolve 是坚定的决心，可以是明智的",
      ],
      conflicts: [
        [
          "tragedy is a kind of serious play, not a quality of a person such as too much pride",
          "tragedy 是一种严肃戏剧，不是人身上的过度骄傲之类的品质",
        ],
        [
          "resolve is firm determination to do something, not the pride that makes a person think himself beyond harm or fate",
          "resolve 是要做某事的坚定决心，不是让人自以为不受伤害、不受命运约束的狂妄",
        ],
      ],
      spelling: ["hu · bris", "the hu- beginning, said like *hue*, and the -is ending", "开头 hu- 读作 *hue*，结尾是 -is"],
    },
    {
      word: "farce",
      forms: ["farces", "farcical"],
      meaning: [
        "a comedy full of wild coincidences, mistaken identities and people hiding behind doors",
        "闹剧，充满离奇巧合、认错人和躲在门后等情节的喜剧",
      ],
      sentences: [
        "The play is a ___ in which three couples hide in the same hotel room without seeing each other.",
        "With slamming doors and twins mistaken for each other, the ___ had the audience laughing for two hours.",
        "The meeting turned into a ___, with everyone laughing, when the speaker's notes blew away and the microphone fell apart.",
      ],
      confusions: ["tragedy", "chorus"],
      clues: [
        "three couples hiding in one hotel room without seeing each other",
        "slamming doors and mistaken twins that kept the audience laughing",
        "a meeting that collapsed into laughter as notes blew away and the microphone fell apart",
      ],
      contrast: [
        "a farce is a comedy of wild mix-ups; a tragedy is a serious play that ends in ruin",
        "farce 是荒唐误会连连的喜剧；tragedy 是以毁灭告终的严肃戏剧",
      ],
      conflicts: [
        [
          "tragedy is a serious play that ends in ruin, not a comedy of mix-ups and laughter",
          "tragedy 是以毁灭告终的严肃戏剧，不是充满误会和笑声的喜剧",
        ],
        [
          "chorus is a group of performers commenting on the action, not a kind of comedy full of wild coincidences",
          "chorus 是评论剧情的一组演员，不是充满离奇巧合的喜剧",
        ],
      ],
      spelling: ["farce", "the ar and the -ce ending, said like s", "中间是 ar，结尾 -ce 读 /s/"],
    },
    {
      word: "understudy",
      forms: ["understudies"],
      meaning: [
        "an actor who learns another actor's part in order to replace them if needed",
        "替角，学会另一名演员角色以便必要时顶替的演员",
      ],
      sentences: [
        "When the lead actor broke his ankle, his ___ played the role for the rest of the month.",
        "Every night the ___ waited backstage, knowing every line but hoping to speak none of them.",
        "She began as the ___ and became a star after one unexpected night on stage.",
      ],
      confusions: ["playwright", "chorus"],
      clues: [
        "an actor who took over the lead role when the star broke his ankle",
        "an actor waiting backstage who knows every line of someone else's part",
        "a stand-in who became a star after one unexpected night",
      ],
      contrast: [
        "an understudy learns someone else's role to step in; a playwright writes the roles",
        "understudy 学会别人的角色以便顶替；playwright 是写这些角色的人",
      ],
      conflicts: [
        [
          "playwright is the person who writes the play, not an actor ready to step into someone else's role",
          "playwright 是写剧本的人，不是随时准备顶替别人角色的演员",
        ],
        [
          "chorus is a group performing together, not one actor who has learned another actor's part",
          "chorus 是一起表演的一组人，不是学会了别人角色的某一名演员",
        ],
      ],
      spelling: ["un · der · stud · y", "the two words *under* and *study* joined as one", "由 *under* 和 *study* 合成一个词"],
    },
    {
      word: "denouement",
      meaning: [
        "the final part of a play or story, after the climax, when everything is explained or settled",
        "结局，高潮之后一切得到解释或解决的最后部分",
      ],
      sentences: [
        "In the ___, the last few pages after the climax, we learn that the missing letter was in the old man's coat all along.",
        "After the duel, the play's ___ takes only five minutes: the survivors bury the dead and the new king is crowned.",
        "In the final scene, the ___ ties up every loose thread, perhaps too neatly.",
      ],
      confusions: ["epiphany", "tragedy"],
      clues: [
        "the last few pages after the climax, where the missing letter is found",
        "five minutes after the duel in which the dead are buried and a king crowned",
        "a final scene that ties up every loose thread",
      ],
      contrast: [
        "the denouement is the closing part of a plot; an epiphany is one character's sudden understanding",
        "denouement 是情节的收尾部分；epiphany 是某个人物突然的领悟",
      ],
      conflicts: [
        [
          "epiphany is a character's sudden moment of understanding, not the last part of a plot where everything is settled",
          "epiphany 是人物突然领悟的时刻，不是一切尘埃落定的情节收尾部分",
        ],
        [
          "tragedy is a whole kind of play, not the closing section that comes after the climax",
          "tragedy 是整整一类戏剧，不是高潮之后的收尾部分",
        ],
      ],
      spelling: ["de · noue · ment", "the French -ouement, with a silent e before -ment", "法语式的 -ouement，-ment 前的 e 不发音"],
    },
  ],
};

const law: BatchSpec = {
  id: "words-of-government-and-law",
  title: t("Words of Government and Law", "政府与法律用词"),
  summary: t(
    "Ten words of how laws are made and judged: constitution, amendment, legislature, judiciary, verdict, jury, petition, suffrage, statute and precedent.",
    "十个关于法律制定和审判的词：constitution、amendment、legislature、judiciary、verdict、jury、petition、suffrage、statute 和 precedent。",
  ),
  intro: t(
    "Ten thousand citizens signed a **petition**, the **legislature** passed a new **statute** to protect the wetlands, and when a company challenged it, the court's ruling became a **precedent** for other states. These ten words help you follow how laws are written, changed and judged.",
    "一万名市民在请愿书（**petition**）上签了名，立法机关（**legislature**）通过了一项保护湿地的新成文法（**statute**）；一家公司对此提出异议，法院的判决又成了其他州的先例（**precedent**）。这十个词帮你看懂法律怎样被制定、修改和裁判。",
  ),
  watchOut: {
    meanings: t(
      "The **legislature** makes the laws, the **judiciary** is the whole system of courts that applies them, and a **jury** is twelve or so citizens who decide the facts of one trial.",
      "**legislature** 制定法律，**judiciary** 是适用法律的整个法院体系，**jury** 则是为某一场审判裁定事实的十来位普通公民。",
    ),
    use: t(
      "A **statute** is one law the legislature passes, but the **constitution** holds the basic rules above every statute; and an **amendment** changes a law, while a **precedent** is an earlier decision that later judges follow.",
      "**statute** 是立法机关通过的一项法律，**constitution** 是凌驾于所有成文法之上的根本规则；**amendment** 是修改法律，**precedent** 是后来的法官会遵循的先前判决。",
    ),
    spelling: t(
      "**Statute** has a t on both sides of the u (stat-ute), unlike **statue**; **judiciary** spells its sh sound ci; and **suffrage** doubles its f.",
      "**statute** 的 u 两边都有 t（stat-ute），和 **statue**（雕像）不同；**judiciary** 中的 /ʃ/ 音写作 ci；**suffrage** 双写 f。",
    ),
  },
  domain: ["government, courts and the law", "政府、法院和法律"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "constitution",
      forms: ["constitutions", "constitutional"],
      meaning: [
        "the set of basic laws that says how a country is governed and what rights its people have",
        "宪法，规定国家如何治理及人民享有何种权利的根本法",
      ],
      sentences: [
        "The new ___ divided power among a president, a parliament and the courts.",
        "No ordinary law may break the basic rules of government written in the country's ___.",
        "The students wrote their own ___ for their club, setting out how leaders would be chosen.",
      ],
      confusions: ["statute", "amendment"],
      clues: [
        "a new set of basic rules dividing power among a president, a parliament and the courts",
        "the basic rules of government that no ordinary law may break",
        "a club's founding rules setting out how leaders are chosen",
      ],
      contrast: [
        "a constitution sets out the basic rules of government; a statute is one ordinary law passed under it",
        "constitution 规定治理的根本规则；statute 是在它之下通过的一项普通法律",
      ],
      conflicts: [
        [
          "statute is one ordinary law passed by a legislature, not the basic set of rules that says how the whole body is governed",
          "statute 是立法机关通过的一项普通法律，不是规定整体如何治理的根本规则",
        ],
        [
          "amendment is a change made to an existing set of rules, not the full set of basic rules itself",
          "amendment 是对已有规则的修改，不是那套根本规则本身",
        ],
      ],
      spelling: ["con · sti · tu · tion", "the -tu- before -tion, not -chu-", "-tion 前是 -tu-，不写 -chu-"],
    },
    {
      word: "amendment",
      forms: ["amendments", "amend", "amended"],
      meaning: ["a formal change or addition to a law or constitution", "修正案，对法律或宪法的正式修改或补充"],
      sentences: [
        "The ___ to the constitution gave women the right to vote.",
        "The council voted down the ___ that would have changed its park rule to close the gates at night.",
        "Changing the constitution is hard, so few proposals for any ___ ever succeed.",
      ],
      confusions: ["statute", "petition"],
      clues: [
        "a formal addition to the constitution that gave women the vote",
        "a proposed change to a park rule that the council voted down",
        "proposals to change the constitution, which seldom succeed",
      ],
      contrast: [
        "an amendment changes an existing law or constitution; a statute is a law in its own right",
        "amendment 是对已有法律或宪法的修改；statute 本身就是一项法律",
      ],
      conflicts: [
        [
          "statute is a whole written law passed by a legislature, not a change or addition made to an existing law or constitution",
          "statute 是立法机关通过的一整项成文法，不是对已有法律或宪法的修改或补充",
        ],
        [
          "petition is a request from citizens asking those in power to act, not a formal change written into the law itself",
          "petition 是公民请求掌权者行动的请愿，不是写进法律本身的正式修改",
        ],
      ],
      spelling: ["a · mend · ment", "the single m after a-, unlike *commend*", "a- 后只有一个 m，不同于 *commend*"],
    },
    {
      word: "legislature",
      forms: ["legislatures", "legislative", "legislators"],
      meaning: ["the elected group of people who make a country's or state's laws", "立法机关，制定国家或州法律的民选机构"],
      sentences: [
        "The state ___ meets every spring to debate new laws.",
        "A bill must pass both houses of the ___ before the governor can sign it.",
        "Citizens wrote to members of the ___, asking them to protect the forest.",
      ],
      confusions: ["judiciary", "jury"],
      clues: [
        "a state body that meets each spring to debate new laws",
        "two houses that must pass a bill before the governor signs it",
        "elected members whom citizens asked to protect the forest",
      ],
      contrast: ["the legislature makes the laws; the judiciary judges cases under them", "legislature 制定法律；judiciary 依法审理案件"],
      conflicts: [
        [
          "judiciary is the system of courts and judges that applies laws, not the elected body that debates and passes them",
          "judiciary 是适用法律的法院和法官体系，不是讨论和通过法律的民选机构",
        ],
        [
          "jury is a group of citizens who decide the facts of one trial, not lawmakers who debate and pass new laws",
          "jury 是裁定某场审判事实的一群公民，不是讨论并通过新法律的立法者",
        ],
      ],
      spelling: ["leg · is · la · ture", "the -ture ending, not -cher", "结尾是 -ture，不写 -cher"],
    },
    {
      word: "judiciary",
      meaning: ["the system of courts and judges of a country", "司法机构，一个国家的法院和法官体系"],
      sentences: [
        "An independent ___, with its courts and judges free from orders, can rule against the government when it breaks the law.",
        "The president may not fire judges, because the ___ is a separate branch.",
        "Reformers argued that the ___ needed more judges to hear cases quickly.",
      ],
      confusions: ["legislature", "jury"],
      clues: [
        "courts and judges free to rule against the government",
        "a separate branch whose judges the president may not fire",
        "a court system that needs more judges to hear cases quickly",
      ],
      contrast: [
        "the judiciary is a country's whole system of courts and judges; a jury serves in a single trial",
        "judiciary 是一国整个法院和法官体系；jury 只在一场审判中履职",
      ],
      conflicts: [
        [
          "legislature is the elected body that makes laws, not the courts and judges that rule on them",
          "legislature 是制定法律的民选机构，不是依法裁判的法院和法官",
        ],
        [
          "jury is a small group of ordinary citizens for one trial, not a country's whole system of courts and judges",
          "jury 是为一场审判选出的一小群普通公民，不是一国整个法院和法官体系",
        ],
      ],
      spelling: ["ju · di · ci · ar · y", "the ci that sounds like sh and the -ary ending", "ci 读 /ʃ/，结尾是 -ary"],
    },
    {
      word: "verdict",
      forms: ["verdicts"],
      meaning: ["the decision of a jury or judge about whether someone is guilty", "裁决，陪审团或法官关于某人是否有罪的决定"],
      sentences: [
        "After three days of discussion, the jury reached a ___ of not guilty.",
        "The whole town waited outside the courthouse to learn whether the ___ would be guilty or not guilty.",
        "The judge read the jury's ___ aloud, guilty on every charge, and the accused man's mother began to cry.",
      ],
      confusions: ["statute", "petition"],
      clues: [
        "a jury's decision of not guilty after three days",
        "the town waiting to learn whether the decision would be guilty or not",
        "a jury's decision of guilty on every charge, read aloud by the judge",
      ],
      contrast: [
        "a verdict decides one case, guilty or not; a statute is a law that applies to everyone",
        "verdict 裁决某一案件有罪与否；statute 是适用于所有人的法律",
      ],
      conflicts: [
        [
          "statute is a written law passed by lawmakers, not the decision of guilty or not guilty reached at the end of a trial",
          "statute 是立法者通过的成文法，不是审判结束时作出的有罪或无罪的决定",
        ],
        [
          "petition is a request that citizens send to those in power, not a court's decision about guilt",
          "petition 是公民递交给掌权者的请求，不是法庭关于是否有罪的决定",
        ],
      ],
      spelling: ["ver · dict", "the -dict ending, as in *dictionary*", "结尾 -dict，同 *dictionary*"],
    },
    {
      word: "jury",
      forms: ["juries", "jurors"],
      meaning: ["a group of ordinary citizens chosen to decide the facts of a trial", "陪审团，被选出来裁定审判事实的普通公民"],
      sentences: [
        "The twelve members of the ___ listened to every witness before deciding.",
        "The lawyer turned to the ___ and asked them to imagine themselves in her client's place.",
        "In some countries, trials are decided by a judge alone, with no ___.",
      ],
      confusions: ["judiciary", "legislature"],
      clues: [
        "twelve citizens listening to every witness before deciding",
        "the people a lawyer asks to imagine themselves in her client's place",
        "the group of citizens missing from trials decided by a judge alone",
      ],
      contrast: [
        "a jury is a dozen or so citizens in one trial; the judiciary is the whole court system",
        "jury 是一场审判中的十来位公民；judiciary 是整个法院体系",
      ],
      conflicts: [
        [
          "judiciary is the whole system of courts and judges, not the small group of citizens who hear one trial",
          "judiciary 是整个法院和法官体系，不是审理某一场案件的一小群公民",
        ],
        [
          "legislature is the elected body that makes laws, not citizens who sit in a courtroom and weigh the evidence",
          "legislature 是制定法律的民选机构，不是坐在法庭里权衡证据的公民",
        ],
      ],
      spelling: ["ju · ry", "the u said like *oo* and the -y ending", "u 读作 *oo*，结尾是 -y"],
    },
    {
      word: "petition",
      forms: ["petitions", "petitioned"],
      meaning: [
        "a written request, often signed by many people, asking those in power to act",
        "请愿书，常由许多人签名、要求掌权者采取行动的书面请求",
      ],
      sentences: [
        "More than five thousand people signed the ___ to save the old library.",
        "The students delivered their ___ to the mayor's office in a cardboard box.",
        "Workers who are unhappy with a law can send their ___, signed by thousands, to the government.",
      ],
      confusions: ["amendment", "verdict"],
      clues: [
        "a request to save the old library signed by five thousand people",
        "a students' written request delivered to the mayor in a cardboard box",
        "a request signed by thousands of workers and sent to the government",
      ],
      contrast: [
        "a petition asks those in power to act; an amendment is the change they might make to a law",
        "petition 是请求掌权者行动；amendment 是他们可能对法律作出的修改",
      ],
      conflicts: [
        [
          "amendment is a formal change written into a law by those in power, not a request signed by ordinary people",
          "amendment 是掌权者写进法律的正式修改，不是普通人签名的请求",
        ],
        [
          "verdict is a court's decision on guilt, not a written request that people sign and deliver",
          "verdict 是法庭关于是否有罪的裁决，不是人们签名后递交的书面请求",
        ],
      ],
      spelling: ["pe · ti · tion", "the single t of *pet-* and the -tion ending", "*pet-* 中单写 t，结尾是 -tion"],
    },
    {
      word: "suffrage",
      meaning: ["the right to vote in public elections", "选举权，在公共选举中投票的权利"],
      sentences: [
        "Women who fought for ___ marched, wrote and went to prison for the right to vote.",
        "Universal ___ means every adult citizen may vote, rich or poor.",
        "New Zealand granted women ___ in 1893, before most other countries.",
      ],
      confusions: ["precedent", "petition"],
      clues: [
        "women marching and going to prison for the right to vote",
        "every adult citizen being allowed to vote, rich or poor",
        "New Zealand giving women the vote in 1893",
      ],
      contrast: [
        "suffrage is the right to vote; a petition is a request that anyone may sign, voter or not",
        "suffrage 是投票的权利；petition 是任何人都能签名的请求，不论有没有选举权",
      ],
      conflicts: [
        [
          "precedent is an earlier decision used as a model, not the right to cast a vote in elections",
          "precedent 是作为范例的先前判决，不是在选举中投票的权利",
        ],
        [
          "petition is a written request to those in power, not the right itself to vote for them",
          "petition 是递给掌权者的书面请求，不是选举他们的权利本身",
        ],
      ],
      spelling: ["suf · frage", "the double f and the -age ending", "双写 f，结尾是 -age"],
    },
    {
      word: "statute",
      forms: ["statutes"],
      meaning: ["a written law passed by a legislature", "成文法，由立法机关通过的书面法律"],
      sentences: [
        "The ___ makes it a crime to sell fireworks to anyone under eighteen.",
        "Judges must apply the ___ that the legislature passed last year, even when they think it is unwise.",
        "An old ___ from 1890 still forbids horses on the main street.",
      ],
      confusions: ["constitution", "verdict"],
      clues: [
        "a law making it a crime to sell fireworks to anyone under eighteen",
        "a law the legislature passed last year that judges must apply",
        "an old law from 1890 that still forbids horses on the main street",
      ],
      contrast: [
        "a statute is one ordinary law on a particular matter; the constitution holds the basic rules of government",
        "statute 是针对具体事务的一项普通法律；constitution 规定治理的根本规则",
      ],
      conflicts: [
        [
          "constitution is the basic set of rules for how a country is governed, not one ordinary law about a single matter such as fireworks or horses",
          "constitution 是国家如何治理的根本规则，不是关于烟花、马匹等单一事务的一项普通法律",
        ],
        [
          "verdict is the decision reached at the end of one trial, not a law that applies to everyone",
          "verdict 是一场审判结束时的裁决，不是适用于所有人的法律",
        ],
      ],
      spelling: ["stat · ute", "the t on both sides of the u, unlike *statue*", "u 的两边都有 t，与 *statue* 不同"],
    },
    {
      word: "precedent",
      forms: ["precedents"],
      meaning: [
        "an earlier decision or event that is used as a rule or example for later ones",
        "先例，作为以后规则或范例的先前判决或事件",
      ],
      sentences: [
        "The judge followed the ___ set by a similar case twenty years earlier.",
        "Letting one student skip the exam would set the ___ that others would expect to follow.",
        "Her victory in court became the ___ for thousands of workers with the same complaint.",
      ],
      confusions: ["amendment", "statute"],
      clues: [
        "a similar case from twenty years earlier that a judge followed",
        "one student skipping an exam, which others would expect to copy",
        "a court victory that thousands of workers with the same complaint could follow",
      ],
      contrast: [
        "a precedent is an earlier decision that later ones follow; a statute is a law written and passed by lawmakers",
        "precedent 是后来者遵循的先前决定；statute 是立法者写成并通过的法律",
      ],
      conflicts: [
        [
          "amendment is a formal change to a law, not an earlier decision or event that later ones copy",
          "amendment 是对法律的正式修改，不是后来者照着做的先前决定或事件",
        ],
        [
          "statute is a law passed by a legislature, not an earlier case or event that serves as an example",
          "statute 是立法机关通过的法律，不是作为范例的先前案件或事件",
        ],
      ],
      spelling: ["prec · e · dent", "the c said like s and the -ent ending", "c 读 /s/，结尾是 -ent"],
    },
  ],
};

const science: BatchSpec = {
  id: "words-of-scientific-inquiry",
  title: t("Words of Scientific Inquiry", "科学探究用词"),
  summary: t(
    "Ten words of how science tests ideas: hypothesis, variable, replicate, empirical, correlation, anomaly, consensus, ethical, placebo and skeptical.",
    "十个关于科学如何检验观点的词：hypothesis、variable、replicate、empirical、correlation、anomaly、consensus、ethical、placebo 和 skeptical。",
  ),
  intro: t(
    "Our class tested the **hypothesis** that light helps seeds sprout, changed only one **variable** at a time, and stayed **skeptical** until a second class could **replicate** our results. These ten words help you describe how scientists test an idea, weigh the evidence and decide what to believe.",
    "我们班检验了“光照有助于种子发芽”这个假设（**hypothesis**），每次只改变一个变量（**variable**），并且一直保持怀疑（**skeptical**），直到另一个班也能重复（**replicate**）出我们的结果。这十个词帮你描述科学家怎样检验一个想法、权衡证据，并决定该相信什么。",
  ),
  watchOut: {
    meanings: t(
      "A **correlation** means two things change together, which does not prove that one causes the other; an **anomaly** is a single result that breaks the pattern.",
      "**correlation** 指两件事一起变化，并不证明其中一件导致另一件；**anomaly** 则是打破规律的个别结果。",
    ),
    use: t(
      "A **hypothesis** is one testable idea, but a **consensus** is the agreement many scientists reach after much testing; and **empirical** means based on observation, while **ethical** means fair to the people involved.",
      "**hypothesis** 是一个可以检验的想法，**consensus** 是众多科学家经过大量检验后达成的一致；**empirical** 指基于观察，**ethical** 指对相关的人公平正当。",
    ),
    spelling: t(
      "**Hypothesis** spells its i sound y and changes -is to -es in the plural, **hypotheses**; **skeptical** uses a k after the s; and **consensus** takes an s, not a c, after con-: con-sen-sus, never concensus.",
      "**hypothesis** 中的 /aɪ/ 音写作 y，复数把 -is 改成 -es：**hypotheses**；**skeptical** 的 s 后接 k；**consensus** 的 con- 之后是 s 而不是 c：con-sen-sus，不写 concensus。",
    ),
  },
  domain: ["experiments and how science reaches its conclusions", "实验以及科学如何得出结论"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "hypothesis",
      forms: ["hypotheses"],
      meaning: ["an idea that can be tested to explain something", "假设，可以检验的、用来解释某事的想法"],
      sentences: [
        "Her ___ was that plants given music would grow faster than plants kept in silence.",
        "The experiment showed that her ___ was wrong, which taught the team something new.",
        "A good ___ makes a prediction that an experiment could prove false.",
      ],
      confusions: ["variable", "consensus"],
      clues: [
        "her idea that plants given music would grow faster",
        "her idea that an experiment proved wrong",
        "an idea whose prediction an experiment could prove false",
      ],
      contrast: [
        "a hypothesis is one person's or team's testable idea; a consensus is what most of a field agrees on",
        "hypothesis 是某人或某团队可检验的想法；consensus 是一个领域大多数人的一致意见",
      ],
      conflicts: [
        [
          "variable is a factor that an experiment changes or measures, not the idea about the result that the experiment tests",
          "variable 是实验中改变或测量的因素，不是实验所要检验的关于结果的想法",
        ],
        [
          "consensus is general agreement among many people, not one idea that a single person or team puts up for testing",
          "consensus 是许多人的普遍一致意见，不是某个人或团队提出来供检验的一个想法",
        ],
      ],
      spelling: ["hy · poth · e · sis", "the y that says *eye* and the th in the middle", "y 读作 *eye*，中间是 th"],
    },
    {
      word: "variable",
      forms: ["variables"],
      meaning: ["a factor in an experiment that can change or be changed", "变量，实验中可以变化或被改变的因素"],
      sentences: [
        "To test the fertilizer fairly, keep every ___ the same except the amount of fertilizer.",
        "Temperature was the only ___ the students changed from one jar to the next.",
        "If you change two things at once, you cannot tell which ___ caused the result.",
      ],
      confusions: ["hypothesis", "placebo"],
      clues: [
        "every factor kept the same except the amount of fertilizer",
        "temperature, the one factor changed from jar to jar",
        "two things changed at once so that the cause cannot be told",
      ],
      contrast: [
        "a variable is a factor that can be changed in a test; a hypothesis is the idea being tested",
        "variable 是检验中可以改变的因素；hypothesis 是被检验的想法",
      ],
      conflicts: [
        [
          "hypothesis is the idea being tested, not a factor such as temperature or fertilizer that is changed or held steady",
          "hypothesis 是被检验的想法，不是温度、肥料这类被改变或保持不变的因素",
        ],
        [
          "placebo is a fake treatment given to patients, not any factor that an experimenter changes or keeps the same",
          "placebo 是给病人的假疗法，不是实验者改变或保持不变的某个因素",
        ],
      ],
      spelling: ["var · i · a · ble", "the -able ending, not -ible", "结尾是 -able，不是 -ible"],
    },
    {
      word: "replicate",
      forms: ["replicated", "replicates", "replication"],
      meaning: ["to repeat an experiment to see whether the same results appear", "重复（实验），看是否得到同样的结果"],
      sentences: [
        "Other labs tried to ___ the surprising result, but none of them could.",
        "A finding that no one can ___ should not be trusted.",
        "The scientists described every step so that anyone could ___ their work.",
      ],
      confusions: ["empirical", "skeptical"],
      clues: [
        "other labs trying and failing to get the same surprising result",
        "a finding that no one else can repeat",
        "every step described so that others can repeat the work",
      ],
      contrast: [
        "to replicate is to repeat an experiment; skeptical describes the doubt that makes people want it repeated",
        "replicate 是重复做实验；skeptical 描述的是让人想要重复验证的那种怀疑",
      ],
      conflicts: [
        [
          "empirical describes evidence based on observation, a quality, not the action of repeating an experiment",
          "empirical 描述基于观察的证据，是一种性质，不是重复实验这个动作",
        ],
        [
          "skeptical describes a doubting attitude, not the action of doing an experiment over again",
          "skeptical 描述怀疑的态度，不是把实验再做一遍的动作",
        ],
      ],
      spelling: ["rep · li · cate", "the single p and the -cate ending", "单写 p，结尾是 -cate"],
    },
    {
      word: "empirical",
      meaning: ["based on observation and experiment rather than on theory alone", "经验的，基于观察和实验而不仅是理论的"],
      sentences: [
        "The claim sounds reasonable, but there is no ___ evidence for it.",
        "Galileo trusted ___ tests, dropping objects and timing them, more than the books of ancient thinkers.",
        "Science is ___, built on what we can observe and measure rather than on what we merely believe.",
      ],
      confusions: ["ethical", "skeptical"],
      clues: [
        "a reasonable-sounding claim with no observed evidence behind it",
        "dropping objects and timing them instead of trusting old books",
        "knowledge built on what we can observe and measure",
      ],
      contrast: [
        "empirical means based on observation; skeptical means doubting until there is evidence",
        "empirical 指基于观察；skeptical 指在有证据之前保持怀疑",
      ],
      conflicts: [
        [
          "ethical means morally right and fair to people, not based on observation and measurement",
          "ethical 指在道德上正当、对人公平，不是基于观察和测量",
        ],
        [
          "skeptical describes a person's doubting attitude, not evidence or knowledge that rests on observation",
          "skeptical 描述人的怀疑态度，不是建立在观察之上的证据或知识",
        ],
      ],
      spelling: ["em · pir · i · cal", "the em- beginning, not im-, and the -ical ending", "开头 em-，不是 im-，结尾是 -ical"],
    },
    {
      word: "correlation",
      forms: ["correlations", "correlated"],
      meaning: ["a connection in which two things tend to change together", "相关性，两件事倾向于一起变化的关联"],
      sentences: [
        "There is a clear ___ between ice cream sales and drownings, but ice cream does not cause drowning; hot weather drives both.",
        "The study found a strong ___ between hours of sleep and test scores.",
        "When two things rise and fall together, that kind of ___ alone cannot prove that one causes the other.",
      ],
      confusions: ["anomaly", "hypothesis"],
      clues: [
        "ice cream sales and drownings rising together in hot weather",
        "hours of sleep and test scores going up together",
        "two things rising and falling together",
      ],
      contrast: [
        "a correlation is a pattern of two things changing together; an anomaly is one result that breaks a pattern",
        "correlation 是两件事一起变化的规律；anomaly 是打破规律的个别结果",
      ],
      conflicts: [
        [
          "anomaly is one result that does not fit the pattern, not a pattern in which two things change together",
          "anomaly 是不符合规律的个别结果，不是两件事一起变化的规律",
        ],
        [
          "hypothesis is an idea proposed for testing, not a link between two things that the data actually show",
          "hypothesis 是提出来待检验的想法，不是数据实际显示的两件事之间的联系",
        ],
      ],
      spelling: ["cor · re · la · tion", "the double r of the prefix cor-", "前缀 cor- 带来双写 r"],
    },
    {
      word: "anomaly",
      forms: ["anomalies"],
      meaning: ["something that does not fit the expected pattern", "异常，不符合预期模式的事物"],
      sentences: [
        "One reading was far higher than all the others, and the team checked whether the ___ came from a broken instrument.",
        "The planet's strange orbit was the ___ that led astronomers to discover another planet pulling on it.",
        "At first the scientists ignored the ___, but it turned out to be the most important result of all.",
      ],
      confusions: ["correlation", "placebo"],
      clues: [
        "one reading far higher than all the others",
        "a planet's strange orbit that did not fit the expected path",
        "an odd result the scientists first ignored",
      ],
      contrast: [
        "an anomaly is one result that breaks the pattern; a correlation is the pattern itself",
        "anomaly 是打破规律的一个结果；correlation 是规律本身",
      ],
      conflicts: [
        [
          "correlation is a pattern of two things changing together, not one odd result that does not fit what was expected",
          "correlation 是两件事一起变化的规律，不是一个不符合预期的反常结果",
        ],
        [
          "placebo is a fake treatment given in a medical test, not an unexpected result that breaks a pattern",
          "placebo 是医学试验中给的假疗法，不是打破规律的意外结果",
        ],
      ],
      spelling: ["a · nom · a · ly", "the single n and m and the -aly ending", "n 和 m 都单写，结尾是 -aly"],
    },
    {
      word: "consensus",
      meaning: ["general agreement among most of the people in a group", "共识，群体中大多数人的普遍一致意见"],
      sentences: [
        "There is a strong ___ among climate scientists that human activity is warming the planet.",
        "The committee argued for hours but never reached a ___.",
        "A scientific ___ forms slowly, as evidence from many studies points the same way.",
      ],
      confusions: ["hypothesis", "correlation"],
      clues: [
        "climate scientists widely agreeing that human activity warms the planet",
        "a committee arguing for hours without agreeing",
        "agreement that forms as many studies point the same way",
      ],
      contrast: [
        "a consensus is agreement among many people; a hypothesis is an idea still waiting to be tested",
        "consensus 是许多人的一致意见；hypothesis 是尚待检验的想法",
      ],
      conflicts: [
        [
          "hypothesis is one testable idea that may still be wrong, not the agreement that most of a group shares",
          "hypothesis 是一个可能出错、尚待检验的想法，不是群体大多数人共有的一致意见",
        ],
        [
          "correlation is a link between two changing things in data, not agreement among the people of a group",
          "correlation 是数据中两件变化事物的联系，不是群体中人们的一致意见",
        ],
      ],
      spelling: ["con · sen · sus", "the s, not c, after con-, so the word holds three s's", "con- 之后是 s 而不是 c，全词共有三个 s"],
    },
    {
      word: "ethical",
      forms: ["ethics", "unethical"],
      meaning: ["morally right and fair, especially in how people are treated", "合乎道德的，尤指对待他人公正正当的"],
      sentences: [
        "It is not ___ to test a new medicine on people without telling them the risks.",
        "The review board must agree that a study is ___, fair and safe for the people in it, before it can begin.",
        "Scientists debate whether it is ___ to change the genes of human embryos.",
      ],
      confusions: ["empirical", "skeptical"],
      clues: [
        "testing a medicine on people without telling them the risks",
        "a study judged fair and safe for the people in it",
        "a debate over whether changing human embryos' genes is right",
      ],
      contrast: [
        "ethical is about what is right and fair to people; empirical is about what can be observed",
        "ethical 关乎对人是否正当公平；empirical 关乎能否被观察到",
      ],
      conflicts: [
        [
          "empirical means based on observation and experiment, not morally right or fair to the people involved",
          "empirical 指基于观察和实验，不是在道德上正当、对相关的人公平",
        ],
        [
          "skeptical means doubting a claim, not treating people in a morally right and fair way",
          "skeptical 指对说法存疑，不是以道德正当、公平的方式对待他人",
        ],
      ],
      spelling: ["eth · i · cal", "the th at the start and the -ical ending", "开头是 th，结尾是 -ical"],
    },
    {
      word: "placebo",
      forms: ["placebos"],
      meaning: [
        "a pill or treatment with no medicine in it, given to compare its effects with a real treatment",
        "安慰剂，不含药物、用于与真实治疗对比的药片或疗法",
      ],
      sentences: [
        "Half the patients took the new drug, and the other half took the ___ made of sugar.",
        "Some people felt better after the ___, simply because they expected to.",
        "Neither the patients nor the doctors knew who had received the ___.",
      ],
      confusions: ["variable", "anomaly"],
      clues: [
        "a sugar pill given to half the patients instead of the new drug",
        "a pill that helped only because people expected it to",
        "a dummy treatment given without patients or doctors knowing who got it",
      ],
      contrast: [
        "a placebo is a dummy treatment given to patients; a variable is any factor changed in a test",
        "placebo 是给病人的假疗法；variable 是检验中被改变的任何因素",
      ],
      conflicts: [
        [
          "variable is a factor that an experiment changes, not a pill or treatment with no medicine in it that patients take",
          "variable 是实验中被改变的因素，不是病人服用的不含药物的药片或疗法",
        ],
        [
          "anomaly is an unexpected result that breaks a pattern, not something patients are given to take",
          "anomaly 是打破规律的意外结果，不是给病人服用的东西",
        ],
      ],
      spelling: ["pla · ce · bo", "the c said like s and the -bo ending", "c 读 /s/，结尾是 -bo"],
    },
    {
      word: "skeptical",
      forms: ["skepticism", "skeptic", "skeptics"],
      meaning: ["doubting a claim until there is good evidence for it", "怀疑的，在有充分证据之前对说法存疑的"],
      sentences: [
        "Good scientists stay ___ of surprising results, even their own.",
        "She was ___ of the advertisement's promise that the cream would make anyone look ten years younger.",
        "The reviewers were ___ because the study had only six participants.",
      ],
      confusions: ["empirical", "ethical"],
      clues: [
        "scientists doubting surprising results, even their own",
        "doubting an advertisement's promise to look ten years younger",
        "reviewers doubting a study with only six participants",
      ],
      contrast: [
        "skeptical describes a person who doubts; empirical describes evidence that comes from observation",
        "skeptical 描述心存怀疑的人；empirical 描述来自观察的证据",
      ],
      conflicts: [
        [
          "empirical describes evidence based on observation, not a person's doubt about a claim",
          "empirical 描述基于观察的证据，不是人对某个说法的怀疑",
        ],
        [
          "ethical means morally right and fair, not doubting a claim until good evidence appears",
          "ethical 指道德上正当公平，不是在有充分证据前对说法存疑",
        ],
      ],
      spelling: ["skep · ti · cal", "the k after the s, not c", "s 后面是 k，不是 c"],
    },
  ],
};

const history: BatchSpec = {
  id: "words-of-modern-history",
  title: t("Words of Modern History", "现代史用词"),
  summary: t(
    "Ten words for the changes of the last two centuries: industrialization, immigration, depression, propaganda, totalitarian, alliance, decolonization, globalization, refugee and revolution.",
    "十个关于近两个世纪变化的词：industrialization、immigration、depression、propaganda、totalitarian、alliance、decolonization、globalization、refugee 和 revolution。",
  ),
  intro: t(
    "My great-grandfather lost his job in the **depression**, crossed the ocean in a wave of **immigration**, and later watched **propaganda** posters go up on every wall when war came. These ten words help you talk about the great changes of the last two centuries, from factories and wars to new nations and a connected world.",
    "我的曾祖父在大萧条（**depression**）中失了业，随着移民（**immigration**）潮漂洋过海；后来战争爆发，他又看着每面墙上都贴满了宣传（**propaganda**）海报。这十个词帮你谈论近两个世纪的巨大变化，从工厂和战争，到新国家的诞生和联系日益紧密的世界。",
  ),
  watchOut: {
    meanings: t(
      "**Industrialization** is one country's change from farms to factories, while **globalization** is the growing web of trade and travel among all countries; the first builds factories, the second moves goods and jobs across borders.",
      "**industrialization** 是一个国家从农业转向工厂的变化，**globalization** 是各国之间日益紧密的贸易和往来网络；前者建起工厂，后者让商品和工作跨越国界流动。",
    ),
    use: t(
      "A **refugee** is a person forced to flee, but **immigration** is the movement of people into a country; and a **revolution** overthrows a government quickly, while **decolonization** is the slower process by which colonies became nations.",
      "**refugee** 指被迫逃离的人，**immigration** 指人们迁入一个国家的过程；**revolution** 迅速推翻政府，**decolonization** 则是殖民地逐步成为国家的较长过程。",
    ),
    spelling: t(
      "**Immigration** doubles its m, **propaganda** has three a's, and **alliance** doubles its l and ends in -ance.",
      "**immigration** 双写 m；**propaganda** 有三个 a；**alliance** 双写 l，结尾是 -ance。",
    ),
  },
  domain: ["the history of the modern world", "现代世界的历史"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "industrialization",
      forms: ["industrial", "industrialized"],
      meaning: [
        "the change from an economy of farms and handwork to one of factories and machines",
        "工业化，从农业和手工经济转变为工厂和机器经济",
      ],
      sentences: [
        "In Britain, ___ drew millions of people from the countryside into crowded factory towns.",
        "With ___ came railways, coal smoke and twelve-hour working days.",
        "Japan's rapid ___ in the late 1800s, as it built factories and railways, turned it into a modern power within a generation.",
      ],
      confusions: ["globalization", "revolution"],
      clues: [
        "millions moving from the countryside into crowded factory towns",
        "railways, coal smoke and twelve-hour working days arriving",
        "a country building factories and railways in the late 1800s",
      ],
      contrast: [
        "industrialization builds factories within a country; globalization links the economies of many countries",
        "industrialization 在一国之内建起工厂；globalization 把许多国家的经济联系在一起",
      ],
      conflicts: [
        [
          "globalization is the linking of many countries through trade and travel, not one country's shift from farms to factories",
          "globalization 是许多国家通过贸易和往来联系起来，不是一个国家从农业转向工厂",
        ],
        [
          "revolution is a sudden overthrow or complete change, often of a government, not the long building of factories, mines and railways",
          "revolution 是突然的推翻或彻底的改变（常指政府），不是长期修建工厂、矿山和铁路",
        ],
      ],
      spelling: ["in · dus · tri · al · i · za · tion", "the z of -ization after *industrial*", "*industrial* 后接 -ization，用的是 z"],
    },
    {
      word: "immigration",
      forms: ["immigrant", "immigrants", "immigrated"],
      meaning: ["coming to live permanently in a foreign country", "移民（入境），来到外国永久居住"],
      sentences: [
        "Waves of ___ brought workers from Ireland, Italy and China to American cities.",
        "The new law limited ___ from some countries and welcomed it from others.",
        "Many of the city's restaurants were opened by families who arrived during the great ___ of the 1900s.",
      ],
      confusions: ["refugee", "decolonization"],
      clues: [
        "workers from Ireland, Italy and China coming to live in American cities",
        "a law limiting newcomers from some countries",
        "families arriving to settle in the city in the 1900s",
      ],
      contrast: [
        "immigration is the movement of people into a country to live; a refugee is one person forced to flee danger",
        "immigration 是人们迁入一国定居的过程；refugee 是被迫逃离危险的某个人",
      ],
      conflicts: [
        [
          "refugee names one person forced to flee danger, not the movement of many people coming to settle in a new country",
          "refugee 指被迫逃离危险的一个人，不是许多人迁来新国家定居的过程",
        ],
        [
          "decolonization is colonies winning independence, not people moving to live in another country",
          "decolonization 是殖民地赢得独立，不是人们迁往别国居住",
        ],
      ],
      spelling: ["im · mi · gra · tion", "the double m of im- plus *migration*", "im- 加 *migration*，因此双写 m"],
    },
    {
      word: "depression",
      forms: ["depressions"],
      meaning: ["a long period when business is very bad and many people have no work", "（经济）萧条，商业极不景气、大量人失业的长时期"],
      sentences: [
        "During the ___ of the 1930s, one worker in four in the United States had no job.",
        "Banks closed, farms failed, and families stood in line for bread throughout the ___.",
        "Leaders feared that a crash on the stock market could start another ___ of closed banks and lost jobs.",
      ],
      confusions: ["revolution", "propaganda"],
      clues: [
        "one American worker in four without a job in the 1930s",
        "banks closing, farms failing and families in bread lines",
        "a stock market crash leading to closed banks and lost jobs",
      ],
      contrast: [
        "a depression is a long stretch of bad business and lost jobs; a revolution is the overthrow of a government",
        "depression 是长期的经济萧条和失业；revolution 是推翻政府",
      ],
      conflicts: [
        [
          "revolution is a sudden overthrow of a government, not years of closed banks, failed farms and lost jobs",
          "revolution 是突然推翻政府，不是多年的银行倒闭、农场破产和失业",
        ],
        [
          "propaganda is one-sided information spread to win support, not a long period of bad business and lost work",
          "propaganda 是为争取支持而散布的片面信息，不是长期的经济萧条和失业",
        ],
      ],
      spelling: ["de · pres · sion", "the double s before -ion", "-ion 前双写 s"],
    },
    {
      word: "propaganda",
      meaning: [
        "information, often false or one-sided, spread to make people support a cause",
        "宣传，为使人们支持某一事业而散布的信息，常常是虚假或片面的",
      ],
      sentences: [
        "Wartime ___ showed the enemy as monsters and every soldier on one's own side as a hero.",
        "The government controlled the radio and filled it with ___.",
        "Learning to spot ___ means asking who made a message and what they want you to do.",
      ],
      confusions: ["alliance", "depression"],
      clues: [
        "wartime posters showing the enemy as monsters and one's own soldiers as heroes",
        "a government filling the radio it controls with one-sided messages",
        "messages whose makers want you to do something",
      ],
      contrast: [
        "propaganda is one-sided information spread to win support; an alliance is an agreement between countries",
        "propaganda 是为争取支持而散布的片面信息；alliance 是国家之间的协定",
      ],
      conflicts: [
        [
          "alliance is an agreement between countries to support each other, not one-sided messages spread to sway people",
          "alliance 是国家间互相支持的协定，不是用来左右人心的片面信息",
        ],
        [
          "depression is a long period of bad business and lost jobs, not messages made to win people over to a cause",
          "depression 是长期的经济萧条和失业，不是为争取人们支持某事业而制造的信息",
        ],
      ],
      spelling: ["prop · a · gan · da", "the three a's and the single p", "共有三个 a，p 单写"],
    },
    {
      word: "totalitarian",
      meaning: ["controlling every part of people's lives and allowing no opposition", "极权的，控制人们生活的方方面面、不允许任何反对的"],
      sentences: [
        "Under ___ rule, the government decides what people read, say and even think.",
        "The ___ regime arrested anyone who criticized its leader.",
        "In the novel's ___ world, cameras watch every room and no one may speak against the leader.",
      ],
      confusions: ["inflammatory", "ethical"],
      clues: [
        "a government deciding what people read, say and even think",
        "a regime arresting anyone who criticized its leader",
        "a world where cameras watch every room and no one may speak against the leader",
      ],
      contrast: [
        "totalitarian describes a government that controls everything; inflammatory describes words that stir up anger",
        "totalitarian 描述控制一切的政府；inflammatory 描述激起愤怒的言辞",
      ],
      conflicts: [
        [
          "inflammatory describes words likely to stir anger or violence, not a government that controls every part of life and allows no opposition",
          "inflammatory 描述可能激起愤怒或暴力的言辞，不是控制生活一切、不容反对的政府",
        ],
        [
          "ethical means morally right and fair to people, the opposite of a government that crushes every critic",
          "ethical 指道德正当、对人公平，与镇压一切批评者的政府恰恰相反",
        ],
      ],
      spelling: ["to · tal · i · tar · i · an", "*total* plus -itarian, with a single l", "*total* 加 -itarian，l 单写"],
    },
    {
      word: "alliance",
      forms: ["alliances", "allies"],
      meaning: ["an agreement between countries to support each other, especially in war", "联盟，国家之间互相支持（尤其在战争中）的协定"],
      sentences: [
        "A web of ___ treaties pulled one country after another into the First World War.",
        "The two nations formed this ___ against their larger neighbor.",
        "After the war, the old ___ broke apart as former friends became rivals.",
      ],
      confusions: ["globalization", "propaganda"],
      clues: [
        "treaties of mutual support that pulled country after country into war",
        "two nations joining together against a larger neighbor",
        "a wartime partnership breaking apart as friends became rivals",
      ],
      contrast: [
        "an alliance is a formal pact between particular countries; globalization is a worldwide web of trade and travel",
        "alliance 是特定国家之间的正式盟约；globalization 是遍及全球的贸易和往来网络",
      ],
      conflicts: [
        [
          "globalization is the worldwide growth of trade and travel, not a pact in which certain countries promise to back each other",
          "globalization 是全球贸易和往来的增长，不是某些国家互相承诺支持的盟约",
        ],
        [
          "propaganda is one-sided information spread to win support, not an agreement between countries",
          "propaganda 是为争取支持而散布的片面信息，不是国家之间的协定",
        ],
      ],
      spelling: ["al · li · ance", "the double l and the -ance ending", "双写 l，结尾是 -ance"],
    },
    {
      word: "decolonization",
      meaning: ["the process by which colonies became independent countries", "去殖民化，殖民地成为独立国家的过程"],
      sentences: [
        "After 1945, ___ created dozens of new nations in Africa and Asia.",
        "India's independence in 1947 was one of the first great steps of ___.",
        "The map of the world changed more during ___ than in any other period of the century, as one colony after another raised its own flag.",
      ],
      confusions: ["immigration", "industrialization"],
      clues: [
        "dozens of new nations appearing in Africa and Asia after 1945",
        "India winning independence in 1947",
        "one colony after another raising its own flag",
      ],
      contrast: [
        "decolonization is colonies becoming free nations; immigration is people moving into a country",
        "decolonization 是殖民地成为自由国家；immigration 是人们迁入一个国家",
      ],
      conflicts: [
        [
          "immigration is people moving to live in a new country, not colonies winning their independence",
          "immigration 是人们迁往新国家居住，不是殖民地赢得独立",
        ],
        [
          "industrialization is the change from farms to factories, not the birth of new nations out of former colonies",
          "industrialization 是从农业转向工厂，不是前殖民地诞生为新国家",
        ],
      ],
      spelling: ["de · col · o · ni · za · tion", "de- plus *colonization*, with z, not s", "de- 加 *colonization*，用 z 不用 s"],
    },
    {
      word: "globalization",
      meaning: [
        "the growing connection of the world's countries through trade, travel and communication",
        "全球化，世界各国通过贸易、旅行和通信日益紧密地联系在一起",
      ],
      sentences: [
        "Thanks to ___, a phone may be designed in one country, built in another and sold in a hundred more.",
        "Critics say ___ has moved factory jobs across borders to wherever wages are lowest.",
        "Container ships and the internet sped up ___ at the end of the twentieth century.",
      ],
      confusions: ["industrialization", "alliance"],
      clues: [
        "a phone designed in one country, built in another and sold in a hundred more",
        "factory jobs moving across borders to wherever wages are lowest",
        "container ships and the internet linking the world faster",
      ],
      contrast: [
        "globalization ties many countries together through trade; industrialization turns one country toward factories",
        "globalization 通过贸易把许多国家连在一起；industrialization 让一个国家转向工厂生产",
      ],
      conflicts: [
        [
          "industrialization is a country's change from farms to factories, not the linking of many countries through trade, travel and communication",
          "industrialization 是一个国家从农业转向工厂，不是许多国家通过贸易、旅行和通信联系起来",
        ],
        [
          "alliance is a pact of support between particular countries, not worldwide connections of trade and communication",
          "alliance 是特定国家之间互相支持的盟约，不是遍及全球的贸易和通信联系",
        ],
      ],
      spelling: ["glob · al · i · za · tion", "*global* plus -ization, with z", "*global* 加 -ization，用 z"],
    },
    {
      word: "refugee",
      forms: ["refugees"],
      meaning: ["a person forced to leave their country because of war, danger or persecution", "难民，因战争、危险或迫害被迫离开祖国的人"],
      sentences: [
        "The ___ crossed the mountains on foot, carrying only what she could hold.",
        "After the war, camps across Europe held millions of people, and each ___ hoped to find a new home.",
        "As a young ___, he arrived with no money and no English, and later became a doctor.",
      ],
      confusions: ["immigration", "decolonization"],
      clues: [
        "a woman fleeing across the mountains on foot with only what she could carry",
        "people in camps across Europe after the war, hoping for a new home",
        "a young man who fled with no money and no English",
      ],
      contrast: [
        "a refugee is a person forced to flee; immigration is the general movement of people into a country",
        "refugee 是被迫逃离的人；immigration 是人们迁入一国的总体过程",
      ],
      conflicts: [
        [
          "immigration is the movement of people into a country, a process, not one person who was forced to flee danger",
          "immigration 是人们迁入一国的过程，不是被迫逃离危险的某一个人",
        ],
        [
          "decolonization is the process of colonies becoming nations, not a person driven from home by war or danger",
          "decolonization 是殖民地成为国家的过程，不是因战争或危险被迫离家的人",
        ],
      ],
      spelling: ["ref · u · gee", "the double e of the -gee ending", "结尾 -gee 中双写 e"],
    },
    {
      word: "revolution",
      forms: ["revolutions", "revolutionary", "revolutionaries"],
      meaning: ["a sudden, complete change, especially the overthrow of a government by its people", "革命，彻底的突变，尤指人民推翻政府"],
      sentences: [
        "The ___ of 1917 ended the rule of the tsars in Russia.",
        "The printing press began a ___ in how ideas spread.",
        "Crowds filled the square, and within a week the ___ had swept the old government away.",
      ],
      confusions: ["depression", "decolonization"],
      clues: [
        "the events of 1917 that ended the rule of the tsars",
        "the printing press completely changing how ideas spread",
        "crowds in the square sweeping a government away within a week",
      ],
      contrast: [
        "a revolution is a sudden, complete change such as a government's overthrow; decolonization is colonies slowly winning freedom from rulers abroad",
        "revolution 是突然的彻底改变，如推翻政府；decolonization 是殖民地逐步摆脱外国统治",
      ],
      conflicts: [
        [
          "depression is a long period of bad business and lost jobs, not a sudden, complete change such as the overthrow of rulers",
          "depression 是长期的经济萧条和失业，不是推翻统治者那样突然的彻底改变",
        ],
        [
          "decolonization is colonies gaining freedom from foreign rulers, not a sudden, complete change from within such as crowds overthrowing their own rulers or a new way of spreading ideas",
          "decolonization 是殖民地摆脱外国统治，不是民众推翻本国统治者或传播思想方式剧变那样来自内部的彻底改变",
        ],
      ],
      spelling: ["rev · o · lu · tion", "the -lu- before -tion and the single v", "-tion 前是 -lu-，v 单写"],
    },
  ],
};

const poetic: BatchSpec = {
  id: "words-for-poetic-form",
  title: t("Words for Poetic Form", "诗歌形式用词"),
  summary: t(
    "Ten words for the shapes of poems: stanza, couplet, sonnet, ballad, haiku, ode, elegy, meter, refrain and enjambment.",
    "十个描述诗歌形式的词：stanza、couplet、sonnet、ballad、haiku、ode、elegy、meter、refrain 和 enjambment。",
  ),
  intro: t(
    "For the poetry evening, Leo wrote a **sonnet** that ends in a rhyming **couplet**, and his sister sang an old **ballad** whose **refrain** the whole room joined in. These ten words help you name the shapes of poems, from the way lines are grouped to the patterns of rhythm and repetition.",
    "诗歌晚会上，利奥写了一首十四行诗（**sonnet**），结尾是一组押韵的对句（**couplet**）；他的妹妹唱了一首古老的叙事歌谣（**ballad**），满屋子的人都跟着唱起了叠句（**refrain**）。这十个词帮你说出诗歌的各种形式，从诗行如何分组，到节奏和重复的规律。",
  ),
  watchOut: {
    meanings: t(
      "An **ode** praises its subject, while an **elegy** mourns someone who has died; both are serious, but one celebrates and the other grieves.",
      "**ode** 赞美所写的对象，**elegy** 哀悼逝去的人；两者都很庄重，但一个是颂扬，一个是悲悼。",
    ),
    use: t(
      "A **stanza** is any group of lines set apart like a paragraph, a **couplet** is just two lines together, and a **refrain** is a line that comes back again and again; and **meter** is a poem's beat, while **enjambment** is a sentence running past the end of a line.",
      "**stanza** 是像段落一样分开的任意一组诗行，**couplet** 只是两行连在一起，**refrain** 是一再重复出现的诗句；**meter** 是诗的节拍，**enjambment** 是句子越过行尾延续下去。",
    ),
    spelling: t(
      "**Couplet** keeps the ou of *couple*, **haiku** ends in a plain u, and **enjambment** puts an m on each side of its silent b: en-jamb-ment.",
      "**couplet** 保留 *couple* 中的 ou；**haiku** 以单个 u 结尾；**enjambment** 中不发音的 b 两边各有一个 m：en-jamb-ment。",
    ),
  },
  domain: ["the forms of poetry", "诗歌的形式"],
  prerequisites: ["context-clues", "sound-devices"],
  encompasses: fromClues,
  words: [
    {
      word: "stanza",
      forms: ["stanzas"],
      meaning: ["a group of lines in a poem, set apart like a paragraph", "诗节，诗中像段落一样分开的一组诗行"],
      sentences: [
        "Each ___ of the poem has four lines and describes a different season.",
        "The poem's third ___, a block of eight lines set apart from the rest, describes the storm.",
        "The poet uses a blank line between each ___, the way a writer of prose begins a new paragraph.",
      ],
      confusions: ["couplet", "refrain"],
      clues: [
        "groups of four lines, each about a different season",
        "a block of eight lines set apart from the rest of the poem",
        "groups of lines separated by blank lines like paragraphs",
      ],
      contrast: [
        "a stanza is a group of lines of any length; a couplet is exactly two lines",
        "stanza 是任意行数的一组诗行；couplet 恰好是两行",
      ],
      conflicts: [
        [
          "couplet is exactly two lines together, not a group of four, eight or more lines set apart like a paragraph",
          "couplet 恰好是两行连在一起，不是像段落一样分开的四行、八行或更多行",
        ],
        [
          "refrain is a line that is repeated through a poem, not a block of lines set apart like a paragraph",
          "refrain 是在诗中反复出现的诗句，不是像段落一样分开的一组诗行",
        ],
      ],
      spelling: ["stan · za", "the z and the plain -a ending", "中间是 z，结尾是单个 a"],
    },
    {
      word: "couplet",
      forms: ["couplets"],
      meaning: ["two lines of poetry together, usually rhyming", "对句，两行连在一起的诗，通常押韵"],
      sentences: [
        "The sonnet closes with two rhyming lines, a ___ that sums up its argument.",
        '"The day is done, the sun has set; / The work is long, unfinished yet" is a rhyming ___ that appears only once, in the middle of a long stanza.',
        "The whole poem is written in rhyming pairs, one ___ after another.",
      ],
      confusions: ["stanza", "refrain"],
      clues: [
        "two rhyming lines that close a sonnet",
        "two rhyming lines that appear only once inside a long stanza",
        "a poem written in rhyming pairs of lines",
      ],
      contrast: [
        "a couplet is a pair of lines; a refrain is a line repeated again and again",
        "couplet 是一对诗行；refrain 是一再重复的诗句",
      ],
      conflicts: [
        [
          "stanza is a whole group of lines set apart like a paragraph, not a pair of two rhyming lines",
          "stanza 是像段落一样分开的一整组诗行，不是一对押韵的两行",
        ],
        [
          "refrain is a line repeated again and again through a poem, not a pair of rhyming lines",
          "refrain 是在诗中一再重复的诗句，不是一对押韵的诗行",
        ],
      ],
      spelling: ["cou · plet", "the ou of *couple* kept before -let", "保留 *couple* 中的 ou，再加 -let"],
    },
    {
      word: "sonnet",
      forms: ["sonnets"],
      meaning: ["a poem of fourteen lines with a set pattern of rhyme", "十四行诗，有固定押韵格式的十四行诗"],
      sentences: [
        "Of all Shakespeare's fourteen-line poems about time, this ___ is the most famous.",
        "Her ___ fits a whole love story into just fourteen lines.",
        "In an Italian ___, the first eight lines raise a question and the last six answer it.",
      ],
      confusions: ["ode", "ballad"],
      clues: [
        "the most famous of Shakespeare's fourteen-line poems about time",
        "a whole love story fitted into fourteen lines",
        "eight lines that raise a question and six that answer it",
      ],
      contrast: [
        "a sonnet is defined by its fourteen lines and rhyme pattern; an ode is defined by praising its subject",
        "sonnet 由十四行和押韵格式来界定；ode 由赞美对象来界定",
      ],
      conflicts: [
        [
          "ode is a poem of praise with no set length, not a poem held to exactly fourteen lines",
          "ode 是篇幅不固定的颂诗，不是严格限定为十四行的诗",
        ],
        [
          "ballad tells a story in many short stanzas, often with a repeated line, not in a fixed fourteen lines",
          "ballad 用许多短诗节讲故事、常有重复句，不是固定的十四行",
        ],
      ],
      spelling: ["son · net", "the double n and the -et ending", "双写 n，结尾是 -et"],
    },
    {
      word: "ballad",
      forms: ["ballads"],
      meaning: [
        "a poem or song that tells a story in short stanzas, often with a repeated line",
        "叙事歌谣，用短诗节讲述故事、常有重复诗句的诗或歌",
      ],
      sentences: [
        "The old ___ tells the story of a sailor's voyage, storm and shipwreck in twenty short verses.",
        "Folk singers passed the ___ from village to village for three hundred years before anyone wrote it down.",
        "Like most of its kind, the ___ tells a dramatic story with a sad ending.",
      ],
      confusions: ["sonnet", "elegy"],
      clues: [
        "a sailor's voyage, storm and shipwreck told in twenty short verses",
        "a story-song passed from village to village by folk singers",
        "a dramatic story with a sad ending",
      ],
      contrast: [
        "a ballad tells a story in short verses; an elegy mourns a death without telling a tale",
        "ballad 用短诗节讲故事；elegy 哀悼死者，并不讲述故事",
      ],
      conflicts: [
        [
          "sonnet is a poem of exactly fourteen lines, not a story told or sung in many short verses",
          "sonnet 是恰好十四行的诗，不是用许多短诗节讲述或传唱的故事",
        ],
        [
          "elegy is a poem of sorrow for one who has died, not a song that tells a dramatic story from start to end",
          "elegy 是哀悼死者的诗，不是从头到尾讲述一个戏剧性故事的歌",
        ],
      ],
      spelling: ["bal · lad", "the double l and the -ad ending, not -ed", "双写 l，结尾 -ad，不写 -ed"],
    },
    {
      word: "haiku",
      forms: ["haikus"],
      meaning: [
        "a short Japanese form of three lines, often of five, seven and five syllables, about a moment in nature",
        "俳句，日本的短诗形式，三行，常为五、七、五音节，描写自然中的一个瞬间",
      ],
      sentences: [
        "Her ___ captured a frog leaping into an old pond in just three lines.",
        "Basho, the great master of the ___, traveled across Japan on foot.",
        "Writing each ___, with only seventeen syllables in three lines, teaches you to choose every syllable with care.",
      ],
      confusions: ["couplet", "ode"],
      clues: [
        "a frog leaping into an old pond, caught in three lines",
        "Basho, the Japanese master of three-line poems",
        "three lines holding only seventeen syllables",
      ],
      contrast: [
        "a haiku is a three-line Japanese poem about a moment in nature; a couplet is two lines, usually rhyming",
        "haiku 是描写自然瞬间的三行日本短诗；couplet 是两行，通常押韵",
      ],
      conflicts: [
        [
          "couplet is a pair of two lines, usually rhyming, not a three-line Japanese poem",
          "couplet 是两行一组、通常押韵，不是三行的日本短诗",
        ],
        [
          "ode is a long, serious poem of praise, not a tiny three-line Japanese poem about one moment",
          "ode 是篇幅较长、庄重的颂诗，不是描写一个瞬间的三行日本小诗",
        ],
      ],
      spelling: ["hai · ku", "the ai said like *eye* and the plain -ku ending", "ai 读作 *eye*，结尾是 -ku"],
    },
    {
      word: "ode",
      forms: ["odes"],
      meaning: ["a serious poem that praises or speaks to a person, thing or idea", "颂歌，赞美或向某人、某物或某观念致辞的庄重诗歌"],
      sentences: [
        "Keats wrote his long ___ to a nightingale, praising its song as something that never dies.",
        "In short, unrhymed lines, Pablo Neruda wrote a playful ___ to his socks, praising them as if they were treasures.",
        "In long, rolling lines, the poem is the poet's ___ to the city, celebrating its bridges, markets and crowded trains.",
      ],
      confusions: ["elegy", "sonnet"],
      clues: [
        "a long poem praising a nightingale's song",
        "unrhymed lines praising a pair of socks as treasures",
        "long, rolling lines celebrating a city's bridges and markets",
      ],
      contrast: ["an ode praises; an elegy mourns", "ode 用来赞美；elegy 用来哀悼"],
      conflicts: [
        [
          "elegy is a poem of sorrow for someone who has died, not a poem that praises and celebrates its subject",
          "elegy 是哀悼逝者的悲伤之诗，不是赞美、颂扬对象的诗",
        ],
        [
          "sonnet is held to fourteen lines with a set rhyme, but this poem of praise follows no such fixed form",
          "sonnet 限定十四行并有固定韵式，而这首颂诗并不遵循这种固定形式",
        ],
      ],
      spelling: ["ode", "the silent e at the end that makes the o long", "结尾的 e 不发音，让 o 读长音"],
    },
    {
      word: "elegy",
      forms: ["elegies"],
      meaning: ["a poem of sorrow for someone who has died", "挽歌，哀悼死者的诗"],
      sentences: [
        "He wrote this ___ for his grandmother and read it aloud at her funeral.",
        "The ___ moves from grief to a quiet acceptance in its final lines.",
        "Thomas Gray's famous ___ mourns the forgotten poor buried in a country churchyard.",
      ],
      confusions: ["ode", "ballad"],
      clues: [
        "a poem read aloud at a grandmother's funeral",
        "a poem moving from grief to quiet acceptance",
        "a poem mourning the forgotten poor in a country churchyard",
      ],
      contrast: ["an elegy grieves for the dead; an ode celebrates and praises", "elegy 哀悼死者；ode 颂扬赞美"],
      conflicts: [
        [
          "ode is a poem that praises and celebrates, not one that grieves for someone who has died",
          "ode 是赞美颂扬的诗，不是哀悼逝者的诗",
        ],
        [
          "ballad tells a dramatic story in short verses, not a poem whose purpose is to mourn the dead",
          "ballad 用短诗节讲述戏剧性的故事，不是以哀悼死者为目的的诗",
        ],
      ],
      spelling: ["el · e · gy", "the single l and the -gy ending, not -jy", "单写 l，结尾 -gy，不写 -jy"],
    },
    {
      word: "meter",
      forms: ["meters", "metrical"],
      meaning: ["the regular pattern of stressed and unstressed syllables in a line of poetry", "格律，诗行中重读与非重读音节的规律模式"],
      sentences: [
        "The ___ of the poem is so steady that it sounds like a horse's hooves.",
        "Most of Shakespeare's lines follow the same ___: ten syllables, with every second one stressed.",
        "Free verse has no fixed ___; its lines follow the rhythms of speech.",
      ],
      confusions: ["enjambment", "refrain"],
      clues: [
        "a beat so steady it sounds like a horse's hooves",
        "ten syllables with every second one stressed",
        "the fixed beat that free verse gives up for the rhythms of speech",
      ],
      contrast: [
        "meter is the steady beat of stressed and unstressed syllables; enjambment is a sentence running past a line's end",
        "meter 是重读与非重读音节的稳定节拍；enjambment 是句子越过行尾延续",
      ],
      conflicts: [
        [
          "enjambment is a sentence running on past the end of a line, not the regular beat of stressed and unstressed syllables",
          "enjambment 是句子越过行尾继续，不是重读与非重读音节的规律节拍",
        ],
        [
          "refrain is a line repeated through a poem, not the pattern of stresses inside each line",
          "refrain 是在诗中重复出现的诗句，不是每行内部的重音模式",
        ],
      ],
      spelling: ["me · ter", "the American -er ending; British English writes *metre*", "美式结尾 -er；英式写作 *metre*"],
    },
    {
      word: "refrain",
      forms: ["refrains"],
      meaning: ["a line or group of lines repeated through a poem or song", "叠句，在诗或歌中反复出现的诗行"],
      sentences: [
        'The ___ "and still the river runs" returns at the end of every stanza.',
        "By the last verse, the whole audience was singing the ___ along with her.",
        "Each time the ___ comes back, its meaning grows darker.",
      ],
      confusions: ["stanza", "meter"],
      clues: [
        "a line that returns at the end of every stanza",
        "a repeated part that the audience sang along with by the last verse",
        "a line that keeps coming back, darker each time",
      ],
      contrast: [
        "a refrain is a line that keeps coming back; a stanza is a group of lines that appears once",
        "refrain 是反复回来的诗句；stanza 是只出现一次的一组诗行",
      ],
      conflicts: [
        [
          "stanza is a group of lines set apart like a paragraph, each one new, not a line that returns again and again",
          "stanza 是像段落一样分开、每节内容都不同的一组诗行，不是一再回来的诗句",
        ],
        [
          "meter is the beat of stressed and unstressed syllables, not words that are repeated through a poem or song",
          "meter 是重读与非重读音节的节拍，不是在诗或歌中重复的词句",
        ],
      ],
      spelling: ["re · frain", "the ai spelling of the long a sound", "长音 /eɪ/ 写作 ai"],
    },
    {
      word: "enjambment",
      meaning: ["running a sentence from one line of poetry onto the next without a pause", "跨行，句子从一行诗延续到下一行而不停顿"],
      sentences: [
        "The poet's ___ pulls the reader quickly from one line into the next, the way the river pulls the boat.",
        'Through ___, the sentence "I could not / stop" breaks across two lines, and the break itself becomes a pause of fear.',
        "Notice the ___ here: the line ends in the middle of a thought, so we must read on to find out what happened.",
      ],
      confusions: ["meter", "couplet"],
      clues: [
        "a sentence pulling the reader from one line straight into the next",
        "the sentence *I could not / stop* breaking across two lines",
        "a line ending in the middle of a thought so that we must read on",
      ],
      contrast: [
        "enjambment carries a sentence over a line break; meter is the beat inside each line",
        "enjambment 让句子跨过换行处；meter 是每行内部的节拍",
      ],
      conflicts: [
        [
          "meter is the regular beat of stressed and unstressed syllables, not a sentence that runs past the end of a line",
          "meter 是重读与非重读音节的规律节拍，不是越过行尾的句子",
        ],
        [
          "couplet is a pair of lines, usually rhyming, not the way a sentence runs from one line onto the next",
          "couplet 是一对通常押韵的诗行，不是句子从一行延续到下一行的写法",
        ],
      ],
      spelling: ["en · jamb · ment", "the silent b of *jamb* before -ment", "*jamb* 中不发音的 b，后接 -ment"],
    },
  ],
};

const reflection: BatchSpec = {
  id: "words-for-reflection",
  title: t("Words for Reflection", "反思用词"),
  summary: t(
    "Ten words for writing about one's own experience: introspective, poignant, candid, ambivalent, formative, resolve, vulnerable, perseverance, gratitude and aspiration.",
    "十个书写个人经历的词：introspective、poignant、candid、ambivalent、formative、resolve、vulnerable、perseverance、gratitude 和 aspiration。",
  ),
  intro: t(
    "In her college essay, Ana wrote a **candid** account of failing her driving test three times, explained how **perseverance** finally got her a license, and ended with **gratitude** to the patient uncle who rode beside her. These ten words help you write honestly about your own experiences, feelings and growth.",
    "在大学申请文书里，安娜坦率地（**candid**）讲述了自己三次驾照考试失败的经历，说明是毅力（**perseverance**）最终让她拿到驾照，最后向一直耐心坐在她身旁的叔叔表达了感激（**gratitude**）。这十个词帮你真诚地书写自己的经历、感受和成长。",
  ),
  watchOut: {
    meanings: t(
      "**Resolve** is the firm decision to do something, while **perseverance** is keeping at it through failure after failure; you can have resolve on the first day, but perseverance shows only over time.",
      "**resolve** 是要做某事的坚定决心，**perseverance** 是一次次失败后仍坚持下去；决心第一天就可以有，毅力却要靠时间才能看出来。",
    ),
    use: t(
      "**Candid** means honest about uncomfortable things, but **introspective** means looking inward at one's own thoughts; and **ambivalent** means torn between opposite feelings, while **vulnerable** means easily hurt.",
      "**candid** 指对令人不快的事也诚实坦白，**introspective** 指审视自己的内心；**ambivalent** 指在相反的感情之间摇摆，**vulnerable** 指容易受伤。",
    ),
    spelling: t(
      "**Poignant** has a silent g, **perseverance** keeps the e of *persevere* before -ance, and **vulnerable** ends in -able with the l right after the u: vul-ner-a-ble.",
      "**poignant** 中的 g 不发音；**perseverance** 在 -ance 前保留 *persevere* 的 e；**vulnerable** 结尾是 -able，u 后紧跟 l：vul-ner-a-ble。",
    ),
  },
  domain: ["one's own experience and growth", "个人的经历与成长"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "introspective",
      meaning: ["tending to look inward and think about one's own thoughts and feelings", "内省的，倾向于审视自己的想法和感受的"],
      sentences: [
        "After the accident, he became quiet and ___, spending long evenings thinking about what mattered to him.",
        "Her diary is ___, turning again and again to her own thoughts and feelings rather than to the events of her day.",
        "The essay is ___, asking again and again why the writer acted as she did.",
      ],
      confusions: ["candid", "ambivalent"],
      clues: [
        "long, quiet evenings thinking about what mattered to him",
        "a diary that keeps turning to her own thoughts and feelings",
        "an essay asking again and again why the writer acted as she did",
      ],
      contrast: [
        "introspective means looking inward at oneself; candid means speaking honestly to others",
        "introspective 指向内审视自己；candid 指对别人坦率直言",
      ],
      conflicts: [
        [
          "candid means honest and direct with others, not turned inward to study one's own thoughts and feelings",
          "candid 指对别人诚实直接，不是转向内心审视自己的想法和感受",
        ],
        [
          "ambivalent means having mixed feelings about something, not the habit of examining one's own mind",
          "ambivalent 指对某事感情复杂矛盾，不是审视自己内心的习惯",
        ],
      ],
      spelling: [
        "in · tro · spec · tive",
        "the intro- beginning, not inter-, and the -ive ending",
        "开头 intro-，不是 inter-，结尾是 -ive",
      ],
    },
    {
      word: "poignant",
      meaning: ["causing a sharp feeling of sadness or tenderness", "令人心酸的，引起强烈悲伤或柔情的"],
      sentences: [
        "The most ___ moment of the film is when the old man finds his late wife's handwriting in a cookbook.",
        "Her letter home from the war was short but ___, and her mother cried each time she read it.",
        "It was ___ to see my grandfather's empty chair at the table that first holiday.",
      ],
      confusions: ["vulnerable", "formative"],
      clues: [
        "an old man finding his late wife's handwriting in a cookbook",
        "a short wartime letter that made a mother cry at every reading",
        "a grandfather's empty chair at the first holiday table",
      ],
      contrast: [
        "poignant describes what stirs sadness or tenderness in us; vulnerable describes someone easily hurt",
        "poignant 描述让人心酸或动情的事物；vulnerable 描述容易受伤的人",
      ],
      conflicts: [
        [
          "vulnerable means easily hurt, describing the one who may be harmed, not a moment or object that stirs sadness in those who see it",
          "vulnerable 指容易受伤，描述可能受伤害的人，不是让旁观者心酸的时刻或事物",
        ],
        [
          "formative means shaping how a person grows up, not stirring a sharp feeling of sadness or tenderness",
          "formative 指影响一个人的成长，不是引起强烈的悲伤或柔情",
        ],
      ],
      spelling: ["poi · gnant", "the silent g before the n", "n 前的 g 不发音"],
    },
    {
      word: "candid",
      meaning: ["honest and direct, even about uncomfortable things", "坦率的，即使对令人不快的事也诚实直接的"],
      sentences: [
        "In her ___ interview, the champion admitted that she had nearly quit the sport twice.",
        "I asked my friend for her ___ opinion of my essay, and she told me the ending did not work.",
        "The memoir is ___ about the author's mistakes as a young father, hiding nothing.",
      ],
      confusions: ["introspective", "vulnerable"],
      clues: [
        "a champion openly admitting she nearly quit twice",
        "a friend saying straight out that an essay's ending did not work",
        "a memoir that hides none of a father's mistakes",
      ],
      contrast: [
        "candid means honest and open with others; introspective means looking quietly inward",
        "candid 指对别人诚实坦白；introspective 指安静地向内审视",
      ],
      conflicts: [
        [
          "introspective means looking inward at one's own thoughts, not telling others the plain truth about uncomfortable things",
          "introspective 指审视自己的内心，不是把令人不快的实情直接告诉别人",
        ],
        ["vulnerable means easily hurt, not honest and direct about hard truths", "vulnerable 指容易受伤，不是对难以启齿的事实诚实直接"],
      ],
      spelling: ["can · did", "the two d's, one in each part: can-did", "两个 d 各在一段里：can-did"],
    },
    {
      word: "ambivalent",
      forms: ["ambivalence"],
      meaning: ["having mixed or opposite feelings about something", "矛盾的，对某事怀有复杂或相反感情的"],
      sentences: [
        "I felt ___ about moving: excited by the new city but sad to leave my friends.",
        "She remained ___ about the job offer, since it paid well but meant leaving her family.",
        "Many voters were ___, liking the candidate's ideas but doubting his experience.",
      ],
      confusions: ["introspective", "candid"],
      clues: [
        "being excited by a new city but sad to leave friends",
        "a well-paid job that meant leaving her family",
        "liking a candidate's ideas but doubting his experience",
      ],
      contrast: [
        "ambivalent means pulled between opposite feelings; introspective means looking into one's own mind",
        "ambivalent 指在相反的感情之间拉扯；introspective 指审视自己的内心",
      ],
      conflicts: [
        [
          "introspective means looking inward at one's own thoughts, not feeling two opposite ways about one thing",
          "introspective 指审视自己的想法，不是对同一件事怀有两种相反的感受",
        ],
        [
          "candid means honest and direct, not torn between liking and disliking something",
          "candid 指诚实直接，不是在喜欢与不喜欢之间左右为难",
        ],
      ],
      spelling: ["am · biv · a · lent", "the ambi- beginning and the -ent ending, not -ant", "开头 ambi-，结尾 -ent，不写 -ant"],
    },
    {
      word: "formative",
      meaning: ["having a deep influence on how a person develops", "对人的成长有深远影响的"],
      sentences: [
        "The summers he spent on his uncle's farm were ___ years that shaped his love of the land.",
        "Losing the election in ninth grade was a ___ experience that shaped how she has handled every defeat since.",
        "Her ___ years in a busy household shaped her into someone who can work through any noise.",
      ],
      confusions: ["poignant", "vulnerable"],
      clues: [
        "summers on a farm that shaped his love of the land",
        "a ninth-grade defeat that shaped how she handles every loss",
        "early years in a busy household that shaped how she works",
      ],
      contrast: [
        "formative describes what shapes a person's growth; poignant describes what stirs sadness",
        "formative 描述塑造一个人成长的经历；poignant 描述令人心酸的事物",
      ],
      conflicts: [
        [
          "poignant means stirring a sharp feeling of sadness or tenderness, not shaping the kind of person someone becomes",
          "poignant 指引起强烈的悲伤或柔情，不是塑造一个人成为什么样的人",
        ],
        [
          "vulnerable means easily hurt, not having a deep, lasting influence on how a person develops",
          "vulnerable 指容易受伤，不是对一个人的成长有深远持久的影响",
        ],
      ],
      spelling: ["for · ma · tive", "*form* plus -ative, ending in -ive", "*form* 加 -ative，结尾是 -ive"],
    },
    {
      word: "resolve",
      meaning: ["firm determination to do something", "决心，坚定地要做某事的意志"],
      sentences: [
        "Each failure only hardened her ___; she was more determined than ever to finish the race next year.",
        "His ___ wavered after the third rejection letter, but he made up his mind again and kept writing.",
        "With quiet ___, she decided firmly that she would play at the concert, whatever her nerves said.",
      ],
      confusions: ["perseverance", "aspiration"],
      clues: [
        "failures that made her more determined than ever to finish the race",
        "a writer's determination wavering, then made firm again",
        "a firm, quiet decision to play at the concert despite nerves",
      ],
      contrast: [
        "resolve is a firm decision of the mind; perseverance is the long effort of continuing after failures",
        "resolve 是心里坚定的决定；perseverance 是失败后继续下去的长期努力",
      ],
      conflicts: [
        [
          "perseverance is the long act of continuing to try through difficulty, not the firm decision of the mind that comes before it",
          "perseverance 是在困难中坚持努力的长期行动，不是此前心里作出的坚定决定",
        ],
        [
          "aspiration is a hope or goal for the future, not the firm determination to carry something out",
          "aspiration 是对未来的希望或目标，不是要把事情做成的坚定决心",
        ],
      ],
      spelling: ["re · solve", "the s said like z and the silent e at the end", "s 读 /z/，结尾的 e 不发音"],
    },
    {
      word: "vulnerable",
      forms: ["vulnerability"],
      meaning: ["easily hurt, physically or emotionally", "易受伤害的，在身体或情感上脆弱的"],
      sentences: [
        "Sharing the poem about her father made her feel ___, as if anyone could hurt her, but the class listened with respect.",
        "Newborn turtles are ___ on the long crawl from their nests to the sea.",
        "He hid his fear because he did not want to seem ___ in front of his teammates.",
      ],
      confusions: ["candid", "ambivalent"],
      clues: [
        "sharing a personal poem and feeling that anyone could hurt her",
        "newborn turtles on the dangerous crawl to the sea",
        "hiding fear so as not to seem weak in front of teammates",
      ],
      contrast: ["vulnerable means open to being hurt; candid means openly honest", "vulnerable 指容易受到伤害；candid 指坦率诚实"],
      conflicts: [
        [
          "candid means honest and direct, which says nothing about being easily hurt or in danger",
          "candid 指诚实直接，并不表示容易受伤或身处危险",
        ],
        [
          "ambivalent means having mixed feelings, not being open to harm, either in body or in feeling",
          "ambivalent 指感情复杂矛盾，不是身体或情感上容易受到伤害",
        ],
      ],
      spelling: ["vul · ner · a · ble", "the l right after the u and the -able ending", "u 后紧跟 l，结尾是 -able"],
    },
    {
      word: "perseverance",
      forms: ["persevere", "persevered"],
      meaning: ["continuing to try in spite of difficulty or failure", "毅力，不顾困难或失败而坚持努力"],
      sentences: [
        "It took four years of ___, practicing every day despite many falls, for him to learn to walk again after the injury.",
        "Her ___ paid off when, after twenty tries, the experiment finally worked.",
        "Talent helps, but ___, writing on through every bad day and every failed draft, is what finishes a novel.",
      ],
      confusions: ["resolve", "gratitude"],
      clues: [
        "four years of daily practice despite many falls",
        "twenty tries before an experiment finally worked",
        "writing on through every bad day and failed draft",
      ],
      contrast: [
        "perseverance is continuing to try over a long time; resolve is the firm decision to try",
        "perseverance 是长时间坚持尝试；resolve 是要去尝试的坚定决定",
      ],
      conflicts: [
        [
          "resolve is a firm decision made in the mind, not the long, repeated effort of trying again after every failure",
          "resolve 是心里作出的坚定决定，不是每次失败后一再尝试的长期努力",
        ],
        [
          "gratitude is the feeling of being thankful, not the effort of continuing through difficulty",
          "gratitude 是感激之情，不是在困难中坚持下去的努力",
        ],
      ],
      spelling: ["per · se · ver · ance", "the e kept from *persevere* before -ance", "-ance 前保留 *persevere* 的 e"],
    },
    {
      word: "gratitude",
      meaning: ["the feeling of being thankful", "感激之情"],
      sentences: [
        "She wrote to her old teacher to express her ___ for the hours of extra help.",
        "Full of ___, the family invited the firefighters to dinner.",
        "The essay ends not in sadness but in ___ for the years they had together.",
      ],
      confusions: ["aspiration", "perseverance"],
      clues: [
        "a letter thanking an old teacher for hours of extra help",
        "a family inviting the firefighters to dinner",
        "an essay ending in thanks for the years spent together",
      ],
      contrast: [
        "gratitude looks back with thanks; aspiration looks ahead with hope",
        "gratitude 带着感激回顾过去；aspiration 怀着希望展望未来",
      ],
      conflicts: [
        [
          "aspiration is a hope for the future, not thankfulness for help or good things already received",
          "aspiration 是对未来的希望，不是对已得到的帮助或美好事物的感激",
        ],
        [
          "perseverance is continuing to try despite failure, not a feeling of being thankful",
          "perseverance 是不顾失败坚持努力，不是感激之情",
        ],
      ],
      spelling: ["grat · i · tude", "the -itude ending, not -atude", "结尾是 -itude，不写 -atude"],
    },
    {
      word: "aspiration",
      forms: ["aspirations", "aspire", "aspires"],
      meaning: ["a strong hope or goal for the future", "抱负，对未来强烈的希望或目标"],
      sentences: [
        "Her greatest ___ is to become the first doctor in her family.",
        "Each scholarship winner writes an essay about the ___ she hopes to achieve one day.",
        "As a boy, his only ___, the future he dreamed of every night, was to play in the national orchestra.",
      ],
      confusions: ["gratitude", "resolve"],
      clues: [
        "hoping to become the first doctor in her family",
        "a goal a scholarship winner hopes to achieve one day",
        "a boy's dream of playing in the national orchestra",
      ],
      contrast: [
        "an aspiration is a hope for the future; resolve is the firm will to act now",
        "aspiration 是对未来的希望；resolve 是现在就行动的坚定意志",
      ],
      conflicts: [
        [
          "gratitude is thankfulness for what has already happened, not a hope or goal for the future",
          "gratitude 是对已发生之事的感激，不是对未来的希望或目标",
        ],
        [
          "resolve is firm determination to act, not the hoped-for goal or dream itself",
          "resolve 是要行动的坚定决心，不是所希望的目标或梦想本身",
        ],
      ],
      spelling: ["as · pi · ra · tion", "the single s and single p of *aspire* plus -ation", "*aspire* 的 s 和 p 都单写，再加 -ation"],
    },
  ],
};

const batches: readonly BatchSpec[] = [literary, rhetoric, theater, law, science, history, poetic, reflection];

const pool = wordPool(batches);

/** wordTopics912 are the vocabulary topics of grades 9 to 12. */
export const wordTopics912: readonly TopicDef[] = batches.map((b) => batchTopicWithPool(b, pool));

/** vocabulary912 are the words the batches of grades 9 to 12 teach. */
export const vocabulary912: readonly WordBatch[] = batches.map(batchWords);
