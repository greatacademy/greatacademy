// Grade 8: reading of the last units: scientific arguments, irrelevant evidence, unreliable narrators, Gothic
// fiction, Shakespeare's scenes and their productions, oral histories, memoirs beside reports, old tales retold, and
// whole arguments.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, rival, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const scientificArgument = topic("reading", {
  id: "evaluating-a-scientific-argument",
  title: ["Evaluating a Scientific Argument", "评估科学论证"],
  summary: [
    "A scientific argument is only as strong as its evidence and its reasoning: a fair test, enough cases and a conclusion that stays within what was found.",
    "科学论证的力度取决于证据和推理：公平的检验、足够的样本，以及不超出发现范围的结论。",
  ],
  intro: [
    "Hearing that *five gardeners used a new spray and grew giant tomatoes* sounds tempting—until you ask how many gardens were tested and what happened to unsprayed plants. Evaluating a scientific argument means checking both the design of the test and whether the conclusion stays within the data.",
    "听说“五位园丁用了新喷雾，种出了大番茄”听起来很诱人——直到你追问一共测了多少块地、没喷雾的番茄又长得怎样。评估科学论证既要检验实验设计，也要看结论有没有越出数据边界。",
  ],
  after: ["checking-a-claim-against-the-evidence", "correlation-or-cause"],
  points: [
    label(
      "is-the-test-sound",
      ["Is the Test Sound", "检验是否可靠"],
      [
        "Before trusting a scientific claim, look at how the evidence was gathered. A **sound test** studies many cases and compares them with a group that did not get the treatment. A test with **too few cases** may show only chance: two finches are not a population. A test with **no comparison** cannot show that the treatment made the difference, because we do not know what would have happened without it.\n\n> **Watch out.** Check sample size and control group in order: only 1–5 subjects means **too few cases**; hundreds of subjects with no untreated/control group means **no comparison**; both a large sample and a fair control group make **a sound test**.",
        "在相信一个科学论断之前，要看证据是怎样收集的。**可靠的检验**研究许多个案，并把它们与没有接受处理的一组作比较。**样本太少**的检验可能只反映了偶然：两只雀鸟代表不了一个种群。**没有对照**的检验无法证明是处理带来了差别，因为我们不知道如果不处理会怎样。\n\n> **注意。** 按顺序查样本量和对照组：只有一两个到五个样本是**样本太少**；样本很大却没有未处理对照组是**没有对照**；只有大样本加公平对照才是**可靠的检验**。",
      ],
      ["How sound is the test behind this claim?", "这个论断背后的检验可靠吗？"],
      `
        Scientists measured the beaks of 600 finches before and after a drought, and the same in a wetter island nearby.|a sound test
        A scientist measured the beaks of two finches after a drought and found them larger.|too few cases
        After a drought, scientists measured finch beaks and found them large, but they did not measure beaks before the drought or elsewhere.|no comparison
        Researchers fed 500 mice a new diet and 500 a normal diet, and compared how long they lived.|a sound test
        A researcher fed three mice a new diet, and they lived a long time.|too few cases
        A thousand mice fed a new diet lived long lives, but no mice on a normal diet were studied.|no comparison
        Biologists counted moths on 200 dark and 200 pale trees across many forests over ten years.|a sound test
        A boy found four dark moths on one sooty tree and decided dark moths survive better.|too few cases
        Many dark moths were found in a sooty forest, but no one counted them in a clean forest.|no comparison
        Farmers planted 300 fields with a new seed and 300 with the old seed and compared harvests.|a sound test
        One farmer tried a new seed in a single field and got a big harvest.|too few cases
        Hundreds of fields planted with a new seed gave good harvests in a year of perfect weather, with no fields of old seed to compare.|no comparison
        Doctors gave 2,000 patients a new drug and 2,000 a sugar pill, without telling them which they got.|a sound test
        A doctor gave a new drug to five patients, and four got better.|too few cases
        Thousands of patients took a new drug and most got better, but no one tracked patients who did not take it.|no comparison
        Researchers dug up fossils at 40 sites of different ages and compared the animals found in each layer.|a sound test
        A collector found one fossil of a fish with leg-like fins and decided all fish once had legs.|too few cases
        Fossils in one rock layer were large, but no older or younger layers were examined.|no comparison
        Ecologists counted frogs in 50 ponds with a chemical and 50 ponds without it.|a sound test
        A student found two deformed frogs in a pond near a factory.|too few cases
        Many frogs in ponds near a factory were deformed, but no ponds away from the factory were checked.|no comparison
        A team grew 400 plants with music and 400 without, under the same light and water.|a sound test
        A girl played music to one plant, and it grew taller than she expected.|too few cases
        Plants played music all grew tall, but no plants without music were grown at the same time.|no comparison
        Researchers tracked the sleep and test scores of 3,000 students who slept different amounts.|a sound test
        A teacher noticed that two students who slept well got good grades.|too few cases
        Students in a sleep program got high grades, but the grades of students outside the program were not studied.|no comparison
        Geneticists compared the DNA of 100 dog breeds with that of 100 wolves.|a sound test
        A scientist compared the DNA of one dog and one wolf and found them alike.|too few cases
        Dogs fed a new food grew shiny coats, but dogs on their usual food were not observed.|no comparison
      `,
      {
        "a sound test": L(
          "可靠的检验",
          "The test studies many cases and compares them with a group that did not get the treatment, so a real difference can show up.\n\n**Check.** Verify both pillars of a fair study: a large sample size *and* a clear comparison group (before/after, treated/untreated, or different sites).",
          "这个检验研究了许多个案，并与没有接受处理的一组作比较，所以能显示真正的差别。\n\n**检验。** 核对可靠实验的两根支柱：足够大的样本量，*以及*明确的对照组（处理组与未处理组、前后对比或不同地点对比）。",
          "The test lacks enough cases or a group to compare with.",
          "这个检验缺少足够的个案或对照组。",
        ),
        "too few cases": L(
          "样本太少",
          "The test looks at only a handful of cases, so its result may be just chance.\n\n**Check.** Count the subjects tested (one, two, three, four, or five): a handful of observations is far too tiny to rule out luck.",
          "这个检验只看了少数几个个案，所以结果可能只是偶然。\n\n**检验。** 数一下样本数量（只有一到五个）：寥寥几个个案远远不足以排除偶然性。",
          "The test studies plenty of cases.",
          "这个检验研究的个案足够多。",
        ),
        "no comparison": L(
          "没有对照",
          "The test studies many cases but has no group without the treatment, so we cannot tell whether the treatment made the difference.\n\n**Check.** Ask *what happened to the group that did not get the treatment?* The prompt explicitly notes no untreated or baseline group was checked.",
          "这个检验研究了许多个案，但没有不接受处理的对照组，所以无法判断是不是处理带来了差别。\n\n**检验。** 问一句“没接受处理的那一组结果怎样？”：题干明确指出没有观察对照组或基准组。",
          "The test does compare with a group that did not get the treatment, or it has too few cases to matter.",
          "这个检验确实与未处理组作了比较，或者个案太少，谈不上对照。",
        ),
      },
    ),
    label(
      "does-the-conclusion-follow",
      ["Does the Conclusion Follow", "结论是否成立"],
      [
        "Even good evidence can be stretched too far. A conclusion that **follows** stays within what was found: *Finches with deeper beaks survived the drought better.* A conclusion that **claims too much** goes beyond the evidence, to all animals, all times or certainty: *This proves evolution explains everything.* And a conclusion that **mistakes a link for a cause** treats two things that happen together as if one caused the other.\n\n> **Watch out.** Separate **claims too much** from **mistakes a link for a cause**: sweeping words (*every*, *all*, *never*, *any*) overshoot the sample, while turning *A and B appear together* into *A causes B* confuses correlation with causation.",
        "即使证据很好，也可能被引申得太远。**成立的结论**不超出发现的范围：*Finches with deeper beaks survived the drought better.* **说得太多的结论**超越了证据，扩展到所有动物、所有时代或断言绝对确定：*This proves evolution explains everything.* **把关联当作因果的结论**把同时发生的两件事当作一件导致另一件。\n\n> **注意。** 分清**说得太多**和**把关联当作因果**：用 *every*、*all*、*never* 无限外推是说得太多；把“甲乙同时出现”说成“甲导致乙”则是把关联当作因果。",
      ],
      ["Does the conclusion follow from the evidence?", "这个结论是否由证据推出？"],
      `
        Evidence: In a drought, finches with deeper beaks survived more often. Conclusion: Deeper beaks helped finches survive that drought.|follows
        Evidence: In a drought, finches with deeper beaks survived more often. Conclusion: Deeper beaks make every bird live longer in any weather.|claims too much
        Evidence: Islands with more finches also have more cactus. Conclusion: Finches make cactus grow.|mistakes a link for a cause
        Evidence: Dark moths were more common in sooty forests. Conclusion: In sooty forests, dark moths were more likely to survive.|follows
        Evidence: Dark moths were more common in sooty forests. Conclusion: Color decides the survival of every insect on earth.|claims too much
        Evidence: Towns with more factories had more dark moths and more doctors. Conclusion: Doctors cause moths to turn dark.|mistakes a link for a cause
        Evidence: Bacteria exposed to an antibiotic for months became resistant to it. Conclusion: Long exposure can lead bacteria to resist that antibiotic.|follows
        Evidence: Bacteria exposed to an antibiotic for months became resistant to it. Conclusion: No medicine will ever work again.|claims too much
        Evidence: Hospitals that use more antibiotics also have more patients. Conclusion: Antibiotics make people sick.|mistakes a link for a cause
        Evidence: Fossils of the same reptile were found in Africa and South America. Conclusion: The reptile once lived on both of those lands.|follows
        Evidence: Fossils of the same reptile were found in Africa and South America. Conclusion: Every animal once lived on every continent.|claims too much
        Evidence: Layers with more fossils are also thicker. Conclusion: Fossils make rock layers grow thick.|mistakes a link for a cause
        Evidence: Fish in a cave with no light had smaller eyes than their river cousins. Conclusion: Life in darkness was linked to smaller eyes in these fish.|follows
        Evidence: Fish in a cave with no light had smaller eyes than their river cousins. Conclusion: All animals will lose their eyes in time.|claims too much
        Evidence: Cave fish have pale skin and small eyes. Conclusion: Pale skin makes fish lose their eyes.|mistakes a link for a cause
        Evidence: Lizards moved to an island with strong winds grew shorter legs over a few generations. Conclusion: The windy island favored lizards with shorter legs.|follows
        Evidence: Lizards moved to an island with strong winds grew shorter legs over a few generations. Conclusion: Wind controls the shape of every living thing.|claims too much
        Evidence: Islands with more lizards have more tourists. Conclusion: Lizards attract tourists to islands.|mistakes a link for a cause
        Evidence: DNA shows that whales are closely related to hippos. Conclusion: Whales and hippos share a fairly recent common ancestor.|follows
        Evidence: DNA shows that whales are closely related to hippos. Conclusion: Hippos will soon return to the sea and become whales.|claims too much
        Evidence: Larger whales have longer lives and bigger hearts. Conclusion: Big hearts make whales grow larger.|mistakes a link for a cause
        Evidence: Peppered moth numbers changed as pollution rose and fell. Conclusion: Pollution levels affected which moths survived.|follows
        Evidence: Peppered moth numbers changed as pollution rose and fell. Conclusion: Pollution is good for nature.|claims too much
        Evidence: Children who own pet lizards score higher in science. Conclusion: Owning a lizard makes children better at science.|mistakes a link for a cause
        Evidence: Rabbits in snowy places have whiter fur than rabbits in deserts. Conclusion: Whiter fur is linked to snowy homes in rabbits.|follows
        Evidence: Rabbits in snowy places have whiter fur than rabbits in deserts. Conclusion: Snow turns all animals white.|claims too much
        Evidence: Years with more ice cream sales also have more shark sightings. Conclusion: Eating ice cream attracts sharks.|mistakes a link for a cause
        Evidence: A study of 10,000 birds found that those with longer wings migrated farther. Conclusion: In these birds, longer wings went with longer migrations.|follows
        Evidence: A study of 10,000 birds found that those with longer wings migrated farther. Conclusion: Any bird given longer wings would fly around the world.|claims too much
        Evidence: Parks with more birdwatchers have more rare birds. Conclusion: Birdwatchers create rare birds.|mistakes a link for a cause
      `,
      {
        follows: L(
          "成立",
          "The conclusion stays within what the evidence showed, about these animals in these conditions.\n\n**Check.** Compare the group and scope in the evidence with the conclusion: it keeps the exact species, setting, and cautious wording without inventing an unproven cause.",
          "这个结论没有超出证据所显示的范围，只涉及这些动物和这些条件。\n\n**检验。** 对照证据与结论的对象和范围：物种、条件和审慎措辞完全一致，既未越界外推，也未硬安因果。",
          "The conclusion goes beyond the evidence or treats a link as a cause.",
          "这个结论超出了证据，或把关联当作了因果。",
        ),
        "claims too much": L(
          "说得太多",
          "The conclusion stretches the finding to all living things, all times or the future, far beyond what was studied.\n\n**Check.** Spot the overreach (*every*, *all*, *no medicine will ever*, *any bird*, or an unsupported future leap): the evidence never tested that broad a claim.",
          "这个结论把发现扩展到所有生物、所有时代或未来，远远超出了研究的范围。\n\n**检验。** 找出越界词（如 *every*、*all*、*never*、*any* 或缺乏依据的未来断言）：证据从未检验过这么宽泛的范围。",
          "The conclusion does not stretch the finding beyond what was studied.",
          "这个结论没有把发现扩展到研究范围之外。",
        ),
        "mistakes a link for a cause": L(
          "把关联当作因果",
          "Two things happen together, but the conclusion assumes one causes the other, when something else may explain both.\n\n**Check.** Look at the evidence: it only notes that two traits or counts appear together, yet the conclusion jumps to *makes*, *causes*, *attracts*, or *creates*.",
          "两件事同时出现，结论却认定一件导致另一件，而实际上可能是别的因素同时导致了两者。\n\n**检验。** 看证据本身：它只记录了两件事同时出现，结论却武断跳到了“导致”“制造”或“吸引”的因果关系。",
          "The conclusion does not treat two linked things as cause and effect.",
          "这个结论没有把两件相关的事当作因果。",
        ),
      },
    ),
  ],
});

