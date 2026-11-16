// Grade 12: more grammar and style for writing at college level: faulty predication, illogical comparisons, clauses
// and phrases of concession, stacks of nouns, and semicolons in a series whose items have commas.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

// Faulty predication.

/** terms are a term, a faulty definition with is when or is where, and a sound one with a noun. */
const terms = [
  ["Democracy", "is when the people rule themselves", "is government by the people"],
  ["Inflation", "is when prices keep rising", "is a steady rise in prices"],
  ["A drought", "is when it does not rain for months", "is a long period without rain"],
  ["Irony", "is when the opposite of what you expect happens", "is a contrast between what is expected and what happens"],
  ["A monopoly", "is where one company controls a market", "is the control of a market by one company"],
  ["Photosynthesis", "is when plants make food from light", "is the process by which plants make food from light"],
  ["A filibuster", "is when a senator talks to delay a vote", "is a long speech made to delay a vote"],
  ["Erosion", "is where soil is worn away by wind and water", "is the wearing away of soil by wind and water"],
  ["A hypothesis", "is when you guess what an experiment will show", "is a testable prediction about what an experiment will show"],
  ["Plagiarism", "is when you use another writer's words as your own", "is the use of another writer's words as your own"],
  ["A recession", "is when the economy shrinks for two quarters", "is a fall in economic output lasting at least two quarters"],
  ["Satire", "is where a writer mocks folly to correct it", "is writing that mocks folly in order to correct it"],
  [
    "Gentrification",
    "is when wealthier people move into a poor area",
    "is the change of a poor area by the arrival of wealthier residents",
  ],
  ["A paradox", "is when a statement seems to contradict itself", "is a statement that seems to contradict itself"],
  ["An alibi", "is where you prove you were somewhere else", "is proof that a suspect was somewhere else"],
  ["A metaphor", "is when you call one thing another", "is a figure of speech that calls one thing another"],
  ["A famine", "is when there is not enough food in a region", "is a severe shortage of food in a region"],
  ["Migration", "is when animals move to another region each year", "is the seasonal movement of animals to another region"],
  ["A veto", "is when a leader blocks a law", "is a leader's power to block a law"],
  ["Evaporation", "is when water turns into vapor", "is the change of water into vapor"],
  ["A boycott", "is where people refuse to buy from a company", "is a refusal to buy from a company as a protest"],
  ["Censorship", "is when a government blocks what people may read", "is the control of what people may read or say"],
  ["A census", "is when a country counts its people", "is an official count of a country's people"],
  ["Hibernation", "is when animals sleep through the winter", "is a deep sleep in which some animals pass the winter"],
  ["A tariff", "is when a country taxes imported goods", "is a tax on imported goods"],
  ["Foreshadowing", "is where a writer hints at what will happen", "is a hint of what will happen later in a story"],
  ["An epidemic", "is when a disease spreads quickly through a community", "is the rapid spread of a disease through a community"],
  ["Inertia", "is when an object keeps doing what it is doing", "is the tendency of an object to keep its motion"],
  ["A strike", "is where workers refuse to work", "is a refusal by workers to work until demands are met"],
  ["Hyperbole", "is when a writer exaggerates for effect", "is exaggeration used for effect"],
] as const;

/** reasons are a claim and its reason, joined faultily with the reason is because and soundly. */
const reasons = [
  ["the team lost", "its best player was injured"],
  ["the bridge closed", "engineers found cracks in the supports"],
  ["prices rose", "the harvest failed"],
  ["the play was cancelled", "the lead actor fell ill"],
  ["the river flooded", "the snow melted early"],
  ["the store closed", "rents in the area doubled"],
  ["the election was delayed", "the ballots were not printed in time"],
  ["the experiment failed", "the samples were contaminated"],
  ["the treaty collapsed", "neither side trusted the other"],
  ["sales fell", "a cheaper rival appeared"],
] as const;

/** mismatches are a subject that cannot do what its verb says, the faulty sentence and its revision. */
const mismatches = [
  ["The purpose of the law protects renters from sudden evictions.", "The purpose of the law is to protect renters from sudden evictions."],
  ["The increase in crime was ignored by the mayor's speech.", "The mayor ignored the increase in crime in his speech."],
  ["Her job as a nurse is a hospital in the city.", "She works as a nurse at a hospital in the city."],
  ["The cause of the fire was from faulty wiring.", "The cause of the fire was faulty wiring."],
  ["By studying every night helped him pass the exam.", "Studying every night helped him pass the exam."],
  ["The role of a judge decides questions of law.", "The role of a judge is to decide questions of law."],
  ["The goal of the program teaches adults to read.", "The goal of the program is to teach adults to read."],
  ["Through hard work is how she became a surgeon.", "She became a surgeon through hard work."],
  ["The temperature of the oven was too hot.", "The oven was too hot."],
  ["The price of the tickets was too expensive.", "The tickets were too expensive."],
  ["The topic of the essay discusses climate migration.", "The essay discusses climate migration."],
  ["One reason for the delay was due to bad weather.", "One reason for the delay was bad weather."],
] as const;

const predicationLines = join([
  ...terms.map(([term, bad]) => `${term} ${bad}.|faulty: is when or is where`),
  ...terms.map(([term, , good]) => `${term} ${good}.|sound`),
  ...reasons.map(([claim, why]) => `The reason ${claim} is because ${why}.|faulty: the reason is because`),
  ...reasons.map(([claim, why]) => `The reason ${claim} is that ${why}.|sound`),
  ...reasons.map(([claim, why]) => `${claim[0]!.toUpperCase()}${claim.slice(1)} because ${why}.|sound`),
  ...mismatches.map(([bad]) => `${bad}|faulty: the subject cannot do the verb`),
  ...mismatches.map(([, good]) => `${good}|sound`),
]);

const predicationFixes = join([
  ...terms.map(
    ([term, bad, good]) =>
      `${term} ${bad}.|${term} ${good}.|${term} ${bad.replace(/^is (when|where)/u, "is the time when")}.|${term} ${bad.replace(/^is (when|where)/u, "is because")}.`,
  ),
  ...reasons.map(([claim, why]) => {
    const cap = `${claim[0]!.toUpperCase()}${claim.slice(1)}`;
    return `The reason ${claim} is because ${why}.|${cap} because ${why}.|The reason why ${claim} is because ${why}.|The reason ${claim} is due to because ${why}.`;
  }),
  ...mismatches.map(
    ([bad, good]) =>
      `${bad}|${good}|${bad.replace(/\.$/u, " in many ways.")}|${bad.replace(/^(The|One|By|Her|Through) /u, "Indeed, the ")}`,
  ),
]);

