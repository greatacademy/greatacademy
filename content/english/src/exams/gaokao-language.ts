// Gaokao English, seven-from-five, cloze and grammar filling. The paper sets each as a whole text with five, fifteen
// or ten gaps; here every item is one gap in a short paragraph, so that each can be explained on its own. Every text
// is written for this course in the words of B1 and below.

import { joinText, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { filled, type GapItem, gapGenerator, shownGap } from "./cambridge-first-use-of-english.ts";
import { examTopic, quote, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

// Seven-from-five.

/** GapKind is where the gap of a seven-from-five paragraph is: at its start, at its end or in the middle. */
type GapKind = "opening" | "closing" | "middle";

/** Gapped is one paragraph of a seven-from-five text: its words with a gap, the sentence that fits, its kind and the clue. */
type Gapped = readonly [paragraph: string, right: string, kind: GapKind, clue: string];

/** SevenText is one short text: its title and paragraphs; the right sentences of the others are each gap's wrong options. */
type SevenText = readonly [title: string, paragraphs: readonly Gapped[]];

const sevenTexts: readonly SevenText[] = [
  [
    "Making Friends at a New School",
    [
      [
        "___ Join a club or a team. Doing something together gives you something to talk about, and friendships often grow from there.",
        "One of the easiest ways to meet people is to share an activity.",
        "opening",
        "Join a club or a team",
      ],
      [
        "Don't wait for others to speak first. ___ Of course, it may feel strange at first, but it becomes easier each time.",
        "Say hello to the people who sit near you in class.",
        "middle",
        "it may feel strange at first",
      ],
      [
        "Remember that real friendships take time. You may not find a best friend in the first week. ___",
        "So be patient, and keep being yourself.",
        "closing",
        "take time",
      ],
      [
        "___ Ask about their weekend, their favorite music or the books they like, and then listen carefully to the answers.",
        "People like to talk about themselves, so ask questions.",
        "opening",
        "Ask about their weekend",
      ],
      [
        "Being kind is also important. ___ Small actions like these show people that you are someone they can trust.",
        "Lend a pen, share your notes or help someone carry their books.",
        "middle",
        "Small actions like these",
      ],
      [
        "If someone says no when you invite them, don't worry. ___ Try again with someone else, or ask the same person another time.",
        "There may be many reasons, and most of them have nothing to do with you.",
        "middle",
        "don't worry ... Try again",
      ],
      [
        "Lunch is a good time to get to know people. ___ Most groups are happy to make room for one more.",
        "Instead of eating alone, ask if you can join a table.",
        "middle",
        "make room for one more",
      ],
    ],
  ],
  [
    "Keeping a Diary",
    [
      [
        "___ You don't need a special notebook or beautiful handwriting; you only need a few minutes at the end of the day.",
        "Keeping a diary is easier than many people think.",
        "opening",
        "You don't need a special notebook",
      ],
      [
        "Write about what happened, but also about how you felt. ___ When you read these notes years later, they will bring the day back to you.",
        "Even a few words, such as 'tired but happy', are useful.",
        "middle",
        "these notes",
      ],
      [
        "Many people stop after a few weeks because they miss a day and feel they have failed. ___",
        "But a diary has no rules, so just begin again the next day.",
        "closing",
        "feel they have failed",
      ],
      [
        "___ Writing down your worries can make them feel smaller, and it often helps you see what to do next.",
        "A diary can also be good for your mind.",
        "opening",
        "worries ... feel smaller",
      ],
      [
        "Some people like to write in the morning. ___ Choose the time that suits you, and try to keep to it.",
        "Others prefer the quiet hour before they go to sleep.",
        "middle",
        "Some people ... Choose the time",
      ],
      [
        "Years from now, your diary will show you who you were at sixteen: what made you laugh, what you were afraid of and what you hoped for. ___",
        "In this way, it is a gift to your future self.",
        "closing",
        "Years from now",
      ],
      [
        "You don't have to write in full sentences. ___ Some people even draw small pictures next to their notes.",
        "Lists, single words and short notes are all fine.",
        "middle",
        "even draw small pictures",
      ],
    ],
  ],
  [
    "Saving Water at Home",
    [
      [
        "___ A dripping tap can waste more than ten liters a day, so fix it as soon as you notice it.",
        "Start by checking for leaks.",
        "opening",
        "A dripping tap",
      ],
      [
        "Showers use much less water than baths. ___ If every family member does this, the savings add up quickly.",
        "Try to keep your shower to five minutes.",
        "middle",
        "does this",
      ],
      [
        "Clean water does not come from nowhere; it costs energy and money to bring it to our homes. ___",
        "Every drop we save helps both the planet and our family budget.",
        "closing",
        "costs energy and money",
      ],
      [
        "Don't let the water run while you brush your teeth. ___ That simple habit alone can save several liters every day.",
        "Turn off the tap and use a cup instead.",
        "middle",
        "That simple habit",
      ],
      [
        "___ Water used for washing vegetables, for example, can be given to the plants in your garden.",
        "Some water can be used twice.",
        "opening",
        "for example ... given to the plants",
      ],
      [
        "Wash clothes only when the machine is full, and choose a short program. ___",
        "Fewer washes mean less water and less power.",
        "closing",
        "only when the machine is full",
      ],
      [
        "Collect rainwater in a bucket when it rains. ___ Your flowers will like it even more than tap water.",
        "You can use it later to water the garden.",
        "middle",
        "Your flowers will like it",
      ],
    ],
  ],
  [
    "Learning a Musical Instrument",
    [
      [
        "___ Some people want to play in a band, while others just want to relax after school.",
        "Before you begin, ask yourself why you want to learn.",
        "opening",
        "Some people want ... others just want",
      ],
      [
        "Practice a little every day rather than for hours once a week. ___ After a month, you will be surprised how much your fingers remember.",
        "Twenty minutes is enough if you do it regularly.",
        "middle",
        "every day",
      ],
      [
        "You will make many mistakes at the beginning. ___ Every musician, even the most famous, started by playing wrong notes.",
        "Don't let them stop you.",
        "middle",
        "mistakes ... Every musician",
      ],
      [
        "Finally, play for other people when you can, even if it is only your family. ___",
        "Sharing music is the best reward for all your practice.",
        "closing",
        "play for other people",
      ],
      [
        "___ A good teacher can correct bad habits before they become hard to change.",
        "It is worth having lessons, at least at first.",
        "opening",
        "A good teacher",
      ],
      [
        "Learning an instrument takes years, and there will be weeks when you feel you are making no progress. ___",
        "Keep going: these weeks pass, and the joy of playing stays.",
        "closing",
        "no progress",
      ],
      [
        "Listen to a lot of music played on your instrument. ___ This will give you ideas about how your own playing could sound.",
        "Pay attention to how the best players shape each note.",
        "middle",
        "This will give you ideas",
      ],
    ],
  ],
  [
    "Studying for Exams",
    [
      [
        "___ Write down every subject, the date of each exam and how many hours you can study each day.",
        "Start with a plan.",
        "opening",
        "Write down every subject",
      ],
      [
        "Study in short periods of about forty minutes. ___ A short walk or a glass of water is enough to refresh your mind.",
        "Then take a break of five or ten minutes.",
        "middle",
        "A short walk",
      ],
      [
        "Reading your notes again and again feels useful, but it isn't the best way to remember. ___ This makes your brain work, and what you work for, you remember.",
        "Instead, close your book and try to write down what you have learned.",
        "middle",
        "isn't the best way ... This makes your brain work",
      ],
      [
        "Don't stay up late the night before an exam. A tired brain makes careless mistakes. ___",
        "A good night's sleep is worth more than an extra hour of study.",
        "closing",
        "stay up late",
      ],
      [
        "___ Explaining a topic to a friend shows you quickly what you understand and what you don't.",
        "Studying with others can also help.",
        "opening",
        "to a friend",
      ],
      [
        "On the day of the exam, eat a good breakfast and arrive early. ___",
        "Then you can sit down calmly and give your best.",
        "closing",
        "arrive early",
      ],
      [
        "Use the exam papers of past years to practice. ___ This also helps you learn how to manage your time in the exam.",
        "They show you the kinds of questions you may be asked.",
        "middle",
        "This also helps",
      ],
    ],
  ],
  [
    "Volunteering in Your Community",
    [
      [
        "___ Old people's homes, animal centers and libraries all need people who can give a few hours a week.",
        "There are many places where young volunteers are welcome.",
        "opening",
        "all need people",
      ],
      [
        "Volunteering is good for the people you help. ___ Many volunteers say they feel happier and more confident after a few months.",
        "But it is also good for you.",
        "middle",
        "Many volunteers say they feel happier",
      ],
      [
        "Choose something you really care about. ___ If you love animals, for example, you will enjoy walking dogs much more than sorting papers in an office.",
        "You are more likely to keep going if the work means something to you.",
        "middle",
        "If you love animals, for example",
      ],
      [
        "You don't need special skills to begin; you can learn as you go. ___",
        "What matters most is that you are willing to help.",
        "closing",
        "don't need special skills",
      ],
      [
        "___ Ask at your school, look at the notice board in your local library, or search online for groups near you.",
        "Finding a place to volunteer is not difficult.",
        "opening",
        "Ask at your school",
      ],
      [
        "Volunteering also looks good when you apply for a university or a job. ___",
        "It shows that you are responsible and care about others.",
        "closing",
        "looks good",
      ],
      [
        "Volunteers must be reliable. ___ If you can't come one day, tell the organizers as early as possible.",
        "People depend on you to arrive when you said you would.",
        "middle",
        "If you can't come one day",
      ],
    ],
  ],
  [
    "Taking Care of a Pet",
    [
      [
        "___ A dog needs walks twice a day, and even a small fish needs its water changed every week.",
        "Every pet needs time and care.",
        "opening",
        "A dog needs walks ... even a small fish",
      ],
      [
        "Before you get a pet, talk to your family. ___ If not, the animal may end up unwanted and unhappy.",
        "Make sure everyone agrees and is ready to help.",
        "middle",
        "If not",
      ],
      [
        "Pets also cost money. ___ Visits to the animal doctor can be expensive, too.",
        "Food, toys and a bed all have to be paid for.",
        "middle",
        "too",
      ],
      [
        "A pet can live for ten or even twenty years. ___",
        "So think of it as a friend for life, not a toy for a few months.",
        "closing",
        "ten or even twenty years",
      ],
      [
        "___ Studies show that people who own pets are often less lonely and get more exercise.",
        "Pets are good for our health.",
        "opening",
        "less lonely and get more exercise",
      ],
      [
        "Children who look after a pet learn to think about the needs of others. ___",
        "This is a lesson that will help them all their lives.",
        "closing",
        "learn to think about",
      ],
      [
        "Animals cannot tell us when they feel ill. ___ If your pet stops eating or sleeps much more than usual, take it to an animal doctor.",
        "So we have to watch them carefully for signs.",
        "middle",
        "If your pet stops eating",
      ],
    ],
  ],
  [
    "Using Your Phone Less",
    [
      [
        "___ Many teenagers check their phones more than a hundred times a day without even noticing.",
        "Most of us use our phones more than we think.",
        "opening",
        "without even noticing",
      ],
      [
        "Turn off notifications for games and social apps. ___ You can still check them when you choose, rather than every time they call you.",
        "Then your phone will not keep asking for your attention.",
        "middle",
        "rather than every time they call you",
      ],
      [
        "Keep your phone out of your bedroom at night. ___ Use a cheap alarm clock instead.",
        "If you use it as an alarm, you will want to look at it in bed.",
        "middle",
        "Use a cheap alarm clock instead",
      ],
      [
        "When you spend less time on your phone, you will find you have more time for sports, books and friends. ___",
        "Life away from the screen can be surprisingly rich.",
        "closing",
        "more time for sports, books and friends",
      ],
      [
        "___ Agree with your family that nobody uses their phone during meals.",
        "Phone-free times can help a whole family.",
        "opening",
        "your family",
      ],
      [
        "You don't have to stop using your phone; it is a useful tool. ___",
        "The goal is simply to use it, not to let it use you.",
        "closing",
        "a useful tool",
      ],
      [
        "When you feel bored, you may pick up your phone without thinking. ___ Read a few pages of a book, call a friend or go for a short walk.",
        "Have a list of other things you could do instead.",
        "middle",
        "Read a few pages ... or go for a short walk",
      ],
    ],
  ],
  [
    "Eating Well",
    [
      [
        "___ It gives you the energy you need for morning classes and stops you eating snacks before lunch.",
        "Never skip breakfast.",
        "opening",
        "the energy you need for morning classes",
      ],
      [
        "Try to eat fruit and vegetables of different colors. ___ So the more colors on your plate, the better.",
        "Each color brings something different that your body needs.",
        "middle",
        "So the more colors",
      ],
      [
        "Sweet drinks contain a lot of sugar. ___ Water is free and has no sugar at all.",
        "One can of cola may have as much as eight spoons of it.",
        "middle",
        "a lot of sugar",
      ],
      [
        "Eating well does not mean never eating cake or chips. ___",
        "It means enjoying them sometimes, not every day.",
        "closing",
        "does not mean never",
      ],
      [
        "___ When you cook for yourself, you know exactly what goes into your food.",
        "Learning to cook simple dishes is a great help.",
        "opening",
        "cook for yourself",
      ],
      [
        "Finally, eat slowly and stop when you are no longer hungry. ___",
        "Your body will tell you when it has had enough, if you listen.",
        "closing",
        "no longer hungry",
      ],
      [
        "Many people eat in front of the TV or their phone. ___ As a result, they often eat more than they need.",
        "When we do this, we hardly notice what or how much we are eating.",
        "middle",
        "As a result",
      ],
    ],
  ],
  [
    "Visiting a Museum",
    [
      [
        "___ Look at the museum's website to find out what is on and which rooms you most want to see.",
        "Plan your visit before you go.",
        "opening",
        "Look at the museum's website",
      ],
      [
        "Don't try to see everything in one day. ___ It is better to look closely at ten things than to walk quickly past a thousand.",
        "Big museums can have thousands of objects.",
        "middle",
        "a thousand",
      ],
      [
        "Many museums offer free guided tours. ___ They can tell you stories about the objects that you would never find on the labels.",
        "The guides are often experts in their subject.",
        "middle",
        "They can tell you stories",
      ],
      [
        "After your visit, talk about what you saw with a friend or write a few lines about it. ___",
        "This will help you remember it for much longer.",
        "closing",
        "talk about ... or write",
      ],
      [
        "___ Ask questions such as who made this object, how it was used and why it was kept.",
        "Try to be a detective, not just a visitor.",
        "opening",
        "Ask questions",
      ],
      [
        "Museums are not only for rainy days or school trips. ___",
        "They are places where you can travel through time for the price of a bus ticket.",
        "closing",
        "not only for",
      ],
      [
        "Some museums let you touch certain objects or try things for yourself. ___ Children in particular remember what they have done better than what they have only seen.",
        "Don't miss these chances to learn by doing.",
        "middle",
        "remember what they have done",
      ],
    ],
  ],
];

const sevenWhy: Record<GapKind, Text> = {
  opening: t(
    "The gap opens the paragraph, so it needs a sentence that names what the paragraph is about; the sentences after it give the details of that idea.",
    "空格在段首，需要一个点明本段内容的句子；后面的句子是对这个意思的具体说明。",
  ),
  closing: t(
    "The gap closes the paragraph, so it needs a sentence that sums up or follows from what comes before it.",
    "空格在段尾，需要一个总结前文或由前文自然得出的句子。",
  ),
  middle: t(
    "The gap is in the middle, so the right sentence must pick up something from the sentence before it and lead into the one after it.",
    "空格在段中，正确的句子既要承接前一句，又要引出后一句。",
  ),
};

/** sevenMisses says what a sentence from elsewhere in the text fails to do in a gap of each kind. */
const sevenMisses: Record<GapKind, Text> = {
  opening: t("it does not name what this paragraph is about", "它没有点明本段讲的内容"),
  closing: t("it does not sum up or follow from what comes before the gap", "它不能总结或承接空格前的内容"),
  middle: t("it does not link the sentence before the gap to the one after it", "它不能把空格前后的两句连起来"),
};

/** whyNotSeven explains why a sentence from another paragraph does not fit a gap. */
const whyNotSeven = (kind: GapKind, clue: string, otherClue: string): Text =>
  t(
    `This sentence belongs elsewhere in the text, beside *${otherClue}*. Here ${sevenMisses[kind].en}; the clue in this paragraph is *${clue}*.`,
    `这个句子属于文中别处，与 *${otherClue}* 相关。放在这里，${sevenMisses[kind]["zh-CN"]}；本段的线索是 *${clue}*。`,
  );

/** sevenItems turns every paragraph of the texts into an item whose wrong options are three other sentences of its text. */
function sevenItems(kinds: readonly GapKind[]): readonly SolvedChoice[] {
  const items: SolvedChoice[] = [];
  for (const [title, paragraphs] of sevenTexts) {
    paragraphs.forEach(([paragraph, right, kind, clue], i) => {
      if (!kinds.includes(kind)) return;
      const other = (k: number) => (paragraphs[(i + k) % paragraphs.length] as Gapped)[1];
      const otherClue = (k: number) => (paragraphs[(i + k) % paragraphs.length] as Gapped)[3];
      items.push({
        shown: `**${title}**\n\n${shownGap(paragraph)}`,
        right,
        wrong: [other(1), other(3), other(5)],
        whyNot: [1, 3, 5].map((k) => whyNotSeven(kind, clue, otherClue(k))),

        solution: joinText([
          sevenWhy[kind],
          t(`Here the clue is *${clue}*.`, `这里的线索是 *${clue}*。`),
          same(quote(filled(paragraph, right))),
        ]),
      });
    });
  }
  return items;
}

const sevenQuestion = t("Choose the sentence that best fits the gap in this paragraph.", "选出最适合填入这段文字空格处的句子。");

/** sevenFromFive is the seven-from-five part of the reading section of the paper. */
export const sevenFromFive: TopicDef = examTopic({
  id: "gaokao-seven-from-five",
  title: t("Seven-from-Five", "七选五"),
  summary: t(
    "Choose the sentence that fits a gap in a short text, as in the seven-from-five part of the Gaokao: first gaps that open or close a paragraph, then gaps in the middle.",
    "按照高考七选五的形式，选出适合短文空格的句子：先是段首和段尾的空格，再是段中的空格。",
  ),
  strand: "reading",
  prerequisites: ["choosing-transitions"],
  encompasses: [
    { topic: "ordering-sentences-in-a-paragraph", weight: 0.2 },
    { topic: "choosing-transitions", weight: 0.2 },
  ],
  xp: 8,
  points: [
    point(
      "opening-and-closing-gaps",
      t("Gaps that open or close a paragraph", "段首和段尾的空格"),
      t(
        "A gap at the start of a paragraph usually needs its topic sentence: a short, general sentence that the rest of the paragraph explains. Read the sentences after the gap and ask what they are all about. A gap at the end needs a sentence that sums up the paragraph or draws a lesson from it, often beginning with *So*, *In this way* or *This*. Every option may be about the topic of the text; the right one fits this paragraph.",
        "段首的空格通常需要主题句：一个简短、概括的句子，由段落的其余部分加以说明。读空格后面的句子，想一想它们共同讲的是什么。段尾的空格需要一个总结本段或从中得出结论的句子，常以 *So*、*In this way* 或 *This* 开头。每个选项都可能与全文话题有关，正确的那个适合这一段。",
      ),
      solvedChoiceGenerator(sevenQuestion, sevenItems(["opening", "closing"])),
    ),
    point(
      "middle-gaps",
      t("Gaps in the middle of a paragraph", "段中的空格"),
      t(
        "A gap in the middle is decided by the sentences on both sides. Look for words that point back or forward: *this*, *these*, *they*, *it*, *instead*, *too*, *If not*, *As a result*. The sentence after the gap often refers to something the missing sentence said, and the missing sentence must follow from the one before. Try the option in the gap and read all three sentences together.",
        "段中的空格由前后两句共同决定。要注意指向前文或后文的词：*this*、*these*、*they*、*it*、*instead*、*too*、*If not*、*As a result*。空格后的句子常常指代所缺句子中的内容，而所缺的句子又必须承接前一句。把选项放进空格，把三句话连起来读一遍。",
      ),
      solvedChoiceGenerator(sevenQuestion, sevenItems(["middle"])),
    ),
  ],
});

// Cloze.

/** ClozeItem is a gap of the cloze: the text, the right word, three wrong ones and the words that decide it. */
type ClozeItem = readonly [shown: string, right: string, wrong: readonly [string, string, string], clue: string];

const sentenceCloze: readonly ClozeItem[] = [
  [
    "After ten hours at work, she felt too ___ to cook, so she went straight to bed.",
    "tired",
    ["hungry", "nervous", "proud"],
    "went straight to bed",
  ],
  ["The tickets were so ___ that we couldn't afford them.", "expensive", ["cheap", "popular", "simple"], "couldn't afford"],
  ["He ___ the bus by one minute and had to walk to school.", "missed", ["caught", "took", "stopped"], "had to walk"],
  ["Please turn ___ the lights when you leave the room to save power.", "off", ["on", "up", "down"], "save power"],
  ["I ___ my keys at home, so I couldn't open the door.", "left", ["forgot", "lost", "kept"], "at home"],
  ["The doctor told him to give ___ smoking for the sake of his health.", "up", ["in", "away", "out"], "for the sake of his health"],
  ["She ___ English so well that people think she grew up in London.", "speaks", ["says", "tells", "talks"], "English"],
  ["We had a ___ time at the party and didn't want to go home.", "wonderful", ["terrible", "boring", "busy"], "didn't want to go home"],
  ["The road was ___, so drivers had to go very slowly.", "icy", ["wide", "empty", "new"], "had to go very slowly"],
  ["The boy was ___ of the dark, so he slept with the light on.", "afraid", ["fond", "proud", "full"], "slept with the light on"],
  [
    "My grandfather is eighty, but he is still ___ and walks five kilometers every day.",
    "healthy",
    ["weak", "ill", "lazy"],
    "walks five kilometers",
  ],
  ["Thanks to the map, we didn't ___ our way in the old town.", "lose", ["find", "make", "miss"], "Thanks to the map"],
  ["The teacher asked us to ___ attention to the spelling of new words.", "pay", ["take", "make", "keep"], "attention"],
  ["He was so ___ that he didn't say a word to anyone at the party.", "shy", ["friendly", "talkative", "brave"], "didn't say a word"],
  ["The library is ___ to everyone, and you don't need to pay.", "open", ["closed", "close", "far"], "you don't need to pay"],
  ["Can you ___ me a favor and carry this box upstairs?", "do", ["make", "give", "take"], "a favor"],
  ["The weather report says it will ___ heavily tomorrow, so take an umbrella.", "rain", ["shine", "clear", "warm"], "take an umbrella"],
  ["She ___ her best in the race and came second.", "did", ["made", "took", "had"], "her best"],
  ["I can't ___ the noise from the street any longer; I need some quiet.", "stand", ["keep", "wait", "stay"], "any longer"],
  ["The food smelled so ___ that everyone came into the kitchen.", "good", ["bad", "strange", "plain"], "everyone came into the kitchen"],
  ["We need to ___ a decision before the end of the week.", "make", ["do", "have", "put"], "a decision"],
  ["It was getting dark, so we ___ up our tents near the lake.", "put", ["took", "gave", "made"], "up our tents"],
  ["He felt ___ when he lost the match, but he soon smiled again.", "disappointed", ["excited", "proud", "pleased"], "lost the match"],
  ["The bus was so ___ that I had to stand all the way.", "crowded", ["empty", "fast", "quiet"], "had to stand"],
  ["My little brother always ___ his toys with his friends.", "shares", ["borrows", "lends", "keeps"], "with his friends"],
  ["Our school ___ a sports meeting every autumn.", "holds", ["makes", "does", "takes"], "a sports meeting"],
  [
    "The old man lives ___, but his neighbors often visit him.",
    "alone",
    ["lonely", "together", "happily"],
    "but his neighbors often visit him",
  ],
  ["She is well ___ for her kindness; everyone in the town knows her.", "known", ["famous", "told", "heard"], "well ... for"],
  ["The exam was ___ easier than I had expected.", "much", ["very", "more", "too"], "easier than"],
  ["Please ___ in the form in English and return it by Friday.", "fill", ["put", "take", "give"], "in the form"],
  ["The baby ___ all night, so his parents didn't get any sleep.", "cried", ["slept", "smiled", "ate"], "didn't get any sleep"],
  ["I ___ a lot of money on books last month.", "spent", ["paid", "cost", "took"], "on books"],
  ["The film was so ___ that I fell asleep halfway through.", "boring", ["exciting", "funny", "bored"], "fell asleep"],
];

const storyCloze: readonly ClozeItem[] = [
  [
    "Tom had practiced the piano for months. On the day of the concert his hands shook, but once he began to play, his fear ___. He finished to warm applause.",
    "disappeared",
    ["grew", "returned", "began"],
    "He finished to warm applause",
  ],
  [
    "My neighbor's dog barked every night, and I couldn't sleep. One evening I knocked on his door, ready to ___. But when he opened it, he looked so sad that I just asked if he was all right.",
    "complain",
    ["apologize", "celebrate", "help"],
    "But ... I just asked if he was all right",
  ],
  [
    "The village had no library. So Mrs. Li began to ___ books in her front room, and soon children came every afternoon to read.",
    "collect",
    ["sell", "burn", "hide"],
    "children came every afternoon to read",
  ],
  [
    "Jack thought the test would be easy, so he didn't study. When he saw the questions, he ___ his choice. He could answer only half of them.",
    "regretted",
    ["enjoyed", "forgot", "praised"],
    "He could answer only half of them",
  ],
  [
    "We had walked for hours and our water was gone. Then we saw a small shop by the road. We had never been so ___ to see a shop.",
    "glad",
    ["sorry", "afraid", "angry"],
    "our water was gone",
  ],
  [
    "Anna was new at the school and knew nobody. At lunch she sat ___ in a corner, until a girl from her class came over and smiled.",
    "alone",
    ["happily", "together", "proudly"],
    "knew nobody ... until a girl came over",
  ],
  [
    "The old bike was broken in many places. My father spent the whole weekend on it, and by Sunday evening it looked almost ___.",
    "new",
    ["old", "broken", "cheap"],
    "spent the whole weekend on it",
  ],
  [
    "I was sure I had locked the door. But when I came home, it was ___. Nothing was missing, though; I had simply forgotten.",
    "open",
    ["locked", "painted", "closed"],
    "I had simply forgotten",
  ],
  [
    "Lily wanted to win the art prize. Her painting did not win, but a visitor liked it so much that she asked to ___ it. Lily was happier than any prize could make her.",
    "buy",
    ["break", "return", "copy"],
    "liked it so much",
  ],
  [
    "The coach told us that we had lost because we didn't play as a team. In the next match we ___ the ball to each other more and won 3 to 0.",
    "passed",
    ["kicked", "kept", "lost"],
    "play as a team",
  ],
  [
    "It began to snow heavily, and the bus could not go on. The driver told us to stay ___ where it was warm. Two hours later, a car came to take us to the nearest town.",
    "inside",
    ["outside", "behind", "away"],
    "snow heavily ... where it was warm",
  ],
  [
    "My grandmother cannot read, but she ___ hundreds of stories. Every night she told me one from memory.",
    "knows",
    ["writes", "reads", "buys"],
    "cannot read ... from memory",
  ],
  [
    "The boy found a wallet full of money in the street. Although his family was poor, he ___ it to the police.",
    "handed",
    ["sold", "threw", "lent"],
    "Although his family was poor",
  ],
  [
    "At first the plan seemed impossible: nobody believed a small class could raise so much money. But week by week the money ___, and by June they had enough for a new library.",
    "grew",
    ["fell", "disappeared", "stopped"],
    "by June they had enough",
  ],
  [
    "Mike had never cooked before. His first cake was hard and black, and even the dog would not eat it. But he did not ___ up. His tenth cake was the best his family had ever tasted.",
    "give",
    ["make", "look", "set"],
    "His tenth cake was the best",
  ],
  [
    "The girl in the wheelchair could not reach the top shelf. Without a word, a tall boy ___ her by taking down the book, and he walked away before she could thank him.",
    "helped",
    ["stopped", "followed", "called"],
    "before she could thank him",
  ],
  [
    "Everyone laughed when Sam said he would run a marathon; he had never run more than a kilometer. Six months later he crossed the finish line, and this time nobody ___.",
    "laughed",
    ["slept", "shouted", "worked"],
    "Everyone laughed ... this time",
  ],
  [
    "The power went out during the storm. With no TV or phone, our family sat together and talked by candlelight. It was the most ___ evening we had had in years.",
    "pleasant",
    ["boring", "terrible", "frightening"],
    "sat together and talked",
  ],
  [
    "I had promised to meet Ben at six, but I forgot, and he waited for an hour in the cold. The next day I said sorry again and again, and in the end he ___ me.",
    "forgave",
    ["blamed", "forgot", "left"],
    "said sorry again and again",
  ],
  [
    "The farmer's plants were dying because there had been no rain for weeks. Then one night he heard a sound on the roof. It was ___! He ran outside with tears of joy.",
    "rain",
    ["wind", "thunder", "snow"],
    "no rain for weeks ... tears of joy",
  ],
  [
    "Our teacher never told us the answers. Instead, she asked questions until we found them ourselves. At the time we found this ___, but now I understand how much it taught us.",
    "annoying",
    ["helpful", "easy", "exciting"],
    "At the time ... but now I understand",
  ],
  [
    "The little shop had been there for fifty years. When the owner became too old to work, the people of the street took turns to ___ it, so it never had to close.",
    "run",
    ["close", "sell", "build"],
    "it never had to close",
  ],
  [
    "Leo was afraid of water. On a school trip, his friend fell into the river. Leo forgot his fear, jumped in and ___ him to the bank.",
    "pulled",
    ["threw", "called", "waved"],
    "forgot his fear, jumped in",
  ],
  [
    "When my sister left for university, the house became very ___. I missed hearing her sing in the morning.",
    "quiet",
    ["noisy", "crowded", "busy"],
    "I missed hearing her sing",
  ],
  [
    "The new student spoke little English. Instead of laughing at his mistakes, his classmates ___ him new words every day, and by the end of the year he was one of the best in the class.",
    "taught",
    ["asked", "refused", "lent"],
    "Instead of laughing ... one of the best",
  ],
  [
    'Grandpa\'s watch had stopped years ago, but he still wore it every day. "It was a gift from your grandmother," he said. "It doesn\'t tell the time, but it tells me she ___ me."',
    "loved",
    ["left", "forgot", "knew"],
    "a gift from your grandmother",
  ],
  [
    "The fire spread quickly through the building. Thanks to the firefighters, who arrived within minutes, everyone got out ___.",
    "safely",
    ["slowly", "late", "alone"],
    "Thanks to the firefighters",
  ],
  [
    "The plant on my desk looked dead. I almost threw it away, but my mother told me to keep giving it water. Two weeks later, a small green leaf ___.",
    "appeared",
    ["died", "fell", "disappeared"],
    "keep giving it water",
  ],
  [
    "It was my first day at a new job, and I was ___. My hands were cold and I kept checking the time. But my new workmates were so friendly that I soon relaxed.",
    "nervous",
    ["relaxed", "bored", "calm"],
    "I soon relaxed",
  ],
  [
    "Sara had saved for a year to buy a new phone. But when she heard that her friend's family had lost their home in a flood, she ___ the money to them instead.",
    "gave",
    ["borrowed", "showed", "hid"],
    "lost their home in a flood ... instead",
  ],
  [
    "The match was almost over and our team was one goal behind. Then, in the last minute, Wang Hai scored. The whole school ___ to its feet.",
    "jumped",
    ["fell", "sat", "returned"],
    "Wang Hai scored",
  ],
  [
    'My grandfather planted an apple tree the year I was born. "You and the tree will ___ up together," he said. Now we are both tall, and every autumn we eat its apples.',
    "grow",
    ["give", "look", "wake"],
    "Now we are both tall",
  ],
];

/** solvedCloze turns a cloze gap into a choice whose solution names the words that decide it. */
const solvedCloze = ([shown, right, wrong, clue]: ClozeItem): SolvedChoice => ({
  shown: shownGap(shown),
  right,
  wrong,
  whyNot: wrong.map((w) =>
    t(
      `*${w}* is good English, but read it with *${clue}*: the meaning no longer fits, so the gap takes **${right}**.`,
      `*${w}* 本身没有错，但和 *${clue}* 一起读，意思就说不通了，所以空格填 **${right}**。`,
    ),
  ),

  solution: joinText([
    t(
      `The words *${clue}* decide the gap: only **${right}** fits them. The other words are possible English, but they do not make sense here.`,
      `*${clue}* 决定了空格的词：只有 **${right}** 与之相符。其他几个词本身没有错，但放在这里意思不通。`,
    ),
    same(quote(filled(shown, right))),
  ]),
});

const clozeQuestion = t("Choose the word that best fits the gap.", "选出最适合填入空格的词。");

/** cloze is the cloze part of the language-use section of the paper. */
export const cloze: TopicDef = examTopic({
  id: "gaokao-cloze",
  title: t("Cloze", "完形填空"),
  summary: t(
    "Choose the word of four that fits a gap in a story, as in the cloze of the Gaokao: first words the sentence decides, then words only the story around them decides.",
    "按照高考完形填空的形式，从四个词中选出适合故事空格的一个：先是句子本身决定的词，再是只有上下文才能决定的词。",
  ),
  strand: "vocabulary",
  prerequisites: ["phrasal-verbs"],
  encompasses: [{ topic: "phrasal-verbs", weight: 0.1 }],
  xp: 8,
  points: [
    point(
      "words-the-sentence-decides",
      t("Words the sentence decides", "句子决定的词"),
      t(
        "The four options are usually the same kind of word, so grammar alone does not decide. Find the words in the sentence that the gap must agree with: a reason after *so* or *because*, a result after *so ... that*, or a fixed partner such as *pay attention* or *make a decision*. Then choose the word that makes the whole sentence true and natural.",
        "四个选项通常词性相同，单靠语法无法判断。要找出句子中与空格相呼应的词：*so* 或 *because* 后的原因，*so ... that* 后的结果，或 *pay attention*、*make a decision* 这类固定搭配。然后选出使整句话合理、自然的词。",
      ),
      solvedChoiceGenerator(clozeQuestion, sentenceCloze.map(solvedCloze)),
    ),
    point(
      "words-the-story-decides",
      t("Words the story decides", "上下文决定的词"),
      t(
        "In a story, several options may fit the sentence with the gap, and only the sentences around it decide. Read on past the gap: what happens next, how the person feels and words such as *but*, *instead* and *although* show which way the story goes. A word that seems right in its own sentence is wrong if the next sentence says the opposite.",
        "在故事中，几个选项可能都能放进空格所在的句子，只有前后的句子才能决定。要接着往下读：接下来发生了什么、人物有什么感受，以及 *but*、*instead*、*although* 这类词，都表明故事的走向。在本句中看似正确的词，如果下一句说的是相反的意思，就是错的。",
      ),
      solvedChoiceGenerator(clozeQuestion, storyCloze.map(solvedCloze)),
    ),
  ],
});

// Grammar filling.

type FormKind = "tense" | "passive" | "nonfinite" | "comparison" | "noun" | "adverb" | "adjective";
type FreeKind = "article" | "preposition" | "pronoun" | "conjunction" | "relative";

const formWhy: Record<FormKind, Text> = {
  tense: t(
    "The gap needs a verb that agrees with its subject and with the time the sentence shows: words such as *since*, *by the time*, *last year* and *Look!* tell you the tense.",
    "空格需要一个与主语一致、并符合句中时间的谓语动词：*since*、*by the time*、*last year*、*Look!* 等词提示了时态。",
  ),
  passive: t(
    "The subject does not do the action but receives it, so the verb is passive: a form of *be* and the past participle, in the tense the sentence needs.",
    "主语不是动作的执行者而是承受者，所以用被动语态：*be* 的适当形式加过去分词，时态要符合句意。",
  ),
  nonfinite: t(
    "The sentence already has its main verb, so this verb is non-finite: *-ing* for an active or ongoing action, the past participle for a passive or finished one, and *to* before the verb after words like *decide*.",
    "句中已经有谓语动词，所以这里用非谓语形式：主动或进行的动作用 -ing，被动或完成的动作用过去分词，*decide* 这类词后用 to 加动词原形。",
  ),
  comparison: t(
    "The sentence compares, so the adjective or adverb changes: *-er* or *more* with *than* or *the more ... the*, and *-est* or *most* with *the* and a group such as *of all*.",
    "句子在比较，所以形容词或副词要变化：与 *than* 或 *the more ... the* 连用时用比较级，与 *the* 和 *of all* 这类范围连用时用最高级。",
  ),
  noun: t(
    "The gap comes after an article, an adjective or a number, so it needs a noun, plural when there is more than one.",
    "空格前有冠词、形容词或数词，所以需要名词；数量多于一个时用复数。",
  ),
  adverb: t(
    "The gap describes a verb or the whole sentence, so it needs an adverb, usually the adjective with *-ly*.",
    "空格修饰动词或整个句子，所以需要副词，通常是形容词加 -ly。",
  ),
  adjective: t(
    "The gap describes a noun or comes after *be*, so it needs an adjective, sometimes with a prefix that changes its meaning.",
    "空格修饰名词或位于 *be* 之后，所以需要形容词，有时还要加上改变词义的前缀。",
  ),
};

const freeWhy: Record<FreeKind, Text> = {
  article: t(
    "A singular countable noun needs an article: *the* for a thing both speakers know or there is only one of, and for instruments; *a* or *an* for one of many, with *an* before a vowel sound.",
    "单数可数名词前要用冠词：双方都知道的、独一无二的事物以及乐器前用 *the*；泛指其中之一用 *a* 或 *an*，元音音素前用 *an*。",
  ),
  preposition: t(
    "The gap comes before a noun, a pronoun or an *-ing* form, so it needs a preposition; many follow fixed words, such as *good at*, *afraid of* and *look forward to*.",
    "空格后是名词、代词或 -ing 形式，所以需要介词；许多介词与固定的词搭配，如 *good at*、*afraid of*、*look forward to*。",
  ),
  pronoun: t(
    "The gap stands for a noun said before or after it, so it needs a pronoun in the right form: *it* for an idea that follows, *themselves* when the subject does something to itself, *one* for one of a kind.",
    "空格代替前面或后面的名词，所以需要形式正确的代词：指代后面的内容用 *it*，主语作用于自身用 *themselves*，指同类中的一个用 *one*。",
  ),
  conjunction: t(
    "The gap joins two clauses, so it needs a conjunction that shows how they are related: a contrast, a reason, a condition, a time or a result.",
    "空格连接两个分句，所以需要能表明二者关系的连词：转折、原因、条件、时间或结果。",
  ),
  relative: t(
    "The clause after the gap describes the noun before it, so it needs a relative word: *who* for people, *which* for things, *whose* for something that belongs, *where* for a place and *when* for a time.",
    "空格后的从句修饰前面的名词，所以需要关系词：指人用 *who*，指物用 *which*，表示所属用 *whose*，表示地点用 *where*，表示时间用 *when*。",
  ),
};

/** FillItem is a gap of grammar filling: the sentence, the accepted words with the canonical one first, wrong words and the kind. */
type FillItem<K> = readonly [shown: string, accepted: readonly string[], wrong: readonly string[], kind: K];

const givenWords: readonly FillItem<FormKind>[] = [
  ["The bridge ___ (build) in 1998 and is still in good condition.", ["was built"], ["built", "is built", "was build"], "passive"],
  [
    "By the time we arrived at the cinema, the film ___ (start).",
    ["had started", "had already started"],
    ["started", "has started", "was started"],
    "tense",
  ],
  ["Look! The children ___ (play) football in the rain.", ["are playing"], ["play", "played", "were playing"], "tense"],
  ["I ___ (live) in this city since I was ten.", ["have lived", "have been living"], ["lived", "live", "had lived"], "tense"],
  ["If it rains tomorrow, the sports meeting ___ (put) off.", ["will be put"], ["will put", "is put", "was put"], "passive"],
  ["___ (walk) along the river, we saw a group of ducks.", ["Walking"], ["Walked", "Walk", "To walk"], "nonfinite"],
  ["The girl ___ (stand) by the door is my cousin.", ["standing"], ["stood", "stands", "to stand"], "nonfinite"],
  ["He was very ___ (surprise) at the news.", ["surprised"], ["surprising", "surprise", "surprisedly"], "nonfinite"],
  ["It was a ___ (surprise) result for everyone.", ["surprising"], ["surprised", "surprise", "surprisingly"], "nonfinite"],
  ["We decided ___ (take) the train instead of the bus.", ["to take"], ["taking", "took", "take"], "nonfinite"],
  ["My mother is used to ___ (get) up early.", ["getting"], ["get", "got", "to get"], "nonfinite"],
  ["A letter ___ (write) in pencil is hard to read after many years.", ["written"], ["writing", "wrote", "is written"], "nonfinite"],
  ["This is the ___ (good) meal I have ever had.", ["best"], ["better", "good", "most good"], "comparison"],
  ["The second test was much ___ (easy) than the first.", ["easier"], ["easy", "easiest", "more easy"], "comparison"],
  ["Of all the students in our class, Li Ming runs the ___ (fast).", ["fastest"], ["faster", "fast", "most fast"], "comparison"],
  [
    "The more you practice, the ___ (confident) you will feel.",
    ["more confident"],
    ["confident", "most confident", "confidenter"],
    "comparison",
  ],
  ["Please speak ___ (slow); I can't follow you.", ["slowly", "more slowly"], ["slow", "slower", "slowest"], "adverb"],
  ["___ (luck), nobody was hurt in the accident.", ["Luckily"], ["Lucky", "Luck", "Unlucky"], "adverb"],
  ["She answered every question ___ (correct).", ["correctly"], ["correct", "correction", "corrected"], "adverb"],
  ["The ___ (happy) of their children matters most to parents.", ["happiness"], ["happy", "happily", "happier"], "noun"],
  ["Thank you for your kind ___ (invite).", ["invitation"], ["invite", "inviting", "invited"], "noun"],
  ["Thousands of ___ (visit) come to the old town every summer.", ["visitors"], ["visitor", "visits", "visiting"], "noun"],
  ["We need two more ___ (box) for the books.", ["boxes"], ["box", "boxs", "boxies"], "noun"],
  ["The ___ (child) were singing in the park.", ["children"], ["child", "childs", "childrens"], "noun"],
  ["He has two ___ (knife) in his bag for the camping trip.", ["knives"], ["knife", "knifes", "knive"], "noun"],
  ["Smoking is ___ (harm) to your health.", ["harmful"], ["harm", "harmless", "harmfully"], "adjective"],
  ["The village is famous for its ___ (beauty) lakes.", ["beautiful"], ["beauty", "beautifully", "beauties"], "adjective"],
  [
    "It's ___ (possible) to finish all this work in one day; we need more time.",
    ["impossible"],
    ["possible", "possibly", "unpossible"],
    "adjective",
  ],
  ["Mr. Wang ___ (teach) us English last year.", ["taught"], ["teached", "teaches", "has taught"], "tense"],
  ["When I got home, my sister ___ (cook) dinner in the kitchen.", ["was cooking"], ["cooked", "is cooking", "has cooked"], "tense"],
  ["Yesterday the students ___ (ask) to hand in their homework by Friday.", ["were asked"], ["asked", "were ask", "are asked"], "passive"],
  ["Have you finished ___ (read) the book I lent you?", ["reading"], ["read", "to read", "reads"], "nonfinite"],
  ["The team, ___ (lead) by a young coach, won the final.", ["led"], ["leading", "leaded", "to lead"], "nonfinite"],
  ["There ___ (be) a lot of changes in our town in the past ten years.", ["have been"], ["were", "has been", "are"], "tense"],
  ["English ___ (speak) in many countries around the world.", ["is spoken"], ["speaks", "is speaking", "spoken"], "passive"],
];

const noWordGiven: readonly FillItem<FreeKind>[] = [
  ["She plays ___ piano every evening after dinner.", ["the"], ["a", "an"], "article"],
  ["My uncle is ___ engineer at a car factory.", ["an"], ["a", "the"], "article"],
  ["It was ___ honor to meet the famous writer.", ["an"], ["a", "the"], "article"],
  ["We go to the cinema once ___ week.", ["a"], ["an", "the", "one"], "article"],
  ["___ sun rises in the east.", ["The"], ["A", "An"], "article"],
  ["He is ___ university student in Beijing.", ["a"], ["an", "the"], "article"],
  ["The concert starts ___ 7:30 this evening.", ["at"], ["in", "on"], "preposition"],
  ["I was born ___ May 5th, 2008.", ["on"], ["in", "at"], "preposition"],
  ["She is good ___ drawing pictures of animals.", ["at"], ["in", "for", "with"], "preposition"],
  ["We are looking forward ___ seeing you again.", ["to"], ["for", "at"], "preposition"],
  ["The boy was afraid ___ the big dog.", ["of"], ["for", "with", "about"], "preposition"],
  ["Thank you ___ helping me with my homework.", ["for"], ["to", "of"], "preposition"],
  ["The shop is famous ___ its cakes.", ["for"], ["of", "as", "with"], "preposition"],
  ["He has lived here ___ 2015.", ["since"], ["for", "from", "in"], "preposition"],
  ["The children enjoyed ___ at the party.", ["themselves"], ["them", "themself", "they"], "pronoun"],
  ["I lost my pen, so I borrowed ___ from my friend.", ["one"], ["it", "that", "them"], "pronoun"],
  ["___ is important to drink enough water every day.", ["It"], ["This", "That", "There"], "pronoun"],
  ["This bag isn't mine. It's ___; it has her name on it.", ["hers"], ["her", "she", "herself"], "pronoun"],
  ["I find ___ hard to wake up early in winter.", ["it"], ["that", "this", "its"], "pronoun"],
  ["Help ___ to some cake, everyone!", ["yourselves"], ["yourself", "you", "your"], "pronoun"],
  ["I wanted to go out, ___ it was raining hard.", ["but"], ["and", "so", "or"], "conjunction"],
  ["Hurry up, ___ you will miss the bus.", ["or"], ["and", "but", "so"], "conjunction"],
  ["___ he was tired, he kept working until midnight.", ["Although", "Though"], ["Because", "But", "So"], "conjunction"],
  ["We stayed at home ___ the weather was bad.", ["because", "as", "since"], ["so", "but", "although"], "conjunction"],
  ["Wait here ___ I come back.", ["until", "till"], ["since", "so", "because"], "conjunction"],
  ["He was ___ tired that he fell asleep in class.", ["so"], ["such", "too", "very"], "conjunction"],
  ["___ you work hard, you will pass the exam.", ["If", "As long as"], ["Unless", "Although", "Because of"], "conjunction"],
  ["The man ___ lives next door is a doctor.", ["who", "that"], ["which", "whom", "whose"], "relative"],
  ["This is the house ___ my grandfather was born.", ["where", "in which"], ["which", "when", "that"], "relative"],
  ["I still remember the day ___ we first met.", ["when", "on which", "that"], ["where", "which", "who"], "relative"],
  ["The book, ___ cover is red, belongs to Tom.", ["whose"], ["which", "who", "that"], "relative"],
  ["He passed the exam, ___ made his parents very happy.", ["which"], ["that", "what", "it"], "relative"],
  ["The photos ___ you took in Hainan are beautiful.", ["that", "which"], ["what", "who", "where"], "relative"],
  ["Do you know the reason ___ she left early?", ["why", "that"], ["which", "because", "what"], "relative"],
];

/** fillItem turns a gap of grammar filling into a typed item whose solution explains its kind. */
function fillItem<K extends string>(why: Record<K, Text>) {
  return ([shown, accepted, wrong, kind]: FillItem<K>): GapItem => {
    const canonical = accepted[0] as string;
    return {
      shown: shownGap(shown),
      accepted,
      canonical,
      wrong,
      solution: joinText([
        why[kind],
        t(`The answer is **${canonical}**.`, `答案是 **${canonical}**。`),
        same(quote(filled(shown, canonical))),
      ]),
    };
  };
}

/** grammarFilling is the grammar-filling part of the language-use section of the paper. */
export const grammarFilling: TopicDef = examTopic({
  id: "gaokao-grammar-filling",
  title: t("Grammar Filling", "语法填空"),
  summary: t(
    "Type the word a gap needs, as in the grammar filling of the Gaokao: first the right form of a given word, then a word of your own where none is given.",
    "按照高考语法填空的形式，填入空格需要的词：先是所给词的正确形式，再是没有给出提示词的空格。",
  ),
  strand: "grammar",
  prerequisites: ["relative-clauses", "active-and-passive-voice", "past-perfect"],
  encompasses: [
    { topic: "relative-clauses", weight: 0.1 },
    { topic: "active-and-passive-voice", weight: 0.1 },
    { topic: "past-perfect", weight: 0.1 },
  ],
  xp: 8,
  points: [
    point(
      "given-words",
      t("The right form of a given word", "所给词的正确形式"),
      t(
        "When a word is given in brackets, decide first what the gap is in the sentence. If the sentence has no main verb yet, the gap is one: choose its tense, and make it passive if the subject receives the action. If the sentence already has its main verb, the given verb is non-finite: *-ing*, the past participle or *to* with the verb. If the gap needs a noun, an adjective or an adverb, change the word class, and check for a plural or a comparison.",
        "括号中给出词时，先判断空格在句中的成分。如果句子还没有谓语动词，空格就是谓语：确定时态，主语是动作的承受者时用被动语态。如果句子已有谓语，所给动词就用非谓语形式：-ing、过去分词或 to 加动词原形。如果空格需要名词、形容词或副词，就转换词性，并注意复数或比较级。",
      ),
      gapGenerator(
        "word-form",
        t("Type the right form of the word in brackets.", "填入括号中所给词的正确形式。"),
        givenWords.map(fillItem(formWhy)),
      ),
    ),
    point(
      "no-word-given",
      t("A gap with no word given", "无提示词的空格"),
      t(
        "When no word is given, the gap needs a small word that the grammar of the sentence is missing. Before a noun, think of an article or a preposition; between two clauses, a conjunction or a relative word; in the place of a noun, a pronoun. Read the words on both sides: a noun after the gap and a clause after it need different words.",
        "没有给出提示词时，空格需要的是句子语法上缺少的一个虚词。名词前，考虑冠词或介词；两个分句之间，考虑连词或关系词；代替名词时，考虑代词。要看空格两边的词：空格后是名词还是从句，需要的词并不相同。",
      ),
      gapGenerator("word-form", t("Type the one word that fills the gap.", "填入一个适当的词。"), noWordGiven.map(fillItem(freeWhy))),
    ),
  ],
});