const irrelevant = topic("reading", {
  id: "irrelevant-evidence",
  title: ["Irrelevant Evidence", "无关的证据"],
  summary: [
    "Irrelevant evidence can sound convincing while having nothing to do with the claim: it may answer another question, attack a person or appeal to the crowd.",
    "无关的证据听起来可能有说服力，却与论点毫无关系：它可能回答了另一个问题、攻击了某个人，或者诉诸大众。",
  ],
  intro: [
    "Saying *The bridge must be safe because ten thousand people cheered at its ribbon-cutting* sounds impressive until you notice that cheering cannot test steel cables. Spotting **irrelevant evidence** means catching facts that wander off the question, attack a person, or appeal to the crowd.",
    "说“这座桥肯定安全，因为通车典礼上有一万人欢呼”听起来很有气势，但欢呼声检验不了钢缆的承重。识别**无关的证据**就是要识破偏题的事实、人身攻击和诉诸大众。",
  ],
  after: ["relevant-and-sufficient-evidence"],
  points: [
    label(
      "relevant-or-not",
      ["Relevant or Not", "相关还是无关"],
      [
        "Evidence is **relevant** when, if true, it makes the claim more likely. Irrelevant evidence comes in disguises. Some is **off the question**: it is true, but about something else. Some **attacks the person** who holds a view instead of the view itself. Some **appeals to the crowd**, saying many people believe a thing, as if that made it true.\n\n> **Watch out.** Do not mark a true trivia fact as **relevant** just because it mentions Darwin or the Galapagos—ask whether it actually tests the theory of natural selection itself.",
        "证据如果属实能让论点更可能成立，就是**相关的**。无关的证据常常有伪装。有的**离开了问题**：它是真的，但说的是别的事。有的**攻击人身**，针对持观点的人而不是观点本身。有的**诉诸大众**，说很多人相信某事，好像这就能证明它是真的。\n\n> **注意。** 不要因为某个花絮提到了达尔文或加拉帕戈斯就判为**相关**——问问它到底能不能检验自然选择理论本身。",
      ],
      [
        "Claim: The theory of evolution by natural selection is well supported. Is this evidence relevant?",
        "论点：自然选择进化论有充分的依据。这条证据相关吗？",
      ],
      `
        Fossils show a series of whale ancestors with legs that shrank over millions of years.|relevant
        Darwin was a shy man who suffered from stomach illness all his life.|off the question
        Most people in my town believe in evolution, so it must be true.|appeals to the crowd
        Finches on the Galapagos changed beak size within decades when droughts struck.|relevant
        Darwin's ship, the Beagle, was ninety feet long.|off the question
        One critic of evolution was once caught cheating at cards.|attacks the person
        DNA shows that humans and chimpanzees share most of their genes.|relevant
        Everyone knows evolution is true; just ask anybody.|appeals to the crowd
        A famous opponent of Darwin was known to be rude and vain.|attacks the person
        Bacteria evolve resistance to antibiotics in a few years, as recorded in hospitals.|relevant
        Darwin had ten children.|off the question
        Thousands of students learn evolution every year, so it cannot be wrong.|appeals to the crowd
        Fossils in older rock layers are simpler than those in younger layers.|relevant
        The people who doubt evolution are simply uneducated.|attacks the person
        Darwin's book sold out on its first day.|appeals to the crowd
        Similar bones appear in the arm of a human, the wing of a bat and the flipper of a whale.|relevant
        Darwin enjoyed playing backgammon with his wife.|off the question
        The scientist who first doubted the finch study had failed many exams.|attacks the person
        Breeders have changed dogs and pigeons greatly by choosing which ones mate.|relevant
        The Galapagos Islands are a popular place for holidays.|off the question
        Most scientists I follow online agree with Darwin, so that settles it.|appeals to the crowd
        Island species often look like close cousins of species on the nearest mainland.|relevant
        Wallace, who had the same idea, was poor and had little schooling.|attacks the person
        Darwin's theory was named the best idea of all time in a popular poll.|appeals to the crowd
        Peppered moths in England grew darker as soot covered the trees.|relevant
        Darwin was born on the same day as Abraham Lincoln.|off the question
        Opponents of evolution are just jealous of Darwin's fame.|attacks the person
        Scientists predicted fossils of fish with legs and then found them in rocks of the right age.|relevant
        A statue of Darwin stands in the Natural History Museum in London.|off the question
        One famous critic of Darwin had a reputation for hating new ideas.|attacks the person
      `,
      {
        relevant: L(
          "相关",
          "If true, this evidence makes the claim more likely: it shows evolution at work or a pattern that evolution explains.\n\n**Check.** Ask *does this biological observation directly test natural selection or common descent?* Yes—unlike biography, insults, or popularity polls.",
          "如果属实，这条证据会让论点更可能成立：它显示了进化在起作用，或显示了进化能解释的规律。\n\n**检验。** 问一句“这条生物学观察是否直接检验了自然选择或共同祖先？”：是的，它不同于生平花絮、人身攻击或民意投票。",
          "This evidence, even if true, does not make the claim more likely.",
          "即使属实，这条证据也不会让论点更可能成立。",
        ),
        "off the question": L(
          "离开了问题",
          "The fact may be true, but it is about something else, such as Darwin's life, and says nothing about whether the theory is right.\n\n**Check.** Notice that it neither insults anyone nor counts voters—it simply offers unrelated background trivia about a person, ship, or place.",
          "这个事实也许是真的，但说的是别的事，比如达尔文的生活，与理论是否正确毫无关系。\n\n**检验。** 它既没有攻击人身，也没有拿人多说事——只是提了一句与科学理论真伪无关的背景花絮。",
          "This evidence is not simply a fact about something unrelated.",
          "这条证据并不只是与此无关的事实。",
        ),
        "attacks the person": L(
          "攻击人身",
          "The evidence is about the character of someone on one side, not about the idea; a rude person can still be right or wrong.\n\n**Check.** Spot the personal flaw aimed at a critic or thinker (*cheating*, *rude*, *uneducated*, *jealous*, *failed exams*): it judges the person instead of the scientific evidence.",
          "这条证据说的是某一方某个人的品行，而不是观点本身；一个粗鲁的人也可能是对的或错的。\n\n**检验。** 找出针对某个人品行或私德的指责：它在评价人，而不是检验科学证据。",
          "This evidence does not target a person's character.",
          "这条证据并没有针对某个人的品行。",
        ),
        "appeals to the crowd": L(
          "诉诸大众",
          "The evidence says that many people believe or like the idea, but popularity does not make an idea true.\n\n**Check.** Spot the popularity cue (*most people*, *everyone knows*, *thousands*, *sold out*, *poll*): counting heads cannot prove a scientific claim.",
          "这条证据说很多人相信或喜欢这个观点，但受欢迎并不能证明观点正确。\n\n**检验。** 识别“人多势众”的信号词（如 *most people*、*everyone*、*sold out*、*poll*）：人多或畅销并不能证明科学命题。",
          "This evidence does not rest on how many people believe something.",
          "这条证据并不依赖于有多少人相信某事。",
        ),
      },
    ),
    label(
      "what-is-wrong-with-it",
      ["What Is Wrong With It", "问题出在哪里"],
      [
        "Once you suspect evidence is irrelevant, name the problem. Is it **off the question**, a true fact about something else? Does it **attack the person**, judging the speaker instead of the idea? Or does it **appeal to the crowd**, treating popularity, fame or tradition as proof? Naming the trick helps you answer it.\n\n> **Watch out.** Check what the second sentence actually points to: a random side detail (*car*, *paint color*, *label*) → **off the question**; an insult at critics → **attacks the person**; numbers of fans, celebrities, or *always* → **appeals to the crowd**.",
        "一旦怀疑证据无关，就要说出问题所在。它是**离开了问题**，是关于别的事情的真实事实吗？它是**攻击人身**，评判说话的人而不是观点吗？还是**诉诸大众**，把流行、名气或传统当作证据？说出这个伎俩，有助于你回应它。\n\n> **注意。** 看第二句到底在说什么：无关琐事（车、漆色、标签）→ **离开了问题**；贬低反对者品行 → **攻击人身**；拿众人、名人或“向来如此”当证据 → **诉诸大众**。",
      ],
      ["The claim is in the first sentence. What is wrong with the evidence that follows?", "第一句是论点。后面的证据有什么问题？"],
      `
        Our school should start later. After all, the principal's car is very old.|off the question
        Our school should start later. The people who disagree are just grumpy morning people.|attacks the person
        Our school should start later. Nearly everyone in my class wants it.|appeals to the crowd
        The new bridge is safe. It is painted a lovely shade of green.|off the question
        The new bridge is safe. The engineer who doubts it has been wrong before about his own taxes.|attacks the person
        The new bridge is safe. Thousands of people cheered at its opening.|appeals to the crowd
        This medicine works. It comes in a bottle with a beautiful label.|off the question
        This medicine works. The doctor who questioned it is a known show-off.|attacks the person
        This medicine works. It is the best-selling medicine in the country.|appeals to the crowd
        The museum should stay open late. The museum was built in 1880.|off the question
        The museum should stay open late. Those who object are boring people who never go out.|attacks the person
        The museum should stay open late. A famous singer said she would like that.|appeals to the crowd
        Wind farms are good for the town. Wind is mentioned in many old songs.|off the question
        Wind farms are good for the town. Anyone against them is a selfish landowner.|attacks the person
        Wind farms are good for the town. Every modern town is building them.|appeals to the crowd
        The election result was fair. The polling stations had comfortable chairs.|off the question
        The election result was fair. The losing candidate is a sore loser with bad manners.|attacks the person
        The election result was fair. Most people on social media say so.|appeals to the crowd
        Homework helps students learn. Homework is often done at the kitchen table.|off the question
        Homework helps students learn. Students who complain about homework are lazy.|attacks the person
        Homework helps students learn. Schools have always given homework.|appeals to the crowd
        The fossil is a fake. The museum that owns it has an ugly gift shop.|off the question
        The fossil is a fake. The man who found it was once fired from his job.|attacks the person
        The fossil is a fake. A poll showed most visitors think it looks fake.|appeals to the crowd
        The diet is healthy. The cookbook has lovely photographs.|off the question
        The diet is healthy. Its critics are overweight themselves.|attacks the person
        The diet is healthy. A million people have already tried it.|appeals to the crowd
        The law will reduce crime. The law was written on a rainy Tuesday.|off the question
        The law will reduce crime. Its opponents are friends with criminals.|attacks the person
        The law will reduce crime. It is the most popular law in years.|appeals to the crowd
      `,
      {
        "off the question": L(
          "离开了问题",
          "The evidence is about something that has nothing to do with whether the claim is true.\n\n**Check.** Compare the topic of sentence 2 with sentence 1: even if sentence 2 is 100% true, it gives zero reason to believe sentence 1.",
          "这条证据说的是与论点是否成立毫无关系的事情。\n\n**检验。** 对照前后两句的话题：就算第二句完全属实，也与第一句成不成立毫无关系。",
          "The evidence does more than mention an unrelated fact.",
          "这条证据不只是提到一个无关的事实。",
        ),
        "attacks the person": L(
          "攻击人身",
          "The evidence insults or judges the people on the other side instead of answering their reasons.\n\n**Check.** Notice that the second sentence targets the *critics'* habits, motives, or manners instead of addressing the claim itself.",
          "这条证据侮辱或评判对方的人，而不是回应他们的理由。\n\n**检验。** 注意第二句把矛头对准了*反对者*的品行或动机，完全没有回答论点本身。",
          "The evidence does not judge a person's character.",
          "这条证据没有评判某个人的品行。",
        ),
        "appeals to the crowd": L(
          "诉诸大众",
          "The evidence treats popularity, fame or long custom as proof, but many people can be wrong together.\n\n**Check.** Spot the crowd or fame appeal (*nearly everyone*, *thousands*, *best-selling*, *famous singer*, *always*, *poll*, *million*): popularity is not proof.",
          "这条证据把流行、名气或长期的习惯当作证据，但很多人可能一起犯错。\n\n**检验。** 识别诉诸人多、名气或旧习的信号（如 *everyone*、*thousands*、*best-selling*、*always*、*poll*）：流行不等于正确。",
          "The evidence does not rely on what many people think or do.",
          "这条证据并不依赖于多数人的想法或做法。",
        ),
      },
    ),
  ],
});

