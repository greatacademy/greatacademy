// Grades 9 to 12: reading skills the skill courses lacked: how a play works on the page, how to question a
// historical document, the forms and meters of poems, and how a personal essay moves between story and reflection.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

/** pick takes an element of a list by an index that may run past its end. */
const pick = <T>(list: readonly T[], i: number): T => list[i % list.length] as T;

/** labelled turns lines of a text and its label, separated by a bar, into items whose wrong options are two other labels. */
const labelled = (lines: string, labels: readonly string[]): ChoiceItem[] =>
  lines
    .trim()
    .split("\n")
    .map((line, i): ChoiceItem => {
      const [shown, right] = line.trim().split("|");
      const others = labels.filter((l) => l !== right);
      const wrong = others.length <= 2 ? others : [pick(others, i), pick(others, i + 1)];
      return [(shown ?? "").replaceAll("\\n", "\n"), right ?? "", wrong];
    });

// Drama on the page.

const exposition = "exposition";
const irony = "dramatic irony";
const direction = "a stage direction that reveals character";

/** dramaBank gives a short excerpt of a script and asks what the playwright uses it to do. */
const dramaBank = labelled(
  `
  MARTA: As you know, brother, Father has been dead ten years, and since then the farm has belonged to the bank in all but name.|${exposition}
  OLD SERVANT: Twenty years I have kept this house, since the day the master brought his bride home from the city and the old mistress moved to the east wing.|${exposition}
  CAPTAIN: The war has gone on for three winters now. The river is the only road the enemy has not closed, and the bridge at Ostra is the only crossing left.|${exposition}
  NURSE: You were six when your mother left, and you never asked why. Your father told everyone she had gone to care for a sick sister.|${exposition}
  MAYOR: Since the mine closed last spring, half the town has left, and the half that stayed cannot pay their taxes.|${exposition}
  DAUGHTER: It has been a year since the flood took the mill, Mother, and you still set a place at the table for Grandfather.|${exposition}
  TEACHER: When I came to this village, there was no school, no doctor and no road. That was thirty years ago, before any of you were born.|${exposition}
  GUARD: The prince returned from his studies abroad only last night, and already the whole court is whispering about his father's sudden death.|${exposition}
  CLERK: The company was founded by the twins in 1952. Since their quarrel, they have not spoken, and each owns exactly half.|${exposition}
  SISTER: Remember, the wedding is on Saturday, the guests arrive Friday, and Aunt Rose still does not know that the groom was once engaged to her daughter.|${exposition}
  [The audience has seen ANNA's brother write the letter and sign it with a false name.]\\nANNA: Burn it. Nothing a stranger writes could matter to me.|${irony}
  [The audience knows the cup is poisoned.]\\nKING: A toast to my loyal brother, who has never given me a reason to doubt him!|${irony}
  [The audience has seen the thief hide the necklace in the maid's apron.]\\nMAID: Search me if you like, madam. I have nothing to hide.|${irony}
  [The audience knows the soldier at the door is the son she believes is dead.]\\nMOTHER: Come in, stranger, and eat. My own son would be about your age.|${irony}
  [The audience has just watched the bridge collapse.]\\nTRAVELER: We will cross the bridge at dawn and be home by supper.|${irony}
  [The audience knows the doctor's report shows he is healthy.]\\nFATHER: Sell the house, children. I have only weeks to live.|${irony}
  [The audience has seen the twins swap their coats.]\\nUNCLE: Lucas, my boy, you were always the honest one. Your brother could never fool me.|${irony}
  [The audience knows the prize was won by the girl the judge is scolding.]\\nJUDGE: Go home, child. This competition is for real artists.|${irony}
  [The audience knows the ship carrying her letter sank.]\\nLOVER: He will write tomorrow. He has never once failed to answer me.|${irony}
  [The audience has seen the general sign the secret surrender.]\\nGENERAL: Men, we will fight to the last soldier. No one surrenders while I command.|${irony}
  [ELENA straightens every chair at the table, then straightens them again, before she answers.]|${direction}
  [He pockets the last of the bread while the others are looking away, then offers to say grace.]|${direction}
  [She tears the invitation in half without opening it and drops it, very neatly, into the bin.]|${direction}
  [The old man stands when the young officer enters, then remembers himself and sits down again, slowly.]|${direction}
  [MAX laughs a little too loudly at his boss's joke and looks around to see who noticed.]|${direction}
  [She keeps her coat on and her bag on her lap throughout the visit.]|${direction}
  [He counts the coins twice, puts one back in his own pocket, and hands the rest to the widow.]|${direction}
  [Without being asked, the youngest child begins to clear the plates; no one thanks her.]|${direction}
  [The landlord wipes his hand on his trousers after shaking the tenant's hand.]|${direction}
  [GRACE answers the phone on the first ring, as if she has been sitting beside it all night.]|${direction}
  [He reads the letter, smiles, folds it into a small square, and holds it over the candle flame.]|${direction}
  [The queen does not look up from her embroidery while the messenger tells her of the defeat.]|${direction}
`,
  [exposition, irony, direction],
);

