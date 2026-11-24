// Cambridge First Reading Part 5: multiple choice on a long text. Its questions most often ask what a word or phrase
// refers to and what the writer means or feels. Each short text here has three questions of each kind, four options
// each, and the wrong options are things the text does mention.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** Reference asks what a word refers to: the word, the phrase of the text it stands in, the right reading, three wrong ones, and the words that decide it. */
type Reference = readonly [word: string, phrase: string, right: string, wrong: readonly [string, string, string], evidence: string];

/** Meaning asks what the writer means or what the text says: the question, the right option, three wrong ones, and the words that decide it. */
type Meaning = readonly [question: string, right: string, wrong: readonly [string, string, string], evidence: string];

/** CloseText is a short text with three questions on reference and three on meaning. */
interface CloseText {
  readonly text: string;
  readonly references: readonly [Reference, Reference, Reference];
  readonly meanings: readonly [Meaning, Meaning, Meaning];
}

const texts: readonly CloseText[] = [
  {
    text: "When I took a summer job at my uncle's bakery, I pictured myself chatting to customers over the counter. My uncle had warned me about the early starts, but I had laughed it off. Instead of the counter, I spent my mornings in a hot back room, shaping dough before the sun came up. The work itself was not difficult; the hours were another matter. My alarm went off at half past three, and for the first week I could barely keep my eyes open. What kept me going was the head baker, Rosa. She never raised her voice, even when I dropped a whole tray of rolls, and she had a way of turning the dullest task into a race. By August I could shape a loaf faster than she could, or so she told me. I suspect she was being kind, but I was proud all the same.",
    references: [
      [
        "it",
        "I had laughed it off",
        "the uncle's warning about the early starts",
        ["the summer job", "the counter", "the hot back room"],
        "My uncle had warned me about the early starts",
      ],
      [
        "so",
        "or so she told me",
        "that the writer could shape a loaf faster than Rosa",
        ["that Rosa never raised her voice", "that the work was not difficult", "that the writer had dropped a tray of rolls"],
        "By August I could shape a loaf faster than she could, or so she told me",
      ],
      [
        "She",
        "She never raised her voice",
        "Rosa, the head baker",
        ["the writer's uncle", "a customer at the counter", "the writer's mother"],
        "What kept me going was the head baker, Rosa",
      ],
    ],
    meanings: [
      [
        'What does the writer mean by "the hours were another matter"?',
        "Getting up so early was hard.",
        ["The job was paid by the hour.", "The writer worked fewer hours than expected.", "The hours passed quickly."],
        "My alarm went off at half past three, and for the first week I could barely keep my eyes open",
      ],
      [
        "What does the writer say about Rosa?",
        "She stayed calm when the writer made mistakes.",
        [
          "She was faster than the writer all summer.",
          "She often raced against the other bakers.",
          "She was strict about the early starts.",
        ],
        "She never raised her voice, even when I dropped a whole tray of rolls",
      ],
      [
        'What does "I suspect she was being kind" suggest?',
        "The writer doubts being really faster than Rosa.",
        [
          "The writer thinks Rosa was unkind to others.",
          "The writer was disappointed with the summer.",
          "The writer knows Rosa wanted help next year.",
        ],
        "I suspect she was being kind, but I was proud all the same",
      ],
    ],
  },
  {
    text: "Five years ago, the library in the small town of Ashford started lending tools as well as books. The idea came from a librarian, Tom Price, who noticed that people kept asking where they could borrow a ladder. Today the collection includes drills, sewing machines and even a pressure washer, and it is used far more than anyone expected. Some local shopkeepers were worried at first that the scheme would hurt their business. In fact, the opposite has happened: people who borrow a tool often come back to buy one of their own once they know they will use it. Price admits that not everything has gone smoothly. Tools come back broken more often than books do, and repairing them takes up much of his week. Still, he has no plans to stop. 'A drill sitting in a cupboard is a waste,' he says. 'This way, one drill serves a whole street.'",
    references: [
      [
        "it",
        "it is used far more than anyone expected",
        "the collection of tools",
        ["the town of Ashford", "the pressure washer", "the library's books"],
        "Today the collection includes drills, sewing machines and even a pressure washer",
      ],
      [
        "the opposite",
        "the opposite has happened",
        "the scheme has helped local shops",
        ["people have stopped borrowing tools", "the library lends fewer books", "tools come back broken"],
        "people who borrow a tool often come back to buy one of their own",
      ],
      [
        "This way",
        "This way, one drill serves a whole street",
        "by lending tools from the library",
        ["by repairing broken tools", "by keeping drills in a cupboard", "by selling tools in local shops"],
        "'This way, one drill serves a whole street.'",
      ],
    ],
    meanings: [
      [
        "Why did the library start lending tools?",
        "A librarian saw that people needed to borrow them.",
        ["Shopkeepers asked the library to help.", "Fewer people were borrowing books.", "A local family gave the library a ladder."],
        "who noticed that people kept asking where they could borrow a ladder",
      ],
      [
        "What problem does Price mention?",
        "Repairing returned tools takes a lot of his time.",
        ["Too few people borrow the tools.", "Books are often returned damaged.", "Shopkeepers still complain about the scheme."],
        "repairing them takes up much of his week",
      ],
      [
        'What does Price mean by "A drill sitting in a cupboard is a waste"?',
        "Most people need their own tools only rarely.",
        ["Tools should be kept somewhere safer.", "Drills are too expensive to buy.", "The library has too many drills."],
        "'A drill sitting in a cupboard is a waste,' he says",
      ],
    ],
  },
  {
    text: "I learned to swim at the age of thirty-four, which is not something I tell many people. As a child I had always found an excuse to miss lessons, and later I felt I had left it too late. What changed my mind was my daughter. When she began lessons herself, she kept asking me to join her in the water, and I ran out of reasons to say no. The adult class I signed up for was full of people like me: a retired bus driver, two nurses, a man who had once fallen off a boat. Nobody laughed when I clung to the side of the pool, because they were all doing the same. Six months later I swam my first length without stopping. My daughter was less impressed than I had hoped. 'I did that ages ago,' she said.",
    references: [
      [
        "which",
        "which is not something I tell many people",
        "learning to swim at thirty-four",
        ["missing lessons as a child", "joining the adult class", "swimming a length without stopping"],
        "I learned to swim at the age of thirty-four, which is not something I tell many people",
      ],
      [
        "the same",
        "they were all doing the same",
        "clinging to the side of the pool",
        ["laughing at the writer", "swimming lengths without stopping", "taking lessons with their children"],
        "Nobody laughed when I clung to the side of the pool, because they were all doing the same",
      ],
      [
        "that",
        "I did that ages ago",
        "swim a length without stopping",
        ["join an adult class", "ask a parent to swim", "fall off a boat"],
        "Six months later I swam my first length without stopping",
      ],
    ],
    meanings: [
      [
        "Why did the writer finally learn to swim?",
        "The writer's daughter kept asking to swim together.",
        ["A doctor said swimming would help.", "Lessons had become cheaper.", "A friend from work suggested it."],
        "she kept asking me to join her in the water, and I ran out of reasons to say no",
      ],
      [
        "How did the writer feel in the adult class?",
        "At ease, because the others were beginners too.",
        [
          "Embarrassed, because the others laughed.",
          "Bored, because the lessons were too easy.",
          "Nervous, because the teacher was strict.",
        ],
        "Nobody laughed when I clung to the side of the pool",
      ],
      [
        'What does "My daughter was less impressed than I had hoped" tell us?',
        "The daughter did not think it was a great achievement.",
        ["The daughter was proud of the writer.", "The daughter did not see the swim.", "The daughter wanted to stop her own lessons."],
        "'I did that ages ago,' she said",
      ],
    ],
  },
  {
    text: "Hedgehogs were once a common sight in British gardens, but their numbers have fallen sharply. To find out where they still live, a charity asked volunteers to put cameras in their gardens and send in the recordings. More than ten thousand people took part, which gave researchers far more information than they could have collected themselves. The results were surprising. Hedgehogs were more common in towns than in the countryside, where large fields offer them little shelter. The charity now encourages people to cut small holes at the bottom of their fences. These allow hedgehogs, which may travel two kilometres in a night, to move from garden to garden. One volunteer, who had never seen a hedgehog in thirty years, recorded three on her first night. 'I had been sharing my garden with them all along,' she said.",
    references: [
      [
        "which",
        "which gave researchers far more information",
        "the fact that more than ten thousand people took part",
        ["the fall in hedgehog numbers", "the size of the gardens", "the holes in the fences"],
        "More than ten thousand people took part, which gave researchers far more information",
      ],
      [
        "These",
        "These allow hedgehogs",
        "small holes at the bottom of fences",
        ["large fields", "cameras in gardens", "the volunteers' recordings"],
        "cut small holes at the bottom of their fences",
      ],
      [
        "them",
        "sharing my garden with them all along",
        "hedgehogs",
        ["other volunteers", "the researchers", "her neighbours"],
        "recorded three on her first night",
      ],
    ],
    meanings: [
      [
        "What was surprising about the results?",
        "Hedgehogs were found more often in towns than in the country.",
        ["Hedgehog numbers had risen.", "Few people wanted to take part.", "Hedgehogs rarely leave one garden."],
        "Hedgehogs were more common in towns than in the countryside",
      ],
      [
        "Why are large fields bad for hedgehogs?",
        "They give hedgehogs little shelter.",
        ["They are too far from gardens.", "Farmers put fences around them.", "Cameras cannot record there."],
        "where large fields offer them little shelter",
      ],
      [
        "What does the volunteer's remark suggest?",
        "Hedgehogs had lived in her garden without her knowing.",
        ["She had kept hedgehogs as pets.", "She had watched hedgehogs for thirty years.", "She wanted to share her camera."],
        "who had never seen a hedgehog in thirty years, recorded three on her first night",
      ],
    ],
  },
  {
    text: "The first time I had to give a talk to more than a hundred people, I prepared for weeks. I wrote out every word, learned it by heart and practised in front of the mirror until I was sick of my own voice. On the day, none of it helped. Five minutes in, the projector failed, and with it went the slides I had planned to follow. For a moment I simply stood there. Then, because there was nothing else to do, I started talking to the audience as if they were friends in a café. To my surprise, they relaxed, and so did I. People asked more questions than at any talk I have given since. I still prepare carefully, but I no longer write out every word. A talk, I have learned, is a conversation, not a recital.",
    references: [
      [
        "it",
        "learned it by heart",
        "the written text of the talk",
        ["the mirror", "the projector", "the audience's questions"],
        "I wrote out every word, learned it by heart",
      ],
      [
        "none of it",
        "none of it helped",
        "the writer's weeks of preparation",
        ["the slides", "the café", "the questions from the audience"],
        "I prepared for weeks",
      ],
      [
        "so did I",
        "they relaxed, and so did I",
        "the writer relaxed too",
        ["the writer asked questions too", "the writer stopped talking too", "the writer left the stage too"],
        "To my surprise, they relaxed, and so did I",
      ],
    ],
    meanings: [
      [
        "Why did the writer start talking to the audience informally?",
        "There was no other choice after the projector failed.",
        ["The audience asked for a change.", "It had been the plan from the start.", "The talk was held in a café."],
        "because there was nothing else to do",
      ],
      [
        "How does the writer prepare for talks now?",
        "Carefully, but without a word-for-word script.",
        ["With more slides than before.", "Hardly at all.", "By practising in front of the mirror."],
        "I still prepare carefully, but I no longer write out every word",
      ],
      [
        'What does the writer mean by "a conversation, not a recital"?',
        "A good talk responds to the people listening.",
        ["A talk should be learned by heart.", "Audiences prefer short talks.", "Questions should wait until the end."],
        "A talk, I have learned, is a conversation, not a recital",
      ],
    ],
  },
  {
    text: "In a church hall on Saturday mornings, a group of volunteers fix things that other people would throw away: toasters, lamps, torn jackets, a child's bicycle. The repair café, as it is called, was started by Mei Lin, a retired engineer who could not bear to see working parts end up in a skip. Visitors do not simply hand over their broken things and leave. They sit beside the volunteer and watch, and often help, so that next time they may be able to do the job themselves. That, says Lin, is the real point. Not every repair succeeds. Some machines are made in such a way that they cannot be opened without breaking them, which she finds frustrating. Even so, about two-thirds of the items brought in go home working again.",
    references: [
      [
        "That",
        "That, says Lin, is the real point",
        "visitors learning to repair things themselves",
        ["fixing toasters and lamps", "keeping working parts out of the skip", "meeting in a church hall"],
        "so that next time they may be able to do the job themselves",
      ],
      [
        "they",
        "they cannot be opened without breaking them",
        "some machines",
        ["the visitors", "the volunteers", "the torn jackets"],
        "Some machines are made in such a way",
      ],
      [
        "which",
        "which she finds frustrating",
        "machines that cannot be opened without breaking them",
        ["visitors who leave their things", "items that go home working", "the cost of new parts"],
        "they cannot be opened without breaking them, which she finds frustrating",
      ],
    ],
    meanings: [
      [
        "Why did Mei Lin start the repair café?",
        "She hated seeing usable parts thrown away.",
        ["She needed money after retiring.", "The church asked her for help.", "She wanted to teach engineering at a school."],
        "who could not bear to see working parts end up in a skip",
      ],
      [
        "What do visitors to the café do?",
        "Stay and take part in the repair.",
        ["Leave their things and collect them later.", "Pay the volunteers by the hour.", "Bring their own tools from home."],
        "They sit beside the volunteer and watch, and often help",
      ],
      [
        "How successful are the repairs?",
        "Most items are repaired.",
        ["Only about a third are repaired.", "Every repair succeeds.", "Most machines cannot be opened."],
        "about two-thirds of the items brought in go home working again",
      ],
    ],
  },
  {
    text: "When we moved to Lisbon, I had studied Portuguese for a year and thought I was ready. I was not. People spoke far faster than the voices on my course, and they swallowed half their words. For weeks I pointed at things in shops rather than risk a sentence. It was the woman who ran the fruit stall near our flat who changed that. She refused to let me point. If I wanted three oranges, I had to ask for them, and if I got the sentence wrong, she made me say it again until I got it right. At the time I found her slightly terrifying. Looking back, I realise she taught me more than my course ever did. When we left, four years later, she gave me a bag of oranges and would not let me pay.",
    references: [
      [
        "that",
        "who changed that",
        "the writer's habit of pointing instead of speaking",
        ["the speed of people's speech", "the writer's Portuguese course", "the price of the fruit"],
        "For weeks I pointed at things in shops rather than risk a sentence",
      ],
      [
        "them",
        "I had to ask for them",
        "the three oranges",
        ["the shops", "the swallowed words", "the voices on the course"],
        "If I wanted three oranges, I had to ask for them",
      ],
      [
        "it",
        "she made me say it again",
        "the sentence asking for the fruit",
        ["the price of the oranges", "the name of the stall", "the writer's course"],
        "if I got the sentence wrong, she made me say it again",
      ],
    ],
    meanings: [
      [
        "What surprised the writer on arriving in Lisbon?",
        "People spoke much faster than on the course.",
        ["Few people in Lisbon spoke Portuguese.", "The shops did not sell fruit.", "The course had been too difficult."],
        "People spoke far faster than the voices on my course",
      ],
      [
        "How does the writer feel about the stall owner now?",
        "Grateful for what she taught.",
        ["Still a little afraid of her.", "Annoyed that she was so strict.", "Sorry never to have paid her."],
        "Looking back, I realise she taught me more than my course ever did",
      ],
      [
        "What does the final gift show?",
        "The stall owner had become fond of the writer.",
        ["The oranges were going bad.", "She wanted the writer to come back and pay.", "She gave all her customers free fruit."],
        "she gave me a bag of oranges and would not let me pay",
      ],
    ],
  },
  {
    text: "Two years ago, a design company in Manchester switched off its email server between seven in the evening and seven in the morning. Messages sent at night are simply held until the next day. The managers had noticed that staff who answered emails late were more tired and made more mistakes, yet nobody wanted to be the first to stop. A rule, they decided, would make the change easier for everyone. Not all clients liked the rule at first, especially those in other time zones. The company dealt with this by giving each client a phone number for real emergencies. In two years it has been used four times. Staff say they sleep better, and the number of people leaving the company has halved. 'We worried we would lose work,' says one manager. 'We have actually gained some.'",
    references: [
      [
        "this",
        "The company dealt with this",
        "some clients' dislike of the rule",
        ["staff working late", "the number of mistakes", "the cost of the server"],
        "Not all clients liked the rule at first",
      ],
      [
        "it",
        "it has been used four times",
        "the emergency phone number",
        ["the email server", "the rule", "the night-time messages"],
        "giving each client a phone number for real emergencies",
      ],
      ["some", "We have actually gained some", "work", ["staff", "sleep", "emails"], "'We worried we would lose work,' says one manager"],
    ],
    meanings: [
      [
        "Why did the managers make a rule?",
        "No one wanted to be the first to stop answering late.",
        ["Clients asked for one.", "The server was expensive to run at night.", "Managers wanted to receive fewer emails."],
        "yet nobody wanted to be the first to stop",
      ],
      [
        'What does "In two years it has been used four times" suggest?',
        "Clients rarely have real emergencies.",
        ["The phone number does not work.", "Clients do not know the number.", "Staff answer the phone every night."],
        "In two years it has been used four times",
      ],
      [
        "What has happened since the rule began?",
        "Fewer staff have left the company.",
        ["Staff work longer hours.", "The company has lost clients.", "Mistakes have doubled."],
        "the number of people leaving the company has halved",
      ],
    ],
  },
  {
    text: "My grandfather climbed the hill behind his village every Sunday for sixty years. When I was twelve, he finally agreed to take me. I expected an easy walk; he was seventy-five, after all. Within an hour I was out of breath, and he was waiting for me at every bend, pretending to admire the view. Near the top, he stopped beside a pile of stones and added one from his pocket. He had done this, he told me, every week since he was a boy, one stone for each climb. I tried to count them and gave up. On the way down, he let me lead. I realised years later that he had walked more slowly than usual so that I would not feel beaten. I added my own stone that day, and I add one every time I go back.",
    references: [
      [
        "this",
        "He had done this",
        "added a stone to the pile",
        ["climbed with a grandchild", "admired the view", "waited at every bend"],
        "he stopped beside a pile of stones and added one from his pocket",
      ],
      [
        "them",
        "I tried to count them",
        "the stones in the pile",
        ["the bends in the path", "the Sundays of sixty years", "the people of the village"],
        "one stone for each climb",
      ],
      [
        "one",
        "I add one every time I go back",
        "a stone",
        ["a climb", "a bend", "a Sunday"],
        "I added my own stone that day, and I add one every time I go back",
      ],
    ],
    meanings: [
      [
        "Why was the writer surprised on the climb?",
        "The grandfather was much fitter than expected.",
        ["The hill was smaller than expected.", "The grandfather would not wait.", "The view was disappointing."],
        "Within an hour I was out of breath",
      ],
      [
        'What does "pretending to admire the view" suggest?',
        "The grandfather was really waiting for the writer to catch up.",
        [
          "The grandfather did not like the view.",
          "The grandfather was too tired to go on.",
          "The grandfather wanted to take photographs.",
        ],
        "he was waiting for me at every bend",
      ],
      [
        "What did the writer understand years later?",
        "The grandfather had slowed down to spare the writer's feelings.",
        ["The grandfather had been ill that day.", "The writer had been the faster walker.", "The grandfather had wanted to be led."],
        "he had walked more slowly than usual so that I would not feel beaten",
      ],
    ],
  },
  {
    text: "On hot summer days, a black roof can reach eighty degrees, and the heat passes into the rooms below. In one southern city, the council offered to paint roofs white for free. A white roof reflects most of the sunlight that falls on it, and the rooms under it stay several degrees cooler. Households that took up the offer used their air conditioning less, which saved money and reduced the strain on the electricity network during heatwaves. The scheme has one drawback that its supporters admit. In winter, a white roof also reflects the weak sun, so homes may need a little more heating. In a city where summers are long and winters are mild, however, the council calculated that this matters far less. The paint needs renewing every ten years or so, and the council has promised to pay for that too.",
    references: [
      [
        "it",
        "the sunlight that falls on it",
        "a white roof",
        ["the room below", "the council", "the electricity network"],
        "A white roof reflects most of the sunlight that falls on it",
      ],
      [
        "this",
        "this matters far less",
        "the extra heating needed in winter",
        ["the cost of the paint", "the heat of a black roof", "the length of the summers"],
        "homes may need a little more heating",
      ],
      [
        "that",
        "the council has promised to pay for that too",
        "renewing the paint",
        ["the extra heating", "the air conditioning", "the electricity network"],
        "The paint needs renewing every ten years or so",
      ],
    ],
    meanings: [
      [
        "What drawback of the scheme does the text mention?",
        "Homes may need a little more heating in winter.",
        ["The paint is expensive.", "Rooms become too cold in summer.", "The roofs need painting every year."],
        "In winter, a white roof also reflects the weak sun",
      ],
      [
        "Why does the drawback matter less in this city?",
        "Its winters are mild and its summers long.",
        ["Most homes there have no heating.", "The council pays heating bills.", "White paint keeps heat in."],
        "In a city where summers are long and winters are mild",
      ],
      [
        "How did the scheme help the electricity network?",
        "There was less demand on it during heatwaves.",
        ["It produced more power in summer.", "It needed repairing less often.", "It cost the council less to run."],
        "reduced the strain on the electricity network during heatwaves",
      ],
    ],
  },
];

