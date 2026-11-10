// Mechanics: the commas that set off the start of a sentence or a name, and the punctuation of dialogue.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typed, typedGenerator } from "@ga/subject-english";

const fixed = (shown: string, right: string, ...wrong: readonly string[]): TypedItem => typed(shown, right, wrong);

const introWordBank: readonly TypedItem[] = [
  fixed("Yes I finished my homework.", "Yes, I finished my homework.", "Yes I finished my homework.", "Yes, I, finished my homework."),
  fixed(
    "However the game was canceled.",
    "However, the game was canceled.",
    "However the game was canceled.",
    "However the game, was canceled.",
  ),
  fixed(
    "Well we can try again tomorrow.",
    "Well, we can try again tomorrow.",
    "Well we can try again tomorrow.",
    "Well we, can try again tomorrow.",
  ),
  fixed(
    "No the store is closed today.",
    "No, the store is closed today.",
    "No the store is closed today.",
    "No the store, is closed today.",
  ),
  fixed("Finally the bus arrived.", "Finally, the bus arrived.", "Finally the bus arrived.", "Finally the bus, arrived."),
  fixed("Sadly our cat ran away.", "Sadly, our cat ran away.", "Sadly our cat ran away.", "Sadly our, cat ran away."),
  fixed("Oh I forgot my keys.", "Oh, I forgot my keys.", "Oh I forgot my keys.", "Oh I, forgot my keys."),
  fixed("First wash your hands.", "First, wash your hands.", "First wash your hands.", "First wash, your hands."),
  fixed("Luckily nobody was hurt.", "Luckily, nobody was hurt.", "Luckily nobody was hurt.", "Luckily nobody, was hurt."),
  fixed(
    "Meanwhile the soup grew cold.",
    "Meanwhile, the soup grew cold.",
    "Meanwhile the soup grew cold.",
    "Meanwhile the soup, grew cold.",
  ),
];

const introPhraseBank: readonly ChoiceItem[] = [
  [
    "Where does the comma go?",
    "After a long day at the beach, we were tired.",
    ["After a long day, at the beach we were tired.", "After a long day at the beach we, were tired."],
  ],
  [
    "Where does the comma go?",
    "At the end of the hallway, there is a door.",
    ["At the end, of the hallway there is a door.", "At the end of the hallway there, is a door."],
  ],
  [
    "Where does the comma go?",
    "During the first week of school, I met my best friend.",
    ["During the first week, of school I met my best friend.", "During the first week of school I, met my best friend."],
  ],
  [
    "Where does the comma go?",
    "Before the start of the race, the runners stretched.",
    ["Before the start, of the race the runners stretched.", "Before the start of the race the runners, stretched."],
  ],
  [
    "Where does the comma go?",
    "Under the old wooden bridge, a troll was sleeping.",
    ["Under the old, wooden bridge a troll was sleeping.", "Under the old wooden bridge a troll, was sleeping."],
  ],
  [
    "Where does the comma go?",
    "On the top shelf of the closet, you will find a box.",
    ["On the top shelf, of the closet you will find a box.", "On the top shelf of the closet you, will find a box."],
  ],
  [
    "Where does the comma go?",
    "Running as fast as she could, Lena caught the ball.",
    ["Running as fast, as she could Lena caught the ball.", "Running as fast as she could Lena, caught the ball."],
  ],
  [
    "Where does the comma go?",
    "Tired from the long walk, the dog fell asleep.",
    ["Tired from the long, walk the dog fell asleep.", "Tired from the long walk the dog, fell asleep."],
  ],
  [
    "Where does the comma go?",
    "In the middle of the night, the phone rang.",
    ["In the middle, of the night the phone rang.", "In the middle of the night the phone, rang."],
  ],
];

