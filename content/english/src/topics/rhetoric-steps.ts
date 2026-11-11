// Rhetoric and composition: the second step of seven topics for grades 9 to 12, from naming a choice to using it:
// adding an appeal, putting a device to work, repairing a fallacy, finding a source's weakness, reading a trait from a
// detail, choosing an allusion, and saying what a contradiction means.

import { t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import { bars, fields, kindedChoice, type Label, labelChoice, type Pair } from "./steps.ts";

/**
 * askEach turns lines of "shown|first|second|third", one sentence for each of three names, into three items each: one
 * asking for every name. It returns the items and the name each sentence was written for.
 */
const askEach = (
  lines: string,
  names: readonly [string, string, string],
  ask: (shown: string, name: string) => string,
): { bank: ChoiceItem[]; nameOf: Map<string, string> } => {
  const nameOf = new Map<string, string>();
  const bank = fields(lines).flatMap(([shown, ...sentences], i): ChoiceItem[] => {
    if (!shown || sentences.length !== 3) throw new Error(`a line needs a text and three sentences: ${shown}`);
    for (const [k, s] of sentences.entries()) nameOf.set(s, names[k] ?? "");
    // Rotate which name is asked first, so that neighboring seeds ask for different names.
    return [0, 1, 2].map((step): ChoiceItem => {
      const k = (i + step) % 3;
      return [ask(shown, names[k] ?? ""), sentences[k] ?? "", sentences.filter((_, j) => j !== k)];
    });
  });
  return { bank, nameOf };
};

const askedName = (shown: string) => shown.match(/\*\*([^*]+)\*\*\?$/u)?.[1] ?? "";

// Adding an appeal.

const appealLines = `
  Claim: Our town should open a public swimming pool.|As a lifeguard for twelve summers, I have taught hundreds of children to swim, and I know how few places they have to learn.|Picture a ten-year-old standing at the edge of the lake on a hot afternoon, wanting to jump in but never having learned how.|The nearest pool is forty minutes away by bus, and a town survey found that six in ten children here cannot swim a single length.
  Claim: Schools should replace paper textbooks with digital ones.|Our district's technology director, who has equipped forty schools with tablets, supports the change.|Imagine a twelve-year-old bent under a backpack heavier than a sack of cement, every single day.|One tablet costs less than the five textbooks it replaces, and it can be updated every year at no extra cost.
  Claim: The city should plant trees along every main street.|Every urban planner on the city's advisory board, with over a century of experience among them, has signed this proposal.|Think of an elderly man resting on a bench in July, with no shade to save him from the burning sun.|Streets lined with trees are measurably cooler in summer, and shaded pavement lasts years longer before it needs repair.
  Claim: Restaurants should donate unsold food to shelters.|I ran a restaurant for twenty years, and I watched good food go into the bin every single night.|A child at the shelter goes to bed hungry, while a block away, trays of fresh bread are thrown into the dumpster.|Restaurants in our city throw out an estimated two tons of edible food each night, enough for thousands of meals.
  Claim: Students should be taught basic first aid.|The head of emergency medicine at our hospital says first aid is the most valuable hour a school can teach.|Imagine watching your best friend choke at lunch and not knowing what to do while seconds tick by.|Most cardiac arrests happen outside hospitals, and the chance of survival roughly doubles when a bystander starts CPR at once.
  Claim: Our library should stay open on Sundays.|As the librarian who has served this town for fifteen years, I hear every week from families who need us on weekends.|Picture a teenager with no computer at home, sitting outside the locked library on Sunday, trying to finish her homework on a phone.|Weekend visits made up a third of all visits when the library was open on Sundays, and the cost is less than one percent of its budget.
  Claim: The highway speed limit near the school should be lowered.|The police chief, who has investigated every crash on that road for a decade, supports the lower limit.|A mother waits at the school gate, listening to trucks roar past, praying her son crosses safely.|A pedestrian hit at thirty miles per hour usually survives; at fifty, most do not.
  Claim: Teenagers should have a say in how youth center money is spent.|As a youth worker for eighteen years, I have seen that teenagers know better than anyone what they will actually use.|Think of a group of teenagers who had their ideas ignored, staring at a youth center they never wanted and never visit.|Centers that involve teenagers in planning report twice as many regular visitors as those that do not.
  Claim: Factories should pay for the pollution they release into the river.|Three leading water scientists from the state university have studied the river and support this rule.|Picture a family that has fished this river for generations, now afraid to let their children touch the water.|Cleaning the river costs the town millions each year, while the factories that pollute it pay nothing.
  Claim: Schools should offer free breakfast to every student.|Our school nurse, who sees hungry students every morning, has asked for this program for years.|Imagine trying to solve a math problem while your stomach aches because you have not eaten since lunch the day before.|Schools that serve breakfast to everyone report fewer visits to the nurse and better attendance, at a cost of about a dollar fifty per meal.
`;

const appeals = askEach(
  appealLines,
  ["ethos", "pathos", "logos"],
  (shown, name) => `${shown}\n\nWhich sentence supports it with **${name}**?`,
);

const appealUse: Readonly<Record<string, Pair>> = {
  ethos: ["it leans on the credibility of the speaker or of experts who agree", "它借助说话者或赞同者的可信度"],
  pathos: ["it asks the audience to feel, through a picture of someone affected", "它通过描绘受影响的人，唤起听众的情感"],
  logos: ["it reasons from facts, figures and causes", "它借助事实、数据和因果关系来推理"],
};

const appealZh: Readonly<Record<string, string>> = { ethos: "人格诉求", pathos: "情感诉求", logos: "理性诉求" };

/** appealStep asks for the sentence that supports a claim with a named appeal. */
export const appealStep = point(
  "choosing-an-appeal-to-add",
  t("Adding an Appeal", "加入一种诉求"),
  t(
    "A writer who knows the three appeals can choose one on purpose. To support the claim *Our town should open a pool*:\n\n- **Ethos** brings in credibility: *As a lifeguard for twelve summers, I have taught hundreds of children to swim.*\n- **Pathos** brings in feeling, usually through a picture of one person: *Picture a ten-year-old at the edge of the lake, never having learned to swim.*\n- **Logos** brings in reasoning: *The nearest pool is forty minutes away, and six in ten children here cannot swim.*\n\nWhich to add depends on what the argument lacks. Numbers without a face can feel cold, so add pathos; a moving story with no facts can seem manipulative, so add logos; an unknown writer needs ethos.",
    "了解三种诉求的作者可以有意识地加以选择。比如要支持 *Our town should open a pool* 这一主张：\n\n- **人格诉求**（ethos）引入可信度：*As a lifeguard for twelve summers, I have taught hundreds of children to swim.*\n- **情感诉求**（pathos）引入情感，通常借助对一个人的描绘：*Picture a ten-year-old at the edge of the lake, never having learned to swim.*\n- **理性诉求**（logos）引入推理：*The nearest pool is forty minutes away, and six in ten children here cannot swim.*\n\n加入哪一种，取决于论证缺什么。只有数字没有人物会显得冷漠，就加入情感诉求；只有动人的故事没有事实会显得在煽情，就加入理性诉求；不为人知的作者则需要人格诉求。",
  ),
  choiceGenerator(
    t("Which sentence supports the claim with the appeal named?", "哪个句子用所指定的诉求来支持这一主张？"),
    appeals.bank,
    (right, shown) => {
      const name = askedName(shown);
      const [en, zh] = appealUse[name] ?? ["", ""];
      return t(`**${right}** It uses ${name}: ${en}.`, `**${right}** 它运用了${appealZh[name] ?? name}：${zh}。`);
    },
    (wrong, _right, shown) => {
      const name = appeals.nameOf.get(wrong) ?? "";
      const [en, zh] = appealUse[name] ?? ["", ""];
      const asked = askedName(shown);
      return t(
        `This sentence uses ${name}, not ${asked}: ${en}.`,
        `这个句子运用的是${appealZh[name] ?? name}，而不是${appealZh[asked] ?? asked}：${zh}。`,
      );
    },
  ),
);

// Putting a device to work.

const deviceLines = `
  Point: we must keep going when the work gets hard.|We will work when we are tired, we will work when we are doubted, and we will work until the job is done.|Starting is easy; finishing is what takes courage.|If we stop now, who will finish what we began?
  Point: the library belongs to everyone in town.|This library is for the student, this library is for the stranger, this library is for every one of us.|A library asks nothing of its readers and gives everything to them.|Is there anyone in this town who has never needed a place to learn?
  Point: protecting the river is our duty.|We drink from this river, we fish in this river, and we will defend this river.|The river cannot speak for itself, but we can speak for the river.|What will we tell our children if the river dies on our watch?
  Point: kindness costs little and means a great deal.|Kindness opens doors, kindness heals wounds, kindness builds a town.|Cruelty is cheap and quickly forgotten; kindness is cheap and remembered for a lifetime.|When did a kind word ever make anyone's day worse?
  Point: the team succeeds only together.|Together we train, together we lose, and together we will win.|One player can score a goal, but only a team can win a season.|Has any player ever lifted a trophy alone?
  Point: our school must welcome new students.|Welcome them at the door, welcome them at lunch, welcome them in every class.|A school is not judged by how it treats its stars but by how it treats its strangers.|Which of us did not once walk into this building as a stranger?
  Point: voting matters even when the result seems certain.|Vote when it is easy, vote when it is inconvenient, vote when you think it will not matter.|A single vote seems small, but every election is made of nothing else.|If no one's vote mattered, why would anyone work so hard to stop people from voting?
  Point: honesty is worth its price.|Honesty may lose you a game, honesty may lose you a friend, but honesty will never lose you yourself.|A lie may win the moment; the truth wins the years that follow.|What is a victory worth if you cannot tell the truth about how you won it?
  Point: we should save the old theater.|In this theater our parents met, in this theater our children laughed, in this theater our town found its voice.|A parking lot will hold our cars, but only the theater can hold our memories.|Do we really want to tell our grandchildren that we traded our stage for parking spaces?
  Point: science needs patience.|Patience to ask the question, patience to test it, patience to be wrong a hundred times.|A careless scientist finds answers quickly; a patient one finds answers that are true.|How many discoveries would we have if every scientist gave up after the first failure?
`;

const devices = askEach(
  deviceLines,
  ["anaphora", "antithesis", "a rhetorical question"],
  (shown, name) => `${shown}\n\nWhich sentence makes this point with **${name}**?`,
);

const deviceUse: Readonly<Record<string, Pair>> = {
  anaphora: ["the same opening words repeat at the start of each part", "每个部分开头都重复同样的词"],
  antithesis: ["two opposite ideas are set against each other in balanced phrases", "两个相反的意思以平衡的短语互相对照"],
  "a rhetorical question": ["it asks a question whose answer is meant to be obvious", "它提出一个答案本应不言自明的问题"],
};

const deviceZh: Readonly<Record<string, string>> = { anaphora: "首语重复", antithesis: "对照", "a rhetorical question": "反问" };

/** deviceStep asks for the sentence that makes a point with a named device. */
export const deviceStep = point(
  "putting-a-device-to-work",
  t("Putting a Device to Work", "运用修辞手法"),
  t(
    "Each device does a different job, so choose the one that suits your point.\n\n- **Anaphora** builds momentum by repeating the opening words of each part: *We will work when we are tired, we will work when we are doubted...* It suits a call to action or a rising list.\n- **Antithesis** sharpens a contrast by setting opposites in balanced phrases: *Starting is easy; finishing is what takes courage.* It suits a point that one thing matters more than another.\n- A **rhetorical question** invites the listener to supply the obvious answer: *If we stop now, who will finish what we began?* It suits a moment when you want the audience to agree in their own words.\n\nTo check your choice, look for the pattern itself: repeated openings, paired opposites, or a question that needs no answer.",
    "每种修辞手法的作用不同，所以要选择适合你观点的那一种。\n\n- **首语重复**（anaphora）通过重复每部分开头的词来积聚气势：*We will work when we are tired, we will work when we are doubted...* 它适合号召行动或层层递进的列举。\n- **对照**（antithesis）把相反的意思放在平衡的短语里，使对比更鲜明：*Starting is easy; finishing is what takes courage.* 它适合表达某事比另一件事更重要。\n- **反问**（rhetorical question）让听众自己说出显而易见的答案：*If we stop now, who will finish what we began?* 它适合你希望听众用自己的话表示赞同的时候。\n\n检查你的选择时，就找这种模式本身：重复的开头、成对的相反意思，或者不需要回答的问题。",
  ),
  choiceGenerator(
    t("Which sentence makes the point with the device named?", "哪个句子用所指定的修辞手法表达了这个观点？"),
    devices.bank,
    (right, shown) => {
      const name = askedName(shown);
      const [en, zh] = deviceUse[name] ?? ["", ""];
      return t(`**${right}** It uses ${name}: ${en}.`, `**${right}** 它运用了${deviceZh[name] ?? name}：${zh}。`);
    },
    (wrong, _right, shown) => {
      const name = devices.nameOf.get(wrong) ?? "";
      const [en, zh] = deviceUse[name] ?? ["", ""];
      const asked = askedName(shown);
      return t(
        `This sentence uses ${name}, not ${asked}: ${en}.`,
        `这个句子运用的是${deviceZh[name] ?? name}，而不是${deviceZh[asked] ?? asked}：${zh}。`,
      );
    },
  ),
);

// Repairing a fallacy.

/** repairBank gives a flawed argument; its wrong options keep the same flaw in new words, then trade it for another flaw. */
const repairBank = bars(
  `
  We should not trust Dr. Ames's study on school lunches. She is famously rude to waiters.|We should look closely at how Dr. Ames gathered her lunch data, because her sample included only two schools.|We should not trust Dr. Ames's study at all. Nobody who has ever worked with her or met her actually likes her.|Everyone at my school thinks Dr. Ames's study is wrong, so it must be.
  Either we ban all phones from school, or students will never learn anything again.|Limiting phones during lessons could help students focus, while still letting them call home at lunch.|Either phones go, or our school becomes a place where no learning happens at all.|If we allow phones at lunch, soon students will use them in exams, and then cheating will be everywhere.
  My opponent wants a small tax on sugary drinks. Clearly she wants to control everything we eat.|My opponent wants a small tax on sugary drinks; we should ask whether it would really cut how many people drink them.|My opponent's little drink tax proves that she wants the government deciding every meal we eat and every glass we pour.|My opponent once failed a math class, so her tax plan cannot be trusted.
  If we let students pick one elective, they will soon demand to pick every class, and then the school will have no standards.|Letting students pick one elective is a limited change, and we can judge it by how the first year goes.|One elective today means students running the whole school tomorrow.|Either we keep every single class required, or the school will soon have no rules or standards left at all.
  I met two lazy teenagers at the mall, so teenagers today do not want to work.|Before judging how hard teenagers work, we should look at surveys of many teenagers, not two at a mall.|The two teenagers I saw at the mall last week were lazy, which shows exactly what the whole generation is like.|Everyone agrees teenagers are lazy, so it must be true.
  Millions of people use this diet app, so it must help people lose weight.|To know whether the app helps people lose weight, we should look at studies that compare users with non-users.|So many millions of people have downloaded the app that it would be very strange indeed if it did not work for them.|The app's critics are just jealous of its success, so we can ignore them.
  Senator Holt's plan for the bridge is wrong; he has never even worked a real job.|Senator Holt's bridge plan should be judged by its cost and its safety record, which we can check.|Senator Holt has lived a privileged life, so nothing he says about bridges counts.|If we build Senator Holt's bridge, soon every road will need rebuilding, and taxes will be endless.
  You either support every new construction project, or you are against our town's progress.|We can support projects that bring jobs while still opposing ones that would destroy the wetlands.|Anyone who questions a single building project is simply against progress.|Our mayor supports the project, and she is very popular, so it must be good.
  She says students need more sleep. So she thinks school should start at noon and homework should be banned.|She says students need more sleep; a later start of even thirty minutes is one way to test her claim.|She wants more sleep for students, which really means she wants them to grow up lazy, soft and unprepared for real life.|She is not a parent herself, so she has no right to talk about students' sleep.
  If the city raises the bus fare by ten cents, soon nobody will ride, the buses will shut down, and the city will collapse.|A ten-cent rise may cost some riders, so the city should study how fares affected ridership in the past.|Any fare increase will start a chain of disasters that ends with no buses at all.|Either the city keeps the fare exactly the same forever, or public transport in this town is finished for good, and soon.
  Three of my friends got sick after eating sushi, so sushi is dangerous.|To decide whether sushi is risky, we should look at health records from many restaurants, not three friends.|My friends' bad experience proves that raw fish is unsafe for anybody.|Every famous chef on television says that sushi is safe, so my three friends must simply have imagined being sick.
  Everyone in our class is going to the concert, so it must be the best way to spend Saturday.|Whether the concert is worth it depends on the ticket price, the music and what else we could do that day.|Since the whole class is going, staying home would obviously be a mistake.|If I miss this one concert, I will end up missing every event from now on and lose all my friends one by one.
  We should ignore the climate report. The scientist who wrote it drives a large car.|We should judge the climate report by its data and methods, whatever car its author drives.|The report's author is a hypocrite, so his science must be wrong.|Either we believe every word of the report, or we admit climate science is useless.
  If we let one student turn in homework late, every student will want extensions and deadlines will mean nothing.|We can allow late work for real emergencies and still keep firm deadlines for everyone else.|Once one student gets extra time, soon the whole class will ignore every deadline.|The student asking for more time is always disorganized and forgetful, so his request should simply be refused.
  Either you love this country without question, or you are its enemy.|People can love their country and still criticize decisions they think are wrong.|True patriots never question their leaders, and anyone who does is against the nation.|My opponent's grandfather was a criminal, so his views on patriotism do not count.
  My neighbor's electric car broke down twice, so electric cars are unreliable.|To judge electric cars, we should compare repair records across thousands of cars, not one neighbor's.|If my neighbor's new car failed after a month, every electric car on the road will soon fail in the very same way too.|Most of my friends drive gas cars, so gas cars must be better.
  This shampoo is the best-selling brand in the country, so it must be the best for your hair.|Whether this shampoo is best for your hair depends on tests of how it works on hair like yours.|So many people all over the country buy this shampoo every week that it simply has to be the right choice for anyone.|People who use other shampoos just do not care about their hair.
  The mayor wants to build a skate park. So he wants teenagers to take over every park in the city.|The mayor wants to build one skate park; we should ask where it would go and what it would cost.|The skate park proves that the mayor secretly wants teenagers to take control of all the public space in our town.|If we build a skate park, soon we will need skate lanes on every street.
  Why should we listen to that student's idea for the cafeteria? She got a low grade in science.|The student's idea for the cafeteria should be judged on whether it would shorten lines and cut waste.|Her low science grade shows that any idea she has is not worth hearing.|Everyone likes the current cafeteria, so changing it would be wrong.
  If we allow one food truck in the square, soon the square will be full of trucks, the shops will close and downtown will die.|One food truck is a small change; the city can set a limit and review it after a year.|Allowing even one food truck will set off a chain reaction that ends with every restaurant closed and an empty downtown.|Either we ban food trucks forever, or we let them take over every street.
  I read two bad reviews of the new museum, so it must be terrible.|Before deciding on the museum, I could read many reviews or visit and judge it myself.|Two bad reviews are enough to show that the museum is a failure.|My friends all say they will not go, so the museum must be bad.
  Everyone online is sharing this news story, so it must be true.|Before believing the story, we should check whether reliable news sources have confirmed it.|A story shared by that many people could not possibly be false.|The people who doubt the story are just trying to start arguments online, so we should ignore every one of them.
  The coach's new training plan cannot work. He was a terrible player himself.|The coach's training plan should be judged by whether players get faster and stronger over the season.|A coach who could not play well has nothing useful to teach.|Either we keep the old plan exactly, or the team will fall apart.
  You are either with our club's plan for the fundraiser, or you do not care about the club.|Members can care about the club and still suggest a better plan for the fundraiser.|Anyone who disagrees with the fundraiser plan obviously wants the club to fail and should not be a member any longer.|If we change one part of the plan, the whole fundraiser will fall apart.
  He says we should recycle more. So he thinks we should spend all day sorting garbage instead of working.|He says we should recycle more; a clearly marked bin in every classroom would be an easy first step.|He wants more recycling, which means he expects us to give up our lives for trash.|He drinks from plastic bottles himself, so his views on recycling mean nothing.
  If students can retake one test, they will stop studying for any test, and grades will mean nothing.|Allowing one retake might reduce stress, and we can check whether test scores change over the year.|One retake will lead to endless retakes and the end of serious studying.|The students who want retakes are just lazy, so the idea should be rejected.
  Two of the new employees made mistakes in their first week, so the new hiring process is a failure.|To judge the hiring process, we should look at how all new employees perform over several months.|Two mistakes are proof that every new hire will be a disaster.|Everyone in the office already says the process failed, so it must have.
  All the popular students wear this brand, so it is the brand everyone should buy.|Whether a brand is worth buying depends on its quality and price, not on who wears it.|If the popular students choose this brand, there is no reason to choose anything else.|Students who do not wear this brand just want attention.
  We cannot trust the journalist's report on the factory. He has been divorced twice.|We can judge the journalist's report by checking his sources and whether other reports agree.|A man with his private life cannot report honestly on anything.|Either we trust every journalist, or we trust none of them.
  Either we cancel the school play, or we will fail every exam this term.|The play's rehearsals could be scheduled so that they do not crowd out study time before exams.|If the play goes ahead, our exam results will collapse, no question.|The drama teacher has never cared about exams, so her play should be cancelled.
  `,
  2,
);

/** repairStep asks for the revision that fixes the flaw in an argument. */
export const repairStep = point(
  "repairing-the-argument",
  t("Repairing the Argument", "修补论证"),
  t(
    "Naming a fallacy is half the work; the other half is replacing it with sound reasoning. Each fallacy has a natural repair.\n\n- **Ad hominem**: judge the argument, not the person. Look at the evidence and the method.\n- **Straw man**: restate the other side's view accurately, then respond to that.\n- **False dilemma**: name the other options between the two extremes.\n- **Slippery slope**: treat the first step on its own, and show how its effects could be checked or limited.\n- **Hasty generalization**: ask for more cases, such as surveys or records, before drawing a broad conclusion.\n- **Bandwagon**: ask what actually makes the thing good, not how many people choose it.\n\nWatch for two false repairs: one keeps the same flaw in new words, and the other swaps it for a different flaw.",
    "说出谬误的名称只完成了一半，另一半是用合理的推理取代它。每种谬误都有相应的修补方法。\n\n- **人身攻击**：评判论点而不是人，去看证据和方法。\n- **稻草人**：准确地重述对方的观点，再对它作出回应。\n- **非此即彼**：说出两个极端之间的其他选择。\n- **滑坡**：单独看待第一步，并说明怎样检验或限制它的影响。\n- **以偏概全**：在得出宽泛的结论之前，要求更多的例子，比如调查或记录。\n- **从众**：问一问究竟是什么让这件事好，而不是有多少人选择它。\n\n要警惕两种假修补：一种换个说法保留了同样的谬误，另一种把它换成了另一种谬误。",
  ),
  kindedChoice(
    ["Which revision fixes the flaw in this argument?", "哪种修改纠正了这个论证中的缺陷？"],
    repairBank,
    (right) => [
      `*${right}* It drops the faulty move and turns to evidence or a fair statement of the question, which is what sound reasoning needs.`,
      `*${right}* 它去掉了错误的推理，转而依靠证据或对问题的公正陈述，这正是合理推理所需要的。`,
    ],
    [
      [
        "*{wrong}* keeps the same flaw in different words, so the argument is no sounder than before.",
        "*{wrong}* 换了个说法，却保留了同样的缺陷，所以论证并没有变得更合理。",
      ],
      [
        "*{wrong}* trades one fallacy for another: it attacks a person, follows the crowd, offers only two choices or predicts a chain of disasters.",
        "*{wrong}* 用一种谬误代替了另一种：它攻击人、随大流、只给出两个选择，或者预言一连串灾难。",
      ],
    ],
  ),
);

// The weakness of a source.

const unnamed = "no named author with expertise";
const gain = "its maker gains from the answer";
const dated = "it is out of date";
const unsupported = "it shows no evidence";

const sourceLabels: Readonly<Record<string, Label>> = {
  [unnamed]: {
    zh: "没有署名的专业作者",
    why: [
      "The source does not say who made it, or its maker has no training in the subject, so there is no reason to trust their judgment.",
      "这个来源没有说明是谁做的，或者作者在这一领域没有受过训练，所以没有理由信任他们的判断。",
    ],
    not: [
      "The maker is named and knows the subject. Look instead at what they gain, how old the source is, or whether it shows its evidence.",
      "作者署了名，也懂这一领域。应该去看他们能得到什么、来源有多旧，或者它是否展示了证据。",
    ],
  },
  [gain]: {
    zh: "作者能从答案中获利",
    why: [
      "The maker sells the product or pushes the cause the question is about, so the source has a reason to tilt its answer.",
      "作者在推销与问题相关的产品或推动相关的主张，所以这个来源有理由让答案偏向自己。",
    ],
    not: [
      "Nothing in the description shows that the maker sells anything or pushes a cause tied to the question.",
      "描述中没有任何内容表明作者在推销什么，或在推动与问题相关的主张。",
    ],
  },
  [dated]: {
    zh: "内容已过时",
    why: [
      "The question is about how things are now, and the source was made so long ago that the facts may well have changed.",
      "问题关心的是现在的情况，而这个来源年代久远，事实很可能已经变了。",
    ],
    not: [
      "The source is recent enough for this question, or the question is about the past, so its age is not the problem.",
      "对这个问题来说，来源足够新，或者问题本来就是关于过去的，所以年代不是问题所在。",
    ],
  },
  [unsupported]: {
    zh: "没有展示证据",
    why: [
      "The source makes claims but gives no data, records or references that a reader could check.",
      "这个来源提出了说法，却没有给出读者可以核查的数据、记录或参考资料。",
    ],
    not: [
      "The source does show where its facts come from, such as data, records or references, so evidence is not what it lacks.",
      "这个来源确实说明了事实的出处，比如数据、记录或参考资料，所以它缺的不是证据。",
    ],
  },
};

const sourceLines = `
  Question: does a new allergy medicine work? Source: a report by the company that makes the medicine, with charts from its own trials.|${gain}
  Question: how many people ride the city's buses today? Source: a city transit report, with ridership tables, published in 1998.|${dated}
  Question: is the lake safe for swimming? Source: a post on a neighborhood forum signed "Concerned Resident," saying the water looks dirty.|${unnamed}
  Question: do video games affect sleep? Source: an article by a sleep researcher stating that games ruin sleep, with no studies or data mentioned.|${unsupported}
  Question: is a new phone's battery long-lasting? Source: a review on the phone maker's own website.|${gain}
  Question: what is the current unemployment rate? Source: a government labor report from twelve years ago.|${dated}
  Question: is the old bridge safe? Source: a comment on a video by a user called "bridgefan77."|${unnamed}
  Question: does the school's reading program raise scores? Source: a speech by the program's founder praising it, with no test results.|${unsupported}
  Question: are electric scooters safe in the city? Source: a safety guide published by a scooter rental company.|${gain}
  Question: what jobs are growing fastest in the region? Source: a careers guide printed in 2003.|${dated}
  Question: is the new diet healthy? Source: a social media video by an actor who tried the diet for a week.|${unnamed}
  Question: did the factory pollute the river? Source: a letter from a professor of chemistry saying the factory is guilty, with no water tests cited.|${unsupported}
  Question: is the town's new stadium worth its cost? Source: a brochure printed by the construction firm that built it.|${gain}
  Question: how much does college tuition cost now? Source: a university's price list from twenty years ago.|${dated}
  Question: is the herbal tea good for colds? Source: an unsigned pamphlet found at a market stall.|${unnamed}
  Question: is the river cleaner than it was? Source: a TV interview in which an environmental officer says it is "much better," with no measurements given.|${unsupported}
  Question: should the town choose a new water filter? Source: a fact sheet from the company that sells the filter.|${gain}
  Question: what are the latest rules for the driving test? Source: a driving manual from 1995.|${dated}
  Question: did a famous scientist really say this quotation? Source: an image of the quotation shared online with no name or date.|${unnamed}
  Question: does homework help primary students? Source: a newspaper opinion piece by a retired principal, who gives no studies or numbers.|${unsupported}
  Question: is sugar harmful to teeth? Source: a research summary funded and published by a candy makers' association.|${gain}
  Question: which countries have the most internet users today? Source: an encyclopedia entry written in 2001.|${dated}
  Question: is the mushroom in the backyard poisonous? Source: a friend's cousin who says he "knows about these things."|${unnamed}
  Question: did crime rise in the city last year? Source: a mayoral candidate's speech claiming crime "exploded," with no figures.|${unsupported}
  Question: is the new hotel a good place to stay? Source: an article written by the hotel's own marketing team.|${gain}
  Question: what is the population of the fastest-growing city in the country? Source: an atlas published thirty years ago.|${dated}
  Question: is the school's new math method effective? Source: an anonymous blog post called "Why New Math Is Ruining Kids."|${unnamed}
  Question: are bike helmets effective? Source: a doctor's blog post saying helmets "obviously work," with no studies or crash data.|${unsupported}
  Question: is the new energy drink safe for teenagers? Source: a website run by the drink's maker, quoting its own scientists.|${gain}
  Question: what is the price of a home in the city today? Source: a housing report from the year your parents were born.|${dated}
`;

/** sourceWeaknessStep asks what weakens a source most for a question. */
export const sourceWeaknessStep = point(
  "the-weakness-of-a-source",
  t("The Weakness of a Source", "来源的弱点"),
  t(
    "Choosing the best source is easier once you can say what is wrong with the others. Ask the four questions again, and name the one a source fails.\n\n- **No named author with expertise**: an anonymous post, a username, or someone with no training in the subject.\n- **Its maker gains from the answer**: a company reviewing its own product, or a group funding research on its own cause.\n- **It is out of date**: a source too old for a question about how things are *now*. For a question about the past, an old source can be the best one.\n- **It shows no evidence**: even an expert's word is weak when it gives no data, records or references that a reader could check.\n\nA source can fail more than one test; choose the failure that matters most for the question asked.",
    "一旦你能说出其他来源的问题所在，选出最好的来源就更容易了。再问一遍那四个问题，说出某个来源没有通过的那一项。\n\n- **没有署名的专业作者**：匿名帖子、网名，或者在这一领域没有受过训练的人。\n- **作者能从答案中获利**：公司评价自己的产品，或者某个团体资助关于自身主张的研究。\n- **内容已过时**：对于关于*现在*情况的问题来说太旧的来源。如果问题是关于过去的，旧来源反而可能是最好的。\n- **没有展示证据**：即使是专家的话，如果没有给出读者可以核查的数据、记录或参考资料，也是薄弱的。\n\n一个来源可能有不止一项不合格；选出对所问问题最要紧的那一项。",
  ),
  labelChoice(["What weakens this source most for the question?", "对这个问题来说，这个来源最大的弱点是什么？"], sourceLines, sourceLabels),
);

// Reading a trait from a detail.

/** traitBank gives an indirect characterization; its wrong options are the opposite trait, then a trait the detail does not show. */
const traitBank = bars(
  `
  Without being asked, Mateo stayed after the party and washed every dish while the others went home.|helpful|lazy|musical
  When she lost the final, Ingrid shook the winner's hand, smiled, and asked her how she had trained.|gracious|bitter|forgetful
  Mr. Grant counted the tip three times, then took back one coin before leaving the table.|stingy|generous|athletic
  Even in the storm, the old fisherman untied his boat and rowed out to the stranded swimmers.|courageous|cowardly|wealthy
  Lisa checked the lock on the door twice, then went back to check the stove, then the lock again.|anxious|carefree|artistic
  When the new boy dropped his tray, Arash knelt down and helped him pick up every piece before anyone could laugh.|kind|cruel|ambitious
  Every evening, Ms. Vega stayed an hour after school to help any student who asked.|dedicated|careless|shy
  "I'll do it myself," Zoe said, pushing away her brother's hand and climbing the ladder alone.|independent|helpless|patient
  The duke never looked at the servants who opened doors for him, as if they were furniture.|arrogant|humble|curious
  Theo read the instruction manual cover to cover before he would even plug in the new printer.|careful|reckless|funny
  When her friend won the prize she wanted, Mara congratulated her loudly, then went home and tore up her own poem.|jealous|content|organized
  Abuela always set out an extra plate at dinner, in case a neighbor dropped by.|hospitable|unwelcoming|forgetful
  He told the teacher the dog ate his homework, the third time that month.|dishonest|truthful|hungry
  Nadia spent her savings on a train ticket to visit her grandmother, who had no one else.|devoted|selfish|adventurous
  Kenji asked so many questions on the museum tour that the guide finally gave him her own book.|curious|uninterested|rude
  The captain stayed on the sinking ship until every passenger was in a lifeboat.|responsible|careless|cheerful
  Rhea apologized to the waiter four times for asking for a glass of water.|timid|bold|greedy
  Before every game, Jamal ran extra laps alone in the dark while the others were still asleep.|determined|lazy|forgetful
  Despite the long line, the old man let a mother with a crying baby go ahead of him.|considerate|thoughtless|wealthy
  Ava rewrote the first sentence of her essay twenty times before she would show it to anyone.|perfectionist|careless|generous
  The mayor smiled for the cameras while he handed out food, then left the moment they stopped filming.|insincere|genuine|hardworking
  When the class was blamed for the broken window, Leo stood up and said he had thrown the ball.|honest|deceitful|athletic
  Ines kept every birthday card she had ever received, tied with ribbon in a box under her bed.|sentimental|indifferent|organized
  Pavel laughed at the waiter's accent and repeated it to his friends.|disrespectful|respectful|talkative
  Though she was exhausted, the nurse sat with the frightened boy until he fell asleep.|compassionate|cold|ambitious
  Sven spent the whole party in the kitchen, petting the dog and avoiding the crowd.|shy|outgoing|lazy
  The general refused to listen to any advice and marched the army into the swamp anyway.|stubborn|open-minded|brave
  Yuki shared her umbrella with a stranger at the bus stop and walked the last block in the rain.|selfless|selfish|careless
  Every coin Mr. Pike earned went into a jar labeled "Someday," and he never once opened it.|thrifty|wasteful|lonely
  After losing his job, Carlos woke at six every day and spent the morning sending applications.|resilient|defeated|wealthy
  `,
  2,
);

/** traitStep asks what trait an indirect characterization shows. */
export const traitStep = point(
  "reading-the-trait",
  t("Reading the Trait", "读出人物特点"),
  t(
    "Indirect characterization leaves the reader to name the trait. To do it, ask what kind of person would act, speak or think this way, and look for the trait that explains the detail **best**. A character who washes every dish without being asked is *helpful*; one who counts a tip three times and takes a coin back is *stingy*.\n\nTwo answers tempt readers. The **opposite** trait comes from misreading the detail, often by missing a small word or a tone: smiling for the cameras and leaving when they stop shows *insincerity*, not genuine care. A trait that is merely **possible**, such as *athletic* for a character who runs laps, is not wrong about the person but is not what the detail shows: it is determination that gets him up in the dark.",
    "间接塑造让读者自己说出人物的特点。要做到这一点，就问问什么样的人会这样行动、这样说话或这样想，并找出**最能**解释这个细节的特点。不用别人开口就把所有碗洗了的人物是 *helpful*（乐于助人）；把小费数三遍又拿回一枚硬币的人物是 *stingy*（吝啬）。\n\n有两种答案容易误导读者。**相反**的特点来自误读细节，往往是漏看了一个小词或某种语气：在镜头前微笑、镜头一停就离开，表现的是*虚伪*，而不是真心关怀。仅仅**可能**成立的特点，比如说跑圈的人物 *athletic*（擅长运动），对这个人来说不算错，却不是细节所表现的：让他在黑暗中起床的是决心。",
  ),
  kindedChoice(
    ["Which trait does this detail show best?", "这个细节最能体现人物的哪种特点？"],
    traitBank,
    (right) => [
      `The character is **${right}**: this is the trait that best explains why someone would act or speak this way.`,
      `这个人物是 **${right}**：这个特点最能解释一个人为什么会这样行动或说话。`,
    ],
    [
      [
        "*{wrong}* is the opposite of what the detail shows. Read it again, including any small word that sets its tone.",
        "*{wrong}* 与细节所表现的正好相反。再读一遍，包括决定语气的小词。",
      ],
      [
        "*{wrong}* may or may not be true of the character, but nothing in this detail shows it. Name the trait the detail explains.",
        "*{wrong}* 对这个人物来说也许成立，也许不成立，但这个细节并没有表现它。要说出细节所能解释的那个特点。",
      ],
    ],
  ),
);

// Choosing an allusion.

const allusionLabels: Readonly<Record<string, Label>> = {
  "a Herculean task": {
    zh: "赫拉克勒斯式的任务",
    why: [
      "Hercules, the Greek hero, had to complete twelve labors that seemed impossible, so the phrase names a job of enormous effort.",
      "希腊英雄赫拉克勒斯必须完成十二项看似不可能的苦差，所以这个说法指需要巨大努力的工作。",
    ],
    not: [
      "A Herculean task means a job of enormous effort, like the labors of Hercules. This situation is about something else.",
      "Herculean task 指像赫拉克勒斯的苦差那样需要巨大努力的工作。这个情境讲的是别的事。",
    ],
  },
  "an Achilles' heel": {
    zh: "阿喀琉斯之踵",
    why: [
      "Achilles could be wounded only in his heel, so the phrase names the one weak point of someone otherwise strong.",
      "阿喀琉斯全身只有脚踵会受伤，所以这个说法指一个本来很强的人唯一的弱点。",
    ],
    not: [
      "An Achilles' heel is a single weak point in someone otherwise strong. This situation is not about one hidden weakness.",
      "Achilles' heel 指一个本来很强的人唯一的弱点。这个情境讲的不是某个隐藏的弱点。",
    ],
  },
  "Pandora's box": {
    zh: "潘多拉的盒子",
    why: [
      "Pandora opened a box that released every trouble into the world, so the phrase names an action that sets loose many problems that cannot be undone.",
      "潘多拉打开了一个盒子，把所有灾祸放到了人间，所以这个说法指会引出许多无法挽回的麻烦的行为。",
    ],
    not: [
      "Opening Pandora's box means setting loose many troubles that cannot be put back. This situation is not about that.",
      "打开潘多拉的盒子指放出许多无法收回的麻烦。这个情境讲的不是这个。",
    ],
  },
  "a Trojan horse": {
    zh: "特洛伊木马",
    why: [
      "The Greeks hid soldiers inside a wooden horse that Troy took in as a gift, so the phrase names something harmless on the outside that hides a danger.",
      "希腊人把士兵藏在木马里，特洛伊人把它当作礼物收下，所以这个说法指外表无害、内藏危险的东西。",
    ],
    not: [
      "A Trojan horse is a gift or a harmless-looking thing that hides a danger inside. Nothing here is a disguised threat.",
      "特洛伊木马指看似无害、内藏危险的礼物或东西。这里没有伪装起来的威胁。",
    ],
  },
  "the Midas touch": {
    zh: "点金术",
    why: [
      "King Midas turned everything he touched to gold, so the phrase names someone whose every project makes money or succeeds.",
      "迈达斯国王碰到什么，什么就变成金子，所以这个说法指做什么都能赚钱或成功的人。",
    ],
    not: [
      "The Midas touch means that everything a person tries turns to success or money. This situation is not about that.",
      "Midas touch 指一个人做什么都能成功或赚钱。这个情境讲的不是这个。",
    ],
  },
  "a Pyrrhic victory": {
    zh: "皮洛士式的胜利",
    why: [
      "King Pyrrhus won battles against Rome but lost so many soldiers that the wins ruined him, so the phrase names a win that costs more than it gains.",
      "皮洛士国王打败了罗马，却损失了太多士兵，胜利反而毁了他，所以这个说法指代价大于收获的胜利。",
    ],
    not: [
      "A Pyrrhic victory is a win that costs so much it is almost a defeat. This situation has no such costly win.",
      "皮洛士式的胜利指代价大到几乎等于失败的胜利。这个情境中没有这样代价惨重的胜利。",
    ],
  },
  "a David and Goliath contest": {
    zh: "大卫与歌利亚之战",
    why: [
      "The young David defeated the giant Goliath with a sling, so the phrase names a contest between a small side and a much stronger one.",
      "少年大卫用投石器打败了巨人歌利亚，所以这个说法指弱小一方与强大得多的一方之间的较量。",
    ],
    not: [
      "A David and Goliath contest pits a small side against a giant. Here the two sides are not so unequal.",
      "大卫与歌利亚之战指弱小一方对抗巨人。这里双方并没有那么悬殊。",
    ],
  },
  "crossing the Rubicon": {
    zh: "渡过卢比孔河",
    why: [
      "Julius Caesar led his army across the Rubicon River, a step that made war certain, so the phrase names a choice that cannot be taken back.",
      "尤利乌斯·恺撒率军渡过卢比孔河，这一步使战争已成定局，所以这个说法指无法收回的抉择。",
    ],
    not: [
      "Crossing the Rubicon means making a choice that cannot be taken back. This situation is not about a point of no return.",
      "渡过卢比孔河指作出无法收回的抉择。这个情境讲的不是没有回头路的时刻。",
    ],
  },
  "an odyssey": {
    zh: "奥德赛式的旅程",
    why: [
      "Odysseus spent ten years wandering home from Troy through storms and monsters, so the phrase names a long journey full of trouble.",
      "奥德修斯从特洛伊回家的路上漂泊了十年，历经风暴和怪物，所以这个说法指漫长而充满艰险的旅程。",
    ],
    not: [
      "An odyssey is a long, eventful journey. Nothing in this situation is a long and troubled trip.",
      "奥德赛式的旅程指漫长而充满波折的旅程。这个情境中没有漫长而艰难的旅程。",
    ],
  },
  "a good Samaritan": {
    zh: "好撒玛利亚人",
    why: [
      "In the parable, a Samaritan stopped to help a wounded stranger whom others had passed by, so the phrase names someone who helps a stranger in need.",
      "在寓言中，一个撒玛利亚人停下来帮助了被别人置之不理的受伤陌生人，所以这个说法指帮助有需要的陌生人的人。",
    ],
    not: [
      "A good Samaritan is a person who helps a stranger in need. This situation is not about such help.",
      "好撒玛利亚人指帮助有需要的陌生人的人。这个情境讲的不是这种帮助。",
    ],
  },
};

const allusionLines = `
  The small family bakery is suing the largest food company in the country over its stolen recipe.|a David and Goliath contest|a Pyrrhic victory|the Midas touch
  The free app looked like a fun game, but it secretly collected everything on the user's phone.|a Trojan horse|Pandora's box|an Achilles' heel
  Cleaning up the beach after the oil spill will take thousands of volunteers working for years.|a Herculean task|an odyssey|crossing the Rubicon
  The champion swimmer is unbeatable in every race except the backstroke, where she always falls behind.|an Achilles' heel|a Herculean task|a Trojan horse
  Once the senator announced she was leaving her party, there was no going back.|crossing the Rubicon|a Pyrrhic victory|Pandora's box
  Every restaurant the young chef opens becomes a success within months.|the Midas touch|a good Samaritan|a David and Goliath contest
  The team won the championship, but three of its best players were injured for the next season.|a Pyrrhic victory|the Midas touch|crossing the Rubicon
  A driver stopped on the highway in the rain to change a flat tire for an elderly stranger.|a good Samaritan|a Trojan horse|an Achilles' heel
  Their trip home took four days, two cancelled flights, a missed train and a night in a bus station.|an odyssey|a Herculean task|a David and Goliath contest
  Once the class started arguing about who had cheated, rumors, accusations and old grudges came pouring out.|Pandora's box|a Trojan horse|an odyssey
  The town's tiny volunteer fire brigade took on the wildfire that the national service had given up on.|a David and Goliath contest|a Herculean task|a good Samaritan
  The "free gift" email contained a virus that spread through the office network.|a Trojan horse|the Midas touch|Pandora's box
  Rebuilding the city after the earthquake will take a generation of work.|a Herculean task|crossing the Rubicon|a Pyrrhic victory
  The brilliant lawyer wins every case except when she must speak in front of a crowd, which terrifies her.|an Achilles' heel|a David and Goliath contest|the Midas touch
  When he mailed his letter of resignation, he knew he could never ask for his job back.|crossing the Rubicon|an odyssey|a good Samaritan
  Everything the investor buys seems to double in value within a year.|the Midas touch|an Achilles' heel|a Herculean task
  The company beat its rival's price, but it lost so much money doing so that it had to close two factories.|a Pyrrhic victory|a David and Goliath contest|Pandora's box
  A passer-by jumped into the canal to save a dog that was drowning, then left before anyone could thank him.|a good Samaritan|crossing the Rubicon|the Midas touch
  The refugees' journey to safety crossed three countries, a desert and a stormy sea.|an odyssey|a Pyrrhic victory|a Trojan horse
  Asking the committee to review one rule led to a review of every rule, and months of bitter fights followed.|Pandora's box|an Achilles' heel|a good Samaritan
  A high school robotics team entered the same competition as the world's biggest tech firms.|a David and Goliath contest|a Trojan horse|an odyssey
  The new employee seemed friendly and eager, but she had been sent by a rival company to steal its plans.|a Trojan horse|a good Samaritan|a Herculean task
  Sorting the hundred years of records in the flooded archive will take the staff all year.|a Herculean task|the Midas touch|an Achilles' heel
  The fortress could withstand any attack except from the river side, where its wall was low.|an Achilles' heel|Pandora's box|crossing the Rubicon
  After she signed the contract to sell the family farm, there was no way to undo it.|crossing the Rubicon|a David and Goliath contest|a Trojan horse
  Every band the producer works with seems to have a hit record.|the Midas touch|an odyssey|a Pyrrhic victory
  The general captured the hill, but he lost half his army in the attack and could go no further.|a Pyrrhic victory|a Herculean task|a good Samaritan
  A stranger paid for the groceries of the young mother whose card had been declined.|a good Samaritan|Pandora's box|an Achilles' heel
  The explorer's voyage around the world lasted three years and survived shipwreck, illness and mutiny.|an odyssey|crossing the Rubicon|the Midas touch
  Once the scientists released the new insect to eat the pests, it began eating the crops too, and no one could stop it.|Pandora's box|a David and Goliath contest|a Pyrrhic victory
`;

/** allusionChoiceStep asks which allusion fits a situation. */
export const allusionChoiceStep = point(
  "choosing-an-allusion",
  t("Choosing an Allusion", "选用典故"),
  t(
    "To use an allusion yourself, match the situation to the story. Ask what the situation is really about, then recall which story carries that meaning.\n\n- A huge job: **a Herculean task**, from the twelve labors of Hercules.\n- One weak spot in someone strong: **an Achilles' heel**.\n- An act that releases trouble you cannot undo: **opening Pandora's box**.\n- A harmless-looking thing that hides a threat: **a Trojan horse**.\n- Success in everything: **the Midas touch**.\n- A win that costs too much: **a Pyrrhic victory**, from King Pyrrhus.\n- The small against the giant: **David and Goliath**.\n- A choice with no way back: **crossing the Rubicon**, from Julius Caesar.\n- A long, troubled journey: **an odyssey**, from Odysseus.\n- Help for a stranger: **a good Samaritan**, from the parable.\n\nA wrong allusion confuses rather than enriches: calling a costly win *the Midas touch* tells the reader the opposite of what you mean.",
    "要自己使用典故，就要让情境与故事相配。先问问这个情境实际上讲的是什么，再想想哪个故事带有这层意思。\n\n- 艰巨的工作：**a Herculean task**，出自赫拉克勒斯的十二项苦差。\n- 强者身上的唯一弱点：**an Achilles' heel**（阿喀琉斯之踵）。\n- 放出无法挽回的麻烦的行为：**opening Pandora's box**（打开潘多拉的盒子）。\n- 外表无害、内藏威胁的东西：**a Trojan horse**（特洛伊木马）。\n- 做什么都成功：**the Midas touch**（点金术）。\n- 代价过大的胜利：**a Pyrrhic victory**，出自皮洛士国王。\n- 弱小对抗巨人：**David and Goliath**（大卫与歌利亚）。\n- 没有回头路的抉择：**crossing the Rubicon**（渡过卢比孔河），出自尤利乌斯·恺撒。\n- 漫长而艰险的旅程：**an odyssey**，出自奥德修斯。\n- 帮助陌生人：**a good Samaritan**（好撒玛利亚人），出自寓言。\n\n用错的典故只会让人困惑而不能增色：把代价惨重的胜利称作 *the Midas touch*，告诉读者的恰恰与你的本意相反。",
  ),
  labelChoice(["Which allusion fits this situation best?", "哪个典故最适合这个情境？"], allusionLines, allusionLabels),
);

// What a contradiction means.

/** contradictionBank gives a paradox or an oxymoron; its wrong options take it as a plain error, then read a meaning it does not hold. */
const contradictionBank = bars(
  `
  After the funeral, the house was filled with a loud silence.|The absence of the person who died is so strong that the quiet feels overwhelming.|The house was noisy and quiet at the same moment, which is impossible.|The neighbors were playing loud music next door all through the evening, so no one in the house could rest.
  "I must go away from you to come closer to you," the son wrote to his father.|Leaving home may help the son grow into the person his father hoped he would be, which will bring them together.|The son is confused about directions and does not know where he is going.|The son wants to sell his apartment in the city and move to a house next door to his father's.
  The general called the battle a victorious defeat.|The army lost the battle but gained something more important, such as time or a lesson.|The general was so tired after the battle that he could not decide whether his army had won or lost it.|The army won easily and suffered no losses.
  "The more I give away, the richer I feel," said the old teacher.|Sharing what she has makes her life fuller in ways money cannot measure.|The teacher does not understand how money works.|The teacher becomes wealthy by selling her belongings.
  The prisoner said that he had never been so free as in his cell.|In prison he found an inner freedom, such as time to think or peace of mind, that he lacked outside.|The prisoner's cell had no lock on the door.|The prisoner is lying in his letters so that his family will worry less about how he is living in prison.
  The old couple shared a comfortable argument every morning over the newspaper.|Their disagreement is a familiar, affectionate habit rather than a real fight.|They both argued and agreed at the same moment, which makes no sense.|They argued so badly about the news that they stopped speaking to each other for the rest of the day.
  "To find yourself, you must first get lost," the travel writer advised.|Leaving familiar places and habits helps people discover who they really are.|The writer gives bad directions to travelers.|Travelers should always carry a good map and a phone so that they never lose their way in a strange place.
  The coach told the team that their weakness was their greatest strength.|The team's smallness or inexperience makes rivals underestimate them, which gives them an advantage.|The coach was nervous before the big game and mixed up the words strength and weakness by mistake in his speech.|The team has no weaknesses at all.
  Her wise foolishness got her through the years of war.|What looked foolish, such as hope or kindness, was in fact a deep kind of wisdom.|She was sometimes wise and sometimes foolish, depending on the day.|She survived the war only because she was lucky.
  The poet wrote that he was drowning in a desert of words.|He feels overwhelmed by many words that are all empty of meaning.|The poet does not know the difference between water and sand.|The poet was lost in a real desert while writing, with no water and nothing but sand on every side of him.
  "Sometimes you have to lose a battle to win the war," the president said.|Accepting a small defeat can lead to a larger success later.|The president does not know whether her side is winning.|The president has decided to give up on the war completely and bring every soldier home by the end of the year.
  The applause after her speech was a deafening hush, the whole hall too moved to clap.|The audience's silence said more than noise could, showing how deeply they were moved.|The hall was too loud for anyone to hear the speech.|The audience did not like the speech at all and refused to clap.
  The athlete said that slowing down was the fastest way to improve.|Taking time to rest and practice carefully leads to quicker progress than rushing.|The athlete is confused about what fast and slow mean.|The athlete wants to quit running.
  The city at night was a lonely crowd of lights.|Even surrounded by millions of people, each person in the city can feel alone.|The city had both many lights and no lights, which is impossible.|The city's power failed that night, and only a few lights from generators were still on in the tallest buildings.
  "I know that I know nothing," the philosopher said.|True wisdom begins with understanding how little one really knows.|The philosopher contradicts himself by mistake.|The philosopher never went to school, so he had to teach himself everything he knew from the books he found.
  The orphan described her adopted family as strangers who were her own.|People who began as strangers have become truly her family through love.|She cannot remember whether she knows these people.|She is still waiting in the children's home to meet her adopted family, who are coming to get her next month.
  The editor told the young writer, "Cut it, and it will grow."|Removing unnecessary words will make the story stronger and fuller.|The editor is talking about a plant, not a story.|The editor wants the young writer to make the story longer by adding more scenes, more characters and more words.
  The mountain village lived in a peaceful war with the winter.|The villagers struggle against the cold every year, but calmly, as a familiar part of life.|The village was at war with another village across the valley over who owned the fields between them.|The winter there is always mild.
  The soldier said the hardest part of coming home was learning how to be safe.|After years of danger, ordinary peace feels strange and difficult.|The soldier's house was more dangerous than the battlefield.|The soldier did not want to come home at all.
  "The best way to keep a secret is to tell everyone," the spy said with a smile.|When everyone hears many stories, the true one is lost among them.|The spy does not understand what a secret is.|The spy plans to tell no one anything.
  Grandfather called his tiny apartment a palace of small things.|The apartment is small but rich in the treasures and memories it holds.|The apartment is both huge and tiny, which cannot be true.|Grandfather lived in a real palace before he moved into the tiny apartment, back when he worked for a king.
  The doctor said that sometimes the kindest thing is to be cruel.|Telling a painful truth or giving a hard treatment can be the most caring choice.|The doctor enjoys hurting her patients.|The doctor never says anything unkind.
  The child's first day at school was a happy sadness for her mother.|The mother is glad to see her daughter grow up and sad to lose her little girl.|The mother cannot tell how she feels because she is tired.|The mother is relieved to have a quiet house again now that her daughter is at school all day long.
  "The less you say, the more they will listen," the old judge told the new lawyer.|Speaking only when it matters gives a speaker's words more weight.|The judge wants the lawyer to say nothing at the trial.|The judge cannot hear well anymore and wants everyone in her courtroom to speak loudly and clearly to her.
  The scientist's discovery raised more questions than it answered, which she called the best failure of her career.|Her experiment did not give the expected answer, but it opened valuable new paths of research.|She does not know whether her experiment worked.|Her experiment failed completely and taught her nothing, so she had to start the whole project over from the beginning.
  Living in the busy city taught him the value of being alone.|Constant crowds and noise made him appreciate quiet time with his own thoughts.|He never met anyone in the city.|He moved to the countryside to be with more people.
  The pianist practiced until her playing sounded effortless.|It takes great effort to make a performance look easy.|She stopped trying because playing piano is easy.|She played badly at the concert because she was tired from practicing all night long and had not slept.
  The refugee called the border a door that was also a wall.|The border offers a way to safety for some people and blocks the way for others.|The border was built with a door in the middle of a wall.|The refugee crossed the border without any trouble.
  The old woman said she had grown young again since her grandchildren arrived.|Being with her grandchildren has given her new energy and joy.|The old woman's age has actually decreased.|The old woman feels much older and more tired since her grandchildren arrived, because they are so loud.
  The champion said that every defeat had been a gift.|Each loss taught a lesson that later helped him win.|The champion received presents from his fans after each defeat, to cheer him up and help him forget it.|The champion has never lost a match.
  `,
  2,
);

/** contradictionStep asks what truth a paradox or an oxymoron points to. */
export const contradictionStep = point(
  "the-truth-in-the-contradiction",
  t("The Truth in the Contradiction", "矛盾中的道理"),
  t(
    "A paradox or an oxymoron is never a mistake. The writer joins ideas that clash so that the reader stops and looks for the sense that makes both true. To find it, take each half seriously and ask how it could be true **in a different way**: *The more I give away, the richer I feel* is true if *richer* means a fuller life rather than more money.\n\nTwo misreadings are common. One treats the contradiction as a plain error or as impossible, and so misses the point. The other invents a meaning unrelated to the two clashing ideas, such as reading *a loud silence* as noise from next door. The meaning must come from the clash itself.",
    "悖论或矛盾修饰从来不是错误。作者把互相冲突的意思放在一起，让读者停下来，寻找使两者都成立的那层意思。要找到它，就认真对待每一半，并问问它怎样能**以另一种方式**成立：*The more I give away, the richer I feel* 中，如果 *richer* 指生活更充实而不是钱更多，这句话就成立了。\n\n常见的误读有两种。一种把矛盾当作单纯的错误或不可能的事，因而抓不住要点。另一种编造出与这两个冲突的意思无关的含义，比如把 *a loud silence* 理解为隔壁传来的噪音。含义必须来自冲突本身。",
  ),
  kindedChoice(
    ["What truth does the contradiction in this sentence point to?", "这个句子中的矛盾指向什么道理？"],
    contradictionBank,
    (right) => [
      `*${right}* Read in this way, both clashing ideas are true at once, which is the point the writer wants the reader to find.`,
      `*${right}* 这样理解，两个冲突的意思就同时成立了，这正是作者希望读者发现的要点。`,
    ],
    [
      [
        "*{wrong}* treats the contradiction as a mistake or an impossibility. The clash is deliberate and points to a deeper sense.",
        "*{wrong}* 把矛盾当作错误或不可能的事。这种冲突是有意的，指向更深的含义。",
      ],
      [
        "*{wrong}* does not come from the clash between the two ideas; it reads a meaning into the sentence that its words do not hold.",
        "*{wrong}* 并非来自两个意思之间的冲突；它给句子加上了词句本身没有的含义。",
      ],
    ],
  ),
);
