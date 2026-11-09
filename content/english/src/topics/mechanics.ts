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
          introWordBank,
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
        choiceGenerator(t("Choose the sentence.", "选择句子。"), introPhraseBank, (right) =>
          t(`**${right}** The comma comes where the opening phrase ends.`, `**${right}** 逗号放在句首短语结束的地方。`),
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
          addressBank,
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
          tagAfterBank,
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
          tagBeforeBank,
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
        choiceGenerator(t("Choose the sentence.", "选择句子。"), questionQuoteBank, (right) =>
          t(
            `**${right}** The question mark or exclamation mark stays inside the quotation marks.`,
            `**${right}** 问号或感叹号留在引号里面。`,
          ),
        ),
      ),
    ],
  },
];
