// Grade 12: reading: the evidence of an investigative report, thought experiments, reviews of works of art, two
// translations of one text compared, and risks stated in numbers.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const investigative = topic("reading", {
  id: "reading-an-investigative-report",
  title: ["Reading an Investigative Report", "阅读调查报道"],
  summary: [
    "How investigative reporters build a case from documents, named witnesses and unnamed sources, and how a reader weighs each kind of evidence.",
    "调查记者如何用文件、具名证人和匿名消息来源构建论证，以及读者如何衡量每一类证据。",
  ],
  after: ["tracing-claims-to-sources"],
  points: [
    label(
      "what-kind-of-evidence",
      ["What Kind of Evidence", "哪一类证据"],
      [
        "An investigative report exposes something that powerful people want hidden, so every claim needs evidence. **Documents and records** are the strongest kind: contracts, emails, budgets, court files, photographs and data that anyone can check. **Named witnesses** speak on the record, so readers know who they are and can judge their position. **Unnamed sources** speak only if their names are kept secret; they may know the truth, but readers cannot check them, so a careful report confirms them with a second source or a document.",
        "调查报道揭露有权势的人想隐瞒的事情，所以每个说法都需要证据。**文件和记录**最有力：合同、电子邮件、预算、法庭文件、照片和任何人都能核查的数据。**具名证人**公开发言，读者知道他们是谁，能判断他们的立场。**匿名消息来源**只在名字被保密时才肯开口；他们也许知道真相，但读者无法核查，所以严谨的报道会用第二个消息来源或一份文件来证实他们的话。",
      ],
      ["What kind of evidence is this?", "这是哪一类证据？"],
      `
        A copy of the signed contract shows the mayor's brother received the deal.|a document or record
        Bank statements obtained by the paper show three payments to the inspector.|a document or record
        The company's own safety log lists forty leaks in two years.|a document or record
        Court filings from 2019 show the same firm was fined for fraud.|a document or record
        Emails between the two managers discuss hiding the test results.|a document or record
        Photographs taken by the reporter show waste pipes running into the river.|a document or record
        The city budget shows the money was spent on a road that was never built.|a document or record
        Hospital records reviewed by the reporters show the drug was given to forty patients.|a document or record
        Minutes of the board meeting record the vote to delay the recall.|a document or record
        Satellite images show the forest was cleared after the permit was denied.|a document or record
        A database of police reports shows the same officer named in twelve complaints.|a document or record
        "I saw them dump the barrels at night," said Rosa Diaz, who lives by the river.|a named witness
        Former engineer Tom Hale said he warned his bosses about the cracks in 2018.|a named witness
        "Nobody listened to us," said nurse Amy Chen, who worked on the ward for ten years.|a named witness
        The mayor's former driver, Paul Grant, said he delivered envelopes to the inspector.|a named witness
        "The numbers were changed before the meeting," said finance clerk Lena Ross.|a named witness
        Farmer Jake Morris said his cattle fell ill after the factory opened.|a named witness
        Retired judge Helen Park said the sentences were the harshest she had seen.|a named witness
        "I was told to keep quiet," said Omar Said, a former guard at the prison.|a named witness
        Teacher Maria Lopez said the school was told to change failing grades.|a named witness
        Coach Dan Wells said he reported the abuse to the club in 2015.|a named witness
        A person close to the investigation said the files had been destroyed.|an unnamed source
        Two officials, who asked not to be named, said the minister knew of the leak.|an unnamed source
        An employee who feared losing her job said the tests were faked.|an unnamed source
        A source inside the company said the recall was delayed to protect profits.|an unnamed source
        A former staff member, speaking on condition of anonymity, described the threats.|an unnamed source
        Officials familiar with the matter said the contract was never put out to bid.|an unnamed source
        One worker, who did not want to be identified, said the alarms were switched off.|an unnamed source
        A senior police officer, who spoke privately, said the case was dropped on orders.|an unnamed source
        People with knowledge of the talks said the deal was signed in secret.|an unnamed source
        A doctor at the clinic, who asked that his name not be used, said patients were turned away.|an unnamed source
      `,
      {
        "a document or record": L(
          "文件或记录",
          "The evidence is a paper, file, image or set of data that exists apart from anyone's memory and that others can check.",
          "这个证据是独立于任何人记忆而存在、别人可以核查的文件、档案、图像或数据。",
          "The evidence is something a person says, not a document or record.",
          "这个证据是某个人说的话，不是文件或记录。",
        ),
        "a named witness": L(
          "具名证人",
          "A person speaks on the record and is named, so readers know who is making the claim.",
          "某个人公开发言并被点名，读者知道是谁在提出这个说法。",
          "No named person is speaking on the record.",
          "没有具名的人公开发言。",
        ),
        "an unnamed source": L(
          "匿名消息来源",
          "The claim comes from someone whose name is kept secret, so readers cannot check who said it.",
          "这个说法来自一个名字被保密的人，读者无法核查是谁说的。",
          "The source is not a person whose name is kept secret.",
          "这个来源不是一个名字被保密的人。",
        ),
      },
    ),
    choose(
      "what-would-confirm-the-claim",
      ["What Would Confirm the Claim", "什么能证实这个说法"],
      [
        "A finding is only as strong as its evidence. When a report rests on one unnamed source, ask what would confirm it: a **document** that shows the same thing, or a **second independent source** who was in a position to know. More of the same rumor, the feelings of people who were not there, or the denial of the accused do not confirm a claim. A careful reader also asks whether the accused was given a chance to respond.",
        "一个发现的说服力取决于它的证据。当报道只依靠一个匿名消息来源时，要问什么能证实它：一份显示同样情况的**文件**，或另一个了解内情的**独立消息来源**。更多同样的传闻、不在场的人的感受或被指控者的否认，都不能证实一个说法。严谨的读者还会问，被指控者是否得到了回应的机会。",
      ],
      ["Which piece of evidence would best confirm this claim?", "哪一项证据最能证实这个说法？"],
      `
        An unnamed worker says the factory dumped waste in the river.|Water tests showing the factory's chemicals downstream|Neighbors who say they distrust the factory owners|A second rumor heard by the same worker's friends
        A source says the mayor gave the contract to his brother.|The signed contract with the brother's company named on it|A poll showing many voters dislike the mayor|The mayor's rivals saying they always suspected him
        An anonymous nurse says patients were turned away.|Hospital admission logs showing refusals on those days|A patient's cousin saying the hospital seems unfriendly|A blog post that repeats the nurse's story word for word
        A former guard says prisoners were beaten.|Medical records of injuries matching the guard's account|A politician saying prisons are often cruel places|The prison's statement that it treats inmates well
        An official says the test results were changed.|The original and the altered test results side by side|An expert saying tests are sometimes changed in general|The official's own feeling that something was wrong
        A source says the minister knew about the leak.|An email to the minister reporting the leak|A cartoon showing the minister asleep at his desk|The minister's statement that he is very busy
        A worker says the safety alarms were switched off.|The system log showing the alarms disabled that week|A safety expert describing how alarms usually work|Other workers saying they were frightened at work
        An unnamed clerk says the budget figures were faked.|The original spreadsheet compared with the published one|A columnist's opinion that the budget looks too good|The clerk's friend saying the clerk is very honest
        A source says the company hid the drug's side effects.|Internal trial reports listing the side effects|A patient group's view that drug firms are greedy|The company's advertisement praising the drug
        A witness says the police dropped a case on orders.|A written order from the chief closing the case|A popular crime novel by a former detective with a very similar plot|The witness saying he is completely certain
        An employee says the bridge inspection never happened.|Inspection records with no visit logged that year|Drivers saying the bridge feels shaky to them|A photo of the bridge on a sunny day, taken from the riverbank by a tourist
        An unnamed teacher says failing grades were raised.|Grade records showing changes after the term ended|Parents saying the school has a poor reputation|The principal saying the school is proud of its scores
        A source says the club ignored reports of abuse.|Letters of complaint received and filed by the club|A former player saying the club had a bad culture|The club's statement that it values every child
        A source says the deal was signed in secret.|A copy of the deal with dates and signatures|A pundit guessing that a deal was likely|The source repeating the claim more forcefully
        An unnamed engineer says cracks were reported in 2018.|The 2018 report on the cracks, dated and signed|An engineer from another firm saying cracks are common|A fan forum discussing the collapse
        A doctor says the clinic billed for visits that never happened.|Billing records compared with appointment books|Patients saying the clinic is always crowded|The doctor saying she has been angry for years
        A source says the charity spent donations on a mansion.|Property records showing the charity bought the house|A donor saying she now feels uneasy about giving|A rival charity saying it is more careful
        A worker says the mine ignored gas warnings.|Gas sensor readings logged on the day of the blast|A miner's widow describing her grief|The mine owner's promise to do better
        A source says votes were thrown away in one district.|Ballot boxes found in a landfill with the district's seal|A losing candidate saying the result feels wrong|Voters saying they did not trust the count
        A former aide says the senator took cash for votes.|Bank deposits matching the dates of key votes|A comedian joking about the senator's wealth|The aide repeating the story on another channel
        An unnamed officer says the evidence was destroyed.|An evidence log showing the files signed out and never returned|A movie about corrupt police officers|The officer's friend saying he is trustworthy
        A worker says children were working in the factory.|Payroll records listing workers under fifteen|A campaigner saying factories in the region are bad|The factory's sign saying no children allowed
        A source says the oil company knew about climate risks in 1980.|The company's own 1980 research memo on warming|A scientist today saying warming is real|A protester saying oil companies cannot be trusted
        A source says the coach changed players' ages.|Birth certificates that do not match the team list|Fans in the stands saying that the team looks very grown up this season|The coach saying the team just trains hard
        An anonymous manager says the recall was delayed for profit.|Meeting notes weighing recall costs against sales|A customer saying the brand has lost his trust|An advertisement for the new model
        An unnamed source says the dam was built with cheap concrete.|Lab tests of core samples from the dam|A local saying the dam looks old already|The builder's brochure about quality
        A source says the judge met secretly with one side.|Visitor logs showing the lawyer entering the judge's office|A legal expert saying judges must be fair|The losing side saying the verdict was unfair
        A source says the agency spied on journalists.|Leaked agency files listing the journalists' phone numbers|A journalist saying she feels watched|The agency saying it obeys the law
        An unnamed official says the aid money vanished.|Accounts showing transfers to a private company|A charity worker's guess about where it went|Readers' comments saying aid is always wasted
        A witness says the ship sailed overloaded.|The port's cargo records showing weight above the limit|A sailor saying the sea was rough that night|The owner saying his ships are safe
      `,
      (right) => [
        `${right} would confirm the claim independently: it is evidence that exists apart from the source and can be checked.`,
        `${right}能独立地证实这个说法：它是独立于消息来源存在、可以核查的证据。`,
      ],
      [
        [
          "{wrong} is an opinion or feeling from someone not in a position to know, so it does not confirm the specific claim.",
          "{wrong}只是不了解内情的人的看法或感受，不能证实这个具体的说法。",
        ],
        [
          "{wrong} only repeats the claim or the denial, so it adds no independent evidence.",
          "{wrong}只是重复了这个说法或否认，没有增加任何独立证据。",
        ],
      ],
    ),
  ],
});

