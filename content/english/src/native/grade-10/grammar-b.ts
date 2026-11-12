// Grade 10: grammar for emphasis: the active and the passive chosen for emphasis, subordination that puts the main idea
// in the main clause, and the sixth set of commonly confused words.

import type { TopicDef } from "@ga/content";
import { everyPair } from "../../levels/words.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

// Crossed items: frames, people and phrases multiply the lines below into a hundred items or more for each bank.

const join = (lines: readonly string[]) => lines.join("\n");
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const stolenThings = ["car", "bicycle", "mailbox", "garden gate", "shop window", "boat"] as const;
const nightDeeds = ["damaged", "moved", "painted", "taken"] as const;
const hiddenFaults = ["Mistakes were made in", "Errors were made in", "Rules were broken in", "Corners were cut in"] as const;
const hiddenAreas = [
  "the counting of the votes",
  "the handling of the budget",
  "the report to the board",
  "the hiring process",
  "the safety checks",
  "the company's accounts",
] as const;
const doerFacts = [
  "Marie Curie discovered radium in 1898.",
  "Nelson Mandela led South Africa after apartheid.",
  "Gandhi led the Salt March in 1930.",
  "Neil Armstrong walked on the moon in 1969.",
  "Amelia Earhart flew alone across the Atlantic.",
  "Galileo observed the moons of Jupiter.",
  "Ada Lovelace wrote the first published program.",
  "Louis Pasteur developed a rabies vaccine.",
  "Frida Kahlo painted dozens of self-portraits.",
  "Jesse Owens won four gold medals in Berlin.",
  "Tu Youyou discovered artemisinin.",
  "Wangari Maathai founded the Green Belt Movement.",
  "Alexander Fleming discovered penicillin in 1928.",
  "Harriet Tubman led many people to freedom.",
] as const;
const receiverFacts = [
  "The Great Wall was built over many centuries.",
  "The Taj Mahal was completed around 1653.",
  "Machu Picchu was abandoned in the sixteenth century.",
  "The Mona Lisa was painted in the early 1500s.",
  "The Terracotta Army was discovered in 1974.",
  "The Statue of Liberty was dedicated in 1886.",
  "The Parthenon was finished in 438 BC.",
  "The Dead Sea Scrolls were found in caves near Qumran.",
  "Stonehenge was raised about 4,500 years ago.",
  "The Colosseum was opened in AD 80.",
  "The Panama Canal was opened in 1914.",
  "The Magna Carta was sealed in 1215.",
  "The Titanic was launched in 1911.",
  "The Forbidden City was completed in 1420.",
] as const;
const voiceLines = join([
  ...everyPair(stolenThings, nightDeeds).map(
    ([thing, deed]) => `Our ${thing} was ${deed} during the night, and no one saw who did it.|the doer is unknown`,
  ),
  ...everyPair(hiddenFaults, hiddenAreas).map(([fault, area]) => `${fault} ${area}.|to hide the doer`),
  ...doerFacts.map((fact) => `${fact}|to stress the doer`),
  ...receiverFacts.map((fact) => `${fact}|to stress the receiver`),
]);

/** deeds are a doer, its pronoun and object form, whether it is plural, the verb in past and participle forms, the thing and the rest. */
const deeds = [
  ["Marie Curie", "She", "her", false, "discovered", "discovered", "radium", "in 1898"],
  ["Howard Carter", "He", "him", false, "found", "found", "Tutankhamun's tomb", "in 1922"],
  ["French soldiers", "They", "them", true, "found", "found", "the Rosetta Stone", "in 1799"],
  ["Eiffel's engineers", "They", "them", true, "built", "built", "the Eiffel Tower", "for the fair of 1889"],
  ["Leonardo da Vinci", "He", "him", false, "painted", "painted", "the Mona Lisa", "in the early 1500s"],
  ["Farmers digging a well", "They", "them", true, "found", "found", "the Terracotta Army", "in 1974"],
  ["Alexander Fleming", "He", "him", false, "discovered", "discovered", "penicillin", "in 1928"],
  ["Shah Jahan", "He", "him", false, "built", "built", "the Taj Mahal", "for his wife"],
  ["Bedouin shepherds", "They", "them", true, "found", "found", "the first of the Dead Sea Scrolls", "in 1947"],
  ["Tim Berners-Lee", "He", "him", false, "invented", "invented", "the World Wide Web", "in 1989"],
  ["Frida Kahlo", "She", "her", false, "painted", "painted", "The Two Fridas", "in 1939"],
  ["The Wright brothers", "They", "them", true, "flew", "flown", "the first powered airplane", "in 1903"],
  ["Johannes Gutenberg", "He", "him", false, "built", "built", "a printing press with movable type", "around 1440"],
  ["Hiram Bingham", "He", "him", false, "made known", "made known", "Machu Picchu", "to the wider world in 1911"],
] as const;
const lower = (s: string) => (s.startsWith("The ") && !s.startsWith("The Two") ? `the ${s.slice(4)}` : s);
const focusLines = join(
  deeds.flatMap(([doer, pron, obj, plural, past, pp, thing, rest]) => {
    const one = plural ? "were the ones" : "was the one";
    const aboutThing = (frame: string) =>
      `${frame} ___|It was ${pp} by ${lower(doer)} ${rest}.|${doer} ${past} it ${rest}.|${upper(rest)}, ${lower(doer)} ${one} who ${past} it.`;
    const aboutDoer = (frame: string) =>
      `${frame} ___|${pron} ${past} ${thing} ${rest}.|${upper(thing)} was ${pp} by ${obj} ${rest}.|${upper(rest)}, ${thing} was ${pp} by ${lower(doer)}.`;
    return [
      aboutThing(`Consider ${thing}.`),
      aboutThing(`${upper(thing)} is famous today.`),
      aboutThing(`Our story turns to ${thing}.`),
      aboutDoer(`Consider ${lower(doer)}.`),
      aboutDoer(`${doer} ${plural ? "deserve" : "deserves"} the credit.`),
      aboutDoer(`Our story turns to ${lower(doer)}.`),
    ];
  }),
);

