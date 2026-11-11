// Grade 5: the reading skills of the last four units: news articles, mysteries, suspense, genres, characters,
// chapters, diaries and letters, and the speakers of poems.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, type Label, label, rows, topic } from "./kit.ts";

// Reading a news article: lead|who|what|when|where|why
const leads = rows(`
  On Saturday morning, volunteers from Oak Street School planted 200 trees along the Mill River to stop its banks from washing away.|volunteers from Oak Street School|planted 200 trees|On Saturday morning|along the Mill River|to stop its banks from washing away
  Firefighters rescued a family of four from a flooded farmhouse near Clayton on Tuesday night after heavy rain cut off the only road.|Firefighters|rescued a family of four|on Tuesday night|from a flooded farmhouse near Clayton|after heavy rain cut off the only road
  The city library opened a new reading room for teenagers in its Main Street building on Monday because the old room had grown too crowded.|The city library|opened a new reading room for teenagers|on Monday|in its Main Street building|because the old room had grown too crowded
  On Friday, engineers in Port Ellis tested the new harbor bridge with forty loaded trucks to make sure it could carry heavy traffic.|engineers|tested the new harbor bridge with forty loaded trucks|On Friday|in Port Ellis|to make sure it could carry heavy traffic
  Last week, fifth graders raised 3,000 dollars at a bake sale in the Lakeview School gym to buy water filters for a village in Kenya.|fifth graders|raised 3,000 dollars at a bake sale|Last week|in the Lakeview School gym|to buy water filters for a village in Kenya
  Park rangers closed the trails of Pine Lake Park on Sunday to protect a rare snowy owl that had flown far south of its home.|Park rangers|closed the trails|on Sunday|of Pine Lake Park|to protect a rare snowy owl
  Workers in Riverton finished a new skate park on Thursday after children wrote 500 letters asking the town for a safe place to skate.|Workers|finished a new skate park|on Thursday|in Riverton|after children wrote 500 letters asking the town for a safe place to skate
  Doctors from the city hospital gave free eye tests at Hill Street Market on Saturday because many families cannot afford an eye doctor.|Doctors from the city hospital|gave free eye tests|on Saturday|at Hill Street Market|because many families cannot afford an eye doctor
`);
const ws = ["Who is the news about?", "What happened?", "When did it happen?", "Where did it happen?", "Why did it happen?"];
const wItems: ChoiceItem[] = leads.flatMap((r) =>
  [0, 1, 2, 3, 4].map(
    (k): ChoiceItem => [`${field(r, 0)}\n\n${ws[k]}`, field(r, 1 + k), [field(r, 1 + ((k + 1) % 5)), field(r, 1 + ((k + 2) % 5))]],
  ),
);
const placeLabels: Record<string, Label> = {
  "first, as the most important news": {
    zh: "放在开头，作为最重要的新闻",
    why: [
      "It tells who did what, when, where and why: the facts a reader most needs.",
      "它讲出谁在何时何地做了什么、为什么：这是读者最需要的事实。",
    ],
    not: ["The lead gives the main news itself; this sentence only adds to it.", "导语给出新闻本身；这个句子只是补充。"],
  },
  "in the middle, as a detail or a quotation": {
    zh: "放在中间，作为细节或引语",
    why: [
      "It adds a detail or the words of someone involved, which back up the news of the lead.",
      "它补充细节或当事人的话，支持导语中的新闻。",
    ],
    not: ["Details and quotations add to the lead; this sentence is not one of them.", "细节和引语是对导语的补充；这个句子不属于这一类。"],
  },
  "at the end, as background a reader can skip": {
    zh: "放在结尾，作为读者可以略过的背景",
    why: [
      "It tells older or less important background, so readers who stop early lose little.",
      "它讲的是较早或不太重要的背景，所以提前停止阅读的读者损失不大。",
    ],
    not: [
      "Background goes last because it matters least; this sentence matters more than that.",
      "背景放在最后，因为它最不重要；这个句子比背景重要。",
    ],
  },
};
const placeLines = `
  ${leads.map((r) => `${field(r, 0)}|first, as the most important news`).join("\n")}
  "Our roots will hold the soil now," said Ana Ruiz, a fifth grader who planted six trees.|in the middle, as a detail or a quotation
  Each tree was donated by the Green Valley garden center.|in the middle, as a detail or a quotation
  The Mill River last flooded its banks in 1998.|at the end, as background a reader can skip
  "The water was up to the windows," said Captain Ray Moss, who led the rescue.|in the middle, as a detail or a quotation
  The family was taken to the school gym, where they spent the night.|in the middle, as a detail or a quotation
  Clayton has had three floods in the past fifty years.|at the end, as background a reader can skip
  "Now we finally have somewhere to study together," said Leo Park, 14.|in the middle, as a detail or a quotation
  The room has forty seats and twelve new computers.|in the middle, as a detail or a quotation
  The library was first built in 1912 with money raised by the town.|at the end, as background a reader can skip
  "It did not move more than a finger's width," said engineer Rosa Diaz.|in the middle, as a detail or a quotation
  The bridge will open to cars on the first of next month.|in the middle, as a detail or a quotation
  The old ferry that crossed the harbor will stop running in the spring.|at the end, as background a reader can skip
  "Every cupcake means cleaner water for someone," said Mia Chen, who baked 80 muffins.|in the middle, as a detail or a quotation
  The filters will be sent with a charity that works in the village.|in the middle, as a detail or a quotation
  The school has held a bake sale every spring since 2010.|at the end, as background a reader can skip
  "We want the owl to rest before its long trip north," said ranger Tom Hale.|in the middle, as a detail or a quotation
  The trails will reopen when the owl leaves.|in the middle, as a detail or a quotation
  Snowy owls were last seen in the park more than twenty years ago.|at the end, as background a reader can skip
  "We used to skate in the parking lot," said Sam Odu, 11.|in the middle, as a detail or a quotation
  The park cost the town 90,000 dollars and has ramps for beginners.|in the middle, as a detail or a quotation
  Riverton's first playground was built in 1965.|at the end, as background a reader can skip
  "One in five children we saw needed glasses," said Dr. Nia Grant.|in the middle, as a detail or a quotation
  Children who need glasses will get them free next week.|in the middle, as a detail or a quotation
  The market has been open every Saturday since 1980.|at the end, as background a reader can skip
`;

const readingNews = topic("reading", {
  id: "reading-a-news-article",
  title: ["Reading a News Article", "阅读新闻报道"],
  summary: [
    "A news article answers who, what, when, where and why, with the most important facts first and quotations from people involved.",
    "新闻报道回答谁、什么、何时、何地、为什么，把最重要的事实放在前面，并引用当事人的话。",
  ],
  after: ["main-idea", "text-features"],
  points: [
    choose(
      "the-five-ws-in-a-lead",
      ["The Five Ws in a Lead", "导语中的五个 W"],
      [
        "The first sentence of a news article is its **lead**. A good lead answers five questions at once: **who** the news is about, **what** happened, **when**, **where** and **why**. Look for the words that answer each one: a time such as *on Monday* tells when, a place such as *in Riverton* tells where, and words such as *because* or *to* often begin why.",
        "新闻报道的第一句话叫**导语**。好的导语一下子回答五个问题：新闻关于**谁**、发生了**什么**、**何时**、**何地**以及**为什么**。找出回答每个问题的词语：*on Monday* 这样的时间说明何时，*in Riverton* 这样的地点说明何地，而 *because* 或 *to* 等词常常引出为什么。",
      ],
      ["Which words of the lead answer the question?", "导语中的哪些词语回答了这个问题？"],
      wItems,
      (right, shown) => [
        `${shown.split("\n\n").at(-1) ?? ""} The lead answers it with **${right}**.`,
        `导语用 **${right}** 回答了这个问题。`,
      ],
      [
        ["*{wrong}* answers a different one of the five Ws.", "*{wrong}* 回答的是五个 W 中的另一个。"],
        ["*{wrong}* is part of the lead, but it answers another question.", "*{wrong}* 是导语的一部分，但回答的是另一个问题。"],
      ],
    ),
    label(
      "why-the-facts-come-in-that-order",
      ["Why the Facts Come in That Order", "事实为什么按这个顺序排列"],
      [
        "A news article puts its facts in order of **importance**. The most important news comes **first**, in the lead, so a reader who reads one sentence still learns what happened. **Details** and **quotations** from people involved come in the middle. **Background**, such as what happened years ago, comes last, where a busy reader can skip it.",
        "新闻报道按**重要性**排列事实。最重要的新闻放在**最前面**的导语里，这样只读一句话的读者也能知道发生了什么。**细节**和当事人的**引语**放在中间。**背景**，例如多年前发生的事，放在最后，忙碌的读者可以略过。",
      ],
      ["Where in a news article does this sentence belong?", "这个句子应该放在新闻报道的什么位置？"],
      placeLines,
      placeLabels,
    ),
  ],
});

// Clues and red herrings: setup|culprit|clue|clue|clue|herring|why it misleads|herring|why it misleads
const cases = rows(`
  Someone ate the pie cooling on Mrs. Ortiz's windowsill.|Biscuit the dog|Crumbs led across the porch to the dog bed.|Purple paw prints marked the kitchen floor.|Biscuit would not touch his dinner that night.|Mr. Lee next door had said he loved cherry pie.|It makes Mr. Lee look guilty, but liking pie does not mean he took this one.|The back gate was found standing open.|It suggests a stranger came in, but the gate was often left open anyway.
  The class hamster vanished from its cage overnight.|the hamster itself|One bar of the cage was bent outward.|Seeds were missing from the bag on the low shelf.|Scratching sounds came from inside the bookcase.|Jamal had begged to take the hamster home.|It makes Jamal seem to want the hamster, but wanting it is not taking it.|The window by the cage was open a crack.|It suggests someone climbed in, but the crack was far too narrow for that.
  The prize ribbon disappeared from the science fair table.|the wind|The ribbon was found caught in the hedge outside.|The fan by the open door had been switched on high.|Paper cups from the table were scattered on the lawn.|Rosa had lost to the winner and looked upset.|It gives Rosa a reason, but feeling upset does not prove she took anything.|A boy was seen running from the hall at noon.|It looks suspicious, but he was only late for the bus.
  Grandpa's watch was missing from the dresser.|Grandpa himself, who had worn it to the garden|A muddy thumbprint was on the watch box.|Grandpa had been planting beans all morning.|The garden gloves lay on the dresser beside the box.|The plumber had worked in the house that day.|It points to a stranger in the house, but he never went near the bedroom.|The dresser drawer was open.|It suggests a search, but Grandpa always left the drawer open.
  Every cookie in the jar was gone by morning.|Max, the little brother|A step stool stood under the high shelf.|Chocolate smudges were found on Max's pillow.|Max said he was not hungry at breakfast.|The kitchen window was unlocked.|It suggests a thief from outside, but nothing else in the kitchen was touched.|The dog was sleeping by the jar.|It makes the dog look guilty, but the jar's lid was still screwed on.
  The library's rare map book was not on its shelf.|Ms. Fay, the librarian, who was repairing it|The glue pot on her desk was still warm.|Her desk lamp was on late into the evening.|A torn page lay in her repair tray.|A visitor had asked about the book's value.|It makes the visitor seem greedy, but asking a question is not stealing.|The back door alarm had beeped at six.|It suggests a break-in, but the cleaner always set it off.
  The tomatoes in the garden were being eaten each night.|a raccoon|Small hand-shaped prints crossed the soft soil.|The lid of the trash can had been pried off.|Bits of tomato skin lay beside the fence post.|The neighbor's boy had picked tomatoes before.|It points to the boy, but he had picked them only when he was invited to.|A ladder leaned against the shed.|It suggests a climber, but the ladder had been there all summer.
  The school's soccer balls were missing from the shed.|the coach, who had taken them to be pumped|The pump was gone from its hook too.|The coach's car was parked at the gas station.|A note on the board said "Balls, Tuesday."|The shed lock was broken.|It suggests a thief, but the lock had been broken for a month.|Older students had played with the balls at lunch.|It makes them look guilty, but they returned the balls before class.
  The bird feeder was empty again by noon.|the squirrels|Seed shells were scattered on the ground under the feeder.|Tiny claw marks scratched the pole.|A squirrel sat in the oak tree with puffed-out cheeks.|A flock of crows landed in the yard each morning.|It points to the crows, but they were eating worms, not seed.|The feeder lid was off.|It suggests a person, but the lid often blew off in the wind.
  The money for the class trip went missing from the teacher's desk.|nobody, because it had fallen behind the drawer|The drawer stuck when it was pulled out.|The envelope was the same size as the gap behind the drawer.|A corner of white paper could be seen behind the desk.|A substitute teacher had used the desk that morning.|It makes the substitute look guilty, but using a desk is not taking money.|Leo had asked how much money was collected.|It seems a suspicious question, but he was the class treasurer.
  The cake for the party slid off its plate.|the cat, Pepper|White frosting was stuck to Pepper's whiskers.|A trail of crumbs led to the sofa where Pepper slept.|Pepper jumped onto counters whenever no one watched.|Aunt Jo had complained that the cake was too sweet.|It gives Aunt Jo a reason, but a complaint is not a crime.|The plate was near the edge of the table.|It suggests an accident, but the plate had been there for hours.
  The pond's goldfish were disappearing one by one.|a heron|Long, three-toed prints were pressed into the mud.|A gray feather floated on the water.|The fish vanished only at dawn, when herons hunt.|The neighbor's cat sat by the pond every afternoon.|It points to the cat, but the fish disappeared at dawn, not in the afternoon.|A net lay beside the pond.|It suggests a fishing thief, but the gardener used it to clean leaves.
  The lights in the museum went out during the night tour.|a tripped switch in the fuse box|The fuse box door was found hanging open.|The lights went out just as the big heater was switched on.|One switch in the box was pointing down.|A guide had grumbled that the tour was too long.|It makes the guide seem to want it to end, but grumbling is not proof.|Footsteps were heard near the stairs.|It suggests a sneak, but visitors were walking on the stairs.
  The new pencils kept vanishing from the art room.|Ms. Kim's parrot, Rio|Chewed pencil bits were found in Rio's cage.|Rio was let out to fly each afternoon.|Pencils went missing only on days Rio flew.|Older students used the room after school.|It points to them, but pencils vanished on days they were not there.|The supply cupboard was unlocked.|It suggests an easy theft, but the pencils were on the open table.
  Someone had written in the snow on the school sign.|the janitor's daughter, Gemma|Small boot prints with star-shaped treads led to the sign.|Gemma wore new boots with stars on the soles.|The letters were as neat as the ones in Gemma's notebook.|A group of teenagers walked past the school that night.|It points to them, but their shoe prints went straight past the sign.|A snowball fight had been held on the field.|It suggests mischief, but the field was far from the sign.
`);
const caseText = (r: readonly string[]) =>
  `${field(r, 0)} ${field(r, 2)} ${field(r, 5)} ${field(r, 3)} ${field(r, 7)} ${field(r, 4)} In the end, the culprit turns out to be ${field(r, 1)}.`;
