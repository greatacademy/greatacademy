// Literature: the devices, structures and meanings of stories and poems, for grades 6 to 8.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

const deviceBank: readonly ChoiceItem[] = [
  ["The wind whispered secrets through the pines.", "personification", ["hyperbole", "alliteration"]],
  ["I have told you a million times to close the door!", "hyperbole", ["personification", "onomatopoeia"]],
  ["The old car coughed and groaned up the hill.", "personification", ["simile", "hyperbole"]],
  ["This backpack weighs a ton.", "hyperbole", ["metaphor", "personification"]],
  ["The sun smiled down on the picnic.", "personification", ["onomatopoeia", "hyperbole"]],
  ["I was so hungry I could eat a horse.", "hyperbole", ["simile", "alliteration"]],
  ["The stairs complained with every step we took.", "personification", ["hyperbole", "onomatopoeia"]],
  ["The line at the store was a mile long.", "hyperbole", ["personification", "simile"]],
  ["Opportunity knocked on her door the day the letter came.", "personification", ["alliteration", "hyperbole"]],
];

const deviceWhy = new Map([
  ["personification", ["It gives a human action or feeling to something that is not human.", "它把人的动作或感受赋予非人的事物。"]],
  [
    "hyperbole",
    ["It exaggerates far beyond the truth for effect, and no one takes it literally.", "它为了效果而远远夸大事实，没有人会按字面理解。"],
  ],
]);

const deviceEffectBank: readonly ChoiceItem[] = [
  [
    "The angry sea swallowed the little boat.",
    "It makes the sea seem fierce and dangerous.",
    ["It shows that the sea was hungry.", "It tells how deep the sea was."],
  ],
  [
    "My homework will take a hundred years.",
    "It shows how long and dull the homework feels.",
    ["It tells exactly how long the homework takes.", "It shows the homework is easy."],
  ],
  [
    "The tired house sagged under the snow.",
    "It makes the house seem old and worn out.",
    ["It shows the house needed sleep.", "It tells how much snow fell."],
  ],
  [
    "We waited forever for the bus.",
    "It stresses how impatient the waiting made them.",
    ["It tells that the bus never came.", "It gives the exact waiting time."],
  ],
  [
    "The flowers danced in the spring breeze.",
    "It creates a lively, cheerful picture of moving flowers.",
    ["It shows the flowers had legs.", "It tells that the breeze was cold."],
  ],
  [
    "Her backpack was heavier than an elephant.",
    "It stresses how heavy the backpack felt.",
    ["It compares her backpack to a real elephant's weight.", "It shows she owned an elephant."],
  ],
  [
    "The moon peeked shyly from behind the clouds.",
    "It makes the moon seem gentle and quiet.",
    ["It shows the moon was afraid.", "It tells the time of night."],
  ],
  [
    "The test questions went on for miles.",
    "It stresses how long the test felt.",
    ["It gives the length of the paper.", "It shows the test was outside."],
  ],
];

const soundBank: readonly ChoiceItem[] = [
  ["Sally sells sea shells by the sandy shore.", "alliteration", ["onomatopoeia", "rhyme"]],
  ["The bacon sizzled and popped in the pan.", "onomatopoeia", ["alliteration", "hyperbole"]],
  ["Big brown bears bounced on the bed.", "alliteration", ["onomatopoeia", "personification"]],
  ["Buzz! The bee flew past my ear.", "onomatopoeia", ["alliteration", "simile"]],
  ["The cat sat on the mat, round and fat.", "rhyme", ["alliteration", "onomatopoeia"]],
  ["Crash! The dishes hit the floor.", "onomatopoeia", ["rhyme", "alliteration"]],
  ["Peter picked a peck of purple plums.", "alliteration", ["rhyme", "onomatopoeia"]],
  ["The rain went drip, drip, drip on the roof.", "onomatopoeia", ["alliteration", "metaphor"]],
  ["The night was bright, the stars alight.", "rhyme", ["onomatopoeia", "hyperbole"]],
];

