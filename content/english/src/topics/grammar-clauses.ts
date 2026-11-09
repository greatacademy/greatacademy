// Grammar: phrases and clauses, and the errors that come with them.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

const modifierKindBank: readonly ChoiceItem[] = [
  ["The nervous actor forgot a line.", "nervous", ["actor", "forgot", "line"]],
  ["A heavy rain fell overnight.", "heavy", ["rain", "fell", "overnight"]],
  ["The kind nurse smiled.", "kind", ["nurse", "smiled", "The"]],
  ["We climbed the steep hill.", "steep", ["climbed", "hill", "We"]],
  ["She wore a bright scarf.", "bright", ["wore", "scarf", "She"]],
  ["The empty bus turned around.", "empty", ["bus", "turned", "around"]],
  ["He told a funny story.", "funny", ["told", "story", "He"]],
  ["The thirsty horses drank.", "thirsty", ["horses", "drank", "The"]],
];

const adverbBank: readonly ChoiceItem[] = [
  ["The choir sang beautifully.", "beautifully", ["choir", "sang", "The"]],
  ["He opened the box slowly.", "slowly", ["opened", "box", "He"]],
  ["They arrived early.", "early", ["They", "arrived"]],
  ["The baby slept soundly.", "soundly", ["baby", "slept", "The"]],
  ["She answered very quickly.", "quickly", ["She", "answered"]],
  ["We often walk home.", "often", ["We", "walk", "home"]],
  ["The wind blew hard.", "hard", ["wind", "blew", "The"]],
  ["He spoke quietly to the child.", "quietly", ["spoke", "child", "He"]],
];

const adjOrAdvBank: readonly ChoiceItem[] = [
  ["The turtle moved ___.", "slowly", ["slow"]],
  ["The turtle is ___.", "slow", ["slowly"]],
  ["She plays the violin ___.", "well", ["good"]],
  ["She is a ___ violinist.", "good", ["well"]],
  ["He closed the door ___.", "quietly", ["quiet"]],
  ["The room was ___.", "quiet", ["quietly"]],
  ["The soup smells ___.", "delicious", ["deliciously"]],
  ["The team played ___ in the final.", "badly", ["bad"]],
  ["We felt ___ about the mistake.", "bad", ["badly"]],
  ["The sun shone ___.", "brightly", ["bright"]],
];

const phraseBank: readonly ChoiceItem[] = [
  ["The cat slept under the warm blanket.", "under the warm blanket", ["The cat", "slept under", "the warm"]],
  ["A letter from my aunt arrived today.", "from my aunt", ["A letter", "arrived today", "my aunt arrived"]],
  ["We hiked through the dark forest.", "through the dark forest", ["We hiked", "hiked through", "the dark"]],
  ["The book on the top shelf is mine.", "on the top shelf", ["The book", "is mine", "top shelf is"]],
  ["They ate lunch beside the river.", "beside the river", ["They ate", "ate lunch", "lunch beside"]],
  ["The boy with the red hat waved.", "with the red hat", ["The boy", "hat waved", "the red"]],
  ["She hid the gift behind the sofa.", "behind the sofa", ["She hid", "the gift", "gift behind"]],
  ["The path to the beach is narrow.", "to the beach", ["The path", "is narrow", "beach is"]],
  ["He ran across the field.", "across the field", ["He ran", "ran across", "the field"]],
  ["After the movie, we went home.", "After the movie", ["we went", "went home", "movie, we"]],
];

const phraseJobBank: readonly ChoiceItem[] = [
  ["The dog **in the yard** barked.", "dog", ["barked", "yard"]],
  ["We waited **at the corner**.", "waited", ["We", "corner"]],
  ["The house **on the hill** is empty.", "house", ["empty", "hill"]],
  ["She sang **after dinner**.", "sang", ["She", "dinner"]],
  ["The man **with the cane** smiled.", "man", ["smiled", "cane"]],
  ["The kids played **in the mud**.", "played", ["kids", "mud"]],
  ["A photo **of my grandfather** fell.", "photo", ["fell", "grandfather"]],
  ["He left **before sunrise**.", "left", ["He", "sunrise"]],
];

const fanboysBank: readonly ChoiceItem[] = [
  ["I wanted the blue one, ___ the store only had red.", "but", ["so", "and"]],
  ["The road was icy, ___ we drove slowly.", "so", ["but", "or"]],
  ["You can walk, ___ you can take the bus.", "or", ["so", "but"]],
  ["She plays the flute, ___ her brother plays drums.", "and", ["or", "so"]],
  ["He studied all week, ___ he still felt nervous.", "but", ["or", "so"]],
  ["The lamp broke, ___ we fixed it with glue.", "so", ["or", "nor"]],
  ["We can leave now, ___ we can wait for Sam.", "or", ["and", "so"]],
  ["The sky darkened, ___ the wind grew stronger.", "and", ["or", "nor"]],
  ["It was late, ___ nobody wanted to leave.", "but", ["or", "so"]],
  ["I forgot my lunch, ___ I bought a sandwich.", "so", ["or", "nor"]],
];

const conjunctionCommaBank: readonly ChoiceItem[] = [
  ["", "The bell rang, and the students left.", ["The bell rang and, the students left.", "The bell rang, and, the students left."]],
  ["", "I like tea, but my sister prefers milk.", ["I like tea but, my sister prefers milk.", "I like, tea but my sister prefers milk."]],
  ["", "We can stay here, or we can go inside.", ["We can stay here or, we can go inside.", "We can stay, here or we can go inside."]],
  ["", "The rain stopped, so we went outside.", ["The rain stopped so, we went outside.", "The rain, stopped so we went outside."]],
  ["", "Ana sang, and Leo played the guitar.", ["Ana sang and, Leo played the guitar.", "Ana, sang and Leo played the guitar."]],
  ["", "Salt and pepper sat on the table.", ["Salt, and pepper sat on the table.", "Salt and, pepper sat on the table."]],
  ["", "He washed and dried the dishes.", ["He washed, and dried the dishes.", "He washed and, dried the dishes."]],
  [
    "",
    "The car started, but the lights stayed off.",
    ["The car started but, the lights stayed off.", "The car, started but the lights stayed off."],
  ],
];

const runonKinds = ["Correct", "Run-on", "Comma splice"];
const kind = (s: string, k: 0 | 1 | 2): ChoiceItem => [s, runonKinds[k]!, runonKinds.filter((_, i) => i !== k)];