const unreliable = topic("reading", {
  id: "unreliable-narrators",
  title: ["Unreliable Narrators", "不可靠的叙述者"],
  summary: [
    "Some narrators cannot be fully trusted, because they do not understand, have something to hide or are not in their right mind; clues in the story reveal the truth.",
    "有些叙述者不能完全信任，因为他们不明白、有所隐瞒或神志不清；故事中的线索会揭示真相。",
  ],
  intro: [
    "When a first-person narrator insists, *'I am completely calm, calmer than anyone, and I certainly did not touch that envelope,'* the very way they speak tips us off. Reading an **unreliable narrator** means spotting why they distort the truth and reading the clues underneath their words.",
    "当第一人称叙述者一再强调“我非常冷静，比任何人都冷静，我绝对没碰过那个信封”时，他的说话方式本身就露了马脚。读懂**不可靠的叙述者**，就是要识破他为何扭曲真相，并从字里行间的线索还原事实。",
  ],
  after: ["contrasting-points-of-view"],
  points: [
    label(
      "why-not-trust-the-narrator",
      ["Why Not Trust the Narrator", "为什么不能信任叙述者"],
      [
        "A first-person narrator tells us only what they see and believe. Some are **too innocent to understand**: a small child may describe a quarrel without grasping what it means. Some **have something to hide**: a narrator who did wrong may bend the story to look good. And some are **not in their right mind**: fear, illness or madness twists what they report, as in the tales of Edgar Allan Poe.\n\n> **Watch out.** Look at *what* goes wrong in the narrator's account: a childlike misreading of an adult scene → **too innocent**; slippery excuses for a misdeed → **has something to hide**; impossible sights or sounds (whispering walls, moving portraits, unheard bells) → **not in their right mind**.",
        "第一人称叙述者只告诉我们他们看到和相信的东西。有些叙述者**太天真，不明白真相**：小孩可能描述了一场争吵，却不懂它意味着什么。有些**有所隐瞒**：做了错事的叙述者可能歪曲故事，让自己显得好些。还有些**神志不清**：恐惧、疾病或疯狂扭曲了他们的讲述，就像埃德加·爱伦·坡的故事那样。\n\n> **注意。** 看叙述究竟错在哪里：孩子般误解大人处境 → **太天真**；为自己的错事找借口 → **有所隐瞒**；看到或听到不合常理的幻觉（会说话的墙、会动的肖像、别人听不见的钟声）→ **神志不清**。",
      ],
      ["Why might this narrator not be reliable?", "这个叙述者为什么可能不可靠？"],
      `
        "Mommy and the man in the uniform talked quietly, and then Mommy cried, so I think he must have stepped on her toe."|too innocent to understand
        "I only borrowed the money, and I would have returned it, so you see the others were quite unfair to call me a thief."|has something to hide
        "The old man's eye watched me every night, even through the wall, and I could hear his heart beating louder and louder."|not in their right mind
        "Grandpa put the dog in the car and said they were going to a farm where it could run, so it must be very happy now."|too innocent to understand
        "Of course I played no part in the fire; I merely happened to be standing near the barn with a match."|has something to hide
        "The portraits whisper my name when I pass, and the walls lean closer each night to listen."|not in their right mind
        "The big boys took my lunch every day, but they said it was a game, so I guess it was fun."|too innocent to understand
        "My brother fell down the stairs, and if anyone says I pushed him, they are simply jealous of me."|has something to hide
        "I have not slept for nine days, and the shadows in the corner have begun to move and speak."|not in their right mind
        "Papa said the men with papers were friends, even though they took our piano away."|too innocent to understand
        "The letter was lost in the post; I certainly did not burn it after reading it."|has something to hide
        "The bells ring all night in my head, though the others swear the church has no bell."|not in their right mind
        "Aunt Rose is staying in the hospital for a long rest, so she will come home soon and bake again."|too innocent to understand
        "I did tell the captain about the leak, more or less, in a way, if he had listened."|has something to hide
        "Ever since the fever, I see my dead sister in every mirror, smiling at me."|not in their right mind
        "The lady at the door gave me candy and said not to tell anyone she asked where we keep the keys."|too innocent to understand
        "I was the only honest man in that whole firm, which is why they turned against me."|has something to hide
        "I know the house wants me to stay; I can feel it closing its doors behind me."|not in their right mind
        "My parents have separate rooms now because Daddy snores, Mommy says, and they never laugh at dinner."|too innocent to understand
        "The jewels? I found them in the street, I swear, the same night the duchess lost hers."|has something to hide
        "The crows on the fence are counting my sins; every morning there is one more."|not in their right mind
        "My sister is going away to a school for a while, and everyone is very quiet about it, so it must be a special school."|too innocent to understand
        "Naturally, I gave my partner his fair share, or nearly; he was always bad at counting."|has something to hide
        "Something knocks under the floor every night at midnight, and only I can hear it."|not in their right mind
        "The soldiers were very polite and only wanted to see Papa's papers before they took him for a ride."|too innocent to understand
        "I never once lied to my wife, except when it was for her own good, which was often."|has something to hide
        "The painting's eyes followed me again today, and its smile was wider than yesterday."|not in their right mind
        "Mama sold her ring to buy my new shoes, but she says she didn't like it much anyway."|too innocent to understand
        "I left my post only for a moment, and the prisoner must have escaped on his own."|has something to hide
        "Since I came to this castle, I hear music from the empty ballroom every night."|not in their right mind
      `,
      {
        "too innocent to understand": L(
          "太天真，不明白",
          "The narrator, often a child, reports what happened honestly but misses what it means; the reader understands more.\n\n**Check.** Notice the narrator isn't lying or hallucinating—they report real details faithfully, yet draw a naive, cheerful conclusion that an older reader sees through.",
          "叙述者（常常是孩子）如实讲述发生的事，却没明白它的意思；读者懂得更多。\n\n**检验。** 叙述者既没有撒谎也没有产生幻觉——他老实记下了细节，却得出了天真乐观的误判，读者一眼就能看穿。",
          "This narrator is not an innocent who simply misunderstands.",
          "这个叙述者并不是一个只是误解了的天真者。",
        ),
        "has something to hide": L(
          "有所隐瞒",
          "The narrator has done wrong and bends the story to look innocent, and the excuses give the truth away.\n\n**Check.** Spot the defensive dodge (*only borrowed*, *merely happened*, *certainly did not*, *more or less*, *except when*): the narrator is covering up guilt.",
          "叙述者做了错事，歪曲故事以显得无辜，而那些借口恰恰泄露了真相。\n\n**检验。** 找出自我开脱的托词（如 *only borrowed*、*merely happened*、*certainly did not*）：叙述者正极力掩盖过错。",
          "This narrator is not defending their own wrongdoing.",
          "这个叙述者并没有为自己的过错辩解。",
        ),
        "not in their right mind": L(
          "神志不清",
          "Fear, illness or madness makes the narrator see or hear things that are probably not there.\n\n**Check.** Notice the impossible perception (hearing a heartbeat through a wall, portraits whispering, shadows speaking, bells no one else hears): illness, panic, or madness is distorting reality.",
          "恐惧、疾病或疯狂让叙述者看到或听到可能并不存在的东西。\n\n**检验。** 注意不合常理的感知（隔墙听见心跳、肖像低语、只有自己听见的敲击声）：疾病、恐慌或疯狂正在扭曲他的感知。",
          "This narrator's mind is not disturbed in this way.",
          "这个叙述者的神志并没有这样被扰乱。",
        ),
      },
    ),
    label(
      "the-clue-to-the-truth",
      ["The Clue to the Truth", "揭示真相的线索"],
      [
        "Readers catch an unreliable narrator through clues the writer plants. The narrator may **contradict themselves**, saying one thing and later another. **Others react differently**: other characters look frightened, laugh or say the opposite, which shows the narrator is wrong. Or the narrator **protests too much**, insisting again and again that they are calm, sane or innocent, which makes us doubt them.\n\n> **Watch out.** Check who reveals the crack in the story: two clashing statements by the narrator → **contradicts themself**; listeners' faces, laughter, or actions → **others react differently**; frantic repetition of one denial → **protests too much**.",
        "读者通过作者埋下的线索识破不可靠的叙述者。叙述者可能**自相矛盾**，前面说一件事，后面又说另一件。**其他人的反应不同**：别的人物显得害怕、发笑或说出相反的话，表明叙述者错了。或者叙述者**极力辩白**，一再坚称自己很冷静、神志正常或清白，这反而让我们怀疑。\n\n> **注意。** 看破绽是怎么露出来的：前后两句自己打脸 → **自相矛盾**；旁人的神色或举动拆台 → **其他人的反应不同**；反复赌咒发誓否认同一件事 → **极力辩白**。",
      ],
      ["What clue shows that the narrator may not be reliable?", "什么线索表明叙述者可能不可靠？"],
      `
        "I was home all evening," the narrator says, and two pages later, "When I came back from the river that night..."|contradicts themself
        "I gave a splendid speech," the narrator says, "though the audience stared at their shoes and left early."|others react differently
        "I am perfectly calm. I am calm. Why will no one believe how calm I am?"|protests too much
        "I never touched the boat," he says, and later, "I tied it tighter after I took it out."|contradicts themself
        "My cooking is the best in town," she says, as the guests quietly push their plates away.|others react differently
        "I am not mad. Would a madman plan so carefully? Would a madman be so wise?"|protests too much
        "I had never met the man," she says, and later mentions "the scarf he gave me last spring."|contradicts themself
        "Everyone adores my singing," he says, as his neighbors shut their windows one by one.|others react differently
        "I did not hate my brother. Truly, I never hated him. I want that understood."|protests too much
        "The house was silent all night," he says, then, "I could not sleep for the banging upstairs."|contradicts themself
        "The ghost was right there," she says, but the maid beside her sees only an empty chair.|others react differently
        "I am innocent, entirely innocent, as innocent as any man alive. Note how innocent I am."|protests too much
        "I was never in the library," she claims, then describes "the dusty smell of the library that night."|contradicts themself
        "The captain respected me," he says, though the crew laughs whenever his name is mentioned.|others react differently
        "Nothing frightens me. I am never afraid. Fear is unknown to me."|protests too much
        "I barely knew her," he says, and later recalls "our walks every Sunday for ten years."|contradicts themself
        "My painting is a masterpiece," she says, as the judges hurry past it without stopping.|others react differently
        "I am honest. I have always been honest. No one could be more honest than I."|protests too much
        "I left before the fire started," he says, and later, "the smoke stung my eyes as I ran."|contradicts themself
        "The village loves me," she says, but the children run and hide when she walks by.|others react differently
        "I am quite well. I have never been better. My health is perfect, perfect."|protests too much
        "I locked the door," he says, and then, "I came back and found it just as I had left it, open."|contradicts themself
        "My plan was brilliant," he says, as his partners shake their heads and pack their bags.|others react differently
        "I feel no guilt. None at all. Guilt has nothing to do with me."|protests too much
        "I never wrote to him," she says, and later, "he never answered my letters."|contradicts themself
        "The doctor agreed I am cured," he says, as the doctor quietly locks the door behind him.|others react differently
        "I loved my uncle dearly. Dearly. I must repeat how dearly I loved him."|protests too much
        "I saw nothing that night," she says, then describes "the man in the gray coat by the gate."|contradicts themself
        "My friends are glad to see me," he says, as they make excuses and leave the room.|others react differently
        "I am not jealous of my sister's success. I am glad. I am so very, very glad."|protests too much
      `,
      {
        "contradicts themself": L(
          "自相矛盾",
          "The narrator says one thing and later lets slip the opposite, so at least one of the two statements is false.\n\n**Check.** Put the narrator's first quote beside the second quote: both cannot be true at once.",
          "叙述者先说一件事，后来又无意中说出相反的话，所以至少有一句是假的。\n\n**检验。** 把叙述者前后两句原话并排对照：两句话互相抵触，不可能同时为真。",
          "The narrator does not say two things that clash.",
          "叙述者并没有说出两句相互冲突的话。",
        ),
        "others react differently": L(
          "其他人的反应不同",
          "Other people's actions show the opposite of what the narrator claims, so we trust what we see over what we are told.\n\n**Check.** Contrast the narrator's boast with what the other characters physically do (leaving early, shutting windows, pushing plates away, shaking heads).",
          "其他人的行为表明情况与叙述者所说的相反，所以我们相信看到的，而不是被告知的。\n\n**检验。** 把叙述者的自夸与旁人的实际反应（提前离场、关窗、推开盘子、摇头）对照，真相立刻暴露。",
          "No other character's reaction is set against the narrator's words here.",
          "这里没有用其他人物的反应来对照叙述者的话。",
        ),
        "protests too much": L(
          "极力辩白",
          "The narrator repeats a denial over and over, and the very insistence makes us suspect the opposite.\n\n**Check.** Notice the repeated words in a single speech (*calm ... calm*, *innocent ... innocent*, *honest ... honest*, *dearly ... dearly*): over-insisting raises doubt.",
          "叙述者一再重复否认，正是这种坚持让我们怀疑事实恰恰相反。\n\n**检验。** 注意话里反复出现的同一个词（如接连强调“冷静”“清白”“诚实”）：此地无银式的重复反而让人起疑。",
          "The narrator does not keep repeating a denial.",
          "叙述者并没有一再重复否认。",
        ),
      },
    ),
  ],
});

const gothic = topic("reading", {
  id: "recognizing-gothic-elements",
  title: ["Recognizing Gothic Elements", "识别哥特元素"],
  summary: [
    "Gothic tales build dread with gloomy settings, hints of the supernatural and buried secrets, using sensory detail, omens and delay.",
    "哥特故事用阴森的环境、超自然的暗示和隐藏的秘密营造恐惧，手法包括感官细节、预兆和延宕。",
  ],
  intro: [
    "A ruined abbey lashed by rain, a cold hand touching a shoulder in an empty chapel, and a locked wing nobody will discuss — Gothic fiction pairs three signature ingredients with sensory detail, omens, and slow delay to keep readers on edge.",
    "风雨拍打的废弃修道院、空教堂里搭上肩膀的冰冷手掌、无人敢提的上锁西翼——哥特小说正是把这三种标志性元素与感官细节、预兆和刻意延宕结合起来，让读者步步心惊。",
  ],
  after: ["tone-and-mood", "how-setting-shapes-a-story"],
  points: [
    label(
      "the-gothic-element",
      ["The Gothic Element", "哥特元素"],
      [
        "Gothic fiction, from the 1700s to Poe and beyond, is built from a few familiar elements. A **gloomy setting**: a crumbling castle, a crypt, a storm on a moor. **The supernatural**, or the hint of it: ghosts, curses, a portrait that seems to move. And **a dark secret** from the past: a hidden crime, a locked room, a family's buried shame that slowly comes to light.\n\n> **Watch out.** Separate **a gloomy setting** from **a dark secret**: cracked stone, fog, and storms describe the *place*; a locked wing, burned diary, or scratched-out name hints at a *hidden human past*.",
        "哥特小说从十八世纪到坡乃至以后，由几种熟悉的元素构成。**阴森的环境**：摇摇欲坠的城堡、墓穴、荒原上的暴风雨。**超自然**或对它的暗示：鬼魂、诅咒、仿佛会动的肖像。还有来自过去的**黑暗秘密**：隐藏的罪行、锁着的房间、慢慢暴露出来的家族耻辱。\n\n> **注意。** 分清**阴森的环境**和**黑暗秘密**：破败建筑、大雾和雷雨描写的是*环境本身*；上锁的房间、烧毁的日记或被划掉的名字指向的则是*被掩盖的往事*。",
      ],
      ["Which Gothic element does this detail mainly show?", "这个细节主要体现了哪种哥特元素？"],
      `
        The abbey's walls were cracked, its windows broken, and ivy choked the ruined tower.|a gloomy setting
        At midnight, the portrait's eyes turned slowly to follow the girl across the room.|the supernatural
        The housekeeper would not say why the west wing had been locked for twenty years.|a dark secret
        Fog rolled over the moor, and the only light was a candle in the old house's highest window.|a gloomy setting
        A cold hand touched his shoulder, though he was alone in the chapel.|the supernatural
        In the attic she found letters proving her father had not died at sea as everyone claimed.|a dark secret
        The crypt beneath the castle was damp, and water dripped from the low stone ceiling.|a gloomy setting
        Every night, a woman in white walked the gallery and vanished at the end of the hall.|the supernatural
        The family never spoke of the first wife, and her name had been scratched from the Bible.|a dark secret
        Thunder shook the castle, and the wind howled through the empty halls.|a gloomy setting
        The suit of armor moved its head as if to listen.|the supernatural
        Under the floorboards lay a key to a room that did not appear on any plan of the house.|a dark secret
        The mansion stood alone in a swamp, its roof sagging, its gates rusted shut.|a gloomy setting
        A voice called her name from the well, though the well had been dry for a century.|the supernatural
        The old servant burned a diary in the fireplace the moment the young heir arrived.|a dark secret
        Bats circled the ruined chapel, and gravestones leaned in the overgrown yard.|a gloomy setting
        The curse said that every eldest son would die before his thirtieth birthday.|the supernatural
        The doctor kept a locked cabinet, and his patients sometimes vanished without a trace.|a dark secret
        The dungeon was so dark that he could not see his own hand before his face.|a gloomy setting
        The candles went out all at once, and a figure appeared at the foot of the bed.|the supernatural
        No one in the village would say what had happened to the miller's daughter.|a dark secret
        Rain lashed the windows of the lonely inn, and the sign creaked in the wind.|a gloomy setting
        The mirror showed a face that was not her own.|the supernatural
        A portrait had been turned to face the wall, and no one would say whose face it showed.|a dark secret
        The castle's corridors twisted endlessly, and every door opened on another dim passage.|a gloomy setting
        Each night, the piano in the locked parlor played the same sad tune.|the supernatural
        The will had been changed on the night the old lord died, in a hand nobody recognized.|a dark secret
        Dead trees surrounded the pool, which reflected the house like a black mirror.|a gloomy setting
        The dog would not enter the nursery and howled whenever it passed the door.|the supernatural
        Behind a false panel was a staircase that led down to a room with chains on the wall.|a dark secret
      `,
      {
        "a gloomy setting": L(
          "阴森的环境",
          "The detail paints a dark, decaying or stormy place that fills the story with gloom.\n\n**Check.** Notice that nothing supernatural happens and no hidden crime is mentioned—the dread comes purely from the decaying, dark, or storm-beaten place.",
          "这个细节描绘了黑暗、破败或风雨交加的地方，让故事充满阴郁。\n\n**检验。** 这里没有超自然异象，也没提到隐秘罪行——压抑感完全来自破败、阴暗或风雨交加的场景本身。",
          "The detail is not mainly a description of a gloomy place.",
          "这个细节主要不是对阴森环境的描写。",
        ),
        "the supernatural": L(
          "超自然",
          "The detail hints at something beyond nature, such as a ghost, a curse or an object that moves by itself.\n\n**Check.** Ask *could this happen by ordinary physical laws?* A moving portrait, phantom voice, or curse points straight to the supernatural.",
          "这个细节暗示了超自然的东西，如鬼魂、诅咒或自己会动的物体。\n\n**检验。** 问一句“这符合日常物理常理吗？”：会转眼的肖像、空井里的呼唤或家族诅咒都直接指向超自然。",
          "Nothing beyond nature is suggested by this detail.",
          "这个细节没有暗示任何超自然的东西。",
        ),
        "a dark secret": L(
          "黑暗秘密",
          "The detail points to something hidden from the past, such as a crime or a shame that people refuse to speak of.\n\n**Check.** Spot the clue of deliberate concealment (locked wing, hidden key, burned diary, altered will, silence about someone): people are hiding a past truth.",
          "这个细节指向过去被隐藏的事情，如人们不愿提起的罪行或耻辱。\n\n**检验。** 找出刻意隐瞒的线索（上锁的房间、藏匿的钥匙、焚毁的日记、讳莫如深的沉默）：有人在掩盖过去的真相。",
          "The detail does not point to a hidden past.",
          "这个细节没有指向被隐藏的过去。",
        ),
      },
    ),
    label(
      "how-the-writer-builds-dread",
      ["How the Writer Builds Dread", "作者如何营造恐惧"],
      [
        "Gothic writers do not just name frightening things; they make us feel them. **Sensory detail** puts us in the scene through sound, smell and touch: *the stink of wet stone*. An **omen** is a sign that something bad will come: a raven on the gate, a cracked mirror. And **delay** holds back the reveal, making us wait: the hand on the doorknob, the slow creak, the pause before the door swings open.\n\n> **Watch out.** Check the mechanism of dread: physical sound/smell/touch/taste → **sensory detail**; a warning sign or eerie coincidence → **an omen**; stretching out time with pauses, counting, or inch-by-inch movement → **delay**.",
        "哥特作家不只是说出可怕的东西，而是让我们感受到它们。**感官细节**通过声音、气味和触觉把我们带入场景：*the stink of wet stone*。**预兆**是坏事将至的征兆：大门上的乌鸦、裂开的镜子。**延宕**推迟揭示真相，让我们等待：门把上的手、缓慢的吱嘎声、门打开之前的停顿。\n\n> **注意。** 看恐惧是怎么制造出来的：声音、气味、触觉或味觉描写 → **感官细节**；不祥征兆或诡异巧合 → **预兆**；用停顿、数步或一寸寸放慢动作来吊胃口 → **延宕**。",
      ],
      ["How does this sentence mainly build dread?", "这个句子主要如何营造恐惧？"],
      `
        The air in the cellar was thick with the smell of rot, and the stones were slimy under her fingers.|sensory detail
        As they reached the gate, a raven landed on the post and would not fly away.|an omen
        He reached for the handle, stopped, listened, and reached again, but still did not open the door.|delay
        The floorboards groaned, and somewhere above, something dragged slowly across the room.|sensory detail
        On the morning of the wedding, the bride's mirror cracked from corner to corner.|an omen
        She climbed the stairs one step at a time, counting each, while the sound above went silent.|delay
        The blanket was cold and damp, as if someone had just risen from beneath it.|sensory detail
        The clock in the hall, which had not worked in years, struck thirteen.|an omen
        The lantern flickered, steadied, and flickered again as he lifted the lid of the chest inch by inch.|delay
        A sour, metallic taste filled her mouth as she entered the crypt.|sensory detail
        A black dog followed the coach all the way to the castle and then vanished.|an omen
        For an hour he sat waiting for the knock that the letter had promised.|delay
        The wind moaned through the keyhole like someone weeping.|sensory detail
        The old woman at the inn crossed herself when she heard where they were going.|an omen
        The curtain moved; she watched it; it moved again; and still she did not pull it aside.|delay
        His fingers brushed something soft and cold in the dark, something like hair.|sensory detail
        All the birds in the garden fell silent at once.|an omen
        He turned the key slowly, and the lock gave one click, then another, then a third.|delay
        The candle smoke smelled of burning feathers, and the walls sweated with damp.|sensory detail
        The roses on the grave had turned black overnight.|an omen
        The footsteps stopped outside her door, and she waited a long minute for the next sound.|delay
        Somewhere in the walls, water dripped with a slow, steady tap, tap, tap.|sensory detail
        A moth flew into the flame and died just as the stranger stepped inside.|an omen
        She unfolded the letter one fold at a time, dreading the final crease.|delay
        The stone stairs were worn smooth and icy under his bare feet.|sensory detail
        The church bell rang once, though no one had pulled the rope.|an omen
        He lowered the lamp into the pit, slowly, slowly, until its light touched the bottom.|delay
        The stench of the swamp crept into the room and clung to their clothes.|sensory detail
        On the night of his birth, the old oak in the courtyard split in two.|an omen
        The coffin lid rose a finger's breadth, paused, and rose again.|delay
      `,
      {
        "sensory detail": L(
          "感官细节",
          "The sentence makes us hear, smell, touch or taste the scene, so the fear feels close and real.\n\n**Check.** Name the exact sense triggered (smell of rot, slimy stone, moaning wind, icy floor, metallic taste): physical sensation carries the dread.",
          "这个句子让我们听到、闻到、摸到或尝到场景，所以恐惧显得真切而逼近。\n\n**检验。** 指认句中调动的感官（腐臭气味、湿滑石块、呜咽风声、刺骨寒意）：具体感官体验直接制造了恐惧。",
          "The sentence does not mainly work through the senses.",
          "这个句子主要不是通过感官起作用的。",
        ),
        "an omen": L(
          "预兆",
          "The sentence shows a sign, often from nature, that warns something bad is coming.\n\n**Check.** Notice the eerie sign (raven, cracked mirror, clock striking thirteen, black roses, sudden silence): it foretells disaster rather than describing a texture or stalling a reveal.",
          "这个句子显示了一个征兆（常常来自自然），预示坏事即将到来。\n\n**检验。** 注意其中的不祥之兆（乌鸦、裂镜、敲响十三下的钟、突然安静的鸟群）：它在预告灾祸将至。",
          "The sentence shows no warning sign of what is to come.",
          "这个句子没有显示预示未来的征兆。",
        ),
        delay: L(
          "延宕",
          "The sentence slows the action and holds back the reveal, so we must wait in suspense.\n\n**Check.** Trace the pacing: pauses, stops, counting, or inch-by-inch steps stretch out the moment right before we see what is hidden.",
          "这个句子放慢了动作、推迟了揭示，让我们在悬念中等待。\n\n**检验。** 看节奏变化：停顿、数步或一寸寸推进把揭示前的那一刻拉长，吊足胃口。",
          "The sentence does not hold back a reveal.",
          "这个句子没有推迟揭示。",
        ),
      },
    ),
  ],
});

