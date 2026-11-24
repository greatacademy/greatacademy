// Argument: claims, evidence, reasoning and counterclaims, for grades 6 to 8.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import {
  claimMore,
  conclusionMore,
  counterclaimMore,
  preciseClaimMore,
  reasoningMore,
  rebuttalMore,
  relevantEvidenceMore,
  strongerEvidenceMore,
} from "./argument-more.ts";

const claimBank: readonly ChoiceItem[] = [
  [
    "",
    "Schools should start an hour later to let students sleep.",
    ["Most schools in our state start between seven and eight in the morning.", "Teenagers need eight to ten hours of sleep."],
  ],
  ["", "Our city must build more bike lanes.", ["The city has twelve miles of bike lanes.", "Many people ride bikes to work."]],
  [
    "",
    "Homework in elementary school does more harm than good.",
    ["Many students do homework after dinner.", "A survey last spring asked three hundred parents about homework."],
  ],
  [
    "",
    "Zoos do important work to protect endangered animals.",
    ["The city zoo has two hundred animals from more than forty countries.", "Some zoos breed rare animals."],
  ],
  [
    "",
    "Every student should learn a second language.",
    ["Spanish is taught at our school.", "Millions of people around the world speak two or more languages."],
  ],
  [
    "",
    "Plastic bags should be banned in grocery stores.",
    ["Plastic bags are made from oil and take hundreds of years to break down.", "Some stores charge for bags."],
  ],
  [
    "",
    "Video games can help young people learn problem solving.",
    ["Many teenagers play video games.", "The first video games appeared in the 1970s."],
  ],
  [
    "",
    "The school lunch period should be longer.",
    ["Lunch lasts twenty-five minutes.", "The cafeteria serves pizza on Fridays and tacos on Tuesdays."],
  ],
];

const relevantEvidenceBank: readonly ChoiceItem[] = [
  [
    "Claim: Schools should start later.",
    "A study found that students who started later had better grades and attendance.",
    [
      "Many students ride the yellow bus to school, and some of them live more than ten miles away.",
      "Some teachers prefer to arrive early.",
    ],
  ],
  [
    "Claim: Our town needs a public library branch on the east side.",
    "East-side families travel forty minutes to reach the nearest library.",
    ["The main library downtown was built in 1920 and has a famous stone staircase.", "Libraries lend books and movies."],
  ],
  [
    "Claim: Recess improves learning.",
    "Teachers report that students focus better in class after a break to play.",
    ["Recess usually happens outside.", "Students play tag, soccer and jump rope at recess on the field behind the school."],
  ],
  [
    "Claim: Planting trees cools city streets.",
    "Streets lined with trees are up to ten degrees cooler on summer afternoons.",
    ["Oak trees can live for centuries, and some in our state are more than five hundred years old.", "Leaves change color in the fall."],
  ],
  [
    "Claim: Learning music helps students in other subjects.",
    "Students in music programs scored higher on math tests in several studies.",
    ["The school band plays at every home football game and marches in the town parade.", "Pianos have eighty-eight keys."],
  ],
  [
    "Claim: Pets can make people healthier.",
    "Dog owners walk more each day than people without dogs, on average.",
    ["Dogs come in hundreds of breeds.", "Cats were kept as pets in ancient Egypt, where people painted them on the walls of tombs."],
  ],
  [
    "Claim: Cell phones should be put away during class.",
    "Students who kept their phones away remembered more of the lesson in a recent study.",
    ["Most phones have cameras.", "Phones were invented in the 1970s."],
  ],
  [
    "Claim: Students should help plan the school menu.",
    "When students chose some meals at one school, far less food was thrown away.",
    ["The cafeteria opens at eleven, and the first lunch group comes in at a quarter past.", "Lunch trays are washed every day."],
  ],
];