const definitionLines = join(
  terms.flatMap(([term, bad, good], i) => {
    const other = terms[(i + 5) % terms.length]!;
    return [`${term} ___.|${good}|${bad}|${other[2]}`];
  }),
);

const predication = topic("grammar", {
  id: "faulty-predication",
  title: ["Faulty Predication", "主谓搭配不当"],
  summary: [
    "Sentences whose predicate cannot belong to their subject, as in *Democracy is when…* and *The reason is because…*, and how to join them soundly.",
    "谓语与主语不能搭配的句子，如 *Democracy is when…* 和 *The reason is because…*，以及如何把它们改通顺。",
  ],
  after: ["mixed-constructions", "noun-clauses"],
  points: [
    label(
      "is-the-predicate-sound",
      ["Is the Predicate Sound", "谓语搭配是否恰当"],
      [
        "The predicate must say something the subject can be or do. After *is*, a noun subject needs a noun that renames it: *Democracy is government by the people*, not *Democracy is when the people rule*, since democracy is not a time or a place. *The reason… is* needs *that*, not *because*, since a reason is not itself a cause: *The reason it closed is that…*. And a purpose, a cause or a role cannot act: *The purpose of the law protects renters* says a purpose protects; the law does.",
        "谓语必须说主语能“是”或能“做”的事。在 *is* 之后，名词主语需要一个重新指称它的名词：*Democracy is government by the people*，而不是 *Democracy is when the people rule*，因为民主不是一个时间或地点。*The reason… is* 后面要用 *that* 而不是 *because*，因为理由本身不是原因：*The reason it closed is that…*。目的、原因或职责也不能发出动作：*The purpose of the law protects renters* 说的是目的在保护，其实保护的是法律。",
      ],
      ["Is the predication of this sentence sound?", "这个句子的主谓搭配恰当吗？"],
      predicationLines,
      {
        "faulty: is when or is where": L(
          "不当：is when 或 is where",
          "A thing or idea is defined by *when* or *where*, as if it were a time or a place; it needs a noun after *is*.",
          "用 *when* 或 *where* 来给一个事物或概念下定义，仿佛它是时间或地点；*is* 后面需要一个名词。",
          "The sentence does not define a thing with *is when* or *is where*.",
          "这个句子没有用 *is when* 或 *is where* 下定义。",
        ),
        "faulty: the reason is because": L(
          "不当：the reason is because",
          "*The reason… is because* says the same thing twice; after *the reason… is*, use *that*, or drop *the reason is*.",
          "*The reason… is because* 把同一个意思说了两遍；*the reason… is* 之后应该用 *that*，或者去掉 *the reason is*。",
          "The sentence does not join *the reason… is* to *because*.",
          "这个句子没有把 *the reason… is* 和 *because* 连用。",
        ),
        "faulty: the subject cannot do the verb": L(
          "不当：主语不能发出该动作",
          "The grammatical subject, such as a purpose, a cause or a price, cannot do or be what the verb says; the real actor is elsewhere in the sentence.",
          "语法上的主语，如目的、原因或价格，不能做或成为动词所说的事；真正的施动者在句子的别处。",
          "The subject can do or be what the verb says.",
          "主语能够做或成为动词所说的事。",
        ),
        sound: L(
          "恰当",
          "The subject can be or do what the predicate says, so the sentence holds together.",
          "主语能够成为或做出谓语所说的事，所以句子是通顺的。",
          "The predicate says something the subject cannot be or do.",
          "谓语说的是主语不能成为或做到的事。",
        ),
      },
    ),
    choose(
      "the-sound-revision",
      ["The Sound Revision", "恰当的修改"],
      [
        "To mend faulty predication, give *is* a noun that renames the subject, replace *because* after *the reason is* with *that* or drop *the reason is* altogether, or make the real actor the subject: *The law protects renters*, *The essay discusses migration*. Adding words around the faulty joint, or swapping one faulty joint for another, leaves it broken.",
        "修改主谓搭配不当的句子，可以在 *is* 后面放一个重新指称主语的名词，把 *the reason is* 之后的 *because* 换成 *that* 或干脆去掉 *the reason is*，或者让真正的施动者做主语：*The law protects renters*，*The essay discusses migration*。在不当的连接处周围加词，或把一种不当换成另一种不当，都修不好它。",
      ],
      ["Which revision makes the predication sound?", "哪个修改使主谓搭配恰当？"],
      predicationFixes,
      (right) => [
        `"${right}" lets the subject be or do what the predicate says, so the sentence holds together.`,
        `“${right}”让主语能够成为或做出谓语所说的事，句子因此通顺。`,
      ],
      [
        [
          '"{wrong}" adds or changes words but keeps the faulty joint between subject and predicate.',
          "“{wrong}”增改了词语，但主谓之间不当的连接仍在。",
        ],
        [
          '"{wrong}" rewords the sentence, but the predicate still does not fit the subject.',
          "“{wrong}”换了说法，但谓语仍然与主语不搭配。",
        ],
      ],
    ),
    choose(
      "completing-a-definition",
      ["Completing a Definition", "补全定义"],
      [
        "A definition in the form *X is ___* needs a noun phrase of the same kind as X, then what sets it apart: *A drought is **a long period** without rain*. A clause with *when* or *where* names a time or a place, not a kind of thing; and a sound definition of another term does not fit, however well written.",
        "*X is ___* 形式的定义需要一个与 X 同类的名词短语，再加上区别特征：*A drought is **a long period** without rain*。带 *when* 或 *where* 的从句说的是时间或地点，而不是一类事物；另一个术语的正确定义也不合适，无论写得多好。",
      ],
      ["Which ending completes the definition soundly?", "哪个结尾能恰当地补全这个定义？"],
      definitionLines,
      (right, shown) => [
        `"${shown.replace("___", right)}" names what kind of thing it is, then what sets it apart.`,
        `“${shown.replace("___", right)}”先说明它是哪一类事物，再说明它的区别特征。`,
      ],
      [
        [
          '"{wrong}" begins with *is when* or *is where*, as if the term were a time or a place.',
          "“{wrong}”以 *is when* 或 *is where* 开头，仿佛这个术语是时间或地点。",
        ],
        ['"{wrong}" defines a different term.', "“{wrong}”定义的是另一个术语。"],
      ],
    ),
  ],
});

// Illogical comparisons.

