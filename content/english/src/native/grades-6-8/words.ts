// Grades 6 to 8: the words of each unit's theme, ten to a batch: myths, tone, Rome, argument, ecosystems, character,
// technology and exploration.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, batchTopic, batchWords } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

const myths: BatchSpec = {
  id: "words-from-myths",
  title: t("Words from Myths", "源自神话的词"),
  summary: t(
    "Ten everyday words that began in Greek myths: echo, panic, chaos, mentor, labyrinth and more.",
    "十个源自希腊神话的常用词：echo、panic、chaos、mentor、labyrinth 等。",
  ),
  domain: ["myths and the words they gave us", "神话及其留下的词语"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "echo",
      forms: ["echoes", "echoed", "echoing"],
      meaning: ["a sound that bounces back so that you hear it again", "回声，反射回来的声音"],
      sentences: [
        "When we shouted into the canyon, our voices came back as a faint ___.",
        "The empty gym was so large that every footstep made an ___.",
        "She called her brother's name in the cave and heard only her own ___.",
      ],
      confusions: ["siren", "chaos"],
    },
    {
      word: "panic",
      forms: ["panicked", "panicking", "panics"],
      meaning: ["a sudden fear so strong that people stop thinking clearly", "恐慌，使人无法冷静思考的突然恐惧"],
      sentences: [
        "When the lights went out in the crowded hall, a wave of ___ spread through the audience.",
        "Stay calm and do not ___ if you get lost in the woods.",
        "In his ___, he ran the wrong way and missed the exit.",
      ],
      confusions: ["chaos", "nemesis"],
    },
    {
      word: "titanic",
      meaning: ["enormous in size, strength or importance", "巨大的，力量或规模极大的"],
      sentences: [
        "The two champions met in a ___ battle that lasted five hours.",
        "Lifting the fallen tree off the road took a ___ effort from the whole village.",
        "A ___ wave rose higher than the lighthouse and crashed over the harbor.",
      ],
      confusions: ["herculean", "chaos"],
    },
    {
      word: "odyssey",
      forms: ["odysseys"],
      meaning: ["a long journey full of adventures and changes", "漫长而充满经历的旅程"],
      sentences: [
        "Their trip across three countries by bus turned into a month-long ___.",
        "The book follows one girl's ___ from a small farm to the stage of a great city.",
        "After an ___ of delayed flights and lost bags, we finally reached Grandma's house.",
      ],
      confusions: ["labyrinth", "echo"],
    },
    {
      word: "nemesis",
      meaning: ["an enemy or rival that you cannot seem to beat", "宿敌，似乎永远打不败的对手"],
      sentences: [
        "The detective finally caught his old ___, the thief who had escaped him for years.",
        "For our soccer team, the school across the river has been a ___ for a decade.",
        "Math was Leo's ___ until a new teacher showed him a different way to think about it.",
      ],
      confusions: ["mentor", "siren"],
    },
    {
      word: "chaos",
      meaning: ["complete confusion and disorder", "混乱，完全无序的状态"],
      sentences: [
        "When the goats escaped into the market, the stalls were thrown into ___.",
        "The first day of the sale was pure ___, with people pushing and shouting everywhere.",
        "The ancient Greeks told of a time of ___ before the world had any order or shape.",
      ],
      confusions: ["panic", "labyrinth"],
    },
    {
      word: "labyrinth",
      forms: ["labyrinths"],
      meaning: ["a maze of winding paths that is hard to find your way through", "迷宫，难以找到出路的曲折通道"],
      sentences: [
        "The old city was a ___ of narrow streets, and we got lost within minutes.",
        "In the myth, a monster lived at the center of a ___ that no one could escape.",
        "The hospital's basement was a ___ of hallways that all looked the same.",
      ],
      confusions: ["odyssey", "chaos"],
    },
    {
      word: "herculean",
      meaning: ["needing enormous strength or effort", "需要极大力气或努力的"],
      sentences: [
        "Cleaning the whole school after the flood was a ___ task, but the students finished it in a week.",
        "Carrying the piano up five flights of stairs took a ___ effort.",
        "Reading every book in the library in one summer would be a ___ job.",
      ],
      confusions: ["titanic", "mentor"],
    },
    {
      word: "mentor",
      forms: ["mentors"],
      meaning: ["a wise, trusted person who guides someone younger or less experienced", "导师，指导年轻人或新手的可靠长者"],
      sentences: [
        "The old carpenter became Sam's ___, teaching him to build his first table.",
        "Every new nurse at the hospital is paired with a ___ who has worked there for years.",
        "Looking back, she said her music teacher was the ___ who changed her life.",
      ],
      confusions: ["nemesis", "echo"],
    },
    {
      word: "siren",
      forms: ["sirens"],
      meaning: ["a device that makes a loud, rising warning sound", "警报器，发出尖锐警报声的装置"],
      sentences: [
        "We heard the ___ of an ambulance racing down the street.",
        "When the tornado ___ began to wail, everyone hurried into the basement.",
        "The fire truck turned on its ___ and pushed through the traffic.",
      ],
      confusions: ["echo", "panic"],
    },
  ],
};