const shakespeareScene = topic("reading", {
  id: "reading-a-scene-of-shakespeare",
  title: ["Reading a Scene of Shakespeare", "读莎士比亚的一场戏"],
  summary: [
    "Shakespeare's characters speak to each other in dialogue, to themselves in soliloquies and to the audience in asides; his lines can be put into plain modern English.",
    "莎士比亚的人物在对话中彼此交谈，在独白中自言自语，在旁白中对观众说话；他的台词可以转换成平实的现代英语。",
  ],
  intro: [
    "In a Shakespeare play, knowing *who* can hear a speech changes everything: an actor alone onstage bares their mind in a **soliloquy**, while a whispered **aside** lets the audience in on a plot right under another character's nose.",
    "读莎士比亚戏剧时，先弄清“谁听得见这段话”至关重要：独自在台上吐露心声是**独白**，当着别人面悄悄对观众交底则是**旁白**；再把古词和倒装还原，台词就立刻明朗了。",
  ],
  after: ["early-modern-english-words"],
  points: [
    label(
      "who-is-the-speech-for",
      ["Who Is the Speech For", "这段台词是说给谁听的"],
      [
        "In a play, it matters who is meant to hear a speech. In **dialogue**, characters speak to each other. In a **soliloquy**, a character alone on stage thinks aloud, so we hear their true thoughts: Hamlet's *To be, or not to be*. In an **aside**, a character speaks a quick line to the audience that the others on stage do not hear, often to share a secret or a joke.\n\n> **Watch out.** Check who else is onstage: **alone** onstage speaking inner thoughts = **a soliloquy**; **others present** who do *not* hear the line = **an aside**; characters talking back and forth = **dialogue**.",
        "在戏剧中，台词是说给谁听的很重要。在**对话**中，人物彼此交谈。在**独白**中，人物独自在台上自言自语，所以我们听到了他的真实想法：哈姆雷特的 *To be, or not to be*。在**旁白**中，人物对观众说一句简短的话，台上其他人听不见，常用来透露秘密或开玩笑。\n\n> **注意。** 看台上还有没有其他人：**独自一人**自言自语是**独白**；**别人在场却听不见**是对观众说的**旁白**；人物彼此交谈则是**对话**。",
      ],
      ["What kind of speech is this?", "这是哪一种台词？"],
      `
        Hamlet, alone on stage, wonders aloud whether it is better to live or to die.|a soliloquy
        Macbeth, with the king's men around him, turns and says to the audience: "The Prince of Cumberland! That is a step on which I must fall down, or else o'erleap."|an aside
        Juliet asks the Nurse what news she brings from Romeo, and the Nurse teases her.|dialogue
        Juliet, alone on her balcony at night, asks why Romeo must be a Montague.|a soliloquy
        As Polonius talks to him, Hamlet mutters to the audience that the old man is a tedious fool.|an aside
        Brutus and Cassius argue in a tent about money and loyalty.|dialogue
        Macbeth, alone, sees a dagger floating before him and asks if it is real.|a soliloquy
        While the others celebrate, Iago tells the audience how he will ruin Othello.|an aside
        Romeo and Mercutio joke and quarrel in the street as they walk to the feast.|dialogue
        Lady Macbeth, reading her husband's letter alone, calls on dark spirits to make her cruel.|a soliloquy
        As Duncan praises his host, Lady Macbeth smiles at him and plans his murder, unheard by the guests.|an aside
        Puck and Oberon discuss the love potion they have used on the sleeping lovers.|dialogue
        Hamlet, alone after the actors leave, scolds himself for doing nothing to avenge his father.|a soliloquy
        Hearing his name spoken, Romeo whispers to the audience from the shadows: "Shall I hear more, or shall I speak at this?"|an aside
        The witches greet Macbeth and Banquo with strange prophecies.|dialogue
        Friar Laurence, alone in his garden at dawn, talks to himself about the herbs he gathers.|a soliloquy
        While pretending to agree with the king, the young lord tells the audience what he really thinks.|an aside
        Portia and Nerissa talk about the men who have come to marry Portia.|dialogue
        Brutus, alone in his orchard at night, reasons with himself about whether Caesar must die.|a soliloquy
        As his master speaks of honesty, the servant grins at the audience and pats his stolen purse.|an aside
        Antony speaks to the crowd of Romans at Caesar's funeral.|dialogue
        Macbeth, alone after hearing of his wife's death, says that life is a tale told by an idiot.|a soliloquy
        While the duke reads the letter, the forger tells the audience that his plan is working.|an aside
        Juliet's father angrily orders her to marry Paris on Thursday.|dialogue
        Richard, alone on stage, tells himself he is determined to be a villain.|a soliloquy
        As the lovers swear to be true, the jealous rival mutters to the audience that he will part them.|an aside
        Bottom and his friends rehearse their play in the woods.|dialogue
        Romeo, alone in the tomb, speaks his last words before drinking the poison.|a soliloquy
        As the queen welcomes him, the spy tells the audience that he carries a letter for her enemies.|an aside
        Hamlet tells his friend Horatio about the ghost he has seen.|dialogue
      `,
      {
        dialogue: L(
          "对话",
          "The characters speak to and answer each other, and all of them hear what is said.\n\n**Check.** Confirm that the characters onstage are directly addressing one another (or an onstage crowd) with no secret line aimed only at the theater audience.",
          "人物彼此交谈、互相回应，所说的话他们都听得见。\n\n**检验。** 确认台上人物是在彼此交谈（或对剧中众人发言），没有背着别人偷偷对剧场观众说话。",
          "The speech is not an exchange that the characters all hear.",
          "这段台词不是人物都能听见的交谈。",
        ),
        "a soliloquy": L(
          "独白",
          "A character alone on stage thinks aloud, letting the audience hear their private thoughts.\n\n**Check.** Spot the cue *alone*: no other character is onstage to hear, so the speech is a soliloquy, not an aside.",
          "人物独自在台上自言自语，让观众听到他的内心想法。\n\n**检验。** 抓住关键词 *alone*：台上没有其他人物在场，所以这是独白，不是旁白。",
          "The character is not alone on stage thinking aloud.",
          "人物并不是独自在台上自言自语。",
        ),
        "an aside": L(
          "旁白",
          "A character speaks a short line to the audience while others are on stage, and the others do not hear it.\n\n**Check.** Notice both conditions: other characters are present onstage, yet this remark is directed to the audience unheard by them.",
          "人物在其他人在场时对观众说一句简短的话，其他人听不见。\n\n**检验。** 同时满足两条：台上还有其他人物，但这句话是背着他们说给观众听的。",
          "This is not a quick line to the audience that others on stage cannot hear.",
          "这不是台上其他人听不见的、对观众说的简短台词。",
        ),
      },
    ),
    choose(
      "the-line-in-plain-english",
      ["The Line in Plain English", "用平实的英语说出台词"],
      [
        "To read Shakespeare, turn each line into plain modern English. Watch for the old words (*thou*, *art*, *wherefore*), the inverted word order (*Sweet are the uses of adversity*) and the images. *Wherefore art thou Romeo?* does not ask where Romeo is; it asks **why** he must be Romeo, a Montague. Read the whole sentence, put the subject first, then say it as you would today.\n\n> **Watch out.** Do not translate Shakespeare's metaphors or archaic words literally—*lend me your ears* asks for attention (not physical ears), and *wherefore* means *why* (not *where*).",
        "读莎士比亚时，要把每行台词转换成平实的现代英语。注意古词（*thou*、*art*、*wherefore*）、倒装语序（*Sweet are the uses of adversity*）和意象。*Wherefore art thou Romeo?* 不是问罗密欧在哪里，而是问他**为什么**偏偏是罗密欧，一个蒙太古家的人。读完整句话，把主语放在前面，再用今天的说法说出来。\n\n> **注意。** 不要把莎士比亚的比喻和古词按字面硬译——*lend me your ears* 是请大家倾听（不是借耳朵），*wherefore* 是“为什么”（不是“在哪里”）。",
      ],
      ["What does this line mean in plain English?", "这行台词用平实的英语是什么意思？"],
      rival(
        `
        O Romeo, Romeo, wherefore art thou Romeo?|Why do you have to be Romeo, a Montague?|Where are you hiding, Romeo?|Romeo, why are you so late?
        What's in a name? That which we call a rose by any other name would smell as sweet.|A name does not change what a thing really is.|Roses should be given a better name.|Romeo's name smells sweet to her.
        Parting is such sweet sorrow.|Saying goodbye is sad and yet sweet.|Leaving makes her angry.|She is glad that he is going.
        Fair is foul, and foul is fair.|Things that look good may be bad, and bad things may look good.|The weather is both fine and stormy.|Everything fair will soon be ruined.
        Out, damned spot! Out, I say!|She tries to wash away a stain of guilt she imagines on her hands.|She orders a servant to clean the floor.|She shouts at a dog to leave the room.
        Is this a dagger which I see before me?|He wonders whether the dagger he sees is real.|He asks someone to hand him a dagger.|He boasts about the dagger he owns.
        Something is rotten in the state of Denmark.|Something is wrong in the country's government.|The food in Denmark has gone bad.|The palace smells of rotting wood.
        Neither a borrower nor a lender be.|Do not borrow money or lend it.|Borrow money only from your friends.|Lend money freely to anyone who asks.
        The lady doth protest too much, methinks.|I think she denies it so strongly that she must not mean it.|I think the lady is right to complain.|I think the lady should speak louder.
        Friends, Romans, countrymen, lend me your ears.|Everyone, please listen to me.|Give me your ears as a sign of loyalty.|Friends, lend me money for my journey.
        Et tu, Brute?|Even you, Brutus, are against me?|Brutus, eat with me.|Brutus, are you hurt too?
        The fault, dear Brutus, is not in our stars, but in ourselves.|We cannot blame fate for our failures; we are responsible.|Our stars are faulty and cannot guide us.|Brutus is at fault, not the rest of us.
        Cowards die many times before their deaths.|Cowards suffer death in their fears again and again.|Cowards are often killed in battle.|Cowards live longer than brave men.
        All the world's a stage, and all the men and women merely players.|Life is like a play in which we all act parts.|Everyone in the world should go to the theater.|The whole world is watching our play.
        Love looks not with the eyes, but with the mind.|Love sees what the heart and mind want, not what the eyes see.|Lovers have poor eyesight.|People fall in love only with clever minds.
        The course of true love never did run smooth.|True love always meets with trouble.|True love is like a calm river.|Lovers should never run.
        Lord, what fools these mortals be!|How foolish human beings are!|The lord is a foolish man.|Human beings live forever.
        If music be the food of love, play on.|If music feeds love, keep playing.|Play music while we eat.|Music is better than food.
        Uneasy lies the head that wears a crown.|A ruler can never rest easy.|The crown is too tight for the king's head.|The king sleeps on an uncomfortable bed.
        Double, double toil and trouble.|More and more work and trouble.|Two people are in trouble.|The witches are tired of working.
        By the pricking of my thumbs, something wicked this way comes.|My body warns me that something evil is coming.|My thumbs hurt, so I need a doctor.|A wicked thumb is coming this way.
        To thine own self be true.|Be honest with yourself and act by your own beliefs.|Always trust what others tell you.|Think only about yourself.
        Brevity is the soul of wit.|Being brief is the heart of being clever.|Witty people have short lives.|A short soul is a clever one.
        Good night, good night! Parting is such sweet sorrow that I shall say good night till it be morrow.|Saying goodbye is so sweet a sadness that I could keep saying it until morning.|I am too tired to say more tonight.|I will leave tomorrow morning.
        A plague o' both your houses!|Curse both your families!|Both your houses are full of sick people.|Clean both your houses.
        These violent delights have violent ends.|Passions this fierce end in disaster.|Violent games are delightful.|Delightful things always last.
        Now is the winter of our discontent made glorious summer.|Our bad times have now turned to good times.|Winter has turned unusually warm.|We are unhappy that summer is coming.
        We are such stuff as dreams are made on.|Our lives are as unreal and short as dreams.|We dream about our belongings.|We make our dreams from cloth.
        Tomorrow, and tomorrow, and tomorrow creeps in this petty pace from day to day.|Day after day crawls slowly by, without meaning.|Tomorrow will come quickly.|Each day is better than the last.
        Some are born great, some achieve greatness, and some have greatness thrust upon them.|People become great by birth, by effort or by chance.|Only those born great can be great.|Greatness is thrown at people who do not want it.
        `,
        1,
      ),
      (right) => [
        `In plain English: **${right}**\n\n**Check.** Decode any archaic word or metaphor in the original line and reread the whole thought: **${right}** captures the speaker's figurative point without falling into a literal misreading.`,
        `用平实的英语说：**${right}**\n\n**检验。** 逐个解开原台词里的古词或比喻再重读整句：**${right}** 准确抓住了说话人的真正意思，没有按字面误解。`,
      ],
      [
        [
          "*{wrong}* misreads the line, taking an old word or image too literally.",
          "*{wrong}* 误读了这行台词，把古词或意象理解得太字面了。",
        ],
        ["*{wrong}* is the meaning of a different line, not this one.", "*{wrong}* 是另一行台词的意思，不是这一行的。"],
      ],
    ),
  ],
});