const thought = topic("reading", {
  id: "following-a-thought-experiment",
  title: ["Following a Thought Experiment", "理解思想实验"],
  summary: [
    "How philosophers and scientists imagine a case that could not or need not happen, draw out an intuition about it, and reason from that intuition to a conclusion.",
    "哲学家和科学家如何设想一个不可能或不必真正发生的情形，引出人们对它的直觉，再从这种直觉推出结论。",
  ],
  after: ["reasoning", "explaining-with-an-analogy"],
  points: [
    label(
      "which-step-is-this",
      ["Which Step Is This", "这是哪一步"],
      [
        "A **thought experiment** tests an idea in the imagination. It has three steps. First comes the **imagined case**: *Suppose you found a ring that made you invisible*. Then comes the **intuition** the case draws out, the answer most readers give at once: *Most people would be tempted to steal*. Last comes the **conclusion** the writer draws from that intuition about the real world: *So people are just only because they fear being caught*. To evaluate a thought experiment, ask whether the case is fair, whether the intuition is shared, and whether the conclusion follows.",
        "**思想实验**在想象中检验一个想法。它有三步。首先是**设想的情形**：*假设你找到一枚能让你隐身的戒指*。然后是这个情形引出的**直觉**，即多数读者立刻给出的回答：*大多数人会忍不住去偷*。最后是作者从这种直觉对现实世界得出的**结论**：*所以人们守正义只是因为害怕被抓*。评价思想实验时，要问情形是否公平、直觉是否普遍、结论是否成立。",
      ],
      ["Which step of the thought experiment is this sentence?", "这个句子是思想实验的哪一步？"],
      `
        Suppose a shepherd finds a ring that makes him invisible.|the imagined case
        Imagine a runaway trolley heading toward five workers on the track.|the imagined case
        Picture a scientist who knows every fact about color but has lived in a black-and-white room.|the imagined case
        Suppose a ship has every plank replaced one by one over the years.|the imagined case
        Imagine you could plug into a machine that gives you any experience you want.|the imagined case
        Suppose you must design a society without knowing what place you will have in it.|the imagined case
        Imagine a child about to fall into a well in front of you.|the imagined case
        Suppose an evil demon deceives you about everything you see.|the imagined case
        Imagine riding on a beam of light and looking at the beam beside you.|the imagined case
        Suppose a person is copied exactly, atom for atom, on Mars.|the imagined case
        Imagine a room where a man follows rules to answer Chinese notes he cannot read.|the imagined case
        Almost anyone would feel a sudden alarm and want to save the child.|the intuition
        Most people feel it is right to pull the lever and save five lives.|the intuition
        Most of us feel that the scientist learns something new on first seeing red.|the intuition
        Few people would choose to stay in the machine for life.|the intuition
        Most readers sense that the shepherd would start to steal.|the intuition
        Most people feel the rebuilt ship is somehow still the same ship.|the intuition
        Nearly everyone would choose rules that protect the worst-off.|the intuition
        Most people feel the man in the room does not understand Chinese.|the intuition
        It seems that you could not be certain of anything you see.|the intuition
        Many feel the copy on Mars is not really you.|the intuition
        So human beings are born with the beginnings of goodness.|the conclusion
        So people are just only because they fear being caught.|the conclusion
        Therefore knowing every physical fact is not knowing everything.|the conclusion
        So pleasure cannot be the only thing we value.|the conclusion
        Therefore a just society protects those with the least.|the conclusion
        So the one thing I cannot doubt is that I am thinking.|the conclusion
        Therefore following rules for symbols is not the same as understanding.|the conclusion
        So identity cannot depend on the material we are made of.|the conclusion
        Therefore the speed of light must look the same to every observer.|the conclusion
        So what makes an act right may depend on its results.|the conclusion
      `,
      {
        "the imagined case": L(
          "设想的情形",
          "The sentence asks the reader to suppose or imagine a situation, often one that could not happen.",
          "句子要求读者假设或想象一个情形，这个情形往往不可能真正发生。",
          "The sentence does not set up an imagined situation.",
          "句子没有设定一个想象的情形。",
        ),
        "the intuition": L(
          "直觉",
          "The sentence reports what most people feel or would say at once about the imagined case.",
          "句子说出多数人对设想的情形立刻会有的感受或回答。",
          "The sentence does not report people's immediate response to the case.",
          "句子没有说出人们对这个情形的即时反应。",
        ),
        "the conclusion": L(
          "结论",
          "The sentence draws a general lesson about the real world, often with so or therefore.",
          "句子得出关于现实世界的一般结论，常用 so 或 therefore。",
          "The sentence does not draw a general lesson from the case.",
          "句子没有从这个情形得出一般结论。",
        ),
      },
    ),
    choose(
      "what-the-case-is-meant-to-show",
      ["What the Case Is Meant to Show", "这个情形想要说明什么"],
      [
        "Every thought experiment removes the details that do not matter so that one question stands alone. The invisibility ring removes the fear of being caught, so it asks whether we are just for justice's sake. The machine of pleasant experiences removes everything but pleasure, so it asks whether pleasure is all we want. To find what a case is meant to show, ask what it **takes away** from ordinary life and what question is left.",
        "每个思想实验都去掉无关的细节，让一个问题单独凸显出来。隐身戒指去掉了对被抓的恐惧，所以它问我们是否为了正义本身而守正义。提供愉快体验的机器去掉了快乐以外的一切，所以它问快乐是否就是我们想要的全部。要找出一个情形想说明什么，就问它从日常生活中**去掉**了什么、剩下什么问题。",
      ],
      ["What question is this thought experiment built to test?", "这个思想实验是为检验什么问题而设计的？"],
      `
        A ring makes its wearer invisible, so he can never be caught.|whether people are just only from fear of punishment|whether invisibility could ever be achieved by science|whether shepherds are more honest than kings
        A machine can give you any pleasant experience for the rest of your life.|whether pleasure is the only thing we value|whether such a machine could ever be built|whether people enjoy watching films
        A color scientist who has seen only black and white sees red for the first time.|whether knowing all the physical facts is knowing everything|whether color blindness can be cured|whether scientists should leave their labs
        A ship has every plank replaced, one at a time, over many years.|what makes a thing the same thing over time|how long wooden ships usually last|whether old ships should be kept in museums
        You choose the rules of a society without knowing who you will be in it.|what rules a fair person would choose|how voting systems actually work|whether people generally like to plan carefully for their own future
        A man follows rules to answer Chinese notes without knowing Chinese.|whether running a program is the same as understanding|how hard Chinese is to learn|whether rule books are useful
        A demon might be deceiving you about everything you perceive.|whether anything can be known for certain|whether demons exist|how the eyes and the nerves send signals of light to the brain
        A trolley will kill five people unless you switch it to kill one.|whether results alone decide what is right|how trolleys are braked|whether train and trolley workers are paid well enough for the danger
        A person is copied atom for atom on another planet.|what makes a person the same person|whether travel to Mars or another planet will ever be possible|how many atoms a body contains
        A child is about to fall into a well in front of you.|whether human beings are born with a sense of compassion|how deep old wells usually are|whether children should play near wells
        Two people live on Twin Earth, where water is a different chemical that looks the same.|whether meaning depends on the world as well as the mind|how much water the earth contains|whether chemistry is hard to study
        You ride beside a beam of light at the speed of light.|what light would look like to a moving observer|how fast the fastest trains and planes of today can actually go|whether light is bright
        A violinist is attached to you, and only your body can keep him alive.|whether a right to life requires others to sustain it|how violinists are trained|whether hospitals are crowded
        A cat in a sealed box is both alive and dead until someone looks.|whether quantum rules make sense for everyday objects|how cats behave in boxes|whether pets need fresh air
        Your brain is kept alive in a vat and fed false signals.|whether we can know the world outside the mind|how long a living brain can survive once it is outside the body|whether vats are used in labs
        A drowning child is in a shallow pond, and saving her would ruin your shoes.|whether distance changes our duty to help|how deep the ponds in an ordinary park usually are in summer|whether shoes are expensive
        People with no ties choose whether to break a promise no one would ever learn of.|whether duty holds when no one is watching|whether promises are written down|how well people manage to remember the promises they have made
        A machine answers questions so well that judges cannot tell it from a person.|whether behaving intelligently is enough to count as thinking|how fast computers are|whether judges are fair
        A surgeon could save five patients by taking one healthy visitor's organs.|whether some acts are wrong whatever their results|how organ transplants are done|whether hospitals need more visitors
        Two identical twins swap lives without anyone noticing.|whether a life is defined by its inner or outer facts|how common twins are|whether twins look alike
        An ant crawling in sand traces a line that looks like a portrait.|whether a picture needs an intention to represent something|how ants find food|whether sand is good for drawing
        Everyone suddenly gains the power to read every other mind.|whether privacy is needed for trust|how the brain stores thoughts and memories for later use|whether people talk too much
        A visitor sees a fake barn among real barns and says, "That is a barn."|whether a true belief reached by luck is knowledge|how barns are built|whether farmers paint their barns
        You could press a button to gain a fortune while a stranger far away dies.|whether harm to unseen people counts as much as harm to near ones|how buttons work|whether money brings happiness
        A woman is born and raised in a library with no windows.|whether learning from books gives the same knowledge as experience|how libraries are lit|whether reading is a good hobby
        Everyone in a town tells the truth except on one day each year.|whether a single exception destroys trust|how calendars are made and which days count as holidays|whether towns have holidays
        Your memories are moved into a new body and your old body keeps none.|whether memory is what makes you yourself|how memory fades with age|whether bodies need exercise
        A ruler can choose to make everyone happy by putting them all to sleep for ever.|whether happiness without choice is worth having|how sleep works|whether most rulers in history have truly liked their own people
        A painting is copied so perfectly that no expert can tell the two apart.|whether an original has value a perfect copy lacks|how paint is mixed by hand and applied to a canvas by painters|whether museums are too crowded
        A stone falls in a world with no air, beside a feather.|whether heavy things fall faster than light things by nature|how stones are formed|whether feathers are soft
      `,
      (right) => [
        `The case is built to test ${right}: it takes away everything else from ordinary life so that this question stands alone.`,
        `这个情形是为检验“${right}”而设计的：它去掉了日常生活中的其他一切，让这个问题单独凸显。`,
      ],
      [
        [
          "The case is not meant to test {wrong}; it is imagined, so its practical details do not matter.",
          "这个情形并不是要检验“{wrong}”；它是想象的，实际细节并不重要。",
        ],
        [
          "{wrong} is about a surface detail of the story, not the question the case isolates.",
          "“{wrong}”只涉及故事的表面细节，不是这个情形要突出的问题。",
        ],
      ],
    ),
  ],
});

