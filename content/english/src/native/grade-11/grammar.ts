// Grade 11: grammar and style: verbs freed from nominalizations, mixed constructions and faulty predication, restrictive
// and nonrestrictive elements, and the seventh set of commonly confused words.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const nominalizations = topic("grammar", {
  id: "reducing-nominalizations",
  title: ["Reducing Nominalizations", "减少名词化"],
  summary: [
    "Turning nouns made from verbs, such as decision, failure and analysis, back into verbs, so that sentences name who does what.",
    "把由动词变来的名词，如 decision、failure 和 analysis，还原为动词，让句子说清谁做了什么。",
  ],
  after: ["cutting-wordiness", "active-and-passive-for-emphasis"],
  points: [
    label(
      "what-weakens-the-sentence",
      ["What Weakens the Sentence", "是什么削弱了句子"],
      [
        "A **nominalization** is a noun made from a verb or an adjective: *decide* becomes *decision*, *fail* becomes *failure*, *careful* becomes *carefulness*. Too many of them bury the action in nouns and leave weak verbs such as *make*, *have* and *be*: *The committee made a decision to conduct an investigation.* Compare: *The committee decided to investigate.* A sentence can also hide the actor in a **passive with no actor**: *Mistakes were made.* A **direct** sentence names the actor as the subject and the action as the verb.",
        "**名词化**是由动词或形容词变来的名词：*decide* 变成 *decision*，*fail* 变成 *failure*，*careful* 变成 *carefulness*。名词化太多，会把动作埋进名词里，只留下 *make*、*have*、*be* 这样无力的动词：*The committee made a decision to conduct an investigation.* 比较：*The committee decided to investigate.* 句子也可能用**不提施动者的被动句**把施动者藏起来：*Mistakes were made.* **直接**的句子以施动者作主语，以动作作谓语动词。",
      ],
      ["What, if anything, weakens this sentence?", "如果有的话，是什么削弱了这个句子？"],
      `
        The board made a decision to postpone the vote.|a buried verb
        The council conducted an investigation of the complaints.|a buried verb
        The students gave consideration to the proposal.|a buried verb
        There was a failure of the brakes on the hill.|a buried verb
        The author provides a description of the city at night.|a buried verb
        The team achieved an improvement in its scores.|a buried verb
        The manager made an announcement of the new schedule.|a buried verb
        The scientists performed an analysis of the samples.|a buried verb
        Our hope is for the acceptance of the plan by the board.|a buried verb
        The police are in possession of new evidence.|a buried verb
        The writer makes a comparison of the two cities.|a buried verb
        The company reached an agreement with the union.|a buried verb
        Mistakes were made in the counting of the votes.|a passive with no actor
        The window was broken during the night.|a passive with no actor
        The money was spent before anyone noticed.|a passive with no actor
        The rules were changed without warning.|a passive with no actor
        The old trees were cut down last spring.|a passive with no actor
        The report was leaked to the press.|a passive with no actor
        The prices were raised twice this year.|a passive with no actor
        The files were deleted by accident.|a passive with no actor
        The board postponed the vote.|direct and clear
        The council investigated the complaints.|direct and clear
        The students considered the proposal.|direct and clear
        The brakes failed on the hill.|direct and clear
        The author describes the city at night.|direct and clear
        The team improved its scores.|direct and clear
        The manager announced the new schedule.|direct and clear
        The scientists analyzed the samples.|direct and clear
        We hope the board will accept the plan.|direct and clear
        The company agreed with the union.|direct and clear
        The mayor raised the prices twice this year.|direct and clear
        Someone leaked the report to the press.|direct and clear
      `,
      {
        "a buried verb": L(
          "埋藏的动词",
          "The action is hidden in a noun made from a verb, held up by a weak verb such as make, give or conduct.",
          "动作藏在由动词变来的名词里，由 make、give、conduct 之类无力的动词撑着。",
          "No action is buried in a noun made from a verb.",
          "没有动作被埋进由动词变来的名词里。",
        ),
        "a passive with no actor": L(
          "不提施动者的被动句",
          "The sentence uses the passive and never says who did the action.",
          "句子用了被动语态，却从未说明是谁做了这个动作。",
          "The sentence is not a passive that leaves out the actor.",
          "这个句子不是省略施动者的被动句。",
        ),
        "direct and clear": L(
          "直接清楚",
          "The actor is the subject and the action is the verb, so nothing is buried or hidden.",
          "施动者是主语，动作是谓语动词，没有任何东西被埋藏或隐藏。",
          "The sentence buries its action in a noun or hides who acted.",
          "这个句子把动作埋进了名词，或藏起了施动者。",
        ),
      },
    ),
    choose(
      "the-verb-set-free",
      ["The Verb Set Free", "让动词解放出来"],
      [
        "To revise a nominalization, find the noun that hides an action, turn it back into a verb and make the actor its subject. *The government's expansion of the program took place in 2020* becomes *The government expanded the program in 2020.* *We had a discussion about the problem* becomes *We discussed the problem.* The revision should keep the meaning and usually comes out shorter.",
        "修改名词化时，找出藏着动作的名词，把它还原为动词，再让施动者作主语。*The government's expansion of the program took place in 2020* 改为 *The government expanded the program in 2020.* *We had a discussion about the problem* 改为 *We discussed the problem.* 修改后的句子应保持原意，而且通常更短。",
      ],
      ["Which revision frees the verb and keeps the meaning?", "哪个修改让动词解放出来并保持了原意？"],
      `
        The committee made a decision to close the pool.|The committee decided to close the pool.|The committee made the decision of closing the pool.|The committee closed the pool before deciding.
        The teacher gave an explanation of the rule.|The teacher explained the rule.|The teacher gave the rule an explanation.|The teacher ruled on the explanation.
        The company made an announcement of layoffs.|The company announced layoffs.|An announcement of layoffs was made by the company.|The company laid off the announcer.
        The scientists conducted an examination of the bones.|The scientists examined the bones.|An examination of the bones was conducted.|The bones examined the scientists.
        We had a discussion about the budget.|We discussed the budget.|A discussion was had by us about the budget.|We budgeted for a discussion.
        The city carried out a reduction of its spending.|The city reduced its spending.|A reduction of spending was carried out.|The city spent money on a reduction.
        The writer offers a criticism of the law.|The writer criticizes the law.|The writer makes criticisms of the law.|The law criticizes the writer.
        The police made an arrest of the suspect.|The police arrested the suspect.|The suspect's arrest was made.|The suspect made the police arrest.
        There was a refusal by the mayor to comment.|The mayor refused to comment.|A refusal to comment was given by the mayor.|The mayor commented on the refusal.
        The judge gave approval to the plan.|The judge approved the plan.|Approval was given to the plan.|The plan approved the judge.
        Our expectation is that prices will rise.|We expect prices to rise.|There is an expectation of rising prices.|Prices expect us to rise.
        The council made a recommendation that the road be widened.|The council recommended widening the road.|A recommendation was made about the road.|The road recommended the council.
        The students made an objection to the new rule.|The students objected to the new rule.|An objection was made to the new rule.|The rule objected to the students.
        The author makes use of irony in the ending.|The author uses irony in the ending.|Use of irony is made in the ending.|The ending uses the author.
        The doctor performed an assessment of the injury.|The doctor assessed the injury.|An assessment of the injury was performed.|The injury assessed the doctor.
        The factory had a failure to meet its targets.|The factory failed to meet its targets.|There was a failure of the factory's targets.|The targets failed the factory.
        The engineers did a test of the bridge.|The engineers tested the bridge.|A test was done on the bridge.|The bridge tested the engineers.
        The coach gave encouragement to the players.|The coach encouraged the players.|Encouragement was given to the players.|The players encouraged the coach.
        The museum is in the process of a renovation of its galleries.|The museum is renovating its galleries.|A renovation of galleries is in process.|The galleries are renovating the museum.
        The two nations reached an agreement on trade.|The two nations agreed on trade.|An agreement on trade was reached.|Trade agreed with the two nations.
        Her intention was to finish by noon.|She intended to finish by noon.|There was an intention of finishing by noon.|Noon intended her to finish.
        The board had a meeting on Tuesday.|The board met on Tuesday.|A meeting was had by the board on Tuesday.|Tuesday met the board.
        The author gives a portrayal of the father as cruel.|The author portrays the father as cruel.|A portrayal of the father as cruel is given.|The father portrays the author.
        The government took action to provide assistance to farmers.|The government acted to assist farmers.|Action to provide assistance was taken.|The farmers assisted the government.
        The witness gave a confirmation of the story.|The witness confirmed the story.|Confirmation of the story was given.|The story confirmed the witness.
        The class did a review of the chapter.|The class reviewed the chapter.|A review of the chapter was done.|The chapter reviewed the class.
        The mayor made a promise of new parks.|The mayor promised new parks.|A promise of new parks was made.|The parks promised the mayor.
        The researchers made a discovery of a new species.|The researchers discovered a new species.|A discovery of a new species was made.|The species discovered the researchers.
        The editors made a correction of the error.|The editors corrected the error.|A correction of the error was made.|The error corrected the editors.
        The company made an investment in solar power.|The company invested in solar power.|An investment in solar power was made.|Solar power invested in the company.
      `,
      (right) => [
        `"${right}" turns the buried noun back into a verb with the actor as its subject, so it is shorter and keeps the meaning.`,
        `“${right}” 把埋藏的名词还原为动词，并以施动者作主语，所以更短且保持原意。`,
      ],
      [
        [
          '"{wrong}" still buries the action in a noun or hides the actor in a passive.',
          "“{wrong}”仍然把动作埋在名词里，或用被动句藏起了施动者。",
        ],
        ['"{wrong}" changes who did what, so the meaning is no longer the same.', "“{wrong}”改变了谁做了什么，意思已经不同。"],
      ],
    ),
  ],
});