const clueItems: ChoiceItem[] = cases.flatMap((r) =>
  [2, 3, 4].map((k): ChoiceItem => [`${caseText(r)}\n\nWhich detail was a real clue?`, field(r, k), [field(r, 5), field(r, 7)]]),
);
const herringMyths = [
  "It is the one clue that proves who the culprit is, so a careful reader should trust it.",
  "It was put in only to make the story longer and has no effect on the reader.",
  "It shows that the detective made a mistake and let the real culprit get away.",
  "It tells the reader exactly how the deed was done and at what time it happened.",
] as const;
const herringItems: ChoiceItem[] = cases.flatMap((r, p) =>
  [0, 1].map(
    (h): ChoiceItem => [
      `${caseText(r)}\n\nWhy does this detail mislead the reader? *${field(r, 5 + h * 2)}*`,
      field(r, 6 + h * 2),
      [herringMyths[(p + h) % 4] ?? "", herringMyths[(p + h + 2) % 4] ?? ""],
    ],
  ),
);

const cluesAndHerrings = topic("reading", {
  id: "clues-and-red-herrings",
  title: ["Clues and Red Herrings", "线索与误导"],
  summary: ["A mystery hides real clues among false ones that point the wrong way.", "侦探故事把真正的线索藏在指向错误方向的假线索之中。"],
  after: ["making-predictions"],
  points: [
    choose(
      "a-real-clue",
      ["A Real Clue", "真正的线索"],
      [
        "A mystery writer hides **real clues** among the details: facts that, put together, lead to the culprit. A real clue still fits once the answer is known; it helps explain how the deed was done. To test a detail, ask whether it connects to the culprit and to the deed itself, not only to someone who seems suspicious.",
        "侦探故事的作者把**真正的线索**藏在各种细节之中：这些事实合在一起就能指向真正的犯人。知道答案以后，真正的线索仍然说得通，它帮助解释事情是怎么发生的。要检验一个细节，就问它是否与犯人和事情本身有关，而不只是与某个看起来可疑的人有关。",
      ],
      ["Which detail was a real clue?", "哪个细节是真正的线索？"],
      clueItems,
      (right) => [
        `**${right}** connects the culprit to the deed itself, so it is a real clue.`,
        `**${right}** 把犯人和事情本身联系起来，所以是真正的线索。`,
      ],
      [
        ["*{wrong}* points at someone or something else; it is a red herring.", "*{wrong}* 指向了别的人或事；它是误导线索。"],
        [
          "*{wrong}* seems suspicious, but it does not connect the culprit to the deed.",
          "*{wrong}* 看起来可疑，但并没有把犯人和事情联系起来。",
        ],
      ],
    ),
    choose(
      "why-a-detail-misleads",
      ["Why a Detail Misleads", "细节为什么会误导人"],
      [
        "A **red herring** is a detail that points the reader the wrong way. It may make an innocent person look guilty, or suggest a way the deed was done that turns out to be false. Writers use red herrings to keep readers guessing. Once you know the answer, ask why the detail seemed to matter and what it really shows.",
        "**误导线索**是把读者引向错误方向的细节。它可能让无辜的人看起来有罪，或者暗示一种后来证明是错误的作案方式。作者用误导线索让读者一直猜下去。知道答案以后，问问这个细节为什么看起来重要，而它真正说明了什么。",
      ],
      ["Why does this detail mislead the reader?", "这个细节为什么会误导读者？"],
      herringItems,
      (right) => [`The detail is a red herring: ${right}`, `这个细节是误导线索：${right}`],
      [
        ["*{wrong}* is not so: this detail points away from the real culprit.", "*{wrong}* 并非如此：这个细节把读者引离了真正的犯人。"],
        [
          "*{wrong}* misreads the detail: it seems to matter but turns out not to.",
          "*{wrong}* 误解了这个细节：它看起来重要，结果并不重要。",
        ],
      ],
    ),
  ],
});

// Drawing conclusions: clue|clue|clue|conclusion|other conclusion|the clue that rules it out (1-3)|other conclusion|clue
const conclusionSets = rows(`
  The ground is wet.|The sky is clear and blue.|The sprinkler hose lies on the grass.|Someone has watered the lawn.|It rained this morning.|2|A pipe has burst under the yard.|3
  Mia's backpack is by the door.|Her coat is on its hook.|Her bike is missing from the garage.|Mia rode her bike somewhere nearby.|Mia walked to school.|3|Mia went away on a long trip.|1
  The oven is warm.|Flour is spilled on the counter.|The kitchen smells of cinnamon.|Someone has been baking.|Someone heated up leftover soup.|2|The oven broke and got too hot.|3
  The players are smiling.|The coach is holding a trophy.|Fans are cheering in the stands.|The team has won the game.|The team lost but played well.|2|The game has not started yet.|1
  The puppy's bowl is full.|The puppy is asleep in its bed.|A bag of dog food sits open on the floor.|Someone has fed the puppy and it is resting.|The puppy is sick and will not eat.|3|The puppy ran away from home.|2
  Leaves are turning red.|Children are wearing jackets.|Pumpkins sit on the porches.|It is autumn.|It is the middle of summer.|2|It is early spring.|3
  The theater is dark.|People are sitting quietly in their seats.|Music begins to play.|A show is about to start.|The show has just ended.|2|The theater is closed for repairs.|3
  Ben's hair is wet.|He is wrapped in a towel.|His swimsuit hangs on the line.|Ben has been swimming.|Ben was caught in the rain.|3|Ben is about to go swimming.|1
  The streets are empty.|The shops are shuttered.|Snow is piled high against the doors.|A big snowstorm has closed the town.|It is a busy holiday.|1|The town has been abandoned.|3
  The baby is rubbing her eyes.|She keeps yawning.|It is long past her usual nap time.|The baby is tired.|The baby is hungry.|2|The baby has just woken up.|3
  A ladder leans on the house.|There are paint cans on the porch.|Half the wall is a new color.|Someone is painting the house.|Someone is cleaning the windows.|3|The house is being knocked down.|3
  The fish tank is cloudy.|The fish are gasping at the top.|The filter is silent.|The tank's filter has stopped working.|The fish are hungry for food.|3|Someone just cleaned the tank.|1
  Grandma is wearing a sun hat.|A picnic basket sits by the car.|Beach towels are rolled in the trunk.|Grandma is going to the beach.|Grandma is going to a wedding.|3|Grandma has just come back from the beach.|2
  The milk smells sour.|Its date passed a week ago.|Lumps float on top when it is poured.|The milk has gone bad.|The milk was bought this morning.|2|The milk is fine to drink.|1
  The tree's branches are bare.|Its trunk is hollow and gray.|No buds appear even in late spring.|The tree has died.|The tree is resting for the winter.|3|The tree is healthy and young.|2
`);
const setText = (r: readonly string[], flip: boolean) =>
  (flip ? [field(r, 2), field(r, 0), field(r, 1)] : [field(r, 0), field(r, 1), field(r, 2)]).join(" ");
const supportedItems: ChoiceItem[] = conclusionSets.flatMap((r) =>
  [false, true].map((flip): ChoiceItem => [`Clues: ${setText(r, flip)}`, field(r, 3), [field(r, 4), field(r, 6)]]),
);
const ruleItems: ChoiceItem[] = conclusionSets.flatMap((r) =>
  [4, 6].map((k): ChoiceItem => {
    const clue = Number(field(r, k + 1)) - 1;
    const others = [0, 1, 2].filter((i) => i !== clue).map((i) => field(r, i));
    return [
      `Clues: ${setText(r, false)}\n\nWhich clue rules out this conclusion? *${field(r, k)}*`,
      field(r, clue),
      [others[0] ?? "", others[1] ?? ""],
    ];
  }),
);

const drawingConclusions = topic("reading", {
  id: "drawing-conclusions",
  title: ["Drawing Conclusions", "得出结论"],
  summary: [
    "A conclusion puts several clues together into one judgment that none of them states alone.",
    "结论是把几条线索合在一起得出的判断，而这个判断单靠其中任何一条都说不出来。",
  ],
  after: ["making-inferences", "supporting-details"],
  points: [
    choose(
      "the-conclusion-every-clue-supports",
      ["The Conclusion Every Clue Supports", "每条线索都支持的结论"],
      [
        "To **draw a conclusion**, put the clues together. No single clue says the answer: wet ground alone could mean rain or a sprinkler. A good conclusion fits **every** clue at once. A conclusion that fits one clue but clashes with another is a guess the evidence does not allow.",
        "要**得出结论**，就要把线索合在一起。没有哪条线索单独说出了答案：只看地面湿了，可能是下过雨，也可能是洒水器。好的结论要同时符合**每一条**线索。只符合一条线索、却与另一条矛盾的结论，是证据不允许的猜测。",
      ],
      ["Which conclusion do all the clues support?", "所有线索都支持哪个结论？"],
      supportedItems,
      (right) => [`Every clue fits **${right}**, and no clue clashes with it.`, `每条线索都符合 **${right}**，没有一条与它矛盾。`],
      [
        ["*{wrong}* fits some clues, but one clue rules it out.", "*{wrong}* 符合部分线索，但有一条线索排除了它。"],
        ["*{wrong}* clashes with at least one of the clues.", "*{wrong}* 至少与一条线索相矛盾。"],
      ],
    ),
    choose(
      "the-clue-that-rules-it-out",
      ["The Clue That Rules It Out", "排除结论的线索"],
      [
        "Careful readers test other possible conclusions too. For each one, they look for a clue that **rules it out**: a clear sky rules out rain this morning; a missing bike rules out walking. Ruling out the other possibilities is what makes a conclusion strong.",
        "细心的读者还会检验其他可能的结论。对每一个结论，他们都寻找一条能**排除它**的线索：晴朗的天空排除了早上下过雨；自行车不见了排除了步行。排除其他可能，结论才站得住。",
      ],
      ["Which clue rules out this conclusion?", "哪条线索排除了这个结论？"],
      ruleItems,
      (right) => [
        `**${right}** cannot be true if that conclusion were right, so it rules it out.`,
        `如果那个结论正确，**${right}** 就不可能成立，所以它排除了那个结论。`,
      ],
      [
        ["*{wrong}* could fit that conclusion, so it does not rule it out.", "*{wrong}* 可能与那个结论相符，所以不能排除它。"],
        ["*{wrong}* says nothing against that conclusion.", "*{wrong}* 并不与那个结论矛盾。"],
      ],
    ),
  ],
});

