// Grade 11: reading: motifs that recur through a story, free indirect discourse, the unstated assumptions an argument
// rests on, and two arguments on one issue compared.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const motifs = topic("reading", {
  id: "motifs-in-a-story",
  title: ["Motifs in a Story", "故事中的母题"],
  summary: [
    "How an image, an object, a phrase or an action that returns again and again through a work gathers meaning and points toward its theme.",
    "在作品中反复出现的意象、物件、语句或动作如何积累意义，并指向作品的主题。",
  ],
  intro: [
    "A rusted key left on a windowsill in chapter one is just a detail; when that same key reappears in the attic, in a courtroom, and finally at the bottom of a river, it becomes a **motif**. In this topic, you classify recurring motifs and trace how their shifts point toward a story's theme.",
    "第一章窗台上一把生锈的钥匙只是细节；当这把钥匙在阁楼、法庭和沉入河底时一再出现，它就成了**母题**。本主题带你分辨不同种类的母题，并追踪它的变化如何一步步指向作品主题。",
  ],
  after: ["how-a-theme-develops", "extended-metaphor"],
  points: [
    label(
      "what-kind-of-motif",
      ["What Kind of Motif", "哪一类母题"],
      [
        "A **motif** is an element that **recurs** through a work. A symbol may appear once; a motif returns, and each return adds meaning. Motifs come in several kinds: an **image or object**, such as a green light, a clock or a locked door; a **repeated phrase**, such as a line a character keeps saying; and a **repeated action or situation**, such as a character always leaving at night or every meal ending in a quarrel. To read a motif, list where it appears and ask what changes between the first time and the last.\n\n> **Watch out.** Ask *what* actually repeats: a visible thing (clock, mirror, rain) is **an image or object**, exact spoken or written words in quotes are **a repeated phrase**, and a recurring habit or event is **a repeated action or situation**.",
        "**母题**是在作品中**反复出现**的元素。象征可能只出现一次；母题会一再回来，每次回来都增添意义。母题有几种：**意象或物件**，如一盏绿灯、一只钟或一扇锁着的门；**重复的话语**，如某个人物反复说的一句话；**重复的行动或情境**，如某个人物总是在夜里离开，或每顿饭都以争吵收场。解读母题时，要列出它出现的地方，并问从第一次到最后一次有什么变化。\n\n> **注意。** 盯紧*真正重复的是什么*：看得见摸得着的事物（钟、镜子、雨）是**意象或物件**，引号里反复出现的话语是**重复的话语**，反复发生的举动或场景则是**重复的行动或情境**。",
      ],
      ["What kind of motif does this description show?", "这段描述显示的是哪一类母题？"],
      `
        In every chapter the clock in the hall has stopped at a different hour, and no one in the family winds it.|an image or object
        The broken mirror appears in the bedroom, again in the shop window, and finally in the daughter's hand.|an image or object
        Each time the story moves forward, someone notices the same red scarf caught on the fence.|an image or object
        The locked trunk in the attic is mentioned at the start, at the wedding and at the funeral.|an image or object
        Birds in cages hang in the kitchen, the hotel lobby and the prison office.|an image or object
        The green light across the bay appears at the opening, the middle and the last page.|an image or object
        A single white glove turns up in the coat, the carriage and the court record.|an image or object
        Rain falls at every death in the novel and never at a birth.|an image or object
        The old map of the village is unfolded by each generation and found to be less accurate each time.|an image or object
        A cracked teacup is set out at every holiday, and no one ever drinks from it.|an image or object
        "We'll go next year," the father says every spring, and they never go.|a repeated phrase
        Whenever she is afraid, the girl whispers, "Small steps, small steps."|a repeated phrase
        The old sailor ends every story with "and the sea kept the rest."|a repeated phrase
        "It is not our business," the neighbors say, in the first chapter and again as the house burns.|a repeated phrase
        The mother's letters always close with "Do not come home yet."|a repeated phrase
        "Everything is fine," the narrator tells us, more often as things get worse.|a repeated phrase
        At each turn of the plot, the grandmother repeats, "The river remembers."|a repeated phrase
        "Tomorrow, then," the lovers promise each other, chapter after chapter.|a repeated phrase
        Every speech by the mayor begins, "As I have always said."|a repeated phrase
        The children's song "Round and round the well" is sung at the start and at the drowning.|a repeated phrase
        Each time the family moves, the son buries something in the new garden.|a repeated action or situation
        Every dinner in the novel ends with someone leaving the table in anger.|a repeated action or situation
        Three times the hero is offered a gift, and three times he refuses it.|a repeated action or situation
        The brothers always meet at the train station, never at either of their homes.|a repeated action or situation
        Again and again, the heroine looks out of a window instead of going through a door.|a repeated action or situation
        Each winter the village waits for a stranger to arrive, and each winter one does.|a repeated action or situation
        The narrator keeps counting the steps from her door to the river.|a repeated action or situation
        Whenever a decision must be made, the father goes out to fix the fence.|a repeated action or situation
        In each generation, the eldest daughter leaves home on her eighteenth birthday.|a repeated action or situation
        The soldier writes a letter every night and burns it every morning.|a repeated action or situation
      `,
      {
        "an image or object": L(
          "意象或物件",
          "A thing that can be seen or held returns at several points in the work.\n\n**Check.** Point to the recurring noun itself: it is a physical object or visual image, not a quoted line or a repeated deed.",
          "一个看得见或拿得着的东西在作品的多处反复出现。\n\n**检验。** 圈出反复出现的核心事物：它是具体的物件或可见意象，而不是引用的话语或重复动作。",
          "What returns is not a thing that can be seen or held.",
          "反复出现的不是一个看得见或拿得着的东西。",
        ),
        "a repeated phrase": L(
          "重复的话语",
          "The same words are spoken or written again and again, gaining weight each time.\n\n**Check.** Look for the exact quoted words that return across scenes: the motif lives in that recurring line itself.",
          "同样的话被一再说出或写下，每次都更有分量。\n\n**检验。** 找一找在多个场景里原样复现的引号语句：母题正是这句话本身。",
          "What returns is not a set of words.",
          "反复出现的不是一句话。",
        ),
        "a repeated action or situation": L(
          "重复的行动或情境",
          "Characters do the same thing or meet the same kind of moment again and again.\n\n**Check.** Look at the recurring verb or recurring scene pattern: what repeats is a behavior or situation rather than a single object or line.",
          "人物一再做同样的事，或一再遇到同一类时刻。\n\n**检验。** 看反复出现的动词或场景模式：重演的是一种举动或处境，而不是某件物品或某句台词。",
          "What returns is not something the characters do or a situation they meet.",
          "反复出现的不是人物的行动或所遇到的情境。",
        ),
      },
    ),
    choose(
      "what-the-motif-builds",
      ["What the Motif Builds", "母题构建了什么"],
      [
        "A motif matters because of how it **builds**. Track each appearance and notice the change: a door that is locked, then opened, then torn off suggests growing freedom; a phrase repeated more and more emptily suggests a hope that is dying. The best reading of a motif connects **all** its appearances to a theme, not just the first one, and does not invent a meaning that the text does not support.\n\n> **Watch out.** Reject readings that stay purely literal (such as weather, hobbies, or prices) and readings that contradict the final turn—the right reading accounts for the full arc from first appearance to last.",
        "母题之所以重要，在于它如何**积累**。追踪它每一次出现，注意其中的变化：一扇门先是锁着，然后打开，最后被拆掉，暗示自由在增长；一句话被重复得越来越空洞，暗示希望正在消亡。对母题最好的解读，要把它**所有**的出现都与主题联系起来，而不只是第一次，也不能编造文本不支持的意义。\n\n> **注意。** 排除停留在字面琐事（如天气、爱好、物价）的选项，也排除与结尾转折相反的选项——正确解读必须串起母题从开头到结尾的完整变化轨迹。",
      ],
      ["What does the motif most likely build toward?", "这个母题最可能指向什么？"],
      `
        A caged bird sings in chapter one, falls silent in chapter five, and is set free by the heroine in the last chapter.|the heroine's growing escape from a life that confined her|the author's personal interest in the care and feeding of pet birds, especially songbirds|the heroine's fear of all animals, wild or tame
        The father says "We'll go next year" every spring, and in the last chapter the son says it to his own children.|a hope deferred so long that it is handed down like a habit|a family plan to travel abroad that finally comes true for the whole family in the last chapter|the father's skill at planning long journeys
        The clock in the hall has stopped, and only after the grandmother's death does anyone wind it again.|a family frozen in grief that finally begins to move on|the high cost of repairing old clocks in the village, which no family in the story can afford|the grandmother's dislike of being late for anything
        The mirror is cracked in the first scene, shattered in the middle and missing at the end.|a self-image that breaks apart until it is gone|the bad luck that, according to an old saying, always comes from breaking a mirror|a family's struggle to afford new furniture
        Every dinner ends with someone storming out, until the last dinner, at which no one is left to leave.|a family that quarrels until it has fallen apart|the poor cooking that the family must put up with at every single dinner in the house|the rule that children leave the table first
        Rain falls at every death, but on the day the war ends the sky is clear.|grief that hangs over the story until peace lifts it|the stormy weather typical of the region's climate|the characters' habit of staying indoors when it rains
        The hero refuses a gift three times and finally accepts the fourth, from his enemy.|a pride that breaks only when he learns humility from a rival|his greed, which grows a little larger with each new and more valuable gift that he is offered|the custom of giving gifts at harvest time
        The son buries something in each new garden, and at the end he digs them all up.|a boy who leaves pieces of himself behind and later reclaims his past|the son's growing interest in gardening and plants|the family's need to hide money from thieves
        The heroine looks out of windows all through the book and walks out a door on the last page.|a woman who watches life until she finally steps into it|the beauty of the views of the hills and the river from the windows of the family's house|her fear of open spaces, which grows worse with time
        "Everything is fine," the narrator says, more often as the house falls apart.|a denial that grows louder as the truth grows harder to hide|the narrator's cheerful character, which never changes|a series of accurate reports on the state of the house
        The soldier writes a letter every night and burns it, until the night he finally sends one.|feelings held back until he dares to share them|the shortage of paper and ink at the front|the army's strict rules on writing home
        The old map is less accurate with each generation, and the last child draws a new one.|a changing world that each generation must chart for itself|the poor quality of the printing in the village, which gets worse as its old machines wear out|the family's habit of getting lost in town
        The children's song is sung happily at the start and silently mouthed at the drowning.|innocence turned to grief by a loss the children cannot speak of|the popularity of folk songs among village children|the music lessons the children take at school
        The locked trunk appears at the start, the wedding and the funeral, and is never opened.|a family secret that shapes every event but is never faced|the family's fondness for collecting old furniture|a treasure the characters search for and finally find
        The mayor begins every speech "As I have always said," while changing his position each time.|a politician whose claims of consistency hide his shifting views|the mayor's excellent memory for every word that he has said in every speech he has ever given|the town's preference for short speeches
        The cracked teacup is set out at every holiday, and at the last one the youngest child drinks from it.|a missing family member honored until the family can move on|the family's lack of money to buy new dishes, cups and plates for their holiday meals|the youngest child's love of hot tea
        The green light glows across the bay through the novel, and at the end the hero realizes it was only a dock light.|a dream that seemed magical until it was seen plainly|the importance of good lighting at the docks for the safety of boats arriving at night|the hero's career as a harbor engineer
        The brothers always meet at the train station and, in the last chapter, finally visit each other's homes.|a distance between the brothers that closes at last|the brothers' shared love of trains and travel|the cost of houses in the brothers' city
        The grandmother's line "The river remembers" is spoken last by the town after the flood.|a history of wrongs that the town is finally forced to face|the grandmother's knowledge of river fishing|the importance of keeping records of the weather
        Each winter a stranger arrives, and in the final winter the narrator herself is the stranger in a new village.|the outsider's experience, which the narrator comes to share|the village's cold winters and heavy snowfall|the narrator's love of meeting new people
        A white glove turns up in the coat, the carriage and the court record, each time closer to the murderer.|a clue that slowly closes in on the guilty|the fashion for gloves among the rich of the time|a glove maker's rise to fame in the city
        The mother's letters say "Do not come home yet" until the last one says "Come home."|a danger or shame at home that finally passes|the high price of train tickets at the time, which kept many families apart for years|the mother's busy schedule at work
        The candle in the sickroom burns lower in each chapter and goes out on the night the patient dies.|a life slowly running out until it ends|the family's poverty, which forces them to buy only the cheapest candles sold in the village shop|the patient's fear of the dark at night
        The girl's shoes are always too big for her, until the last chapter, when they fit.|a child growing into the life and the role that were handed to her|the family's habit of buying shoes from the market without trying them on first|the girl's dislike of walking to school
        The river is a barrier between the two villages in the first chapters and a bridge of ice in the last.|a division between two peoples that is finally crossed|the dangers of skating on a frozen river in late winter, when the ice is thin|the villages' trade in fish from the river
        The orchestra plays the same waltz at the first ball, the wedding and the empty hall after the war.|a lost world remembered in the music that outlived it|the popularity of one waltz with every orchestra in the country during the years before the war|the bride's love of dancing at balls
        Each time the boy lies, the narrator mentions the ticking of his father's watch; at the end the boy gives the watch away.|a guilty conscience the boy finally frees himself from|the boy's interest in fixing watches and clocks, which later becomes his trade as a grown man|the father's habit of being on time
        The garden is wild at the start, trimmed in the middle and wild again when the family leaves.|a family's brief control over a place that outlasts them|the cost of hiring gardeners in the town, which rose sharply during the years the family lived there|the family's love of flowers and plants
        The phrase "after the harvest" is used for every promise, and the harvest fails in the last chapter.|promises that rest on a future that never comes|the farmers' careful planning of their work for the busy weeks of the harvest season each year|the village's success at growing wheat
        The poet's notebook is blank in the first scene, full by the middle and burned at the end.|a voice that is found and then silenced|the poet's habit of buying a new notebook at the start of each year from the same small stationer's shop|the poet's love of fires in winter
      `,
      (right) => [
        `The appearances of the motif change in a way that points to ${right}.\n\n**Check.** Compare the motif's *opening state* with its *closing state*: only this interpretation explains the full arc across every appearance rather than treating the detail literally.`,
        `母题的每次出现都在变化，指向这一点：${right}。\n\n**检验。** 对比母题*最初*与*最后*的状态：只有这一解读完整解释了它的演变轨迹，没有停留在字面细节上。`,
      ],
      [
        [
          "That reading takes the motif literally and ignores how it changes through the work.",
          "这种解读只看母题的字面意思，忽视了它在作品中的变化。",
        ],
        ["That reading goes against what the appearances of the motif actually show.", "这种解读与母题各次出现实际显示的情况相反。"],
      ],
    ),
  ],
});