const runonKindBank: readonly ChoiceItem[] = [
  kind("The sun set we drove home.", 1),
  kind("The sun set, we drove home.", 2),
  kind("The sun set, and we drove home.", 0),
  kind("My dog is friendly he loves visitors.", 1),
  kind("My dog is friendly, he loves visitors.", 2),
  kind("My dog is friendly. He loves visitors.", 0),
  kind("The test was hard I finished it anyway.", 1),
  kind("The test was hard, I finished it anyway.", 2),
  kind("The test was hard, but I finished it anyway.", 0),
  kind("We missed the train; we took a bus.", 0),
  kind("It snowed all night the school closed.", 1),
  kind("It snowed all night, the school closed.", 2),
];

const firstSentenceBank: readonly ChoiceItem[] = [
  ["The sun set we drove home.", "set", ["sun", "drove"]],
  ["My dog is friendly he loves visitors.", "friendly", ["dog", "loves"]],
  ["The test was hard I finished it anyway.", "hard", ["test", "finished"]],
  ["It snowed all night the school closed.", "night", ["snowed", "school"]],
  ["We missed the train we took a bus.", "train", ["missed", "took"]],
  ["Mina reads every day she likes mysteries.", "day", ["reads", "likes"]],
  ["The river is low the boats cannot pass.", "low", ["river", "boats"]],
  ["Leo washed the plates Ana dried them.", "plates", ["washed", "dried"]],
  ["The cake looks great it took all day.", "great", ["looks", "took"]],
  ["I called her she did not answer.", "her", ["called", "answer"]],
];

const subordinatorBank: readonly ChoiceItem[] = [
  ["We stayed home because it was snowing.", "because", ["stayed", "home", "snowing"]],
  ["Although the hill was steep, she kept running.", "Although", ["steep", "kept", "running"]],
  ["Call me when you arrive.", "when", ["Call", "me", "arrive"]],
  ["If it rains, the game will move inside.", "If", ["rains", "game", "inside"]],
  ["He waited until the bus came.", "until", ["waited", "bus", "came"]],
  ["Since the shop was closed, we went home.", "Since", ["shop", "closed", "home"]],
  ["She smiled while she worked.", "while", ["smiled", "she", "worked"]],
  ["Before you leave, turn off the lights.", "Before", ["leave", "turn", "lights"]],
  ["We ate after the guests had gone.", "after", ["ate", "guests", "gone"]],
  ["Unless you hurry, you will be late.", "Unless", ["hurry", "you", "late"]],
];

const subordinatorMeaningBank: readonly ChoiceItem[] = [
  ["The picnic was canceled ___ the storm was coming.", "because", ["although", "unless"]],
  ["___ he was tired, he finished the race.", "Although", ["Because", "Until"]],
  ["We will not start ___ everyone is here.", "until", ["although", "because"]],
  ["Bring a coat ___ it gets cold.", "in case", ["although", "until"]],
  ["___ you finish your work, you may go outside.", "When", ["Although", "Unless"]],
  ["She kept reading ___ the lights went out.", "until", ["although", "if"]],
  ["You will miss the bus ___ you leave now.", "unless", ["because", "while"]],
  ["___ the movie was long, nobody left early.", "Although", ["Because", "Until"]],
  ["The plants died ___ nobody watered them.", "because", ["although", "unless"]],
  ["I listen to music ___ I clean my room.", "while", ["although", "unless"]],
];

const clauseCommaBank: readonly ChoiceItem[] = [
  ["", "Because it rained, we stayed inside.", ["Because it rained we, stayed inside.", "Because, it rained we stayed inside."]],
  ["", "We stayed inside because it rained.", ["We stayed inside, because, it rained.", "We stayed, inside because it rained."]],
  ["", "When the bell rings, line up.", ["When, the bell rings line up.", "When the bell, rings line up."]],
  ["", "Line up when the bell rings.", ["Line up when, the bell rings.", "Line, up when the bell rings."]],
  ["", "If you are hungry, eat an apple.", ["If, you are hungry eat an apple.", "If you are, hungry eat an apple."]],
  ["", "Eat an apple if you are hungry.", ["Eat an apple if, you are hungry.", "Eat, an apple if you are hungry."]],
  ["", "Although he ran, he missed the bus.", ["Although, he ran he missed the bus.", "Although he ran he, missed the bus."]],
  ["", "He missed the bus although he ran.", ["He missed the bus although, he ran.", "He missed, the bus although he ran."]],
];

const relativeWordBank: readonly ChoiceItem[] = [
  ["The girl ___ won the race is my cousin.", "who", ["which", "whose"]],
  ["The bike ___ I fixed is blue.", "that", ["who", "whose"]],
  ["The man ___ dog ran away called the police.", "whose", ["who", "which"]],
  ["My grandmother, ___ lives in Ohio, sent a card.", "who", ["which", "whose"]],
  ["The lake, ___ freezes every winter, is deep.", "which", ["who", "whose"]],
  ["The teacher ___ helped me retired.", "who", ["which", "whose"]],
  ["The student ___ essay won read it aloud.", "whose", ["who", "which"]],
  ["The song ___ she wrote became popular.", "that", ["who", "whose"]],
  ["Our car, ___ is old, still runs well.", "which", ["who", "whose"]],
  ["The doctor ___ office is downtown called me.", "whose", ["who", "which"]],
];

const relativeFindBank: readonly ChoiceItem[] = [
  ["The boy who lives next door plays drums.", "who lives next door", ["The boy who", "plays drums", "next door plays"]],
  ["The cake that Mia baked is gone.", "that Mia baked", ["The cake", "is gone", "Mia baked is"]],
  ["My coat, which is very old, keeps me warm.", "which is very old", ["My coat", "keeps me warm", "is very old, keeps"]],
  ["We met a woman whose son is a pilot.", "whose son is a pilot", ["We met a woman", "a woman whose", "son is"]],
  ["The trail that we chose was steep.", "that we chose", ["The trail", "was steep", "we chose was"]],
  ["The man who fixed the sink left early.", "who fixed the sink", ["The man", "left early", "the sink left"]],
  ["Paris, which I visited once, is beautiful.", "which I visited once", ["Paris", "is beautiful", "visited once, is"]],
  ["The dog that bit me was scared.", "that bit me", ["The dog", "was scared", "me was"]],
];