// Building suspense.
const suspenseLines = `
  From a story about an old house at night.|The door creaked open, and something moved in the dark.|The door opened, and Mom came in with groceries.|The door was painted a cheerful yellow.
  From a story about a camping trip.|Footsteps stopped right outside her tent.|The campers sang songs around the warm fire.|Her tent was green and smelled of pine.
  From a story about a family evening at home.|The lights flickered once and then went out.|The lights were bright enough for reading.|Dad turned on the lights so we could eat.
  From a story about a quiet night at home.|Something scratched at the window. Then silence.|The window looked out on a sunny garden.|We opened the window to let in fresh air.
  From a story about a girl's bedroom.|A note on the desk said only: "I know."|A note on the desk said: "Back by six. Love, Dad."|The desk was covered with neat piles of books.
  From a story about a climb down a cliff.|The rope began to fray, strand by strand.|The rope was strong and new.|We coiled the rope and packed it away.
  From a story about a visit to a farm.|Who had left the gate open, and why?|The gate was open, so we walked through it.|The old gate was made of iron.
  From a story about a flooded basement.|The water kept rising. One step. Then another.|The water was calm and warm for swimming.|We filled our bottles with water from the tap.
  From a story about a frozen lake.|Far below, the ice cracked like a gunshot.|The ice was thick enough for skating all day.|We put ice in our lemonade.
  From a story about a girl and her phone.|Her phone buzzed: one new message from an unknown number.|Her phone buzzed with a message from her best friend about lunch.|Her phone was in her pocket.
  From a story about a trip into a cave.|The cave grew narrower. The torch began to fade.|The cave was wide and lit by electric lamps for visitors.|We walked past the cave on our way home.
  From a story about a stay in a hotel.|Someone had been in the room. The bed was still warm.|Someone had made the bed with fresh sheets.|The room had two beds and a lamp.
  From a story about a boy locked out of his house.|He reached for the key. It was gone.|He reached for the key and opened the door.|He kept the key on a red string.
  From a story about a fishing trip.|The storm hit just as the boat left the harbor.|The boat left the harbor on a calm, bright morning.|The boat was painted blue and white.
  From a story about a girl alone in a hallway.|A shadow slid across the wall behind her.|Sunlight slid across the wall in the afternoon.|The wall was covered with family photos.
  From a story about a family waiting up at night.|The clock struck midnight. No one had come home.|The clock struck six, and everyone sat down to dinner.|The clock hung above the fireplace.
  From a story about a walk in the woods.|Then the voice whispered her name.|Then her teacher called her name for the spelling test.|Her name was Lila Grant.
  From a story about a mountain crossing.|The bridge swayed. Halfway across, a board snapped.|The bridge was wide and safe for cars.|We drove across the bridge to visit Grandma.
  From a story about a house with a dog.|The dog froze, growling at the empty hallway.|The dog wagged its tail at the mail carrier.|The dog was a brown terrier named Pip.
  From a story about a cold night outdoors.|Only one match was left, and the wind was rising.|We had plenty of matches and a dry, still night.|The matches were kept in a tin box.
  From a story about a hunt for treasure.|The map ended at the edge of the swamp.|The map showed every road in the town clearly.|We folded the map and put it in the car.
  From a story about a girl alone in her room.|Her heart pounded. The handle was turning.|Her heart was calm as she read in bed.|The handle of the door was made of brass.
  From a story about a long hike.|Thunder rolled closer. The trail had vanished.|The trail was marked with bright signs every mile.|We hiked the trail on a sunny Saturday.
  From a story about a child's bedroom.|Something under the bed was breathing.|Her slippers were under the bed where she left them.|The bed was soft and covered with quilts.
  From a story about a radio operator in a storm.|The radio crackled: "Is anyone out there?"|The radio played her favorite song.|The radio sat on the kitchen shelf.
  From a story about a trip into town.|The last bus pulled away, and the street was empty.|The bus came right on time, and we climbed aboard.|The bus stop had a small bench.
  From a story about a walk home at night.|A cold hand touched his shoulder in the dark.|A friend tapped his shoulder to say hello.|He had a scrape on his shoulder from soccer.
  From a story about a road trip.|The engine coughed, sputtered and died.|The engine purred as we drove down the highway.|The engine of the car was new.
  From a story about a mystery at an old manor.|The door was locked from the inside.|The door was unlocked, so we went in.|The door had a brass knocker.
  From a story about an old house's cellar.|At the bottom of the stairs, a light was moving.|At the bottom of the stairs, the cat was asleep.|The stairs had fourteen steps.
`;
const techniqueLabels: Record<string, Label> = {
  "a dark or closed setting": {
    zh: "黑暗或封闭的环境",
    why: [
      "It traps the character somewhere dark, narrow or cut off, where danger is hard to see or escape.",
      "它把人物困在黑暗、狭窄或与外界隔绝的地方，危险难以看清或逃脱。",
    ],
    not: ["The passage does not rely on a dark or closed place.", "这段文字并不依靠黑暗或封闭的地方。"],
  },
  "short, tense sentences": {
    zh: "短促、紧张的句子",
    why: ["Its sentences are short and sharp, so the reader's pulse speeds up with them.", "它的句子短促有力，让读者的心跳也随之加快。"],
    not: ["The passage's sentences are not short and choppy.", "这段文字的句子并不短促。"],
  },
  "a question left open": {
    zh: "留下悬而未决的问题",
    why: [
      "It raises a question it does not answer, so the reader must read on to find out.",
      "它提出一个没有回答的问题，读者必须读下去才能知道。",
    ],
    not: ["The passage does not leave a question hanging.", "这段文字没有留下悬而未决的问题。"],
  },
  "a chapter ending in danger": {
    zh: "章节结束在危险时刻",
    why: [
      "The chapter stops at the moment of danger, before the reader learns what happens.",
      "章节在危险的一刻戛然而止，读者还不知道接下来会发生什么。",
    ],
    not: ["The passage does not end a chapter at a moment of danger.", "这段文字并没有让章节结束在危险时刻。"],
  },
};
const techniqueLines = `
  The tunnel grew narrower and darker until the walls brushed both of her shoulders and the opening behind her was only a gray dot.|a dark or closed setting
  The cellar had no windows, and the only door had swung shut behind them with a heavy thud that echoed off the stone.|a dark or closed setting
  Fog wrapped the island so thickly that Theo could not see his own hands, and the boat had already gone.|a dark or closed setting
  Deep in the cave, their flashlight beam reached only a few steps ahead before the blackness swallowed it.|a dark or closed setting
  The elevator jolted to a stop between floors, and the little light above the buttons went out.|a dark or closed setting
  Snow had buried the cabin to its windows. The phone was dead, and the road had vanished under white drifts.|a dark or closed setting
  The attic was airless and black, and somewhere among the old trunks a floorboard groaned.|a dark or closed setting
  The forest closed in around the path until the branches met overhead and the last of the daylight disappeared.|a dark or closed setting
  She ran. Branches whipped her face. Behind her, something crashed through the trees. Closer. Closer.|short, tense sentences
  Click. The lock turned. Sam held his breath. Nothing moved.|short, tense sentences
  The ground shook. Plates fell. Mom screamed. Then the lights went out.|short, tense sentences
  He climbed. His fingers slipped. He grabbed again. The rock held.|short, tense sentences
  A crack. A splash. The canoe tipped. Cold water everywhere.|short, tense sentences
  Wait. Listen. There it was again. A knock.|short, tense sentences
  The fuse burned. Ten seconds. Five. Kai dove behind the wall.|short, tense sentences
  The wolf stopped. It lifted its head. It sniffed. It turned toward her.|short, tense sentences
  Why had the old man looked so frightened when he saw the box, and what was inside it that he would not name?|a question left open
  Nobody knew where the strange letters came from, or who kept sliding them under Ada's door each night.|a question left open
  The captain refused to say why the ship had changed course in the middle of the night.|a question left open
  Who had drawn the map, and why was the island on it missing from every other map in the world?|a question left open
  Grandpa would only say that the locked room held "something best forgotten," and then he changed the subject.|a question left open
  The footprints led to the edge of the lake and stopped. But no one had seen anyone swim.|a question left open
  Each morning another page of the diary was gone, though the drawer was always locked.|a question left open
  The stranger knew Mira's name, though she was sure they had never met.|a question left open
  She turned the handle and pushed. The door swung open, and there, in the moonlight, stood a figure she knew. End of Chapter Four.|a chapter ending in danger
  The bridge gave a long, low groan, and the middle plank began to split under Jonah's feet. (Chapter Seven ends here.)|a chapter ending in danger
  The bear rose onto its back legs, just ten steps away, and Lena realized she had dropped the whistle. (End of Chapter Two.)|a chapter ending in danger
  As the last torch flickered out, they heard the stone door behind them begin to slide shut. (End of Chapter Nine.)|a chapter ending in danger
  The wave towered over the little boat, blotting out the sky. (Chapter Three ends here.)|a chapter ending in danger
  The floor of the old mine gave way, and Pablo felt himself falling into the dark. (End of Chapter Five.)|a chapter ending in danger
  A hand shot out from behind the curtain and gripped her wrist. (End of Chapter Eleven.)|a chapter ending in danger
  The plane's engine sputtered, and the mountains rushed up toward them. (Chapter Six ends here.)|a chapter ending in danger
`;

const buildingSuspense = topic("reading", {
  id: "building-suspense",
  title: ["How Writers Build Suspense", "作者如何制造悬念"],
  summary: [
    "Writers build suspense with dark or closed settings, short sentences, open questions and chapters that end in danger.",
    "作者用黑暗或封闭的环境、短句、未解的问题和在危险时刻结束的章节来制造悬念。",
  ],
  after: ["how-setting-shapes-a-story"],
  points: [
    choose(
      "the-sentence-that-builds-suspense",
      ["The Sentence That Builds Suspense", "制造悬念的句子"],
      [
        "**Suspense** is the feeling of worry and curiosity that keeps a reader turning pages. A sentence builds suspense when it hints at danger or mystery and holds back what happens next: a creaking door, footsteps that stop, a key that is gone. A sentence that is calm, safe or simply describes something does not.",
        "**悬念**是让读者一页页读下去的担心和好奇。一个句子暗示危险或谜团、又不说出接下来会发生什么时，就制造了悬念：吱呀作响的门、突然停下的脚步、不见了的钥匙。平静、安全或只是描述事物的句子则不会。",
      ],
      ["Which sentence builds suspense?", "哪个句子制造了悬念？"],
      suspenseLines,
      (right) => [
        `**${right}** hints at danger and holds back what happens next, so the reader worries and reads on.`,
        `**${right}** 暗示了危险，又不说出接下来会发生什么，所以读者会担心并读下去。`,
      ],
      [
        ["*{wrong}* is calm and safe, so it gives the reader nothing to worry about.", "*{wrong}* 平静而安全，读者没有什么可担心的。"],
        ["*{wrong}* only describes something, with no hint of danger.", "*{wrong}* 只是描述事物，没有任何危险的暗示。"],
      ],
    ),
    label(
      "how-the-writer-builds-it",
      ["How the Writer Builds It", "作者怎样制造悬念"],
      [
        "Writers have several ways to build suspense. A **dark or closed setting** traps the character where danger is hard to see. **Short, tense sentences** speed up the reader. A **question left open** makes the reader need the answer. A **chapter ending in danger** stops at the worst moment, so the reader must turn the page.",
        "作者有好几种制造悬念的方法。**黑暗或封闭的环境**把人物困在危险难以看清的地方。**短促、紧张的句子**加快读者的节奏。**悬而未决的问题**让读者急于知道答案。**在危险时刻结束的章节**停在最紧要的关头，读者只好翻到下一页。",
      ],
      ["How does the writer build suspense here?", "作者在这里是怎样制造悬念的？"],
      techniqueLines,
      techniqueLabels,
    ),
  ],
});