const tone: BatchSpec = {
  id: "words-for-tone-and-feeling",
  title: t("Words for Tone and Feeling", "描述语气与情感的词"),
  summary: t(
    "Ten words for the feeling of a poem, a scene or a person: wistful, somber, jubilant, ominous and more.",
    "十个描述诗歌、场景或人物情感的词：wistful、somber、jubilant、ominous 等。",
  ),
  domain: ["the tone and mood of poems and stories", "诗歌和故事的语气与氛围"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "wistful",
      meaning: ["gently sad and longing for something you cannot have", "带着淡淡忧伤地渴望得不到的东西的"],
      sentences: [
        "She gave a ___ look at the bicycles in the shop window, knowing she could not afford one.",
        "Watching the other children leave for summer camp, Ben felt ___ and a little left out.",
        "The poem ends on a ___ note, as the speaker watches a ship he will never sail on.",
      ],
      confusions: ["jubilant", "ominous"],
    },
    {
      word: "somber",
      meaning: ["serious, dark and sad", "严肃而阴沉的，忧郁的"],
      sentences: [
        "The mood at the funeral was quiet and ___.",
        "Dressed in ___ gray suits, the judges filed silently into the courtroom.",
        "The news of the accident put the whole class in a ___ mood.",
      ],
      confusions: ["whimsical", "exuberant"],
    },
    {
      word: "jubilant",
      meaning: ["full of joy because of a success or a victory", "因成功或胜利而欢欣鼓舞的"],
      sentences: [
        "The ___ fans poured onto the field after their team won the championship.",
        "Her ___ shout told us she had passed the exam.",
        "The town was ___ when the lost children were found safe.",
      ],
      confusions: ["bleak", "somber"],
    },
    {
      word: "bleak",
      meaning: ["cold, empty and without hope or comfort", "荒凉的，冷清而没有希望的"],
      sentences: [
        "The ___ moor stretched for miles with no tree or house in sight.",
        "After the factory closed, the future of the little town looked ___.",
        "January brought short, ___ days of gray sky and freezing wind.",
      ],
      confusions: ["serene", "whimsical"],
    },
    {
      word: "serene",
      meaning: ["calm, peaceful and untroubled", "宁静的，平和安详的"],
      sentences: [
        "The lake was ___ at dawn, without a single ripple on its surface.",
        "Even during the storm, the old captain's face stayed ___.",
        "The poem paints a ___ picture of snow falling softly on a sleeping village.",
      ],
      confusions: ["ominous", "exuberant"],
    },
    {
      word: "ominous",
      meaning: ["suggesting that something bad is about to happen", "不祥的，预示坏事将要发生的"],
      sentences: [
        "Dark clouds gathered over the hills, and there was an ___ silence before the storm.",
        "The ___ creak of the stairs told her that someone was coming up.",
        'The letter\'s ___ last line said only, "We need to talk about your future."',
      ],
      confusions: ["serene", "nostalgic"],
    },
    {
      word: "whimsical",
      meaning: ["playful and unusual in a fanciful, amusing way", "异想天开的，俏皮而奇特的"],
      sentences: [
        "The children's book is full of ___ creatures, like a cat that rides a teapot.",
        "Her ___ garden had a gnome on every rock and a bathtub full of flowers.",
        "The poem has a ___ tone, imagining the moon as a lost button from a giant's coat.",
      ],
      confusions: ["somber", "bleak"],
    },
    {
      word: "nostalgic",
      meaning: ["fondly remembering and longing for the past", "怀旧的，深情怀念过去的"],
      sentences: [
        "Looking at old photos of his first home made Grandpa ___.",
        "The smell of fresh bread always makes me ___ for my aunt's kitchen.",
        "The song is ___, looking back on long summer evenings of childhood.",
      ],
      confusions: ["ominous", "jubilant"],
    },
    {
      word: "melancholy",
      meaning: ["a deep, quiet sadness that lasts", "持久而深沉的忧郁"],
      sentences: [
        "A feeling of ___ settled over the house in the weeks after the dog died.",
        "The slow violin music filled the room with ___.",
        "The poet writes of the ___ of autumn, when every leaf seems to say goodbye.",
      ],
      confusions: ["exuberant", "whimsical"],
    },
    {
      word: "exuberant",
      meaning: ["full of energy, excitement and cheerfulness", "精力充沛的，兴高采烈的"],
      sentences: [
        "The ___ puppy leaped and spun in circles when the children came home.",
        "The dancers gave an ___ performance that brought the audience to its feet.",
        "After a week of rain, the ___ kids raced outside to splash in the sunshine.",
      ],
      confusions: ["melancholy", "somber"],
    },
  ],
};

