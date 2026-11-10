// Argument: claims, evidence, reasoning and counterclaims, for grades 6 to 8.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

const claimBank: readonly ChoiceItem[] = [
  [
    "",
    "Schools should start an hour later to let students sleep.",
    ["Most schools start between seven and eight.", "Teenagers need eight to ten hours of sleep."],
  ],
  ["", "Our city must build more bike lanes.", ["The city has twelve miles of bike lanes.", "Many people ride bikes to work."]],
  [
    "",
    "Homework in elementary school does more harm than good.",
    ["Many students do homework after dinner.", "A survey asked parents about homework."],
  ],
  ["", "Zoos do important work to protect endangered animals.", ["The city zoo has two hundred animals.", "Some zoos breed rare animals."]],
  ["", "Every student should learn a second language.", ["Spanish is taught at our school.", "Millions of people speak two languages."]],
  ["", "Plastic bags should be banned in grocery stores.", ["Plastic bags are made from oil.", "Some stores charge for bags."]],
  [
    "",
    "Video games can help young people learn problem solving.",
    ["Many teenagers play video games.", "The first video games appeared in the 1970s."],
  ],
  ["", "The school lunch period should be longer.", ["Lunch lasts twenty-five minutes.", "The cafeteria serves pizza on Fridays."]],
];

const relevantEvidenceBank: readonly ChoiceItem[] = [
  [
    "Claim: Schools should start later.",
    "A study found that students who started later had better grades and attendance.",
    ["Many students ride the bus to school.", "Some teachers prefer to arrive early."],
  ],
  [
    "Claim: Our town needs a public library branch on the east side.",
    "East-side families travel forty minutes to reach the nearest library.",
    ["The main library was built in 1920.", "Libraries lend books and movies."],
  ],
  [
    "Claim: Recess improves learning.",
    "Teachers report that students focus better in class after a break to play.",
    ["Recess usually happens outside.", "Students play tag and soccer at recess."],
  ],
  [
    "Claim: Planting trees cools city streets.",
    "Streets lined with trees are up to ten degrees cooler on summer afternoons.",
    ["Oak trees can live for centuries.", "Leaves change color in the fall."],
  ],
  [
    "Claim: Learning music helps students in other subjects.",
    "Students in music programs scored higher on math tests in several studies.",
    ["The band plays at every football game.", "Pianos have eighty-eight keys."],
  ],
  [
    "Claim: Pets can make people healthier.",
    "Dog owners walk more each day than people without dogs, on average.",
    ["Dogs come in hundreds of breeds.", "Cats were kept in ancient Egypt."],
  ],
  [
    "Claim: Cell phones should be put away during class.",
    "Students who kept their phones away remembered more of the lesson in a recent study.",
    ["Most phones have cameras.", "Phones were invented in the 1970s."],
  ],
  [
    "Claim: Students should help plan the school menu.",
    "When students chose some meals at one school, far less food was thrown away.",
    ["The cafeteria opens at eleven.", "Lunch trays are washed every day."],
  ],
];

const strongerEvidenceBank: readonly ChoiceItem[] = [
  [
    "Claim: Our school should add a recycling program.",
    "Last month, the school threw away four hundred pounds of paper that could have been recycled.",
    ["My friend thinks recycling is cool.", "Everybody knows recycling is good."],
  ],
  [
    "Claim: The park needs more lights.",
    "Police reports show that most problems in the park happen after dark in its unlit areas.",
    ["I feel a little scared in the park at night.", "Parks are nicer when they are bright."],
  ],
  [
    "Claim: The crosswalk near the school is dangerous.",
    "There were six accidents at that crosswalk last year, according to city records.",
    ["Some parents say the crosswalk seems risky.", "Crosswalks can be dangerous anywhere."],
  ],
  [
    "Claim: Students need more time for lunch.",
    "In a survey of three hundred students, most said they could not finish eating in twenty minutes.",
    ["One student said lunch feels short.", "Lunch is the best part of the day."],
  ],
  [
    "Claim: Reading for fun improves vocabulary.",
    "Researchers found that students who read for fun learned thousands more words each year.",
    ["Reading is a fun way to spend time.", "My sister reads a lot and seems smart."],
  ],
  [
    "Claim: The town pool should stay open later.",
    "Records show the pool is full every evening until it closes at six.",
    ["Swimming is great exercise.", "A few kids wish the pool stayed open."],
  ],
  [
    "Claim: Walking to school is good for students' health.",
    "Doctors recommend sixty minutes of activity a day, and a walk to school can supply a third of it.",
    ["Walking is something everyone can do.", "I like to walk with my friends."],
  ],
  [
    "Claim: The library needs more computers.",
    "Each afternoon, students wait an average of thirty minutes to use one of the four computers.",
    ["Computers are important nowadays.", "Some students would like a computer."],
  ],
];

