// Grade 4: the writing topics of craft checked by rules: showing instead of telling, combining with phrases,
// sensory details and the format of a script.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { fields, type Item, itemGenerator, type Kind, nameKind, pick } from "./kit.ts";
import { after } from "./prior.ts";

// Showing, not telling.

const feelings: Readonly<Record<string, Kind>> = {
  nervous: {
    zh: "紧张",
    is: ["Shaking hands, a dry mouth and fidgeting show that a character is nervous.", "手发抖、口干、坐立不安，表现出人物很紧张。"],
  },
  angry: {
    zh: "生气",
    is: ["Clenched fists, a red face and slammed doors show that a character is angry.", "攥紧拳头、脸涨红、摔门，表现出人物很生气。"],
  },
  happy: {
    zh: "开心",
    is: ["Grins, skipping and humming show that a character is happy.", "咧嘴笑、蹦蹦跳跳、哼着歌，表现出人物很开心。"],
  },
  tired: {
    zh: "疲倦",
    is: ["Yawns, drooping eyes and slow steps show that a character is tired.", "打哈欠、眼皮下垂、脚步缓慢，表现出人物很疲倦。"],
  },
  scared: {
    zh: "害怕",
    is: ["Freezing, holding one's breath and hiding show that a character is scared.", "僵住不动、屏住呼吸、躲起来，表现出人物很害怕。"],
  },
  proud: {
    zh: "自豪",
    is: [
      "Standing tall, showing something off and beaming show that a character is proud.",
      "挺直身子、展示自己的成果、满面笑容，表现出人物很自豪。",
    ],
  },
  sad: {
    zh: "难过",
    is: ["Tears, a bowed head and a quiet voice show that a character is sad.", "流泪、低着头、声音很轻，表现出人物很难过。"],
  },
  excited: {
    zh: "兴奋",
    is: ["Bouncing, talking fast and not sitting still show that a character is excited.", "蹦跳、说话飞快、坐不住，表现出人物很兴奋。"],
  },
};

const showLines = `
  Mia was very nervous about reading her poem to the whole class.|Mia's hands shook so hard that the paper rattled as she stood up.|nervous
  Leo felt nervous before his first swimming race of the year.|Leo kept snapping his goggles against his forehead and could not stand still.|nervous
  Grandpa was nervous while he waited for news from the hospital.|Grandpa checked his phone, put it down, then checked it again.|nervous
  Ana felt really nervous on the first morning at her new school.|Ana tugged at her sleeve and stared at her shoes all the way to the gate.|nervous
  Sam was extremely angry when his brother broke his model plane.|Sam's face turned red, and he stomped upstairs and slammed his door.|angry
  The farmer was angry that the goats had eaten all of his cabbages.|The farmer threw down his hat and shook his fist at the goats.|angry
  Priya felt angry when her friend told everyone her secret.|Priya crossed her arms, pressed her lips together and turned her back.|angry
  The coach was very angry when the team walked off the field early.|The coach's whistle shrieked, and the veins stood out on his neck.|angry
  Tom was very happy when he saw the new puppy in the kitchen.|Tom dropped his bag, grinned from ear to ear and scooped up the puppy.|happy
  Lily felt happy as she walked home in the sunshine after school.|Lily skipped down the path, humming her favorite song to the birds.|happy
  The old woman was happy that her grandchildren had come to visit.|The old woman laughed and hugged each child twice at the front door.|happy
  Ben felt really happy when his team won the final match.|Ben leaped into the air and whooped until his voice was hoarse.|happy
  Zara was very tired after the long hike up the mountain.|Zara's legs dragged, and she yawned so wide that her jaw cracked.|tired
  The baker felt tired at the end of a busy day in his shop.|The baker sank into his chair, and his eyes slowly closed.|tired
  Max was tired after staying up late to finish his book.|Max rested his head on his desk and could barely keep his eyes open.|tired
  Mom felt very tired when she came home from her night shift.|Mom kicked off her shoes and fell asleep on the sofa in her coat.|tired
  Jada was scared when she heard a noise in the dark attic.|Jada froze, held her breath and pulled the blanket over her head.|scared
  The kitten felt scared of the loud thunder outside the window.|The kitten flattened its ears and squeezed itself under the bed.|scared
  Omar was very scared as the roller coaster climbed the first hill.|Omar gripped the bar until his knuckles turned white.|scared
  The hikers felt scared when they saw a bear on the trail ahead.|The hikers stopped dead, and no one dared to make a sound.|scared
  Nina was very proud of the painting she had made for the art show.|Nina stood beside her painting and pointed it out to everyone who passed.|proud
  Dad felt proud when his daughter rode her bike without help.|Dad clapped and called out to the neighbors to come and watch.|proud
  Kai was proud that he had finally learned to tie his own shoes.|Kai held up his foot to show his teacher the neat double knot.|proud
  The young chef was proud of the cake she had baked all by herself.|The young chef carried the cake to the table with her chin held high.|proud
  Rosa was very sad when her best friend moved to another city.|Rosa sat by the window, and a tear rolled down her cheek.|sad
  The boy felt sad when he could not find his lost dog anywhere.|The boy's shoulders slumped, and he walked home slowly with his head down.|sad
  Grandma was sad as she said goodbye at the train station.|Grandma waved until the train was gone, then wiped her eyes with a tissue.|sad
  Eli felt sad when he was not picked for the school play.|Eli stared at the list on the wall, then quietly walked away.|sad
  Hana was very excited about the class trip to the zoo tomorrow.|Hana bounced on her toes and talked about the zoo all through dinner.|excited
  The twins felt excited when they saw snow falling outside.|The twins pressed their noses to the window and shrieked with delight.|excited
  Luis was excited to open the big box under the tree.|Luis tore at the paper so fast that pieces flew across the room.|excited
  The puppy was very excited when it saw its leash by the door.|The puppy spun in circles, barking and wagging its whole body.|excited
`;

