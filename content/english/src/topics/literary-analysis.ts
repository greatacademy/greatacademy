// Literary analysis: how a narrator, symbols, irony and the order of events shape a story, and how to write about it, for grades 6 to 8.

import { type CriterionSpec, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { citeMore, ironyMore, narratorEffectMore, narratorMore, orderMore, symbolMore } from "./literary-analysis-more.ts";
import { explainStep, foreshadowStep, ironyMakingStep, symbolThemeStep } from "./literary-analysis-steps.ts";

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

const named = (
  question: [string, string],
  bank: readonly ChoiceItem[],
  why: Readonly<Record<string, readonly [string, string]>>,
  not: Say,
) =>
  pick(
    question,
    bank,
    (right) => `This is **${right}**. ${why[right]?.[0] ?? ""}`,
    (right) => `这是 **${right}**。${why[right]?.[1] ?? ""}`,
    not,
  );

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

// Point of view.

const narratorBank: readonly ChoiceItem[] = [
  [
    "I pressed my ear to the door, but I could not tell what my parents were whispering about.",
    "first person",
    ["third person limited", "third person omniscient"],
  ],
  [
    "Omar watched the clock and wondered whether his sister would ever forgive him.",
    "third person limited",
    ["first person", "third person omniscient"],
  ],
  [
    "Omar hoped his sister would forgive him, while across town she had already forgotten the argument and was laughing with friends.",
    "third person omniscient",
    ["third person limited", "first person"],
  ],
  [
    "We climbed the last ridge together, and I finally saw the lake my grandfather had told me about.",
    "first person",
    ["third person omniscient", "third person limited"],
  ],
  [
    "Lena smiled at the judges, though her hands were shaking under the table.",
    "third person limited",
    ["third person omniscient", "first person"],
  ],
  [
    "The captain trusted his crew completely, but the cook was secretly planning to leave the ship at the next port.",
    "third person omniscient",
    ["first person", "third person limited"],
  ],
  [
    "Each villager thought the stranger was a thief; the stranger, for his part, thought they were the kindest people he had met.",
    "third person omniscient",
    ["third person limited", "first person"],
  ],
  [
    "Jun did not know why the teacher had called him in, and the silence in the room made his stomach turn.",
    "third person limited",
    ["first person", "third person omniscient"],
  ],
  [
    "My heart was pounding so loudly that I was sure the guard could hear it.",
    "first person",
    ["third person limited", "third person omniscient"],
  ],
];

const narratorWhy: Readonly<Record<string, readonly [string, string]>> = {
  "first person": [
    "The narrator is a character who says *I*, so we know only what that character sees and thinks.",
    "叙述者是说 *I* 的人物，所以我们只知道这个人物看到和想到的。",
  ],
  "third person limited": [
    "The narrator stands outside the story but shares the thoughts of one character only.",
    "叙述者在故事之外，但只讲述一个人物的想法。",
  ],
  "third person omniscient": [
    "The narrator stands outside the story and knows what more than one character thinks or does unseen.",
    "叙述者在故事之外，知道不止一个人物的想法或背后的行动。",
  ],
};

const narratorNot = meaning({
  "first person": [
    "No narrator here says *I* about themself: the characters are named or called *he*, *she* or *they*.",
    "这里没有叙述者用 *I* 讲自己：人物都用名字或 *he*、*she*、*they* 来称呼。",
  ],
  "third person limited": [
    "A limited narrator shares one character's mind. Check whether the passage tells what a second character thinks, or what the narrator says *I*.",
    "有限视角的叙述者只讲一个人物的内心。看看文段是否讲了第二个人物的想法，或者叙述者是否说 *I*。",
  ],
  "third person omniscient": [
    "An omniscient narrator knows the minds of several characters. Here only one character's thoughts are shared.",
    "全知叙述者了解多个人物的内心。这里只讲了一个人物的想法。",
  ],
});

const narratorEffectBank: readonly ChoiceItem[] = [
  [
    "A mystery is told in first person by the detective's assistant, who does not understand the clues until the end.",
    "The reader is kept as puzzled as the assistant, which builds suspense.",
    ["The reader knows who the criminal is from the first page.", "The reader learns every character's secret thoughts."],
  ],
  [
    "A story about a family argument is told by an omniscient narrator who shares what every family member feels.",
    "The reader understands each side, so no one seems simply right or wrong.",
    [
      "The reader only sees the argument through the youngest child's eyes, as she hears it from the stairs.",
      "The reader cannot tell how anyone feels.",
    ],
  ],
  [
    "A story about a girl's first day at a new school is told in third person limited, through her eyes only.",
    "The reader shares her worries and does not know what the other students really think of her.",
    [
      "The reader knows what every student thinks of her.",
      "The reader hears the whole story in her own voice, saying I and telling us everything she sees.",
    ],
  ],
  [
    "In a ghost story, the omniscient narrator reveals that the old house is safe, while the characters inside are terrified.",
    "The reader feels the characters' fear while knowing it is mistaken, which can make the story funny.",
    ["The reader is as frightened as the characters.", "The reader never learns the truth about the house."],
  ],
  [
    "A boy tells his own story in first person, years later, as a grown man looking back.",
    "The reader gets both the boy's feelings and the man's wiser view of them.",
    [
      "The reader knows only what the boy understood at the time, with none of the man's later thoughts.",
      "The reader learns the thoughts of everyone the boy met.",
    ],
  ],
  [
    "A story about a race is told in third person limited, through the runner who is losing.",
    "The reader feels the race from behind, sharing one runner's struggle.",
    ["The reader knows what every runner is thinking.", "The reader learns who will win before the race starts."],
  ],
  [
    "A story is told in first person by a narrator who boasts about how brave he is, while his actions show he is afraid.",
    "The reader learns to doubt the narrator and see more than he admits.",
    [
      "The reader must believe everything the narrator says.",
      "The reader sees the story through every character's eyes and learns what each one is hiding.",
    ],
  ],
  [
    "In a war story, an omniscient narrator moves between soldiers on both sides of the battle.",
    "The reader sees that the enemies share the same fears, which makes the war feel sad rather than heroic.",
    [
      "The reader only sees one army's side.",
      "The reader is told the whole story by one soldier who says I and sees only his own side of the war.",
    ],
  ],
];

// Symbolism.

const symbolBank: readonly ChoiceItem[] = [
  [
    "Throughout the story, Ana tends a small plant her late grandmother gave her. On the day Ana finally feels at home in her new country, the plant blooms.",
    "Ana's growing roots and new life in her new home",
    ["Ana's love of gardening", "The weather in her new country, which is colder and rainier than her old home"],
  ],
  [
    "A prisoner watches a single bird outside his window every morning. On the day he is released, he looks for it and sees it fly away.",
    "The freedom the prisoner longs for and finally wins",
    ["The prisoner's interest in the birds that fly past his window each day", "The time of year he is released"],
  ],
  [
    "After the two brothers stop speaking, the narrator notices that the bridge between their farms is falling apart. At the end, they rebuild it together.",
    "The broken and then repaired bond between the brothers",
    ["The poor roads in the countryside", "The brothers' skill at building bridges out of wood and stone with their hands"],
  ],
  [
    "A girl keeps a light on in the window every night while her father is at sea. When he returns, she finally lets it go out.",
    "Her hope that her father will come home safely",
    ["Her fear of the dark, which grows worse whenever the lights go out at night", "The cost of electricity"],
  ],
  [
    "The old clock in the hallway stopped on the day the family's mother left. No one in the house has wound it since.",
    "The family's life frozen by their loss",
    ["The family's poor care of old things", "The exact time the mother left"],
  ],
  [
    "Each time Kai is tempted to give up on his dream, he looks at the mountain peak he can see from his window. In the last scene, he stands on top of it.",
    "Kai's goal and the effort it takes to reach it",
    ["Kai's love of the view of the mountain from his bedroom window", "The height of the mountain"],
  ],
  [
    "A storm builds outside as the two friends' argument grows. When they finally apologize, the clouds break and the sun comes out.",
    "The rise and end of the conflict between the friends",
    ["The season in which the story is set", "The friends' fear of storms"],
  ],
  [
    "A soldier carries his daughter's drawing in his pocket through every battle. When he is afraid, he touches it.",
    "His love for his family and the reason he keeps going",
    ["His interest in art", "The paper he was given by the army to write letters home while he was away"],
  ],
];

// Irony.

const ironyBank: readonly ChoiceItem[] = [
  ['Looking at the pouring rain, Maya said, "What lovely weather for a picnic."', "verbal irony", ["situational irony", "dramatic irony"]],
  ["The fire station burned down because its smoke alarm was broken.", "situational irony", ["verbal irony", "dramatic irony"]],
  [
    "The audience knows that the gift box holds a snake, but the character opens it eagerly, expecting a puppy.",
    "dramatic irony",
    ["situational irony", "verbal irony"],
  ],
  ['After failing the test, Leo muttered, "Well, that went perfectly."', "verbal irony", ["dramatic irony", "situational irony"]],
  [
    "A man spends years building a bunker to survive any disaster, then gets lost in it and cannot find the door.",
    "situational irony",
    ["dramatic irony", "verbal irony"],
  ],
  [
    "Readers know the thief is hiding in the closet, while the detective searches every other room in the house.",
    "dramatic irony",
    ["verbal irony", "situational irony"],
  ],
  ['Stepping into the freezing lake, Sam called out, "Ah, nice and warm!"', "verbal irony", ["situational irony", "dramatic irony"]],
  ["The famous swimming coach could not swim himself.", "situational irony", ["verbal irony", "dramatic irony"]],
  [
    "We know the letter announcing the prize is lost in the mail, but the character believes she has been forgotten.",
    "dramatic irony",
    ["situational irony", "verbal irony"],
  ],
];

const ironyWhy: Readonly<Record<string, readonly [string, string]>> = {
  "verbal irony": ["A character says the opposite of what they mean.", "人物说的话与他们真正的意思相反。"],
  "situational irony": ["What happens is the opposite of what anyone would expect.", "发生的事情与任何人的预期相反。"],
  "dramatic irony": ["The reader or audience knows something a character does not.", "读者或观众知道某个人物不知道的事情。"],
};

const ironyNot = meaning({
  "verbal irony": [
    "Verbal irony is in what someone says. Here no one says the opposite of what they mean.",
    "言语反讽在于人物说的话。这里没有人说出与本意相反的话。",
  ],
  "situational irony": [
    "Situational irony is an event that turns out the opposite of what was expected. Look at whether the surprise is in an event, in words, or in what the reader knows.",
    "情境反讽是结果与预期相反的事件。看看意外是在事件里、话语里，还是在读者知道的事情里。",
  ],
  "dramatic irony": [
    "Dramatic irony needs the reader to know something a character does not. Here the reader learns nothing the characters do not also know.",
    "戏剧反讽需要读者知道人物不知道的事。这里读者并没有比人物多知道什么。",
  ],
});

// The order of events.

const orderBank: readonly ChoiceItem[] = [
  ["As Nora boarded the ship, she noticed a crack in the hull that no one else seemed to see.", "foreshadowing", ["flashback", "neither"]],
  [
    "Standing on the stage, Raj suddenly remembered being six years old, frozen with fear at his first school play.",
    "flashback",
    ["foreshadowing", "neither"],
  ],
  [
    '"Don\'t worry," said the guide. "Nobody has ever been lost in these caves." Behind them, the wind blew out a candle.',
    "foreshadowing",
    ["flashback", "neither"],
  ],
  [
    "The chapter returns to the winter ten years earlier, when the two sisters first stopped speaking.",
    "flashback",
    ["neither", "foreshadowing"],
  ],
  ["Mia ate her breakfast, packed her bag and walked to school.", "neither", ["foreshadowing", "flashback"]],
  [
    "Grandpa's hands shook as he placed the old medal on the table, and his mind went back to the morning of the battle.",
    "flashback",
    ["foreshadowing", "neither"],
  ],
  [
    "The weather report warned of a storm that night, but the campers laughed and pitched their tents by the river.",
    "foreshadowing",
    ["neither", "flashback"],
  ],
  ["The train left the station on time and arrived in the city two hours later.", "neither", ["flashback", "foreshadowing"]],
];

const orderWhy: Readonly<Record<string, readonly [string, string]>> = {
  foreshadowing: ["A hint suggests something that will happen later in the story.", "一个暗示预示了故事后面将要发生的事。"],
  flashback: ["The story moves back in time to show an earlier event.", "故事回到过去，展示较早发生的事件。"],
  neither: [
    "The events are told in plain order, with no hint of what is coming and no move back in time.",
    "事件按顺序平铺直叙，既没有对后事的暗示，也没有回到过去。",
  ],
};

const orderNot = meaning({
  foreshadowing: [
    "Foreshadowing hints at something to come. Nothing here points ahead to trouble or change.",
    "伏笔暗示将来的事。这里没有任何内容预示麻烦或变化。",
  ],
  flashback: [
    "A flashback moves back to an earlier time. These events happen in the story's present.",
    "倒叙会回到更早的时间。这些事件发生在故事的当下。",
  ],
  neither: [
    "Look again: a detail here either hints at what is coming or takes the story back to an earlier time.",
    "再看看：这里有一个细节，要么暗示将要发生的事，要么把故事带回更早的时间。",
  ],
});

// Citing evidence.

const citeBank: readonly ChoiceItem[] = [
  [
    "Claim: Tomas is generous even when he has little. Which quotation best supports it?",
    '"Tomas had only one coat, but when he saw the boy shivering, he took it off without a word."',
    [
      '"Tomas lived in a small stone house at the edge of the village, next to the old mill by the river."',
      '"Everyone in the village knew Tomas by his loud laugh."',
    ],
  ],
  [
    "Claim: The narrator is afraid of the new school. Which quotation best supports it?",
    '"I walked past the gate twice before I could make myself go in."',
    [
      '"The school was a tall brick building with blue doors."',
      '"My mother had bought me a new blue backpack and a box of pencils for the first day of school."',
    ],
  ],
  [
    "Claim: The forest in the story is dangerous. Which quotation best supports it?",
    '"No one who entered the forest after dark had ever come back the same."',
    [
      '"The forest stretched for miles to the north of the town."',
      '"In autumn, the leaves of the forest turned gold and red, and the paths were covered in them."',
    ],
  ],
  [
    "Claim: Elena grows more confident by the end of the story. Which quotation best supports it?",
    '"This time, when the teacher asked a question, Elena raised her hand first."',
    ['"Elena had always liked reading more than talking."', '"At the start of the year, Elena sat in the back row."'],
  ],
  [
    "Claim: The king cares more about gold than about his people. Which quotation best supports it?",
    '"While the villagers went hungry, the king ordered a new golden throne."',
    [
      '"The king lived in a castle on the hill."',
      '"The king had ruled the land for twenty years, ever since his father died in the long winter war."',
    ],
  ],
  [
    "Claim: The two friends' bond is stronger than their argument. Which quotation best supports it?",
    '"Even while they were not speaking, Ben still saved Leo a seat on the bus every morning."',
    [
      '"Ben and Leo had argued about the soccer game on Saturday, and neither of them would say who started it."',
      '"Ben and Leo lived on the same street."',
    ],
  ],
  [
    "Claim: The grandmother is wise. Which quotation best supports it?",
    '"Whenever the family argued, they went to Grandmother, and her few words always settled it."',
    [
      '"Grandmother was the oldest person in the family."',
      '"Grandmother lived in the small room at the top of the stairs, with a window that looked over the garden."',
    ],
  ],
  [
    "Claim: The storm changes how the town sees the new family. Which quotation best supports it?",
    '"After the new family opened their home to everyone who lost power, no one called them strangers again."',
    [
      '"The storm knocked out the power for three days."',
      '"The new family had moved to town in the spring, into the yellow house at the end of our street, near the school."',
    ],
  ],
];

const citeNot: Say = (wrong) => [
  `*${wrong}* is true of the story, but it does not show the quality the claim is about. Look for a quotation that proves the claim, not one that only mentions the same character or place.`,
  `*${wrong}* 在故事中属实，但它没有体现论点所说的特点。要找能证明论点的引文，而不是只提到同一人物或地点的句子。`,
];

// Writing about a passage.

/** analysisBank asks for a paragraph that makes a claim about a passage and supports it with quoted evidence. */
const analysisBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph that makes a claim about what the passage shows about the grandmother, and support it with a quotation.",
    source:
      'Grandmother never threw anything away. When the cup with the cracked handle could no longer hold tea, she filled it with soil and planted mint in it. "Nothing is useless," she told me, "if you are willing to find its new job."',
    model:
      'The passage shows that the grandmother sees value where others see waste. Instead of throwing away a cracked cup, she "filled it with soil and planted mint in it." Her own words, "Nothing is useless," turn this small act into a belief she lives by. The writer suggests that her careful habits come from a hopeful way of seeing the world.',
  },
  {
    task: "Write a paragraph that makes a claim about how the writer creates a mood of fear in the passage, and support it with a quotation.",
    source:
      "The hallway was longer than Mira remembered. Her footsteps echoed off the walls, and somewhere behind her a door creaked slowly shut. The only light came from a flickering bulb that buzzed like a trapped insect.",
    model:
      'The writer builds a mood of fear through sounds that seem to come from nowhere. Mira\'s "footsteps echoed off the walls," and "somewhere behind her a door creaked slowly shut." Because the reader never learns who closed the door, the sound feels like a threat. Even the light "buzzed like a trapped insect," a simile that makes the hallway feel like a place to escape.',
  },
  {
    task: "Write a paragraph that makes a claim about how Daniel changes in the passage, and support it with a quotation.",
    source:
      'For weeks, Daniel had walked past the old man on the bench without looking at him. Today, he stopped. "Do you want half of my sandwich?" he asked. The old man\'s face broke into a smile, and Daniel, to his surprise, smiled back.',
    model:
      'In the passage, Daniel changes from ignoring a stranger to reaching out to him. At first he "walked past the old man on the bench without looking at him," but today he offers half of his sandwich. The phrase "to his surprise" shows that Daniel did not expect to feel happy about helping. The writer suggests that one small kindness can change the giver as much as the receiver.',
  },
  {
    task: "Write a paragraph that makes a claim about what the sea stands for in the passage, and support it with a quotation.",
    source:
      "Every evening, Lucia sat on the rocks and watched the ships sail toward the edge of the sea. Her father said there was nothing out there but water. But Lucia counted the ships, and each one, she thought, was going somewhere she had never been.",
    model:
      'In the passage, the sea stands for the wider world that Lucia longs to explore. She watches ships sail "toward the edge of the sea," and each one is "going somewhere she had never been." Her father sees "nothing out there but water," but Lucia sees possibility. The contrast suggests that the sea is less a place than a dream of a bigger life.',
  },
  {
    task: "Write a paragraph that makes a claim about how the writer shows the narrator's pride, and support it with a quotation.",
    source:
      "I had practiced the song for a month, so when the music teacher asked who would sing first, my hand was up before she finished the question. I did not even look at the others. I knew none of them could match me.",
    model:
      'The writer shows the narrator\'s pride through how quickly and confidently she acts. Her hand is up "before she finished the question," which suggests she cannot wait to show off. She "did not even look at the others," as if they do not matter. The final line, "I knew none of them could match me," makes her pride clear and hints that it may lead to a fall.',
  },
  {
    task: "Write a paragraph that makes a claim about the mood of the passage, and support it with a quotation.",
    source:
      "Snow fell softly over the village. Chimneys puffed gentle smoke, and from every window came the yellow glow of lamps. Somewhere a child laughed, and the sound drifted through the quiet streets like music.",
    model:
      'The passage creates a peaceful, comforting mood. Words such as "softly," "gentle" and "quiet" slow the reader down, and the "yellow glow of lamps" in every window suggests warm homes. A child\'s laugh drifts "like music," so even sound feels gentle. The writer makes the snowy village feel safe and welcoming.',
  },
  {
    task: "Write a paragraph that makes a claim about what the broken watch shows about the father, and support it with a quotation.",
    source:
      'My father still wears the watch his own father gave him, even though it stopped working years ago. When I asked him why, he turned it over in his fingers. "It doesn\'t tell the time," he said. "It tells me who I come from."',
    model:
      'The broken watch shows that the father values his family history more than usefulness. He still wears it "even though it stopped working years ago," which would seem strange if the watch were only a tool. His answer, "It tells me who I come from," reveals that it is a link to his own father. For him, the watch measures love and memory rather than hours.',
  },
  {
    task: "Write a paragraph that makes a claim about how the writer builds suspense in the passage, and support it with a quotation.",
    source:
      "The envelope sat on the kitchen table all afternoon. Priya walked past it four times. Each time she reached for it, she pulled her hand back. The letter inside would say yes or no, and she was not ready to know which.",
    model:
      'The writer builds suspense by delaying the moment Priya opens the letter. The envelope sits there "all afternoon," and she "walked past it four times," so the reader waits along with her. Each time she reaches for it, she "pulled her hand back," which stretches the tension further. By never revealing the answer, the writer keeps the reader as anxious as Priya.',
  },
  {
    task: "Write a paragraph that makes a claim about what the passage shows about Marcus, and support it with a quotation.",
    source:
      "Marcus had saved for the bicycle all year. On the morning he finally went to buy it, he passed his little sister's school and saw her sitting alone on the steps, her broken shoes tied together with string. That afternoon he came home on foot, carrying a shoebox under his arm.",
    model:
      'The passage shows that Marcus puts his sister\'s needs before his own wishes. He had "saved for the bicycle all year," yet after seeing her shoes "tied together with string," he comes home "on foot, carrying a shoebox." The writer never says what he bought, but the shoebox and the missing bicycle tell the reader that he spent his savings on her. His quiet choice shows a generosity that does not need to be praised.',
  },
  {
    task: "Write a paragraph that makes a claim about how the writer shows that the narrator is nervous, and support it with a quotation.",
    source:
      "I checked my bag for the third time: pencils, eraser, water bottle, the lucky coin from Grandpa. The clock in the hallway ticked louder than any clock should. When the door opened and someone called my name, my legs stood up before I told them to.",
    model:
      'The writer shows the narrator\'s nerves through small, repeated actions and strange feelings in the body. Checking the bag "for the third time" suggests the narrator cannot trust their own memory under pressure. The clock that "ticked louder than any clock should" shows how fear sharpens every sound. Even the narrator\'s legs stand "before I told them to," as if the body is moving on its own because the mind is too anxious to lead.',
  },
  {
    task: "Write a paragraph that makes a claim about what the lighthouse stands for in the passage, and support it with a quotation.",
    source:
      "After her mother left, Nell climbed the hill each evening to watch the old lighthouse. Its beam swept across the dark water, steady and patient, never missing a turn. On the worst nights, when the wind howled through the town, she told herself that as long as the light kept turning, she could keep going too.",
    model:
      'In the passage, the lighthouse stands for the steady hope that keeps Nell going after her loss. Its beam is "steady and patient, never missing a turn," which is the opposite of the sudden change her mother\'s leaving brought. On the worst nights she tells herself that "as long as the light kept turning, she could keep going too." The light becomes a promise she makes to herself: the world can still be reliable, even when people are not.',
  },
  {
    task: "Write a paragraph that makes a claim about the mood the writer creates in the passage, and support it with a quotation.",
    source:
      "The fair was over. Paper cups rolled across the empty field, and a single balloon, tied to a fence post, bobbed in the wind. The music had stopped hours ago. Only the Ferris wheel remained, dark and still against the gray sky.",
    model:
      'The writer creates a lonely, faded mood by showing a happy place after the happiness has gone. Paper cups "rolled across the empty field," and a "single balloon" bobs by itself, reminders of a crowd that has left. The Ferris wheel, "dark and still against the gray sky," turns the symbol of fun into something silent and cold. The details make the reader feel how quickly joy can disappear.',
  },
  {
    task: "Write a paragraph that makes a claim about how Aunt June's words reveal her character, and support it with a quotation.",
    source:
      'When I dropped the cake on the kitchen floor, everyone froze. Aunt June looked at the mess, then at me, and grabbed a spoon. "Well," she said, sitting down on the tiles, "it tastes the same from down here." Within a minute, the whole family was on the floor, laughing with chocolate on their faces.',
    model:
      'Aunt June\'s words reveal that she is warm and quick to turn a disaster into a happy memory. Instead of scolding, she sits on the floor and says, "it tastes the same from down here." Her joke tells the narrator that the mistake does not matter and that the cake is still worth enjoying. Because the "whole family was on the floor, laughing" within a minute, the reader sees that her kindness changes the mood of everyone around her.',
  },
];

