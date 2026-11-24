// Literature: the devices, structures and meanings of stories and poems, for grades 6 to 8.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import {
  conflictMore,
  deviceEffectMore,
  deviceMore,
  moodMore,
  plotMore,
  rhymeSchemeMore,
  soundMore,
  themeEvidenceMore,
  themeMore,
  toneMore,
} from "./literature-more.ts";

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
  [
    "personification",
    [
      "It gives a human action or feeling to something that is not human.\n\n**Check.** Spot the nonhuman subject (wind, car, sun, stairs) and the human verb paired with it—only a person could literally do that action.",
      "它把人的动作或感受赋予非人的事物。\n\n**检验。** 找出非人的主语（风、车、太阳、楼梯等）和配给它的动作——只有人才能真正做出这种举动。",
    ],
  ],
  [
    "hyperbole",
    [
      "It exaggerates far beyond the truth for effect, and no one takes it literally.\n\n**Check.** Test the claim literally (a million times, weighing a ton, a mile long)—it is wildly impossible, proving deliberate exaggeration.",
      "它为了效果而远远夸大事实，没有人会按字面理解。\n\n**检验。** 按字面检验这个说法（一百万次、重达一吨、一英里长）——现实中绝无可能，证实是有意夸张。",
    ],
  ],
]);