const shows = fields(showLines).map(([tell, show, feeling]) => {
  if (!tell || !show || !feeling || !feelings[feeling]) throw new Error(`a show line needs a known feeling: ${tell}`);
  return { tell, show, feeling };
});

/** showingBank asks for the sentence that shows a feeling instead of naming it. */
const showingBank: readonly Item[] = shows.map((s, i) => {
  const other = pick(
    shows.filter((o) => o.feeling !== s.feeling),
    i * 3,
  );
  return {
    question: t(
      `Which sentence shows that a character is ${s.feeling} without naming the feeling?`,
      `哪个句子不直接说出感受，却表现出人物很${feelings[s.feeling]?.zh}？`,
    ),
    shown: "",
    right: s.show,
    wrong: [s.tell, other.show],
    why: t(
      `This sentence **shows**: it gives actions the reader can picture, and the reader works out the feeling. ${feelings[s.feeling]?.is[0]}`,
      `这个句子是在**表现**：它写出读者能想象的动作，让读者自己体会出感受。${feelings[s.feeling]?.is[1]}`,
    ),
    whyNot: [
      t(
        `This sentence **tells**: it names the feeling, ${s.feeling}, instead of showing it through actions.`,
        `这个句子是在**直接说**：它说出了感受“${feelings[s.feeling]?.zh}”，而不是通过动作表现出来。`,
      ),
      t(
        `This sentence shows, but it shows a different feeling: the character seems ${other.feeling}.`,
        `这个句子是在表现，但表现的是另一种感受：人物看起来很${feelings[other.feeling]?.zh}。`,
      ),
    ],
  };
});

// Combining with phrases.

