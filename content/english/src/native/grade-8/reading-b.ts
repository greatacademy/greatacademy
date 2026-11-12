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
  after: ["checking-a-claim-against-the-evidence", "correlation-or-cause"],
  points: [
    label(
      "is-the-test-sound",
      ["Is the Test Sound", "检验是否可靠"],
      [
        "Before trusting a scientific claim, look at how the evidence was gathered. A **sound test** studies many cases and compares them with a group that did not get the treatment. A test with **too few cases** may show only chance: two finches are not a population. A test with **no comparison** cannot show that the treatment made the difference, because we do not know what would have happened without it.",
        "在相信一个科学论断之前，要看证据是怎样收集的。**可靠的检验**研究许多个案，并把它们与没有接受处理的一组作比较。**样本太少**的检验可能只反映了偶然：两只雀鸟代表不了一个种群。**没有对照**的检验无法证明是处理带来了差别，因为我们不知道如果不处理会怎样。",
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
          "The test studies many cases and compares them with a group that did not get the treatment, so a real difference can show up.",
          "这个检验研究了许多个案，并与没有接受处理的一组作比较，所以能显示真正的差别。",
          "The test lacks enough cases or a group to compare with.",
          "这个检验缺少足够的个案或对照组。",
        ),
        "too few cases": L(
          "样本太少",
          "The test looks at only a handful of cases, so its result may be just chance.",
          "这个检验只看了少数几个个案，所以结果可能只是偶然。",
          "The test studies plenty of cases.",
          "这个检验研究的个案足够多。",
        ),
        "no comparison": L(
          "没有对照",
          "The test studies many cases but has no group without the treatment, so we cannot tell whether the treatment made the difference.",
          "这个检验研究了许多个案，但没有不接受处理的对照组，所以无法判断是不是处理带来了差别。",
          "The test does compare with a group that did not get the treatment, or it has too few cases to matter.",
          "这个检验确实与未处理组作了比较，或者个案太少，谈不上对照。",
        ),
      },
    ),
    label(
      "does-the-conclusion-follow",
      ["Does the Conclusion Follow", "结论是否成立"],
      [
        "Even good evidence can be stretched too far. A conclusion that **follows** stays within what was found: *Finches with deeper beaks survived the drought better.* A conclusion that **claims too much** goes beyond the evidence, to all animals, all times or certainty: *This proves evolution explains everything.* And a conclusion that **mistakes a link for a cause** treats two things that happen together as if one caused the other.",
        "即使证据很好，也可能被引申得太远。**成立的结论**不超出发现的范围：*Finches with deeper beaks survived the drought better.* **说得太多的结论**超越了证据，扩展到所有动物、所有时代或断言绝对确定：*This proves evolution explains everything.* **把关联当作因果的结论**把同时发生的两件事当作一件导致另一件。",
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
          "The conclusion stays within what the evidence showed, about these animals in these conditions.",
          "这个结论没有超出证据所显示的范围，只涉及这些动物和这些条件。",
          "The conclusion goes beyond the evidence or treats a link as a cause.",
          "这个结论超出了证据，或把关联当作了因果。",
        ),
        "claims too much": L(
          "说得太多",
          "The conclusion stretches the finding to all living things, all times or the future, far beyond what was studied.",
          "这个结论把发现扩展到所有生物、所有时代或未来，远远超出了研究的范围。",
          "The conclusion does not stretch the finding beyond what was studied.",
          "这个结论没有把发现扩展到研究范围之外。",
        ),
        "mistakes a link for a cause": L(
          "把关联当作因果",
          "Two things happen together, but the conclusion assumes one causes the other, when something else may explain both.",
          "两件事同时出现，结论却认定一件导致另一件，而实际上可能是别的因素同时导致了两者。",
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
  after: ["relevant-and-sufficient-evidence"],
  points: [
    label(
      "relevant-or-not",
      ["Relevant or Not", "相关还是无关"],
      [
        "Evidence is **relevant** when, if true, it makes the claim more likely. Irrelevant evidence comes in disguises. Some is **off the question**: it is true, but about something else. Some **attacks the person** who holds a view instead of the view itself. Some **appeals to the crowd**, saying many people believe a thing, as if that made it true.",
        "证据如果属实能让论点更可能成立，就是**相关的**。无关的证据常常有伪装。有的**离开了问题**：它是真的，但说的是别的事。有的**攻击人身**，针对持观点的人而不是观点本身。有的**诉诸大众**，说很多人相信某事，好像这就能证明它是真的。",
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
          "If true, this evidence makes the claim more likely: it shows evolution at work or a pattern that evolution explains.",
          "如果属实，这条证据会让论点更可能成立：它显示了进化在起作用，或显示了进化能解释的规律。",
          "This evidence, even if true, does not make the claim more likely.",
          "即使属实，这条证据也不会让论点更可能成立。",
        ),
        "off the question": L(
          "离开了问题",
          "The fact may be true, but it is about something else, such as Darwin's life, and says nothing about whether the theory is right.",
          "这个事实也许是真的，但说的是别的事，比如达尔文的生活，与理论是否正确毫无关系。",
          "This evidence is not simply a fact about something unrelated.",
          "这条证据并不只是与此无关的事实。",
        ),
        "attacks the person": L(
          "攻击人身",
          "The evidence is about the character of someone on one side, not about the idea; a rude person can still be right or wrong.",
          "这条证据说的是某一方某个人的品行，而不是观点本身；一个粗鲁的人也可能是对的或错的。",
          "This evidence does not target a person's character.",
          "这条证据并没有针对某个人的品行。",
        ),
        "appeals to the crowd": L(
          "诉诸大众",
          "The evidence says that many people believe or like the idea, but popularity does not make an idea true.",
          "这条证据说很多人相信或喜欢这个观点，但受欢迎并不能证明观点正确。",
          "This evidence does not rest on how many people believe something.",
          "这条证据并不依赖于有多少人相信某事。",
        ),
      },
    ),
    label(
      "what-is-wrong-with-it",
      ["What Is Wrong With It", "问题出在哪里"],
      [
        "Once you suspect evidence is irrelevant, name the problem. Is it **off the question**, a true fact about something else? Does it **attack the person**, judging the speaker instead of the idea? Or does it **appeal to the crowd**, treating popularity, fame or tradition as proof? Naming the trick helps you answer it.",
        "一旦怀疑证据无关，就要说出问题所在。它是**离开了问题**，是关于别的事情的真实事实吗？它是**攻击人身**，评判说话的人而不是观点吗？还是**诉诸大众**，把流行、名气或传统当作证据？说出这个伎俩，有助于你回应它。",
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
          "The evidence is about something that has nothing to do with whether the claim is true.",
          "这条证据说的是与论点是否成立毫无关系的事情。",
          "The evidence does more than mention an unrelated fact.",
          "这条证据不只是提到一个无关的事实。",
        ),
        "attacks the person": L(
          "攻击人身",
          "The evidence insults or judges the people on the other side instead of answering their reasons.",
          "这条证据侮辱或评判对方的人，而不是回应他们的理由。",
          "The evidence does not judge a person's character.",
          "这条证据没有评判某个人的品行。",
        ),
        "appeals to the crowd": L(
          "诉诸大众",
          "The evidence treats popularity, fame or long custom as proof, but many people can be wrong together.",
          "这条证据把流行、名气或长期的习惯当作证据，但很多人可能一起犯错。",
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
  after: ["contrasting-points-of-view"],
  points: [
    label(
      "why-not-trust-the-narrator",
      ["Why Not Trust the Narrator", "为什么不能信任叙述者"],
      [
        "A first-person narrator tells us only what they see and believe. Some are **too innocent to understand**: a small child may describe a quarrel without grasping what it means. Some **have something to hide**: a narrator who did wrong may bend the story to look good. And some are **not in their right mind**: fear, illness or madness twists what they report, as in the tales of Edgar Allan Poe.",
        "第一人称叙述者只告诉我们他们看到和相信的东西。有些叙述者**太天真，不明白真相**：小孩可能描述了一场争吵，却不懂它意味着什么。有些**有所隐瞒**：做了错事的叙述者可能歪曲故事，让自己显得好些。还有些**神志不清**：恐惧、疾病或疯狂扭曲了他们的讲述，就像埃德加·爱伦·坡的故事那样。",
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
          "The narrator, often a child, reports what happened honestly but misses what it means; the reader understands more.",
          "叙述者（常常是孩子）如实讲述发生的事，却没明白它的意思；读者懂得更多。",
          "This narrator is not an innocent who simply misunderstands.",
          "这个叙述者并不是一个只是误解了的天真者。",
        ),
        "has something to hide": L(
          "有所隐瞒",
          "The narrator has done wrong and bends the story to look innocent, and the excuses give the truth away.",
          "叙述者做了错事，歪曲故事以显得无辜，而那些借口恰恰泄露了真相。",
          "This narrator is not defending their own wrongdoing.",
          "这个叙述者并没有为自己的过错辩解。",
        ),
        "not in their right mind": L(
          "神志不清",
          "Fear, illness or madness makes the narrator see or hear things that are probably not there.",
          "恐惧、疾病或疯狂让叙述者看到或听到可能并不存在的东西。",
          "This narrator's mind is not disturbed in this way.",
          "这个叙述者的神志并没有这样被扰乱。",
        ),
      },
    ),
    label(
      "the-clue-to-the-truth",
      ["The Clue to the Truth", "揭示真相的线索"],
      [
        "Readers catch an unreliable narrator through clues the writer plants. The narrator may **contradict themselves**, saying one thing and later another. **Others react differently**: other characters look frightened, laugh or say the opposite, which shows the narrator is wrong. Or the narrator **protests too much**, insisting again and again that they are calm, sane or innocent, which makes us doubt them.",
        "读者通过作者埋下的线索识破不可靠的叙述者。叙述者可能**自相矛盾**，前面说一件事，后面又说另一件。**其他人的反应不同**：别的人物显得害怕、发笑或说出相反的话，表明叙述者错了。或者叙述者**极力辩白**，一再坚称自己很冷静、神志正常或清白，这反而让我们怀疑。",
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
          "The narrator says one thing and later lets slip the opposite, so at least one of the two statements is false.",
          "叙述者先说一件事，后来又无意中说出相反的话，所以至少有一句是假的。",
          "The narrator does not say two things that clash.",
          "叙述者并没有说出两句相互冲突的话。",
        ),
        "others react differently": L(
          "其他人的反应不同",
          "Other people's actions show the opposite of what the narrator claims, so we trust what we see over what we are told.",
          "其他人的行为表明情况与叙述者所说的相反，所以我们相信看到的，而不是被告知的。",
          "No other character's reaction is set against the narrator's words here.",
          "这里没有用其他人物的反应来对照叙述者的话。",
        ),
        "protests too much": L(
          "极力辩白",
          "The narrator repeats a denial over and over, and the very insistence makes us suspect the opposite.",
          "叙述者一再重复否认，正是这种坚持让我们怀疑事实恰恰相反。",
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
  after: ["tone-and-mood", "how-setting-shapes-a-story"],
  points: [
    label(
      "the-gothic-element",
      ["The Gothic Element", "哥特元素"],
      [
        "Gothic fiction, from the 1700s to Poe and beyond, is built from a few familiar elements. A **gloomy setting**: a crumbling castle, a crypt, a storm on a moor. **The supernatural**, or the hint of it: ghosts, curses, a portrait that seems to move. And **a dark secret** from the past: a hidden crime, a locked room, a family's buried shame that slowly comes to light.",
        "哥特小说从十八世纪到坡乃至以后，由几种熟悉的元素构成。**阴森的环境**：摇摇欲坠的城堡、墓穴、荒原上的暴风雨。**超自然**或对它的暗示：鬼魂、诅咒、仿佛会动的肖像。还有来自过去的**黑暗秘密**：隐藏的罪行、锁着的房间、慢慢暴露出来的家族耻辱。",
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
          "The detail paints a dark, decaying or stormy place that fills the story with gloom.",
          "这个细节描绘了黑暗、破败或风雨交加的地方，让故事充满阴郁。",
          "The detail is not mainly a description of a gloomy place.",
          "这个细节主要不是对阴森环境的描写。",
        ),
        "the supernatural": L(
          "超自然",
          "The detail hints at something beyond nature, such as a ghost, a curse or an object that moves by itself.",
          "这个细节暗示了超自然的东西，如鬼魂、诅咒或自己会动的物体。",
          "Nothing beyond nature is suggested by this detail.",
          "这个细节没有暗示任何超自然的东西。",
        ),
        "a dark secret": L(
          "黑暗秘密",
          "The detail points to something hidden from the past, such as a crime or a shame that people refuse to speak of.",
          "这个细节指向过去被隐藏的事情，如人们不愿提起的罪行或耻辱。",
          "The detail does not point to a hidden past.",
          "这个细节没有指向被隐藏的过去。",
        ),
      },
    ),
    label(
      "how-the-writer-builds-dread",
      ["How the Writer Builds Dread", "作者如何营造恐惧"],
      [
        "Gothic writers do not just name frightening things; they make us feel them. **Sensory detail** puts us in the scene through sound, smell and touch: *the stink of wet stone*. An **omen** is a sign that something bad will come: a raven on the gate, a cracked mirror. And **delay** holds back the reveal, making us wait: the hand on the doorknob, the slow creak, the pause before the door swings open.",
        "哥特作家不只是说出可怕的东西，而是让我们感受到它们。**感官细节**通过声音、气味和触觉把我们带入场景：*the stink of wet stone*。**预兆**是坏事将至的征兆：大门上的乌鸦、裂开的镜子。**延宕**推迟揭示真相，让我们等待：门把上的手、缓慢的吱嘎声、门打开之前的停顿。",
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
          "The sentence makes us hear, smell, touch or taste the scene, so the fear feels close and real.",
          "这个句子让我们听到、闻到、摸到或尝到场景，所以恐惧显得真切而逼近。",
          "The sentence does not mainly work through the senses.",
          "这个句子主要不是通过感官起作用的。",
        ),
        "an omen": L(
          "预兆",
          "The sentence shows a sign, often from nature, that warns something bad is coming.",
          "这个句子显示了一个征兆（常常来自自然），预示坏事即将到来。",
          "The sentence shows no warning sign of what is to come.",
          "这个句子没有显示预示未来的征兆。",
        ),
        delay: L(
          "延宕",
          "The sentence slows the action and holds back the reveal, so we must wait in suspense.",
          "这个句子放慢了动作、推迟了揭示，让我们在悬念中等待。",
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
  after: ["early-modern-english-words"],
  points: [
    label(
      "who-is-the-speech-for",
      ["Who Is the Speech For", "这段台词是说给谁听的"],
      [
        "In a play, it matters who is meant to hear a speech. In **dialogue**, characters speak to each other. In a **soliloquy**, a character alone on stage thinks aloud, so we hear their true thoughts: Hamlet's *To be, or not to be*. In an **aside**, a character speaks a quick line to the audience that the others on stage do not hear, often to share a secret or a joke.",
        "在戏剧中，台词是说给谁听的很重要。在**对话**中，人物彼此交谈。在**独白**中，人物独自在台上自言自语，所以我们听到了他的真实想法：哈姆雷特的 *To be, or not to be*。在**旁白**中，人物对观众说一句简短的话，台上其他人听不见，常用来透露秘密或开玩笑。",
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
          "The characters speak to and answer each other, and all of them hear what is said.",
          "人物彼此交谈、互相回应，所说的话他们都听得见。",
          "The speech is not an exchange that the characters all hear.",
          "这段台词不是人物都能听见的交谈。",
        ),
        "a soliloquy": L(
          "独白",
          "A character alone on stage thinks aloud, letting the audience hear their private thoughts.",
          "人物独自在台上自言自语，让观众听到他的内心想法。",
          "The character is not alone on stage thinking aloud.",
          "人物并不是独自在台上自言自语。",
        ),
        "an aside": L(
          "旁白",
          "A character speaks a short line to the audience while others are on stage, and the others do not hear it.",
          "人物在其他人在场时对观众说一句简短的话，其他人听不见。",
          "This is not a quick line to the audience that others on stage cannot hear.",
          "这不是台上其他人听不见的、对观众说的简短台词。",
        ),
      },
    ),
    choose(
      "the-line-in-plain-english",
      ["The Line in Plain English", "用平实的英语说出台词"],
      [
        "To read Shakespeare, turn each line into plain modern English. Watch for the old words (*thou*, *art*, *wherefore*), the inverted word order (*Sweet are the uses of adversity*) and the images. *Wherefore art thou Romeo?* does not ask where Romeo is; it asks **why** he must be Romeo, a Montague. Read the whole sentence, put the subject first, then say it as you would today.",
        "读莎士比亚时，要把每行台词转换成平实的现代英语。注意古词（*thou*、*art*、*wherefore*）、倒装语序（*Sweet are the uses of adversity*）和意象。*Wherefore art thou Romeo?* 不是问罗密欧在哪里，而是问他**为什么**偏偏是罗密欧，一个蒙太古家的人。读完整句话，把主语放在前面，再用今天的说法说出来。",
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
      (right) => [`In plain English: **${right}**`, `用平实的英语说：**${right}**`],
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
  after: ["parts-of-a-play", "comparing-texts-on-a-topic"],
  points: [
    label(
      "what-kind-of-choice",
      ["What Kind of Choice", "哪一种选择"],
      [
        "A script gives the words, but a production must decide the rest. Some choices are about **set and lighting**: where and when the scene seems to take place, and how it looks. Some are **acting choices**: how an actor speaks, moves and reacts. And some are **changes to the script**: lines cut, moved or rewritten by the director.",
        "剧本给出台词，但演出必须决定其余的一切。有些选择关于**布景和灯光**：场景似乎发生在哪里、什么时候，看起来是什么样子。有些是**表演选择**：演员怎样说话、动作和反应。还有些是**对剧本的改动**：导演删去、移动或改写台词。",
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
          "The choice is about how the stage looks: the place, the time, the light and the objects on it.",
          "这个选择关于舞台的样子：地点、时间、灯光和台上的物件。",
          "The choice is not about how the stage looks.",
          "这个选择与舞台的样子无关。",
        ),
        "an acting choice": L(
          "表演选择",
          "The choice is about how an actor speaks, moves or reacts while saying the script's words.",
          "这个选择关于演员在说剧本台词时怎样说话、动作或反应。",
          "The choice is not about how an actor performs.",
          "这个选择与演员的表演无关。",
        ),
        "a change to the script": L(
          "对剧本的改动",
          "The choice changes the words themselves: lines are cut, moved, given to others or rewritten.",
          "这个选择改动了台词本身：删去、移动、交给别人说或改写。",
          "The choice leaves the script's words as they are.",
          "这个选择没有改动剧本的台词。",
        ),
      },
    ),
    label(
      "faithful-or-changed",
      ["Faithful or Changed", "忠实还是改动"],
      [
        "Comparing a production with the script, ask how close it stays. Some choices are **faithful to the script**: they do what the stage directions and lines call for. Some **cut or change** what the script has. Others **add** something the script does not have at all: a silent scene, a new character, a song or a final image the playwright never wrote.",
        "把演出与剧本比较时，要问它与剧本有多接近。有些选择**忠于剧本**：按照舞台说明和台词的要求去做。有些**删减或改动**了剧本原有的内容。还有些**增添**了剧本根本没有的东西：一段无声的场面、一个新人物、一首歌或剧作家从未写过的结尾画面。",
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
          "The production does what the script's words and stage directions call for.",
          "演出按照剧本的台词和舞台说明的要求去做。",
          "The production does not simply do what the script calls for.",
          "演出并不是简单地按剧本要求去做。",
        ),
        "cuts or changes it": L(
          "删减或改动",
          "The production removes or alters something that the script has: words, characters, events or setting.",
          "演出删去或改动了剧本原有的东西：台词、人物、情节或背景。",
          "The production does not cut or alter what the script has.",
          "演出没有删减或改动剧本原有的内容。",
        ),
        "adds something new": L(
          "增添新内容",
          "The production adds something the script does not have at all, such as a scene, character or song.",
          "演出增添了剧本根本没有的东西，如一场戏、一个人物或一首歌。",
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
  after: ["conflicting-accounts-of-one-event"],
  points: [
    label(
      "whose-words-are-these",
      ["Whose Words Are These", "这是谁的话"],
      [
        "An oral history is usually printed as an interview. Most of it is **the speaker's memory**, in their own words. It also includes **the interviewer's question**, usually in a different type or marked *Q*. And the historian who edits it often adds **an editor's note**, in square brackets or a footnote, to explain a name, a place or a date the speaker mentions.",
        "口述历史通常以访谈的形式印出。大部分是**讲述者的回忆**，用他们自己的话说。其中也有**采访者的提问**，通常用不同的字体或标为 *Q*。编辑访谈的历史学家还常常加上**编者注**，放在方括号或脚注里，解释讲述者提到的名字、地方或日期。",
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
          "These are the speaker's own words about what they lived through, often full of personal detail.",
          "这是讲述者用自己的话讲述的亲身经历，常常充满个人细节。",
          "These words are not the speaker's own memories.",
          "这些话不是讲述者自己的回忆。",
        ),
        "the interviewer's question": L(
          "采访者的提问",
          "The line, marked *Q*, is a question that prompts the speaker to remember.",
          "这一行标为 *Q*，是引导讲述者回忆的问题。",
          "This line is not a question from the interviewer.",
          "这一行不是采访者的提问。",
        ),
        "an editor's note": L(
          "编者注",
          "The words in square brackets were added by the historian to explain a name, place or date.",
          "方括号中的话是历史学家加上的，用来解释名字、地方或日期。",
          "These words are not a note added by the editor.",
          "这些话不是编者加的注释。",
        ),
      },
    ),
    label(
      "how-far-to-trust-it",
      ["How Far to Trust It", "可以相信到什么程度"],
      [
        "Oral histories are precious because they keep what records leave out: what it **felt like** to live through an event. A speaker's own feelings and experiences can be trusted as their memory. But **exact dates and numbers**, recalled decades later, should be checked against records. And things the speaker did not see but **only heard about** from others are hearsay, the weakest kind of evidence.",
        "口述历史之所以珍贵，是因为它保留了记录所遗漏的东西：亲身经历一件事**是什么感受**。讲述者自己的感受和经历可以当作他的回忆来相信。但几十年后回忆起的**确切日期和数字**，应该与记录核对。讲述者没有亲眼看见、**只是听别人说**的事是传闻，是最弱的证据。",
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
          "The speaker describes their own feelings or experience, which only they can tell and which records rarely keep.",
          "讲述者描述自己的感受或经历，这只有他们能讲，而记录很少保存。",
          "This is not the speaker's own feeling or experience.",
          "这不是讲述者自己的感受或经历。",
        ),
        "check it against records": L(
          "与记录核对",
          "An exact date, number or fact recalled many years later may be wrong, so records of the time should be checked.",
          "多年后回忆的确切日期、数字或事实可能有误，所以要查阅当时的记录。",
          "The statement is not an exact date, number or checkable fact.",
          "这句话不是确切的日期、数字或可以核实的事实。",
        ),
        "hearsay: only heard about": L(
          "传闻：只是听说",
          "The speaker did not see this but heard it from others, so it is hearsay, the weakest kind of evidence.",
          "讲述者没有亲眼看见，而是听别人说的，所以这是传闻，是最弱的证据。",
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
  after: ["memoir-or-fiction", "comparing-texts-on-a-topic"],
  points: [
    label(
      "what-kind-of-source",
      ["What Kind of Source", "哪一种资料"],
      [
        "Texts on the same subject can come from very different kinds of source. A **memoir** tells the writer's own story in the first person, with feelings and personal detail. A **government report** gives facts, numbers and findings in a neutral voice, about many people at once. A **letter to a newspaper** argues a view, trying to persuade readers of what should be done.",
        "同一题材的文本可能来自截然不同的资料。**回忆录**以第一人称讲述作者自己的故事，带有感情和个人细节。**政府报告**用中立的口吻给出关于许多人的事实、数字和调查结果。**致报社的信**陈述观点，试图说服读者应该怎么做。",
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
          "The sentence tells the writer's own experience in the first person, with personal detail and feeling.",
          "这个句子以第一人称讲述作者自己的经历，带有个人细节和感情。",
          "The sentence does not tell the writer's own experience with feeling.",
          "这个句子没有带着感情讲述作者自己的经历。",
        ),
        "a government report": L(
          "政府报告",
          "The sentence gives facts or numbers about many people in a neutral voice, as a report does.",
          "这个句子用中立的口吻给出关于许多人的事实或数字，就像报告那样。",
          "The sentence gives no neutral facts or numbers about many people.",
          "这个句子没有给出关于许多人的中立事实或数字。",
        ),
        "a letter to a newspaper": L(
          "致报社的信",
          "The sentence argues for what should be done, often with strong words like *must*, *shame* or *urge*.",
          "这个句子主张应该怎么做，常用 *must*、*shame* 或 *urge* 等强烈的词语。",
          "The sentence does not argue for what should be done.",
          "这个句子没有主张应该怎么做。",
        ),
      },
    ),
    label(
      "which-source-answers-it",
      ["Which Source Answers It", "哪一种资料能回答"],
      [
        "Each kind of source answers different questions. A **memoir** answers questions about one person's feelings and daily life: *What was the first night like?* A **report** answers questions about how many, how much and how often, across many people. A **photograph** answers questions about how something looked at a moment: the clothes, the rooms, the faces.",
        "每种资料能回答不同的问题。**回忆录**回答关于一个人的感受和日常生活的问题：*What was the first night like?* **报告**回答关于许多人的多少、多大和多频繁的问题。**照片**回答某一时刻某物看起来是什么样子的问题：衣服、房间、面孔。",
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
          "The question asks about one person's feelings, thoughts or daily life, which only their own story can tell.",
          "这个问题问的是一个人的感受、想法或日常生活，只有他自己的故事才能讲述。",
          "The question is not about one person's feelings or life.",
          "这个问题与一个人的感受或生活无关。",
        ),
        "the report": L(
          "报告",
          "The question asks how many, how much or how often across many people, which a report's numbers answer.",
          "这个问题问的是许多人当中的多少、多大或多频繁，报告中的数字能回答。",
          "The question does not ask for numbers about many people.",
          "这个问题不是在问关于许多人的数字。",
        ),
        "the photograph": L(
          "照片",
          "The question asks how something looked at a moment, which a picture shows best.",
          "这个问题问的是某一时刻某物看起来是什么样子，照片最能显示。",
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
  after: ["archetypes-in-stories", "words-from-myths"],
  points: [
    label(
      "the-old-tale-behind-it",
      ["The Old Tale Behind It", "背后的古老传说"],
      [
        "Many modern stories are built on old ones. A boy who builds wings from a kite and flies too close to danger echoes **Icarus**. A poor girl helped to a ball by a kind stranger echoes **Cinderella**. Two teenagers from feuding families who fall in love echo **Romeo and Juliet**. Spotting the old tale lets you see what the writer has kept and what the writer has changed.",
        "许多现代故事建立在古老故事的基础上。一个男孩用风筝做成翅膀、飞得离危险太近，呼应了**伊卡洛斯**。一个穷女孩在好心陌生人的帮助下去参加舞会，呼应了**灰姑娘**。两个来自世仇家族的少年相爱，呼应了**罗密欧与朱丽叶**。认出古老的故事，就能看出作者保留了什么、改变了什么。",
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
          "Like Icarus, who flew too close to the sun on wax wings, the character ignores a warning, rises too high and falls.",
          "就像用蜡做的翅膀飞得离太阳太近的伊卡洛斯，这个人物不听警告、飞得太高而坠落。",
          "The story does not follow Icarus's pattern of rising too high and falling.",
          "这个故事没有沿用伊卡洛斯飞得太高而坠落的模式。",
        ),
        Cinderella: L(
          "灰姑娘",
          "Like Cinderella, a mistreated girl or boy is helped to a grand event and noticed there, often leaving something behind.",
          "就像灰姑娘，一个受虐待的人在帮助下去参加盛会并被注意到，常常留下某样东西。",
          "The story does not follow Cinderella's pattern.",
          "这个故事没有沿用灰姑娘的模式。",
        ),
        "Romeo and Juliet": L(
          "罗密欧与朱丽叶",
          "Like Romeo and Juliet, two young people from feuding sides fall in love, often with a tragic end.",
          "就像罗密欧与朱丽叶，来自敌对双方的两个年轻人相爱，结局常常是悲剧。",
          "The story does not follow the pattern of lovers from feuding sides.",
          "这个故事没有沿用敌对双方恋人的模式。",
        ),
        Orpheus: L(
          "俄耳甫斯",
          "Like Orpheus, who went to the underworld to bring back his wife, the character tries to rescue a lost love and fails by looking back or doubting.",
          "就像去冥界带回妻子的俄耳甫斯，这个人物试图救回失去的爱人，却因回头或怀疑而失败。",
          "The story does not follow Orpheus's pattern.",
          "这个故事没有沿用俄耳甫斯的模式。",
        ),
        "King Midas": L(
          "迈达斯国王",
          "Like King Midas, whose touch turned everything to gold, the character's greed brings a gift that ruins life.",
          "就像点物成金的迈达斯国王，这个人物的贪婪带来了毁掉生活的“礼物”。",
          "The story does not follow the pattern of a greedy wish that backfires.",
          "这个故事没有沿用贪婪的愿望适得其反的模式。",
        ),
        Pandora: L(
          "潘多拉",
          "Like Pandora, the character opens something forbidden and lets troubles into the world, with hope left behind.",
          "就像潘多拉，这个人物打开了被禁止打开的东西，让灾祸进入世界，只留下了希望。",
          "The story does not follow Pandora's pattern.",
          "这个故事没有沿用潘多拉的模式。",
        ),
        Odysseus: L(
          "奥德修斯",
          "Like Odysseus, the character makes a long, dangerous journey home after a war or voyage.",
          "就像奥德修斯，这个人物在战争或航行后踏上漫长而危险的归途。",
          "The story does not follow the pattern of a long journey home.",
          "这个故事没有沿用漫长归途的模式。",
        ),
        Narcissus: L(
          "那喀索斯",
          "Like Narcissus, who fell in love with his own reflection, the character becomes lost in love of their own image.",
          "就像爱上自己倒影的那喀索斯，这个人物沉迷于自己的形象。",
          "The story does not follow the pattern of self-love.",
          "这个故事没有沿用自恋的模式。",
        ),
        Prometheus: L(
          "普罗米修斯",
          "Like Prometheus, who stole fire from the gods for humans, the character gives a forbidden gift to people and is punished.",
          "就像为人类从众神那里盗取火种的普罗米修斯，这个人物把被禁止的礼物送给人们，并因此受罚。",
          "The story does not follow Prometheus's pattern.",
          "这个故事没有沿用普罗米修斯的模式。",
        ),
      },
    ),
    label(
      "what-the-retelling-does",
      ["What the Retelling Does", "改写做了什么"],
      [
        "A retelling can treat its source in three ways. It can **keep the old pattern**, telling the same story with the same meaning. It can **move it to a new setting**, keeping the plot but placing it in a modern city, a school or outer space. Or it can **turn it upside down**, reversing the roles or the ending to make a new point: Cinderella rescues the prince, or Pandora's box saves the world.",
        "改写可以用三种方式处理原作。它可以**保留原有模式**，用同样的意义讲同一个故事。它可以**换到新的背景**，保留情节，但把它放在现代城市、学校或外太空中。或者它可以**把它颠倒过来**，反转角色或结局以表达新的观点：灰姑娘救了王子，或者潘多拉的盒子拯救了世界。",
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
          "The retelling tells the same story in the same kind of world, with the same meaning.",
          "这个改写在同样的世界里讲同一个故事，意义也相同。",
          "The retelling changes the setting or reverses the story.",
          "这个改写改变了背景或颠倒了故事。",
        ),
        "moves it to a new setting": L(
          "换到新的背景",
          "The retelling keeps the plot but places it in a new time or place, such as a modern city or outer space.",
          "这个改写保留了情节，但把它放在新的时代或地点，如现代城市或外太空。",
          "The retelling does not move the story to a new time or place.",
          "这个改写没有把故事搬到新的时代或地点。",
        ),
        "turns it upside down": L(
          "颠倒过来",
          "The retelling reverses the roles or the ending, changing what the old story means.",
          "这个改写反转了角色或结局，改变了古老故事的意义。",
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
  after: ["tracing-an-argument", "relevant-and-sufficient-evidence", "acknowledging-conflicting-viewpoints"],
  points: [
    label(
      "the-part-of-the-argument",
      ["The Part of the Argument", "论证的组成部分"],
      [
        "A long argument has layers. The **main claim** is the one position the whole text defends: *Our town should welcome refugees.* **Supporting claims** are the reasons that hold it up, each a claim itself: *Newcomers have often revived dying towns.* And **evidence** is the facts, numbers and examples that back the supporting claims: *Utica's population fell for decades, then grew after 1990 as refugees arrived.*",
        "长篇论证是有层次的。**主要论点**是全文捍卫的唯一立场：*Our town should welcome refugees.* **分论点**是支撑它的理由，每一个本身也是一个论点：*Newcomers have often revived dying towns.* **证据**是支持分论点的事实、数字和例子：*Utica's population fell for decades, then grew after 1990 as refugees arrived.*",
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
          "The sentence states the one position the whole essay defends.",
          "这个句子陈述了全文捍卫的唯一立场。",
          "The sentence is not the position the whole essay defends.",
          "这个句子不是全文捍卫的立场。",
        ),
        "a supporting claim": L(
          "分论点",
          "The sentence gives one reason for the main claim; it is itself a claim that needs evidence.",
          "这个句子给出主要论点的一个理由；它本身也是需要证据支持的论点。",
          "The sentence is not a general reason that supports the main claim.",
          "这个句子不是支持主要论点的概括性理由。",
        ),
        evidence: L(
          "证据",
          "The sentence gives a fact, number or example that backs up a supporting claim.",
          "这个句子给出支持分论点的事实、数字或例子。",
          "The sentence gives no specific fact, number or example.",
          "这个句子没有给出具体的事实、数字或例子。",
        ),
      },
    ),
    label(
      "the-weakest-link",
      ["The Weakest Link", "最薄弱的环节"],
      [
        "After tracing an argument, find where it is weakest. The **evidence may be thin**: a single story or one small study holds up a large claim. The **reasoning may skip a step**: the evidence is true, but it does not lead to the claim without an unstated, doubtful idea. Or the argument may **ignore the other side**, never answering the strongest objection to it.",
        "理清论证之后，要找出它最薄弱的地方。**证据可能单薄**：一个故事或一项小研究支撑着一个大论点。**推理可能跳了一步**：证据是真的，但如果没有一个未说出的、可疑的想法，它推不出论点。或者论证可能**忽视了对立观点**，从未回应对它最有力的反对意见。",
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
          "A single story, person or small case is asked to hold up a large claim; much more evidence is needed.",
          "一个故事、一个人或一个小个案被用来支撑一个大论点；需要多得多的证据。",
          "The argument's main weakness is not a lack of evidence.",
          "这个论证的主要弱点不是证据不足。",
        ),
        "the reasoning skips a step": L(
          "推理跳了一步",
          "The evidence may be true, but the claim does not follow from it without a doubtful idea the writer never states or defends.",
          "证据也许是真的，但如果没有一个作者从未说明或论证的可疑想法，论点推不出来。",
          "The argument's main weakness is not a jump in its reasoning.",
          "这个论证的主要弱点不是推理上的跳跃。",
        ),
        "it ignores the other side": L(
          "忽视了对立观点",
          "The argument never answers an obvious, serious objection, so readers who hold it will not be convinced.",
          "这个论证从未回应一个明显而严肃的反对意见，所以持这种意见的读者不会被说服。",
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