/** owned are an owner, the thing of theirs compared, another owner, and an adjective in the comparative. */
const owned = [
  ["Her salary", "a teacher", "higher"],
  ["The climate of Spain", "Norway", "warmer"],
  ["My grandfather's stories", "my uncle", "longer"],
  ["The population of Tokyo", "London", "larger"],
  ["The novel's ending", "the film", "sadder"],
  ["Our school's library", "the town", "bigger"],
  ["The cost of living in Paris", "Lisbon", "higher"],
  ["A cheetah's speed", "a horse", "greater"],
  ["The poems of Dickinson", "Whitman", "shorter"],
  ["The rules of chess", "checkers", "harder"],
  ["The economy of Germany", "Greece", "stronger"],
  ["This year's harvest", "last year", "smaller"],
  ["Her handwriting", "her brother", "neater"],
  ["The roads of Rome", "Athens", "busier"],
  ["My phone's battery", "my sister", "weaker"],
  ["The weather in Seattle", "Phoenix", "wetter"],
  ["Our team's defense", "the champions", "stronger"],
  ["The rivers of Brazil", "Spain", "longer"],
  ["A whale's heart", "an elephant", "heavier"],
  ["The streets of Venice", "Madrid", "narrower"],
  ["Her voice", "a professional singer", "clearer"],
  ["The price of bread in Oslo", "Warsaw", "higher"],
  ["This car's engine", "the old model", "quieter"],
  ["The paintings of Monet", "Picasso", "softer"],
  ["My dog's bark", "the neighbor's dog", "louder"],
  ["The winters of Canada", "Mexico", "colder"],
  ["The author's first book", "her rival", "better"],
  ["The language of the law", "everyday speech", "more formal"],
  ["A giraffe's neck", "a camel", "longer"],
  ["The schools of Finland", "many countries", "better funded"],
] as const;

/** fixedOther are the right revision of the second half of each comparison in owned. */
const fixedOther: Record<string, string> = {
  "a teacher": "a teacher's",
  Norway: "that of Norway",
  "my uncle": "my uncle's",
  London: "that of London",
  "the film": "the film's",
  "the town": "the town's",
  Lisbon: "that in Lisbon",
  "a horse": "a horse's",
  Whitman: "those of Whitman",
  checkers: "those of checkers",
  Greece: "that of Greece",
  "last year": "last year's",
  "her brother": "her brother's",
  Athens: "those of Athens",
  "my sister": "my sister's",
  Phoenix: "that in Phoenix",
  "the champions": "the champions'",
  Spain: "those of Spain",
  "an elephant": "an elephant's",
  Madrid: "those of Madrid",
  "a professional singer": "a professional singer's",
  Warsaw: "that in Warsaw",
  "the old model": "the old model's",
  Picasso: "those of Picasso",
  "the neighbor's dog": "that of the neighbor's dog",
  Mexico: "those of Mexico",
  "her rival": "her rival's",
  "everyday speech": "that of everyday speech",
  "a camel": "a camel's",
  "many countries": "those of many countries",
};

/** ranked are a member of a group and the group it is compared with. */
const ranked = [
  ["The Nile is longer than", "river in the world"],
  ["Maria runs faster than", "girl on the team"],
  ["Tokyo is larger than", "city in Japan"],
  ["This bridge is older than", "bridge in the city"],
  ["Our coach is stricter than", "coach in the league"],
  ["The cheetah is faster than", "land animal"],
  ["Mount Everest is higher than", "mountain on Earth"],
  ["Shakespeare is quoted more than", "English writer"],
] as const;

/** be is the verb that agrees with the head noun of a compared phrase. */
const be = (phrase: string) => ((phrase.split(" of ")[0]!.split(" ").at(-1) ?? "").endsWith("s") ? "are" : "is");

const comparisonLines = join([
  ...owned.map(([a, b, adj]) => `${a} ${be(a)} ${adj} than ${b}.|illogical: unlike things compared`),
  ...owned.map(([a, b, adj]) => `${a} ${be(a)} ${adj} than ${fixedOther[b]}.|logical`),
  ...ranked.map(([a, group]) => `${a} any ${group}.|illogical: compared with itself`),
  ...ranked.map(([a, group]) => `${a} any other ${group}.|logical`),
  "I like her more than my sister.|ambiguous: two meanings",
  "He trusts the coach more than his father.|ambiguous: two meanings",
  "She helped the new students more than her friends.|ambiguous: two meanings",
  "The judge respected the lawyer more than the witness.|ambiguous: two meanings",
  "Tom visits his grandmother more than his cousins.|ambiguous: two meanings",
  "The teacher praised Ana more than Leah.|ambiguous: two meanings",
  "I like her more than my sister does.|logical",
  "He trusts the coach more than he trusts his father.|logical",
  "She helped the new students more than her friends did.|logical",
  "The judge respected the lawyer more than she respected the witness.|logical",
  "Tom visits his grandmother more often than his cousins do.|logical",
  "The teacher praised Ana more than she praised Leah.|logical",
]);

const comparisonFixes = join([
  ...owned.map(
    ([a, b, adj]) =>
      `${a} ${be(a)} ${adj} than ${b}.|${a} ${be(a)} ${adj} than ${fixedOther[b]}.|${a} ${be(a)} much ${adj} than ${b}.|${a} ${be(a)} ${adj} than ${b} is.`,
  ),
  ...ranked.map(([a, group]) => `${a} any ${group}.|${a} any other ${group}.|${a} any ${group} at all.|${a} every ${group}.`),
]);

const comparisonChoices = join(owned.map(([a, b, adj]) => `${a} ${be(a)} ${adj} than ___.|${fixedOther[b]}|${b}|${b} is`));