const dramaWhy: Readonly<Record<string, readonly [string, string]>> = {
  [exposition]: [
    "The lines give the audience background facts it needs, about the past or the situation, through what characters say to each other.",
    "这些台词通过人物之间的对话，向观众交代他们需要知道的背景事实，比如过去发生的事或目前的处境。",
  ],
  [irony]: [
    "The audience knows something the speaker does not, so the line means more to us than to the one who says it.",
    "观众知道说话者不知道的事，所以这句台词对我们的意义比对说话者本人更多。",
  ],
  [direction]: [
    "The words in brackets tell the actor what to do, and the action shows a trait of the character without a word being spoken.",
    "方括号里的文字告诉演员做什么，这个动作不用一句台词就展示了人物的某种特点。",
  ],
};

const dramaZh: Readonly<Record<string, string>> = {
  [exposition]: "交代背景（exposition）",
  [irony]: "戏剧性反讽（dramatic irony）",
  [direction]: "揭示人物性格的舞台说明",
};

// Historical documents.

const author = "who made it";
const time = "when and where it was made";
const audience = "whom it was made for";
const purpose = "why it was made";

/** documentBank gives a detail of a historical document and asks which question about the document it answers. */
const documentBank = labelled(
  `
  The letter is signed: "Your loving son, Thomas Reed, Private, 4th Regiment."|${author}
  The bottom of the poster reads: "Issued by the Ministry of Information."|${author}
  The report is stamped with the seal of the city's Chief Medical Officer.|${author}
  The diary's first page says: "This book belongs to Ellen Marsh, aged fourteen."|${author}
  The speech was delivered by the president of the miners' union.|${author}
  The pamphlet's title page names its writer as "A Farmer of Pennsylvania."|${author}
  The photograph is labeled on the back: "Taken by the Daily Courier's staff photographer."|${author}
  The treaty is signed by the foreign ministers of both nations.|${author}
  The map is marked in the corner: "Drawn by Captain J. Ross, ship's surveyor."|${author}
  The diary entry is headed: "March 3, 1918. Field hospital, northern France."|${time}
  The newspaper's front page is dated October 30, 1929, the day after the stock market crash.|${time}
  The letter begins: "Camp near Richmond, the 12th of June."|${time}
  The poster was printed in London in 1940, during the bombing of the city.|${time}
  The ship's log entry reads: "Noon, 14 April. Position 41 degrees north."|${time}
  The telegram is marked "Berlin, 9 November 1989, 11:30 p.m."|${time}
  The census record was taken in the village of Dunmore in the spring of 1851.|${time}
  The recorded interview was made in Montgomery, Alabama, a week after the bus boycott began.|${time}
  The speech begins: "Workers of this mill, you have waited long enough."|${audience}
  The leaflet opens: "To the women of this county who pay taxes but may not vote."|${audience}
  The letter is addressed: "To the Honorable Members of the City Council."|${audience}
  The handbook was given to every new immigrant arriving at the port.|${audience}
  The radio broadcast was beamed across the border to listeners in occupied countries.|${audience}
  The children's reader was printed for use in the colony's mission schools.|${audience}
  The memo is marked "Secret: for the eyes of the cabinet only."|${audience}
  The advertisement appeared only in magazines read by farmers.|${audience}
  The poster ends: "Buy war bonds today and bring our boys home sooner."|${purpose}
  The pamphlet closes: "Join the union. Meeting Friday at the mill gate."|${purpose}
  The petition asks the king to lower the tax on salt.|${purpose}
  The report ends by recommending that the city build a new water system at once.|${purpose}
  The leaflet was dropped over enemy lines, urging soldiers to lay down their weapons.|${purpose}
  The letter to the newspaper demands that the factory be closed until it is made safe.|${purpose}
  The textbook's preface says it was written so that every child would learn the nation's glorious past.|${purpose}
  The company's brochure promised settlers rich land and mild winters if they bought a ticket west.|${purpose}
  The speech calls on the crowd to march to the capital on Monday.|${purpose}
`,
  [author, time, audience, purpose],
);