const reasoningBank: readonly ChoiceItem[] = [
  [
    "Claim: Schools should start later. Evidence: Teenagers' bodies fall asleep late at night.",
    "If students cannot fall asleep early, a later start lets them get the sleep they need.",
    ["Many schools start at eight.", "Teenagers like to stay up late."],
  ],
  [
    "Claim: The town should plant more trees. Evidence: Tree-lined streets are much cooler in summer.",
    "Cooler streets would make summers safer and more comfortable for everyone in town.",
    ["Trees are beautiful in every season.", "Some streets already have trees."],
  ],
  [
    "Claim: Students should learn to cook. Evidence: Home-cooked meals tend to be healthier than fast food.",
    "Knowing how to cook lets students choose healthier meals for the rest of their lives.",
    ["Cooking classes are fun.", "Fast food is sold everywhere."],
  ],
  [
    "Claim: The library should open on Sundays. Evidence: Most students do big projects on weekends.",
    "Opening on Sunday would give students resources at the time they need them most.",
    ["The library is closed on Sundays.", "Many families go out on Sundays."],
  ],
  [
    "Claim: Bike lanes make streets safer. Evidence: Cities with bike lanes report fewer crashes with cyclists.",
    "Separating bikes from cars gives them less chance to collide.",
    ["Bikes are cheaper than cars.", "Cycling is popular in many cities."],
  ],
  [
    "Claim: Students should have a say in rules. Evidence: People follow rules more when they helped make them.",
    "If students help write the rules, they will feel they are fair and be more likely to follow them.",
    ["Rules are posted in every classroom.", "Some rules are very old."],
  ],
  [
    "Claim: Families should eat dinner together. Evidence: Children who eat with family do better in school.",
    "Shared meals give children time to talk about their day and get support with their problems.",
    ["Dinner is usually eaten in the evening.", "Some families eat in front of the TV."],
  ],
  [
    "Claim: Our school needs a garden. Evidence: Students who grow vegetables are more willing to eat them.",
    "A garden would lead students to eat more vegetables and be healthier.",
    ["Vegetables grow best in the spring.", "Our school has a large field."],
  ],
];

const counterclaimBank: readonly ChoiceItem[] = [
  [
    "Claim: Schools should require uniforms.",
    "Some say uniforms limit students' freedom to express themselves.",
    ["Uniforms reduce the pressure to wear expensive clothes.", "Uniforms make mornings easier for families."],
  ],
  [
    "Claim: Homework should be limited to thirty minutes a night.",
    "Others argue that more practice at home leads to higher test scores.",
    ["Too much homework leaves no time for sleep.", "Students need time for family and play."],
  ],
  [
    "Claim: The town should build a skate park.",
    "Critics worry that a skate park will be noisy for the nearby houses.",
    ["Skaters now ride in parking lots, which is dangerous.", "A skate park gives teenagers a safe place to meet."],
  ],
  [
    "Claim: Students should be allowed to use phones at lunch.",
    "Some teachers believe phones keep students from talking to one another.",
    ["Phones let students check on family plans.", "Lunch is students' own free time."],
  ],
  [
    "Claim: Zoos should be closed.",
    "Supporters point out that zoos help save endangered species.",
    ["Large animals need more space than zoos give them.", "Animals in zoos often show signs of stress."],
  ],
  [
    "Claim: School should run all year with shorter breaks.",
    "Many families say summer is their only time to travel together.",
    ["Students forget less over short breaks.", "Teachers spend less time on review."],
  ],
  [
    "Claim: The city should ban cars from Main Street.",
    "Shop owners fear that without cars, fewer customers will come.",
    ["Walkers would make the street livelier.", "The air on Main Street would be cleaner."],
  ],
  [
    "Claim: Students should choose their own reading books.",
    "Some teachers argue that assigned books expose students to important works they would not pick.",
    ["Choice makes students more eager to read.", "Students who read more read better."],
  ],
];