const rome: BatchSpec = {
  id: "words-of-ancient-rome",
  title: t("Words of Ancient Rome", "古罗马的词汇"),
  summary: t(
    "Ten words for the government, army and city of ancient Rome: republic, senate, consul, aqueduct and more.",
    "十个关于古罗马政府、军队和城市的词：republic、senate、consul、aqueduct 等。",
  ),
  domain: ["ancient Rome", "古罗马"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "republic",
      forms: ["republics"],
      meaning: ["a state ruled by leaders that citizens choose, with no king", "共和国，由公民选出领导人、没有国王的国家"],
      sentences: [
        "After driving out their last king, the Romans set up a ___ ruled by elected leaders.",
        "In a ___, the people choose who will govern them for a fixed time.",
        "Many modern countries, including France and India, are a ___ rather than a kingdom.",
      ],
      confusions: ["empire", "forum"],
    },
    {
      word: "senate",
      forms: ["senates", "senator", "senators"],
      meaning: ["a council of leaders who debate and help make a state's laws", "元老院，参议院，讨论并参与制定法律的议事机构"],
      sentences: [
        "In Rome, the ___ was a council of powerful men who advised the consuls and debated the laws.",
        "The new law was argued over in the ___ for three days before the vote.",
        "Members of the Roman ___ wore togas with a broad purple stripe.",
      ],
      confusions: ["legion", "forum"],
    },
    {
      word: "empire",
      forms: ["empires"],
      meaning: ["a group of lands and peoples ruled by one powerful ruler or state", "帝国，由一个强大统治者或国家统治的众多地区"],
      sentences: [
        "At its largest, the Roman ___ stretched from Britain to Egypt.",
        "An ___ rules over many peoples who once governed themselves.",
        "When Augustus took power, the republic became an ___ ruled by one man.",
      ],
      confusions: ["republic", "legion"],
    },
    {
      word: "aqueduct",
      forms: ["aqueducts"],
      meaning: ["a channel or bridge built to carry water over a long distance", "引水渠，把水输送到远处的渠道或桥"],
      sentences: [
        "The Romans built an ___ to carry fresh water from the mountains into the city.",
        "You can still see the tall stone arches of an old ___ in southern France.",
        "Each ___ sloped gently downhill so that the water would keep flowing.",
      ],
      confusions: ["forum", "legion"],
    },
    {
      word: "gladiator",
      forms: ["gladiators"],
      meaning: ["a man trained to fight other fighters or animals in an arena for a crowd", "角斗士，在竞技场为观众搏斗的人"],
      sentences: [
        "The crowd roared as the ___ stepped into the arena with his sword and shield.",
        "Many a ___ was a slave or a prisoner forced to fight for the crowd's entertainment.",
        "The ___ trained for months at a special school before his first fight.",
      ],
      confusions: ["consul", "citizen"],
    },
    {
      word: "legion",
      forms: ["legions"],
      meaning: ["a large unit of the Roman army, of about five thousand soldiers", "军团，约五千人的罗马军队单位"],
      sentences: [
        "A Roman ___ of five thousand soldiers marched north to guard the border.",
        "Each ___ carried a bronze eagle on a pole as its proud symbol.",
        "The soldiers of the ___ built roads and forts wherever they camped.",
      ],
      confusions: ["senate", "empire"],
    },
    {
      word: "forum",
      forms: ["forums"],
      meaning: [
        "the public square at the center of a Roman town, for markets, meetings and courts",
        "广场，罗马城镇中心用于集市、集会和审判的公共场所",
      ],
      sentences: [
        "Merchants, lawyers and shoppers crowded the ___ at the heart of the city.",
        "Speakers stood on platforms in the ___ and argued with the crowds.",
        "The temples and law courts of the ___ were the busiest buildings in Rome.",
      ],
      confusions: ["aqueduct", "senate"],
    },
    {
      word: "citizen",
      forms: ["citizens", "citizenship"],
      meaning: ["a member of a state with rights such as voting and protection by its laws", "公民，享有投票等权利并受法律保护的成员"],
      sentences: [
        "Only a Roman ___ could vote in elections or serve in a legion.",
        "As a ___, he had the right to a trial before he could be punished.",
        "Every ___ of a country has rights as well as duties.",
      ],
      confusions: ["gladiator", "emperor"],
    },
    {
      word: "consul",
      forms: ["consuls"],
      meaning: ["one of the two leaders elected each year to run the Roman Republic", "执政官，罗马共和国每年选出的两位最高长官之一"],
      sentences: [
        "Each year, Romans elected two leaders, and each ___ could stop the other's decisions.",
        "The ___ led the army into battle during his single year in power.",
        "A man had to be at least forty-two years old to be elected ___.",
      ],
      confusions: ["emperor", "gladiator"],
    },
    {
      word: "emperor",
      forms: ["emperors"],
      meaning: ["the single ruler of an empire, holding power for life", "皇帝，终身掌权的帝国统治者"],
      sentences: [
        "Augustus became the first Roman ___, ruling alone for over forty years.",
        "Unlike the consuls, the ___ was not elected and ruled until he died.",
        "Coins across the empire showed the face of the ___.",
      ],
      confusions: ["consul", "citizen"],
    },
  ],
};