const production = topic("reading", {
  id: "comparing-a-play-and-its-production",
  title: ["Comparing a Play and Its Production", "比较剧本与演出"],
  summary: [
    "A production of a play makes choices of set, acting and script; comparing it with the text shows what stays faithful and what is changed or added.",
    "一部戏的演出要在布景、表演和剧本上做出选择；把它与剧本比较，可以看出哪些忠于原作，哪些被改动或增添。",
  ],
  intro: [
    "Two directors staging the same balcony scene can produce two completely different moods — one with candlelight and whispers, another with neon fire escapes and shouting. Comparing a production to its script separates set and lighting, acting, and script changes, and tracks what is kept, altered, or newly invented.",
    "两位导演排演同一场阳台戏，可以演出截然不同的氛围——一场用烛光与耳语，另一场用霓虹防火梯与喊叫。比较演出与剧本，就是要分清布景灯光、表演选择和剧本改动，并辨明哪些忠于原作、哪些删改或新增。",
  ],
  after: ["parts-of-a-play", "comparing-texts-on-a-topic"],
  points: [
    label(
      "what-kind-of-choice",
      ["What Kind of Choice", "哪一种选择"],
      [
        "A script gives the words, but a production must decide the rest. Some choices are about **set and lighting**: where and when the scene seems to take place, and how it looks. Some are **acting choices**: how an actor speaks, moves and reacts. And some are **changes to the script**: lines cut, moved or rewritten by the director.\n\n> **Watch out.** Check who or what changes: stage space, props, fog, or light → **set and lighting**; an actor's voice, pause, gesture, or expression → **an acting choice**; cutting, moving, reassigning, or rewriting lines → **a change to the script**.",
        "剧本给出台词，但演出必须决定其余的一切。有些选择关于**布景和灯光**：场景似乎发生在哪里、什么时候，看起来是什么样子。有些是**表演选择**：演员怎样说话、动作和反应。还有些是**对剧本的改动**：导演删去、移动或改写台词。\n\n> **注意。** 看改动的对象：舞台空间、道具、雾气或灯光 → **布景和灯光**；演员的语气、停顿、动作或表情 → **表演选择**；删减、挪动、换人说或改写台词 → **对剧本的改动**。",
      ],
      ["What kind of production choice is this?", "这是哪一种演出选择？"],
      `
        The director sets Romeo and Juliet in a modern city, with fire escapes instead of a balcony.|set and lighting
        The actor playing Macbeth whispers "Is this a dagger" instead of shouting it.|an acting choice
        The director cuts the scene with the musicians, which the script includes.|a change to the script
        A single red light floods the stage when Caesar is killed.|set and lighting
        The actress playing Juliet laughs nervously before she drinks the potion.|an acting choice
        The director moves Hamlet's "To be, or not to be" to an earlier scene.|a change to the script
        The witches' scene takes place on a bare stage filled with thick fog.|set and lighting
        The actor playing Brutus pauses for a long time before stabbing Caesar.|an acting choice
        The director gives some of the Nurse's lines to another servant.|a change to the script
        The forest in A Midsummer Night's Dream is made of hanging ropes and green light.|set and lighting
        The actor playing Puck leaps over the other actors instead of walking.|an acting choice
        The director rewrites some old words so that a modern audience can follow.|a change to the script
        The ghost of Hamlet's father appears as a shadow projected on a huge wall.|set and lighting
        The actress playing Lady Macbeth sleepwalks with a calm smile instead of terror.|an acting choice
        The director cuts the Porter's comic speech to keep the mood dark.|a change to the script
        The stage is lit only by candles during the banquet scene.|set and lighting
        The actor playing Romeo kneels and weeps as he speaks to Juliet's body.|an acting choice
        The director adds a line from another play to open the show.|a change to the script
        The tomb scene is set in a cold white hospital room.|set and lighting
        The actor playing Mercutio jokes even as he dies, laughing between lines.|an acting choice
        The director shortens the final scene by cutting the Prince's speech.|a change to the script
        The battle is shown with flashing lights and drums in the dark.|set and lighting
        The actor playing Shylock speaks his famous speech quietly, close to tears.|an acting choice
        The director cuts two minor characters and gives their lines to others.|a change to the script
        Snow falls on the stage during the final scene.|set and lighting
        The actress playing Portia speaks the court scene with a sly smile.|an acting choice
        The director moves the opening fight to the end of the first act.|a change to the script
        The castle is shown as a set of tall black walls that slowly close in.|set and lighting
        The actor playing Hamlet turns his back to the audience during the soliloquy.|an acting choice
        The director replaces the Chorus's opening sonnet with a short video.|a change to the script
      `,
      {
        "set and lighting": L(
          "布景和灯光",
          "The choice is about how the stage looks: the place, the time, the light and the objects on it.\n\n**Check.** Notice that no lines are altered and no actor's delivery is described—the decision shapes the visual environment on stage.",
          "这个选择关于舞台的样子：地点、时间、灯光和台上的物件。\n\n**检验。** 这里既没有改台词，也没有说演员怎么念——它塑造的是舞台上的视觉环境与光影。",
          "The choice is not about how the stage looks.",
          "这个选择与舞台的样子无关。",
        ),
        "an acting choice": L(
          "表演选择",
          "The choice is about how an actor speaks, moves or reacts while saying the script's words.\n\n**Check.** Focus on the performer: whispers, pauses, smiles, weeping, or movement happen in the actor's body and voice while keeping the script's words.",
          "这个选择关于演员在说剧本台词时怎样说话、动作或反应。\n\n**检验。** 聚焦演员本人：低语、停顿、微笑、落泪或走位都是演员用声音和形体做出的诠释。",
          "The choice is not about how an actor performs.",
          "这个选择与演员的表演无关。",
        ),
        "a change to the script": L(
          "对剧本的改动",
          "The choice changes the words themselves: lines are cut, moved, given to others or rewritten.\n\n**Check.** Compare the spoken text with the printed play: lines, scenes, or speakers have been cut, reordered, reassigned, or rewritten.",
          "这个选择改动了台词本身：删去、移动、交给别人说或改写。\n\n**检验。** 对照演出文本与原剧本：台词、场次或说话人被删减、调序、换人或改写了。",
          "The choice leaves the script's words as they are.",
          "这个选择没有改动剧本的台词。",
        ),
      },
    ),
    label(
      "faithful-or-changed",
      ["Faithful or Changed", "忠实还是改动"],
      [
        "Comparing a production with the script, ask how close it stays. Some choices are **faithful to the script**: they do what the stage directions and lines call for. Some **cut or change** what the script has. Others **add** something the script does not have at all: a silent scene, a new character, a song or a final image the playwright never wrote.\n\n> **Watch out.** Separate **cuts or changes it** from **adds something new**: altering or trimming something already in the script is a cut/change; inventing a brand-new scene, character, song, or video not in the script at all is an addition.",
        "把演出与剧本比较时，要问它与剧本有多接近。有些选择**忠于剧本**：按照舞台说明和台词的要求去做。有些**删减或改动**了剧本原有的内容。还有些**增添**了剧本根本没有的东西：一段无声的场面、一个新人物、一首歌或剧作家从未写过的结尾画面。\n\n> **注意。** 分清**删减或改动**和**增添新内容**：修改或删掉剧本原有元素属于删改；凭空加入剧本里根本没有的场次、人物、歌曲或视频则属于增添。",
      ],
      ["How does this production choice compare with the script?", "这个演出选择与剧本相比如何？"],
      `
        The script says "Enter three Witches" in thunder and lightning; the production opens with thunder, lightning and three witches.|faithful to the script
        The script has Juliet speak a long speech before drinking the potion; the production keeps only its first two lines.|cuts or changes it
        The production opens with a silent scene of Juliet as a child, which the script does not have.|adds something new
        The script says Hamlet holds a skull; in the production, Hamlet holds a skull.|faithful to the script
        The script has Macbeth killed offstage; the production shows the killing onstage.|cuts or changes it
        The production adds a narrator who explains each scene to the audience.|adds something new
        The script calls for a balcony; the production builds a balcony above the stage.|faithful to the script
        The script has the Prince end the play; in the production, Juliet's nurse speaks the last lines.|cuts or changes it
        The production ends with a song about the lovers that Shakespeare never wrote.|adds something new
        The script says Caesar is stabbed at the Capitol; the production stages the stabbing at the Capitol.|faithful to the script
        The script has twelve characters at the feast; the production uses only four.|cuts or changes it
        The production adds a scene showing Lady Macbeth's childhood.|adds something new
        The script says "Exit, pursued by a bear"; the actor runs off as a bear chases him.|faithful to the script
        The script gives Mercutio a long speech about dreams; the production cuts it.|cuts or changes it
        The production adds a ghost of Romeo who watches the final scene.|adds something new
        The script's stage direction says "Enter Ghost"; a ghostly figure appears.|faithful to the script
        The script places the play in Verona; the production keeps the words but moves the story to Mars.|cuts or changes it
        The production adds a dance between acts that is not in the script.|adds something new
        The script says the witches stir a cauldron; the witches stir a cauldron on stage.|faithful to the script
        The script has Hamlet's mother die by poison; in the production she is stabbed.|cuts or changes it
        The production adds a new character, a young servant who watches every scene in silence.|adds something new
        The script has Puck speak to the audience at the end; Puck steps forward and speaks to the audience.|faithful to the script
        The script names the play's city as Athens; the production changes every mention to London.|cuts or changes it
        The production begins with a video of a modern news report about the war.|adds something new
        The script has Brutus fall on his sword; Brutus falls on his sword.|faithful to the script
        The script has the lovers marry offstage; the production cuts the scene that tells of the wedding.|cuts or changes it
        The production adds a final image of the two families shaking hands, which the script does not show.|adds something new
        The script calls for music before the lovers wake; the production plays music as they wake.|faithful to the script
        The script has Macbeth's speech in verse; the actors speak it as modern slang.|cuts or changes it
        The production adds a scene of Caesar's funeral procession, without words.|adds something new
      `,
      {
        "faithful to the script": L(
          "忠于剧本",
          "The production does what the script's words and stage directions call for.\n\n**Check.** Match the first half (the script) with the second half (the staging): every element called for in the text appears just as written.",
          "演出按照剧本的台词和舞台说明的要求去做。\n\n**检验。** 对照前半句的剧本要求与后半句的实际演出：两者完全一致，没有删改或另起炉灶。",
          "The production does not simply do what the script calls for.",
          "演出并不是简单地按剧本要求去做。",
        ),
        "cuts or changes it": L(
          "删减或改动",
          "The production removes or alters something that the script has: words, characters, events or setting.\n\n**Check.** Spot what the script originally specified and how the production trimmed, replaced, or shifted it.",
          "演出删去或改动了剧本原有的东西：台词、人物、情节或背景。\n\n**检验。** 找到剧本原本写定的内容，再看演出把它删短、替换或改成了别样。",
          "The production does not cut or alter what the script has.",
          "演出没有删减或改动剧本原有的内容。",
        ),
        "adds something new": L(
          "增添新内容",
          "The production adds something the script does not have at all, such as a scene, character or song.\n\n**Check.** Notice that nothing from the script is being replaced here—an entirely new scene, figure, song, or opening image has been invented.",
          "演出增添了剧本根本没有的东西，如一场戏、一个人物或一首歌。\n\n**检验。** 这里不是替换剧本原有的元素，而是全新加入了一段原剧本根本不存在的场面、人物或歌曲。",
          "The production adds nothing that the script lacks.",
          "演出没有增添剧本所没有的东西。",
        ),
      },
    ),
  ],
});

