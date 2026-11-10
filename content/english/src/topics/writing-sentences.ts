// Writing: punctuating sentences, joining them and improving them. Answers are typed, so every item names what to use and
// lists every sentence it accepts.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typed, typedGenerator } from "@ga/subject-english";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const use = (word: string): Text => t(`Use *${word}*.`, `使用 *${word}*。`);

/** joined is an item that joins two sentences with a coordinating conjunction, with its comma. */
const joined = (word: string, first: string, second: string): TypedItem =>
  typed(
    `${first}. ${cap(second)}.`,
    `${first}, ${word} ${second}.`,
    [`${first} ${word} ${second}.`, `${first}, ${second}.`, `${first}. ${cap(word)} ${second}`],
    [`${first}, ${word} ${second}.`],
    use(word),
  );

/** subordinated is an item that joins a main sentence and a dependent clause, in either order. */
const subordinated = (word: string, main: string, clause: string): TypedItem => {
  const opening = `${cap(word)} ${clause}, ${main}.`;
  const closing = `${cap(main)} ${word} ${clause}.`;
  return typed(
    `${cap(main)}. ${cap(clause)}.`,
    closing,
    [`${cap(word)} ${clause} ${main}.`, `${cap(clause)} ${word} ${main}.`],
    [opening, closing],
    use(word),
  );
};

/** fixed is an item that corrects a sentence in capitals or punctuation. */
const fixed = (shown: string, right: string, ...wrong: readonly string[]): TypedItem => typed(shown, right, wrong);

const capitalBank: readonly TypedItem[] = [
  fixed(
    "the bus stopped at oak street.",
    "The bus stopped at Oak Street.",
    "The bus stopped at oak street.",
    "the bus stopped at Oak Street.",
  ),
  fixed(
    "my friend lena moved to texas.",
    "My friend Lena moved to Texas.",
    "My friend lena moved to texas.",
    "my friend Lena moved to Texas.",
  ),
  fixed(
    "we visited dr. shah on monday.",
    "We visited Dr. Shah on Monday.",
    "We visited Dr. Shah on monday.",
    "We visited dr. shah on Monday.",
  ),
  fixed("school starts in september.", "School starts in September.", "School starts in september.", "school starts in September."),
  fixed(
    "ana and i saw the pacific ocean.",
    "Ana and I saw the Pacific Ocean.",
    "Ana and i saw the Pacific Ocean.",
    "Ana and I saw the pacific ocean.",
  ),
  fixed(
    "our team plays in chicago on friday.",
    "Our team plays in Chicago on Friday.",
    "Our team plays in chicago on friday.",
    "Our team plays in Chicago on friday.",
  ),
  fixed("ms. reed teaches french.", "Ms. Reed teaches French.", "Ms. Reed teaches french.", "Ms. reed teaches French."),
  fixed("last july i went to canada.", "Last July I went to Canada.", "Last july I went to Canada.", "Last July i went to canada."),
];

const endMarkBank: readonly ChoiceItem[] = [
  ["Where did you park the car___", "?", [".", "!"]],
  ["The train leaves at noon___", ".", ["?", "!"]],
  ["Watch out for that car___", "!", ["?", ","]],
  ["Can you help me carry this___", "?", [".", ","]],
  ["Please close the window___", ".", ["?", ","]],
  ["What an amazing goal___", "!", ["?", ","]],
  ["My sister asked where I was going___", ".", ["?", ","]],
  ["Do you know the way home___", "?", [".", ","]],
  ["I wonder why the shop is closed___", ".", ["?", ","]],
  ["How old is that tree___", "?", [".", ","]],
];

const seriesBank: readonly TypedItem[] = [
  typed(
    "We bought apples pears and plums.",
    "We bought apples, pears, and plums.",
    ["We bought apples pears and plums.", "We bought, apples, pears, and plums."],
    ["We bought apples, pears(,) and plums."],
  ),
  typed(
    "Mia packed a tent a stove and a map.",
    "Mia packed a tent, a stove, and a map.",
    ["Mia packed a tent a stove and a map.", "Mia packed, a tent, a stove, and a map."],
    ["Mia packed a tent, a stove(,) and a map."],
  ),
  typed(
    "The flag is red white and blue.",
    "The flag is red, white, and blue.",
    ["The flag is red white and blue.", "The flag is, red, white, and blue."],
    ["The flag is red, white(,) and blue."],
  ),
  typed(
    "He ran jumped and swam.",
    "He ran, jumped, and swam.",
    ["He ran jumped and swam.", "He, ran, jumped, and swam."],
    ["He ran, jumped(,) and swam."],
  ),
  typed(
    "Bring a pen a ruler or a pencil.",
    "Bring a pen, a ruler, or a pencil.",
    ["Bring a pen a ruler or a pencil.", "Bring, a pen, a ruler, or a pencil."],
    ["Bring a pen, a ruler(,) or a pencil."],
  ),
  typed(
    "Owls bats and moths fly at night.",
    "Owls, bats, and moths fly at night.",
    ["Owls bats and moths fly at night.", "Owls, bats, and moths, fly at night."],
    ["Owls, bats(,) and moths fly at night."],
  ),
  typed(
    "I washed the car swept the floor and fed the cat.",
    "I washed the car, swept the floor, and fed the cat.",
    ["I washed the car swept the floor and fed the cat.", "I, washed the car, swept the floor, and fed the cat."],
    ["I washed the car, swept the floor(,) and fed the cat."],
  ),
  typed(
    "Sam Priya and Noor sang.",
    "Sam, Priya, and Noor sang.",
    ["Sam Priya and Noor sang.", "Sam, Priya, and Noor, sang."],
    ["Sam, Priya(,) and Noor sang."],
  ),
];

const seriesOrNotBank: readonly ChoiceItem[] = [
  ["", "The soup needs salt, pepper, and lemon.", ["The soup needs, salt, pepper, and lemon.", "The soup needs salt pepper and lemon."]],
  ["", "She plays piano and sings.", ["She plays piano, and sings.", "She plays, piano and sings."]],
  ["", "The dog is old, slow, and gentle.", ["The dog is, old, slow, and gentle.", "The dog is old slow and gentle."]],
  ["", "Tom and Ali carried the box.", ["Tom, and Ali carried the box.", "Tom and, Ali carried the box."]],
  ["", "We swam, ate, and slept.", ["We, swam, ate, and slept.", "We swam ate and slept."]],
  ["", "Bread and butter sat on the plate.", ["Bread, and butter sat on the plate.", "Bread and, butter sat on the plate."]],
  ["", "Ravi lost his hat, coat, and gloves.", ["Ravi lost, his hat, coat, and gloves.", "Ravi lost his hat coat and gloves."]],
  ["", "Cats and dogs can be friends.", ["Cats, and dogs can be friends.", "Cats and, dogs can be friends."]],
];

const finishBank: readonly ChoiceItem[] = [
  ["The plants died because ___", "nobody watered them.", ["they looked healthy.", "so we bought more."]],
  ["The plants died, but ___", "the seeds survived in the soil.", ["nobody watered them.", "because of the heat."]],
  ["The plants died, so ___", "we planted new ones.", ["nobody watered them.", "the seeds were alive."]],
  ["Maya stayed home because ___", "she had a fever.", ["she went to school.", "so she rested."]],
  ["Maya stayed home, but ___", "she still finished her work.", ["she had a fever.", "because she was sick."]],
  ["Maya stayed home, so ___", "she missed the game.", ["she had a fever.", "but she was sick."]],
  ["The bridge closed because ___", "the river flooded.", ["cars used it every day.", "so traffic stopped."]],
  ["The bridge closed, but ___", "the ferry kept running.", ["the river flooded.", "because of the storm."]],
  ["The bridge closed, so ___", "drivers took another road.", ["the river flooded.", "because it was unsafe."]],
  ["Owls hunt at night because ___", "their eyes work well in the dark.", ["they sleep at night.", "so they rest by day."]],
  ["Owls hunt at night, but ___", "some hunt at dusk as well.", ["their eyes work well in the dark.", "because they can see."]],
  ["Owls hunt at night, so ___", "they sleep during the day.", ["their eyes work well in the dark.", "because it is dark."]],
];

const expandBank: readonly TypedItem[] = [
  joined("so", "The road was icy", "we drove slowly"),
  joined("but", "The hill was steep", "she kept running"),
  joined("so", "The shop was closed", "we went home"),
  joined("but", "I studied all night", "the test was still hard"),
  joined("so", "It started to rain", "the game ended early"),
  joined("but", "The puppy was small", "its bark was loud"),
  joined("so", "Our car broke down", "we took the bus"),
  joined("but", "The soup smelled good", "it tasted bland"),
  joined("so", "Ivy forgot her coat", "she borrowed mine"),
  joined("but", "He called twice", "nobody answered"),
];

