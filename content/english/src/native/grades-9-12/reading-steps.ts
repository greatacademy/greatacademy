// Grades 9 to 12: the second step of three reading topics, from naming a part to using it: placing a scene in the
// structure of a play, judging how far a document can be trusted, and choosing the reflection a personal essay needs.

import { t } from "@ga/content";
import { point } from "@ga/subject-english";
import { bars, kindedChoice, type Label, labelChoice } from "../../topics/steps.ts";

// The stage of the plot.

const exposition = "exposition";
const rising = "rising action";
const climax = "climax";
const falling = "falling action";
const resolution = "resolution";

const stageLabels: Readonly<Record<string, Label>> = {
  [exposition]: {
    zh: "开端",
    why: [
      "The scene introduces the characters, the place and the situation before the main conflict begins, so the audience knows what is at stake.",
      "这一场在主要冲突开始之前介绍人物、地点和处境，让观众知道事关什么。",
    ],
    not: [
      "Exposition sets up the characters and situation before the conflict starts. In this scene the conflict is already under way or over.",
      "开端在冲突开始之前交代人物和处境。在这一场中，冲突已经在进行或已经结束了。",
    ],
  },
  [rising]: {
    zh: "上升情节",
    why: [
      "The conflict has begun and is growing: a new problem, a complication or a rising danger makes the turning point closer.",
      "冲突已经开始并在加剧：新的问题、新的波折或不断上升的危险让转折点越来越近。",
    ],
    not: [
      "Rising action builds the conflict toward its turning point. This scene either comes before the conflict or after its turning point.",
      "上升情节把冲突推向转折点。这一场要么在冲突开始之前，要么在转折点之后。",
    ],
  },
  [climax]: {
    zh: "高潮",
    why: [
      "This is the turning point: the moment of highest tension, when the main conflict comes to a head and its outcome is decided.",
      "这是转折点：紧张程度最高的时刻，主要冲突到了决定性关头，结局就此确定。",
    ],
    not: [
      "The climax is the single turning point where the conflict is decided. This scene builds toward it, follows it, or sets it up.",
      "高潮是冲突得到决定的那个转折点。这一场是在走向它、跟在它之后，或者为它作铺垫。",
    ],
  },
  [falling]: {
    zh: "下降情节",
    why: [
      "The turning point has passed, and the scene shows its consequences as the tension eases and loose ends begin to be tied.",
      "转折点已经过去，这一场展示它的后果，紧张感逐渐缓和，未了的线索开始收拢。",
    ],
    not: [
      "Falling action follows the climax and shows its consequences. In this scene the turning point has not yet happened, or all is already settled.",
      "下降情节跟在高潮之后，展示它的后果。在这一场中，转折点还没有到来，或者一切都已经尘埃落定。",
    ],
  },
  [resolution]: {
    zh: "结局",
    why: [
      "The conflict is over and the scene shows the new state of things, the way the characters' lives settle at the end.",
      "冲突已经结束，这一场展示事物的新状态，即人物的生活在结尾怎样安定下来。",
    ],
    not: [
      "The resolution shows the settled world after the conflict ends. In this scene something is still unsettled.",
      "结局展示冲突结束后安定下来的世界。在这一场中，仍有事情没有了结。",
    ],
  },
};