const argument: BatchSpec = {
  id: "words-of-argument",
  title: t("Words of Argument", "论证的词汇"),
  summary: t(
    "Ten words for making and judging an argument: assert, justify, valid, bias, concede, refute and more.",
    "十个用于提出和评判论证的词：assert、justify、valid、bias、concede、refute 等。",
  ),
  domain: ["arguments and debates", "论证与辩论"],
  prerequisites: ["context-clues", "fact-and-opinion"],
  encompasses: fromClues,
  words: [
    {
      word: "assert",
      forms: ["asserts", "asserted", "asserting"],
      meaning: ["to state something firmly as true", "断言，坚定地声称某事为真"],
      sentences: [
        "The author goes on to ___ that every school should teach cooking.",
        "Many scientists ___ that the climate is warming faster than ever.",
        "It is easy to ___ something; it is harder to prove it.",
      ],
      confusions: ["concede", "refute"],
    },
    {
      word: "justify",
      forms: ["justifies", "justified", "justifying"],
      meaning: ["to give good reasons that show something is right", "证明……有理，给出充分理由说明某事正确"],
      sentences: [
        "Can you ___ spending the whole budget on one trip?",
        "The mayor tried to ___ the new tax by pointing to the broken roads.",
        "A good argument uses evidence to ___ its claim.",
      ],
      confusions: ["persuade", "assert"],
    },
    {
      word: "valid",
      meaning: ["based on sound reasoning or fact, and so acceptable", "有效的，合理的，有事实或合理推理依据的"],
      sentences: [
        "You make a ___ point: the bus does arrive too late for breakfast.",
        "Her complaint was ___, so the store gave her money back.",
        '"Everyone does it" is not a ___ reason for breaking a rule.',
      ],
      confusions: ["relevant", "credible"],
    },
    {
      word: "bias",
      forms: ["biases", "biased"],
      meaning: ["an unfair leaning for or against something that affects judgment", "偏见，影响判断的不公正倾向"],
      sentences: [
        "The study was paid for by a candy company, so readers should watch for ___.",
        "A good referee shows no ___ toward either team.",
        "His ___ against city life made him ignore every good thing about it.",
      ],
      confusions: ["perspective", "credible"],
    },
    {
      word: "perspective",
      forms: ["perspectives"],
      meaning: ["a particular way of seeing or thinking about something", "视角，看待或思考事物的特定方式"],
      sentences: [
        "From a farmer's ___, the rain was a blessing, not a problem.",
        "The article tells the story from the ___ of a nurse who was there.",
        "Talking with my grandparents gave me a new ___ on how much the town has changed.",
      ],
      confusions: ["bias", "relevant"],
    },
    {
      word: "concede",
      forms: ["concedes", "conceded", "conceding"],
      meaning: ["to admit, often unwillingly, that something is true", "（常勉强地）承认，让步"],
      sentences: [
        "I ___ that uniforms cost money, but they save families more in the long run.",
        "After the recount, the losing candidate had to ___ the election.",
        "A strong writer will ___ a fair point made by the other side.",
      ],
      confusions: ["refute", "assert"],
    },
    {
      word: "refute",
      forms: ["refutes", "refuted", "refuting"],
      meaning: ["to prove that a statement or argument is wrong", "驳斥，证明某说法或论点是错误的"],
      sentences: [
        "She used the city's own records to ___ the claim that the park was unsafe.",
        "No one could ___ his evidence, so the committee accepted his plan.",
        "To ___ an argument, you must show where its reasoning or facts go wrong.",
      ],
      confusions: ["concede", "justify"],
    },
    {
      word: "persuade",
      forms: ["persuades", "persuaded", "persuading", "persuasive"],
      meaning: ["to cause someone to believe or do something by giving reasons", "说服，用理由使人相信或去做某事"],
      sentences: [
        "Maya tried to ___ her parents to let her join the robotics club.",
        "The ad uses a famous athlete to ___ people to buy the shoes.",
        "Facts alone may not ___ a reader who already disagrees.",
      ],
      confusions: ["concede", "refute"],
    },
    {
      word: "credible",
      meaning: ["able to be believed; trustworthy", "可信的，值得信赖的"],
      sentences: [
        "A doctor is a more ___ source on health than an online stranger.",
        "The witness gave a clear and ___ account of the accident.",
        "To be ___, a website should name its authors and its sources.",
      ],
      confusions: ["valid", "bias"],
    },
    {
      word: "relevant",
      forms: ["relevance"],
      meaning: ["closely connected to the subject being discussed", "相关的，与所讨论的话题紧密相关的"],
      sentences: [
        "The size of the gym is not ___ to an argument about school lunches.",
        "Only include evidence that is ___ to your claim.",
        "The lawyer asked whether the witness's old job was ___ to the case.",
      ],
      confusions: ["credible", "bias"],
    },
  ],
};

