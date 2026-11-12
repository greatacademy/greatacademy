// Grade 11: writing skills checked by rule: an opposing view summarized fairly, movement between concrete detail and
// abstract idea, and conclusions that widen the view.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const opposing = topic("writing", {
  id: "summarizing-an-opposing-view-fairly",
  title: ["Summarizing an Opposing View Fairly", "公正地概述反方观点"],
  summary: [
    "Stating the other side's position in its strongest form, in words its supporters would accept, before answering it.",
    "在回应之前，以反方最有力的形式、用其支持者也会认可的措辞陈述对方的立场。",
  ],
  after: ["counterclaims-and-rebuttals", "supported-and-unsupported-claims"],
  points: [
    label(
      "fair-or-unfair",
      ["Fair or Unfair", "公正还是不公正"],
      [
        "A strong argument answers the **best** version of the other side, not a weak one. A **fair summary** states the opposing view accurately, with its main reason, in neutral words its supporters would accept. A **straw man** distorts the view into something weaker or sillier than it is, so that it is easy to knock down. A **loaded summary** may report the view accurately but colors it with sneering or emotional words (*the so-called experts*, *their tired excuse*).",
        "有力的论证回应的是对方**最好的**版本，而不是一个弱的版本。**公正的概述**准确地陈述反方观点及其主要理由，用的是其支持者也会认可的中性措辞。**稻草人**把对方观点歪曲得比实际更弱或更荒唐，以便轻易推倒。**带偏见的概述**可能如实报告了观点，却用讥讽或情绪化的词语给它染色（*the so-called experts*、*their tired excuse*）。",
      ],
      ["How does this sentence summarize the opposing view?", "这个句子是怎样概述反方观点的？"],
      `
        Supporters of the curfew argue that it would reduce late-night accidents involving young drivers.|a fair summary
        Those who favor school uniforms believe they reduce pressure on families to buy expensive clothes.|a fair summary
        Opponents of the new stadium worry that public money would be better spent on schools.|a fair summary
        Defenders of homework say that practice at home helps students remember what they learned.|a fair summary
        Critics of the tax argue that it would fall hardest on families with low incomes.|a fair summary
        Those against the ban point out that it would punish responsible owners along with careless ones.|a fair summary
        Advocates of a longer school year note that students forget much over a long summer.|a fair summary
        People who oppose the dam fear that it would destroy the breeding grounds of local fish.|a fair summary
        Supporters of the speed cameras cite data showing fewer crashes where cameras were installed.|a fair summary
        Those who want to keep the old library argue that it serves residents without internet at home.|a fair summary
        Supporters of the curfew apparently think every teenager is a criminal.|a straw man
        Uniform fans want every student to look like a robot.|a straw man
        Stadium opponents simply hate sports and fun.|a straw man
        Homework defenders believe children should never play.|a straw man
        Critics of the tax just don't want to pay for anything.|a straw man
        People against the ban think dogs should be allowed to bite anyone they like.|a straw man
        Advocates of a longer school year want children chained to their desks all year.|a straw man
        Dam opponents would rather people live without electricity than lose a single fish.|a straw man
        Camera supporters want the government to watch our every move.|a straw man
        Library defenders refuse to accept that the world has changed since 1950.|a straw man
        The so-called safety experts claim the curfew would reduce late-night accidents.|a loaded summary
        Uniform enthusiasts trot out their tired claim that uniforms reduce clothing costs.|a loaded summary
        Stadium critics whine that the money should go to schools instead.|a loaded summary
        Homework's cheerleaders insist, as always, that practice helps memory.|a loaded summary
        Tax critics recite their usual sob story about low-income families.|a loaded summary
        Ban opponents complain endlessly that responsible owners would be punished.|a loaded summary
        The longer-year crowd keeps repeating that students forget over the summer.|a loaded summary
        Dam protesters wail about the fate of a few breeding grounds.|a loaded summary
        Camera fans wave around their convenient crash statistics.|a loaded summary
        Nostalgic library lovers cling to the excuse that some residents lack internet.|a loaded summary
      `,
      {
        "a fair summary": L(
          "公正的概述",
          "It states the view and its real reason in neutral words that its supporters would accept.",
          "它用支持者也会认可的中性措辞，陈述了观点及其真实理由。",
          "It distorts the view or colors it with sneering words.",
          "它歪曲了观点，或用讥讽的词语给它染了色。",
        ),
        "a straw man": L(
          "稻草人",
          "It twists the view into an extreme or silly claim its supporters do not make.",
          "它把观点扭曲成支持者并没有提出的极端或荒唐的说法。",
          "It does not change what the other side actually claims.",
          "它没有改变对方实际的主张。",
        ),
        "a loaded summary": L(
          "带偏见的概述",
          "It reports the real reason but mocks it with words such as so-called, whine or tired.",
          "它报告了真实的理由，却用 so-called、whine、tired 之类的词语嘲弄它。",
          "It does not sneer at the view with loaded words while reporting it.",
          "它在报告观点时没有用带偏见的词语讥讽。",
        ),
      },
    ),
    choose(
      "the-strongest-version",
      ["The Strongest Version", "最有力的版本"],
      [
        "Before you rebut a view, state it as its best defenders would: choose its **strongest reason**, not its weakest; give it its **real scope**, not an extreme one; and use **neutral verbs** such as *argue*, *point out* and *note*. Answering the strongest version makes your own argument more convincing, because readers who hold the other view will feel heard.",
        "反驳一个观点之前，要像它最好的辩护者那样陈述它：选它**最有力的理由**，而不是最弱的；给它**真实的范围**，而不是极端化；用 *argue*、*point out*、*note* 之类的**中性动词**。回应最有力的版本会让你自己的论证更有说服力，因为持另一种观点的读者会觉得自己的声音被听到了。",
      ],
      ["Which sentence states the opposing view in its strongest fair form?", "哪个句子以最有力且公正的形式陈述了反方观点？"],
      `
        An essay arguing for a four-day school week|Opponents point out that a longer weekend could leave working parents without childcare.|Opponents just want students stuck at their desks forever, from early morning until late at night.|Opponents whine that a shorter week would leave parents with nothing to do.
        An essay arguing against banning phones in school|Supporters of a ban note that phones distract students and can be used to cheat.|Supporters of a ban think every phone is evil and should be thrown into the sea, along with every computer.|Supporters of a ban fuss as usual about distraction and nothing else.
        An essay arguing for a sugar tax|Critics argue that the tax would cost poorer families a larger share of their income.|Critics simply want everyone, including small children, to eat as much candy as possible every single day.|Critics moan that the tax would cost them a few cents at the store.
        An essay arguing for zoos|Zoo critics argue that even good enclosures cannot give wide-ranging animals the space they need.|Zoo critics believe that wild animals are always happier being hunted and eaten than living safely in a zoo.|Zoo critics sob about animals with no real argument at all.
        An essay arguing against a new highway|Supporters argue that the highway would cut commuting times and bring business to the area.|Supporters care about nothing at all except pouring concrete over every field, forest and farm in the county.|Supporters babble about saving a minute or two of driving.
        An essay arguing for later school start times|Opponents note that later starts could push sports and after-school jobs into the evening.|Opponents think all teenagers are lazy and deserve to be dragged out of bed in the dark every morning.|Opponents gripe about rearranging their precious sports schedules.
        An essay arguing for more public parks|Critics point out that maintaining parks costs money that could fund other services.|Critics hate nature itself and dream of paving over every tree, flower and patch of grass in the city.|Critics grumble about the price of mowing a little grass.
        An essay arguing against required community service|Supporters argue that service teaches students about their community and builds empathy.|Supporters want to force students into unpaid labor for life.|Supporters preach their usual sermon about kindness.
        An essay arguing for electric buses|Skeptics note that electric buses cost more to buy and need new charging stations.|Skeptics apparently love pollution and want every child in the city to breathe black smoke all day long.|Skeptics fret about the price tag as if money were all that mattered.
        An essay arguing against banning a novel from the school library|Those who want the ban argue that some scenes are too disturbing for younger readers.|Those who want the ban want to burn every book they dislike.|Those who want the ban shriek about a few mildly upsetting pages.
        An essay arguing for free public transport|Opponents argue that the cost would have to be paid through higher taxes.|Opponents want everyone, young and old, to walk everywhere forever, in every kind of weather, without any help.|Opponents carp about taxes like they always do.
        An essay arguing for keeping the old town hall|Those who favor demolition note that repairs would cost more than a new building.|Those who favor demolition despise history and would happily knock down every old building in the whole country.|Those who favor demolition harp on and on about repair bills.
        An essay arguing for online classes|Critics argue that students learn less without face-to-face contact with teachers.|Critics believe that any computer in a classroom will turn every student into a mindless zombie within a week.|Critics bleat the old line about face-to-face contact.
        An essay arguing against a ban on fireworks|Supporters of the ban point out that fireworks frighten pets and cause injuries each year.|Supporters of the ban hate all celebrations and fun of every kind.|Supporters of the ban cry about scared pets and a few burns.
        An essay arguing for year-round schooling|Opponents argue that summer jobs and camps give students experience they cannot get in class.|Opponents believe children should spend the whole year on the beach.|Opponents rhapsodize, predictably, about summer camps.
        An essay arguing against more homework|Supporters note that homework gives students practice they do not have time for in class.|Supporters think children should do nothing but homework.|Supporters keep chanting that practice makes perfect.
        An essay arguing for a city bike lane|Opponents point out that the lane would remove parking that local shops depend on.|Opponents want to run every cyclist off the road and ban bicycles from the city entirely, children's bikes included.|Opponents whimper about losing their beloved parking spots.
        An essay arguing for banning junk-food ads|Critics argue that a ban would limit free speech and that parents should decide what children eat.|Critics want children to eat nothing but chips and soda.|Critics drag out their favorite slogan about free speech.
        An essay arguing for a national service year|Opponents note that a required year would delay study and work for young adults.|Opponents believe young people should never help anyone.|Opponents complain that a year is a terribly long time.
        An essay arguing against school uniforms|Supporters argue that uniforms reduce bullying over clothes and save families money.|Supporters want every child to be identical and obedient.|Supporters repeat their stale talking point about bullying.
      `,
      (right) => [
        `"${right}" gives the other side its real and strongest reason in neutral words, so the rebuttal that follows will be convincing.`,
        `“${right}” 用中性的措辞给出了对方真实而最有力的理由，因此随后的反驳才有说服力。`,
      ],
      [
        [
          '"{wrong}" is a straw man: it turns the other side\'s view into an extreme claim no one makes.',
          "“{wrong}”是稻草人：它把对方的观点变成了没有人提出的极端说法。",
        ],
        [
          '"{wrong}" mocks the other side with loaded words and gives its reason little weight.',
          "“{wrong}”用带偏见的词语嘲弄对方，没有给对方的理由应有的分量。",
        ],
      ],
    ),
  ],
});