const strugglers = [
  ["Ana", "she"],
  ["Ravi", "he"],
  ["Mei", "she"],
  ["Tom", "he"],
  ["Lena", "she"],
  ["Omar", "he"],
] as const;
const obstacles = ["was tired", "had little time", "felt nervous", "had a cold"] as const;
const triumphs = ["won the race", "finished the essay", "passed the exam", "gave a fine speech"] as const;
const mainLines = join(
  everyPair(strugglers, obstacles).flatMap(([[who, pron], obstacle]) =>
    triumphs.map(
      (triumph) =>
        `[Stress that ${who} ${triumph}, not that ${pron} ${obstacle}.]|Although ${who} ${obstacle}, ${pron} ${triumph}.|Although ${who} ${triumph}, ${pron} ${obstacle}.|${who} ${obstacle}, and ${pron} ${triumph}.`,
    ),
  ),
);

const sounds = [
  "the wind howled",
  "the rain fell",
  "the thunder rolled",
  "the dogs barked",
  "the shutters banged",
  "the lights flickered",
  "the river rose",
] as const;
const siblings = [
  ["Mia", "violin", "her brother", "cello"],
  ["Sam", "drums", "his sister", "flute"],
  ["Lucia", "piano", "her cousin", "trumpet"],
  ["Ken", "guitar", "his father", "banjo"],
] as const;
const blockers = [
  "the road was icy",
  "the storm knocked out the power",
  "the bridge was closed",
  "snow blocked the pass",
  "the river flooded",
  "the wind was too strong",
] as const;
const results = [
  "the buses did not run",
  "school was cancelled",
  "we stayed home",
  "the trip was postponed",
  "the market closed early",
] as const;
const morning = [
  "the alarm rang",
  "it was raining",
  "I was late",
  "I missed the bus",
  "I walked",
  "my shoes got wet",
  "the gate was locked",
  "I climbed over",
] as const;
const coordLines = join([
  ...sounds.flatMap((a, i) => sounds.slice(i + 1).map((b) => `${upper(a)}, and ${b}.|coordination of equal ideas`)),
  ...siblings.flatMap(([a, x, b, y]) => [
    `${a} plays the ${x}; ${b} plays the ${y}.|coordination of equal ideas`,
    `${a} plays the ${x}, and ${b} plays the ${y}.|coordination of equal ideas`,
    `${a} sings, and ${b} plays the ${y}.|coordination of equal ideas`,
  ]),
  ...everyPair(blockers, results).map(([why, what]) => `Because ${why}, ${what}.|subordination of background`),
  ...morning.flatMap((_, k) => {
    const pick = (n: number) => morning[(k + n) % morning.length] ?? "";
    return [
      `I woke up and ${pick(0)} and ${pick(1)} and ${pick(2)} and ${pick(3)}.|excessive coordination`,
      `We got up and ${pick(0)} and ${pick(2)} and ${pick(4)} and ${pick(5)}.|excessive coordination`,
      `And then ${pick(1)} and ${pick(3)} and ${pick(5)} and then ${pick(6)}.|excessive coordination`,
    ];
  }),
]);

const fitLines6 = `The neighbor's dog kept up a ___ barking all afternoon, stopping only to drink.|continual|continuous|contentious
Her ___ complaints about the noise wore everyone out.|continual|continuous|contentious
There were ___ interruptions during the meeting.|continual|continuous|contiguous
The ___ ringing of the phone made it hard to work.|continual|continuous|contentious
The desert has a ___ stretch of sand for two hundred miles.|continuous|continual|contiguous
A ___ line of cars stretched to the horizon.|continuous|continual|contentious
The patient needs ___ care around the clock.|continuous|continual|contiguous
The machine hummed in one ___ tone.|continuous|continual|contentious
The vet ___ a cream for the dog's ear.|prescribed|proscribed|described
Doctors often ___ rest for a sprained ankle.|prescribe|proscribe|describe
The law ___ the steps a judge must follow.|prescribes|proscribes|describes
My doctor ___ glasses for reading.|prescribed|proscribed|described
The church ___ the book as dangerous.|proscribed|prescribed|subscribed
The treaty ___ the use of poison gas.|proscribes|prescribes|subscribes
Gambling was ___ in the old city.|proscribed|prescribed|subscribed
The rules ___ any talking during the exam.|proscribe|prescribe|subscribe
The poem ___ the beauty of the mountains.|exalts|exults|exempts
The people ___ their hero as a saint.|exalted|exulted|exempted
The king ___ his loyal general to a duke.|exalted|exulted|exempted
Old songs ___ the bravery of the sailors.|exalt|exult|exempt
The crowd ___ in the team's victory.|exulted|exalted|insulted
She ___ at the news of her sister's recovery.|exulted|exalted|insulted
We ___ when the long war finally ended.|exulted|exalted|insulted
The farmers ___ as the rain finally came.|exulted|exalted|insulted
The ship ___ in the storm and sank.|foundered|floundered|plundered
The company ___ after its biggest client left.|foundered|floundered|plundered
The peace talks ___ on the question of borders.|foundered|floundered|plundered
The old boat ___ off the rocky coast.|foundered|floundered|plundered
The nervous speaker ___ through his notes.|floundered|foundered|plundered
The calf ___ in the deep mud.|floundered|foundered|plundered
When asked about the money, the mayor ___.|floundered|foundered|plundered
New students often ___ in their first week.|flounder|founder|plunder
The squirrel buried its ___ of nuts under the oak.|hoard|horde|herd
The dragon slept on a ___ of gold.|hoard|horde|herd
Thieves found a secret ___ of coins under the floor.|hoard|horde|herd
Some people ___ food before a storm.|hoard|horde|herd
A ___ of fans rushed the stage.|horde|hoard|herd
A ___ of tourists filled the square.|horde|hoard|herd
The castle fell to a ___ of invaders.|horde|hoard|herd
A ___ of shoppers waited for the doors to open.|horde|hoard|herd
His bad temper ___ against his promotion.|militated|mitigated|imitated
Poor weather ___ against a quick rescue.|militated|mitigated|imitated
The lack of money ___ against the plan.|militated|mitigated|imitated
Several facts ___ against the theory.|militate|mitigate|imitate
Trees help ___ the heat of the city.|mitigate|militate|litigate
The judge ___ the sentence because the boy was young.|mitigated|militated|litigated
A sea wall can ___ the damage of a flood.|mitigate|militate|litigate
Her apology did little to ___ the harm.|mitigate|militate|litigate
The gang ___ a series of bank robberies.|perpetrated|perpetuated|penetrated
Police caught the man who ___ the fraud.|perpetrated|perpetuated|penetrated
Who ___ this terrible crime?|perpetrated|perpetuated|penetrated
The hackers ___ an attack on the city's computers.|perpetrated|perpetuated|penetrated
Old films often ___ unfair stereotypes.|perpetuate|perpetrate|punctuate
The statue will ___ the memory of the heroes.|perpetuate|perpetrate|punctuate
The custom has been ___ for centuries.|perpetuated|perpetrated|punctuated
Silence only ___ the injustice.|perpetuates|perpetrates|punctuates
She felt ___ about the harsh words she had said.|regretful|regrettable|resentful
The ___ old man wished he had travelled more.|regretful|regrettable|resentful
He gave a ___ smile and said goodbye.|regretful|regrettable|resentful
The losing coach sounded ___ after the match.|regretful|regrettable|resentful
The loss of the old library is deeply ___.|regrettable|regretful|respectable
It is ___ that the trains were late again.|regrettable|regretful|respectable
The mix-up was a ___ mistake.|regrettable|regretful|respectable
The ___ decision cost the town its park.|regrettable|regretful|respectable
The hurricane ___ havoc on the islands.|wreaked|wrecked|reeked
The angry ruler ___ revenge on his enemies.|wreaked|wrecked|reeked
Floods ___ destruction along the coast.|wreaked|wrecked|reeked
The virus can ___ damage on old computers.|wreak|wreck|reek
The storm ___ three fishing boats.|wrecked|wreaked|wrenched
A falling tree ___ our car.|wrecked|wreaked|wrenched
The scandal ___ his career.|wrecked|wreaked|wrenched
Careless spending could ___ the budget.|wreck|wreak|wrench
The club holds a ___ meeting, in March and September.|biannual|biennial|annual
We get a ___ newsletter, once each spring and once each fall.|biannual|biennial|annual
The dentist sends a ___ reminder, every six months.|biannual|biennial|annual
Our ___ checkup comes in January and July.|biannual|biennial|annual
The art fair is ___, held every other year.|biennial|biannual|centennial
The ___ festival returns in two years' time.|biennial|biannual|centennial
The ___ conference meets in odd-numbered years.|biennial|biannual|centennial
Some plants are ___ and flower only in their second year.|biennial|biannual|centennial`;