const mixed = topic("grammar", {
  id: "mixed-constructions",
  title: ["Mixed Constructions and Faulty Predication", "混杂结构与搭配不当"],
  summary: [
    "Sentences that start with one structure and end with another, and subjects joined to predicates that cannot fit them, as in the reason is because.",
    "以一种结构开头却以另一种结构结尾的句子，以及主语与不能搭配的谓语连在一起的句子，如 the reason is because。",
  ],
  after: ["complements-and-objects", "noun-adjective-and-adverb-clauses"],
  points: [
    label(
      "what-is-wrong-with-the-sentence",
      ["What Is Wrong with the Sentence", "句子有什么问题"],
      [
        "A **mixed construction** begins with one grammatical structure and switches to another, so the sentence has no proper subject: *By working hard at night made her tired.* (A phrase beginning *by* cannot be the subject.) **Faulty predication** joins a subject to a predicate that does not fit it logically: *The reason is because…*, *Democracy is when…*, *The cost was expensive.* A reason is not *because*; democracy is not a time; a cost is *high*, not *expensive*. A **correct** sentence keeps one structure from start to end.",
        "**混杂结构**以一种语法结构开头，又换成另一种结构，使句子没有真正的主语：*By working hard at night made her tired.*（以 *by* 开头的短语不能作主语。）**搭配不当**是把主语和逻辑上不相配的谓语连在一起：*The reason is because…*、*Democracy is when…*、*The cost was expensive.* reason 不能是 *because*；democracy 不是一个时间；cost 应该是 *high*，而不是 *expensive*。**正确**的句子从头到尾保持一种结构。",
      ],
      ["What, if anything, is wrong with this sentence?", "如果有的话，这个句子有什么问题？"],
      `
        By studying every night improved her grades.|a mixed construction
        Because he was late caused the team to lose.|a mixed construction
        In the novel shows how greed destroys a family.|a mixed construction
        Although she was tired but she kept working.|a mixed construction
        The fact that he lied was why we stopped trusting him because.|a mixed construction
        By raising taxes would not solve the problem.|a mixed construction
        In the letter explains why the colonists were angry.|a mixed construction
        Just because it rains doesn't mean the game is canceled.|a mixed construction
        With the new law requires all drivers to carry insurance.|a mixed construction
        Through her speeches inspired thousands of people.|a mixed construction
        In the first chapter introduces the main conflict.|a mixed construction
        Because the bridge was closed meant we had to drive around.|a mixed construction
        The reason I was late is because the bus broke down.|faulty predication
        Democracy is when the people choose their leaders.|faulty predication
        The price of the tickets was too expensive.|faulty predication
        An epiphany is where a character suddenly understands.|faulty predication
        Her job is a teacher at the high school.|faulty predication
        The purpose of the law is for protecting children.|faulty predication
        Irony is when the opposite of what you expect happens.|faulty predication
        The cause of the fire was due to a faulty wire.|faulty predication
        The temperature today is very hot.|faulty predication
        A sonnet is where a poem has fourteen lines.|faulty predication
        The decision to close the park was decided by the council.|faulty predication
        The speed of the car was fast.|faulty predication
        By studying every night, she improved her grades.|correct
        Because he was late, the team lost.|correct
        The novel shows how greed destroys a family.|correct
        Although she was tired, she kept working.|correct
        The reason I was late is that the bus broke down.|correct
        Democracy is a system in which the people choose their leaders.|correct
        The tickets were too expensive.|correct
        An epiphany is a moment in which a character suddenly understands.|correct
        She works as a teacher at the high school.|correct
        The fire was caused by a faulty wire.|correct
        The price of the tickets was too high.|correct
        Raising taxes would not solve the problem.|correct
      `,
      {
        "a mixed construction": L(
          "混杂结构",
          "The sentence starts with one structure, such as a phrase or a clause that cannot be a subject, and finishes as if it had a subject.",
          "句子以一种不能作主语的结构（如短语或从句）开头，结尾却像是有主语一样。",
          "The sentence does not switch from one structure to another.",
          "这个句子并没有从一种结构换成另一种结构。",
        ),
        "faulty predication": L(
          "搭配不当",
          "The subject and the predicate do not fit logically, as in a reason that is because or a price that is expensive.",
          "主语和谓语在逻辑上不相配，比如 reason 是 because，或 price 是 expensive。",
          "The subject and the predicate fit each other logically.",
          "主语和谓语在逻辑上是相配的。",
        ),
        correct: L(
          "正确",
          "The sentence keeps one structure from start to end, and its subject and predicate fit.",
          "句子从头到尾保持一种结构，主语和谓语也相配。",
          "The sentence mixes structures or joins a subject to a predicate that does not fit.",
          "这个句子混用了结构，或主语与谓语不相配。",
        ),
      },
    ),
    choose(
      "mending-the-sentence",
      ["Mending the Sentence", "修补句子"],
      [
        "To mend a mixed construction, give the sentence a true subject: drop the word that turned the subject into a phrase (*By studying improved* → *Studying improved*), or add a subject after a comma (*By studying, she improved*). To mend faulty predication, make the predicate fit the subject: *the reason is that*, *democracy is a system in which*, *the price was high*.",
        "修补混杂结构，要给句子一个真正的主语：去掉把主语变成短语的那个词（*By studying improved* → *Studying improved*），或在逗号后补上主语（*By studying, she improved*）。修补搭配不当，要让谓语与主语相配：*the reason is that*、*democracy is a system in which*、*the price was high*。",
      ],
      ["Which revision mends the sentence?", "哪个修改修补了这个句子？"],
      `
        By studying every night improved her grades.|Studying every night improved her grades.|By studying every night, improved her grades.|By studying every night her grades improving.
        The reason I left is because I was tired.|The reason I left is that I was tired.|The reason I left is due to because I was tired.|The reason why I left is because of tired.
        Democracy is when people vote for leaders.|Democracy is a system in which people vote for leaders.|Democracy is when people are voting for leaders.|Democracy is where people vote for leaders.
        In the poem describes a storm at sea.|The poem describes a storm at sea.|In the poem, describes a storm at sea.|In the poem it is describing of a storm at sea.
        The cost of the repairs was expensive.|The repairs were expensive.|The cost of the repairs was very expensive.|The cost of the repairs was expensively.
        Because she won the race made her famous.|Winning the race made her famous.|Because she won the race, made her famous.|Because of winning the race made her famous.
        Irony is when the opposite of what is expected happens.|Irony is the contrast between what is expected and what happens.|Irony is when the opposite of what is expected is happening.|Irony is where the opposite of what is expected happens.
        Although he apologized but she was still angry.|Although he apologized, she was still angry.|Although he apologized, but she was still angry.|Although he apologized but, she was still angry.
        With the new rule requires students to wear badges.|The new rule requires students to wear badges.|With the new rule, requires students to wear badges.|With the new rule it requiring students to wear badges.
        The cause of the delay was because of the snow.|The delay was caused by the snow.|The cause of the delay was because the snow.|The cause of the delay was due to because of the snow.
        A haiku is where a poem has three lines.|A haiku is a poem of three lines.|A haiku is when a poem has three lines.|A haiku is where a three-line poem is.
        Through hard work earned him a promotion.|Hard work earned him a promotion.|Through hard work, earned him a promotion.|Through hard work it earning him a promotion.
        His job is a doctor in the city.|He works as a doctor in the city.|His job is being a doctor in the city.|His job is where he is a doctor in the city.
        The speed of the train was very fast.|The train was very fast.|The speed of the train was very quickly.|The speed of the train was fastly.
        By cutting the budget would harm the schools.|Cutting the budget would harm the schools.|By cutting the budget, would harm the schools.|By cutting the budget it harming the schools.
        In the second act reveals the king's guilt.|The second act reveals the king's guilt.|In the second act, reveals the king's guilt.|In the second act it revealing the king's guilt.
        The purpose of the meeting is for planning the trip.|The purpose of the meeting is to plan the trip.|The purpose of the meeting is for to plan the trip.|The purpose of the meeting is planning for the trip is.
        An allusion is when a writer refers to another work.|An allusion is a reference to another work.|An allusion is when a writer is referring to another work.|An allusion is where a writer refers to another work.
        Because it was raining meant the game was canceled.|The rain meant the game was canceled.|Because it was raining, meant the game was canceled.|Because of raining meant the game was canceled.
        The weather today is very hot.|It is very hot today.|The weather today is very hotly.|The weather today is very heat.
        Just because he is rich doesn't mean he is happy.|Being rich does not make him happy.|Just because he is rich, doesn't mean he is happy.|Just because of rich doesn't mean he is happy.
        The decision to cancel was decided by the principal.|The principal decided to cancel.|The decision to cancel was decided on by the principal.|The decision to cancel was decisioned by the principal.
        Through his letters shows his love for his sister.|His letters show his love for his sister.|Through his letters, shows his love for his sister.|Through his letters it showing his love for his sister.
        The reason the plants died was because of the frost.|The plants died because of the frost.|The reason the plants died was because the frost.|The reason why the plants died was due to because of the frost.
        Her goal is for becoming a pilot.|Her goal is to become a pilot.|Her goal is for to become a pilot.|Her goal is when she becomes a pilot.
        By reading the instructions would have prevented the mistake.|Reading the instructions would have prevented the mistake.|By reading the instructions, would have prevented the mistake.|By reading of the instructions would have prevented the mistake.
        A metaphor is when you compare two things without like or as.|A metaphor is a comparison without like or as.|A metaphor is when two things are being compared without like or as.|A metaphor is where you compare two things without like or as.
        The amount of homework was too many.|There was too much homework.|The amount of homework was too much many.|The amount of homeworks was too many.
        In her diary reveals her fear of the war.|Her diary reveals her fear of the war.|In her diary, reveals her fear of the war.|In her diary it revealing her fear of the war.
        The result of the vote was that the law was rejected by voting.|The voters rejected the law.|The result of the vote was the law was rejected by the voting.|The result of the vote was rejecting by voting.
      `,
      (right) => [
        `"${right}" gives the sentence one structure from start to end, with a subject and a predicate that fit.`,
        `“${right}” 让句子从头到尾只有一种结构，主语与谓语也相配。`,
      ],
      [
        ['"{wrong}" keeps the faulty structure, only moving a comma or a word.', "“{wrong}”保留了错误的结构，只是挪动了一个逗号或一个词。"],
        ['"{wrong}" adds a new error of grammar or of word form.', "“{wrong}”又添了一个语法或词形上的错误。"],
      ],
    ),
  ],
});