const oralHistory = topic("reading", {
  id: "reading-an-oral-history",
  title: ["Reading an Oral History", "阅读口述历史"],
  summary: [
    "An oral history records a person's spoken memories; it is strong on what an experience felt like, but dates, numbers and things the speaker only heard should be checked.",
    "口述历史记录一个人口头讲述的回忆；它擅长表现亲身经历的感受，但日期、数字和讲述者道听途说的事需要核实。",
  ],
  intro: [
    "When a ninety-year-old recalls *'I gripped my brother's hand in the cold hall'* alongside *'There were 12,000 people on our block'* and *'Neighbors said the landlord started the fire,'* a historian reads each line differently. Oral history preserves lived feelings while requiring records to verify numbers and filter out rumor.",
    "当九十岁老人回忆“我在冰冷大厅里攥紧弟弟的手”，又说“我们街区有一万两千人”和“邻居说火是房东放的”，历史学家对这三句话的信任度截然不同。口述历史最珍贵的是亲身感受，而数字要查档案、传闻则要警惕。",
  ],
  after: ["conflicting-accounts-of-one-event"],
  points: [
    label(
      "whose-words-are-these",
      ["Whose Words Are These", "这是谁的话"],
      [
        "An oral history is usually printed as an interview. Most of it is **the speaker's memory**, in their own words. It also includes **the interviewer's question**, usually in a different type or marked *Q*. And the historian who edits it often adds **an editor's note**, in square brackets or a footnote, to explain a name, a place or a date the speaker mentions.\n\n> **Watch out.** Check the formatting cues first: `Q:` marks **the interviewer's question**, `[...]` marks **an editor's note**, and unmarked first-person recollection is **the speaker's memory**.",
        "口述历史通常以访谈的形式印出。大部分是**讲述者的回忆**，用他们自己的话说。其中也有**采访者的提问**，通常用不同的字体或标为 *Q*。编辑访谈的历史学家还常常加上**编者注**，放在方括号或脚注里，解释讲述者提到的名字、地方或日期。\n\n> **注意。** 先看版式标记：`Q:` 开头的是**采访者的提问**，方括号 `[...]` 里的是**编者注**，没有标记的第一人称追忆则是**讲述者的回忆**。",
      ],
      ["In this oral history, whose words are these?", "在这份口述历史中，这是谁的话？"],
      `
        We slept four to a bunk, and the ship rolled so badly that my mother was sick for eleven days.|the speaker's memory
        Q: What do you remember about the day you arrived?|the interviewer's question
        [Ellis Island, the main entry station for immigrants to New York, opened in 1892.]|an editor's note
        My father had sold our cow to pay for the tickets, and he never stopped talking about that cow.|the speaker's memory
        Q: How did your family decide to leave?|the interviewer's question
        [The speaker is referring to the famine that struck the region in 1891.]|an editor's note
        The doctor turned my eyelids up with a buttonhook, and I was terrified he would send me back.|the speaker's memory
        Q: Were you afraid of the medical inspection?|the interviewer's question
        [Inspectors checked for trachoma, an eye disease, by lifting the eyelids.]|an editor's note
        I remember the smell of oranges; a lady handed me one, and I had never seen one before.|the speaker's memory
        Q: Can you describe your first home in the city?|the interviewer's question
        [Tenement apartments of this kind often housed a family of eight in two rooms.]|an editor's note
        We lived above a bakery, and in winter the warm floor was the best thing in the world.|the speaker's memory
        Q: What work did your mother find?|the interviewer's question
        [Garment shops of the era commonly paid by the piece rather than by the hour.]|an editor's note
        My mother sewed collars at home until two in the morning, and I threaded her needles.|the speaker's memory
        Q: Did you go to school?|the interviewer's question
        [The speaker's school, P.S. 177, stood on Market Street until 1938.]|an editor's note
        The teacher changed my name on the first day because she could not say it.|the speaker's memory
        Q: How did you feel about your new name?|the interviewer's question
        [Name changes of this kind were usually made by teachers or employers, not by officials at the port.]|an editor's note
        I kept my grandmother's letters in a tin box under the bed and read them when I was homesick.|the speaker's memory
        Q: Did you ever go back to your village?|the interviewer's question
        [The village was renamed in 1946 and is now part of a different country.]|an editor's note
        When I finally went back, I could not find our house; there was a road where it used to be.|the speaker's memory
        Q: What advice would you give to young immigrants today?|the interviewer's question
        [The interview was recorded in 1985, when the speaker was ninety-one.]|an editor's note
        On my first payday I bought my mother a teacup with roses on it, and she kept it all her life.|the speaker's memory
        Q: What did you buy with your first wages?|the interviewer's question
        [A day's wage in a garment shop in 1912 was roughly one dollar.]|an editor's note
        My little brother cried on the ferry because he thought the Statue of Liberty was a giant who would eat us.|the speaker's memory
        Q: Who traveled with you on the ferry?|the interviewer's question
        [Ferries carried passed immigrants from the island to Manhattan several times an hour.]|an editor's note
      `,
      {
        "the speaker's memory": L(
          "讲述者的回忆",
          "These are the speaker's own words about what they lived through, often full of personal detail.\n\n**Check.** Notice the first-person voice (*I*, *we*, *my*) and the absence of `Q:` or square brackets—this is the interviewee speaking directly.",
          "这是讲述者用自己的话讲述的亲身经历，常常充满个人细节。\n\n**检验。** 注意第一人称视角（*I*、*we*、*my*），且既无 `Q:` 也无方括号——这是受访者本人的原话。",
          "These words are not the speaker's own memories.",
          "这些话不是讲述者自己的回忆。",
        ),
        "the interviewer's question": L(
          "采访者的提问",
          "The line, marked *Q*, is a question that prompts the speaker to remember.\n\n**Check.** Spot both the `Q:` label and the question mark prompting the interviewee for a memory.",
          "这一行标为 *Q*，是引导讲述者回忆的问题。\n\n**检验。** 看开头的 `Q:` 标记和句末问号，它正是在向受访者发问。",
          "This line is not a question from the interviewer.",
          "这一行不是采访者的提问。",
        ),
        "an editor's note": L(
          "编者注",
          "The words in square brackets were added by the historian to explain a name, place or date.\n\n**Check.** Spot the enclosing `[...]` and the third-person historical context (*The speaker is referring to...*, dates, definitions) supplied by the editor.",
          "方括号中的话是历史学家加上的，用来解释名字、地方或日期。\n\n**检验。** 看外层的 `[...]` 和第三人称的历史背景说明，这是编者补充的注释。",
          "These words are not a note added by the editor.",
          "这些话不是编者加的注释。",
        ),
      },
    ),
    label(
      "how-far-to-trust-it",
      ["How Far to Trust It", "可以相信到什么程度"],
      [
        "Oral histories are precious because they keep what records leave out: what it **felt like** to live through an event. A speaker's own feelings and experiences can be trusted as their memory. But **exact dates and numbers**, recalled decades later, should be checked against records. And things the speaker did not see but **only heard about** from others are hearsay, the weakest kind of evidence.\n\n> **Watch out.** Check the source of the statement: personal feelings (*I was frightened*, *I felt proud*) → **trust it as experience**; specific dates, counts, or wages → **check it against records**; secondhand cues (*People said*, *My uncle told me*, *Rumor had it*) → **hearsay**.",
        "口述历史之所以珍贵，是因为它保留了记录所遗漏的东西：亲身经历一件事**是什么感受**。讲述者自己的感受和经历可以当作他的回忆来相信。但几十年后回忆起的**确切日期和数字**，应该与记录核对。讲述者没有亲眼看见、**只是听别人说**的事是传闻，是最弱的证据。\n\n> **注意。** 辨明这句话的来源：亲身情感体验 → **当作亲身经历来相信**；具体日期、人数或工钱 → **与记录核对**；转述信号（*People said*、*My uncle told me*、*Rumor had it*）→ **传闻**。",
      ],
      ["How should a historian treat this statement from an oral history?", "历史学家应该如何对待口述历史中的这句话？"],
      `
        I was so frightened in the inspection hall that I held my brother's hand until it hurt.|trust it as experience
        Our ship carried exactly 2,317 passengers that voyage.|check it against records
        People said that the inspectors sent back one in every three children.|hearsay: only heard about
        The first winter, I was cold all the time, and I cried for my grandmother every night.|trust it as experience
        We arrived on the twelfth of March, 1907, a Tuesday.|check it against records
        My uncle told me that the ship before ours had sunk with everyone on board.|hearsay: only heard about
        I felt proud when I first wrote my name in English.|trust it as experience
        Our street had forty-two families living on it.|check it against records
        A neighbor said the factory owner had made a million dollars from our work.|hearsay: only heard about
        I was ashamed of my old clothes on the first day of school.|trust it as experience
        My father earned exactly nine dollars a week at the mill.|check it against records
        They say the police used to arrest anyone who spoke our language in the street.|hearsay: only heard about
        When I saw the Statue of Liberty, I felt that my life was beginning again.|trust it as experience
        The tenement fire happened in the spring of 1911 and killed 146 people.|check it against records
        Everyone in the neighborhood said the landlord had set the fire himself.|hearsay: only heard about
        I loved the noise of the city after the silence of the farm.|trust it as experience
        There were twelve thousand people in our part of town.|check it against records
        My cousin heard that the mayor had promised jobs to all the newcomers.|hearsay: only heard about
        I missed the smell of my mother's bread for years after she died.|trust it as experience
        The steamer took fourteen days from Naples to New York.|check it against records
        Someone told us that people in the next town were sent back for having bad teeth.|hearsay: only heard about
        I was lonely at first because no one at work spoke my language.|trust it as experience
        Our rent was four dollars a month in 1910.|check it against records
        My aunt swore that the boss's son had once worked in the mine himself.|hearsay: only heard about
        I felt like a stranger in my own family when my children spoke only English.|trust it as experience
        The law limiting immigration passed in 1924.|check it against records
        Rumor had it that the ship's captain had been bribed to take extra passengers.|hearsay: only heard about
        When I became a citizen, I wept with happiness in the courtroom.|trust it as experience
        Our village sent three hundred young men to America that year.|check it against records
        People back home believed the streets of America were paved with gold.|hearsay: only heard about
      `,
      {
        "trust it as experience": L(
          "当作亲身经历来相信",
          "The speaker describes their own feelings or experience, which only they can tell and which records rarely keep.\n\n**Check.** Notice the first-person emotion (*frightened*, *proud*, *ashamed*, *lonely*, *wept*): no archive records how a moment felt from the inside.",
          "讲述者描述自己的感受或经历，这只有他们能讲，而记录很少保存。\n\n**检验。** 句中写的是讲述者亲历的内心感受（恐惧、自豪、羞愧、孤独、喜极而泣）：这是档案里查不到的珍贵体验。",
          "This is not the speaker's own feeling or experience.",
          "这不是讲述者自己的感受或经历。",
        ),
        "check it against records": L(
          "与记录核对",
          "An exact date, number or fact recalled many years later may be wrong, so records of the time should be checked.\n\n**Check.** Spot the precise figure, year, count, or sum of money: memory easily drifts on exact numbers, so a ship manifest, census, or ledger should verify it.",
          "多年后回忆的确切日期、数字或事实可能有误，所以要查阅当时的记录。\n\n**检验。** 找出确切的年份、人数、天数或金额：记忆在精确数字上容易偏差，必须用当时档案核对。",
          "The statement is not an exact date, number or checkable fact.",
          "这句话不是确切的日期、数字或可以核实的事实。",
        ),
        "hearsay: only heard about": L(
          "传闻：只是听说",
          "The speaker did not see this but heard it from others, so it is hearsay, the weakest kind of evidence.\n\n**Check.** Spot the secondhand framing (*People said*, *My uncle told me*, *They say*, *My cousin heard*, *Rumor had it*): the speaker was not an eyewitness.",
          "讲述者没有亲眼看见，而是听别人说的，所以这是传闻，是最弱的证据。\n\n**检验。** 识别转述信号（*People said*、*My uncle told me*、*Rumor had it* 等）：讲述者并非亲眼所见。",
          "The speaker is not passing on what others said.",
          "讲述者并不是在转述别人的话。",
        ),
      },
    ),
  ],
});

const memoirReport = topic("reading", {
  id: "comparing-a-memoir-and-a-report",
  title: ["Comparing a Memoir and a Report", "比较回忆录与报告"],
  summary: [
    "A memoir tells one person's experience with feeling; a report gives facts and numbers about many; each answers different questions.",
    "回忆录带着感情讲述一个人的经历；报告给出关于许多人的事实和数字；二者能回答不同的问题。",
  ],
  intro: [
    "To understand a wave of migration, a **memoir** lets you hear one child's heartbeat on the ship's deck, a **government report** gives the percentages and averages across thousands of families, and a **photograph** freezes how the hall looked. Knowing what each source does best lets you pick the right evidence for every question.",
    "要理解一段移民潮，**回忆录**让你听见一个孩子在甲板上的心跳，**政府报告**给出成千上万家庭的比例与均值，**照片**定格大厅当时的模样。分清各类资料的长处，才能为每个问题选对证据。",
  ],
  after: ["memoir-or-fiction", "comparing-texts-on-a-topic"],
  points: [
    label(
      "what-kind-of-source",
      ["What Kind of Source", "哪一种资料"],
      [
        "Texts on the same subject can come from very different kinds of source. A **memoir** tells the writer's own story in the first person, with feelings and personal detail. A **government report** gives facts, numbers and findings in a neutral voice, about many people at once. A **letter to a newspaper** argues a view, trying to persuade readers of what should be done.\n\n> **Watch out.** Do not confuse a **memoir** with a **letter to a newspaper** just because both can use *I*—a memoir narrates a personal memory (*I stood*, *I was nine*), while a newspaper letter urges public action (*I urge*, *the city must*, *Shame on*).",
        "同一题材的文本可能来自截然不同的资料。**回忆录**以第一人称讲述作者自己的故事，带有感情和个人细节。**政府报告**用中立的口吻给出关于许多人的事实、数字和调查结果。**致报社的信**陈述观点，试图说服读者应该怎么做。\n\n> **注意。** 不要因为都有 *I* 就把**回忆录**和**致报社的信**混在一起——回忆录追叙个人经历（*I stood*、*I was nine*），而致报社的信呼吁公众或政府行动（*I urge*、*must*、*Shame on*）。",
      ],
      ["What kind of source does this sentence most likely come from?", "这个句子最可能出自哪一种资料？"],
      `
        I stood on the deck as the city rose out of the mist, and I could not stop shaking.|a memoir
        In 1907, 1,004,756 immigrants were admitted through the ports of the United States.|a government report
        The city must build more schools at once, or these children will be lost to the streets.|a letter to a newspaper
        My mother wrapped our last loaf in a scarf and told me not to tell anyone we had it.|a memoir
        Of the passengers examined, 2 percent were held for further medical inspection.|a government report
        It is a disgrace that families are crowded into rooms without windows; the council must act.|a letter to a newspaper
        The first word of English I learned was "work," and I heard it every day after.|a memoir
        The average tenement apartment in the district measured 325 square feet.|a government report
        I urge every reader to welcome the newcomers as our own grandparents were welcomed.|a letter to a newspaper
        I was nine when we left, and I remember the dog running after our cart until it could not keep up.|a memoir
        Inspectors found that 40 percent of the buildings lacked running water.|a government report
        The new law is cruel and must be repealed before more families are torn apart.|a letter to a newspaper
        At night I would lie awake and listen to the trains, wondering where they went.|a memoir
        The committee recommends that all new buildings include a window in every room.|a government report
        Your readers should know that these workers pay their taxes like everyone else.|a letter to a newspaper
        When my father found work, he bought me a pair of shoes, my first that were not handed down.|a memoir
        Wages in the garment trade averaged six dollars per week for women in 1910.|a government report
        I write to protest the shameful treatment of the families at the harbor.|a letter to a newspaper
        I was ashamed of my accent, so I practiced English in front of the mirror every night.|a memoir
        The census of 1910 counted 1,944,357 foreign-born residents in the city.|a government report
        It is time for this city to stop blaming newcomers for every problem.|a letter to a newspaper
        My grandmother never learned English, but she could bargain in four languages at the market.|a memoir
        The survey found an average of 5.2 persons per room in the blocks studied.|a government report
        Let us open night schools so that working adults may learn to read.|a letter to a newspaper
        I kept a photograph of our village in my pocket until it fell apart.|a memoir
        Deaths from tuberculosis in the district were twice the city average.|a government report
        Shame on the landlords who profit from such misery.|a letter to a newspaper
        The day I became a citizen, my hands shook so badly I could barely sign my name.|a memoir
        Of the children surveyed, 61 percent had left school before the age of fourteen.|a government report
        I ask your readers to support the bill for public baths in our crowded neighborhoods.|a letter to a newspaper
      `,
      {
        "a memoir": L(
          "回忆录",
          "The sentence tells the writer's own experience in the first person, with personal detail and feeling.\n\n**Check.** Look at the voice and content: first-person past memory (*I*, *my*) sharing an intimate moment rather than statistics or a public demand.",
          "这个句子以第一人称讲述作者自己的经历，带有个人细节和感情。\n\n**检验。** 看视角与内容：第一人称回叙个人切身经历，既不是群体统计，也不是向公众发出的倡议。",
          "The sentence does not tell the writer's own experience with feeling.",
          "这个句子没有带着感情讲述作者自己的经历。",
        ),
        "a government report": L(
          "政府报告",
          "The sentence gives facts or numbers about many people in a neutral voice, as a report does.\n\n**Check.** Spot the objective metrics or formal committee language (*percent*, *average*, *census*, *inspectors found*, *committee recommends*): neutral, population-wide data mark a report.",
          "这个句子用中立的口吻给出关于许多人的事实或数字，就像报告那样。\n\n**检验。** 找出客观统计或官方调查用语（如 *percent*、*average*、*census*、*inspectors found*）：面向群体的中立数据正是报告的特征。",
          "The sentence gives no neutral facts or numbers about many people.",
          "这个句子没有给出关于许多人的中立事实或数字。",
        ),
        "a letter to a newspaper": L(
          "致报社的信",
          "The sentence argues for what should be done, often with strong words like *must*, *shame* or *urge*.\n\n**Check.** Spot the persuasive call to action (*must*, *urge*, *disgrace*, *your readers*, *protest*, *Shame on*, *Let us*): the writer is campaigning to change minds or policy.",
          "这个句子主张应该怎么做，常用 *must*、*shame* 或 *urge* 等强烈的词语。\n\n**检验。** 识别强烈的呼吁或抨击词（如 *must*、*urge*、*your readers*、*protest*、*Shame on*）：作者意在说服读者采取行动。",
          "The sentence does not argue for what should be done.",
          "这个句子没有主张应该怎么做。",
        ),
      },
    ),
    label(
      "which-source-answers-it",
      ["Which Source Answers It", "哪一种资料能回答"],
      [
        "Each kind of source answers different questions. A **memoir** answers questions about one person's feelings and daily life: *What was the first night like?* A **report** answers questions about how many, how much and how often, across many people. A **photograph** answers questions about how something looked at a moment: the clothes, the rooms, the faces.\n\n> **Watch out.** Match the question's core ask: *how did one person feel / why did one person...* → **the memoir**; *how many / what percentage / average* → **the report**; *what did ... look like / how were they dressed* → **the photograph**.",
        "每种资料能回答不同的问题。**回忆录**回答关于一个人的感受和日常生活的问题：*What was the first night like?* **报告**回答关于许多人的多少、多大和多频繁的问题。**照片**回答某一时刻某物看起来是什么样子的问题：衣服、房间、面孔。\n\n> **注意。** 对准问题核心：问个人感受或生活细节 → **回忆录**；问人数、比例或平均值 → **报告**；问外貌、衣着或现场景象 → **照片**。",
      ],
      ["Which source would best answer this question?", "哪一种资料最能回答这个问题？"],
      `
        How did a young girl feel on her first night in a new country?|the memoir
        How many immigrants arrived at the port in 1907?|the report
        What did the great hall of the inspection station look like in 1905?|the photograph
        What did one family eat during their first winter in the city?|the memoir
        What percentage of tenement apartments had running water?|the report
        What did the passengers wear as they came down the gangway?|the photograph
        Why did one boy decide to change his name?|the memoir
        How much did garment workers earn per week on average?|the report
        How crowded did a tenement room look, with its beds and stove?|the photograph
        What did one man miss most about his village?|the memoir
        How many children in the district left school before fourteen?|the report
        What did a street market on the Lower East Side look like in 1910?|the photograph
        How did a mother comfort her children during the voyage?|the memoir
        How many people lived in each room, on average, in the blocks studied?|the report
        What did the faces of the children at the night school look like?|the photograph
        What was it like for one woman to learn English at forty?|the memoir
        How many deaths from disease were recorded in the neighborhood each year?|the report
        What did the ships in the harbor look like at the time?|the photograph
        How did one father feel when he finally found work?|the memoir
        What share of the city's people were born abroad in 1910?|the report
        What did a factory floor full of sewing machines look like?|the photograph
        What songs did one family sing to remember home?|the memoir
        How many factories in the district broke the safety rules?|the report
        How were the children dressed on their first day of school?|the photograph
        How did one girl feel the day she became a citizen?|the memoir
        How many immigrants were sent back from the port each year?|the report
        What did the kitchen of a tenement apartment look like?|the photograph
        What did one boy dream of becoming in his new country?|the memoir
        What was the average rent for a tenement flat in 1910?|the report
        What did the line of people waiting at the inspection station look like?|the photograph
      `,
      {
        "the memoir": L(
          "回忆录",
          "The question asks about one person's feelings, thoughts or daily life, which only their own story can tell.\n\n**Check.** Notice the focus on a single person or family's inner feeling, motive, or private habit—neither statistics nor a camera can capture that.",
          "这个问题问的是一个人的感受、想法或日常生活，只有他自己的故事才能讲述。\n\n**检验。** 问题聚焦于某一个人或家庭的内心感受、动机或私密生活细节——数字和照片都答不了。",
          "The question is not about one person's feelings or life.",
          "这个问题与一个人的感受或生活无关。",
        ),
        "the report": L(
          "报告",
          "The question asks how many, how much or how often across many people, which a report's numbers answer.\n\n**Check.** Spot the quantitative cue (*How many*, *What percentage*, *How much*, *on average*, *What share*): only a statistical report covers the whole group.",
          "这个问题问的是许多人当中的多少、多大或多频繁，报告中的数字能回答。\n\n**检验。** 识别数量提问词（多少、百分比、平均、占比）：只有统计报告能回答群体规模的问题。",
          "The question does not ask for numbers about many people.",
          "这个问题不是在问关于许多人的数字。",
        ),
        "the photograph": L(
          "照片",
          "The question asks how something looked at a moment, which a picture shows best.\n\n**Check.** Spot the visual cue (*look like*, *wear*, *dressed*, *faces*): a photograph records physical appearance directly.",
          "这个问题问的是某一时刻某物看起来是什么样子，照片最能显示。\n\n**检验。** 识别视觉线索（看起来怎样、衣着、神态、场景）：照片能最直观地呈现当时的画面。",
          "The question is not about how something looked.",
          "这个问题与某物的样子无关。",
        ),
      },
    ),
  ],
});