const meaningLines6 = `repeated often over a long time|continual|continuous|contentious
coming back again and again with pauses|continual|continuous|contiguous
frequent and annoying|continual|continuous|contentious
recurring at short intervals|continual|continuous|contiguous
unbroken from start to end|continuous|continual|contiguous
without any gap in space or time|continuous|continual|contentious
running on without stopping|continuous|continual|contiguous
in one uninterrupted line|continuous|continual|contentious
to set down as a rule to be followed|prescribe|proscribe|describe
to tell a patient to take a medicine|prescribe|proscribe|describe
to lay down what must be done|prescribe|proscribe|subscribe
to recommend as a cure|prescribe|proscribe|describe
to ban officially|proscribe|prescribe|subscribe
to condemn as harmful and forbid|proscribe|prescribe|describe
to outlaw|proscribe|prescribe|subscribe
to prohibit by a rule|proscribe|prescribe|describe
to praise very highly|exalt|exult|exempt
to raise to a higher rank|exalt|exult|exempt
to glorify|exalt|exult|exempt
to lift up in honor|exalt|exult|exempt
to feel great triumph|exult|exalt|insult
to celebrate with great joy|exult|exalt|insult
to be openly delighted|exult|exalt|insult
to rejoice greatly|exult|exalt|insult
to fill with water and sink|founder|flounder|plunder
to collapse or fail completely|founder|flounder|plunder
to break down and come to nothing|founder|flounder|plunder
to go to the bottom, as a ship does|founder|flounder|plunder
to move clumsily and with difficulty|flounder|founder|plunder
to be confused and make mistakes|flounder|founder|plunder
to struggle without making progress|flounder|founder|plunder
to thrash about helplessly|flounder|founder|plunder
a supply kept hidden for later|hoard|horde|herd
a secret store of money or treasure|hoard|horde|herd
to collect and keep things greedily|hoard|horde|herd
a stockpile hidden away|hoard|horde|herd
a large, disorderly crowd|horde|hoard|herd
a swarm of people|horde|hoard|herd
a wandering tribe or army|horde|hoard|herd
a great mass of moving people|horde|hoard|herd
to have a strong effect against something|militate|mitigate|imitate
to be a powerful reason against|militate|mitigate|imitate
to weigh heavily against a result|militate|mitigate|imitate
to work to prevent something|militate|mitigate|imitate
to make less harsh|mitigate|militate|litigate
to reduce the seriousness of|mitigate|militate|litigate
to soften the effect of|mitigate|militate|litigate
to ease pain or harm|mitigate|militate|litigate
to carry out something wicked|perpetrate|perpetuate|penetrate
to be guilty of a crime|perpetrate|perpetuate|penetrate
to commit a harmful act|perpetrate|perpetuate|penetrate
to do something evil or illegal|perpetrate|perpetuate|penetrate
to keep something going|perpetuate|perpetrate|punctuate
to make something continue indefinitely|perpetuate|perpetrate|punctuate
to preserve from being forgotten|perpetuate|perpetrate|punctuate
to cause a belief to last|perpetuate|perpetrate|punctuate
feeling sorry for something you did|regretful|regrettable|resentful
full of sorrow over a loss|regretful|regrettable|resentful
showing that you wish things were different|regretful|regrettable|resentful
sad about a missed chance|regretful|regrettable|resentful
unfortunate and to be lamented|regrettable|regretful|respectable
deserving to be regretted|regrettable|regretful|respectable
bad enough that people are sorry it happened|regrettable|regretful|respectable
unwelcome and unfortunate|regrettable|regretful|respectable
to bring about harm|wreak|wreck|reek
to inflict punishment or revenge|wreak|wreck|reek
to unleash damage|wreak|wreck|reek
to let out anger on someone|wreak|wreck|reek
to ruin completely|wreck|wreak|wrench
to smash a ship or vehicle|wreck|wreak|wrench
to spoil a plan or hope|wreck|wreak|wrench
to break beyond repair|wreck|wreak|wrench
occurring two times a year|biannual|biennial|annual
happening every six months|biannual|biennial|annual
twice yearly|biannual|biennial|annual
in two parts of each year|biannual|biennial|annual
occurring once in two years|biennial|biannual|centennial
every other year|biennial|biannual|centennial
lasting for two years|biennial|biannual|centennial
taking two years to complete its life|biennial|biannual|centennial`;

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const voice = topic("grammar", {
  id: "active-and-passive-for-emphasis",
  title: ["The Active and the Passive for Emphasis", "用主动与被动来强调"],
  summary: [
    "Choosing the voice by what matters most: the active when the doer matters, the passive when the action or the receiver matters, or when the doer is unknown.",
    "根据最重要的内容选择语态：施动者重要时用主动语态，动作或承受者重要、或施动者未知时用被动语态。",
  ],
  after: ["shifts-in-voice"],
  points: [
    label(
      "why-this-voice",
      ["Why This Voice", "为什么用这个语态"],
      [
        "The active voice is usually clearer, but the passive has honest uses. Use the **active to stress the doer** when who acted is the point: *Marie Curie discovered radium.* Use the **passive to stress the receiver** when what was acted on is the topic: *The Mona Lisa was stolen in 1911.* Use the **passive when the doer is unknown or unimportant**: *My bike was stolen last night.* Watch for a passive that **hides the doer** on purpose, as in *Mistakes were made*: it avoids saying who is responsible.",
        "主动语态通常更清楚，但被动语态也有正当的用途。当谁做的才是重点时，**用主动语态强调施动者**：*Marie Curie discovered radium.* 当被作用的对象才是话题时，**用被动语态强调承受者**：*The Mona Lisa was stolen in 1911.* 当**施动者未知或不重要**时用被动语态：*My bike was stolen last night.* 还要留意故意**隐藏施动者**的被动句，比如 *Mistakes were made*：它回避了说明谁该负责。",
      ],
      ["Why did the writer choose this voice?", "作者为什么选择这个语态？"],
      `
${voiceLines}
        Rosa Parks refused to give up her seat.|to stress the doer
        The pyramids were built more than four thousand years ago.|to stress the receiver
        Our car was broken into during the night.|the doer is unknown
        Errors were made in the counting of the votes.|to hide the doer
        Alexander Fleming discovered penicillin by accident.|to stress the doer
        The Great Wall was named a World Heritage Site in 1987.|to stress the receiver
        The window was smashed sometime before dawn.|the doer is unknown
        Funds were moved from the school budget without approval.|to hide the doer
        Our goalkeeper saved three penalties in the final.|to stress the doer
        The Declaration of Independence was signed in 1776.|to stress the receiver
        Ancient coins were found buried under the old church.|the doer is unknown
        It was decided that the workers would not be paid this month.|to hide the doer
        Nelson Mandela led South Africa out of apartheid.|to stress the doer
        The new vaccine has been given to millions of children.|to stress the receiver
        The old manuscript was written by an unknown monk.|the doer is unknown
        Promises were broken, and the public was misled.|to hide the doer
        A sixteen-year-old student invented the device.|to stress the doer
        The Titanic was sunk by an iceberg on its first voyage.|to stress the receiver
        This rumor was started years ago, and no one knows where.|the doer is unknown
        The report was quietly changed before it was published.|to hide the doer
        The mayor herself cut the ribbon at the opening.|to stress the doer
        Shakespeare's plays have been translated into every major language.|to stress the receiver
        The painting was left on the steps of the museum by someone.|the doer is unknown
        Certain facts were not shared with the committee.|to hide the doer
        Our own students designed and built the new garden.|to stress the doer
        The ancient city of Pompeii was buried by ash in a single day.|to stress the receiver
        The cave paintings were made over thirty thousand years ago.|the doer is unknown
        Regrettably, the wrong patients were sent home.|to hide the doer
        The young pilot landed the damaged plane safely.|to stress the doer
        The Mona Lisa is visited by millions of people every year.|to stress the receiver
      `,
      {
        "to stress the doer": L(
          "强调施动者",
          "The sentence is active and puts the doer first, because who acted is the point.",
          "这个句子是主动语态，把施动者放在前面，因为谁做的才是重点。",
          "The sentence does not put a doer first to stress who acted.",
          "这个句子并没有把施动者放在前面来强调是谁做的。",
        ),
        "to stress the receiver": L(
          "强调承受者",
          "The sentence is passive because its topic is the thing acted on; the doer, if named, matters less.",
          "这个句子用被动语态，因为话题是被作用的对象；即使提到施动者，它也没那么重要。",
          "The thing acted on is not what the sentence is mainly about.",
          "被作用的对象并不是这个句子主要讲的内容。",
        ),
        "the doer is unknown": L(
          "施动者未知",
          "The sentence is passive because no one knows who did it.",
          "这个句子用被动语态，因为没人知道是谁做的。",
          "The doer is known or named, or the sentence is active.",
          "施动者是已知的或被点明了，或者这个句子是主动语态。",
        ),
        "to hide the doer": L(
          "隐藏施动者",
          "The passive lets the writer avoid saying who was responsible for something wrong; a reader should ask who did it.",
          "被动语态让作者回避说明谁该为错事负责；读者应当追问是谁做的。",
          "Nothing wrong is being covered up by leaving out who did it.",
          "这里并没有通过省略施动者来掩盖什么错误。",
        ),
      },
    ),
    choose(
      "the-voice-that-keeps-the-focus",
      ["The Voice That Keeps the Focus", "保持焦点的语态"],
      [
        "In a paragraph, readers follow the topic most easily when it stays at the front of each sentence. If the paragraph is about a thing, the passive can keep that thing in the subject position: *The bridge opened in 1937. **It was designed by Joseph Strauss.*** If the paragraph is about a person, keep the person as the subject with the active: *Strauss loved poetry. **He wrote verses about the bridge.***",
        "在一个段落中，话题保持在每句的开头时，读者最容易跟上。如果段落讲的是某个物，被动语态可以让这个物留在主语位置：*The bridge opened in 1937. **It was designed by Joseph Strauss.*** 如果段落讲的是某个人，就用主动语态让这个人做主语：*Strauss loved poetry. **He wrote verses about the bridge.***",
      ],
      ["Which second sentence keeps the focus of the first?", "哪个第二句保持了第一句的焦点？"],
      `
${focusLines}
        The Eiffel Tower is the symbol of Paris. ___|It was built for the World's Fair of 1889.|Engineers built it for the World's Fair of 1889.|The World's Fair of 1889 was the reason someone built it.
        Gustave Eiffel was a bold engineer. ___|He built the tower for the World's Fair of 1889.|The tower was built by him for the World's Fair of 1889.|For the World's Fair of 1889, the tower was built by Eiffel.
        The Rosetta Stone is a key to Egyptian writing. ___|It was found by French soldiers in 1799.|French soldiers found it in 1799.|In 1799, French soldiers were the ones who found it.
        Our class worked hard this spring. ___|We planted a garden behind the school.|A garden was planted behind the school by us.|Behind the school, a garden was planted by our class.
        The new library is the pride of the town. ___|It was paid for by the families of the town.|The families of the town paid for it.|The town's families were the ones who paid for it.
        Marie Curie never gave up. ___|She won a second Nobel Prize in 1911.|A second Nobel Prize was won by her in 1911.|In 1911, a second Nobel Prize was won by Curie.
        The vaccine is now used around the world. ___|It was developed in less than a year.|Scientists developed it in less than a year.|Less than a year was all it took scientists to develop it.
        The firefighters arrived within minutes. ___|They rescued everyone in the building.|Everyone in the building was rescued by them.|By them, everyone in the building was rescued.
        The old bridge has stood for two centuries. ___|It was repaired after the great flood.|Workers repaired it after the great flood.|After the great flood, workers were sent to repair it.
        My grandmother loved the sea. ___|She swam in it every morning until she was ninety.|The sea was swum in by her every morning until she was ninety.|Every morning until she was ninety, the sea was where she swam.
        The Mona Lisa hangs in the Louvre. ___|It was painted by Leonardo da Vinci.|Leonardo da Vinci painted it.|Leonardo was the painter who made it.
        The detective studied the room. ___|She noticed a scratch on the window.|A scratch on the window was noticed by her.|On the window, a scratch was noticed by the detective.
        The ancient manuscript is very fragile. ___|It is kept in a dark, cool room.|The museum keeps it in a dark, cool room.|A dark, cool room is where the museum keeps it.
        The young poet felt restless. ___|She left her village and moved to the city.|Her village was left by her for the city.|The city was where she moved after the village was left.
        The rare bird is in danger. ___|It is hunted for its bright feathers.|Hunters hunt it for its bright feathers.|Its bright feathers are why hunters hunt it.
        The students prepared for the debate. ___|They read every article they could find.|Every article they could find was read by them.|By them, every article that could be found was read.
        The treaty ended the war. ___|It was signed in a railway car in a forest.|Leaders signed it in a railway car in a forest.|A railway car in a forest is where leaders signed it.
        The chef tasted the soup. ___|He added a pinch of salt.|A pinch of salt was added by him.|To the soup, a pinch of salt was added by the chef.
        The statue stands in the main square. ___|It was carved from a single block of marble.|A sculptor carved it from a single block of marble.|A single block of marble was what a sculptor carved it from.
        The explorers crossed the desert. ___|They found water at an old well.|Water was found at an old well by them.|At an old well, water was found by the explorers.
        The constitution is the highest law. ___|It was written by delegates in 1787.|Delegates wrote it in 1787.|In 1787, delegates were the ones who wrote it.
        The scientist doubted the results. ___|She repeated the experiment three times.|The experiment was repeated three times by her.|Three times, the experiment was repeated by the scientist.
        The painting was damaged in the fire. ___|It was restored over the next ten years.|Experts restored it over the next ten years.|Over the next ten years, experts were the ones restoring it.
        The coach believed in the team. ___|He gave every player a chance to start.|Every player was given a chance to start by him.|A chance to start was given to every player by the coach.
        The new law is controversial. ___|It was passed by a single vote.|Lawmakers passed it by a single vote.|By a single vote, lawmakers were able to pass it.
        The girl found a lost puppy. ___|She took it home and fed it.|It was taken home and fed by her.|Home was where it was taken and fed by the girl.
        The temple was hidden for centuries. ___|It was discovered by a farmer in 1911.|A farmer discovered it in 1911.|In 1911, a farmer was the one who discovered it.
        The writer struggled with the ending. ___|He rewrote it seven times.|It was rewritten seven times by him.|Seven times, the ending was rewritten by the writer.
        The castle overlooks the valley. ___|It was built to guard the river crossing.|A duke built it to guard the river crossing.|Guarding the river crossing was why a duke built it.
        The volunteers cleaned the beach. ___|They collected two tons of plastic.|Two tons of plastic were collected by them.|By the volunteers, two tons of plastic were collected.
      `,
      (right) => [
        `"${right}" keeps the topic of the first sentence as its subject, so the paragraph stays focused.`,
        `“${right}” 让第一句的话题继续做主语，段落因此保持焦点。`,
      ],
      [
        [
          'In "{wrong}" the subject changes to something new, so the reader loses the thread of the first sentence.',
          "在“{wrong}”中，主语换成了新的内容，读者因此跟丢了第一句的线索。",
        ],
        [
          '"{wrong}" twists the sentence so the topic is buried in the middle or the end, which is awkward and weakens the focus.',
          "“{wrong}”把句子拧得很别扭，话题被埋在句中或句末，削弱了焦点。",
        ],
      ],
    ),
  ],
});