const strongerEvidenceBank: readonly ChoiceItem[] = [
  [
    "Claim: Our school should add a recycling program.",
    "Last month, the school threw away four hundred pounds of paper that could have been recycled.",
    [
      "My best friend thinks recycling is really cool and always tells me to put my cans in the blue bin.",
      "Everybody knows recycling is good.",
    ],
  ],
  [
    "Claim: The park needs more lights.",
    "Police reports show that most problems in the park happen after dark in its unlit areas.",
    [
      "I feel a little scared when I walk through the park at night, especially near the trees by the pond.",
      "Parks are nicer when they are bright.",
    ],
  ],
  [
    "Claim: The crosswalk near the school is dangerous.",
    "There were six accidents at that crosswalk last year, according to city records.",
    [
      "Some parents at the last school meeting said the crosswalk seems risky to them when they drop off their kids.",
      "Crosswalks can be dangerous anywhere.",
    ],
  ],
  [
    "Claim: Students need more time for lunch.",
    "In a survey of three hundred students, most said they could not finish eating in twenty minutes.",
    [
      "One student in my class said lunch feels short, because she is always the last in line for food.",
      "Lunch is the best part of the day.",
    ],
  ],
  [
    "Claim: Reading for fun improves vocabulary.",
    "Researchers found that students who read for fun learned thousands more words each year.",
    [
      "Reading is a fun way to spend time.",
      "My older sister reads a lot of books for fun, and she seems really smart and knows lots of big words.",
    ],
  ],
  [
    "Claim: The town pool should stay open later.",
    "Records show the pool is full every evening until it closes at six.",
    [
      "Swimming is great exercise.",
      "A few kids I know wish the pool stayed open later, because they cannot go until their parents get home.",
    ],
  ],
  [
    "Claim: Walking to school is good for students' health.",
    "Doctors recommend sixty minutes of activity a day, and a walk to school can supply a third of it.",
    [
      "Walking is something everyone can do.",
      "I like to walk to school with my friends, and I always feel better and more awake when I get there.",
    ],
  ],
  [
    "Claim: The library needs more computers.",
    "Each afternoon, students wait an average of thirty minutes to use one of the four computers.",
    [
      "Computers are important nowadays.",
      "Some students would like a computer, and I have heard them complain about it at lunch more than once.",
    ],
  ],
];