const stageLines = `
  The curtain rises on a farmhouse kitchen. Two sisters peel potatoes and talk about their brother, who left for the city years ago and never writes.|${exposition}
  A letter arrives saying the brother is coming home, and he will bring a buyer for the farm. The sisters argue about whether to let him in.|${rising}
  At the dinner table, the brother finally announces that he has already sold the farm. The younger sister throws the deed into the fire before he can sign it.|${climax}
  The buyer leaves in anger. The brother sits alone on the porch while the sisters clean up, and the three begin, awkwardly, to speak again.|${falling}
  A year later, the three of them are planting the spring crop together, and the brother has a room of his own in the old house.|${resolution}
  A ship's crew gathers on deck at dawn. The captain explains that they are three weeks from port, and the food will last only two.|${exposition}
  The sailors begin to steal from the stores at night. The first mate warns the captain that some of them are planning a mutiny.|${rising}
  The mutineers seize the wheel, and the captain must choose: fire on his own men, or hand over the ship.|${climax}
  With the mutiny over, the crew repair the damaged sails, and the leaders are locked below to await trial.|${falling}
  The ship sails into harbor. The captain watches the crowd on the dock and hands his logbook to the harbor master.|${resolution}
  In a small apartment, a young violinist practices while her grandfather listens. She mentions the national competition next month.|${exposition}
  Her teacher says she is not ready, and she secretly begins practicing through the night, hiding her sore hands.|${rising}
  On stage at the final, her string snaps in the middle of the hardest passage, and she must decide whether to stop or play on.|${climax}
  Backstage, the judges' result is announced, and her teacher comes to find her, holding the broken string.|${falling}
  Months later, she is teaching a young child the scale her grandfather once taught her, in the same small apartment.|${resolution}
  The play opens in a busy newspaper office. A young reporter tells her editor about her first assignment: the opening of a new factory.|${exposition}
  At the factory, she notices that the river behind it has turned brown, and the manager refuses to answer her questions.|${rising}
  She stands before the editor with her proof, and he must decide whether to print a story that will anger the paper's biggest advertiser.|${climax}
  After the story runs, the factory is investigated, and the advertiser cancels its contract with the paper.|${falling}
  The last scene shows the reporter at her desk, now leading a team, as children swim in the clean river outside the window.|${resolution}
  Two old friends meet at a train station after twenty years. As they wait, they remember the summer they built a raft together.|${exposition}
  One of them admits that he has come to ask for money, and the other recalls an old debt that was never repaid.|${rising}
  As the train pulls in, the friend who was owed tears up the old note and holds out his hand.|${climax}
  They board the train together, talking quietly, and the tension between them softens mile by mile.|${falling}
  In the final scene, the two men stand on the bank of the same river, building a new raft with their grandchildren.|${resolution}
  The lights come up on a royal court. Courtiers whisper that the old king has no heir, and that his nephew is waiting.|${exposition}
  The nephew begins to spread rumors about the king's health, and one by one the lords promise him their support.|${rising}
  In the throne room, the king reveals that he has a daughter raised in secret, and the nephew draws his sword.|${climax}
  The nephew is disarmed and sent into exile, and the lords who betrayed the king beg for his pardon.|${falling}
  The play ends with the young queen's crowning, the old king smiling at her side.|${resolution}
`;

/** plotStageStep asks which stage of a play's structure a scene belongs to. */
export const plotStageStep = point(
  "the-stage-of-the-plot",
  t("The Stage of the Plot", "情节的阶段"),
  t(
    "Most plays follow the shape of a plot. Placing a scene in it tells you what that scene is for.\n\n- **Exposition**: characters, place and situation, before the conflict begins.\n- **Rising action**: the conflict starts and grows through new problems and complications.\n- **Climax**: the turning point, the moment of highest tension when the conflict is decided.\n- **Falling action**: the consequences of the climax, as tension eases.\n- **Resolution**: the new, settled state of things at the end.\n\nTo place a scene, ask whether the main conflict has started, whether it is being decided right now, and whether it is already over. A scene full of action is not always the climax: it is the climax only if the outcome is decided there.",
    "大多数戏剧都遵循情节的结构。把一场戏放到这个结构中，就能知道这场戏的作用。\n\n- **开端**（exposition）：在冲突开始之前交代人物、地点和处境。\n- **上升情节**（rising action）：冲突开始，并通过新的问题和波折不断加剧。\n- **高潮**（climax）：转折点，紧张程度最高、冲突得到决定的时刻。\n- **下降情节**（falling action）：高潮的后果，紧张感逐渐缓和。\n- **结局**（resolution）：结尾时事物新的、安定的状态。\n\n要给一场戏定位，就问问主要冲突是否已经开始、是否正在此刻得到决定、是否已经结束。充满动作的场景不一定是高潮：只有结局在那里得到决定，它才是高潮。",
  ),
  labelChoice(["Which stage of the plot does this scene belong to?", "这一场属于情节的哪个阶段？"], stageLines, stageLabels),
);