const comparisons = topic("grammar", {
  id: "illogical-comparisons",
  title: ["Illogical Comparisons", "不合逻辑的比较"],
  summary: [
    "Comparisons of unlike things, of a thing with a group that includes it, and of two things left unclear, and how to make each compare what it means to.",
    "把不同类的事物相比、把事物与包含它的群体相比，以及两种理解都说得通的比较，以及如何让每个比较都比得恰当。",
  ],
  after: ["parallel-structure", "elliptical-clauses"],
  points: [
    label(
      "is-the-comparison-logical",
      ["Is the Comparison Logical", "比较是否合乎逻辑"],
      [
        "A comparison must set like beside like. *Her salary is higher than a teacher* compares a salary with a person; it needs *a teacher's* or *that of a teacher*. A thing compared with a group it belongs to needs *other*: *The Nile is longer than any **other** river*, or it is said to be longer than itself. And when a word is left out after *than*, the reader may not know which comparison is meant: *I like her more than my sister* could mean *more than my sister does* or *more than I like my sister*.",
        "比较必须拿同类与同类相比。*Her salary is higher than a teacher* 把薪水和人相比，需要改成 *a teacher's* 或 *that of a teacher*。把一个事物与它所属的群体相比，需要加 *other*：*The Nile is longer than any **other** river*，否则就等于说它比自己还长。*than* 之后省略了词语时，读者可能不知道比的是什么：*I like her more than my sister* 可以指 *more than my sister does*，也可以指 *more than I like my sister*。",
      ],
      ["Is this comparison logical?", "这个比较合乎逻辑吗？"],
      comparisonLines,
      {
        "illogical: unlike things compared": L(
          "不合逻辑：比较了不同类的事物",
          "One side is a thing, such as a salary or a climate, and the other is a person or place; the second needs a possessive or *that of*.",
          "一边是事物，如薪水或气候，另一边是人或地方；后者需要用所有格或 *that of*。",
          "Both sides of the comparison are things of the same kind.",
          "比较的两边是同一类事物。",
        ),
        "illogical: compared with itself": L(
          "不合逻辑：与自身相比",
          "The thing belongs to the group it is compared with, so without *other* it is compared with itself.",
          "这个事物属于与它相比的群体，没有 *other* 就等于和自己相比。",
          "The comparison does not set a thing against a group that includes it.",
          "这个比较没有把事物与包含它的群体相比。",
        ),
        "ambiguous: two meanings": L(
          "有歧义：两种理解",
          "A verb is left out after *than*, so the sentence could compare two people doing something or two people something is done to.",
          "*than* 之后省略了动词，句子既可以理解为比较两个做事的人，也可以理解为比较两个被做事的对象。",
          "Nothing is left out after *than* that could be read two ways.",
          "*than* 之后没有省略可能产生两种理解的成分。",
        ),
        logical: L(
          "合乎逻辑",
          "Like is compared with like, and only one meaning is possible.",
          "同类与同类相比，而且只有一种理解。",
          "The comparison sets unlike things together, compares a thing with itself, or can be read two ways.",
          "这个比较把不同类的事物放在一起、让事物与自身相比，或者有两种理解。",
        ),
      },
    ),
    choose(
      "the-logical-revision",
      ["The Logical Revision", "合乎逻辑的修改"],
      [
        "Revise by making the second side the same kind of thing as the first, with a possessive (*a teacher's*) or *that of* and *those of* (*that of Norway*), or by adding *other* or *else* when a thing is compared with its own group. Adding *much* or *any* changes how strong the comparison is, not what it compares.",
        "修改的方法是让第二边与第一边成为同类事物，用所有格（*a teacher's*）或 *that of*、*those of*（*that of Norway*）；当事物与它所属的群体相比时，加上 *other* 或 *else*。加上 *much* 或 *any* 只改变比较的程度，没有改变比较的对象。",
      ],
      ["Which revision makes the comparison logical?", "哪个修改使比较合乎逻辑？"],
      comparisonFixes,
      (right) => [`"${right}" compares like with like.`, `“${right}”拿同类与同类相比。`],
      [
        ['"{wrong}" adds a word but leaves the comparison illogical.', "“{wrong}”加了一个词，但比较仍然不合逻辑。"],
        [
          '"{wrong}" still compares the wrong things: unlike things, or a thing with a group that includes it.',
          "“{wrong}”比较的对象仍然不对：不同类的事物，或事物与包含它的群体。",
        ],
      ],
    ),
    choose(
      "completing-the-comparison",
      ["Completing the Comparison", "补全比较"],
      [
        "Choose the words after *than* that name the same kind of thing as the subject: *The climate of Spain is warmer than **that of Norway***, *A cheetah's speed is greater than **a horse's***.",
        "选出 *than* 之后与主语同类的词语：*The climate of Spain is warmer than **that of Norway***，*A cheetah's speed is greater than **a horse's***。",
      ],
      ["Which words complete the comparison logically?", "哪个选项能合乎逻辑地补全比较？"],
      comparisonChoices,
      (right, shown) => [`"${shown.replace("___", right)}" compares like with like.`, `“${shown.replace("___", right)}”拿同类与同类相比。`],
      [
        [
          '"{wrong}" names a person, place or whole group, not the same kind of thing as the subject.',
          "“{wrong}”说的是人、地方或整个群体，与主语不是同类事物。",
        ],
        [
          '"{wrong}" still sets the subject beside a person or place, not beside a thing of its kind.',
          "“{wrong}”仍然把主语与人或地方并列，而不是与同类事物相比。",
        ],
      ],
    ),
  ],
});

// Concession.

/** contrasts are a fact and what happened in spite of it, as a clause and as a noun phrase. */
const contrasts = [
  ["it rained all day", "the rain", "the match went ahead"],
  ["he was injured", "his injury", "he finished the race"],
  ["the tickets were expensive", "the high prices", "the hall was full"],
  ["she had little money", "her poverty", "she paid for her brother's school"],
  ["the road was icy", "the ice", "the bus arrived on time"],
  ["the evidence was weak", "the weak evidence", "the jury convicted him"],
  ["the critics hated it", "the critics' scorn", "the film made a fortune"],
  ["they were tired", "their tiredness", "they kept working"],
  ["the plan was risky", "the risk", "the council approved it"],
  ["the river was high", "the high water", "the ferry crossed safely"],
  ["she was nervous", "her nerves", "she gave a fine speech"],
  ["the house was old", "its age", "it sold quickly"],
  ["the sea was rough", "the rough sea", "the boat reached the island"],
  ["he had a fever", "his fever", "he sat the exam"],
  ["the shop was small", "its size", "it sold everything we needed"],
  ["the forecast was bad", "the bad forecast", "the picnic went ahead"],
  ["she was the youngest", "her youth", "she led the team"],
  ["the book was long", "its length", "I read it in a weekend"],
  ["the pay was low", "the low pay", "many people applied"],
  ["the hall was cold", "the cold", "the audience stayed until the end"],
  ["the town was poor", "its poverty", "it built a fine library"],
  ["the coach was strict", "his strictness", "the players liked him"],
  ["the film was slow", "its slow pace", "it won three awards"],
  ["the path was steep", "the steep path", "the children climbed it easily"],
  ["they were outnumbered", "the odds", "they won the battle"],
  ["the hotel was cheap", "the low price", "the rooms were clean"],
  ["the test was hard", "its difficulty", "most students passed"],
  ["the dog was old", "its age", "it chased the ball all day"],
  ["the lights went out", "the power cut", "the concert continued"],
  ["the city was crowded", "the crowds", "we found a quiet café"],
] as const;

const cap = (s: string) => `${s[0]!.toUpperCase()}${s.slice(1)}`;

const concessionChoices = join([
  ...contrasts.flatMap(([clause, phrase, result], i) =>
    i % 2 === 0
      ? [`___ ${clause}, ${result}.|Although|Despite|However`, `___ ${phrase}, ${result}.|Despite|Although|However`]
      : [`___ ${clause}, ${result}.|Even though|In spite of|Nevertheless`, `___ ${phrase}, ${result}.|In spite of|Though|Whereas`],
  ),
]);