const ecosystems: BatchSpec = {
  id: "words-of-ecosystems",
  title: t("Words of Ecosystems", "生态系统的词汇"),
  summary: t(
    "Ten words for how living things depend on one another: producer, consumer, decomposer, symbiosis and more.",
    "十个关于生物相互依存的词：producer、consumer、decomposer、symbiosis 等。",
  ),
  domain: ["ecosystems and the ocean", "生态系统与海洋"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "ecosystem",
      forms: ["ecosystems"],
      meaning: ["all the living things in an area together with their surroundings", "生态系统，一个区域内的全部生物及其环境"],
      sentences: [
        "A pond is a small ___ where frogs, insects, plants and water all depend on one another.",
        "When wolves returned to the park, the whole ___ began to change.",
        "Pollution from the factory harmed every part of the river's ___.",
      ],
      confusions: ["organism", "biodiversity"],
    },
    {
      word: "organism",
      forms: ["organisms"],
      meaning: ["a single living thing, such as a plant, an animal or a bacterium", "生物体，单个的生物，如植物、动物或细菌"],
      sentences: [
        "Under the microscope, we saw a tiny ___ swimming in the drop of water.",
        "Every ___ needs energy to grow and stay alive.",
        "The blue whale is the largest ___ that has ever lived.",
      ],
      confusions: ["ecosystem", "consumer"],
    },
    {
      word: "producer",
      forms: ["producers"],
      meaning: ["a living thing that makes its own food, usually from sunlight", "生产者，能自己制造食物（通常利用阳光）的生物"],
      sentences: [
        "Grass is a ___ because it makes its own food from sunlight.",
        "In the ocean, tiny floating plants are the most important ___ of food.",
        "Every food chain begins with a ___, such as a tree or a plant.",
      ],
      confusions: ["consumer", "decomposer"],
    },
    {
      word: "consumer",
      forms: ["consumers"],
      meaning: ["a living thing that gets energy by eating other living things", "消费者，靠吃其他生物获取能量的生物"],
      sentences: [
        "A rabbit is a ___ because it must eat plants to get energy.",
        "The shark is a top ___ that eats fish, seals and squid.",
        "An animal cannot make its own food, so every animal is a ___.",
      ],
      confusions: ["producer", "decomposer"],
    },
    {
      word: "decomposer",
      forms: ["decomposers"],
      meaning: ["a living thing that breaks down dead plants and animals", "分解者，分解死去动植物的生物"],
      sentences: [
        "A mushroom is a ___ that breaks down fallen logs into soil.",
        "Without a single ___, dead leaves would pile up on the forest floor forever.",
        "The worm is a busy ___, turning dead plants into rich earth.",
      ],
      confusions: ["producer", "consumer"],
    },
    {
      word: "biodiversity",
      meaning: ["the variety of different kinds of living things in a place", "生物多样性，一个地方生物种类的丰富程度"],
      sentences: [
        "The rain forest has amazing ___, with thousands of kinds of plants and animals.",
        "Clearing the forest for one crop greatly reduced the area's ___.",
        "Scientists protect ___ because every species plays a part in its ecosystem.",
      ],
      confusions: ["symbiosis", "ecosystem"],
    },
    {
      word: "symbiosis",
      meaning: [
        "a close relationship between two different kinds of living things, often helping both",
        "共生，两种不同生物之间往往互利的紧密关系",
      ],
      sentences: [
        "The clownfish and the sea anemone live in ___: each protects the other.",
        "Bees and flowers are a classic example of ___, since each helps the other survive.",
        "In this ___, a tiny fish cleans the shark's teeth and gets a free meal.",
      ],
      confusions: ["biodiversity", "plankton"],
    },
    {
      word: "plankton",
      meaning: ["tiny plants and animals that drift in the water of seas and lakes", "浮游生物，在海洋和湖泊中漂流的微小动植物"],
      sentences: [
        "The huge whale feeds on ___, swallowing millions of tiny drifting creatures at once.",
        "Most ___ is too small to see without a microscope.",
        "Fish larvae and tiny plants that drift with the currents are called ___.",
      ],
      confusions: ["coral", "organism"],
    },
    {
      word: "coral",
      forms: ["corals"],
      meaning: [
        "tiny sea animals that build hard, rocky reefs in warm water, or the reefs they build",
        "珊瑚，在温暖海水中建造礁石的微小海洋动物，或其形成的礁石",
      ],
      sentences: [
        "The reef is built by ___, tiny animals that grow hard skeletons together.",
        "Warm water can turn ___ white and kill the reef.",
        "Divers must never touch the ___, because it breaks easily and grows back slowly.",
      ],
      confusions: ["plankton", "decomposer"],
    },
    {
      word: "endangered",
      meaning: ["at risk of disappearing completely from the earth", "濒危的，面临彻底灭绝危险的"],
      sentences: [
        "Only a few hundred of these ___ turtles are left in the wild.",
        "The tiger is ___ because hunters and farms have taken so much of its forest.",
        "Laws protect ___ animals from being hunted or sold.",
      ],
      confusions: ["biodiversity", "producer"],
    },
  ],
};