const phraseLines = `
  The cat slept.|It was on the warm windowsill.|on the warm windowsill|under the warm windowsill
  The children played.|They played in the park after lunch.|in the park after lunch|in the park before lunch
  A small boat sailed.|It sailed across the lake.|across the lake|around the lake
  The owl hooted.|It was in the old oak tree.|in the old oak tree|beside the old oak tree
  Grandma planted roses.|She planted them along the fence.|along the fence|behind the fence
  The fox hid.|It hid behind a pile of logs.|behind a pile of logs|on top of a pile of logs
  We ate our picnic.|We ate it beside the river.|beside the river|across the river
  The bus stopped.|It stopped in front of the library.|in front of the library|behind the library
  A camel walked.|It walked through the sandstorm.|through the sandstorm|after the sandstorm
  The knight rode.|He rode toward the castle gate.|toward the castle gate|away from the castle gate
  Merchants traveled.|They traveled with their camels.|with their camels|without their camels
  The baby laughed.|She laughed at the silly puppet.|at the silly puppet|with the silly puppet
  The actors waited.|They waited behind the curtain.|behind the curtain|in front of the curtain
  Lava flowed.|It flowed down the side of the volcano.|down the side of the volcano|up the side of the volcano
  The squirrel ran.|It ran up the tall pine tree.|up the tall pine tree|around the tall pine tree
  Dad read a story.|He read it before bedtime.|before bedtime|after bedtime
  The bees buzzed.|They buzzed around the flowers.|around the flowers|under the flowers
  A frog jumped.|It jumped into the pond.|into the pond|out of the pond
  The train rushed.|It rushed through the dark tunnel.|through the dark tunnel|past the dark tunnel
  The painter worked.|She worked in a sunny studio.|in a sunny studio|near a sunny studio
  The team practiced.|They practiced during the storm.|during the storm|before the storm
  A seal rested.|It rested on a floating piece of ice.|on a floating piece of ice|under a floating piece of ice
  The guards watched.|They watched from the tower.|from the tower|below the tower
  The girl swam.|She swam across the pool.|across the pool|along the pool
  Snow fell.|It fell over the quiet village.|over the quiet village|beyond the quiet village
  The dog barked.|It barked at the mail carrier.|at the mail carrier|for the mail carrier
  My brother hid the gift.|He hid it under his bed.|under his bed|on his bed
  The audience clapped.|They clapped after the last song.|after the last song|during the last song
  The scientist dug.|She dug near the bottom of the cliff.|near the bottom of the cliff|near the top of the cliff
  A spider waited.|It waited in the corner of its web.|in the corner of its web|outside the corner of its web
  The climbers rested.|They rested below the summit.|below the summit|on the summit
  The wind howled.|It howled through the empty streets.|through the empty streets|along the empty streets
`;

const phraseRows = fields(phraseLines).map(([first, second, phrase, swapped]) => {
  if (!first || !second || !phrase || !swapped) throw new Error(`a phrase line needs four fields: ${first}`);
  return { first, second, phrase, swapped };
});

const joined = (first: string, phrase: string) => `${first.replace(/\.$/, "")} ${phrase}.`;
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** combineBank asks for the sentence that combines two with a prepositional phrase. */
const combineBank: readonly Item[] = phraseRows.map((r) => {
  const splice = `${r.first.replace(/\.$/, "")}, ${lower(r.second)}`;
  const swapped = joined(r.first, r.swapped);
  return {
    question: t("Which sentence best combines the two sentences?", "哪个句子把这两个句子合并得最好？"),
    shown: `${r.first} ${r.second}`,
    right: joined(r.first, r.phrase),
    wrong: [splice, swapped],
    why: t(
      `The second sentence only tells where, when or how, so its phrase, “${r.phrase}”, can join the first sentence. One smooth sentence replaces two short ones.`,
      `第二句只说明地点、时间或方式，所以可以把其中的短语“${r.phrase}”接到第一句上。一个流畅的句子代替了两个短句。`,
    ),
    whyNot: [
      t(
        "This joins two complete sentences with only a comma, which is a comma splice. It also keeps the repeated words.",
        "这只用逗号连接两个完整的句子，是逗号粘连句，而且还保留了重复的词。",
      ),
      t(
        `This changes the fact: the second sentence says “${r.phrase}”, not “${r.swapped}”.`,
        `这改变了事实：第二句说的是“${r.phrase}”，而不是“${r.swapped}”。`,
      ),
    ],
  };
});