const appositiveBank: readonly ChoiceItem[] = [
  ["Ms. Reed, the school librarian, ordered new books.", "the school librarian", ["Ms. Reed", "ordered new books", "new books"]],
  ["Our dog, a golden retriever, loves water.", "a golden retriever", ["Our dog", "loves water", "water"]],
  ["Mars, the red planet, has two moons.", "the red planet", ["Mars", "has two moons", "two moons"]],
  ["I read Holes, a novel about a boy at a camp.", "a novel about a boy at a camp", ["I read", "Holes", "a boy"]],
  ["Leo, my best friend, moved away.", "my best friend", ["Leo", "moved away", "away"]],
  ["Cairo, the capital of Egypt, is huge.", "the capital of Egypt", ["Cairo", "is huge", "Egypt"]],
  ["We visited Dr. Lin, our family doctor.", "our family doctor", ["We visited", "Dr. Lin", "family"]],
  [
    "The whale, the largest animal on Earth, eats tiny krill.",
    "the largest animal on Earth",
    ["The whale", "eats tiny krill", "tiny krill"],
  ],
];

const appositiveCommaBank: readonly ChoiceItem[] = [
  ["", "Mr. Cole, our coach, blew the whistle.", ["Mr. Cole our coach, blew the whistle.", "Mr. Cole, our coach blew the whistle."]],
  [
    "",
    "Jupiter, the largest planet, has many moons.",
    ["Jupiter the largest planet, has many moons.", "Jupiter, the largest planet has many moons."],
  ],
  ["", "My aunt, a pilot, flew home.", ["My aunt a pilot, flew home.", "My aunt, a pilot flew home."]],
  ["", "Rex, a small terrier, chased the ball.", ["Rex a small terrier, chased the ball.", "Rex, a small terrier chased the ball."]],
  [
    "",
    "Lima, the capital of Peru, sits near the sea.",
    ["Lima the capital of Peru, sits near the sea.", "Lima, the capital of Peru sits near the sea."],
  ],
  [
    "",
    "The bee, a tireless worker, returned to the hive.",
    ["The bee a tireless worker, returned to the hive.", "The bee, a tireless worker returned to the hive."],
  ],
  ["", "We thanked Ana, the bus driver.", ["We thanked, Ana the bus driver.", "We thanked Ana the, bus driver."]],
  [
    "",
    "Tokyo, a very large city, has busy trains.",
    ["Tokyo a very large city, has busy trains.", "Tokyo, a very large city has busy trains."],
  ],
];

const participleFindBank: readonly ChoiceItem[] = [
  ["Laughing at the joke, Sara dropped her fork.", "Laughing at the joke", ["Sara dropped", "her fork", "dropped her fork"]],
  ["The boy, covered in mud, ran inside.", "covered in mud", ["The boy", "ran inside", "mud, ran"]],
  ["Tired from the hike, we sat down.", "Tired from the hike", ["we sat", "sat down", "the hike, we"]],
  ["The dog chasing the ball fell.", "chasing the ball", ["The dog", "ball fell", "fell"]],
  ["Holding her breath, Mina dived in.", "Holding her breath", ["Mina dived", "dived in", "breath, Mina"]],
  ["The letter, written in pencil, was faded.", "written in pencil", ["The letter", "was faded", "pencil, was"]],
  ["Waving goodbye, the children boarded the bus.", "Waving goodbye", ["the children", "boarded the bus", "the bus"]],
  ["Frozen by fear, the deer stood still.", "Frozen by fear", ["the deer", "stood still", "fear, the"]],
];

const participleFormBank: readonly ChoiceItem[] = [
  ["___ by the noise, the baby woke.", "Startled", ["Startling", "Startle"]],
  ["___ the map, Jo found the trail.", "Reading", ["Read by", "Reads"]],
  ["___ in 1900, the bridge still stands.", "Built", ["Building", "Builds"]],
  ["___ loudly, the crowd stood up.", "Cheering", ["Cheered by", "Cheers"]],
  ["___ with cheese, the pasta smelled great.", "Topped", ["Topping", "Tops"]],
  ["___ to the music, Ben tapped his foot.", "Listening", ["Listened", "Listens"]],
  ["___ by rain, the game ended early.", "Stopped", ["Stopping", "Stops"]],
  ["___ the fence, the cat landed softly.", "Jumping", ["Jumped by", "Jumps"]],
  ["___ in red paper, the gift sat on the table.", "Wrapped", ["Wrapping", "Wraps"]],
  ["___ her notes, Ivy got ready for the test.", "Studying", ["Studied by", "Studies"]],
];

const misplacedBank: readonly ChoiceItem[] = [
  ["", "Running to the bus, I dropped my bag.", ["Running to the bus, my bag dropped.", "My bag dropped, running to the bus."]],
  [
    "",
    "Barking loudly, the dog scared the mail carrier.",
    ["Barking loudly, the mail carrier was scared by the dog.", "The mail carrier, barking loudly, was scared by the dog."],
  ],
  ["", "We saw a deer while driving home.", ["Driving home, a deer was seen.", "We saw a deer driving home."]],
  [
    "",
    "Dad served cold pizza on paper plates.",
    ["Dad served pizza on paper plates that was cold.", "On paper plates, cold, Dad served pizza."],
  ],
  [
    "",
    "Covered in frosting, the cake looked wonderful.",
    ["Covered in frosting, we thought the cake looked wonderful.", "We thought, covered in frosting, the cake looked wonderful."],
  ],
  [
    "",
    "She found a wallet full of cash on the sidewalk.",
    ["She found a wallet on the sidewalk full of cash.", "On the sidewalk full of cash, she found a wallet."],
  ],
  [
    "",
    "Tired from the race, the runners sat down.",
    ["Tired from the race, the chairs were welcome.", "The chairs, tired from the race, were welcome."],
  ],
  [
    "",
    "I gave the bone with the meat on it to the dog.",
    ["I gave the bone to the dog with the meat on it.", "With the meat on it, I gave the bone to the dog."],
  ],
];