const addressBank: readonly TypedItem[] = [
  fixed("Sam please close the door.", "Sam, please close the door.", "Sam please close the door.", "Sam please, close the door."),
  fixed("Thank you Mom.", "Thank you, Mom.", "Thank you Mom.", "Thank, you Mom."),
  fixed("Can you help me Dad?", "Can you help me, Dad?", "Can you help me Dad?", "Can you, help me Dad?"),
  fixed(
    "Mia your coat is on the floor.",
    "Mia, your coat is on the floor.",
    "Mia your coat is on the floor.",
    "Mia your coat, is on the floor.",
  ),
  fixed(
    "I think Ben that you are right.",
    "I think, Ben, that you are right.",
    "I think Ben that you are right.",
    "I think, Ben that you are right.",
  ),
  fixed("Good morning class.", "Good morning, class.", "Good morning class.", "Good, morning class."),
  fixed("Look at this Grandpa.", "Look at this, Grandpa.", "Look at this Grandpa.", "Look, at this Grandpa."),
  fixed("Kids it is time for dinner.", "Kids, it is time for dinner.", "Kids it is time for dinner.", "Kids it is time, for dinner."),
  fixed("Are you ready Ms. Lee?", "Are you ready, Ms. Lee?", "Are you ready Ms. Lee?", "Are you, ready Ms. Lee?"),
  fixed("Yes Coach we are ready.", "Yes, Coach, we are ready.", "Yes Coach we are ready.", "Yes, Coach we are ready."),
];

const tagAfterBank: readonly TypedItem[] = [
  fixed(
    "I am hungry said Leo.",
    '"I am hungry," said Leo.',
    '"I am hungry", said Leo.',
    '"I am hungry." said Leo.',
    "I am hungry, said Leo.",
  ),
  fixed(
    "It is going to rain said Mom.",
    '"It is going to rain," said Mom.',
    '"It is going to rain", said Mom.',
    '"It is going to rain." said Mom.',
    "It is going to rain, said Mom.",
  ),
  fixed(
    "We won the game shouted Ava.",
    '"We won the game," shouted Ava.',
    '"We won the game", shouted Ava.',
    '"We won the game." shouted Ava.',
    "We won the game, shouted Ava.",
  ),
  fixed(
    "My dog likes carrots said Omar.",
    '"My dog likes carrots," said Omar.',
    '"My dog likes carrots", said Omar.',
    '"My dog likes carrots." said Omar.',
    "My dog likes carrots, said Omar.",
  ),
  fixed(
    "The library opens at nine said the guard.",
    '"The library opens at nine," said the guard.',
    '"The library opens at nine", said the guard.',
    '"The library opens at nine." said the guard.',
    "The library opens at nine, said the guard.",
  ),
  fixed(
    "I will be right back whispered Grace.",
    '"I will be right back," whispered Grace.',
    '"I will be right back", whispered Grace.',
    '"I will be right back." whispered Grace.',
    "I will be right back, whispered Grace.",
  ),
  fixed(
    "The soup is too hot said Dad.",
    '"The soup is too hot," said Dad.',
    '"The soup is too hot", said Dad.',
    '"The soup is too hot." said Dad.',
    "The soup is too hot, said Dad.",
  ),
  fixed(
    "Let us go to the park said Nina.",
    '"Let us go to the park," said Nina.',
    '"Let us go to the park", said Nina.',
    '"Let us go to the park." said Nina.',
    "Let us go to the park, said Nina.",
  ),
  fixed(
    "The bus is late said Mr. Diaz.",
    '"The bus is late," said Mr. Diaz.',
    '"The bus is late", said Mr. Diaz.',
    '"The bus is late." said Mr. Diaz.',
    "The bus is late, said Mr. Diaz.",
  ),
];