const indirect = topic("reading", {
  id: "free-indirect-discourse",
  title: ["Free Indirect Discourse", "自由间接引语"],
  summary: [
    "How a third-person narrator slips into a character's own thoughts and words without quotation marks, and how to tell the character's voice from the narrator's.",
    "第三人称叙述者如何不加引号地滑入人物自己的思想和话语，以及如何分辨人物的声音和叙述者的声音。",
  ],
  intro: [
    "Read *The train was late again. Of course it was!*: the pronoun and tense belong to a third-person narrator, yet the exasperation belongs unmistakably to the character. In this topic, you distinguish free indirect discourse from direct and reported thought and tell whose judgment a passage reveals.",
    "读一读 *The train was late again. Of course it was!*：人称和时态属于第三人称叙述者，但那股不耐烦显然来自人物本人。本主题带你区分直接思想、转述思想与自由间接引语，并辨明字里行间究竟是谁的判断。",
  ],
  after: ["unreliable-narrators"],
  points: [
    label(
      "whose-voice",
      ["Whose Voice", "谁的声音"],
      [
        "A third-person story can present a character's thoughts in three ways. **Direct thought** quotes the thought in the first person, often in italics or quotation marks: *She thought, \"I can't stay here.\"* **Reported thought** tells us what the character thought, in the narrator's words, with a verb such as *thought* or *wondered*: *She thought that she could not stay.* **Free indirect discourse** blends the two: it stays in the third person and the past tense, but uses the character's own words, feelings and exclamations, with no verb of thinking: *She couldn't stay here. Not another night!*\n\n> **Watch out.** Check two quick markers: quotation marks with *I* signal **direct thought**, a thinking verb (*thought that*, *wondered whether*, *realized that*) signals **reported thought**, and third-person past tense carrying live questions or exclamations with *no* thinking verb signals **free indirect discourse**.",
        "第三人称故事可以用三种方式呈现人物的想法。**直接思想**用第一人称引出想法，常用斜体或引号：*She thought, \"I can't stay here.\"* **转述思想**用叙述者的话告诉我们人物想了什么，带有 *thought*、*wondered* 之类的动词：*She thought that she could not stay.* **自由间接引语**融合了二者：它保持第三人称和过去时，但用人物自己的措辞、情感和感叹，且没有表示思考的动词：*She couldn't stay here. Not another night!*\n\n> **注意。** 抓两个快速标记：引号配第一人称 *I* 是**直接思想**，带思考动词（*thought that*、*wondered whether*、*realized that*）是**转述思想**，第三人称过去时却直接冒出人物的感叹或反问且*没有*思考动词，则是**自由间接引语**。",
      ],
      ["How is the character's thought presented?", "人物的想法是以什么方式呈现的？"],
      `
        He thought, "I should never have trusted her."|direct thought
        "What a fool I've been," she said to herself.|direct thought
        Tom wondered, "Will they ever forgive me?"|direct thought
        "This is my last chance," Maria thought as she knocked.|direct thought
        The old man thought, "The sea has beaten me."|direct thought
        "I won't cry," the girl told herself.|direct thought
        She thought, "Why does nobody listen?"|direct thought
        "Run," he thought. "Run now."|direct thought
        "Perhaps he loves me after all," Emma mused.|direct thought
        "It's hopeless," the captain thought.|direct thought
        He thought that he should never have trusted her.|reported thought
        She wondered whether they would ever forgive her.|reported thought
        Maria believed that this was her last chance.|reported thought
        The old man felt that the sea had beaten him.|reported thought
        The girl decided that she would not cry.|reported thought
        He realized that he had to leave at once.|reported thought
        Emma suspected that he loved her after all.|reported thought
        The captain thought that the voyage was hopeless.|reported thought
        She asked herself why nobody ever listened.|reported thought
        Tom knew that he had made a terrible mistake.|reported thought
        He should never have trusted her. Never!|free indirect discourse
        Would they ever forgive her? How could they, after all that?|free indirect discourse
        This was her last chance, and she was going to take it.|free indirect discourse
        The sea had beaten him. Well, let it.|free indirect discourse
        She would not cry. Not in front of them, anyway.|free indirect discourse
        Why did nobody ever listen? It was maddening.|free indirect discourse
        Perhaps he loved her after all. Perhaps.|free indirect discourse
        Oh, it was hopeless, the whole wretched voyage!|free indirect discourse
        What a fool he had been, what an utter fool!|free indirect discourse
        Run. He had to run, now, before they saw him.|free indirect discourse
      `,
      {
        "direct thought": L(
          "直接思想",
          "The thought is given in the character's own first-person words, set off by quotation marks or a tag such as he thought.\n\n**Check.** Spot the quotation marks and first-person pronoun (*I* / *my*): the character's exact inner speech is quoted verbatim.",
          "想法用人物自己的第一人称话语给出，用引号或 he thought 之类的标记隔开。\n\n**检验。** 句中既有引号又有第一人称代词（*I* / *my*），说明这是原样引出人物的内心独白。",
          "The thought is not quoted in the character's first-person words.",
          "想法没有用人物的第一人称话语引出来。",
        ),
        "reported thought": L(
          "转述思想",
          "A verb such as thought, wondered or realized reports the thought in the narrator's own words.\n\n**Check.** Find the reporting verb (*thought*, *wondered*, *believed*, *realized*) followed by a *that/whether/why* clause: the narrator is summarizing the thought from the outside.",
          "用 thought、wondered、realized 之类的动词，以叙述者自己的话转述想法。\n\n**检验。** 句中带有表示思考的动词（如 *thought*、*wondered*、*realized*）加从句，说明是叙述者在外部转述。",
          "No verb of thinking reports the thought in the narrator's words.",
          "没有用表示思考的动词以叙述者的话转述想法。",
        ),
        "free indirect discourse": L(
          "自由间接引语",
          "The sentence stays in the third person and past tense but carries the character's own feelings, questions and exclamations, with no verb of thinking.\n\n**Check.** Notice what is missing and what is present: no quotation marks and no thinking verb, yet the sentence keeps third-person past tense while echoing the character's raw voice.",
          "句子保持第三人称和过去时，却带着人物自己的情感、疑问和感叹，没有表示思考的动词。\n\n**检验。** 核对“缺什么、有什么”：既无引号也无思考动词，却在第三人称过去时里直接流露人物的语气与感叹。",
          "The thought is either quoted directly or reported with a verb of thinking.",
          "想法要么被直接引出，要么用表示思考的动词转述。",
        ),
      },
    ),
    choose(
      "the-narrator-or-the-character",
      ["The Narrator or the Character", "叙述者还是人物"],
      [
        "Free indirect discourse lets a writer show a character's view while seeming to report facts, so a reader must decide **whose** judgment a sentence carries. Look for signs of the character: emotional words, exclamations, questions, slang, or a judgment the narrator would not make. *The new governess was, of course, entirely beneath notice* may sound like the narrator, but the snobbery belongs to the character. Writers use this to create **irony**: we see the character's view and its limits at the same time.\n\n> **Watch out.** Do not mistake biased free indirect discourse for *the narrator's reliable report*—exclamations, *of course*, rhetorical questions, and defensive excuses expose the **character's** inner attitude, not objective fact.",
        "自由间接引语让作者在看似陈述事实的同时呈现人物的看法，所以读者必须判断一句话承载的是**谁**的判断。要寻找人物的痕迹：带情感的词、感叹、疑问、俚语，或叙述者不会下的判断。*The new governess was, of course, entirely beneath notice* 听起来像叙述者的话，但其中的势利属于人物。作者用这种手法制造**反讽**：我们同时看到人物的看法和它的局限。\n\n> **注意。** 不要把带偏见的自由间接引语误当成“叙述者可靠的事实报道”——感叹号、*of course*、反问和自我辩解暴露的都是**人物**的内心态度，而不是客观事实。",
      ],
      ["What does the passage most likely reveal?", "这段话最可能揭示了什么？"],
      `
        Lady Ann looked at the new maid. A farmer's girl, of course, and hardly worth a word.|Lady Ann's snobbery, shown through her own view of the maid|the narrator's honest and reliable judgment that the new maid is worthless and not worth a word|a fact about the maid's poor work in the house
        Jim finished his third drink. He was fine, perfectly fine, and anyone who said otherwise was jealous.|Jim's denial of a drinking problem, in his own defensive voice|the narrator's reliable report that Jim is sober and healthy and that his friends are jealous of him|the jealousy of Jim's friends, stated as a fact
        The boss praised Ella's report. Well! Finally someone in this office had eyes.|Ella's delight and her low opinion of her coworkers|the narrator's own view that all of the office staff except Ella are blind to good work|a neutral summary of the boss's comments on the report
        Mr. Hale counted his coins again. The beggars in this town were a plague; why should he give them a penny?|Mr. Hale's meanness, voiced in his own resentful thoughts|the narrator's factual account of a terrible disease that has spread through the beggars of the town|the beggars' opinion of Mr. Hale's wealth
        She read the letter twice. He was coming back! He had not forgotten her after all!|her joy and relief, carried in her own exclamations|the narrator's calm statement of a travel plan|the writer of the letter's feelings about her
        The general studied the map. The enemy were cowards and would run at the first shot.|the general's overconfidence, which the story may soon expose|the narrator's reliable report on the enemy's courage|a military fact that the rest of the story confirms
        Anna glanced at her sister's new dress. Yellow, at her age. Really.|Anna's scorn for her sister's choice, in her own tone|the narrator's opinion on the fashions of the day|a description of the dress with no judgment in it
        The boy stood at the edge of the pool. It was only water. Only water. Why couldn't he move?|the boy's fear, as he tries and fails to talk himself out of it|the narrator's explanation of how swimming pools work|the boy's confidence that he can swim well
        The professor closed the student's essay. Another one who had read nothing, of course.|the professor's weary contempt, in his own thoughts|the narrator's proof that the student did not read|the student's honest view of her own essay
        Martha hung up the phone. So her son was too busy to visit. Too busy! For his own mother!|Martha's hurt and anger at her son, in her own voice|the narrator's report that the son works long hours|the son's reasons for not visiting, stated fairly
        The mayor looked at the crowd. These people were lucky to have him, and they knew it.|the mayor's vanity, which the narrator lets us see through|the narrator's reliable judgment that the mayor is a popular leader whom the people are lucky to have|a fact about the size of the crowd that day
        Eliza lifted the heavy tray. She could manage. She had always managed, hadn't she?|Eliza's stubborn pride and the doubt beneath it|the narrator's statement that the tray was light|a description of Eliza's past jobs in other houses
        The clerk smiled at the rich customer. Such a gentleman, and so generous with his tips!|the clerk's flattering view, colored by the tips|the narrator's balanced portrait of the customer|the customer's view of the clerk's service
        Henry looked at the storm. Nonsense, a little wind never hurt anyone. They would sail at dawn.|Henry's reckless dismissal of a real danger|the narrator's forecast of calm weather at dawn|the crew's agreement that the storm is harmless
        Grace watched the new girl laugh with her friends. Showing off, as usual. Some people.|Grace's jealousy, voiced as if it were a fair judgment|the narrator's report that the new girl is vain|the friends' opinion of the new girl's laugh
        The old soldier read the headline. Heroes, they called them now. Heroes!|the soldier's bitterness at the word, in his own voice|the narrator's agreement that the soldiers were heroes|a neutral report on the newspaper's front page
        Peter tasted the soup his wife had made. Salty again. Did she never learn?|Peter's irritation with his wife, in his own grumbling tone|the narrator's reliable report that the soup was far too salty and that his wife had never learned to cook|the wife's pride in her cooking
        The duchess glanced at the guests. Merchants and their wives, in her drawing room! What next?|the duchess's contempt for the merchants, in her own outrage|the narrator's careful account of who came to the party and of what each guest was wearing that evening|the merchants' pleasure at being invited
        Leo stared at the test. He knew this. He had studied all night. Why was his mind blank?|Leo's panic as his memory fails him|the narrator's report that Leo had not studied at all and that the questions on the test were unfair|the teacher's view of how hard the test is
        The landlord read the tenant's letter. Another complaint about the heating. As if he were made of money.|the landlord's stinginess, voiced as self-pity|the narrator's fair summary of the cost of heating a building in winter and of what landlords must pay|the tenant's polite request, stated neutrally
        Clara watched her rival take the stage. That dress, that voice. The judges would see through her.|Clara's envy, dressed up as confidence in the judges|the narrator's reliable prediction that the judges will mark the rival down for her dress and her voice|the rival's nervousness on the stage
        Sam looked at the dark road ahead. Nothing to be afraid of. Just trees. Just the wind.|Sam's fear, as he tries to calm himself|the narrator's description of a quiet road on a calm night with nothing dangerous anywhere along it|Sam's knowledge of the local wildlife
        The judge regarded the young man in the dock. Another idler from the docks, no doubt.|the judge's prejudice, formed before the trial|the narrator's reliable statement that the young man is lazy and guilty and that he works at the docks|the young man's account of his own work
        Rosa opened the gift from her aunt. Socks. Of course it was socks.|Rosa's disappointment, in her own weary tone|the narrator's list of the gifts that Rosa received from each member of her family that year|the aunt's thoughtful choice of a gift
        The colonel heard the news of the defeat. Impossible. His men did not lose. Someone had lied.|the colonel's refusal to accept the truth|the narrator's proof that a messenger had lied to the colonel about the result of the battle|the soldiers' relief that the war is over
        Nina saw the email from her old friend. So now she remembered Nina existed. How convenient.|Nina's resentment at being forgotten, in her own sarcastic voice|the narrator's report that the friend writes only when she needs a favor from someone|the friend's reasons for writing, stated fairly
        The prince surveyed his kingdom from the tower. All of it his. And every peasant grateful for it.|the prince's pride and his blindness to his people|the narrator's reliable statement that the peasants of the kingdom were grateful for their prince|a description of the view from the tower with no judgment in it
        Ben dropped the plate. It wasn't his fault. The floor was wet, and who had left it wet?|Ben's quick excuses as he shifts the blame|the narrator's explanation that someone else had left the kitchen floor wet that morning|the family's anger at the broken plate
        The headmistress watched the girls whispering. Plotting something, the little wretches.|the headmistress's suspicion and dislike of the girls|the narrator's reliable report that the girls are plotting against the headmistress and her school|the girls' innocent topic of conversation
        Victor counted the votes once more. He had won. He had really won! They could laugh now, all of them.|Victor's triumph and his old hurt at being mocked|the narrator's neutral report on the result of the vote and the number of ballots counted|the opponents' gracious acceptance of the result
      `,
      (right) => [
        `The emotional words, exclamations or judgments belong to the character, so the passage reveals ${right}.\n\n**Check.** Trace the charged words or punctuation after the opening sentence: they mirror the character's own mindset rather than an impartial narrator's statement of fact.`,
        `带感情的词、感叹或判断属于人物，所以这段话揭示的是：${right}。\n\n**检验。** 追查首句之后带情绪的措辞和标点：它们映照的是人物自身的心态，而不是客观叙述者的事实陈述。`,
      ],
      [
        [
          "That answer treats the character's judgment as if it were the narrator's reliable report.",
          "这个答案把人物的判断当成了叙述者可靠的陈述。",
        ],
        [
          "That answer gives the view to the wrong person or ignores the feeling in the passage.",
          "这个答案把看法归给了错误的人，或忽视了段落中的情感。",
        ],
      ],
    ),
  ],
});