const becauseBank: readonly TypedItem[] = [
  typed(
    "We stayed inside. It was raining.",
    "We stayed inside because it was raining.",
    ["We stayed inside, because it was raining", "It was raining because we stayed inside."],
    ["We stayed inside because it was raining.", "Because it was raining, we stayed inside."],
    use("because"),
  ),
  typed(
    "Sam was tired. He ran all morning.",
    "Sam was tired because he ran all morning.",
    ["He ran all morning because Sam was tired.", "Sam was tired because he ran all morning"],
    ["Sam was tired because he ran all morning.", "Because he ran all morning, Sam was tired."],
    use("because"),
  ),
  typed(
    "The lake froze. The night was very cold.",
    "The lake froze because the night was very cold.",
    ["The night was very cold because the lake froze.", "The lake froze because the night was very cold"],
    ["The lake froze because the night was very cold.", "Because the night was very cold, the lake froze."],
    use("because"),
  ),
  typed(
    "Rosa smiled. She won the prize.",
    "Rosa smiled because she won the prize.",
    ["She won the prize because Rosa smiled.", "Rosa smiled because she won the prize"],
    ["Rosa smiled because she won the prize.", "Because she won the prize, Rosa smiled."],
    use("because"),
  ),
  typed(
    "The bus was late. Traffic was heavy.",
    "The bus was late because traffic was heavy.",
    ["Traffic was heavy because the bus was late.", "The bus was late because traffic was heavy"],
    ["The bus was late because traffic was heavy.", "Because traffic was heavy, the bus was late."],
    use("because"),
  ),
  typed(
    "The baby cried. She was hungry.",
    "The baby cried because she was hungry.",
    ["She was hungry because the baby cried.", "The baby cried because she was hungry"],
    ["The baby cried because she was hungry.", "Because she was hungry, the baby cried."],
    use("because"),
  ),
  typed(
    "I wore gloves. My hands were cold.",
    "I wore gloves because my hands were cold.",
    ["My hands were cold because I wore gloves.", "I wore gloves because my hands were cold"],
    ["I wore gloves because my hands were cold.", "Because my hands were cold, I wore gloves."],
    use("because"),
  ),
  typed(
    "The flowers grew tall. They got plenty of sun.",
    "The flowers grew tall because they got plenty of sun.",
    ["They got plenty of sun because the flowers grew tall.", "The flowers grew tall because they got plenty of sun"],
    ["The flowers grew tall because they got plenty of sun.", "Because they got plenty of sun, the flowers grew tall."],
    use("because"),
  ),
];

const conjunctionBank: readonly TypedItem[] = [
  subordinated("although", "she kept running", "the hill was steep"),
  subordinated("when", "we will eat", "the guests arrive"),
  subordinated("if", "the game will move inside", "it rains"),
  subordinated("because", "the school closed", "the snow was deep"),
  subordinated("while", "he hummed", "he cooked dinner"),
  subordinated("although", "nobody left early", "the movie was long"),
  subordinated("after", "we went swimming", "the rain stopped"),
  subordinated("before", "she checked her bag", "she left"),
  subordinated("unless", "you will miss the bus", "you hurry"),
  subordinated("until", "we waited inside", "the storm passed"),
];

const coordinatingBank: readonly TypedItem[] = [
  joined("and", "The bell rang", "the students left"),
  joined("but", "I like tea", "my sister prefers milk"),
  joined("or", "We can stay here", "we can go inside"),
  joined("so", "The rain stopped", "we went outside"),
  joined("and", "Ana sang", "Leo played the guitar"),
  joined("but", "The car started", "the lights stayed off"),
  joined("or", "You can walk", "you can take the bus"),
  joined("so", "I forgot my lunch", "I bought a sandwich"),
];

const periodFixBank: readonly TypedItem[] = [
  ["The sun set we drove home.", "The sun set.", "We drove home."],
  ["My dog is friendly he loves visitors.", "My dog is friendly.", "He loves visitors."],
  ["The test was hard, I finished it anyway.", "The test was hard.", "I finished it anyway."],
  ["It snowed all night, the school closed.", "It snowed all night.", "The school closed."],
  ["Mina reads every day she likes mysteries.", "Mina reads every day.", "She likes mysteries."],
  ["The river is low, the boats cannot pass.", "The river is low.", "The boats cannot pass."],
  ["We missed the bus we walked home.", "We missed the bus.", "We walked home."],
  ["The cake looks great, it took all day.", "The cake looks great.", "It took all day."],
].map(([shown, a, b]) => typed(shown!, `${a} ${b}`, [shown!, `${a!.slice(0, -1)}, ${b!.toLowerCase()}`, `${a} ${b!.toLowerCase()}`]));

const conjunctionFix = (word: string, shown: string, first: string, second: string): TypedItem =>
  typed(shown, `${first}, ${word} ${second}.`, [shown, `${first} ${word} ${second}.`], [`${first}, ${word} ${second}.`], use(word));

const conjunctionFixBank: readonly TypedItem[] = [
  conjunctionFix("and", "The sun set we drove home.", "The sun set", "we drove home"),
  conjunctionFix("but", "The test was hard, I finished it anyway.", "The test was hard", "I finished it anyway"),
  conjunctionFix("so", "It snowed all night, the school closed.", "It snowed all night", "the school closed"),
  conjunctionFix("but", "I called her she did not answer.", "I called her", "she did not answer"),
  conjunctionFix("so", "We missed the bus, we walked home.", "We missed the bus", "we walked home"),
  conjunctionFix("and", "Leo washed the plates Ana dried them.", "Leo washed the plates", "Ana dried them"),
  conjunctionFix("or", "We can eat now, we can wait for Sam.", "We can eat now", "we can wait for Sam"),
  conjunctionFix("so", "The river is low the boats cannot pass.", "The river is low", "the boats cannot pass"),
];

const relativeCombine = (shown: string, right: string, patterns: readonly string[], word: string, ...wrong: readonly string[]): TypedItem =>
  typed(shown, right, wrong, patterns, t(`Make the second sentence a clause with *${word}*.`, `用 *${word}* 把第二句改成从句。`));

const whoCombineBank: readonly TypedItem[] = [
  relativeCombine(
    "The boy plays drums. He lives next door.",
    "The boy who lives next door plays drums.",
    ["The boy [who|that] lives next door plays drums."],
    "who",
    "The boy plays drums who lives next door.",
    "The boy who he lives next door plays drums.",
  ),
  relativeCombine(
    "The cake is gone. Mia baked it.",
    "The cake that Mia baked is gone.",
    ["The cake [that |which |]Mia baked is gone."],
    "that",
    "The cake is gone that Mia baked.",
    "The cake that Mia baked it is gone.",
  ),
  relativeCombine(
    "The woman called me. She found my wallet.",
    "The woman who found my wallet called me.",
    ["The woman [who|that] found my wallet called me."],
    "who",
    "The woman called me who found my wallet.",
    "The woman who she found my wallet called me.",
  ),
  relativeCombine(
    "The trail was steep. We chose it.",
    "The trail that we chose was steep.",
    ["The trail [that |which |]we chose was steep."],
    "that",
    "The trail was steep that we chose.",
    "The trail that we chose it was steep.",
  ),
  relativeCombine(
    "The man left early. He fixed the sink.",
    "The man who fixed the sink left early.",
    ["The man [who|that] fixed the sink left early."],
    "who",
    "The man left early who fixed the sink.",
    "The man who he fixed the sink left early.",
  ),
  relativeCombine(
    "The song became popular. She wrote it.",
    "The song that she wrote became popular.",
    ["The song [that |which |]she wrote became popular."],
    "that",
    "The song became popular that she wrote.",
    "The song that she wrote it became popular.",
  ),
  relativeCombine(
    "The dog was scared. It bit me.",
    "The dog that bit me was scared.",
    ["The dog [that|which] bit me was scared."],
    "that",
    "The dog was scared that bit me.",
    "The dog that it bit me was scared.",
  ),
  relativeCombine(
    "The teacher retired. She helped me.",
    "The teacher who helped me retired.",
    ["The teacher [who|that] helped me retired."],
    "who",
    "The teacher retired who helped me.",
    "The teacher who she helped me retired.",
  ),
];