const review = topic("reading", {
  id: "evaluating-a-review",
  title: ["Evaluating a Review", "评价一篇评论"],
  summary: [
    "How critics describe a work, judge it and give reasons, and how a reader tells a well-supported judgment from a mere opinion.",
    "评论家如何描述作品、评判作品并给出理由，以及读者如何区分有充分依据的评判和单纯的个人意见。",
  ],
  after: ["supported-and-unsupported-claims", "connotation-and-precise-words"],
  points: [
    label(
      "what-the-sentence-does",
      ["What the Sentence Does", "这个句子做了什么"],
      [
        "A review of a book, film, exhibition or concert does three things. It **describes** the work, so the reader knows what it is: its subject, its length, what happens, what is shown. It **judges** the work: good or bad, moving or dull, worth seeing or not. And it gives **reasons** that tie the judgment to specific features of the work: a scene, a line, a use of color, a choice the artist made. A judgment without reasons is only taste; a reason points to something the reader can check.",
        "对书、电影、展览或音乐会的评论做三件事。它**描述**作品，让读者知道作品是什么：主题、篇幅、情节、展出的内容。它**评判**作品：好或坏，动人或乏味，值不值得看。它还给出**理由**，把评判和作品的具体特点联系起来：某个场景、某句台词、某种用色、艺术家的某个选择。没有理由的评判只是个人口味；理由指向读者可以核查的东西。",
      ],
      ["What does this sentence from a review do?", "评论中的这个句子做了什么？"],
      `
        The film runs two and a half hours and follows a family over three generations.|describes the work
        The exhibition gathers forty paintings from the artist's last ten years.|describes the work
        The novel is told by a ghost who watches her old house being sold.|describes the work
        The album has eleven songs, most of them under three minutes.|describes the work
        The play is set in a single kitchen on the night of a storm.|describes the work
        The concert opened with a short piece for solo cello.|describes the work
        The photographs show factory workers in the 1930s.|describes the work
        The book is a collection of twelve essays on walking.|describes the work
        The dance lasts forty minutes and uses no music at all.|describes the work
        The sculpture is made of melted-down car parts.|describes the work
        This is the most moving film of the year.|judges the work
        The exhibition is a triumph.|judges the work
        Sadly, the novel never comes to life.|judges the work
        It is a dull, forgettable album.|judges the work
        The play is a minor masterpiece.|judges the work
        This is a concert no one should miss.|judges the work
        The collection is uneven but rewarding.|judges the work
        It is hard to imagine a better book on the subject.|judges the work
        The production is a disappointment.|judges the work
        The sculpture is simply beautiful.|judges the work
        The final scene, played in total silence, lets the audience feel the mother's grief.|gives a reason
        Each painting uses only two colors, which gives the rooms a calm, unbroken mood.|gives a reason
        The ghost's voice repeats the same phrases, so the chapters soon blur together.|gives a reason
        Every song uses the same drum pattern, which makes the album feel flat.|gives a reason
        The storm outside is heard but never seen, so the tension grows with every crash.|gives a reason
        The cellist held the last note until the hall was completely still.|gives a reason
        The workers look straight at the camera, which makes them equals, not objects.|gives a reason
        The essays each begin with a single step and widen to a whole life.|gives a reason
        Without music, every breath and footstep becomes part of the dance.|gives a reason
        The car parts still show their brand names, which turns the sculpture into a joke about waste.|gives a reason
      `,
      {
        "describes the work": L(
          "描述作品",
          "The sentence states facts about the work, such as its subject, length or content, without saying whether it is good.",
          "句子陈述作品的事实，如主题、篇幅或内容，不评价它好不好。",
          "The sentence does more than state facts about the work.",
          "这个句子不只是陈述作品的事实。",
        ),
        "judges the work": L(
          "评判作品",
          "The sentence says how good or bad the work is but does not point to a feature that shows it.",
          "句子说出作品好或坏，但没有指出能说明这一点的具体特点。",
          "The sentence does not give an overall judgment of the work.",
          "这个句子没有给出对作品的整体评判。",
        ),
        "gives a reason": L(
          "给出理由",
          "The sentence ties an effect or a judgment to a specific feature of the work that a reader could check.",
          "句子把一种效果或评判与作品中读者可以核查的具体特点联系起来。",
          "The sentence does not tie a judgment to a specific feature of the work.",
          "这个句子没有把评判和作品的具体特点联系起来。",
        ),
      },
    ),
    choose(
      "the-best-supported-judgment",
      ["The Best-Supported Judgment", "依据最充分的评判"],
      [
        "Readers trust a review when its judgments are supported. The best-supported judgment names a **specific feature** of the work and explains its **effect**: *The camera never leaves the boy's face, so we feel his fear before we see its cause.* Weaker judgments rely on the critic's taste (*I just loved it*), on popularity (*Everyone is talking about it*), on the artist's fame or on loaded words with no reason behind them.",
        "当评论中的评判有依据时，读者才会信任它。依据最充分的评判会指出作品的**具体特点**并说明其**效果**：*镜头始终没离开男孩的脸，所以我们在看到原因之前就感到了他的恐惧。* 较弱的评判依靠评论家的个人口味（*我就是喜欢*）、受欢迎程度（*人人都在谈论它*）、艺术家的名气，或背后没有理由的情绪化词语。",
      ],
      ["Which judgment is best supported?", "哪个评判依据最充分？"],
      `
        a review of a war film|The camera stays at a soldier's eye level, so the battles feel confusing and close.|Everyone I know says it is the best war film ever made.|The director has won many prizes, so the film must be strong.
        a review of a novel|The short chapters, each ending on a question, keep the reader turning pages.|I simply could not put this wonderful book down at all.|The novel has sold more than a million copies, so readers clearly love it very much.
        a review of a painting show|The artist paints shadows in blue, which makes even noon scenes feel cold.|These paintings are just gorgeous, and I adored every one.|The gallery is one of the most famous in the world, so the show is sure to be important.
        a review of a play|The actors speak over each other, so the family's quarrels sound real.|It is a brilliant, brilliant play that nobody should miss.|Tickets for every night sold out within an hour, which surely proves how good the play is.
        a review of an album|The singer drops to a whisper in the chorus, which makes the lyric sound like a secret.|This album is amazing and it made me so happy all week.|The band is very popular, so the album is bound to succeed.
        a review of a poem collection|The poems use only words of one syllable, which gives them a hard, plain music.|These poems are deep, beautiful and truly unforgettable.|The poet is a professor, so the poems must be well made.
        a review of a museum|Each room is lit only from above, so visitors look at the objects in near silence.|It is the best museum in the whole country, without doubt.|Millions of tourists from every part of the world visit it each year, so it must be excellent.
        a review of a horror film|We hear the creature for an hour before we see it, so fear builds slowly.|This film is honestly the scariest thing I have ever seen in my whole life, and I loved it.|The poster is so frightening that the film must be too.
        a review of a ballet|The dancers move in slow motion during the battle, so the violence looks like grief.|The ballet was simply stunning from start to finish.|The company is two hundred years old, so its ballets are classics.
        a review of a biography|The author quotes the subject's letters at length, so we hear her own voice.|This biography is thorough, fair and wonderfully written.|The author has already written ten other books about famous people, so this one is reliable.
        a review of a comedy|The jokes come from what the characters want, so the laughs also reveal them.|It is the funniest film of the decade, hands down.|My whole family laughed from beginning to end, so it is obviously a great and important comedy.
        a review of a photograph show|The photographer shoots from a child's height, so the city looks huge and strange.|These photos are powerful and they really moved me.|The photographer is on social media, so many people know her.
        a review of a memoir|The writer admits when she cannot remember, which makes the rest of the book easier to trust.|This memoir is honest, raw and absolutely essential reading.|The writer was famous on television, so her life is interesting.
        a review of a symphony|The theme returns in the last movement played slowly, so the ending feels like memory.|This is glorious music that lifts the soul to heaven.|The composer is dead and famous, so the work must be great.
        a review of a building|The windows face the river, so every office has the same light and view.|This building is a stunning, bold and exciting achievement.|It cost a fortune to build, more than any other building in the city, so it must be well designed.
        a review of a children's book|The pictures show what the words leave out, so children find the joke themselves.|Kids will just love this adorable and charming story.|The book won a prize last year, so it must be good for children.
        a review of a video game|Saving the game costs a resource, so every choice to save feels like a risk.|This game is incredibly fun and super addictive.|The game had the biggest advertising budget of the year, so it must be good to play as well.
        a review of a restaurant meal|The bread is baked in the room, so the smell greets you at the door.|The food was delicious, the waiters were kind, and we had a lovely evening with our friends.|The chef was on television, so the food has to be good.
        a review of a TV series|Each episode is told by a different character, so the same events look new each time.|This series is the best thing on television right now.|The series was renewed for five seasons, so people must like it.
        a review of an opera|The singers stand still while the orchestra rages, so the music seems to speak their thoughts.|The opera was magnificent and the audience cheered.|The opera house is very old and very grand.
        a review of a short story|The ending repeats the first line with one word changed, which reverses its meaning.|This short story is clever, sad and perfectly formed.|The story appeared in a famous magazine, so it is excellent.
        a review of a sculpture garden|The paths make visitors circle each piece before reaching it, so it is seen from every side.|The garden is a peaceful, lovely place to spend a day.|The garden won a design prize, so it must be special.
        a review of a documentary|The film shows the full speech without cuts, so viewers can judge it for themselves.|This documentary is important and everyone must watch it.|The director is famous, so the facts must all be right.
        a review of a novel in translation|The translator keeps the original's long sentences, so the prose feels breathless.|This translation is smooth, lovely and easy to read.|The translator speaks six languages, so the translation is perfect.
        a review of a musical|Every song moves the story forward, so nothing feels like a pause for applause.|The musical is fabulous fun for the whole family.|It ran for ten years on Broadway and toured the world twice, so it must be wonderful.
        a review of a poetry reading|The poet read each poem twice, so listeners heard new things the second time.|The reading was beautiful and very inspiring.|The poet is very well known in many countries, so the evening was sure to be a great success.
        a review of a crime novel|Every clue is given before the reveal, so a careful reader could solve the case.|The plot is gripping and the ending is a total shock.|The author's last book was a bestseller, so this one is too.
        a review of a design show|Every chair can be taken apart by hand, so the show argues for things that last.|The chairs are cool, sleek and stylish.|The show is sponsored by one of the biggest companies in the country, so it must be important.
        a review of an essay collection|Each essay answers an objection raised in the one before, so the book reads as a single argument.|The essays are wise, witty and full of insight.|The essayist writes for the best newspapers in the world.
        a review of an animated film|The colors drain away as the girl loses hope and return as she fights back.|The animation is gorgeous and the story is sweet.|The studio has made many hit films before this one.
      `,
      (right) => [
        `"${right}" names a specific feature of the work and explains its effect, so a reader can check the judgment.`,
        `“${right}”指出了作品的具体特点并说明了效果，读者可以核查这个评判。`,
      ],
      [
        [
          '"{wrong}" states a strong feeling or loaded words but points to nothing in the work that supports it.',
          "“{wrong}”表达了强烈的感受或情绪化的词语，却没有指出作品中任何支持它的东西。",
        ],
        [
          '"{wrong}" rests on popularity, fame or money, which say nothing about the work itself.',
          "“{wrong}”依靠的是受欢迎程度、名气或金钱，这些并不能说明作品本身。",
        ],
      ],
    ),
  ],
});