const concrete = topic("writing", {
  id: "moving-between-concrete-and-abstract",
  title: ["Moving Between Concrete and Abstract", "在具体与抽象之间移动"],
  summary: [
    "Pairing abstract ideas such as courage or injustice with concrete details that make them visible, and drawing ideas out of details.",
    "把勇气、不公之类的抽象观念与使其可见的具体细节配对，并从细节中提炼出观念。",
  ],
  after: ["introducing-and-explaining-evidence", "abstract-nouns"],
  points: [
    label(
      "concrete-or-abstract",
      ["Concrete or Abstract", "具体还是抽象"],
      [
        "A **concrete** sentence shows something a reader can see, hear, touch or count: *Her hands were cracked from twelve years of washing other people's dishes.* An **abstract** sentence names an idea, a quality or a judgment: *She had endured great hardship.* Good writing moves between the two. A sentence that does **both** names an idea and anchors it in a specific detail in the same breath: *Her patience showed in the way she refolded each napkin the guests had thrown down.*",
        "**具体**的句子呈现读者能看到、听到、摸到或数得出的东西：*Her hands were cracked from twelve years of washing other people's dishes.* **抽象**的句子说出一个观念、一种品质或一个判断：*She had endured great hardship.* 好的写作在两者之间移动。**兼有两者**的句子在说出观念的同时，又用具体细节把它固定下来：*Her patience showed in the way she refolded each napkin the guests had thrown down.*",
      ],
      ["Is this sentence concrete, abstract or both?", "这个句子是具体的、抽象的，还是兼而有之？"],
      `
        The kitchen smelled of burnt onions, and the radio played the same song three times.|concrete
        He walked four miles to school in shoes with cardboard in the soles.|concrete
        The factory whistle blew at six, and two hundred men filed through the gate.|concrete
        Rain dripped through the roof into a row of tin buckets.|concrete
        Her grandmother's ring had worn thin on one side from sixty years of work.|concrete
        The letter was folded into a square no bigger than a stamp.|concrete
        Dust coated every shelf except the one where the photographs stood.|concrete
        The boy counted the coins twice and pushed them across the counter.|concrete
        Snow had drifted against the door so deep that they climbed out the window.|concrete
        Three empty chairs sat at the table, each with a folded napkin.|concrete
        Injustice can survive for generations when no one speaks against it.|abstract
        Courage is not the absence of fear but the mastery of it.|abstract
        The family suffered great hardship during those years.|abstract
        Freedom means little to those who cannot afford to use it.|abstract
        Her loyalty was the defining quality of her life.|abstract
        Poverty shaped every choice the family made.|abstract
        Grief changes the way a person sees the world.|abstract
        Progress always comes at a price.|abstract
        His pride was both his strength and his weakness.|abstract
        Hope is the last thing a community gives up.|abstract
        Her patience showed in the way she refolded each napkin the guests had thrown down.|both
        Their poverty was plain in the cardboard he fitted into his shoes each morning.|both
        His courage was clearest when his hands shook and he stepped forward anyway.|both
        The injustice of the law showed in the empty seats where Black voters should have stood.|both
        Grief had emptied the house, down to the coat still hanging by the door.|both
        Her loyalty meant driving three hundred miles every Sunday to sit beside her silent father.|both
        His pride kept the broken watch on his wrist long after it had stopped.|both
        Their hope lived in the seed packets lined up on the windowsill in February.|both
        Neglect was written in the dust on every shelf of the old school.|both
        Progress came to the valley as a highway that cut the village in two.|both
      `,
      {
        concrete: L(
          "具体",
          "It shows things a reader can see, hear, touch or count, without naming an idea.",
          "它呈现读者能看到、听到、摸到或数得出的东西，没有说出观念。",
          "It names an idea or a quality rather than only showing particular things.",
          "它说出了一个观念或品质，而不只是呈现具体事物。",
        ),
        abstract: L(
          "抽象",
          "It names an idea, a quality or a judgment with no particular detail to show it.",
          "它说出一个观念、品质或判断，却没有具体细节来呈现它。",
          "It contains particular things a reader could see or count.",
          "它包含了读者能看到或数得出的具体事物。",
        ),
        both: L(
          "兼而有之",
          "It names an idea and anchors it in a specific detail in the same sentence.",
          "它在同一个句子里说出观念，又用具体细节把它固定下来。",
          "It does not join an idea and a specific detail in one sentence.",
          "它没有在一个句子里把观念和具体细节结合起来。",
        ),
      },
    ),
    choose(
      "the-detail-for-the-idea",
      ["The Detail for the Idea", "为观念找细节"],
      [
        "When you state an abstract idea, follow it with a concrete detail that **proves** it: a detail that could belong only to this idea, not a vague restatement and not a detail that points somewhere else. *The town had given up on its young people.* What proves it? *The school's only computer lab had been locked since 2015.* A good detail is **specific** (a number, a name, an object) and **fitting** (it shows exactly the idea stated).",
        "说出一个抽象观念后，要接着给出能**证明**它的具体细节：只属于这个观念的细节，而不是含糊的重述，也不是指向别处的细节。*The town had given up on its young people.* 什么能证明这一点？*The school's only computer lab had been locked since 2015.* 好的细节**具体**（一个数字、一个名字、一个物件）且**贴切**（恰好呈现所说的观念）。",
      ],
      ["Which detail best makes the idea concrete?", "哪个细节最能把这个观念具体化？"],
      `
        The town had given up on its young people.|The school's only computer lab had been locked since 2015.|The town did not care very much about its young people at all.|The town held a popular summer festival every single year.
        My grandfather valued hard work above everything.|At eighty he still rose at five to mend the fences himself.|My grandfather believed hard work was the most important value.|My grandfather enjoyed watching old films on Sunday nights.
        The war had changed my uncle.|He now flinched whenever a car door slammed on the street.|My uncle was a very different person after the long war.|My uncle had served in the army for three years in total.
        The family was poor.|The children shared one pair of winter boots and took turns going outside.|The family did not have much money and life was hard for them.|The family lived on a quiet street near the old railway.
        The teacher believed in every student.|She kept a folder of each student's best work and read from it on the last day.|The teacher had faith in all of her students and their abilities.|The teacher taught history at the school for twenty years.
        The city ignored the flood risk.|The levee report sat unread in a drawer for six years.|The city did not pay attention to the danger of floods at all.|The city has a population of nearly half a million people.
        My sister is fearless.|At nine she climbed the water tower on a dare and waved from the top.|My sister is not afraid of anything and is very brave indeed.|My sister enjoys reading adventure novels in her free time.
        The company treated its workers badly.|Workers were fined a day's pay for a two-minute bathroom break.|The company was unkind and unfair to the people who worked there.|The company produced shoes and sold them in forty countries.
        The neighborhood was proud of its history.|Every house bore a small plaque naming the family that built it.|The people in the neighborhood felt proud of their long history.|The neighborhood had a bakery that opened very early each day.
        The old woman was lonely.|She set two cups out every afternoon, though no one came to tea.|The old woman felt very lonely and isolated from other people.|The old woman had lived in the same house for many years.
        The election was bitterly divided.|Neighbors took down their fences rather than share them with the other side.|The election divided people sharply and caused a lot of anger.|The election was held on the first Tuesday of November.
        The scientist was dedicated to her research.|She slept in the lab during the final month, on a cot beside the microscope.|The scientist cared deeply about her research and worked very hard.|The scientist had studied chemistry at a famous university.
        The village feared outsiders.|Doors were bolted and curtains drawn whenever a strange car came up the road.|The people of the village were afraid of strangers and outsiders.|The village had a single church and a small grocery store.
        My father was generous.|He gave his only winter coat to a stranger at the bus stop.|My father was a generous man who liked to help other people.|My father worked as an engineer for the city water department.
        The school valued sports over study.|The gym had new floors while the library's books dated from the 1980s.|The school cared more about sports than about learning things.|The school had nearly a thousand students and fifty teachers.
        The refugee missed her home.|She kept a jar of soil from her village on the windowsill.|The refugee missed her home country very much and felt sad.|The refugee had traveled through three countries to arrive.
        The coach was demanding.|Players who were one minute late ran laps until the sun went down.|The coach expected a great deal from all of the players on the team.|The coach had played professional football for several seasons.
        The leader was vain.|He had his portrait hung in every classroom in the country.|The leader thought very highly of himself and loved attention.|The leader had ruled the country for more than twenty years.
        The child was curious.|She took apart the kitchen clock to see where the time came from.|The child was very curious and always wanted to learn new things.|The child was the youngest of four children in the family.
        The friendship was strong.|For thirty years the two men wrote each other a letter every week.|The two men had a strong friendship that lasted for a very long time.|The two men had grown up in the same small town by the sea.
      `,
      (right) => [
        `"${right}" is specific and shows exactly the idea, so a reader can see it instead of being told.`,
        `“${right}” 具体而且恰好呈现了这个观念，让读者看到它，而不是被告知。`,
      ],
      [
        [
          '"{wrong}" only restates the idea in other abstract words, so nothing becomes concrete.',
          "“{wrong}”只是用别的抽象词语重述了观念，没有任何东西变得具体。",
        ],
        ['"{wrong}" is a detail, but it does not show the idea stated.', "“{wrong}”是一个细节，但它没有呈现所说的观念。"],
      ],
    ),
  ],
});