/** phraseBank asks for the phrase that carries the fact of the second sentence. */
const phraseBank: readonly Item[] = phraseRows.map((r, i) => {
  const foreign = pick(phraseRows, i + 5).phrase;
  return {
    question: t(
      "Which phrase completes the combined sentence so that it keeps both facts?",
      "哪个短语填入合并后的句子，能保留两个句子的事实？",
    ),
    shown: `${r.first} ${r.second}\n\n${r.first.replace(/\.$/, "")} ___.`,
    right: r.phrase,
    wrong: [r.swapped, foreign],
    why: t(
      `“${r.phrase}” is the prepositional phrase of the second sentence. Moving it into the first sentence keeps the fact and drops the repeated words.`,
      `“${r.phrase}”是第二句中的介词短语。把它移到第一句里，既保留了事实，又去掉了重复的词。`,
    ),
    whyNot: [
      t(
        `“${r.swapped}” has a different preposition, so it changes where or when: the second sentence says “${r.phrase}”.`,
        `“${r.swapped}”的介词不同，改变了地点或时间：第二句说的是“${r.phrase}”。`,
      ),
      t(
        `“${foreign}” is not in either sentence, so it adds a fact the sentences do not give.`,
        `“${foreign}”不在这两个句子中，加了句子里没有的事实。`,
      ),
    ],
  };
});

// Sensory details.

const senses: Readonly<Record<string, Kind>> = {
  sight: {
    zh: "视觉",
    is: ["It tells what something looks like: its color, shape, size or light.", "它写出事物看起来的样子：颜色、形状、大小或光线。"],
  },
  sound: {
    zh: "听觉",
    is: ["It tells what something sounds like: a noise, a voice or a silence.", "它写出事物听起来的样子：声响、说话声或寂静。"],
  },
  smell: { zh: "嗅觉", is: ["It tells what something smells like.", "它写出事物闻起来的气味。"] },
  taste: { zh: "味觉", is: ["It tells what something tastes like in the mouth.", "它写出事物吃到嘴里的味道。"] },
  touch: {
    zh: "触觉",
    is: [
      "It tells what something feels like on the skin: rough, smooth, hot, cold or wet.",
      "它写出事物碰到皮肤的感觉：粗糙、光滑、冷热或潮湿。",
    ],
  },
};

const senseLines = `
  Golden sunlight spilled across the wooden floor.|sight
  Tall purple flowers swayed at the edge of the path.|sight
  The castle's gray towers rose against a pale sky.|sight
  A red kite zigzagged high above the green hill.|sight
  Tiny stars of frost sparkled on the windowpane.|sight
  Thousands of lanterns glowed orange over the market.|sight
  The kettle whistled shrilly in the kitchen.|sound
  Rain drummed steadily on the tin roof all night.|sound
  The old floorboards creaked under every step.|sound
  Far away, a dog howled at the moon.|sound
  The crowd roared as the runners crossed the line.|sound
  Dry leaves crunched under our boots in the forest.|sound
  The smell of fresh bread drifted from the bakery.|smell
  Smoke from the campfire clung to our jackets.|smell
  The sharp scent of pine filled the cold mountain air.|smell
  The barn smelled of hay and damp animals.|smell
  A sweet perfume of roses floated over the garden wall.|smell
  The air near the harbor smelled of salt and fish.|smell
  The lemonade was sour enough to make my lips pucker.|taste
  The soup tasted salty and rich, with a hint of ginger.|taste
  The ripe mango was sweet and juicy on my tongue.|taste
  The medicine tasted bitter, like burnt toast.|taste
  The spicy noodles made my mouth tingle and burn.|taste
  The cold watermelon tasted fresh and faintly sweet.|taste
  The sand burned the soles of my bare feet.|touch
  The kitten's fur was soft as a cloud under my hand.|touch
  An icy wind stung my cheeks and fingers.|touch
  The bark of the old tree felt rough and cracked.|touch
  Warm bath water closed around my tired shoulders.|touch
  The wet clay squished between my fingers.|touch
  Colorful paper fish dangled from the classroom ceiling.|sight
  A trumpet blared from the back of the parade.|sound
  The kitchen smelled of onions frying in butter.|smell
  The dark chocolate melted, bitter and creamy, in my mouth.|taste
  The stone steps felt cool and smooth under my feet.|touch
`;

