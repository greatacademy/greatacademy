// Gaokao reading comprehension: questions on the main idea and on inferences. Each short text, in the words of B1 and
// below, has two questions on what it is mainly about (its main idea and its best title) and two on what it suggests
// (an inference and the writer's attitude or purpose).

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { examTopic, interleave, type SolvedChoice, solvedChoiceGenerator } from "./kit.ts";

/** end gives the period a quoted piece of evidence needs when it has no closing punctuation of its own. */
const end = (evidence: string) => (/[.!?…]$/u.test(evidence) ? "" : ".");

/** Question is a question, its right option, three wrong ones, and the words of the text that decide it. */
type Question = readonly [question: string, right: string, wrong: readonly [string, string, string], evidence: string];

/** Short is a short text with two questions on its main idea and two on what it suggests. */
interface Short {
  readonly text: string;
  readonly main: readonly [Question, Question];
  readonly inferred: readonly [Question, Question];
}

const mainIdea = "What is the text mainly about?";
const bestTitle = "What is the best title for the text?";

const texts: readonly Short[] = [
  {
    text: "Last spring, students at Hillside Middle School turned an empty corner of the playground into a vegetable garden. Every class looks after one bed, and students take turns to water the plants at lunchtime. The vegetables are used in the school kitchen, and anything left over is sold to parents on Fridays. The money pays for seeds for the next year. Mr Green, who started the project, says students now eat more vegetables, because they want to taste what they have grown.",
    main: [
      [
        mainIdea,
        "How a school garden works and what it has achieved.",
        ["Why students should eat more vegetables.", "How to water plants correctly.", "What Mr Green teaches in class."],
        "students at Hillside Middle School turned an empty corner of the playground into a vegetable garden",
      ],
      [
        bestTitle,
        "Growing Lunch at School",
        ["A Teacher's Favourite Food", "How to Sell Vegetables", "A Playground for Games"],
        "The vegetables are used in the school kitchen",
      ],
    ],
    inferred: [
      [
        "What can we infer about the garden?",
        "It pays for itself.",
        ["It is looked after by Mr Green alone.", "Parents grow most of the vegetables.", "It was started many years ago."],
        "The money pays for seeds for the next year",
      ],
      [
        "How does Mr Green feel about the project?",
        "Pleased with its effect on students.",
        ["Worried about the cost.", "Doubtful about its value.", "Tired of looking after it."],
        "students now eat more vegetables, because they want to taste what they have grown",
      ],
    ],
  },
  {
    text: "A recent survey of 2,000 families found that more than half look at their phones during meals. Researchers then asked 100 of these families to leave their phones in another room at dinner for a month. At the end, most parents said they knew more about their children's day, and many children said dinner had become their favourite time of the day. Some families found it hard at first, but only a few went back to their old habits.",
    main: [
      [
        mainIdea,
        "The effect of putting phones away at family meals.",
        ["How many families own phones.", "Why children dislike dinner.", "How researchers choose families."],
        "asked 100 of these families to leave their phones in another room at dinner for a month",
      ],
      [
        bestTitle,
        "Dinner Without Screens",
        ["The Best Phones for Families", "Cooking Together at Home", "Why Surveys Are Useful"],
        "leave their phones in another room at dinner",
      ],
    ],
    inferred: [
      [
        "What can we infer from the last sentence?",
        "Most families kept the new habit.",
        ["The experiment failed.", "Children wanted their phones back.", "Parents found it easier than children."],
        "only a few went back to their old habits",
      ],
      [
        "Why does the writer mention the survey of 2,000 families?",
        "To show that phones at meals are common.",
        ["To prove that phones are harmful.", "To explain how the families were paid.", "To compare parents with children."],
        "more than half look at their phones during meals",
      ],
    ],
  },
  {
    text: 'At seventy-two, Wang Jun decided to learn to swim. He had been afraid of water since he fell into a river as a boy. His granddaughter, a swimming coach, offered to teach him. For the first few lessons he would not put his face in the water. But she never pushed him, and after three months he swam the whole length of the pool. "I wish I had done this fifty years ago," he laughed. Now he swims three times a week and has persuaded two friends to join him.',
    main: [
      [
        mainIdea,
        "An old man getting over a lifelong fear.",
        ["How to become a swimming coach.", "Why rivers are dangerous for children.", "A family holiday by the sea."],
        "He had been afraid of water since he fell into a river as a boy",
      ],
      [
        bestTitle,
        "Never Too Old to Swim",
        ["A Dangerous River", "The Best Swimming Pools", "A Coach's Busy Week"],
        "At seventy-two, Wang Jun decided to learn to swim",
      ],
    ],
    inferred: [
      [
        "What can we learn about the granddaughter?",
        "She was patient with him.",
        ["She made him swim at once.", "She was afraid of water too.", "She had taught his friends."],
        "she never pushed him",
      ],
      [
        "How does Wang Jun feel about learning to swim?",
        "Glad, though he wishes he had started earlier.",
        ["Sorry that he tried it.", "Sure that it was a waste of time.", "Still too frightened to enjoy it."],
        '"I wish I had done this fifty years ago," he laughed',
      ],
    ],
  },
  {
    text: "We usually think of bees as country animals, but more and more of them are living in cities. Scientists in Paris have found that city bees often produce more honey than country bees. One reason is that city parks and gardens offer many different flowers through the year, while farms in the country often grow only one crop. City bees also meet fewer of the chemicals used on farms. However, the scientists warn that too many beehives in one city could leave too little food for wild bees.",
    main: [
      [
        mainIdea,
        "Why bees can do well in cities.",
        ["How honey is made.", "Why farms grow only one crop.", "How to keep bees at home."],
        "city bees often produce more honey than country bees",
      ],
      [
        bestTitle,
        "Busy Bees in the City",
        ["The Dangers of Honey", "Farming Without Chemicals", "A Visit to Paris"],
        "more and more of them are living in cities",
      ],
    ],
    inferred: [
      [
        "What do the scientists suggest at the end?",
        "The number of city beehives should be limited.",
        ["Wild bees should move to farms.", "Cities should plant one kind of flower.", "City bees make better honey than wild bees."],
        "too many beehives in one city could leave too little food for wild bees",
      ],
      [
        "Why does the writer compare parks with farms?",
        "To explain why city bees make more honey.",
        ["To show that farms are dangerous.", "To suggest that farmers should move to cities.", "To describe how parks are planned."],
        "One reason is that city parks and gardens offer many different flowers through the year",
      ],
    ],
  },
  {
    text: "Two years ago, our city library stopped charging fines for late books. Many people expected that books would never come back. In fact, the opposite happened: more books were returned, and thousands of people who had stayed away because of unpaid fines started using the library again. Staff also say they enjoy their work more, now that they no longer have to argue with readers about money.",
    main: [
      [
        mainIdea,
        "The results of ending library fines.",
        ["Why people forget to return books.", "How libraries choose new books.", "The problems of library staff."],
        "our city library stopped charging fines for late books",
      ],
      [
        bestTitle,
        "No Fines, More Readers",
        ["A Library Closes", "Lost Books Found", "Why Books Cost So Much"],
        "thousands of people who had stayed away because of unpaid fines started using the library again",
      ],
    ],
    inferred: [
      [
        "What can we infer about the time before the change?",
        "Fines kept some people away from the library.",
        ["Few books were ever late.", "Staff liked collecting fines.", "The library had too many readers."],
        "who had stayed away because of unpaid fines",
      ],
      [
        "What is the writer's attitude to the change?",
        "Approving.",
        ["Critical.", "Uninterested.", "Doubtful."],
        "In fact, the opposite happened",
      ],
    ],
  },
  {
    text: 'In a small town in Denmark, parents worried that too many children were being driven to school. So they started a "walking bus": each morning, two adults walk a fixed route and collect children at "bus stops" along the way. Within a year, the number of children arriving by car had halved. Teachers noticed that pupils who walked arrived calmer and more ready to learn. The idea has since spread to twelve other towns.',
    main: [
      [
        mainIdea,
        "A way of getting children to walk to school.",
        ["Why Danish towns are small.", "How school buses are driven.", "The dangers of busy roads."],
        'So they started a "walking bus"',
      ],
      [
        bestTitle,
        "A Bus With No Wheels",
        ["Driving Lessons for Parents", "A New School in Denmark", "Teachers Who Walk to Work"],
        "each morning, two adults walk a fixed route and collect children",
      ],
    ],
    inferred: [
      [
        "What can we infer from the last sentence?",
        "Other towns think the idea is a good one.",
        ["The idea failed in Denmark.", "The walking bus has twelve stops.", "Twelve teachers started the idea."],
        "The idea has since spread to twelve other towns",
      ],
      [
        "Why does the writer mention the teachers?",
        "To show another benefit of walking.",
        ["To show that teachers drive to school.", "To explain who started the walking bus.", "To compare teachers with parents."],
        "pupils who walked arrived calmer and more ready to learn",
      ],
    ],
  },
  {
    text: "Some children are nervous about reading aloud in class, afraid that others will laugh at their mistakes. A library in our city has found an unusual answer: dogs. Once a week, children read stories to specially trained dogs, which listen quietly and never correct them. Librarians say that after a few weeks, many of the children read more smoothly and are happy to read in front of people too.",
    main: [
      [
        mainIdea,
        "How dogs help nervous children read aloud.",
        ["How dogs are trained.", "Why children laugh at each other.", "What stories children like."],
        "children read stories to specially trained dogs",
      ],
      [
        bestTitle,
        "A Patient Listener",
        ["The Cleverest Dog in Town", "Rules for the Library", "Learning to Write Stories"],
        "which listen quietly and never correct them",
      ],
    ],
    inferred: [
      [
        "What makes the dogs good listeners for these children?",
        "The children do not feel judged by them.",
        ["Dogs understand the stories.", "Dogs teach children new words.", "Children read better in a quiet room."],
        "never correct them",
      ],
      [
        "What do the librarians think of the idea?",
        "It works well.",
        ["It is too expensive.", "It is fun but not useful.", "It frightens some children."],
        "many of the children read more smoothly and are happy to read in front of people too",
      ],
    ],
  },
  {
    text: 'Every Sunday morning, a group of high school students in Xiamen meet on the beach with bags and gloves. In two hours they collect plastic bottles, fishing nets and bags left by visitors or washed up by the sea. They record everything they find and send the numbers to a university that studies ocean pollution. "At first we just wanted a clean beach," says one member, "but now we feel we are part of real science."',
    main: [
      [
        mainIdea,
        "Students who clean a beach and help research.",
        ["How plastic is made.", "The history of Xiamen.", "How universities teach science."],
        "They record everything they find and send the numbers to a university",
      ],
      [
        bestTitle,
        "Cleaning the Beach for Science",
        ["A Day of Fishing", "Holidays by the Sea", "How to Recycle Bottles"],
        "a university that studies ocean pollution",
      ],
    ],
    inferred: [
      [
        "What can we infer about the students' aims?",
        "They have grown since the group began.",
        ["They want to become fishermen.", "They are paid by the university.", "They care only about the beach."],
        "At first we just wanted a clean beach",
      ],
      [
        "How does the member feel about the work now?",
        "Proud to be helping research.",
        ["Bored with collecting rubbish.", "Angry with the university.", "Worried about the visitors."],
        "now we feel we are part of real science",
      ],
    ],
  },
  {
    text: "Should students take notes by hand or on a laptop? In one study, students who typed wrote down almost every word the teacher said, while those who wrote by hand could not keep up, so they had to choose what was important. A week later, the handwriting group remembered the ideas better. The researchers believe that deciding what to write made them think about the lesson as they listened.",
    main: [
      [
        mainIdea,
        "Why taking notes by hand may help memory.",
        ["How fast students can type.", "Why teachers speak too fast.", "How laptops are used in class."],
        "the handwriting group remembered the ideas better",
      ],
      [
        bestTitle,
        "Pens Beat Keyboards",
        ["The Fastest Typists", "A Laptop for Every Student", "How Teachers Prepare Lessons"],
        "A week later, the handwriting group remembered the ideas better",
      ],
    ],
    inferred: [
      [
        "What can we infer about the students who typed?",
        "They thought less about what they wrote.",
        ["They missed most of the lesson.", "They remembered more after a week.", "They wrote less than the others."],
        "wrote down almost every word the teacher said",
      ],
      [
        "Why does the writer begin with a question?",
        "To introduce the subject of the text.",
        ["To test the reader's memory.", "To show that nobody knows the answer.", "To ask readers to send their notes."],
        "Should students take notes by hand or on a laptop?",
      ],
    ],
  },
  {
    text: 'In many towns, people now bring broken things to "repair cafés" instead of throwing them away. Volunteers who are good with their hands fix lamps, bikes, clothes and toasters for free while visitors drink tea. Visitors are asked to watch and help, so that they can mend things themselves next time. Organisers say that about two thirds of the things brought in leave working again.',
    main: [
      [
        mainIdea,
        "Places where people fix broken things together.",
        ["How to open a café.", "Why toasters break.", "The work of paid repairers."],
        'people now bring broken things to "repair cafés" instead of throwing them away',
      ],
      [
        bestTitle,
        "Don't Throw It Away, Fix It",
        ["The Best Tea in Town", "Buying New Things Cheaply", "A Job for Life"],
        "instead of throwing them away",
      ],
    ],
    inferred: [
      [
        "What can we infer about the things brought to repair cafés?",
        "Some of them cannot be fixed.",
        ["All of them are new.", "Most of them are bikes.", "They are sold after they are repaired."],
        "about two thirds of the things brought in leave working again",
      ],
      [
        "Apart from fixing things, what do repair cafés aim to do?",
        "Teach people to repair things themselves.",
        ["Sell as much tea as possible.", "Train volunteers for paid jobs.", "Collect broken things to sell."],
        "so that they can mend things themselves next time",
      ],
    ],
  },
  {
    text: 'Bright lights, loud music and crowds can make shopping very hard for some people, including many people with autism. One supermarket chain now offers a "quiet hour" every Tuesday evening. The lights are turned down, the music is switched off, and staff avoid making announcements. Shoppers who find normal shops stressful say they can finally do their shopping in peace, and many other customers say they enjoy it too.',
    main: [
      [
        mainIdea,
        "A quieter shopping time for people who need it.",
        ["Why supermarkets play music.", "How to save money when shopping.", "The work of supermarket staff."],
        'One supermarket chain now offers a "quiet hour" every Tuesday evening',
      ],
      [
        bestTitle,
        "Shopping in Peace",
        ["The Loudest Shop in Town", "Lights and Music for Sale", "Tuesday's Special Prices"],
        "they can finally do their shopping in peace",
      ],
    ],
    inferred: [
      [
        "What does the last sentence suggest?",
        "The quiet hour is liked by more people than it was planned for.",
        ["Most customers dislike the quiet hour.", "The quiet hour will soon end.", "Only people with autism shop on Tuesdays."],
        "many other customers say they enjoy it too",
      ],
      [
        "What is the writer's attitude towards the quiet hour?",
        "Supportive.",
        ["Critical.", "Worried.", "Uninterested."],
        "can finally do their shopping in peace",
      ],
    ],
  },
  {
    text: "Thirty years ago, sand from a desert in northern China blew into the villages nearby every spring. Local people began planting trees and grasses that could live with little water. It was slow work: in the early years, many of the young plants died. But the people kept going, and today a green belt several kilometres wide protects the villages. Some families now earn money by growing plants for medicine on land that was once bare sand.",
    main: [
      [
        mainIdea,
        "How local people slowly pushed back a desert.",
        ["Why trees need water.", "How to grow plants for medicine.", "The history of a Chinese village."],
        "Local people began planting trees and grasses that could live with little water",
      ],
      [
        bestTitle,
        "A Green Wall Against the Sand",
        ["Life in the Desert", "Medicine from the Past", "A Windy Spring"],
        "a green belt several kilometres wide protects the villages",
      ],
    ],
    inferred: [
      [
        "What quality of the local people does the text show?",
        "Determination.",
        ["Impatience.", "Carelessness.", "Fear."],
        "But the people kept going",
      ],
      [
        "Why does the writer mention the plants grown for medicine?",
        "To show that the land has become useful.",
        ["To explain why the young plants died.", "To describe the desert thirty years ago.", "To suggest that families should move away."],
        "on land that was once bare sand",
      ],
    ],
  },
  {
    text: "Last summer I worked in a small bookshop. I thought the job would be easy: sit at the desk and read all day. I was wrong. I had to unpack heavy boxes, find books that customers only half remembered and keep the shelves in order. But the owner, Mrs Liu, taught me how to talk to strangers and solve problems quickly. By September I had become far more confident. I had read fewer books than I expected, but I had learned much more.",
    main: [
      [
        mainIdea,
        "What the writer learned from a summer job.",
        ["How to run a bookshop.", "Why bookshops are closing.", "The writer's favourite books."],
        "By September I had become far more confident",
      ],
      [
        bestTitle,
        "More Than Books",
        ["An Easy Summer", "How to Unpack Boxes", "My Favourite Bookshop"],
        "I had read fewer books than I expected, but I had learned much more",
      ],
    ],
    inferred: [
      [
        "What can we infer about the job?",
        "It was harder than the writer expected.",
        ["It was boring.", "It paid very well.", "It lasted a whole year."],
        "I was wrong",
      ],
      [
        "How does the writer feel about Mrs Liu?",
        "Grateful.",
        ["Annoyed.", "Afraid.", "Disappointed."],
        "the owner, Mrs Liu, taught me how to talk to strangers and solve problems quickly",
      ],
    ],
  },
  {
    text: "Everyone yawns, but scientists still argue about why. One old idea was that yawning brings more oxygen into the body, but experiments have not supported it. A newer idea is that yawning cools the brain: people yawn more when the air is warm than when it is very hot or very cold. Yawning is also catching. Seeing, hearing or even reading about yawning can make people yawn, and it spreads most easily between friends and family.",
    main: [
      [
        mainIdea,
        "Some ideas about why people yawn.",
        ["How to stop yawning.", "Why people get tired.", "How the brain uses oxygen."],
        "scientists still argue about why",
      ],
      [
        bestTitle,
        "The Mystery of the Yawn",
        ["Sleep Well Tonight", "A Cool Brain Is a Happy Brain", "Friends and Family"],
        "Everyone yawns, but scientists still argue about why",
      ],
    ],
    inferred: [
      [
        "What can we infer about the oxygen idea?",
        "Scientists now doubt it.",
        ["It has been proved.", "It is the newest idea.", "It explains why yawning is catching."],
        "experiments have not supported it",
      ],
      [
        "What might happen to someone reading this text?",
        "They might yawn while reading it.",
        ["They might feel colder.", "They might need more oxygen.", "They might stop yawning for good."],
        "even reading about yawning can make people yawn",
      ],
    ],
  },
  {
    text: "When the city's community centre offered free phone classes for older people, the organisers expected about twenty to sign up. More than two hundred did. Most wanted to learn simple things: how to make video calls to grandchildren, pay bills or book a doctor's appointment. The teachers are secondary school students, who give up two afternoons a week. \"They are much more patient than my own children,\" joked one learner.",
    main: [
      [
        mainIdea,
        "Teenagers teaching older people to use phones.",
        ["Why phones are expensive.", "How to book a doctor's appointment.", "The work of the centre's organisers."],
        "free phone classes for older people",
      ],
      [
        bestTitle,
        "Young Teachers, Older Learners",
        ["Paying Bills Online", "A Busy Doctor", "Phones Are Bad for Families"],
        "The teachers are secondary school students",
      ],
    ],
    inferred: [
      [
        "What does the number of learners suggest?",
        "Many older people want to learn these skills.",
        ["The classes were badly organised.", "Older people already know how to use phones.", "Twenty teachers were needed."],
        "expected about twenty to sign up. More than two hundred did",
      ],
      [
        "What does the learner's joke suggest about the student teachers?",
        "They are patient with the learners.",
        ["They are often late.", "They are the learners' own children.", "They are strict."],
        "They are much more patient than my own children",
      ],
    ],
  },
];