const conclusions = topic("writing", {
  id: "conclusions-that-widen-the-view",
  title: ["Conclusions That Widen the View", "拓宽视野的结尾"],
  summary: [
    "Ending an essay by showing why its claim matters beyond the essay, instead of only repeating the thesis or bringing in a new topic.",
    "在文章结尾说明论点为何在文章之外也重要，而不只是重复论点，或引入一个新话题。",
  ],
  after: ["an-analytical-thesis", "introducing-and-explaining-evidence"],
  points: [
    label(
      "what-the-ending-does",
      ["What the Ending Does", "结尾做了什么"],
      [
        "A conclusion should not simply **repeat** the thesis in the same words, and it should not **start a new topic** that the essay never discussed. A strong conclusion **widens the view**: it shows why the claim matters, to whom, or what it means for the future, while staying connected to what the essay proved. It may link to a larger issue, return to an opening image with new meaning, or point to a consequence.",
        "结尾不应只是用同样的话**重复**论点，也不应**开启一个**文章从未讨论过的**新话题**。有力的结尾**拓宽视野**：它说明论点为何重要、对谁重要，或对未来意味着什么，同时与文章已经证明的内容保持联系。它可以连到更大的议题，以新的意义回到开头的意象，或指出一个后果。",
      ],
      ["What does this concluding sentence do?", "这个结尾句做了什么？"],
      `
        In conclusion, school should start later because teenagers need more sleep.|repeats the thesis
        As I have shown, the dam should not be built because it would harm the river.|repeats the thesis
        To sum up, the novel's main theme is that pride leads to a fall.|repeats the thesis
        In short, uniforms should be required because they reduce bullying.|repeats the thesis
        Therefore, the city should build more bike lanes for cyclists.|repeats the thesis
        So, as stated above, social media harms the sleep of teenagers.|repeats the thesis
        In conclusion, the poem uses the sea to show the speaker's grief.|repeats the thesis
        Overall, the factory should be closed because it pollutes the air.|repeats the thesis
        To conclude, the library should stay open because people need it.|repeats the thesis
        Thus, homework should be limited to one hour a night.|repeats the thesis
        In conclusion, school should start later, and also the cafeteria food should be healthier.|starts a new topic
        The dam should not be built; in addition, the town needs a new mayor.|starts a new topic
        Pride leads to a fall in the novel, and the author also wrote three other books.|starts a new topic
        Uniforms reduce bullying, and by the way, the school's sports teams need better coaches.|starts a new topic
        More bike lanes are needed, and the city should also raise teachers' pay.|starts a new topic
        Social media harms sleep, and video games may also be bad for the eyes.|starts a new topic
        The sea stands for grief in the poem, and the poet was born in Ireland.|starts a new topic
        The factory should close, and the town should host a music festival next summer.|starts a new topic
        The library should stay open; also, the park needs more benches.|starts a new topic
        Homework should be limited, and schools should ban sugary drinks too.|starts a new topic
        A later start costs a few bus routes, but it buys a generation of students who arrive awake enough to learn.|widens the view
        If the river dies here, every town downstream will inherit what we chose not to protect.|widens the view
        The king's fall warns every reader who has ever mistaken being admired for being right.|widens the view
        Uniforms will not end cruelty, but they can take away one easy weapon from those who use it.|widens the view
        Each bike lane is a small vote for a city built for people rather than for cars.|widens the view
        Until we treat sleep as a matter of health, we will keep blaming tired students for a problem we built.|widens the view
        By the last stanza, the sea that drowned her brother has become the only place she can still find him.|widens the view
        The factory's smoke is not only this town's problem; it is a test of what any town will accept for jobs.|widens the view
        A library is the last place in town where a person can spend an afternoon without spending money.|widens the view
        Limiting homework is not about less learning; it is about giving the hours back to the rest of a child's life.|widens the view
      `,
      {
        "repeats the thesis": L(
          "重复论点",
          "It restates the thesis in nearly the same words and adds nothing.",
          "它几乎用同样的话重述了论点，没有增加任何东西。",
          "It does more than restate the thesis in the same words.",
          "它不只是用同样的话重述论点。",
        ),
        "starts a new topic": L(
          "开启新话题",
          "It brings in an issue the essay never discussed, which weakens the ending.",
          "它引入了文章从未讨论过的议题，这削弱了结尾。",
          "It does not bring in a topic the essay never discussed.",
          "它没有引入文章从未讨论过的话题。",
        ),
        "widens the view": L(
          "拓宽视野",
          "It stays with the essay's claim but shows why it matters more widely: a consequence, a larger issue or a changed image.",
          "它紧扣文章的论点，又说明它为何有更广的意义：一个后果、一个更大的议题，或一个被赋予新意的意象。",
          "It does not show why the essay's claim matters beyond the essay.",
          "它没有说明文章的论点在文章之外为何重要。",
        ),
      },
    ),
    choose(
      "the-ending-that-matters",
      ["The Ending That Matters", "有分量的结尾"],
      [
        "To write a conclusion that widens the view, ask **so what?** of your own thesis. Who is affected? What happens if no one acts? What does the text teach about people in general? Then answer in one or two sentences that stay connected to your claim. Avoid tired openings such as *In conclusion* and *To sum up*; let the idea itself signal the end.",
        "要写出拓宽视野的结尾，就对自己的论点问一句**那又怎样？**谁会受影响？如果没有人行动会怎样？这篇文本对人普遍有什么启示？然后用一两句与论点紧密相关的话回答。避免 *In conclusion*、*To sum up* 这类陈旧的开头，让观点本身表明文章已到结尾。",
      ],
      ["Which conclusion best widens the view of the essay's thesis?", "哪个结尾最能拓宽这篇文章论点的视野？"],
      `
        Thesis: The town should restore its old train station rather than tear it down.|A station restored is a promise that the town still expects people to arrive.|In conclusion, for all the reasons that have been given above, the town should restore the old train station rather than tear it down.|The town should also consider building a modern airport on its northern edge.
        Thesis: In the novel, the narrator's silence makes her complicit in her family's cruelty.|Her silence asks every reader how often staying quiet has been a way of taking a side.|To sum up, the narrator's silence makes her complicit in the cruelty of her family.|The novel was made into a successful film that won several awards.
        Thesis: Cities should plant more trees to reduce summer heat.|The trees we plant this year will shade children who have not yet been born.|Therefore, as this essay has shown in each of its paragraphs, cities should plant more trees in order to reduce the summer heat.|Cities should also build more swimming pools for hot summer days.
        Thesis: The speech succeeds because it turns the audience's fear into resolve.|Its real achievement was to make a frightened crowd believe that the next move was theirs.|In conclusion, the speech succeeds because it turns the audience's fear into resolve.|The speaker later wrote a memoir about her early life on a farm.
        Thesis: Schools should teach students how to spot false news.|A student who can test a headline today is a voter who cannot be fooled tomorrow.|So, as the evidence in this essay has shown again and again, schools should teach students how to spot false news stories online.|Schools should also teach students how to cook simple healthy meals.
        Thesis: The poem uses winter to show the speaker's loneliness.|By the final line, the snow that buried the road has also buried the speaker's wish to be found.|To conclude, the poem uses winter to show the loneliness of the speaker.|The poet also wrote a famous collection of poems about summer, which many readers prefer to this one about winter.
        Thesis: The factory should be required to clean the river it polluted.|Making the polluter pay is how a town tells every future company what its river is worth.|Overall, the factory should be required to clean the river it polluted.|The town should also repair the bridge over the river this year.
        Thesis: Animal testing for cosmetics should be banned.|No shade of lipstick is worth what it costs a creature that never chose to pay.|In short, as the points made in the paragraphs above all show, animal testing for cosmetics should be banned by law.|Many cosmetics also contain chemicals that can harm the skin.
        Thesis: The play shows that ambition without conscience destroys the ambitious.|Macbeth wins every crown he reaches for and loses the only self that could have enjoyed it.|In conclusion, the play shows that ambition without conscience is destructive.|Shakespeare wrote the play in about 1606, during the reign of James I.
        Thesis: Public libraries are more needed now than ever.|In a world where almost everything costs money, the library is the last door that opens for free.|Thus, public libraries are more needed now than they have ever been.|Libraries could also start selling coffee to raise extra money.
        Thesis: Voting should be made easier for young people.|A democracy that makes its youngest citizens wait at the door should not be surprised when they stop knocking.|To sum up, voting should be made much easier for young people.|Young people should also be encouraged to volunteer more often.
        Thesis: The memoir shows that the author's exile gave her a second identity.|She never stopped being from her old country; she simply learned to carry it in a second language.|In conclusion, the memoir shows that exile gave the author a second identity.|The author now lives in Canada with her husband and two cats.
        Thesis: Sports programs should be open to every student, not only the best.|The point of a school team is not only to win games but to teach every student what a team feels like.|So, sports programs should be open to every student, not just the best.|The school should also add a chess club and a debate team.
        Thesis: The government should fund research on rare diseases.|Every rare disease is rare only until it is in your own family.|Therefore, for the three reasons explained in this essay, the government should fund more research on rare diseases.|The government should also lower taxes on small businesses.
        Thesis: The short story's ending is ambiguous on purpose.|By refusing to tell us whether she opens the door, the writer leaves the choice with us, where it has been all along.|In conclusion, the ending of the short story is ambiguous on purpose.|The writer's other stories are mostly set in the same small town.
        Thesis: The city should keep its historic market open on Sundays.|Close the market on Sundays, and the city loses the one day it still feels like a village.|To conclude, for all of the reasons that this essay has discussed, the city should keep its historic market open on Sundays.|The city should also build a new parking garage downtown.
      `,
      (right) => [
        `"${right}" answers "so what?": it stays with the thesis but shows why it matters beyond the essay.`,
        `“${right}” 回答了“那又怎样？”：它紧扣论点，又说明论点为何在文章之外也重要。`,
      ],
      [
        [
          '"{wrong}" only repeats the thesis, often after a tired phrase such as In conclusion.',
          "“{wrong}”只是重复论点，而且常常用了 In conclusion 之类陈旧的短语。",
        ],
        ['"{wrong}" brings in a topic the essay never discussed.', "“{wrong}”引入了文章从未讨论过的话题。"],
      ],
    ),
  ],
});

/** writingTopics11 are the rule-checked writing topics of grade 11. */
export const writingTopics11: readonly TopicDef[] = [opposing, concrete, conclusions];