// Comparing stories of one genre: mysteries.
const featureLabels: Record<string, Label> = {
  "the puzzle": {
    zh: "谜题",
    why: [
      "It sets up what has gone wrong or is unknown, the question the story must answer.",
      "它提出出了什么问题或什么未知，也就是故事必须回答的问题。",
    ],
    not: ["The puzzle is what must be solved; this detail is not that.", "谜题是需要解开的问题；这个细节不是。"],
  },
  "the detective": {
    zh: "侦探",
    why: ["It tells about the person who looks into the puzzle and how they work.", "它讲述调查谜题的人以及他们的做法。"],
    not: ["The detective is the one who investigates; this detail is not about them.", "侦探是调查的人；这个细节不是讲他们的。"],
  },
  "the suspects": {
    zh: "嫌疑人",
    why: ["It names people who might be guilty and gives a reason to suspect them.", "它说出可能有罪的人，并给出怀疑他们的理由。"],
    not: ["Suspects are the people who might be guilty; this detail is not about them.", "嫌疑人是可能有罪的人；这个细节不是讲他们的。"],
  },
  "the solution": {
    zh: "答案",
    why: ["It reveals who did it, or how, and explains the clues.", "它揭示是谁做的或怎样做的，并解释线索。"],
    not: ["The solution reveals the answer; this detail does not.", "答案揭示真相；这个细节没有。"],
  },
};
const featureLines = `
  On the morning of the town fair, the prize pumpkin was gone from its stand.|the puzzle
  Every night that week, someone had moved the statues in the museum garden.|the puzzle
  The class's letters to the mayor never arrived, though they had been posted.|the puzzle
  A strange tune played from the empty music room at the same hour each day.|the puzzle
  When the ship docked, the captain's logbook was missing from its locked drawer.|the puzzle
  The school's trophy case was found open, but nothing inside was missing.|the puzzle
  The baker's best recipe was printed in a rival's window before she had shared it.|the puzzle
  Ten-year-old Priya, who noticed everything, took out her notebook.|the detective
  Inspector Holt, gray-haired and patient, asked each guest the same three questions.|the detective
  Nana Ruth, a retired teacher, solved mysteries by listening more than she spoke.|the detective
  The twins split up the work: Ali searched the garden while Ama questioned the staff.|the detective
  Detective Chen never trusted a story until she had checked it twice.|the detective
  Sam, the newspaper boy, knew every street and every secret in town.|the detective
  The museum guard, Ms. Brook, used her map of the halls to trace every step.|the detective
  The gardener had argued with the judge about the pumpkin the day before.|the suspects
  Mr. Vance had a key to the music room and loved old tunes.|the suspects
  The cook had been seen near the captain's cabin at midnight.|the suspects
  Three neighbors had each wanted the prize: Mrs. Hill, Mr. Grove and young Ty.|the suspects
  The rival baker had once worked in her kitchen.|the suspects
  Two students had stayed late that afternoon, and both had muddy shoes.|the suspects
  The new mail carrier had changed the route only last week.|the suspects
  In the end, the pumpkin had simply rolled down the hill into the creek.|the solution
  The tune came from an old music box set to play by a timer, hidden by a former teacher.|the solution
  The logbook had been borrowed by the first mate, who wanted to check the stars.|the solution
  It was the window cleaner, who copied the recipe through the kitchen glass.|the solution
  The letters had been dropped in an old mailbox that no one emptied anymore.|the solution
  The statues were moved by the night gardener, who mowed around them and put them back wrong.|the solution
  The trophy case was opened by the principal, who had been polishing the cups.|the solution
  Priya proved that the mud on the shoes came from the soccer field, not the garden.|the solution
  Inspector Holt showed that only the cook could have known the cabin was empty.|the solution
`;
const mysteryPairs = rows(`
  A girl and her grandfather search for a missing cat in their apartment building.|A girl and her grandfather search for a missing cat on their farm.|the setting
  A police inspector questions the guests about a stolen necklace at a hotel.|A curious ten-year-old questions the guests about a stolen necklace at a hotel.|the detective
  A cake vanishes from a party, and three cousins are suspected.|A cake vanishes from a party, and two neighbors are suspected.|the suspects
  A detective finds the lost ring by following muddy footprints.|A detective finds the lost ring when the thief confesses.|how the puzzle is solved
  Twins look into the strange lights at the lighthouse on a stormy night.|Twins look into the strange lights at the lighthouse in a busy summer town.|the setting
  A grandmother who loves puzzles investigates the missing paintings.|A young reporter investigates the missing paintings.|the detective
  The missing bike was taken by the boy next door.|The missing bike was borrowed by the girl's own father.|how the puzzle is solved
  In a crowded train, a passenger's briefcase disappears, and the conductor and a cook are suspected.|In a crowded train, a passenger's briefcase disappears, and three schoolchildren are suspected.|the suspects
  A dog walker finds out who has been digging up the park's flowers.|A park ranger finds out who has been digging up the park's flowers.|the detective
  A museum's golden mask goes missing during a snowstorm in the mountains.|A museum's golden mask goes missing during a festival in the city.|the setting
  The detective solves the case of the empty cookie jar by spotting crumbs on a sleeve.|The detective solves the case of the empty cookie jar by setting a trap with fresh cookies.|how the puzzle is solved
  A school's science trophy is stolen; the janitor and the coach are suspected.|A school's science trophy is stolen; two rival teams are suspected.|the suspects
  Two friends hunt for a lost treasure map in an old library.|Two friends hunt for a lost treasure map aboard a fishing boat.|the setting
  A shy boy who notices small details solves the riddle of the moving chess pieces.|A famous chess champion solves the riddle of the moving chess pieces.|the detective
  The mystery of the howling at night is solved when a recording is found in the attic.|The mystery of the howling at night is solved when the wind is heard in a broken chimney.|how the puzzle is solved
  A farmer's prize hen disappears, and a fox and a hungry neighbor are suspected.|A farmer's prize hen disappears, and the farmer's own children are suspected.|the suspects
  A detective looks into missing letters at a busy city post office.|A detective looks into missing letters at a tiny village post office.|the setting
  A sharp-eyed cook works out who poisoned the soup.|A sharp-eyed doctor works out who poisoned the soup.|the detective
  The missing violin turns up when a student finds it in the wrong case.|The missing violin turns up when a pawn shop owner calls the police.|how the puzzle is solved
  Somebody painted the school wall; three older students are suspected.|Somebody painted the school wall; the art teacher is suspected.|the suspects
  A girl solves the mystery of the strange noises in her new house in the woods.|A girl solves the mystery of the strange noises in her new house beside a busy station.|the setting
  An old sea captain finds out why ships keep running aground.|A young lighthouse keeper finds out why ships keep running aground.|the detective
  The case of the missing keys is solved by noticing the dog's new hiding place.|The case of the missing keys is solved by checking the security camera.|how the puzzle is solved
  The town's statue is stolen; the mayor's rival and a sculptor are suspected.|The town's statue is stolen; a group of visiting tourists is suspected.|the suspects
  A boy investigates footprints in the snow around his cabin.|A boy investigates footprints in the sand around his beach hut.|the setting
  A robot built by a girl helps her find the lost hamster.|The girl's sleepy uncle helps her find the lost hamster.|the detective
  The detective proves who took the medal by checking who arrived late.|The detective proves who took the medal by matching fingerprints on the case.|how the puzzle is solved
  A stolen recipe book is traced to either the baker's apprentice or her sister.|A stolen recipe book is traced to either a food critic or a delivery driver.|the suspects
  Two cousins search for a lost ring in a castle during a thunderstorm.|Two cousins search for a lost ring in a garden on a sunny afternoon.|the setting
  A clever parrot helps its owner find out who took the jewels.|A clever detective with a magnifying glass finds out who took the jewels.|the detective
`);
const aspects = ["the setting", "the detective", "the suspects", "how the puzzle is solved"];
const differItems: ChoiceItem[] = mysteryPairs.map((r, i): ChoiceItem => {
  const right = field(r, 2);
  const others = aspects.filter((a) => a !== right);
  return [`Story 1: ${field(r, 0)}\n\nStory 2: ${field(r, 1)}`, right, [others[i % 3] ?? "", others[(i + 1) % 3] ?? ""]];
});

const storiesOfOneGenre = topic("reading", {
  id: "comparing-stories-of-one-genre",
  title: ["Comparing Stories of One Genre", "比较同一体裁的故事"],
  summary: [
    "Stories of one genre share features (a mystery has a puzzle, a detective, suspects and a solution) but treat them differently.",
    "同一体裁的故事有共同的要素（侦探故事有谜题、侦探、嫌疑人和答案），但处理方式各不相同。",
  ],
  after: ["same-pattern-different-cultures"],
  points: [
    label(
      "the-features-of-a-mystery",
      ["The Features of a Mystery", "侦探故事的要素"],
      [
        "A **genre** is a kind of story with features its readers expect. A mystery has a **puzzle** (something has gone wrong or is unknown), a **detective** who looks into it, **suspects** who might be guilty, and a **solution** that explains the clues. Knowing the features helps you see what a detail is doing in the story.",
        "**体裁**是读者对其要素有所期待的一类故事。侦探故事有一个**谜题**（出了问题或有未知的事）、调查它的**侦探**、可能有罪的**嫌疑人**，以及解释线索的**答案**。了解这些要素，能帮助你看出一个细节在故事中起什么作用。",
      ],
      ["Which feature of a mystery does this detail show?", "这个细节体现了侦探故事的哪个要素？"],
      featureLines,
      featureLabels,
    ),
    choose(
      "how-two-mysteries-differ",
      ["How Two Mysteries Differ", "两个侦探故事有何不同"],
      [
        "Two stories of one genre share its features but **treat them differently**. Two mysteries may have the same puzzle but a different detective, different suspects, a different setting or a different way of solving it. To compare them, go through the features one at a time and find the one that changes.",
        "同一体裁的两个故事有共同的要素，但**处理方式不同**。两个侦探故事可能谜题相同，但侦探、嫌疑人、发生地点或破案方式不同。要比较它们，就逐一检查各个要素，找出有变化的那一个。",
      ],
      ["In what way do the two stories differ?", "这两个故事在哪方面不同？"],
      differItems,
      (right) => [
        `The two stories share everything else, but they differ in **${right}**.`,
        `两个故事其他方面都相同，不同的是 **${right}**。`,
      ],
      [
        ["*{wrong}* is the same in both stories.", "*{wrong}* 在两个故事里是一样的。"],
        ["*{wrong}* does not change from one story to the other.", "*{wrong}* 在两个故事之间没有变化。"],
      ],
    ),
  ],
});