const character: BatchSpec = {
  id: "words-for-character-and-motive",
  title: t("Words for Character and Motive", "描述性格与动机的词"),
  summary: t(
    "Ten words for what drives a character: resentful, envious, resilient, impulsive, remorseful and more.",
    "十个描述人物内在动因的词：resentful、envious、resilient、impulsive、remorseful 等。",
  ),
  domain: ["characters and what drives them", "人物及其动机"],
  prerequisites: ["context-clues", "characters"],
  encompasses: fromClues,
  words: [
    {
      word: "resentful",
      meaning: ["feeling bitter and angry about being treated unfairly", "愤愤不平的，因受到不公对待而怨恨的"],
      sentences: [
        "Mara was ___ that her brother got the bigger room just because he was older.",
        "The workers grew ___ when the boss took credit for their idea.",
        "He stayed ___ for weeks about being left off the team.",
      ],
      confusions: ["remorseful", "earnest"],
    },
    {
      word: "envious",
      meaning: ["wanting something that someone else has", "嫉妒的，羡慕别人所拥有的"],
      sentences: [
        "Jake was ___ of his friend's new phone and kept asking to hold it.",
        "The other gardeners were ___ of her prize-winning roses.",
        "It is hard not to feel ___ when your best friend gets the part you wanted.",
      ],
      confusions: ["sympathetic", "aloof"],
    },
    {
      word: "resilient",
      meaning: ["able to recover quickly after something hard or painful", "有韧性的，能从困难或痛苦中迅速恢复的"],
      sentences: [
        "After losing her home in the fire, the ___ girl was back at school in a week, smiling.",
        "Children can be surprisingly ___, bouncing back from setbacks that would flatten adults.",
        "The team was ___: three losses in a row only made them train harder.",
      ],
      confusions: ["impulsive", "defiant"],
    },
    {
      word: "impulsive",
      meaning: ["acting suddenly without thinking first", "冲动的，不加思考就突然行动的"],
      sentences: [
        "In an ___ moment, Leo spent all his savings on a guitar he never learned to play.",
        "Her ___ decision to jump into the river nearly cost her life.",
        "Being ___, he said the first thing that came into his head and hurt her feelings.",
      ],
      confusions: ["conscientious", "aloof"],
    },
    {
      word: "conscientious",
      meaning: ["careful to do one's work and duty well", "认真尽责的，细心做好工作和本分的"],
      sentences: [
        "A ___ student, Priya checked every answer twice before handing in her test.",
        "The ___ night guard walked every hallway each hour without fail.",
        "Because he was so ___, the teacher trusted him to feed the class pets all summer.",
      ],
      confusions: ["impulsive", "defiant"],
    },
    {
      word: "defiant",
      meaning: ["openly refusing to obey or give in", "公然反抗的，拒不服从或屈服的"],
      sentences: [
        "With her arms crossed, the ___ girl refused to leave until the manager listened.",
        "The ___ prisoner would not answer a single question.",
        "Told to sit down, he stayed standing, ___ to the end.",
      ],
      confusions: ["sympathetic", "conscientious"],
    },
    {
      word: "sympathetic",
      meaning: ["showing that you understand and care about someone's trouble", "同情的，表示理解并关心他人困难的"],
      sentences: [
        "The ___ nurse held the frightened boy's hand during the shot.",
        "When I told her about my lost dog, she gave me a ___ hug.",
        "The judge was ___ to the family and gave them more time to pay.",
      ],
      confusions: ["envious", "aloof"],
    },
    {
      word: "aloof",
      meaning: ["cool and distant, not friendly or involved", "冷淡的，疏远而不合群的"],
      sentences: [
        "The new boy seemed ___, sitting alone and never joining the games.",
        "The famous actor stayed ___ from the crowd, refusing to sign autographs.",
        "Though she seemed ___ at first, Ana turned out to be shy rather than unfriendly.",
      ],
      confusions: ["sympathetic", "earnest"],
    },
    {
      word: "earnest",
      meaning: ["serious and sincere in what one says or does", "认真的，真诚而严肃的"],
      sentences: [
        "In an ___ voice, Tom promised he would never lie to her again.",
        "She was so ___ about saving the park that the council agreed to listen.",
        "The ___ young reporter checked every fact before writing a word.",
      ],
      confusions: ["impulsive", "aloof"],
    },
    {
      word: "remorseful",
      meaning: ["feeling deeply sorry for something wrong one has done", "懊悔的，为自己做错的事深感内疚的"],
      sentences: [
        "The ___ boy returned the stolen bike and apologized to its owner.",
        "She felt ___ about the cruel words she had shouted at her sister.",
        "Looking ___, the driver admitted that he had been texting at the wheel.",
      ],
      confusions: ["resentful", "envious"],
    },
  ],
};