const concessionCombos = join(
  contrasts.map(([clause, phrase, result], i) => {
    const right = i % 2 === 0 ? `Despite ${phrase}, ${result}.` : `Although ${clause}, ${result}.`;
    const form = i % 2 === 0 ? `Despite ${clause}, ${result}.` : `Although ${phrase}, ${result}.`;
    const logic = i % 2 === 0 ? `Because of ${phrase}, ${result}.` : `Because ${clause}, ${result}.`;
    return `${cap(clause)}. ${cap(result)}.|${right}|${form}|${logic}`;
  }),
);

/** pairs are two facts set side by side as a contrast, not a concession. */
const sideBySide = [
  ["Maria loves cities", "her brother prefers the country"],
  ["the north is wet", "the south is dry"],
  ["the old law protected owners", "the new one protects tenants"],
  ["some critics praised the novel", "others found it dull"],
  ["cats sleep most of the day", "dogs need long walks"],
  ["the first act is comic", "the second is tragic"],
] as const;

/** causes are a reason and what it led to. */
const causes = [
  ["it rained all day", "the match was cancelled"],
  ["he was injured", "he left the race"],
  ["the tickets were cheap", "the hall was full"],
  ["the road was icy", "the bus was late"],
  ["the evidence was strong", "the jury convicted him"],
  ["the critics loved it", "the film made a fortune"],
] as const;

const concessionLabels = join([
  ...contrasts.map(([clause, , result], i) => `${i % 2 === 0 ? "Although" : "Even though"} ${clause}, ${result}.|concession`),
  ...contrasts.map(([, phrase, result], i) => `${i % 2 === 0 ? "Despite" : "In spite of"} ${phrase}, ${result}.|concession`),
  ...sideBySide.map(([a, b], i) => `${cap(a)}, ${i % 2 === 0 ? "whereas" : "while"} ${b}.|contrast`),
  ...sideBySide.map(([a, b]) => `${cap(a)}; ${b}, on the other hand.|contrast`),
  ...causes.map(([why, result]) => `Because ${why}, ${result}.|cause`),
  ...causes.map(([why, result]) => `${cap(result)} because ${why}.|cause`),
]);

const concession = topic("grammar", {
  id: "clauses-and-phrases-of-concession",
  title: ["Clauses and Phrases of Concession", "让步从句与短语"],
  summary: [
    "Conceding a fact that might have stopped what happened: *although* and *even though* before a clause, *despite* and *in spite of* before a noun, and how concession differs from contrast and cause.",
    "承认一个本可能阻止事情发生的事实：*although* 和 *even though* 后接从句，*despite* 和 *in spite of* 后接名词，以及让步与对比、因果的区别。",
  ],
  after: ["subordination-for-emphasis"],
  covers: ["subordination-for-emphasis"],
  points: [
    choose(
      "clause-or-noun",
      ["Clause or Noun", "从句还是名词"],
      [
        "*Although*, *even though* and *though* are conjunctions: a clause with a subject and verb follows them, *Although it rained, …*. *Despite* and *in spite of* are prepositions: a noun phrase follows them, *Despite the rain, …*, or a gerund, *Despite being tired, …*. *However* and *nevertheless* are adverbs that join two sentences, not a clause to a sentence.",
        "*Although*、*even though* 和 *though* 是连词，后面接有主语和谓语的从句：*Although it rained, …*。*Despite* 和 *in spite of* 是介词，后面接名词短语：*Despite the rain, …*，或动名词：*Despite being tired, …*。*However* 和 *nevertheless* 是连接两个句子的副词，不能把从句连到句子上。",
      ],
      ["Which word or phrase begins the sentence correctly?", "哪个词或短语能正确地开始这个句子？"],
      concessionChoices,
      (right, shown) => [
        `"${shown.replace("___", right)}" matches the connector to what follows it.`,
        `“${shown.replace("___", right)}”中的连接词与后面的成分相配。`,
      ],
      [
        [
          '"{wrong}" is the other kind: a preposition before a clause, or a conjunction before a noun.',
          "“{wrong}”词类不对：介词后接了从句，或连词后接了名词。",
        ],
        [
          '"{wrong}" is an adverb or a word of contrast, which cannot begin this sentence.',
          "“{wrong}”是副词或表对比的词，不能这样开始这个句子。",
        ],
      ],
    ),
    label(
      "concession-contrast-or-cause",
      ["Concession, Contrast or Cause", "让步、对比还是因果"],
      [
        "A **concession** admits a fact that would lead us to expect the opposite of what happened: *Although it rained, the match went ahead*. A **contrast** sets two facts side by side, neither working against the other: *The north is wet, whereas the south is dry*. A **cause** says why it happened: *Because it rained, the match was moved*.",
        "**让步**承认一个本会让人预料相反结果的事实：*Although it rained, the match went ahead*。**对比**把两个事实并列，二者并不相互抵触：*The north is wet, whereas the south is dry*。**因果**说明事情发生的原因：*Because it rained, the match was moved*。",
      ],
      ["What relation does this sentence express?", "这个句子表达的是哪种关系？"],
      concessionLabels,
      {
        concession: L(
          "让步",
          "The first part is a fact that might have stopped the second, which happened anyway.",
          "第一部分是本可能阻止第二部分的事实，但第二部分仍然发生了。",
          "Nothing in the sentence happens in spite of an obstacle.",
          "句子里没有什么事是在有阻碍的情况下仍然发生的。",
        ),
        contrast: L(
          "对比",
          "Two facts are set side by side to show a difference; neither works against the other.",
          "两个事实并列以显示差别，二者互不抵触。",
          "The sentence does not set two independent facts side by side.",
          "这个句子没有把两个独立的事实并列。",
        ),
        cause: L(
          "因果",
          "The first part says why the second happened.",
          "第一部分说明第二部分发生的原因。",
          "The first part is not the reason for the second.",
          "第一部分不是第二部分的原因。",
        ),
      },
    ),
    choose(
      "combining-with-a-concession",
      ["Combining with a Concession", "用让步合并句子"],
      [
        "To join a fact and what happened in spite of it into one sentence, put the fact in a clause after *although* or a noun phrase after *despite*, and keep the result as the main clause. A sentence that uses the wrong form after the connector, or turns the obstacle into a cause, changes the grammar or the meaning.",
        "把一个事实和不顾这个事实仍然发生的事合成一句，可以把事实放在 *although* 后面的从句里，或 *despite* 后面的名词短语里，并把结果作为主句。连接词后的形式用错，或把阻碍写成原因，都会改变语法或意思。",
      ],
      ["Which sentence joins the two into a correct concession?", "哪个句子把两句正确地合成了让步句？"],
      concessionCombos,
      (right) => [
        `"${right}" puts the obstacle in the concession and keeps the result as the main clause.`,
        `“${right}”把阻碍放在让步部分，结果作为主句。`,
      ],
      [
        [
          '"{wrong}" uses the wrong form after the connector: a clause after a preposition or a noun after a conjunction.',
          "“{wrong}”连接词后的形式用错了：介词后接从句，或连词后接名词。",
        ],
        [
          '"{wrong}" turns the obstacle into a cause, which says the opposite of what happened.',
          "“{wrong}”把阻碍写成了原因，意思与实际相反。",
        ],
      ],
    ),
  ],
});