// Two characters facing one challenge: text|A|B|alike|alike2|only A|only B|difference|its detail|difference|its detail|
// a detail of likeness|a detail of setting|A's response|B's response|a response of neither|what A's shows|what B's shows|what neither's shows
const pairsOfCharacters = rows(`
  When the canoe tipped over far from camp, Maya and her brother Leo both swam to the rocky shore. Leo shouted and kicked at the overturned canoe, but Maya sat quietly and counted their supplies: two matches, a knife, one granola bar. The river roared beside them as the sun went down behind the dark pines. "We can make it," Maya said, though her hands were shaking.|Maya|Leo|Both swam to shore after the canoe tipped.|Both were stranded far from camp.|Both stayed calm the whole time.|Both counted the supplies.|Maya stays calm, but Leo loses his temper.|Leo shouted and kicked at the canoe while Maya sat quietly.|Maya makes a plan, while Leo does not.|Maya counted their supplies: two matches, a knife, one granola bar.|Maya and her brother Leo both swam to the rocky shore after the canoe tipped.|The river roared beside them as the sun went down behind the dark pines.|She counts the supplies and tells Leo they can make it.|He shouts and kicks at the canoe.|They run off to find help in the dark.|Maya is brave even when she is afraid.|Leo lets his anger show when things go wrong.|Maya does not care what happens to them.
  The snow had been falling for two days, and the cabin's power was gone. Grandpa Jim and Nora both wrapped themselves in blankets. Grandpa told stories of winters long ago and sang songs off key, while Nora stared at her dead phone and sighed. Outside, the snowdrifts had climbed all the way up to the windows. When the fire burned low, Nora finally got up and fetched more wood.|Grandpa Jim|Nora|Both wrapped themselves in blankets.|Both were stuck in the snowy cabin.|Both stared at their phones.|Both told stories of long ago.|Grandpa keeps cheerful, but Nora is gloomy.|Grandpa sang songs while Nora stared at her dead phone and sighed.|Nora finally acts, while Grandpa only talks.|When the fire burned low, Nora finally got up and fetched more wood.|Grandpa Jim and Nora both wrapped themselves in thick wool blankets.|Outside, the snowdrifts had climbed all the way up to the windows.|He tells stories and sings to pass the time.|She sighs at her phone, then fetches wood.|They try to dig their way to town.|Grandpa makes the best of hard times.|Nora can act when it really matters.|Grandpa is frightened of the snow.
  The trail had vanished in the fog, and Ravi and Jen were lost on the mountain. Jen pulled out the map and the compass and began to work out where they were. Ravi wanted to keep walking downhill "until we hit something." A cold wind howled across the bare gray rocks of the mountainside. In the end, Ravi agreed to wait while Jen found the trail marker on the map.|Jen|Ravi|Both were lost in the fog.|Both wanted to get off the mountain.|Both read the map and compass.|Both wanted to walk downhill at once.|Jen works carefully, but Ravi wants to hurry.|Ravi wanted to keep walking downhill "until we hit something."|Jen uses tools, while Ravi relies on luck.|Jen pulled out the map and the compass.|The trail had vanished in the fog, and both of them were lost on the mountain.|A cold wind howled across the bare gray rocks of the mountainside.|She studies the map and compass to find their place.|He wants to walk downhill until they hit something.|They climb to the very top of the mountain.|Jen solves problems step by step.|Ravi is impatient when he feels stuck.|Jen does not trust her own skills.
  The desert sun beat down after their jeep broke down. Uncle Tomas and Ana sheltered in its shade. Tomas checked the engine again and again, muttering at the wires. Ana dug a pit in the sand and laid the tarp across it to make a cool hollow. The water jug, which had been full that morning, was now half empty. By afternoon, Tomas crawled into Ana's shelter with a grateful grin.|Ana|Uncle Tomas|Both were stranded when the jeep broke down.|Both sheltered from the hot sun.|Both fixed the engine together.|Both dug a pit in the sand.|Ana makes a shelter, but Tomas keeps working on the engine.|Tomas checked the engine again and again, muttering at the wires.|Tomas comes to accept Ana's idea.|By afternoon, Tomas crawled into Ana's shelter with a grateful grin.|Uncle Tomas and Ana both sheltered in the thin strip of shade beside the jeep.|The water jug, which had been full that morning, was now half empty.|She builds a cool shelter from sand and a tarp.|He checks the engine over and over.|They walk off across the desert at noon.|Ana thinks of clever ways to stay safe.|Tomas is stubborn but can admit when he is wrong.|Ana is lazy and lets others do the work.
  When the flood reached the farmhouse, Kemi and her little brother Dayo climbed onto the roof. Dayo cried and clung to the chimney. Kemi tied her red scarf to a pole and waved it at every passing boat. Brown floodwater swirled and churned around the walls of the house below. When a rescue boat finally turned toward them, Kemi helped Dayo down first.|Kemi|Dayo|Both climbed onto the roof.|Both were trapped by the flood.|Both waved the red scarf at boats.|Both cried and clung to the chimney.|Kemi signals for help, but Dayo is too scared to act.|Dayo cried and clung to the chimney.|Kemi looks after Dayo.|Kemi helped Dayo down first.|Kemi and her little brother Dayo both climbed up onto the roof of the farmhouse.|Brown floodwater swirled and churned around the walls of the house below.|She waves her scarf at every boat that passes.|He cries and clings to the chimney.|They swim to the nearest tree.|Kemi is resourceful and protects others.|Dayo is still young and easily frightened.|Kemi wants to be rescued before her brother.
  The two friends had been on the raft for a day when the wind died. Omar paddled hard until his arms ached, but the shore came no closer. Lucia lay still, watching the clouds and the birds. The sea around them was flat and glassy, with no wind to fill a sail. "Birds fly toward land at sunset," she said, and pointed. Omar turned the raft to follow them.|Lucia|Omar|Both were adrift on the raft.|Both wanted to reach the shore.|Both paddled until their arms ached.|Both watched the birds.|Omar uses his strength, but Lucia uses her eyes.|Omar paddled hard until his arms ached.|Lucia watches for signs, while Omar acts at once.|Lucia lay still, watching the clouds and the birds.|The two friends had both been drifting on the raft for a whole day.|The sea around them was flat and glassy, with no wind to fill a sail.|She watches the birds and works out where land is.|He paddles hard until his arms ache.|They jump in and swim for it.|Lucia notices things others miss.|Omar is hardworking but acts before he thinks.|Lucia gives up and waits to be found.
  The bees swarmed out of the fallen log, and the scouts scattered. Wen ran straight into the lake and ducked under the water. Pete froze, then slowly backed away, waving his arms over his head. A loud buzzing filled the air under the tall pines by the lake. Later, both of them counted their stings and laughed about how differently they had run.|Wen|Pete|Both were caught by the swarming bees.|Both got away and laughed about it later.|Both froze where they stood.|Both waved their arms over their heads.|Wen runs fast, but Pete freezes first.|Pete froze, then slowly backed away.|Wen hides in the water, while Pete backs away.|Wen ran straight into the lake and ducked under the water.|Later, both of them counted their stings and laughed about how they had run.|A loud buzzing filled the air under the tall pines by the lake.|He runs into the lake and ducks under.|He freezes, then backs slowly away.|They climb the nearest tree.|Wen thinks fast in danger.|Pete stays careful even when he is scared.|Wen likes being stung by bees.
  The power failed during the storm, and Aisha and her grandmother were alone in the dark house. Aisha fumbled for her flashlight and jumped at every crack of thunder. Grandmother lit a candle and began to bake bread by its light, humming softly. Rain lashed against the windows, and thunder shook the glass. Soon Aisha was kneading the dough beside her, the thunder almost forgotten.|Grandmother|Aisha|Both were alone in the dark house.|Both ended up baking bread.|Both jumped at every crack of thunder.|Both fumbled for flashlights.|Grandmother stays calm, but Aisha is jumpy.|Aisha jumped at every crack of thunder.|Grandmother keeps busy, and Aisha learns to as well.|Soon Aisha was kneading the dough beside her.|When the power failed, Aisha and her grandmother were both alone in the dark house.|Rain lashed against the windows, and thunder shook the glass.|She lights a candle and bakes bread, humming.|She jumps at every crack of thunder.|They run out into the storm for help.|Grandmother turns fear into something useful.|Aisha is nervous at first but learns from others.|Grandmother does not notice the storm at all.
  The ice cracked under the sled, and Sven and Ingrid had seconds to decide. Sven leapt for the bank, leaving the sled behind. Ingrid lay flat on the ice to spread her weight and slid toward the shore, pulling the sled's rope. The gray lake groaned and creaked beneath them as the ice shifted. On the bank, Sven helped her pull the sled onto the snow.|Ingrid|Sven|Both reached the bank safely.|Both heard the ice crack.|Both jumped for the bank.|Both lay flat on the ice.|Ingrid saves the sled, but Sven leaves it behind.|Sven leapt for the bank, leaving the sled behind.|Ingrid uses what she knows about ice.|Ingrid lay flat on the ice to spread her weight.|Both of them reached the bank and pulled the sled up onto the snow together.|The gray lake groaned and creaked beneath them as the ice shifted.|She lies flat and slides to shore with the sled.|He leaps for the bank.|They wait in the middle of the lake.|Ingrid stays clear-headed and knows what to do.|Sven acts quickly to save himself.|Ingrid does not care about her own safety.
  A sudden sandstorm hid the camp, and Hana and Malik were on their own. Malik wrapped his scarf around his face and pulled Hana down behind a dune. Hana wanted to run for the tents she was sure were close. The blowing sand stung their faces and arms like a swarm of needles. When the wind dropped, the tents were far to their left: Hana's guess had been wrong.|Malik|Hana|Both were caught outside in the sandstorm.|Both lost sight of the camp.|Both wanted to run for the tents.|Both wrapped scarves around their faces.|Malik shelters and waits, but Hana wants to run.|Hana wanted to run for the tents she was sure were close.|Malik is right to wait, and Hana learns it.|When the wind dropped, the tents were far to their left.|The sandstorm hid the camp from both of them, and they were on their own.|The blowing sand stung their faces and arms like a swarm of needles.|He covers his face and shelters behind a dune.|She wants to run for the tents.|They dig a tunnel under the sand.|Malik is cautious and protects his friend.|Hana trusts her guesses too quickly.|Malik is afraid to make any choice.
  Lightning split the old oak, and it fell across the road in front of the bus. The driver, Mr. Osei, told everyone to stay in their seats. Kira, the oldest student, started a song to calm the younger children. Sparks danced on a fallen wire that lay across the hood of the bus. Mr. Osei called for help on his radio while Kira kept the singing going.|Mr. Osei|Kira|Both stayed on the bus.|Both tried to keep the children safe.|Both called for help on the radio.|Both started a song.|Mr. Osei gives orders, while Kira cheers the children up.|Kira started a song to calm the younger children.|Mr. Osei calls for help, while Kira keeps everyone calm.|Mr. Osei called for help on his radio.|Mr. Osei and Kira both stayed on the bus while they waited for help to come.|Sparks danced on a fallen wire that lay across the hood of the bus.|He tells everyone to stay seated and radios for help.|She starts a song to calm the little ones.|They climb out and walk home.|Mr. Osei takes charge in an emergency.|Kira cares for younger children.|Mr. Osei wants the children to be scared.
  The rope bridge swung in the wind, and Teo stopped halfway. Far below the swaying bridge, the river foamed white over the rocks. His sister Lina, already across, did not shout at him to hurry. She knelt and talked to him about the waterfall they would see, one plank at a time. Teo stepped forward, then again, until he reached her.|Lina|Teo|Both had to cross the rope bridge.|Both reached the far side in the end.|Both stopped halfway across.|Both shouted at each other.|Lina crosses easily, but Teo is frozen with fear.|Teo stopped halfway.|Lina is patient, while Teo needs help.|She knelt and talked to him, one plank at a time.|In the end, both Lina and Teo stood together on the far side of the bridge.|Far below the swaying bridge, the river foamed white over the rocks.|She talks him across, one plank at a time.|He stops halfway, then steps forward slowly.|They turn back to find another way.|Lina is patient and kind.|Teo is brave enough to keep going while afraid.|Lina is too scared to help her brother.
  The fishing boat's engine died at sea, and the radio crackled with static. Captain Rosa checked the fuel and found a leak. Her son Ben, on his first trip, wanted to call for help over and over. Gray waves slapped against the hull as the boat drifted in the swell. Rosa handed Ben a roll of tape: "Hold this tight while I fix it." Soon the engine coughed back to life.|Captain Rosa|Ben|Both were on the boat when the engine died.|Both wanted to get home safely.|Both had been at sea many times.|Both fixed the leak together alone.|Rosa finds the problem, while Ben wants to call for help.|Ben wanted to call for help over and over.|Rosa gives Ben a job to do.|Rosa handed Ben a roll of tape.|The engine died with both Captain Rosa and her son Ben on board.|Gray waves slapped against the hull as the boat drifted in the swell.|She finds the leak and fixes it.|He wants to call for help again and again.|They abandon the boat.|Rosa is skilled and calm, and she includes others.|Ben is new to danger and looks for help outside.|Rosa does not know how boats work.
  The cave's entrance collapsed behind them, and Femi and Zara were sealed in the dark. Zara felt along the walls and found a cool draft from a crack. Femi sat down and refused to move. Cold water dripped steadily from the low ceiling of the cave. "Follow the air," said Zara, taking his hand. Hours later, they crawled out into the moonlight.|Zara|Femi|Both were trapped in the dark cave.|Both crawled out in the end.|Both refused to move.|Both found the draft together.|Zara searches for a way out, but Femi gives up at first.|Femi sat down and refused to move.|Zara leads, and Femi follows.|"Follow the air," said Zara, taking his hand.|Hours later, both Zara and Femi crawled out of the cave into the moonlight.|Cold water dripped steadily from the low ceiling of the cave.|She feels along the walls and follows the air.|He sits down and refuses to move.|They shout until someone hears them.|Zara stays hopeful and thinks clearly.|Femi loses hope but accepts help.|Zara is sure they will never get out.
  The heat wave had lasted a week, and the town's water had run low. Mr. Park filled every bucket he owned and stacked them in his garage. His daughter June took buckets to the old people on their street. Dust blew along the empty road, and the sun beat down on the roofs. When Mr. Park saw June's empty wagon, he quietly filled it again.|June|Mr. Park|Both lived through the heat wave.|Both collected water.|Both kept all the water for themselves.|Both stacked buckets in the garage.|June shares water, but Mr. Park stores it.|Mr. Park filled every bucket and stacked them in his garage.|Mr. Park changes after seeing June's kindness.|When Mr. Park saw June's empty wagon, he quietly filled it again.|Both June and her father worked hard through the long week of the heat wave.|Dust blew along the empty road, and the sun beat down on the roofs.|She takes buckets to the old people on her street.|He fills and stores every bucket he owns.|They leave town for a cooler place.|June is generous and thinks of others.|Mr. Park is worried at first, but he can learn to share.|June wants to sell the water.
`);
const twoText = (r: readonly string[]) => field(r, 0);
const aName = (r: readonly string[]) => field(r, 1);
const bName = (r: readonly string[]) => field(r, 2);
const alikeItems: ChoiceItem[] = pairsOfCharacters.flatMap((r) =>
  [3, 4].map((k): ChoiceItem => [`${twoText(r)}\n\nHow are ${aName(r)} and ${bName(r)} alike?`, field(r, k), [field(r, 5), field(r, 6)]]),
);
const showsDifferenceItems: ChoiceItem[] = pairsOfCharacters.flatMap((r) =>
  [7, 9].map(
    (k): ChoiceItem => [
      `${twoText(r)}\n\nWhich detail shows this difference? *${field(r, k)}*`,
      field(r, k + 1),
      [field(r, 11), field(r, 12)],
    ],
  ),
);
const responseItems: ChoiceItem[] = pairsOfCharacters.flatMap((r) =>
  [0, 1].map((who): ChoiceItem => {
    const name = who === 0 ? aName(r) : bName(r);
    return [`${twoText(r)}\n\nHow does ${name} respond to the challenge?`, field(r, 13 + who), [field(r, 14 - who), field(r, 15)]];
  }),
);
const revealsItems: ChoiceItem[] = pairsOfCharacters.flatMap((r) =>
  [0, 1].map((who): ChoiceItem => {
    const name = who === 0 ? aName(r) : bName(r);
    return [`${twoText(r)}\n\nWhat does ${name}'s response show about them?`, field(r, 16 + who), [field(r, 17 - who), field(r, 18)]];
  }),
);

const comparingCharacters = topic("reading", {
  id: "comparing-two-characters",
  title: ["Comparing Two Characters", "比较两个人物"],
  summary: [
    "Two characters in one story can face the same problem in different ways.",
    "同一个故事里的两个人物可以用不同的方式面对同一个问题。",
  ],
  after: ["what-characters-say-and-think", "compare-and-contrast-in-texts"],
  points: [
    choose(
      "how-two-characters-are-alike",
      ["How Two Characters Are Alike", "两个人物的相同之处"],
      [
        "When two characters face the same problem, start by finding what is true of **both**: where they are, what has happened to them, what they want. Check each statement against the story for each character. A statement that is true of only one of them is a difference, not a likeness.",
        "两个人物面对同一个问题时，先找出对**两个人**都成立的事：他们在哪里、遇到了什么事、想要什么。要用故事逐一检验每个说法对每个人物是否成立。只对其中一人成立的说法是不同之处，而不是相同之处。",
      ],
      ["How are the two characters alike?", "这两个人物有什么相同之处？"],
      alikeItems,
      (right) => [`The story shows this of both characters: **${right}**`, `故事表明这一点对两个人物都成立：**${right}**`],
      [
        ["*{wrong}* is true of only one of them.", "*{wrong}* 只对其中一人成立。"],
        ["*{wrong}* fits only one character; check the story for each.", "*{wrong}* 只符合一个人物；要逐一对照故事检查。"],
      ],
    ),
    choose(
      "how-they-differ-and-the-detail-that-shows-it",
      ["How They Differ, and the Detail That Shows It", "他们的不同之处，以及表明它的细节"],
      [
        "Two characters often meet one problem in **different ways**, and the story shows the difference through a detail: what each one does or says. To support a difference, choose the detail that shows the two characters acting differently. A detail that both share shows a likeness; a detail about the place shows neither of them.",
        "两个人物常常用**不同的方式**面对同一个问题，故事通过细节表现这种不同：每个人做了什么或说了什么。要支持一个不同之处，就选出表明两个人物做法不同的细节。两人共有的细节表明的是相同之处；描写环境的细节则与两人都无关。",
      ],
      ["Which detail shows this difference?", "哪个细节表明了这个不同之处？"],
      showsDifferenceItems,
      (right) => [`The detail **${right}** shows the two characters acting differently.`, `细节 **${right}** 表明两个人物的做法不同。`],
      [
        ["*{wrong}* is something both characters share, so it shows a likeness.", "*{wrong}* 是两个人物共有的，所以表明的是相同之处。"],
        ["*{wrong}* describes the setting, not either character.", "*{wrong}* 描写的是环境，而不是哪个人物。"],
      ],
    ),
  ],
});