const technology: BatchSpec = {
  id: "words-of-technology",
  title: t("Words of Technology", "技术的词汇"),
  summary: t(
    "Ten words for how machines are invented and how they work: prototype, patent, circuit, mechanism and more.",
    "十个关于机器的发明及其工作原理的词：prototype、patent、circuit、mechanism 等。",
  ),
  domain: ["inventions and machines", "发明与机器"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "invention",
      forms: ["inventions"],
      meaning: ["a new device or process that someone has created", "发明，某人创造的新装置或新方法"],
      sentences: [
        "The printing press was an ___ that changed how ideas spread.",
        "Her ___, a shoe that charges a phone as you walk, won first prize at the fair.",
        "The wheel may be the most important ___ in human history.",
      ],
      confusions: ["innovation", "patent"],
    },
    {
      word: "engine",
      forms: ["engines"],
      meaning: ["a machine that turns fuel into motion or power", "发动机，引擎，把燃料转化为动力的机器"],
      sentences: [
        "The steam ___ burned coal to boil water and turn the train's wheels.",
        "The car's ___ roared to life when she turned the key.",
        "An airplane ___ pushes huge amounts of air backward to move the plane forward.",
      ],
      confusions: ["circuit", "mechanism"],
    },
    {
      word: "circuit",
      forms: ["circuits"],
      meaning: ["a complete path around which electricity flows", "电路，电流流动的完整回路"],
      sentences: [
        "The bulb will light only when the wires form a closed ___.",
        "A loose wire broke the ___, and the radio went silent.",
        "Inside every phone is a tiny ___ printed on a green board.",
      ],
      confusions: ["engine", "prototype"],
    },
    {
      word: "patent",
      forms: ["patents", "patented"],
      meaning: [
        "an official right to be the only one to make and sell an invention for a time",
        "专利，在一定时期内独家制造和销售某项发明的官方权利",
      ],
      sentences: [
        "The inventor applied for a ___ so that no one could copy her design.",
        "Thomas Edison held a ___ on the phonograph, so no one else could sell one without his permission.",
        "Once the ___ ran out, other companies were free to make the same medicine.",
      ],
      confusions: ["prototype", "invention"],
    },
    {
      word: "prototype",
      forms: ["prototypes"],
      meaning: ["the first working model of a new machine, built to test it", "原型，为测试而制造的新机器的第一个工作模型"],
      sentences: [
        "The first ___ of the drone crashed after ten seconds, so the team went back to work.",
        "Engineers built a cardboard ___ before making the real chair from steel.",
        "Testing a ___ shows the inventors which parts need to be improved.",
      ],
      confusions: ["patent", "circuit"],
    },
    {
      word: "efficient",
      forms: ["efficiency"],
      meaning: ["working well without wasting time, energy or materials", "高效的，不浪费时间、能源或材料的"],
      sentences: [
        "LED bulbs are more ___ than old bulbs because they turn more electricity into light.",
        "The new assembly line was so ___ that a car was finished every ninety minutes.",
        "An ___ engine travels farther on the same amount of fuel.",
      ],
      confusions: ["automate", "transmit"],
    },
    {
      word: "mechanism",
      forms: ["mechanisms"],
      meaning: ["a set of moving parts that work together to do a job", "机械装置，协同工作的一组活动部件"],
      sentences: [
        "The clock's ___ of tiny gears and springs keeps it ticking for years.",
        "A simple ___ inside the lock lets the key turn only one way.",
        "When the ___ jammed, the music box stopped playing.",
      ],
      confusions: ["engine", "innovation"],
    },
    {
      word: "automate",
      forms: ["automates", "automated", "automating", "automation"],
      meaning: ["to make a process run by machine instead of by people", "使自动化，让机器代替人来完成某个过程"],
      sentences: [
        "The factory plans to ___ the packing, so machines will box every order.",
        "Many banks ___ simple tasks, such as sorting checks, to save time.",
        "Robots now ___ jobs that once took dozens of workers.",
      ],
      confusions: ["transmit", "patent"],
    },
    {
      word: "innovation",
      forms: ["innovations"],
      meaning: ["a new idea or way of doing something that improves on the old one", "创新，改进旧事物的新想法或新方法"],
      sentences: [
        "The assembly line was an ___ that made cars cheap enough for ordinary families.",
        "The company rewards workers for any ___ that saves time or money.",
        "Touch screens were a great ___ in how people use phones.",
      ],
      confusions: ["mechanism", "prototype"],
    },
    {
      word: "transmit",
      forms: ["transmits", "transmitted", "transmitting", "transmission"],
      meaning: ["to send a signal or a message from one place to another", "传送，把信号或信息从一处发送到另一处"],
      sentences: [
        "Radio towers ___ signals that travel through the air to millions of homes.",
        "The telegraph could ___ a message across the country in minutes.",
        "Satellites ___ pictures of storms back to the weather station.",
      ],
      confusions: ["automate", "efficient"],
    },
  ],
};