const whichCombineBank: readonly TypedItem[] = [
  relativeCombine(
    "My coat keeps me warm. It is very old.",
    "My coat, which is very old, keeps me warm.",
    ["My coat, which is very old, keeps me warm."],
    "which",
    "My coat which is very old keeps me warm.",
    "My coat, that is very old, keeps me warm.",
  ),
  relativeCombine(
    "The lake is deep. It freezes every winter.",
    "The lake, which freezes every winter, is deep.",
    ["The lake, which freezes every winter, is deep."],
    "which",
    "The lake which freezes every winter is deep.",
    "The lake, that freezes every winter, is deep.",
  ),
  relativeCombine(
    "Paris is beautiful. I visited it once.",
    "Paris, which I visited once, is beautiful.",
    ["Paris, which I visited once, is beautiful."],
    "which",
    "Paris which I visited once is beautiful.",
    "Paris, which I visited it once, is beautiful.",
  ),
  relativeCombine(
    "My grandmother sent a card. She lives in Ohio.",
    "My grandmother, who lives in Ohio, sent a card.",
    ["My grandmother, who lives in Ohio, sent a card."],
    "who",
    "My grandmother who lives in Ohio sent a card.",
    "My grandmother, which lives in Ohio, sent a card.",
  ),
  relativeCombine(
    "Our car still runs well. It is twenty years old.",
    "Our car, which is twenty years old, still runs well.",
    ["Our car, which is twenty years old, still runs well."],
    "which",
    "Our car which is twenty years old still runs well.",
    "Our car, who is twenty years old, still runs well.",
  ),
  relativeCombine(
    "Dr. Lin called me. She works downtown.",
    "Dr. Lin, who works downtown, called me.",
    ["Dr. Lin, who works downtown, called me."],
    "who",
    "Dr. Lin who works downtown called me.",
    "Dr. Lin, which works downtown, called me.",
  ),
  relativeCombine(
    "The Nile flows north. It is very long.",
    "The Nile, which is very long, flows north.",
    ["The Nile, which is very long, flows north."],
    "which",
    "The Nile which is very long flows north.",
    "The Nile, who is very long, flows north.",
  ),
  relativeCombine(
    "Mr. Cole blew the whistle. He coaches our team.",
    "Mr. Cole, who coaches our team, blew the whistle.",
    ["Mr. Cole, who coaches our team, blew the whistle."],
    "who",
    "Mr. Cole who coaches our team blew the whistle.",
    "Mr. Cole, which coaches our team, blew the whistle.",
  ),
];

const appositiveCombine = (shown: string, right: string, ...wrong: readonly string[]): TypedItem => typed(shown, right, wrong);

const appositiveCombineBank: readonly TypedItem[] = [
  appositiveCombine(
    "Mars has two moons. It is the red planet.",
    "Mars, the red planet, has two moons.",
    "Mars the red planet has two moons.",
    "Mars, the red planet has two moons.",
    "Mars, it is the red planet, has two moons.",
  ),
  appositiveCombine(
    "Mr. Cole blew the whistle. He is our coach.",
    "Mr. Cole, our coach, blew the whistle.",
    "Mr. Cole our coach blew the whistle.",
    "Mr. Cole, our coach blew the whistle.",
    "Mr. Cole, he is our coach, blew the whistle.",
  ),
  appositiveCombine(
    "My aunt flew home. She is a pilot.",
    "My aunt, a pilot, flew home.",
    "My aunt a pilot flew home.",
    "My aunt, a pilot flew home.",
    "My aunt, she is a pilot, flew home.",
  ),
  appositiveCombine(
    "Lima sits near the sea. It is the capital of Peru.",
    "Lima, the capital of Peru, sits near the sea.",
    "Lima the capital of Peru sits near the sea.",
    "Lima, the capital of Peru sits near the sea.",
    "Lima, it is the capital of Peru, sits near the sea.",
  ),
  appositiveCombine(
    "Rex chased the ball. He is a small terrier.",
    "Rex, a small terrier, chased the ball.",
    "Rex a small terrier chased the ball.",
    "Rex, a small terrier chased the ball.",
    "Rex, he is a small terrier, chased the ball.",
  ),
  appositiveCombine(
    "Leo moved away. He is my best friend.",
    "Leo, my best friend, moved away.",
    "Leo my best friend moved away.",
    "Leo, my best friend moved away.",
    "Leo, he is my best friend, moved away.",
  ),
  appositiveCombine(
    "Cairo is huge. It is the capital of Egypt.",
    "Cairo, the capital of Egypt, is huge.",
    "Cairo the capital of Egypt is huge.",
    "Cairo, the capital of Egypt is huge.",
    "Cairo, it is the capital of Egypt, is huge.",
  ),
  appositiveCombine(
    "Ms. Reed ordered new books. She is the school librarian.",
    "Ms. Reed, the school librarian, ordered new books.",
    "Ms. Reed the school librarian ordered new books.",
    "Ms. Reed, the school librarian ordered new books.",
    "Ms. Reed, she is the school librarian, ordered new books.",
  ),
];

const appositiveEndBank: readonly TypedItem[] = [
  appositiveCombine(
    "We thanked Ana. She is the bus driver.",
    "We thanked Ana, the bus driver.",
    "We thanked Ana the bus driver.",
    "We thanked Ana, she is the bus driver.",
  ),
  appositiveCombine(
    "I read Holes. It is a novel about a camp.",
    "I read Holes, a novel about a camp.",
    "I read Holes a novel about a camp.",
    "I read Holes, it is a novel about a camp.",
  ),
  appositiveCombine(
    "We visited Dr. Lin. She is our family doctor.",
    "We visited Dr. Lin, our family doctor.",
    "We visited Dr. Lin our family doctor.",
    "We visited Dr. Lin, she is our family doctor.",
  ),
  appositiveCombine(
    "My class studied Mars. It is the red planet.",
    "My class studied Mars, the red planet.",
    "My class studied Mars the red planet.",
    "My class studied Mars, it is the red planet.",
  ),
  appositiveCombine(
    "They live in Lima. It is the capital of Peru.",
    "They live in Lima, the capital of Peru.",
    "They live in Lima the capital of Peru.",
    "They live in Lima, it is the capital of Peru.",
  ),
  appositiveCombine(
    "I called Leo. He is my best friend.",
    "I called Leo, my best friend.",
    "I called Leo my best friend.",
    "I called Leo, he is my best friend.",
  ),
  appositiveCombine(
    "She adopted Rex. He is a small terrier.",
    "She adopted Rex, a small terrier.",
    "She adopted Rex a small terrier.",
    "She adopted Rex, he is a small terrier.",
  ),
  appositiveCombine(
    "We met Mr. Cole. He is our new coach.",
    "We met Mr. Cole, our new coach.",
    "We met Mr. Cole our new coach.",
    "We met Mr. Cole, he is our new coach.",
  ),
];

const openingPhraseBank: readonly TypedItem[] = [
  typed(
    "We went home after the movie.",
    "After the movie, we went home.",
    ["After the movie we, went home.", "after the movie, we went home."],
    ["After the movie(,) we went home."],
  ),
  typed(
    "A heron waited for fish under the bridge.",
    "Under the bridge, a heron waited for fish.",
    ["Under the bridge a heron, waited for fish.", "Under the bridge, A heron waited for fish."],
    ["Under the bridge(,) a heron waited for fish."],
  ),
  typed(
    "The lights went out during the storm.",
    "During the storm, the lights went out.",
    ["During the storm the lights, went out.", "During the storm, The lights went out."],
    ["During the storm(,) the lights went out."],
  ),
  typed(
    "The twins set the table before dinner.",
    "Before dinner, the twins set the table.",
    ["Before dinner the twins, set the table.", "Before dinner, The twins set the table."],
    ["Before dinner(,) the twins set the table."],
  ),
  typed(
    "A new shop opened across the street.",
    "Across the street, a new shop opened.",
    ["Across the street a new shop, opened.", "Across the street, A new shop opened."],
    ["Across the street(,) a new shop opened."],
  ),
  typed(
    "My brother walks the dog in the morning.",
    "In the morning, my brother walks the dog.",
    ["In the morning my brother, walks the dog.", "In the morning, My brother walks the dog."],
    ["In the morning(,) my brother walks the dog."],
  ),
  typed(
    "The children built a fort behind the barn.",
    "Behind the barn, the children built a fort.",
    ["Behind the barn the children, built a fort.", "Behind the barn, The children built a fort."],
    ["Behind the barn(,) the children built a fort."],
  ),
  typed(
    "A wet umbrella dripped near the door.",
    "Near the door, a wet umbrella dripped.",
    ["Near the door a wet umbrella, dripped.", "Near the door, A wet umbrella dripped."],
    ["Near the door(,) a wet umbrella dripped."],
  ),
];

const beginWith = (word: string): Text => t(`Begin with *${word}*.`, `以 *${word}* 开头。`);