// Every piece of evidence must be words of its text.
for (const s of texts) {
  for (const [, , , evidence] of [...s.main, ...s.inferred]) {
    if (!s.text.includes(evidence)) throw new Error(`evidence not in its text: ${evidence}`);
  }
}

function items(pick: (s: Short) => readonly Question[], inferred: boolean): readonly SolvedChoice[] {
  return interleave(
    texts.map((s) =>
      pick(s).map(([question, right, wrong, evidence]) => ({
        shown: `${s.text}\n\n**${question}**`,
        right,
        wrong,
        solution: inferred
          ? t(
              `**${right}** The text does not say it in so many words, but it follows from: "${evidence}${end(evidence)}" The other options go further than the text or have no support in it.`,
              `**${right}** 原文没有直接这样说，但可以从这里推出："${evidence}${end(evidence)}" 其他选项超出了原文，或在原文中找不到依据。`,
            )
          : t(
              `**${right}** The key sentence is: "${evidence}${end(evidence)}" The whole text is about this. The other options are only a detail of the text, too wide, or not about it at all.`,
              `**${right}** 关键句是："${evidence}${end(evidence)}" 全文都围绕这一点。其他选项只是文中的一个细节、范围太大，或者与文章无关。`,
            ),
      })),
    ),
  );
}