const documentZh: Readonly<Record<string, string>> = {
  [author]: "是谁制作的",
  [time]: "在何时何地制作的",
  [audience]: "是为谁制作的",
  [purpose]: "为什么制作",
};

// Poetic forms and meter.

const iambic = "iambic";
const trochaic = "trochaic";
const anapestic = "anapestic";
const dactylic = "dactylic";

/** meterBank gives a line with its stressed syllables in capitals and asks for its meter. */
const meterBank = labelled(
  `
  the WIND was COLD aBOVE the HILL|${iambic}
  i WALKED aLONE beSIDE the SEA|${iambic}
  the LAMP is LIT, the DOOR is SHUT|${iambic}
  my FAther KEPT his WATCH aWAKE|${iambic}
  a CROW sat SIlent ON the GATE|${iambic}
  the RIver RUNS to MEET the TIDE|${iambic}
  we CARried HOME the HEAvy BREAD|${iambic}
  and ALL the TOWN was FAST aSLEEP|${iambic}
  i KNOW the ROAD, i KNOW the WAY|${iambic}
  TELL me WHERE the RIver GOES|${trochaic}
  SILver MOONlight ON the WAter|${trochaic}
  DOWN the HILLside RAN the CHILDren|${trochaic}
  WINter COMES and STEALS the MORNing|${trochaic}
  LISten TO the FALLing RAIN|${trochaic}
  MOTHer SINGS beSIDE the FIre|${trochaic}
  GOLDen LEAVES are SLOWly FALLing|${trochaic}
  HEAvy HANG the RIPE red APples|${trochaic}
  in the DARK of the NIGHT came a KNOCK at the DOOR|${anapestic}
  and the SHIP sailed aWAY on the SILvery TIDE|${anapestic}
  with a SHOUT and a LEAP the boy RAN to the SEA|${anapestic}
  through the WOODS and aCROSS to the FARM on the HILL|${anapestic}
  as the BELLS of the TOWN rang aLOUD for the KING|${anapestic}
  on the EDGE of the WORLD stood a HOUSE made of STONE|${anapestic}
  in the HEAT of the DAY all the CATtle lay STILL|${anapestic}
  and the CHILDren came HOME when the LAMPlight was LIT|${anapestic}
  MERrily, MERrily, DANCing aWAY|${dactylic}
  BEAUtiful MEAdows and RIVers of GOLD|${dactylic}
  HURrying, SCURrying, OFF to the TOWN|${dactylic}
  WANdering OVer the MEAdow at NIGHT|${dactylic}
  THUNdering HOOFbeats aCROSS the PLAIN|${dactylic}
  CARRy me BACK to the VALley of HOME|${dactylic}
  SORrowful, SORrowful, WEEPing for LOVE|${dactylic}
  TENderly, TENderly, LAY her to REST|${dactylic}
`,
  [iambic, trochaic, anapestic, dactylic],
);

const meterWhy: Readonly<Record<string, readonly [string, string]>> = {
  [iambic]: ["Each foot is two syllables, unstressed then stressed: da-DUM.", "每个音步两个音节，先轻后重：da-DUM。"],
  [trochaic]: ["Each foot is two syllables, stressed then unstressed: DUM-da.", "每个音步两个音节，先重后轻：DUM-da。"],
  [anapestic]: ["Each foot is three syllables, two unstressed then a stress: da-da-DUM.", "每个音步三个音节，两轻一重：da-da-DUM。"],
  [dactylic]: ["Each foot is three syllables, a stress then two unstressed: DUM-da-da.", "每个音步三个音节，一重两轻：DUM-da-da。"],
};

const meterZh: Readonly<Record<string, string>> = {
  [iambic]: "抑扬格",
  [trochaic]: "扬抑格",
  [anapestic]: "抑抑扬格",
  [dactylic]: "扬抑抑格",
};

const sonnet = "a sonnet";
const villanelle = "a villanelle";
const haiku = "a haiku";
const ballad = "a ballad";
const blank = "blank verse";
const free = "free verse";