const openingParticipleBank: readonly TypedItem[] = [
  typed(
    "Sara laughed at the joke and dropped her fork.",
    "Laughing at the joke, Sara dropped her fork.",
    ["Laughing at the joke Sara dropped her fork.", "Laughing at the joke, her fork dropped."],
    undefined,
    beginWith("Laughing"),
  ),
  typed(
    "Mina held her breath and dived in.",
    "Holding her breath, Mina dived in.",
    ["Holding her breath Mina dived in.", "Holding her breath, Mina dived in"],
    undefined,
    beginWith("Holding"),
  ),
  typed(
    "Jo read the map and found the trail.",
    "Reading the map, Jo found the trail.",
    ["Reading the map Jo found the trail.", "Reading the map, the trail was found."],
    undefined,
    beginWith("Reading"),
  ),
  typed(
    "The children waved goodbye and boarded the bus.",
    "Waving goodbye, the children boarded the bus.",
    ["Waving goodbye the children boarded the bus.", "Waving goodbye, The children boarded the bus."],
    undefined,
    beginWith("Waving"),
  ),
  typed(
    "Ben listened to the music and tapped his foot.",
    "Listening to the music, Ben tapped his foot.",
    ["Listening to the music Ben tapped his foot.", "Listening to the music, his foot tapped."],
    undefined,
    beginWith("Listening"),
  ),
  typed(
    "The deer heard a noise and ran away.",
    "Hearing a noise, the deer ran away.",
    ["Hearing a noise the deer ran away.", "Hearing a noise, The deer ran away."],
    undefined,
    beginWith("Hearing"),
  ),
  typed(
    "Ivy studied her notes and got ready for the test.",
    "Studying her notes, Ivy got ready for the test.",
    ["Studying her notes Ivy got ready for the test.", "Studying her notes, the test got closer."],
    undefined,
    beginWith("Studying"),
  ),
  typed(
    "The crowd cheered loudly and stood up.",
    "Cheering loudly, the crowd stood up.",
    ["Cheering loudly the crowd stood up.", "Cheering loudly, The crowd stood up."],
    undefined,
    beginWith("Cheering"),
  ),
];

const fillerBank: readonly ChoiceItem[] = [
  ["due to the fact that", "because", ["although", "unless"]],
  ["at this point in time", "now", ["then", "later"]],
  ["in the event that", "if", ["although", "because"]],
  ["in order to", "to", ["for", "by"]],
  ["a large number of", "many", ["few", "some of"]],
  ["has the ability to", "can", ["should", "might"]],
  ["in spite of the fact that", "although", ["because", "if"]],
  ["on a daily basis", "daily", ["weekly", "once"]],
  ["until such time as", "until", ["since", "after"]],
  ["with regard to", "about", ["against", "without"]],
];

const wordyBank: readonly ChoiceItem[] = [
  [
    "",
    "We left early because it rained.",
    [
      "We left early due to the fact that it was raining outside.",
      "Because of the fact that it rained, we made the decision to leave early.",
    ],
  ],
  ["", "The red car stopped.", ["The car that was red in color came to a stop.", "The car, which was red, made a stop."]],
  [
    "",
    "I think the plan will work.",
    ["It is my personal opinion that the plan will work.", "I personally think, in my opinion, that the plan will work."],
  ],
  ["", "She decided to join.", ["She made the decision that she would join.", "She came to the decision to join."]],
  ["", "They met at noon.", ["They had a meeting at twelve noon.", "They met together at twelve noon."]],
  ["", "The story ends sadly.", ["The story comes to an end in a sad way.", "The end of the story is an ending that is sad."]],
  ["", "He often walks to work.", ["He frequently and often walks to his work on foot.", "He walks on foot to work on a frequent basis."]],
  ["", "The box is square.", ["The box is square in shape.", "The box has a shape that is square."]],
];

const activeBank: readonly TypedItem[] = [
  typed("The ball was kicked by Sam.", "Sam kicked the ball.", ["The ball kicked Sam.", "Sam was kicked by the ball."]),
  typed("The song was sung by the choir.", "The choir sang the song.", ["The song sang the choir.", "The choir sung the song."]),
  typed("The cake was eaten by the children.", "The children ate the cake.", [
    "The cake ate the children.",
    "The children eaten the cake.",
  ]),
  typed("The letter was written by Ana.", "Ana wrote the letter.", ["The letter wrote Ana.", "Ana written the letter."]),
  typed("The mouse was chased by the cat.", "The cat chased the mouse.", ["The mouse chased the cat.", "The cat was chased by the mouse."]),
  typed("The fire was put out by the crew.", "The crew put out the fire.", [
    "The fire put out the crew.",
    "The crew was put out by the fire.",
  ]),
  typed("The bridge was built by workers.", "Workers built the bridge.", ["The bridge built workers.", "Workers was built the bridge."]),
  typed("The test was graded by Mr. Kim.", "Mr. Kim graded the test.", ["The test graded Mr. Kim.", "Mr. Kim was graded by the test."]),
];

/** endMarkNot gives the feedback for a wrong end mark: what that mark is for. */
const endMarkNot = (wrong: string) => {
  const says: Readonly<Record<string, readonly [string, string]>> = {
    "?": [
      "A question mark ends a direct question, one that asks for an answer. This sentence does not ask one.",
      "问号用在直接提问、需要回答的句子末尾。这个句子并没有这样提问。",
    ],
    ".": [
      "A period ends a statement or a calm request, but this sentence asks a question or shows strong feeling.",
      "句号用在陈述句或语气平和的请求末尾，而这个句子是在提问或表达强烈的感情。",
    ],
    "!": [
      "An exclamation point shows strong feeling or a sharp warning, but this sentence is calm or asks something.",
      "感叹号表示强烈的感情或急切的警告，而这个句子语气平和，或者是在提问。",
    ],
    ",": ["A comma never ends a sentence: it only separates parts inside one.", "逗号不能结束句子：它只用来分隔句子内部的成分。"],
  };
  const said = says[wrong];
  if (!said) throw new Error(`no feedback for the mark ${wrong}`);
  return t(...said);
};

/** finishNot gives the feedback for an ending that does not do what the connecting word of the sentence promises. */
const finishNot = (wrong: string, _right: string, shown: string) => {
  const joiner = ["because", "but", "so"].find((w) => shown.includes(` ${w} ___`)) ?? "";
  if (/^(because|but|so)\b/.test(wrong))
    return t(
      `*${wrong}* starts with another joining word, but the sentence already has *${joiner}*.`,
      `*${wrong}* 又以一个连接词开头，可句子里已经有 *${joiner}* 了。`,
    );
  const says: Readonly<Record<string, readonly [string, string]>> = {
    because: [
      "*Because* needs a reason for the first part, and this ending gives none.",
      "*because* 需要说明前半句的原因，这个结尾没有给出原因。",
    ],
    but: [
      "*But* needs an ending that goes against what you might expect from the first part, and this one does not.",
      "*but* 需要一个出人意料、与前半句相对的结尾，这个结尾不是。",
    ],
    so: ["*So* needs a result of the first part, and this ending is not one.", "*so* 需要前半句的结果，这个结尾不是结果。"],
  };
  const said = says[joiner];
  if (!said) throw new Error(`no joining word in ${shown}`);
  return t(...said);
};

// More items, built from hand-written cores by deterministic templates.

/** capitalSentences are correct sentences with names; the items lower them and ask for the capitals back. */
const capitalSentences: readonly string[] = [
  "Our class visited the Grand Canyon in May.",
  "Uncle Ray lives in Chicago.",
  "We swam in Lake Erie last summer.",
  "My dog Biscuit sleeps all day.",
  "The Nile River flows through Egypt.",
  "Dr. Patel works at Lincoln Hospital.",
  "On Friday we went to Pine Park.",
  "Grandma flew from Mexico to Canada.",
  "I read a book about Abraham Lincoln.",
  "Mr. and Mrs. Kim own a bakery on Elm Street.",
  "The Pacific Ocean is very deep.",
  "My cousin Ava was born in June.",
  "We drove across the Golden Gate Bridge.",
  "Our school is called Maple Elementary.",
  "The parade is on Monday in Boston.",
  "Ms. Ortiz teaches us about Mars.",
  "Jake and I watched the game on Sunday.",
  "Mount Everest is in Asia.",
  "My family celebrates Thanksgiving in November.",
  "The Amazon River is in South America.",
  "Aunt Lucy sent a card from London.",
  "We hiked in Yellowstone National Park.",
];
const capitalMore: readonly TypedItem[] = capitalSentences.map((right) => {
  const low = right.toLowerCase();
  return fixed(low, right, cap(low), right.charAt(0).toLowerCase() + right.slice(1));
});