const deviceEffectBank: readonly ChoiceItem[] = [
  [
    "The angry sea swallowed the little boat.",
    "It makes the sea seem fierce and dangerous.",
    ["It shows that the sea was really hungry and wanted to eat the boat.", "It tells how deep the sea was."],
  ],
  [
    "My homework will take a hundred years.",
    "It shows how long and dull the homework feels.",
    ["It tells exactly how long the homework takes.", "It shows the homework is easy."],
  ],
  [
    "The tired house sagged under the snow.",
    "It makes the house seem old and worn out.",
    ["It shows the house needed sleep.", "It tells how much snow fell on the roof of the house that night."],
  ],
  [
    "We waited forever for the bus.",
    "It stresses how impatient the waiting made them.",
    ["It tells that the bus never came.", "It gives the exact waiting time."],
  ],
  [
    "The flowers danced in the spring breeze.",
    "It creates a lively, cheerful picture of moving flowers.",
    ["It shows the flowers had real legs and could move around the garden.", "It tells that the breeze was cold."],
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
    ["It gives the length of the paper the test was printed on.", "It shows the test was outside."],
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
      "Several nearby words begin with the same consonant sound, which you hear when you read the line aloud.\n\n**Check.** Say the first sound of each main word in the line—the repeated opening consonant confirms alliteration.",
      "几个相邻的词以同一个辅音开头，把句子读出来就能听到。\n\n**检验。** 读出句中主要单词的首音——反复出现的开头辅音证实是头韵。",
    ],
  ],
  [
    "onomatopoeia",
    [
      "A word imitates the sound it names, so saying it aloud sounds like the thing itself.\n\n**Check.** Listen to the sound word (*buzz*, *sizzle*, *crash*, *drip*)—its pronunciation mimics the real-world noise.",
      "一个词模仿它所指的声音，读出来就像那个东西发出的声音。\n\n**检验。** 听听句中的拟声词（如 *buzz*、*sizzle*、*crash*、*drip*）——读音本身就在模仿现实声响。",
    ],
  ],
  [
    "rhyme",
    [
      "Words at the ends of the line's parts share the same ending sound, while their first sounds differ.\n\n**Check.** Pair the rhyming words aloud—their vowel and ending sounds match cleanly.",
      "几个词的结尾音相同，而开头的音不同。\n\n**检验。** 把押韵的词放一起读出——它们的元音和尾音完全呼应。",
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
  [
    "exposition",
    [
      "It introduces the characters and the setting before the problem begins.\n\n**Check.** Notice no crisis has started yet—this moment only places the characters in their world.",
      "它在问题出现之前介绍人物和背景。\n\n**检验。** 注意此时危机尚未发生——这里只交代人物和初始环境。",
    ],
  ],
  [
    "rising action",
    [
      "The problem builds and the tension grows.\n\n**Check.** Ask whether the trouble is escalating here without yet reaching the decisive showdown—yes, that is rising action.",
      "问题逐渐发展，紧张感不断增强。\n\n**检验。** 看这里的麻烦是不是正在升级、但尚未到达最终对决——正是发展阶段。",
    ],
  ],
  [
    "climax",
    [
      "It is the turning point, the moment of greatest tension.\n\n**Check.** Notice the character directly faces the peak danger or choice—everything after this moment shifts toward the outcome.",
      "这是转折点，紧张感最强的时刻。\n\n**检验。** 注意人物在这里直面最大危机或关键抉择——此后局势便转向收尾。",
    ],
  ],
  [
    "falling action",
    [
      "The tension eases after the turning point.\n\n**Check.** Notice the peak crisis has just passed and events are winding down toward the final settlement.",
      "转折点之后紧张感逐渐缓和。\n\n**检验。** 注意最危急的关头已经过去，情节正朝着最终解决回落。",
    ],
  ],
  [
    "resolution",
    [
      "The problem is settled and the story ends.\n\n**Check.** Notice the conflict is completely over and we see the characters' new normal at the close of the story.",
      "问题得到解决，故事结束。\n\n**检验。** 注意冲突已经彻底落幕，这里呈现的是故事结尾的新状态。",
    ],
  ],
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
    ["friendship", "Two rival teams get stranded together after their bus breaks down on a trip."],
  ],
  [
    "A girl spends a summer hiding her stutter. When she finally speaks up at the town meeting, people listen to her ideas, not her voice.",
    "Courage means speaking up even when you are afraid.",
    ["courage", "A girl speaks at a town meeting."],
  ],
  [
    "A boy wishes for endless free time. When his wish comes true, he grows bored and lonely, and he misses school and his friends.",
    "Getting everything you want does not always make you happy.",
    ["wishes", "A boy wishes for endless free time, and his wish comes true for a whole summer."],
  ],
  [
    "An old woman plants an oak tree she knows she will never see grown. Years later, her grandchildren play in its shade.",
    "What we do today can help those who come after us.",
    ["trees", "An old woman plants a tree."],
  ],
  [
    "A runner cheats to win a race but cannot enjoy the medal. She finally confesses and feels free for the first time.",
    "Honesty brings a peace that winning by cheating cannot.",
    ["running", "A runner wins a race and a medal, and later she tells everyone that she cheated."],
  ],
  [
    "A town ignores warnings about the river. When the flood comes, neighbors who never spoke rush to help one another.",
    "Hard times can bring a community together.",
    ["floods", "A town is flooded."],
  ],
  [
    "A young artist copies famous painters for years, until her teacher tells her to paint what she sees. Her own style finally appears.",
    "True success comes from being yourself.",
    ["art", "A young artist copies famous painters for years before her teacher gives her advice."],
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
    ["Sam walks to school every morning.", "The bully is the tallest boy in class and sits in the back row near the window."],
  ],
  [
    "Theme: Greed can destroy what we value most.",
    "The miner keeps digging for more gold until the mine collapses on his house.",
    ["The miner lives in a small wooden house near the mountains, at the end of a long dirt road.", "Gold is a yellow metal."],
  ],
  [
    "Theme: Hard work matters more than talent.",
    "The weakest player practices every day and becomes the team's best scorer.",
    ["The team wears blue uniforms.", "The coach has won many trophies."],
  ],
  [
    "Theme: Home is where the people you love are.",
    "After traveling the world, the sailor is happiest back at his family's small table.",
    ["The sailor visits ten countries.", "The sailor's ship has three tall masts and a crew of twenty men from many different ports."],
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
    ["The mountain is covered with tall pine trees, and a narrow trail winds up to its rocky top.", "The hikers carry red backpacks."],
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
    intro: t(
      "*The lanterns winked across the harbor* gives human life to lamps (**personification**); *My pack weighed a thousand pounds* stretches reality to show exhaustion (**hyperbole**). Both create vivid pictures that literal facts cannot.",
      "*The lanterns winked across the harbor* 赋予灯笼人的神态（**拟人**）；*My pack weighed a thousand pounds* 借极度夸大表现疲惫（**夸张**）。两者都能营造平实字面达不到的鲜明画面。",
    ),
    prerequisites: ["similes-and-metaphors"],
    encompasses: [{ topic: "similes-and-metaphors", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "naming-the-device",
        t("Naming the Device", "辨认修辞"),
        t(
          "**Personification** gives human actions or feelings to something that is not human: *The wind whispered*. **Hyperbole** is an exaggeration so great that no one takes it literally: *I have told you a million times*. Like similes and metaphors, both are figurative: they mean something other than what the words literally say.\n\n> **Watch out.** Ask *what makes the sentence impossible literally*: if an object acts like a person, it is personification; if a number or size is stretched wildly, it is hyperbole.",
          "**拟人**把人的动作或感受赋予非人的事物：*The wind whispered*。**夸张**是极度的夸大，没有人会按字面理解：*I have told you a million times*。和明喻、暗喻一样，两者都是修辞性的：意思不同于字面。\n\n> **注意。** 问一句*字面上哪里不可能*：若物体像人一样行动或有情绪，是拟人；若数量、大小或时间被极度放大，是夸张。",
        ),
        named(["Which device does the sentence use?", "这句话用了哪种修辞？"], [...deviceBank, ...deviceMore], deviceWhy, deviceNot),
      ),
      point(
        "effect-of-the-device",
        t("The Effect of the Device", "修辞的效果"),
        t(
          "Writers choose devices for an effect. Personification can make a thing seem friendly, fierce or tired; hyperbole stresses a feeling such as boredom, hunger or impatience. To explain the effect, say what the device makes the reader feel or picture, not what the words literally claim.\n\n> **Watch out.** Reject any choice that treats the image as a literal fact (such as a sea literally eating or a test literally measuring miles).",
          "作者为了效果而选择修辞。拟人可以让事物显得友善、凶猛或疲惫；夸张强调无聊、饥饿或不耐烦之类的感受。解释效果时，要说出修辞让读者有什么感受或想象，而不是字面上说了什么。\n\n> **注意。** 排除任何按字面当真理解的选项（比如把大海当成真的肚子饿，或把试卷当成真有几英里长）。",
        ),
        pick(
          ["What is the effect of the figurative language?", "这里修辞的效果是什么？"],
          [...deviceEffectBank, ...deviceEffectMore],
          (right) =>
            `${right} The other choices read the words literally, which misses the effect.\n\n**Check.** Notice this choice describes the *feeling or impression* created for the reader rather than a literal measurement or fact.`,
          (right) =>
            `${right} 其他选项按字面理解，没有抓住效果。\n\n**检验。** 注意这个选项点出的是修辞带给读者的*感受或画面*，而不是字面上的事实或数据。`,
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
    intro: t(
      "Poets shape music out of ordinary words: repeated starting sounds (*silver sails*), sound-imitating words (*hiss*, *thud*), and end-rhyme patterns (*ABAB* or *AABB*) all give lines rhythm you can hear aloud.",
      "诗人用寻常词语谱出音乐感：重复的开头辅音（*silver sails*）、摹声词（*hiss*、*thud*）以及行尾押韵模式（*ABAB* 或 *AABB*），大声读出来就能听见节奏。",
    ),
    prerequisites: [],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      point(
        "alliteration-onomatopoeia-rhyme",
        t("Alliteration, Onomatopoeia and Rhyme", "头韵、拟声和押韵"),
        t(
          "**Alliteration** repeats the first consonant sound of nearby words: *big brown bears*. **Onomatopoeia** is a word that sounds like what it names: *buzz, sizzle, crash*. **Rhyme** repeats the ending sounds of words: *night* and *bright*. Read the line aloud and listen for which one you hear.\n\n> **Watch out.** Check *where* the sound effect happens: beginning consonant sounds = alliteration, matching endings = rhyme, a noise-imitating word = onomatopoeia.",
          "**头韵**是相邻的词重复相同的开头辅音：*big brown bears*。**拟声**是听起来像它所指声音的词：*buzz, sizzle, crash*。**押韵**是词尾音相同：*night* 和 *bright*。把句子读出来，听听用的是哪一种。\n\n> **注意。** 分清声音效果出现的位置：词首辅音重复是头韵，词尾读音呼应是押韵，模仿现实声响的词是拟声。",
        ),
        named(
          ["Which sound device does the line use most?", "这行主要用了哪种声音修辞？"],
          [...soundBank, ...soundMore],
          soundWhy,
          deviceNot,
        ),
      ),
      point(
        "rhyme-scheme",
        t("Rhyme Scheme", "韵式"),
        t(
          "A **rhyme scheme** labels the end sounds of the lines in a stanza with letters. The first end sound is A; each line that rhymes with it is also A; the next new sound is B, and so on. *Day, sun, play, fun* is ABAB. A line that rhymes with nothing still gets its own letter, as in ABCB.\n\n> **Watch out.** Always test the *spoken sound* of each line's final word, not just its spelling—and never reuse a letter for a line that does not rhyme.",
          "**韵式**用字母标出诗节各行的尾音。第一个尾音记为 A，与它押韵的行也记为 A；下一个新的尾音记为 B，依此类推。*day, sun, play, fun* 是 ABAB。不与任何行押韵的行也有自己的字母，例如 ABCB。\n\n> **注意。** 按每行尾词的*实际读音*（而不只看拼写）标字母——不押韵的行一定要给新字母。",
        ),
        pick(
          ["What is the rhyme scheme of this stanza? A slash marks the end of each line.", "这个诗节的韵式是什么？斜线表示每行的结尾。"],
          [...rhymeSchemeBank, ...rhymeSchemeMore],
          (right) =>
            `The rhyme scheme is **${right}**. Give the first end sound A, and a new letter to each new sound.\n\n**Check.** Read only the last word of each of the four lines in order and assign A to the first sound—the four letters spell **${right}**.`,
          (right) =>
            `韵式是 **${right}**。第一个尾音记为 A，每个新的尾音用一个新字母。\n\n**检验。** 按顺序只读四行各自的尾词，给第一个尾音标 A——依次标出的四个字母正是 **${right}**。`,
          schemeNot,
        ),
      ),
    ],
  },
  {
    id: "plot-and-conflict",
    title: t("Plot and Conflict", "情节与冲突"),
    summary: t("The stages of a plot, and the kinds of conflict that drive it.", "情节的各个阶段，以及推动情节的冲突类型。"),
    intro: t(
      "Every story moves through a shape (**plot**) powered by a struggle (**conflict**): a sailor trapped in a gale faces nature, while a student debating whether to confess a mistake faces an inner conflict.",
      "每个故事都沿着一定的结构（**情节**）展开，由核心斗争（**冲突**）推动：风暴中的水手对抗自然，犹豫是否坦白错误的学生则在与内心交战。",
    ),
    prerequisites: ["characters"],
    encompasses: [{ topic: "characters", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "stages-of-plot",
        t("Stages of a Plot", "情节的阶段"),
        t(
          "Most plots follow a pattern. The **exposition** introduces the characters and setting. In the **rising action**, a problem appears and grows. The **climax** is the turning point, the moment of greatest tension. In the **falling action**, the tension eases, and the **resolution** settles the problem.\n\n> **Watch out.** Do not confuse *rising action* (trouble building) with *climax* (the single peak moment where everything turns), or *falling action* with *resolution*.",
          "大多数情节遵循一个模式。**开端**介绍人物和背景。在**发展**中，问题出现并不断加剧。**高潮**是转折点，紧张感最强的时刻。在**回落**中，紧张感缓和，**结局**解决问题。\n\n> **注意。** 不要混淆*发展*（问题升级）与*高潮*（决定局势的最高点），也不要混淆*回落*与*结局*。",
        ),
        named(["Which part of the plot is this event?", "这件事属于情节的哪个部分？"], [...plotBank, ...plotMore], plotWhy, plotNot),
      ),
      point(
        "kinds-of-conflict",
        t("Kinds of Conflict", "冲突的类型"),
        t(
          "A **conflict** is the struggle at the heart of a plot. It may be between two characters, between a character and nature, between a character and society (its rules or beliefs), or inside a character's own mind, as a hard choice or a fear.\n\n> **Watch out.** Name the *opposing force*: another person (*character*), weather/wilderness (*nature*), a law or unfair custom (*society*), or the character's own fear/choice (*self*).",
          "**冲突**是情节核心的斗争。它可能发生在两个人物之间、人物与自然之间、人物与社会（其规则或观念）之间，也可能发生在人物内心，表现为艰难的抉择或恐惧。\n\n> **注意。** 找准*对抗的对象*：另一个人（人物）、风暴或自然环境（自然）、法规或成见（社会），还是人物自己的恐惧或抉择（自我）。",
        ),
        pick(
          ["What kind of conflict is this?", "这是哪种冲突？"],
          [...conflictBank, ...conflictMore],
          (right) =>
            `This is **${right}**: ask what or whom the character is struggling against.\n\n**Check.** Identify the two sides of the struggle in the prompt—they match **${right}** directly.`,
          (right) => `这是 **${right}**：问一问人物在和谁或什么作斗争。\n\n**检验。** 找出题干中对抗的双方——正好对应 **${right}**。`,
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
    intro: t(
      "A story's **topic** might be *honesty* and its **plot** might be *a boy admits he broke a vase*, but its **theme** is a full-sentence insight about life: *Telling the truth builds trust even when it is hard.*",
      "一个故事的**话题**可以是“诚实”，**情节**可以是“男孩承认打碎了花瓶”，而**主题**则是完整句子表达的人生道理：“即使很难，说真话也能赢得信任。”",
    ),
    prerequisites: ["lesson-of-a-story"],
    encompasses: [{ topic: "lesson-of-a-story", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "theme-topic-or-plot",
        t("Theme, Topic or Plot", "主题、话题还是情节"),
        t(
          "A **theme** is a message about life, stated as a full sentence: *Pride can lead to a fall*. A **topic** is a single word or phrase, such as *kings* or *courage*. A sentence that only retells what happens is **plot**. Unlike a fable's lesson, a theme is rarely stated; you infer it from what the characters do and what happens to them.\n\n> **Watch out.** A theme must pass two tests: it is a *complete sentence*, and it applies beyond the specific characters' names and events.",
          "**主题**是关于人生的道理，用完整的句子表达：*Pride can lead to a fall*。**话题**是一个词或短语，比如 *kings* 或 *courage*。只复述发生了什么的句子是**情节**。和寓言的道理不同，主题很少直接说出来，需要从人物的行为及其遭遇中推断。\n\n> **注意。** 主题必须同时通过两项检验：它是*完整句子*，且不局限于故事里具体的人物名字和事件。",
        ),
        pick(
          ["Which states the theme of this story?", "哪一项陈述了这个故事的主题？"],
          [...themeBank, ...themeMore],
          (right) =>
            `*${right}* is a message about life in a full sentence. The other choices are only a topic or a retelling of the plot.\n\n**Check.** Notice this statement is a complete sentence that holds true outside this one story—unlike a single-word topic or a plot summary.`,
          (right) =>
            `*${right}* 是用完整句子表达的人生道理。其他选项只是话题或情节复述。\n\n**检验。** 注意这是一句放之故事之外也成立的完整句子——既不是单个话题词，也不是情节复述。`,
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
          "A theme is supported by what happens because of a character's choices. To find evidence, look for an event that shows the message in action. A detail about the setting or a character's looks may be true but says nothing about the theme.\n\n> **Watch out.** Skip background facts about appearance, weather, or age—pick the event where a character's *choice and consequence* prove the theme.",
          "主题由人物的选择所带来的结果来支持。要找依据，就找能体现这个道理的事件。关于背景或人物外貌的细节也许是真的，却与主题无关。\n\n> **注意。** 跳过外貌、天气或年龄等背景细节——选出人物做出*选择并承担后果*、直接印证主题的事件。",
        ),
        pick(
          ["Which event best supports the theme?", "哪个事件最能支持这个主题？"],
          [...themeEvidenceBank, ...themeEvidenceMore],
          (right) =>
            `*${right}* shows the theme in action. The other details are true of the story but say nothing about its message.\n\n**Check.** Link this event directly to the stated theme: a character acts and the result proves the lesson, whereas the other options are plain background details.`,
          (right) =>
            `*${right}* 体现了这个主题。其他细节虽属于故事，却与它的道理无关。\n\n**检验。** 把这个事件和主题对照：人物采取行动并迎来相应结果，直接印证了主题，而另两项只是普通背景信息。`,
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
    intro: t(
      "Think of **tone** as the speaker's voice (playful, admiring, or sarcastic) and **mood** as the room's atmosphere (cozy, tense, or eerie). Word choice and sensory details reveal both.",
      "可以把**语气**想成说话人的声调（俏皮、赞叹或讽刺），把**氛围**想成房间里的气息（温馨、紧张或阴森）。用词和感官细节会同时透露这两者。",
    ),
    prerequisites: ["characters"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "identifying-tone",
        t("Identifying Tone", "辨别语气"),
        t(
          "**Tone** is the writer's attitude toward the subject: joyful, sad, serious, humorous, angry, sarcastic. It comes from word choice and details, not from the subject alone: a rainy day can be written about peacefully or with sarcasm. In sarcasm, the words say the opposite of what the writer means.\n\n> **Watch out.** Check whether the writer's praise actually matches the situation—praising a ruined picnic or a missed bus signals *sarcastic* tone, not joyful tone.",
          "**语气**是作者对所写内容的态度：欢快、悲伤、严肃、幽默、愤怒、讽刺。它来自用词和细节，而不仅仅是话题：下雨天既可以写得宁静，也可以写得讽刺。讽刺时，字面意思与作者的真实意思相反。\n\n> **注意。** 检查夸奖的话是否与处境相符——对着淋湿的野餐或错过的公交说“太棒了”，表达的是*讽刺*而不是欢快。",
        ),
        pick(
          ["What is the tone of this passage?", "这段话的语气是什么？"],
          [...toneBank, ...toneMore],
          (right) =>
            `The tone is **${right}**: the word choice and details show this attitude. The other choices do not fit those words.\n\n**Check.** Read the passage aloud as if speaking it—the loaded words and phrasing naturally call for a **${right}** voice.`,
          (right) =>
            `语气是 **${right}**：用词和细节表现了这种态度。其他选项与这些词不符。\n\n**检验。** 把这段话当成口语大声读出来——其中的用词和口吻自然带着 **${right}** 的态度。`,
          toneNot,
        ),
      ),
      point(
        "mood",
        t("Mood", "氛围"),
        t(
          "**Mood** is the feeling a passage creates in the reader, while tone is the writer's attitude. Setting and sensory details build mood: fog, a bare branch and a crow make a scene eerie; a fire, warmth and cocoa make it cozy.\n\n> **Watch out.** Point to the *sensory clues* (light, sound, weather, silence) in the passage—those physical details directly establish the mood.",
          "**氛围**是一段文字在读者心中营造的感觉，而语气是作者的态度。背景和感官细节营造氛围：雾、光秃秃的树枝和乌鸦让场景阴森；炉火、温暖和可可让它温馨。\n\n> **注意。** 找出文中的*感官线索*（光线、声音、天气、寂静）——这些具体画面直接决定了氛围。",
        ),
        pick(
          ["What mood does this passage create?", "这段话营造了什么氛围？"],
          [...moodBank, ...moodMore],
          (right) =>
            `The mood is **${right}**: the setting and details make the reader feel this way. The other moods would need different details.\n\n**Check.** List two sensory details from the passage—both pull the reader straight into a **${right}** atmosphere.`,
          (right) =>
            `氛围是 **${right}**：背景和细节让读者有这种感觉。其他氛围需要不同的细节。\n\n**检验。** 挑出文中的两处感官细节——它们共同把读者带入 **${right}** 的氛围中。`,
          moodNot,
        ),
      ),
    ],
  },
];
