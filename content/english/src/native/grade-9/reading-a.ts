// Grade 9: reading of the first units: the cumulative impact of word choice, how writers manipulate time, the
// conventions of epics, the hero's journey, soliloquies and asides, tragic heroes and how a theme develops.

import type { TopicDef } from "@ga/content";
import { type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const wordChoice = topic("reading", {
  id: "the-cumulative-impact-of-word-choice",
  title: ["The Cumulative Impact of Word Choice", "措辞的累积效果"],
  summary: [
    "How a pattern of words across a passage, all pointing the same way, builds a tone or a feeling that no single word could.",
    "一段文字中指向同一方向的一系列词语，如何营造出单个词无法营造的语气或感受。",
  ],
  intro: [
    "One adjective like *cold* barely registers; pair it with *shuttered*, *hollow*, *barren*, and *silent*, and the whole room chills. Reading for the **cumulative impact of word choice** means tracking how a cluster of words builds a mood, reveals a mindset, or signals a turn.",
    "单一个 *cold* 力量有限；但把它和 *shuttered*、*hollow*、*barren*、*silent* 叠在一起，整间屋子都透出寒意。读懂**措辞的累积效果**，就是追踪一组词语如何叠加出氛围、揭示心态或预示转折。",
  ],
  after: ["word-choice-and-meaning", "tone-and-mood"],
  points: [
    label(
      "the-tone-the-words-build",
      ["The Tone the Words Build", "词语营造的语气"],
      [
        "One word can color a sentence, but a **pattern** of words, all pointing the same way, shapes a whole passage. When a writer describes a house with *sagging*, *peeling*, *cracked* and *forgotten*, no one word says *neglect*, but together they leave no doubt. To find the tone, gather the words that carry feeling and ask what they have in common.\n\n> **Watch out.** Do not pick a tone from a single isolated word—collect *all* the emotionally charged verbs and adjectives across the passage and check what feeling they share.",
        "一个词可以给一句话着色，而一组指向同一方向的词能塑造整段文字。作者用 *sagging*、*peeling*、*cracked* 和 *forgotten* 描写一所房子时，没有哪个词直接说“荒废”，但合在一起就毫无疑问了。要找出语气，就把带有感情色彩的词集中起来，问问它们有什么共同点。\n\n> **注意。** 不要只凭单个词猜语气——把整段里带感情色彩的动词和形容词串在一起，看它们共同指向哪种感受。",
      ],
      ["Which tone do the words of this passage build together?", "这段文字的词语共同营造出什么语气？"],
      `
        The porch sagged; paint peeled from the shutters; a cracked bell hung silent over the forgotten gate.|neglect and decay
        Sunlight spilled across the table; the children's laughter bubbled up; even the kettle seemed to sing.|warmth and joy
        The wind clawed at the windows; somewhere a door banged; shadows crept along the hall.|menace and fear
        He gulped his coffee, grabbed his keys, sprinted for the bus and leapt aboard as the doors hissed shut.|haste and urgency
        The old photographs lay faded in the drawer, the voices in them long silent, the summers they recorded gone.|loss and longing
        The fields lay hushed under snow; the river slept beneath its ice; not a bird stirred in the pines.|stillness and calm
        The crowd roared, banners snapped in the wind, drums thundered and the whole square seemed to shake.|excitement and energy
        The rusted swings creaked; weeds split the empty courts; a torn net hung from a single hook.|neglect and decay
        She hummed as she kneaded the dough; the oven glowed; the smell of cinnamon filled every corner.|warmth and joy
        Footsteps followed him down the alley, quickening when he quickened, stopping when he stopped.|menace and fear
        The clock ticked; the deadline loomed; she typed faster, her fingers stumbling over the keys.|haste and urgency
        He walked past the school he had left forty years before, its windows dark, its playground empty of the friends he had lost.|loss and longing
        The lake lay smooth as glass; a single heron stood motionless; the evening air barely moved.|stillness and calm
        The engines screamed, the flags dropped, and twenty cars surged forward in a blur of color.|excitement and energy
        Dust lay thick on the piano; the curtains hung in rags; mice had nested in the abandoned armchair.|neglect and decay
        Grandmother wrapped him in a quilt, set a bowl of soup before him and stroked his hair until he slept.|warmth and joy
        A low growl came from the dark; the torch flickered; something large shifted in the undergrowth.|menace and fear
        The siren wailed; nurses ran; the doctor shouted orders as the stretcher burst through the doors.|haste and urgency
        Her letters stopped coming; the empty chair stayed at the table; he still set out two cups each morning.|loss and longing
        The library was hushed, the lamps low, the pages turning softly in the drowsy afternoon.|stillness and calm
        Fireworks burst overhead; strangers hugged; music poured from every open window.|excitement and energy
        The factory's broken windows stared at the street; its gates rusted shut; ivy swallowed the sign.|neglect and decay
        The puppy tumbled over its own paws, and the whole family laughed until they cried.|warmth and joy
        The ice groaned beneath them, a thin crack raced toward their feet, and black water welled up.|menace and fear
        Grab the bags, lock the door, run for the train: the last one leaves in four minutes.|haste and urgency
        The tide had washed away their names in the sand, the way time had washed away the summer they were young.|loss and longing
        Mist settled over the valley; the cows dozed; the only sound was the slow drip of the eaves.|stillness and calm
        The final whistle blew, the fans stormed the field and the players were lifted onto shoulders.|excitement and energy
        Grass grew between the railroad ties; the station clock had stopped; no train had come in years.|neglect and decay
        A thin wail rose from the marsh, the lantern died, and cold fingers of fog closed around the boat.|menace and fear
      `,
      {
        "neglect and decay": L(
          "荒废与衰败",
          "Words such as *sagging*, *rusted*, *peeling* and *abandoned* all show a place left to fall apart.\n\n**Check.** List the passage's key adjectives and verbs: every one points to age, damage, and disuse, building **neglect and decay**.",
          "*sagging*、*rusted*、*peeling*、*abandoned* 这样的词都表现一个被弃置、日渐破败的地方。\n\n**检验。** 圈出文段里的核心形容词和动词：它们全都指向陈旧、破损和无人打理，共同营造出**荒废与衰败**。",
          "The words do not show a place left to fall apart.",
          "这些词并没有表现一个被弃置、日渐破败的地方。",
        ),
        "warmth and joy": L(
          "温暖与欢乐",
          "Words of light, laughter and care build a feeling of comfort and happiness.\n\n**Check.** Look at the sensory cues across the passage: bright light, gentle sound, or loving action all work together to create **warmth and joy**.",
          "表示光亮、笑声和关爱的词营造出舒适和快乐的感觉。\n\n**检验。** 看文段里的感官线索：明亮的光线、欢笑声或温柔的照料叠加在一起，营造出**温暖与欢乐**。",
          "The words do not build a feeling of comfort and happiness.",
          "这些词并没有营造出舒适和快乐的感觉。",
        ),
        "menace and fear": L(
          "威胁与恐惧",
          "Words such as *clawed*, *crept*, *growl* and *dark* suggest a hidden danger closing in.\n\n**Check.** Notice how the verbs and sounds turn the environment hostile and stalking—every clue points to **menace and fear**.",
          "*clawed*、*crept*、*growl*、*dark* 这样的词暗示有隐藏的危险正在逼近。\n\n**检验。** 注意动词和声响如何把周围环境写得充满敌意与逼近感——所有线索都指向**威胁与恐惧**。",
          "The words do not suggest a danger closing in.",
          "这些词并没有暗示危险正在逼近。",
        ),
        "haste and urgency": L(
          "匆忙与紧迫",
          "Quick action verbs and short clauses, such as *grabbed*, *sprinted* and *ran*, push the reader forward as if time is running out.\n\n**Check.** Read the pace of the clauses: rapid verbs and ticking-clock details accelerate the rhythm into **haste and urgency**.",
          "*grabbed*、*sprinted*、*ran* 这样快速的动作动词和简短的分句推着读者向前，仿佛时间所剩无几。\n\n**检验。** 感受分句的节奏：密集的快动作动词和分秒必争的细节把气氛推向**匆忙与紧迫**。",
          "The words do not push the reader forward as if time is running out.",
          "这些词并没有推着读者向前，让人感到时间紧迫。",
        ),
        "loss and longing": L(
          "失落与怀念",
          "Words of absence and the past, such as *faded*, *gone*, *empty* and *lost*, express sorrow for something that cannot return.\n\n**Check.** Spot every word of emptiness or vanished time: together they ache for what is missing, creating **loss and longing**.",
          "*faded*、*gone*、*empty*、*lost* 这样表示缺失和过去的词，表达了对一去不返之物的哀伤。\n\n**检验。** 圈出表示空缺和逝去时光的词：它们共同指向对失去之物的追念，即**失落与怀念**。",
          "The words do not express sorrow for something that is gone.",
          "这些词并没有表达对逝去之物的哀伤。",
        ),
        "stillness and calm": L(
          "宁静与平和",
          "Words such as *hushed*, *smooth*, *motionless* and *slept* build a scene where nothing hurries or threatens.\n\n**Check.** Notice what is *absent*—noise, rush, and danger—while every detail slows down into **stillness and calm**.",
          "*hushed*、*smooth*、*motionless*、*slept* 这样的词营造出一个从容而无威胁的场景。\n\n**检验。** 注意文段中没有喧嚣、急促或威胁，所有细节都放慢沉淀为**宁静与平和**。",
          "The words do not build a scene of quiet calm.",
          "这些词并没有营造出宁静平和的场景。",
        ),
        "excitement and energy": L(
          "兴奋与活力",
          "Loud, fast words such as *roared*, *thundered*, *burst* and *surged* fill the scene with excitement.\n\n**Check.** Check the verbs' volume and motion: booming sounds and surging crowds charge the scene with **excitement and energy**.",
          "*roared*、*thundered*、*burst*、*surged* 这样响亮而迅速的词让场景充满兴奋。\n\n**检验。** 看动词的声势和动感：轰鸣的声响与奔涌的人群让画面充满**兴奋与活力**。",
          "The words do not fill the scene with excitement.",
          "这些词并没有让场景充满兴奋。",
        ),
      },
    ),
    label(
      "what-the-pattern-of-words-does",
      ["What the Pattern of Words Does", "词语的模式起什么作用"],
      [
        "A writer repeats a kind of word for a purpose. A pattern can **build a mood** in a setting, so the reader feels the place. It can **reveal a character's state of mind**, when the words that describe the world are really the character's feelings. Or it can **signal a change**, when one set of words gives way to an opposite set and the reader senses a turn in the story. Ask what the words describe and whether they shift.\n\n> **Watch out.** Check two quick clues: if a character's emotion filters how the room or street *seemed* to them, it **reveals a state of mind**; if one word cluster flips to its opposite midway through, it **signals a change**.",
        "作者反复使用某一类词是有目的的。词语的模式可以**营造场景的氛围**，让读者感受到这个地方；可以**揭示人物的心理状态**，这时描写外界的词其实反映了人物的感受；也可以**预示转变**，当一组词让位于一组意思相反的词时，读者会感觉到故事出现了转折。问问这些词描写的是什么，以及它们有没有变化。\n\n> **注意。** 抓两条线索：如果人物的情绪折射出外界“看起来”如何，就是**揭示心理状态**；如果一组词在中途翻转为相反的一组词，就是**预示转变**。",
      ],
      ["What does the pattern of words in this passage mainly do?", "这段文字中词语的模式主要起什么作用？"],
      `
        The marsh was gray, the reeds were gray, the sky pressed low and gray over the silent water.|builds a mood
        To Mara, waiting for the results, the clock seemed to crawl, the room to shrink, the walls to lean in on her.|reveals a state of mind
        All morning the sky had been black and the rain cold; then, as she opened the letter, the clouds broke and sunlight flooded the room.|signals a change
        The desert stretched bare and burning to every horizon, without a tree, without a shadow, without a sound.|builds a mood
        After the argument, every street Tom walked down looked mean and narrow, every face hostile.|reveals a state of mind
        The first chapters are full of words like *bright*, *new* and *open*; in the middle chapters, words like *locked*, *narrow* and *cold* take over.|signals a change
        Moss hung from the oaks, the air was thick and warm, and the bayou moved slowly as syrup.|builds a mood
        To the homesick girl, the city's lights seemed cold, its people strangers, its noise a language she would never learn.|reveals a state of mind
        The war poems begin with *glory*, *banners* and *trumpets*; by the last poem, the words are *mud*, *gas* and *wire*.|signals a change
        The cathedral rose in soaring arches, its windows glowing, its bells ringing out over the square.|builds a mood
        Now that he had won, even the gray drizzle felt fresh and the traffic sounded like music.|reveals a state of mind
        The house is described as *warm* and *full* in the first half; after the father leaves, it becomes *quiet*, *hollow* and *bare*.|signals a change
        The mountain village was snowbound, its chimneys smoking, its lanes empty, its windows glowing amber.|builds a mood
        Guilty about the lie, Ben felt that the portraits on the wall were watching him and the floorboards accusing him.|reveals a state of mind
        For three stanzas the poem speaks of *winter*, *frost* and *sleep*; in the fourth come *thaw*, *green* and *waking*.|signals a change
        Neon buzzed over the wet street; music leaked from doorways; the city hummed with the life of the night.|builds a mood
        In her grief, the garden she had loved seemed to her only a place of dying flowers and bare stalks.|reveals a state of mind
        At first the narrator calls the stranger *odd* and *awkward*; later the same man is *gentle*, *patient* and *kind*.|signals a change
        The old library smelled of dust and leather; its shelves rose into dim heights; its silence was centuries deep.|builds a mood
        To the frightened boy lost in the woods, every branch was a grasping hand and every rustle a footstep.|reveals a state of mind
        The story's opening is full of *chains*, *bars* and *walls*; its closing pages are full of *road*, *sky* and *horizon*.|signals a change
        The harbor at dawn was pink and silver, gulls wheeling, boats rocking gently at their moorings.|builds a mood
        In love for the first time, she found the dull lecture hall glowing and the gray rain charming.|reveals a state of mind
        The early letters are signed *your loving son*; the later ones are signed only with an initial.|signals a change
        The prison yard was bare concrete, high walls, coiled wire and a single square of sky.|builds a mood
        Angry at his brother, Jon thought the music in the next room was harsh, the laughter cruel and the house too small.|reveals a state of mind
        For half the novel the river is *muddy*, *slow* and *choked*; after the dam breaks, it is *clear*, *swift* and *free*.|signals a change
        The ballroom glittered with chandeliers, silk gowns swirled, and a hundred candles danced in the mirrors.|builds a mood
        Ashamed of failing, she saw pity in every glance and heard mockery in every whisper.|reveals a state of mind
        The diary's early entries are full of *plans* and *tomorrow*; its last entries speak only of *waiting* and *if*.|signals a change
      `,
      {
        "builds a mood": L(
          "营造氛围",
          "The words describe the setting itself, and together they make the reader feel what the place is like.\n\n**Check.** Notice that no single character's emotion is filtering the scene and the word cluster stays steady from start to finish—it simply **builds a mood**.",
          "这些词描写的是场景本身，合起来让读者感受到这个地方是什么样子。\n\n**检验。** 注意这段话没有通过特定人物的情绪滤镜来写，词语色彩也前后一致——它纯粹是在**营造氛围**。",
          "The words do more than set the mood of a place: they show a character's feelings or a shift in the story.",
          "这些词不只是营造某个地方的氛围：它们表现了人物的感受或故事的转变。",
        ),
        "reveals a state of mind": L(
          "揭示心理状态",
          "The words describe the world as a character feels it, so they really show that character's state of mind.\n\n**Check.** Look for the character's inner filter coloring the description: the outer scene is shaped by how that person feels, so it **reveals a state of mind**.",
          "这些词描写的是人物感受到的世界，所以实际上表现了人物的心理状态。\n\n**检验。** 留意人物的主观滤镜如何给景物染色：外界景物染上了人物自己的情绪，因此是在**揭示心理状态**。",
          "The words describe the world, not a particular character's feelings about it.",
          "这些词描写的是外界，而不是某个人物对外界的感受。",
        ),
        "signals a change": L(
          "预示转变",
          "One set of words gives way to an opposite set, and the shift tells the reader that something in the story has turned.\n\n**Check.** Compare the opening word cluster with the closing word cluster: they flip to opposite poles, which **signals a change**.",
          "一组词让位于一组意思相反的词，这种变化告诉读者故事出现了转折。\n\n**检验。** 对照开头和结尾的两组词：它们翻转成了截然相反的色彩，明确**预示转变**。",
          "The words keep pointing the same way; there is no shift from one set to an opposite set.",
          "这些词始终指向同一方向，没有从一组词转向意思相反的另一组。",
        ),
      },
    ),
  ],
});

const time = topic("reading", {
  id: "manipulating-time-in-a-story",
  title: ["Manipulating Time in a Story", "故事中对时间的处理"],
  summary: [
    "How writers order events, slow time down and speed it up, and why a story might begin in the middle or move along parallel plots.",
    "作者如何安排事件的顺序、放慢或加快时间，以及为什么故事会从中间开始或沿着平行的情节展开。",
  ],
  intro: [
    "A story can leap over twenty silent winters in four words—or stretch a falling glass across an entire paragraph. Watching how writers reorder events (*in medias res*, flashbacks, parallel plots, frame stories) and control pacing shows why certain moments carry weight.",
    "故事可以用短短几个字跨过二十个冬天，也可以把一只坠落的玻璃杯拉长成一整段。观察作者如何打乱时间顺序（从中间开始、倒叙、平行情节、框架故事）并调控节奏，就能明白为何某些瞬间格外有分量。",
  ],
  after: ["foreshadowing-and-flashback", "pacing-a-story"],
  points: [
    label(
      "how-the-story-orders-time",
      ["How the Story Orders Time", "故事如何安排时间顺序"],
      [
        "Writers rarely tell events in plain order. A story told **in the middle of things** (*in medias res*) opens with the action already under way and fills in the past later. A **flashback** interrupts the present to show an earlier event. **Parallel plots** move back and forth between two lines of action happening at the same time. A **frame story** wraps one tale inside another, as when a character sits down to tell a story.\n\n> **Watch out.** Do not confuse **in the middle of things** (where the *opening page/scene* drops straight into ongoing action) with a **flashback** (where an established present scene pauses to jump back into memory).",
        "作者很少按普通的先后顺序讲述事件。**从中间开始**（*in medias res*）的故事开头时行动已在进行，过去的事后来再补叙。**倒叙**打断当前的叙述，展示更早发生的事。**平行情节**在同时发生的两条线索之间来回切换。**框架故事**把一个故事套在另一个故事里，比如一个人物坐下来讲故事。\n\n> **注意。** 分清**从中间开始**（作品*开篇*直接切入正在进行的冲突，之后补叙前情）与**倒叙**（在已展开的当下场景中穿插回忆）。",
      ],
      ["How does this story handle time?", "这个故事如何处理时间？"],
      `
        The novel opens with the hero already lost at sea for ten years; how he left home is told in later books.|in the middle of things
        In the middle of the wedding, the bride remembers the day she first met the groom at a train station.|flashback
        Chapters switch between a soldier at the front and his wife running the farm at home, during the same winter.|parallel plots
        An old sailor stops a wedding guest and tells him a long tale of a voyage; the poem returns to the guest at the end.|frame story
        The film begins with a car chase already under way; only later do we learn why the driver is fleeing.|in the middle of things
        As the old woman holds the medal, the story goes back sixty years to the day her brother earned it.|flashback
        The story alternates between a detective in London and the thief she is chasing in Paris.|parallel plots
        A grandfather begins, "Let me tell you how I met your grandmother," and the story of their meeting follows.|frame story
        The epic begins in the tenth year of the war, with the hero already angry and refusing to fight.|in the middle of things
        During the exam, Lena suddenly recalls the night her father taught her to solve equations at the kitchen table.|flashback
        One plot follows the king in his palace; the other follows the rebels in the hills, moving toward the same battle.|parallel plots
        Travelers at an inn take turns telling stories, and each story is set inside their journey.|frame story
        The first page shows the narrator in a prison cell; the rest of the novel explains how she got there.|in the middle of things
        At his father's funeral, the son remembers a fishing trip they took when he was seven.|flashback
        The chapters move back and forth between two girls in different cities whose lives will meet at the end.|parallel plots
        A queen tells the king a new story every night to keep him from executing her.|frame story
        The play opens with the battle half over and a wounded messenger arriving with news.|in the middle of things
        Smelling smoke, the firefighter is carried back in memory to the first fire he ever fought.|flashback
        The story cuts between a rescue team digging through snow and the climbers trapped beneath it.|parallel plots
        A lawyer explains to the reader that he will tell the story of a strange clerk he once employed.|frame story
        The story starts with the ship already sinking and the passengers rushing to the boats.|in the middle of things
        While packing her childhood bedroom, Ana recalls the summer her best friend moved away.|flashback
        One line follows a scientist in her lab; another follows the patient waiting for her cure.|parallel plots
        A father reads a book aloud to his sick son, and the book's adventure becomes the main story.|frame story
        The novel begins at the moment the bomb goes off, then explains the weeks that led up to it.|in the middle of things
        Hearing an old song on the radio, the narrator drifts back to the dance where she met her husband.|flashback
        The chapters alternate between the two brothers, one at sea and one in the city, over the same year.|parallel plots
        An explorer writes letters to his sister, and inside them he tells the tale of a creature he met on the ice.|frame story
        The first scene shows the trial already in its third day.|in the middle of things
        Staring at the burned house, the man remembers carrying his daughter through its door as a baby.|flashback
      `,
      {
        "in the middle of things": L(
          "从中间开始",
          "The story opens with the action already under way and fills in how it began only later.\n\n**Check.** Check where the story *begins*: the first page or scene starts mid-action rather than at the chronological start.",
          "故事开头时行动已在进行，事情是如何开始的到后来才补叙。\n\n**检验。** 看故事的*开篇*位置：第一页或第一场直接切入进行中的危机，而非从头按顺序讲起。",
          "The story does not open with the action already well under way.",
          "这个故事并不是在行动已经进行之中开头的。",
        ),
        flashback: L(
          "倒叙",
          "The present action is interrupted to show an earlier event, usually through a character's memory.\n\n**Check.** Spot the cue in the present moment that pulls the narrative backward into an earlier memory or past event.",
          "当前的叙述被打断，展示更早发生的事，通常借助人物的回忆。\n\n**检验。** 找出当下场景里触发回忆的契机，它把叙事拉回到了更早的过去。",
          "The present action is not interrupted to show an earlier event.",
          "当前的叙述并没有被打断去展示更早发生的事。",
        ),
        "parallel plots": L(
          "平行情节",
          "The story moves back and forth between two lines of action happening at about the same time.\n\n**Check.** Count the concurrent storylines: two separate characters or places unfold side by side during the same span of time.",
          "故事在大约同时发生的两条行动线索之间来回切换。\n\n**检验。** 数一数同步推进的线索：两个不同的人物或地点在同一时间段内交替展开。",
          "The story does not move between two lines of action happening at the same time.",
          "这个故事并没有在同时发生的两条行动线索之间切换。",
        ),
        "frame story": L(
          "框架故事",
          "One story is set inside another: a character in the outer story tells or reads the inner one.\n\n**Check.** Look for an outer narrator or setting that wraps around the main tale being told or read inside it.",
          "一个故事套在另一个故事里：外层故事中的人物讲述或阅读内层故事。\n\n**检验。** 找出包在外面的讲述者或外层场景，内层主故事正是套在其中讲述或阅读的。",
          "There is no outer story in which a character tells or reads the main one.",
          "这里没有一个由人物讲述或阅读主要故事的外层故事。",
        ),
      },
    ),
    label(
      "speeding-up-and-slowing-down",
      ["Speeding Up and Slowing Down", "加快与放慢"],
      [
        "Writers also control how fast time passes on the page. **Summary** covers a long stretch quickly: *For ten years she worked in the mill.* A **scene** shows events at about the pace they happen, with action and dialogue. **Slow motion** stretches a few seconds across many sentences, so that a crucial moment feels huge. And a writer can **skip ahead**, jumping over time (for example, *Three winters later*). Slowing down tells the reader a moment matters; speeding up hurries past what matters less.\n\n> **Watch out.** Distinguish **summary** (*For ten years she worked...*—compressing ongoing action over time) from **skips ahead** (*Three winters later...*—leaping straight over an unshown gap of time).",
        "作者还控制着时间在纸面上流逝的快慢。**概述**很快地带过一段很长的时间：*For ten years she worked in the mill.* **场景**以大致与事件发生相同的速度展示事件，有动作有对话。**慢镜头**把几秒钟拉长成许多句子，使关键时刻显得重大。作者还可以**跳过一段时间**（例如 *Three winters later*）。放慢告诉读者这一刻很重要；加快则匆匆带过不那么重要的部分。\n\n> **注意。** 分清**概述**（用一两句话概括一段持续经历）与**跳过时间**（如 *Three winters later*，直接跨越中间空白跳到多年之后）。",
      ],
      ["How does this passage handle the pace of time?", "这段文字如何处理时间的节奏？"],
      `
        For ten years she worked in the mill, saving every coin.|summary
        "Where were you?" his mother asked. "Out," he said, and dropped his bag by the door.|scene
        The glass slipped from her fingers. It turned once in the air, caught the light, hung there, and her whole childhood seemed to pass before it struck the floor.|slow motion
        Three winters later, the farm had a new owner.|skips ahead
        The war dragged on for four more years, and the village slowly emptied.|summary
        "Pass the bread," said Grandfather. Lily passed it. He tore off a piece and looked at her. "So you're leaving."|scene
        The arrow left the bow. He saw it rise, saw the feathers spin, saw the deer lift its head, and in that endless second he wished he could call it back.|slow motion
        By the time the letter reached her, the baby had already learned to walk.|skips ahead
        All through the long voyage, the crew grew thinner and quieter.|summary
        The coach blew the whistle. "Again!" he shouted. Maya groaned and took her place at the line.|scene
        His foot found the ice and the ice gave way, and for a moment that stretched like hours he felt the cold rising, heard the crack spreading, saw his father's face turn.|slow motion
        Twenty years passed before the brothers spoke again.|skips ahead
        Over the next months, the town rebuilt the bridge stone by stone.|summary
        "Is it ready?" she whispered. The baker lifted the lid. Steam rose. "Almost," he said.|scene
        The car swerved, and everything slowed: the flash of the headlights, the scream of the brakes, the strange calm of her own hands on the wheel.|slow motion
        When we see him next, he is an old man.|skips ahead
        Each summer the family returned to the lake, and each summer the cabin seemed smaller.|summary
        The judge looked up. "Will the defendant rise?" Tom stood, his knees shaking.|scene
        The ball left her hand; the crowd fell silent; it rose, curved, hung at the rim for one impossible heartbeat.|slow motion
        Months went by without news, and then, one spring morning, a ship appeared in the harbor.|skips ahead
        Through the autumn and the winter, the old dog grew weaker.|summary
        "I found it," said Leo, holding up the key. "Where?" asked his sister. "Under the stone, where you said."|scene
        The door opened an inch, then another; a thin bar of light crept across the floor; a hand appeared, white and slow; and she could not breathe.|slow motion
        The next chapter begins on the morning of her wedding, five years on.|skips ahead
        For generations, the family farmed the same rocky hillside.|summary
        "We need to talk," said Dad. Ana put down her phone. "About what?"|scene
        He lifted the lid of the box. Inside lay something wrapped in cloth. His fingers trembled as he unfolded one corner, then the next, the whole room shrinking to that small bundle.|slow motion
        Ten years later, the girl who had been afraid of the water was swimming the Channel.|skips ahead
        Year after year, the river rose a little higher in the spring.|summary
        "Wait," she said. The stranger turned. "You dropped this." She held out the glove.|scene
      `,
      {
        summary: L(
          "概述",
          "A long stretch of time is covered in a sentence or two, without showing the moments in detail.\n\n**Check.** Notice how months, years, or generations of continuous activity are compressed into one brief overview sentence.",
          "很长一段时间用一两句话带过，没有详细展示其中的时刻。\n\n**检验。** 注意持续数月、数年甚至几代人的经历被压缩进一句简短的概括中。",
          "The passage does not cover a long stretch of time in a few words.",
          "这段文字并没有用寥寥几句带过一段很长的时间。",
        ),
        scene: L(
          "场景",
          "Events are shown at about the pace they happen, with action and dialogue.\n\n**Check.** Look for live dialogue and real-time physical actions unfolding beat by beat at natural speed.",
          "事件以大致与发生时相同的速度展现，有动作也有对话。\n\n**检验。** 看到实时发生的对话和连贯动作，纸面时间与真实时间基本同步。",
          "The passage does not show events at about the pace they happen, with action and dialogue.",
          "这段文字并没有以大致与发生时相同的速度、通过动作和对话展现事件。",
        ),
        "slow motion": L(
          "慢镜头",
          "A few seconds are stretched across many details, so a crucial moment feels huge.\n\n**Check.** Estimate how many real seconds pass in the passage (only one or two) versus how many clauses unpack every tiny detail.",
          "几秒钟被拉长成许多细节，使关键时刻显得格外重大。\n\n**检验。** 估算现实中只过去了一两秒钟，作者却用一连串细节把它拉得极慢极长。",
          "The passage does not stretch a few seconds across many details.",
          "这段文字并没有把几秒钟拉长成许多细节。",
        ),
        "skips ahead": L(
          "跳过时间",
          "The passage jumps over a stretch of time and picks up the story later.\n\n**Check.** Notice that an intervening stretch of time is passed over completely in silence and the narrative resumes at a later point.",
          "这段文字跳过一段时间，从更晚的时候接着讲故事。\n\n**检验。** 注意中间的一段时间完全略过不表，叙事直接从更晚的时间点接续。",
          "The passage does not jump over a stretch of time.",
          "这段文字并没有跳过一段时间。",
        ),
      },
    ),
  ],
});

const epics = topic("reading", {
  id: "epic-conventions",
  title: ["Epic Conventions", "史诗的惯例"],
  summary: [
    "The features that epics share: an invocation of the muse, a hero of great stature, the help of gods, epic similes, epithets and long catalogs.",
    "史诗共有的特征：向缪斯祈求、地位崇高的英雄、神祇的帮助、史诗式明喻、固定修饰语和长长的名录。",
  ],
  intro: [
    "Before Homer ever names Odysseus, he calls on the Muse to sing through him; later he pauses a battle to list ninety ships or compare a charge to a wildfire. Recognizing **epic conventions** reveals both the grand scale and the oral craft behind ancient epics.",
    "荷马在说出奥德修斯的名字之前，先请缪斯借他之口歌唱；在激战正酣时又会停下来细数九十艘战船，或用山火比喻冲锋。认识**史诗惯例**，就能同时读懂古代史诗的宏大格局与口头吟诵技艺。",
  ],
  after: ["archetypes-in-stories", "similes-and-metaphors"],
  points: [
    label(
      "naming-the-convention",
      ["Naming the Convention", "辨认史诗惯例"],
      [
        "Epics from many lands share **conventions**. The poet begins with an **invocation**, asking a muse or a god for help to tell the tale. An **epithet** is a fixed phrase that goes with a name: *swift-footed Achilles*, *gray-eyed Athena*. An **epic simile** is a long comparison that unfolds over several lines (for example, *As when a lion falls upon a herd…*). A **catalog** is a long list of warriors, ships or gifts. And the **gods take part**, helping or hindering the heroes.\n\n> **Watch out.** Do not confuse an **invocation** (the *poet* asking a Muse or goddess to help tell the poem) with **the gods take part** (a deity stepping *into the story's plot* to aid or hinder a character).",
        "许多地方的史诗都有共同的**惯例**。诗人以**祈求**开篇，请缪斯或神帮助他讲述故事。**固定修饰语**是与名字连用的固定短语：*swift-footed Achilles*、*gray-eyed Athena*。**史诗式明喻**是延续好几行的长比喻（例如 *As when a lion falls upon a herd…*）。**名录**是一长串战士、船只或礼物的清单。**神祇参与其中**，帮助或阻挠英雄。\n\n> **注意。** 不要混淆**祈求**（*诗人*请缪斯或女神助他讲述故事）与**神祇参与**（神明直接介入*故事里的情节*帮助或阻挠人物）。",
      ],
      ["Which epic convention does this passage show?", "这段文字体现了哪种史诗惯例？"],
      `
        Sing to me, Muse, of the man of many ways, who wandered far after he sacked the holy city.|invocation
        Then up spoke swift-footed Achilles, and gray-eyed Athena listened from the clouds.|epithet
        As when a lion falls upon a herd of cattle grazing in a marsh, and breaks the neck of a heifer, so the hero fell upon the Trojans.|epic simile
        From Pylos came ninety ships, from Sparta sixty, from Argos eighty, led by Diomedes of the loud war cry.|catalog
        Then the goddess of the sea rose from the waves and lent the hero a veil that would keep him from drowning.|the gods take part
        O goddess, tell me how the anger of the hero began, and how it brought ten thousand griefs upon the Greeks.|invocation
        Rosy-fingered Dawn rose once more from her bed beside the ocean.|epithet
        Like a great wave that rises far out at sea and runs before the wind, gathering height, until it crashes on the rocks, the army surged against the walls.|epic simile
        The gifts were these: seven tripods, ten talents of gold, twenty shining cauldrons and twelve strong horses.|catalog
        Zeus weighed the fates of the two heroes on his golden scales, and Hector's side sank down.|the gods take part
        Help me, Muse, to tell of the voyage of the brave crew who sailed to win the golden fleece.|invocation
        Hector of the shining helmet led the Trojans out through the gates.|epithet
        As a forest fire races over the mountain, its flames seen from far away, so the bronze of the marching army flashed to the sky.|epic simile
        There stood the Boeotian captains: Peneleos, Leitus, Arcesilaus, Prothoenor and Clonius.|catalog
        Apollo, angry at the Greeks, came down from Olympus with his bow and shot arrows of plague into their camp.|the gods take part
        Of man's first disobedience, sing, heavenly Muse, and of the fruit of that forbidden tree.|invocation
        Odysseus, the man of twists and turns, answered him with a smile.|epithet
        As flies swarm around the milk pails on a spring day, buzzing and crowding, so the warriors swarmed around the fallen king.|epic simile
        The heroes who boarded the ship were Heracles, Castor and Pollux, Orpheus the singer and Atalanta the swift.|catalog
        Athena disguised herself as an old friend and whispered courage into the young prince's ear.|the gods take part
        Speak through me, goddess, of the wanderings of the queen who founded a city across the sea.|invocation
        The wine-dark sea stretched away to the edge of the world.|epithet
        Just as a mother bird circles her nest, crying out when the snake creeps near, so the old king circled his son's body.|epic simile
        The tribes who answered the call were the Danes, the Geats, the Swedes and the Frisians, each with its own banner.|catalog
        The god of the sea, still angry, stirred up a storm that smashed the raft to pieces.|the gods take part
        Begin, Muse, with the moment when the two kings quarreled.|invocation
        Beowulf, the son of Ecgtheow, spoke.|epithet
        As a hawk drops from the sky on a dove, so swift and sudden was the charge of the horsemen.|epic simile
        Twelve sons he had, and he named them all: Reuben, Simeon, Levi, Judah and the rest.|catalog
        Hera hid the battlefield in mist so that her favorite could escape.|the gods take part
      `,
      {
        invocation: L(
          "祈求",
          "The poet calls on a muse or a god for help in telling the story, as epics do at the start.\n\n**Check.** Notice who is speaking and to whom: the *poet* addresses the Muse or goddess directly, asking for inspiration to sing the tale.",
          "诗人请缪斯或神帮助讲述故事，史诗通常在开篇这样做。\n\n**检验。** 看谁在向谁说话：*诗人*直接呼唤缪斯或女神，请求赐予讲述故事的力量。",
          "The passage does not call on a muse or a god for help in telling the story.",
          "这段文字没有请缪斯或神帮助讲述故事。",
        ),
        epithet: L(
          "固定修饰语",
          "A fixed descriptive phrase goes with a name, such as *swift-footed* or *rosy-fingered*.\n\n**Check.** Spot the stock descriptive tag attached directly to a character or natural force—that formulaic label is an **epithet**.",
          "一个固定的描述性短语与名字连用，如 *swift-footed* 或 *rosy-fingered*。\n\n**检验。** 认出紧贴人名或自然景物的固定修饰短语——这正是**固定修饰语**。",
          "There is no fixed descriptive phrase attached to a name here.",
          "这里没有附在名字上的固定描述性短语。",
        ),
        "epic simile": L(
          "史诗式明喻",
          "A long comparison, beginning *as when* or *like*, unfolds into a small scene of its own before returning to the action.\n\n**Check.** Trace the *as/like ... so ...* arc across multiple clauses: it expands into a full image before snapping back to the epic action.",
          "一个以 *as when* 或 *like* 开头的长比喻自成一幅小场景，然后才回到情节。\n\n**检验。** 顺着 *as/like ... so ...* 的长句结构看：先展开一幅完整小景，再回到史诗情节。",
          "There is no long comparison that unfolds into a scene of its own.",
          "这里没有自成一幅场景的长比喻。",
        ),
        catalog: L(
          "名录",
          "The passage lists many warriors, ships, places or gifts one after another.\n\n**Check.** Count the enumerated items: a formal roll call of fleets, captains, tribes, or treasures defines a **catalog**.",
          "这段文字一个接一个地列出许多战士、船只、地点或礼物。\n\n**检验。** 看逐一罗列的清单：成串列举船队、将领、部族或宝物正是**名录**。",
          "The passage does not list many names or things one after another.",
          "这段文字没有一个接一个地列出许多名字或事物。",
        ),
        "the gods take part": L(
          "神祇参与",
          "A god or goddess steps into the action to help or to hinder the humans.\n\n**Check.** Notice a deity stepping directly into the plot to alter what happens to the mortal characters—that is **the gods take part**.",
          "一位神或女神介入情节，帮助或阻挠凡人。\n\n**检验。** 注意神明直接出手改变故事进程、左右凡人命运——这正是**神祇参与**。",
          "No god steps into the action here.",
          "这里没有神介入情节。",
        ),
      },
    ),
    label(
      "what-the-convention-does",
      ["What the Convention Does", "史诗惯例的作用"],
      [
        "Each convention does work for the poem. An **invocation** or a **catalog** gives the story **grandeur**, showing that it is vast and important. An **epic simile** **links the heroic to the everyday**, comparing battle to farming, weather or animals the audience knew. **Epithets** and repeated phrases **helped bards remember and perform** long poems aloud. And the **gods' part** shows that the hero's fate is bound up with **forces larger than any person**.\n\n> **Watch out.** Match the exact device to its primary function: invocations and catalogs create **grandeur**, repeated epithets/lines aid **oral performance**, extended comparisons link **heroic to everyday**, and gods or fate point to **larger forces**.",
        "每种惯例都在诗中发挥作用。**祈求**或**名录**使故事显得**宏伟**，表明它广阔而重要。**史诗式明喻**把**英雄事迹与日常生活联系起来**，把战斗比作听众熟悉的农事、天气或动物。**固定修饰语**和重复的短语**帮助吟游诗人记忆和吟诵**长诗。**神祇的参与**则表明英雄的命运与**超越任何个人的力量**紧密相连。\n\n> **注意。** 把惯例与核心作用一一对应：祈求与名录营造**宏伟感**，固定修饰语和重复诗行服务于**口头吟诵记忆**，长比喻沟通**英雄与日常**，神祇或命运凸显**超越个人的力量**。",
      ],
      ["What is this convention mainly doing in the epic?", "这个惯例在史诗中主要起什么作用？"],
      `
        The poet lists every ship and captain who sailed to Troy, filling hundreds of lines.|gives the story grandeur
        A charging army is compared at length to a fire sweeping through a dry forest.|links the heroic to the everyday
        The phrase "rosy-fingered Dawn" appears again and again, always in the same words.|helped bards remember and perform
        The hero cannot sail home until the angry sea god allows it.|shows forces larger than any person
        The poem begins by asking the Muse to sing of a man whose wanderings changed the world.|gives the story grandeur
        Warriors falling in battle are compared to wheat cut down by a farmer's scythe.|links the heroic to the everyday
        Each time the hero speaks, the poem introduces him as "the man of twists and turns."|helped bards remember and perform
        Zeus decides on Olympus which side will win the battle below.|shows forces larger than any person
        The gifts offered to the hero are named one by one: tripods, gold, horses, women, cities.|gives the story grandeur
        Soldiers crowding around a body are compared to flies buzzing around pails of milk.|links the heroic to the everyday
        The same line, "and they put their hands to the good things before them," opens every feast.|helped bards remember and perform
        The hero's death was decided by the Fates before he was born.|shows forces larger than any person
        The opening calls on heaven to help tell of the creation of the world.|gives the story grandeur
        A hero's charge is compared to a wave building far out at sea before it breaks.|links the heroic to the everyday
        "Gray-eyed Athena" is never named without her epithet.|helped bards remember and perform
        A goddess holds back the dawn so the lovers can have one more night.|shows forces larger than any person
        The poet names every tribe that gathered for the war, from the mountains to the sea.|gives the story grandeur
        A grieving king is compared to a lion whose cubs have been stolen by hunters.|links the heroic to the everyday
        Whole passages are repeated word for word when a messenger delivers a god's command.|helped bards remember and perform
        The hero's ship is wrecked because his men angered the god of the sun.|shows forces larger than any person
        The poem's first line asks the goddess to tell of a rage that sent many souls to the underworld.|gives the story grandeur
        Two armies meeting are compared to two winds that clash over a forest.|links the heroic to the everyday
        The phrase "the wine-dark sea" returns whenever the poem describes the ocean.|helped bards remember and perform
        Though the hero fights bravely, the god of war guides his enemy's spear.|shows forces larger than any person
        The poem lists the heroes who boarded the ship, each with his family and his fame.|gives the story grandeur
        A warrior sinking in death is compared to a poppy bending under the weight of spring rain.|links the heroic to the everyday
        Every warrior's name is given with his father's: "Diomedes, son of Tydeus."|helped bards remember and perform
        The queen's fate was spoken by an oracle long before the story begins.|shows forces larger than any person
        The bard begins by calling on the Muse to make his voice as great as his subject.|gives the story grandeur
        Spears thrown in battle are compared to snowflakes falling thick on a winter day.|links the heroic to the everyday
      `,
      {
        "gives the story grandeur": L(
          "使故事宏伟",
          "The convention makes the story seem vast and important, worthy of the gods' help or of a list of whole nations.\n\n**Check.** Spot the invocation to a Muse/heaven or the sweeping catalog of fleets, tribes, or treasures—both elevate the tale's scale into **grandeur**.",
          "这个惯例使故事显得广阔而重要，值得神的帮助或整整一串民族的名录。\n\n**检验。** 认出向缪斯祈求或宏大的船队、部族、宝物名录——两者都将故事格局推向**宏伟**。",
          "The convention is not mainly there to make the story seem vast and important.",
          "这个惯例主要不是为了让故事显得宏大重要。",
        ),
        "links the heroic to the everyday": L(
          "联系英雄与日常",
          "A long comparison brings a scene of war or wonder down to animals, weather or farm work the audience knew.\n\n**Check.** Look at the two halves of the comparison: a grand battlefield moment is paired with a familiar sight from nature or daily work.",
          "长比喻把战争或奇迹的场面与听众熟悉的动物、天气或农活联系起来。\n\n**检验。** 看比喻的两端：宏大的战场瞬间与听众熟悉的自然景象或日常劳作相连。",
          "There is no comparison to everyday life here.",
          "这里没有与日常生活的比较。",
        ),
        "helped bards remember and perform": L(
          "帮助吟诵记忆",
          "Fixed phrases and repeated lines gave the singer ready-made pieces, which helped him remember and perform a long poem aloud.\n\n**Check.** Notice the word-for-word repetition or stock epithet returning every time a figure or feast appears—a classic memory anchor for oral bards.",
          "固定短语和重复的诗行给吟唱者现成的片段，帮助他记忆并当众吟诵长诗。\n\n**检验。** 注意一再原样出现的固定修饰语或重复诗行——这正是口头吟游诗人记忆与吟诵的抓手。",
          "Nothing here is a fixed phrase or a repeated line that a singer could reuse.",
          "这里没有吟唱者可以反复使用的固定短语或重复诗行。",
        ),
        "shows forces larger than any person": L(
          "表现超越个人的力量",
          "A god or fate shapes what happens, showing that the hero's life is bound up with powers greater than any person.\n\n**Check.** Spot the divine intervention, oracle, or decree of the Fates steering the outcome beyond human control.",
          "神或命运决定事情的发展，表明英雄的一生与超越任何个人的力量紧密相连。\n\n**检验。** 认出直接左右结局的神明干预、神谕或命运裁决，它们展现出超越个人的力量。",
          "No god or fate shapes what happens here.",
          "这里没有神或命运决定事情的发展。",
        ),
      },
    ),
  ],
});

const journey = topic("reading", {
  id: "the-heros-journey",
  title: ["The Hero's Journey", "英雄之旅"],
  summary: [
    "The pattern that many quest stories follow: the call, the crossing into a strange world, trials and helpers, the greatest ordeal and the return home changed.",
    "许多探寻故事遵循的模式：召唤、跨入陌生世界、考验与帮手、最严峻的磨难，以及改变后的回归。",
  ],
  intro: [
    "From Odysseus sailing past the edge of known seas to a farm child stepping through a hidden doorway, quest stories echo the same five-stage arc. Tracing the **hero's journey** shows how outer trials mirror an inner change.",
    "从奥德修斯驶出已知海域的尽头，到农家孩子跨入隐秘的门扉，古今探寻故事往往共享同一套五阶段弧线。梳理**英雄之旅**，能看清外在历险如何映照出内在蜕变。",
  ],
  after: ["archetypes-in-stories"],
  points: [
    label(
      "the-stage-of-the-journey",
      ["The Stage of the Journey", "英雄之旅的阶段"],
      [
        "Many quest stories, from old epics to modern films, follow a pattern called the **hero's journey**. It begins with **the call**: something disturbs the hero's ordinary life and demands action. Then comes **crossing the threshold** into an unknown world. There the hero faces **trials and meets helpers**: tests, enemies, a wise mentor, a magic gift. At the center is **the greatest ordeal**, a battle or a descent where the hero nearly dies. Finally comes **the return**: the hero goes home changed, bringing something of value.\n\n> **Watch out.** Do not confuse **trials and helpers** (early road tests, riddles, mentors, or gifts along the way) with **the greatest ordeal** (the central life-or-death crisis in the deepest lair, storm, or final battle).",
        "许多探寻故事，从古代史诗到现代电影，都遵循一种叫作**英雄之旅**的模式。它从**召唤**开始：某件事打破了英雄平凡的生活，要求他采取行动。接着是**跨越门槛**，进入一个未知的世界。在那里，英雄经受**考验并遇到帮手**：考验、敌人、睿智的导师、神奇的礼物。中心是**最严峻的磨难**，一场战斗或一次深入险境，英雄几乎丧命。最后是**回归**：英雄带着有价值的东西，以改变了的面貌回家。\n\n> **注意。** 分清**考验与帮手**（沿途的谜题、小敌、导师指点或宝物相赠）与**最严峻的磨难**（深入洞穴、冥界或决战中九死一生的核心危机）。",
      ],
      ["Which stage of the hero's journey is this?", "这是英雄之旅的哪个阶段？"],
      `
        A messenger arrives at the farm: the king's daughter has been taken, and only the farmer's son can find her.|the call
        The girl steps through the wardrobe and finds herself in a snowy forest she has never seen.|crossing the threshold
        On the road, an old woman gives the boy a ring and warns him never to take it off; then a troll blocks the bridge.|trials and helpers
        In the depths of the cave, the hero faces the dragon, and for a long time it seems he will not come out alive.|the greatest ordeal
        Years later, the wanderer reaches his own island, older, wiser, carrying the stories of all he has seen.|the return
        A strange letter arrives on the boy's birthday, inviting him to a school he has never heard of.|the call
        The sailors leave the last known harbor and sail past the edge of every map.|crossing the threshold
        A talking fox shows the prince the way, but first he must answer three riddles at the gate.|trials and helpers
        Deep in the underworld, the hero must cross the river of the dead and face the lord of shadows.|the greatest ordeal
        The girl comes home from the war with a scar and a medal, and the village sees her differently.|the return
        A dying knight hands the young squire his sword and begs him to finish the quest.|the call
        The travelers pass through the great gate into the city where no outsider has walked for a hundred years.|crossing the threshold
        A wise hermit teaches the young warrior to use the bow; then bandits attack on the mountain pass.|trials and helpers
        Alone on the ice, the explorer fights through a blizzard that has already killed his companions.|the greatest ordeal
        The hero brings the healing water back to his village, and the sick are cured.|the return
        A comet appears, and the old prophecy says the shepherd boy must rise to save the kingdom.|the call
        She dives into the lake and comes up in a world under the water.|crossing the threshold
        A ferryman, a blacksmith and a witch each help the boy, but each asks a price.|trials and helpers
        At the top of the tower, the hero confronts the sorcerer, and the floor gives way beneath them.|the greatest ordeal
        After the long quest, the young queen returns to rule wisely the land she once fled.|the return
        Her father falls ill, and only a flower from the far mountains can save him.|the call
        The hero leaves the safe road and rides into the dark forest that no one returns from.|crossing the threshold
        Along the way, the knight is tested by a giant, saved by a hermit and given a shield by a lady of the lake.|trials and helpers
        In the final battle, the hero is struck down and lies near death before rising to win.|the greatest ordeal
        The boy who left a coward comes home and stands up to the bully who once terrified him.|the return
        A wounded stranger staggers into the inn with a map and a warning.|the call
        The children climb through the hole in the hedge and find a garden where it is always spring.|crossing the threshold
        An old soldier trains the girl in swordplay before she faces the bandits in the pass.|trials and helpers
        Trapped in the sinking ship, the hero must swim through the flooded hold in the dark.|the greatest ordeal
        Home again, the sailor plants an oar in the ground and tells his grandchildren of the sea.|the return
      `,
      {
        "the call": L(
          "召唤",
          "Something disturbs the hero's ordinary life and demands that he or she set out.\n\n**Check.** Notice that the hero is still at home when news, a letter, an illness, or a prophecy arrives—starting the quest.",
          "某件事打破了英雄平凡的生活，要求他或她踏上征程。\n\n**检验。** 注意英雄此时仍在家中，突如其来的消息、信件、灾祸或预言召唤他踏上旅程。",
          "Nothing here disturbs the hero's ordinary life to start the quest.",
          "这里没有打破英雄平凡生活、开启征程的事件。",
        ),
        "crossing the threshold": L(
          "跨越门槛",
          "The hero leaves the familiar world and passes into an unknown, often magical one.\n\n**Check.** Spot the boundary the hero crosses to leave the familiar home world behind and enter the unknown.",
          "英雄离开熟悉的世界，进入一个未知的、常常带有魔力的世界。\n\n**检验。** 认出英雄跨越的那道边界：跨过去，就告别熟悉的家园，踏入未知世界。",
          "The hero is not passing from the familiar world into an unknown one here.",
          "这里英雄并没有从熟悉的世界进入未知的世界。",
        ),
        "trials and helpers": L(
          "考验与帮手",
          "On the road, the hero meets tests and enemies, and helpers such as a mentor or a giver of gifts.\n\n**Check.** Look for road-stage encounters—mentors, riddles, magic gifts, or lesser obstacles—that prepare the hero before the central crisis.",
          "在路上，英雄遇到考验和敌人，也遇到导师或赠送礼物的人这样的帮手。\n\n**检验。** 看到旅途中的导师、谜题、赠礼或沿途障碍，它们都在为最终磨难做准备。",
          "The passage is not about the tests and helpers met along the road.",
          "这段文字说的不是路上遇到的考验和帮手。",
        ),
        "the greatest ordeal": L(
          "最严峻的磨难",
          "The hero faces the hardest test of the journey and comes close to death.\n\n**Check.** Notice the peak life-or-death stakes at the very heart of the quest, where the hero risks everything.",
          "英雄面对整个旅程中最艰难的考验，几乎丧命。\n\n**检验。** 注意旅程核心处九死一生的最高赌注，这是整趟旅程最严峻的磨难。",
          "This is not the hardest, near-deadly test of the journey.",
          "这不是旅程中最艰难、几乎致命的考验。",
        ),
        "the return": L(
          "回归",
          "The hero goes home changed, often bringing something of value to others.\n\n**Check.** Notice that the quest is over and the hero is back in the home world—visibly transformed or bearing a gift for the community.",
          "英雄以改变了的面貌回家，常常为他人带回有价值的东西。\n\n**检验。** 注意历险已经结束，英雄回到故土，自身已然蜕变或带回了造福众人的收获。",
          "The hero is not going home changed here.",
          "这里英雄并没有以改变了的面貌回家。",
        ),
      },
    ),
    label(
      "how-the-journey-changes-the-hero",
      ["How the Journey Changes the Hero", "旅程如何改变英雄"],
      [
        "The outer journey mirrors an **inner change**. The hero may **gain wisdom**, learning something about the world or about life. The hero may **overcome a flaw**, such as pride, fear or selfishness, that held him or her back. Or the hero may **pay a lasting price**, returning with a wound, a loss or a sadness that does not heal. Ask what the hero is like at the start and at the end, and what made the difference.\n\n> **Watch out.** Distinguish **gains wisdom** (a new realization or insight about life) from **overcomes a flaw** (conquering a named personal weakness like cowardice, greed, or temper) and **pays a lasting price** (permanent physical or emotional loss).",
        "外在的旅程映照着**内在的改变**。英雄可能**获得智慧**，懂得了关于世界或人生的道理；可能**克服缺点**，如骄傲、恐惧或自私这些曾阻碍他或她的东西；也可能**付出持久的代价**，带着无法愈合的伤口、失去或悲伤回来。问问英雄在开头和结尾分别是什么样，是什么带来了这种变化。\n\n> **注意。** 分清**获得智慧**（对世界或人生有了新领悟）、**克服缺点**（战胜了怯懦、自私、暴躁等具体性格弱点）和**付出持久的代价**（留下难以愈合的伤痛或失去）。",
      ],
      ["How has the journey changed the hero?", "这段旅程如何改变了英雄？"],
      `
        At first the prince thinks only of glory; after seeing the war's dead, he understands that peace is worth more.|gains wisdom
        The boy who ran from every fight stands his ground against the wolf to protect his sister.|overcomes a flaw
        The hero saves the kingdom, but the wound from the dragon's tooth never heals, and he can never be happy at home again.|pays a lasting price
        The proud queen, humbled by her years in exile, learns to listen to her advisors.|overcomes a flaw
        After meeting people from many lands, the traveler realizes that strangers are not so different from her own people.|gains wisdom
        The young knight wins the quest but loses his closest friend, and he never laughs as freely again.|pays a lasting price
        The selfish girl gives her last bread to a starving child on the road.|overcomes a flaw
        Having faced death, the hero understands that every life, even a beggar's, is precious.|gains wisdom
        The sailor comes home rich, but his wife has died and his children do not know him.|pays a lasting price
        The boastful warrior learns to share the credit with the soldiers who fought beside him.|overcomes a flaw
        The girl learns from the old hermit that true strength lies in patience, not in force.|gains wisdom
        The explorer finds the lost city, but the frostbite costs him three fingers and the use of one leg.|pays a lasting price
        The timid scholar, forced to lead the escape, finds courage he never knew he had.|overcomes a flaw
        The prince discovers that the treasure he sought was never as valuable as the friends he made.|gains wisdom
        The heroine returns victorious, but the memory of what she saw in the underworld haunts her sleep forever.|pays a lasting price
        The greedy merchant, saved by a poor fisherman, gives away half his fortune.|overcomes a flaw
        After years at sea, the hero knows that home is not a place but the people who wait for you.|gains wisdom
        The soldier wins the war but comes home deaf in one ear and unable to bear loud noises.|pays a lasting price
        The jealous brother learns to celebrate his sister's success.|overcomes a flaw
        The young king learns that a ruler must serve the people rather than be served by them.|gains wisdom
        The hero kills the monster, but its curse leaves him unable to ever cross water again.|pays a lasting price
        The hot-tempered warrior learns to wait and think before he strikes.|overcomes a flaw
        The girl who wanted to see the world comes back understanding the beauty of her own small village.|gains wisdom
        The quest is won, but the hero's youth is gone, and he returns gray-haired to a village that has forgotten him.|pays a lasting price
        The lazy apprentice works day and night to finish the magic sword in time.|overcomes a flaw
        The boy learns that his father, whom he thought a coward, had once been a great hero.|gains wisdom
        The princess saves her people but must leave her home forever to live among the sea folk.|pays a lasting price
        The arrogant knight kneels to ask forgiveness from the squire he once mocked.|overcomes a flaw
        The wanderer realizes that the gods favor those who are kind to strangers.|gains wisdom
        The warrior brings home the cure, but the battle has taken his brother, and his mother never forgives him.|pays a lasting price
      `,
      {
        "gains wisdom": L(
          "获得智慧",
          "The hero comes to understand something new about the world or about life.\n\n**Check.** Notice that the change is an inward insight: the hero returns seeing a deeper truth about life or the world.",
          "英雄对世界或人生有了新的理解。\n\n**检验。** 注意变化落在内在领悟上：英雄带回了对世界或人生更深层的认识。",
          "The change here is not mainly a new understanding of the world or of life.",
          "这里的变化主要不是对世界或人生有了新的理解。",
        ),
        "overcomes a flaw": L(
          "克服缺点",
          "A weakness that held the hero back, such as fear, pride or selfishness, is overcome.\n\n**Check.** Compare who the hero was at the start with how the hero acts at the end: a personal weakness from the beginning has been overcome.",
          "曾经阻碍英雄的弱点，如恐惧、骄傲或自私，被克服了。\n\n**检验。** 对照英雄最初的性格弱点与结尾的新举动：他真正战胜了这个缺点。",
          "The hero is not overcoming a weakness of character here.",
          "这里英雄并没有克服某个性格弱点。",
        ),
        "pays a lasting price": L(
          "付出持久的代价",
          "The hero succeeds but returns with a wound, a loss or a sadness that does not go away.\n\n**Check.** Notice the permanent shadow cast over the victory—an unhealed wound, bereavement, exile, or lost youth that cannot be undone.",
          "英雄成功了，却带着无法消除的伤口、失去或悲伤回来。\n\n**检验。** 注意胜利背后挥之不去的阴影——无法愈合的伤痛、亲友离世、流放或逝去的青春。",
          "The hero does not return with a lasting wound, loss or sadness.",
          "英雄并没有带着持久的伤痛、失去或悲伤回来。",
        ),
      },
    ),
  ],
});

const soliloquy = topic("reading", {
  id: "soliloquy-and-aside",
  title: ["Soliloquy and Aside", "独白与旁白"],
  summary: [
    "How a play lets the audience hear a character's private thoughts: the soliloquy spoken alone, the aside spoken past the other characters, and the monologue spoken to them.",
    "戏剧如何让观众听到人物内心的想法：独自说出的独白、避开其他人物说出的旁白，以及对其他人物说的长篇独白。",
  ],
  intro: [
    "Without a narrator, a playwright still needs ways to let the audience inside a character's head. Whether a character speaks alone onstage (**soliloquy**), murmurs past other characters (**aside**), or addresses a crowd (**monologue**) determines who hears the truth.",
    "没有叙述者，剧作家照样要让观众窥见人物内心。人物是独自吐露心声（**独白**）、避开旁人悄悄对观众说话（**旁白**），还是面向众人发表长篇演说（**长篇独白**），决定了谁能听见真相。",
  ],
  after: ["parts-of-a-play", "how-dialogue-reveals-character"],
  points: [
    label(
      "soliloquy-aside-or-monologue",
      ["Soliloquy, Aside or Monologue", "独白、旁白还是长篇独白"],
      [
        "A play has no narrator to tell us what characters think, so playwrights use special kinds of speech. In a **soliloquy**, a character alone on stage speaks his or her thoughts aloud: *To be, or not to be*. In an **aside**, a character speaks a short remark to the audience, or to one other character, that the rest on stage cannot hear. A **monologue** is a long speech spoken to other characters, who hear it.\n\n> **Watch out.** Check the stage direction in parentheses first: *alone* = **soliloquy**, *whispers/mutters/turns to the audience while others are onstage* = **aside**, *to the army/jury/council/daughter* = **monologue**.",
        "戏剧没有叙述者告诉我们人物在想什么，所以剧作家使用特别的说话方式。**独白**（soliloquy）是人物独自在台上把心里的想法说出来：*To be, or not to be*。**旁白**（aside）是人物对观众或对另一个人物说的一句简短的话，台上其他人听不见。**长篇独白**（monologue）是对其他人物说的长篇讲话，他们都听得到。\n\n> **注意。** 先看括号里的舞台提示：独自一人是**独白**；旁人在场但低声或转向观众说短句是**旁白**；面向在场人物发表长篇讲话是**长篇独白**。",
      ],
      ["Which kind of speech is this?", "这是哪种说话方式？"],
      `
        (Alone on stage at night) Should I tell my father what I saw? If I do, he will never trust my brother again.|soliloquy
        (While the king speaks to the court, Edmund turns to the audience) He believes every word. Fools are so easy.|aside
        (Before the whole army) Soldiers, we have marched for forty days. Tomorrow we fight, and tomorrow we win our homes back.|monologue
        (The stage empties; Juliet stands alone) What if the potion does not work? What if I wake too soon?|soliloquy
        (As her rival smiles at her, Rosa murmurs to the audience) Smile while you can.|aside
        (To the jury) Ladies and gentlemen, the evidence you have heard tells one story and one story only.|monologue
        (Alone in the castle hall) My hand is steady, but my heart is not. Can I really do this deed?|soliloquy
        (While the others toast the bride, the servant whispers to the audience) If they only knew where she was last night.|aside
        (To his gathered children) When I was your age, I had nothing but a coat and a dream. Let me tell you how I built this house.|monologue
        (Left alone after the others go) So they think I have forgotten. I forget nothing.|soliloquy
        (Hearing the duke's promise, the clown says to the audience) And pigs will fly.|aside
        (To the council) Friends, I have served this city for thirty years, and I have never asked for anything until today.|monologue
        (Alone by the river) Why does it hurt so much to say goodbye to a place I hated?|soliloquy
        (As the general boasts, his aide says aside) He was hiding under a wagon the whole battle.|aside
        (To her daughter, who listens in silence) You think I don't understand you. I was seventeen once, too, and I made every mistake you are about to make.|monologue
        (The room is empty; the prince paces) If I stay, I am a coward. If I go, I am a traitor. Which is worse?|soliloquy
        (Shaking the stranger's hand, the old woman tells the audience) I've seen those eyes before, on a wanted poster.|aside
        (To the crowd at the funeral) He was not a great man, perhaps, but he was a good one, and that is rarer.|monologue
        (Alone at her desk with the letter) He loves me. He loves me not. He has never once said which.|soliloquy
        (As the host praises the wine, a guest whispers to the audience) Vinegar would taste better.|aside
        (To the new recruits) Listen well. Out there, the sea does not care how brave you are.|monologue
        (Alone on the battlements before dawn) Tomorrow I meet my brother on the field. One of us will not see the sunset.|soliloquy
        (While his master reads the will, the servant says to the audience) Not a penny to me, after all these years.|aside
        (To the court, kneeling) Your Majesty, I come not to beg for my life but for my son's.|monologue
        (Left alone after the quarrel) I said too much. I always say too much.|soliloquy
        (As the suitor kneels, the maid tells the audience) Third proposal this week.|aside
        (To the class, on her last day) I have taught in this room for forty years, and every one of you has taught me something.|monologue
        (Alone in the dark garden) The night is so still. Even the wind is holding its breath, waiting to see what I will do.|soliloquy
        (As the detective questions the cook, the butler mutters to the audience) Ask her about the poison.|aside
        (To the striking workers) We are not asking for riches. We are asking to be paid enough to feed our children.|monologue
      `,
      {
        soliloquy: L(
          "独白",
          "The character is alone, or speaks as if alone, and thinks aloud so the audience can hear what is in his or her mind.\n\n**Check.** Verify that the stage direction shows the character *alone* (empty room/stage) speaking inward thoughts aloud.",
          "人物独自一人（或如同独自一人），把想法说出来，让观众听到他或她的内心。\n\n**检验。** 核对舞台提示：人物独自在场，把内心想法直接说给观众听，这正是**独白**。",
          "The character is not alone thinking aloud; others are present or meant to hear.",
          "人物并不是独自把想法说出来；台上有其他人，或者话是说给别人听的。",
        ),
        aside: L(
          "旁白",
          "The character makes a short remark to the audience, or to one other character, that the rest on stage do not hear.\n\n**Check.** Notice that other characters are onstage, yet the speaker delivers a brief remark strictly to the audience (hidden from the others).",
          "人物对观众或另一个人物说一句简短的话，台上其他人听不见。\n\n**检验。** 注意台上还有别的角色，但说话人避开他们向观众悄悄说出一句短评，这正是**旁白**。",
          "This is not a short remark hidden from the others on stage.",
          "这不是避开台上其他人的一句简短的话。",
        ),
        monologue: L(
          "长篇独白",
          "The character makes a long speech to other characters, who are there to hear it.\n\n**Check.** Check who is present in the stage direction: other characters are onstage listening to this extended speech, which makes it a **monologue**.",
          "人物对在场的其他人物发表一段长篇讲话，他们都听得到。\n\n**检验。** 看括号里的舞台指示：台上有其他角色在听这段长篇发言，因此是**长篇独白**。",
          "This is not a long speech addressed to other characters who hear it.",
          "这不是对在场其他人物说的长篇讲话。",
        ),
      },
    ),
    label(
      "what-the-private-speech-reveals",
      ["What the Private Speech Reveals", "私下的话揭示了什么"],
      [
        "Soliloquies and asides let the audience into a character's mind, and that knowledge does different work. A speech can show a character **torn between choices**, weighing one path against another. It can **reveal a secret plan** that the other characters do not know, which creates dramatic irony. Or it can **expose the truth behind a mask**, when a character's private words contradict what he or she says in public.\n\n> **Watch out.** Look for the structural signal: *If I ... / Should I ... or ...* signals **torn between choices**; future action steps (*Tonight I will...*) signal **a secret plan**; a stage note contrasting public words with private truth (*(After praising...)*) signals **the truth behind a mask**.",
        "独白和旁白让观众进入人物的内心，这种了解起着不同的作用。一段话可以表现人物**在选择之间挣扎**，权衡这条路和那条路；可以**揭示秘密的计划**，其他人物并不知道，从而产生戏剧性反讽；也可以**揭开面具背后的真相**，人物私下的话与他或她在人前说的话相矛盾。\n\n> **注意。** 抓结构信号：*If I ... / Should I ... or ...* 表明**在选择间挣扎**；具体谋划步骤（*Tonight I will...*）表明**秘密的计划**；括号里点出人前一套、人后一套则是**面具背后的真相**。",
      ],
      ["What does this private speech mainly reveal?", "这段私下的话主要揭示了什么？"],
      `
        If I tell the truth, my friend goes to prison. If I lie, I can never look at myself again.|torn between choices
        Tonight, when the guards change, I will open the gate and let the enemy in. No one suspects me.|a secret plan
        (After warmly praising the king in public) How I hate that smiling old man.|the truth behind a mask
        Part of me wants to run to her; part of me knows I must stay and fight.|torn between choices
        I will hide the letter in his room, and they will think he is the thief.|a secret plan
        (After telling her sister she is happy for her) Why does she always get everything I want?|the truth behind a mask
        Should I obey my father and marry the duke, or follow my heart?|torn between choices
        I'll pretend to be ill tomorrow, and while they are at the feast, I'll take the horse and ride for the coast.|a secret plan
        (After swearing loyalty to the prince) Loyalty lasts only as long as he can pay me.|the truth behind a mask
        To stay is to die slowly; to leave is to break my mother's heart.|torn between choices
        The poison is in the second cup. When he drinks, the throne is mine.|a secret plan
        (After telling everyone he is not afraid) My hands have not stopped shaking since the battle.|the truth behind a mask
        I could forgive him and lose my pride, or refuse and lose my brother.|torn between choices
        I will make him believe his wife has betrayed him, using nothing but a handkerchief.|a secret plan
        (After laughing at the jokes of the others) Every word they say cuts like a knife.|the truth behind a mask
        Do I take the money and save the farm, or refuse it and keep my honor?|torn between choices
        When the music starts, I will slip away and meet the captain at the dock.|a secret plan
        (After assuring the doctor she feels fine) I have not slept in a week, and the voices will not stop.|the truth behind a mask
        I cannot decide whether to spare him or to avenge my father.|torn between choices
        I'll write a false order with the general's seal, and the army will march the wrong way.|a secret plan
        (After telling the court he has no wish to rule) The crown is the only thing I have ever wanted.|the truth behind a mask
        Every road leads to loss: if I speak, I lose her; if I stay silent, I lose myself.|torn between choices
        I'll befriend the old woman, learn where the gold is buried and dig it up when she is gone.|a secret plan
        (After agreeing kindly to his daughter's marriage) I will see the boy ruined before he takes her from me.|the truth behind a mask
        Shall I go to the war and win glory, or stay and keep my promise to her?|torn between choices
        Tomorrow I will tell the judge a story that will hang my rival.|a secret plan
        (After assuring the crew all is well) We have three days of water left, and no land in sight.|the truth behind a mask
        To fight is madness, but to surrender is shame. I cannot choose.|torn between choices
        I have hidden the key in the bread. When they eat, my brother will find it and escape.|a secret plan
        (After smiling at the guest) The man who ruined my family sits at my table, and I must serve him wine.|the truth behind a mask
      `,
      {
        "torn between choices": L(
          "在选择间挣扎",
          "The speaker weighs two paths and cannot decide, showing the conflict inside the character.\n\n**Check.** Notice the speaker weighing two competing courses of action without yet committing to either—that is an inner struggle over a decision.",
          "说话人权衡两条路而无法决定，表现出人物内心的冲突。\n\n**检验。** 注意说话人在两条相反的选择之间反复权衡、尚未拍板——这正是内心抉择的挣扎。",
          "The speaker is not weighing two paths against each other here.",
          "说话人在这里并没有在两条路之间权衡。",
        ),
        "a secret plan": L(
          "秘密的计划",
          "The speaker reveals a plan that the other characters do not know, so the audience knows more than they do.\n\n**Check.** Notice that the speaker lays out future steps meant to stay hidden from other characters, giving the audience private knowledge of the plot.",
          "说话人揭示了其他人物不知道的计划，于是观众比他们知道得更多。\n\n**检验。** 注意说话人交代了瞒着其他角色的后续步骤，让观众提前得知了一个秘密谋划。",
          "The speaker is not revealing a hidden plan here.",
          "说话人在这里并没有揭示一个秘密计划。",
        ),
        "the truth behind a mask": L(
          "面具背后的真相",
          "The private words contradict what the character says or shows in public, revealing a hidden feeling.\n\n**Check.** Compare the character's outward public behavior in parentheses with the private line right after it: the two directly contradict each other.",
          "私下的话与人物在人前所说或所表现的相矛盾，揭示了隐藏的感情。\n\n**检验。** 把括号里人前的公开举动与紧接着的私下话语对照：一表一里截然相反。",
          "The private words do not contradict anything the character says in public.",
          "私下的话与人物在人前说的并不矛盾。",
        ),
      },
    ),
  ],
});

const tragic = topic("reading", {
  id: "tragic-heroes-and-flaws",
  title: ["Tragic Heroes and Their Flaws", "悲剧英雄及其缺陷"],
  summary: [
    "The tragic hero: a person of stature brought down by a flaw such as pride or ambition, the turn of fortune and the late recognition of the truth.",
    "悲剧英雄：一个地位崇高的人因骄傲或野心之类的缺陷而毁灭，命运的逆转，以及迟来的对真相的认识。",
  ],
  intro: [
    "In classic tragedy, ruin does not strike out of nowhere—a ruler's own unchecked pride, hunger for power, suspicion, or fatal delay sets the collapse in motion. Tracing the **tragic flaw** and the four stages of the fall shows how tragedy earns its pity and fear.",
    "古典悲剧的毁灭从非无妄之灾——统治者自身的狂妄、野心、猜忌或优柔寡断亲手拉开了崩塌的序幕。追踪**悲剧缺陷**与毁灭的四个阶段，就能看懂悲剧为何能激起深沉的怜悯与恐惧。",
  ],
  after: ["dramatic-irony", "character-change"],
  points: [
    label(
      "naming-the-flaw",
      ["Naming the Flaw", "辨认悲剧缺陷"],
      [
        "In a **tragedy**, a hero of high rank or great gifts falls, and the fall comes from within. The hero has a **tragic flaw**, a weakness that drives the choices leading to ruin. Common flaws are **pride**, which refuses to listen or bow (the Greeks called extreme pride *hubris*); **ambition**, which reaches for power at any cost; **jealousy**, which believes the worst of a loved one; and **indecision**, which delays until it is too late.\n\n> **Watch out.** Separate **pride** (refusing advice, boasting, refusing to admit error) from **ambition** (scheming or betraying to climb higher in power, wealth, or fame).",
        "在**悲剧**中，一个地位很高或天赋很高的英雄走向毁灭，而毁灭来自内部。英雄有一个**悲剧缺陷**，一个推动他做出导致毁灭的选择的弱点。常见的缺陷有：**骄傲**，不肯听劝、不肯低头（希腊人把极度的骄傲称为 *hubris*）；**野心**，不惜任何代价追逐权力；**嫉妒**，把所爱的人往坏处想；**优柔寡断**，一再拖延直到为时已晚。\n\n> **注意。** 区分**骄傲**（拒听忠告、自大、不肯认错）与**野心**（为攫取更高权力、财富或名声而谋害或背叛）。",
      ],
      ["Which flaw leads to the hero's fall?", "哪个缺陷导致了英雄的毁灭？"],
      `
        The king refuses to hear the prophet's warning, sure that no man knows more than he does.|pride
        Told she might one day rule, the duchess plots the murder of everyone who stands between her and the throne.|ambition
        On the word of a lying servant, the general comes to believe his faithful wife has betrayed him.|jealousy
        The prince knows his uncle is guilty, but he thinks, waits and doubts until the chance to act has passed.|indecision
        The champion boasts that even the gods cannot defeat him, and he insults the temple before battle.|pride
        A loyal soldier, hungry for a crown, murders his own king as he sleeps.|ambition
        The king sees his best friend talking warmly with the queen and orders his death without asking a single question.|jealousy
        The captain cannot decide whether to turn back or sail on, and the storm catches the ship while he hesitates.|indecision
        The ruler sentences his own niece to death rather than admit that his law was too harsh.|pride
        The minister betrays every friend to climb one step higher at court.|ambition
        Convinced his brother is plotting to steal his bride, the young lord challenges him to a duel.|jealousy
        The queen hears of the rebellion but cannot make up her mind to act, and the rebels reach the palace.|indecision
        Though the whole city begs him, the general will not fight again, because his honor was insulted.|pride
        The scientist ignores every danger to be the first to make a discovery that will make her famous.|ambition
        The husband reads every letter his wife receives and finally drives her away with his suspicions.|jealousy
        Torn between his mother and his wife, the son delays every decision until both are lost to him.|indecision
        The hero refuses help from anyone, sure he can defeat the monster alone.|pride
        The general sees the throne within reach and breaks his oath to the dying king.|ambition
        The princess believes her sister has stolen the king's love and poisons her cup.|jealousy
        The judge keeps putting off his verdict, and an innocent man dies in prison while he waits.|indecision
        The emperor will not admit that the battle is lost, and he sends thousands more to die.|pride
        Wanting to be the richest man in the city, the merchant cheats his partners one by one.|ambition
        The king imagines that his newborn son is not his own and abandons the child on the mountain.|jealousy
        The duke cannot choose which daughter to trust, and the kingdom falls into war while he wavers.|indecision
        The lord laughs at the old woman who warns him, saying that a man of his rank needs no advice.|pride
        Desperate for her husband to be king, the lady urges him to kill their guest.|ambition
        Seeing his friend promoted over him, the officer begins to spread lies to destroy him.|jealousy
        The prince sees the dagger but hesitates so long that his enemy escapes.|indecision
        The hero believes he is greater than the gods and claims to be one himself.|pride
        The lieutenant betrays his own general to the enemy in return for a command of his own.|ambition
      `,
      {
        pride: L(
          "骄傲",
          "The hero will not listen, bow or admit a mistake, believing himself or herself above others, even the gods.\n\n**Check.** Notice the hero rejecting warnings, refusing help, or placing themselves above others—that arrogance is **pride**.",
          "英雄不肯听劝、不肯低头、不肯认错，自以为高于他人，甚至高于神。\n\n**检验。** 注意英雄拒听忠告、拒绝求助或自视高人一等——这正是**骄傲**。",
          "The fall here does not come from a refusal to listen or to bow.",
          "这里的毁灭并非源于不肯听劝或不肯低头。",
        ),
        ambition: L(
          "野心",
          "The hero reaches for power, rank or fame at any cost, even through betrayal or murder.\n\n**Check.** Look at the prize driving the crime—a crown, wealth, command, or fame pursued ruthlessly—pointing to **ambition**.",
          "英雄不惜任何代价追逐权力、地位或名声，甚至背叛或杀人。\n\n**检验。** 看驱动恶行的目标——王位、财富、权柄或声名——这指向**野心**。",
          "The fall here does not come from a hunger for power or rank.",
          "这里的毁灭并非源于对权力或地位的渴求。",
        ),
        jealousy: L(
          "嫉妒",
          "The hero believes the worst of a loved one or a rival and acts on that suspicion.\n\n**Check.** Spot the suspicion or envy aimed at a spouse, sibling, or promoted friend—that destructive suspicion is **jealousy**.",
          "英雄把所爱的人或对手往最坏处想，并根据这种猜疑采取行动。\n\n**检验。** 认出针对伴侣、手足或同僚的猜忌与妒恨——这正是**嫉妒**。",
          "The fall here does not come from suspicion or envy of another person.",
          "这里的毁灭并非源于对他人的猜疑或妒忌。",
        ),
        indecision: L(
          "优柔寡断",
          "The hero cannot make up his or her mind, and the delay lets disaster arrive.\n\n**Check.** Notice that *failing to act in time*—hesitating, wavering, putting off a choice—brings the catastrophe, confirming **indecision**.",
          "英雄下不了决心，这种拖延让灾难降临。\n\n**检验。** 注意酿成灾祸的根源是*迟迟不决*（犹豫、摇摆、拖延）——这确认是**优柔寡断**。",
          "The fall here does not come from a failure to decide in time.",
          "这里的毁灭并非源于未能及时做出决定。",
        ),
      },
    ),
    label(
      "the-parts-of-the-fall",
      ["The Parts of the Fall", "毁灭的过程"],
      [
        "A tragic fall has recognizable moments. First comes the **fatal choice**, when the flaw leads the hero to a decision that cannot be undone. Then the **reversal**, when the hero's fortune turns, often because of that choice, from good to bad. Next the **recognition**, when the hero finally sees the truth about the situation or about himself or herself, usually too late. Last comes the **catharsis**, the release of pity and fear that the audience feels at the end.\n\n> **Watch out.** Separate **the reversal** (outer fortune flipping from high to low) from **the recognition** (the hero's *mind* finally grasping the truth) and **the catharsis** (what the *audience* feels at the end).",
        "悲剧性的毁灭有几个可辨认的时刻。首先是**致命的选择**：缺陷使英雄做出无法挽回的决定。然后是**逆转**：英雄的命运由好变坏，往往正是因为那个选择。接着是**认识**：英雄终于看清了处境或自己的真相，通常已为时太晚。最后是**净化**（catharsis）：观众在结尾感受到的怜悯与恐惧得到释放。\n\n> **注意。** 分清**逆转**（外在境遇由盛转衰）、**认识**（英雄*内心*终于醒悟真相）与**净化**（*观众*在结尾产生的情感释放）。",
      ],
      ["Which moment of the tragic fall is this?", "这是悲剧性毁灭中的哪个时刻？"],
      `
        Ignoring every warning, the king orders the old prophet thrown out of the city.|the fatal choice
        Within a day, the victorious general has lost his army, his title and his family's love.|the reversal
        Holding the letter, the king realizes that the son he banished was the only one who loved him.|the recognition
        As the curtain falls on the dead hero, the audience leaves shaken, pitying him and fearing a fall like his.|the catharsis
        Driven by ambition, the soldier draws his dagger and enters the sleeping king's room.|the fatal choice
        The man who was once the most powerful in the land is now a hunted exile.|the reversal
        Too late, the general understands that the servant he trusted lied to him all along.|the recognition
        Watching the queen weep over her children, the audience feels both sorrow and terror.|the catharsis
        In a fit of jealousy, the husband refuses to listen to his wife's pleas and orders her locked away.|the fatal choice
        The proud champion, who never lost a fight, lies wounded and alone outside the city walls.|the reversal
        The prince sees at last that his delay has killed everyone he meant to save.|the recognition
        The ending leaves the audience emptied of fear and pity, as if a storm had passed.|the catharsis
        Against all advice, the captain decides to sail into the storm to win the race.|the fatal choice
        The ruler's allies turn against him one by one, and his kingdom crumbles.|the reversal
        The king learns that the stranger he killed on the road was his own father.|the recognition
        Seeing the hero's ruin, the audience feels pity for him and fear for themselves.|the catharsis
        Unable to forgive, the father disowns his only daughter.|the fatal choice
        The rich merchant wakes to find his ships sunk and his creditors at the door.|the reversal
        Holding her dying sister, the princess understands that her jealousy was based on a lie.|the recognition
        The last scene, with the empty throne, brings the audience a strange calm after so much pain.|the catharsis
        The general accepts the witches' promise and begins to plan a murder.|the fatal choice
        The beloved leader becomes, in a single scene, a prisoner in chains.|the reversal
        The scientist sees that her own pride caused the disaster she blamed on others.|the recognition
        The audience weeps for the lovers and leaves thinking about how quickly hatred can destroy.|the catharsis
        Refusing to bow to the new law, the hero decides to bury his brother anyway.|the fatal choice
        The famous actor, once cheered by thousands, ends the play forgotten and poor.|the reversal
        The old king, blind and broken, finally sees which of his children was faithful.|the recognition
        The final silence of the play leaves the audience moved and strangely cleansed.|the catharsis
        The prince chooses to trust the false friend rather than his loyal brother.|the fatal choice
        Within one act, the bride becomes a widow and the heir becomes a beggar.|the reversal
      `,
      {
        "the fatal choice": L(
          "致命的选择",
          "Driven by the flaw, the hero makes a decision that cannot be undone and that sets the fall in motion.\n\n**Check.** Look at where this moment sits in the tragedy: the hero is actively taking an irreversible step that triggers the downfall, rather than suffering the fallout or realizing the truth afterward.",
          "在缺陷的驱使下，英雄做出了无法挽回、引发毁灭的决定。\n\n**检验。** 看这一刻在悲剧中的位置：英雄正主动迈出无法挽回的一步、引爆灾祸，而不是事后承受后果或醒悟真相。",
          "This is not the decision that sets the fall in motion.",
          "这不是引发毁灭的那个决定。",
        ),
        "the reversal": L(
          "逆转",
          "The hero's fortune turns from good to bad: power, love or safety is lost.\n\n**Check.** Compare the hero's outer position before and after: status, power, or safety flips from high to low, which marks **the reversal**.",
          "英雄的命运由好变坏：失去了权力、爱或安全。\n\n**检验。** 对照英雄前后的境遇落差：地位、权力或安稳由高跌落到低谷，这就是**逆转**。",
          "This moment is not the turn of the hero's fortune from good to bad.",
          "这一刻并不是英雄命运由好转坏的转折。",
        ),
        "the recognition": L(
          "认识",
          "The hero finally sees the truth about the situation or about himself or herself, usually too late to change things.\n\n**Check.** Notice that the shift happens inside the hero's mind: the truth that was hidden before finally becomes clear, even though it is too late to undo the harm.",
          "英雄终于看清了处境或自己的真相，通常已来不及改变什么。\n\n**检验。** 注意转折发生在英雄的认知里：先前蒙蔽他的真相终于大白，尽管已经来不及挽回。",
          "This moment is not the hero's late discovery of the truth.",
          "这一刻并不是英雄迟来的对真相的认识。",
        ),
        "the catharsis": L(
          "净化",
          "The moment is about the audience: the pity and fear they feel at the end, and the release that follows.\n\n**Check.** Check whose reaction is described: **the audience** feels pity, sorrow, fear, and emotional release as the tragedy closes.",
          "这一刻关乎观众：他们在结尾感受到的怜悯和恐惧，以及随之而来的释放。\n\n**检验。** 看这里描写的是谁的反应：**观众**在终场时感受到的怜悯、恐惧与情感释放，正是**净化**。",
          "This moment is about the hero's actions or fortune, not the audience's feelings at the end.",
          "这一刻说的是英雄的行动或命运，而不是观众在结尾的感受。",
        ),
      },
    ),
  ],
});

const theme = topic("reading", {
  id: "how-a-theme-develops",
  title: ["How a Theme Develops", "主题如何发展"],
  summary: [
    "How a theme emerges and grows over a whole text, through a character's changes, repeated images, conflicts and the ending, and how to state it as a full idea.",
    "主题如何在整篇作品中通过人物的变化、反复出现的意象、冲突和结尾逐渐浮现并发展，以及如何把它表述为一个完整的观点。",
  ],
  intro: [
    "A single word like *'loyalty'* is only a topic; a complete idea like *'Blind loyalty can trap people into defending what they know is wrong'* is a **theme**. Tracking how character growth, recurring symbols, conflicts, and endings build that idea turns reading into interpretation.",
    "单一个词“忠诚”只是话题；一句完整的观点“盲目的忠诚会让人陷入明知错误却仍要维护的困境”才是**主题**。追踪人物变化、反复意象、冲突和结尾如何步步托出这一观点，阅读就升华为阐释。",
  ],
  after: ["theme", "tracking-a-central-idea"],
  points: [
    label(
      "where-the-theme-grows",
      ["Where the Theme Grows", "主题在哪里发展"],
      [
        "A **theme** is not stated once and left; it grows across a whole text. It grows through **a character's change**, when what a character learns points to the idea. It grows through **a repeated image or symbol**, returning in new forms. It grows through **a conflict** between characters or ideas that tests it. And it is often sealed by **the ending**, whose final image or event shows what the story has been saying.\n\n> **Watch out.** Do not pick **the ending** just because a sentence mentions the last chapter—if it contrasts who a character was *at the start* with who they became *at the end*, it is **a character's change**; **the ending** zooms in on the closing scene or final line itself.",
        "**主题**不是说一次就完了，而是贯穿整部作品逐渐发展。它通过**人物的变化**发展：人物学到的东西指向这个观点。它通过**反复出现的意象或象征**发展：以新的形式一再出现。它通过**冲突**发展：人物之间或观念之间的冲突检验着它。它常常由**结尾**确定：最后的意象或事件表明故事一直在说什么。\n\n> **注意。** 不要一看到“最后一章”就选**结尾**——如果句子对照的是人物*开头与结尾的变化*，选**人物的变化**；**结尾**指的是终场画面或最后一行本身。",
      ],
      ["Through which element does this detail develop the theme?", "这个细节通过什么元素发展主题？"],
      `
        The selfish boy of the first chapter shares his last meal with a stranger in the last.|a character's change
        A locked door appears in the first scene, a locked diary in the middle and an open window at the end.|a repeated image
        The two brothers argue through the whole novel over whether loyalty to family comes before the law.|a conflict
        The story closes with the old enemies planting a tree together.|the ending
        At first Mara mocks the old customs; by the end she is teaching them to her own daughter.|a character's change
        Birds in cages appear again and again, until the heroine finally opens the last cage.|a repeated image
        The mayor wants to build the dam; the farmers want to keep their land; the town splits over the meaning of progress.|a conflict
        The last image is of the empty house with its lights still on, waiting for someone who will never return.|the ending
        The proud general learns to ask for help from the soldiers he once ignored.|a character's change
        Rivers run through every chapter: flooding, freezing, carrying away, bringing back.|a repeated image
        A scientist and a priest debate throughout the play whether people can know everything.|a conflict
        The novel ends with the girl reading her grandmother's letters aloud to her own children.|the ending
        The timid clerk becomes the only person brave enough to speak against the factory owner.|a character's change
        The color red returns at every key moment: a red coat, a red letter, red leaves on the grave.|a repeated image
        Two friends spend the story arguing about whether it is better to be safe or to be free.|a conflict
        The final scene shows the prisoner walking out of the gate into the rain, his face lifted to the sky.|the ending
        The girl who hated the city learns to love its noise and its crowds.|a character's change
        Mirrors appear in every chapter, and each time the heroine sees herself a little differently.|a repeated image
        The son wants to leave the farm; the father wants him to stay; the struggle runs to the last page.|a conflict
        The story ends with the war memorial covered in snow, every name hidden.|the ending
        The miser who counted every coin gives away his fortune on the night before he dies.|a character's change
        Bridges are built, crossed and burned throughout the novel.|a repeated image
        The village elders and the young teacher clash again and again over what children should learn.|a conflict
        The play ends with the two families standing silent over the graves of their children.|the ending
        The boy who believed in nothing comes to believe in his friends.|a character's change
        Clocks appear everywhere in the story, ticking, stopped, broken and at last repaired.|a repeated image
        The queen and her advisor argue throughout about whether a ruler should be loved or feared.|a conflict
        The last line describes the hero returning the stolen bread to the baker's door.|the ending
        The judge who never doubted himself begins to question every verdict he has given.|a character's change
        Seeds appear in every part of the poem: planted, buried, waiting and finally sprouting.|a repeated image
      `,
      {
        "a character's change": L(
          "人物的变化",
          "What a character becomes by the end, compared with the start, points to the theme.\n\n**Check.** Compare the character at the start of the story with who that same character becomes by the end: the inner shift carries the theme.",
          "人物在结尾与开头相比变成了什么样，指向了主题。\n\n**检验。** 把同一人物开头与结尾的状态对照起来看：内在的蜕变承载着主题。",
          "The detail is not about how a character changes over the text.",
          "这个细节说的不是人物在作品中的变化。",
        ),
        "a repeated image": L(
          "反复出现的意象",
          "An image or symbol returns in new forms across the text, carrying the idea further each time.\n\n**Check.** Notice a single concrete image or object reappearing across different scenes so each return deepens the meaning.",
          "一个意象或象征以新的形式在作品中反复出现，每次都把观点推进一步。\n\n**检验。** 留意同一个具体意象或物件在不同章节或场景中一再回响，每一次回归都把主题推进一层。",
          "The detail is not an image or symbol that returns across the text.",
          "这个细节不是在作品中反复出现的意象或象征。",
        ),
        "a conflict": L(
          "冲突",
          "A long struggle between characters or ideas tests the theme from both sides.\n\n**Check.** Notice two opposing sides—characters or competing values—locked in a sustained clash that tests the idea throughout the work.",
          "人物之间或观念之间长期的斗争从两方面检验着主题。\n\n**检验。** 注意贯穿全篇的对立两方（人物或价值观念）的长期较量，从正反两面检验主题。",
          "The detail is not a struggle between characters or ideas.",
          "这个细节不是人物之间或观念之间的斗争。",
        ),
        "the ending": L(
          "结尾",
          "The final image or event seals what the story has been saying.\n\n**Check.** Notice the focus on the closing scene, final image, or last line that leaves the reader with the work's parting meaning.",
          "最后的意象或事件确定了故事一直在表达的内容。\n\n**检验。** 注意这里聚焦于终场画面、收尾事件或最后一行，以此定格全篇主旨。",
          "The detail is not the final image or event of the text.",
          "这个细节不是作品最后的意象或事件。",
        ),
      },
    ),
    label(
      "stating-the-theme",
      ["Stating the Theme", "表述主题"],
      [
        "A theme is a **complete idea about life**, stated as a sentence: *Pride can blind people to the love around them.* A **topic** is only a word or a subject (*pride*, *love*). A **plot summary** tells what happens, not what it means. And a **moral command** tells the reader what to do (*Never be proud*), which is narrower than most themes, because literature explores ideas rather than giving orders.\n\n> **Watch out.** Check the grammar of the statement: a bare noun phrase (*Ambition.*) is **a topic**; an imperative (*Never...*, *Always...*, *Do not...*) is **a moral command**; specific story characters (*A king...*, *A sailor...*) make **a plot summary**; a universal declarative sentence is **a theme**.",
        "主题是**关于人生的完整观点**，用一个句子表述：*Pride can blind people to the love around them.* **话题**只是一个词或一个主题领域（*pride*、*love*）。**情节概括**说的是发生了什么，而不是它意味着什么。**道德命令**告诉读者该做什么（*Never be proud*），这比大多数主题都窄，因为文学是在探讨观点，而不是发号施令。\n\n> **注意。** 看句式形态就能一眼区分：光秃秃的名词短语是**话题**；祈使句（*Never...*、*Always...*、*Do not...*）是**道德命令**；讲具体人物经历的是**情节概括**；关于人生的完整陈述句才是**主题**。",
      ],
      ["Is this a statement of a theme, a topic, a plot summary or a moral command?", "这是主题表述、话题、情节概括还是道德命令？"],
      `
        Pride can blind people to the love around them.|a theme
        Pride and love.|a topic
        A proud king banishes his loyal daughter and dies alone.|a plot summary
        Never be too proud to listen to your children.|a moral command
        The search for home can change the searcher more than the home.|a theme
        Journeys.|a topic
        A sailor spends ten years trying to get back to his island.|a plot summary
        Always remember where you come from.|a moral command
        Fear of what is different can turn ordinary people cruel.|a theme
        Prejudice.|a topic
        A town turns against a stranger who arrives during a drought.|a plot summary
        Do not judge people who are different from you.|a moral command
        Growing up means learning that adults can be wrong.|a theme
        Childhood and growing up.|a topic
        A girl discovers that her father lied about the family's past.|a plot summary
        Always question what grown-ups tell you.|a moral command
        Ambition that ignores conscience destroys the person it drives.|a theme
        Ambition.|a topic
        A soldier murders the king to take the throne and is killed in turn.|a plot summary
        Do not let ambition rule you.|a moral command
        Small acts of kindness can outlast great acts of power.|a theme
        Kindness and power.|a topic
        A servant hides a fugitive child while an emperor's army searches the city.|a plot summary
        Be kind to everyone you meet.|a moral command
        People often destroy what they love by trying to control it.|a theme
        Control.|a topic
        A father locks his daughter away to protect her, and she runs away forever.|a plot summary
        Let the people you love be free.|a moral command
        The past cannot be recovered, but it can be understood.|a theme
        Memory and the past.|a topic
      `,
      {
        "a theme": L(
          "主题",
          "It is a complete idea about life, stated as a sentence, that the whole text explores.\n\n**Check.** Verify all three marks: it is a full declarative sentence (not a command or bare noun), and it states a general insight about life rather than one character's plot.",
          "它是关于人生的完整观点，用一个句子表述，整部作品都在探讨它。\n\n**检验。** 核对三条特征：它是完整的陈述句（不是命令或名词短语），而且表达的是关于人生的普遍洞见，而非某个人物的具体情节。",
          "It is not a complete idea about life stated as a sentence.",
          "它不是用一个句子表述的关于人生的完整观点。",
        ),
        "a topic": L(
          "话题",
          "It names only a subject in a word or two; it does not say anything about that subject.\n\n**Check.** Notice there is no verb or complete claim—just a bare subject label.",
          "它只用一两个词说出一个主题领域，并没有就这个领域表达任何观点。\n\n**检验。** 注意这里没有谓语，也没有完整主张，只是一个光秃秃的主题词。",
          "It does more than name a subject in a word or two.",
          "它不只是用一两个词说出一个主题领域。",
        ),
        "a plot summary": L(
          "情节概括",
          "It tells what happens in the story to particular characters, not what the story means about life.\n\n**Check.** Notice that the sentence stays inside one story's specific characters and events instead of stating a broader insight about life.",
          "它讲的是故事中某些人物身上发生了什么，而不是故事对人生意味着什么。\n\n**检验。** 注意这句话停留在某一个故事的具体人物与事件里，没有提炼出更普遍的人生观点。",
          "It does not tell what happens to particular characters in a story.",
          "它说的不是故事中某些人物身上发生的事。",
        ),
        "a moral command": L(
          "道德命令",
          "It tells the reader what to do or not to do, which is narrower than an idea the story explores.\n\n**Check.** Look at the grammatical mood: the sentence issues a command or rule telling the reader how to behave rather than stating an observation about life.",
          "它告诉读者该做或不该做什么，这比故事所探讨的观点要窄。\n\n**检验。** 看句子的语气：它是在发号施令、教人该怎么做，而不是陈述对人生的观察与思考。",
          "It is not an order telling the reader what to do.",
          "它不是告诉读者该做什么的命令。",
        ),
      },
    ),
  ],
});

/** readingTopics9a are the reading topics of the first units of grade 9. */
export const readingTopics9a: readonly TopicDef[] = [wordChoice, time, epics, journey, soliloquy, tragic, theme];