const exploration: BatchSpec = {
  id: "words-of-exploration",
  title: t("Words of Exploration", "探险的词汇"),
  summary: t(
    "Ten words for journeys into the unknown: expedition, navigate, latitude, longitude, uncharted and more.",
    "十个关于未知之旅的词：expedition、navigate、latitude、longitude、uncharted 等。",
  ),
  domain: ["explorers and their voyages", "探险家及其航行"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "expedition",
      forms: ["expeditions"],
      meaning: ["a journey made by a group of people for a special purpose, such as exploring", "远征，探险，一群人为特定目的进行的旅程"],
      sentences: [
        "The ___ to the South Pole took months of planning and a team of twelve.",
        "Scientists joined an ___ into the rain forest to search for new plants.",
        "The ___ set out with sleds, dogs and enough food for a year.",
      ],
      confusions: ["voyage", "colony"],
    },
    {
      word: "voyage",
      forms: ["voyages"],
      meaning: ["a long journey by sea or through space", "航行，海上或太空中的长途旅行"],
      sentences: [
        "The ship's ___ across the Atlantic took six stormy weeks.",
        "During the long ___, the sailors ran short of fresh water.",
        "The spacecraft's ___ to Mars lasted seven months.",
      ],
      confusions: ["frontier", "compass"],
    },
    {
      word: "navigate",
      forms: ["navigates", "navigated", "navigating", "navigator", "navigators"],
      meaning: ["to find the way and steer a course from one place to another", "导航，确定方向并驾驶前往某处"],
      sentences: [
        "Long ago, sailors learned to ___ by watching the stars.",
        "Without a map, it was hard to ___ through the thick forest.",
        "Pilots use instruments to ___ through clouds when they cannot see the ground.",
      ],
      confusions: ["colony", "voyage"],
    },
    {
      word: "compass",
      forms: ["compasses"],
      meaning: ["a tool with a magnetic needle that always points north", "指南针，指针总是指向北方的工具"],
      sentences: [
        "The hiker checked her ___ and turned north toward the river.",
        "Chinese sailors were among the first to use a magnetic ___ at sea.",
        "The needle of the ___ spun wildly near the iron rocks.",
      ],
      confusions: ["latitude", "frontier"],
    },
    {
      word: "latitude",
      meaning: ["the distance north or south of the equator, measured in degrees", "纬度，赤道以北或以南的距离，以度计量"],
      sentences: [
        "Sailors could find their ___ by measuring how high the sun stood at noon.",
        "Places at a high ___, far from the equator, have long, cold winters.",
        "Lines of ___ run east and west around the globe, parallel to the equator.",
      ],
      confusions: ["longitude", "compass"],
    },
    {
      word: "longitude",
      meaning: [
        "the distance east or west of a fixed line on the earth, measured in degrees",
        "经度，地球上某一固定线以东或以西的距离，以度计量",
      ],
      sentences: [
        "Until accurate clocks were made, sailors had no reliable way to measure their ___ east or west.",
        "Lines of ___ run from the North Pole to the South Pole.",
        "To know its ___, a ship had to know the exact time back home.",
      ],
      confusions: ["latitude", "frontier"],
    },
    {
      word: "colony",
      forms: ["colonies", "colonist", "colonists"],
      meaning: ["a settlement in a new land that is ruled by a faraway country", "殖民地，受远方国家统治的新定居点"],
      sentences: [
        "The settlers founded a ___ on the coast, but it was still ruled from across the ocean.",
        "The ___ had to send much of its cotton and sugar back to the mother country.",
        "In 1776, each ___ in America declared that it was free from British rule.",
      ],
      confusions: ["expedition", "frontier"],
    },
    {
      word: "frontier",
      forms: ["frontiers"],
      meaning: ["the edge of settled or known land, beyond which lies the unknown", "边疆，已开发或已知土地的边缘"],
      sentences: [
        "Families moved west to the ___, where there were no towns or roads yet.",
        "For scientists, the deep sea is the last great ___ on Earth.",
        "Life on the ___ was lonely and hard, far from doctors and stores.",
      ],
      confusions: ["colony", "latitude"],
    },
    {
      word: "uncharted",
      meaning: ["not yet mapped or explored", "未经勘测的，未知的"],
      sentences: [
        "The explorers sailed into ___ waters that no map had ever shown.",
        "Much of the ocean floor is still ___, even today.",
        "They hiked deep into ___ forest, marking trees as they went so they could find their way back.",
      ],
      confusions: ["perilous", "compass"],
    },
    {
      word: "perilous",
      meaning: ["full of danger", "危险重重的"],
      sentences: [
        "The ___ climb up the icy cliff took all of their courage.",
        "Crossing the desert without water would be a ___ journey.",
        "The rope bridge swayed over the canyon, old and ___.",
      ],
      confusions: ["uncharted", "voyage"],
    },
  ],
};

const batches: readonly BatchSpec[] = [myths, tone, rome, argument, ecosystems, character, technology, exploration];

/** wordTopics68 are the vocabulary topics of grades 6 to 8. */
export const wordTopics68: readonly TopicDef[] = batches.map(batchTopic);

/** vocabulary68 are the words the batches of grades 6 to 8 teach. */
export const vocabulary68: readonly WordBatch[] = batches.map(batchWords);