for (const c of texts) {
  for (const [word, phrase, , , evidence] of c.references) {
    if (!c.text.includes(phrase)) throw new Error(`the phrase of "${word}" is not in the text: ${phrase}`);
    if (!phrase.includes(word)) throw new Error(`"${word}" is not in its phrase: ${phrase}`);
    if (!c.text.includes(evidence)) throw new Error(`the evidence for "${word}" is not in the text: ${evidence}`);
  }
  for (const [question, , , evidence] of c.meanings) {
    if (!c.text.includes(evidence)) throw new Error(`the evidence for "${question}" is not in the text: ${evidence}`);
  }
}

/** end gives the period a quoted piece of evidence needs when it has no closing punctuation of its own. */
const end = (evidence: string) => (/[.!?'…]$/u.test(evidence) ? "" : ".");

const references: readonly SolvedChoice[] = interleave(
  texts.map((c) =>
    c.references.map(
      ([word, phrase, right, wrong, evidence]): SolvedChoice => ({
        shown: `${c.text}\n\n**What does "${word}" refer to in "${phrase}"?**`,
        right,
        wrong: [...wrong],
        whyNot: wrong.map((w) =>
          t(
            `Substituting "${w}" for "${word}" in "${phrase}" does not fit the grammar or meaning of the sentence in this context.`,
            `把“${w}”代入 "${phrase}" 中的 "${word}"，在语法或句意上都与当前语境不符。`,
          ),
        ),
        solution: t(
          `"${word}" refers to **${right}**. The text says: "${evidence}${end(evidence)}"\n\n**Check.** Replace "${word}" in "${phrase}" with **${right}** and confirm the sentence reads naturally and matches the text.`,
          `"${word}" 指的是 **${right}**。原文是："${evidence}${end(evidence)}"\n\n**检验。** 把 **${right}** 代回 "${phrase}" 中的 "${word}"，确认句子通顺且与原文意思一致。`,
        ),
      }),
    ),
  ),
);

const meanings: readonly SolvedChoice[] = interleave(
  texts.map((c) =>
    c.meanings.map(
      ([question, right, wrong, evidence]): SolvedChoice => ({
        shown: `${c.text}\n\n**${question}**`,
        right,
        wrong: [...wrong],
        whyNot: wrong.map((w) => {
          const clean = w.replace(/\.$/u, "");
          return t(
            `The passage does not support this claim ("${clean}")—re-read the sentences around the question's target.`,
            `原文并不支持“${clean}”这一说法——请重读题目对应处前后的句子。`,
          );
        }),
        solution: t(
          `**${right}** The text says: "${evidence}${end(evidence)}"\n\n**Check.** Verify that the quoted evidence says the same thing as the chosen answer, without adding anything the writer never claimed.`,
          `**${right}** 原文是："${evidence}${end(evidence)}"\n\n**检验。** 核对所引原文与所选答案表达的是同一个意思，且没有掺入作者未说过的内容。`,
        ),
      }),
    ),
  ),
);

/** closeReading is the Cambridge First topic of the two commonest questions of Reading Part 5. */
export const closeReading: TopicDef = examTopic({
  id: "fce-reading-closely",
  title: t("Reading Closely", "细读"),
  summary: t(
    "Cambridge First Reading Part 5 style: short texts with questions on what a word refers to and on what the writer means.",
    "剑桥 First 阅读第 5 部分风格：短文后的题目，问某个词指代什么，以及作者是什么意思。",
  ),
  intro: t(
    "In B2 First Reading Part 5, every distractor borrows real nouns from the passage—so a pronoun like *which* or a remark like *it was another matter* can only be solved by checking the exact surrounding lines, not by spotting familiar words.",
    "在 B2 First 阅读第 5 部分中，每个干扰项都会借用原文出现过的词——因此遇到 *which* 这类指代词或 *it was another matter* 这样的委婉表达，必须紧扣上下文原句核对，不能凭眼熟的词汇盲选。",
  ),
  strand: "reading",
  prerequisites: ["making-inferences"],
  encompasses: [{ topic: "making-inferences", weight: 0.2 }],
  xp: 10,
  points: [
    point(
      "fce-what-words-refer-to",
      t("What Words Refer To", "词语的指代"),
      t(
        "Words such as *it*, *this*, *that*, *which*, *them*, *one* and *so* stand in for something said nearby, usually just before. To find it, read the sentence before the word as well as the sentence it is in, then try each option in the word's place: the right one makes the sentence say what the text means. *This* and *which* often stand for a whole idea, not a single noun.\n\n> **Watch out.** Do not automatically pick the nearest noun before the pronoun—check whether singular/plural agreement and the **whole preceding clause** make sense when substituted.",
        "*it*、*this*、*that*、*which*、*them*、*one*、*so* 这类词代替附近说过的内容，通常就在它前面。要找到它，除了这个词所在的句子，还要读前一句；再把每个选项代入这个词的位置，正确的那个能让句子表达原文的意思。*this* 和 *which* 常常指一整个意思，而不是一个名词。\n\n> **注意。** 不要本能地选离代词最近的名词——代入时要同时核对单复数以及是否指代**前面整个分句的意思**。",
      ),
      solvedChoiceGenerator(t("Read the text and answer the question.", "阅读短文，回答问题。"), references),
    ),
    point(
      "fce-what-the-writer-means",
      t("What the Writer Means", "作者的意思"),
      t(
        "Part 5 questions often ask what a phrase means, how the writer felt, or what a remark suggests. The answer is in the text, but in other words. Find the part the question is about and read a sentence or two on each side. Wrong options usually mention things that are in the text, but say something about them that the text does not.\n\n> **Watch out.** Beware of options that repeat exact words from the passage while twisting the writer's attitude or reversing cause and effect.",
        "第 5 部分的题目常问某个说法是什么意思、作者有什么感受，或某句话暗示了什么。答案在原文里，只是换了说法。找到题目所问的部分，再把前后各读一两句。错误选项通常提到原文中确有的事物，但对它们的说法原文并没有讲。\n\n> **注意。** 警惕那些照搬原文原词、却悄悄扭曲作者态度或颠倒因果关系的选项。",
      ),
      solvedChoiceGenerator(t("Read the text and answer the question.", "阅读短文，回答问题。"), meanings),
    ),
  ],
});