const oldTales = topic("reading", {
  id: "how-modern-stories-use-old-tales",
  title: ["How Modern Stories Use Old Tales", "现代故事如何化用古老传说"],
  summary: [
    "Modern stories often borrow the patterns of myths, fairy tales and old plays, keeping them, turning them upside down or moving them into a new setting.",
    "现代故事常常借用神话、童话和古老戏剧的模式，或保留它们，或颠倒它们，或把它们搬到新的背景中。",
  ],
  intro: [
    "A sci-fi story about a coder who steals clean-energy blueprints from a megacorporation to give away free power is retelling **Prometheus** in a modern setting. Recognizing the old tale underneath lets you see whether the writer kept the pattern, moved it to a new world, or flipped its meaning upside down.",
    "一个科幻故事写程序员从大公司盗出清洁能源图纸免费造福大众，其实是在现代背景中重讲**普罗米修斯**。认出底层的古老传说，就能一眼看出作者是原样保留、搬入新世界，还是把寓意彻底翻转。",
  ],
  after: ["archetypes-in-stories", "words-from-myths"],
  points: [
    label(
      "the-old-tale-behind-it",
      ["The Old Tale Behind It", "背后的古老传说"],
      [
        "Many modern stories are built on old ones. A boy who builds wings from a kite and flies too close to danger echoes **Icarus**. A poor girl helped to a ball by a kind stranger echoes **Cinderella**. Two teenagers from feuding families who fall in love echo **Romeo and Juliet**. Spotting the old tale lets you see what the writer has kept and what the writer has changed.\n\n> **Watch out.** Look past modern props (planes, phones, tech firms, selfies) to the core plot skeleton—who is warned, what is forbidden, or what wish backfires—to identify the source tale.",
        "许多现代故事建立在古老故事的基础上。一个男孩用风筝做成翅膀、飞得离危险太近，呼应了**伊卡洛斯**。一个穷女孩在好心陌生人的帮助下去参加舞会，呼应了**灰姑娘**。两个来自世仇家族的少年相爱，呼应了**罗密欧与朱丽叶**。认出古老的故事，就能看出作者保留了什么、改变了什么。\n\n> **注意。** 穿透飞机、手机、科技公司、自拍等现代包装，抓住核心情节骨架——谁不听警告、谁打开禁忌、谁的愿望适得其反——就能认出背后的古老传说。",
      ],
      ["Which old tale does this modern story draw on?", "这个现代故事借用了哪个古老传说？"],
      `
        A young pilot ignores her mentor's warnings, flies her new plane far too high and crashes into the sea.|Icarus
        A teenager whose stepmother mocks her gets help from a neighbor to attend the school dance, and leaves her phone behind.|Cinderella
        Two teenagers from rival gangs meet at a party, fall in love and die because of the feud.|Romeo and Juliet
        A musician goes into a dangerous city to bring back his dead wife's voice from a recording, but looks back too soon.|Orpheus
        A billionaire wishes that everything he touched made money, and soon he cannot enjoy a meal or hug his daughter.|King Midas
        A curious student opens a forbidden computer file and releases a virus into the world, though a single line of hope remains.|Pandora
        A soldier spends ten years trying to get home from war, facing strange dangers and temptations on the way.|Odysseus
        A famous singer falls so in love with his own image on screen that he stops caring about anyone else.|Narcissus
        A scientist steals a secret technology from a powerful company to give to the poor, and is punished for it.|Prometheus
        A boy who loves the sun builds wax wings for a school project and climbs a tower to test them.|Icarus
        A lonely girl who scrubs floors in a hotel is noticed by a famous guest at a charity ball.|Cinderella
        In a divided city, a girl from one side and a boy from the other marry in secret.|Romeo and Juliet
        A grieving girl travels into a dream world to rescue her brother and is told not to turn around.|Orpheus
        A man wins a lottery that turns all his food to gold coins, and he begins to starve.|King Midas
        A girl is given a box by a stranger and told never to open it; she opens it, and troubles pour out.|Pandora
        An astronaut's long voyage home is delayed by one disaster after another while his family waits.|Odysseus
        A social media star stares at his own videos all day until he forgets his friends.|Narcissus
        A hacker gives the world's knowledge away for free, and the powerful chain him with lawsuits.|Prometheus
        A young climber, thrilled by success, ignores the ropes and climbs too high, too fast.|Icarus
        A shy boy, helped by a magical tailor, goes to a royal party in disguise.|Cinderella
        Two lovers from rival restaurant families in the same street fall for each other.|Romeo and Juliet
        A singer follows her lost love into a land of shadows and loses him when she doubts.|Orpheus
        A king's greed turns his garden, his food and finally his child to cold gold.|King Midas
        A scientist unlocks a sealed vault and releases plagues, but finds hope at the bottom.|Pandora
        A sailor wanders for years among strange islands, longing for his wife and son.|Odysseus
        A young man gazes at his reflection in a lake until he cannot leave it.|Narcissus
        A rebel brings fire to frozen villages against the gods' will and is chained to a rock.|Prometheus
        A boy is given homemade wings by his father, who warns him not to fly too near the sun.|Icarus
        A servant girl loses a glass slipper as she runs from the palace at midnight.|Cinderella
        Two young lovers from feuding houses die in a tomb on the same night.|Romeo and Juliet
      `,
      {
        Icarus: L(
          "伊卡洛斯",
          "Like Icarus, who flew too close to the sun on wax wings, the character ignores a warning, rises too high and falls.\n\n**Check.** Match the signature beat: ignoring a warning about going too high and crashing down.",
          "就像用蜡做的翅膀飞得离太阳太近的伊卡洛斯，这个人物不听警告、飞得太高而坠落。\n\n**检验。** 核对标志性情节：不听劝告、飞得或爬得太高而坠落。",
          "The story does not follow Icarus's pattern of rising too high and falling.",
          "这个故事没有沿用伊卡洛斯飞得太高而坠落的模式。",
        ),
        Cinderella: L(
          "灰姑娘",
          "Like Cinderella, a mistreated girl or boy is helped to a grand event and noticed there, often leaving something behind.\n\n**Check.** Match the signature beat: an overlooked servant or stepchild helped to attend a big party or ball.",
          "就像灰姑娘，一个受虐待的人在帮助下去参加盛会并被注意到，常常留下某样东西。\n\n**检验。** 核对标志性情节：受冷落的主角得到帮助去参加盛会，并因此被瞩目。",
          "The story does not follow Cinderella's pattern.",
          "这个故事没有沿用灰姑娘的模式。",
        ),
        "Romeo and Juliet": L(
          "罗密欧与朱丽叶",
          "Like Romeo and Juliet, two young people from feuding sides fall in love, often with a tragic end.\n\n**Check.** Match the signature beat: young lovers caught between two rival or feuding groups.",
          "就像罗密欧与朱丽叶，来自敌对双方的两个年轻人相爱，结局常常是悲剧。\n\n**检验。** 核对标志性情节：来自敌对或世仇双方的年轻人相爱。",
          "The story does not follow the pattern of lovers from feuding sides.",
          "这个故事没有沿用敌对双方恋人的模式。",
        ),
        Orpheus: L(
          "俄耳甫斯",
          "Like Orpheus, who went to the underworld to bring back his wife, the character tries to rescue a lost love and fails by looking back or doubting.\n\n**Check.** Match the signature beat: journeying into shadow or danger to retrieve someone lost, with a rule not to look back.",
          "就像去冥界带回妻子的俄耳甫斯，这个人物试图救回失去的爱人，却因回头或怀疑而失败。\n\n**检验。** 核对标志性情节：深入险境或阴影世界寻找逝去亲人，却因回头或怀疑而功亏一篑。",
          "The story does not follow Orpheus's pattern.",
          "这个故事没有沿用俄耳甫斯的模式。",
        ),
        "King Midas": L(
          "迈达斯国王",
          "Like King Midas, whose touch turned everything to gold, the character's greed brings a gift that ruins life.\n\n**Check.** Match the signature beat: a wish for wealth or gold that turns food and loved ones untouchable.",
          "就像点物成金的迈达斯国王，这个人物的贪婪带来了毁掉生活的“礼物”。\n\n**检验。** 核对标志性情节：求财的愿望反而毁掉了食物与亲情。",
          "The story does not follow the pattern of a greedy wish that backfires.",
          "这个故事没有沿用贪婪的愿望适得其反的模式。",
        ),
        Pandora: L(
          "潘多拉",
          "Like Pandora, the character opens something forbidden and lets troubles into the world, with hope left behind.\n\n**Check.** Match the signature beat: opening a forbidden box, file, or vault that unleashes troubles while leaving hope inside.",
          "就像潘多拉，这个人物打开了被禁止打开的东西，让灾祸进入世界，只留下了希望。\n\n**检验。** 核对标志性情节：打开被禁止打开的盒子、文件或密室，放出灾祸却留下一线希望。",
          "The story does not follow Pandora's pattern.",
          "这个故事没有沿用潘多拉的模式。",
        ),
        Odysseus: L(
          "奥德修斯",
          "Like Odysseus, the character makes a long, dangerous journey home after a war or voyage.\n\n**Check.** Match the signature beat: years of wandering through dangers while trying to return home to family.",
          "就像奥德修斯，这个人物在战争或航行后踏上漫长而危险的归途。\n\n**检验。** 核对标志性情节：历经漫长而充满险阻的漂泊，一心盼望回到家人身边。",
          "The story does not follow the pattern of a long journey home.",
          "这个故事没有沿用漫长归途的模式。",
        ),
        Narcissus: L(
          "那喀索斯",
          "Like Narcissus, who fell in love with his own reflection, the character becomes lost in love of their own image.\n\n**Check.** Match the signature beat: obsessing over one's own reflection or screen image to the point of forgetting others.",
          "就像爱上自己倒影的那喀索斯，这个人物沉迷于自己的形象。\n\n**检验。** 核对标志性情节：沉迷于自己的倒影或屏幕形象，忘却了身边的他人。",
          "The story does not follow the pattern of self-love.",
          "这个故事没有沿用自恋的模式。",
        ),
        Prometheus: L(
          "普罗米修斯",
          "Like Prometheus, who stole fire from the gods for humans, the character gives a forbidden gift to people and is punished.\n\n**Check.** Match the signature beat: defying the powerful to share fire, knowledge, or technology with ordinary people, and paying the penalty.",
          "就像为人类从众神那里盗取火种的普罗米修斯，这个人物把被禁止的礼物送给人们，并因此受罚。\n\n**检验。** 核对标志性情节：违抗强者把火种、知识或技术分享给普通人，并因此遭受惩罚。",
          "The story does not follow Prometheus's pattern.",
          "这个故事没有沿用普罗米修斯的模式。",
        ),
      },
    ),
    label(
      "what-the-retelling-does",
      ["What the Retelling Does", "改写做了什么"],
      [
        "A retelling can treat its source in three ways. It can **keep the old pattern**, telling the same story with the same meaning. It can **move it to a new setting**, keeping the plot but placing it in a modern city, a school or outer space. Or it can **turn it upside down**, reversing the roles or the ending to make a new point: Cinderella rescues the prince, or Pandora's box saves the world.\n\n> **Watch out.** Check whether the *outcome/roles* flipped or only the *backdrop* changed: same plot in high school or space = **moves it to a new setting**; reversed rescuer, ending, or lesson = **turns it upside down**.",
        "改写可以用三种方式处理原作。它可以**保留原有模式**，用同样的意义讲同一个故事。它可以**换到新的背景**，保留情节，但把它放在现代城市、学校或外太空中。或者它可以**把它颠倒过来**，反转角色或结局以表达新的观点：灰姑娘救了王子，或者潘多拉的盒子拯救了世界。\n\n> **注意。** 看变的是*舞台背景*还是*角色与结局*：情节照旧只是搬到现代校园或太空 → **换到新的背景**；救人者、结局或寓意彻底反转 → **颠倒过来**。",
      ],
      ["What does this retelling do with the old tale?", "这个改写对古老传说做了什么？"],
      `
        In this Cinderella, the girl rescues the prince from a burning palace, and he loses his shoe.|turns it upside down
        In this Cinderella, the story is set in a modern high school, and the ball is the prom.|moves it to a new setting
        In this Cinderella, a mistreated girl, helped by a fairy, wins the prince's heart at a ball.|keeps the old pattern
        In this Icarus, the boy listens to his father, flies safely and saves him from the sea.|turns it upside down
        In this Icarus, a young astronaut flies too close to a star in a spaceship.|moves it to a new setting
        In this Icarus, a proud boy ignores his father's warning, flies too high and falls.|keeps the old pattern
        In this Romeo and Juliet, the lovers end the feud and both families dance at their wedding.|turns it upside down
        In this Romeo and Juliet, the lovers belong to rival tech companies in Silicon Valley.|moves it to a new setting
        In this Romeo and Juliet, the young lovers from feuding houses die through a tragic mistake.|keeps the old pattern
        In this Pandora, opening the box releases cures, not troubles, and the gods are furious.|turns it upside down
        In this Pandora, a girl opens a sealed file on a school computer and releases chaos.|moves it to a new setting
        In this Pandora, a curious woman opens a forbidden jar, and troubles escape into the world.|keeps the old pattern
        In this Orpheus, the wife leads her husband out of the underworld, and she does not look back.|turns it upside down
        In this Orpheus, the musician searches for his love in the subway tunnels of New York.|moves it to a new setting
        In this Orpheus, the singer charms the god of the dead but loses his wife when he looks back.|keeps the old pattern
        In this Midas, the king's golden touch is a blessing that ends hunger in his kingdom.|turns it upside down
        In this Midas, a stockbroker in modern London can turn anything into money.|moves it to a new setting
        In this Midas, a greedy king's golden touch turns his food and his daughter to gold.|keeps the old pattern
        In this Odysseus, it is the wife who sails off on adventures while the husband waits at home.|turns it upside down
        In this Odysseus, a soldier's journey home from a modern war takes ten years across many countries.|moves it to a new setting
        In this Odysseus, a hero struggles for years to sail home, facing monsters and storms.|keeps the old pattern
        In this Narcissus, the beautiful young man ignores his reflection and falls for a plain, kind girl.|turns it upside down
        In this Narcissus, a teenager falls in love with his own selfies.|moves it to a new setting
        In this Narcissus, a vain youth falls in love with his reflection in a pool and wastes away.|keeps the old pattern
        In this Prometheus, the gods reward the thief who brought fire, and the humans punish him.|turns it upside down
        In this Prometheus, a young engineer leaks a clean energy invention to the world.|moves it to a new setting
        In this Prometheus, a Titan steals fire for humanity and is chained to a rock as punishment.|keeps the old pattern
        In this Sleeping Beauty, the princess wakes herself and rescues the sleeping prince.|turns it upside down
        In this Sleeping Beauty, a girl falls into a coma in a modern hospital after a cursed accident.|moves it to a new setting
        In this Sleeping Beauty, a cursed princess sleeps for a hundred years until a prince wakes her.|keeps the old pattern
      `,
      {
        "keeps the old pattern": L(
          "保留原有模式",
          "The retelling tells the same story in the same kind of world, with the same meaning.\n\n**Check.** Verify both setting and outcome: neither the traditional world nor the original plot/ending has been changed.",
          "这个改写在同样的世界里讲同一个故事，意义也相同。\n\n**检验。** 核对背景与结局：既没有搬进现代或科幻世界，也没有反转原有情节和结局。",
          "The retelling changes the setting or reverses the story.",
          "这个改写改变了背景或颠倒了故事。",
        ),
        "moves it to a new setting": L(
          "换到新的背景",
          "The retelling keeps the plot but places it in a new time or place, such as a modern city or outer space.\n\n**Check.** Notice that the core events and lesson stay the same—only the time period, place, or technology (school, spaceship, Silicon Valley, selfies) has been updated.",
          "这个改写保留了情节，但把它放在新的时代或地点，如现代城市或外太空。\n\n**检验。** 核心情节和道理都没变，只是时代、地点或道具换成了现代校园、太空、硅谷或自拍。",
          "The retelling does not move the story to a new time or place.",
          "这个改写没有把故事搬到新的时代或地点。",
        ),
        "turns it upside down": L(
          "颠倒过来",
          "The retelling reverses the roles or the ending, changing what the old story means.\n\n**Check.** Compare the original outcome with this version: the hero's role, the curse, or the tragic ending has been flipped on its head.",
          "这个改写反转了角色或结局，改变了古老故事的意义。\n\n**检验。** 把原版结局与这个版本对照：主角分工、诅咒效果或悲剧结局被彻底翻转了。",
          "The retelling does not reverse the old story's roles or ending.",
          "这个改写没有反转古老故事的角色或结局。",
        ),
      },
    ),
  ],
});