const soundWhy = new Map([
  [
    "alliteration",
    [
      "Several nearby words begin with the same consonant sound, which you hear when you read the line aloud.",
      "几个相邻的词以同一个辅音开头，把句子读出来就能听到。",
    ],
  ],
  [
    "onomatopoeia",
    [
      "A word imitates the sound it names, so saying it aloud sounds like the thing itself.",
      "一个词模仿它所指的声音，读出来就像那个东西发出的声音。",
    ],
  ],
  [
    "rhyme",
    [
      "Words at the ends of the line's parts share the same ending sound, while their first sounds differ.",
      "几个词的结尾音相同，而开头的音不同。",
    ],
  ],
]);

const rhymeSchemeBank: readonly ChoiceItem[] = [
  ["The day was long, / The wind was cold, / I sang a song / Of days of old.", "ABAB", ["AABB", "ABBA"]],
  ["The cat sat down / Beside the town. / The dog ran past / And ran so fast.", "AABB", ["ABAB", "ABCB"]],
  ["I saw a bird / Up in a tree, / It sang a tune / Just for me.", "ABCB", ["AABB", "ABAB"]],
  ["The night is near, / The lights are low, / The moon will glow, / The stars appear.", "ABBA", ["ABAB", "AABB"]],
  ["We ran outside / To see the snow. / We ran so fast, / Our cheeks aglow.", "ABCB", ["ABAB", "AABB"]],
  ["The rain came down, / It soaked the town. / The streets were wet, / And no one met.", "AABB", ["ABAB", "ABBA"]],
  ["A little seed / Beneath the ground / Began to grow / Without a sound.", "ABCB", ["AABB", "ABBA"]],
  ["The waves roll in, / The gulls fly by, / The tides begin, / Beneath the sky.", "ABAB", ["AABB", "ABCB"]],
];

const plotBank: readonly ChoiceItem[] = [
  ["Maya moves to a new town and lives with her aunt near the woods.", "exposition", ["climax", "resolution"]],
  ["Maya finds strange footprints and begins to follow them each night.", "rising action", ["exposition", "falling action"]],
  ["Maya comes face to face with the lost wolf pup in a storm.", "climax", ["rising action", "resolution"]],
  ["Maya carries the pup home, and the storm begins to clear.", "falling action", ["climax", "exposition"]],
  ["The pup is returned to its pack, and Maya feels at home at last.", "resolution", ["rising action", "climax"]],
  ["The story opens in a small fishing village, where Leo lives with his grandfather.", "exposition", ["falling action", "climax"]],
  ["A storm wrecks the boats, and Leo must find a way to save the harvest.", "rising action", ["resolution", "exposition"]],
  ["Leo sails out alone and pulls his grandfather from the sinking boat.", "climax", ["falling action", "exposition"]],
  ["The village rebuilds its boats, and Leo becomes a fisherman himself.", "resolution", ["climax", "rising action"]],
];

const plotWhy = new Map([
  ["exposition", ["It introduces the characters and the setting before the problem begins.", "它在问题出现之前介绍人物和背景。"]],
  ["rising action", ["The problem builds and the tension grows.", "问题逐渐发展，紧张感不断增强。"]],
  ["climax", ["It is the turning point, the moment of greatest tension.", "这是转折点，紧张感最强的时刻。"]],
  ["falling action", ["The tension eases after the turning point.", "转折点之后紧张感逐渐缓和。"]],
  ["resolution", ["The problem is settled and the story ends.", "问题得到解决，故事结束。"]],
]);

const conflictBank: readonly ChoiceItem[] = [
  [
    "Two friends both want to be captain of the team, and they stop speaking to each other.",
    "character against character",
    ["character against nature", "character against self"],
  ],
  [
    "A hiker is lost in a blizzard and must find shelter before night.",
    "character against nature",
    ["character against character", "character against society"],
  ],
  [
    "Jamal knows he should tell the truth about the broken window, but he is afraid.",
    "character against self",
    ["character against character", "character against nature"],
  ],
  [
    "A girl fights her town's rule that only boys may enter the science fair.",
    "character against society",
    ["character against self", "character against nature"],
  ],
  [
    "A sailor's boat is caught in a hurricane far from land.",
    "character against nature",
    ["character against society", "character against self"],
  ],
  [
    "Two brothers argue over who will inherit the family farm.",
    "character against character",
    ["character against self", "character against society"],
  ],
  [
    "Ana must decide whether to quit the piano she loves or keep going after failing a contest.",
    "character against self",
    ["character against nature", "character against society"],
  ],
  [
    "A reporter challenges a city law that keeps poor families out of the new park.",
    "character against society",
    ["character against character", "character against nature"],
  ],
];

