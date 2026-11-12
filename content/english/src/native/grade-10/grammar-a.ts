// Grade 10: grammar for style and precision: parallelism and antithesis, fragments and questions for effect, and
// relative clauses with quantities and whose.

import type { TopicDef } from "@ga/content";
import { everyPair } from "../../levels/words.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

// Crossed items: frames, people and phrases multiply the lines below into a hundred items or more for each bank.

const join = (lines: readonly string[]) => lines.join("\n");
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** opposites are a verb, its opposite, the first as a gerund and the second as a noun. */
const opposites = [
  ["build", "destroy", "building", "destruction"],
  ["heal", "wound", "healing", "injury"],
  ["teach", "punish", "teaching", "punishment"],
  ["unite", "divide", "uniting", "division"],
  ["free", "enslave", "freeing", "slavery"],
  ["give", "take", "giving", "taking"],
  ["create", "copy", "creating", "copying"],
  ["lead", "follow", "leading", "following"],
  ["protect", "conquer", "protecting", "conquest"],
  ["listen", "judge", "listening", "judgment"],
] as const;
const strivers = [
  "We came",
  "They lived",
  "She worked",
  "He spoke",
  "The army marched",
  "The poets wrote",
  "Our parents struggled",
  "The founders labored",
  "I rose",
  "You trained",
] as const;
const balancedLines = join(
  everyPair(strivers, opposites).map(
    ([who, [a, b, aIng, bNoun]]) =>
      `Begin with "${who}" and contrast ${aIng} with ${bNoun}.|${who} to ${a}, not to ${b}.|${who} to ${a}, not for ${bNoun}.|${who} for ${aIng} and not to ${b}.`,
  ),
);
const traits = [
  ["tired", "hungry", "cold"],
  ["brave", "honest", "kind"],
  ["quick", "clever", "curious"],
  ["calm", "patient", "fair"],
  ["proud", "stubborn", "lonely"],
  ["young", "poor", "hopeful"],
  ["strong", "steady", "loyal"],
  ["quiet", "careful", "wise"],
] as const;
const describedPeople = ["She was", "The captain seemed", "My grandfather was", "The new teacher appeared"] as const;
const jobs = ["The job", "The role", "The position", "The course", "The project", "The team"] as const;
const faultyNeeds = [
  ["patience", "careful planning", "to be good with people"],
  ["energy", "a clear voice", "to be able to work late"],
  ["skill", "good judgment", "being someone who listens"],
  ["honesty", "hard work", "to show up on time"],
  ["focus", "creativity", "that you work well alone"],
  ["courage", "attention to detail", "to stay calm under pressure"],
] as const;
const balanceLines = join([
  ...everyPair(describedPeople, traits).map(([who, [a, b, c]]) => `${who} ${a}, ${b} and ${c}.|a parallel series`),
  ...opposites.flatMap(([a, b]) => [
    `It is better to ${a} than to ${b}.|an antithesis`,
    `They chose to ${a} rather than to ${b}.|an antithesis`,
    `To ${a} is noble; to ${b} is easy.|an antithesis`,
  ]),
  ...everyPair(jobs, faultyNeeds).map(([job, [x, y, z]]) => `${job} requires ${x}, ${y} and ${z}.|faulty parallelism`),
]);

const waits = ["We searched", "They waited", "She trained", "He practised", "The town mourned", "I wondered"] as const;
const spans = ["hours", "days", "weeks", "months", "years"] as const;
const misses = [
  "I missed the start of the play",
  "We lost the final",
  "She was late for school",
  "He failed the driving test",
  "The picnic was ruined",
  "Our flight was cancelled",
] as const;
const reasons = [
  "the traffic was terrible",
  "the bus broke down",
  "it rained all morning",
  "nobody remembered the tickets",
  "the storm grew worse",
] as const;
const fragmentLines = join([
  ...everyPair(waits, spans).map(([who, span]) => `${who} for ${span}. **${upper(span)}.**|a deliberate fragment`),
  ...everyPair(misses, reasons).map(([miss, reason]) => `${miss}. **Because ${reason}.**|an accidental fragment`),
  ...everyPair(misses, reasons).map(([miss, reason]) => `${miss}. **${upper(reason)}.**|a complete sentence`),
]);