/** lists are a sentence opening, three items and an ending. */
const lists: readonly (readonly [lead: string, a: string, b: string, c: string, tail: string])[] = [
  ["Leo packed", "socks", "shirts", "a toothbrush", ""],
  ["The salad has", "lettuce", "tomatoes", "cucumbers", ""],
  ["We saw", "lions", "zebras", "giraffes", " at the zoo"],
  ["My favorite colors are", "green", "purple", "orange", ""],
  ["Ana plays", "soccer", "tennis", "basketball", ""],
  ["The bag held", "a map", "a compass", "a flashlight", ""],
  ["Grandpa grows", "beans", "peas", "carrots", " in his garden"],
  ["The puppy is", "small", "fluffy", "playful", ""],
  ["Bring", "a pencil", "an eraser", "a ruler", " to class"],
  ["We visited", "Rome", "Paris", "Madrid", " last year"],
  ["The cake needs", "flour", "eggs", "sugar", ""],
  ["Tom", "swept the floor", "washed the dishes", "took out the trash", ""],
  ["The kids", "ran", "jumped", "laughed", ""],
  ["Our flag has", "stars", "stripes", "a blue square", ""],
  ["She invited", "Mia", "Zoe", "Priya", " to her party"],
  ["The forest was", "dark", "quiet", "cold", ""],
  ["I need", "glue", "scissors", "colored paper", " for the project"],
  ["Dad bought", "milk", "bread", "cheese", " at the store"],
  ["The band played", "drums", "guitars", "a piano", ""],
  ["The birds", "sang", "chirped", "fluttered", " in the trees"],
  ["Ella read", "a poem", "a story", "a short play", ""],
  ["The trail crosses", "a creek", "a meadow", "a rocky hill", ""],
];
const seriesMore: readonly TypedItem[] = lists.map(([lead, a, b, c, tail]) =>
  typed(
    `${lead} ${a} ${b} and ${c}${tail}.`,
    `${lead} ${a}, ${b}, and ${c}${tail}.`,
    [`${lead} ${a} ${b} and ${c}${tail}.`, `${lead}, ${a}, ${b}, and ${c}${tail}.`],
    [`${lead} ${a}, ${b}(,) and ${c}${tail}.`],
  ),
);
const seriesOrNotMore: readonly ChoiceItem[] = lists.map(
  ([lead, a, b, c, tail], i): ChoiceItem =>
    i % 2 === 0
      ? ["", `${lead} ${a} and ${c}${tail}.`, [`${lead} ${a}, and ${c}${tail}.`, `${lead} ${a} and, ${c}${tail}.`]]
      : ["", `${lead} ${a}, ${b}, and ${c}${tail}.`, [`${lead}, ${a}, ${b}, and ${c}${tail}.`, `${lead} ${a} ${b} and ${c}${tail}.`]],
);

/** pairs are two complete thoughts and the conjunction that joins them. */
const pairs: readonly (readonly [word: string, first: string, second: string])[] = [
  ["so", "The tank was empty", "we stopped for gas"],
  ["but", "The puzzle was hard", "Lin solved it"],
  ["so", "My shoes were wet", "I left them by the fire"],
  ["but", "We waited an hour", "the bus never came"],
  ["so", "The baby was sleeping", "we whispered"],
  ["but", "The kitten is tiny", "she is very brave"],
  ["so", "The museum was free", "we stayed all day"],
  ["but", "The sun was out", "the air was cold"],
  ["so", "The tickets sold out", "we watched at home"],
  ["but", "Max studied hard", "he still felt nervous"],
  ["so", "Jo practiced every day", "her playing improved"],
  ["but", "The map was old", "it was still useful"],
  ["so", "The path was dark", "Dad brought a flashlight"],
  ["but", "I knocked loudly", "nobody opened the door"],
  ["so", "The cookies were hot", "we let them cool"],
  ["but", "The dress was pretty", "it cost too much"],
  ["so", "The wind was strong", "the kites flew high"],
  ["but", "The river looked calm", "the current was strong"],
  ["so", "Ben was hungry", "he made a sandwich"],
  ["but", "Ella wanted to swim", "the pool was closed"],
  ["so", "The library was quiet", "I finished my book"],
  ["but", "The team played well", "they lost the game"],
];
const andOr: readonly (readonly [word: string, first: string, second: string])[] = [
  ["and", "The music started", "everyone danced"],
  ["or", "You can take the stairs", "you can wait for the elevator"],
  ["and", "Mom cooked dinner", "Dad washed the dishes"],
  ["or", "We could visit the zoo", "we could go to the museum"],
  ["and", "The lights dimmed", "the show began"],
  ["or", "You can pay now", "you can pay later"],
  ["and", "Ruby drew the pictures", "Sam wrote the words"],
  ["or", "We can walk to the park", "we can ride our bikes"],
];
const expandMore: readonly TypedItem[] = pairs.slice(0, 20).map(([w, a, b]) => joined(w, a, b));
const coordinatingMore: readonly TypedItem[] = [...andOr, ...pairs.slice(8)].map(([w, a, b]) => joined(w, a, b));
const runOnOf = (i: number, a: string, b: string) => (i % 2 === 0 ? `${a} ${b}.` : `${a}, ${b}.`);
const periodFixMore: readonly TypedItem[] = pairs.map(([, a, b], i) => {
  const shown = runOnOf(i, a, b);
  return typed(shown, `${a}. ${cap(b)}.`, [shown, `${a}, ${b.toLowerCase()}.`, `${a}. ${b.toLowerCase()}.`]);
});
const conjunctionFixMore: readonly TypedItem[] = pairs.map(([w, a, b], i) => conjunctionFix(w, runOnOf(i + 1, a, b), a, b));

const subordinateMore: readonly TypedItem[] = [
  subordinated("although", "she smiled", "she was nervous"),
  subordinated("although", "the team kept playing", "it started to rain"),
  subordinated("when", "the crowd cheered", "the band came on"),
  subordinated("when", "I will call you", "I get home"),
  subordinated("if", "we can go sledding", "it snows tonight"),
  subordinated("if", "the plant will grow", "you water it"),
  subordinated("because", "the roads were closed", "the river flooded"),
  subordinated("because", "Tom stayed home", "he had a cold"),
  subordinated("while", "the dog slept", "we ate dinner"),
  subordinated("while", "Mom read the paper", "the kettle boiled"),
  subordinated("after", "we played outside", "we finished our homework"),
  subordinated("after", "the room was quiet", "the teacher spoke"),
  subordinated("before", "wash your hands", "you eat"),
  subordinated("before", "the birds sang", "the sun came up"),
  subordinated("unless", "the show will start at six", "it is canceled"),
  subordinated("unless", "you cannot enter", "you have a ticket"),
  subordinated("until", "the children played", "the sun went down"),
  subordinated("until", "keep stirring", "the soup boils"),
  subordinated("since", "we have not seen him", "he moved away"),
  subordinated("since", "Lena has been happier", "she joined the choir"),
];

/** causes are an effect and its cause, each written to fit after *because* or at the start of a sentence. */
const causes: readonly (readonly [effect: string, cause: string])[] = [
  ["the grass was wet", "it rained last night"],
  ["Mia wore a coat", "it was cold outside"],
  ["the plant died", "nobody watered it"],
  ["we laughed", "the clown fell over"],
  ["the puppy whined", "it wanted to go out"],
  ["the store closed early", "it was a holiday"],
  ["Leo got a prize", "he won the spelling bee"],
  ["the road was blocked", "a tree had fallen"],
  ["I was late", "my alarm did not ring"],
  ["the kids cheered", "school was canceled"],
  ["the milk went sour", "we left it out"],
  ["the dog barked", "a stranger knocked"],
  ["Ana was proud", "she finished the race"],
  ["the ice melted", "the sun came out"],
  ["we went inside", "the mosquitoes were biting"],
  ["the lights flickered", "the storm was strong"],
  ["Dad was tired", "he worked all night"],
  ["the class was quiet", "the test had started"],
  ["the bread was hard", "it was three days old"],
  ["my hands were sticky", "I ate a peach"],
  ["the river rose", "snow melted in the mountains"],
  ["we packed snacks", "the trip was long"],
  ["the beach was crowded", "the day was hot"],
];
const becauseMore: readonly TypedItem[] = causes.map(([effect, cause]) =>
  typed(
    `${cap(effect)}. ${cap(cause)}.`,
    `${cap(effect)} because ${cause}.`,
    [`${cap(cause)} because ${effect}.`, `${cap(effect)} because ${cause}`],
    [`${cap(effect)} because ${cause}.`, `Because ${cause}, ${effect}.`],
    use("because"),
  ),
);