const assumptions = topic("reading", {
  id: "unstated-assumptions",
  title: ["Unstated Assumptions", "未言明的假设"],
  summary: [
    "Finding the belief an argument takes for granted without saying it, and judging whether the argument still stands if that belief is false.",
    "找出论证中未明说却被视为理所当然的信念，并判断如果这个信念是错的，论证是否还站得住。",
  ],
  intro: [
    "Saying *This café must serve great food—there's always a line outside* skips a silent bridge: that a long line proves quality rather than hype or location. In this topic, you uncover the hidden assumption linking reason to claim and test how well it holds up.",
    "说“这家咖啡馆的菜肯定好吃，门口总排长队”，中间跳过了隐含的一环：排长队就等于品质好（而不是网红跟风或地段使然）。本主题带你挖出连接理由与主张的未言明假设，并检验它是否站得住脚。",
  ],
  after: ["evaluating-an-argument-as-a-whole", "supported-and-unsupported-claims"],
  points: [
    choose(
      "the-missing-link",
      ["The Missing Link", "缺失的一环"],
      [
        "An **assumption** is a belief that an argument needs but does not state. It is the missing link between the evidence and the claim. *The school should ban phones, because students who use phones in class get lower grades* assumes that the phones **cause** the lower grades, and that a ban would stop the use. To find an assumption, ask: what must be true for this reason to support this claim?\n\n> **Watch out.** Test your candidate by imagining it is **false**: if negating it breaks the bridge between the reason and the claim, you have found the unstated assumption; side details leave the argument untouched.",
        "**假设**是论证需要却没有说出来的信念，是证据和主张之间缺失的一环。*The school should ban phones, because students who use phones in class get lower grades* 假定手机**导致**了成绩下降，而且禁令能阻止使用。要找出假设，就问：要让这个理由支持这个主张，什么必须为真？\n\n> **注意。** 把候选选项反向假设为“不成立”来检验：一旦推翻它，理由到主张的桥梁就立刻断裂，那就是未言明的假设；无关细节推翻与否都不会影响论证。",
      ],
      ["What does the argument assume without saying?", "这个论证没有明说却假定了什么？"],
      `
        We should hire Ms. Park; she has the most years of experience of any applicant.|that more experience makes for a better employee|that Ms. Park has applied for several other jobs|that none of the other applicants for the job has had any experience of this kind of work at all
        The town should build a new highway, because traffic on the old road is heavy.|that a new road will reduce traffic rather than draw more cars|that the old road through the town was built many years ago and is now in need of repairs|that traffic is heavy only on weekends
        This diet must work; thousands of people have bought the book.|that buying a book shows the diet in it is effective|that the book has been translated into many languages and is sold in bookshops in many countries|that most diets are expensive to follow
        We should cut the art program, since few graduates become artists.|that art is only worth teaching to those who become artists|that the school has no money for sports either|that the graduates of the school rarely, if ever, visit art museums or galleries after they leave
        The new mayor must be honest; she grew up in our town.|that people from our town are more honest than others|that the mayor has lived away from town for years|that the town has had a number of dishonest mayors before, some of whom were later sent to prison
        Video games cause violence, since many violent teens play them.|that playing the games came first and led to the violence|that video games are expensive to buy|that most teenagers own a game console
        We should trust this study, because it was published last year.|that a recent study is a reliable one|that the study took several years to complete|that older studies agreed with this one
        The team should keep the coach; they won the championship under him.|that the coach was the reason for the win|that the championship was held in another city|that the coach has won few games in the past
        The factory must be polluting the river; fish began dying after it opened.|that the factory, not something else, caused the deaths|that the river is the longest in the region|that the fish were sold in local markets
        Students should do more homework, because students in top countries do more.|that the homework is what makes those students do well|that top countries have longer school years|that students dislike doing homework
        This restaurant is excellent; it is always crowded.|that a crowded restaurant must serve excellent food|that the restaurant is open late at night|that the prices are lower than elsewhere
        We should lower the voting age, since young people care about politics.|that caring about politics is enough to qualify a person to vote|that young people vote less than older people do|that the voting age has never been changed
        The medicine is safe; it is made from natural plants.|that natural things cannot be harmful|that the plants grow only in warm climates|that the medicine is cheaper than others
        Crime fell after the new police chief arrived, so she should get a raise.|that the chief's work, not other changes, made crime fall|that the chief arrived from another city|that crime had been rising for years before
        Reading on screens is harmful; people read on paper for centuries.|that what has long been done is better than anything new|that paper books are expensive to print|that screens use a great deal of power
        Our product is the best, since it costs the most.|that a higher price shows higher quality|that other products are sold in more stores|that customers rarely compare prices
        We should ban the novel; one parent complained about it.|that one complaint represents what most families think|that the novel was written long ago|that the parent has not read the whole novel
        He will make a fine leader, because he is a brilliant speaker.|that speaking well is the same as leading well|that he has given many speeches|that other candidates rarely speak in public
        The plan worked in a small village, so it will work in the capital.|that what works in a small place works the same in a large one|that the village is far from the capital|that the plan was cheap in the village
        We should not worry about the debt; the country has always paid before.|that the past is a sure guide to the future|that the country's debt is smaller than others'|that the debt was taken on during a war
        The library should stay open late, because students say they would like that.|that saying they would like it means students would actually come|that the library has a large collection of books on every subject, including rare old books|that students dislike studying at home
        This painting must be valuable; it is very old.|that age alone makes a painting valuable|that the painting was found in an attic|that old paintings are often damaged by light and damp and must be repaired with great care
        Ms. Lee will be a good principal, because she was a great teacher.|that the skills of teaching are the skills of running a school|that Ms. Lee has taught for many years|that the school has had many principals who left after only one or two years in the job
        The city should build more bike lanes, since cyclists are often hurt on busy roads.|that bike lanes would make cyclists safer|that cycling is cheaper than driving a car|that most of the roads in the city were built long before anyone there owned a bicycle or a car
        This app helps people learn languages; it has millions of downloads.|that downloading an app shows it helps people learn|that the app is free to download|that most people who download an app open it only once and then forget about it after a week
        We should trust the senator on health care; she is a war hero.|that courage in war makes a person an expert on health care|that the senator served for many years|that health care is a difficult issue that has divided the country for many decades now
        Our school's test scores are low, so the teachers must be poor.|that teachers are the only cause of test scores|that the tests were given in the spring|that other schools in the area have higher scores and newer buildings and smaller classes
        The company should move to the city, since most of its customers live there.|that being near customers matters more than other costs|that the city has many restaurants|that the company has been in its present building for a very long time and has outgrown it
        Everyone should drink eight glasses of water a day; my grandmother did and lived to ninety-five.|that one person's long life proves the habit caused it|that the grandmother lived in a village|that water is cheaper than any other drink in most countries of the world today
        The museum should stop charging for entry, because more people would visit.|that more visitors is worth the money the museum would lose|that the museum's collection is large|that most of the visitors to the museum come on weekends and during the long summer holidays
      `,
      (right) => [
        `The reason supports the claim only if it is true ${right.replace(/^that /, "that ")}; the argument never says so.\n\n**Check.** Negate "${right}" and re-read the argument: if that link fails, the stated reason no longer leads to the conclusion.`,
        `只有在这一点成立时，理由才能支持主张：${right}；论证从未明说。\n\n**检验。** 假设“${right}”不成立再重读论证：原理由立刻无法推出结论，证明它正是缺失的一环。`,
      ],
      [
        [
          "That is a detail the argument does not need; the claim would stand or fall the same without it.",
          "论证并不需要这个细节；有没有它，主张的成败都一样。",
        ],
        [
          "That goes beyond the argument or even weakens it, so it is not what the argument takes for granted.",
          "这超出了论证的范围，甚至削弱了论证，所以不是论证视为理所当然的东西。",
        ],
      ],
    ),
    label(
      "is-the-assumption-sound",
      ["Is the Assumption Sound", "这个假设可靠吗"],
      [
        "Once an assumption is found, judge it. A **reasonable** assumption is one most informed readers would accept: *Doctors know more about medicine than most patients.* A **questionable** assumption is one a careful reader could reasonably doubt and the argument should defend: *Anything natural is safe.* Some assumptions are **contradicted by common knowledge**, such as *Price always shows quality* or *Correlation proves cause*; an argument resting on one of these is weak until it gives more support.\n\n> **Watch out.** Separate **questionable** from **contradicted by common knowledge**: a claim that holds sometimes but needs defense (*A popular teacher is effective*) is **questionable**, whereas a sweeping absolute that everyday life readily disproves (*Anything natural is safe*, *Everything printed in a book is accurate*) is **contradicted by common knowledge**.",
        "找出假设后，要评判它。**合理的**假设是大多数有见识的读者都会接受的：*Doctors know more about medicine than most patients.* **可疑的**假设是认真的读者可以合理怀疑、论证应当为之辩护的：*Anything natural is safe.* 有些假设**与常识相矛盾**，如 *Price always shows quality* 或 *Correlation proves cause*；建立在这类假设上的论证在提供更多支持之前都是薄弱的。\n\n> **注意。** 分清**可疑**与**与常识相矛盾**：有时成立但需要论证支撑的说法（如“受欢迎的老师教学一定有效”）属于**可疑**；一棍子打死、日常经验就能直接证伪的绝对断言（如“天然的一定安全”“印在书上的都准确”）则属于**与常识相矛盾**。",
      ],
      ["How sound is this assumption?", "这个假设有多可靠？"],
      `
        People who have trained as pilots can fly a plane better than people who have not.|reasonable
        A person who has read the instructions is more likely to assemble the desk correctly.|reasonable
        Students learn more when they attend class than when they skip it.|reasonable
        A bridge built to modern standards is safer than one built with no standards.|reasonable
        Drivers who are very tired react more slowly than drivers who are rested.|reasonable
        Children need enough sleep to do well in school.|reasonable
        A witness who saw the event is a better source than one who heard about it.|reasonable
        Regular exercise tends to improve health.|reasonable
        Smoke detectors make it more likely that people escape a fire.|reasonable
        A doctor's advice on medicine is generally more reliable than a stranger's.|reasonable
        A good athlete will make a good coach.|questionable
        A plan that worked in one country will work in another.|questionable
        The oldest employee should be the next manager.|questionable
        A new law will be obeyed as soon as it is passed.|questionable
        People always act in their own financial interest.|questionable
        A popular teacher is an effective teacher.|questionable
        A book that won a prize will appeal to all readers.|questionable
        A small rise in test scores shows a new method works.|questionable
        Banning a product will stop people from using it.|questionable
        A famous scientist is an expert in every field of science.|questionable
        Anything natural is safe to eat.|contradicted by common knowledge
        A more expensive product is always better.|contradicted by common knowledge
        If two things happen together, one must cause the other.|contradicted by common knowledge
        Something that has never happened can never happen.|contradicted by common knowledge
        Whatever most people believe must be true.|contradicted by common knowledge
        People who disagree with us must have bad motives.|contradicted by common knowledge
        Everything printed in a book is accurate.|contradicted by common knowledge
        A person who made one mistake cannot be trusted with anything.|contradicted by common knowledge
        Older methods are always better than newer ones.|contradicted by common knowledge
        A rule with one exception is useless.|contradicted by common knowledge
      `,
      {
        reasonable: L(
          "合理",
          "Most informed readers would accept this, so the argument may rely on it without further support.\n\n**Check.** Ask whether the statement uses sensible qualification (*more likely*, *tends to*, *generally*) and aligns with well-established experience: yes, so it is reasonable.",
          "大多数有见识的读者都会接受这一点，所以论证可以不加支持地依靠它。\n\n**检验。** 看这句话是否措辞稳妥、符合公认的日常与专业经验：没有极端绝对化，因此是合理的。",
          "An informed reader could fairly doubt this, so it is not simply reasonable.",
          "有见识的读者可以合理地怀疑这一点，所以它不能简单地算作合理。",
        ),
        questionable: L(
          "可疑",
          "It might be true in some cases, but a careful reader could doubt it, so the argument should defend it.\n\n**Check.** Test whether you can picture realistic exceptions without the statement being universally absurd: because it works only sometimes, it needs evidence.",
          "它在某些情况下可能成立，但认真的读者可以怀疑它，所以论证应当为之辩护。\n\n**检验。** 想想它是否“有时成立、有时不成立”：它并非一眼荒谬，却很容易举出反例，因此必须补充论证。",
          "It is either widely accepted or plainly false, not open to reasonable doubt.",
          "它要么被广泛接受，要么显然错误，并不属于可以合理怀疑的情况。",
        ),
        "contradicted by common knowledge": L(
          "与常识相矛盾",
          "Common experience shows many cases where this is false, so an argument resting on it is weak.\n\n**Check.** Look for sweeping absolutes (*anything*, *always*, *never*, *everything*, *must*) that everyday counterexamples refute immediately.",
          "日常经验表明这在许多情况下是错的，所以建立在它上面的论证是薄弱的。\n\n**检验。** 留意句中极端的绝对词（如 *anything*、*always*、*never*、*everything*、*must*），日常常识立刻就能找到反例推翻它。",
          "Common knowledge does not plainly contradict this.",
          "常识并没有明显地否定这一点。",
        ),
      },
    ),
  ],
});