/** literaryAnalysisTopics are the topics of literary analysis for grades 6 to 8. */
export const literaryAnalysisTopics: readonly TopicDef[] = [
  {
    id: "narrative-point-of-view",
    title: t("Narrators and What They Know", "叙述者及其所知"),
    summary: t(
      "First person, third person limited and third person omniscient, and how each shapes what the reader learns.",
      "第一人称、第三人称有限视角和第三人称全知视角，以及它们怎样影响读者所知道的内容。",
    ),
    prerequisites: ["point-of-view"],
    encompasses: [{ topic: "point-of-view", weight: 0.4 }],
    xp: 12,
    knowledgePoints: [
      point(
        "limited-or-omniscient",
        t("Limited or Omniscient", "有限视角还是全知视角"),
        t(
          "A third-person narrator stands outside the story, but narrators differ in what they know. A **third person limited** narrator shares the thoughts of one character only. A **third person omniscient** narrator knows what several characters think and feel, and what happens where none of them can see.\n\nTo tell them apart, count whose thoughts the narrator reports. One mind means limited; more than one means omniscient. A narrator who says *I* is **first person**.",
          "第三人称叙述者在故事之外，但他们所知道的不同。**第三人称有限视角**（third person limited）的叙述者只讲述一个人物的想法。**第三人称全知视角**（third person omniscient）的叙述者知道多个人物的所想所感，以及任何人物都看不到的地方发生的事。\n\n要区分它们，就数一数叙述者讲了谁的想法。只有一个人的内心是有限视角；不止一个是全知视角。说 *I* 的叙述者是**第一人称**（first person）。",
        ),
        named(
          ["What point of view is this passage told in?", "这段文字是用哪种视角叙述的？"],
          [...narratorBank, ...narratorMore],
          narratorWhy,
          narratorNot,
        ),
      ),
      point(
        "what-the-narrator-changes",
        t("How the Narrator Shapes a Story", "叙述者怎样塑造故事"),
        t(
          "The choice of narrator decides what the reader knows, and so how the story feels. A first-person or limited narrator keeps the reader inside one mind: we share that character's surprises and mistakes, which builds suspense and closeness. An omniscient narrator lets the reader see more than any one character, so we may understand every side, or know of a danger the characters do not.\n\nA first-person narrator may also be wrong, or may hide the truth, and the reader then learns to read past the narrator's words.",
          "叙述者的选择决定了读者知道什么，也因此决定故事给人的感受。第一人称或有限视角的叙述者让读者留在一个人的内心中：我们和这个人物一同经历意外和错误，这能营造悬念和亲近感。全知叙述者让读者看到的比任何一个人物都多，所以我们可能理解每一方，或者知道人物不知道的危险。\n\n第一人称叙述者也可能出错或隐瞒真相，读者就要学会读出叙述者话语之外的意思。",
        ),
        pick(
          ["What is the most likely effect of this choice of narrator?", "这种叙述者的选择最可能产生什么效果？"],
          [...narratorEffectBank, ...narratorEffectMore],
          (right) => `*${right}* The narrator decides what the reader can know, and this effect follows from that.`,
          (right) => `*${right}* 叙述者决定了读者能知道什么，这个效果正是由此而来。`,
          (wrong) => [
            `*${wrong}* does not fit this narrator: ask whose thoughts the narrator can share, and what the reader therefore knows or does not know.`,
            `*${wrong}* 与这个叙述者不符：问问叙述者能讲述谁的想法，以及读者因此知道或不知道什么。`,
          ],
        ),
      ),
    ],
  },
  {
    id: "symbolism",
    title: t("Symbolism", "象征"),
    summary: t("An object, place or event that stands for an idea larger than itself.", "代表比自身更大的意义的物品、地点或事件。"),
    prerequisites: ["theme"],
    encompasses: [{ topic: "theme", weight: 0.2 }],
    xp: 16,
    knowledgePoints: [
      point(
        "reading-a-symbol",
        t("Reading a Symbol", "解读象征"),
        t(
          "A **symbol** is something concrete, an object, a place, an animal or the weather, that also stands for an idea: freedom, hope, a broken friendship. Writers signal a symbol by bringing it back at important moments, and by letting it change when the characters change.\n\nTo read one, ask what the object has to do with the characters' feelings or the story's conflict. A plain fact about the object, such as what it looks like, is not what it stands for.",
          "**象征**（symbol）是具体的东西，例如物品、地点、动物或天气，同时代表一种意义：自由、希望、破裂的友谊。作者会让象征在关键时刻反复出现，并随人物的变化而变化，以此提示它的存在。\n\n解读时，问问这个东西与人物的感受或故事的冲突有什么关系。关于它的字面事实，比如它的样子，并不是它所象征的意义。",
        ),
        pick(
          ["What does the object in this passage most likely stand for?", "这段文字中的东西最可能象征什么？"],
          [...symbolBank, ...symbolMore],
          (right) => `It stands for *${right}*. The object appears, and changes, at the moments that matter to that idea.`,
          (right) => `它象征 *${right}*。这个东西在与此意义相关的关键时刻出现并发生变化。`,
          (wrong) => [
            `*${wrong}* reads the object literally. A symbol stands for an idea tied to the characters' feelings or conflict.`,
            `*${wrong}* 是在按字面理解这个东西。象征代表与人物感受或冲突相关的意义。`,
          ],
        ),
      ),
      symbolThemeStep,
    ],
  },
  {
    id: "irony",
    title: t("Irony", "反讽"),
    summary: t(
      "Verbal, situational and dramatic irony: the gap between what is said, expected or known and what is true.",
      "言语反讽、情境反讽和戏剧反讽：所说、所预期或所知与事实之间的落差。",
    ),
    prerequisites: ["plot-and-conflict"],
    encompasses: [],
    xp: 16,
    knowledgePoints: [
      point(
        "three-kinds-of-irony",
        t("Three Kinds of Irony", "三种反讽"),
        t(
          "**Irony** is a gap between how things seem and how they are. In **verbal irony**, a character says the opposite of what they mean: *Great, another flat tire.* In **situational irony**, an event turns out the opposite of what anyone would expect: a lifeguard who needs rescuing. In **dramatic irony**, the reader knows something a character does not, and watches them walk toward it.",
          "**反讽**（irony）是表面与实际之间的落差。在**言语反讽**（verbal irony）中，人物说的与本意相反：*Great, another flat tire.* 在**情境反讽**（situational irony）中，事件的结果与任何人的预期相反：救生员自己需要被救。在**戏剧反讽**（dramatic irony）中，读者知道人物不知道的事，看着他们一步步走向它。",
        ),
        named(["What kind of irony is this?", "这是哪种反讽？"], [...ironyBank, ...ironyMore], ironyWhy, ironyNot),
      ),
      ironyMakingStep,
    ],
  },
  {
    id: "foreshadowing-and-flashback",
    title: t("Foreshadowing and Flashback", "伏笔与倒叙"),
    summary: t("Hints of what is to come, and scenes that move back in time.", "对将来之事的暗示，以及回到过去的场景。"),
    prerequisites: ["plot-and-conflict"],
    encompasses: [{ topic: "plot-and-conflict", weight: 0.2 }],
    xp: 14,
    knowledgePoints: [
      point(
        "hints-and-memories",
        t("Hints Ahead and Steps Back", "向前的暗示与向后的回顾"),
        t(
          "Writers do not always tell events in order. **Foreshadowing** drops a hint of something that will happen later: a warning ignored, a crack no one fixes, a calm that feels too calm. A **flashback** moves the story back in time to show an earlier event, often through a memory, and then returns to the present.\n\nWords such as *remembered*, *years earlier* or *went back to* often mark a flashback. A detail that makes the reader uneasy about what comes next is often foreshadowing.",
          "作者并不总是按顺序讲述事件。**伏笔**（foreshadowing）埋下对后事的暗示：被忽视的警告、没人修的裂缝、平静得过分的平静。**倒叙**（flashback）把故事带回过去，展示较早的事件，常通过回忆来实现，然后再回到当下。\n\n*remembered*、*years earlier*、*went back to* 这样的词常标志着倒叙。让读者对接下来的事感到不安的细节，往往是伏笔。",
        ),
        named(
          ["Is this foreshadowing, a flashback, or neither?", "这是伏笔、倒叙，还是两者都不是？"],
          [...orderBank, ...orderMore],
          orderWhy,
          orderNot,
        ),
      ),
      foreshadowStep,
    ],
  },
  {
    id: "citing-textual-evidence",
    title: t("Citing Textual Evidence", "引用文本证据"),
    summary: t("Choose the quotation from a story that proves a claim about it.", "选出能证明关于故事的某个论点的引文。"),
    prerequisites: ["theme"],
    encompasses: [{ topic: "theme", weight: 0.2 }],
    xp: 14,
    knowledgePoints: [
      point(
        "the-quotation-that-proves",
        t("The Quotation That Proves", "能证明论点的引文"),
        t(
          "A claim about a story, such as *Tomas is generous*, needs evidence from the text. The best quotation shows the quality in action: what a character does, says or thinks. A quotation that only mentions the character, or tells where they live, is about the right person but proves nothing.\n\nBefore choosing, ask: if a reader doubted the claim, would this line change their mind?",
          "关于故事的论点，例如 *Tomas is generous*，需要文本中的证据。最好的引文展示这一特点的实际表现：人物做了什么、说了什么或想了什么。只提到这个人物、或说他住在哪里的引文，虽然说的是对的人，却证明不了什么。\n\n选择之前先问：如果读者怀疑这个论点，这句话能改变他们的看法吗？",
        ),
        pick(
          ["Read the claim and choose the best evidence.", "阅读论点，选出最好的证据。"],
          [...citeBank, ...citeMore],
          (right) => `${right} shows the quality in action, so it proves the claim.`,
          (right) => `${right} 展示了这一特点的实际表现，所以能证明论点。`,
          citeNot,
        ),
      ),
      explainStep,
    ],
  },
  {
    id: "writing-a-literary-analysis-paragraph",
    title: t("Writing About a Passage", "评析一段文字"),
    summary: t(
      "Make a claim about what a passage means or how it is written, quote it, and explain the quotation.",
      "对一段文字的含义或写法提出论点，引用原文，并解释引文。",
    ),
    prerequisites: ["citing-textual-evidence", "writing-an-evidence-paragraph"],
    encompasses: [
      { topic: "citing-textual-evidence", weight: 0.4 },
      { topic: "writing-an-evidence-paragraph", weight: 0.3 },
    ],
    xp: 20,
    criteria: ["w5-literary-claim", "w5-uses-source", "w5-explains-evidence"].map(criterion),
    knowledgePoints: [
      point(
        "claim-quote-explain",
        t("Claim, Quote, Explain", "论点、引用、解释"),
        t(
          "Writing about literature follows the same steps as any argument, but the evidence is the text itself. Open with a **claim** about the passage that a reader could discuss: what it shows about a character, what an object stands for, how the writer creates a mood. A summary of what happens is not a claim.\n\nThen **quote** the words that prove it, in quotation marks, and **explain** them: which word or detail matters, and why? A good explanation often names the writer's choice: *the simile makes...*, *the short sentences show...*",
          "评析文学作品的步骤与任何论证相同，只是证据就是文本本身。开头提出一个读者可以讨论的关于这段文字的**论点**：它体现了人物的什么、某个东西象征什么、作者怎样营造氛围。复述情节不是论点。\n\n然后用引号**引用**能证明论点的原话，并**解释**它们：哪个词或细节重要？为什么？好的解释常会点明作者的写法：*the simile makes...*、*the short sentences show...*",
        ),
        writingGenerator(
          t(
            "Read the passage, then write a paragraph in English: a claim about the passage, a quotation from it, and an explanation of the quotation.",
            "阅读文段，然后用英语写一个段落：对文段的论点、文段中的引文，以及对引文的解释。",
          ),
          analysisBank,
          ["w5-literary-claim", "w5-uses-source", "w5-explains-evidence"],
          { minWords: 50, maxChars: 2000 },
          (model) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`),
        ),
      ),
    ],
  },
];