const restrictive = topic("grammar", {
  id: "restrictive-and-nonrestrictive-elements",
  title: ["Restrictive and Nonrestrictive Elements", "限制性与非限制性成分"],
  summary: [
    "Clauses, phrases and appositives that are essential to the meaning take no commas; those that add extra information are set off with commas.",
    "对意思必不可少的从句、短语和同位语不加逗号；补充额外信息的则用逗号隔开。",
  ],
  after: ["some-of-whom-and-whose"],
  points: [
    choose(
      "commas-or-none",
      ["Commas or None", "加逗号还是不加"],
      [
        "A **restrictive** element tells *which one* and is essential to the meaning, so it takes **no commas**: *The students who passed the test went on the trip* (only those students went). A **nonrestrictive** element adds extra information about something already identified, so it is set off **with commas**: *My brother, who lives in Ohio, is a doctor* (I have one brother; where he lives is extra). Use *that* only in restrictive clauses; *which* with commas introduces a nonrestrictive one.",
        "**限制性**成分说明*是哪一个*，对意思必不可少，所以**不加逗号**：*The students who passed the test went on the trip*（只有通过考试的学生去了）。**非限制性**成分为已经明确的事物补充额外信息，所以要**用逗号隔开**：*My brother, who lives in Ohio, is a doctor*（我只有一个哥哥，他住在哪里是额外信息）。*that* 只用于限制性从句；前面有逗号的 *which* 引导非限制性从句。",
      ],
      ["Which sentence is punctuated correctly for the meaning given?", "对于所给的意思，哪个句子的标点是正确的？"],
      `
        Only some of the students passed, and only they went on the trip.|The students who passed the test went on the trip.|The students, who passed the test, went on the trip.|The students who passed the test, went on the trip.
        All the students passed, and all went on the trip.|The students, who all passed the test, went on the trip.|The students who all passed the test went on the trip.|The students, who all passed the test went on the trip.
        I have one sister, and she lives in Paris.|My sister, who lives in Paris, is a painter.|My sister who lives in Paris is a painter.|My sister, who lives in Paris is a painter.
        I have several sisters; the one in Paris is a painter.|My sister who lives in Paris is a painter.|My sister, who lives in Paris, is a painter.|My sister who lives in Paris, is a painter.
        Only the cars made before 1990 were recalled.|The cars that were made before 1990 were recalled.|The cars, which were made before 1990, were recalled.|The cars that were made before 1990, were recalled.
        All the cars were recalled; they all happen to be old.|The cars, which were made before 1990, were recalled.|The cars that were made before 1990 were recalled.|The cars, which were made before 1990 were recalled.
        There is only one Eiffel Tower, and it was finished in 1889.|The Eiffel Tower, which was finished in 1889, draws millions.|The Eiffel Tower which was finished in 1889 draws millions.|The Eiffel Tower, which was finished in 1889 draws millions.
        Only the employees who arrived late lost their bonus.|Employees who arrived late lost their bonus.|Employees, who arrived late, lost their bonus.|Employees who arrived late, lost their bonus.
        The novel is the only one he wrote, and it won a prize.|His novel, which won a prize, sold a million copies.|His novel which won a prize sold a million copies.|His novel which won a prize, sold a million copies.
        He wrote several novels; the one that won a prize sold best.|The novel that won a prize sold a million copies.|The novel, which won a prize, sold a million copies.|The novel that won a prize, sold a million copies.
        Only the dogs that bark at night bother the neighbors.|Dogs that bark at night bother the neighbors.|Dogs, which bark at night, bother the neighbors.|Dogs that bark at night, bother the neighbors.
        My only daughter is named Ana, and she is a nurse.|My daughter, Ana, is a nurse.|My daughter Ana is a nurse.|My daughter, Ana is a nurse.
        I have three daughters, and the one named Ana is a nurse.|My daughter Ana is a nurse.|My daughter, Ana, is a nurse.|My daughter Ana, is a nurse.
        The river is the only one in town, and it floods every spring.|The river, which floods every spring, runs past the school.|The river which floods every spring runs past the school.|The river, which floods every spring runs past the school.
        Only the plants that get full sun will bloom.|Plants that get full sun will bloom.|Plants, which get full sun, will bloom.|Plants that get full sun, will bloom.
        Mr. Lee is the only principal, and he retired this year.|Our principal, Mr. Lee, retired this year.|Our principal Mr. Lee retired this year.|Our principal, Mr. Lee retired this year.
        Of all the poems, only the ones about the sea were chosen.|The poems that describe the sea were chosen.|The poems, which describe the sea, were chosen.|The poems that describe the sea, were chosen.
        All the poems were chosen, and all happen to describe the sea.|The poems, which all describe the sea, were chosen.|The poems which all describe the sea were chosen.|The poems, which all describe the sea were chosen.
        The Amazon is one river; its length is a fact added about it.|The Amazon, which is over six thousand kilometers long, crosses Brazil.|The Amazon which is over six thousand kilometers long crosses Brazil.|The Amazon, which is over six thousand kilometers long crosses Brazil.
        Only the players who missed practice will sit out.|Players who missed practice will sit out.|Players, who missed practice, will sit out.|Players who missed practice, will sit out.
        Shakespeare wrote one Hamlet, and it is his longest play.|Hamlet, which is Shakespeare's longest play, is often cut.|Hamlet which is Shakespeare's longest play is often cut.|Hamlet, which is Shakespeare's longest play is often cut.
        Only the houses built near the river were flooded.|The houses built near the river were flooded.|The houses, built near the river, were flooded.|The houses built near the river, were flooded.
        All the houses were flooded, and all were built near the river.|The houses, built near the river, were flooded.|The houses built near the river were flooded.|The houses, built near the river were flooded.
        My only car is a red one, and it is ten years old.|My car, which is red, is ten years old.|My car which is red is ten years old.|My car, which is red is ten years old.
        Of the many students, only those who wrote essays won prizes.|Students who wrote essays won prizes.|Students, who wrote essays, won prizes.|Students who wrote essays, won prizes.
        There is one Moon, and it controls the tides.|The Moon, which controls the tides, has no air.|The Moon which controls the tides has no air.|The Moon, which controls the tides has no air.
        Only the apples that fell were used for juice.|The apples that fell were used for juice.|The apples, which fell, were used for juice.|The apples that fell, were used for juice.
        My grandmother is one person; her birthplace in Italy is extra information.|My grandmother, who was born in Italy, still makes pasta by hand.|My grandmother who was born in Italy still makes pasta by hand.|My grandmother, who was born in Italy still makes pasta by hand.
        Of the many songs, only those she wrote in prison became famous.|The songs that she wrote in prison became famous.|The songs, which she wrote in prison, became famous.|The songs that she wrote in prison, became famous.
        The Declaration is one document; its date is extra information.|The Declaration of Independence, which was signed in 1776, hangs in Washington.|The Declaration of Independence which was signed in 1776 hangs in Washington.|The Declaration of Independence, which was signed in 1776 hangs in Washington.
      `,
      (right) => [
        `"${right}" matches the meaning: an essential element takes no commas, and an extra one is set off by a pair of commas.`,
        `“${right}” 符合所给的意思：必不可少的成分不加逗号，额外的成分用一对逗号隔开。`,
      ],
      [
        [
          '"{wrong}" treats the element the wrong way, as extra when it is essential or as essential when it is extra.',
          "“{wrong}”把成分的性质弄反了：必不可少的当成了额外的，或额外的当成了必不可少的。",
        ],
        [
          '"{wrong}" uses only one comma where a pair is needed, or puts a comma between the subject and the verb.',
          "“{wrong}”在需要一对逗号的地方只用了一个，或在主语和谓语之间加了逗号。",
        ],
      ],
    ),
    label(
      "what-the-commas-say",
      ["What the Commas Say", "逗号说明了什么"],
      [
        "Commas change the meaning. Without commas, *The passengers who had tickets boarded the train* means **only some** passengers boarded: those with tickets. With commas, *The passengers, who had tickets, boarded the train* means **all** passengers boarded, and all had tickets. Before you add or remove commas, ask whether the element picks out a smaller group or simply adds a fact. A third reading is possible when a **single comma** wrongly splits the subject from its verb: that sentence is simply **punctuated wrongly**.",
        "逗号会改变意思。不加逗号，*The passengers who had tickets boarded the train* 表示**只有一部分**乘客上了车：有票的那些。加了逗号，*The passengers, who had tickets, boarded the train* 表示**所有**乘客都上了车，而且都有票。加或删逗号之前，要问这个成分是挑出一个更小的群体，还是只补充一个事实。还有第三种情况：**单个逗号**错误地把主语和谓语隔开，这个句子就是**标点错误**。",
      ],
      ["What does the punctuation of this sentence tell you?", "这个句子的标点告诉了你什么？"],
      `
        The passengers who had tickets boarded the train.|only some, picked out
        The passengers, who had tickets, boarded the train.|all, with an extra fact
        The passengers who had tickets, boarded the train.|punctuated wrongly
        The trees that were diseased were cut down.|only some, picked out
        The trees, which were diseased, were cut down.|all, with an extra fact
        The trees that were diseased, were cut down.|punctuated wrongly
        The workers who joined the strike lost a day's pay.|only some, picked out
        The workers, who joined the strike, lost a day's pay.|all, with an extra fact
        The workers who joined the strike, lost a day's pay.|punctuated wrongly
        The soldiers who were wounded were sent home.|only some, picked out
        The soldiers, who were wounded, were sent home.|all, with an extra fact
        The soldiers who were wounded, were sent home.|punctuated wrongly
        The books that had torn covers were thrown away.|only some, picked out
        The books, which had torn covers, were thrown away.|all, with an extra fact
        The books that had torn covers, were thrown away.|punctuated wrongly
        The children who finished early went outside.|only some, picked out
        The children, who finished early, went outside.|all, with an extra fact
        The children who finished early, went outside.|punctuated wrongly
        The voters who wanted change chose the new party.|only some, picked out
        The voters, who wanted change, chose the new party.|all, with an extra fact
        The voters who wanted change, chose the new party.|punctuated wrongly
        The fish that swam near the surface were caught.|only some, picked out
        The fish, which swam near the surface, were caught.|all, with an extra fact
        The fish that swam near the surface, were caught.|punctuated wrongly
        The guests who arrived late missed the speech.|only some, picked out
        The guests, who arrived late, missed the speech.|all, with an extra fact
        The guests who arrived late, missed the speech.|punctuated wrongly
        The farmers who used the new seeds had a good harvest.|only some, picked out
        The farmers, who used the new seeds, had a good harvest.|all, with an extra fact
        The farmers who used the new seeds, had a good harvest.|punctuated wrongly
        The streets that were flooded were closed.|only some, picked out
        The streets, which were flooded, were closed.|all, with an extra fact
        The streets that were flooded, were closed.|punctuated wrongly
      `,
      {
        "only some, picked out": L(
          "只有一部分，被挑出来",
          "With no commas, the clause is restrictive: it picks out only the members of the group it describes.",
          "没有逗号，这个从句是限制性的：它只挑出所描述的那部分成员。",
          "The sentence does not use a clause without commas to pick out part of a group.",
          "这个句子没有用不加逗号的从句挑出群体中的一部分。",
        ),
        "all, with an extra fact": L(
          "全部，附加一个事实",
          "A pair of commas makes the clause nonrestrictive: it adds a fact about the whole group.",
          "一对逗号使从句成为非限制性的：它为整个群体补充一个事实。",
          "The clause is not set off by a pair of commas.",
          "这个从句没有用一对逗号隔开。",
        ),
        "punctuated wrongly": L(
          "标点错误",
          "A single comma splits the subject from its verb, which is never correct.",
          "单个逗号把主语和谓语分开了，这永远是错误的。",
          "No single comma splits the subject from its verb.",
          "没有单个逗号把主语和谓语分开。",
        ),
      },
    ),
  ],
});

