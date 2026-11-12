// Grade 12: grammar and style: inverted conditionals, ambiguous pronoun reference, jargon and plain language, and the
// eighth set of commonly confused words.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const inverted = topic("grammar", {
  id: "inverted-conditionals",
  title: ["Inverted Conditionals", "倒装条件句"],
  summary: [
    "Conditions without if, made by putting had, were or should before the subject, as in Had I known, Were it true and Should you need help.",
    "不用 if 的条件句：把 had、were 或 should 放到主语前面，如 Had I known、Were it true 和 Should you need help。",
  ],
  after: ["conditional-sentences", "the-subjunctive-in-wishes-and-conditions"],
  points: [
    label(
      "which-condition-is-this",
      ["Which Condition Is This", "这是哪种条件"],
      [
        "Formal English can drop *if* and put the auxiliary before the subject. **Had** + subject + past participle is an **unreal past** condition: *Had I known, I would have come* means *If I had known*. **Were** + subject is an **unreal present** condition: *Were she here, she would help* means *If she were here*. **Should** + subject is an **unlikely future** condition: *Should you need help, call me* means *If you happen to need help*. The rest of the sentence follows the usual pattern for each kind.",
        "正式英语可以省去 *if*，把助动词放到主语前面。**Had** + 主语 + 过去分词表示**与过去事实相反**的条件：*Had I known, I would have come* 等于 *If I had known*。**Were** + 主语表示**与现在事实相反**的条件：*Were she here, she would help* 等于 *If she were here*。**Should** + 主语表示**未来不大可能**的条件：*Should you need help, call me* 等于 *If you happen to need help*。句子其余部分按各类条件句的通常形式。",
      ],
      ["What kind of condition does this sentence state?", "这个句子表达的是哪种条件？"],
      `
        Had I known about the storm, I would have stayed home.|an unreal past condition
        Had the bridge been finished, the army could have crossed.|an unreal past condition
        Had she listened to her doctor, she would have recovered sooner.|an unreal past condition
        Had the letter arrived on time, the war might have been avoided.|an unreal past condition
        Had they saved more money, they could have bought the farm.|an unreal past condition
        Had the jury heard that evidence, the verdict would have changed.|an unreal past condition
        Had we left earlier, we would not have missed the train.|an unreal past condition
        Had the king listened, the revolt would never have begun.|an unreal past condition
        Had I studied harder, I would have passed the test.|an unreal past condition
        Had the dam held, the village would have survived.|an unreal past condition
        Had he told the truth, nobody would have been punished.|an unreal past condition
        Were I the mayor, I would build more parks.|an unreal present condition
        Were it not for the rain, the crops would fail.|an unreal present condition
        Were she here now, she would know what to do.|an unreal present condition
        Were the tickets cheaper, more families would come.|an unreal present condition
        Were I in your place, I would apologize.|an unreal present condition
        Were the law fairer, fewer people would break it.|an unreal present condition
        Were he taller, he could reach the shelf.|an unreal present condition
        Were the city to ban cars, the air would be cleaner.|an unreal present condition
        Were we to lose this game, we would be out of the cup.|an unreal present condition
        Were money no object, I would travel the world.|an unreal present condition
        Should you need anything, please ring the bell.|an unlikely future condition
        Should the alarm sound, leave the building at once.|an unlikely future condition
        Should it rain tomorrow, the match will be moved indoors.|an unlikely future condition
        Should the price rise again, we will look elsewhere.|an unlikely future condition
        Should you see Maria, tell her I called.|an unlikely future condition
        Should the plan fail, we have a second one ready.|an unlikely future condition
        Should any problems arise, contact the office.|an unlikely future condition
        Should the river flood, the road will be closed.|an unlikely future condition
        Should you change your mind, the offer still stands.|an unlikely future condition
        Should the power go out, use the stairs.|an unlikely future condition
      `,
      {
        "an unreal past condition": L(
          "与过去事实相反的条件",
          "It begins with had and a past participle: the condition did not happen in the past, as in If I had known.",
          "句子以 had 加过去分词开头：这个条件在过去并未发生，相当于 If I had known。",
          "It does not begin with had and a past participle, so it is not about a past that did not happen.",
          "句子不是以 had 加过去分词开头，所以不是在说一个没有发生的过去。",
        ),
        "an unreal present condition": L(
          "与现在事实相反的条件",
          "It begins with were before the subject: the condition is not true now, or is imagined, as in If I were.",
          "句子以放在主语前的 were 开头：这个条件现在并不成立，或只是设想，相当于 If I were。",
          "It does not begin with were before the subject, so it is not an imagined present.",
          "句子不是以放在主语前的 were 开头，所以不是设想的现在。",
        ),
        "an unlikely future condition": L(
          "未来不大可能的条件",
          "It begins with should before the subject: the condition could happen but is not expected, as in If you happen to.",
          "句子以放在主语前的 should 开头：这个条件可能发生，但并不被预期，相当于 If you happen to。",
          "It does not begin with should before the subject, so it is not an unlikely future.",
          "句子不是以放在主语前的 should 开头，所以不是不大可能的未来。",
        ),
      },
    ),
    choose(
      "the-inversion-that-fits",
      ["The Inversion That Fits", "合适的倒装"],
      [
        "To invert a condition, drop *if* and move the auxiliary in front of the subject; keep the rest of the clause as it was. *If I had known* becomes *Had I known* (not *Had I knew*). *If she were here* becomes *Were she here* (not *Was she here*, which is a question). *If you should need help* becomes *Should you need help*. A negative keeps *not* after the subject: *Had I not seen it*, never *Hadn't I seen it*.",
        "要把条件句倒装，就去掉 *if*，把助动词移到主语前，从句其余部分保持不变。*If I had known* 变成 *Had I known*（不是 *Had I knew*）。*If she were here* 变成 *Were she here*（不是 *Was she here*，那是疑问句）。*If you should need help* 变成 *Should you need help*。否定时 *not* 放在主语之后：*Had I not seen it*，绝不能说 *Hadn't I seen it*。",
      ],
      ["Which inverted condition says the same as the if-clause?", "哪个倒装条件与 if 从句意思相同？"],
      `
        If I had known the answer|Had I known the answer|Had I knew the answer|If had I known the answer
        If she were the captain|Were she the captain|Was she the captain|If were she the captain
        If you should need a ride|Should you need a ride|Should you needed a ride|If should you need a ride
        If the war had ended sooner|Had the war ended sooner|Had the war end sooner|Did the war end sooner
        If it were not for her help|Were it not for her help|Was it not for her help|Weren't it for her help
        If they had not lost the map|Had they not lost the map|Hadn't they lost the map|Had not they lost the map
        If you should see the manager|Should you see the manager|Should you saw the manager|Do you see the manager
        If I were you|Were I you|Was I you|Am I you
        If we had taken the train|Had we taken the train|Had we took the train|Have we taken the train
        If the shop should close early|Should the shop close early|Should the shop closes early|Does the shop close early
        If he had not warned us|Had he not warned us|Hadn't he warned us|Had not he warned us
        If the rules were clearer|Were the rules clearer|Was the rules clearer|Are the rules clearer
        If the plan should fail|Should the plan fail|Should the plan failed|Does the plan fail
        If the police had arrived sooner|Had the police arrived sooner|Had the police arrive sooner|Did the police arrive sooner
        If the earth were flat|Were the earth flat|Was the earth flat|Is the earth flat
        If you should have any questions|Should you have any questions|Should you had any questions|Do you have any questions
        If the ship had carried more lifeboats|Had the ship carried more lifeboats|Had the ship carry more lifeboats|Did the ship carry more lifeboats
        If I were in charge|Were I in charge|Was I in charge|Am I in charge
        If anyone should call|Should anyone call|Should anyone called|Does anyone call
        If the team had trained harder|Had the team trained harder|Had the team train harder|Has the team trained harder
        If the city were to build a stadium|Were the city to build a stadium|Was the city to build a stadium|Is the city to build a stadium
        If you should find my keys|Should you find my keys|Should you found my keys|Did you find my keys
        If the queen had signed the treaty|Had the queen signed the treaty|Had the queen sign the treaty|Did the queen sign the treaty
        If it were not raining|Were it not raining|Was it not raining|Isn't it raining
        If they should refuse|Should they refuse|Should they refused|Do they refuse
        If she had not missed the bus|Had she not missed the bus|Hadn't she missed the bus|Had not she missed the bus
        If the price were lower|Were the price lower|Was the price lower|Is the price lower
        If the flight should be delayed|Should the flight be delayed|Should the flight is delayed|Is the flight delayed
        If we had known the truth|Had we known the truth|Had we knew the truth|Have we known the truth
        If he were more patient|Were he more patient|Was he more patient|Is he more patient
        If the storm should reach the coast|Should the storm reach the coast|Should the storm reaches the coast|Does the storm reach the coast
      `,
      (right) => [
        `"${right}" drops if and puts the auxiliary before the subject, keeping the rest of the clause unchanged.`,
        `“${right}”去掉了 if，把助动词放到主语前面，从句其余部分保持不变。`,
      ],
      [
        [
          '"{wrong}" changes the form of the verb or of the auxiliary, so it is not the correct inversion.',
          "“{wrong}”改变了动词或助动词的形式，所以不是正确的倒装。",
        ],
        [
          '"{wrong}" keeps if, misplaces not or turns the clause into a question, so it is not a condition.',
          "“{wrong}”保留了 if、放错了 not 或把从句变成了疑问句，所以不是条件句。",
        ],
      ],
    ),
  ],
});