const misplacedFindBank: readonly ChoiceItem[] = [
  [
    "",
    "Walking to school, the rain soaked my shoes.",
    ["Walking to school, I got my shoes soaked.", "The rain soaked my shoes as I walked to school."],
  ],
  [
    "",
    "Sleeping on the porch, I saw the old cat.",
    ["I saw the old cat sleeping on the porch.", "The old cat was sleeping on the porch when I saw it."],
  ],
  [
    "",
    "Opening the door, the room smelled of smoke.",
    ["Opening the door, I smelled smoke.", "The room smelled of smoke when I opened the door."],
  ],
  [
    "",
    "After eating lunch, the bus was late.",
    ["After eating lunch, we waited for the late bus.", "The bus was late after we ate lunch."],
  ],
  ["", "Painted bright red, Dad bought the bike.", ["Dad bought the bike painted bright red.", "Dad bought the bright red bike."]],
  ["", "Swimming in the bay, the water felt cold.", ["Swimming in the bay, I felt cold.", "The water felt cold when I swam in the bay."]],
  [
    "",
    "Reading the letter, tears filled her eyes.",
    ["Reading the letter, she began to cry.", "Tears filled her eyes as she read the letter."],
  ],
  [
    "",
    "Hanging on the wall, I noticed the map.",
    ["I noticed the map hanging on the wall.", "The map was hanging on the wall, and I noticed it."],
  ],
];

const voiceKinds = ["Active", "Passive"];
const voice = (s: string, active: boolean): ChoiceItem => [s, voiceKinds[active ? 0 : 1]!, [voiceKinds[active ? 1 : 0]!]];

const voiceKindBank: readonly ChoiceItem[] = [
  voice("The chef cooked the meal.", true),
  voice("The meal was cooked by the chef.", false),
  voice("The wind knocked down the fence.", true),
  voice("The fence was knocked down by the wind.", false),
  voice("Our class planted a tree.", true),
  voice("A tree was planted by our class.", false),
  voice("The window was broken.", false),
  voice("Rain flooded the road.", true),
  voice("The road was flooded by rain.", false),
  voice("The prize will be given tomorrow.", false),
];

const toActiveBank: readonly ChoiceItem[] = [
  ["The ball was kicked by Sam.", "Sam kicked the ball.", ["The ball kicked Sam.", "Sam was kicked by the ball."]],
  ["The song was sung by the choir.", "The choir sang the song.", ["The song sang the choir.", "The choir was sung by the song."]],
  [
    "The cake was eaten by the children.",
    "The children ate the cake.",
    ["The cake ate the children.", "The children were eaten by the cake."],
  ],
  ["The letter was written by Ana.", "Ana wrote the letter.", ["The letter wrote Ana.", "Ana was written by the letter."]],
  ["The mouse was chased by the cat.", "The cat chased the mouse.", ["The mouse chased the cat.", "The cat was chased by the mouse."]],
  ["The fire was put out by the crew.", "The crew put out the fire.", ["The fire put out the crew.", "The crew was put out by the fire."]],
  ["The bridge was built by workers.", "Workers built the bridge.", ["The bridge built workers.", "Workers were built by the bridge."]],
  ["The test was graded by Mr. Kim.", "Mr. Kim graded the test.", ["The test graded Mr. Kim.", "Mr. Kim was graded by the test."]],
];

const parallelFindBank: readonly ChoiceItem[] = [
  ["", "I like hiking, swimming and biking.", ["I like hiking, swimming and to bike.", "I like to hike, swimming and biking."]],
  ["", "She was tired, hungry and cold.", ["She was tired, hungry and felt cold.", "She was tired, had hunger and cold."]],
  ["", "He wants to read, to write and to draw.", ["He wants to read, writing and to draw.", "He wants reading, to write and to draw."]],
  ["", "The dog ran, jumped and barked.", ["The dog ran, jumped and was barking.", "The dog running, jumped and barked."]],
  [
    "",
    "We cleaned the room and washed the windows.",
    ["We cleaned the room and washing the windows.", "We cleaning the room and washed the windows."],
  ],
  [
    "",
    "My goals are to save money and to travel.",
    ["My goals are to save money and traveling.", "My goals are saving money and to travel."],
  ],
  ["", "The trail is long, steep and rocky.", ["The trail is long, steep and has rocks.", "The trail is long, has steepness and rocky."]],
  ["", "She sings well and dances gracefully.", ["She sings well and is a graceful dancing.", "She sings well and dancing gracefully."]],
];

const parallelFixBank: readonly ChoiceItem[] = [
  ["Tom enjoys reading, painting and to cook.", "cooking", ["to cooks", "cooked"]],
  ["The coach told us to run, to stretch and drinking water.", "to drink water", ["drink waters", "drank water"]],
  ["The room was clean, bright and had space.", "spacious", ["space", "with spacing"]],
  ["She packed, cleaned and was locking the door.", "locked the door", ["locking the door", "locks the door"]],
  ["I want to learn French, visit Paris and eating croissants.", "eat croissants", ["eating croissants", "ate croissants"]],
  ["The movie was long, boring and had confusion.", "confusing", ["confusion", "confuses"]],
  ["He likes soccer, tennis and to swim.", "swimming", ["to swim", "swims"]],
  ["We sang, danced and were laughing.", "laughed", ["laughing", "laughs"]],
];