const confused7 = topic("grammar", {
  id: "commonly-confused-words-7",
  title: ["Commonly Confused Words 7", "易混淆词 7"],
  summary: [
    "Pairs such as discreet and discrete, flaunt and flout, or imply and infer look or sound alike but mean different things.",
    "discreet 和 discrete、flaunt 和 flout、imply 和 infer 这样的词形或读音相近，意思却不同。",
  ],
  after: ["commonly-confused-words-6"],
  points: [
    choose(
      "the-word-that-fits",
      ["The Word That Fits", "合适的词"],
      [
        "Ten more pairs that careful writers keep apart. **Discreet** means careful not to reveal secrets; **discrete** means separate. To **flaunt** is to show off; to **flout** is to openly ignore a rule. To **imply** is to suggest; to **infer** is to conclude. **Complement** completes; **compliment** praises. **Elicit** is to draw out; **illicit** means illegal. **Eminent** means famous; **imminent** means about to happen. **Principal** means main, or the head of a school; a **principle** is a rule or belief. **Stationary** means not moving; **stationery** is writing paper. **Tortuous** means full of twists; **torturous** means painful. To **adapt** is to change to fit; to **adopt** is to take as one's own.",
        "又有十对需要认真区分的词。**discreet** 意为谨慎的、不泄露秘密的，**discrete** 意为分离的。**flaunt** 是炫耀，**flout** 是公然违抗规则。**imply** 是暗示，**infer** 是推断。**complement** 是补足，**compliment** 是称赞。**elicit** 是引出，**illicit** 意为非法的。**eminent** 意为著名的，**imminent** 意为即将发生的。**principal** 意为主要的，或指校长；**principle** 是原则或信念。**stationary** 意为静止的，**stationery** 是信纸文具。**tortuous** 意为曲折的，**torturous** 意为痛苦的。**adapt** 是改变以适应，**adopt** 是采用、收养。",
      ],
      ["Which word fits the sentence?", "哪个词适合这个句子？"],
      `
        Please be ___ and don't tell anyone about the party.|discreet|discrete|decent
        The course is divided into six ___ units.|discrete|discreet|distinct
        The doctor was ___ about the patient's illness.|discreet|discrete|discredit
        He likes to ___ his new car in front of the neighbors.|flaunt|flout|float
        Drivers who ___ the speed limit will be fined.|flout|flaunt|float
        She would never ___ her wealth in public.|flaunt|flout|flounder
        Are you trying to ___ that I was lying?|imply|infer|employ
        From his silence, we can ___ that he disagrees.|infer|imply|inflict
        The author seems to ___ that the narrator is mad.|imply|infer|apply
        Readers ___ from the clues that the butler did it.|infer|imply|inform
        The red scarf is a perfect ___ to her coat.|complement|compliment|component
        He paid her a ___ on her speech.|compliment|complement|complaint
        The teacher's questions ___ thoughtful answers.|elicit|illicit|elect
        The police found an ___ drug lab in the basement.|illicit|elicit|explicit
        An ___ scientist gave the opening lecture.|eminent|imminent|immanent
        Dark clouds warned of an ___ storm.|imminent|eminent|immense
        The ___ called the students into the hall.|principal|principle|principality
        Honesty is a ___ she never gives up.|principle|principal|principled
        The ___ reason for the delay was money.|principal|principle|primal
        The train remained ___ for an hour.|stationary|stationery|stationed
        She wrote the letter on her best ___.|stationery|stationary|statuary
        The path up the cliff was ___ and narrow.|tortuous|torturous|torrential
        Waiting for the results was ___.|torturous|tortuous|tortured
        Animals must ___ to the changing climate.|adapt|adopt|adept
        The couple plan to ___ a child.|adopt|adapt|adept
        The school decided to ___ the new rules.|adopt|adapt|adept
        Writers often ___ novels for the stage.|adapt|adopt|adept
        The negotiations followed a long and ___ route.|tortuous|torturous|torrential
        A good sauce should ___ the dish, not hide it.|complement|compliment|complete
        The speech seemed to ___ that the war was coming.|imply|infer|impale
      `,
      (right) => [
        `**${right}** has the meaning this sentence needs; the other choices are look-alike words whose meanings differ.`,
        `**${right}** 具有这个句子需要的意思；其他选项是形似的词，意思不同。`,
      ],
      [
        [
          "*{wrong}* looks or sounds like **{right}**, but it has a different meaning.",
          "*{wrong}* 看起来或听起来像 **{right}**，但意思不同。",
        ],
        ["*{wrong}* is another word or form; it does not have this meaning.", "*{wrong}* 是另一个词或词形，没有这个意思。"],
      ],
    ),
    choose(
      "the-word-for-the-meaning",
      ["The Word for the Meaning", "符合释义的词"],
      [
        "Learn each pair by a clue. *Discrete* has its *t* standing apart, separate from the *e*. To *flout* a rule is to go *out* of it. The speaker *implies*; the listener *infers*. A *complement* *completes*; a *compliment* is what *I* like to hear. *Illicit* is *ill*egal. *Imminent* is *im*mediate. The *principal* is your *pal*; a *principle* is a ru*le*. Station*e*ry is for *e*nvelopes. To *adopt* is to take an *option*.",
        "用线索记住每一对词。*discrete* 里的 *t* 把两个 *e* 分开。*flout* 规则就是跳 *out* 规则之外。说话的人 *imply*，听话的人 *infer*。*complement* 是 *complete*（补全）；*compliment* 是 *I* 爱听的话。*illicit* 就是 *ill*egal（非法）。*imminent* 是 *im*mediate（即将）。*principal* 是你的 *pal*（朋友，即校长）；*principle* 是一条 ru*le*（规则）。station*e*ry 用于 *e*nvelope（信封）。*adopt* 是选取一个 *option*。",
      ],
      ["Which word has this meaning?", "哪个词有这个意思？"],
      `
        careful not to reveal private things|discreet|discrete|discredit
        separate and distinct from each other|discrete|discreet|discredit
        to show something off proudly|flaunt|flout|float
        to break a rule openly and on purpose|flout|flaunt|flounder
        to suggest without saying directly|imply|infer|apply
        to reach a conclusion from evidence|infer|imply|inflict
        something that completes or goes well with another thing|complement|compliment|component
        a remark of praise|compliment|complement|complaint
        to draw out a reply or a reaction|elicit|illicit|elect
        not allowed by law|illicit|elicit|implicit
        famous and respected in a field|eminent|imminent|immanent
        about to happen very soon|imminent|eminent|immense
        the head of a school|principal|principle|principality
        a basic rule or belief|principle|principal|principled
        not moving|stationary|stationery|stationed
        paper and envelopes for writing letters|stationery|stationary|statuary
        full of twists and turns|tortuous|torturous|torrential
        causing great pain or suffering|torturous|tortuous|torrential
        to change something so it fits a new use|adapt|adopt|adept
        to take something or someone as one's own|adopt|adapt|adept
        what a reader does with the clues in a mystery|infer|imply|inform
        what a writer does when hinting at a meaning|imply|infer|impose
        what a driver does who ignores a red light|flout|flaunt|float
        what a millionaire does with a diamond ring|flaunt|flout|flounder
        a scientist who has won many prizes is this|eminent|imminent|immanent
        a storm whose clouds are overhead is this|imminent|eminent|immense
        a car waiting at a red light is this|stationary|stationery|stationed
        a trade in stolen goods is this|illicit|elicit|explicit
        a friend who keeps your secret is this|discreet|discrete|discredit
        a matching tie does this for a shirt|complement|compliment|complain
      `,
      (right) => [
        `**${right}** has this meaning; the other choices are look-alike words whose meanings differ.`,
        `**${right}** 有这个意思；其他选项是形似的词，意思不同。`,
      ],
      [
        [
          "*{wrong}* looks or sounds like **{right}**, but it has a different meaning.",
          "*{wrong}* 看起来或听起来像 **{right}**，但意思不同。",
        ],
        ["*{wrong}* is another word or form; it does not have this meaning.", "*{wrong}* 是另一个词或词形，没有这个意思。"],
      ],
    ),
  ],
});

/** grammarTopics11 are the grammar topics of grade 11. */
export const grammarTopics11: readonly TopicDef[] = [nominalizations, mixed, restrictive, confused7];