/** formBank describes the shape of a poem and asks which form it is. */
const formBank = labelled(
  `
  Fourteen lines of ten syllables, rhyming abab cdcd efef gg, with a turn before the closing couplet.|${sonnet}
  Fourteen lines: eight that raise a problem, rhyming abbaabba, and six that answer it.|${sonnet}
  A fourteen-line poem about time, whose last two rhyming lines sum up its argument.|${sonnet}
  Fourteen rhymed lines in iambic pentameter, written to a lover, with a shift in thought at line nine.|${sonnet}
  A poem of fourteen lines that argues with itself and settles the argument in its final couplet.|${sonnet}
  Nineteen lines: five stanzas of three lines and a final stanza of four, with two lines repeated again and again.|${villanelle}
  A poem in which the first and third lines return in turn at the end of each stanza and come together in the last one.|${villanelle}
  Nineteen lines on only two rhymes, its two refrains meeting in the closing quatrain.|${villanelle}
  A poem of tercets and a final quatrain, whose repeated lines grow more desperate each time they return.|${villanelle}
  Three unrhymed lines of five, seven and five syllables, about a single moment in nature.|${haiku}
  Three short lines: a frog, an old pond, the sound of water, and no rhyme at all.|${haiku}
  Seventeen syllables in three lines, with a word that marks the season.|${haiku}
  A three-line poem that sets two images side by side: snow on the mountain, a crow on the branch.|${haiku}
  Short four-line stanzas that tell a story of a sailor lost at sea, rhyming abcb, with a repeated line.|${ballad}
  A story in many quatrains, sung for centuries before anyone wrote it down, with a tragic ending.|${ballad}
  Stanzas of four lines alternating four and three stresses, telling of a murder and its punishment.|${ballad}
  A narrative poem in simple rhymed quatrains, with dialogue and a refrain, about a knight and a lady.|${ballad}
  Long passages of unrhymed lines, each of ten syllables in iambic pentameter, as in Shakespeare's plays.|${blank}
  Unrhymed iambic pentameter, used for a long poem about the fall of a hero.|${blank}
  A dramatic monologue in lines of ten syllables with a regular da-DUM beat and no rhyme.|${blank}
  Lines with a steady meter of five iambic feet that never rhyme, like the speech of a king on stage.|${blank}
  Unrhymed lines of very different lengths, following the rhythms of speech, with no regular meter.|${free}
  A poem with no fixed meter or rhyme, whose line breaks fall wherever the poet wants a pause.|${free}
  Long, rolling lines with no rhyme or regular beat, listing the sights and sounds of a city.|${free}
  Short lines of two or three words, then a long one, with no rhyme and no set number of syllables.|${free}
  A poem whose shape follows the breath of the speaker rather than any pattern of stresses or rhymes.|${free}
  Fourteen lines whose final couplet suddenly mocks everything the first twelve praised.|${sonnet}
  A poem of three lines, no title, about the first cherry blossom of spring.|${haiku}
  A song-like story in rhymed quatrains about a miner trapped underground, with a chorus after each stanza.|${ballad}
  A poem of nineteen lines whose two refrains are "Do not forget" and "The light will come again."|${villanelle}
  A long reflection on a garden in unrhymed iambic pentameter, ten syllables to the line.|${blank}
  A poem in lines of any length, without rhyme, describing a grandmother's hands.|${free}
`,
  [sonnet, villanelle, haiku, ballad, blank, free],
);

// Personal essays.

const narration = "narration of the experience";
const description = "description of a scene";
const reflection = "reflection on its meaning";