const facingChallenges = topic("reading", {
  id: "how-characters-face-challenges",
  title: ["How Characters Face Challenges", "人物如何面对挑战"],
  summary: [
    "How a character responds to a challenge shows who they are and often changes them.",
    "人物如何应对挑战，表现出他们是什么样的人，也常常改变他们。",
  ],
  after: ["why-characters-act"],
  points: [
    choose(
      "how-a-character-responds",
      ["How a Character Responds", "人物如何应对"],
      [
        "A **challenge** is a problem a character must face: a storm, a fall, being lost. A character's **response** is what they do and say about it. Read for the actions: who makes a plan, who gives up, who helps someone else. Two characters facing one challenge can respond in very different ways.",
        "**挑战**是人物必须面对的问题：风暴、跌倒、迷路。人物的**应对**就是他们对此所做所说的。要读出人物的行动：谁制订了计划、谁放弃了、谁帮助了别人。面对同一个挑战的两个人物，应对方式可以很不相同。",
      ],
      ["How does the character respond to the challenge?", "这个人物是怎样应对挑战的？"],
      responseItems,
      (right) => [`The story shows this response: **${right}**`, `故事表现了这样的应对：**${right}**`],
      [
        ["*{wrong}* is what the other character does.", "*{wrong}* 是另一个人物的做法。"],
        ["*{wrong}* never happens in the story.", "*{wrong}* 在故事中根本没有发生。"],
      ],
    ),
    choose(
      "what-the-response-shows",
      ["What the Response Shows", "应对表现了什么"],
      [
        "A response shows **character**. A girl who counts the supplies while her hands shake is brave even when afraid; a boy who sits down and refuses to move has lost hope, at least for a while. Ask what kind of person would act this way, and check that the story gives a reason to think so.",
        "应对方式表现**性格**。双手发抖却仍然清点物资的女孩，即使害怕也很勇敢；坐下来拒绝移动的男孩，至少一时失去了希望。问问什么样的人会这样做，并检查故事是否给出了这样想的理由。",
      ],
      ["What does the character's response show about them?", "人物的应对表现了他们的什么特点？"],
      revealsItems,
      (right) => [`The character's actions show this: **${right}**`, `人物的行动表现了这一点：**${right}**`],
      [
        ["*{wrong}* describes the other character, not this one.", "*{wrong}* 描述的是另一个人物，不是这个。"],
        ["*{wrong}* is not supported by anything the character does.", "*{wrong}* 在人物的行为中找不到依据。"],
      ],
    ),
  ],
});

// How chapters build a story: four chapter summaries of each story, in order.
const chapterStories = rows(`
  Pia moves to a lighthouse island with her father, who has just become its keeper.|A storm knocks out the lighthouse lamp while her father is away on the mainland.|Pia climbs the tower and lights an old oil lantern so the ships can see the rocks.|The ships pass safely, and the islanders, who had ignored Pia, invite her to the harvest feast.
  Ken joins a soccer team where no one passes him the ball.|Ken's best friend on the team moves away, and Ken thinks of quitting.|In the final game, Ken passes instead of shooting, and the team scores.|The team chooses Ken as captain for the next season.
  A family of foxes makes its home under a farmer's barn.|The farmer's dog discovers the den and barks every night.|The farmer's daughter sees the cubs and begs her father to let them stay.|The farmer builds a fence so the dog and the foxes can live side by side.
  Grace finds an old key in her grandmother's attic.|She learns that the key opens a box that was lost when her grandmother was a child.|Grace finds the box buried under the garden's apple tree.|Inside are letters that tell Grandma the story of her own mother.
  Amir signs up for the school play, though he is shy.|On opening night, the lead actor falls ill.|Amir, who knows every line, steps onto the stage.|The audience cheers, and Amir decides to try out for the next play.
  A small village relies on a well that has always had water.|In a dry summer, the well begins to run dry.|The children discover an underground spring in a cave above the village.|The villagers build a pipe from the spring, and the village has water again.
  Lucy is the only girl in the robotics club.|The club's robot breaks the day before the contest.|Lucy finds the loose wire and fixes it just in time.|The team wins second place, and more girls join the club the next year.
  Tom finds a lost puppy on his way home from school.|His parents say he cannot keep it unless he finds its owner.|Tom puts up posters, and an old woman calls to say the puppy is hers.|She asks Tom to walk the puppy every day, and he gladly agrees.
`);
const jobs = ["introduces the story", "complicates the problem", "turns the story", "resolves the story"] as const;
const jobLabels: Record<string, Label> = {
  "introduces the story": {
    zh: "引出故事",
    why: ["It sets up the characters and their world before the trouble begins.", "它在麻烦开始之前介绍人物和他们的世界。"],
    not: ["An opening chapter sets up the characters; this chapter does more than that.", "开篇章节介绍人物；这一章做的不只是这些。"],
  },
  "complicates the problem": {
    zh: "使问题复杂化",
    why: ["It brings in trouble or makes the trouble worse.", "它引入麻烦或让麻烦变得更糟。"],
    not: ["This chapter does not bring in or worsen the trouble.", "这一章并没有引入或加重麻烦。"],
  },
  "turns the story": {
    zh: "扭转故事",
    why: [
      "It is the turning point, where a character acts and the problem starts to be solved.",
      "这是转折点，人物采取行动，问题开始得到解决。",
    ],
    not: [
      "The turning point is where a character acts to solve the problem; this is not it.",
      "转折点是人物采取行动解决问题的地方；这一章不是。",
    ],
  },
  "resolves the story": {
    zh: "解决故事",
    why: ["It shows how things end up once the problem is solved.", "它表明问题解决后事情的结局。"],
    not: ["The last chapter shows how things end; this chapter comes before that.", "最后一章表明事情的结局；这一章在它之前。"],
  },
};
const jobLines = chapterStories.flatMap((r) => [0, 1, 2, 3].map((k) => `${field(r, k)}|${jobs[k]}`)).join("\n");
const shuffles = [
  [2, 0, 3, 1],
  [3, 1, 0, 2],
  [1, 3, 2, 0],
  [0, 2, 1, 3],
] as const;
const letters = ["A", "B", "C", "D"] as const;
const orderItems: ChoiceItem[] = chapterStories.flatMap((r, p) =>
  shuffles.map((shown, s): ChoiceItem => {
    // shown[i] is the chapter printed under letter i; the right order lists the letters of chapters 0..3.
    const letterOf = (chapter: number) => letters[shown.indexOf(chapter as 0 | 1 | 2 | 3)] ?? "";
    const order = (chs: readonly number[]) => chs.map(letterOf).join(", ");
    const text = shown.map((ch, i) => `${letters[i]}. ${field(r, ch)}`).join("\n\n");
    const wrongs = (p + s) % 2 === 0 ? [order([0, 2, 1, 3]), order([1, 0, 2, 3])] : [order([0, 1, 3, 2]), order([0, 2, 1, 3])];
    return [text, order([0, 1, 2, 3]), wrongs];
  }),
);

const chaptersBuildAStory = topic("reading", {
  id: "how-chapters-build-a-story",
  title: ["How Chapters Build a Story", "章节如何构成故事"],
  summary: [
    "Each chapter of a longer story does a job: it introduces, complicates, turns or resolves.",
    "较长故事的每一章都有自己的作用：引出、使复杂、扭转或解决。",
  ],
  after: ["parts-of-stories-and-poems", "summarizing-a-story"],
  points: [
    label(
      "the-job-of-a-chapter",
      ["The Job of a Chapter", "一章的作用"],
      [
        "In a longer story, each chapter does a **job**. An early chapter **introduces** the characters and their world. Middle chapters **complicate** the problem, bringing in trouble or making it worse. One chapter **turns** the story: a character acts, and the problem starts to be solved. The last chapter **resolves** it, showing how things end.",
        "在较长的故事里，每一章都有自己的**作用**。前面的章节**引出**人物和他们的世界。中间的章节**使问题复杂化**，引入麻烦或让麻烦更糟。有一章**扭转**故事：人物采取行动，问题开始得到解决。最后一章**解决**问题，表明事情的结局。",
      ],
      ["What job does this chapter do in its story?", "这一章在故事中起什么作用？"],
      jobLines,
      jobLabels,
    ),
    choose(
      "putting-chapters-in-order",
      ["Putting Chapters in Order", "给章节排序"],
      [
        "To put chapter summaries in order, find each one's **job**. The chapter that sets up the characters comes first. The one that brings in trouble comes next. The turning point, where someone acts, follows the trouble it answers. The ending, which shows how things turned out, comes last.",
        "要给章节概要排序，就先找出每一章的**作用**。介绍人物的那一章排在最前。引入麻烦的那一章接着出现。转折点，也就是有人采取行动的地方，紧跟在它所回应的麻烦之后。表明结果的结局排在最后。",
      ],
      ["In what order do these chapters come?", "这些章节的顺序是怎样的？"],
      orderItems,
      (right) => [
        `The order **${right}** goes from the chapter that introduces, to the one that complicates, to the turn, to the ending.`,
        `顺序 **${right}** 依次是引出、使复杂、扭转和结局。`,
      ],
      [
        ["*{wrong}* puts a chapter before the one it depends on.", "*{wrong}* 把一章放在了它所依赖的那一章之前。"],
        ["*{wrong}* mixes up the jobs of two chapters.", "*{wrong}* 把两章的作用弄混了。"],
      ],
    ),
  ],
});