const goods = [
  "clean air",
  "a safe home",
  "a fair trial",
  "good health",
  "true friends",
  "a peaceful town",
  "a good education",
  "honest leaders",
  "a little kindness",
  "freedom to speak",
  "enough food",
  "a second chance",
] as const;
const causes = [
  ["the collapse", "Three years of drought and a war"],
  ["the fire", "A cigarette dropped in dry grass"],
  ["the flood", "A week of rain and a broken dam"],
  ["the strike", "Low pay and long hours"],
  ["the famine", "Failed crops and closed roads"],
  ["the crash", "Ice on the road and a tired driver"],
  ["the blackout", "A storm that brought down the lines"],
  ["the war", "Old quarrels and a single shot"],
  ["the fall of the empire", "Debt, plague and endless borders"],
  ["the panic", "A rumor that spread faster than the truth"],
  ["the shortage", "A hot summer and too many buyers"],
  ["the victory", "Training, patience and a little luck"],
] as const;
const places = [
  "station",
  "post office",
  "library",
  "bank",
  "museum",
  "pharmacy",
  "bus stop",
  "town hall",
  "hospital",
  "market",
  "nearest café",
  "swimming pool",
] as const;
const questionLines = join([
  ...goods.flatMap((good) => [
    `Who among us does not want ${good}?|a rhetorical question`,
    `Is there anyone who would refuse ${good}?|a rhetorical question`,
  ]),
  ...causes.flatMap(([event, cause]) => [`What caused ${event}? ${cause}.|hypophora`, `Why did ${event} happen? ${cause}.|hypophora`]),
  ...places.flatMap((place) => [
    `Could you tell me where the ${place} is?|a genuine question`,
    `What time does the ${place} open?|a genuine question`,
    `Do you know how far the ${place} is?|a genuine question`,
  ]),
]);

const peopleSets = [
  "Sixty people applied for the job",
  "The club has forty members",
  "Thirty students took the test",
  "The village has two hundred residents",
  "The coach chose twelve players",
  "The ship carried ninety passengers",
  "Our choir has fifty singers",
  "The hospital hired twenty nurses",
] as const;
const peopleFacts = ["live nearby", "speak French", "had never voted before", "came from abroad", "were under twenty", "wore red"] as const;
const thingSets = [
  "The museum owns ten thousand paintings",
  "The library has a million books",
  "The shop sells hundreds of hats",
  "The garden contains fifty kinds of roses",
  "The city has forty bridges",
  "The collector bought nine old maps",
  "The ship carried three hundred crates",
  "The archive holds six thousand letters",
] as const;
const thingFacts = ["are on display", "were damaged in the flood", "came from Asia", "are very rare", "need repair", "were gifts"] as const;
const amounts = ["many", "most", "some", "few", "half", "several", "two", "all"] as const;
const quantityLines = join([
  ...everyPair(peopleSets, peopleFacts).map(([set, fact], k) => {
    const q = amounts[k % amounts.length] ?? "many";
    return `${set}, ___ ${fact}.|${q} of whom|${q} of who|${q} of them`;
  }),
  ...everyPair(thingSets, thingFacts).map(([set, fact], k) => {
    const q = amounts[(k + 3) % amounts.length] ?? "many";
    return `${set}, ___ ${fact}.|${q} of which|${q} of that|${q} of them`;
  }),
]);