const themeBank: readonly ChoiceItem[] = [
  [
    "A proud king refuses all advice and loses his kingdom. His humble servant, who listened to everyone, is chosen to lead.",
    "Pride can lead to a fall, while humility earns trust.",
    ["kings", "A king loses his kingdom."],
  ],
  [
    "Two rival teams are stranded together after a bus breaks down. By sharing food and stories, they become friends.",
    "People can find common ground when they work together.",
    ["friendship", "Two teams get stranded on a trip."],
  ],
  [
    "A girl spends a summer hiding her stutter. When she finally speaks up at the town meeting, people listen to her ideas, not her voice.",
    "Courage means speaking up even when you are afraid.",
    ["courage", "A girl speaks at a town meeting."],
  ],
  [
    "A boy wishes for endless free time. When his wish comes true, he grows bored and lonely, and he misses school and his friends.",
    "Getting everything you want does not always make you happy.",
    ["wishes", "A boy's wish comes true."],
  ],
  [
    "An old woman plants an oak tree she knows she will never see grown. Years later, her grandchildren play in its shade.",
    "What we do today can help those who come after us.",
    ["trees", "An old woman plants a tree."],
  ],
  [
    "A runner cheats to win a race but cannot enjoy the medal. She finally confesses and feels free for the first time.",
    "Honesty brings a peace that winning by cheating cannot.",
    ["running", "A runner wins a medal."],
  ],
  [
    "A town ignores warnings about the river. When the flood comes, neighbors who never spoke rush to help one another.",
    "Hard times can bring a community together.",
    ["floods", "A town is flooded."],
  ],
  [
    "A young artist copies famous painters for years, until her teacher tells her to paint what she sees. Her own style finally appears.",
    "True success comes from being yourself.",
    ["art", "A young artist paints pictures."],
  ],
];

const toneBank: readonly ChoiceItem[] = [
  ["Oh, wonderful. Another rainy Saturday stuck indoors. Just what I wanted.", "sarcastic", ["joyful", "fearful"]],
  ["We did it! After months of practice, our team is going to the finals!", "joyful", ["gloomy", "sarcastic"]],
  ["The empty house creaked. Something moved in the dark at the end of the hall.", "suspenseful", ["cheerful", "humorous"]],
  ["Grandpa's chair sits empty now. His old hat still hangs by the door.", "sad", ["excited", "humorous"]],
  ["My dog believes he is a lion. He roars at squirrels, then hides behind my legs.", "humorous", ["serious", "sad"]],
  ["Every citizen must vote. Our future depends on the choices we make today.", "serious", ["humorous", "sarcastic"]],
  ["The meadow lay quiet under the evening sun, and a soft breeze rocked the grass.", "peaceful", ["suspenseful", "angry"]],
  ["How dare they cut down the oldest tree in town without asking anyone!", "angry", ["peaceful", "humorous"]],
];

const themeEvidenceBank: readonly ChoiceItem[] = [
  [
    "Theme: Kindness can change an enemy into a friend.",
    "The boy who bullied Sam softens when Sam helps him after he falls.",
    ["Sam walks to school every morning.", "The bully is the tallest boy in class."],
  ],
  [
    "Theme: Greed can destroy what we value most.",
    "The miner keeps digging for more gold until the mine collapses on his house.",
    ["The miner lives near the mountains.", "Gold is a yellow metal."],
  ],
  [
    "Theme: Hard work matters more than talent.",
    "The weakest player practices every day and becomes the team's best scorer.",
    ["The team wears blue uniforms.", "The coach has won many trophies."],
  ],
  [
    "Theme: Home is where the people you love are.",
    "After traveling the world, the sailor is happiest back at his family's small table.",
    ["The sailor visits ten countries.", "The ship has three tall masts."],
  ],
  [
    "Theme: Telling the truth takes courage.",
    "Lena admits she broke the trophy, even though she knows she will be punished.",
    ["The trophy sits on a high shelf.", "Lena's sister is two years older."],
  ],
  [
    "Theme: Change can be frightening but good.",
    "Nervous about the new school, Raj soon finds friends who share his love of chess.",
    ["Raj's new school has a big library.", "Chess is played on a board."],
  ],
  [
    "Theme: Nature must be respected.",
    "The hikers ignore the storm warning and are trapped on the mountain for two days.",
    ["The mountain is covered with pine trees.", "The hikers carry red backpacks."],
  ],
  [
    "Theme: Small acts can make a big difference.",
    "One girl's habit of picking up litter spreads until the whole town keeps its park clean.",
    ["The park has a fountain.", "The girl likes to read."],
  ],
];