// How far to trust a document.

const eyewitness = "a firsthand witness with no clear reason to slant";
const motive = "its maker had a reason to slant it";
const secondhand = "its maker only heard about the event";
const later = "it was written long after the event";

const trustLabels: Readonly<Record<string, Label>> = {
  [eyewitness]: {
    zh: "没有明显偏向理由的亲历者",
    why: [
      "The maker saw the event at the time and gains nothing from how it is told, so the document is strong evidence on this point.",
      "制作者当时亲眼目睹了这件事，而且不会因叙述方式而获益，所以这份文献在这一点上是有力的证据。",
    ],
    not: [
      "A strong witness must have been there at the time and have no reason to slant the account. This document fails one of those tests.",
      "可靠的证人必须当时在场，并且没有理由歪曲叙述。这份文献至少有一项没有通过。",
    ],
  },
  [motive]: {
    zh: "制作者有歪曲的理由",
    why: [
      "The maker was there, but stood to gain or lose from how the event looked, so the account may be tilted on exactly this point.",
      "制作者当时在场，但事件呈现的样子关系到他的得失，所以叙述恰恰可能在这一点上有所偏向。",
    ],
    not: [
      "Nothing shows that the maker would gain or lose from how this point is told, so a motive to slant is not the main concern.",
      "没有任何迹象表明制作者会因这一点的叙述方式而得失，所以歪曲的动机不是主要问题。",
    ],
  },
  [secondhand]: {
    zh: "制作者只是听说",
    why: [
      "The maker did not see the event but repeats what others said, so details may have changed as the story passed along.",
      "制作者没有亲眼看到这件事，只是转述别人说的话，所以细节可能在流传中发生了变化。",
    ],
    not: ["The maker saw the event directly, so the document is not secondhand.", "制作者是直接看到这件事的，所以这份文献不是二手的。"],
  },
  [later]: {
    zh: "事后很久才写成",
    why: [
      "The maker was there, but wrote it down many years later, when memory fades and later events change how the past looks.",
      "制作者当时在场，但多年以后才写下来，那时记忆已经模糊，后来的事件也会改变人们看待过去的方式。",
    ],
    not: [
      "The document was made at the time of the event or soon after, so distance in time is not the problem.",
      "这份文献是在事件发生时或之后不久写成的，所以时间距离不是问题。",
    ],
  },
};

