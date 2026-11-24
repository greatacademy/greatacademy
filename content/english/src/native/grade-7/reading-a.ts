// Grade 7: reading of the first units: relevant and sufficient evidence, how sections work together, fiction beside
// history, how story elements interact, people and events, historical maps, graphs, claims and diagrams.

import type { TopicDef } from "@ga/content";
import { drawn, fourTrends, kindsOfGraph } from "../../figures.ts";
import { type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const relevant = topic("reading", {
  id: "relevant-and-sufficient-evidence",
  title: ["Relevant and Sufficient Evidence", "相关且充分的证据"],
  summary: [
    "Good evidence is relevant, about the claim itself, and sufficient, enough of it and of the right kind to convince.",
    "好的证据要相关，即与论点本身有关；也要充分，即数量足够、种类合适，能令人信服。",
  ],
  intro: [
    "A fact can be 100% true and still do nothing for an argument: saying *Our gym was built in 1998* does not prove that students need longer recess, and quoting one friend does not prove what an entire school thinks. Strong arguments pair **relevant** facts with **sufficient** scale. In this topic you test whether evidence supports a claim and whether there is enough of it to hold up.",
    "一条事实哪怕百分之百真实，也可能对论证毫无帮助：说“体育馆建于 1998 年”证明不了课间应该延长，只问了一位朋友也代表不了全校同学。有力的论证既要求证据**相关**，又要求分量**充分**。本节练习判断证据是否支持论点，以及数量和类型是否够用。",
  ],
  after: ["reasoning"],
  points: [
    label(
      "does-it-support-the-claim",
      ["Does It Support the Claim", "它是否支持论点"],
      [
        "Evidence is **relevant** when it is about the claim and makes it more likely to be true. Evidence can be true and still **off topic**: a fact about a different question does not help. And some evidence actually **works against** the claim. Before you accept a piece of evidence, ask: if this is true, does the claim become more believable?\n\n> **Watch out.** Do not confuse *interesting* or *true* with *relevant*: a fact sharing a keyword with the claim (such as *cafeteria* or *mobile phone*) is still off topic if it never bears on the claim's outcome.",
        "证据与论点有关、能让论点更可能成立时，就是**相关的**。证据可能是真实的，却**离题**：关于另一个问题的事实帮不上忙。还有些证据实际上**与论点相悖**。接受一条证据之前，要问：如果这是真的，论点会不会更可信？\n\n> **注意。** 不要把“有趣”或“真实”当成“相关”：哪怕事实里出现了论点的关键词（如食堂、手机），只要和论点要证明的结果无关，依然是离题。",
      ],
      ["How does this evidence relate to the claim?", "这条证据与论点是什么关系？"],
      `
        Claim: Longer lunch breaks would help students learn. Evidence: In a study, students with longer breaks scored higher on afternoon tests.|supports the claim
        Claim: Longer lunch breaks would help students learn. Evidence: The cafeteria was painted blue last summer.|off topic
        Claim: Longer lunch breaks would help students learn. Evidence: At schools that tried longer breaks, afternoon test scores fell.|works against the claim
        Claim: The town needs a new bike lane. Evidence: Twelve cyclists were hit by cars on Main Street last year.|supports the claim
        Claim: The town needs a new bike lane. Evidence: The town was founded in 1850.|off topic
        Claim: The town needs a new bike lane. Evidence: A count found that almost no one rides a bike on Main Street.|works against the claim
        Claim: Homework should be limited to one hour. Evidence: Students who did more than an hour slept less and scored no better.|supports the claim
        Claim: Homework should be limited to one hour. Evidence: Many students like to listen to music.|off topic
        Claim: Homework should be limited to one hour. Evidence: Students who did two hours a night learned much more in math.|works against the claim
        Claim: The school should plant more trees. Evidence: Trees can cool a schoolyard by several degrees in summer.|supports the claim
        Claim: The school should plant more trees. Evidence: Our school's football team won the league.|off topic
        Claim: The school should plant more trees. Evidence: The new trees would block the only sunny spot for the garden club.|works against the claim
        Claim: Phones should be banned in class. Evidence: Teachers report that students on phones miss key instructions.|supports the claim
        Claim: Phones should be banned in class. Evidence: The first mobile phone weighed over a kilogram.|off topic
        Claim: Phones should be banned in class. Evidence: Students use phones in class to look up facts that help them learn.|works against the claim
        Claim: The library should open on weekends. Evidence: A survey found that 300 families would use it on Saturdays.|supports the claim
        Claim: The library should open on weekends. Evidence: The library has a statue of an owl by the door.|off topic
        Claim: The library should open on weekends. Evidence: When the library tried Saturday hours, almost no one came.|works against the claim
        Claim: Recycling bins in every classroom would cut waste. Evidence: After bins were added in one hallway, trash there dropped by half.|supports the claim
        Claim: Recycling bins in every classroom would cut waste. Evidence: Paper was invented in China.|off topic
        Claim: Recycling bins in every classroom would cut waste. Evidence: At a nearby school, the bins filled with ordinary trash and nothing was recycled.|works against the claim
        Claim: Courts should allow cameras in trials. Evidence: Where cameras are allowed, more people say they trust the courts.|supports the claim
        Claim: Courts should allow cameras in trials. Evidence: Judges in England once wore white wigs.|off topic
        Claim: Courts should allow cameras in trials. Evidence: Some witnesses refuse to speak when a camera is on them.|works against the claim
        Claim: A four-day school week would save money. Evidence: Districts that switched spent less on buses and heating.|supports the claim
        Claim: A four-day school week would save money. Evidence: Friday is named after a Norse goddess.|off topic
        Claim: A four-day school week would save money. Evidence: The districts that switched had to pay extra for child care programs.|works against the claim
        Claim: Students should vote on the school rules. Evidence: Schools where students help make rules report fewer rule breaks.|supports the claim
        Claim: Students should vote on the school rules. Evidence: The school's motto is written in Latin.|off topic
        Claim: Students should vote on the school rules. Evidence: When students voted at one school, they chose rules that were unsafe.|works against the claim
      `,
      {
        "supports the claim": L(
          "支持论点",
          "The evidence bears directly on the claim and, if true, makes the claim more believable.\n\n**Check.** Picture a debate on this claim: the speaker arguing *for* the claim would gladly cite this fact.",
          "这条证据直接针对论点，如果属实，会让论点更可信。\n\n**检验。** 设想一场围绕该论点的辩论：正方会毫不犹豫地引用这条事实来支持自己。",
          "This evidence does not make the claim more believable.",
          "这条证据并没有让论点更可信。",
        ),
        "off topic": L(
          "离题",
          "The evidence may be true, but it is about a different question and does not bear on whether the claim holds.\n\n**Check.** Ask whether either side of a debate could use this fact to win: neither side can, because it leaves the claim untouched.",
          "这条证据也许是真的，但说的是另一个问题，对论点是否成立毫无影响。\n\n**检验。** 想想辩论的正反双方能否拿它当论据：双方都用不上，因为它根本没有触及论点。",
          "This evidence is about the claim, so it is not off topic.",
          "这条证据与论点有关，所以不是离题。",
        ),
        "works against the claim": L(
          "与论点相悖",
          "The evidence is about the claim, but if it is true, the claim becomes weaker rather than stronger.\n\n**Check.** Picture a debate on this claim: the *opposing* side would cite this fact to push back against the claim.",
          "这条证据与论点直接相关，但如果属实，会削弱而不是加强论点。\n\n**检验。** 设想一场辩论：反方正好可以引用这条事实来反驳论点。",
          "This evidence does not make the claim less believable.",
          "这条证据并没有让论点变得不那么可信。",
        ),
      },
    ),
    label(
      "is-it-enough",
      ["Is It Enough", "证据是否足够"],
      [
        "Evidence is **sufficient** when there is enough of it, of the right kind, to convince a careful reader: a survey of many people, results from several places, or a study. **A single case**, one person or one event, is too little to prove a general claim. And **an opinion** (*I think*, *everyone knows*) is not evidence at all, even when it comes from someone you like.\n\n> **Watch out.** Even an expert's or official's bare say-so (*The mayor says it is a great success*) is still an opinion unless it cites verifiable measurements or results.",
        "证据数量足够、种类合适，能说服仔细的读者时，就是**充分的**：对许多人的调查、来自多个地方的结果或一项研究。**单个事例**，即一个人或一件事，不足以证明一个普遍的论点。而**观点**（*I think*、*everyone knows*）根本不是证据，即使它来自你喜欢的人。\n\n> **注意。** 哪怕是名人或官员的个人评价（如“市长说这非常成功”），只要没有给出可核查的数据或结果，依然只是观点而非证据。",
      ],
      ["Is the evidence enough to support the claim?", "这些证据是否足以支持论点？"],
      `
        Claim: Students learn better after exercise. Evidence: A study of 2,000 students in forty schools found higher test scores after gym class.|sufficient
        Claim: Students learn better after exercise. Evidence: My cousin got an A on a test the day after she ran a race.|a single case
        Claim: Students learn better after exercise. Evidence: Everyone knows that a walk clears your head.|an opinion, not evidence
        Claim: The new crosswalk made the street safer. Evidence: Accidents on the street fell from thirty a year to six in the three years since it opened.|sufficient
        Claim: The new crosswalk made the street safer. Evidence: Nobody was hurt on the street last Tuesday.|a single case
        Claim: The new crosswalk made the street safer. Evidence: The mayor says the crosswalk is a great success.|an opinion, not evidence
        Claim: Most students want a later start time. Evidence: In a survey of 900 students, 74 percent chose a later start.|sufficient
        Claim: Most students want a later start time. Evidence: My best friend hates getting up early.|a single case
        Claim: Most students want a later start time. Evidence: I am sure that nobody likes waking up at six.|an opinion, not evidence
        Claim: Juries reach fairer verdicts when they are larger. Evidence: A study of 500 trials found fewer overturned verdicts with twelve jurors than with six.|sufficient
        Claim: Juries reach fairer verdicts when they are larger. Evidence: In one famous trial, a large jury freed an innocent man.|a single case
        Claim: Juries reach fairer verdicts when they are larger. Evidence: It just seems obvious that more people make better choices.|an opinion, not evidence
        Claim: The reading program improved scores. Evidence: Scores rose at all twelve schools that used it, and stayed flat at schools that did not.|sufficient
        Claim: The reading program improved scores. Evidence: One girl in the program read twenty books this year.|a single case
        Claim: The reading program improved scores. Evidence: The teachers who designed it are sure it works.|an opinion, not evidence
        Claim: Coral reefs are losing fish. Evidence: Divers counted fish at 300 reef sites every year for twenty years, and the counts fell steadily.|sufficient
        Claim: Coral reefs are losing fish. Evidence: On my last dive I saw only three fish.|a single case
        Claim: Coral reefs are losing fish. Evidence: A diver on television said the reefs feel emptier.|an opinion, not evidence
        Claim: The vaccine prevents the flu. Evidence: In a trial of 30,000 people, those who got the vaccine caught the flu far less often.|sufficient
        Claim: The vaccine prevents the flu. Evidence: My uncle got the vaccine and did not get sick.|a single case
        Claim: The vaccine prevents the flu. Evidence: My neighbor believes in vaccines very strongly.|an opinion, not evidence
        Claim: Bike helmets reduce head injuries. Evidence: Hospital records from six countries show far fewer head injuries among riders wearing helmets.|sufficient
        Claim: Bike helmets reduce head injuries. Evidence: A boy in our class fell off his bike with a helmet on and was fine.|a single case
        Claim: Bike helmets reduce head injuries. Evidence: A famous cyclist says helmets are the best idea ever.|an opinion, not evidence
        Claim: The fine reduced littering. Evidence: Park workers collected half as much litter in the year after the fine as in the five years before.|sufficient
        Claim: The fine reduced littering. Evidence: I did not see any litter in the park on Sunday.|a single case
        Claim: The fine reduced littering. Evidence: People say the park looks much cleaner now.|an opinion, not evidence
        Claim: Music lessons improve memory. Evidence: Three studies with over a thousand children found that those taking lessons did better on memory tests.|sufficient
        Claim: Music lessons improve memory. Evidence: My piano teacher can remember every phone number she has ever had.|a single case
        Claim: Music lessons improve memory. Evidence: It makes sense that music would train the brain.|an opinion, not evidence
      `,
      {
        sufficient: L(
          "充分",
          "The evidence gathers measurable results across many people, places, or years — enough scale to back up a broad claim.\n\n**Check.** Count the scope: it relies on a large sample, multi-year record, or multi-site study rather than one person or a hunch.",
          "证据汇集了许多人、多个地点或多年的可量化结果，规模足以支撑普遍论点。\n\n**检验。** 看数据规模：它依托大样本、多年记录或多组对照，而不是个例或主观感觉。",
          "This evidence is not enough, or not the right kind, to prove the claim.",
          "这些证据数量不够或种类不对，无法证明论点。",
        ),
        "a single case": L(
          "单个事例",
          "It is one person, one day, or one event, which could easily be luck; a general claim needs many cases.\n\n**Check.** Ask *How many cases were checked?* — only one, so it cannot establish a general pattern.",
          "它只是一个人、一天或一件事，很可能是巧合；普遍的论点需要大量事例。\n\n**检验。** 问一句“这里一共观察了几个例子？”——只有一个，无法推导出普遍规律。",
          "This is not just one person or event.",
          "这不只是一个人或一件事。",
        ),
        "an opinion, not evidence": L(
          "是观点，不是证据",
          "It states what someone thinks, feels, or asserts without verifiable counts or observations, so it is not evidence.\n\n**Check.** Ask *Could another investigator check a number or record here?* — no, there is only a belief or judgment.",
          "这只是某人的想法、感受或主观断语，没有可核查的数据或观察记录，因此不算证据。\n\n**检验。** 问一句“别人能去核对这里的数字或记录吗？”——不能，里面只有信念或评价。",
          "This is a fact that could be checked, not just someone's opinion.",
          "这是可以核实的事实，不只是某人的观点。",
        ),
      },
    ),
  ],
});

const sections = topic("reading", {
  id: "how-sections-of-a-text-work-together",
  title: ["How Sections of a Text Work Together", "文章各部分如何配合"],
  summary: [
    "Each section of an informational text has a job, such as giving background, explaining a cause or offering a solution, and together they build the main idea.",
    "说明文的每一部分都有自己的作用，如交代背景、解释原因或提出解决办法，它们共同构成中心思想。",
  ],
  intro: [
    "A long article is not a random pile of facts; each section plays a distinct role. In an article on wildfires, one section defines dry fuel (**background**), the next explains how drought sparks blazes (**cause**), and the last describes controlled burns (**solution**). In this topic you identify what job a section does and what a subheading promises.",
    "长篇说明文不是事实的随意堆砌，每个部分都承担着明确的分工。比如写野火的文章里，一部分先介绍干燥林木（**背景**），下一部分解释干旱如何引发火灾（**原因**），最后讲计划烧除（**解决办法**）。本节练习辨认各部分的作用，并从小标题预判段落内容。",
  ],
  after: ["how-a-sentence-fits-the-whole"],
  points: [
    label(
      "the-job-of-a-section",
      ["The Job of a Section", "一个部分的作用"],
      [
        "Longer texts are built from sections, and each section does a job for the whole. Some sections give **background**: what the reader needs to know first. Some explain a **cause**: why something happens. Some describe a **solution**: what people are doing about a problem. Some give an **example** that makes an idea concrete. Ask what the text would lose without the section.\n\n> **Watch out.** An **example** zooms in on one named place, animal, or event (*one reef in Australia*, *one sea turtle*), whereas **background** defines a whole concept or system (*what a coral reef is*, *how tides rise and fall*).",
        "较长的文章由若干部分组成，每部分都为整体承担一项作用。有的部分交代**背景**：读者首先需要知道的内容。有的解释**原因**：某事为什么发生。有的描述**解决办法**：人们正在为一个问题做些什么。有的举出**例子**，让观点变得具体。问一问：没有这一部分，文章会失去什么？\n\n> **注意。** **例子**会聚焦到某一个具体的地点、动物或事件（如“澳大利亚的一处珊瑚礁”“一只海龟”），而**背景**是在介绍整类概念或规律（如“什么是珊瑚礁”“潮汐如何涨落”）。",
      ],
      ["In an article about the ocean, what job does this section do?", "在一篇关于海洋的文章中，这一部分起什么作用？"],
      `
        It explains what a coral reef is and where reefs are found, before the article turns to the dangers they face.|background
        It explains that warmer water makes corals push out the algae that feed them.|cause
        It describes how scientists are growing young corals in tanks and planting them on damaged reefs.|solution
        It tells the story of one reef in Australia that lost half its coral in a single summer.|example
        It defines the deep sea as the dark water below 200 meters.|background
        It explains that plastic breaks into tiny pieces that fish mistake for food.|cause
        It describes a new law that bans plastic bags in coastal towns.|solution
        It follows one sea turtle that was found with forty pieces of plastic in its stomach.|example
        It describes how tides rise and fall twice a day.|background
        It explains that overfishing removes the big fish that keep smaller animals in balance.|cause
        It describes marine parks where fishing is not allowed so that fish can recover.|solution
        It tells how cod nearly disappeared from the waters off Canada in the 1990s.|example
        It explains what plankton are and why so many animals depend on them.|background
        It explains that chemicals from farms wash into rivers and then into the sea.|cause
        It describes farmers planting strips of grass to stop chemicals from reaching the river.|solution
        It describes a "dead zone" in the Gulf of Mexico where few fish can live.|example
        It explains what a kelp forest is and how tall the kelp grows.|background
        It explains that sea urchins eat kelp when the otters that hunt them are gone.|cause
        It describes how otters were brought back to the coast so that the kelp could regrow.|solution
        It tells how one bay in California lost almost all its kelp in five years.|example
        It gives a short history of whaling and the numbers of whales that were killed.|background
        It explains that ship noise makes it hard for whales to hear each other.|cause
        It describes quieter ship engines that some companies now use.|solution
        It tells about a whale that changed its song to be heard over the noise.|example
        It explains what mangroves are and where they grow.|background
        It explains that mangroves are cut down to make room for shrimp farms.|cause
        It describes villagers replanting mangroves along the shore.|solution
        It tells how a village in Indonesia was saved from a storm by its mangrove forest.|example
        It explains how sea ice forms in winter and melts in summer.|background
        It explains that warmer air melts the ice earlier each spring.|cause
      `,
      {
        background: L(
          "背景",
          "The section defines a term, explains how a system works, or gives basic context before the problem is analyzed.\n\n**Check.** Ask *What would be missing if a reader skipped this?* — they would not know what the topic even is before the problem begins.",
          "这一部分定义概念、介绍机制或交代基础历史，为后面的问题讨论做铺垫。\n\n**检验。** 想想读者跳过这一部分会缺什么——在讨论问题之前，连对象本身是什么都还不清楚。",
          "This section does more than give the reader what they need to know first.",
          "这一部分的作用不只是交代读者首先需要知道的内容。",
        ),
        cause: L(
          "原因",
          "The section explains why a problem happens, tracing what triggers the damage.\n\n**Check.** Notice that the section answers *Why is this happening?* rather than defining the subject or describing a fix.",
          "这一部分解释问题为什么发生，说明造成破坏的根源。\n\n**检验。** 这一部分回答的是“为什么会这样？”，而不是给概念下定义或介绍对策。",
          "This section does not explain why something happens.",
          "这一部分并不解释某事为什么发生。",
        ),
        solution: L(
          "解决办法",
          "The section describes actions people are taking — laws, parks, new designs, or restoration — to fix or prevent the problem.\n\n**Check.** Notice the focus on human action aimed at repairing or stopping the harm.",
          "这一部分描述人们为解决问题或防止危害采取的行动（如立法、保护区、新技术或修复）。\n\n**检验。** 段落重点落在“人们正在怎么做来改善现状”。",
          "This section does not describe what people are doing about a problem.",
          "这一部分并不描述人们为解决问题所做的事。",
        ),
        example: L(
          "例子",
          "The section zooms in on one specific place, animal, or case to make a general idea concrete.\n\n**Check.** Spot the specific case (*one reef*, *one sea turtle*, *one bay*, *a village*): it illustrates a broader point with a real instance.",
          "这一部分聚焦于某一个具体的地点、动物或事件，让抽象道理落到实处。\n\n**检验。** 找到里面的特例（如“一处珊瑚礁”“一只海龟”“一个海湾”“一个村庄”）：它用单个真实案例印证普遍观点。",
          "This section does not tell one particular case.",
          "这一部分并不讲述一个具体的事例。",
        ),
      },
    ),
    label(
      "what-a-heading-promises",
      ["What a Heading Promises", "标题预示什么"],
      [
        "A good heading tells you the job of the section before you read it. *What Is a Tide?* promises **background**. *Why Are Reefs Dying?* promises a **cause**. *What Happens to the Fish* promises an **effect**: what a change leads to. *How Divers Are Helping* promises a **solution**. Reading the headings first shows you how the parts of the text fit together.\n\n> **Watch out.** Do not mix up **cause** and **effect**: *Why …* or *What Causes …* looks backward to the trigger (**cause**), whereas *What Happens When …* or *What X Means for Y* looks forward to the fallout (**effect**).",
        "好的小标题在你阅读之前就告诉你这一部分的作用。*What Is a Tide?* 预示**背景**。*Why Are Reefs Dying?* 预示**原因**。*What Happens to the Fish* 预示**结果**：一种变化会带来什么。*How Divers Are Helping* 预示**解决办法**。先读小标题，就能看出文章各部分是如何配合的。\n\n> **注意。** 不要把**原因**和**结果**混为一谈：*Why …* 或 *What Causes …* 往前追问源头（**原因**），而 *What Happens When …* 或 *What X Means for Y* 往后看带来的后果（**结果**）。",
      ],
      ["What will the section under this heading most likely do?", "这个小标题下的部分最可能做什么？"],
      `
        What Is a Coral Reef?|background
        Why Are the Reefs Turning White?|cause
        What Happens When the Coral Dies|effect
        How Scientists Are Rebuilding Reefs|solution
        The Deep Sea: A World Without Light|background
        Why Plastic Ends Up in the Ocean|cause
        What Plastic Does to Sea Birds|effect
        Cleaning Up the Great Pacific Garbage Patch|solution
        Understanding Ocean Currents|background
        Why the Currents Are Slowing|cause
        What a Slower Current Means for Europe's Weather|effect
        Steps Nations Are Taking to Cut Carbon|solution
        Meet the Mangrove|background
        Why Mangroves Are Disappearing|cause
        What Coastal Villages Lose Without Mangroves|effect
        Planting a Forest in the Sea|solution
        Life in a Tide Pool|background
        What Causes Red Tides|cause
        How Red Tides Harm Shellfish and People|effect
        Warning Systems for Beach Towns|solution
        The Food Web of the Open Ocean|background
        Why Fish Stocks Are Falling|cause
        Empty Nets: What Overfishing Does to Fishing Towns|effect
        Fishing Rules That Let Stocks Recover|solution
        What Is Sea Ice?|background
        Why the Arctic Is Warming Faster|cause
        What Melting Ice Means for Polar Bears|effect
        Protecting the Last Ice|solution
        Kelp Forests Explained|background
        How Otters Saved the Kelp|solution
      `,
      {
        background: L(
          "背景",
          "The heading introduces or defines the subject itself, signaling that the section gives basic facts first.\n\n**Check.** Notice there is no *why*, no consequence, and no fix named — it simply introduces the topic.",
          "小标题直接引出或界定主题本身，说明这一部分先介绍基本情况。\n\n**检验。** 标题里没有问“为什么”，也没有提到后果或对策，只是在带你认识主题。",
          "The heading does not promise an explanation of what something is.",
          "这个小标题并不预示要解释某物是什么。",
        ),
        cause: L(
          "原因",
          "The heading asks *why* or names what causes a problem, promising an explanation of the trigger.\n\n**Check.** Notice the backward-looking clue (*Why …* or *What Causes …*): the section will trace what drives the change.",
          "小标题问“为什么”或直接提到“成因”，预示着要解释背后的触发因素。\n\n**检验。** 标题里的线索（*Why …* 或 *What Causes …*）指向源头，说明下文要追问原因。",
          "The heading does not promise to explain why something happens.",
          "这个小标题并不预示要解释某事为什么发生。",
        ),
        effect: L(
          "结果",
          "The heading names what a change leads to — what happens, what is lost, or who is harmed.\n\n**Check.** Notice the forward-looking phrasing (*What … Does to*, *What … Means for*, *What Happens When*): it points to consequences.",
          "小标题点出某种变化带来的后果——发生了什么、失去了什么或谁受到了影响。\n\n**检验。** 标题中的措辞（如 *What … Does to*、*What … Means for*、*What Happens When*）指向的是后续结果。",
          "The heading does not promise to describe what a change leads to.",
          "这个小标题并不预示要描述一种变化会带来什么。",
        ),
        solution: L(
          "解决办法",
          "The heading names concrete actions — rebuilding, cleaning up, planting, rules, warning systems, or saving — aimed at fixing the problem.\n\n**Check.** Look for the action word in the heading: it promises a response to the threat rather than a description of the damage.",
          "小标题点出了重建、清理、种植、立法、预警或拯救等具体行动，目的是解决问题。\n\n**检验。** 找标题里的行动词：它预示的是应对方案，而不是描述破坏本身。",
          "The heading does not promise to describe what people are doing about a problem.",
          "这个小标题并不预示要描述人们为解决问题所做的事。",
        ),
      },
    ),
  ],
});

const fictionAndHistory = topic("reading", {
  id: "comparing-fiction-and-history",
  title: ["Comparing Fiction and History", "比较小说与史实"],
  summary: [
    "A historical novel and a history book can tell of the same time; comparing them shows what the author kept, changed and invented, and why.",
    "历史小说和历史书可以讲述同一时代；比较两者，能看出作者保留、改动和虚构了什么，以及为什么这样做。",
  ],
  intro: [
    "A history book states that the Erie Canal opened in 1825; a historical novel imagines a twelve-year-old mule driver shivering on the towpath that morning; a real worker's letter complains about wet boots. Comparing these three kinds of writing shows what stays anchored in records and what novelists reshape for drama. In this topic you tell the three text types apart and spot why a novelist alters history.",
    "历史书写道伊利运河于 1825 年通航；历史小说会想象一名十二岁的赶骡少年那天清晨在纤道上瑟瑟发抖；当时的工人信件则会抱怨靴子湿透。对比这三类文本，就能分清哪些内容有史料依据、哪些是小说家为了叙事而改写。本节练习辨认三类文本，并分析小说家改动史实的手法。",
  ],
  after: ["historical-fiction-facts-and-inventions"],
  points: [
    label(
      "which-kind-of-text",
      ["Which Kind of Text", "哪一类文本"],
      [
        "Three kinds of text can tell of the same past. A **history book** reports what happened, with dates, numbers and the views of historians. A **historical novel** adds what no record could show: thoughts, feelings, invented dialogue and characters. A **letter from the time** is a primary source: one real person writing then, with their own view and their own limits.\n\n> **Watch out.** Both a historical novel and a letter from the time can sound personal, so check the framing: a letter opens with a greeting to someone (*Dear brother*, *Father*, *Honored sir*) and uses *I/we* from inside the moment, whereas a novel narrates a scene in third-person detail (or quoted dialogue) that no real document recorded.",
        "三类文本可以讲述同一段过去。**历史书**报告发生了什么，有日期、数字和史学家的观点。**历史小说**加上了任何记录都无法呈现的东西：想法、感受、虚构的对话和人物。**当时的信件**是第一手资料：一个真实的人在当时写下的，有他自己的看法，也有他自己的局限。\n\n> **注意。** 历史小说和当时的信件都带有个人色彩，区分时要看语境：信件有写给某人的称呼（如 *Dear brother*、*Father*、*Honored sir*）并以第一人称倾诉当下经历，而小说常以第三人称描写内心活动或虚构对话——这些是史料不可能记下来的。",
      ],
      ["Which kind of text does this sentence most likely come from?", "这句话最可能出自哪一类文本？"],
      `
        In 1503, the government of Florence asked Leonardo to paint a battle scene in the council hall.|a history book
        Leonardo stared at the wet wall and wondered, for the hundredth time, whether the paint would hold.|a historical novel
        Dear brother, Master Leonardo has made us grind colors all week, and my hands are blue to the wrist.|a letter from the time
        Historians believe that Michelangelo worked on the Sistine ceiling for about four years.|a history book
        "Hold the ladder, boy," Michelangelo growled, "or we will both end up on the floor."|a historical novel
        My dearest wife, the pope has paid me nothing this month, and the ceiling still eats my days.|a letter from the time
        The printing press reached Venice around 1469, and the city soon had dozens of print shops.|a history book
        Marco ran his fingers over the fresh page and smelled the ink, and he knew his life had changed.|a historical novel
        Honored sir, I send you the first printed copy of the book, with all its errors corrected.|a letter from the time
        Florence's population fell sharply when the plague returned in the 1400s.|a history book
        Lucia held her breath as the cart of the sick rolled past her door.|a historical novel
        Good friend, the sickness has come again to our street, and we keep the shutters closed.|a letter from the time
        Galileo was put on trial in 1633 for supporting the idea that the Earth moves.|a history book
        Galileo looked at the judges and felt the cold of the stone floor through his shoes.|a historical novel
        My dear daughter, do not grieve for me; I am treated kindly, though I may not leave the house.|a letter from the time
        The Medici family were bankers who paid many artists of the Renaissance.|a history book
        Young Sandro bowed low as Lorenzo de' Medici swept into the workshop.|a historical novel
        Most gracious lord, I beg you to accept this small painting as a sign of my thanks.|a letter from the time
        Scholars estimate that about twenty of Leonardo's paintings survive today.|a history book
        The apprentice watched in silence as the master tore up yet another drawing.|a historical novel
        Sister, I have seen the great dome at last, and it is finer than anyone told us.|a letter from the time
        Brunelleschi's dome was completed in 1436 without a wooden frame to hold it up.|a history book
        "They said it could not be done," Filippo whispered, looking up at the curve of brick.|a historical novel
        Father, the dome is finished, and the whole city came out to see it blessed.|a letter from the time
        Workshops trained boys as apprentices from about the age of twelve.|a history book
        Tommaso swept the floor and dreamed of the day he would hold a brush of his own.|a historical novel
        Master, I have finished the copies you asked for and await your judgment.|a letter from the time
        Copernicus published his book about the sun at the center in 1543.|a history book
        The old astronomer held the first printed copy of his book in his trembling hands.|a historical novel
        Learned friend, I fear that my book will anger many, yet I cannot hide what the sky shows.|a letter from the time
      `,
      {
        "a history book": L(
          "历史书",
          "The sentence reports verifiable facts — dates, numbers, or historians' conclusions — in an objective third-person voice without inventing thoughts or dialogue.\n\n**Check.** Notice there is no direct greeting to a recipient and no peek inside a character's private thoughts.",
          "这句话以客观的第三人称报告可核查的史实（日期、数据或史学家结论），没有虚构心理活动或对话。\n\n**检验。** 句中既没有给收信人的称呼，也没有窥探人物内心想法的描写。",
          "This sentence does more than report facts and dates.",
          "这句话的内容不只是报告事实和日期。",
        ),
        "a historical novel": L(
          "历史小说",
          "The sentence steps inside a character's mind, senses, or unrecorded dialogue — details no historical archive could capture.\n\n**Check.** Ask *Could a historian prove this exact feeling, whisper, or gesture from a record?* — no, which marks it as fiction.",
          "这句话进入了人物的内心、感官或未经记录的对话，这些细节是历史档案不可能留存的。\n\n**检验。** 问一句“史学家能从档案里考证出这个念头、这句低语或这个动作吗？”——不能，说明它出自小说。",
          "This sentence does not show invented thoughts, feelings or dialogue.",
          "这句话并没有呈现虚构的想法、感受或对话。",
        ),
        "a letter from the time": L(
          "当时的信件",
          "The sentence is addressed directly to a recipient (*Dear brother*, *Father*, *Honored sir*) in the first person by someone living through the event.\n\n**Check.** Look at the opening salutation and *I/we* voice: it reads as a primary source written to another person in that era.",
          "这句话由亲历者以第一人称直接写给某位收信人（如 *Dear brother*、*Father*、*Honored sir*）。\n\n**检验。** 看开头的称呼和第一人称口吻：它是当时人写给同时代人的第一手信件。",
          "This sentence is not written by someone of the time to a person they know.",
          "这句话并不是当时的人写给认识的人的。",
        ),
      },
    ),
    label(
      "why-the-author-changed-it",
      ["Why the Author Changed It", "作者为什么改动"],
      [
        "Historical novelists often explain their changes in an **author's note**. Some changes **compress time**, squeezing years into weeks so the story moves. Some **add a character** the reader can follow, often an invented young person who sees the famous events. Some **fill a gap**, imagining what happened where the records are silent. Comparing the novel with history shows which change the author made.\n\n> **Watch out.** Do not confuse **added a character** with **filled a gap**: if the author invents a whole person who never existed, that is *added a character*; if the records simply left a moment blank for real people (such as what someone said or felt), that is *filled a gap*.",
        "历史小说家常在**作者附记**中解释自己的改动。有的改动**压缩时间**，把几年压成几周，让故事推进。有的**加入一个人物**供读者跟随，常常是一个虚构的年轻人，亲眼看到那些著名的事件。有的**填补空白**，在记录沉默的地方想象发生了什么。把小说与史实相比较，就能看出作者做了哪种改动。\n\n> **注意。** 不要把**加入了人物**和**填补了空白**混为一谈：凭空创造一个历史上不存在的人，是“加入了人物”；在史料没有记载的细节处为真实历史人物补上对话、心理或经过，才是“填补了空白”。",
      ],
      ["Which change did the author make?", "作者做了哪种改动？"],
      `
        In real life the dome took sixteen years to build; in the novel it rises in a single summer.|compressed time
        The novel is told by Nico, a young apprentice who never existed, who carries Leonardo's paints.|added a character
        No one knows what Leonardo said to the duke that night, so the novel imagines their talk.|filled a gap
        Galileo's trial lasted months, but the novel shows it all in one dramatic day.|compressed time
        The heroine, a printer's daughter, is invented; the printers around her are real.|added a character
        The records do not say how Michelangelo felt when the ceiling was finished, so the author imagines his relief.|filled a gap
        The plague of 1348 and the plague of 1400 become a single outbreak in the story.|compressed time
        A young servant girl, made up by the author, watches the Medici from the kitchen.|added a character
        Nobody recorded what Copernicus thought as he lay dying, so the novel describes his last thoughts.|filled a gap
        Years of letters between the two artists are turned into one long conversation.|compressed time
        The author invents a street boy who becomes Botticelli's model.|added a character
        No record tells where the stolen painting was hidden, so the novel invents a hiding place.|filled a gap
        The real journey took two years; the novel's travelers arrive in a month.|compressed time
        An invented cousin of Galileo tells the story of his discoveries.|added a character
        History does not say who first noticed the crack in the wall, so the novel gives that moment to the hero.|filled a gap
        Three different visits of the pope to the workshop become one visit in the book.|compressed time
        The novel adds a made-up rival painter who tries to steal Leonardo's ideas.|added a character
        No one knows why Leonardo left the painting unfinished, so the author suggests a reason.|filled a gap
        A building that took decades is finished in the space of three chapters.|compressed time
        The story follows an invented family of glassmakers who sell lenses to scientists.|added a character
        The records are silent about the apprentice's early life, so the novel imagines his childhood.|filled a gap
        A war that lasted ten years is told as a single season of fighting.|compressed time
        The author creates a young scribe who copies Copernicus's book in secret.|added a character
        No letter shows how the city reacted to the news, so the novel describes a crowd in the square.|filled a gap
        The novel combines two real voyages into one trip.|compressed time
        A made-up orphan becomes the eyes through which readers see the great workshop.|added a character
        No one knows exactly how the statue was moved, so the author describes the night it was carried.|filled a gap
        The events of a whole year happen in one week of the novel.|compressed time
        The book invents a friend for Michelangelo who listens to all his complaints.|added a character
        History does not record the first words spoken in the new hall, so the novel supplies them.|filled a gap
      `,
      {
        "compressed time": L(
          "压缩了时间",
          "Events that took years — or happened across separate dates — are shortened or merged into one span so the plot keeps moving.\n\n**Check.** Compare the real timeline with the novel's timeline: the span shrinks or multiple events collapse into one.",
          "原本跨越数年或分处不同时间点的事件，被缩短或合并到更短的时间段里，以加快情节节奏。\n\n**检验。** 对比真实时间线与小说时间线：持续时间明显缩短，或者几次事件合并成了一次。",
          "The change here is not about squeezing events into less time.",
          "这里的改动与把事件压缩到更短的时间无关。",
        ),
        "added a character": L(
          "加入了人物",
          "The author invented a person (or family) who never existed in history, usually to give readers a viewpoint into real events.\n\n**Check.** Spot the phrase flagging invention of a person (*never existed*, *invented*, *made up*, *creates*): that marks an added character.",
          "作者虚构了一个历史上并不存在的人（或家庭），通常是为了让读者借他的视角观察真实事件。\n\n**检验。** 找出标明“人”是虚构的线索（如“从未存在”“虚构的”“编造的”），即可确认是加入了人物。",
          "The change here does not invent a new person.",
          "这里的改动并没有虚构新的人物。",
        ),
        "filled a gap": L(
          "填补了空白",
          "The historical record is silent on a detail — a private conversation, motive, or reaction — so the author imagined what might have happened.\n\n**Check.** Spot the clue about missing records (*No one knows*, *The records do not say*, *History does not record*): the author is filling a documented silence.",
          "史料对某个细节（私下谈话、动机或反应）没有记载，于是作者合理想象了可能发生的情景。\n\n**检验。** 找出指出史料缺失的线索（如“无人知晓”“记录未提及”“史书没有记载”），说明作者是在填补空白。",
          "The change here is not imagining something the records leave out.",
          "这里的改动并不是想象记录中缺失的内容。",
        ),
      },
    ),
  ],
});

const storyElements = topic("reading", {
  id: "how-story-elements-interact",
  title: ["How Story Elements Interact", "故事要素如何相互作用"],
  summary: [
    "Setting, characters and plot shape one another: a place can cause events, and a character's choices can turn the plot.",
    "背景、人物和情节相互影响：一个地方可以引发事件，人物的选择可以改变情节。",
  ],
  intro: [
    "Setting, character, and plot are not separate boxes on a worksheet; they push on one another. A blizzard strands travelers in an inn (setting driving plot), years at sea make a captain calm in danger (setting shaping character), and a character's refusal to lie turns the whole story (choice driving plot). In this topic you trace how setting works and what drives an event.",
    "背景、人物和情节并不是彼此割裂的表格栏目，它们时刻在互相推动。暴风雪把旅人困在客栈（背景推动情节），多年航海让船长遇险不惊（背景塑造人物），人物拒绝撒谎扭转了结局（选择推动情节）。本节练习分析背景的作用，并辨别推动事件发展的动力。",
  ],
  after: ["how-setting-shapes-a-story", "how-characters-face-challenges"],
  points: [
    label(
      "how-the-setting-works",
      ["How the Setting Works", "背景如何起作用"],
      [
        "A setting does more than give a place and a time. It can **cause an event**: a flood traps the travelers, a curfew keeps the hero indoors. It can **shape a character**: a girl who grows up on a fishing boat is unafraid of storms. And it can **set the mood**: a dark, silent workshop at midnight makes the reader uneasy.\n\n> **Watch out.** Check whether anything *happens* or *changes* in the plot: if the sentence only paints sights, sounds, or atmosphere without forcing an action or explaining a character's trait, it **sets the mood**.",
        "背景不只是交代地点和时间。它可以**引发事件**：洪水困住了旅行者，宵禁让主人公待在室内。它可以**塑造人物**：在渔船上长大的女孩不怕风暴。它还可以**营造气氛**：午夜里黑暗寂静的作坊让读者感到不安。\n\n> **注意。** 看句中是否发生了情节转折或解释了性格成因：如果只是用画面、声音和光影渲染氛围，没有迫使人物采取行动也没有解释性格由来，那就是**营造气氛**。",
      ],
      ["How does the setting work in this part of the story?", "在故事的这一部分，背景起什么作用？"],
      `
        When the river floods the road to Florence, the young painter must stay a week at a strange farm.|it causes an event
        Raised among the noise and smoke of the foundry, Paolo is not afraid of fire.|it shapes a character
        The workshop is silent at midnight, and the half-finished statues look like ghosts in the candlelight.|it sets the mood
        Because the city gates close at sunset, Elena is locked outside with the stolen letter.|it causes an event
        Growing up in a library, Marco learned to read Latin before he could ride a horse.|it shapes a character
        Golden light fills the square as bells ring for the festival.|it sets the mood
        The plague closes every shop in town, so the apprentice loses his job.|it causes an event
        Years in the crowded market have made Rosa quick with numbers and quicker with jokes.|it shapes a character
        Fog creeps along the canal, and somewhere a door bangs in the wind.|it sets the mood
        Snow blocks the mountain pass, and the messenger cannot reach the duke in time.|it causes an event
        Living in a city of rival families, Luca trusts no one he has just met.|it shapes a character
        Bright flowers spill from every window of the cheerful little street.|it sets the mood
        The ship's mast breaks in the storm, and the traders wash up on an unknown shore.|it causes an event
        A childhood in the quiet hills has made Chiara patient and slow to anger.|it shapes a character
        The cold stone cell is so dark that the prisoner cannot see his own hands.|it sets the mood
        When the bridge collapses, the two families on either side of the river cannot meet.|it causes an event
        Born in a painter's workshop, Bianca has always seen the world in colors and shapes.|it shapes a character
        Warm bread smells drift from the bakery as the town wakes up.|it sets the mood
        A fire in the palace forces the artist to save one painting and leave the rest.|it causes an event
        The hard life of the farm has made Giulio strong and stubborn.|it shapes a character
        Thunder rolls over the empty church, and the candles flicker.|it sets the mood
        The drought dries the wells, and the villagers must leave their homes.|it causes an event
        Raised by sailors in a busy port, Teo speaks four languages.|it shapes a character
        The garden is green and still, and only the fountain makes a sound.|it sets the mood
        Because the market is shut for the holiday, Sofia cannot sell her paintings.|it causes an event
        Growing up poor in a rich city has made Matteo determined to succeed.|it shapes a character
        Shadows stretch across the narrow alley as the last lamp goes out.|it sets the mood
        An earthquake cracks the wall where the fresco was painted.|it causes an event
        Years in the convent school have made Agnese careful and polite.|it shapes a character
        The crowded square roars with music, laughter and the cries of sellers.|it sets the mood
      `,
      {
        "it causes an event": L(
          "引发事件",
          "A condition of the place or time — flood, curfew, storm, earthquake, or law — directly triggers a plot event.\n\n**Check.** Trace the cause-and-effect chain: remove that setting detail and the plot event disappears.",
          "地点或时间的某种状况（洪水、宵禁、风暴、地震或禁令）直接触发了情节事件。\n\n**检验。** 顺着因果链看：如果拿掉这个背景条件，后面那件情节事件就不会发生。",
          "The setting here does not make anything happen in the plot.",
          "这里的背景并没有让情节中发生什么事。",
        ),
        "it shapes a character": L(
          "塑造人物",
          "Where and how the character grew up explains a lasting trait, skill, or habit they carry.\n\n**Check.** Look for upbringing clues (*Raised*, *Growing up*, *Years in*, *Born in*) paired with a trait or ability: the place formed who the person is.",
          "人物成长的环境解释了他身上持久的性格、本领或习惯。\n\n**检验。** 找成长背景线索（如“在……长大”“多年在……”）与性格/能力的对应关系：环境造就了这个人。",
          "The setting here does not explain who a character is.",
          "这里的背景并没有解释人物是什么样的人。",
        ),
        "it sets the mood": L(
          "营造气氛",
          "Sensory details of light, sound, smell, or stillness build an emotional atmosphere without triggering a plot event or explaining a backstory.\n\n**Check.** Notice that nothing changes in the plot yet — the sentence exists to make the reader *feel* the scene.",
          "光影、声音、气味或寂静等感官细节营造出情绪氛围，并没有触发情节转折或解释人物身世。\n\n**检验。** 情节此刻并没有推进，这句话的作用纯粹是让读者感受到现场气氛。",
          "The setting here does more than create a feeling.",
          "这里的背景作用不只是营造一种感受。",
        ),
      },
    ),
    label(
      "what-drives-the-event",
      ["What Drives the Event", "是什么推动了事件"],
      [
        "In a story, events happen for reasons. Some happen because of **a character's choice**: she decides to open the letter, he refuses to bow. Some happen because of **the setting**: the winter, the war, the law of the city. Some happen **by chance**: a lucky meeting, a sudden accident. Strong plots are driven mostly by choices, because choices show who the characters are.\n\n> **Watch out.** Tell **the setting** apart from **chance**: lasting conditions of the world (laws, taxes, guild rules, seasons, wars, droughts) belong to *the setting*, whereas sudden freak strokes (a gust of wind, a broken wheel, a sneeze, a lucky meeting) are *chance*.",
        "故事中的事件都有原因。有的发生是因为**人物的选择**：她决定拆开那封信，他拒绝鞠躬。有的发生是因为**背景**：冬天、战争、城市的法令。有的是**偶然**发生的：一次幸运的相遇、一场突然的意外。好的情节主要由选择推动，因为选择能显示人物是什么样的人。\n\n> **注意。** 分清**背景**与**偶然**：法令、税收、行规、季节、战争、旱灾这类时代或环境的既有条件属于“背景”，而一阵突如其来的风、车轮恰好断了、打喷嚏或偶遇属于“偶然”。",
      ],
      ["What makes this event happen?", "是什么让这件事发生的？"],
      `
        Elena decides to read the secret letter, and so she learns of the plot against the duke.|a character's choice
        The long winter freezes the river, and the boats carrying marble cannot reach the city.|the setting
        By pure luck, the apprentice drops his sketch right at the feet of a rich patron.|chance
        Marco refuses to sign the false statement, so the judge sends him to prison.|a character's choice
        The city's law forbids night work, so the painters must stop at sunset.|the setting
        A sudden gust of wind blows the plans out of the window and into the canal.|chance
        Sofia chooses to tell the truth about the broken statue, and her master forgives her.|a character's choice
        The war cuts the trade roads, and the workshop runs out of blue paint.|the setting
        Two old friends meet by accident in a crowded market after twenty years.|chance
        Luca decides to leave his village for Florence, and his new life begins.|a character's choice
        Because the plague has closed the city, the travelers must camp outside its walls.|the setting
        A lightning strike sets fire to the barn where the paintings are stored.|chance
        Bianca takes the blame for her brother's mistake, and she loses her place at the school.|a character's choice
        The drought ruins the harvest, and the family cannot pay the rent.|the setting
        A stranger happens to sit next to Paolo at the inn and turns out to be a famous sculptor.|chance
        The young printer decides to publish the forbidden book.|a character's choice
        The rules of the guild say no woman may sell paintings, so Agnese signs her brother's name.|the setting
        The cart's wheel breaks just outside the gate, and the merchant misses the sale.|chance
        Teo chooses to share his bread with the beggar, who later saves his life.|a character's choice
        The flooding of the lower town forces everyone to move uphill.|the setting
        A coin rolls under the door, and Chiara follows it into the secret room.|chance
        Giulio decides to apologize to his rival, and the two begin to work together.|a character's choice
        The custom of the city says the eldest son must take over the shop, so Matteo cannot study art.|the setting
        A loose stone falls just as the duke walks past, missing him by inches.|chance
        Rosa decides to follow the thief through the dark streets.|a character's choice
        The heat of the summer makes the fresco dry too fast, and it cracks.|the setting
        By coincidence, the lost ring turns up in a fish at the market.|chance
        The apprentice chooses to finish the painting in secret after his master falls ill.|a character's choice
        The new tax on cloth ruins the weavers of the city.|the setting
        A sneeze at the wrong moment gives away the hiding spy.|chance
      `,
      {
        "a character's choice": L(
          "人物的选择",
          "A character deliberately decides, chooses, refuses, or takes action, and that decision drives what follows.\n\n**Check.** Ask *Could the character have chosen differently here?* — yes, which proves the character's will drives the event.",
          "人物主动做出决定、选择、拒绝或采取行动，从而推动了后续发展。\n\n**检验。** 问一句“人物本来可以做另一种选择吗？”——可以，说明是人物的意志推动了事件。",
          "This event is not caused by a decision a character makes.",
          "这个事件并不是由人物的决定引起的。",
        ),
        "the setting": L(
          "背景",
          "A broader condition of the time or place — season, war, plague, law, custom, or tax — forces the event.\n\n**Check.** Notice that this force affects the whole world of the story, not just a single accidental moment.",
          "时代或地点的既有条件（季节、战争、瘟疫、法令、习俗或税收）迫使事件发生。\n\n**检验。** 这种力量是整个故事世界共有的大环境，而不是某个孤立的巧合。",
          "This event is not caused by the time or place.",
          "这个事件并不是由时间或地点引起的。",
        ),
        chance: L(
          "偶然",
          "No one chose it and no rule of the setting caused it: it happened by luck, coincidence, or a sudden mishap.\n\n**Check.** Look for the unplannable stroke (*by luck*, *by accident*, *happens to*, *sudden gust*, *loose stone*, *sneeze*): pure timing made it happen.",
          "既非人物选择，也非大环境规律所致，而是出于运气、巧合或突发意外。\n\n**检验。** 找出无法预料的偶然因素（如“纯属巧合”“碰巧”“一阵突如其来的风”“一块松动的石头”“一个喷嚏”）：全靠时机凑巧。",
          "This event is not just luck or accident.",
          "这个事件并不只是运气或意外。",
        ),
      },
    ),
  ],
});

const individuals = topic("reading", {
  id: "how-individuals-and-events-interact",
  title: ["How People and Events Interact", "人物与事件如何相互影响"],
  summary: [
    "In history, people shape events and events shape people, and ideas travel from one place to another through trade, travel, writing and teaching.",
    "在历史中，人塑造事件，事件也塑造人；思想通过贸易、旅行、书写和教学从一个地方传到另一个地方。",
  ],
  intro: [
    "History is a two-way street: a single leader's decree can reroute an entire kingdom's trade, while a famine or exile can reshape who a young person grows up to be — and meanwhile, beliefs and inventions travel along caravan roads, letters, and schools. In this topic you trace who shaped whom in historical accounts and how ideas spread.",
    "历史从来不是单向的：一位领袖的决策能改变整个王国的贸易路线，而一场饥荒或流亡也能重塑一个年轻人的性格；与此同时，思想和技艺正借由商队、书信与学校四处传播。本节练习梳理历史文本中人物、事件与思想的相互影响，并辨认它们的传播途径。",
  ],
  after: ["cause-and-effect-in-history"],
  points: [
    label(
      "who-shaped-whom",
      ["Who Shaped Whom", "谁影响了谁"],
      [
        "Informational texts about history show how **people and events affect each other**. Sometimes **a person changed events**: a ruler's decision started a war or built a city. Sometimes **events changed a person**: a drought, a war or a journey turned someone into a leader or a scholar. And sometimes **an idea changed events**: a belief or a new way of thinking spread and reshaped a whole society.\n\n> **Watch out.** Check the direction of the arrow: if a named leader's action reshaped a kingdom, *a person changed events*; if an experience reshaped one person's life or character, *events changed a person*.",
        "关于历史的说明文展示**人与事件如何相互影响**。有时是**人改变了事件**：一位统治者的决定引发了战争或建起了一座城市。有时是**事件改变了人**：一场旱灾、一场战争或一次旅行让某人成为领袖或学者。有时则是**思想改变了事件**：一种信仰或新的思维方式传播开来，重塑了整个社会。\n\n> **注意。** 看清因果箭头的方向：某人的决定改变了王国或社会，是“人改变了事件”；一场经历改变了一个人的命运或性格，是“事件改变了人”。",
      ],
      ["What does this sentence show?", "这句话说明了什么？"],
      `
        Sundiata united the clans of the Mande people and founded the empire of Mali.|a person changed events
        The death of his father in battle forced young Sunni Ali to learn the ways of war.|events changed a person
        The spread of Islam brought new schools, mosques and scholars to the cities of the Sahel.|an idea changed events
        Mansa Musa's pilgrimage to Mecca made Mali famous across the Mediterranean world.|a person changed events
        Years of exile in a foreign court taught Sundiata patience and the arts of ruling.|events changed a person
        The belief that learning was holy led families in Timbuktu to collect books for centuries.|an idea changed events
        Askia Muhammad divided the Songhai empire into provinces with their own governors.|a person changed events
        Traveling across the desert as a boy turned Ibn Battuta into a lifelong explorer.|events changed a person
        The idea that gold could buy salt and books drove the great caravans across the Sahara.|an idea changed events
        King Ezana of Aksum chose to make Christianity the religion of his kingdom.|a person changed events
        A famine in her village led one woman to become a famous trader of grain.|events changed a person
        The value placed on written law changed how disputes were settled in the empire's courts.|an idea changed events
        Sonni Ali captured Timbuktu and made Songhai the strongest power on the Niger.|a person changed events
        Seeing the great library of Cairo made the young scholar decide to build one at home.|events changed a person
        A new way of counting time by the moon spread from scholars to farmers.|an idea changed events
        Mansa Musa brought architects home from Egypt who built new mosques in Mali.|a person changed events
        The fall of his city to invaders made the old griot the keeper of its memory.|events changed a person
        The teaching that all believers are equal drew many traders to the new faith.|an idea changed events
        Queen Amina of Zazzau built walls around the cities she conquered.|a person changed events
        A storm that wrecked his boat on the Niger made the merchant turn to farming.|events changed a person
        The belief that rulers should be generous led kings to give away great wealth in public.|an idea changed events
        Askia Muhammad invited scholars from across Africa to teach in his cities.|a person changed events
        Being captured by raiders as a boy shaped the way the later king treated prisoners.|events changed a person
        The idea that a book was worth more than gold made Timbuktu a city of scholars.|an idea changed events
        Sundiata's laws, remembered by griots, guided Mali for generations.|a person changed events
        Losing the war against Morocco taught the Songhai generals to fear guns.|events changed a person
        The belief in hospitality to strangers made it possible to cross the desert safely.|an idea changed events
        The emperor's choice of a new capital moved trade to a different river town.|a person changed events
        Watching his father bargain in the market made the boy a skilled trader.|events changed a person
        The spread of writing in Arabic let scholars across Africa share their books.|an idea changed events
      `,
      {
        "a person changed events": L(
          "人改变了事件",
          "One named individual's decision or deed altered the course of a kingdom, city, or wider world.\n\n**Check.** Trace cause → effect: a specific person sits on the cause side, and public history sits on the effect side.",
          "某个具体人物的决定或行动改变了王国、城市乃至更大范围的历史进程。\n\n**检验。** 顺着“原因 → 结果”看：原因一方是具体的人，结果一方是公共历史事件。",
          "This sentence does not show one person's action changing events.",
          "这句话并没有说明某个人的行动改变了事件。",
        ),
        "events changed a person": L(
          "事件改变了人",
          "An experience — loss, exile, a storm, a journey, or a war — reshaped one individual's character, skills, or path.\n\n**Check.** Trace cause → effect: an external event sits on the cause side, and a changed person sits on the effect side.",
          "一场经历（失去亲人、流亡、风暴、旅行或战争）重塑了某个人的性格、本领或人生道路。\n\n**检验。** 顺着“原因 → 结果”看：原因一方是外部事件，结果一方是发生改变的个人。",
          "This sentence does not show an event changing a person.",
          "这句话并没有说明某个事件改变了一个人。",
        ),
        "an idea changed events": L(
          "思想改变了事件",
          "A belief, value, teaching, or method — rather than one person's command — spread and reshaped how society acted.\n\n**Check.** Spot the abstract driver (*belief*, *idea*, *teaching*, *value*, *way of counting*, *spread of writing*): it is a shared concept moving history.",
          "是一种信仰、观念、学说或方法（而非单个人的命令）传播开来，重塑了社会生活。\n\n**检验。** 找出推动变化的抽象力量（如信仰、观念、教义、价值观、历法或书写）：是共享的思想改变了事件。",
          "This sentence is about a person or an event, not an idea that spread.",
          "这句话说的是一个人或一件事，而不是传播开来的思想。",
        ),
      },
    ),
    label(
      "how-it-spread",
      ["How It Spread", "它是如何传播的"],
      [
        "Ideas, goods and skills moved across West Africa in several ways. **Trade** carried them with the caravans that bought and sold gold, salt and cloth. **Travel** carried them with pilgrims, explorers and visitors. **Writing** carried them in books and letters that could be copied and read far away. **Teaching** carried them from scholars to students in the schools of the great cities.\n\n> **Watch out.** If someone travels *and* writes down notes or copies a book to pass along, check what actually carried the idea to others: copied texts and letters point to **writing**, while a returning visitor's spoken report points to **travel**.",
        "思想、货物和技艺通过几种途径在西非传播。**贸易**让它们随着买卖黄金、盐和布匹的商队传播。**旅行**让它们随着朝圣者、探险者和访客传播。**书写**让它们通过可以抄写、在远方阅读的书籍和信件传播。**教学**让它们在大城市的学校里从学者传给学生。\n\n> **注意。** 如果句子里既提到了远行又提到了写书或抄录，要看真正把内容传给别人的是什么：靠抄本、书信流传选**书写**，靠归来的旅人口头见闻选**旅行**。",
      ],
      ["How did this spread?", "这是通过什么途径传播的？"],
      `
        Merchants from the north brought glass beads and copper to the markets of Gao in exchange for gold.|trade
        Pilgrims returning from Mecca described the great cities they had seen.|travel
        A book on medicine was copied in Timbuktu and carried to Kano, where doctors studied it.|writing
        Students came from across the Sahel to sit with the scholars of Sankore and learn the law.|teaching
        Salt from the desert mines reached the forest towns, carried by traders on donkeys.|trade
        An explorer from Morocco wrote down everything he saw in Mali.|writing
        Young men traveled to Cairo to study, then came home with new ideas.|travel
        A teacher in Djenné trained students who later opened their own schools.|teaching
        Cloth from Egypt was sold in the markets of Timbuktu for gold dust.|trade
        Letters between scholars in Timbuktu and Fez let them argue about the meaning of the law.|writing
        A king's visit to the court of a neighbor taught him new ways to govern.|travel
        The scholars of Timbuktu taught astronomy to anyone who came to learn.|teaching
        Horses from North Africa were bought by the armies of Songhai.|trade
        A traveler from Mali described the new mosque to the people of his home village.|travel
        Copies of a famous poem spread from city to city along the Niger.|writing
        A master weaver taught his apprentices new patterns from distant lands.|teaching
        Kola nuts from the forest were carried north and sold in desert towns.|trade
        Visiting scholars from Egypt brought their ways of studying to Timbuktu.|travel
        The chronicles of Songhai were written down and kept for later readers.|writing
        Each scholar trained a few students, who memorized and then taught the texts.|teaching
        Gold from the mines of Bambuk was traded for salt at the edge of the desert.|trade
        The pilgrimage of Mansa Musa spread news of Mali's wealth to Europe.|travel
        A handbook for traders was copied and passed from merchant to merchant.|writing
        Mothers taught their daughters the songs and stories of the empire.|teaching
        Ivory and leather goods traveled north across the desert on camels.|trade
        Ambassadors sent to Morocco brought back news of Spanish cities.|travel
        A scholar's notes on the stars were copied by students and kept for centuries.|writing
        Griots trained young griots to remember the history of Mali word for word.|teaching
        Indian cotton reached West Africa after passing through many markets.|trade
        A Chinese map of Africa may have been made from the reports of travelers.|travel
      `,
      {
        trade: L(
          "贸易",
          "Goods moved through buying, selling, and exchange in markets and caravans.\n\n**Check.** Spot the commerce clue (*merchants*, *markets*, *sold*, *bought*, *traded*, *in exchange for*): trade is the engine.",
          "货物通过市场和商队的买卖与交换四处流通。\n\n**检验。** 找出商业线索（商人、市场、买卖、交换）：贸易是传播的动力。",
          "This did not spread through buying and selling.",
          "这并不是通过买卖传播的。",
        ),
        travel: L(
          "旅行",
          "People journeyed to another region — as pilgrims, visitors, or ambassadors — and carried reports or customs with them.\n\n**Check.** Notice that movement of people, rather than buying goods or copying books, carried the news or habit.",
          "人们作为朝圣者、访客或使节远行他乡，把见闻或习俗带了回来。\n\n**检验。** 传播靠的是人的往返见闻，而不是买卖商品或抄写典籍。",
          "This did not spread because someone made a journey.",
          "这并不是因为有人旅行而传播的。",
        ),
        writing: L(
          "书写",
          "Knowledge traveled in recorded form — books, letters, chronicles, notes, or copied handbooks.\n\n**Check.** Look for the written artifact (*book*, *letters*, *copies*, *chronicles*, *wrote down*, *notes*): text on the page carried it.",
          "知识借助书籍、信件、编年史、笔记或手抄手册等书面载体流传。\n\n**检验。** 找到书面载体（书、信件、抄本、编年史、写下来、笔记）：文字本身完成了传播。",
          "This did not spread in written form.",
          "这并不是以书面形式传播的。",
        ),
        teaching: L(
          "教学",
          "Knowledge passed directly from a teacher, master, parent, or scholar to students or apprentices.\n\n**Check.** Look for the instruction verb (*taught*, *trained*, *learn from scholars*): direct mentoring carried the skill.",
          "知识在老师、匠师、长辈或学者与学生、学徒之间直接传授。\n\n**检验。** 找出传授类动词（教授、训练、向学者学习）：面对面的教学完成了传承。",
          "This did not spread from teacher to student.",
          "这并不是从老师传给学生的。",
        ),
      },
    ),
  ],
});

const maps = topic("reading", {
  id: "reading-historical-maps",
  title: ["Reading Historical Maps", "阅读历史地图"],
  summary: [
    "The parts of a map, such as the legend and the scale, help you read it, and different kinds of maps answer different questions about the past.",
    "地图的组成部分，如图例和比例尺，帮助你读懂地图；不同种类的地图回答关于过去的不同问题。",
  ],
  intro: [
    "A historical map packs an entire chapter of geography into one page, provided you know which tool to check. Want to know what purple shading stands for? Check the **legend**. Want to know how many kilometers separated two forts? Use the **scale**. In this topic you match questions to the right map part and choose the right kind of map for a historical question.",
    "一张历史地图能把整章地理浓缩在一页纸上，前提是找对阅读工具。想知道紫色阴影代表什么？看**图例**；想知道两座要塞相距多少公里？看**比例尺**。本节练习把问题对应到正确的地图组成部分，并为不同历史问题挑选最合适的地图类型。",
  ],
  after: ["reading-a-timeline", "text-features"],
  points: [
    label(
      "parts-of-a-map",
      ["Parts of a Map", "地图的组成部分"],
      [
        "Every good map has tools for reading it. The **legend**, or key, explains what each symbol and color means. The **scale** shows how a distance on the map compares with real distance. The **compass rose** shows north, south, east and west. An **inset** is a small extra map in a corner that shows a close-up or where the main map lies in the wider world.\n\n> **Watch out.** Do not confuse **the scale** with **the compass rose**: *scale* answers *how far?* (kilometers, miles, days' walk), while *compass rose* answers *which way?* (north, south, east, west).",
        "每张好的地图都有帮助阅读的工具。**图例**解释每个符号和颜色的含义。**比例尺**表示地图上的距离与实际距离的比例。**指北针**（方向标）标出东南西北。**插图**是角落里额外的小地图，显示某处的特写或主图在更大范围中的位置。\n\n> **注意。** 不要把**比例尺**和**指北针**搞混：比例尺回答“有多远？”（公里、步程），指北针回答“朝哪边？”（东、南、西、北）。",
      ],
      ["Which part of the map would tell you this?", "地图的哪一部分会告诉你这一点？"],
      `
        what the small camel symbols on the map stand for|the legend
        how many kilometers lie between Timbuktu and Gao|the scale
        which direction the caravans traveled from Taghaza|the compass rose
        where the empire of Mali lies on a map of the whole of Africa|the inset
        what the green shading means|the legend
        whether the desert crossing was about 500 or 1,000 kilometers long|the scale
        whether the Niger River flows east or west at Timbuktu|the compass rose
        a close-up of the streets of Timbuktu beside the large map|the inset
        what a red dashed line stands for|the legend
        how far a caravan traveled in a day on the map|the scale
        which way is north on the map|the compass rose
        a small map in the corner that shows the whole Sahara|the inset
        which symbol marks a gold mine|the legend
        how long the river is from Djenné to Gao|the scale
        whether Gao is east or west of Timbuktu|the compass rose
        a tiny map showing where the region sits in the world|the inset
        what the stars beside some cities mean|the legend
        the real distance that one centimeter on the map stands for|the scale
        whether the trade route ran north to south|the compass rose
        an enlarged view of the salt mines|the inset
        which color shows the land ruled by Songhai|the legend
        whether two towns were a day's walk or a week's walk apart|the scale
        which direction the river turns at its bend|the compass rose
        a box in the corner with a detailed map of the capital|the inset
        what the small black squares stand for|the legend
        how far the empire stretched from east to west in kilometers|the scale
        which way the wind blew the sand across the desert route|the compass rose
        a small globe showing where Africa is|the inset
        what the blue triangles mark|the legend
        how many kilometers of desert lay between the wells|the scale
      `,
      {
        "the legend": L(
          "图例",
          "The legend (key) decodes every symbol, line style, and color on the map.\n\n**Check.** Notice the question asks what a *symbol, line, star, or color* stands for — decoding markings is always the legend's job.",
          "图例负责解码地图上的每一个符号、线型和颜色。\n\n**检验。** 题目问的是某种符号、线条、星标或颜色的含义，破译图上标记一律找图例。",
          "The legend explains symbols and colors, not this.",
          "图例解释的是符号和颜色，而不是这个。",
        ),
        "the scale": L(
          "比例尺",
          "The scale converts a measured length on the page into real-world distance.\n\n**Check.** Notice the question asks *how far* or *how long* in kilometers or walking time — only the scale measures distance.",
          "比例尺把图上的长度换算成现实中的距离。\n\n**检验。** 题目问的是“有多远”或“有多长”（公里数或步程），只有比例尺能测量距离。",
          "The scale tells distances, not this.",
          "比例尺告诉你的是距离，而不是这个。",
        ),
        "the compass rose": L(
          "指北针",
          "The compass rose marks north, south, east, and west so you can read direction.\n\n**Check.** Notice the question asks *which direction* or *east/west/north/south* — orientation always comes from the compass rose.",
          "指北针标出东南西北，用来辨别方向。\n\n**检验。** 题目问的是“朝哪个方向”或“在东还是在西”，判断方位一律看指北针。",
          "The compass rose shows directions, not this.",
          "指北针显示的是方向，而不是这个。",
        ),
        "the inset": L(
          "插图",
          "An inset is a small secondary map tucked in a corner to show either a zoomed-in close-up or the wider region around the main map.\n\n**Check.** Notice the question asks for a *close-up*, *enlarged view*, or *tiny map* showing wider location — that is an inset.",
          "插图是主图角落里附带的小地图，用于展示局部放大特写或主图在更大区域中的位置。\n\n**检验。** 题目提到“特写”“放大图”或“角落里的小地图/地球仪”，指的正是插图。",
          "An inset is an extra small map, which is not what you need here.",
          "插图是额外的小地图，这里需要的不是它。",
        ),
      },
    ),
    label(
      "which-kind-of-map",
      ["Which Kind of Map", "哪一种地图"],
      [
        "Different maps answer different questions. A **political map** shows borders, kingdoms and cities: who ruled where. A **physical map** shows the land itself: rivers, mountains, deserts and forests. A **trade route map** shows the paths that goods and people followed. A **population map** shows where many or few people lived. Choose the map that fits your question.\n\n> **Watch out.** Ask what the question is *measuring*: borders and rulers need a **political map**, landforms need a **physical map**, moving goods need a **trade route map**, and how crowded an area was needs a **population map**.",
        "不同的地图回答不同的问题。**政区图**显示边界、王国和城市：谁统治哪里。**地形图**显示土地本身：河流、山脉、沙漠和森林。**贸易路线图**显示货物和人们走过的路线。**人口分布图**显示哪里人多、哪里人少。要选择适合你的问题的地图。\n\n> **注意。** 先看问题要查的是什么：查疆界与归属找**政区图**，查山川地貌找**地形图**，查商路流向找**贸易路线图**，查人口稠密与否找**人口分布图**。",
      ],
      ["Which kind of map would best answer this question?", "哪一种地图最能回答这个问题？"],
      `
        Which kingdom controlled Timbuktu in 1450?|a political map
        Where are the mountains and rivers of West Africa?|a physical map
        Which path did caravans take from the salt mines to the gold fields?|a trade route map
        Which areas of the Niger valley had the most people?|a population map
        Where did the border between Mali and Songhai lie?|a political map
        How far does the Sahara desert stretch to the south?|a physical map
        Which towns did the cloth traders pass through on the way to Cairo?|a trade route map
        Were most people living near the river or far from it?|a population map
        Which cities were the capitals of the three empires?|a political map
        Where are the highlands where the Niger River begins?|a physical map
        Which route did the gold take to reach the Mediterranean?|a trade route map
        Where were the most crowded cities of the empire?|a population map
        How big was the empire of Songhai at its largest?|a political map
        Where does the forest give way to grassland?|a physical map
        Which oases did the caravans stop at?|a trade route map
        Which regions were almost empty of people?|a population map
        Which lands did Sundiata conquer?|a political map
        Where do the rivers flow into the sea?|a physical map
        Along which roads did the kola nut trade travel?|a trade route map
        How many people lived in the countryside around Gao?|a population map
        Who ruled the city of Djenné in 1300?|a political map
        Where are the lakes of the inner Niger delta?|a physical map
        Which ports did the traders sail from?|a trade route map
        Where did the population grow fastest?|a population map
        Which provinces did the empire have?|a political map
        How high are the cliffs of Bandiagara?|a physical map
        Where did the routes from north and south meet?|a trade route map
        Was the desert edge more crowded than the forest?|a population map
        Which states paid tribute to the king of Mali?|a political map
        Where are the gold-bearing rivers of the south?|a physical map
      `,
      {
        "a political map": L(
          "政区图",
          "The question asks about borders, kingdoms, provinces, capitals, or who ruled a place — all shown on a political map.\n\n**Check.** Notice the focus is human governance and boundaries rather than landforms, trade paths, or crowd density.",
          "问题涉及疆界、王国、行省、首都或统治归属，这些都是政区图展示的内容。\n\n**检验。** 关注点是政权与边界，而不是自然地形、商路或人口密度。",
          "This question is not about borders or who ruled where.",
          "这个问题与边界或谁统治哪里无关。",
        ),
        "a physical map": L(
          "地形图",
          "The question asks about natural features of the Earth — rivers, mountains, cliffs, deserts, lakes, or forests.\n\n**Check.** Notice that these features exist in nature regardless of borders or empires, which is why a physical map shows them.",
          "问题问的是河流、山脉、悬崖、沙漠、湖泊或森林等自然地貌。\n\n**检验。** 这些自然特征不以王朝疆界为转移，因此需要查看地形图。",
          "This question is not about the shape of the land.",
          "这个问题与地形无关。",
        ),
        "a trade route map": L(
          "贸易路线图",
          "The question asks about paths, roads, oases, or ports linking buyers and sellers of goods.\n\n**Check.** Spot the movement of goods or caravans: tracing routes from source to market requires a trade route map.",
          "问题问的是连接产地与市场的商路、驿站、绿洲或港口。\n\n**检验。** 关注点是货物和商队的行进路线，必须查贸易路线图。",
          "This question is not about the paths goods traveled.",
          "这个问题与货物运输的路线无关。",
        ),
        "a population map": L(
          "人口分布图",
          "The question asks where many or few people lived, or how crowded one area was compared with another.\n\n**Check.** Notice the focus on headcount and density (*most people*, *crowded*, *empty*, *grew fastest*) — that is what a population map displays.",
          "问题问的是哪里人多、哪里人少，以及不同地区的拥挤程度对比。\n\n**检验。** 关注点落在人口数量和疏密程度（如“人最多”“拥挤”“稀少”“增长最快”），只有人口分布图能回答。",
          "This question is not about how many people lived where.",
          "这个问题与哪里住了多少人无关。",
        ),
      },
    ),
  ],
});

const graphs = topic("reading", {
  id: "reading-graphs-in-science",
  title: ["Reading Graphs in Science", "阅读科学图表"],
  summary: [
    "Each kind of graph fits a kind of data, and a line graph shows a trend: rising, falling, level or changing direction.",
    "每种图表适合一种数据；折线图显示趋势：上升、下降、持平或改变方向。",
  ],
  intro: [
    "Scientists pick a graph the way a carpenter picks a tool: you would not use a pie chart to track a fever hour by hour, or a line graph to compare five separate cities on one day. Once the right graph is drawn, reading its shape reveals whether numbers are climbing, dropping, holding steady, or peaking. In this topic you match datasets to graph types and read trends.",
    "科学家选图表就像木匠选工具：不会用饼图按小时记录体温，也不会用折线图比较同一天五个孤立城市的数据。选对图表后，观察走势就能一眼看出数字是在上升、下降、持平还是先升后降。本节练习为数据匹配合适的图表类型，并读出折线趋势。",
  ],
  after: ["comparing-data-in-a-table"],
  points: [
    label(
      "which-graph-fits",
      ["Which Graph Fits", "哪种图表合适"],
      [
        "Scientists choose a graph to fit the data. A **line graph** shows how something changes over time, such as a fever over five days. A **bar graph** compares separate groups, such as cases in four cities. A **pie chart** shows the parts of a whole, such as the share of each cause of illness. A **scatter plot** shows whether two measurements go together, such as hours of sleep and number of colds.\n\n> **Watch out.** Tell a **line graph** apart from a **scatter plot**: a line graph tracks *one* measurement across steady time steps (day by day, year by year), whereas a scatter plot pairs *two* different measurements (like height and weight) for each individual.",
        "科学家根据数据选择图表。**折线图**显示某事物如何随时间变化，如五天里的体温。**条形图**比较互不相连的几组，如四个城市的病例数。**饼图**显示整体中的各部分，如每种病因所占的比例。**散点图**显示两种测量值是否相关，如睡眠时数与感冒次数。\n\n> **注意。** 分清**折线图**和**散点图**：折线图按时间顺序追踪**一个**量的变化（逐天、逐年），散点图则为每个个体配对**两个**不同的测量值（如身高与体重）。",
      ],
      ["Which kind of graph best fits this data?", "哪种图表最适合这些数据？"],
      `
        a patient's temperature measured every morning for a week|a line graph
        the number of flu cases in four different cities last winter|a bar graph
        the share of each age group among all the people who caught measles|a pie chart
        each student's hours of sleep and the number of colds they caught that year|a scatter plot
        the number of people with chickenpox in a town each month for two years|a line graph
        how many students in each grade got a flu shot|a bar graph
        the parts of a hospital's budget spent on staff, medicine, buildings and food|a pie chart
        the height and the weight of each child in a class|a scatter plot
        the size of a bacteria colony every hour for a day|a line graph
        the number of doctors in five countries|a bar graph
        the percentage of each blood type in a population|a pie chart
        the age of each patient and how many days they took to recover|a scatter plot
        world life expectancy from 1900 to 2020|a line graph
        the number of hand-washing stations in each school of the district|a bar graph
        how a class's sick days were divided among colds, flu, stomach bugs and other illnesses|a pie chart
        each country's spending on health and its average life span|a scatter plot
        the number of malaria cases in a region each year since 1990|a line graph
        how many vaccines were given in each of six clinics last month|a bar graph
        the share of each source of clean water in a village|a pie chart
        hours of exercise per week and resting heart rate for fifty adults|a scatter plot
        a city's air pollution measured every day in January|a line graph
        the number of nurses at three hospitals|a bar graph
        the fractions of a diet made up of grains, fruit, vegetables and meat|a pie chart
        each town's distance from the river and the number of cholera cases there|a scatter plot
        the weight of a newborn baby each week for three months|a line graph
        the number of cases of food poisoning at four restaurants|a bar graph
        the share of a medicine's cost that goes to research, making and shipping|a pie chart
        each student's minutes of screen time and their hours of sleep|a scatter plot
        the number of polio cases in the world each year since 1980|a line graph
        how many beds each ward of a hospital has|a bar graph
      `,
      {
        "a line graph": L(
          "折线图",
          "The data track one quantity changing step by step over time, which a line graph displays clearly.\n\n**Check.** Spot the time axis (*every morning*, *each month*, *every hour*, *from 1900 to 2020*): tracking one measure over time calls for a line graph.",
          "这些数据按时间顺序追踪单个量的变化，折线图能最清晰地呈现走势。\n\n**检验。** 找出时间轴线索（每天早晨、每月、每小时、1900 至 2020 年）：随时间追踪同一指标首选折线图。",
          "These data are not one thing changing over time.",
          "这些数据并不是一个事物随时间的变化。",
        ),
        "a bar graph": L(
          "条形图",
          "The data compare counts across separate categories — cities, grades, countries, clinics, or wards.\n\n**Check.** Notice the categories have no time order and do not have to sum to 100%, which fits a bar graph.",
          "这些数据比较互不相连的几个类别（如城市、年级、国家、诊所或病房）的数量。\n\n**检验。** 各类别之间没有时间先后，也不必加起来等于 100%，正好用条形图对比。",
          "These data do not compare separate groups.",
          "这些数据并不是在比较互不相连的几组。",
        ),
        "a pie chart": L(
          "饼图",
          "The data divide one single whole into shares, percentages, or fractions.\n\n**Check.** Ask *Do all the pieces add up to 100% of one total?* — yes, which is what a pie chart shows.",
          "这些数据把同一个整体拆分成若干份额、百分比或比例。\n\n**检验。** 问一句“各部分加起来正好构成一个完整的 100% 吗？”——是的，这正是饼图的用途。",
          "These data are not parts of one whole.",
          "这些数据并不是一个整体的各部分。",
        ),
        "a scatter plot": L(
          "散点图",
          "The data pair two separate measurements for each person, town, or country to test whether they move together.\n\n**Check.** Count the measurements per item: there are *two* numbers for every case (x and y), which plots as points on a scatter plot.",
          "这些数据为每个人、城镇或国家配对两个独立的测量值，用来观察二者是否相关。\n\n**检验。** 数一数每个样本有几个数值：每个个案都有两个数（横纵坐标），正好画成散点图。",
          "These data do not pair two measurements for each case.",
          "这些数据并没有为每个个案配对两种测量值。",
        ),
      },
    ),
    label(
      "reading-a-trend",
      ["Reading a Trend", "读出趋势"],
      [
        "A line graph shows a **trend**, the direction of change. The line may be **rising** (going up), **falling** (going down), **level** (staying about the same) or **rising then falling** (going up to a peak and coming down). Read the numbers at the start, the middle and the end before you decide.\n\n> **Watch out.** Do not look only at the first and last numbers: a series like *30, 80, 150, 210, 140, 70, 25* starts and ends near 30, so skipping the middle would make it look **level** when it is actually **rising then falling**.",
        "折线图显示**趋势**，即变化的方向。线可能是**上升的**、**下降的**、**持平的**（大致不变），或**先升后降**（升到一个高峰后下降）。下结论之前，要看开头、中间和结尾的数字。\n\n> **注意。** 千万不能只看开头和结尾两个数：像 *30, 80, 150, 210, 140, 70, 25* 首尾都在 30 左右，漏看中间就会误判成**持平**，其实它是**先升后降**。",
      ],
      ["What is the trend shown by the graph?", "图表显示的趋势是什么？"],
      `
        Flu cases per week: 20, 45, 90, 160, 240.|rising
        Malaria deaths per year, in thousands: 900, 760, 610, 480, 400.|falling
        A healthy person's temperature each morning: 36.8, 36.9, 36.8, 36.7, 36.8.|level
        Cold cases per month from October to April: 30, 80, 150, 210, 140, 70, 25.|rising then falling
        Children vaccinated each year, in percent: 52, 61, 70, 79, 88.|rising
        Bacteria left after the medicine, in millions: 50, 31, 14, 6, 1.|falling
        Beds in use at the hospital each day: 120, 118, 121, 119, 120.|level
        A fever over one day: 37.0, 38.2, 39.5, 38.4, 37.2.|rising then falling
        Smallpox cases in the world, in thousands, from 1950 to 1975: 500, 300, 150, 40, 1.|falling
        Life expectancy in years, from 1900 to 2000: 32, 41, 50, 60, 67.|rising
        Daily visits to the clinic during one week: 40, 42, 39, 41, 40.|level
        Measles cases in a school during an outbreak: 2, 10, 35, 18, 4.|rising then falling
        People with clean water in a region, in percent: 40, 52, 63, 75, 86.|rising
        Cholera cases after the new sewers were built: 300, 210, 120, 45, 10.|falling
        A patient's heart rate at rest each day: 70, 71, 69, 70, 70.|level
        Pollen in the air from March to August: 10, 60, 140, 190, 90, 20.|rising then falling
        Doctors per 10,000 people, from 1990 to 2020: 8, 11, 15, 19, 24.|rising
        Days lost to illness at a factory after hand-washing began: 90, 70, 52, 40, 31.|falling
        The weight of a grown adult each year: 62, 62, 63, 62, 62.|level
        Daily cases of a stomach bug on a cruise ship: 5, 30, 70, 40, 8.|rising then falling
        Polio cases in the world each year, in thousands: 350, 120, 30, 2, 0.5.|falling
        Cases of a new virus each week: 3, 9, 27, 80, 240.|rising
        The number of nurses at the clinic each year: 25, 25, 24, 25, 25.|level
        Hospital visits for heat stroke from May to October: 5, 40, 120, 160, 60, 10.|rising then falling
        Children who walk to school in percent, from 1970 to 2010: 48, 39, 30, 22, 13.|falling
        Antibiotics sold each year, in millions of packs: 10, 14, 19, 25, 32.|rising
        Blood pressure readings over a week: 118, 120, 119, 118, 119.|level
        The size of a swelling over ten days: 1, 4, 7, 3, 1.|rising then falling
        Cases of tooth decay in a town after fluoride was added to water: 400, 330, 250, 190, 150.|falling
        Steps walked each day by a patient recovering from surgery: 200, 900, 1,800, 3,000, 4,500.|rising
      `,
      {
        rising: L(
          "上升",
          "Each reading is larger than the one before, so the line climbs steadily from start to end.\n\n**Check.** Compare start, middle, and end: start < middle < end, confirming an unbroken upward trend.",
          "每个读数都比前一个大，折线从头到尾稳步攀升。\n\n**检验。** 对比开头、中间和结尾：开头 < 中间 < 结尾，确认是持续上升。",
          "The numbers do not keep going up from start to end.",
          "这些数字并不是从头到尾一直上升。",
        ),
        falling: L(
          "下降",
          "Each reading is smaller than the one before, so the line drops steadily from start to end.\n\n**Check.** Compare start, middle, and end: start > middle > end, confirming an unbroken downward trend.",
          "每个读数都比前一个小，折线从头到尾稳步走低。\n\n**检验。** 对比开头、中间和结尾：开头 > 中间 > 结尾，确认是持续下降。",
          "The numbers do not keep going down from start to end.",
          "这些数字并不是从头到尾一直下降。",
        ),
        level: L(
          "持平",
          "The readings hover around the same value with only tiny wiggles, so the line stays flat.\n\n**Check.** Compare the highest and lowest readings: their gap is tiny relative to the numbers, showing no real climb or drop.",
          "所有读数都在同一数值附近小幅波动，折线整体平直。\n\n**检验。** 比较最大值和最小值：两者相差微乎其微，没有真正的上升或下降。",
          "The numbers change too much to call the line level.",
          "这些数字变化太大，不能说这条线是持平的。",
        ),
        "rising then falling": L(
          "先升后降",
          "The readings climb to a clear peak in the middle and then drop back down toward the end.\n\n**Check.** Compare start, middle, and end: the middle peak is far higher than both endpoints, confirming a rise followed by a fall.",
          "读数在中间爬升到明显的高峰，随后在后半段回落。\n\n**检验。** 对比开头、中间和结尾：中间的峰值远高于首尾两端，确认是先升后降。",
          "The numbers do not climb to a peak and then come down.",
          "这些数字并不是升到高峰后再降下来。",
        ),
      },
    ),
  ],
});

const checkingClaims = topic("reading", {
  id: "checking-a-claim-against-the-evidence",
  title: ["Checking a Claim against the Evidence", "用证据检验论点"],
  summary: [
    "A careful reader checks whether the evidence supports a claim, goes against it or says nothing about it, and whether the claim goes further than the evidence.",
    "细心的读者会检验证据是支持论点、反驳论点还是与之无关，以及论点是否超出了证据所能说明的范围。",
  ],
  intro: [
    "Headlines often stretch what a study actually found: if a new filter removed 60 percent of silt in one stream, claiming *The filter makes every river pure* goes far beyond the numbers. Careful readers check both the direction of the data and the size of the claim. In this topic you test what data actually do to a claim and spot claims that overreach or understate.",
    "标题常常夸大研究本身的结果：如果一种新滤网在一条小溪里滤掉了 60% 的泥沙，宣称“该滤网能让所有河流变清澈”就远远超出了数据范围。细心的读者既会核对数据的方向，也会衡量论点的分寸。本节练习检验证据与论点的关系，并辨别言过其实或说得过轻的论点。",
  ],
  after: ["supported-and-unsupported-claims", "reading-graphs-in-science"],
  points: [
    label(
      "what-the-data-say",
      ["What the Data Say", "数据说明了什么"],
      [
        "When an article makes a claim and gives data, read the data yourself. The data may **support** the claim. They may **go against** it, even though the writer says they support it. Or they may **say nothing** about it, because they measure something else. Do not trust the writer's summary; check the numbers.\n\n> **Watch out.** A real number connected to the same topic (like *300 bars of soap bought* or *12 clinic rooms*) still **says nothing** about the claim if it never measures the claimed outcome (sick days or waiting times).",
        "当一篇文章提出论点并给出数据时，要自己读一读数据。数据可能**支持**论点；也可能**与论点相悖**，尽管作者说它支持论点；还可能与论点**无关**，因为它测量的是别的东西。不要轻信作者的概括，要核对数字。\n\n> **注意。** 哪怕数据真实且和同一话题沾边（如“买了 300 块肥皂”“诊所有 12 间诊室”），只要它没有测量论点宣称的结果（病假天数、候诊时长），就依然与论点**无关**。",
      ],
      ["What do the data do for the claim?", "这些数据对论点起什么作用？"],
      `
        Claim: The hand-washing campaign cut sick days. Data: Sick days fell from 900 to 500 in the year of the campaign.|support it
        Claim: The hand-washing campaign cut sick days. Data: Sick days rose from 500 to 650 in the year of the campaign.|go against it
        Claim: The hand-washing campaign cut sick days. Data: The school bought 300 bars of soap in the year of the campaign.|say nothing about it
        Claim: The new medicine lowers fever quickly. Data: Patients on it were fever-free in one day; others took three.|support it
        Claim: The new medicine lowers fever quickly. Data: Patients on it took four days to lose their fever; others took two.|go against it
        Claim: The new medicine lowers fever quickly. Data: The medicine is sold in forty countries.|say nothing about it
        Claim: Clean water ended the cholera outbreak. Data: Cases dropped to zero within a month of the new pump.|support it
        Claim: Clean water ended the cholera outbreak. Data: Cases kept rising for a year after the new pump.|go against it
        Claim: Clean water ended the cholera outbreak. Data: The new pump cost four hundred pounds.|say nothing about it
        Claim: Vaccines have made measles rare. Data: Measles cases fell by 95 percent after vaccines became common.|support it
        Claim: Vaccines have made measles rare. Data: Measles cases doubled in the years after vaccines became common.|go against it
        Claim: Vaccines have made measles rare. Data: The measles vaccine is given in two doses.|say nothing about it
        Claim: Masks slowed the spread of the cold in our class. Data: The masked class had 4 colds; the unmasked class had 15.|support it
        Claim: Masks slowed the spread of the cold in our class. Data: The masked class had 15 colds; the unmasked class had 4.|go against it
        Claim: Masks slowed the spread of the cold in our class. Data: Most students chose blue masks.|say nothing about it
        Claim: More sleep means fewer colds. Data: Students who slept 9 hours had half as many colds as those who slept 6.|support it
        Claim: More sleep means fewer colds. Data: Students who slept 9 hours had twice as many colds as those who slept 6.|go against it
        Claim: More sleep means fewer colds. Data: Most students go to bed between nine and ten.|say nothing about it
        Claim: The new clinic shortened waiting times. Data: The average wait fell from two hours to thirty minutes.|support it
        Claim: The new clinic shortened waiting times. Data: The average wait grew from thirty minutes to two hours.|go against it
        Claim: The new clinic shortened waiting times. Data: The new clinic has twelve rooms.|say nothing about it
        Claim: Exercise lowers blood pressure. Data: After ten weeks of walking, average blood pressure fell by ten points.|support it
        Claim: Exercise lowers blood pressure. Data: After ten weeks of walking, average blood pressure rose by ten points.|go against it
        Claim: Exercise lowers blood pressure. Data: Most people in the study walked in the park.|say nothing about it
        Claim: Fluoride in the water reduced tooth decay. Data: Cavities fell by a third after fluoride was added.|support it
        Claim: Fluoride in the water reduced tooth decay. Data: Cavities rose by a third after fluoride was added.|go against it
        Claim: Fluoride in the water reduced tooth decay. Data: The town's water comes from a mountain lake.|say nothing about it
        Claim: Nets have reduced malaria. Data: Malaria cases fell by half in villages that received nets.|support it
        Claim: Nets have reduced malaria. Data: Malaria cases were higher in villages that received nets.|go against it
        Claim: Nets have reduced malaria. Data: The nets were made in three different factories.|say nothing about it
      `,
      {
        "support it": L(
          "支持它",
          "The numbers measure the exact outcome named in the claim and move in the direction the claim predicts.\n\n**Check.** Compare the claimed direction (*cut*, *lowers*, *shortened*, *reduced*) with the numbers: both point the same way.",
          "数据测量的正是论点提到的结果，且变化方向与论点一致。\n\n**检验。** 对照论点宣称的方向（减少、降低、缩短）与数字变化：两者完全同向。",
          "The numbers do not show what the claim says.",
          "数字并没有表明论点所说的内容。",
        ),
        "go against it": L(
          "与它相悖",
          "The numbers measure the right outcome, but they move in the opposite direction from what the claim says.\n\n**Check.** Compare the claimed direction with the actual numbers: the claim predicts a drop or improvement, while the data show a rise or worsening.",
          "数据测量的是正确指标，但变化方向与论点正好相反。\n\n**检验。** 对照论点宣称的方向与实际数字：论点说下降或改善，数据却显示上升或恶化。",
          "The numbers do not point against the claim.",
          "数字并不与论点相悖。",
        ),
        "say nothing about it": L(
          "与它无关",
          "The data measure a different variable — cost, color, dose count, or location — rather than the outcome the claim is testing.\n\n**Check.** Ask *Does this number tell me whether the claimed outcome went up or down?* — no, it leaves the question unanswered.",
          "数据测量的是别的指标（价格、颜色、剂次或地点），而不是论点要检验的结果。\n\n**检验。** 问一句“这个数字能告诉我论点说的那件事是变好了还是变差了吗？”——不能，问题完全没有得到回答。",
          "The numbers are about the claim itself.",
          "数字说的正是论点本身。",
        ),
      },
    ),
    label(
      "claims-that-go-too-far",
      ["Claims That Go Too Far", "言过其实的论点"],
      [
        "Even good evidence supports only so much. A claim **fits the evidence** when it says no more than the data show. A claim **goes too far** when it uses words such as *all*, *always*, *proves* or *cures* for results that were only partly true. And a claim can **say less than the evidence shows**, playing down a strong result with words such as *might slightly*.\n\n> **Watch out.** Check the **scope words** in the claim against the numbers in the evidence: *70 percent* supports *most*, not *everyone*; *95–99 percent* is far stronger than *a few* or *slightly*.",
        "即使是好的证据，所能支持的也有限。论点所说不超过数据所显示的内容时，就**与证据相符**。论点对只部分成立的结果使用 *all*、*always*、*proves* 或 *cures* 这样的词时，就**言过其实**。论点也可能**说得比证据少**，用 *might slightly* 之类的词淡化一个有力的结果。\n\n> **注意。** 把论点里的**范围词**和证据里的数字逐一核对：70% 只能支持“大多数”，不能说成“所有人”；95% 到 99% 则远不止“少数”或“略微”。",
      ],
      ["How well does the claim fit the evidence?", "这个论点与证据的相符程度如何？"],
      `
        Evidence: In a trial, 70 percent of patients improved on the drug. Claim: The drug helped most patients in the trial.|fits the evidence
        Evidence: In a trial, 70 percent of patients improved on the drug. Claim: The drug cures everyone who takes it.|goes too far
        Evidence: In a trial, 95 percent of patients improved on the drug. Claim: The drug might help a few people a little.|says less than the evidence shows
        Evidence: Cases fell by half in towns with clean water. Claim: Clean water was linked to far fewer cases.|fits the evidence
        Evidence: Cases fell by half in towns with clean water. Claim: Clean water ends all disease.|goes too far
        Evidence: Cases fell by 98 percent in towns with clean water. Claim: Clean water may have made a small difference.|says less than the evidence shows
        Evidence: Three studies found that exercise lowered blood pressure. Claim: Exercise tends to lower blood pressure.|fits the evidence
        Evidence: Three studies found that exercise lowered blood pressure. Claim: Exercise always fixes heart problems.|goes too far
        Evidence: Fifty studies found that exercise lowered blood pressure. Claim: Exercise possibly has some tiny effect.|says less than the evidence shows
        Evidence: Students who washed their hands had fewer colds. Claim: Hand-washing was linked to fewer colds.|fits the evidence
        Evidence: Students who washed their hands had fewer colds. Claim: Hand-washing proves that colds come only from dirty hands.|goes too far
        Evidence: Students who washed their hands had one-fifth as many colds. Claim: Hand-washing might slightly reduce colds.|says less than the evidence shows
        Evidence: The vaccine prevented 9 out of 10 cases in the trial. Claim: The vaccine was highly effective in the trial.|fits the evidence
        Evidence: The vaccine prevented 9 out of 10 cases in the trial. Claim: No one who gets the vaccine will ever get sick.|goes too far
        Evidence: The vaccine prevented 99 out of 100 cases in the trial. Claim: The vaccine may have helped somewhat.|says less than the evidence shows
        Evidence: One study of 40 people found that tea improved sleep. Claim: A small study suggests tea may improve sleep.|fits the evidence
        Evidence: One study of 40 people found that tea improved sleep. Claim: Science proves that tea is the best cure for poor sleep.|goes too far
        Evidence: Twenty large studies found that the vitamin prevented the illness. Claim: The vitamin might be of some small use.|says less than the evidence shows
        Evidence: Malaria fell by 40 percent where nets were used. Claim: Nets were linked to a large drop in malaria.|fits the evidence
        Evidence: Malaria fell by 40 percent where nets were used. Claim: Nets have wiped out malaria.|goes too far
        Evidence: Malaria fell by 90 percent where nets were used. Claim: Nets might have made a slight change.|says less than the evidence shows
        Evidence: Patients who walked daily left the hospital two days sooner. Claim: Daily walking was linked to shorter hospital stays.|fits the evidence
        Evidence: Patients who walked daily left the hospital two days sooner. Claim: Walking heals every illness.|goes too far
        Evidence: Patients who walked daily left the hospital two weeks sooner. Claim: Walking may make a tiny difference to some.|says less than the evidence shows
        Evidence: Most people in the survey said the clinic was helpful. Claim: Most people surveyed found the clinic helpful.|fits the evidence
        Evidence: Most people in the survey said the clinic was helpful. Claim: Everyone in the city loves the clinic.|goes too far
        Evidence: Nearly everyone in the survey said the clinic was very helpful. Claim: A few people might like the clinic.|says less than the evidence shows
        Evidence: Fluoride cut tooth decay by a third in the town. Claim: Fluoride was linked to less tooth decay in the town.|fits the evidence
        Evidence: Fluoride cut tooth decay by a third in the town. Claim: Fluoride means you never need to brush again.|goes too far
        Evidence: Fluoride cut tooth decay by three-quarters in the town. Claim: Fluoride might do a little good.|says less than the evidence shows
      `,
      {
        "fits the evidence": L(
          "与证据相符",
          "The claim matches the size and certainty of the evidence — neither stretching it to absolutes nor shrinking it away.\n\n**Check.** Match the claim's qualifiers (*most*, *tends to*, *linked to*, *a small study suggests*) to the evidence's exact scale: they align.",
          "论点的范围和肯定程度与证据严丝合缝，既没有夸大成绝对结论，也没有刻意缩小。\n\n**检验。** 对照论点里的限定词（“大多数”“往往”“与……有关”“一项小研究显示”）和证据规模：两者完全匹配。",
          "This claim does not match the size of the evidence.",
          "这个论点与证据的分量不相符。",
        ),
        "goes too far": L(
          "言过其实",
          "The claim jumps from a partial or limited result to an absolute (*all*, *everyone*, *always*, *never*, *every*, *proves*, *wiped out*).\n\n**Check.** Spot the extreme word in the claim: the evidence leaves exceptions or limits that the claim erases.",
          "论点从部分或有限的结果直接跳到了绝对化断语（如“所有”“每个人”“总是”“绝不”“彻底消除”“证明”）。\n\n**检验。** 找出论点里的极端词：证据本身存在例外或局限，但论点把这些全抹掉了。",
          "This claim does not say more than the evidence shows.",
          "这个论点并没有说得比证据多。",
        ),
        "says less than the evidence shows": L(
          "说得比证据少",
          "The evidence shows a huge, consistent effect, yet the claim minimizes it with weak hedges (*might*, *slightly*, *tiny*, *a few*, *a little*).\n\n**Check.** Compare the strong numbers in the evidence (90%–99%, fifty studies, nearly everyone) against the timid wording in the claim: the claim undersells the result.",
          "证据显示出巨大且稳定的效果，但论点却用“也许”“略微”“微小”“少数”“一点点”等弱化词把结果说轻了。\n\n**检验。** 把证据里强劲的数字（如 90%–99%、五十项研究、几乎所有人）与论点里过于保守的措辞一对比，就能看出论点低估了证据。",
          "This claim does not play down a strong result.",
          "这个论点并没有淡化一个有力的结果。",
        ),
      },
    ),
  ],
});

/** readingTopics7a are the reading topics of the first units of grade 7. */
export const readingTopics7a: readonly TopicDef[] = [
  relevant,
  sections,
  fictionAndHistory,
  storyElements,
  individuals,
  maps,
  drawn(graphs, { "which-graph-fits": kindsOfGraph, "reading-a-trend": fourTrends }),
  checkingClaims,
];