const moodLines = `
  the kitchen|cheerful|Sunlight bounced off the yellow cups, and a radio hummed a tune.|gloomy|Dirty dishes sat in the cold sink under a flickering bulb.|frightening|Something scraped slowly across the floor behind the pantry door.
  the forest|cheerful|Birds chattered in the branches, and sunbeams danced on the moss.|gloomy|Gray mist hung between the bare trees, and nothing moved.|frightening|A twig snapped in the dark, and two yellow eyes blinked.
  the beach|cheerful|Children splashed in the waves as kites bobbed in the blue sky.|gloomy|Cold rain swept the empty sand, and the café was boarded up.|frightening|Black clouds raced in, and a huge wave crashed over the rocks.
  the attic|cheerful|Bright quilts and old toys spilled from a trunk in a pool of light.|gloomy|Dust lay thick on the boxes, and the window was streaked with grime.|frightening|The rocking chair in the corner began to rock by itself.
  the school hall|cheerful|Balloons bobbed over the tables, and everyone was laughing.|gloomy|The chairs stood in silent rows, and rain ran down the windows.|frightening|The lights went out, and a door banged somewhere in the dark.
  the garden|cheerful|Bees hummed over bright tulips, and a sprinkler sparkled.|gloomy|Brown weeds choked the beds, and the fountain was dry and cracked.|frightening|The bushes rustled, though there was no wind at all.
  the castle|cheerful|Flags fluttered from the towers, and music drifted from the hall.|gloomy|The great hall was empty, and the fire had burned down to ash.|frightening|Footsteps echoed in the passage, but no one was there.
  the market|cheerful|Stalls overflowed with ripe fruit, and sellers called out jokes.|gloomy|Half the stalls were shut, and a few sellers huddled in the drizzle.|frightening|The crowd suddenly pushed and shoved as someone screamed.
  the train station|cheerful|Families hugged under the big clock as a whistle blew happily.|gloomy|One tired traveler sat on a bench, and the last train was late.|frightening|The platform lights buzzed and died, and the tracks began to shake.
  the bedroom|cheerful|Posters of stars covered the walls, and a nightlight glowed softly.|gloomy|The curtains stayed closed all day, and the bed was never made.|frightening|The closet door creaked open an inch in the middle of the night.
`;

const moods: Readonly<Record<string, readonly [string, string]>> = {
  cheerful: ["cheerful", "欢快"],
  gloomy: ["gloomy", "阴郁"],
  frightening: ["frightening", "可怕"],
};

const moodRows = fields(moodLines).flatMap(([place, m1, d1, m2, d2, m3, d3]) => {
  const ds = [
    [m1, d1],
    [m2, d2],
    [m3, d3],
  ] as const;
  if (!place || ds.some(([m, d]) => !m || !d || !moods[m])) throw new Error(`a mood line needs three moods: ${place}`);
  return ds.map(([mood], k) => ({
    place,
    mood: mood as string,
    right: ds[k]?.[1] as string,
    others: ds.filter((_, j) => j !== k) as (readonly [string, string])[],
  }));
});

/** moodBank asks for the sensory detail that builds a given mood. */
const moodBank: readonly Item[] = moodRows.map((r) => ({
  question: t(
    `A writer wants ${r.place} to feel ${r.mood}. Which detail fits best?`,
    `作者想让这个地方（${r.place}）显得${moods[r.mood]?.[1]}。哪个细节最合适？`,
  ),
  shown: "",
  right: r.right,
  wrong: r.others.map(([, d]) => d),
  why: t(
    `This detail makes the place feel ${r.mood}. Writers choose sensory details that all point to the same mood.`,
    `这个细节让这个地方显得${moods[r.mood]?.[1]}。作者会选择都指向同一种氛围的感官细节。`,
  ),
  whyNot: r.others.map(([m]) =>
    t(
      `This is a vivid detail, but it makes the place feel ${m}, not ${r.mood}.`,
      `这个细节很生动，但它让这个地方显得${moods[m]?.[1]}，而不是${moods[r.mood]?.[1]}。`,
    ),
  ),
}));

// Script format.