const ambiguous = topic("grammar", {
  id: "ambiguous-pronoun-reference",
  title: ["Ambiguous Pronoun Reference", "代词指代不明"],
  summary: [
    "Pronouns that could point to two nouns, or to none at all, and how to revise them so the reader knows who or what is meant.",
    "可能指向两个名词或根本没有所指的代词，以及如何修改它们，让读者知道指的是谁或什么。",
  ],
  after: ["pronoun-antecedent-agreement"],
  points: [
    label(
      "is-the-reference-clear",
      ["Is the Reference Clear", "指代是否清楚"],
      [
        "A pronoun should point to one noun the reader can find. The reference is **ambiguous** when two nouns could be meant: *When Maria met her sister, she was nervous* (which one?). It is **vague** when the pronoun points to no noun at all, only to an idea, a whole sentence or an unnamed group: *They say the bridge is unsafe* (who?), *He missed the meeting, which upset the boss* (which noun?), *It says in the paper…*. The reference is **clear** when only one noun can be meant.",
        "代词应指向读者能找到的唯一一个名词。当可能指两个名词时，指代就是**有歧义的**：*When Maria met her sister, she was nervous*（指哪一个？）。当代词根本不指向名词，只指一个想法、一整句话或一个没有点明的群体时，指代就是**含糊的**：*They say the bridge is unsafe*（谁？），*He missed the meeting, which upset the boss*（哪个名词？），*It says in the paper…*。只可能指一个名词时，指代就是**清楚的**。",
      ],
      ["Is the pronoun's reference in this sentence clear?", "这个句子中代词的指代清楚吗？"],
      `
        When Maria met her sister, she was nervous.|ambiguous: two nouns could be meant
        The coach told the player that he had made a mistake.|ambiguous: two nouns could be meant
        Tom called Sam after he got home.|ambiguous: two nouns could be meant
        The lawyer argued with the judge until she lost her temper.|ambiguous: two nouns could be meant
        Put the vase on the table and polish it.|ambiguous: two nouns could be meant
        The mother told her daughter that her coat was torn.|ambiguous: two nouns could be meant
        When the truck hit the car, it was badly damaged.|ambiguous: two nouns could be meant
        The king sent the general a letter before he left the city.|ambiguous: two nouns could be meant
        Anna told Leah that she had won the prize.|ambiguous: two nouns could be meant
        The teacher warned the students that they would be late.|ambiguous: two nouns could be meant
        Take the books off the shelves and dust them.|ambiguous: two nouns could be meant
        They say the old mill is haunted.|vague: no noun is meant
        In the article, it says that prices will fall.|vague: no noun is meant
        He forgot her birthday, which made her angry.|vague: no noun is meant
        They don't let you take photos in the museum.|vague: no noun is meant
        The rent went up and the bus fare doubled, and this forced us to move.|vague: no noun is meant
        At the hospital, they made me wait for three hours.|vague: no noun is meant
        She is a talented painter, but she has never sold one.|vague: no noun is meant
        It says on the label to shake the bottle.|vague: no noun is meant
        The town has a long history of mining, and they still dig in the hills.|vague: no noun is meant
        He lost his job and his car broke down, which was hard.|vague: no noun is meant
        When Maria met her sister, Maria was nervous.|clear
        The coach told the player, "You made a mistake."|clear
        Tom called Sam after Tom got home.|clear
        Polish the vase after you put it on the table.|clear
        When the truck hit the car, the car was badly damaged.|clear
        The museum does not let visitors take photos.|clear
        The article says that prices will fall.|clear
        His forgetting her birthday made her angry.|clear
        She is a talented painter, but she has never sold a painting.|clear
        The label says to shake the bottle.|clear
        The miners of the town still dig in the hills.|clear
      `,
      {
        "ambiguous: two nouns could be meant": L(
          "有歧义：可能指两个名词",
          "Two nouns before the pronoun could both be what it means, so the reader cannot tell which.",
          "代词前面有两个名词都可能是它的所指，读者分不清是哪一个。",
          "The pronoun does not have two possible nouns to point to.",
          "这个代词没有两个可能的所指名词。",
        ),
        "vague: no noun is meant": L(
          "含糊：没有所指名词",
          "The pronoun points to no noun in the sentence, only to an idea, a whole clause or an unnamed group of people.",
          "代词在句中没有所指的名词，只指向一个想法、一整个分句或一个没有点明的群体。",
          "The pronoun is not left without a noun to point to.",
          "这个代词并非没有可指的名词。",
        ),
        clear: L(
          "清楚",
          "Every pronoun can point to only one noun, or the noun itself is repeated, so the reader knows what is meant.",
          "每个代词只能指向一个名词，或者直接重复了名词，读者知道指的是什么。",
          "A pronoun could point to two nouns, or to none.",
          "有代词可能指向两个名词，或者不指向任何名词。",
        ),
      },
    ),
    choose(
      "the-revision-that-is-clear",
      ["The Revision That Is Clear", "清楚的修改"],
      [
        "To fix an unclear pronoun, replace it with the noun, rewrite the sentence so only one noun can be meant, or turn a report into a direct quotation. For a vague *this* or *which*, add the noun it sums up: *This forced us to move* becomes *These rising costs forced us to move*. For a vague *they* or *it*, name who or what: *They say* becomes *The engineers say*. A revision that keeps the same pronoun, or changes the meaning, does not help.",
        "修改指代不清的代词，可以把代词换成名词，改写句子使只可能指一个名词，或把转述改为直接引语。对于含糊的 *this* 或 *which*，加上它所概括的名词：*This forced us to move* 改为 *These rising costs forced us to move*。对于含糊的 *they* 或 *it*，说出是谁或什么：*They say* 改为 *The engineers say*。保留同一个代词或改变了原意的修改都无济于事。",
      ],
      ["Which revision makes the reference clear?", "哪个修改使指代变清楚了？"],
      `
        When Maria met her sister, she was nervous.|When Maria met her sister, Maria was nervous.|When Maria met her sister, she was very nervous.|When Maria met her sister, they were both calm.
        Tom called Sam after he got home.|After Tom got home, he called Sam.|Tom called Sam right after he got home.|Sam called Tom after he got home.
        The coach told the player that he had made a mistake.|The coach told the player, "I made a mistake."|The coach told the player that he had made an error.|The player told the coach that he had made a mistake.
        Put the vase on the table and polish it.|Polish the table and then put the vase on it.|Put the vase on the table and then polish it well.|Put the table on the vase and polish them.
        When the truck hit the car, it was badly damaged.|The car was badly damaged when the truck hit it.|When the truck hit the car, it was very badly damaged.|When the car hit the truck, it was badly damaged.
        They say the old mill is haunted.|People in the village say the old mill is haunted.|They often say that the old mill is haunted.|They say the old mill was once haunted.
        In the article, it says that prices will fall.|The article says that prices will fall.|In the article, it clearly says that prices will fall.|In the article, they say that prices might fall.
        He forgot her birthday, which made her angry.|His forgetting her birthday made her angry.|He forgot her birthday, which made her very angry.|He forgot her birthday, which made him angry.
        They don't let you take photos in the museum.|The museum does not allow visitors to take photos.|They really don't let you take photos in the museum.|They don't let you take photos near the museum.
        The rent went up and the bus fare doubled, and this forced us to move.|The rent went up and the bus fare doubled, and these rising costs forced us to move.|The rent went up and the bus fare doubled, and this finally forced us to move.|The rent went up and the bus fare doubled, but this did not force us to move.
        At the hospital, they made me wait for three hours.|At the hospital, the nurses made me wait for three hours.|At the hospital, they made me wait for nearly three hours.|At the hospital, they let me leave after three hours.
        She is a talented painter, but she has never sold one.|She is a talented painter, but she has never sold a painting.|She is a very talented painter, but she has never sold one.|She is a talented painter, and she has sold every one.
        Anna told Leah that she had won the prize.|Anna told Leah, "You have won the prize."|Anna told Leah that she had just won the prize.|Leah told Anna that she had lost the prize.
        The mother told her daughter that her coat was torn.|The mother told her daughter, "Your coat is torn."|The mother told her daughter that her coat was badly torn.|The mother told her daughter that her coat was new.
        The lawyer argued with the judge until she lost her temper.|The lawyer argued with the judge until the judge lost her temper.|The lawyer argued with the judge until she finally lost her temper.|The lawyer agreed with the judge until she lost her temper.
        Take the books off the shelves and dust them.|Take the books off the shelves and dust the shelves.|Take the books off the shelves and carefully dust them.|Put the books on the shelves and dust them.
        It says on the label to shake the bottle.|The label says to shake the bottle.|It clearly says on the label to shake the bottle.|It says on the label not to shake the bottle.
        He lost his job and his car broke down, which was hard.|He lost his job and his car broke down, and these two losses were hard.|He lost his job and his car broke down, which was very hard.|He found a job and his car was fixed, which was easy.
        The king sent the general a letter before he left the city.|Before the king left the city, he sent the general a letter.|The king sent the general a letter just before he left the city.|The general sent the king a letter before he left the city.
        The teacher warned the students that they would be late.|The teacher warned the students, "You will be late."|The teacher warned the students that they would be very late.|The students warned the teacher that they would be late.
        The town has a long history of mining, and they still dig in the hills.|The town has a long history of mining, and its miners still dig in the hills.|The town has a long history of mining, and they still dig deep in the hills.|The town has no history of mining, and they never dig in the hills.
        When Rosa visited her aunt, she gave her a book.|When Rosa visited her aunt, the aunt gave Rosa a book.|When Rosa visited her aunt, she gave her a new book.|When Rosa visited her aunt, they read no books.
        The doctor told the patient that he needed more rest.|The doctor told the patient, "You need more rest."|The doctor told the patient that he needed much more rest.|The patient told the doctor that he needed more rest.
        Our team beat the visitors, which was a surprise.|Our team's victory over the visitors was a surprise.|Our team beat the visitors, which was a big surprise.|The visitors beat our team, which was no surprise.
        If the cake doesn't fit in the box, cut it.|If the cake doesn't fit in the box, cut the cake.|If the cake doesn't fit in the box, cut it carefully.|If the box doesn't fit in the cake, cut it.
        In the report, they claim the river is clean.|The report's authors claim the river is clean.|In the report, they firmly claim the river is clean.|In the report, they deny the river is clean.
        Jack and his father went fishing, and he caught a trout.|Jack and his father went fishing, and Jack caught a trout.|Jack and his father went fishing, and he caught a big trout.|Jack and his father went fishing, and nobody caught anything.
        She studies law because it pays well.|She studies law because a career in law pays well.|She studies law because it pays very well.|She studies medicine because it pays well.
        The cat chased the mouse until it was exhausted.|The cat chased the mouse until the mouse was exhausted.|The cat chased the mouse until it was completely exhausted.|The mouse chased the cat until it was exhausted.
        The guide spoke to the tourists, but they didn't understand it.|The guide spoke to the tourists, but they didn't understand his English.|The guide spoke to the tourists, but they didn't really understand it.|The guide spoke to the tourists, and they understood it all.
        The company raised prices and cut wages, and this angered workers.|The company raised prices and cut wages, and these two decisions angered workers.|The company raised prices and cut wages, and this greatly angered workers.|The company lowered prices and raised wages, and this pleased workers.
      `,
      (right) => [
        `"${right}" names the noun or rewrites the sentence so that only one thing can be meant, without changing the meaning.`,
        `“${right}”点出了名词或改写了句子，使所指只有一个，且没有改变原意。`,
      ],
      [
        [
          '"{wrong}" only adds a word and keeps the same unclear pronoun, so the reader still cannot tell what is meant.',
          "“{wrong}”只是加了个词，保留了同样指代不清的代词，读者仍然分不清所指。",
        ],
        [
          '"{wrong}" changes who did what or what happened, so the meaning is no longer the same.',
          "“{wrong}”改变了谁做了什么或发生了什么，意思已经不同。",
        ],
      ],
    ),
  ],
});