const rebuttalBank: readonly ChoiceItem[] = [
  [
    "Counterclaim: Uniforms limit self-expression.",
    "However, students can still express themselves through their ideas, art and activities.",
    ["Uniforms do limit what students can wear.", "Uniforms come in many colors."],
  ],
  [
    "Counterclaim: A skate park will be too noisy.",
    "However, the park could be built in the field by the highway, far from any homes.",
    ["Skateboards are very noisy.", "Many people dislike noise."],
  ],
  [
    "Counterclaim: Without cars, shops on Main Street will lose customers.",
    "Yet towns that closed streets to cars found that shops gained customers from more people walking by.",
    ["Shops do need customers.", "Some people drive to every store."],
  ],
  [
    "Counterclaim: More homework raises test scores.",
    "Still, research shows that beyond about an hour, extra homework adds little for young students.",
    ["Practice can help students learn.", "Test scores matter to schools."],
  ],
  [
    "Counterclaim: Phones keep students from talking at lunch.",
    "However, a simple rule of phones down for the first ten minutes could keep conversation going.",
    ["Phones can be distracting.", "Students like to talk at lunch."],
  ],
  [
    "Counterclaim: Zoos save endangered species.",
    "But most zoo animals are not endangered, and wildlife parks can protect rare species in their own habitats.",
    ["Some species have been saved by zoos.", "Zoos are popular with families."],
  ],
  [
    "Counterclaim: Families need summer to travel.",
    "However, a year-round calendar includes several breaks of two or three weeks that families can use for trips.",
    ["Summer is a good time to travel.", "Travel can be expensive."],
  ],
  [
    "Counterclaim: Assigned books expose students to important works.",
    "Even so, teachers can offer a list of important books and let students choose from it.",
    ["Some classic books are important.", "Teachers know many good books."],
  ],
];

const preciseClaimBank: readonly ChoiceItem[] = [
  ["", "Our school should replace soda machines with water fountains.", ["Drinks are important.", "Our school has two soda machines."]],
  ["", "The town should keep the library open until nine on weeknights.", ["Libraries are good.", "The library closes at six."]],
  ["", "Middle schools should offer cooking as a required class.", ["Cooking is a thing people do.", "Some schools have kitchens."]],
  ["", "Every classroom should have ten minutes of silent reading each day.", ["Reading matters a lot.", "Our class reads on Mondays."]],
  [
    "",
    "The city should turn the empty lot on Oak Street into a community garden.",
    ["Gardens are nice.", "The lot on Oak Street is empty."],
  ],
  ["", "Students should be allowed to retake one test each term.", ["Tests are a big deal.", "Our school gives tests every month."]],
  [
    "",
    "Buses should stop at the new apartments on River Road.",
    ["Transportation is important.", "New apartments were built on River Road."],
  ],
  ["", "Our team should practice three times a week instead of two.", ["Sports are fun.", "The team practices on Tuesdays and Thursdays."]],
];

const conclusionBank: readonly ChoiceItem[] = [
  [
    "Evidence: In our class survey, 20 of 25 students said they like science.",
    "Most students in our class like science.",
    ["All students everywhere love science.", "Science is the best subject."],
  ],
  [
    "Evidence: The new crosswalk had no accidents in its first year, while the old one had five.",
    "The new crosswalk seems to have made that corner safer.",
    ["Crosswalks prevent all accidents.", "No one will ever be hurt there again."],
  ],
  [
    "Evidence: Three of the five apple trees in the orchard had worms this year.",
    "Worms were a problem for many trees in the orchard this year.",
    ["Every apple tree in the country has worms.", "Apples are no longer safe to eat."],
  ],
  [
    "Evidence: Sales of the school's healthy snacks doubled after prices were lowered.",
    "Lower prices led more students to buy the healthy snacks.",
    ["Students only care about prices.", "All students now eat healthy food."],
  ],
  [
    "Evidence: Two students who studied with flash cards scored higher than they had before.",
    "Flash cards may have helped those two students.",
    ["Flash cards are the only way to study.", "Every student will score higher with flash cards."],
  ],
  [
    "Evidence: The park cleanup filled forty bags with trash, mostly plastic bottles.",
    "Plastic bottles are a large part of the litter in the park.",
    ["The whole city is covered in trash.", "People never recycle bottles."],
  ],
  [
    "Evidence: On the three hottest days in June, the pool had record crowds.",
    "Hot weather brings more people to the pool.",
    ["Everyone in town loves swimming.", "The pool is always crowded."],
  ],
  [
    "Evidence: A study of one thousand students found that those who slept more had better grades on average.",
    "More sleep is linked to better grades for many students.",
    ["Sleeping more guarantees perfect grades.", "Students with low grades never sleep."],
  ],
];