// Stacks of nouns.

/** stacks are a stack of nouns, its unstacked revision, and its head noun. */
const stacks = [
  ["the student loan repayment policy review", "the review of the policy on repaying student loans", "review"],
  ["the city park maintenance budget cuts", "the cuts to the budget for maintaining city parks", "cuts"],
  ["the hospital patient safety training program", "the program that trains hospital staff in patient safety", "program"],
  ["the water quality testing schedule changes", "the changes to the schedule for testing water quality", "changes"],
  ["the school lunch nutrition standards debate", "the debate over nutrition standards for school lunches", "debate"],
  ["the bridge repair contract bidding process", "the process of bidding for the contract to repair the bridge", "process"],
  ["the employee overtime pay calculation error", "the error in calculating employees' overtime pay", "error"],
  ["the river flood warning system upgrade", "the upgrade to the system that warns of river floods", "upgrade"],
  ["the library book return policy update", "the update to the library's policy on returning books", "update"],
  ["the youth soccer league registration fee increase", "the increase in the fee for registering in the youth soccer league", "increase"],
  ["the airport security screening wait times", "the time travelers wait for security screening at the airport", "times"],
  ["the climate change research funding decision", "the decision on funding research into climate change", "decision"],
  ["the public transport ticket price review", "the review of the prices of public transport tickets", "review"],
  ["the hospital emergency room waiting times", "the time patients wait in the hospital's emergency room", "times"],
  ["the school bus safety inspection report", "the report on inspecting the safety of school buses", "report"],
  ["the forest fire prevention campaign launch", "the launch of the campaign to prevent forest fires", "launch"],
  ["the city council budget vote delay", "the delay in the city council's vote on the budget", "delay"],
  ["the student exam results release date", "the date for releasing the results of students' exams", "date"],
  ["the town water pipe replacement plan", "the plan to replace the town's water pipes", "plan"],
  ["the online banking password reset process", "the process for resetting passwords for online banking", "process"],
  ["the factory worker health insurance costs", "the costs of health insurance for factory workers", "costs"],
  ["the national park visitor fee changes", "the changes to the fees for visitors to national parks", "changes"],
  ["the museum ticket discount scheme review", "the review of the scheme that discounts museum tickets", "review"],
  ["the road accident data collection method", "the method for collecting data on road accidents", "method"],
  ["the government housing loan approval rules", "the rules for approving government loans for housing", "rules"],
  ["the coastal erosion protection wall project", "the project to build a wall that protects the coast from erosion", "project"],
  ["the teacher training course enrollment numbers", "the number of people enrolling in courses that train teachers", "numbers"],
  ["the airport noise complaint response time", "the time the airport takes to respond to complaints about noise", "time"],
  ["the farm animal welfare law reform", "the reform of the law on the welfare of farm animals", "reform"],
  ["the child car seat safety rules", "the safety rules for children's car seats", "rules"],
] as const;

/** fine are compound nouns of two or three words that read clearly. */
const fine = [
  "the school library",
  "a city council meeting",
  "the bus station",
  "a science teacher",
  "the water supply",
  "a tax return",
  "the football season",
  "a history exam",
  "the health service",
  "a train ticket",
  "the job market",
  "a weather report",
];

/** was is the verb that agrees with a head noun: were after a plural. */
const was = (head: string) => (head.endsWith("s") ? "were" : "was");

const stackLabels = join([
  ...stacks.map(([s, , head]) => `${cap(s)} ${was(head)} announced.|stacked: hard to unpack`),
  ...stacks.map(([, u, head]) => `${cap(u)} ${was(head)} announced.|clear`),
  ...fine.map((f) => `${cap(f)} was mentioned.|clear`),
]);

const stackFixes = join(
  stacks.map(([s, u, head], i) => {
    const other = stacks[(i + 4) % stacks.length]!;
    const words = s.replace(/^the /u, "").split(" ");
    const moved = words[0]!;
    const shuffled = `the ${[...words.slice(1), moved].join(" ")}`;
    return `${cap(s)} ${was(head)} announced.|${cap(u)} ${was(head)} announced.|${cap(shuffled)} ${was(moved)} announced.|${cap(other[1])} ${was(other[2])} announced.`;
  }),
);

const headLines = join(
  stacks.map(([s, , head]) => {
    const words = s.replace(/^the /u, "").split(" ");
    return `In "${s}", which noun is the thing actually meant?|${head}|${words[0]!}|${words.at(-2)!}`;
  }),
);