const persons = ["writer", "singer", "farmer", "teacher", "doctor", "pilot", "chef", "painter"] as const;
const theirs = [
  "work is famous",
  "name I always forget",
  "home burned down",
  "son plays chess",
  "car broke down",
  "ideas changed the town",
] as const;
const placesWith = ["city", "house", "tree", "book", "river", "company"] as const;
const itsTraits = ["name means 'new'", "history is long", "future is uncertain"] as const;
const comings = ["coming to dinner", "in charge today", "leaving tomorrow"] as const;
const whoseLines = join([
  ...everyPair(persons, theirs).map(([person, rest]) => `We met a ${person} ___ ${rest}.|whose|who's|that's`),
  ...everyPair(placesWith, itsTraits).map(([place, rest]) => `It is a ${place} ___ ${rest}.|whose|who's|which's`),
  ...everyPair(persons, comings).map(([person, rest]) => `Ask the ${person} ___ ${rest}.|who's|whose|that's`),
]);

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const antithesis = topic("grammar", {
  id: "parallelism-and-antithesis",
  title: ["Parallelism and Antithesis", "平行结构与对照"],
  summary: [
    "How balanced sentences set ideas side by side in the same grammatical form, and how antithesis sets opposites against each other for force.",
    "平衡的句子如何把观点用相同的语法形式并列，对照又如何让相反的意思彼此对立以增强力量。",
  ],
  after: ["periodic-and-cumulative-sentences"],
  points: [
    choose(
      "the-balanced-contrast",
      ["The Balanced Contrast", "平衡的对照"],
      [
        "**Antithesis** sets two opposite ideas in the same grammatical form, so that the balance makes the contrast sharp: *It was the best of times, it was the worst of times.* *We must learn to live together as brothers or perish together as fools.* If one half is a clause and the other a phrase, or one half has a verb the other lacks, the balance breaks and the contrast goes soft. Match the halves word for word: noun with noun, verb with verb, clause with clause.",
        "**对照**把两个相反的意思放进相同的语法形式，平衡使对比更鲜明：*It was the best of times, it was the worst of times.* *We must learn to live together as brothers or perish together as fools.* 如果一半是分句、另一半是短语，或一半有动词而另一半没有，平衡就被打破，对比也变弱了。让两半逐词对应：名词对名词，动词对动词，分句对分句。",
      ],
      ["Which version keeps the contrast balanced?", "哪一个版本让对照保持平衡？"],
      `
${balancedLines}
        Contrast speech and silence.|Speech is silver; silence is golden.|Speech is silver, but being silent is something golden.|Speech is silver; to be silent, golden in value.
        Contrast erring and forgiving.|To err is human; to forgive, divine.|To err is human; forgiving is a thing that is divine.|Erring is human, and to forgive is divine.
        Contrast building and destroying.|We came to build, not to destroy.|We came to build, not for the destruction of things.|We came for building and not to destroy.
        Contrast being called and being chosen.|Many are called, but few are chosen.|Many are called, but the chosen are few in number.|Many are called; the choosing of few happens.
        Contrast loving and fearing the city.|She loved the city by day and feared it by night.|She loved the city by day, and at night there was fear.|She loved the city by day and was fearful in the night hours.
        Contrast the rich and the poor.|The rich grow richer, and the poor grow poorer.|The rich grow richer, and poverty increases among the poor.|The rich grow richer while the poor are becoming more poor.
        Contrast what the team gives and what you give.|Ask not what the team can give you; ask what you can give the team.|Ask not what the team can give you, but your gifts to the team.|Do not ask about the team's gifts to you; ask what you can give the team.
        Contrast promising and delivering.|He was quick to promise and slow to deliver.|He was quick to promise, and delivery was slow.|He promised quickly but was a slow deliverer.
        Contrast hatred and love.|Hatred stirs up conflict, but love covers all wrongs.|Hatred stirs up conflict, but all wrongs are covered by love.|Hatred stirs up conflict; with love comes covering of wrongs.
        Contrast the sea giving and taking.|The sea gives, and the sea takes away.|The sea gives, and things are taken away by it.|The sea gives, and its taking away happens too.
        Contrast starting and finishing.|Easy to start, hard to finish.|Easy to start, but finishing is hard.|It is easy to start; the finish is a hard thing.
        Contrast a man's step and mankind's leap.|One small step for a man, one giant leap for mankind.|One small step for a man, and mankind leaps giantly.|One small step for a man; for mankind, a leap that is giant.
        Contrast reading to know and reading to escape.|We read to know that we are not alone, not to escape the world.|We read to know that we are not alone, not for escaping the world.|We read to know we are not alone, not as an escape from the world.
        Contrast liberty and death.|Give me liberty, or give me death.|Give me liberty, or I would rather be dead.|Give me liberty, or death is what I would like.
        Contrast the victors and the defeated.|The victors write history; the defeated endure it.|The victors write history, and it is endured by the defeated.|The victors write history; enduring it falls to the defeated.
        Contrast Caesar and Rome.|Not that I loved Caesar less, but that I loved Rome more.|Not that I loved Caesar less, but Rome was loved more.|Not that I loved Caesar less, but my love for Rome was greater.
        Contrast fools and the wise.|Fools rush in where wise people fear to tread.|Fools rush in where wise people are fearful of treading.|Fools rush in, and there is fear of treading by the wise.
        Contrast her words and her meaning.|Her words were soft; her meaning was hard.|Her words were soft, but she meant something hard.|Her words were soft; the meaning, hardness.
        Contrast the field and the table.|The war was won on the field and lost at the table.|The war was won on the field, and the treaty lost it.|The war was won on the field, but at the table they were losing it.
        Contrast peace and war.|In peace, sons bury their fathers; in war, fathers bury their sons.|In peace, sons bury their fathers; war is when fathers bury sons.|In peace, sons bury their fathers, and the burying of sons by fathers happens in war.
        Contrast proposing and disposing.|Man proposes; God disposes.|Man proposes, but disposing is God's.|Man proposes; the disposal is by God.
        Contrast eating and living.|We must eat to live, not live to eat.|We must eat to live, not live for the purpose of eating.|We must eat to live, and living is not for eating.
        Contrast bread and stones.|They promised bread and delivered stones.|They promised bread, and stones were delivered.|They promised bread, but the delivery was of stones.
        Contrast learning and knowing.|The more we learn, the less we know.|The more we learn, the knowledge we have is less.|As we learn more, there is less knowing.
        Contrast freedom and tyranny.|He spoke of freedom and practiced tyranny.|He spoke of freedom, but tyranny was what he practiced.|He spoke of freedom; his practice, tyrannical.
        Contrast how we judge others and ourselves.|We judge others by their deeds and ourselves by our intentions.|We judge others by their deeds, and our intentions are how we judge ourselves.|We judge others by their deeds; ourselves, the judging is by intention.
        Contrast arriving and leaving.|She came as a stranger and left as a friend.|She came as a stranger, and when she left, she was a friend.|She came as a stranger but was friendly when leaving.
        Contrast tasting and swallowing books.|Some books are to be tasted, others to be swallowed.|Some books are to be tasted, and others you swallow.|Some books are to be tasted; the swallowing of others.
        Contrast winning and losing.|Winning teaches little; losing teaches much.|Winning teaches little, but a lot is taught by losing.|Winning teaches little; from losing, much learning.
        Contrast talent and teamwork.|Talent wins games, but teamwork wins championships.|Talent wins games, but championships are won by teamwork.|Talent wins games; teamwork, the winning of championships.
      `,
      (right) => [
        `"${right}" sets the two opposites in the same grammatical form, so the balance sharpens the contrast.`,
        `“${right}” 让两个相反的意思处于相同的语法形式，平衡使对比更鲜明。`,
      ],
      [
        [
          'In "{wrong}" the second half changes its form, for instance to the passive or to a noun, so the halves no longer match.',
          "在“{wrong}”中，后半部分换了形式，比如变成被动语态或名词，两半不再对应。",
        ],
        [
          '"{wrong}" turns one half into a different structure, so the contrast loses its balance and its force.',
          "“{wrong}”把其中一半改成了不同的结构，对照因此失去平衡和力量。",
        ],
      ],
    ),
    label(
      "naming-the-balance",
      ["Naming the Balance", "辨认平衡的类型"],
      [
        "Balanced sentences come in kinds. A **parallel series** lists three or more items in the same form: *I came, I saw, I conquered.* An **antithesis** sets two opposites against each other in the same form: *Not as a call to battle, but as a call to bear the burden.* A sentence with **faulty parallelism** tries to balance its items but puts them in different forms: *She likes hiking, to swim and a bike ride.*",
        "平衡的句子有不同的类型。**平行排比**用相同的形式列出三个或更多项：*I came, I saw, I conquered.* **对照**让两个相反的意思以相同形式彼此对立：*Not as a call to battle, but as a call to bear the burden.* **平行结构错误**的句子想要平衡各项，却用了不同的形式：*She likes hiking, to swim and a bike ride.*",
      ],
      ["What kind of balance does this sentence have?", "这个句子属于哪种平衡？"],
      `
${balanceLines}
        We shall fight on the beaches, we shall fight in the fields, we shall fight in the streets.|a parallel series
        It is better to be feared than to be loved.|an antithesis
        The job requires patience, careful planning and to be good with people.|faulty parallelism
        She was tired, hungry and cold.|a parallel series
        Love is an ideal thing; marriage, a real thing.|an antithesis
        He enjoyed reading, to write poems and long walks.|faulty parallelism
        Government of the people, by the people, for the people.|a parallel series
        The world will little note what we say here, but it can never forget what they did here.|an antithesis
        The coach told us to run harder, that we should pass more and about being on time.|faulty parallelism
        They cleaned the house, washed the car and mowed the lawn.|a parallel series
        A lie can travel halfway around the world while the truth is putting on its shoes.|an antithesis
        The essay was long, boring and had too many errors.|faulty parallelism
        Read widely, write daily, revise ruthlessly.|a parallel series
        Fair is foul, and foul is fair.|an antithesis
        Her goals were to finish the race, beating her old time and a new friend.|faulty parallelism
        The city was loud, crowded and alive.|a parallel series
        To be or not to be: that is the question.|an antithesis
        He promised to listen, that he would change and a better attitude.|faulty parallelism
        Through rain, through snow, through the long dark of winter, the mail arrived.|a parallel series
        The heart has its reasons that reason does not know.|an antithesis
        Students should bring a pen, their notebooks and to have read chapter two.|faulty parallelism
        She sang with joy, with grief, with every feeling she had.|a parallel series
        Ask not what your country can do for you; ask what you can do for your country.|an antithesis
        The trip was fun, cheap and we learned a lot.|faulty parallelism
        Never in the field of human conflict was so much owed by so many to so few.|a parallel series
        Youth is wasted on the young.|an antithesis
        The plan is to raise money, buying supplies and the building of a shelter.|faulty parallelism
        We laughed, we cried, we sang until dawn.|a parallel series
        Better to light a candle than to curse the darkness.|an antithesis
        The movie was exciting, well acted and with a surprise ending.|faulty parallelism
      `,
      {
        "a parallel series": L(
          "平行排比",
          "The sentence lists three or more items in the same grammatical form, building rhythm and weight.",
          "这个句子用相同的语法形式列出三个或更多项，营造节奏和分量。",
          "The sentence does not list three or more items in the same form.",
          "这个句子并没有用相同的形式列出三个或更多项。",
        ),
        "an antithesis": L(
          "对照",
          "The sentence sets two opposite ideas against each other in matching form, so the contrast stands out.",
          "这个句子用相互对应的形式让两个相反的意思彼此对立，使对比突出。",
          "The sentence does not set two opposites against each other.",
          "这个句子并没有让两个相反的意思彼此对立。",
        ),
        "faulty parallelism": L(
          "平行结构错误",
          "The sentence lines up items as if they were parallel, but puts them in different forms, such as a gerund, an infinitive and a noun.",
          "这个句子把各项排列得好像是平行的，却用了不同的形式，比如动名词、不定式和名词。",
          "Every item of the sentence is in the same form, so its parallelism is not faulty.",
          "这个句子的各项形式一致，所以平行结构没有错误。",
        ),
      },
    ),
  ],
});