const subordination = topic("grammar", {
  id: "subordination-for-emphasis",
  title: ["Subordination for Emphasis", "用主从结构来强调"],
  summary: [
    "Putting the main idea in the main clause and the lesser idea in a dependent clause, so that the sentence stresses what the writer means to stress.",
    "把主要的意思放进主句、次要的意思放进从句，使句子强调作者想强调的内容。",
  ],
  after: ["choosing-the-subordinating-conjunction", "noun-adjective-and-adverb-clauses"],
  points: [
    choose(
      "the-main-idea-in-the-main-clause",
      ["The Main Idea in the Main Clause", "主要意思放在主句"],
      [
        "When two ideas share a sentence, readers take the **main clause** as the point and the **dependent clause** as background. Compare *Although the team lost, it played its best game* (the point is the fine play) with *Although the team played its best game, it lost* (the point is the loss). Decide what you want to stress, and put that idea in the main clause.\n\nPutting the main idea in a dependent clause is called **upside-down subordination**: *I was crossing the street when a car hit me* buries the most important event.",
        "两个意思同在一句时，读者会把**主句**当作重点，把**从句**当作背景。比较 *Although the team lost, it played its best game*（重点是表现出色）和 *Although the team played its best game, it lost*（重点是输了）。先决定要强调什么，再把它放进主句。\n\n把主要意思放进从句叫作**主次颠倒**：*I was crossing the street when a car hit me* 把最重要的事件埋没了。",
      ],
      ["Which sentence stresses the idea given in brackets?", "哪个句子强调了括号中给出的意思？"],
      `
${mainLines}
        [Stress that the bridge collapsed.]|While the cars were crossing, the bridge collapsed.|While the bridge collapsed, the cars were crossing.|The cars were crossing, and the bridge collapsed too.
        [Stress that she won the scholarship.]|Although she had little money, she won the scholarship.|Although she won the scholarship, she had little money.|She had little money, and she won the scholarship.
        [Stress that the rain ruined the harvest.]|Just as the farmers began to pick the grapes, the rain ruined the harvest.|Just as the rain ruined the harvest, the farmers began to pick the grapes.|The farmers began picking the grapes, and the rain ruined the harvest.
        [Stress that he finally told the truth.]|After years of silence, he finally told the truth.|Although he finally told the truth, he had been silent for years.|He had been silent for years, and he told the truth.
        [Stress that the plan was expensive.]|Although the plan would save time, it was very expensive.|Although the plan was very expensive, it would save time.|The plan would save time, but also it was very expensive.
        [Stress that the patient survived.]|Though the surgery lasted ten hours, the patient survived.|Though the patient survived, the surgery lasted ten hours.|The surgery lasted ten hours, and the patient survived it.
        [Stress that the town was saved.]|Because the dam held, the town was saved.|Because the town was saved, the dam held.|The dam held, and the town also was saved.
        [Stress that she missed the train.]|As she reached the platform, she saw that she had missed the train.|As she missed the train, she reached the platform.|She reached the platform, and also she missed the train.
        [Stress that the novel became a classic.]|Although critics first ignored it, the novel became a classic.|Although the novel became a classic, critics first ignored it.|Critics first ignored the novel, and it became a classic.
        [Stress that the fire spread to the forest.]|When the wind changed, the fire spread to the forest.|When the fire spread to the forest, the wind changed.|The wind changed, and the fire spread to the forest.
        [Stress that the team kept its coach.]|Even though it lost every game, the team kept its coach.|Even though the team kept its coach, it lost every game.|The team lost every game and kept its coach.
        [Stress that the ship sank.]|Within sight of the harbor, the ship sank.|While the ship sank, the harbor was in sight.|The harbor was in sight, and the ship sank.
        [Stress that the experiment failed.]|Although the team prepared for months, the experiment failed.|Although the experiment failed, the team prepared for months.|The team prepared for months, and the experiment failed.
        [Stress that the boy found his dog.]|After searching all night, the boy found his dog.|After the boy found his dog, he had searched all night.|The boy searched all night, and he found his dog.
        [Stress that the village has clean water.]|Since the new well was dug, the village has had clean water.|Since the village has had clean water, the new well was dug.|The new well was dug, and the village has clean water.
        [Stress that the speech moved the crowd.]|Although it lasted only two minutes, the speech moved the crowd.|Although the speech moved the crowd, it lasted only two minutes.|The speech lasted two minutes, and it moved the crowd.
        [Stress that the company closed.]|After losing money for five years, the company closed.|When the company closed, it had lost money for five years.|The company lost money for five years, and it closed.
        [Stress that the climbers reached the top.]|Though the storm grew worse, the climbers reached the top.|Though the climbers reached the top, the storm grew worse.|The storm grew worse, and the climbers reached the top.
        [Stress that she forgave him.]|Although he had lied to her, she forgave him.|Although she forgave him, he had lied to her.|He had lied to her, and she forgave him.
        [Stress that the law was passed.]|Despite fierce protests that lasted weeks, the law was passed.|While the law was passed, there were fierce protests.|There were fierce protests, and the law was passed.
        [Stress that the earthquake destroyed the school.]|While the children were at lunch, the earthquake destroyed the school.|While the earthquake destroyed the school, the children were at lunch.|The children were at lunch, and the earthquake destroyed the school.
        [Stress that the singer lost her voice.]|Just before the concert began, the singer lost her voice.|Just before the singer lost her voice, the concert began.|The concert was about to begin, and the singer lost her voice.
        [Stress that the river flooded the farms.]|When the snow melted, the river flooded the farms.|When the river flooded the farms, the snow melted.|The snow melted, and the river flooded the farms.
        [Stress that the medicine worked.]|Although the doctors had doubts, the medicine worked.|Although the medicine worked, the doctors had doubts.|The doctors had doubts, and the medicine worked.
        [Stress that he passed the exam.]|Even though he was ill that morning, he passed the exam.|Even though he passed the exam, he was ill that morning.|He was ill that morning, and he passed the exam.
        [Stress that the painting was a fake.]|After experts studied it for a year, they found that the painting was a fake.|After the painting was found to be a fake, experts studied it for a year.|Experts studied the painting for a year, and it was a fake.
        [Stress that the volcano erupted.]|As the villagers slept, the volcano erupted.|As the volcano erupted, the villagers slept.|The villagers slept, and the volcano erupted.
        [Stress that the hikers were rescued.]|After three days without food, the hikers were rescued.|After the hikers were rescued, they had gone three days without food.|The hikers went three days without food, and they were rescued.
        [Stress that the treaty kept the peace.]|Although many leaders opposed it, the treaty kept the peace.|Although the treaty kept the peace, many leaders opposed it.|Many leaders opposed the treaty, and it kept the peace.
        [Stress that the girl won the race.]|Though she fell at the start, the girl won the race.|Though the girl won the race, she fell at the start.|The girl fell at the start, and she won the race.
      `,
      (right) => [
        `"${right}" puts the idea to be stressed in the main clause and the background in the dependent clause.`,
        `“${right}” 把要强调的意思放进主句，把背景放进从句。`,
      ],
      [
        [
          '"{wrong}" turns the subordination upside down: the idea to be stressed sits in the dependent clause, and the background becomes the main point.',
          "“{wrong}”主次颠倒：要强调的意思被放进从句，背景反而成了重点。",
        ],
        [
          '"{wrong}" joins the two ideas with *and* as if they were equal, so nothing is stressed and the relationship between them is lost.',
          "“{wrong}”用 *and* 把两个意思平等地连在一起，没有任何强调，两者之间的关系也丢失了。",
        ],
      ],
    ),
    label(
      "coordinate-or-subordinate",
      ["Equal or Unequal", "并列还是主从"],
      [
        "Use **coordination** (*and*, *but*, *or*, *so*, or a semicolon) when two ideas are equally important: *The sun set, and the stars came out.* Use **subordination** (*because*, *although*, *when*, *which*) when one idea is background to the other: *When the sun set, we lit the fire.* A string of *and* clauses, called **excessive coordination**, makes every idea equal and leaves the reader to work out how they relate: *We got up and it was cold and we lit a fire and we ate breakfast.*",
        "当两个意思同样重要时，用**并列**（*and*、*but*、*or*、*so* 或分号）：*The sun set, and the stars came out.* 当一个意思是另一个的背景时，用**主从**（*because*、*although*、*when*、*which*）：*When the sun set, we lit the fire.* 一连串的 *and* 分句叫作**过度并列**，它让每个意思都同等重要，读者只能自己去推测它们之间的关系：*We got up and it was cold and we lit a fire and we ate breakfast.*",
      ],
      ["How does this sentence join its ideas?", "这个句子如何连接其中的意思？"],
      `
${coordLines}
        The wind howled, and the shutters banged.|coordination of equal ideas
        Because the road was icy, the buses did not run.|subordination of background
        I woke up and it was raining and I was late and I missed the bus and I walked.|excessive coordination
        She plays the violin; her brother plays the cello.|coordination of equal ideas
        Although the critics hated the film, audiences loved it.|subordination of background
        We went to the beach and it was hot and we swam and we ate and we went home.|excessive coordination
        You can take the train, or you can drive.|coordination of equal ideas
        When the bell rang, the students rushed out.|subordination of background
        He opened the box and there was a letter and he read it and he started to cry.|excessive coordination
        The north wall is stone, but the south wall is wood.|coordination of equal ideas
        The museum, which opened in 1890, holds ten thousand paintings.|subordination of background
        The team trained hard and they played well and they won and everyone cheered.|excessive coordination
        Some guests danced; others talked in the garden.|coordination of equal ideas
        Since the power was out, we read by candlelight.|subordination of background
        The storm came and the lights went out and the dog barked and the baby woke up.|excessive coordination
        The river is wide, so the bridge is long.|coordination of equal ideas
        After the guests left, we cleaned the kitchen.|subordination of background
        I studied and I was tired and the test was hard and I did not finish it.|excessive coordination
        The day was short, and the night was long.|coordination of equal ideas
        If the medicine works, the patient will go home on Friday.|subordination of background
        We arrived and the hotel was full and we had no money and we slept in the car.|excessive coordination
        My father cooks; my mother washes the dishes.|coordination of equal ideas
        Unless it stops raining, the game will be canceled.|subordination of background
        She found the key and she opened the door and the room was empty and she called the police.|excessive coordination
        The first speaker was calm, but the second was angry.|coordination of equal ideas
        The scientist, who had worked alone for years, finally published her results.|subordination of background
        The ship left the harbor and the sea was rough and many people were sick and the trip took ten hours.|excessive coordination
        Lions hunt at night, and they rest during the day.|coordination of equal ideas
        While the city slept, the snow covered every street.|subordination of background
        The movie started and it was boring and people left and we left too.|excessive coordination
      `,
      {
        "coordination of equal ideas": L(
          "并列同等的意思",
          "The sentence joins two ideas of equal weight with *and*, *but*, *or*, *so* or a semicolon.",
          "这个句子用 *and*、*but*、*or*、*so* 或分号连接两个分量相同的意思。",
          "The sentence does not join just two equal ideas with a coordinating word or a semicolon.",
          "这个句子并不是用并列词或分号连接两个同等的意思。",
        ),
        "subordination of background": L(
          "从属的背景",
          "One idea is placed in a dependent clause, with a word such as *because*, *although*, *when* or *which*, as background to the main idea.",
          "一个意思用 *because*、*although*、*when* 或 *which* 这样的词放进从句，作为主要意思的背景。",
          "No idea is placed in a dependent clause as background.",
          "没有哪个意思被放进从句作为背景。",
        ),
        "excessive coordination": L(
          "过度并列",
          "The sentence strings many clauses together with *and*, so every idea seems equal and their relationship is unclear.",
          "这个句子用 *and* 串起了许多分句，每个意思显得同样重要，相互关系也不清楚。",
          "The sentence does not string many clauses together with *and*.",
          "这个句子并没有用 *and* 串起许多分句。",
        ),
      },
    ),
  ],
});

