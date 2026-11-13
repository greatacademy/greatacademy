// TOEFL Reading: questions on a short academic passage. Each passage carries three questions on the meaning of a word
// in its context and three on why the writer mentions something, the two kinds of question that ask most about how a
// passage works rather than what it says.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** Asked is a question on a passage: what it asks, its right option, wrong options and why the right one is right. */
type Asked = readonly [question: string, right: string, wrong: readonly string[], why: string];

/** Passage is a short academic passage with its questions on words and on purpose. */
interface Passage {
  readonly text: string;
  readonly words: readonly Asked[];
  readonly purposes: readonly Asked[];
}

const passages: readonly Passage[] = [
  {
    text: "Deserts are often described as empty, but many are full of life that is simply hard to see. Most desert animals are active only at night, when temperatures drop, and spend the hot day in burrows beneath the sand. Desert plants, too, have adapted: the cactus, for example, stores water in its thick stem and has spines instead of leaves, which reduces the amount of water it loses. After rare rains, seeds that have lain dormant for years can sprout, flower and produce new seeds within a few weeks.",
    words: [
      [
        "The word **adapted** is closest in meaning to",
        "changed to suit their conditions",
        ["grown larger", "moved elsewhere", "become rare"],
        "The sentence goes on to show how the cactus is suited to dry conditions.",
      ],
      [
        "The word **dormant** is closest in meaning to",
        "inactive",
        ["damaged", "hidden by animals", "growing slowly"],
        "The seeds do nothing for years and only sprout after rain.",
      ],
      [
        "The word **reduces** is closest in meaning to",
        "lowers",
        ["measures", "replaces", "increases"],
        "Spines instead of leaves mean less water is lost.",
      ],
    ],
    purposes: [
      [
        "Why does the author mention that deserts are often described as empty?",
        "To introduce a view that the passage then corrects",
        [
          "To give the main reason deserts are dangerous",
          "To show that most scientists agree on this",
          "To explain why few people live in deserts",
        ],
        "The next words, *but many are full of life*, contradict the description.",
      ],
      [
        "Why does the author mention the cactus?",
        "To give an example of how desert plants have adapted",
        ["To compare plants with animals", "To show that deserts have many trees", "To explain how rain falls in deserts"],
        "It is introduced with *for example* after *Desert plants, too, have adapted*.",
      ],
      [
        "Why does the author mention seeds that sprout after rare rains?",
        "To show another way life survives in deserts",
        [
          "To argue that deserts are becoming wetter",
          "To describe how farmers use the desert",
          "To show that desert plants live for a short time only",
        ],
        "It adds one more adaptation to the passage's point that deserts are full of hidden life.",
      ],
    ],
  },
  {
    text: "For most of history, people told the time by the sun, and every town kept its own local time. This caused few problems until the railways arrived in the nineteenth century. A train leaving one town at noon might arrive in another where the clocks showed a different hour, which made timetables almost impossible to follow. To solve this, railway companies adopted a single standard time, and governments later divided the world into time zones.",
    words: [
      [
        "The word **adopted** is closest in meaning to",
        "began to use",
        ["argued against", "invented", "printed"],
        "The companies took up one standard time to solve the problem.",
      ],
      [
        "The phrase **almost impossible** is closest in meaning to",
        "extremely difficult",
        ["slightly confusing", "fully possible", "rarely needed"],
        "*Almost impossible* means very hard, though not completely impossible.",
      ],
      [
        "The word **divided** is closest in meaning to",
        "separated into parts",
        ["joined together", "measured", "travelled around"],
        "The world was split into zones.",
      ],
    ],
    purposes: [
      [
        "Why does the author mention the railways?",
        "To explain why local time became a problem",
        ["To show how fast trains were", "To describe the first timetables in detail", "To argue that railways were dangerous"],
        "*This caused few problems until the railways arrived*: trains made local time a problem.",
      ],
      [
        "Why does the author describe a train leaving one town at noon?",
        "To illustrate the confusion that local times caused",
        ["To show that trains were often late", "To compare two railway companies", "To explain how clocks work"],
        "The example shows how timetables became hard to follow.",
      ],
      [
        "Why does the author mention time zones?",
        "To describe the final solution to the problem",
        ["To introduce a new problem", "To show that governments disagreed with railways", "To explain how the sun moves"],
        "The passage ends with the solution: standard time and then time zones.",
      ],
    ],
  },
  {
    text: "Octopuses are among the most intelligent animals without a backbone. In laboratories, they have learned to open jars to reach food and to find their way through simple mazes. Unusually, about two thirds of an octopus's nerve cells are not in its brain but in its arms, so each arm can respond to touch and taste on its own. Despite this intelligence, most octopuses live for only one or two years, which puzzles scientists, since in other animals large brains usually go together with long lives.",
    words: [
      ["The word **respond** is closest in meaning to", "react", ["belong", "grow", "travel"], "Each arm reacts to what it touches."],
      [
        "The word **puzzles** is closest in meaning to",
        "confuses",
        ["pleases", "frightens", "interests only"],
        "Scientists cannot easily explain the short life.",
      ],
      [
        "The word **unusually** is closest in meaning to",
        "surprisingly",
        ["usually", "fortunately", "recently"],
        "Having most nerve cells in the arms is not what one would expect.",
      ],
    ],
    purposes: [
      [
        "Why does the author mention jars and mazes?",
        "To give evidence of octopuses' intelligence",
        ["To describe how octopuses are caught", "To show that laboratories are unkind to animals", "To compare octopuses with fish"],
        "They come right after the claim that octopuses are intelligent.",
      ],
      [
        "Why does the author mention where an octopus's nerve cells are?",
        "To explain how its arms can act on their own",
        ["To show that octopuses have no brain", "To argue that octopuses are not intelligent", "To describe how octopuses taste food"],
        "*so each arm can respond ... on its own* follows from it.",
      ],
      [
        "Why does the author mention other animals with large brains?",
        "To show why octopuses' short lives are surprising",
        ["To prove that octopuses live a long time", "To list animals more intelligent than octopuses", "To explain how brains grow"],
        "Large brains usually go with long lives, so the octopus is an exception.",
      ],
    ],
  },
  {
    text: "The printing press, developed in Europe around 1450, made books far cheaper to produce. Before then, books were copied by hand, a process that could take months for a single volume. As printed books spread, more people learned to read, and ideas travelled faster than ever before. Some historians argue that without printing, the scientific discoveries of the following centuries would have spread far more slowly, since scientists could now read and test one another's work.",
    words: [
      [
        "The word **volume** is closest in meaning to",
        "book",
        ["sound", "amount", "page"],
        "Here *volume* means one book that was copied by hand.",
      ],
      [
        "The word **spread** is closest in meaning to",
        "became more common",
        ["became cheaper", "were destroyed", "were translated"],
        "Printed books reached more and more people.",
      ],
      ["The word **test** is closest in meaning to", "check", ["write", "sell", "ignore"], "Scientists could check one another's results."],
    ],
    purposes: [
      [
        "Why does the author mention that books were once copied by hand?",
        "To show how much printing changed the making of books",
        [
          "To argue that hand-copied books were better",
          "To describe the life of a copyist",
          "To explain why printing was invented in Europe",
        ],
        "Months of copying contrast with cheap printed books.",
      ],
      [
        "Why does the author mention that more people learned to read?",
        "To describe one effect of printed books",
        ["To explain why books were expensive", "To show that schools were common", "To introduce the history of writing"],
        "It follows *As printed books spread*: it is a result.",
      ],
      [
        "Why does the author mention the views of some historians?",
        "To suggest that printing also affected science",
        [
          "To show that historians disagree about dates",
          "To argue that science began before printing",
          "To criticise scientists of the time",
        ],
        "Their argument links printing to the spread of scientific discoveries.",
      ],
    ],
  },
  {
    text: "Many cities are planting trees along their streets to reduce summer heat. A tree cools the air in two ways: its leaves shade the ground, and it releases water vapour, which absorbs heat as it evaporates. Studies have found that streets with many trees can be several degrees cooler than similar streets without them. Trees are not a complete solution, however; they take years to grow and need water during dry periods, which can be scarce in the hottest cities.",
    words: [
      [
        "The word **releases** is closest in meaning to",
        "gives off",
        ["takes in", "stores", "prevents"],
        "The tree sends water vapour into the air.",
      ],
      [
        "The word **similar** is closest in meaning to",
        "alike",
        ["busier", "older", "different"],
        "The comparison is between streets that are alike except for the trees.",
      ],
      [
        "The word **scarce** is closest in meaning to",
        "in short supply",
        ["cheap", "dirty", "plentiful"],
        "Water is hard to find in the hottest cities.",
      ],
    ],
    purposes: [
      [
        "Why does the author mention water vapour?",
        "To explain one way a tree cools the air",
        ["To show that trees need too much water", "To describe how rain forms", "To argue that cities are too dry"],
        "It is the second of the *two ways* the passage names.",
      ],
      [
        "Why does the author mention studies of streets with many trees?",
        "To support the claim that trees reduce heat",
        ["To show that trees make streets dangerous", "To compare cities in different countries", "To argue that more studies are needed"],
        "The studies give evidence of cooler streets.",
      ],
      [
        "Why does the author mention that trees take years to grow?",
        "To point out a limitation of planting trees",
        [
          "To encourage people to plant more quickly",
          "To describe the life of a tree",
          "To show that cities have planted trees for centuries",
        ],
        "It follows *Trees are not a complete solution, however*.",
      ],
    ],
  },
  {
    text: "Children who grow up speaking two languages often switch between them in the middle of a sentence. Parents sometimes worry that this shows confusion, but researchers have found the opposite: bilingual children switch in regular, rule-governed ways, usually when one language has a better word for what they want to say. In fact, studies suggest that managing two languages may strengthen skills such as concentration and the ability to change between tasks.",
    words: [
      [
        "The word **switch** is closest in meaning to",
        "change",
        ["stop", "repeat", "translate"],
        "The children move from one language to the other.",
      ],
      [
        "The word **regular** is closest in meaning to",
        "following a pattern",
        ["happening rarely", "spoken loudly", "learned at school"],
        "*rule-governed* explains what *regular* means here.",
      ],
      [
        "The word **strengthen** is closest in meaning to",
        "improve",
        ["weaken", "test", "replace"],
        "Managing two languages may make these skills stronger.",
      ],
    ],
    purposes: [
      [
        "Why does the author mention parents' worries?",
        "To present a view that research does not support",
        ["To give advice to parents", "To show that switching is a sign of confusion", "To explain why children learn two languages"],
        "*researchers have found the opposite* answers the worry.",
      ],
      [
        "Why does the author mention that one language may have a better word?",
        "To explain when bilingual children usually switch",
        ["To show that one language is easier", "To argue that children should speak one language", "To describe how words are invented"],
        "It gives the usual reason for switching.",
      ],
      [
        "Why does the author mention concentration and changing between tasks?",
        "To describe possible benefits of being bilingual",
        ["To show problems that bilingual children have", "To compare children with adults", "To explain how languages are taught"],
        "Managing two languages may strengthen these skills.",
      ],
    ],
  },
  {
    text: "Volcanoes are usually seen as destructive, and eruptions can indeed destroy towns and farmland. Over longer periods, however, volcanic ash breaks down into some of the richest soil on Earth. This is why farmers have settled on the slopes of active volcanoes for thousands of years, despite the danger. Today, scientists monitor many volcanoes closely, measuring small earthquakes and changes in the shape of the ground, so that people can be warned before an eruption.",
    words: [
      [
        "The word **destructive** is closest in meaning to",
        "causing great damage",
        ["very large", "hard to predict", "very old"],
        "Eruptions *destroy towns and farmland*.",
      ],
      [
        "The word **settled** is closest in meaning to",
        "made their homes",
        ["argued", "travelled", "stopped farming"],
        "Farmers have lived on the slopes for thousands of years.",
      ],
      [
        "The word **monitor** is closest in meaning to",
        "watch",
        ["climb", "cool", "ignore"],
        "Scientists measure earthquakes and changes in the ground.",
      ],
    ],
    purposes: [
      [
        "Why does the author mention volcanic ash?",
        "To show a benefit of volcanoes over time",
        ["To describe how eruptions begin", "To explain why towns are destroyed", "To warn farmers about danger"],
        "Ash becomes some of the richest soil.",
      ],
      [
        "Why does the author mention farmers on the slopes of active volcanoes?",
        "To illustrate how valuable volcanic soil is",
        ["To show that farmers do not know the danger", "To argue that farming should be banned", "To describe how volcanoes are measured"],
        "*This is why* links them to the rich soil.",
      ],
      [
        "Why does the author mention small earthquakes?",
        "To give an example of what scientists measure",
        ["To show that eruptions are rare", "To describe damage to towns", "To explain how soil forms"],
        "They are named among the things scientists measure to give warnings.",
      ],
    ],
  },
  {
    text: "Migrating birds can fly thousands of kilometres and return to the same place each year. Scientists believe they use several sources of information to find their way. Some birds follow the position of the sun during the day and the stars at night. Others appear to sense the Earth's magnetic field, as if they carried a compass. Young birds on their first journey often travel with older ones, which suggests that experience also plays a part.",
    words: [
      [
        "The word **sources** is closest in meaning to",
        "places it comes from",
        ["dangers", "journeys", "rules"],
        "The passage lists where the information comes from: the sun, the stars, the magnetic field, experience.",
      ],
      ["The word **sense** is closest in meaning to", "detect", ["avoid", "change", "imagine"], "The birds notice the magnetic field."],
      [
        "The word **appear** is closest in meaning to",
        "seem",
        ["refuse", "begin", "need"],
        "*appear to* shows that scientists are not certain.",
      ],
    ],
    purposes: [
      [
        "Why does the author mention a compass?",
        "To make the idea of a magnetic sense easier to picture",
        ["To show that birds were studied by sailors", "To argue that birds are lost without help", "To describe a tool scientists use"],
        "*as if they carried a compass* compares the sense to something familiar.",
      ],
      [
        "Why does the author mention the sun and the stars?",
        "To give examples of information birds use",
        ["To explain why birds fly at night", "To show that birds cannot see well", "To describe the weather on migrations"],
        "They are among the *several sources of information*.",
      ],
      [
        "Why does the author mention young birds travelling with older ones?",
        "To suggest that learning helps birds find their way",
        ["To show that young birds are weak", "To describe the size of flocks", "To argue that old birds lead every flight"],
        "*which suggests that experience also plays a part*.",
      ],
    ],
  },
  {
    text: "In the early twentieth century, most buildings were heated by burning coal, which filled city air with smoke. In London, a thick fog mixed with smoke in December 1952 and stayed over the city for five days. Thousands of people died from breathing problems as a result. The disaster led to new laws that limited the burning of coal in cities, and within a few decades the air of London had become far cleaner.",
    words: [
      [
        "The word **limited** is closest in meaning to",
        "restricted",
        ["encouraged", "measured", "allowed freely"],
        "The laws reduced how much coal could be burned.",
      ],
      [
        "The phrase **as a result** is closest in meaning to",
        "because of this",
        ["in spite of this", "at the same time", "for example"],
        "The deaths were caused by the fog and smoke.",
      ],
      ["The word **thick** is closest in meaning to", "dense", ["thin", "cold", "brief"], "A fog that is hard to see through."],
    ],
    purposes: [
      [
        "Why does the author mention the burning of coal?",
        "To explain where the smoke in city air came from",
        ["To describe how houses were built", "To show that coal was cheap", "To compare London with other cities"],
        "Coal *filled city air with smoke*.",
      ],
      [
        "Why does the author describe the fog of December 1952?",
        "To give an example of how serious air pollution could be",
        ["To describe the weather of London", "To show that fog is common in winter", "To argue that the laws came too early"],
        "Thousands died: it shows how dangerous the smoke was.",
      ],
      [
        "Why does the author mention new laws?",
        "To show how the disaster led to change",
        ["To argue that the laws failed", "To describe how laws are made", "To show that people ignored the disaster"],
        "*The disaster led to new laws* and the air became cleaner.",
      ],
    ],
  },
  {
    text: "Elephants communicate in ways that humans long failed to notice. Besides the trumpeting sounds people know, they make very low rumbles, many of them too deep for human ears to hear. These sounds can travel several kilometres through the air and the ground. Researchers who placed sensors in the earth found that elephants may detect such rumbles through their feet, allowing herds that are far apart to keep in contact.",
    words: [
      [
        "The word **notice** is closest in meaning to",
        "become aware of",
        ["agree with", "copy", "explain"],
        "Humans did not realise elephants communicated this way.",
      ],
      [
        "The word **detect** is closest in meaning to",
        "pick up",
        ["make", "block", "forget"],
        "Elephants may feel the rumbles through their feet.",
      ],
      [
        "The phrase **keep in contact** is closest in meaning to",
        "stay in touch",
        ["stay apart", "fight", "travel together"],
        "Herds far apart can still communicate.",
      ],
    ],
    purposes: [
      [
        "Why does the author mention trumpeting sounds?",
        "To contrast familiar elephant sounds with less known ones",
        ["To show that elephants are loud", "To explain how elephants frighten enemies", "To describe a sound humans cannot hear"],
        "*Besides the trumpeting sounds people know*, there are low rumbles.",
      ],
      [
        "Why does the author mention that the rumbles are too deep for human ears?",
        "To explain why humans failed to notice them",
        ["To show that elephants hear badly", "To argue that the sounds are not important", "To describe how sensors work"],
        "It explains the first sentence: humans long failed to notice.",
      ],
      [
        "Why does the author mention sensors in the earth?",
        "To show how researchers learned that sound travels through the ground",
        ["To describe how elephants are tracked by hunters", "To show that elephants dig holes", "To argue that sensors harm elephants"],
        "The sensors led to the finding about elephants' feet.",
      ],
    ],
  },
];