const jargon = topic("grammar", {
  id: "jargon-and-plain-language",
  title: ["Jargon and Plain Language", "行话与平实语言"],
  summary: [
    "Specialist terms used where readers will not know them, inflated words that make simple things sound grand, and the plain words that say the same thing clearly.",
    "在读者不懂的地方使用的专业术语、把简单事情说得很宏大的浮夸词语，以及把同样的意思说清楚的平实词语。",
  ],
  after: ["reducing-nominalizations", "euphemisms"],
  points: [
    label(
      "what-gets-in-the-way",
      ["What Gets in the Way", "是什么造成了阻碍"],
      [
        "**Jargon** is the special vocabulary of a field, such as business, law, medicine or computing: *leverage our synergies*, *going forward*, *bandwidth*, *myocardial infarction*. Among experts it can be precise, but for general readers it hides the meaning. **Inflated language** dresses ordinary words in grand ones: *utilize* for *use*, *commence* for *begin*, *in the event that* for *if*, *at this point in time* for *now*. **Plain language** says the same thing in words the reader already knows.",
        "**行话**是某个领域的专门词汇，如商业、法律、医学或计算机：*leverage our synergies*、*going forward*、*bandwidth*、*myocardial infarction*。在专家之间它可能很精确，但对一般读者，它遮蔽了意思。**浮夸语言**用宏大的词包装普通的词：用 *utilize* 代替 *use*，用 *commence* 代替 *begin*，用 *in the event that* 代替 *if*，用 *at this point in time* 代替 *now*。**平实语言**用读者已经认识的词说出同样的意思。",
      ],
      ["What, if anything, gets in the way of this sentence for a general reader?", "对一般读者来说，如果有的话，是什么妨碍了这个句子？"],
      `
        We need to leverage our core competencies going forward.|jargon
        The patient presented with acute myocardial infarction.|jargon
        Let's circle back offline and touch base on the deliverables.|jargon
        I don't have the bandwidth to onboard the new hires this quarter.|jargon
        The defendant was found to be in breach of the fiduciary duty.|jargon
        The update will optimize the user journey across all touchpoints.|jargon
        Our goal is to drive synergies across the value chain.|jargon
        The app's backend failed to sync with the cloud API.|jargon
        The school will implement a learner-centered pedagogical framework.|jargon
        We must incentivize stakeholders to align on key metrics.|jargon
        Please utilize the stairs in the event of a fire.|inflated language
        The meeting will commence at this point in time.|inflated language
        We wish to ascertain whether you are desirous of a refund.|inflated language
        Prior to the commencement of the test, kindly remove your hats.|inflated language
        The vehicle was in excess of the posted speed limit.|inflated language
        Due to the fact that it was raining, the game was postponed.|inflated language
        We endeavor to facilitate the acquisition of new books.|inflated language
        The residence is in close proximity to the station.|inflated language
        Students are required to effectuate payment in advance.|inflated language
        Please render assistance to the elderly passenger.|inflated language
        Please use the stairs if there is a fire.|plain and clear
        The meeting will begin now.|plain and clear
        The patient had a heart attack.|plain and clear
        Let's talk again tomorrow about what we have to finish.|plain and clear
        I don't have time to train the new staff this quarter.|plain and clear
        Because it was raining, the game was put off.|plain and clear
        The house is near the station.|plain and clear
        We want to know if you would like a refund.|plain and clear
        The car was going faster than the speed limit.|plain and clear
        Please help the old man find a seat.|plain and clear
        Students must pay in advance.|plain and clear
      `,
      {
        jargon: L(
          "行话",
          "It uses the special terms of a field, such as business, law, medicine or computing, that a general reader may not know.",
          "句子用了商业、法律、医学或计算机等领域的专门术语，一般读者可能不懂。",
          "It does not depend on the special terms of a field.",
          "句子并不依赖某个领域的专门术语。",
        ),
        "inflated language": L(
          "浮夸语言",
          "It uses grand words or long phrases, such as utilize, commence or due to the fact that, where short common words would do.",
          "句子用了 utilize、commence、due to the fact that 之类宏大的词或长短语，而简短常用的词就足够了。",
          "It does not dress ordinary words in grand ones.",
          "句子没有用宏大的词包装普通的词。",
        ),
        "plain and clear": L(
          "平实清楚",
          "Every word is one a general reader knows, and nothing is longer or grander than it needs to be.",
          "每个词都是一般读者认识的，没有任何地方比需要的更长或更浮夸。",
          "It uses jargon or inflated words that get in the reader's way.",
          "句子用了妨碍读者的行话或浮夸词语。",
        ),
      },
    ),
    choose(
      "the-plain-version",
      ["The Plain Version", "平实的说法"],
      [
        "To revise jargon and inflated language, ask what the sentence actually says and who will read it, then say that in common words. *We will leverage our assets* becomes *We will use what we have*. *In the event that* becomes *if*; *prior to* becomes *before*; *a large number of* becomes *many*. A good revision keeps every fact; it does not drop information or add a new claim, and it does not swap one piece of jargon for another.",
        "修改行话和浮夸语言，要问句子实际在说什么、谁会读它，然后用常用词说出来。*We will leverage our assets* 改为 *We will use what we have*。*In the event that* 改为 *if*，*prior to* 改为 *before*，*a large number of* 改为 *many*。好的修改保留每一个事实：它不删去信息，也不添加新的说法，也不用一个行话替换另一个行话。",
      ],
      ["Which version says the same thing in plain language?", "哪个说法用平实的语言表达了同样的意思？"],
      `
        Please utilize the stairs in the event of a fire.|Please use the stairs if there is a fire.|Please leverage the stairwell during fire events.|Please use the lift if there is a fire.
        The meeting will commence at this point in time.|The meeting will begin now.|The meeting will be actioned at this juncture.|The meeting will end now.
        The patient presented with acute myocardial infarction.|The patient had a sudden heart attack.|The patient exhibited an acute cardiac event.|The patient had a mild cold.
        I don't have the bandwidth to onboard the new hires.|I don't have time to train the new staff.|I lack the capacity to integrate incoming resources.|I don't have time to hire new staff.
        Due to the fact that it was raining, the game was postponed.|Because it was raining, the game was put off.|Owing to precipitation events, the game was rescheduled.|Although it was raining, the game went ahead.
        The residence is in close proximity to the station.|The house is near the station.|The dwelling is proximate to the transit hub.|The house is far from the station.
        Prior to the commencement of the test, kindly remove your hats.|Before the test begins, please take off your hats.|Prior to test initiation, kindly divest yourselves of headwear.|After the test begins, please put on your hats.
        We wish to ascertain whether you are desirous of a refund.|We want to know if you would like a refund.|We seek to determine your refund preference status.|We want to know why you asked for a refund.
        The vehicle was in excess of the posted speed limit.|The car was going faster than the speed limit.|The vehicle exceeded the regulatory velocity threshold.|The car was going slower than the speed limit.
        Students are required to effectuate payment in advance.|Students must pay in advance.|Students must action payment proactively.|Students may pay after the course.
        We endeavor to facilitate the acquisition of new books.|We try to help people get new books.|We strive to enable book procurement solutions.|We try to stop people getting new books.
        Let's circle back offline and touch base on the deliverables.|Let's talk again later about what we have to finish.|Let's reconnect asynchronously regarding outputs.|Let's never talk again about what we have finished.
        Our goal is to drive synergies across the value chain.|Our goal is to help each part of the company work better with the others.|Our goal is to leverage cross-functional value alignment.|Our goal is to split the company into separate parts.
        A large number of residents expressed opposition to the plan.|Many residents opposed the plan.|A significant cohort of stakeholders signaled pushback.|A few residents supported the plan.
        The school will implement a learner-centered pedagogical framework.|The school will teach in a way that starts from what students need.|The school will operationalize a student-centric instructional paradigm.|The school will stop teaching the students.
        Please render assistance to the elderly passenger.|Please help the old passenger.|Please provide support solutions to the senior traveler.|Please ignore the old passenger.
        In the event that the shipment is delayed, we will notify you.|If the parcel is late, we will tell you.|Should a shipment latency event occur, notification will follow.|If the parcel is late, we will not tell you.
        At this point in time we are not in a position to comment.|We cannot comment now.|We are currently unable to provide messaging on that.|We will comment tomorrow.
        The council is cognizant of the fact that the roads are in disrepair.|The council knows the roads are broken.|The council has visibility on road infrastructure degradation.|The council denies that the roads are broken.
        The app's backend failed to sync with the cloud API.|The app could not reach the server that stores its data.|The app's server-side layer experienced a sync fault with the endpoint.|The app's screen was too dark to read.
        The defendant was found to be in breach of his fiduciary duty.|The court found that he had not looked after money he was trusted with.|The defendant was held liable for a fiduciary obligation breach.|The court found that he had looked after the money well.
        We must incentivize stakeholders to align on key metrics.|We must give everyone involved a reason to agree on what to measure.|We must motivate key stakeholders toward metric alignment.|We must stop people from measuring anything.
        The firm is experiencing a negative cash flow situation.|The firm is spending more than it earns.|The firm is navigating a cash flow headwind.|The firm is earning more than it spends.
        Employees should refrain from the consumption of food at their desks.|Workers should not eat at their desks.|Personnel should avoid desk-based nutrition activities.|Workers should eat at their desks.
        The update will optimize the user journey across all touchpoints.|The update will make the app easier to use on every screen.|The update will enhance cross-channel user experience flows.|The update will make the app harder to use.
        The new policy will be implemented on a going-forward basis.|The new rule will apply from now on.|The new policy will be operationalized prospectively.|The new rule applied last year.
        The suspect was apprehended in the vicinity of the bank.|The police caught the suspect near the bank.|The suspect was detained proximate to the financial institution.|The suspect escaped from the bank.
        There is a requirement for all visitors to sign in.|All visitors must sign in.|Visitor sign-in is a mandated compliance item.|No visitor needs to sign in.
        The company will downsize its workforce in the next fiscal period.|The company will cut jobs next year.|The company will right-size headcount next fiscal cycle.|The company will hire more people next year.
        We are reaching out to solicit your feedback on our offerings.|We are writing to ask what you think of our products.|We are pinging you to capture your input on our solutions.|We are writing to sell you our products.
        Kindly be advised that the office will be closed on Monday.|Please note that the office will be closed on Monday.|Kindly note the office will be in a non-operational state Monday.|Please note that the office will be open on Monday.
      `,
      (right) => [
        `"${right}" keeps every fact of the original but says it in short, common words a general reader knows.`,
        `“${right}”保留了原句的每一个事实，但用一般读者认识的简短常用词说出来。`,
      ],
      [
        [
          '"{wrong}" swaps the original words for other jargon or inflated phrases, so it is no plainer.',
          "“{wrong}”只是把原来的词换成了别的行话或浮夸短语，并没有更平实。",
        ],
        ['"{wrong}" is plain, but it changes or reverses the facts of the original.', "“{wrong}”虽然平实，却改变或颠倒了原句的事实。"],
      ],
    ),
  ],
});