/** Say gives the feedback for a wrong option, in English and Chinese. */
type Say = (wrong: string, right: string, shown: string, position: number) => readonly [string, string];

const pick = (
  question: [string, string],
  bank: readonly ChoiceItem[],
  en: (right: string) => string,
  zh: (right: string) => string,
  not: Say,
) =>
  choiceGenerator(
    t(question[0], question[1]),
    bank,
    (right) => t(en(right), zh(right)),
    (wrong, right, shown, position) => t(...not(wrong, right, shown, position)),
  );

const factNot: Say = (wrong) => [
  `*${wrong}* is a fact about the subject: it can be checked, so no one would argue about it. A claim takes a position that someone could disagree with.`,
  `*${wrong}* 是关于话题的事实：它可以核实，没有人会为它争论。论点要表明一个别人可能反对的立场。`,
];

const preciseNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `*${wrong}* is too vague to argue for: it does not say what should change, or who should do it.`,
        `*${wrong}* 太笼统，无法论证：它没有说出应该改变什么、由谁来做。`,
      ]
    : factNot(wrong, _right, _shown, position);

const unrelatedNot: Say = (wrong) => [
  `*${wrong}* is about the same subject, but even if it is true, it gives no reason to accept the claim.`,
  `*${wrong}* 和论点话题相同，但即使它是真的，也不能成为接受论点的理由。`,
];

const weakNot: Say = (wrong) => [
  `*${wrong}* is a feeling, one person's experience or a general statement. It gives no facts, numbers or records that a reader could check.`,
  `*${wrong}* 只是感受、个人经历或泛泛之谈。它没有提供读者可以核实的事实、数据或记录。`,
];

const reasoningNot: Say = (wrong) => [
  `*${wrong}* only adds another fact or opinion about the subject. It does not explain why the evidence makes the claim true.`,
  `*${wrong}* 只是又加了一个关于话题的事实或看法，没有解释为什么论据能证明论点。`,
];

const conclusionNot: Say = (wrong) => [
  `*${wrong}* goes further than the evidence: it speaks of all, every, never or only, or of something the evidence never measured.`,
  `*${wrong}* 超出了论据的范围：它说的是"所有""每个""从不""只有"，或是论据根本没有测量过的东西。`,
];

const sideNot: Say = (wrong) => [
  `*${wrong}* supports the claim. A counterclaim is a view from the other side, one that disagrees with the claim.`,
  `*${wrong}* 是在支持论点。反方观点来自另一方，是不同意这个论点的看法。`,
];

const rebuttalNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `*${wrong}* agrees with the counterclaim. A rebuttal answers it, with a reason or evidence that it is wrong or matters less.`,
        `*${wrong}* 是在赞同反方观点。反驳要回应它，用理由或证据说明它不对或没那么重要。`,
      ]
    : [
        `*${wrong}* does not answer the counterclaim at all: it gives no reason to doubt it.`,
        `*${wrong}* 根本没有回应反方观点：它没有提出任何怀疑它的理由。`,
      ];