/** clauseTopics are the topics of phrases and clauses. */
export const clauseTopics: readonly TopicDef[] = [
  {
    id: "adjectives-and-adverbs",
    title: t("Adjectives and Adverbs", "形容词和副词"),
    summary: t("Adjectives describe nouns; adverbs describe verbs and more.", "形容词修饰名词；副词修饰动词等。"),
    prerequisites: ["nouns-and-pronouns"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "adjectives",
        t("Adjectives", "形容词"),
        t(
          "An **adjective** describes a noun. It answers *what kind?*, *which one?* or *how many?*: a *tall* tree, *that* house, *three* bikes. It usually sits right before the noun, or after a verb such as *is*: *The tree is tall.*",
          "**形容词**（adjective）修饰名词，回答“什么样的”“哪一个”“多少个”：a *tall* tree、*that* house、*three* bikes。它通常紧靠名词之前，或在 *is* 这类动词之后：*The tree is tall.*",
        ),
        choiceGenerator(t("Which word is an adjective?", "哪个词是形容词？"), modifierKindBank, (right) =>
          t(
            `**${right}** describes a noun, so it is an adjective. An adverb would describe a verb, an adjective or another adverb instead.`,
            `**${right}** 修饰名词，所以是形容词。副词修饰的则是动词、形容词或其他副词。`,
          ),
        ),
      ),
      point(
        "adverbs",
        t("Adverbs", "副词"),
        t(
          "An **adverb** usually describes a verb. It answers *how?*, *when?*, *where?* or *how often?*: she spoke *softly*, they left *early*, we *often* walk. Many adverbs end in *-ly*, though not all: *fast*, *hard* and *soon* are adverbs too.",
          "**副词**（adverb）通常修饰动词，回答“怎样”“何时”“何地”“多频繁”：she spoke *softly*、they left *early*、we *often* walk。许多副词以 *-ly* 结尾，但并非全部：*fast*、*hard*、*soon* 也是副词。",
        ),
        choiceGenerator(t("Which word is an adverb?", "哪个词是副词？"), adverbBank, (right) =>
          t(
            `**${right}** tells how, when or how often the action happens, so it is an adverb.`,
            `**${right}** 说明动作的方式、时间或频率，所以是副词。`,
          ),
        ),
      ),
      point(
        "choosing-the-form",
        t("Choosing Between Them", "在两者之间选择"),
        t(
          "Ask what the word describes. If it describes a noun, use the adjective: *a slow turtle*. If it describes an action, use the adverb: *it moved slowly*. After verbs of being or sensing, such as *is*, *feels* and *smells*, use an adjective, since it describes the subject: *The soup smells good.*\n\n*Good* is an adjective, and its adverb is *well*: *a good singer sings well*.",
          "问一问这个词修饰什么。修饰名词时用形容词：*a slow turtle*。修饰动作时用副词：*it moved slowly*。在 *is*、*feels*、*smells* 这类表示状态或感觉的动词后用形容词，因为它描述的是主语：*The soup smells good.*\n\n*Good* 是形容词，对应的副词是 *well*：*a good singer sings well*。",
        ),
        choiceGenerator(t("Which word completes the sentence?", "哪个词能补全句子？"), adjOrAdvBank, (right, shown) =>
          t(
            `${shown.replace("___", `**${right}**`)} Decide whether the word describes a noun or an action.`,
            `${shown.replace("___", `**${right}**`)} 判断这个词修饰的是名词还是动作。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "prepositional-phrases",
    title: t("Prepositional Phrases", "介词短语"),
    summary: t("A preposition and its noun add where, when or which one.", "介词和名词一起补充地点、时间或“哪一个”。"),
    prerequisites: ["adjectives-and-adverbs"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "finding-phrases",
        t("Finding the Phrase", "找出短语"),
        t(
          "A **prepositional phrase** starts with a preposition, such as *in, on, under, from, with, to, after, across*, and ends with a noun or pronoun: *under the warm blanket*, *from my aunt*.\n\nThe subject of a sentence is never inside one of these phrases, which helps with finding it.",
          "**介词短语**（prepositional phrase）以介词开头，如 *in, on, under, from, with, to, after, across*，以名词或代词结尾：*under the warm blanket*、*from my aunt*。\n\n句子的主语绝不会在这种短语之内，这有助于找主语。",
        ),
        choiceGenerator(t("Which words form a prepositional phrase?", "哪些词构成介词短语？"), phraseBank, (right) =>
          t(`**${right}** starts with a preposition and ends with a noun.`, `**${right}** 以介词开头，以名词结尾。`),
        ),
      ),
      point(
        "what-the-phrase-describes",
        t("What the Phrase Describes", "短语修饰什么"),
        t(
          "A prepositional phrase works like an adjective or an adverb. In *The dog in the yard barked*, the phrase tells which dog, so it describes the noun *dog*. In *We waited at the corner*, it tells where we waited, so it describes the verb *waited*.",
          "介词短语的作用类似形容词或副词。在 *The dog in the yard barked* 中，短语说明是哪只狗，所以修饰名词 *dog*。在 *We waited at the corner* 中，它说明在哪里等，所以修饰动词 *waited*。",
        ),
        choiceGenerator(t("Which word does the phrase in bold describe?", "粗体短语修饰哪个词？"), phraseJobBank, (right) =>
          t(
            `The phrase tells more about **${right}**. Ask which word the phrase answers a question about, such as which one, where or when.`,
            `这个短语进一步说明 **${right}**。问问这个短语回答的是关于哪个词的问题，比如哪一个、在哪里或什么时候。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "coordinating-conjunctions",
    title: t("Coordinating Conjunctions", "并列连词"),
    summary: t("And, but, or and so join equal ideas, each with its own meaning.", "and、but、or、so 连接地位相等的内容，各有含义。"),
    prerequisites: ["complete-sentences-and-fragments"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "choosing-the-conjunction",
        t("Choosing the Right Conjunction", "选择合适的连词"),
        t(
          "**Coordinating conjunctions** join words or sentences of equal weight. Each one shows a different relationship: *and* adds, *but* contrasts, *or* offers a choice, and *so* gives a result.\n\n*It rained, so we stayed in* is a result. *It rained, but we went out* is a surprise. The word you choose changes what you say.",
          "**并列连词**（coordinating conjunction）连接分量相等的词或句子。它们表示不同的关系：*and* 表示递进，*but* 表示转折，*or* 表示选择，*so* 表示结果。\n\n*It rained, so we stayed in* 是结果。*It rained, but we went out* 出乎意料。选择的词决定了你表达的意思。",
        ),
        choiceGenerator(t("Which word best completes the sentence?", "哪个词最适合补全句子？"), fanboysBank, (right, shown) =>
          t(
            `${shown.replace("___", `**${right}**`)} The two parts of the sentence relate in the way this word shows.`,
            `${shown.replace("___", `**${right}**`)} 句子两部分的关系正是这个词所表示的。`,
          ),
        ),
      ),
      point(
        "comma-with-conjunction",
        t("The Comma Before a Conjunction", "连词前的逗号"),
        t(
          "When a conjunction joins two complete sentences, put a comma before it: *The bell rang, and the students left.*\n\nWhen it joins only words or phrases, no comma is needed: *He washed and dried the dishes.* To test it, check whether each side could stand alone as a sentence.",
          "连词连接两个完整句子时，在它前面加逗号：*The bell rang, and the students left.*\n\n只连接词或短语时，不需要逗号：*He washed and dried the dishes.* 检查时看两边能否各自独立成句。",
        ),
        choiceGenerator(t("Choose the correct sentence.", "选出正确的句子。"), conjunctionCommaBank, (right) =>
          t(
            `**${right}** The comma goes before the conjunction only when both sides could stand alone.`,
            `**${right}** 只有两边都能独立成句时，才在连词前加逗号。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "run-ons-and-comma-splices",
    title: t("Run-ons and Comma Splices", "连写句和逗号拼接"),
    summary: t("Recognize two sentences joined with too little between them.", "识别两个句子之间连接不当的错误。"),
    prerequisites: ["coordinating-conjunctions"],
    encompasses: [{ topic: "coordinating-conjunctions", weight: 0.3 }],
    xp: 8,
    knowledgePoints: [
      point(
        "recognizing",
        t("Recognizing the Errors", "识别错误"),
        t(
          "Two complete sentences cannot simply run together. A **run-on** has nothing between them: *The sun set we drove home.* A **comma splice** has only a comma: *The sun set, we drove home.*\n\nBoth are correct with a period, with a semicolon, or with a comma and a conjunction: *The sun set, and we drove home.*",
          "两个完整句子不能直接连在一起。**连写句**（run-on）中间什么都没有：*The sun set we drove home.* **逗号拼接**（comma splice）中间只有逗号：*The sun set, we drove home.*\n\n用句号、分号，或者逗号加连词都是正确的：*The sun set, and we drove home.*",
        ),
        choiceGenerator(t("What is this?", "这属于哪一种？"), runonKindBank, (right, shown) =>
          t(
            `**${right}**. Find where the first complete sentence ends, then look at what comes between it and the next: ${shown}`,
            `答案是 **${right}**。找到第一个完整句子结束的地方，再看它与下一句之间有什么：${shown}`,
          ),
        ),
      ),
      point(
        "finding-the-break",
        t("Finding the Break", "找到断开的地方"),
        t(
          "To find where a run-on breaks, read from the start until you have a subject and a verb that could stand alone. The next subject begins a new sentence: in *The sun set we drove home*, *The sun set* is complete, and *we* starts the next sentence.",
          "要找到连写句断开的地方，就从头读，直到出现一个能独立成句的主语和动词。下一个主语开始新的句子：在 *The sun set we drove home* 中，*The sun set* 已经完整，*we* 开始下一句。",
        ),
        choiceGenerator(
          t("This is a run-on. Which word ends the first complete sentence?", "这是一个连写句。哪个词结束了第一个完整句子？"),
          firstSentenceBank,
          (right, shown) =>
            t(
              `The first sentence ends at **${right}**, and a new subject follows it: ${shown}`,
              `第一句在 **${right}** 处结束，后面跟着新的主语：${shown}`,
            ),
        ),
      ),
    ],
  },
  {
    id: "subordinating-conjunctions",
    title: t("Subordinating Conjunctions", "从属连词"),
    summary: t("Because, although, when and if make one idea depend on another.", "because、although、when、if 让一个意思依赖另一个。"),
    prerequisites: ["coordinating-conjunctions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      point(
        "finding-subordinators",
        t("Finding the Conjunction", "找出连词"),
        t(
          "A **subordinating conjunction** begins a clause that cannot stand alone. Common ones are *because, although, when, while, if, unless, since, before, after, until*.\n\nIn *We left because it rained*, *because it rained* depends on the main sentence, *We left*.",
          "**从属连词**（subordinating conjunction）引导不能独立成句的从句。常见的有 *because, although, when, while, if, unless, since, before, after, until*。\n\n在 *We left because it rained* 中，*because it rained* 依赖主句 *We left*。",
        ),
        choiceGenerator(t("Which word is the subordinating conjunction?", "哪个词是从属连词？"), subordinatorBank, (right) =>
          t(
            `**${right}** begins the clause that cannot stand alone. Cover the clause it starts, and the rest of the sentence still makes sense on its own.`,
            `**${right}** 引导不能独立成句的从句。遮住它引导的从句，句子其余部分仍然能独立成立。`,
          ),
        ),
      ),
      point(
        "meaning-of-subordinators",
        t("What Each One Means", "各自的含义"),
        t(
          "Each conjunction states a relationship. *Because* and *since* give a reason. *Although* marks a surprise or a contrast. *When, while, before, after* and *until* show time. *If* and *unless* set a condition: *unless* means *if not*.",
          "每个连词都表示一种关系。*because* 和 *since* 说明原因。*although* 表示出乎意料或对比。*when, while, before, after, until* 表示时间。*if* 和 *unless* 表示条件：*unless* 的意思是 *if not*。",
        ),
        choiceGenerator(t("Which word best completes the sentence?", "哪个词最适合补全句子？"), subordinatorMeaningBank, (right, shown) =>
          t(
            `${shown.replace("___", `**${right}**`)} This word shows how the two ideas relate.`,
            `${shown.replace("___", `**${right}**`)} 这个词表明两个意思之间的关系。`,
          ),
        ),
      ),
      point(
        "comma-with-clauses",
        t("Where the Comma Goes", "逗号的位置"),
        t(
          "When the dependent clause comes first, put a comma after it: *Because it rained, we stayed inside.* When the main sentence comes first, you usually need no comma: *We stayed inside because it rained.*",
          "从句在前时，在它后面加逗号：*Because it rained, we stayed inside.* 主句在前时，通常不需要逗号：*We stayed inside because it rained.*",
        ),
        choiceGenerator(t("Choose the correct sentence.", "选出正确的句子。"), clauseCommaBank, (right) =>
          t(`**${right}** A comma follows a dependent clause that opens the sentence.`, `**${right}** 从句放在句首时，后面要加逗号。`),
        ),
      ),
    ],
  },
  {
    id: "relative-clauses",
    title: t("Relative Clauses", "关系从句"),
    summary: t("Who, which, that and whose add information about a noun.", "who、which、that、whose 为名词补充信息。"),
    prerequisites: ["subordinating-conjunctions", "pronoun-antecedent-agreement"],
    encompasses: [{ topic: "subordinating-conjunctions", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "finding-relative-clauses",
        t("Finding the Clause", "找出从句"),
        t(
          "A **relative clause** describes a noun and begins with a word like *who, which, that* or *whose*. In *The boy who lives next door plays drums*, the clause *who lives next door* tells which boy.\n\nThe clause sits right after the noun it describes, and the sentence still has its own main verb, here *plays*.",
          "**关系从句**（relative clause）修饰名词，以 *who, which, that, whose* 等词开头。在 *The boy who lives next door plays drums* 中，从句 *who lives next door* 说明是哪个男孩。\n\n从句紧跟它所修饰的名词，句子仍有自己的主要动词，这里是 *plays*。",
        ),
        choiceGenerator(t("Which words form the relative clause?", "哪些词构成关系从句？"), relativeFindBank, (right) =>
          t(`**${right}** begins with a relative word and describes the noun before it.`, `**${right}** 以关系词开头，修饰它前面的名词。`),
        ),
      ),
      point(
        "choosing-relative-words",
        t("Who, Which, That or Whose", "选择 who、which、that 或 whose"),
        t(
          "Use *who* for people and *which* or *that* for things. Use *whose* to show that something belongs to the noun: *the man whose dog ran away*.\n\nWhen the clause merely adds extra information and has commas around it, use *which* for things, not *that*: *The lake, which freezes every winter, is deep.*",
          "人用 *who*，物用 *which* 或 *that*。表示所属用 *whose*：*the man whose dog ran away*。\n\n当从句只是补充信息、两边有逗号时，指物要用 *which*，不用 *that*：*The lake, which freezes every winter, is deep.*",
        ),
        choiceGenerator(t("Which word completes the sentence?", "哪个词能补全句子？"), relativeWordBank, (right, shown) =>
          t(
            `${shown.replace("___", `**${right}**`)} Look at what the word refers to, and whether it shows ownership.`,
            `${shown.replace("___", `**${right}**`)} 看这个词指代什么，以及是否表示所属。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "appositives",
    title: t("Appositives", "同位语"),
    summary: t("A noun phrase beside a noun renames it and is set off by commas.", "紧挨名词的名词短语为其换个说法，并用逗号隔开。"),
    prerequisites: ["relative-clauses"],
    encompasses: [],
    xp: 8,
    knowledgePoints: [
      point(
        "finding-appositives",
        t("Finding the Appositive", "找出同位语"),
        t(
          "An **appositive** is a noun phrase placed beside a noun to rename it: *Mars, the red planet, has two moons.* Here *the red planet* is another name for Mars.\n\nIt works like a relative clause with *who is* or *which is* removed, so it adds detail in fewer words.",
          "**同位语**（appositive）是紧挨名词、为它换个说法的名词短语：*Mars, the red planet, has two moons.* 这里 *the red planet* 是火星的另一种说法。\n\n它就像去掉 *who is* 或 *which is* 的关系从句，用更少的词补充细节。",
        ),
        choiceGenerator(t("Which words form the appositive?", "哪些词构成同位语？"), appositiveBank, (right) =>
          t(
            `**${right}** renames the noun beside it. You could put it in place of that noun, and the sentence would still be about the same thing.`,
            `**${right}** 为它旁边的名词换了个说法。用它替换那个名词，句子说的仍是同一样东西。`,
          ),
        ),
      ),
      point(
        "appositive-commas",
        t("Commas Around an Appositive", "同位语两边的逗号"),
        t(
          "An appositive that adds extra information is set off with commas. If it falls in the middle of a sentence, it needs **two** commas, one on each side: *My aunt, a pilot, flew home.* If it ends the sentence, one comma is enough: *We thanked Ana, the bus driver.*",
          "补充信息的同位语要用逗号隔开。如果它在句子中间，就需要**两个**逗号，两边各一个：*My aunt, a pilot, flew home.* 如果它在句末，一个逗号就够了：*We thanked Ana, the bus driver.*",
        ),
        choiceGenerator(t("Choose the correct sentence.", "选出正确的句子。"), appositiveCommaBank, (right) =>
          t(
            `**${right}** The commas mark off the appositive from the rest of the sentence.`,
            `**${right}** 逗号把同位语与句子其他部分隔开。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "participial-phrases",
    title: t("Participial Phrases", "分词短语"),
    summary: t("Verb forms ending in -ing or -ed can describe a noun.", "以 -ing 或 -ed 结尾的动词形式可以修饰名词。"),
    prerequisites: ["relative-clauses", "simple-verb-tenses"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "finding-participles",
        t("Finding the Phrase", "找出短语"),
        t(
          "A **participial phrase** starts with a verb form, usually ending in *-ing* or *-ed*, and describes a noun: *Laughing at the joke, Sara dropped her fork.* The phrase tells more about Sara.\n\nIt is not the main verb. The sentence still needs one, here *dropped*.",
          "**分词短语**（participial phrase）以动词形式开头，通常以 *-ing* 或 *-ed* 结尾，用来修饰名词：*Laughing at the joke, Sara dropped her fork.* 这个短语进一步说明 Sara。\n\n它不是主要动词。句子仍然需要主要动词，这里是 *dropped*。",
        ),
        choiceGenerator(t("Which words form the participial phrase?", "哪些词构成分词短语？"), participleFindBank, (right) =>
          t(`**${right}** begins with a verb form and describes a noun in the sentence.`, `**${right}** 以动词形式开头，修饰句中的名词。`),
        ),
      ),
      point(
        "choosing-participles",
        t("-ing or -ed", "用 -ing 还是 -ed"),
        t(
          "Use the *-ing* form when the noun is doing the action: *Reading the map, Jo found the trail*, since Jo reads. Use the *-ed* form (or an irregular form such as *built*) when something is done to the noun: *Built in 1900, the bridge still stands*, since someone built the bridge.",
          "名词是动作的发出者时用 *-ing* 形式：*Reading the map, Jo found the trail*，因为 Jo 在看地图。名词是动作的承受者时用 *-ed* 形式（或 *built* 这类不规则形式）：*Built in 1900, the bridge still stands*，因为桥是被人建造的。",
        ),
        choiceGenerator(t("Which word completes the sentence?", "哪个词能补全句子？"), participleFormBank, (right, shown) =>
          t(
            `${shown.replace("___", `**${right}**`)} Ask whether the noun does the action or receives it.`,
            `${shown.replace("___", `**${right}**`)} 问一问名词是发出动作还是承受动作。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "misplaced-modifiers",
    title: t("Misplaced Modifiers", "错位修饰语"),
    summary: t("A modifier belongs right next to what it describes.", "修饰语要紧挨它所修饰的内容。"),
    prerequisites: ["participial-phrases"],
    encompasses: [{ topic: "participial-phrases", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "spotting-problems",
        t("Spotting the Problem", "发现问题"),
        t(
          "An opening phrase describes whatever comes right after its comma. So *Walking to school, the rain soaked my shoes* says that the rain was walking. That is a **dangling modifier**: the person actually walking is not in the sentence as the subject.\n\nCheck by asking who does the action in the opening phrase, then see whether that word follows the comma.",
          "开头的短语修饰紧跟逗号之后的内容。所以 *Walking to school, the rain soaked my shoes* 说的是雨在走路。这就是**悬垂修饰语**（dangling modifier）：真正走路的人没有作为主语出现。\n\n检查时问一问开头短语的动作是谁做的，再看这个词是否紧跟逗号。",
        ),
        choiceGenerator(t("Which sentence has a modifier problem?", "哪个句子的修饰语有问题？"), misplacedFindBank, (right) =>
          t(
            `**${right}** The word right after the comma cannot do the action in the opening phrase.`,
            `**${right}** 紧跟逗号的词不可能做开头短语中的动作。`,
          ),
        ),
      ),
      point(
        "placing-modifiers",
        t("Placing a Modifier", "放置修饰语"),
        t(
          "Keep a modifier beside the word it describes. *She found a wallet on the sidewalk full of cash* puts the cash on the sidewalk; *She found a wallet full of cash on the sidewalk* says what was meant.\n\nFor an opening phrase, make the doer of its action the subject of the sentence.",
          "让修饰语紧挨它所修饰的词。*She found a wallet on the sidewalk full of cash* 听起来像人行道上满是现金；*She found a wallet full of cash on the sidewalk* 才是本意。\n\n对开头的短语，要让其动作的发出者成为句子的主语。",
        ),
        choiceGenerator(t("Which sentence is clear?", "哪个句子意思清楚？"), misplacedBank, (right) =>
          t(`**${right}** Each modifier sits beside the word it describes.`, `**${right}** 每个修饰语都紧挨它所修饰的词。`),
        ),
      ),
    ],
  },
  {
    id: "active-and-passive-voice",
    title: t("Active and Passive Voice", "主动语态和被动语态"),
    summary: t("Whether the subject acts or is acted on, and when each one fits.", "主语是发出动作还是承受动作，以及何时使用。"),
    prerequisites: ["subject-verb-agreement"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "telling-voice",
        t("Telling Them Apart", "区分两者"),
        t(
          "In the **active voice**, the subject does the action: *The chef cooked the meal.* In the **passive voice**, the subject receives it: *The meal was cooked by the chef.*\n\nA passive verb has a form of *be* with a past participle (*was cooked*, *will be given*), and the doer may not be named at all: *The window was broken.*",
          "在**主动语态**（active voice）中，主语发出动作：*The chef cooked the meal.* 在**被动语态**（passive voice）中，主语承受动作：*The meal was cooked by the chef.*\n\n被动动词由 *be* 的某种形式加过去分词构成（*was cooked*、*will be given*），动作发出者甚至可以不出现：*The window was broken.*",
        ),
        choiceGenerator(t("Is this sentence active or passive?", "这句话是主动还是被动？"), voiceKindBank, (right) =>
          t(
            `**${right}**. Ask whether the subject does the action or receives it.`,
            `答案是 **${right}**。问一问主语是发出动作还是承受动作。`,
          ),
        ),
      ),
      point(
        "making-active",
        t("Changing to Active", "改为主动"),
        t(
          "To make a sentence active, move the doer, named after *by*, to the front as the subject, then use the plain form of the verb in the same tense. *The ball was kicked by Sam* becomes *Sam kicked the ball.*\n\nActive sentences are usually shorter and more direct. The passive is useful when the doer is unknown or does not matter.",
          "改为主动时，把 *by* 后面的动作发出者移到句首作主语，再用同一时态的普通动词形式。*The ball was kicked by Sam* 变成 *Sam kicked the ball.*\n\n主动句通常更短、更直接。动作发出者未知或不重要时，被动语态很有用。",
        ),
        choiceGenerator(t("Which sentence is the active version?", "哪句是主动形式？"), toActiveBank, (right) =>
          t(`**${right}** The doer is now the subject, and the meaning is unchanged.`, `**${right}** 动作发出者现在是主语，意思不变。`),
        ),
      ),
    ],
  },
  {
    id: "parallel-structure",
    title: t("Parallel Structure", "平行结构"),
    summary: t("Items in a list or pair take the same grammatical form.", "并列的各项要用相同的语法形式。"),
    prerequisites: ["coordinating-conjunctions"],
    encompasses: [{ topic: "coordinating-conjunctions", weight: 0.2 }],
    xp: 10,
    knowledgePoints: [
      point(
        "recognizing-parallel",
        t("Recognizing Parallel Structure", "识别平行结构"),
        t(
          "Items joined in a list or pair should have the same form. *I like hiking, swimming and biking* is **parallel**, since all three end in *-ing*. *I like hiking, swimming and to bike* is not. Readers expect the pattern to continue, and a break makes them stumble.",
          "列表或成对的并列项应该形式相同。*I like hiking, swimming and biking* 是**平行**（parallel）的，因为三项都以 *-ing* 结尾。*I like hiking, swimming and to bike* 则不是。读者期待模式延续，一旦打破就会读不顺。",
        ),
        choiceGenerator(t("Which sentence is parallel?", "哪个句子是平行结构？"), parallelFindBank, (right) =>
          t(`**${right}** Every item has the same grammatical form.`, `**${right}** 每一项的语法形式都相同。`),
        ),
      ),
      point(
        "fixing-parallel",
        t("Fixing a Break in the Pattern", "修复被打破的模式"),
        t(
          "To fix a sentence, find the form most of the items share, then rewrite the one that differs to match. In *The room was clean, bright and had space*, the first two items are adjectives, so the last must be one too: *spacious*.",
          "修改句子时，找出多数并列项共有的形式，再改写不同的那一项。在 *The room was clean, bright and had space* 中，前两项是形容词，所以最后一项也要是形容词：*spacious*。",
        ),
        choiceGenerator(
          t("Which words should replace the last item in the list?", "应该用哪些词替换列表中的最后一项？"),
          parallelFixBank,
          (right) =>
            t(
              `**${right}** matches the form of the other items. Items joined in a list or by *and* should all be the same kind of word or phrase.`,
              `**${right}** 与其他项的形式一致。列举的或用 *and* 连接的各项，应该是同一类词或短语。`,
            ),
        ),
      ),
    ],
  },
];