const trustLines = `
  Question: how many people came to the 1910 harbor strike? Document: a diary entry by a schoolteacher who watched from her window that afternoon.|${eyewitness}
  Question: how many people came to the 1910 harbor strike? Document: the shipping company's report to its owners, written the next day.|${motive}
  Question: how many people came to the 1910 harbor strike? Document: a letter by a farmer in the hills, repeating what his cousin in the city told him.|${secondhand}
  Question: how many people came to the 1910 harbor strike? Document: a memoir by one of the strikers, written in 1962.|${later}
  Question: how did the fire of 1871 start? Document: a statement by the owner of the barn where the fire began, given to the city's insurance inquiry.|${motive}
  Question: how did the fire of 1871 start? Document: a newspaper in another state, printing rumors from travelers a week later.|${secondhand}
  Question: how did the fire of 1871 start? Document: a neighbor's sketch, drawn the next morning, of what she saw from her yard.|${eyewitness}
  Question: how did the fire of 1871 start? Document: the autobiography of a man who was a boy at the time, published fifty years later.|${later}
  Question: was the general brave in the battle? Document: the general's own report to the king, asking for a reward.|${motive}
  Question: was the general brave in the battle? Document: a nurse's letter home that night, describing the soldiers she treated and the officer who carried them in.|${eyewitness}
  Question: was the general brave in the battle? Document: a song about the battle written in a distant village, based on stories from returning soldiers.|${secondhand}
  Question: was the general brave in the battle? Document: an old soldier's recollection, told to a historian forty years after the war.|${later}
  Question: what did the queen say at her coronation? Document: the official court record, written by a clerk in the hall that day.|${eyewitness}
  Question: what did the queen say at her coronation? Document: a pamphlet by the queen's enemies, printed to turn the people against her.|${motive}
  Question: what did the queen say at her coronation? Document: a letter by a merchant abroad, passing on what he heard from a sailor.|${secondhand}
  Question: what did the queen say at her coronation? Document: the memoirs of a lady-in-waiting, written in her old age.|${later}
  Question: how bad was the flood of 1927? Document: photographs taken from a boat by a newspaper photographer during the flood.|${eyewitness}
  Question: how bad was the flood of 1927? Document: a statement by the company that built the failed levee, released to the press.|${motive}
  Question: how bad was the flood of 1927? Document: a story in a European magazine, based on reports from American newspapers.|${secondhand}
  Question: how bad was the flood of 1927? Document: an interview with a survivor recorded in 1990.|${later}
  Question: were the factory's workers treated fairly in 1900? Document: a brochure printed by the factory owner for visitors.|${motive}
  Question: were the factory's workers treated fairly in 1900? Document: a worker's letter to her sister that same week, describing her hours and pay.|${eyewitness}
  Question: were the factory's workers treated fairly in 1900? Document: a sermon by a minister in another town, based on what his parishioners had told him.|${secondhand}
  Question: were the factory's workers treated fairly in 1900? Document: a former worker's memoir, written after she retired in 1955.|${later}
  Question: what happened at the 1963 town council vote? Document: the minutes taken by the council's secretary during the meeting.|${eyewitness}
  Question: what happened at the 1963 town council vote? Document: a campaign leaflet by the losing candidate, printed a week later.|${motive}
  Question: what happened at the 1963 town council vote? Document: a column by a writer in the capital who was not at the meeting and quotes "people close to the council."|${secondhand}
  Question: what happened at the 1963 town council vote? Document: a speech about the vote given by a former councillor at a 2003 anniversary dinner.|${later}
  Question: how did the explorers treat the people they met? Document: the expedition leader's report to the government that paid for the voyage.|${motive}
  Question: how did the explorers treat the people they met? Document: the ship's cook's private journal, written each evening of the voyage.|${eyewitness}
`;

/** trustStep asks how far a document can be trusted on a question. */
export const trustStep = point(
  "how-far-to-trust-it",
  t("How Far to Trust It", "可以在多大程度上信任它"),
  t(
    "Once you know who made a document, when, for whom and why, you can judge how far to trust it **on a particular question**.\n\n- **A firsthand witness with no clear reason to slant**, writing at the time, is the strongest evidence: a diary, a private letter, minutes taken in the room.\n- **A maker with a reason to slant** was there, but gains or loses from the story: a company's report on its own strike, a general's account of his own courage.\n- **A secondhand account** repeats what someone else saw, and details drift as stories pass along.\n- **An account written long after** may come from a real witness, but memory fades and later events reshape it.\n\nThe same document can be strong on one question and weak on another: a company report may be exact on its costs and slanted on its workers.",
    "一旦你知道了一份文献是谁、在什么时候、为谁、为什么制作的，你就能判断在**某个具体问题上**可以在多大程度上信任它。\n\n- 当时写下的、**没有明显偏向理由的亲历者**的记录是最有力的证据：日记、私人信件、在现场记录的会议纪要。\n- **有歪曲理由的制作者**当时在场，但故事怎么讲关系到他的得失：公司关于自己工厂罢工的报告、将军对自己英勇表现的叙述。\n- **二手叙述**转述别人看到的事，细节会随着故事的流传而走样。\n- **事后很久写成的叙述**可能出自真正的亲历者，但记忆会模糊，后来的事件也会重塑它。\n\n同一份文献可能在一个问题上很有力，在另一个问题上却很薄弱：公司报告在成本上可能很准确，在工人问题上却有所偏向。",
  ),
  labelChoice(
    ["How far can this document be trusted on the question, and why?", "在这个问题上，这份文献可以在多大程度上信任？为什么？"],
    trustLines,
    trustLabels,
  ),
);

// Writing the reflection.