const moodBank: readonly ChoiceItem[] = [
  ["Fog crept over the graveyard, and a single crow cried from a bare branch.", "eerie", ["cheerful", "calm"]],
  ["Balloons bobbed everywhere, music played, and children laughed as they chased the clown.", "festive", ["gloomy", "tense"]],
  ["Rain dripped from the gray sky onto the empty playground.", "gloomy", ["joyful", "exciting"]],
  ["The clock ticked. The doctor still had not come out, and no one in the waiting room spoke.", "tense", ["relaxed", "festive"]],
  ["Waves lapped softly at the shore while the sun sank behind the hills.", "calm", ["frightening", "tense"]],
  ["The crowd roared as the runners rounded the final turn, neck and neck.", "exciting", ["gloomy", "calm"]],
  ["The cabin was warm, the fire crackled, and the smell of cocoa filled the room.", "cozy", ["eerie", "tense"]],
  ["Thunder shook the windows, the lights flickered out, and something scratched at the door.", "frightening", ["peaceful", "festive"]],
];

/** Say gives the feedback for a wrong option, in English and Chinese. */
type Say = (wrong: string, right: string, shown: string, position: number) => readonly [string, string];

const pick = (
  question: [string, string],
  bank: readonly ChoiceItem[],
  en: (right: string) => string,
  zh: (right: string) => string,
  not: Say,
) =>
  choiceGenerator(
    t(question[0], question[1]),
    bank,
    (right) => t(en(right), zh(right)),
    (wrong, right, shown, position) => t(...not(wrong, right, shown, position)),
  );

/** meaning looks up the feedback for a wrong label; a label with no entry is a mistake in the bank. */
const meaning =
  (says: Readonly<Record<string, readonly [string, string]>>): Say =>
  (wrong) => {
    const said = says[wrong];
    if (!said) throw new Error(`no feedback for the label ${wrong}`);
    return said;
  };

const named = (question: [string, string], bank: readonly ChoiceItem[], why: ReadonlyMap<string, readonly string[]>, not: Say) =>
  pick(
    question,
    bank,
    (right) => `This is **${right}**. ${why.get(right)?.[0] ?? ""}`,
    (right) => `这是 **${right}**。${why.get(right)?.[1] ?? ""}`,
    not,
  );

const deviceNot = meaning({
  personification: [
    "**Personification** would give a human action or feeling to something that is not human. Check whether anything non-human here acts like a person.",
    "**personification（拟人）**要把人的动作或感受赋予非人的事物。看看这里有没有非人的事物像人一样行动。",
  ],
  hyperbole: [
    "**Hyperbole** would be an exaggeration far beyond the truth. Check whether anything here is impossibly large, long or many.",
    "**hyperbole（夸张）**是远远超出事实的夸大。看看这里有没有大得、长得或多得不可能的东西。",
  ],
  alliteration: [
    "**Alliteration** would repeat the first consonant sound of nearby words. Read the line aloud: the words here do not start alike.",
    "**alliteration（头韵）**要让相邻的词重复相同的开头辅音。把句子读出来：这里的词开头并不相同。",
  ],
  onomatopoeia: [
    "**Onomatopoeia** would be a word that sounds like what it names, such as *buzz* or *crash*. No word here imitates a sound.",
    "**onomatopoeia（拟声）**是听起来像它所指声音的词，比如 *buzz* 或 *crash*。这里没有模仿声音的词。",
  ],
  simile: [
    "A **simile** would compare two things with *like* or *as*. Look for those words: they are not here.",
    "**simile（明喻）**要用 *like* 或 *as* 比较两样东西。找找这两个词：这里没有。",
  ],
  metaphor: [
    "A **metaphor** would say that one thing *is* another, different thing. Check whether the line names a second thing at all.",
    "**metaphor（暗喻）**要说一样东西*就是*另一样不同的东西。看看这句话是否提到了第二样东西。",
  ],
  rhyme: [
    "**Rhyme** would repeat the ending sounds of words, as in *night* and *bright*. Listen to the ends of the words: they do not sound alike.",
    "**rhyme（押韵）**要让词尾音相同，比如 *night* 和 *bright*。听听词的结尾：它们并不相同。",
  ],
});