const endMarkMore: readonly ChoiceItem[] = [
  ["Have you ever seen a whale___", "?", [".", ","]],
  ["Our class planted a tree today___", ".", ["?", ","]],
  ["Stop, the stove is hot___", "!", ["?", ","]],
  ["Please pass the bread___", ".", ["?", ","]],
  ["Who left the door open___", "?", [".", "!"]],
  ["What a beautiful sunset___", "!", ["?", ","]],
  ["He asked if the library was open___", ".", ["?", ","]],
  ["Is it going to snow tonight___", "?", [".", ","]],
  ["Get away from the edge___", "!", ["?", ","]],
  ["The museum opens at ten___", ".", ["?", "!"]],
  ["Why is the sky blue___", "?", [".", ","]],
  ["We won the championship___", "!", ["?", ","]],
  ["Tell me what you found___", ".", ["?", ","]],
  ["Would you like more soup___", "?", [".", ","]],
  ["Mom wondered where her keys were___", ".", ["?", ","]],
  ["Ouch, that really hurt___", "!", ["?", ","]],
  ["Turn left at the next corner___", ".", ["?", ","]],
  ["When does the movie start___", "?", [".", "!"]],
  ["The teacher asked who had finished___", ".", ["?", ","]],
  ["Look out for the falling rocks___", "!", ["?", ","]],
];

const finishMore: readonly ChoiceItem[] = [
  ["The game was canceled because ___", "the field was flooded.", ["the weather was perfect.", "so we went home."]],
  ["The game was canceled, but ___", "we still practiced indoors.", ["the field was flooded.", "because of the rain."]],
  ["The game was canceled, so ___", "we went to the movies instead.", ["the field was flooded.", "because it rained."]],
  ["Leo was tired because ___", "he stayed up late.", ["he slept for ten hours.", "so he took a nap."]],
  ["Leo was tired, but ___", "he finished his chores.", ["he stayed up late.", "because he ran a lot."]],
  ["Leo was tired, so ___", "he went to bed early.", ["he stayed up late.", "but he was busy."]],
  ["The ice cream melted because ___", "the freezer broke.", ["the freezer was very cold.", "so we drank it."]],
  ["The ice cream melted, but ___", "it still tasted good.", ["the freezer broke.", "because of the heat."]],
  ["The ice cream melted, so ___", "we made milkshakes.", ["the freezer broke.", "because it was warm."]],
  ["Ana was nervous because ___", "she had to give a speech.", ["she felt calm and ready.", "so she practiced."]],
  ["Ana was nervous, but ___", "she spoke clearly.", ["she had to give a speech.", "because of the crowd."]],
  ["Ana was nervous, so ___", "she practiced in front of a mirror.", ["she had to give a speech.", "but she was brave."]],
  ["The bus was late because ___", "there was a traffic jam.", ["the roads were empty.", "so we waited."]],
  ["The bus was late, but ___", "we still got to school on time.", ["there was a traffic jam.", "because of the snow."]],
  ["The bus was late, so ___", "we missed the first bell.", ["there was a traffic jam.", "because it snowed."]],
  ["Bees visit flowers because ___", "flowers have nectar.", ["flowers have no smell.", "so they make honey."]],
  ["Bees visit flowers, but ___", "they do not visit every kind.", ["flowers have nectar.", "because they are hungry."]],
  ["Bees visit flowers, so ___", "the flowers get pollinated.", ["flowers have nectar.", "because they need food."]],
];