const nounStacks = topic("grammar", {
  id: "stacks-of-nouns",
  title: ["Stacks of Nouns", "名词堆叠"],
  summary: [
    "Strings of nouns used as modifiers, as in *the student loan repayment policy review*, how to find the noun they all describe, and how to unpack them with prepositions and verbs.",
    "用作修饰语的一串名词，如 *the student loan repayment policy review*，如何找出它们共同修饰的中心名词，以及如何用介词和动词把它们拆开。",
  ],
  after: ["jargon-and-plain-language"],
  points: [
    choose(
      "finding-the-head",
      ["Finding the Head", "找出中心词"],
      [
        "In a stack of nouns, every noun but the last describes the one after it, and the **last** noun is the thing actually meant, the head: in *the bridge repair contract*, the head is *contract*. Readers must hold all the others in mind until they reach it, which is why long stacks are hard to read.",
        "在一串名词中，除最后一个外，每个名词都修饰它后面的那个，**最后**一个名词才是真正所指的事物，即中心词：在 *the bridge repair contract* 中，中心词是 *contract*。读者必须把前面的名词都记在脑中，直到读到中心词，所以长的名词堆叠很难读。",
      ],
      ["Which noun is the head of the stack?", "这串名词的中心词是哪一个？"],
      headLines,
      (right) => [`*${right}* is the last noun, which all the others describe.`, `*${right}* 是最后一个名词，其他名词都在修饰它。`],
      [
        [
          "*{wrong}* comes first and describes the nouns after it; it is not the thing meant.",
          "*{wrong}* 在最前面，修饰后面的名词，不是所指的事物。",
        ],
        ["*{wrong}* is in the middle of the stack; it describes the noun after it.", "*{wrong}* 在中间，修饰它后面的名词。"],
      ],
    ),
    label(
      "stacked-or-clear",
      ["Stacked or Clear", "堆叠还是清楚"],
      [
        "Two or three nouns together are normal English: *the school library*, *a city council meeting*. A stack of four or more makes the reader decode it backward, and often hides who does what to what: *the employee overtime pay calculation error*. Unpacked, it reads forward: *the error in calculating employees' overtime pay*.",
        "两三个名词连用是正常的英语：*the school library*，*a city council meeting*。四个或更多名词堆在一起，读者就得倒着解读，而且常常看不出谁对什么做了什么：*the employee overtime pay calculation error*。拆开之后可以顺着读：*the error in calculating employees' overtime pay*。",
      ],
      ["Is this phrase a hard-to-read stack, or clear?", "这个短语是难读的名词堆叠，还是清楚的？"],
      stackLabels,
      {
        "stacked: hard to unpack": L(
          "堆叠：难以拆解",
          "Four or more nouns are stacked before the head, so the reader must decode them backward.",
          "中心词前堆了四个或更多名词，读者只能倒着解读。",
          "The phrase does not stack four or more nouns before its head.",
          "这个短语没有在中心词前堆四个或更多名词。",
        ),
        clear: L(
          "清楚",
          "The phrase is a short compound or uses prepositions and verbs, so it reads forward.",
          "这个短语是简短的复合名词，或用了介词和动词，可以顺着读。",
          "Four or more nouns are stacked before the head.",
          "中心词前堆了四个或更多名词。",
        ),
      },
    ),
    choose(
      "unpacking-a-stack",
      ["Unpacking a Stack", "拆开名词堆叠"],
      [
        "Unpack a stack by starting from the head and working backward, turning the nouns before it into phrases with *of*, *for*, *on* or *to*, and nouns of action into verbs: *the water quality testing schedule changes* becomes *the changes to the schedule for testing water quality*. Moving the nouns around inside the stack, or naming a different thing, does not help.",
        "拆开名词堆叠时，从中心词开始倒着往前，把前面的名词变成带 *of*、*for*、*on* 或 *to* 的短语，把表示动作的名词变成动词：*the water quality testing schedule changes* 变成 *the changes to the schedule for testing water quality*。在堆叠内部调换名词的位置，或者说成另一件事，都无济于事。",
      ],
      ["Which revision unpacks the stack and keeps its meaning?", "哪个修改拆开了名词堆叠并保留了原意？"],
      stackFixes,
      (right) => [`"${right}" starts from the head and unpacks the nouns before it.`, `“${right}”从中心词出发，拆开了它前面的名词。`],
      [
        [
          '"{wrong}" only moves the nouns around inside the stack, which changes its head and its meaning.',
          "“{wrong}”只是在堆叠内部调换名词，改变了中心词和意思。",
        ],
        ['"{wrong}" is clear, but it names a different thing.', "“{wrong}”很清楚，但说的是另一件事。"],
      ],
    ),
  ],
});

// Semicolons in a series.

/** places are a city and its region, for a series whose items have commas. */
const places = [
  ["Austin", "Texas"],
  ["Lyon", "France"],
  ["Osaka", "Japan"],
  ["Porto", "Portugal"],
  ["Cork", "Ireland"],
  ["Perth", "Australia"],
  ["Quebec City", "Canada"],
  ["Kraków", "Poland"],
  ["Seville", "Spain"],
  ["Munich", "Germany"],
  ["Bergen", "Norway"],
  ["Cusco", "Peru"],
  ["Hanoi", "Vietnam"],
  ["Nairobi", "Kenya"],
  ["Adelaide", "Australia"],
] as const;

/** people are a person and their role. */
const people = [
  ["Dr. Lin", "the surgeon"],
  ["Ms. Okafor", "the principal"],
  ["Mr. Ruiz", "the coach"],
  ["Ana Silva", "our captain"],
  ["Tom Hale", "the new mayor"],
  ["Sara Khan", "a local author"],
  ["Ravi Rao", "the treasurer"],
  ["Lena Berg", "the chief engineer"],
  ["Omar Haddad", "the head nurse"],
  ["Mei Tanaka", "the band's drummer"],
  ["Dr. Patel", "the dentist"],
  ["Ms. Novak", "the librarian"],
  ["Jon Reyes", "the team doctor"],
  ["Ines Duarte", "the school's chef"],
  ["Mr. Mensah", "the head of science"],
] as const;

const triples = <T>(items: readonly T[]): (readonly [T, T, T])[] =>
  items.map((a, i) => [a, items[(i + 1) % items.length]!, items[(i + 3) % items.length]!] as const);

const seriesItems = [
  ...triples(places).map(([a, b, c]) => ({
    lead: "The tour visits",
    items: [`${a[0]}, ${a[1]}`, `${b[0]}, ${b[1]}`, `${c[0]}, ${c[1]}`],
  })),
  ...triples(people).map(([a, b, c]) => ({
    lead: "The speakers are",
    items: [`${a[0]}, ${a[1]}`, `${b[0]}, ${b[1]}`, `${c[0]}, ${c[1]}`],
  })),
];

const series = (lead: string, items: readonly string[], sep: string) => `${lead} ${items.slice(0, -1).join(sep)}${sep}and ${items.at(-1)}.`;

const seriesChoices = join(
  seriesItems.map(({ lead, items }) => {
    const right = series(lead, items, "; ");
    const commas = series(lead, items, ", ");
    const colons = `${lead}: ${items.slice(0, -1).join(": ")}: and ${items.at(-1)}.`;
    return `${lead} ${items[0]} … ${items.at(-1)}|${right}|${commas}|${colons}`;
  }),
);

const simpleSeries = [
  "We packed bread, cheese and apples.",
  "The flag is red, white and blue.",
  "She speaks French, Spanish and Arabic.",
  "The museum, the park and the zoo were closed.",
  "He wrote poems, stories and one long novel.",
  "The menu offers soup, salad and fish.",
];

const seriesLabels = join([
  ...seriesItems.map(({ lead, items }) => `${series(lead, items, "; ")}|correct`),
  ...seriesItems.map(({ lead, items }) => `${series(lead, items, ", ")}|needs semicolons`),
  ...simpleSeries.map((s) => `${s}|correct`),
  ...simpleSeries.map((s) => `${s.replace(/, /gu, "; ")}|semicolons not needed`),
]);