const schemeNot = meaning({
  ABAB: [
    "**ABAB** would mean lines 1 and 3 rhyme, and lines 2 and 4 rhyme. Say the last word of each line aloud and compare them in pairs.",
    "**ABAB** 表示第 1、3 行押韵，第 2、4 行押韵。把每行最后一个词读出来，两两比较。",
  ],
  AABB: [
    "**AABB** would mean lines 1 and 2 rhyme, then lines 3 and 4. Say the last word of each line aloud and compare them in pairs.",
    "**AABB** 表示第 1、2 行押韵，第 3、4 行押韵。把每行最后一个词读出来，两两比较。",
  ],
  ABBA: [
    "**ABBA** would mean lines 1 and 4 rhyme, and lines 2 and 3 rhyme. Say the last word of each line aloud and compare them in pairs.",
    "**ABBA** 表示第 1、4 行押韵，第 2、3 行押韵。把每行最后一个词读出来，两两比较。",
  ],
  ABCB: [
    "**ABCB** would mean only lines 2 and 4 rhyme, and lines 1 and 3 rhyme with nothing. Say the last word of each line aloud and compare them in pairs.",
    "**ABCB** 表示只有第 2、4 行押韵，第 1、3 行不与任何行押韵。把每行最后一个词读出来，两两比较。",
  ],
});

const plotNot = meaning({
  exposition: [
    "The **exposition** only introduces the characters and setting, before any problem appears. Here something is already happening to the problem.",
    "**exposition（开端）**只介绍人物和背景，问题还没出现。而这里问题已经在发生变化。",
  ],
  "rising action": [
    "In the **rising action** a problem appears and grows. Ask whether this event builds the problem, or introduces, peaks or settles it.",
    "**rising action（发展）**中问题出现并加剧。问一问：这件事是在推进问题，还是在介绍、推向顶点或解决问题？",
  ],
  climax: [
    "The **climax** is the single turning point of greatest tension. Ask whether this is that moment, or one before or after it.",
    "**climax（高潮）**是紧张感最强的那个转折点。问一问：这是那个时刻，还是它之前或之后的事？",
  ],
  "falling action": [
    "The **falling action** comes right after the turning point, as the tension eases but the problem is not yet settled.",
    "**falling action（回落）**紧接在转折点之后，紧张感缓和，但问题还没有完全解决。",
  ],
  resolution: [
    "The **resolution** settles the problem and ends the story. Ask whether the problem is really over at this point.",
    "**resolution（结局）**解决问题、结束故事。问一问：到这里问题真的结束了吗？",
  ],
});

const conflictNot = meaning({
  "character against character": [
    "**Character against character** would need two characters struggling with each other. Ask who or what stands in this character's way.",
    "**character against character（人与人）**需要两个人物彼此争斗。问一问：挡在这个人物面前的是谁或什么？",
  ],
  "character against nature": [
    "**Character against nature** would need a storm, wild animal, cold or other force of nature to fight. Ask who or what stands in this character's way.",
    "**character against nature（人与自然）**需要人物对抗风暴、野兽、寒冷之类的自然力量。问一问：挡在这个人物面前的是谁或什么？",
  ],
  "character against self": [
    "**Character against self** would be a struggle inside the character's mind, a fear or a hard choice. Ask whether the obstacle is inside or outside the character.",
    "**character against self（人与自我）**是人物内心的斗争，比如恐惧或艰难的抉择。问一问：阻碍在人物内心还是外部？",
  ],
  "character against society": [
    "**Character against society** would need a rule, law or belief of a whole group to fight. Ask who or what stands in this character's way.",
    "**character against society（人与社会）**需要人物对抗整个群体的规则、法律或观念。问一问：挡在这个人物面前的是谁或什么？",
  ],
});