// Reading diaries and letters from the past.
const lifeLines = `
  "We read our lessons by the light of a tallow candle, which smokes and smells of mutton fat." (diary, 1820)|Homes had no electric light, so people read by candlelight.|Candles were saved for parties, so on most nights people read nothing.|Children were not allowed to read at night, so lessons were done at noon.
  "Father walked twelve miles to town to post this letter and buy salt." (letter, 1850)|Many people lived far from towns and walked to reach them.|The post office sent a wagon to every farm each morning to pick up mail.|Salt was so cheap and common that shops simply gave it away for free.
  "Mother says I may go to school only in winter, when there is no work on the farm." (diary, 1870)|Farm children often worked instead of going to school.|School was held only in the summer months, when the weather was warm.|Children went to school on every day of the year, even on holidays.
  "The wagon wheel broke again today, and we lost a whole day mending it." (diary, 1848)|Travel by wagon was slow and full of trouble.|Wagons were fast and easy to fix, so families crossed the land in days.|The family rode a train, so the trip across the country took one day.
  "We drew water from the well and carried it in buckets to wash the clothes." (diary, 1890)|Homes had no running water, so water was carried by hand.|Every house had a tap in the kitchen and a bathtub with hot water.|Clothes were washed in electric machines kept down in the cellar.
  "Your letter took three months to reach me across the sea." (letter, 1790)|Letters traveled slowly, by ship.|Letters were sent through wires and reached the other side in minutes.|There was no way at all to send a letter across the sea to anyone.
  "Today the doctor came by horse, for little Anna has a fever." (diary, 1860)|Doctors visited patients at home and traveled on horseback.|Doctors worked only in big city hospitals and never visited homes.|People never called a doctor, however ill they were, in those days.
  "We have had no fresh fruit since autumn, only dried apples and potatoes from the cellar." (diary, 1880)|In winter, people ate food stored from the harvest.|Fresh fruit was shipped from faraway lands to every town all winter.|Potatoes were a rare treat that families ate only on holidays.
  "At the mill I tend two looms from six in the morning until seven at night." (letter, 1845)|Factory workers, even young ones, worked very long days.|Mill workers had short days with long breaks and went home by noon.|The looms ran by themselves, so mills hardly needed any workers.
  "The telegraph boy brought word that Uncle Ed's ship had docked safely." (diary, 1875)|News could be sent quickly by telegraph and delivered by hand.|People heard news only from letters, which took months to arrive.|The news came by telephone, straight into every home in the town.
  "We are saving every scrap of tin and rubber for the war." (diary, 1943)|During the war, people saved materials to help the war effort.|Tin and rubber were so common that families threw them away freely.|People were paid well to throw old tin and rubber into the river.
  "Bread is rationed now, and we queue for an hour at the baker's." (diary, 1917)|Food was scarce in wartime, and people waited in long lines for it.|Bakeries gave bread away for free, and there was always plenty.|People baked so much bread that most of it went to waste each day.
  "Our teacher rings a hand bell, and we all sit at our slates." (diary, 1885)|Students wrote on slates, and school was called with a bell.|Students wrote their lessons on computers at desks in the classroom.|Students had no teacher and taught themselves alone at home.
  "Tonight the whole family gathered round the wireless to hear the King speak." (diary, 1939)|Families listened to news and speeches together on the radio.|Families watched the King's speech together on a television set.|Only the King himself owned a radio, so few people heard him.
  "I copied the whole page of sums by hand, for there is no other way to keep them." (diary, 1810)|There were no machines for copying, so things were copied by hand.|Every classroom had a photocopier, so copying by hand was a choice.|Students never needed to keep their work, so they threw it away.
  "We sailed for forty days, and many on board fell ill from bad water." (letter, 1850)|Long sea voyages were slow and could make people sick.|Ships crossed the ocean in a few hours, and no one ever fell ill.|The water on ships was always fresh and clean for the whole trip.
  "The new streetlamps are lit by a man with a long pole every evening." (diary, 1830)|Street lamps burned gas or oil and were lit by hand.|Street lamps were switched on all at once by a computer in the city.|Streets had no lamps of any kind, so the town was dark every night.
  "Grandmother spun the wool, and I knitted my own stockings for winter." (diary, 1790)|Families made many of their own clothes by hand.|Families bought every piece of their clothing from big city stores.|Children went barefoot all winter because stockings were not worn.
  "The ice man came with his cart to fill our icebox for the week." (diary, 1910)|Before electric fridges, people kept food cold with blocks of ice.|Every kitchen had an electric fridge that kept food cold all week.|People never needed to keep food cold, because it never went bad.
  "Mother cooked our supper over the open fire in the hearth." (diary, 1800)|Many homes cooked over an open fire.|Every home had an electric stove with an oven in the kitchen.|Meals were always bought ready-made from shops in the village.
  "I paid a whole penny to send this letter, which is dear." (letter, 1841)|Sending a letter cost money that seemed a lot to many people.|Letters were carried free of charge for anyone who wanted to write.|Only kings and queens were allowed to send letters in those days.
  "We walked two hours to the schoolhouse, which has only one room for all ages." (diary, 1880)|Many country schools had one room for children of all ages.|Every school had a separate room and a separate teacher for each grade.|Children rode yellow buses to big schools in the nearest city.
  "The doctor says the new vaccine will keep my brother from smallpox." (diary, 1805)|Vaccines were new and gave hope against deadly diseases.|Smallpox was a mild and harmless illness that no one worried about.|Vaccines had already been used for thousands of years by then.
  "We watched the first motorcar in our village roar past, frightening the horses." (diary, 1905)|Cars were new and rare, and most people still used horses.|Cars filled every street of the village, and horses were rare.|Horses had already disappeared from the roads by that time.
  "We sent a telegram, for a letter would be too slow." (diary, 1880)|Telegrams were the fastest way to send urgent news.|Telegrams were slower than letters, so they were used only for fun.|People sent urgent news by email, which reached them at once.
  "Mother sewed our names into our coats, for we leave for the countryside tomorrow, away from the bombs." (diary, 1939)|In the war, many city children were sent to the countryside for safety.|City children went to the countryside on holiday every single year.|The bombs fell only on the countryside, so the cities were safe.
  "We gathered at the general store to hear the news read from the paper." (diary, 1865)|People gathered to share news from newspapers.|Everyone read the latest news on a phone or a computer at home.|Newspapers had not been invented yet, so no one heard any news.
  "My hands are blistered from picking cotton since sunrise." (letter, 1855)|Picking cotton was hard work done by hand.|Cotton was picked by large machines, so the work was quick and easy.|Cotton was picked for only a few minutes each day, before breakfast.
  "Father lit the lamp with oil we bought from the peddler." (diary, 1860)|People lit their homes with oil lamps and bought goods from traveling sellers.|Lamps were lit by switches on the wall, and no one used oil at all.|Peddlers sold only toys and sweets, never anything a family needed.
  "The whole town turned out to see the train arrive for the first time." (diary, 1869)|Railways were new, and a train's arrival was a big event.|Trains had run through the town for many years, so no one came to look.|No one in the town cared about trains, so the station stayed empty.
`;
const feelingLines = `
  "I count the days until spring, when Mother says we will see Grandmother again. The house is so quiet without her laughter."|She misses her grandmother: she counts the days and calls the house quiet without her.|She is angry at her grandmother: she counts the days and calls the house quiet without her.|She is glad her grandmother left: she counts the days and calls the house quiet without her.
  "When the ship's whistle blew, I waved until Papa was only a speck on the deck. I could not eat my supper."|He is sad to see his father leave: he waves until Papa is a speck and cannot eat.|He is excited to travel: he waves until Papa is a speck and cannot eat.|He is bored by the trip: he waves until Papa is a speck and cannot eat.
  "At last a letter from you! I read it three times and then slept with it under my pillow."|She is overjoyed to hear from her friend: she reads the letter three times and keeps it close.|She is worried by the letter: she reads the letter three times and keeps it close.|She is annoyed by the letter: she reads the letter three times and keeps it close.
  "Every creak of the stairs makes me jump. Father has not come home, and the storm is getting worse."|He is afraid for his father: he jumps at every creak as the storm grows.|He is excited about the storm: he jumps at every creak as the storm grows.|He is calm: he jumps at every creak as the storm grows.
  "We have walked for nine days, and my feet are raw. But tonight I saw the mountains, and my heart lifted."|She is worn out but hopeful: her feet are raw, yet her heart lifts at the mountains.|She is angry at the mountains for blocking the way: her feet are raw, yet her heart lifts at the mountains.|She is comfortable: her feet are raw, yet her heart lifts at the mountains.
  "I have read Mother's letter so many times that the paper is soft as cloth. I wish I could hear her voice."|He is homesick: he rereads the letter until it is soft and wishes for her voice.|He is tired of his mother's letters: he rereads the letter until it is soft and wishes for her voice.|He is happy to be far from home: he rereads the letter until it is soft and wishes for her voice.
  "The teacher praised my essay in front of the whole class. I could hardly keep from grinning all afternoon."|She is proud: she can hardly keep from grinning after the teacher's praise.|She is embarrassed: she can hardly keep from grinning after the teacher's praise.|She is upset: she can hardly keep from grinning after the teacher's praise.
  "The harvest failed again. Father sat by the fire all night and did not say a word."|The family is worried: Father sits silently all night after the harvest fails.|The family is happy: Father sits silently all night after the harvest fails.|Father is excited: Father sits silently all night after the harvest fails.
  "Today I start at the mill. I am to have my own wages! But the noise of the looms frightens me."|She is both excited and frightened: she is proud of her wages but scared of the looms.|She is only bored: she is proud of her wages but scared of the looms.|She is angry about having to earn wages: she is proud of her wages but scared of the looms.
  "Little Sam is better at last. The fever broke this morning, and he asked for bread. I wept for joy."|She is relieved and happy: she weeps for joy when the fever breaks.|She is sad: she weeps for joy when the fever breaks.|She is annoyed that Sam wants bread: she weeps for joy when the fever breaks.
  "They say we must leave the farm by Friday. I walked through every field to say goodbye."|He is sad to leave his home: he walks through every field to say goodbye.|He is glad to leave the farm: he walks through every field to say goodbye.|He is calm: he walks through every field to say goodbye.
  "The war is over! The church bells have rung all day, and strangers are hugging in the streets."|She is full of joy: the bells ring and strangers hug in the streets.|She is fearful: the bells ring and strangers hug in the streets.|She is bored by the bells ringing all day: the bells ring and strangers hug in the streets.
  "I lost the race by a hand's width. I keep thinking of that last step."|He is disappointed: he keeps thinking about the step that cost him the race.|He is proud: he keeps thinking about the step that cost him the race.|He does not care about the race at all: he keeps thinking about the step that cost him the race.
  "The new teacher is kind, and I understood every sum today. I did not dread school this morning."|She is starting to enjoy school: she understood the sums and did not dread going.|She still hates school: she understood the sums and did not dread going.|She is angry at the new teacher for being kind: she understood the sums and did not dread going.
  "Grandfather gave me his pocket watch. I keep it wound and polish it every night."|He treasures his grandfather's gift: he winds and polishes it every night.|He is careless with the watch: he winds and polishes it every night.|He does not like the watch: he winds and polishes it every night.
  "The candle is almost out and I have no more. I am writing fast, for I am afraid of the dark."|She is afraid: she writes quickly before the candle goes out.|She is sleepy: she writes quickly before the candle goes out.|She is cheerful: she writes quickly before the candle goes out.
  "Our cow, Daisy, was sold today to pay the rent. I fed her the last of the apples."|He is sad to lose the cow: he gives her the last of the apples.|He is happy that the cow is gone: he gives her the last of the apples.|He is angry at Daisy for eating the apples: he gives her the last of the apples.
  "The schoolhouse burned down in the night. I keep thinking of the books we lost."|She is grieving for the school: she keeps thinking of the lost books.|She is glad there will be no school: she keeps thinking of the lost books.|She is calm: she keeps thinking of the lost books.
  "We finally reached the new land. I ran across the field, laughing, and fell in the grass."|He is joyful: he runs across the field laughing.|He is frightened of the new land: he runs across the field laughing.|He is tired: he runs across the field laughing.
  "Mama said no to the fair again. I stayed in my room and would not come down for supper."|She is upset with her mother: she stays in her room and skips supper.|She is happy to stay home from the fair: she stays in her room and skips supper.|She is hungry: she stays in her room and skips supper.
  "My brother's letter came from the front. He says he is well, but his hand is shaky."|She is relieved but worried: he says he is well, but his writing is shaky.|She is angry at her brother for writing: he says he is well, but his writing is shaky.|She is sure her brother is perfectly fine: he says he is well, but his writing is shaky.
  "I helped the doctor all night, boiling water and tearing bandages. I am tired, but glad."|He is tired but satisfied: he worked all night and is glad he helped.|He is cross at the doctor for keeping him up: he worked all night and is glad he helped.|He is bored: he worked all night and is glad he helped.
  "The storm tore off our roof. Mother hugged us and said, 'We are alive, and that is enough.'"|The family is shaken but grateful: the roof is gone, but Mother is thankful they are alive.|The family is cheerful: the roof is gone, but Mother is thankful they are alive.|The family is angry with each other about the roof: the roof is gone, but Mother is thankful they are alive.
  "Today I saw my name printed in the town newspaper for winning the spelling contest!"|She is proud and excited: her name is printed for winning.|She is embarrassed: her name is printed for winning.|She is sad: her name is printed for winning.
  "Uncle has not written in six months. Every time the mailman passes, I run to the window."|He is anxious for news: he runs to the window whenever the mailman passes.|He is angry at his uncle: he runs to the window whenever the mailman passes.|He is not interested in the mail at all: he runs to the window whenever the mailman passes.
  "The new baby came today. She is tiny and red and shouts like a crow. I love her already."|She loves her new sister: she says she loves her already.|She is jealous of the baby: she says she loves her already.|She is frightened of the loud baby: she says she loves her already.
  "I broke Mother's blue plate and hid the pieces. I cannot sleep."|He feels guilty: he hid the pieces and cannot sleep.|He is proud of hiding the pieces: he hid the pieces and cannot sleep.|He is calm: he hid the pieces and cannot sleep.
  "The ship is so crowded we sleep in shifts. Still, each morning I climb up to look for land."|She is uncomfortable but hopeful: the ship is crowded, but she looks for land every morning.|She is comfortable on the roomy ship: the ship is crowded, but she looks for land every morning.|She has given up looking for land: the ship is crowded, but she looks for land every morning.
  "We sang in the town square to raise money for the hospital. My voice shook, but we raised ten dollars."|He was nervous but pleased: his voice shook, yet they raised money.|He was calm: his voice shook, yet they raised money.|He was angry: his voice shook, yet they raised money.
  "The river froze, and the whole village skated by torchlight. I have never been so happy."|She is delighted: she has never been so happy.|She is scared of the ice: she has never been so happy.|She is cross: she has never been so happy.
`;

const diariesAndLetters = topic("reading", {
  id: "reading-diaries-and-letters",
  title: ["Reading Diaries and Letters", "阅读日记和书信"],
  summary: [
    "A diary or a letter from the past shows what one person saw and felt, and its details tell how life was then.",
    "过去的日记或书信展现一个人的所见所感，其中的细节讲述了当时的生活。",
  ],
  after: ["reading-a-letter", "firsthand-and-secondhand-accounts"],
  points: [
    choose(
      "what-a-detail-tells-about-life-then",
      ["What a Detail Tells About Life Then", "细节讲述了当时的生活"],
      [
        "A diary or letter from the past is a **primary record**: it was written by someone who lived then. Its small details tell how life was: a candle to read by means there was no electric light; a letter that took three months means mail went by ship. Ask what the detail shows that is different from life today.",
        "过去的日记或书信是**原始记录**：它是由当时生活的人写的。其中的小细节讲述了当时的生活：靠蜡烛读书说明没有电灯；一封信走了三个月说明邮件是靠船运送的。问问这个细节表明了哪些与今天不同的生活。",
      ],
      ["What does this detail tell about life at the time?", "这个细节讲述了当时怎样的生活？"],
      lifeLines,
      (right) => [`The detail shows how life was then: **${right}**`, `这个细节表明了当时的生活：**${right}**`],
      [
        ["*{wrong}* describes life today, not life at the time of the writing.", "*{wrong}* 描述的是今天的生活，而不是写作时的生活。"],
        [
          "*{wrong}* does not follow from the detail; the writer says nothing like it.",
          "*{wrong}* 不能从这个细节推出；作者没有说过这样的话。",
        ],
      ],
    ),
    choose(
      "what-the-writer-felt-and-how-we-know",
      ["What the Writer Felt, and How We Know", "作者的感受，以及我们如何知道"],
      [
        "A diary is private, so its writer often shows feelings openly, but not always by naming them. Look for **what the writer does** (rereads a letter, cannot eat, walks through every field) and **how they describe things**. A good answer names the feeling and points to the words that show it.",
        "日记是私人的，所以作者常常坦率地表露感受，但并不总是直接说出来。要留意**作者做了什么**（反复读信、吃不下饭、走遍每一块田）以及**他们怎样描写事物**。好的回答既说出感受，又指出表现这种感受的词句。",
      ],
      ["What does the writer feel, and how do we know?", "作者有什么感受？我们怎么知道？"],
      feelingLines,
      (right) => [`The writer's words show it: ${right}`, `作者的话表明了这一点：${right}`],
      [
        ["*{wrong}* names a feeling the writer's words do not show.", "*{wrong}* 说出的感受在作者的话中找不到。"],
        ["*{wrong}* says the opposite of what the writer shows.", "*{wrong}* 与作者表现的正好相反。"],
      ],
    ),
  ],
});