const confused6 = topic("grammar", {
  id: "commonly-confused-words-6",
  title: ["Commonly Confused Words 6", "易混淆词 6"],
  summary: [
    "Pairs such as continual and continuous, hoard and horde, or perpetrate and perpetuate look or sound alike but mean different things.",
    "continual 和 continuous、hoard 和 horde、perpetrate 和 perpetuate 这样的词形或读音相近，意思却不同。",
  ],
  after: ["commonly-confused-words-5"],
  points: [
    choose(
      "the-word-that-fits",
      ["The Word That Fits", "合适的词"],
      [
        "Ten more pairs that careful writers keep apart. **Continual** means happening again and again; **continuous** means without a break. To **prescribe** is to order or recommend; to **proscribe** is to forbid. To **exalt** is to raise up or praise; to **exult** is to rejoice. To **founder** is to sink or fail completely; to **flounder** is to struggle clumsily. A **hoard** is a hidden store; a **horde** is a large crowd. To **militate** against something is to work against it; to **mitigate** is to make less severe. To **perpetrate** is to commit a crime; to **perpetuate** is to make something last. **Regretful** describes a person who feels regret; **regrettable** describes something that deserves regret. To **wreak** is to cause damage; to **wreck** is to destroy. **Biannual** means twice a year; **biennial** means every two years.",
        "又有十对需要认真区分的词。**continual** 意为反复发生的，**continuous** 意为连续不断的。**prescribe** 是规定或开药方，**proscribe** 是禁止。**exalt** 是提升、赞扬，**exult** 是欢欣鼓舞。**founder** 是沉没或彻底失败，**flounder** 是笨拙地挣扎。**hoard** 是秘藏的存货，**horde** 是一大群人。**militate** against 是起反作用、妨碍，**mitigate** 是减轻。**perpetrate** 是犯（罪），**perpetuate** 是使延续。**regretful** 形容感到后悔的人，**regrettable** 形容令人遗憾的事。**wreak** 是造成（破坏），**wreck** 是毁坏。**biannual** 意为一年两次的，**biennial** 意为两年一次的。",
      ],
      ["Which word fits the sentence?", "哪个词适合这个句子？"],
      `
${fitLines6}
        The baby's ___ crying kept us awake every few minutes.|continual|continuous|contentious
        The river makes a ___ roar that never stops.|continuous|continual|continued
        The factory has a ___ supply of power, day and night.|continuous|continual|contiguous
        The doctor ___ rest and plenty of water.|prescribed|proscribed|described
        The new law ___ smoking in all public buildings.|proscribes|prescribes|describes
        Ancient custom ___ eating pork in some cultures.|proscribed|prescribed|subscribed
        The crowd ___ when their team scored in the last minute.|exulted|exalted|exhaled
        The poem ___ the hero as a god among men.|exalts|exults|exacts
        The ship ___ on the rocks and sank in minutes.|foundered|floundered|founded
        The nervous speaker ___ for words and lost his place.|floundered|foundered|flounced
        The project ___ when the money ran out and never recovered.|foundered|floundered|founded
        The squirrel keeps a ___ of nuts under the tree.|hoard|horde|hard
        A ___ of tourists poured off the cruise ship.|horde|hoard|herd
        The dragon guarded a ___ of gold.|hoard|horde|herd
        His lack of experience ___ against his promotion.|militated|mitigated|meditated
        Planting trees can help ___ the effects of the heat.|mitigate|militate|migrate
        The judge said the boy's age ___ the seriousness of the crime.|mitigated|militated|litigated
        The gang ___ a series of robberies in the city.|perpetrated|perpetuated|penetrated
        Old stories can ___ harmful stereotypes for centuries.|perpetuate|perpetrate|permeate
        Who ___ this fraud against the elderly?|perpetrated|perpetuated|permeated
        She was ___ about the harsh words she had spoken.|regretful|regrettable|regretted
        The loss of the old forest is deeply ___.|regrettable|regretful|regretted
        It is ___ that the meeting was canceled.|regrettable|regretful|regardful
        The storm ___ havoc along the coast.|wreaked|wrecked|reeked
        The crash ___ both cars beyond repair.|wrecked|wreaked|racked
        The angry fans ___ the stadium after the match.|wrecked|wreaked|wracked
        The club holds a ___ meeting, in spring and in autumn.|biannual|biennial|bilingual
        The art show is ___; it takes place every two years.|biennial|biannual|bicentennial
        The ___ election comes around every second year.|biennial|biannual|binary
        Years of drought ___ the farmers until many gave up their land.|wrecked|wreaked|reeked
        The nurses checked on the patient at ___ intervals through the night.|continual|continuous|contentious
      `,
      (right) => [
        `**${right}** has this meaning; the other choices are look-alike words whose meanings differ.`,
        `**${right}** 有这个意思；其他选项是形似的词，意思不同。`,
      ],
      [
        [
          "*{wrong}* looks or sounds like **{right}**, but it has a different meaning.",
          "*{wrong}* 看起来或听起来像 **{right}**，但意思不同。",
        ],
        ["*{wrong}* is another word or form; it does not have this meaning.", "*{wrong}* 是另一个词或词形，没有这个意思。"],
      ],
    ),
    choose(
      "the-word-for-the-meaning",
      ["The Word for the Meaning", "符合释义的词"],
      [
        "Learn each pair by a clue. *Continuous* ends in *-ous*, like a river that flows on; *continual* comes back again and again. *Proscribe* has the *pro-* of *prohibit*. *Exult* has the *u* of *jump*, a leap of joy. A ship *founders* when it goes to the bottom, the *foundation*; a fish out of water *flounders*. A *hoard* is stored away like a *board* of savings; a *horde* rides on *horses*. *Mitigate* means to make *milder*. A *perpetrator* commits the crime. *Biennial* has the *enn* of *ennium*, years, as in *millennium*.",
        "用线索记住每一对词。*continuous* 以 *-ous* 结尾，像一条不断流淌的河；*continual* 是一次次反复。*proscribe* 的 *pro-* 和 *prohibit*（禁止）一样。*exult* 是欢喜得跳起来。船 *founder* 是沉到底部；离水的鱼在 *flounder*（挣扎）。*hoard* 是藏起来的储备；*horde* 是骑马而来的一大群人。*mitigate* 意为使 *milder*（更温和）。*perpetrator* 是犯罪的人。*biennial* 里的 *enn* 表示年，和 *millennium* 一样。",
      ],
      ["Which word has this meaning?", "哪个词有这个意思？"],
      `
${meaningLines6}
        happening again and again, with breaks between|continual|continuous|contentious
        going on without any break at all|continuous|continual|contiguous
        to order or recommend, as a doctor does|prescribe|proscribe|describe
        to forbid something by law or custom|proscribe|prescribe|subscribe
        to praise or raise someone to a high rank|exalt|exult|exact
        to rejoice greatly, especially at a victory|exult|exalt|exhale
        to sink, or to fail completely|founder|flounder|found
        to struggle clumsily or in confusion|flounder|founder|flounce
        a hidden store of money, food or treasure|hoard|horde|herd
        a huge and often unruly crowd|horde|hoard|herd
        to act as a strong reason against something|militate|mitigate|meditate
        to make a harm or a pain less severe|mitigate|militate|migrate
        to commit a crime or a harmful act|perpetrate|perpetuate|penetrate
        to keep a practice or belief going|perpetuate|perpetrate|permeate
        feeling sorry about something one has done|regretful|regrettable|regretted
        deserving to be regretted; unfortunate|regrettable|regretful|regretted
        to cause damage or harm, as a storm does|wreak|wreck|reek
        to destroy or badly damage something|wreck|wreak|reek
        happening twice a year|biannual|biennial|bilingual
        happening once every two years|biennial|biannual|bicentennial
        the noise of machines that never stops is this|continuous|continual|contiguous
        a phone that rings every few minutes gives this kind of interruption|continual|continuous|contentious
        what a doctor does with medicine|prescribe|proscribe|describe
        what a law does to a dangerous drug|proscribe|prescribe|transcribe
        what winners do when they cheer and dance|exult|exalt|exact
        what a crowd of shoppers at a sale becomes|horde|hoard|herd
        what a squirrel keeps for the winter|hoard|horde|hard
        what a criminal does to a fraud|perpetrate|perpetuate|permeate
        what an apology may do to the damage of an insult|mitigate|militate|migrate
        an exhibition held every second year is this|biennial|biannual|biblical
      `,
      (right) => [
        `**${right}** has this meaning; the other choices are look-alike words whose meanings differ.`,
        `**${right}** 有这个意思；其他选项是形似的词，意思不同。`,
      ],
      [
        [
          "*{wrong}* looks or sounds like **{right}**, but it has a different meaning.",
          "*{wrong}* 看起来或听起来像 **{right}**，但意思不同。",
        ],
        ["*{wrong}* is another word or form; it does not have this meaning.", "*{wrong}* 是另一个词或词形，没有这个意思。"],
      ],
    ),
  ],
});

/** grammarTopics10b are the second grammar topics of grade 10. */
export const grammarTopics10b: readonly TopicDef[] = [voice, subordination, confused6];