/** essayBank gives a sentence of a personal essay and asks what it is doing. */
const essayBank = labelled(
  `
  The bus left without me, and I stood on the corner with my suitcase as the rain began.|${narration}
  I grabbed the oar, pushed us off the rock and shouted for my brother to bail.|${narration}
  On my first day at the camp, a boy named Felix threw my shoes into the lake.|${narration}
  When the results were posted, I read the list twice, then walked home the long way.|${narration}
  My grandmother handed me the knife and told me to cut the onions the way she did.|${narration}
  I tripped at the second hurdle, got up, and finished last, limping.|${narration}
  That night I called my friend and said the thing I had been rehearsing for a week.|${narration}
  I signed up for the debate team only because the chess club was full.|${narration}
  We packed the car in silence, and my father drove me to the station before dawn.|${narration}
  I opened the letter in the school hallway and read the first line out loud by mistake.|${narration}
  I spent the summer of my fifteenth year teaching my little brother to read.|${narration}
  After the argument, I didn't speak to her for a month.|${narration}
  Her kitchen smelled of ginger, frying garlic and the coal stove that never quite went out.|${description}
  The gym was cold, and our breath hung in the air above the rows of folding chairs.|${description}
  The market was a wall of noise: vendors shouting prices, chickens complaining, radios playing three songs at once.|${description}
  The lake at dawn was flat and gray, and the far shore was lost in mist.|${description}
  His workshop was full of half-finished clocks, their parts laid out on cloths like surgical tools.|${description}
  The city lights spread below the plane, orange and endless, like embers in a fire.|${description}
  The hospital corridor was bright, quiet and smelled faintly of oranges and soap.|${description}
  My room in the new apartment had one window, which looked onto a brick wall six feet away.|${description}
  The classroom's radiator clanked all winter, and the windows were always fogged.|${description}
  The track was soft from the rain, and the grandstands were nearly empty.|${description}
  The old house creaked in the wind, its shutters loose and its porch sagging toward the garden.|${description}
  Snow covered the playground, smoothing the swings and slides into soft white shapes.|${description}
  Only years later did I understand that she had been teaching me patience, not cooking.|${reflection}
  I think now that losing that race taught me more than any race I won.|${reflection}
  Looking back, I see that I was not angry at my friend; I was afraid of losing her.|${reflection}
  What I learned in that kitchen was that love can be measured in hours, not words.|${reflection}
  I still wonder whether I would have spoken up if no one had been watching.|${reflection}
  Perhaps that is what growing up means: discovering that your parents were guessing too.|${reflection}
  I realize now that the language I struggled with gave me a second way of seeing the world.|${reflection}
  It took me ten years to forgive him, and longer to see that there had been nothing to forgive.|${reflection}
  That summer changed what I wanted to do with my life, though I did not know it then.|${reflection}
  I have come to believe that home is less a place than a group of people who expect you.|${reflection}
  The lesson, if there was one, was that being brave and being afraid can happen at the same moment.|${reflection}
  Even now, when I smell ginger, I am nine years old again, and she is still alive.|${reflection}
`,
  [narration, description, reflection],
);

const essayZh: Readonly<Record<string, string>> = {
  [narration]: "叙述经历",
  [description]: "描写场景",
  [reflection]: "反思意义",
};

const essayWhy: Readonly<Record<string, readonly [string, string]>> = {
  [narration]: ["It tells what happened, as one event or action in the story.", "它讲述发生了什么，是故事中的一个事件或动作。"],
  [description]: [
    "It shows what a place or moment looked, sounded or smelled like, and nothing happens in it.",
    "它展示一个地方或时刻的样子、声音或气味，其中并没有发生什么事。",
  ],
  [reflection]: [
    "It steps back from the events to say what they mean, usually from the writer's later point of view.",
    "它从事件中抽身出来，说明这些事件意味着什么，通常是从作者后来的视角来看。",
  ],
};