const tagBeforeBank: readonly TypedItem[] = [
  fixed(
    "Leo said I am hungry.",
    'Leo said, "I am hungry."',
    'Leo said, "I am hungry".',
    'Leo said "I am hungry."',
    'Leo said, "i am hungry."',
  ),
  fixed(
    "Mom said it is going to rain.",
    'Mom said, "It is going to rain."',
    'Mom said, "It is going to rain".',
    'Mom said "It is going to rain."',
    'Mom said, "it is going to rain."',
  ),
  fixed(
    "Ava shouted we won the game.",
    'Ava shouted, "We won the game."',
    'Ava shouted, "We won the game".',
    'Ava shouted "We won the game."',
    'Ava shouted, "we won the game."',
  ),
  fixed(
    "Omar said my dog likes carrots.",
    'Omar said, "My dog likes carrots."',
    'Omar said, "My dog likes carrots".',
    'Omar said "My dog likes carrots."',
    'Omar said, "my dog likes carrots."',
  ),
  fixed(
    "The guard said the library opens at nine.",
    'The guard said, "The library opens at nine."',
    'The guard said, "The library opens at nine".',
    'The guard said "The library opens at nine."',
    'The guard said, "the library opens at nine."',
  ),
  fixed(
    "Grace whispered I will be right back.",
    'Grace whispered, "I will be right back."',
    'Grace whispered, "I will be right back".',
    'Grace whispered "I will be right back."',
    'Grace whispered, "i will be right back."',
  ),
  fixed(
    "Dad said the soup is too hot.",
    'Dad said, "The soup is too hot."',
    'Dad said, "The soup is too hot".',
    'Dad said "The soup is too hot."',
    'Dad said, "the soup is too hot."',
  ),
  fixed(
    "Nina said let us go to the park.",
    'Nina said, "Let us go to the park."',
    'Nina said, "Let us go to the park".',
    'Nina said "Let us go to the park."',
    'Nina said, "let us go to the park."',
  ),
  fixed(
    "Mr. Diaz said the bus is late.",
    'Mr. Diaz said, "The bus is late."',
    'Mr. Diaz said, "The bus is late".',
    'Mr. Diaz said "The bus is late."',
    'Mr. Diaz said, "the bus is late."',
  ),
];

const questionQuoteBank: readonly ChoiceItem[] = [
  [
    "Which sentence is punctuated correctly?",
    '"Where are my shoes?" asked Ben.',
    ['"Where are my shoes," asked Ben.', '"Where are my shoes"? asked Ben.'],
  ],
  [
    "Which sentence is punctuated correctly?",
    '"Watch out!" yelled the coach.',
    ['"Watch out," yelled the coach!', '"Watch out"! yelled the coach.'],
  ],
  [
    "Which sentence is punctuated correctly?",
    'Kim asked, "Is it time to go?"',
    ['Kim asked, "Is it time to go"?', 'Kim asked, "Is it time to go."'],
  ],
  [
    "Which sentence is punctuated correctly?",
    '"Can I have a turn?" asked my sister.',
    ['"Can I have a turn," asked my sister.', '"Can I have a turn"? asked my sister.'],
  ],
  [
    "Which sentence is punctuated correctly?",
    '"That is amazing!" cried Ana.',
    ['"That is amazing," cried Ana!', '"That is amazing"! cried Ana.'],
  ],
  [
    "Which sentence is punctuated correctly?",
    'The teacher asked, "Who knows the answer?"',
    ['The teacher asked, "Who knows the answer"?', 'The teacher asked, "Who knows the answer."'],
  ],
  [
    "Which sentence is punctuated correctly?",
    '"What time is it?" asked Grandma.',
    ['"What time is it," asked Grandma.', '"What time is it"? asked Grandma.'],
  ],
  [
    "Which sentence is punctuated correctly?",
    '"Help!" shouted the man in the water.',
    ['"Help," shouted the man in the water!', '"Help"! shouted the man in the water.'],
  ],
  [
    "Which sentence is punctuated correctly?",
    'Max asked, "Did you see the game?"',
    ['Max asked, "Did you see the game"?', 'Max asked, "Did you see the game."'],
  ],
];

// More items, built from hand-written cores by deterministic templates.

const upper = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** introWords are an opening word and the sentence after it. */
const introWords: readonly (readonly [word: string, rest: string])[] = [
  ["Suddenly", "the lights went out."],
  ["Unfortunately", "we missed the bus."],
  ["Next", "add two cups of flour."],
  ["Besides", "the tickets were too expensive."],
  ["Afterward", "we went out for pizza."],
  ["Honestly", "I liked the first book better."],
  ["Surprisingly", "the shy puppy came to me."],
  ["Later", "Dad called from the airport."],
  ["Instead", "we played a board game."],
  ["Fortunately", "the rain stopped in time."],
  ["Wow", "that was a great catch."],
  ["Actually", "the party starts at six."],
  ["Okay", "let me try once more."],
  ["Second", "fold the paper in half."],
  ["Hey", "wait for me."],
  ["Eventually", "the baby fell asleep."],
  ["Usually", "the store opens at nine."],
  ["Thankfully", "the old bridge held."],
  ["Lastly", "clean up your desk."],
  ["Anyway", "the movie was fun."],
];
const introWordMore: readonly TypedItem[] = introWords.map(([w, rest]) => {
  const words = rest.split(" ");
  const k = words.length > 3 ? 2 : 1;
  const late = `${w} ${words.slice(0, k).join(" ")}, ${words.slice(k).join(" ")}`;
  return fixed(`${w} ${rest}`, `${w}, ${rest}`, `${w} ${rest}`, late);
});