/** independents are pairs of closely related clauses, the second turned with however or therefore. */
const independents = [
  ["The road was closed", "however", "we found another way"],
  ["The data were incomplete", "therefore", "the study was repeated"],
  ["The ship was late", "consequently", "the cargo spoiled"],
  ["The law passed", "nevertheless", "few people obeyed it"],
  ["The price fell", "as a result", "sales doubled"],
  ["The witness lied", "moreover", "she hid the evidence"],
  ["The bridge was old", "however", "it carried heavy trucks"],
  ["The vote was close", "therefore", "a recount was ordered"],
  ["The museum was crowded", "however", "we saw every painting"],
  ["The engine failed", "consequently", "the plane turned back"],
  ["The team trained hard", "nevertheless", "it lost the final"],
  ["The rain stopped", "therefore", "the game resumed"],
  ["The town grew quickly", "as a result", "new schools were built"],
  ["The report was late", "moreover", "it was full of errors"],
  ["The rent was high", "however", "the flat was tiny"],
  ["The river rose", "consequently", "the farms were flooded"],
  ["The singer was ill", "nevertheless", "she gave the concert"],
  ["The bank cut its rates", "as a result", "more people borrowed"],
  ["The plan was cheap", "moreover", "it was quick to build"],
  ["The map was old", "therefore", "we got lost twice"],
  ["The film was long", "however", "nobody left early"],
  ["The factory closed", "consequently", "hundreds lost their jobs"],
  ["The evidence was clear", "nevertheless", "the jury was divided"],
  ["The roads were icy", "as a result", "schools stayed closed"],
  ["The hotel was cheap", "moreover", "it was close to the beach"],
  ["The coach was ill", "therefore", "his assistant led the team"],
  ["The question was simple", "however", "few people answered it"],
  ["The storm grew stronger", "consequently", "the ferry was cancelled"],
  ["The offer was generous", "nevertheless", "she turned it down"],
  ["The wall was weak", "as a result", "it collapsed in the storm"],
] as const;

const adverbChoices = join(independents.map(([a, adv, b]) => `${a} ___ ${adv}, ${b}.|;|,|:`));

const semicolons = topic("grammar", {
  id: "semicolons-in-complex-series",
  title: ["Semicolons in Complex Series", "复杂列举中的分号"],
  summary: [
    "Semicolons between the items of a series when the items have commas of their own, and before a conjunctive adverb such as *however* that joins two clauses.",
    "当列举的各项内部本身带有逗号时，用分号隔开各项；以及在连接两个分句的连接副词（如 *however*）之前使用分号。",
  ],
  after: ["semicolons-and-colons", "commas-with-nonessential-elements"],
  points: [
    choose(
      "punctuating-the-series",
      ["Punctuating the Series", "给列举加标点"],
      [
        "When the items of a series contain commas, as *Austin, Texas* or *Dr. Lin, the surgeon* do, commas between the items would leave the reader unable to tell where one item ends: separate the items with **semicolons** and keep the commas inside them. Colons do not separate items; a colon may only introduce the whole list.",
        "当列举的各项内部带有逗号时，如 *Austin, Texas* 或 *Dr. Lin, the surgeon*，各项之间再用逗号，读者就分不清一项在哪里结束：各项之间用**分号**隔开，项内保留逗号。冒号不能用来隔开各项，它只能引出整个列表。",
      ],
      ["Which sentence punctuates the series correctly?", "哪个句子的列举标点正确？"],
      seriesChoices,
      (right) => [
        `"${right}" puts semicolons between the items and keeps the commas inside them.`,
        `“${right}”在各项之间用了分号，项内保留了逗号。`,
      ],
      [
        [
          '"{wrong}" uses commas both inside and between the items, so the reader cannot tell where an item ends.',
          "“{wrong}”项内和项间都用逗号，读者分不清每一项在哪里结束。",
        ],
        ['"{wrong}" uses colons between the items; a colon can only introduce a list.', "“{wrong}”在各项之间用了冒号；冒号只能引出列表。"],
      ],
    ),
    label(
      "semicolons-or-commas",
      ["Semicolons or Commas", "分号还是逗号"],
      [
        "Use semicolons in a series only when the items have commas inside them. A series of simple items takes commas: *bread, cheese and apples*. Semicolons there are wrong, and commas in a series of items that have their own commas are confusing.",
        "只有当各项内部带有逗号时，才在列举中使用分号。简单的列举用逗号：*bread, cheese and apples*。这种情况下用分号是错的；而各项内部带逗号的列举仍用逗号隔开，会让人困惑。",
      ],
      ["Is the series punctuated correctly?", "这个列举的标点正确吗？"],
      seriesLabels,
      {
        correct: L(
          "正确",
          "Simple items are separated by commas, and items with commas inside are separated by semicolons.",
          "简单的各项用逗号隔开，内部带逗号的各项用分号隔开。",
          "The marks between the items do not fit what the items contain.",
          "各项之间的标点与项的内容不相配。",
        ),
        "needs semicolons": L(
          "需要分号",
          "The items have commas inside them, so commas between them leave the reader unsure where each item ends.",
          "各项内部带有逗号，项间再用逗号，读者就不清楚每一项在哪里结束。",
          "The items have no commas inside them, or semicolons already separate them.",
          "各项内部没有逗号，或者已经用分号隔开。",
        ),
        "semicolons not needed": L(
          "不需要分号",
          "The items are simple and have no commas inside them, so commas are enough.",
          "各项很简单，内部没有逗号，用逗号就够了。",
          "The series does not use semicolons between simple items.",
          "这个列举没有在简单的各项之间使用分号。",
        ),
      },
    ),
    choose(
      "before-a-conjunctive-adverb",
      ["Before a Conjunctive Adverb", "连接副词之前"],
      [
        "Words such as *however*, *therefore*, *consequently*, *nevertheless*, *moreover* and *as a result* are adverbs, not conjunctions: they cannot join two clauses with a comma alone. Put a **semicolon** before them and a comma after: *The road was closed; however, we found another way.* A comma there makes a comma splice; a colon would promise an explanation that does not follow.",
        "*however*、*therefore*、*consequently*、*nevertheless*、*moreover* 和 *as a result* 等词是副词，不是连词：不能只用逗号把两个分句连起来。在它们前面用**分号**，后面用逗号：*The road was closed; however, we found another way.* 用逗号会造成逗号粘连；用冒号则意味着后面是解释，与实际不符。",
      ],
      ["Which mark belongs before the adverb?", "副词前面应该用哪个标点？"],
      adverbChoices,
      (_right, shown) => [
        `"${shown.replace(" ___ ", "; ")}" joins two clauses with a semicolon before the adverb.`,
        `“${shown.replace(" ___ ", "; ")}”在副词前用分号连接两个分句。`,
      ],
      [
        [
          "A comma before the adverb joins two clauses with a comma alone, a comma splice.",
          "副词前用逗号，就是只用逗号连接两个分句，造成逗号粘连。",
        ],
        [
          "A colon promises that an explanation or list follows, which is not what the adverb does.",
          "冒号表示后面是解释或列表，而这个副词并非如此。",
        ],
      ],
    ),
  ],
});

/** grammarTopics12b are the grammar topics of grade 12 added for writing at college level. */
export const grammarTopics12b: readonly TopicDef[] = [predication, comparisons, concession, nounStacks, semicolons];