const comparing = topic("reading", {
  id: "comparing-arguments-on-one-issue",
  title: ["Comparing Arguments on One Issue", "比较同一议题的论证"],
  summary: [
    "Setting two arguments on the same issue side by side to see where they truly disagree: on the facts, on values, or on what to do.",
    "把同一议题的两个论证并列，看它们真正的分歧在哪里：在事实上，在价值观上，还是在该怎么做上。",
  ],
  intro: [
    "Two editorial writers can agree completely that a downtown toll cuts traffic, yet still clash—one ranks shorter commutes first, the other ranks free public streets first. In this topic, you pinpoint whether two arguments divide over facts, values, or action, and judge which side builds the stronger case.",
    "两位评论员可能完全认同市中心收费能减少拥堵，却依然针锋相对——一方把通勤效率排在第一，另一方把道路免费通行排在第一。本主题带你判断两篇论证的分歧究竟在事实、价值观还是行动方案上，并公正评判哪一方论证更有力。",
  ],
  after: ["evaluating-an-argument-as-a-whole", "how-a-speaker-builds-an-argument"],
  points: [
    label(
      "where-they-disagree",
      ["Where They Disagree", "分歧在哪里"],
      [
        "Two writers on the same issue may disagree in different ways. They may disagree about **the facts**: what is true or what will happen (*the new dam will or will not harm the fish*). They may agree on the facts but disagree about **values**: what matters more (*jobs matter more than the river* against *the river matters more than jobs*). Or they may agree on facts and values but disagree about **the best action**: how to reach a shared goal (*both want clean air; one wants a tax, the other a ban*). Naming the kind of disagreement shows what evidence could settle it.\n\n> **Watch out.** Check what the two writers *agree on* first: if they dispute what is true or will happen, it is **the facts**; if they agree on the facts but rank competing priorities differently, it is **values**; if they share the exact same goal and propose different policies, it is **the best action**.",
        "就同一议题写作的两位作者，分歧可能有不同的类型。他们可能在**事实**上有分歧：什么是真的，或将会发生什么（*新水坝会不会伤害鱼类*）。他们也可能在事实上一致，却在**价值观**上有分歧：什么更重要（*就业比河流重要*对*河流比就业重要*）。或者他们在事实和价值观上都一致，却在**最佳行动**上有分歧：怎样达到共同的目标（*双方都想要清洁的空气；一方主张征税，另一方主张禁止*）。说出分歧的类型，就能看出什么证据可以解决它。\n\n> **注意。** 先看双方在什么上达成了一致：争论真假或结果的是**事实**分歧；认同事实但看重不同价值排序的是**价值观**分歧；目标完全一致而具体做法不同的是**最佳行动**分歧。",
      ],
      ["What kind of disagreement do the two writers have?", "两位作者的分歧属于哪一类？"],
      `
        One writer says the new dam will kill the salmon; the other cites a study showing the salmon will be unharmed.|the facts
        One says the drug lowers blood pressure; the other says trials show no effect.|the facts
        One claims the city's population is growing; the other says census data shows it shrinking.|the facts
        One says the bridge can bear heavy trucks; the other says engineers found cracks that make it unsafe.|the facts
        One says homework improves grades; the other cites research finding little link.|the facts
        One argues the forest will recover in ten years; the other says it will take a century.|the facts
        One says the tax will raise a billion dollars; the other says it will raise far less.|the facts
        One says crime has risen since last year; the other says the figures show a fall.|the facts
        One says the old mill employs hundreds; the other says it employs only a few dozen.|the facts
        One says the new phones damage hearing; the other says no study has found harm.|the facts
        Both agree the dam will kill some salmon; one says the power for thousands of homes is worth it, the other that the river's life matters more.|values
        Both agree the test is accurate; one values fairness to all students, the other values rewarding the best.|values
        Both agree the factory pollutes; one says the town's jobs matter most, the other that health matters most.|values
        Both agree the law limits speech; one ranks safety above freedom, the other freedom above safety.|values
        Both agree that zoos keep animals alive; one values the species, the other the freedom of each animal.|values
        Both agree the old building is costly to keep; one prizes its history, the other the money saved by tearing it down.|values
        Both agree the cameras reduce crime; one ranks privacy higher, the other security.|values
        Both agree the contest is hard; one values winning, the other the joy of taking part.|values
        Both agree that hunting controls the deer; one puts the farmers' crops first, the other the animals' lives.|values
        Both agree the highway saves time; one values speed, the other the quiet of the valley it crosses.|values
        Both want cleaner air; one proposes a tax on polluters, the other a ban on the worst fuels.|the best action
        Both want fewer road deaths; one wants lower speed limits, the other better driver training.|the best action
        Both want students to read more; one wants required reading lists, the other free choice of books.|the best action
        Both want to cut waste; one favors recycling programs, the other laws against plastic packaging.|the best action
        Both want less homelessness; one wants more shelters, the other cheaper housing.|the best action
        Both want healthier children; one wants better school lunches, the other more sports.|the best action
        Both want to save the wetland; one wants to buy it, the other to pass a law protecting it.|the best action
        Both want fewer people to smoke; one wants higher taxes, the other more education.|the best action
        Both want safer schools; one wants more guards, the other more counselors.|the best action
        Both want to reduce traffic; one wants more buses, the other a fee for driving downtown.|the best action
      `,
      {
        "the facts": L(
          "事实",
          "The writers disagree about what is true or what will happen, which evidence could settle.\n\n**Check.** Ask whether measurement, data, or a future study could resolve the clash: yes, because the two sides assert conflicting factual claims.",
          "两位作者对什么是真的或将会发生什么有分歧，这可以用证据来解决。\n\n**检验。** 问问数据、检验或调查能否解决争论：可以，因为双方在客观事实上各执一词。",
          "The writers do not dispute what is true; their disagreement lies elsewhere.",
          "两位作者对事实没有争议，他们的分歧在别处。",
        ),
        values: L(
          "价值观",
          "The writers accept the same facts but weigh different goods, such as jobs against health.\n\n**Check.** Notice the shared starting point (*Both agree…*) followed by competing priorities: no extra data alone can settle which value comes first.",
          "两位作者接受同样的事实，却看重不同的东西，比如就业对健康。\n\n**检验。** 开头已说明双方认同同一事实，分歧在于把哪一种价值排在前面，单靠补充数据无法解决。",
          "The writers do not rank what matters differently.",
          "两位作者对什么更重要的排序并无不同。",
        ),
        "the best action": L(
          "最佳行动",
          "The writers share a goal and agree on the facts, but propose different ways to reach it.\n\n**Check.** Spot the shared objective (*Both want…*) followed by two rival policy tools: they agree on the end and debate the means.",
          "两位作者目标相同、事实一致，却提出了不同的实现途径。\n\n**检验。** 双方共享同一个目标，争论的只是实现该目标的具体办法或政策工具。",
          "The writers do not share a goal and simply differ on how to reach it.",
          "两位作者并不是目标相同、只在途径上有分歧。",
        ),
      },
    ),
    choose(
      "which-argument-is-stronger",
      ["Which Argument Is Stronger", "哪个论证更有力"],
      [
        "To judge two arguments on one issue, compare them on the same tests: **evidence** (relevant, sufficient, from credible sources), **reasoning** (no fallacies, sound assumptions), and **counterclaims** (does each answer the other's best point?). The stronger argument is not the one you agree with or the louder one; it is the one whose evidence and reasoning hold up better. Sometimes each is stronger on a different point.\n\n> **Watch out.** Do not automatically declare *the two are equal* just because both sides offer something, and do not pick the louder or more passionate side—weigh sample size, source independence, causal logic, and fairness to objections.",
        "评判同一议题的两个论证，要用同样的标准比较：**证据**（相关、充分、来源可信）、**推理**（没有谬误、假设可靠）、**反驳**（各自是否回应了对方最有力的观点）。更有力的论证不是你赞同的那个，也不是声音更大的那个，而是证据和推理更站得住的那个。有时二者在不同方面各有长处。\n\n> **注意。** 不要因为双方都给了材料就轻易选“两者相当”，也不要偏向情绪更激烈的一方——要从样本大小、来源独立性、因果逻辑和回应反方的公正程度来权衡。",
      ],
      ["Which judgment of the two arguments is fair?", "对这两个论证，哪个评判是公正的？"],
      `
        A cites three peer-reviewed studies on school start times; B cites one parent's story about her son.|A is stronger, because its evidence is broader and more credible|B is stronger, because a personal story is more moving|the two are equal, since each one gives some evidence
        A answers B's main objection with data; B ignores A's main point entirely.|A is stronger, because it engages the other side's best point|B is stronger, because it stays focused on its own case|neither can be judged until we know who wrote them
        A calls its opponents selfish fools; B quotes the opponents fairly and then answers them.|B is stronger, because it argues against real positions fairly|A is stronger, because it shows more passion and conviction|the two are equal, because both take a clear side
        A uses a survey of 20,000 voters; B uses a survey of its own website's 50 readers.|A is stronger, because its sample is larger and less biased|B is stronger, because its readers know the issue well|neither is useful, because all surveys are unreliable
        A says the policy worked in five similar cities; B says it failed in one very different city.|A is stronger, because its comparisons fit the case better|B is stronger, because a single failure disproves a policy|the two cancel out, so the issue cannot be judged
        A's evidence is from 2023; B's is from 1985, before the technology changed.|A is stronger, because its evidence reflects current conditions|B is stronger, because older evidence has stood the test of time|the dates of the evidence do not matter for the argument
        A relies on the assumption that natural foods are always safe; B relies on lab tests.|B is stronger, because A rests on an assumption common knowledge contradicts|A is stronger, because most readers trust natural foods|the two are equal, because each makes some assumption
        A is written by a scientist who studies the river; B by a company that profits from the dam.|A has the more credible source, though its claims still need checking|B is more credible, because the company knows the dam best|the source of an argument never matters to its strength
        A uses statistics well but ignores costs; B weighs costs but gives little evidence.|each has a strength, and a fair reader would say so|A wins, because statistics always beat any other kind of point|B wins, because cost is the only thing that matters in policy
        A argues that because crime rose after the park opened, the park caused it; B shows crime rose across the whole city.|B is stronger, because it exposes A's false cause|A is stronger, because it points to a clear sequence of events|the two are equal, since both of them discuss crime figures
        A says everyone already agrees with it; B lays out evidence step by step.|B is stronger, because popularity is not evidence|A is stronger, because broad agreement shows it is true|the two are equal, because both of them reach a conclusion
        A gives two examples; B gives a nationwide study and two examples.|B is stronger, because its evidence is more sufficient|A is stronger, because it is shorter and easier to follow|the two are equal, because both of them give examples
        A attacks the other writer's past mistakes; B attacks the other writer's evidence.|B is stronger, because it targets the argument, not the person|A is stronger, because past mistakes show the writer is unreliable|the two are equal, because both of them criticize the opponent
        A claims there are only two choices, ban or do nothing; B lists several options.|B is stronger, because A sets up a false choice|A is stronger, because two choices make the decision simpler|the two are equal, because both of them propose solutions
        A uses loaded words like "disaster" and "scheme"; B describes the plan neutrally and then criticizes it.|B is stronger, because its criticism rests on reasons, not loaded words|A is stronger, because strong words show strong evidence|the two are equal, because both of them oppose the plan
        A admits a weakness in its case and explains why it still holds; B claims to have no weaknesses.|A is stronger, because it qualifies its claim honestly|B is stronger, because it shows more confidence in its case|the two are equal, because both of them defend their case
        A quotes a doctor on a question of medicine; B quotes a famous actor on the same question.|A is stronger, because its expert speaks within her field|B is stronger, because the actor is far better known and is admired by millions of readers|the two are equal, because both of them quote a person
        A says the new road will cut travel time and shows traffic models; B says it will ruin the town's character.|A is stronger on evidence, though B raises a value worth answering|B wins outright, because feelings about a town always outweigh any number|A wins outright, because a value can never count in an argument
        A argues that a ban on phones raised test scores at one school; B shows that scores rose at all schools that year.|B is stronger, because it shows A's cause may not be the real one|A is stronger, because it names a school where the ban was really tried|the two are equal, because both of them discuss test scores
        A claims that if the town allows one food truck, the streets will soon be full of them; B gives the actual numbers from nearby towns.|B is stronger, because A's slippery slope has no evidence behind it|A is stronger, because it warns about a danger that the town should take seriously|the two are equal, because both of them predict the future
        A cites a study paid for by the company that makes the product; B cites an independent study.|B is stronger, because its source has no stake in the result|A is stronger, because the company understands its own product best of all|the funding of a study never matters to how strong it is
        A says a writer cannot criticize the law because she once broke it; B answers the writer's points one by one.|B is stronger, because it answers the points instead of attacking the person|A is stronger, because a person who broke the law has lost any right to speak|the two are equal, because both of them respond to the writer
        A offers ten years of rainfall data; B offers one very wet summer.|A is stronger, because a long record is better evidence than one season|B is stronger, because a recent summer is fresher in everyone's memory|the two are equal, because both of them talk about the rain
        A makes a clear claim and supports each reason; B changes its claim halfway through.|A is stronger, because its reasoning is consistent from start to end|B is stronger, because changing its claim shows an open mind and flexibility|the two are equal, because both of them make some claim
        A says the museum should be free because art belongs to everyone; B shows how free entry worked in other cities and what it cost.|B gives more evidence, while A states a principle that still needs support|A is stronger, because a principle is always more important than any cost|B is stronger, because only money matters in decisions about museums
        A appeals to tradition: we have always done it this way; B explains what the old way achieves and what a change would cost.|B is stronger, because it gives reasons rather than habit|A is stronger, because a long tradition proves that a practice is wise|the two are equal, because both of them discuss the old way
        A uses a vivid story of one patient and then a large trial; B uses only the vivid story of one patient.|A is stronger, because its story is backed by broader evidence|B is stronger, because a single vivid story is easier for readers to remember|the two are equal, because both of them tell a story
        A answers the weakest objection to its view; B answers the strongest one.|B is stronger, because it meets the best case against it|A is stronger, because it wins its exchange more clearly and more quickly than B|the two are equal, because both of them answer an objection
        A reports a correlation between screen time and poor sleep and calls it a cause; B reports the same correlation and calls for more study.|B is stronger, because it does not claim more than the evidence shows|A is stronger, because it is bolder and more certain about what causes poor sleep|the two are equal, because both of them report the same data
        A and B both cite strong studies, but they measure different things, cost and safety.|each is strong on its own measure, and the reader must weigh the two|A wins, because it happens to be printed first|B wins, because safety studies are always the only ones that count
      `,
      (right) => [
        `The fair judgment is that ${right}: it applies the same tests of evidence and reasoning to both.\n\n**Check.** Score A and B on the same three criteria—evidence quality, logical soundness, and engagement with objections—to verify why "${right}" is the fair verdict.`,
        `公正的评判是：${right}。它对两个论证使用了同样的证据和推理标准。\n\n**检验。** 用同一套三项标尺（证据质量、推理严密性、回应反方的态度）给 A 和 B 打分，即可确认为何“${right}”最公允。`,
      ],
      [
        [
          "That judgment rewards feeling, confidence or popularity instead of evidence and reasoning.",
          "这个评判看重的是情感、自信或受欢迎程度，而不是证据和推理。",
        ],
        [
          "That judgment refuses to weigh the arguments or treats unequal cases as equal.",
          "这个评判拒绝权衡两个论证，或把不对等的情况当成对等。",
        ],
      ],
    ),
  ],
});

/** readingTopics11 are the reading topics of grade 11. */
export const readingTopics11: readonly TopicDef[] = [motifs, indirect, assumptions, comparing];