/** introPhrases are an opening phrase in two parts, a subject and a predicate. */
const introPhrases: readonly (readonly [start: string, end: string, subject: string, predicate: string])[] = [
  ["After the soccer game", "on Saturday", "we", "ate pizza"],
  ["In the corner", "of the garden", "a rabbit", "nibbled lettuce"],
  ["Before the start", "of the play", "the actors", "waited backstage"],
  ["Along the edge", "of the river", "the ducks", "rested"],
  ["During the long ride", "to the city", "my brother", "fell asleep"],
  ["Behind the curtain", "on the stage", "a cat", "was hiding"],
  ["At the top", "of the hill", "the hikers", "stopped for lunch"],
  ["Near the end", "of the movie", "the hero", "found the map"],
  ["After a week", "of rain", "the sun", "finally came out"],
  ["Inside the box", "under the bed", "Maya", "kept her letters"],
  ["Smiling at the crowd", "from the stage", "the singer", "waved"],
  ["Covered in mud", "from head to toe", "the puppy", "ran inside"],
  ["On the first day", "of spring", "the children", "planted seeds"],
  ["Across the street", "from the school", "a new bakery", "opened"],
  ["With a loud crash", "of thunder", "the storm", "began"],
  ["Holding the rope", "with both hands", "Theo", "climbed the wall"],
  ["In the back", "of the closet", "Dad", "found his old guitar"],
  ["At the beginning", "of the lesson", "the teacher", "read a poem"],
  ["Under a pile", "of leaves", "the squirrel", "hid an acorn"],
  ["Excited about the trip", "to the coast", "the girls", "packed early"],
  ["Between the two tall trees", "in the park", "someone", "had hung a hammock"],
];
const introPhraseMore: readonly ChoiceItem[] = introPhrases.map(([a, b, s, p]) => [
  "Where does the comma go?",
  `${a} ${b}, ${s} ${p}.`,
  [`${a}, ${b} ${s} ${p}.`, `${a} ${b} ${s}, ${p}.`],
]);

const addressMore: readonly TypedItem[] = [
  fixed("Leo pass me the salt.", "Leo, pass me the salt.", "Leo pass me the salt.", "Leo pass, me the salt."),
  fixed("Thanks for the ride Aunt Jo.", "Thanks for the ride, Aunt Jo.", "Thanks for the ride Aunt Jo.", "Thanks, for the ride Aunt Jo."),
  fixed("Do you know the answer Kim?", "Do you know the answer, Kim?", "Do you know the answer Kim?", "Do you, know the answer Kim?"),
  fixed("Grandma look at my drawing.", "Grandma, look at my drawing.", "Grandma look at my drawing.", "Grandma look, at my drawing."),
  fixed(
    "Class please open your books.",
    "Class, please open your books.",
    "Class please open your books.",
    "Class please, open your books.",
  ),
  fixed("Hurry up Max.", "Hurry up, Max.", "Hurry up Max.", "Hurry, up Max."),
  fixed("Where are you going Lucy?", "Where are you going, Lucy?", "Where are you going Lucy?", "Where, are you going Lucy?"),
  fixed("Dr. Kim my arm still hurts.", "Dr. Kim, my arm still hurts.", "Dr. Kim my arm still hurts.", "Dr. Kim my arm, still hurts."),
  fixed(
    "I told you Nora that it would work.",
    "I told you, Nora, that it would work.",
    "I told you Nora that it would work.",
    "I told you, Nora that it would work.",
  ),
  fixed("Happy birthday Grandpa.", "Happy birthday, Grandpa.", "Happy birthday Grandpa.", "Happy, birthday Grandpa."),
  fixed("Team let's huddle up.", "Team, let's huddle up.", "Team let's huddle up.", "Team let's, huddle up."),
  fixed(
    "Can I borrow a pencil Mr. Ruiz?",
    "Can I borrow a pencil, Mr. Ruiz?",
    "Can I borrow a pencil Mr. Ruiz?",
    "Can I, borrow a pencil Mr. Ruiz?",
  ),
  fixed("Jake you left your hat.", "Jake, you left your hat.", "Jake you left your hat.", "Jake you, left your hat."),
  fixed("Good night Mom.", "Good night, Mom.", "Good night Mom.", "Good, night Mom."),
  fixed(
    "Listen Eva this is important.",
    "Listen, Eva, this is important.",
    "Listen Eva this is important.",
    "Listen, Eva this is important.",
  ),
  fixed(
    "Friends thank you for coming.",
    "Friends, thank you for coming.",
    "Friends thank you for coming.",
    "Friends thank, you for coming.",
  ),
  fixed("Is this your bag Owen?", "Is this your bag, Owen?", "Is this your bag Owen?", "Is this, your bag Owen?"),
  fixed(
    "No Rosa the bus leaves at eight.",
    "No, Rosa, the bus leaves at eight.",
    "No Rosa the bus leaves at eight.",
    "No, Rosa the bus leaves at eight.",
  ),
  fixed("Welcome back everyone.", "Welcome back, everyone.", "Welcome back everyone.", "Welcome, back everyone."),
  fixed("Please sit down Pablo.", "Please sit down, Pablo.", "Please sit down Pablo.", "Please, sit down Pablo."),
];