function items(asked: (p: Passage) => readonly Asked[], purpose: boolean): readonly SolvedChoice[] {
  return interleave(
    passages.map((p) =>
      asked(p).map(([question, right, wrong, why]) => ({
        shown: `${p.text}\n\n**${question}**`,
        right,
        wrong,
        solution: purpose
          ? t(
              `**${right}**. ${why} A question about why something is mentioned asks what it does in the passage: an example, a contrast, a cause, a limitation. Look at the sentence before it and the words that introduce it.`,
              `**${right}**。${why} 问“为什么提到某事”，问的是它在文章中的作用：举例、对比、原因还是局限。看它前面的一句和引出它的词。`,
            )
          : t(
              `**${right}**. ${why} Put the option in place of the word: the right one keeps the meaning of the sentence. A common meaning of the word that does not fit here is the usual trap.`,
              `**${right}**。${why} 把选项代入原词的位置：正确的选项能保持句子的意思。这个词的常见意思如果在这里不合适，就是常见的陷阱。`,
            ),
      })),
    ),
  );
}

/** passageQuestions is the TOEFL topic of questions on words and purpose in academic passages. */
export const passageQuestions: TopicDef = examTopic({
  id: "toefl-passage-questions",
  title: t("Words and Purpose in Academic Passages", "学术文章中的词义与写作意图"),
  summary: t(
    "TOEFL-style questions after short academic passages: the meaning of a word in its context, and why the writer mentions something.",
    "托福风格的学术短文题：词在上下文中的意思，以及作者为什么提到某事。",
  ),
  strand: "reading",
  prerequisites: ["context-clues", "authors-purpose"],
  encompasses: [
    { topic: "context-clues", weight: 0.3 },
    { topic: "authors-purpose", weight: 0.3 },
  ],
  xp: 10,
  points: [
    point(
      "toefl-word-in-context",
      t("A Word in Its Context", "上下文中的词义"),
      t(
        "The question asks what a word means in this sentence, not in general. Read the whole sentence and the one after it: they often explain the word, give an example or say the opposite. Then put each option in its place and keep the one that leaves the meaning unchanged.",
        "题目问的是词在这个句子里的意思，不是一般的意思。读完整句和后一句：它们常常解释这个词、举例，或者说出相反的意思。再把每个选项代入原词的位置，保留不改变句意的那个。",
      ),
      solvedChoiceGenerator(
        t("Choose the best answer.", "选出最佳答案。"),
        items((p) => p.words, false),
      ),
    ),
    point(
      "toefl-why-mentioned",
      t("Why the Writer Mentions It", "作者为什么提到它"),
      t(
        "A question such as *Why does the author mention X?* asks about the job X does in the passage. Find X, then read what comes before it: a claim it supports, a view it contrasts with, a problem it causes or solves. Signal words help: *for example* marks an example, *however* a contrast or limitation, *this is why* a cause.",
        "*Why does the author mention X?* 这类题问的是 X 在文章中的作用。找到 X，再读它前面的内容：它支持的观点、与之对比的看法、它引起或解决的问题。信号词有帮助：*for example* 表示举例，*however* 表示对比或局限，*this is why* 表示原因。",
      ),
      solvedChoiceGenerator(
        t("Choose the best answer.", "选出最佳答案。"),
        items((p) => p.purposes, true),
      ),
    ),
  ],
});