const translations = topic("reading", {
  id: "comparing-translations",
  title: ["Comparing Translations", "比较译本"],
  summary: [
    "How two translations of the same line differ in word choice, in sentence shape and rhythm, or in meaning added or lost, and what each difference does to the reader.",
    "同一句话的两种译文如何在用词、句式和节奏，或意义的增减上不同，以及每种差异对读者产生什么影响。",
  ],
  after: ["connotation-and-precise-words", "tone-and-mood"],
  points: [
    label(
      "what-differs",
      ["What Differs", "哪里不同"],
      [
        "No translation is the original; every translator chooses. When two translations of one line differ, the difference is usually of one of three kinds. **Word choice** differs when the same meaning is given different words with different connotations: *the old man* or *the elder*. **Sentence shape** differs when the words are ordered, joined or broken differently, changing the rhythm: one long sentence or three short ones. **Meaning** differs when one translation adds something that is not in the other or leaves something out.",
        "没有一种译文就是原文；每个译者都在选择。当同一句话的两种译文不同时，差异通常属于三类之一。**用词**不同：同一个意思用了带有不同联想意义的词，如 *the old man* 或 *the elder*。**句式**不同：词语的顺序、连接或断句不同，改变了节奏，如一个长句或三个短句。**意义**不同：一种译文加入了另一种没有的内容，或省去了某些内容。",
      ],
      ["How do these two translations differ?", "这两种译文有什么不同？"],
      `
        "The old man sat by the sea." / "The elder sat beside the ocean."|word choice
        "She was poor." / "She was penniless."|word choice
        "The child cried." / "The infant wept."|word choice
        "He walked home." / "He trudged home."|word choice
        "The house was small." / "The cottage was tiny."|word choice
        "My friend left." / "My companion departed."|word choice
        "The king was angry." / "The monarch was furious."|word choice
        "It was a cold night." / "It was a bitter night."|word choice
        "The soldiers ran." / "The troops fled."|word choice
        "Her face was sad." / "Her face was sorrowful."|word choice
        "He came home, ate, and slept." / "He came home. He ate. He slept."|sentence shape
        "When the rain stopped, we left." / "We left when the rain stopped."|sentence shape
        "The moon rose over the silent hills." / "Over the silent hills, the moon rose."|sentence shape
        "I came, I saw, I conquered." / "I came and saw and conquered."|sentence shape
        "She waited, and waited, and waited." / "She waited a long time."|sentence shape
        "Spring came; the river thawed." / "Spring came and the river thawed."|sentence shape
        "Silent was the forest." / "The forest was silent."|sentence shape
        "He spoke, and the room fell still." / "The room fell still as he spoke."|sentence shape
        "Night. Snow. A single lamp." / "It was a snowy night lit by a single lamp."|sentence shape
        "Long ago, in a far country, lived a king." / "A king lived in a far country long ago."|sentence shape
        "The old man sat by the sea." / "The lonely old man sat by the sea."|meaning added or lost
        "She left without a word." / "She left."|meaning added or lost
        "The soldier returned." / "The soldier returned, wounded."|meaning added or lost
        "He gave her a ring." / "He gave her his mother's ring."|meaning added or lost
        "The town was destroyed in the war." / "The town suffered in the war."|meaning added or lost
        "The poet wrote of the river at dawn." / "The poet wrote of the river."|meaning added or lost
        "They ate rice." / "They ate the last of their rice."|meaning added or lost
        "The door opened." / "The door opened slowly, as if afraid."|meaning added or lost
        "My father worked in the fields." / "My father worked."|meaning added or lost
        "The bird sang." / "The caged bird sang."|meaning added or lost
      `,
      {
        "word choice": L(
          "用词",
          "The two say the same thing in the same order but use different words, with different connotations.",
          "两种译文用同样的顺序说同样的事，但用了带有不同联想意义的不同词语。",
          "The difference is not only in the choice of words.",
          "差异不只是在用词上。",
        ),
        "sentence shape": L(
          "句式",
          "The two keep the same meaning and similar words but order, join or break the sentence differently, changing its rhythm.",
          "两种译文意思相同、用词相近，但句子的顺序、连接或断句不同，改变了节奏。",
          "The difference is not in how the sentence is ordered or joined.",
          "差异不在于句子的顺序或连接方式。",
        ),
        "meaning added or lost": L(
          "意义增减",
          "One translation includes a detail or idea that the other leaves out.",
          "一种译文包含了另一种省去的细节或意思。",
          "Neither translation adds or drops a detail.",
          "两种译文都没有增加或省去细节。",
        ),
      },
    ),
    choose(
      "what-the-difference-does",
      ["What the Difference Does", "这个差异有什么作用"],
      [
        "Comparing translations is useful because each choice has an **effect**. A plain word keeps a scene ordinary; a grand word raises it. Short sentences make a moment abrupt or tense; one long sentence makes it flow. A word added can tell readers what to feel; a word dropped can leave them to decide. To describe the difference well, name the change and then say what it does to the reader.",
        "比较译本很有用，因为每个选择都有**效果**。平实的词让场景保持平常，宏大的词使它升华。短句让某个时刻显得突然或紧张，一个长句则使它流畅。增加一个词可以告诉读者该有什么感受，省去一个词则可以让读者自己判断。要把差异描述好，就要说出变化是什么，再说它对读者有什么作用。",
      ],
      ["Which comment best describes what the difference does?", "哪个评论最能说明这个差异的作用？"],
      `
        "The old man sat by the sea." / "The elder sat beside the ocean."|The second sounds more formal and grand, giving the man dignity.|The second is shorter and plainer, so it sounds more ordinary.|The second adds a new person who is not in the first.
        "He came home, ate, and slept." / "He came home. He ate. He slept."|The short sentences of the second make his life sound flat and mechanical.|The second adds new actions that the first leaves out.|The second uses grander words that make his life heroic.
        "She left without a word." / "She left."|The second drops her silence, so readers lose a hint of her anger or hurt.|The second adds a reason for her leaving that the first sentence does not give at all.|The second makes her departure sound slow and gentle.
        "The soldiers ran." / "The troops fled."|Fled makes the movement sound like a frightened retreat, not just running.|The second adds new soldiers who were not there before and changes who is running away.|The second breaks the sentence into short, tense parts.
        "The bird sang." / "The caged bird sang."|The added word makes the song sound sad or defiant, not simply cheerful.|The second uses a grander word for the same bird, which makes the scene sound more formal.|The second reorders the words to change the rhythm.
        "Night. Snow. A single lamp." / "It was a snowy night lit by a single lamp."|The fragments of the first make the scene stark, like a series of images.|The first adds details that the second leaves out.|The first uses gentler words that soften the scene.
        "It was a cold night." / "It was a bitter night."|Bitter suggests hardship and pain as well as low temperature.|The second adds a new event to the night that the first sentence leaves out.|The second makes the sentence longer and smoother.
        "The house was small." / "The cottage was tiny."|Cottage and tiny make the home sound cosy or charming rather than poor.|The second removes the house from the scene.|The second changes the order of the words so that the sentence has a smoother rhythm.
        "Silent was the forest." / "The forest was silent."|Putting silent first makes the stillness the striking thing, in a poetic tone.|The first adds a new detail about the forest.|The first uses a grander word for the forest.
        "They ate rice." / "They ate the last of their rice."|The added phrase tells readers the family is close to hunger.|The second uses a fancier word for the food that the family is eating.|The second breaks the sentence into fragments.
        "The door opened." / "The door opened slowly, as if afraid."|The added words create suspense and make the door seem almost alive.|The second uses a shorter, plainer word for the door.|The second moves the door to the start of the sentence.
        "He walked home." / "He trudged home."|Trudged shows tiredness or sadness that walked does not.|The second adds a new place that he went to on his way home.|The second breaks the walk into several sentences.
        "I came, I saw, I conquered." / "I came and saw and conquered."|The commas of the first make each act a separate, swift blow.|The first adds a battle that the second leaves out.|The first uses more modest words for the victory.
        "The child cried." / "The infant wept."|The second sounds more formal and solemn, making the moment heavier.|The second adds a reason for the child's tears.|The second splits the sentence for a faster rhythm.
        "My father worked in the fields." / "My father worked."|The second loses the farm setting, so readers lose a sense of his life.|The second uses a grander word for his work.|The second turns the plain statement into a question about what his father did.
        "When the rain stopped, we left." / "We left when the rain stopped."|The first holds back the action, so the wait for the rain is felt first.|The first adds new people to the scene.|The first uses gloomier words for the rain.
        "The soldier returned." / "The soldier returned, wounded."|The added word turns a homecoming into a moment of cost and pain.|The second uses a grander word for the soldier.|The second reorders the sentence for emphasis only, without changing what it tells us.
        "Her face was sad." / "Her face was sorrowful."|Sorrowful sounds deeper and more literary than sad.|The second adds a new person's face to the scene being described.|The second breaks the sentence into two.
        "She waited, and waited, and waited." / "She waited a long time."|The repetition in the first makes readers feel the length of the wait.|The first adds a reason for her waiting.|The first uses a grander word for waiting.
        "He gave her a ring." / "He gave her his mother's ring."|The added words make the gift carry family history and meaning.|The second uses a more formal word for the ring, which makes the line sound grander.|The second changes the order of the giving.
        "The king was angry." / "The monarch was furious."|The second makes the anger stronger and the king more distant and grand.|The second adds a new king to the story.|The second splits the sentence into fragments.
        "The town was destroyed in the war." / "The town suffered in the war."|The second softens the loss, so readers may not grasp how complete it was.|The second uses a grander word for the town.|The second moves the war to the start of the sentence.
        "Spring came; the river thawed." / "Spring came and the river thawed."|The semicolon of the first sets the two events side by side, like a pause.|The first adds a new season to the scene.|The first uses colder words for the river.
        "My friend left." / "My companion departed."|The second sounds older and more formal, as if from a story of long ago.|The second adds a reason for leaving.|The second breaks the line into short pieces.
        "The poet wrote of the river at dawn." / "The poet wrote of the river."|The second loses the time of day and the light it brings to mind.|The second uses a grander word for the poet.|The second reorders the sentence so that the river comes before the poet for rhythm.
        "He spoke, and the room fell still." / "The room fell still as he spoke."|The first puts his words first, so the silence feels caused by them.|The first adds new listeners to the room.|The first uses a harsher word for the silence.
        "Long ago, in a far country, lived a king." / "A king lived in a far country long ago."|The first delays the king in the manner of a fairy tale.|The first adds a second king to the story.|The first uses plainer words for the country.
        "The moon rose over the silent hills." / "Over the silent hills, the moon rose."|The second makes the reader wait for the moon, so its rising feels like an arrival.|The second adds new hills to the scene.|The second uses colder words for the moon.
        "The lonely old man sat by the sea." / "The old man sat by the sea."|The second leaves his loneliness for readers to sense rather than telling them.|The second uses a grander word for the sea.|The second breaks the sentence into fragments.
        "She was poor." / "She was penniless."|Penniless makes her poverty sharper and more complete.|The second adds a new person to the line who was not mentioned before.|The second reorders the words for rhythm.
      `,
      (right) => [`${right} It names the change and says what it does to the reader.`, `“${right}”说出了变化是什么，以及它对读者的作用。`],
      [
        ["{wrong} That misreads the kind of change between the two translations.", "“{wrong}”误判了两种译文之间变化的类型。"],
        ["{wrong} That describes a change that is not there.", "“{wrong}”描述的变化并不存在。"],
      ],
    ),
  ],
});