/** argumentTopics are the topics of reading and building arguments in grades 6 to 8: claims, evidence, reasoning and counterclaims. */
export const argumentTopics: readonly TopicDef[] = [
  {
    id: "claims",
    title: t("Claims", "论点"),
    summary: t("The position an argument takes, as opposed to a fact about the subject.", "论证所持的立场，区别于关于话题的事实。"),
    prerequisites: ["fact-and-opinion"],
    encompasses: [{ topic: "fact-and-opinion", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "finding-the-claim",
        t("Finding the Claim", "找出论点"),
        t(
          "A **claim** is the position an argument takes: something that people could reasonably disagree with and that the writer will try to prove. *Schools should start later* is a claim. *Most schools start before eight* is a fact, which can be checked and could serve as evidence. Claims often use words such as *should, must* or *more than*.",
          "**论点**是论证所持的立场：别人可以合理地反对、作者要设法证明的观点。*Schools should start later* 是论点。*Most schools start before eight* 是事实，可以核实，也可以用作论据。论点常用 *should, must, more than* 这样的词。",
        ),
        pick(
          ["Which sentence is a claim that an argument could prove?", "哪个句子是可以用论证来证明的论点？"],
          claimBank,
          (right) =>
            `*${right}* takes a position that people could disagree with. The other sentences are facts, which could be evidence but not the claim.`,
          (right) => `*${right}* 表明了一个别人可能反对的立场。其他句子是事实，可以作为论据，但不是论点。`,
          factNot,
        ),
      ),
      point(
        "precise-claims",
        t("Precise Claims", "明确的论点"),
        t(
          "A good claim is **precise**: it says exactly what should happen or what is true, so the reader knows what the argument will prove. *Drinks are important* is too vague to argue about. *Our school should replace soda machines with water fountains* tells exactly what the writer wants and could be supported with evidence.",
          "好的论点是**明确的**：它准确说出应该发生什么或什么是真的，让读者知道论证要证明什么。*Drinks are important* 太含糊，无从论证。*Our school should replace soda machines with water fountains* 准确说出了作者的主张，并且可以用论据支持。",
        ),
        pick(
          ["Which is the most precise claim?", "哪一项是最明确的论点？"],
          preciseClaimBank,
          (right) => `*${right}* says exactly what the writer wants. One other choice is too vague to argue, and the other is a fact.`,
          (right) => `*${right}* 准确说出了作者的主张。另一个选项太含糊，无法论证；还有一个是事实。`,
          preciseNot,
        ),
      ),
    ],
  },
  {
    id: "evidence",
    title: t("Evidence", "论据"),
    summary: t("Evidence that is relevant to a claim, and evidence that is strong.", "与论点相关的论据，以及有力的论据。"),
    prerequisites: ["claims"],
    encompasses: [{ topic: "claims", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "relevant-evidence",
        t("Relevant Evidence", "相关的论据"),
        t(
          "**Evidence** is the facts, numbers, examples and expert findings that support a claim. Evidence is **relevant** only if it helps prove the claim. A true fact about the same subject that does not bear on the claim is not relevant, however interesting it is.",
          "**论据**是支持论点的事实、数字、例子和专家的发现。只有能帮助证明论点的论据才是**相关的**。一个关于同一话题、却与论点无关的真实事实，再有趣也不相关。",
        ),
        pick(
          ["Which evidence is relevant to the claim?", "哪项论据与论点相关？"],
          relevantEvidenceBank,
          (right) => `*${right}* helps prove the claim. The other sentences are about the same subject but do not support the claim.`,
          (right) => `*${right}* 有助于证明论点。其他句子与同一话题有关，却不支持这个论点。`,
          unrelatedNot,
        ),
      ),
      point(
        "stronger-evidence",
        t("Stronger Evidence", "更有力的论据"),
        t(
          "Strong evidence is specific and can be checked: numbers, records, studies and surveys of many people. Weak evidence is a personal feeling, one person's opinion, or a vague statement such as *everybody knows*. When two pieces of evidence support the same claim, choose the one a doubting reader could check.",
          "有力的论据具体且可以核实：数字、记录、研究和对许多人的调查。薄弱的论据是个人感受、一个人的看法，或者 *everybody knows* 这样含糊的说法。当两条论据支持同一论点时，选择持怀疑态度的读者能够核实的那一条。",
        ),
        pick(
          ["Which is the strongest evidence for the claim?", "哪项是支持论点最有力的论据？"],
          strongerEvidenceBank,
          (right) => `*${right}* is specific and can be checked. The other choices are feelings, one person's view or vague statements.`,
          (right) => `*${right}* 具体且可以核实。其他选项是感受、一个人的看法或含糊的说法。`,
          weakNot,
        ),
      ),
    ],
  },
  {
    id: "reasoning",
    title: t("Reasoning", "推理"),
    summary: t("The explanation of how evidence supports a claim.", "说明论据如何支持论点的解释。"),
    prerequisites: ["evidence"],
    encompasses: [{ topic: "evidence", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "connecting-evidence-to-claim",
        t("Connecting Evidence to the Claim", "把论据和论点联系起来"),
        t(
          "**Reasoning** explains why the evidence proves the claim. It builds a bridge: *if* this evidence is true, *then* the claim follows, *because*… Reasoning does not repeat the evidence or add an unrelated fact; it shows the link between the two.",
          "**推理**解释论据为什么能证明论点。它搭起一座桥：*如果*这个论据成立，*那么*论点就成立，*因为*……推理不是重复论据，也不是添加无关的事实，而是揭示两者之间的联系。",
        ),
        pick(
          ["Which sentence best explains how the evidence supports the claim?", "哪个句子最好地解释了论据如何支持论点？"],
          reasoningBank,
          (right) => `*${right}* links the evidence to the claim. The other sentences add facts or opinions without showing that link.`,
          (right) => `*${right}* 把论据和论点联系起来。其他句子只是添加了事实或看法，没有揭示这种联系。`,
          reasoningNot,
        ),
      ),
      point(
        "conclusions-that-fit",
        t("Conclusions That Fit the Evidence", "与论据相符的结论"),
        t(
          "Sound reasoning claims no more than the evidence shows. A survey of one class tells you about that class, not about all students everywhere. Watch for words such as *all, every, never, always* and *only*: they often stretch a conclusion past its evidence.",
          "合理的推理不会超出论据所能证明的范围。对一个班的调查只能说明这个班，而不能说明各地所有学生。留意 *all, every, never, always, only* 这样的词：它们常常让结论超出论据。",
        ),
        pick(
          ["Which conclusion does the evidence support?", "论据支持哪个结论？"],
          conclusionBank,
          (right) =>
            `*${right}* claims no more than the evidence shows. The other conclusions go far beyond it or give an opinion it does not prove.`,
          (right) => `*${right}* 没有超出论据所能证明的范围。其他结论远远超出了论据，或者给出了论据无法证明的看法。`,
          conclusionNot,
        ),
      ),
    ],
  },
  {
    id: "counterclaims-and-rebuttals",
    title: t("Counterclaims and Rebuttals", "反方观点与反驳"),
    summary: t("An opposing view an argument takes up, and the answer to it.", "论证中提到的反对意见，以及对它的回应。"),
    prerequisites: ["reasoning"],
    encompasses: [{ topic: "reasoning", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "finding-the-counterclaim",
        t("Finding the Counterclaim", "找出反方观点"),
        t(
          "A **counterclaim** is a view that opposes the writer's claim. Strong arguments state one fairly, often after words such as *some say, critics argue* or *others believe*. A reason that supports the writer's own claim is not a counterclaim, even if it appears near one.",
          "**反方观点**是与作者论点相反的观点。有力的论证会公正地陈述反方观点，常常用 *some say, critics argue, others believe* 这样的词引出。支持作者自己论点的理由不是反方观点，即使它出现在反方观点旁边。",
        ),
        pick(
          ["Which sentence states a counterclaim to this claim?", "哪个句子陈述了这个论点的反方观点？"],
          counterclaimBank,
          (right) => `*${right}* opposes the claim. The other sentences are reasons that support it.`,
          (right) => `*${right}* 反对这个论点。其他句子是支持论点的理由。`,
          sideNot,
        ),
      ),
      point(
        "choosing-a-rebuttal",
        t("Choosing a Rebuttal", "选择反驳"),
        t(
          "A **rebuttal** answers a counterclaim and shows why the writer's claim still holds. It often begins with *however, yet, still* or *even so*, and it gives a reason or evidence. Agreeing with the counterclaim, or repeating a general fact, is not a rebuttal.",
          "**反驳**回应反方观点，说明为什么作者的论点仍然成立。它常以 *however, yet, still, even so* 开头，并给出理由或论据。认同反方观点或重复一般事实都不是反驳。",
        ),
        pick(
          ["Which sentence is the best rebuttal to the counterclaim?", "哪个句子是对这个反方观点最好的反驳？"],
          rebuttalBank,
          (right) => `*${right}* answers the counterclaim with a reason. The other sentences agree with it or only state a general fact.`,
          (right) => `*${right}* 用理由回应了反方观点。其他句子要么认同它，要么只陈述了一般事实。`,
          rebuttalNot,
        ),
      ),
    ],
  },
];