/** sentenceWritingTopics are the topics of punctuating, joining and improving sentences. */
export const sentenceWritingTopics: readonly TopicDef[] = [
  {
    id: "capitals-and-end-punctuation",
    title: t("Capitals and End Punctuation", "大写和句末标点"),
    summary: t("Begin with a capital, end with the right mark, and capitalize names.", "句首大写，句末用对标点，专有名称大写。"),
    prerequisites: ["complete-sentences-and-fragments"],
    encompasses: [{ topic: "complete-sentences-and-fragments", weight: 0.3 }],
    xp: 8,
    knowledgePoints: [
      point(
        "capitals",
        t("Capital Letters", "大写字母"),
        t(
          "Every sentence begins with a capital letter. So do the names of people, places, days, months and languages, and titles such as *Dr.* before a name. The pronoun *I* is always a capital.\n\nCommon nouns are not capitalized: *a street*, but *Oak Street*.",
          "每个句子都以大写字母开头。人名、地名、星期、月份、语言，以及姓名前的 *Dr.* 这类称谓也要大写。代词 *I* 永远大写。\n\n普通名词不大写：*a street*，但 *Oak Street*。",
        ),
        typedGenerator(
          "sentence",
          t("Rewrite the sentence with the correct capital letters.", "用正确的大写字母改写句子。"),
          [...capitalBank, ...capitalMore],
          (right) => t(`**${right}** Capitalize the first word and every name.`, `**${right}** 第一个词和所有专有名称都要大写。`),
        ),
      ),
      point(
        "end-marks",
        t("End Marks", "句末标点"),
        t(
          "A statement or a request ends with a period. A direct question ends with a question mark. A strong feeling or a warning ends with an exclamation mark.\n\nA sentence that only reports a question is a statement: *She asked where I was going.*",
          "陈述句或请求以句号结尾。直接疑问句以问号结尾。强烈情感或警告以感叹号结尾。\n\n只是转述问题的句子是陈述句：*She asked where I was going.*",
        ),
        choiceGenerator(
          t("Which mark ends the sentence?", "句末应该用哪个标点？"),
          [...endMarkBank, ...endMarkMore],
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} Ask whether it states, asks or exclaims.`,
              `${shown.replace("___", `**${right}**`)} 判断它是陈述、提问还是感叹。`,
            ),
          endMarkNot,
        ),
      ),
    ],
  },
  {
    id: "commas-in-a-series",
    title: t("Commas in a Series", "并列项中的逗号"),
    summary: t("Separate three or more items with commas, but not two.", "用逗号分隔三项或更多，两项不用。"),
    prerequisites: ["coordinating-conjunctions"],
    encompasses: [{ topic: "coordinating-conjunctions", weight: 0.2 }],
    xp: 8,
    knowledgePoints: [
      point(
        "adding-series-commas",
        t("Adding the Commas", "添加逗号"),
        t(
          "Separate three or more items in a list with commas: *We bought apples, pears, and plums.* The comma before *and* is called the serial comma. Some writers leave it out, and both are accepted here.\n\nDo not put a comma before the first item or after the last one.",
          "用逗号分隔列表中的三项或更多：*We bought apples, pears, and plums.* *and* 前的逗号叫作连续逗号。有些作者会省略，这里两种都接受。\n\n第一项之前和最后一项之后都不加逗号。",
        ),
        typedGenerator(
          "sentence-pattern",
          t("Rewrite the sentence with commas in the list.", "改写句子，为列表加上逗号。"),
          [...seriesBank, ...seriesMore],
          (right) =>
            t(
              `**${right}** Commas separate the items and do not come before the first or after the last.`,
              `**${right}** 逗号分隔各项，不放在第一项之前或最后一项之后。`,
            ),
        ),
      ),
      point(
        "two-or-three",
        t("Two Items or Three", "两项还是三项"),
        t(
          "Two items joined by *and* or *or* take no comma: *Salt and pepper sat on the table.* A comma appears only when a list has three or more items.",
          "用 *and* 或 *or* 连接的两项不加逗号：*Salt and pepper sat on the table.* 只有三项或更多时才用逗号。",
        ),
        choiceGenerator(
          t("Which sentence uses commas correctly?", "哪个句子逗号用得正确？"),
          [...seriesOrNotBank, ...seriesOrNotMore],
          (right) =>
            t(`**${right}** Count the items: only three or more need commas.`, `**${right}** 数一数并列项：三项或更多才需要逗号。`),
          (wrong) =>
            wrong.includes(",")
              ? t(
                  `*${wrong}* puts a comma where none belongs: between only two items, or between a verb and what follows it.`,
                  `*${wrong}* 在不该加逗号的地方加了逗号：只有两项之间，或动词和后面的成分之间。`,
                )
              : t(
                  `*${wrong}* has no commas, but a list of three or more items needs them.`,
                  `*${wrong}* 没有逗号，但三项或更多的并列需要逗号。`,
                ),
        ),
      ),
    ],
  },
  {
    id: "expanding-with-because-but-so",
    title: t("Expanding with Because, But and So", "用 because、but、so 扩展句子"),
    summary: t("The same idea grows in three directions: reason, contrast and result.", "同一个想法朝三个方向扩展：原因、转折和结果。"),
    prerequisites: ["coordinating-conjunctions"],
    encompasses: [{ topic: "coordinating-conjunctions", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "matching-the-ending",
        t("Matching the Ending", "匹配结尾"),
        t(
          "A short idea can grow with one of three words, and each one demands a different ending. *Because* gives a reason. *But* gives a contrast or a surprise. *So* gives a result.\n\nThe plants died **because** nobody watered them. The plants died, **but** the seeds survived. The plants died, **so** we planted new ones.",
          "一个简短的想法可以用三个词扩展，每个词要求不同的结尾。*because* 给出原因。*but* 给出转折或意外。*so* 给出结果。\n\nThe plants died **because** nobody watered them. The plants died, **but** the seeds survived. The plants died, **so** we planted new ones.",
        ),
        choiceGenerator(
          t("Which ending fits the sentence?", "哪个结尾适合这个句子？"),
          [...finishBank, ...finishMore],
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)} The ending has to do what the connecting word promises.`,
              `${shown.replace("___", `**${right}**`)} 结尾必须符合连接词所表示的关系。`,
            ),
          finishNot,
        ),
      ),
      point(
        "joining-with-but-so",
        t("Joining with But and So", "用 but 和 so 连接"),
        t(
          "To join two complete sentences with *but* or *so*, drop the first period, add a comma and the word, and lower the capital of the second sentence unless it is a name: *The road was icy, so we drove slowly.*",
          "用 *but* 或 *so* 连接两个完整句子时，去掉第一个句号，加上逗号和连词，并把第二句的首字母改成小写（名字除外）：*The road was icy, so we drove slowly.*",
        ),
        typedGenerator(
          "sentence",
          t("Join the two sentences into one.", "把两个句子合并成一句。"),
          [...expandBank, ...expandMore],
          (right) => t(`**${right}** A comma comes before the connecting word.`, `**${right}** 连接词前要加逗号。`),
        ),
      ),
      point(
        "joining-with-because",
        t("Joining with Because", "用 because 连接"),
        t(
          "*Because* attaches the reason to the result: *We stayed inside because it was raining.* Make sure the reason follows the word. *It was raining because we stayed inside* reverses the meaning.\n\nIf you begin with *Because*, a comma follows the reason: *Because it was raining, we stayed inside.*",
          "*because* 把原因接到结果上：*We stayed inside because it was raining.* 要确保原因紧跟这个词。*It was raining because we stayed inside* 把意思弄反了。\n\n如果以 *Because* 开头，原因之后要加逗号：*Because it was raining, we stayed inside.*",
        ),
        typedGenerator(
          "sentence-pattern",
          t("Join the two sentences into one.", "把两个句子合并成一句。"),
          [...becauseBank, ...becauseMore],
          (right) => t(`**${right}** The word *because* comes right before the reason.`, `**${right}** *because* 紧接在原因之前。`),
        ),
      ),
    ],
  },
  {
    id: "combining-with-conjunctions",
    title: t("Combining with Conjunctions", "用连词合并句子"),
    summary: t("Join short sentences with the conjunction that states their relationship.", "用能表明关系的连词把短句合并起来。"),
    prerequisites: ["subordinating-conjunctions", "expanding-with-because-but-so"],
    encompasses: [
      { topic: "subordinating-conjunctions", weight: 0.5 },
      { topic: "expanding-with-because-but-so", weight: 0.3 },
    ],
    xp: 12,
    knowledgePoints: [
      point(
        "combining-coordinating",
        t("With a Coordinating Conjunction", "用并列连词"),
        t(
          "When two sentences carry equal weight, join them with a comma and *and, but, or* or *so*. The two sentences keep their order and all their words: *The bell rang, and the students left.*",
          "两个句子分量相等时，用逗号加 *and, but, or* 或 *so* 连接。两句保持顺序，也保留所有词：*The bell rang, and the students left.*",
        ),
        typedGenerator(
          "sentence",
          t("Join the two sentences into one.", "把两个句子合并成一句。"),
          [...coordinatingBank, ...coordinatingMore],
          (right) =>
            t(`**${right}** A comma and a conjunction join the two complete sentences.`, `**${right}** 用逗号加连词连接两个完整句子。`),
        ),
      ),
      point(
        "combining-subordinating",
        t("With a Subordinating Conjunction", "用从属连词"),
        t(
          "A subordinating conjunction makes one idea depend on the other. Put the word before the idea it belongs to, and choose either order: *She kept running although the hill was steep*, or *Although the hill was steep, she kept running.*\n\nOnly the second order takes a comma.",
          "从属连词让一个意思依赖另一个。把这个词放在它所属的意思之前，两种顺序都可以：*She kept running although the hill was steep*，或 *Although the hill was steep, she kept running.*\n\n只有第二种顺序要加逗号。",
        ),
        typedGenerator(
          "sentence-pattern",
          t("Join the two sentences into one. The conjunction goes with the second sentence.", "把两个句子合并成一句。连词属于第二句。"),
          [...conjunctionBank, ...subordinateMore],
          (right) =>
            t(
              `**${right}** The conjunction opens the dependent clause, and that clause takes a comma if it comes first.`,
              `**${right}** 连词引导从句；从句在前时要加逗号。`,
            ),
        ),
      ),
    ],
  },
  {
    id: "fixing-run-ons",
    title: t("Fixing Run-ons", "修改连写句"),
    summary: t("Repair run-ons and comma splices with a period or a conjunction.", "用句号或连词修改连写句和逗号拼接。"),
    prerequisites: ["run-ons-and-comma-splices"],
    encompasses: [{ topic: "run-ons-and-comma-splices", weight: 0.5 }],
    xp: 10,
    knowledgePoints: [
      point(
        "fixing-with-a-period",
        t("With a Period", "用句号"),
        t(
          "The simplest repair is to make two sentences. Find where the first complete sentence ends, put a period there, and begin the next with a capital: *The sun set. We drove home.*",
          "最简单的修改是分成两句。找到第一个完整句子结束的地方，加上句号，下一句以大写字母开头：*The sun set. We drove home.*",
        ),
        typedGenerator(
          "sentence",
          t("Rewrite this as two sentences.", "把它改写成两个句子。"),
          [...periodFixBank, ...periodFixMore],
          (right) =>
            t(
              `**${right}** Each complete sentence now has its own capital and period.`,
              `**${right}** 每个完整句子现在都有自己的大写字母和句号。`,
            ),
        ),
      ),
      point(
        "fixing-with-a-conjunction",
        t("With a Comma and a Conjunction", "用逗号加连词"),
        t(
          "To keep one sentence and show how the ideas relate, put a comma and a conjunction between them: *The test was hard, but I finished it anyway.* A comma alone is not enough, and neither is a conjunction alone.",
          "如果要保持一句话并表明意思间的关系，就在中间加逗号和连词：*The test was hard, but I finished it anyway.* 只有逗号不够，只有连词也不够。",
        ),
        typedGenerator(
          "sentence",
          t("Rewrite this as one correct sentence.", "把它改写成一个正确的句子。"),
          [...conjunctionFixBank, ...conjunctionFixMore],
          (right) => t(`**${right}** The comma and the conjunction work together.`, `**${right}** 逗号和连词要一起使用。`),
        ),
      ),
    ],
  },
  {
    id: "combining-with-relative-clauses",
    title: t("Combining with Relative Clauses", "用关系从句合并句子"),
    summary: t("Turn one sentence into a clause that describes a noun in another.", "把一个句子变成修饰另一句中名词的从句。"),
    prerequisites: ["relative-clauses", "combining-with-conjunctions"],
    encompasses: [
      { topic: "relative-clauses", weight: 0.5 },
      { topic: "combining-with-conjunctions", weight: 0.2 },
    ],
    xp: 12,
    knowledgePoints: [
      point(
        "clauses-that-identify",
        t("Clauses That Identify", "限定性从句"),
        t(
          "When the second sentence tells which one, replace its pronoun with *who* or *that* and place it right after the noun: *The boy plays drums. He lives next door* becomes *The boy who lives next door plays drums.*\n\nDrop the old pronoun: not *who he lives*, and not *that Mia baked it*. No commas are needed, because the clause is needed to identify the noun.",
          "第二句说明“哪一个”时，把其中的代词换成 *who* 或 *that*，放在名词之后：*The boy plays drums. He lives next door* 变成 *The boy who lives next door plays drums.*\n\n要去掉原来的代词：不是 *who he lives*，也不是 *that Mia baked it*。不需要逗号，因为从句是确定名词所必需的。",
        ),
        typedGenerator("sentence-pattern", t("Join the two sentences into one.", "把两个句子合并成一句。"), whoCombineBank, (right) =>
          t(
            `**${right}** The clause sits right after the noun it describes, and the old pronoun is gone.`,
            `**${right}** 从句紧跟所修饰的名词，原来的代词已去掉。`,
          ),
        ),
      ),
      point(
        "clauses-that-add",
        t("Clauses That Add Information", "补充信息的从句"),
        t(
          "When the noun is already clear, the clause only adds information. Set it off with two commas, and use *who* for people or *which* for things: *My coat, which is very old, keeps me warm.* *That* does not work here.",
          "名词已经明确时，从句只是补充信息。用两个逗号把它隔开，人用 *who*，物用 *which*：*My coat, which is very old, keeps me warm.* 这里不能用 *that*。",
        ),
        typedGenerator("sentence", t("Join the two sentences into one.", "把两个句子合并成一句。"), whichCombineBank, (right) =>
          t(`**${right}** Two commas set off the added information.`, `**${right}** 用两个逗号隔开补充信息。`),
        ),
      ),
    ],
  },
  {
    id: "combining-with-appositives",
    title: t("Combining with Appositives", "用同位语合并句子"),
    summary: t("Fold a sentence that renames a noun into a short phrase beside it.", "把为名词换说法的句子压缩成紧挨它的短语。"),
    prerequisites: ["appositives", "combining-with-relative-clauses"],
    encompasses: [
      { topic: "appositives", weight: 0.5 },
      { topic: "combining-with-relative-clauses", weight: 0.2 },
    ],
    xp: 10,
    knowledgePoints: [
      point(
        "folding-into-an-appositive",
        t("Folding a Sentence In", "把句子压缩进去"),
        t(
          "A second sentence of the form *He is our coach* can shrink to a phrase. Remove *He is*, place the rest after the noun, and set it off with commas: *Mr. Cole blew the whistle. He is our coach* becomes *Mr. Cole, our coach, blew the whistle.*",
          "*He is our coach* 这种形式的第二句可以压缩成短语。去掉 *He is*，把其余部分放在名词之后，并用逗号隔开：*Mr. Cole blew the whistle. He is our coach* 变成 *Mr. Cole, our coach, blew the whistle.*",
        ),
        typedGenerator(
          "sentence",
          t("Join the two sentences into one with an appositive.", "用同位语把两个句子合并成一句。"),
          appositiveCombineBank,
          (right) =>
            t(
              `**${right}** The phrase renames the noun, with a comma on each side.`,
              `**${right}** 短语为名词换了个说法，两边各有一个逗号。`,
            ),
        ),
      ),
      point(
        "appositive-at-the-end",
        t("At the End of a Sentence", "放在句末"),
        t(
          "When the noun being renamed ends the sentence, the appositive follows it with a single comma: *We thanked Ana, the bus driver.* There is nothing after it, so no second comma is needed.",
          "被换说法的名词位于句末时，同位语跟在它后面，只用一个逗号：*We thanked Ana, the bus driver.* 后面没有内容，所以不需要第二个逗号。",
        ),
        typedGenerator(
          "sentence",
          t("Join the two sentences into one with an appositive.", "用同位语把两个句子合并成一句。"),
          appositiveEndBank,
          (right) =>
            t(`**${right}** One comma sets off an appositive that ends the sentence.`, `**${right}** 位于句末的同位语只用一个逗号隔开。`),
        ),
      ),
    ],
  },
  {
    id: "varying-sentence-openings",
    title: t("Varying Sentence Openings", "变换句子开头"),
    summary: t("Begin some sentences with a phrase instead of the subject.", "有些句子不用主语开头，而用短语开头。"),
    prerequisites: ["prepositional-phrases", "participial-phrases"],
    encompasses: [
      { topic: "prepositional-phrases", weight: 0.2 },
      { topic: "participial-phrases", weight: 0.2 },
    ],
    xp: 10,
    knowledgePoints: [
      point(
        "opening-with-a-phrase",
        t("Opening with a Prepositional Phrase", "用介词短语开头"),
        t(
          "Sentences that all begin with the subject become monotonous. Move a phrase that says when or where to the front, followed by a comma, and lower the capital of the old first word: *We went home after the movie* becomes *After the movie, we went home.*",
          "全都以主语开头的句子会显得单调。把表示时间或地点的短语移到句首，后面加逗号，并把原来第一个词改成小写：*We went home after the movie* 变成 *After the movie, we went home.*",
        ),
        typedGenerator(
          "sentence-pattern",
          t("Rewrite the sentence so that it opens with its phrase of time or place.", "改写句子，让表示时间或地点的短语位于句首。"),
          openingPhraseBank,
          (right) =>
            t(`**${right}** The meaning is the same, and the sentence opens differently.`, `**${right}** 意思不变，只是开头不同。`),
        ),
      ),
      point(
        "opening-with-a-participle",
        t("Opening with a Participial Phrase", "用分词短语开头"),
        t(
          "When one subject does two actions, the first can become an opening phrase: *Sara laughed at the joke and dropped her fork* becomes *Laughing at the joke, Sara dropped her fork.*\n\nThe doer of the action must come right after the comma.",
          "同一个主语做两个动作时，第一个动作可以变成开头的短语：*Sara laughed at the joke and dropped her fork* 变成 *Laughing at the joke, Sara dropped her fork.*\n\n动作的发出者必须紧跟逗号。",
        ),
        typedGenerator("sentence", t("Rewrite the sentence as told.", "按要求改写句子。"), openingParticipleBank, (right) =>
          t(`**${right}** The doer of the action follows the comma.`, `**${right}** 动作的发出者紧跟逗号。`),
        ),
      ),
    ],
  },
  {
    id: "cutting-wordiness",
    title: t("Cutting Wordiness", "删减冗词"),
    summary: t("Say the same thing in fewer words.", "用更少的词表达同样的意思。"),
    prerequisites: ["active-and-passive-voice"],
    encompasses: [{ topic: "active-and-passive-voice", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "replacing-filler",
        t("Replacing Long Phrases", "替换冗长短语"),
        t(
          "Many long phrases mean the same as one short word. *Due to the fact that* means *because*, and *at this point in time* means *now*. Use the short word unless the long one adds something.",
          "许多冗长的短语和一个短词意思相同。*due to the fact that* 就是 *because*，*at this point in time* 就是 *now*。除非长的表达确有所增，否则用短词。",
        ),
        choiceGenerator(
          t("Which word can replace this phrase?", "哪个词可以替换这个短语？"),
          fillerBank,
          (right, shown) =>
            t(
              `*${shown}* means **${right}**. One word that says the same thing makes the sentence shorter and clearer.`,
              `*${shown}* 的意思是 **${right}**。用一个意思相同的词，句子更短也更清楚。`,
            ),
          (wrong, _right, shown) =>
            t(
              `*${wrong}* is short, but it does not mean the same as *${shown}*. A plain word must keep the meaning.`,
              `*${wrong}* 虽然简短，但意思和 *${shown}* 不同。简洁的词必须保留原意。`,
            ),
        ),
      ),
      point(
        "cutting-sentences",
        t("Cutting Repetition", "去掉重复"),
        t(
          "Cut words that repeat what is already clear. *Red in color* says *red* twice, since red is a color. *Square in shape* and *personal opinion* do the same.\n\nThe tightest version keeps all the meaning and adds nothing.",
          "删掉重复已明确内容的词。*red in color* 其实说了两次 *red*，因为红色本来就是颜色。*square in shape* 和 *personal opinion* 也是如此。\n\n最精练的版本保留全部意思，不多加任何内容。",
        ),
        choiceGenerator(
          t("Which sentence says it most directly?", "哪个句子表达得最直接？"),
          wordyBank,
          (right) => t(`**${right}** It keeps the meaning and drops the extra words.`, `**${right}** 它保留了意思，去掉了多余的词。`),
          (wrong) =>
            t(
              `*${wrong}* still has extra words that add no meaning: an idea said twice, or a long phrase for a short word.`,
              `*${wrong}* 仍有不增加意思的多余词语：同一个意思说了两遍，或用长短语代替短词。`,
            ),
        ),
      ),
      point(
        "active-is-shorter",
        t("Making It Active", "改为主动"),
        t(
          "The passive usually takes more words than the active. Rewriting with the doer as the subject is often the quickest way to shorten a sentence: *The ball was kicked by Sam* becomes *Sam kicked the ball.*",
          "被动句通常比主动句用词更多。让动作发出者作主语，往往是缩短句子最快的办法：*The ball was kicked by Sam* 变成 *Sam kicked the ball.*",
        ),
        typedGenerator("sentence", t("Rewrite the sentence in the active voice.", "把句子改写成主动语态。"), activeBank, (right) =>
          t(`**${right}** The doer is now the subject, and the sentence is shorter.`, `**${right}** 动作发出者成为主语，句子也更短了。`),
        ),
      ),
    ],
  },
];