/** reflectionBank gives a passage of narration; its wrong options offer a stock moral, then more narration. */
const reflectionBank = bars(
  `
  The summer I was twelve, I refused to visit my grandfather in the hospital because I hated the smell of the halls. He died in August, and I never said goodbye.|I understand now that I was not protecting myself from the smell; I was protecting myself from seeing him weak, and the cost was a goodbye I can never say.|This taught me that family is the most important thing in life.|The funeral was held on a rainy Tuesday, and my mother wore a black hat I had never seen before.
  For two years I practiced piano only when my mother was listening. When she started working nights, I stopped completely, and the piano gathered dust in the corner.|Looking back, I see that I never played for the music at all; I played for her attention, and when she was gone there was nothing left to play for.|This shows that practice makes perfect.|The piano was an old upright, painted white, with a chipped key near the middle.
  On my first day at the new school, a girl named Hana sat next to me at lunch without asking and shared her rice. I never found out why she chose me.|I have come to think that her kindness mattered precisely because it had no reason: she did not choose me for anything I was, and so I could not lose it.|This proves that it is important to be nice to new students.|The cafeteria was loud, with long tables and a smell of fried onions.
  When my father lost his job, he kept leaving the house every morning at seven in his suit, and came home at six. It was months before we learned that he spent the days at the library.|Only years later did I see that the suit was not a lie told to us but a promise to himself, a way of staying the man he wanted to be until he could be it again.|This shows that honesty is always the best policy.|The library was a brick building downtown with a fountain in front of it.
  In the spring of ninth grade, I quit the soccer team the day before the final, telling everyone I was sick. The team lost by one goal.|What I could not admit then was that I was not afraid of losing the game; I was afraid of being the reason we lost it, and so I made sure I could not be.|This teaches us that we should never give up.|The final was played on a Saturday morning on the field behind the high school.
  My older brother taught me to ride a bike by letting go of the seat without telling me. I rode halfway down the street before I looked back and fell.|I think of that moment often now: I could ride as long as I believed he was holding on, and I fell the instant I knew I was alone, though nothing about the bike had changed.|This shows that brothers are very helpful.|The bike was red with silver handlebars and a bell that did not ring.
  Every Sunday my grandmother made dumplings, and every Sunday she told me I folded them wrong. After she died, I found I could not fold them any other way than hers.|I realize now that her corrections were not criticism but a kind of inheritance; she was putting her hands into mine, so that her way of folding would outlast her.|This teaches us to listen to our elders.|The dumplings were filled with pork and cabbage and boiled in a huge steel pot.
  At fifteen, I wrote a cruel joke about a classmate in a group chat. She saw it the next morning, and she never spoke to me again.|I used to tell myself it was only a joke, but I see now that I wrote it to be laughed at by the others, and that I paid for their laughter with someone else's trust.|This proves that the internet can be dangerous.|The group chat had eleven members and was named after our homeroom teacher.
  When we moved to a new country, my mother, who had been a doctor, took a job cleaning offices at night. She never once complained in front of us.|It took me years to understand that her silence was not acceptance but a gift: she carried the loss alone so that we could arrive without it.|This shows that immigrants work very hard.|The offices were on the twentieth floor of a glass tower near the river.
  I spent a whole summer building a model ship from a kit, and on the last day I dropped it on the stairs. My father helped me glue it back together, and the cracks still show.|I have kept it on my shelf for twenty years, and I have come to love the cracks more than the ship, because they are the only part of it that holds my father's hands.|This teaches us to be careful with fragile things.|The kit came in a long box with a picture of a sailing ship on the lid.
  The night of the blackout, my family sat together in the living room with one candle, and my parents told stories about their childhoods that I had never heard.|I sometimes think we needed the darkness: with nothing to look at, we finally looked at each other, and learned that our parents had been children too.|This shows that technology is bad for families.|The power came back at midnight, and the refrigerator started humming again.
  In sixth grade, I won the spelling bee by spelling a word I had never seen before, guessing letter by letter. Everyone called me a genius for a week.|I knew even then that it was luck, and what I remember most is not the prize but the strange loneliness of being praised for something I had not done.|This shows that hard work pays off.|The word was "chrysanthemum," and the prize was a dictionary with my name inside.
  My best friend and I promised to write every week when she moved away. The letters came often at first, then monthly, then not at all, and I never wrote to ask why.|I think now that neither of us stopped caring; we simply waited for the other to prove it, and the silence grew from two people being proud at once.|This teaches us that friendship is important.|She moved to a city on the coast, six hours away by train.
  At my first job, in a bakery, the owner made me throw away the unsold bread every night. One evening I took it to the shelter on my way home instead, and she fired me.|I was angry for years, but I see now that we were both right about different things, and that I learned more from that bread than from any job I was allowed to keep.|This proves that rules are meant to be broken.|The bakery was on a corner near the bus station and opened at five every morning.
  The year my parents divorced, I started running every morning before dawn. I ran until I was too tired to think, and I never told anyone why.|Looking back, I was not running toward fitness or away from home; I was running in circles around a sadness I did not yet have words for, until the words came.|This shows that exercise is good for your health.|My route went past the bakery, around the park and back along the canal.
  When I was nine, I broke a neighbor's window with a baseball and ran away. That night my mother walked me to his door and made me tell him.|What stays with me is not the shame but his face: he was not angry at all, and I understood that I had been more afraid of the truth than he had been of the broken glass.|This teaches us to tell the truth.|The window was in his kitchen, and the ball landed in a bowl of fruit.
  For years I was embarrassed by my father's accent, and I asked him not to speak when my friends came over. He agreed, and he never mentioned it.|I see now that his silence was a kindness I did not deserve, and that the accent I hid was the sound of everything he had crossed to give me a home.|This shows that we should be proud of where we come from.|My friends usually came over on Fridays to watch films in the basement.
  I kept a diary every day from age ten to fourteen, and then I burned it in the backyard, page by page, without reading any of it again.|I think I burned it not to forget the child who wrote it but to be free of her, and I have spent years since wishing I could ask her what she knew.|This teaches us that the past is in the past.|The fire was small, in an old metal bucket, on a windy evening in October.
  My little sister was born with a heart problem, and for a year our whole house was organized around her medicines. I felt invisible, and I hated myself for feeling it.|Only later did I understand that both feelings were true at once: I loved her and I resented her, and growing up meant learning to carry both without letting either win.|This shows that siblings should always love each other.|Her medicines were kept in a plastic box on the top shelf of the kitchen cupboard.
  On a school trip, I got lost in a foreign city for three hours. A shopkeeper who spoke no English drew me a map on a paper bag and walked me back to the hotel.|I have forgotten the name of the city but not the paper bag, because it was the first time I understood that help does not need a shared language, only a shared willingness.|This proves that traveling is educational.|The hotel was a tall grey building on a square with a fountain.
  When I failed my driving test the first time, my mother laughed and said she had failed hers three times. I was furious that she could laugh.|I think now that she laughed to shrink the failure to its proper size, to show me it was a door that would open, not a wall, and I was too proud to see it.|This teaches us to try again when we fail.|The test was on a Monday morning, and the examiner wore a green jacket.
  Every winter my uncle shoveled the old woman's driveway next door, and she never thanked him. When she died, she left him her garden tools and a note that said only "For the snow."|I have come to think that some gratitude is too large for ordinary words, and that her silence for all those winters was its own kind of thanks, waiting for the right moment.|This shows that good deeds are always rewarded.|The garden tools were old and rusty, kept in a shed behind her house.
  I joined the debate club only because my best friend did. By the end of the year, she had quit, and I had become its captain.|Looking back, I see that I followed her in and found something of my own there, and that the most important doors are sometimes opened for the wrong reasons.|This shows that you should always join clubs at school.|The club met on Thursdays after school in the science lab.
  My grandfather never threw anything away: string, jars, old keys to locks that no longer existed. When we cleared his house, we filled a truck with it.|I understand now that he had lived through a time when nothing could be replaced, and that every saved key was a small promise that he would never be that poor again.|This teaches us that we should recycle.|The truck took three trips to the dump, and it rained the whole day.
  When I was eleven, I lied to my class that my father was a pilot. The lie grew for months, until a classmate's mother turned out to work at the airport.|I think the lie was never about planes: I wanted a father who traveled and came home with stories, because mine worked late and came home too tired to talk.|This proves that lying always gets you into trouble.|The airport was an hour from our town, on the other side of the river.
  My mother kept a jar of buttons from every coat she had ever owned. I used to empty it on the floor and sort them by color for hours.|I did not know then that I was sorting her life: each button was a winter, a city, a version of her, and the jar was the only diary she ever kept.|This shows that children enjoy simple games.|The jar was glass with a tin lid, and it sat on the shelf above the sewing machine.
  At sixteen, I was the only one in my family who spoke English well, so I went to every doctor's appointment to translate. I learned words like "biopsy" before I learned to drive.|I see now that I was not only translating words but carrying news, and that a child who must tell her parents frightening things grows up faster than her years.|This teaches us that learning languages is useful.|The hospital was across town, and we took two buses to get there.
  The day I left for college, my father, who never cried, stood in the driveway and waved until the car turned the corner.|I have thought about that wave for years, and I believe it said everything he could not: that he was proud, that he was afraid, and that he would wave as long as I could see him.|This shows that parents miss their children.|The drive to college took five hours, with one stop for lunch.
  For one whole winter, a stray cat came to our back door every evening, and I fed it in secret with scraps from dinner. In spring it stopped coming.|I never learned what happened to it, and I think that is why I remember it: it was the first thing I loved that asked for nothing and owed me nothing, and it left in the same way.|This teaches us to be kind to animals.|The cat was grey with a white patch on one ear and a crooked tail.
  When I won a scholarship, my teacher said I had earned it. My cousin, who was smarter than me, had left school at fourteen to work in our uncle's shop.|I am grateful for the scholarship, but I can no longer believe that I simply earned it; I was given time and help that my cousin never had, and my luck was partly his loss.|This proves that education is the key to success.|The scholarship letter came in a thick white envelope on a Saturday.
  `,
  2,
);