// The speaker of a poem: poem|speaker|wrong speaker|wrong speaker|how the view shapes it|wrong|wrong
const poems = rows(`
  For a hundred years I've held my ground, / my roots in rock, my branches crowned / with nests each spring. The axes ring / below me now. I hear them sing.|an old tree|a woodcutter|a bird in a nest|Because the tree has stood so long, the axes are a threat to everything it has held.|Because the tree enjoys the ringing of the axes, the poem sounds cheerful and calm.|Because the tree is young and small, the poem is really about growing up tall.
  The lighthouse lamp is mine to keep. / I climb these stairs while sailors sleep, / and every night my light must turn / so none will wreck, and none will burn.|a lighthouse keeper|a sailor asleep on a ship|the lighthouse lamp itself|Because the keeper feels responsible, the night is described as a duty to keep sailors safe.|Because the keeper is away on holiday, the night is described as long and restful.|Because the keeper is a sailor, the poem describes the open sea far from any land.
  My legs are short, the grass is high, / the boots go thundering by. / I wait beneath a fallen leaf / until the giants pass. Relief!|a tiny insect|a giant|a farmer in boots|Because the speaker is so small, ordinary people seem like thundering giants.|Because the speaker is very tall, the high grass seems short and easy to walk through.|Because the speaker is a giant, the boots of the people seem tiny and quiet.
  I've sailed the seas for sixty years, / through storms that brought the crew to tears. / Now in my chair beside the fire, / I hear the waves, and they don't tire.|an old sailor|a young deckhand on his first trip|the sea itself|Because the sailor is old and at home, the sea is remembered with longing.|Because the sailor is young and new, the sea is described as strange and frightening.|Because the sailor hates the sea, the poem is glad to be safely ashore at last.
  The new girl sits alone at lunch. / I want to wave. I have a hunch / she'd like a friend. I'm scared, I guess. / Tomorrow, though. Tomorrow, yes.|a shy student|the new girl|a teacher on lunch duty|Because the speaker is shy, an easy wave feels like a big, scary step.|Because the speaker is the teacher on duty, the lunchroom is described as noisy.|Because the speaker is the new girl, she describes how lonely her first day is.
  I am the river. I was here / before the town, before the pier. / They built their bridges, dams and walls; / I'm patient still. The ocean calls.|a river|a builder of bridges|a fisherman on the pier|Because the river is ancient, the town's walls seem small and short-lived.|Because the river is young, the old town and its walls seem far older than it is.|Because the river is a builder, the poem is proud of the dams and walls it made.
  My grandson thinks my hands are slow, / but these same hands taught him to sew, / to bait a hook, to plant a seed. / They're slow. They're also all he'll need.|a grandparent|the grandson|a sewing teacher|Because the speaker is old, slow hands are shown to be full of skill and love.|Because the speaker is young, the hands are described as quick, clumsy and careless.|Because the speaker is the grandson, the poem complains about being taught to sew.
  Dust on the shelf, a crack in my spine, / no one has opened me since 1909. / Somewhere a reader I've never met / might find me yet. Might find me yet.|an old book|a librarian|a reader|Because the book has waited so long, the poem is full of patient hope.|Because the book has just been printed, the poem is excited about the busy print shop.|Because the speaker is a reader, the poem is about choosing a book from the shelf.
  The fence was tall, the night was black, / I squeezed beneath and won't go back. / The farmer calls me. I don't care. / There's clover here, and open air.|a runaway calf|the farmer|a fence post|Because the calf has escaped, the open field seems free and delicious.|Because the speaker is the farmer, the open field seems like a place of hard work.|Because the speaker is the fence, the poem is proud of standing still all night.
  I saw the comet when I was nine. / My father said, "This sky is mine / and yours, and all of ours to share." / I'm ninety now. I'm still up there.|an old woman remembering|her father|the comet|Because she remembers from old age, one childhood night still feels close and precious.|Because the speaker is only nine, the comet is described as frightening and strange.|Because the speaker is the comet, the poem is about flying through cold space.
  They say I'm just a little seed, / too small to matter, just a weed. / But wait until the rains arrive. / I'll crack this stone. I'll be alive.|a seed|a gardener|a stone|Because the seed is small but determined, the poem turns smallness into strength.|Because the seed is really a stone, the poem is about lying still and never changing.|Because the speaker is a gardener, the poem is about pulling the weeds from a bed.
  Tonight I'll sleep in my own bed, / the hospital is done, they said. / My sister made a welcome sign. / The stars look different. They look fine.|a child coming home from the hospital|a nurse|the sister|Because the child has been away and ill, ordinary things like a bed seem wonderful.|Because the speaker is a nurse, the hospital is described as a home she loves.|Because the speaker is the sister, the poem is mostly about making a welcome sign.
  Up here the town is just a toy, / each roof a block, each car a joy / of tiny red. I hold my breath. / The kite string tugs. I'm high as hope.|a kite|a child holding the string|a bird|Because the kite is so high, the whole town looks like a toy.|Because the kite is still on the ground, the town looks huge and far too crowded.|Because the speaker is the child, the poem describes the knots tied in the string.
  I wait each day beside the door. / At five o'clock I hear the roar / of her old car. I spin. I leap. / She's home. She's home. I'll never sleep.|a dog|the owner coming home|the car|Because the speaker is a dog, an ordinary homecoming is the best moment of the day.|Because the speaker is the owner, the poem is about a long and tiring drive home.|Because the speaker is the old car, the poem is about the roar of its own engine.
  I built this wall, stone over stone, / with my two hands, and all alone. / The rain will wear it, wind will try. / It stands. And so, by God, do I.|an old stone-wall builder|the wall|the rain|Because the builder made the wall alone, its strength stands for his own.|Because the speaker is the rain, the wall is only something to wear slowly away.|Because the speaker is the wall itself, the poem is about being built stone by stone.
  The final bell! I grab my coat. / I'm out the door; I'm on a boat / of summer, sailing far from here. / No homework now. No books. No fear.|a student on the last day of school|a teacher|a school bell|Because the speaker is a student, the end of school feels like sailing away to freedom.|Because the speaker is a teacher, the end of school means a pile of tests to grade.|Because the speaker is the bell, the poem is only about ringing at the end of day.
  At dawn I lift my sail of light / and chase away the cold of night. / The farmers wake. The roosters cry. / I climb the long hill of the sky.|the sun|a farmer|a rooster|Because the speaker is the sun, the whole morning is shown as its work.|Because the speaker is a farmer, the morning is described as hours of plowing.|Because the speaker is the night, the poem is about the dark that covers the farms.
  I carried water up the hill / when I was small. I carry still / the bucket's weight, the morning chill, / though taps now run in every sill.|a woman remembering her childhood|a child today|a bucket|Because she remembers carrying water, she still feels its weight though times have changed.|Because the speaker is a child today, the poem is about turning on a kitchen tap.|Because the speaker is the bucket, the poem complains about being carried uphill.
  I'm stuck in the attic, a box full of toys, / I once held the laughter of girls and of boys. / Now spiders are weaving their webs on my lid. / I still have the yo-yo. I'm glad that I hid.|a box of old toys|a child|a spider|Because the box has been forgotten, its memories of laughter feel lonely and dear.|Because the speaker is a child, the poem is about playing with the toys right now.|Because the speaker is a spider, the poem is about spinning webs on the lid.
  I came here on a crowded ship, / my mother's hand in my tight grip. / New words, new streets, new snow, new sky. / I'm learning. Watch me. Watch me try.|a young immigrant|the ship's captain|the mother|Because the speaker is new to the country, everything is strange and also a challenge to meet.|Because the speaker is the ship's captain, the poem is about steering across the sea.|Because the speaker is the mother, the poem is about her own childhood long ago.
  I sweep the floors when school is done. / I see the drawings, one by one, / taped up with care along the hall. / I'm not their teacher. I love them all.|a school janitor|a teacher|a student artist|Because the janitor sees the school when it is empty, the drawings show the children he quietly cares about.|Because the speaker is a teacher, the poem is about grading the drawings on the wall.|Because the speaker is an artist, the poem is about painting pictures for the hall.
  I'm the last apple on the tree. / The others fell. They're gone. Not me. / The wind can push, the frost can bite; / I'll hang here shining in the light.|the last apple on a tree|a farmer picking apples|the wind|Because the apple is the last one left, holding on becomes an act of courage.|Because the speaker is a farmer, the poem is about picking apples for the harvest.|Because the speaker is the wind, the poem is about pushing at the branches of trees.
  The moon looks down on all of you, / the cities bright, the farms too. / I've watched you build and watched you fight. / I'll watch you still, tonight, tonight.|the moon|a city dweller|a farmer|Because the moon has watched for ages, people's busy lives seem small and repeated.|Because the moon is new in the sky, everything on Earth seems strange and unfamiliar.|Because the speaker is a farmer, the poem is about the crops growing in the fields.
  My cast came off today. My arm / is thin and pale but safe from harm. / I'll climb that tree again, I swear / (but maybe not up quite so far).|a child who broke an arm|a doctor|the tree|Because the child fell from the tree, climbing again is both brave and a little nervous.|Because the speaker is a doctor, the poem is about fixing broken arms in a hospital.|Because the speaker is the tree, the poem is about its leaves and its branches.
  The bus is late; the rain is cold; / I'm seventy-eight, they say I'm old. / But on this bench I watch the street / and every face is new and sweet.|an old man waiting for a bus|a bus driver|a child walking by|Because the man has lived long, he enjoys each passing face instead of minding the rain.|Because the speaker is the bus driver, the poem is about the traffic on the street.|Because the speaker is a child, the poem is about hurrying to school in the rain.
  I am the bell above the school. / I've rung for every golden rule, / for every fight, for every prize. / I never see. I sound. I rise.|a school bell|a principal|a student|Because the bell only rings and never sees, it knows the school by its sounds.|Because the speaker is a student, the poem is about the lessons taught in class.|Because the speaker is the principal, the poem is about the rules of the school.
  The dancers spin, the music plays, / I've worn these shoes for forty days. / My feet are sore, my heart is light. / Tomorrow is the show. Tonight—|a young dancer|a music teacher|the shoes|Because the dancer has practiced so hard, her sore feet matter less than her excitement.|Because the speaker is the shoes, the poem is about being worn out after forty days.|Because the speaker is the music teacher, the poem is about the songs for the show.
  I'm small and gray, I live in walls, / I listen to the footstep falls. / At night the kitchen floor is mine; / a crumb of cheese, and I'm just fine.|a mouse|a cat|a cook|Because the speaker is a mouse, the dark kitchen is a place of treasure, not of danger.|Because the speaker is a cat, the dark kitchen is a place for hunting mice at night.|Because the speaker is the cook, the kitchen is a place of hard work every day.
  We planted beans in rows of eight. / My father laughed: "Now we wait." / The rain came late. The beans came too. / And so did I, the season through.|a child helping on a farm|the father|the rain|Because the child waits through the season, growing the beans feels like growing up.|Because the speaker is the rain, the poem is about falling late on the bean field.|Because the speaker is the father, the poem is about laughing while he plants.
  I was the ship that crossed the bay / a thousand times, and every day / I carried mothers, cows and mail. / Now I'm a wreck. I'm still a tale.|an old ferry boat|a passenger|the bay|Because the ferry served so long, even as a wreck it holds the town's stories.|Because the speaker is a passenger, the poem is about one single trip across the bay.|Because the speaker is the bay, the poem is about its waves and its tides.
`);
const poemText = (r: readonly string[]) => field(r, 0).replaceAll(" / ", "\n");
const speakerItems: ChoiceItem[] = poems.map((r): ChoiceItem => [poemText(r), field(r, 1), [field(r, 2), field(r, 3)]]);
const viewItems: ChoiceItem[] = poems.map((r): ChoiceItem => [poemText(r), field(r, 4), [field(r, 5), field(r, 6)]]);

const speakerOfAPoem = topic("reading", {
  id: "the-speaker-of-a-poem",
  title: ["The Speaker of a Poem", "诗歌的说话者"],
  summary: [
    "The voice of a poem is its speaker, who may not be the poet: a child, an old sailor, a tree.",
    "诗中的声音是它的说话者，说话者不一定是诗人本人：可以是孩子、老水手或一棵树。",
  ],
  after: ["what-a-poem-is-about", "point-of-view"],
  points: [
    choose(
      "who-the-speaker-is",
      ["Who the Speaker Is", "说话者是谁"],
      [
        "The **speaker** of a poem is the voice that says *I*. The speaker is not always the poet: a poet can write as a tree, a dog, an old sailor or a book. Look for clues in what the speaker says about their body, their age, their place and what they do: *my roots in rock* tells you the speaker is a tree.",
        "诗歌的**说话者**是诗中说“我”的那个声音。说话者不一定是诗人：诗人可以以一棵树、一只狗、一位老水手或一本书的身份来写。要从说话者讲到的身体、年龄、所在的地方和所做的事中寻找线索：*my roots in rock* 告诉你说话者是一棵树。",
      ],
      ["Who is the speaker of this poem?", "这首诗的说话者是谁？"],
      speakerItems,
      (right) => [
        `The speaker's words about themselves show that the speaker is **${right}**.`,
        `说话者讲述自己的话表明，说话者是 **${right}**。`,
      ],
      [
        [
          "*{wrong}* is someone or something the speaker mentions, not the speaker.",
          "*{wrong}* 是说话者提到的人或事物，而不是说话者本人。",
        ],
        ["*{wrong}* does not fit what the speaker says about themselves.", "*{wrong}* 与说话者讲述自己的话不符。"],
      ],
    ),
    choose(
      "how-the-speakers-view-shapes-the-poem",
      ["How the Speaker's View Shapes the Poem", "说话者的视角如何塑造诗歌"],
      [
        "Who the speaker is changes **what the poem notices and how it feels**. To a tiny insect, people in boots are thundering giants; to an old sailor at home, the sea is a memory to long for. Ask what this speaker would care about, and how that makes the poem describe things.",
        "说话者是谁，决定了**诗歌注意到什么、带着什么感情**。在一只小虫看来，穿靴子的人是轰隆作响的巨人；对待在家里的老水手来说，大海是令人怀念的回忆。问问这个说话者会在意什么，以及这如何影响诗歌对事物的描写。",
      ],
      ["How does the speaker's view shape what the poem describes?", "说话者的视角如何影响诗歌的描写？"],
      viewItems,
      (right) => [`The speaker's view explains it: ${right}`, `说话者的视角解释了这一点：${right}`],
      [
        ["*{wrong}* gets the speaker's situation wrong.", "*{wrong}* 弄错了说话者的处境。"],
        ["*{wrong}* treats someone else as the speaker.", "*{wrong}* 把别的人当成了说话者。"],
      ],
    ),
  ],
});

/** readingTopics5b are the reading skills of the last four units of grade 5. */
export const readingTopics5b: readonly TopicDef[] = [
  readingNews,
  cluesAndHerrings,
  drawingConclusions,
  buildingSuspense,
  storiesOfOneGenre,
  comparingCharacters,
  facingChallenges,
  chaptersBuildAStory,
  diariesAndLetters,
  speakerOfAPoem,
];