/** statements are spoken words, the speaking verb and the speaker. */
const statements: readonly (readonly [words: string, verb: string, speaker: string])[] = [
  ["The water is warm", "said", "Dad"],
  ["I lost my glove", "said", "Mia"],
  ["The bus is here", "called", "Mom"],
  ["This soup needs salt", "said", "the chef"],
  ["I can see the ocean", "shouted", "Leo"],
  ["My tooth is loose", "said", "Ruby"],
  ["We should leave soon", "whispered", "Ana"],
  ["The movie starts at seven", "said", "Grandpa"],
  ["I finished the puzzle", "announced", "Tom"],
  ["That dog is huge", "said", "Kai"],
  ["It is my turn", "said", "my brother"],
  ["The library closes at five", "said", "Ms. Hill"],
  ["I feel much better", "said", "Nora"],
  ["We need more paint", "said", "the artist"],
  ["The game is tied", "reported", "Sam"],
  ["My kite is stuck in the tree", "cried", "Zoe"],
  ["The cookies are ready", "called", "Aunt May"],
  ["I will carry the bags", "offered", "Ben"],
  ["The bridge is closed", "said", "the officer"],
  ["It was a great trip", "said", "Emma"],
  ["The puppy is asleep", "whispered", "Jonah"],
];
const tagAfterMore: readonly TypedItem[] = statements.map(([w, v, s]) =>
  fixed(`${w} ${v} ${s}.`, `"${w}," ${v} ${s}.`, `"${w}", ${v} ${s}.`, `"${w}." ${v} ${s}.`, `${w}, ${v} ${s}.`),
);
const tagBeforeMore: readonly TypedItem[] = statements.map(([w, v, s]) => {
  const lead = `${upper(s)} ${v}`;
  const low = w.startsWith("I ") ? `i${w.slice(1)}` : w[0]!.toLowerCase() + w.slice(1);
  return fixed(`${lead} ${w}.`, `${lead}, "${w}."`, `${lead}, "${w}".`, `${lead} "${w}."`, `${lead}, "${low}."`);
});

const asked: readonly (readonly [question: string, speaker: string])[] = [
  ["Is the pool open today", "Ella"],
  ["Who ate the last cookie", "Dad"],
  ["Can we stop for lunch", "my brother"],
  ["Where did you find that shell", "Mom"],
  ["How far is the lake", "Ravi"],
  ["May I sit here", "the new girl"],
  ["Why is the sky so dark", "Lily"],
];
const askedBefore: readonly (readonly [speaker: string, question: string])[] = [
  ["Leo", "Do you want to play"],
  ["The guide", "Has anyone been here before"],
  ["Grandpa", "Who wants pancakes"],
  ["My aunt", "Did you bring a jacket"],
  ["The driver", "Where are you going"],
  ["Nina", "Is this seat taken"],
  ["Coach Diaz", "Are you ready"],
];
const exclaimed: readonly (readonly [words: string, verb: string, speaker: string])[] = [
  ["Look at that rainbow", "shouted", "Theo"],
  ["We did it", "cheered", "the team"],
  ["Stop that bus", "yelled", "Dad"],
  ["What a surprise", "gasped", "Aunt Rosa"],
  ["Hooray", "cried", "the children"],
  ["Be careful", "warned", "the lifeguard"],
  ["I found it", "exclaimed", "Maya"],
];
const which = "Which sentence is punctuated correctly?";
const questionQuoteMore: readonly ChoiceItem[] = [
  ...asked.map(([q, s]): ChoiceItem => [which, `"${q}?" asked ${s}.`, [`"${q}," asked ${s}.`, `"${q}"? asked ${s}.`]]),
  ...askedBefore.map(([s, q]): ChoiceItem => [which, `${s} asked, "${q}?"`, [`${s} asked, "${q}"?`, `${s} asked, "${q}."`]]),
  ...exclaimed.map(([e, v, s]): ChoiceItem => [which, `"${e}!" ${v} ${s}.`, [`"${e}," ${v} ${s}!`, `"${e}"! ${v} ${s}.`]]),
];