const toneNot: Say = (wrong) =>
  wrong === "sarcastic"
    ? [
        "A **sarcastic** tone says the opposite of what the writer means. These words mean just what they say.",
        "**sarcastic（讽刺）**的语气是字面与真实意思相反。这些话说的就是它的本意。",
      ]
    : [
        `Find the words that carry the writer's feeling: none of them shows a **${wrong}** attitude. Tone comes from those words, not from the subject.`,
        `找出带有作者情感的词：没有一个表现出 **${wrong}** 的态度。语气来自这些词，而不是话题。`,
      ];

const moodNot: Say = (wrong) => [
  `A **${wrong}** mood would need other details. Look at what the setting and the senses give you here, and how they make you feel.`,
  `**${wrong}** 的氛围需要别的细节。看看这里的背景和感官细节，它们让你有什么感觉。`,
];

/** literatureTopics are the topics of reading literature in grades 6 to 8: devices, sound, poetry, plot, conflict, theme and tone. */
export const literatureTopics: readonly TopicDef[] = [
  {
    id: "personification-and-hyperbole",
    title: t("Personification and Hyperbole", "拟人和夸张"),
    summary: t("Giving human qualities to things, and exaggerating for effect.", "赋予事物人的特点，以及为了效果而夸大。"),
    prerequisites: ["similes-and-metaphors"],
    encompasses: [{ topic: "similes-and-metaphors", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "naming-the-device",
        t("Naming the Device", "辨认修辞"),
        t(
          "**Personification** gives human actions or feelings to something that is not human: *The wind whispered*. **Hyperbole** is an exaggeration so great that no one takes it literally: *I have told you a million times*. Like similes and metaphors, both are figurative: they mean something other than what the words literally say.",
          "**拟人**把人的动作或感受赋予非人的事物：*The wind whispered*。**夸张**是极度的夸大，没有人会按字面理解：*I have told you a million times*。和明喻、暗喻一样，两者都是修辞性的：意思不同于字面。",
        ),
        named(["Which device does the sentence use?", "这句话用了哪种修辞？"], deviceBank, deviceWhy, deviceNot),
      ),
      point(
        "effect-of-the-device",
        t("The Effect of the Device", "修辞的效果"),
        t(
          "Writers choose devices for an effect. Personification can make a thing seem friendly, fierce or tired; hyperbole stresses a feeling such as boredom, hunger or impatience. To explain the effect, say what the device makes the reader feel or picture, not what the words literally claim.",
          "作者为了效果而选择修辞。拟人可以让事物显得友善、凶猛或疲惫；夸张强调无聊、饥饿或不耐烦之类的感受。解释效果时，要说出修辞让读者有什么感受或想象，而不是字面上说了什么。",
        ),
        pick(
          ["What is the effect of the figurative language?", "这里修辞的效果是什么？"],
          deviceEffectBank,
          (right) => `${right} The other choices read the words literally, which misses the effect.`,
          (right) => `${right} 其他选项按字面理解，没有抓住效果。`,
          (_wrong, _right, _shown, position) =>
            position === 0
              ? [
                  "This choice reads the figurative words literally, as if they were plain fact. Ask what the device makes you feel or picture instead.",
                  "这个选项把修辞按字面理解成了事实。问一问：这个修辞让你有什么感受或想象？",
                ]
              : [
                  "The line does not tell or suggest this. The effect of a device is a feeling or a picture it creates, so start from the device itself.",
                  "这句话并没有说出或暗示这一点。修辞的效果是它营造的感受或画面，要从修辞本身出发。",
                ],
        ),
      ),
    ],
  },
  {
    id: "sound-devices",
    title: t("Sound Devices", "声音修辞"),
    summary: t("Alliteration, onomatopoeia and rhyme, and the rhyme scheme of a stanza.", "头韵、拟声和押韵，以及诗节的韵式。"),
    prerequisites: [],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      point(
        "alliteration-onomatopoeia-rhyme",
        t("Alliteration, Onomatopoeia and Rhyme", "头韵、拟声和押韵"),
        t(
          "**Alliteration** repeats the first consonant sound of nearby words: *big brown bears*. **Onomatopoeia** is a word that sounds like what it names: *buzz, sizzle, crash*. **Rhyme** repeats the ending sounds of words: *night* and *bright*. Read the line aloud and listen for which one you hear.",
          "**头韵**是相邻的词重复相同的开头辅音：*big brown bears*。**拟声**是听起来像它所指声音的词：*buzz, sizzle, crash*。**押韵**是词尾音相同：*night* 和 *bright*。把句子读出来，听听用的是哪一种。",
        ),
        named(["Which sound device does the line use most?", "这行主要用了哪种声音修辞？"], soundBank, soundWhy, deviceNot),
      ),
      point(
        "rhyme-scheme",
        t("Rhyme Scheme", "韵式"),
        t(
          "A **rhyme scheme** labels the end sounds of the lines in a stanza with letters. The first end sound is A; each line that rhymes with it is also A; the next new sound is B, and so on. *Day, sun, play, fun* is ABAB. A line that rhymes with nothing still gets its own letter, as in ABCB.",
          "**韵式**用字母标出诗节各行的尾音。第一个尾音记为 A，与它押韵的行也记为 A；下一个新的尾音记为 B，依此类推。*day, sun, play, fun* 是 ABAB。不与任何行押韵的行也有自己的字母，例如 ABCB。",
        ),
        pick(
          ["What is the rhyme scheme of this stanza? A slash marks the end of each line.", "这个诗节的韵式是什么？斜线表示每行的结尾。"],
          rhymeSchemeBank,
          (right) => `The rhyme scheme is **${right}**. Give the first end sound A, and a new letter to each new sound.`,
          (right) => `韵式是 **${right}**。第一个尾音记为 A，每个新的尾音用一个新字母。`,
          schemeNot,
        ),
      ),
    ],
  },
  {
    id: "plot-and-conflict",
    title: t("Plot and Conflict", "情节与冲突"),
    summary: t("The stages of a plot, and the kinds of conflict that drive it.", "情节的各个阶段，以及推动情节的冲突类型。"),
    prerequisites: ["characters"],
    encompasses: [{ topic: "characters", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "stages-of-plot",
        t("Stages of a Plot", "情节的阶段"),
        t(
          "Most plots follow a pattern. The **exposition** introduces the characters and setting. In the **rising action**, a problem appears and grows. The **climax** is the turning point, the moment of greatest tension. In the **falling action**, the tension eases, and the **resolution** settles the problem.",
          "大多数情节遵循一个模式。**开端**介绍人物和背景。在**发展**中，问题出现并不断加剧。**高潮**是转折点，紧张感最强的时刻。在**回落**中，紧张感缓和，**结局**解决问题。",
        ),
        named(["Which part of the plot is this event?", "这件事属于情节的哪个部分？"], plotBank, plotWhy, plotNot),
      ),
      point(
        "kinds-of-conflict",
        t("Kinds of Conflict", "冲突的类型"),
        t(
          "A **conflict** is the struggle at the heart of a plot. It may be between two characters, between a character and nature, between a character and society (its rules or beliefs), or inside a character's own mind, as a hard choice or a fear.",
          "**冲突**是情节核心的斗争。它可能发生在两个人物之间、人物与自然之间、人物与社会（其规则或观念）之间，也可能发生在人物内心，表现为艰难的抉择或恐惧。",
        ),
        pick(
          ["What kind of conflict is this?", "这是哪种冲突？"],
          conflictBank,
          (right) => `This is **${right}**: ask what or whom the character is struggling against.`,
          (right) => `这是 **${right}**：问一问人物在和谁或什么作斗争。`,
          conflictNot,
        ),
      ),
    ],
  },
  {
    id: "theme",
    title: t("Theme", "主题"),
    summary: t(
      "The message about life a story conveys, as opposed to its topic or its plot.",
      "故事传达的人生道理，区别于它的话题或情节。",
    ),
    prerequisites: ["lesson-of-a-story"],
    encompasses: [{ topic: "lesson-of-a-story", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "theme-topic-or-plot",
        t("Theme, Topic or Plot", "主题、话题还是情节"),
        t(
          "A **theme** is a message about life, stated as a full sentence: *Pride can lead to a fall*. A **topic** is a single word or phrase, such as *kings* or *courage*. A sentence that only retells what happens is **plot**. Unlike a fable's lesson, a theme is rarely stated; you infer it from what the characters do and what happens to them.",
          "**主题**是关于人生的道理，用完整的句子表达：*Pride can lead to a fall*。**话题**是一个词或短语，比如 *kings* 或 *courage*。只复述发生了什么的句子是**情节**。和寓言的道理不同，主题很少直接说出来，需要从人物的行为及其遭遇中推断。",
        ),
        pick(
          ["Which states the theme of this story?", "哪一项陈述了这个故事的主题？"],
          themeBank,
          (right) =>
            `*${right}* is a message about life in a full sentence. The other choices are only a topic or a retelling of the plot.`,
          (right) => `*${right}* 是用完整句子表达的人生道理。其他选项只是话题或情节复述。`,
          (wrong, _right, _shown, position) =>
            position === 0
              ? [
                  `*${wrong}* is only a topic, a word or phrase. A theme says something about that topic in a full sentence.`,
                  `*${wrong}* 只是一个话题，一个词或短语。主题要用完整的句子说出关于这个话题的道理。`,
                ]
              : [
                  `*${wrong}* retells what happens in the story. A theme is the message about life that those events show.`,
                  `*${wrong}* 是在复述故事情节。主题是这些情节所体现的人生道理。`,
                ],
        ),
      ),
      point(
        "evidence-for-a-theme",
        t("Evidence for a Theme", "主题的依据"),
        t(
          "A theme is supported by what happens because of a character's choices. To find evidence, look for an event that shows the message in action. A detail about the setting or a character's looks may be true but says nothing about the theme.",
          "主题由人物的选择所带来的结果来支持。要找依据，就找能体现这个道理的事件。关于背景或人物外貌的细节也许是真的，却与主题无关。",
        ),
        pick(
          ["Which event best supports the theme?", "哪个事件最能支持这个主题？"],
          themeEvidenceBank,
          (right) => `*${right}* shows the theme in action. The other details are true of the story but say nothing about its message.`,
          (right) => `*${right}* 体现了这个主题。其他细节虽属于故事，却与它的道理无关。`,
          (wrong) => [
            `*${wrong}* may be true of the story, but no one makes a choice in it and lives with the result, so it does not show the theme in action.`,
            `*${wrong}* 也许属于故事，但其中没有人物做出选择并承担结果，所以它没有体现主题。`,
          ],
        ),
      ),
    ],
  },
  {
    id: "tone-and-mood",
    title: t("Tone and Mood", "语气与氛围"),
    summary: t("The writer's attitude, and the feeling a passage creates in the reader.", "作者的态度，以及一段文字在读者心中营造的感觉。"),
    prerequisites: ["characters"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "identifying-tone",
        t("Identifying Tone", "辨别语气"),
        t(
          "**Tone** is the writer's attitude toward the subject: joyful, sad, serious, humorous, angry, sarcastic. It comes from word choice and details, not from the subject alone: a rainy day can be written about peacefully or with sarcasm. In sarcasm, the words say the opposite of what the writer means.",
          "**语气**是作者对所写内容的态度：欢快、悲伤、严肃、幽默、愤怒、讽刺。它来自用词和细节，而不仅仅是话题：下雨天既可以写得宁静，也可以写得讽刺。讽刺时，字面意思与作者的真实意思相反。",
        ),
        pick(
          ["What is the tone of this passage?", "这段话的语气是什么？"],
          toneBank,
          (right) => `The tone is **${right}**: the word choice and details show this attitude. The other choices do not fit those words.`,
          (right) => `语气是 **${right}**：用词和细节表现了这种态度。其他选项与这些词不符。`,
          toneNot,
        ),
      ),
      point(
        "mood",
        t("Mood", "氛围"),
        t(
          "**Mood** is the feeling a passage creates in the reader, while tone is the writer's attitude. Setting and sensory details build mood: fog, a bare branch and a crow make a scene eerie; a fire, warmth and cocoa make it cozy.",
          "**氛围**是一段文字在读者心中营造的感觉，而语气是作者的态度。背景和感官细节营造氛围：雾、光秃秃的树枝和乌鸦让场景阴森；炉火、温暖和可可让它温馨。",
        ),
        pick(
          ["What mood does this passage create?", "这段话营造了什么氛围？"],
          moodBank,
          (right) =>
            `The mood is **${right}**: the setting and details make the reader feel this way. The other moods would need different details.`,
          (right) => `氛围是 **${right}**：背景和细节让读者有这种感觉。其他氛围需要不同的细节。`,
          moodNot,
        ),
      ),
    ],
  },
];