const scriptLines = `
  Grandpa|looking up from his book|Who left the front door open?
  Mia|whispering|I think the play is about to start.
  Leo|jumping up and down|We won the match!
  The Queen|frowning at the map|Where is my missing ship?
  Sam|rubbing his eyes|Is it morning already?
  The Fox|bowing low|Good evening, Mrs. Hen.
  Nina|holding up a jar|Look what I found in the garden!
  The Captain|pointing at the sky|A storm is coming. Lower the sails!
  Ana|shaking her head|I did not eat the last cookie.
  The Giant|stomping across the stage|Who is climbing my beanstalk?
  Ben|giggling|Your hat is on backward.
  Mom|calling from the kitchen|Dinner is ready!
  The Robot|in a flat voice|Hello. I am here to help.
  Zara|pacing the room|What if nobody comes to the party?
  The Knight|drawing his sword|Stand back, dragon!
  Omar|reading the letter|We are moving to the coast.
  The Teacher|tapping the board|Copy this into your notebooks.
  Lily|hugging her puppy|You are the best dog in the world.
  The Baker|wiping flour from his hands|The bread will be ready soon.
  Kai|peeking around the door|Is anyone in here?
  The Dragon|yawning|I have slept for a hundred years.
  Rosa|waving|Over here, everyone!
  The Farmer|scratching his head|Where did all my cabbages go?
  Eli|in a shaky voice|I am not afraid of the dark.
  The Wolf|licking his lips|What big eyes you have.
  Hana|clapping|That was the best song yet!
  The Guard|blocking the gate|No one may enter the city tonight.
  Luis|counting coins|We need three more coins for the ticket.
  Grandma|smiling|I made your favorite soup.
  The Owl|blinking slowly|Who goes there?
  Jada|stamping her foot|That is not fair!
  The Mayor|holding up a key|I give this key to our town's hero.
`;

const scriptRows = fields(scriptLines).map(([speaker, direction, words]) => {
  if (!speaker || !direction || !words) throw new Error(`a script line needs three fields: ${speaker}`);
  return { speaker, direction, words };
});

type ScriptRow = (typeof scriptRows)[number];

const right = (r: ScriptRow) => `${r.speaker.toUpperCase()}: (${r.direction}) ${r.words}`;

const faults = [
  {
    en: "It puts the words in quotation marks.",
    zh: "它把台词放进了引号。",
    line: (r: ScriptRow) => `${r.speaker.toUpperCase()}: (${r.direction}) “${r.words}”`,
    because: [
      "A script needs no quotation marks: everything after the name is what the character says.",
      "剧本不用引号：名字后面的都是人物说的话。",
    ],
  },
  {
    en: "It has no colon after the name.",
    zh: "名字后面没有冒号。",
    line: (r: ScriptRow) => `${r.speaker.toUpperCase()} (${r.direction}) ${r.words}`,
    because: [
      "The speaker's name is followed by a colon, which shows where the lines begin.",
      "说话人的名字后面要加冒号，表示台词从这里开始。",
    ],
  },
  {
    en: "The stage direction is not in brackets.",
    zh: "舞台说明没有放在括号里。",
    line: (r: ScriptRow) => `${r.speaker.toUpperCase()}: ${r.direction}, ${r.words}`,
    because: [
      "A stage direction goes in brackets, so actors know it is to be acted, not spoken.",
      "舞台说明要放在括号里，让演员知道这是要演的，不是要说的。",
    ],
  },
] as const;

/** scriptLineBank asks for the line of a script that turns a story sentence into script format. */
const scriptLineBank: readonly Item[] = scriptRows.map((r, i) => {
  const used = [pick(faults, i), pick(faults, i + 1)] as const;
  return {
    question: t(
      "Which line turns this sentence of a story into a line of a script, correctly?",
      "哪一行把故事中的这个句子正确地改写成了剧本台词？",
    ),
    shown: `${r.speaker}, ${r.direction}, said, “${r.words}”`,
    right: right(r),
    wrong: used.map((f) => f.line(r)),
    why: t(
      "In a script, the speaker's name comes first in capitals with a colon, the stage direction goes in brackets, and the words follow with no quotation marks.",
      "在剧本中，说话人的名字大写写在最前面并加冒号，舞台说明放在括号里，台词跟在后面，不用引号。",
    ),
    whyNot: used.map((f) => t(`${f.en} ${f.because[0]}`, `${f.zh}${f.because[1]}`)),
  };
});