const question = t("Read the text and answer the question below it.", "阅读短文，回答下方的问题。");

/** mainIdeaAndInference is the Gaokao topic of questions on the main idea and on inferences. */
export const mainIdeaAndInference: TopicDef = examTopic({
  id: "gaokao-main-idea-and-inference",
  title: t("Main Idea and Inference Questions", "主旨大意题与推理判断题"),
  summary: t(
    "Gaokao reading comprehension in short texts: what a text is mainly about and its best title, and what it suggests about people, results and the writer's attitude.",
    "高考阅读理解短文：文章主要讲什么、最佳标题，以及文章对人物、结果和作者态度的暗示。",
  ),
  strand: "reading",
  prerequisites: ["identifying-topic-sentences", "making-inferences"],
  encompasses: [
    { topic: "identifying-topic-sentences", weight: 0.3 },
    { topic: "making-inferences", weight: 0.2 },
  ],
  xp: 12,
  points: [
    point(
      "gaokao-main-idea-questions",
      t("Main Idea and Title", "主旨与标题"),
      t(
        "A main idea question asks what the whole text is about. Look for the sentence the rest of the text explains or supports, often near the beginning, and check that every part of the text fits under it. A good title says the same thing in a few words, sometimes in a lively way, such as *A Bus With No Wheels* for a walking bus.\n\nWrong options are usually of three kinds: a detail from one sentence, which is too narrow; a subject so wide that the text covers only a small part of it; and something the text never discusses.",
        "主旨大意题问的是全文讲什么。找出其余句子都在解释或支持的那句话，它常在开头，再检查文章的每一部分是否都能归到它下面。好的标题用几个词说出同样的意思，有时说得很生动，比如用 *A Bus With No Wheels* 指“步行巴士”。\n\n错误选项通常有三类：某一句中的细节，范围太窄；范围太大的话题，文章只涉及其中很小一部分；以及文章根本没讨论的内容。",
      ),
      solvedChoiceGenerator(
        question,
        items((s) => s.main, false),
      ),
    ),
    point(
      "gaokao-inference-questions",
      t("Inference and Attitude", "推理与态度"),
      t(
        "Inference questions ask what the text suggests: what a person is like, what a result shows, why the writer mentions something, or how the writer or a person feels. The answer is not written in the text, but it must follow from a sentence that is. *She never pushed him* shows that the coach was patient; *only a few went back to their old habits* means that most kept the new one.\n\nFor attitude, look at the words the writer chooses: *in fact, the opposite happened* or *finally ... in peace* show approval. Reject options that go further than the text or that you would only guess.",
        "推理判断题问的是文章暗示了什么：人物是什么样的，结果说明了什么，作者为什么提到某件事，或者作者和人物有什么感受。答案没有写在文中，但必须能从文中某句话推出。*She never pushed him* 说明教练很有耐心；*only a few went back to their old habits* 说明大多数人保持了新习惯。\n\n判断态度要看作者的用词：*in fact, the opposite happened*、*finally ... in peace* 都表示赞同。超出原文或只能靠猜的选项要排除。",
      ),
      solvedChoiceGenerator(
        question,
        items((s) => s.inferred, true),
      ),
    ),
  ],
});