const risk = topic("reading", {
  id: "reading-risk-and-probability",
  title: ["Reading Risk and Probability", "解读风险与概率"],
  summary: [
    "How reports state risks as absolute numbers, as relative changes or as single stories, and how to work out what a risk really means for a person.",
    "报道如何以绝对数字、相对变化或单个故事来陈述风险，以及如何算出风险对一个人究竟意味着什么。",
  ],
  after: ["how-numbers-can-mislead", "reading-charts-and-statistics"],
  points: [
    label(
      "how-the-risk-is-stated",
      ["How the Risk Is Stated", "风险是如何陈述的"],
      [
        "A risk can be stated three ways. An **absolute risk** gives the chance for a person or a group: *2 in 1,000 people*, *a 1% chance*. A **relative risk** compares two chances and gives only the change: *doubles the risk*, *50% lower*, *three times as likely*. A relative risk sounds alarming or hopeful, but without the absolute risk you cannot tell whether it matters: doubling 1 in a million is still tiny. A **single story** describes one case, which may be vivid but tells nothing about how often something happens.",
        "风险有三种陈述方式。**绝对风险**给出一个人或一个群体的概率：*每 1,000 人中 2 人*，*1% 的可能*。**相对风险**比较两个概率，只给出变化：*风险翻倍*、*降低 50%*、*可能性是三倍*。相对风险听起来令人担忧或充满希望，但没有绝对风险，你就无法判断它是否重要：百万分之一翻一倍仍然很小。**单个故事**描述一个案例，也许很生动，但完全说明不了某事多常发生。",
      ],
      ["How is the risk stated here?", "这里的风险是如何陈述的？"],
      `
        About 2 in every 10,000 drivers are injured in a year.|an absolute risk
        The chance of a serious side effect is 1 in 50,000.|an absolute risk
        One in eight women will develop the disease in her lifetime.|an absolute risk
        In a year, 3 of every 1,000 homes in the area flood.|an absolute risk
        The odds of a plane crash on one flight are about 1 in 10 million.|an absolute risk
        About 15 out of 100 smokers develop lung cancer.|an absolute risk
        The yearly chance of a major earthquake here is about 1%.|an absolute risk
        Four in 100 children catch the illness each winter.|an absolute risk
        The chance of being struck by lightning in a year is about 1 in a million.|an absolute risk
        About 6 in 1,000 cyclists are hurt on that road each year.|an absolute risk
        Eating processed meat raises the risk of the cancer by 18%.|a relative risk
        The new drug halves the risk of a second heart attack.|a relative risk
        Night workers are twice as likely to have the condition.|a relative risk
        Wearing a helmet cuts the risk of head injury by 70%.|a relative risk
        Children near the road are three times as likely to have asthma.|a relative risk
        The vaccine reduces the chance of severe illness by 90%.|a relative risk
        Drivers using phones are four times as likely to crash.|a relative risk
        The pill increases the risk of clots by 50%.|a relative risk
        Living near the plant doubles the risk of the illness.|a relative risk
        People who exercise have a 30% lower risk of the disease.|a relative risk
        A woman in our town took the pill and suffered a stroke.|a single story
        My uncle smoked every day and lived to ninety-five.|a single story
        A boy was bitten by a shark at the beach last summer.|a single story
        One family's house was struck by lightning twice.|a single story
        A cyclist was hit on the new bridge on its first day.|a single story
        A man won the lottery after buying his first ticket.|a single story
        A nurse caught the virus after a single shift.|a single story
        A neighbor's child became ill after the vaccine.|a single story
        One passenger survived the crash without a scratch.|a single story
        A hiker was struck by a falling rock on the trail.|a single story
      `,
      {
        "an absolute risk": L(
          "绝对风险",
          "It gives the actual chance for a person or group, such as 2 in 1,000 or 1%.",
          "它给出一个人或一个群体的实际概率，如每 1,000 人中 2 人或 1%。",
          "It does not give the actual chance for a person or group.",
          "它没有给出一个人或一个群体的实际概率。",
        ),
        "a relative risk": L(
          "相对风险",
          "It gives only a change between two chances, such as doubles, halves or 30% lower, without the starting chance.",
          "它只给出两个概率之间的变化，如翻倍、减半或降低 30%，没有给出原本的概率。",
          "It does not compare one chance with another.",
          "它没有把一个概率与另一个概率比较。",
        ),
        "a single story": L(
          "单个故事",
          "It describes one person or one event, which says nothing about how often such things happen.",
          "它描述一个人或一件事，完全说明不了这类事情多常发生。",
          "It is not about a single case.",
          "它不是关于单个案例的。",
        ),
      },
    ),
    choose(
      "what-the-number-really-means",
      ["What the Number Really Means", "这个数字的真正含义"],
      [
        "To understand a relative risk, put it back on its **baseline**, the absolute chance before the change. If a risk of 2 in 10,000 doubles, it becomes 4 in 10,000: twice as large, but still rare. If a drug cuts a risk of 10 in 100 by half, 5 people in 100 are spared. A single story cannot be turned into a rate at all. The right reading states the absolute numbers; wrong readings confuse a relative change with a certainty or turn one case into a rule.",
        "要理解相对风险，就要把它放回**基线**上，即变化之前的绝对概率。如果万分之二的风险翻倍，就变成万分之四：大了一倍，但仍然罕见。如果一种药把百分之十的风险减半，每 100 人中有 5 人免于此病。单个故事根本无法换算成比率。正确的解读说出绝对数字；错误的解读把相对变化误当作确定无疑，或把一个案例当成规律。",
      ],
      ["What does this statement really mean?", "这个说法的真正含义是什么？"],
      `
        A risk of 2 in 10,000 doubles.|It rises to 4 in 10,000, which is still rare.|Now half of all people will be affected.|It rises to 2 in 5,000, which is very common.
        A drug halves a risk of 10 in 100.|About 5 fewer people in 100 are affected.|Nobody who takes the drug will be affected.|About 50 fewer people in 100 are affected.
        A habit raises a risk of 5 in 100 by 20%.|It rises to about 6 in 100.|It rises to 25 in 100.|Everyone with the habit will be affected.
        A helmet cuts a risk of 10 in 1,000 by 70%.|It falls to about 3 in 1,000.|It falls to 0 in 1,000.|It falls to 7 in 1,000.
        A chemical triples a risk of 1 in a million.|It rises to 3 in a million, still extremely small.|It rises to 3 in 10, a serious danger.|It means a third of people will be harmed.
        A vaccine cuts a risk of 20 in 1,000 by 90%.|It falls to about 2 in 1,000.|It falls to 18 in 1,000.|No vaccinated person can catch it.
        A new road doubles a risk of 1 in 1,000.|It rises to 2 in 1,000.|It rises to 1 in 2.|It rises to 100 in 1,000.
        A pill raises a clot risk of 4 in 10,000 by 50%.|It rises to about 6 in 10,000.|It rises to 50 in 10,000.|Half of all users will get a clot.
        A diet lowers a risk of 30 in 100 by a third.|It falls to about 20 in 100.|It falls to 3 in 100.|Nobody on the diet will be affected.
        A phone makes a crash risk of 1 in 100,000 per trip four times larger.|It rises to about 4 in 100,000 per trip.|It rises to 4 in 10 per trip.|Every driver with a phone will crash.
        My uncle smoked and lived to ninety-five.|One case does not show the risk for smokers as a group.|Smoking must be safe for everyone, since he smoked for decades and lived so long.|Smoking must help people live longer.
        A woman took the pill and had a stroke.|One case cannot show how often the pill causes strokes.|The pill causes strokes in every user.|The pill must be completely safe for every woman who takes it, whatever her age.
        A man won the lottery on his first ticket.|One win says nothing about the chance of winning.|Buying one ticket makes winning likely.|Everyone who buys one ticket wins.
        A boy was bitten by a shark last summer.|One attack does not tell how likely an attack is.|Sharks bite most of the swimmers who go into the water at that beach every summer.|Sharks never bite anyone at that beach.
        Exercise lowers a risk of 12 in 100 by 25%.|It falls to about 9 in 100.|It falls to 25 in 100.|Exercise removes the risk entirely.
        A town's flood risk of 3 in 1,000 a year doubles.|It rises to about 6 in 1,000 a year.|It rises to 3 in 2 a year.|Every house will now flood each year.
        Night work raises a risk of 8 in 1,000 by half again.|It rises to about 12 in 1,000.|It rises to 500 in 1,000.|It falls to about 4 in 1,000.
        A screening test cuts deaths of 4 in 1,000 by a quarter.|About 1 fewer death in 1,000 people screened.|About 250 fewer deaths in 1,000 people.|Screening prevents every death.
        Living near the plant raises a risk of 1 in 10,000 to twice as much.|It becomes 2 in 10,000.|It becomes 1 in 2.|It becomes 20 in 100.
        A treatment lowers a death rate of 50 in 1,000 by 10%.|It falls to about 45 in 1,000.|It falls to 10 in 1,000.|It falls to 5 in 1,000.
        One hiker was hurt by a falling rock.|One accident does not give the risk to hikers on the trail.|The trail is deadly for every hiker.|The trail is perfectly safe.
        Air pollution raises a risk of 20 in 1,000 by 15%.|It rises to about 23 in 1,000.|It rises to 35 in 1,000.|It rises to 150 in 1,000.
        A seat belt halves a death risk of 2 in 10,000 per year.|It falls to about 1 in 10,000 per year.|It falls to 0 per year.|It falls to 1 in 2 per year.
        A medicine raises a rash risk of 1 in 100 three times over.|It rises to about 3 in 100.|It rises to 30 in 100.|Everyone who takes it gets a rash.
        A neighbor's child fell ill after the vaccine.|One case cannot show that the vaccine caused it or how often.|The vaccine makes most children ill.|The vaccine can never cause any illness.
        Sunscreen cuts a risk of 6 in 1,000 by a half.|It falls to about 3 in 1,000.|It falls to 0.5 in 1,000.|It falls to 60 in 1,000.
        A gene makes a risk of 10 in 100 five times greater.|It rises to about 50 in 100.|It rises to 15 in 100.|It rises to 500 in 100.
        Flying is said to be safer than driving.|The risk per mile travelled is lower by plane than by car.|Nobody has ever died in a plane crash, while many people die in cars every year.|Driving is always dangerous.
        A food raises a risk of 6 in 100 by 18%.|It rises to about 7 in 100.|It rises to 24 in 100.|It rises to 18 in 100.
        One family's house was struck by lightning twice.|A single family's luck says nothing about the risk to others.|Lightning strikes that town twice a year.|Lightning never strikes the same house twice.
      `,
      (right) => [
        `${right} The relative change is applied to the starting chance, or the single case is not treated as a rate.`,
        `“${right}”把相对变化应用到原本的概率上，或者没有把单个案例当成比率。`,
      ],
      [
        [
          "{wrong} That mixes up the relative change with the absolute chance, or treats a percentage as a share of people.",
          "“{wrong}”把相对变化和绝对概率混淆了，或把百分比当成了人数比例。",
        ],
        [
          "{wrong} That turns a risk into a certainty or a single case into a rule.",
          "“{wrong}”把风险当成了确定无疑，或把单个案例当成了规律。",
        ],
      ],
    ),
  ],
});

/** readingTopics12 are the reading topics of grade 12. */
export const readingTopics12: readonly TopicDef[] = [investigative, thought, review, translations, risk];