const reasoningBank: readonly ChoiceItem[] = [
  [
    "Claim: Schools should start later. Evidence: Teenagers' bodies fall asleep late at night.",
    "If students cannot fall asleep early, a later start lets them get the sleep they need.",
    [
      "Many schools start at eight.",
      "Teenagers like to stay up late on weekends, talking with friends or playing games until after midnight.",
    ],
  ],
  [
    "Claim: The town should plant more trees. Evidence: Tree-lined streets are much cooler in summer.",
    "Cooler streets would make summers safer and more comfortable for everyone in town.",
    [
      "Trees are beautiful in every season, from the bright flowers of spring to the bare branches of winter.",
      "Some streets already have trees.",
    ],
  ],
  [
    "Claim: Students should learn to cook. Evidence: Home-cooked meals tend to be healthier than fast food.",
    "Knowing how to cook lets students choose healthier meals for the rest of their lives.",
    [
      "Cooking classes are fun.",
      "Fast food is sold almost everywhere now, from highway rest stops to the food courts of big shopping malls.",
    ],
  ],
  [
    "Claim: The library should open on Sundays. Evidence: Most students do big projects on weekends.",
    "Opening on Sunday would give students resources at the time they need them most.",
    [
      "The library is closed on Sundays.",
      "Many families go out together on Sundays, to visit relatives, eat at restaurants or play in the park.",
    ],
  ],
  [
    "Claim: Bike lanes make streets safer. Evidence: Cities with bike lanes report fewer crashes with cyclists.",
    "Separating bikes from cars gives them less chance to collide.",
    ["Bikes are cheaper than cars.", "Cycling is popular in many cities."],
  ],
  [
    "Claim: Students should have a say in rules. Evidence: People follow rules more when they helped make them.",
    "If students help write the rules, they will feel they are fair and be more likely to follow them.",
    [
      "Rules are posted in every classroom.",
      "Some of the rules in our school handbook are very old and were written before any of us were born.",
    ],
  ],
  [
    "Claim: Families should eat dinner together. Evidence: Children who eat with family do better in school.",
    "Shared meals give children time to talk about their day and get support with their problems.",
    [
      "Dinner is usually eaten in the evening.",
      "Some families eat dinner in front of the TV, watching the news or a favorite show while they eat.",
    ],
  ],
  [
    "Claim: Our school needs a garden. Evidence: Students who grow vegetables are more willing to eat them.",
    "A garden would lead students to eat more vegetables and be healthier.",
    ["Vegetables grow best in the spring and early summer, when the days are long and the soil is warm.", "Our school has a large field."],
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
    [
      "Too much homework leaves no time for sleep.",
      "Students need time in the evenings for family, play and rest, not just more work at the kitchen table.",
    ],
  ],
  [
    "Claim: The town should build a skate park.",
    "Critics worry that a skate park will be noisy for the nearby houses.",
    ["Skaters now ride in parking lots, which is dangerous.", "A skate park gives teenagers a safe place to meet after school."],
  ],
  [
    "Claim: Students should be allowed to use phones at lunch.",
    "Some teachers believe phones keep students from talking to one another.",
    ["Phones let students check on family plans.", "Lunch is students' own free time."],
  ],
  [
    "Claim: Zoos should be closed.",
    "Supporters point out that zoos help save endangered species.",
    [
      "Large animals need more space than zoos give them.",
      "Animals in zoos often show signs of stress, such as pacing back and forth or pulling out their own fur.",
    ],
  ],
  [
    "Claim: School should run all year with shorter breaks.",
    "Many families say summer is their only time to travel together.",
    [
      "Students forget less over short breaks.",
      "Teachers spend less time on review at the start of each year, so classes can move on to new lessons sooner.",
    ],
  ],
  [
    "Claim: The city should ban cars from Main Street.",
    "Shop owners fear that without cars, fewer customers will come.",
    [
      "Walkers would make the street livelier.",
      "The air on Main Street would be cleaner and the street quieter, which would make it a nicer place to shop.",
    ],
  ],
  [
    "Claim: Students should choose their own reading books.",
    "Some teachers argue that assigned books expose students to important works they would not pick.",
    [
      "Choice makes students more eager to read.",
      "Students who read more read better, and they are more likely to read more when the books are ones they picked.",
    ],
  ],
];

const rebuttalBank: readonly ChoiceItem[] = [
  [
    "Counterclaim: Uniforms limit self-expression.",
    "However, students can still express themselves through their ideas, art and activities.",
    [
      "Uniforms do limit what students can wear.",
      "Uniforms come in many colors, and most schools choose the colors of their own sports teams.",
    ],
  ],
  [
    "Counterclaim: A skate park will be too noisy.",
    "However, the park could be built in the field by the highway, far from any homes.",
    ["Skateboards are very noisy.", "Many people dislike noise, especially late in the evening when they are trying to sleep."],
  ],
  [
    "Counterclaim: Without cars, shops on Main Street will lose customers.",
    "Yet towns that closed streets to cars found that shops gained customers from more people walking by.",
    [
      "Shops on Main Street do need customers, and several of them have struggled to stay open in recent years.",
      "Some people drive to every store, even ones that are only a few blocks away from their homes.",
    ],
  ],
  [
    "Counterclaim: More homework raises test scores.",
    "Still, research shows that beyond about an hour, extra homework adds little for young students.",
    [
      "Practice can help students learn, and some students do need extra practice at home to keep up.",
      "Test scores matter a great deal to schools, parents and the people who run the district.",
    ],
  ],
  [
    "Counterclaim: Phones keep students from talking at lunch.",
    "However, a simple rule of phones down for the first ten minutes could keep conversation going.",
    ["Phones can be distracting.", "Students like to talk with their friends at lunch about their classes, games and weekend plans."],
  ],
  [
    "Counterclaim: Zoos save endangered species.",
    "But most zoo animals are not endangered, and wildlife parks can protect rare species in their own habitats.",
    [
      "Some species, like the California condor, have been saved from dying out by zoos.",
      "Zoos are popular with families, and the city zoo had more than a million visitors last year alone, a record.",
    ],
  ],
  [
    "Counterclaim: Families need summer to travel.",
    "However, a year-round calendar includes several breaks of two or three weeks that families can use for trips.",
    ["Summer is a good time to travel.", "Travel can be expensive, especially in summer, when the prices of flights and hotels go up."],
  ],
  [
    "Counterclaim: Assigned books expose students to important works.",
    "Even so, teachers can offer a list of important books and let students choose from it.",
    ["Some classic books are important.", "Teachers know many good books, and most of them have read hundreds of novels over the years."],
  ],
];