const forEffect = topic("grammar", {
  id: "fragments-and-questions-for-effect",
  title: ["Fragments and Questions for Effect", "为效果而用的片段句与问句"],
  summary: [
    "When a skilled writer breaks the rules on purpose: a deliberate fragment for emphasis, and questions that are not asked for an answer.",
    "熟练的作者何时有意打破规则：为强调而写的片段句，以及并不期待回答的问句。",
  ],
  after: ["rhetorical-devices"],
  points: [
    label(
      "deliberate-or-accidental",
      ["Deliberate or Accidental", "有意还是无意"],
      [
        "A **fragment** lacks a subject, a verb or a complete thought. An **accidental fragment** is a piece broken off a sentence by mistake, often a dependent clause or a phrase that belongs to the sentence before: *She left early. Because the bus was late.* A **deliberate fragment** is short, follows a complete sentence and stands alone on purpose, to stress a word or a feeling: *He promised to call. Never.* A **complete sentence** has a subject and a verb and needs nothing more.\n\nIn formal academic writing, avoid even deliberate fragments; in narrative, speeches and essays of opinion, use them sparingly.",
        "**片段句**缺少主语、谓语或完整的意思。**无意的片段句**是不小心从句子上断开的一截，常常是本属于前一句的从句或短语：*She left early. Because the bus was late.* **有意的片段句**简短，跟在一个完整的句子后面，有意单独成句，以强调一个词或一种感受：*He promised to call. Never.* **完整的句子**有主语和谓语，不缺任何成分。\n\n在正式的学术写作中，连有意的片段句也要避免；在记叙、演讲和议论随笔中，要节制地使用。",
      ],
      ["What is the part in bold?", "加粗的部分是什么？"],
      `
${fragmentLines}
        We waited all night for news. **Nothing.**|a deliberate fragment
        I missed the start of the play. **Because the traffic was terrible.**|an accidental fragment
        The storm passed. **The town began to rebuild.**|a complete sentence
        She had trained for years. **Years.**|a deliberate fragment
        He bought a new laptop. **Which broke within a week.**|an accidental fragment
        The crowd fell silent. **Then the speaker began.**|a complete sentence
        What did the war give them? **Graves. Debts. Silence.**|a deliberate fragment
        We stayed inside all day. **Since it was raining hard.**|an accidental fragment
        The bridge had stood for a century. **It fell in an hour.**|a complete sentence
        They called it progress. **Progress, for whom?**|a deliberate fragment
        The museum has a new wing. **Designed by a young architect from Lagos.**|an accidental fragment
        The coach shouted. **Nobody moved.**|a complete sentence
        One choice remained. **Run.**|a deliberate fragment
        I finished the essay at midnight. **After rewriting the ending three times.**|an accidental fragment
        The letter arrived late. **She never read it.**|a complete sentence
        The report promised change. **Real change, at last.**|a deliberate fragment
        Our team lost the final. **Although we led at half time.**|an accidental fragment
        The lights went out. **Someone screamed.**|a complete sentence
        He had one fear. **Being forgotten.**|a deliberate fragment
        The scientists collected samples. **For example, soil, water and leaves.**|an accidental fragment
        The door creaked. **A cold wind swept in.**|a complete sentence
        Is this justice? **Hardly.**|a deliberate fragment
        Mia joined the debate club. **To improve her speaking skills.**|an accidental fragment
        The fire burned for days. **Whole forests vanished.**|a complete sentence
        The answer was simple. **Courage.**|a deliberate fragment
        The company cut fifty jobs. **Including my father's.**|an accidental fragment
        The baby slept. **The house was finally quiet.**|a complete sentence
        She looked at the ruins of her home. **Gone. All of it.**|a deliberate fragment
        We visited the old fort. **Which was built in 1740.**|an accidental fragment
        The rain stopped. **Birds began to sing.**|a complete sentence
      `,
      {
        "a deliberate fragment": L(
          "有意的片段句",
          "It is short, it follows a complete sentence, and it stands alone on purpose to stress a word or a feeling.",
          "它很简短，跟在完整的句子后面，有意单独成句来强调一个词或一种感受。",
          "It is not a short piece set apart on purpose for emphasis.",
          "它不是为了强调而有意单独列出的简短片段。",
        ),
        "an accidental fragment": L(
          "无意的片段句",
          "It is a dependent clause or a phrase that belongs to the sentence before it and was cut off by mistake; it should be joined back.",
          "它是本属于前一句的从句或短语，被错误地断开了；应当把它接回去。",
          "It is not a clause or phrase broken off the sentence before by mistake.",
          "它不是从前一句错误断开的从句或短语。",
        ),
        "a complete sentence": L(
          "完整的句子",
          "It has its own subject and verb and expresses a complete thought, so it is not a fragment at all.",
          "它有自己的主语和谓语，表达完整的意思，所以根本不是片段句。",
          "It lacks a subject, a verb or a complete thought, so it is not a complete sentence.",
          "它缺少主语、谓语或完整的意思，所以不是完整的句子。",
        ),
      },
    ),
    label(
      "questions-that-do-not-ask",
      ["Questions That Do Not Ask", "并不发问的问句"],
      [
        "Not every question asks for information. A **rhetorical question** expects no answer because the answer is obvious, and it makes a point: *Who would choose to be poor?* In **hypophora**, the writer asks a question and answers it at once, to steer the reader to the next idea: *Why does this matter? Because the river is our only water.* A **genuine question** asks for information the speaker does not have: *What time does the library close?*",
        "并不是每个问句都在询问信息。**反问**不期待回答，因为答案显而易见，它用来表达观点：*Who would choose to be poor?* 在**设问**中，作者提出问题后立刻作答，引导读者进入下一个观点：*Why does this matter? Because the river is our only water.* **真正的问句**询问说话人不知道的信息：*What time does the library close?*",
      ],
      ["What kind of question is this?", "这是哪种问句？"],
      `
${questionLines}
        Who among us has never made a mistake?|a rhetorical question
        What caused the collapse? Three years of drought and a war.|hypophora
        Could you tell me where the station is?|a genuine question
        Is there anyone who does not want clean air?|a rhetorical question
        So what is the solution? It is to plant trees, millions of them.|hypophora
        How many pages does the report need to be?|a genuine question
        Shall we let our children inherit our debts?|a rhetorical question
        Why did the empire fall? It grew too large to defend.|hypophora
        Did you remember to bring the tickets?|a genuine question
        Who could look at that photograph and feel nothing?|a rhetorical question
        What does the poem mean by the ending? It means the speaker has accepted her loss.|hypophora
        When does the second train leave?|a genuine question
        Are we really going to stand by and do nothing?|a rhetorical question
        Why should you vote? Because silence is also a choice.|hypophora
        Which of these two shirts do you prefer?|a genuine question
        Who wants to live in a world without music?|a rhetorical question
        What did the experiment show? That the plants grew faster in blue light.|hypophora
        Have you seen my blue notebook anywhere?|a genuine question
        Isn't it time we listened to the people who live there?|a rhetorical question
        How can a small town fight a giant company? By standing together.|hypophora
        Where did you buy that bicycle?|a genuine question
        If not us, then who? If not now, then when?|a rhetorical question
        What is the cost of doing nothing? Higher seas and lost homes.|hypophora
        How long have you lived in this city?|a genuine question
        Can money really buy happiness?|a rhetorical question
        Why does the narrator lie? He lies because he fears his father.|hypophora
        Would you like tea or coffee?|a genuine question
        What parent does not want the best for a child?|a rhetorical question
        Where does the plastic go? Much of it ends up in the sea.|hypophora
        Who is in charge of the science fair this year?|a genuine question
      `,
      {
        "a rhetorical question": L(
          "反问",
          "It expects no answer, because the answer is obvious; it is a way of making a point.",
          "它不期待回答，因为答案显而易见；这是一种表达观点的方式。",
          "It is not a question whose answer is too obvious to give.",
          "它不是答案显而易见、无需回答的问句。",
        ),
        hypophora: L(
          "设问",
          "The writer asks a question and answers it right away, to lead the reader to the next point.",
          "作者提出问题后马上作答，引导读者进入下一个要点。",
          "The writer does not answer the question right after asking it.",
          "作者并没有在提问之后马上作答。",
        ),
        "a genuine question": L(
          "真正的问句",
          "The speaker really wants information that they do not have.",
          "说话人确实想要获得自己不知道的信息。",
          "The speaker is not asking for information they lack.",
          "说话人并不是在询问自己不知道的信息。",
        ),
      },
    ),
  ],
});