/** mechanicsTopics are the topics of mechanics: introductory commas, commas of address, and dialogue. */
export const mechanicsTopics: readonly TopicDef[] = [
  {
    id: "commas-after-introductions",
    title: t("Commas After Introductions and Names", "引导语和称呼后的逗号"),
    summary: t(
      "Set off an opening word or phrase, and the name of someone spoken to, with commas.",
      "用逗号隔开句首的引导词或短语，以及称呼对方的名字。",
    ),
    prerequisites: ["capitals-and-end-punctuation", "prepositional-phrases"],
    encompasses: [
      { topic: "capitals-and-end-punctuation", weight: 0.2 },
      { topic: "prepositional-phrases", weight: 0.2 },
    ],
    xp: 10,
    knowledgePoints: [
      point(
        "introductory-words",
        t("Opening Words", "句首的引导词"),
        t(
          "A word such as *yes, no, well, oh, however, finally* or *luckily* that opens a sentence is followed by a comma: *Yes, I finished my homework.* The comma marks the pause before the main part of the sentence begins.",
          "*yes, no, well, oh, however, finally* 或 *luckily* 这类词放在句首时，后面要加逗号：*Yes, I finished my homework.* 逗号标出句子主体开始前的停顿。",
        ),
        typedGenerator(
          "sentence",
          t("Rewrite the sentence with the comma it needs.", "改写句子，加上需要的逗号。"),
          [...introWordBank, ...introWordMore],
          (right) => t(`**${right}** The comma follows the opening word.`, `**${right}** 逗号放在句首引导词之后。`),
        ),
      ),
      point(
        "introductory-phrases",
        t("Opening Phrases", "句首的短语"),
        t(
          "A longer phrase that opens a sentence, such as *After a long day at the beach* or *Running as fast as she could*, is followed by one comma where the phrase ends and the main sentence begins. Do not put the comma inside the phrase or after the subject.",
          "句首较长的短语，例如 *After a long day at the beach* 或 *Running as fast as she could*，要在短语结束、主句开始的地方加一个逗号。不要把逗号放在短语中间，也不要放在主语后面。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          [...introPhraseBank, ...introPhraseMore],
          (right) => t(`**${right}** The comma comes where the opening phrase ends.`, `**${right}** 逗号放在句首短语结束的地方。`),
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” puts the comma inside the opening phrase, splitting words that belong together. Find where the phrase ends and the main sentence begins.`,
                  `“${wrong}” 把逗号放在了句首短语中间，拆开了本该连在一起的词。找出短语在哪里结束、主句从哪里开始。`,
                )
              : t(
                  `“${wrong}” puts the comma after the subject, cutting it off from its verb. The comma belongs where the opening phrase ends, before the subject.`,
                  `“${wrong}” 把逗号放在了主语后面，把主语和它的动词隔开了。逗号应放在句首短语结束处、主语之前。`,
                ),
        ),
      ),
      point(
        "direct-address",
        t("Speaking to Someone", "称呼对方"),
        t(
          "When a sentence speaks to someone by name, the name is set off with commas: *Sam, please close the door.* *Thank you, Mom.* In the middle of a sentence, the name takes a comma on each side: *I think, Ben, that you are right.*",
          "句子直接称呼某人时，名字要用逗号隔开：*Sam, please close the door.* *Thank you, Mom.* 名字在句子中间时，两边都要加逗号：*I think, Ben, that you are right.*",
        ),
        typedGenerator(
          "sentence",
          t("Rewrite the sentence with the commas it needs.", "改写句子，加上需要的逗号。"),
          [...addressBank, ...addressMore],
          (right) =>
            t(`**${right}** The name of the person spoken to is set off with commas.`, `**${right}** 被称呼者的名字要用逗号隔开。`),
        ),
      ),
    ],
  },
  {
    id: "punctuating-dialogue",
    title: t("Punctuating Dialogue", "对话的标点"),
    summary: t(
      "Put a speaker's exact words in quotation marks, with the comma and end mark in the right place.",
      "把说话人的原话放进引号，并把逗号和句末标点放在正确位置。",
    ),
    prerequisites: ["capitals-and-end-punctuation"],
    encompasses: [{ topic: "capitals-and-end-punctuation", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "speaker-after",
        t("When the Speaker Comes After", "说话人在后"),
        t(
          'Quotation marks go around a speaker\'s exact words. When the words that name the speaker come after the quotation, a statement ends with a comma **inside** the closing quotation mark, not a period: *"I am hungry," said Leo.*',
          '引号要括住说话人的原话。当说明说话人的词放在引语之后时，陈述句末尾用逗号而不是句号，并且逗号要放在后引号的**里面**：*"I am hungry," said Leo.*',
        ),
        typedGenerator(
          "sentence",
          t("Rewrite the sentence with quotation marks and the comma.", "改写句子，加上引号和逗号。"),
          [...tagAfterBank, ...tagAfterMore],
          (right) => t(`**${right}** The comma goes inside the closing quotation mark.`, `**${right}** 逗号放在后引号里面。`),
        ),
      ),
      point(
        "speaker-before",
        t("When the Speaker Comes First", "说话人在前"),
        t(
          'When the speaker comes first, a comma follows the words that introduce the quotation. The quotation begins with a capital letter, and its end mark goes **inside** the closing quotation mark: *Leo said, "I am hungry."*',
          '说话人在前时，引出引语的词后面加逗号。引语以大写字母开头，句末标点放在后引号的**里面**：*Leo said, "I am hungry."*',
        ),
        typedGenerator(
          "sentence",
          t("Rewrite the sentence with a comma and quotation marks.", "改写句子，加上逗号和引号。"),
          [...tagBeforeBank, ...tagBeforeMore],
          (right) =>
            t(
              `**${right}** A comma introduces the quotation, which starts with a capital and ends inside the quotation marks.`,
              `**${right}** 用逗号引出引语，引语首字母大写，句末标点放在引号里面。`,
            ),
        ),
      ),
      point(
        "questions-and-exclamations",
        t("Questions and Exclamations", "疑问句和感叹句"),
        t(
          'A quoted question or exclamation keeps its own question mark or exclamation mark, inside the quotation marks, and takes no comma: *"Where are my shoes?" asked Ben.* *"Watch out!" yelled the coach.*',
          '被引用的疑问句或感叹句保留自己的问号或感叹号，放在引号里面，并且不再加逗号：*"Where are my shoes?" asked Ben.* *"Watch out!" yelled the coach.*',
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          [...questionQuoteBank, ...questionQuoteMore],
          (right) =>
            t(
              `**${right}** The question mark or exclamation mark stays inside the quotation marks.`,
              `**${right}** 问号或感叹号留在引号里面。`,
            ),
          (wrong) =>
            wrong.includes('"?') || wrong.includes('"!')
              ? t(
                  `“${wrong}” puts the end mark outside the quotation marks, yet it belongs to the speaker's own words.`,
                  `“${wrong}” 把句末标点放在了引号外面，可它属于说话人的原话。`,
                )
              : wrong.includes(',"')
                ? t(
                    `“${wrong}” gives the quoted words a comma, the mark for a plain statement, so the reader loses that they are a question or an exclamation.`,
                    `“${wrong}” 给引语用了逗号，那是普通陈述句的标点，读者就看不出它是疑问还是感叹。`,
                  )
                : t(
                    `“${wrong}” ends the quoted question with a period, so it no longer reads as a question.`,
                    `“${wrong}” 用句号结束被引用的问句，它读起来就不再是问句了。`,
                  ),
        ),
      ),
    ],
  },
];