const preciseClaimBank: readonly ChoiceItem[] = [
  [
    "",
    "Our school should replace soda machines with water fountains.",
    ["Drinks are important.", "Our school has two soda machines, one by the gym and one outside the cafeteria."],
  ],
  [
    "",
    "The town should keep the library open until nine on weeknights.",
    ["Libraries are good.", "The library closes at six on weeknights and at four on Saturdays and Sundays."],
  ],
  [
    "",
    "Middle schools should offer cooking as a required class.",
    ["Cooking is a thing people do.", "Some schools have kitchens with ovens and sinks that students are allowed to use."],
  ],
  [
    "",
    "Every classroom should have ten minutes of silent reading each day.",
    ["Reading matters a lot, and it is one of the most important things in everyone's life.", "Our class reads on Mondays."],
  ],
  [
    "",
    "The city should turn the empty lot on Oak Street into a community garden.",
    ["Gardens are nice.", "The lot on Oak Street is empty."],
  ],
  [
    "",
    "Students should be allowed to retake one test each term.",
    ["Tests are a big deal.", "Our school gives tests in every subject at the end of each month of the term."],
  ],
  [
    "",
    "Buses should stop at the new apartments on River Road.",
    ["Transportation is important.", "New apartments for three hundred families were built on River Road last year."],
  ],
  [
    "",
    "Our team should practice three times a week instead of two.",
    ["Sports are fun.", "The team practices on Tuesdays and Thursdays from four to six in the school gym."],
  ],
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
    ["Crosswalks like this one prevent all accidents, in every town and on every kind of road.", "No one will ever be hurt there again."],
  ],
  [
    "Evidence: Three of the five apple trees in the orchard had worms this year.",
    "Worms were a problem for many trees in the orchard this year.",
    [
      "Every apple tree in the country has worms.",
      "Apples from this orchard and every other orchard are no longer safe for anyone to eat.",
    ],
  ],
  [
    "Evidence: Sales of the school's healthy snacks doubled after prices were lowered.",
    "Lower prices led more students to buy the healthy snacks.",
    ["Students only care about prices.", "All students at the school now eat healthy food at every meal."],
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
    [
      "Sleeping more guarantees perfect grades.",
      "Students with low grades never get enough sleep, and that is the only reason their grades are low.",
    ],
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
    intro: t(
      "*Our town has three parks* is a fact nobody can debate; *Our town should turn the empty lot on Oak Street into a fourth park* is a **claim** you can argue for. Every strong argument starts with a debatable, precise claim.",
      "*Our town has three parks* 是无可争辩的事实；*Our town should turn the empty lot on Oak Street into a fourth park* 才是可以展开论证的**论点**。有力论证的第一步，是提出可争辩、够具体的论点。",
    ),
    prerequisites: ["fact-and-opinion"],
    encompasses: [{ topic: "fact-and-opinion", weight: 0.3 }],
    xp: 10,
    knowledgePoints: [
      point(
        "finding-the-claim",
        t("Finding the Claim", "找出论点"),
        t(
          "A **claim** is the debatable position an argument sets out to prove: *Schools should start an hour later*. By contrast, *Most schools start before eight* is a checkable fact—useful as evidence, but not a claim. Claims often signal a stance with words like *should*, *must*, or *does more harm than good*.\n\n> **Watch out.** Do not mistake an interesting statistic or survey fact for a claim—if you can settle it simply by looking it up, it is a fact, not a claim.",
          "**论点**是论证准备证明、别人可以合理反对的立场：*Schools should start an hour later*。相比之下，*Most schools start before eight* 是可核查的事实——可以当论据，但不是论点。论点常带 *should*、*must* 或 *does more harm than good* 等立场词。\n\n> **注意。** 别把有趣的统计数字或调查结果当成论点——只要查一下记录就能定对错的，就是事实而不是论点。",
        ),
        pick(
          ["Which sentence is a claim that an argument could prove?", "哪个句子是可以用论证来证明的论点？"],
          [...claimBank, ...claimMore],
          (right) =>
            `The claim is: **${right}** It stakes out a debatable position, whereas the other two sentences only report checkable facts.\n\n**Check.** Try putting *I disagree that…* in front of each option: only this sentence sparks a real debate rather than a quick lookup.`,
          (right) =>
            `论点是：**${right}** 它亮出了可争辩的立场，而另两句只是陈述可核查的事实。\n\n**检验。** 试着在每个选项前加上“我反对……”：只有这一句会引发真正辩论，而不是查一下资料就结束了。`,
          factNot,
        ),
      ),
      point(
        "precise-claims",
        t("Precise Claims", "明确的论点"),
        t(
          "A strong claim is **precise**: it names exactly who should act or what should change so readers know what the essay will prove. *Drinks are important* is too vague to debate, while *Our school should replace soda machines with water fountains* gives a concrete, arguable proposal.\n\n> **Watch out.** Eliminate both traps: a vague platitude (*Tests are a big deal*) and a plain fact (*The library closes at six*)—only a specific, debatable proposal counts.",
          "好的论点必须**明确**：说清该由谁来做、具体改变什么，让读者一眼看懂文章要证明什么。*Drinks are important* 过于空泛无法论证，而 *Our school should replace soda machines with water fountains* 提出了具体可辩的主张。\n\n> **注意。** 同时避开两个陷阱：空洞的套话（*Tests are a big deal*）和纯事实（*The library closes at six*）——只有具体且可争辩的主张才算明确论点。",
        ),
        pick(
          ["Which is the most precise claim?", "哪一项是最明确的论点？"],
          [...preciseClaimBank, ...preciseClaimMore],
          (right) =>
            `The most precise claim is: **${right}** It specifies a clear action or stance that can be argued with evidence.\n\n**Check.** Ask two questions: *Could someone reasonably disagree?* and *Does it name a specific change?* Only this option answers yes to both.`,
          (right) =>
            `最明确的论点是：**${right}** 它提出了清晰具体的行动或立场，可以用论据展开论证。\n\n**检验。** 问两个问题：*别人能否合理反对？**它是否说清了具体改什么？*只有这个选项两项都满足。`,
          preciseNot,
        ),
      ),
    ],
  },
  {
    id: "evidence",
    title: t("Evidence", "论据"),
    summary: t("Evidence that is relevant to a claim, and evidence that is strong.", "与论点相关的论据，以及有力的论据。"),
    intro: t(
      "Saying *Trees live for centuries* is true, yet it does nothing to prove *Trees cool city streets*—whereas measuring a ten-degree drop in the shade proves it directly. Effective **evidence** must be both **relevant** to the claim and **strong** enough to check.",
      "说 *Trees live for centuries* 固然没错，却证明不了 *Trees cool city streets*；而测出树荫下降温十度才能直接证明。好**论据**必须同时做到**切题相关**且**扎实可核查**。",
    ),
    prerequisites: ["claims"],
    encompasses: [{ topic: "claims", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "relevant-evidence",
        t("Relevant Evidence", "相关的论据"),
        t(
          "**Evidence** consists of facts, numbers, examples, and studies used to support a claim. Evidence is **relevant** only when it directly bears on the claim: for *Learning music helps students in other subjects*, *Music students scored higher on math tests* is relevant, while *Pianos have 88 keys* is off-point.\n\n> **Watch out.** Do not pick a fact just because it shares a keyword (*trees*, *phones*, *dogs*) with the claim—ask whether it actually gives a reason to accept the claim.",
          "**论据**是用来支持论点的事实、数字、例子和研究。只有直接关乎论点成立与否的论据才是**相关的**：对 *Learning music helps students in other subjects*，*Music students scored higher on math tests* 相关，而 *Pianos have 88 keys* 毫无关系。\n\n> **注意。** 别因为某个事实和论点带有相同关键词（*trees*、*phones*、*dogs*）就选它——问问它到底能不能帮你相信论点。",
        ),
        pick(
          ["Which evidence is relevant to the claim?", "哪项论据与论点相关？"],
          [...relevantEvidenceBank, ...relevantEvidenceMore],
          (right) =>
            `The relevant evidence is: **${right}** It directly backs up what the claim asserts.\n\n**Check.** Suppose this sentence is true—does it actually make the claim more believable? Yes, whereas the other two options are merely background trivia on the same topic.`,
          (right) =>
            `相关的论据是：**${right}** 它直接支撑了论点所主张的内容。\n\n**检验。** 假设这句话属实——它真的会让论点更可信吗？是的，而另两项只是同一题材的无关背景。`,
          unrelatedNot,
        ),
      ),
      point(
        "stronger-evidence",
        t("Stronger Evidence", "更有力的论据"),
        t(
          "Strong evidence is specific and verifiable: counts, city records, multi-student surveys, and published studies. Weak evidence leans on personal feelings (*I feel scared*), one friend's story, or empty claims (*everybody knows*). Compare *Police reports show six crashes at that crosswalk* (strong) against *Some parents say it seems risky* (weak).\n\n> **Watch out.** A longer anecdote about one friend or sibling still counts as weak evidence—look for measured data or records covering many cases.",
          "有力的论据具体且可核查：统计数字、官方记录、大样本调查和专业研究。薄弱论据只靠个人感受（*I feel scared*）、某个朋友的经历或空话（*everybody knows*）。对比 *Police reports show six crashes at that crosswalk*（有力）和 *Some parents say it seems risky*（薄弱）。\n\n> **注意。** 哪怕把一个朋友或亲戚的经历写得很长，它仍然只是个例——要找有测量数据、官方记录或多样本支撑的那一项。",
        ),
        pick(
          ["Which is the strongest evidence for the claim?", "哪项是支持论点最有力的论据？"],
          [...strongerEvidenceBank, ...strongerEvidenceMore],
          (right) =>
            `The strongest evidence is: **${right}** It offers checkable numbers, records, or research rather than feelings or hearsay.\n\n**Check.** Ask whether a skeptical reader could independently verify this evidence: yes—it cites concrete records, counts, or studies instead of one person's opinion.`,
          (right) =>
            `最有力的论据是：**${right}** 它拿出可核查的数字、记录或研究，而不是感受或传闻。\n\n**检验。** 问问持怀疑态度的读者能否独立核实这条证据：可以——它引用的都是具体记录、统计或研究，而非个人印象。`,
          weakNot,
        ),
      ),
    ],
  },
  {
    id: "reasoning",
    title: t("Reasoning", "推理"),
    summary: t("The explanation of how evidence supports a claim.", "说明论据如何支持论点的解释。"),
    intro: t(
      "Even solid evidence needs a bridge to the claim—and a conclusion must never outrun what the data actually proved. Sound **reasoning** connects evidence to claim and keeps every conclusion strictly within its proof.",
      "再扎实的论据也需要搭桥连向论点，而结论也绝不能跑出证据证明的范围。严密的**推理**既能讲清论据如何推出论点，也能把结论稳稳控制在证据边界之内。",
    ),
    prerequisites: ["evidence"],
    encompasses: [{ topic: "evidence", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "connecting-evidence-to-claim",
        t("Connecting Evidence to the Claim", "把论据和论点联系起来"),
        t(
          "**Reasoning** builds the logical bridge from evidence to claim: *if* the evidence is true, *then* the claim follows, *because…*. For *Claim: Bike lanes make streets safer / Evidence: Cities with bike lanes report fewer crashes*, the reasoning is *Separating bikes from cars gives them less chance to collide*.\n\n> **Watch out.** Do not pick a sentence that simply drops in another loose fact about bikes or streets—reasoning must explicitly link *both* the evidence and the claim.",
          "**推理**在论据和论点之间架起逻辑桥梁：*如果*论据属实，*那么*论点成立，*因为……*。对“论点：自行车道让街道更安全 / 论据：建了自行车道的城市碰撞事故更少”，推理是 *Separating bikes from cars gives them less chance to collide*。\n\n> **注意。** 别选仅仅补充另一条零散事实的句子——推理必须同时扣住*论据*和*论点*两头。",
        ),
        pick(
          ["Which sentence best explains how the evidence supports the claim?", "哪个句子最好地解释了论据如何支持论点？"],
          [...reasoningBank, ...reasoningMore],
          (right) =>
            `The reasoning bridge is: **${right}** It explains *why* the evidence makes the claim follow.\n\n**Check.** Verify that this sentence connects both halves—taking what the evidence shows and explaining how it achieves what the claim calls for.`,
          (right) =>
            `起到逻辑桥梁作用的推理是：**${right}** 它解释了*为什么*这条论据能推出论点。\n\n**检验。** 核对这句话是否接住了两端——顺着论据呈现的事实，说明它如何促成论点所主张的结果。`,
          reasoningNot,
        ),
      ),
      point(
        "conclusions-that-fit",
        t("Conclusions That Fit the Evidence", "与论据相符的结论"),
        t(
          "Sound reasoning never claims more than the evidence actually measured. If 20 of 25 students in one class like science, you may conclude *Most students in our class like science*—not *All students everywhere love science*. Extreme words like *all*, *every*, *never*, *always*, and *only* are red flags for overreach.\n\n> **Watch out.** Match the **scope** of the evidence (one class, one orchard, two students, one crosswalk) to the scope of the conclusion—reject any option that stretches a small sample into *everyone* or *everywhere*.",
          "合理的推理从不超出证据实际测量的范围。如果一个班 25 人里有 20 人喜欢科学，可以得出 *Most students in our class like science*，而不能说 *All students everywhere love science*。*all*、*every*、*never*、*always*、*only* 这类绝对词往往是过度推论的信号。\n\n> **注意。** 把证据的**范围**（一个班、一片果园、两名学生、一条斑马线）和结论的范围一一对齐——凡是把局部样本夸大成*所有人*或*所有地方*的选项一律排除。",
        ),
        pick(
          ["Which conclusion does the evidence support?", "论据支持哪个结论？"],
          [...conclusionBank, ...conclusionMore],
          (right) =>
            `The supported conclusion is: **${right}** It stays faithfully inside the group and scope that the evidence actually measured.\n\n**Check.** Compare the quantifiers (*most*, *many*, *may*, *seems*) against the extreme words (*all*, *every*, *never*, *only*) in the other options: only this conclusion avoids claiming more than the data prove.`,
          (right) =>
            `证据支持的结论是：**${right}** 它忠实留在证据实际测量的对象和范围内。\n\n**检验。** 对比这一句里的克制措辞（*most*、*many*、*may*、*seems*）和另两项里的绝对词（*all*、*every*、*never*、*only*）：只有这个结论没有超出数据范围。`,
          conclusionNot,
        ),
      ),
    ],
  },
  {
    id: "counterclaims-and-rebuttals",
    title: t("Counterclaims and Rebuttals", "反方观点与反驳"),
    summary: t("An opposing view an argument takes up, and the answer to it.", "论证中提到的反对意见，以及对它的回应。"),
    intro: t(
      "Ignoring the other side makes an argument look fragile. Naming a fair **counterclaim** (*Shop owners fear losing car traffic*) and answering it with a **rebuttal** (*Towns that closed streets saw foot traffic rise*) makes your case far stronger.",
      "对反对声音视而不见，反而会让论证显得站不住脚。先公正摆出**反方观点**（*店主担心禁车后客流减少*），再用**反驳**回应（*禁车城镇步行客流反而增加*），论证才会更有说服力。",
    ),
    prerequisites: ["reasoning"],
    encompasses: [{ topic: "reasoning", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "finding-the-counterclaim",
        t("Finding the Counterclaim", "找出反方观点"),
        t(
          "A **counterclaim** states a reasonable objection from the *opposing* side, often introduced by *Some say*, *Critics worry*, or *Others argue*. For *Claim: Schools should require uniforms*, *Some say uniforms limit students' self-expression* is a counterclaim, whereas *Uniforms save families money* supports the claim.\n\n> **Watch out.** Check which side of the debate each sentence pushes toward—two of the options will *support* the claim, and only one pushes *against* it.",
          "**反方观点**从*对立面*提出合理的反对意见，常用 *Some say*、*Critics worry* 或 *Others argue* 引出。对“论点：学校应要求穿校服”，*Some say uniforms limit students' self-expression* 是反方观点，而 *Uniforms save families money* 是在支持原论点。\n\n> **注意。** 核对每个选项站在辩论的哪一边——其中两项都在*支持*原论点，只有一项是*反对*它的。",
        ),
        pick(
          ["Which sentence states a counterclaim to this claim?", "哪个句子陈述了这个论点的反方观点？"],
          [...counterclaimBank, ...counterclaimMore],
          (right) =>
            `The counterclaim is: **${right}** It voices a genuine objection from the opposite side of the issue.\n\n**Check.** Ask *Would someone who disagrees with the claim say this?* Yes—whereas the other two sentences are arguments in favor of the claim.`,
          (right) =>
            `反方观点是：**${right}** 它提出了对立一方的真实顾虑。\n\n**检验。** 问一句*反对原论点的人会说出这句话吗？*会的——而另外两句都是在帮原论点说话。`,
          sideNot,
        ),
      ),
      point(
        "choosing-a-rebuttal",
        t("Choosing a Rebuttal", "选择反驳"),
        t(
          "A **rebuttal** turns back against a counterclaim—often with *However*, *Yet*, *Still*, or *Even so*—and offers a reason, solution, or evidence showing why the main claim still stands. Simply agreeing with the objection (*Skateboards are very noisy*) or stating a neutral fact is not a rebuttal.\n\n> **Watch out.** A rebuttal must *answer* the specific worry raised in the counterclaim, not just mention the same topic.",
          "**反驳**常用 *However*、*Yet*、*Still* 或 *Even so* 转折，针对反方观点给出理由、解决方案或证据，说明己方论点依然成立。单纯赞同对方（*Skateboards are very noisy*）或说一句无关痛痒的常识都不是反驳。\n\n> **注意。** 反驳必须直接*回应*反方提出的那个具体顾虑，而不能只是顺着同一个话题泛泛而谈。",
        ),
        pick(
          ["Which sentence is the best rebuttal to the counterclaim?", "哪个句子是对这个反方观点最好的反驳？"],
          [...rebuttalBank, ...rebuttalMore],
          (right) =>
            `The strongest rebuttal is: **${right}** It directly addresses the opposing worry and explains why the main claim still holds.\n\n**Check.** Look for the pivot (*However*, *Yet*, *Still*, *But*, *Even so*) followed by a concrete answer to the counterclaim—rather than agreeing with it or drifting to a generic fact.`,
          (right) =>
            `最有力的反驳是：**${right}** 它正面回应了反方顾虑，并说明己方论点为何依然站得住脚。\n\n**检验。** 找到转折词（*However*、*Yet*、*Still*、*But*、*Even so*）以及紧随其后的具体应对理由——它既没有附和反方，也没有跑去说空泛常识。`,
          rebuttalNot,
        ),
      ),
    ],
  },
];