/** scriptFaultBank asks what is wrong with a line of a script. */
const scriptFaultBank: readonly Item[] = scriptRows.flatMap((r) =>
  faults.map((f) => {
    const others = faults.filter((o) => o !== f);
    return {
      question: t("What is wrong with this line of a script?", "这行剧本台词有什么错误？"),
      shown: f.line(r),
      right: f.en,
      wrong: others.map((o) => o.en),
      why: t(`${f.en} ${f.because[0]} Correct: ${right(r)}`, `${f.zh}${f.because[1]} 正确写法：${right(r)}`),
      whyNot: others.map((o) =>
        t(`Not so: the line does not have this fault. ${o.because[0]}`, `不是这样：这行台词没有这个错误。${o.because[1]}`),
      ),
    };
  }),
);

/** craftWritingTopics4 are the rule-checked writing topics of grade 4 for the craft of stories and scripts. */
export const craftWritingTopics4: readonly TopicDef[] = [
  {
    id: "showing-not-telling",
    title: t("Showing, Not Telling", "表现而不是直说"),
    summary: t(
      "Writers show a character's feelings through actions instead of naming them.",
      "作者通过动作表现人物的感受，而不是直接说出来。",
    ),
    prerequisites: after("strong-verbs", "characters"),
    encompasses: [],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "the-sentence-that-shows",
        t("The Sentence That Shows", "表现感受的句子"),
        t(
          "**Telling** names a feeling: *Mia was nervous.* **Showing** gives actions the reader can picture: *Mia's hands shook so hard that the paper rattled.* The reader works out the feeling, which makes the story come alive.",
          "**直说**是说出感受：*Mia was nervous.* **表现**是写出读者能想象的动作：*Mia's hands shook so hard that the paper rattled.* 读者自己体会出感受，故事就生动起来了。",
        ),
        itemGenerator(showingBank),
      ),
      point(
        "the-feeling-an-action-shows",
        t("The Feeling an Action Shows", "动作表现的感受"),
        t(
          "To read a showing sentence, ask what a person who acts like this would feel. Slammed doors show anger; slow steps and yawns show tiredness; bouncing and fast talk show excitement.",
          "读表现感受的句子时，要问：这样做的人会有什么感受？摔门表现生气；脚步慢、打哈欠表现疲倦；蹦跳、说话飞快表现兴奋。",
        ),
        nameKind({
          lines: shows.map((s) => `${s.show}|${s.feeling}`).join("\n"),
          kinds: feelings,
          name: ["What feeling does this sentence show?", "这个句子表现了什么感受？"],
          find: (en, zh) => [`Which sentence shows that a character is ${en}?`, `哪个句子表现出人物很${zh}？`],
        }),
      ),
    ],
  },
  {
    id: "combining-with-phrases",
    title: t("Combining with Phrases", "用短语合并句子"),
    summary: t(
      "Two short sentences can become one when the second only adds a phrase of where, when or how.",
      "如果第二句只补充了地点、时间或方式的短语，两个短句就可以合成一句。",
    ),
    prerequisites: ["prepositional-phrases", "combining-with-conjunctions"],
    encompasses: [{ topic: "prepositional-phrases", weight: 0.3 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "combining-two-sentences-with-a-phrase",
        t("Combining Two Sentences with a Phrase", "用一个短语合并两个句子"),
        t(
          "*The cat slept. It was on the warm windowsill.* The second sentence only says where, so move its **prepositional phrase** into the first: *The cat slept on the warm windowsill.* Do not join the two with just a comma, and do not change the phrase.",
          "*The cat slept. It was on the warm windowsill.* 第二句只说明地点，所以把它的**介词短语**移到第一句里：*The cat slept on the warm windowsill.* 不要只用逗号把两句连起来，也不要改动短语。",
        ),
        itemGenerator(combineBank),
      ),
      point(
        "the-phrase-that-keeps-the-fact",
        t("The Phrase That Keeps the Fact", "保留事实的短语"),
        t(
          "The phrase you move must carry the same fact. A different preposition changes the meaning: *under the windowsill* is not *on the windowsill*. And a phrase from nowhere adds a fact the sentences never gave.",
          "移过去的短语必须表达同样的事实。换了介词意思就变了：*under the windowsill* 不等于 *on the windowsill*。凭空加上的短语则加了句子里没有的事实。",
        ),
        itemGenerator(phraseBank),
      ),
    ],
  },
  {
    id: "choosing-sensory-details",
    title: t("Choosing Sensory Details", "选择感官细节"),
    summary: t(
      "Details of sight, sound, smell, taste and touch help the reader live a scene, and together they build a mood.",
      "视觉、听觉、嗅觉、味觉和触觉的细节让读者身临其境，合在一起营造出一种氛围。",
    ),
    prerequisites: after("sensory-words", "adjectives-and-adverbs"),
    encompasses: [{ topic: "adjectives-and-adverbs", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "the-sense-a-detail-uses",
        t("The Sense a Detail Uses", "细节运用的感官"),
        t(
          "A **sensory detail** tells what something is like to one of the five senses: what you **see**, **hear**, **smell**, **taste** or **touch**. *Rain drummed on the roof* is sound; *the sand burned my feet* is touch. Good writers use more than sight.",
          "**感官细节**写出事物给五种感官之一的感受：**看到**、**听到**、**闻到**、**尝到**或**摸到**的。*Rain drummed on the roof* 是听觉；*the sand burned my feet* 是触觉。好的作者不只写视觉。",
        ),
        nameKind({
          lines: senseLines,
          kinds: senses,
          name: ["Which sense does this detail appeal to?", "这个细节诉诸哪种感官？"],
          find: (en, zh) => [`Which detail appeals to ${en}?`, `哪个细节诉诸${zh}？`],
        }),
      ),
      point(
        "details-that-build-a-mood",
        t("Details That Build a Mood", "营造氛围的细节"),
        t(
          "The same place can feel cheerful, gloomy or frightening, depending on the details. Sunlight and humming make a kitchen cheerful; a cold sink and a flickering bulb make it gloomy. Choose the details that all point to the mood you want.",
          "同一个地方可以显得欢快、阴郁或可怕，取决于细节。阳光和哼歌让厨房显得欢快；冰冷的水槽和闪烁的灯泡让它显得阴郁。要选择都指向你想要的氛围的细节。",
        ),
        itemGenerator(moodBank),
      ),
    ],
  },
  {
    id: "script-format",
    title: t("Script Format", "剧本格式"),
    summary: t(
      "A script writes each line as the speaker's name, a colon, a stage direction in brackets and the words, with no quotation marks.",
      "剧本把每句台词写成：说话人的名字、冒号、括号中的舞台说明和台词，不用引号。",
    ),
    prerequisites: ["parts-of-a-play", "punctuating-dialogue"],
    encompasses: [{ topic: "parts-of-a-play", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "writing-a-line-of-a-script",
        t("Writing a Line of a Script", "写一行剧本台词"),
        t(
          "To turn a story into a script, write the speaker's name in capitals and a colon, then any stage direction in brackets, then the words: *GRANDPA: (looking up from his book) Who left the front door open?* There are no quotation marks and no *said*.",
          "把故事改写成剧本时，先大写写出说话人的名字并加冒号，再把舞台说明放在括号里，然后写台词：*GRANDPA: (looking up from his book) Who left the front door open?* 不用引号，也不用 *said*。",
        ),
        itemGenerator(scriptLineBank),
      ),
      point(
        "finding-the-fault-in-a-script-line",
        t("Finding the Fault in a Script Line", "找出剧本台词的错误"),
        t(
          "Check a line of a script three ways. Is there a **colon** after the name? Is the stage direction in **brackets**? Are the words free of **quotation marks**? A line that fails one check is not in script format.",
          "从三方面检查剧本台词：名字后面有没有**冒号**？舞台说明有没有放在**括号**里？台词有没有多余的**引号**？只要有一项不符合，就不是剧本格式。",
        ),
        itemGenerator(scriptFaultBank),
      ),
    ],
  },
];