/** readingSkillTopics912 are the reading topics added for grades 9 to 12. */
export const readingSkillTopics912: readonly TopicDef[] = [
  {
    id: "dramatic-structure-and-dialogue",
    title: t("Dramatic Structure and Dialogue", "戏剧结构与对话"),
    summary: t(
      "How a play tells its story with no narrator: exposition in dialogue, dramatic irony, and stage directions that reveal character.",
      "没有叙述者的戏剧怎样讲故事：通过对话交代背景、戏剧性反讽，以及揭示人物性格的舞台说明。",
    ),
    prerequisites: ["irony"],
    encompasses: [
      { topic: "irony", weight: 0.2 },
      { topic: "plot-and-conflict", weight: 0.1 },
    ],
    xp: 12,
    strand: "reading",
    knowledgePoints: [
      point(
        "reading-a-script",
        t("Reading a Script", "阅读剧本"),
        t(
          "A play has no narrator to explain things, so a playwright tells the audience what it needs through three tools.\n\n- **Exposition** in dialogue: characters mention the past and the situation as they talk (*As you know, brother, Father has been dead ten years...*). A play is divided into **acts** and **scenes**, and the first scene usually carries the most exposition.\n- **Dramatic irony**: the audience knows something a character does not, so the character's words mean more to us than to them. A king who toasts his loyal brother with a cup we know is poisoned is a classic example.\n- **Stage directions**, usually in italics or brackets, tell actors what to do. The best ones reveal character through action: a woman who straightens the chairs twice before answering is anxious or controlling, though no one says so.\n\nRead a script by asking, for each passage, what the audience learns and how.",
          "戏剧没有叙述者来解释，所以剧作家用三种手段告诉观众需要知道的内容。\n\n- 通过对话**交代背景**（exposition）：人物在交谈中提到过去和目前的处境（*As you know, brother, Father has been dead ten years...*）。戏剧分为**幕**（act）和**场**（scene），第一场通常交代的背景最多。\n- **戏剧性反讽**（dramatic irony）：观众知道人物不知道的事，所以人物的话对我们的意义比对他们更多。国王用一杯我们知道有毒的酒向“忠诚的”弟弟敬酒，就是经典的例子。\n- **舞台说明**（stage directions）通常用斜体或方括号标出，告诉演员做什么。最好的舞台说明通过动作揭示人物：一个女人在回答前把椅子摆正了两遍，说明她焦虑或控制欲强，尽管没有人这样说。\n\n阅读剧本时，对每一段都问一问：观众了解到了什么，是怎样了解到的。",
        ),
        choiceGenerator(
          t("What does the playwright use this excerpt to do?", "剧作家用这段节选做什么？"),
          dramaBank,
          (right) =>
            t(`It is **${right}**. ${dramaWhy[right]?.[0] ?? ""}`, `这是**${dramaZh[right] ?? right}**。${dramaWhy[right]?.[1] ?? ""}`),
          (wrong) =>
            t(
              wrong === irony
                ? "Dramatic irony needs the audience to know something the speaker does not. Nothing here sets up such a gap."
                : wrong === exposition
                  ? "Exposition gives the audience background facts through dialogue. This excerpt does something else with its words or actions."
                  : "A stage direction tells the actor what to do. This excerpt is a line of dialogue, and its point lies in what it says.",
              wrong === irony
                ? "戏剧性反讽需要观众知道说话者不知道的事。这里没有这样的信息差。"
                : wrong === exposition
                  ? "交代背景是通过对话向观众提供背景事实。这段节选的文字或动作有别的作用。"
                  : "舞台说明告诉演员做什么。这段节选是台词，它的意义在于说出的内容。",
            ),
        ),
      ),
    ],
  },
  {
    id: "analyzing-historical-documents",
    title: t("Analyzing Historical Documents", "分析历史文献"),
    summary: t(
      "Four questions for any document of the past: who made it, when and where, for whom, and why.",
      "面对任何历史文献都要问的四个问题：谁制作的、何时何地、为谁、为什么。",
    ),
    prerequisites: ["primary-and-secondary-sources", "rhetorical-situation"],
    encompasses: [
      { topic: "primary-and-secondary-sources", weight: 0.3 },
      { topic: "rhetorical-situation", weight: 0.2 },
    ],
    xp: 12,
    strand: "reading",
    knowledgePoints: [
      point(
        "questioning-a-document",
        t("Questioning a Document", "追问一份文献"),
        t(
          "A historical document is evidence, but never neutral evidence: someone made it, at a particular moment, for particular readers, to do something. Historians ask four questions before trusting it.\n\n- **Who made it?** A signature, a seal, a byline, an official stamp. A private's letter and a general's report see the same battle differently.\n- **When and where?** A date and a place, which tell you what the maker could and could not have known.\n- **For whom?** An address, a greeting, the place it was published. A speech to miners and a memo to a cabinet are written differently.\n- **Why?** What it asks its readers to do or believe: buy, join, vote, obey, remember.\n\nEach detail of a document usually answers one of these questions best. Reading it means noticing which one, and what it changes about how far you trust the rest.",
          "历史文献是证据，但从来不是中立的证据：有人在特定的时刻、为特定的读者、为了达到某种目的而制作了它。历史学家在信任它之前会问四个问题。\n\n- **是谁制作的？** 签名、印章、署名、官方印戳。士兵的家信和将军的报告看到的是同一场战役的不同面貌。\n- **何时何地？** 日期和地点，告诉你制作者能知道什么、不能知道什么。\n- **为谁制作的？** 收信人、称呼、发表的地方。对矿工的演讲和给内阁的备忘录写法不同。\n- **为什么？** 它要求读者做什么或相信什么：购买、加入、投票、服从、铭记。\n\n文献中的每个细节通常最能回答其中一个问题。阅读文献，就是要注意到它回答的是哪一个，以及这会怎样改变你对其余内容的信任程度。",
        ),
        choiceGenerator(
          t("Which question about the document does this detail answer best?", "这个细节最能回答关于这份文献的哪个问题？"),
          documentBank,
          (right) =>
            t(
              `It tells you **${right}**. Notice it, because that fact shapes how you read the rest of the document.`,
              `它告诉你这份文献**${documentZh[right] ?? right}**。要注意这一点，因为它影响你怎样解读文献的其余部分。`,
            ),
          (wrong) =>
            t(
              `The detail does not say ${wrong}. Look at what kind of fact it gives: a name, a date and place, an address to readers, or a call to act.`,
              `这个细节没有说明这份文献${documentZh[wrong] ?? wrong}。看看它给出的是哪类事实：名字、日期和地点、对读者的称呼，还是行动的号召。`,
            ),
        ),
      ),
    ],
  },
  {
    id: "poetic-forms-and-meter",
    title: t("Poetic Forms and Meter", "诗歌形式与格律"),
    summary: t(
      "The shapes of poems, from the sonnet and villanelle to blank and free verse, and the four common meters of English.",
      "诗歌的各种形式，从十四行诗和维拉内拉诗到无韵诗和自由诗，以及英语中四种常见的格律。",
    ),
    prerequisites: ["sound-devices"],
    encompasses: [{ topic: "sound-devices", weight: 0.3 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "naming-the-form",
        t("Naming the Form", "辨别诗体"),
        t(
          "A poem's **form** is its shape: how many lines, how they rhyme, what repeats.\n\n- A **sonnet** has fourteen lines with a set rhyme scheme and a turn in thought, often before a final couplet.\n- A **villanelle** has nineteen lines, five tercets and a quatrain, on two rhymes, with two lines that return as refrains.\n- A **haiku** has three short unrhymed lines, often of five, seven and five syllables, fixing a moment in nature.\n- A **ballad** tells a story in short rhymed stanzas, usually quatrains, often with a refrain, as old songs did.\n- **Blank verse** is unrhymed iambic pentameter: lines of ten syllables with a steady da-DUM beat, as in Shakespeare's plays.\n- **Free verse** has neither regular meter nor rhyme; its lines follow the rhythms of speech and breath.\n\nForm matters because poets use it: a villanelle's refrains can feel like an obsession that will not let go.",
          "诗的**形式**（form）就是它的形态：有多少行、怎样押韵、什么在重复。\n\n- **十四行诗**（sonnet）有十四行，有固定的押韵格式，思路会有转折，常在最后的对句之前。\n- **维拉内拉诗**（villanelle）有十九行，由五个三行诗节和一个四行诗节组成，只用两个韵，有两行作为叠句反复出现。\n- **俳句**（haiku）有三行不押韵的短句，常为五、七、五音节，定格自然中的一个瞬间。\n- **叙事歌谣**（ballad）用押韵的短诗节（通常是四行）讲故事，常有叠句，就像古老的歌曲一样。\n- **无韵诗**（blank verse）是不押韵的抑扬格五音步诗：每行十个音节，有稳定的“轻重”节拍，如莎士比亚的戏剧。\n- **自由诗**（free verse）既没有规则的格律也不押韵，诗行跟随说话和呼吸的节奏。\n\n形式很重要，因为诗人会利用它：维拉内拉诗的叠句可以让人感到一种挥之不去的执念。",
        ),
        choiceGenerator(
          t("Which form is this poem written in?", "这首诗是用哪种诗体写的？"),
          formBank,
          (right) =>
            t(
              `It is **${right}**: the number of lines, the rhyme and what repeats all point to it.`,
              `这是 **${right}**：行数、押韵和重复的部分都指向它。`,
            ),
          (wrong) =>
            t(
              `${wrong.charAt(0).toUpperCase()}${wrong.slice(1)} has a different shape. Count the lines and check for rhyme, meter and repeated lines.`,
              `${wrong} 的形态不同。数一数行数，看看有没有押韵、格律和重复的诗行。`,
            ),
        ),
      ),
      point(
        "hearing-the-meter",
        t("Hearing the Meter", "听出格律"),
        t(
          "**Meter** is the pattern of stressed and unstressed syllables in a line, counted in units called **feet**. English poems mostly use four.\n\n- **Iambic**: da-DUM, as in *the WIND was COLD*. It is closest to ordinary speech and the most common.\n- **Trochaic**: DUM-da, as in *TELL me WHERE*. It sounds like a chant or a spell.\n- **Anapestic**: da-da-DUM, as in *in the DARK of the NIGHT*. It gallops.\n- **Dactylic**: DUM-da-da, as in *MERrily, MERrily*. It falls and rolls.\n\nIn these lines the stressed syllables are in capitals. Look at where each line begins and how many weak syllables sit between the strong ones: one weak syllable means a two-syllable foot, two mean a three-syllable foot. Many lines vary at their very end, so judge by the pattern of the whole line.",
          "**格律**（meter）是诗行中重读与非重读音节的模式，以称为**音步**（feet）的单位计算。英语诗歌主要用四种。\n\n- **抑扬格**（iambic）：轻重，如 *the WIND was COLD*。它最接近日常说话，也最常见。\n- **扬抑格**（trochaic）：重轻，如 *TELL me WHERE*。听起来像咒语或吟唱。\n- **抑抑扬格**（anapestic）：轻轻重，如 *in the DARK of the NIGHT*。它像马在奔跑。\n- **扬抑抑格**（dactylic）：重轻轻，如 *MERrily, MERrily*。它有下沉、滚动之感。\n\n这些诗行中的重读音节用大写字母标出。看看每行怎样开头，以及重音之间有几个弱音节：一个弱音节说明是双音节音步，两个说明是三音节音步。许多诗行在末尾有变化，所以要根据整行的模式来判断。",
        ),
        choiceGenerator(
          t("The stressed syllables are in capitals. What is the meter of this line?", "重读音节用大写字母标出。这一行是什么格律？"),
          meterBank,
          (right) =>
            t(`It is **${right}**. ${meterWhy[right]?.[0] ?? ""}`, `这是**${meterZh[right] ?? right}**。${meterWhy[right]?.[1] ?? ""}`),
          (wrong) =>
            t(
              `In ${wrong} meter, ${meterWhy[wrong]?.[0]?.replace(/^Each foot is/, "each foot would be") ?? ""} Count the weak syllables between the capitals.`,
              `在${meterZh[wrong] ?? wrong}中，${meterWhy[wrong]?.[1] ?? ""}数一数大写音节之间的弱音节。`,
            ),
        ),
      ),
    ],
  },
  {
    id: "reading-personal-essays",
    title: t("Reading Personal Essays", "阅读个人随笔"),
    summary: t(
      "How an essayist moves between telling an experience, describing it, and reflecting on what it means.",
      "随笔作者怎样在讲述经历、描写场景和反思意义之间转换。",
    ),
    prerequisites: ["narrative-point-of-view", "authors-purpose"],
    encompasses: [
      { topic: "narrative-point-of-view", weight: 0.2 },
      { topic: "authors-purpose", weight: 0.1 },
    ],
    xp: 12,
    strand: "reading",
    knowledgePoints: [
      point(
        "story-scene-and-meaning",
        t("Story, Scene and Meaning", "故事、场景与意义"),
        t(
          "A **personal essay** tells a true experience from the writer's life and asks what it means. It has two voices: the **younger self** who lived the experience, and the **older self** who is writing now and understands more.\n\nIts sentences do three kinds of work.\n- **Narration** tells what happened: *The bus left without me.*\n- **Description** shows a place or moment, with no event: *Her kitchen smelled of ginger and frying garlic.*\n- **Reflection** steps back to say what it means, often with words such as *now*, *later*, *I realize*, *I think*, or a general truth: *Only years later did I understand that she was teaching me patience.*\n\nA strong essay moves between them. Too little reflection and it is only a story; too much and it becomes a lecture.",
          "**个人随笔**（personal essay）讲述作者生活中的一段真实经历，并追问它意味着什么。它有两个声音：经历这件事的**过去的自己**，以及正在写作、理解得更多的**现在的自己**。\n\n随笔中的句子做三种事情。\n- **叙述**（narration）讲述发生了什么：*The bus left without me.*\n- **描写**（description）展示一个地方或时刻，其中没有事件发生：*Her kitchen smelled of ginger and frying garlic.*\n- **反思**（reflection）从事件中抽身出来，说明它的意义，常用 *now、later、I realize、I think* 这类词，或者一个普遍的道理：*Only years later did I understand that she was teaching me patience.*\n\n好的随笔在三者之间转换。反思太少，它就只是一个故事；反思太多，它就变成了说教。",
        ),
        choiceGenerator(
          t("What is this sentence of a personal essay doing?", "个人随笔中的这个句子在做什么？"),
          essayBank,
          (right) =>
            t(`It is **${right}**. ${essayWhy[right]?.[0] ?? ""}`, `这是**${essayZh[right] ?? right}**。${essayWhy[right]?.[1] ?? ""}`),
          (wrong) =>
            t(
              wrong === reflection
                ? "Reflection steps back to say what the experience means. This sentence stays inside the moment."
                : wrong === narration
                  ? "Narration tells an event or action. In this sentence nothing happens as part of the story."
                  : "Description shows what something looked, sounded or smelled like. This sentence does more than show a scene.",
              wrong === reflection
                ? "反思是从经历中抽身出来说明其意义。这个句子仍然停留在那个时刻之中。"
                : wrong === narration
                  ? "叙述讲述事件或动作。这个句子中并没有发生故事里的事件。"
                  : "描写展示事物的样子、声音或气味。这个句子做的不只是展示一个场景。",
            ),
        ),
      ),
    ],
  },
];