const quantified = topic("grammar", {
  id: "some-of-whom-and-whose",
  title: ["Some of Whom, Most of Which and Whose", "Some of whom、most of which 与 whose"],
  summary: [
    "Relative clauses that begin with a word of quantity, such as *most of which*, and the possessive *whose*, used for things as well as people.",
    "以 *most of which* 这类数量词开头的关系从句，以及既可用于人也可用于物的所有格 *whose*。",
  ],
  after: ["prepositions-before-relative-pronouns"],
  points: [
    choose(
      "a-quantity-and-a-relative-pronoun",
      ["A Quantity and a Relative Pronoun", "数量词加关系代词"],
      [
        "To say how many of a group a clause is about, put a word of quantity and *of* before the relative pronoun: *forty students, **some of whom** were from abroad*; *three proposals, **none of which** was approved*. After *of*, use *whom* for people and *which* for things, never *who* or *that*. Do not use *them* or *it*: *forty students, some of them were from abroad* joins two sentences with only a comma.",
        "要说明从句涉及一个群体中的多少，就把数量词和 *of* 放在关系代词前：*forty students, **some of whom** were from abroad*；*three proposals, **none of which** was approved*。在 *of* 后面，指人用 *whom*，指物用 *which*，不能用 *who* 或 *that*。也不要用 *them* 或 *it*：*forty students, some of them were from abroad* 只用逗号连接了两个句子。",
      ],
      ["Which words complete the sentence correctly?", "哪一组词能正确地完成句子？"],
      `
${quantityLines}
        Sixty people applied for the job, ___ had never worked before.|many of whom|many of who|many of them
        The museum owns ten thousand paintings, ___ are on display.|few of which|few of that|few of them
        She wrote four novels, ___ won a prize.|two of which|two of that|two of them
        The team has twelve players, ___ are under twenty.|half of whom|half of who|half of them
        We tested three samples, ___ contained lead.|none of which|none of that|none of them
        The village has five wells, ___ is still in use.|only one of which|only one of that|only one of them
        I have two older brothers, ___ live abroad.|both of whom|both of who|both of them
        The report made ten recommendations, ___ were adopted.|most of which|most of that|most of them
        The class read eight poems, ___ rhymed.|several of which|several of that|several of them
        Thirty soldiers crossed the river, ___ returned.|few of whom|few of who|few of them
        The city has three bridges, ___ was built by the Romans.|the oldest of which|the oldest of that|the oldest of them
        He thanked his teachers, ___ had come to the ceremony.|all of whom|all of who|all of them
        The store sold a hundred tickets, ___ were bought online.|most of which|most of that|most of them
        The author interviewed forty veterans, ___ had never spoken about the war.|many of whom|many of who|many of them
        The garden has twenty trees, ___ bear fruit.|some of which|some of that|some of them
        The company hired six engineers, ___ came from the same university.|three of whom|three of who|three of them
        We considered four plans, ___ was perfect.|none of which|none of that|none of them
        The survey reached a thousand students, ___ said they slept too little.|a third of whom|a third of who|a third of them
        The king had three sons, ___ became king after him.|the youngest of whom|the youngest of who|the youngest of them
        The lake is fed by many streams, ___ dry up in summer.|some of which|some of that|some of them
        She has two cats, ___ is afraid of mice.|neither of which|neither of that|neither of them
        The festival had fifty bands, ___ I had heard of.|few of which|few of that|few of them
        The judges, ___ were former champions, scored the final.|all of whom|all of who|all of them
        He gave three speeches, ___ was the shortest and the best.|the last of which|the last of that|the last of them
        The study followed two hundred children, ___ grew up in cities.|most of whom|most of who|most of them
        The library lost many books in the flood, ___ were rare.|several of which|several of that|several of them
        I met ten new classmates, ___ I already liked.|most of whom|most of who|most of them
        The planet has two moons, ___ is larger than ours.|neither of which|neither of that|neither of them
        The farmers grew four crops, ___ failed in the drought.|all of which|all of that|all of them
        Our school has three counselors, ___ speaks Spanish.|one of whom|one of who|one of them
      `,
      (right) => [
        `**${right}** puts the quantity before *of* and then the relative pronoun, *whom* for people or *which* for things, so the clause stays joined to the sentence.`,
        `**${right}** 把数量词放在 *of* 前面，后接关系代词：指人用 *whom*，指物用 *which*，从句因此与句子连在一起。`,
      ],
      [
        [
          "*{wrong}* uses *who* or *that* after *of*; after a preposition, use *whom* for people and *which* for things.",
          "*{wrong}* 在 *of* 后用了 *who* 或 *that*；介词后面，指人用 *whom*，指物用 *which*。",
        ],
        [
          "*{wrong}* uses a personal pronoun, so the second part becomes a sentence of its own, and a comma alone cannot join two sentences.",
          "*{wrong}* 用了人称代词，后半部分就成了独立的句子，而单用逗号不能连接两个句子。",
        ],
      ],
    ),
    choose(
      "whose-for-people-and-things",
      ["Whose for People and Things", "whose 指人也指物"],
      [
        "*Whose* is the possessive relative pronoun. It works for people and for things alike: *the writer **whose** book won*, *the house **whose** roof leaks*. Do not confuse it with *who's*, which means *who is* or *who has*. In formal writing, *of which* can replace *whose* for things: *the house, the roof **of which** leaks*. *That's* and *which's* are never possessive.",
        "*Whose* 是表示所属的关系代词，既可用于人，也可用于物：*the writer **whose** book won*、*the house **whose** roof leaks*。不要把它和 *who's* 混淆，后者意为 *who is* 或 *who has*。在正式写作中，指物时可以用 *of which* 代替 *whose*：*the house, the roof **of which** leaks*。*That's* 和 *which's* 永远不表示所属。",
      ],
      ["Which words complete the sentence correctly?", "哪一组词能正确地完成句子？"],
      `
${whoseLines}
        We met a scientist ___ research saved thousands of lives.|whose|who's|that's
        It is a city ___ history goes back three thousand years.|whose|who's|which's
        The girl ___ bicycle was stolen called the police.|whose|who's|that's
        I need a friend ___ honest with me.|who's|whose|that's
        She chose a car ___ engine was quiet and clean.|whose|who's|which's
        The poet ___ verses we studied lived in poverty.|whose|who's|that's
        That is the man ___ been waiting all morning.|who's|whose|which's
        They saved a forest ___ trees were older than the town.|whose|who's|that's
        Any student ___ finished may leave early.|who's|whose|that's
        The company, ___ profits fell, closed two stores.|whose|who's|which's
        He is a singer ___ voice can fill a stadium.|whose|who's|that's
        Is this the book ___ ending made you cry?|whose|who's|which's
        We need a leader ___ willing to listen.|who's|whose|that's
        The village, ___ only road was flooded, waited for help.|whose|who's|that's
        The painter ___ work hangs here died young.|whose|who's|which's
        The river, ___ water was once clean, is now polluted.|whose|who's|that's
        She is the athlete ___ broken the record twice.|who's|whose|which's
        The theory, ___ author was only twenty, changed physics.|whose|who's|that's
        A tree ___ roots are deep survives the storm.|whose|who's|which's
        Ask the teacher ___ in charge of the trip.|who's|whose|that's
        The country, ___ economy depends on tourism, suffered badly.|whose|who's|which's
        They interviewed a woman ___ son had been rescued.|whose|who's|that's
        The house, the windows ___ were broken, stood empty.|of which|of whose|whose which
        It was a law, the purpose ___ was unclear to everyone.|of which|of whose|whose which
        The bridge, the cost ___ doubled, opened late.|of which|of whose|whose which
        The machine, the parts ___ came from five countries, worked at once.|of which|of whose|whose which
        The novel, the hero ___ is a thief, sold well.|of which|of whose|whose which
        The plan, the details ___ were secret, worried the town.|of which|of whose|whose which
        The garden, the walls ___ were ancient, was open to visitors.|of which|of whose|whose which
        The ship, the crew ___ had fled, drifted toward the rocks.|of which|of whose|whose which
      `,
      (right) => [
        `**${right}** is the form the sentence needs: *whose* shows possession for people and things, *who's* means *who is* or *who has*, and *of which* follows the noun it belongs to.`,
        `**${right}** 是句子需要的形式：*whose* 表示人或物的所属，*who's* 意为 *who is* 或 *who has*，*of which* 跟在所属的名词后面。`,
      ],
      [
        [
          "*{wrong}* is the wrong one of the look-alike forms: *whose* shows possession, *who's* means *who is* or *who has*, and after *of* a thing takes *which*.",
          "*{wrong}* 是形近形式中用错的那个：*whose* 表示所属，*who's* 意为 *who is* 或 *who has*，指物时 *of* 后面用 *which*。",
        ],
        [
          "*{wrong}* is not a correct possessive: *that's* means *that is*, and *which's* or *whose which* do not exist in standard English.",
          "*{wrong}* 不是正确的所属形式：*that's* 意为 *that is*，*which's* 和 *whose which* 在标准英语中不存在。",
        ],
      ],
    ),
  ],
});

/** grammarTopics10a are the first grammar topics of grade 10. */
export const grammarTopics10a: readonly TopicDef[] = [antithesis, forEffect, quantified];