/** reflectionStep asks for the reflection that best completes a passage of narration. */
export const reflectionStep = point(
  "writing-the-reflection",
  t("Writing the Reflection", "写出反思"),
  t(
    "A personal essay earns its meaning in the reflection, where the older self looks back at what the younger self lived. A good reflection does three things: it stays tied to the **particular** experience, it says something the writer **did not see at the time**, and it is honest about complicated feelings. *I understand now that I was not protecting myself from the smell; I was protecting myself from seeing him weak.*\n\nTwo weaker endings tempt writers. A **stock moral**, such as *family is the most important thing*, could end a thousand essays and so says nothing about this one. **More narration or description**, such as what the weather was like at the funeral, keeps telling the story and never steps back to say what it means.",
    "个人随笔的意义来自反思：现在的自己回望过去的自己所经历的一切。好的反思做到三点：它紧扣**具体**的经历，说出作者**当时没有看清**的东西，并且坦诚地面对复杂的感受。*I understand now that I was not protecting myself from the smell; I was protecting myself from seeing him weak.*\n\n有两种较弱的结尾容易吸引作者。**套话式的道理**，比如 *family is the most important thing*，可以给一千篇随笔作结尾，因此对这一篇什么也没说。**继续叙述或描写**，比如葬礼那天的天气，只是在接着讲故事，从来没有抽身出来说明它的意义。",
  ),
  kindedChoice(
    ["Which sentence gives this passage the reflection it needs?", "哪个句子为这段文字提供了它所需要的反思？"],
    reflectionBank,
    (right) => [
      `*${right}* The older self looks back at this particular experience and says what the younger self could not see at the time.`,
      `*${right}* 现在的自己回望这段具体的经历，说出了过去的自己当时看不清的东西。`,
    ],
    [
      [
        "*{wrong}* is a stock moral that could end any essay; it says nothing that only this experience could teach.",
        "*{wrong}* 是一句可以给任何随笔作结尾的套话；它没有说出只有这段经历才能带来的领悟。",
      ],
      [
        "*{wrong}* only adds narration or description; it keeps telling the story and never steps back to say what it means.",
        "*{wrong}* 只是增加了叙述或描写；它一直在讲故事，从来没有抽身出来说明其意义。",
      ],
    ],
  ),
);