const confused8 = topic("grammar", {
  id: "commonly-confused-words-8",
  title: ["Commonly Confused Words 8", "易混淆词 8"],
  summary: [
    "Pairs such as ascent and assent, defuse and diffuse, or forbear and forebear look or sound alike but mean different things.",
    "ascent 和 assent、defuse 和 diffuse、forbear 和 forebear 这样的词形或读音相近，意思却不同。",
  ],
  after: ["commonly-confused-words-7"],
  points: [
    choose(
      "the-word-that-fits",
      ["The Word That Fits", "合适的词"],
      [
        "Ten more pairs for careful writers. An **ascent** is a climb; **assent** is agreement. **Canvas** is heavy cloth; to **canvass** is to ask people for votes or opinions. **Climactic** describes a climax; **climatic** describes climate. To **defuse** is to make less dangerous; to **diffuse** is to spread out. To **deprecate** is to disapprove of; to **depreciate** is to lose value. To **exercise** is to train or use; to **exorcise** is to drive out an evil spirit. To **forbear** is to hold back; a **forebear** is an ancestor. An **ordinance** is a local law; **ordnance** is military weapons. **Venal** means open to bribes; **venial** means easily forgiven. A **tenant** rents a home; a **tenet** is a principle of a belief.",
        "又有十对需要认真区分的词。**ascent** 是攀登，**assent** 是同意。**canvas** 是帆布，**canvass** 是拉票或征求意见。**climactic** 形容高潮，**climatic** 形容气候。**defuse** 是缓和、拆除引信，**diffuse** 是扩散。**deprecate** 是不赞成，**depreciate** 是贬值。**exercise** 是锻炼或运用，**exorcise** 是驱魔。**forbear** 是克制，**forebear** 是祖先。**ordinance** 是地方法规，**ordnance** 是军械。**venal** 意为贪赃的，**venial** 意为可原谅的。**tenant** 是租户，**tenet** 是信条。",
      ],
      ["Which word fits the sentence?", "哪个词适合这个句子？"],
      `
        The climbers began their ___ before dawn.|ascent|assent|accent
        The king gave his ___ to the new law.|assent|ascent|absent
        The ship's sails were made of ___.|canvas|canvass|canvasser
        Volunteers will ___ every street before the election.|canvass|canvas|cancel
        The ___ battle comes in the final chapter.|climactic|climatic|climbing
        Scientists study ___ changes over thousands of years.|climatic|climactic|chromatic
        The police managed to ___ the bomb.|defuse|diffuse|refuse
        A joke can ___ a tense meeting.|defuse|diffuse|confuse
        The perfume began to ___ through the room.|diffuse|defuse|diffract
        A new car will ___ quickly in value.|depreciate|deprecate|appreciate
        The critic tends to ___ any film that is popular.|deprecate|depreciate|desecrate
        You should ___ for thirty minutes a day.|exercise|exorcise|exorbitant
        The priest was asked to ___ the evil spirit.|exorcise|exercise|excise
        She tried to ___ the memory of the accident from her mind.|exorcise|exercise|exercised
        Please ___ from interrupting the speaker.|forbear|forebear|forbore
        My ___ came to this valley three hundred years ago.|forebear|forbear|forerunner
        A city ___ bans parking on this street at night.|ordinance|ordnance|ordinary
        The army stored its ___ in a guarded depot.|ordnance|ordinance|ordinal
        The ___ official took money to ignore the crime.|venal|venial|venous
        Telling a white lie is a ___ fault, not a grave one.|venial|venal|vernal
        The ___ paid the rent on the first of the month.|tenant|tenet|tenor
        Nonviolence is a central ___ of her faith.|tenet|tenant|tenure
        The new law needs the ___ of both houses.|assent|ascent|accent
        The painter stretched the ___ over a wooden frame.|canvas|canvass|canvasser
        The ___ of Everest took them six weeks.|ascent|assent|accent
        Dropping prices will ___ the value of our house.|depreciate|deprecate|appreciate
        The ___ scene of the play takes place on a cliff.|climactic|climatic|climbing
        The landlord raised the rent for every ___.|tenant|tenet|tenor
        Light from the lamp will ___ through the paper shade.|diffuse|defuse|diffract
        She chose to ___ her right to remain silent.|exercise|exorcise|excise
        The pollster will ___ voters about the new tax.|canvass|canvas|cancel
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
        "Learn each pair by a clue. An *ascent* goes up like a *scent* rising; *assent* is to *ass*ert yes. *Canvass* has an extra *s* for *s*urvey. *Climactic* has the *c* of *c*limax. To *de*fuse is to *de*-fuse a bomb. *Depreciate* is about *price*. To *exorcise* drives *out*, like *ex*it. To *fore*bear is not to bear; a *fore*bear came be*fore*. *Ordnance* is ordinance with the *i* blown out. A *venal* official sells favors for money, like a *vend*ing machine. A *tenet* is held, a *tenant* pays *ant*-sized rent.",
        "用线索记住每一对词。*ascent* 像升起的 *scent*（香气）一样向上；*assent* 是 *ass*ert（肯定）说是。*canvass* 多了一个 *s*，代表 *s*urvey（调查）。*climactic* 有 *c*limax（高潮）的 *c*。*de*fuse 是给炸弹 *de*-fuse（拆引信）。*depreciate* 与 *price*（价格）有关。*exorcise* 是赶 *out*（出去），像 *ex*it。*forebear* 有 *fore*，表示在 be*fore*（之前）的祖先。*ordnance* 是 ordinance 炸掉了 *i*。*venal* 的官员像 *vend*ing machine（自动售货机）一样出售好处。*tenet* 是持守的信条，*tenant* 是付房租的人。",
      ],
      ["Which word has this meaning?", "哪个词有这个意思？"],
      `
        a climb upward|ascent|assent|accent
        agreement or approval|assent|ascent|absent
        a strong, heavy cloth used for tents and paintings|canvas|canvass|canvasser
        to go around asking people for votes or opinions|canvass|canvas|cancel
        forming the most exciting point of a story|climactic|climatic|climbing
        having to do with climate|climatic|climactic|chromatic
        to make a situation less tense or dangerous|defuse|diffuse|refuse
        to spread out over a wide area|diffuse|defuse|confuse
        to fall in value over time|depreciate|deprecate|appreciate
        to express disapproval of|deprecate|depreciate|desecrate
        to drive out an evil spirit|exorcise|exercise|excise
        to use a right or a power; to train the body|exercise|exorcise|excise
        to hold back from doing something|forbear|forebear|forbore
        an ancestor|forebear|forbear|forerunner
        a law made by a town or city|ordinance|ordnance|ordinary
        weapons, guns and ammunition|ordnance|ordinance|ordinal
        willing to take bribes|venal|venial|venous
        small and easily forgiven|venial|venal|vernal
        a person who rents a home or an office|tenant|tenet|tenor
        a principle that a group holds to be true|tenet|tenant|tenure
        what a judge who takes bribes is|venal|venial|venous
        what a great-great-grandmother is to you|forebear|forbear|forerunner
        what the end of a mountain climb completes|ascent|assent|accent
        what a nod of the head can show|assent|ascent|absent
        what a new phone does the moment it is bought|depreciate|deprecate|appreciate
        what a calm word can do to an argument|defuse|diffuse|refuse
        what a drop of ink does in a glass of water|diffuse|defuse|confuse
        what a local rule against loud music is|ordinance|ordnance|ordinary
        what campaign workers do from door to door|canvass|canvas|cancel
        describing long changes in weather, such as an ice age|climatic|climactic|chromatic
        someone who lives in a flat and pays its owner each month|tenant|tenet|tenor
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

/** grammarTopics12 are the grammar topics of grade 12. */
export const grammarTopics12: readonly TopicDef[] = [inverted, ambiguous, jargon, confused8];