const wholeArgument = topic("reading", {
  id: "evaluating-an-argument-as-a-whole",
  title: ["Evaluating an Argument as a Whole", "整体评估论证"],
  summary: [
    "To evaluate a whole argument, trace its main claim, supporting claims and evidence, then find its weakest link: thin evidence, a gap in reasoning or an ignored opposing view.",
    "整体评估论证时，要理清它的主要论点、分论点和证据，再找出最薄弱的环节：证据单薄、推理有跳跃或忽视了对立观点。",
  ],
  intro: [
    "An argument can have a bold thesis and still collapse if one link gives way — a single anecdote backing a huge policy, a leap in logic, or silence about the strongest objection. Evaluating an argument as a whole means mapping its structure first and then stress-testing its weakest link.",
    "一篇议论文即便论点响亮，只要有一环撑不住就会垮掉——用单个小故事撑大政策、推理跳步，或对最有力的反对意见闭口不谈。整体评估论证要先理清三层结构，再精准找出最薄弱的一环。",
  ],
  after: ["tracing-an-argument", "relevant-and-sufficient-evidence", "acknowledging-conflicting-viewpoints"],
  points: [
    label(
      "the-part-of-the-argument",
      ["The Part of the Argument", "论证的组成部分"],
      [
        "A long argument has layers. The **main claim** is the one position the whole text defends: *Our town should welcome refugees.* **Supporting claims** are the reasons that hold it up, each a claim itself: *Newcomers have often revived dying towns.* And **evidence** is the facts, numbers and examples that back the supporting claims: *Utica's population fell for decades, then grew after 1990 as refugees arrived.*\n\n> **Watch out.** Distinguish **a supporting claim** from **evidence**: a supporting claim states a general *reason* why the main claim is right, while **evidence** gives a specific number, year, study, or named place to prove that reason.",
        "长篇论证是有层次的。**主要论点**是全文捍卫的唯一立场：*Our town should welcome refugees.* **分论点**是支撑它的理由，每一个本身也是一个论点：*Newcomers have often revived dying towns.* **证据**是支持分论点的事实、数字和例子：*Utica's population fell for decades, then grew after 1990 as refugees arrived.*\n\n> **注意。** 分清**分论点**和**证据**：分论点给出支持总论点的概括性*理由*，而**证据**拿出具体的数字、年份、研究或地名来证明这个理由。",
      ],
      [
        "In an essay arguing that the town should welcome refugees, what is this sentence?",
        "在一篇主张小镇应该接纳难民的文章中，这个句子是什么？",
      ],
      `
        Our town should open its doors to refugee families.|the main claim
        Newcomers have often brought dying towns back to life.|a supporting claim
        Utica, New York, lost people for decades, then grew again after 1990 as refugees settled there.|evidence
        We have a moral duty to help people fleeing war.|a supporting claim
        In 2023, more than a hundred million people worldwide had been forced from their homes.|evidence
        For these reasons, the council should vote yes on the welcome plan.|the main claim
        Refugees start businesses at a higher rate than people born here.|a supporting claim
        A 2017 study found that 13 percent of refugees in the United States owned a business.|evidence
        Welcoming refugees would make our town stronger, kinder and richer.|the main claim
        Our own history shows that immigrants made this town.|a supporting claim
        In 1900, two thirds of the town's mill workers had been born abroad.|evidence
        This town must choose to be a place of welcome.|the main claim
        Refugees fill jobs that local employers cannot fill.|a supporting claim
        The town's hospital reported forty unfilled jobs last year.|evidence
        I urge every citizen to support a welcome for refugees.|the main claim
        Children from many backgrounds enrich a school.|a supporting claim
        At Lincoln School, where a third of pupils speak another language at home, test scores have risen four years running.|evidence
        Welcoming refugees costs less than people fear.|a supporting claim
        The state pays for the first six months of housing for each family.|evidence
        Our town should accept the twenty families on the list this year.|the main claim
        Refugees pay back more in taxes than they receive over time.|a supporting claim
        A government study found that refugees paid 63 billion dollars more in taxes than they cost over ten years.|evidence
        The best answer to fear is to say yes to these families.|the main claim
        Most refugees learn the language quickly.|a supporting claim
        In one program, 80 percent of adult refugees passed a basic English test within two years.|evidence
        Refugee families tend to stay and put down roots.|a supporting claim
        Of the families who came to the town in 2010, nine in ten still live here.|evidence
        Our town should become a home to those who have lost theirs.|the main claim
        Helping refugees strengthens our town's good name.|a supporting claim
        After the last resettlement, a national newspaper named the town "the friendliest in the state."|evidence
      `,
      {
        "the main claim": L(
          "主要论点",
          "The sentence states the one position the whole essay defends.\n\n**Check.** Notice that it calls for the essay's overall action (*should open its doors*, *vote yes*, *must choose*, *urge every citizen*): every other paragraph exists to back this position.",
          "这个句子陈述了全文捍卫的唯一立场。\n\n**检验。** 它直接提出全文的总主张或行动呼吁，其他所有段落都是为支撑这一立场而服务。",
          "The sentence is not the position the whole essay defends.",
          "这个句子不是全文捍卫的立场。",
        ),
        "a supporting claim": L(
          "分论点",
          "The sentence gives one reason for the main claim; it is itself a claim that needs evidence.\n\n**Check.** Test the *because* link: *The town should welcome refugees BECAUSE [this sentence]* works, and the sentence still needs numbers or examples to back it up.",
          "这个句子给出主要论点的一个理由；它本身也是需要证据支持的论点。\n\n**检验。** 用“应该接纳难民，因为……”测试完全顺畅，而且这句话本身还需要数字或事例来证明。",
          "The sentence is not a general reason that supports the main claim.",
          "这个句子不是支持主要论点的概括性理由。",
        ),
        evidence: L(
          "证据",
          "The sentence gives a fact, number or example that backs up a supporting claim.\n\n**Check.** Spot the concrete data point (a named town or school, a year, a percentage, or a study result): it supplies factual proof rather than stating a general reason.",
          "这个句子给出支持分论点的事实、数字或例子。\n\n**检验。** 找出其中的具体事实（地名、校名、年份、百分比或研究结果）：它提供的是实证，而不是概括性理由。",
          "The sentence gives no specific fact, number or example.",
          "这个句子没有给出具体的事实、数字或例子。",
        ),
      },
    ),
    label(
      "the-weakest-link",
      ["The Weakest Link", "最薄弱的环节"],
      [
        "After tracing an argument, find where it is weakest. The **evidence may be thin**: a single story or one small study holds up a large claim. The **reasoning may skip a step**: the evidence is true, but it does not lead to the claim without an unstated, doubtful idea. Or the argument may **ignore the other side**, never answering the strongest objection to it.\n\n> **Watch out.** Pinpoint the exact flaw: one cousin, friend, or single case → **the evidence is thin**; an illogical leap from premise to conclusion (*so ...*) → **the reasoning skips a step**; explicitly omitting a major affected group or concern (*never mentions/discusses/addresses*) → **it ignores the other side**.",
        "理清论证之后，要找出它最薄弱的地方。**证据可能单薄**：一个故事或一项小研究支撑着一个大论点。**推理可能跳了一步**：证据是真的，但如果没有一个未说出的、可疑的想法，它推不出论点。或者论证可能**忽视了对立观点**，从未回应对它最有力的反对意见。\n\n> **注意。** 精准定位漏洞：只拿一个亲友或个案说事 → **证据单薄**；前提和 *so* 后的结论之间强行跳跃 → **推理跳了一步**；对受影响群体或明显担忧避而不谈 → **忽视了对立观点**。",
      ],
      ["What is the weakest link in this argument?", "这个论证最薄弱的环节是什么？"],
      `
        The town should build a new stadium, because my cousin's town built one and loved it.|the evidence is thin
        The new factory will employ three hundred people, so the town's crime will vanish.|the reasoning skips a step
        The town should build a highway through the park; it would speed up traffic. The essay never mentions the families who use the park.|it ignores the other side
        Homework should be banned. One student I know had too much homework and was unhappy.|the evidence is thin
        Students who read more get better grades, so the school should ban sports.|the reasoning skips a step
        The school should switch to a four-day week to save money. The essay never discusses parents who work on Fridays.|it ignores the other side
        Electric cars are the answer to pollution. A single driver said his electric car never broke down.|the evidence is thin
        Many people like dogs, so the city should allow dogs in every restaurant.|the reasoning skips a step
        The library should replace all books with tablets. The essay never addresses readers who cannot afford tablets.|it ignores the other side
        The diet works for everyone; a famous actor lost weight on it.|the evidence is thin
        Crime fell after the new mayor took office, so the mayor's speeches stopped crime.|the reasoning skips a step
        The city should ban cars from downtown to cut pollution. The essay never mentions shops that depend on drivers.|it ignores the other side
        Uniforms improve behavior; one school in another country reported fewer fights.|the evidence is thin
        The team lost its last game in the rain, so it should never play in the rain again.|the reasoning skips a step
        The town should cut taxes to bring in businesses. The essay never considers what services would be cut.|it ignores the other side
        Video games make children violent. A newspaper once reported one violent boy who played games.|the evidence is thin
        The museum's visitors doubled after it painted the doors red, so red doors attract visitors.|the reasoning skips a step
        The school should cancel music classes to add more math. The essay never discusses studies that link music and learning.|it ignores the other side
        The medicine is safe; two people took it without any problems.|the evidence is thin
        Most inventors were curious children, so every curious child will become an inventor.|the reasoning skips a step
        The country should close its borders to keep jobs for citizens. The essay never addresses businesses that need workers.|it ignores the other side
        Our town needs a skate park. My friend said it would be fun.|the evidence is thin
        Exercise is healthy, so the school day should be all gym classes.|the reasoning skips a step
        The town should build a dam for cheap electricity. The essay never mentions the valley that would be flooded.|it ignores the other side
        Organic food is healthier; a single farmer told me he feels great.|the evidence is thin
        The new principal arrived and test scores rose, so she must have raised them by herself.|the reasoning skips a step
        Phones should be banned from school entirely. The essay never discusses students who need phones for emergencies.|it ignores the other side
        Recycling is useless; I saw one recycling truck dump its load in a landfill.|the evidence is thin
        Many great writers were poor, so poverty makes people great writers.|the reasoning skips a step
        The town should sell the old forest to developers for housing. The essay never addresses the wildlife or the hikers.|it ignores the other side
      `,
      {
        "the evidence is thin": L(
          "证据单薄",
          "A single story, person or small case is asked to hold up a large claim; much more evidence is needed.\n\n**Check.** Count the evidence offered (*my cousin's town*, *one student*, *a single driver*, *two people*, *my friend*): one tiny anecdote cannot support a sweeping policy or rule.",
          "一个故事、一个人或一个小个案被用来支撑一个大论点；需要多得多的证据。\n\n**检验。** 数一数给出的论据（只有一个亲戚、一名学生、两位试用者或朋友一句话）：零星个案撑不起宏大论断。",
          "The argument's main weakness is not a lack of evidence.",
          "这个论证的主要弱点不是证据不足。",
        ),
        "the reasoning skips a step": L(
          "推理跳了一步",
          "The evidence may be true, but the claim does not follow from it without a doubtful idea the writer never states or defends.\n\n**Check.** Look at the *so* bridge between premise and conclusion: even if the first fact is completely true, it does not logically prove the extreme conclusion.",
          "证据也许是真的，但如果没有一个作者从未说明或论证的可疑想法，论点推不出来。\n\n**检验。** 看前提和 *so* 后结论之间的跨度：就算前半句完全属实，也推不出后半句的极端结论。",
          "The argument's main weakness is not a jump in its reasoning.",
          "这个论证的主要弱点不是推理上的跳跃。",
        ),
        "it ignores the other side": L(
          "忽视了对立观点",
          "The argument never answers an obvious, serious objection, so readers who hold it will not be convinced.\n\n**Check.** Notice the second sentence pointing out a major stakeholder or drawback that the essay never mentions, discusses, or addresses.",
          "这个论证从未回应一个明显而严肃的反对意见，所以持这种意见的读者不会被说服。\n\n**检验。** 第二句明确点出了文章闭口不谈的关键受影响群体或明显弊端，说明论证回避了反方观点。",
          "The argument's main weakness is not an ignored objection.",
          "这个论证的主要弱点不是忽视了反对意见。",
        ),
      },
    ),
  ],
});

/** readingTopics8b are the reading topics of the last units of grade 8. */
export const readingTopics8b: readonly TopicDef[] = [
  scientificArgument,
  irrelevant,
  unreliable,
  gothic,
  shakespeareScene,
  production,
  oralHistory,
  memoirReport,
  oldTales,
  wholeArgument,
];
