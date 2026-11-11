// College writing: the second step of eight style and mechanics topics, from choosing the right form to checking a
// draft for the wrong one: fixing a claim's strength, reading a writer's stance in a verb, choosing a paraphrase,
// finding a break in cohesion, finding the character and action, spotting a number rule, naming a problem of tone, and
// finding the item that breaks a list.

import { t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import { bars, fields, kindedChoice, type Label, labelChoice } from "../../topics/steps.ts";

// Fixing a claim's strength.

const causal = "overstated: it turns a link into a cause";
const broad = "overstated: it goes beyond the sample";
const timid = "understated: it hedges more than the evidence needs";
const fits = "nothing: it fits the evidence";

const claimLabels: Readonly<Record<string, Label>> = {
  [causal]: {
    zh: "夸大：把关联说成了因果",
    why: [
      "The evidence is a survey or an observation, which shows only that two things go together, but the claim says one causes the other.",
      "证据是调查或观察，只能说明两件事同时出现，而主张却说一件事导致了另一件。",
    ],
    not: [
      "The claim does not say that one thing causes another, or the evidence comes from a controlled experiment that can show a cause.",
      "这个主张没有说一件事导致另一件，或者证据来自能够说明因果的对照实验。",
    ],
  },
  [broad]: {
    zh: "夸大：超出了样本范围",
    why: [
      "The evidence covers one group, place or species, but the claim speaks about everyone or everything, far beyond what was studied.",
      "证据只涉及一个群体、地方或物种，而主张却谈论所有人或所有事物，远远超出了研究的范围。",
    ],
    not: [
      "The claim stays within the group that was studied, so its scope is not the problem.",
      "这个主张没有超出被研究的群体，所以范围不是问题所在。",
    ],
  },
  [timid]: {
    zh: "过于保守：限制超出了证据的需要",
    why: [
      "The evidence is large and controlled, yet the claim piles on *may*, *possibly* and *some*, so it sounds weaker than the evidence is.",
      "证据数量大且有对照，主张却堆砌 *may*、*possibly*、*some*，听起来比证据本身弱得多。",
    ],
    not: [
      "The claim is not hedged beyond what the evidence needs; if anything, check whether it claims too much.",
      "这个主张的限制并没有超出证据的需要；倒是应该检查它是否说得过头了。",
    ],
  },
  [fits]: {
    zh: "没有问题：与证据相符",
    why: [
      "The claim matches the kind, amount and reach of the evidence: a link stays a link, and the scope stays within the sample.",
      "主张与证据的类型、数量和范围相符：关联仍是关联，范围也没有超出样本。",
    ],
    not: [
      "The claim does not match its evidence: compare the kind of study, how much evidence there is, and whom it covers.",
      "主张与证据不相符：比较研究的类型、证据的多少以及它涵盖的对象。",
    ],
  },
};

const claimLines = `
  Evidence: a survey of 300 students found that those who ate breakfast had higher grades.\\nClaim: Eating breakfast raises students' grades.|${causal}
  Evidence: a study of 40 nurses in one hospital found that night shifts disturbed their sleep.\\nClaim: Night shifts disturb the sleep of all workers.|${broad}
  Evidence: forty controlled trials with 20,000 patients found that the vaccine prevented the disease.\\nClaim: The vaccine may possibly prevent the disease in some patients.|${timid}
  Evidence: a survey of 500 commuters found that cyclists reported less stress than drivers.\\nClaim: In this survey, cyclists reported less stress than drivers.|${fits}
  Evidence: towns with more libraries had lower crime rates in a national dataset.\\nClaim: Building libraries reduces crime.|${causal}
  Evidence: an experiment on mice found that the drug slowed memory loss.\\nClaim: The drug slows memory loss in older adults.|${broad}
  Evidence: a decade of measurements at 300 stations shows that the glacier has shrunk every year.\\nClaim: The glacier might perhaps be shrinking somewhat.|${timid}
  Evidence: a randomized trial with 2,000 adults found that the exercise program lowered blood pressure.\\nClaim: The exercise program lowered blood pressure in adults.|${fits}
  Evidence: children who read more at home were found to have larger vocabularies.\\nClaim: Reading at home gives children larger vocabularies.|${causal}
  Evidence: a study of farms in one valley found that the new seed doubled harvests.\\nClaim: The new seed doubles harvests everywhere.|${broad}
  Evidence: every one of 15 large studies found that smoking damages the lungs.\\nClaim: Smoking could in some cases possibly affect the lungs.|${timid}
  Evidence: one survey found that people who use social media at night report sleeping less.\\nClaim: Night-time social media use is linked to less sleep.|${fits}
  Evidence: cities with more parks had healthier residents in a census study.\\nClaim: Parks make city residents healthier.|${causal}
  Evidence: interviews with 12 founders of tech companies found that they slept little.\\nClaim: Successful people sleep little.|${broad}
  Evidence: the law of gravity has been confirmed by centuries of measurement.\\nClaim: Objects may tend to fall toward the Earth in at least some cases.|${timid}
  Evidence: a pilot study with 30 volunteers found that the app may improve focus.\\nClaim: The app may improve focus, though a larger study is needed.|${fits}
  Evidence: students who took music lessons scored higher in math in a school survey.\\nClaim: Music lessons improve math scores.|${causal}
  Evidence: a study of teenagers in one city found that most preferred texting to calling.\\nClaim: People of every age prefer texting to calling.|${broad}
  Evidence: thousands of controlled experiments show that water boils at 100 °C at sea level.\\nClaim: Water might boil at around 100 °C, perhaps.|${timid}
  Evidence: a survey of 1,000 workers found that remote workers reported more satisfaction.\\nClaim: In this survey, remote workers reported more satisfaction than office workers.|${fits}
  Evidence: countries that eat more chocolate win more Nobel Prizes.\\nClaim: Eating chocolate makes a nation smarter.|${causal}
  Evidence: a trial of the medicine in men aged 20 to 40 found it safe.\\nClaim: The medicine is safe for everyone.|${broad}
  Evidence: a randomized trial of 10,000 drivers found that seat belts reduced deaths by half.\\nClaim: Seat belts could possibly reduce some deaths in certain crashes.|${timid}
  Evidence: a randomized trial in 50 schools found that smaller classes raised reading scores.\\nClaim: Smaller classes raised reading scores in the schools studied.|${fits}
  Evidence: neighborhoods with more coffee shops had higher house prices.\\nClaim: Coffee shops push up house prices.|${causal}
  Evidence: a survey of university students in one country found strong support for the new law.\\nClaim: The public strongly supports the new law.|${broad}
  Evidence: satellite records over forty years show that sea ice has steadily declined.\\nClaim: Sea ice may have changed in some ways, possibly.|${timid}
  Evidence: a study of one hospital's records suggests that the new procedure shortened recovery.\\nClaim: At this hospital, the new procedure appears to have shortened recovery.|${fits}
  Evidence: people who own dogs were found to live longer in a large survey.\\nClaim: Owning a dog makes people live longer.|${causal}
  Evidence: a study of bees in Europe found that a pesticide harmed their navigation.\\nClaim: The pesticide harms the navigation of every insect.|${broad}
`;

/** claimFixStep asks what is wrong with a claim, given its evidence. */
export const claimFixStep = point(
  "fixing-the-claim",
  t("Fixing the Claim", "修正主张"),
  t(
    "When you revise a draft, check each claim against its evidence. Claims usually go wrong in three ways.\n\n- **A link turned into a cause.** A survey or observation shows only that two things go together; *Breakfast raises grades* needs an experiment. Fix it with *is linked to* or *is associated with*.\n- **A claim beyond the sample.** A study of mice, of one hospital or of teenagers in one city does not cover everyone. Fix it by naming the group studied.\n- **A claim hedged too much.** Piling *may*, *possibly* and *some* onto strong, repeated evidence makes the writer sound unsure of what is well established. Fix it by stating the finding plainly.\n\nA claim that matches the kind, amount and reach of its evidence needs no change.",
    "修改草稿时，要用证据逐一检查每个主张。主张通常在三个方面出错。\n\n- **把关联说成因果。**调查或观察只能说明两件事同时出现；*Breakfast raises grades* 需要实验才能证明。改用 *is linked to* 或 *is associated with*。\n- **超出样本的主张。**对老鼠、对一家医院或对一个城市青少年的研究，并不能涵盖所有人。改正方法是说明被研究的群体。\n- **限制过多的主张。**在有力且反复得到证实的证据上堆砌 *may*、*possibly*、*some*，会让作者对已经确立的事实显得没有把握。改正方法是直接陈述发现。\n\n与证据的类型、数量和范围相符的主张不需要修改。",
  ),
  labelChoice(["What is wrong with this claim, given the evidence?", "根据证据，这个主张有什么问题？"], claimLines, claimLabels),
);

// The writer's stance in a reporting verb.

const neutral = "neutral: the writer takes no side";
const accepts = "the writer accepts the claim";
const doubts = "the writer doubts the claim";

const stanceLabels: Readonly<Record<string, Label>> = {
  [neutral]: {
    zh: "中立：作者不表态",
    why: [
      "Verbs such as *says*, *writes*, *states*, *reports* and *notes* only report what the source said, without the writer judging it.",
      "*says*、*writes*、*states*、*reports*、*notes* 这类动词只是转述资料说了什么，作者并不加以评判。",
    ],
    not: [
      "This verb does more than report: it shows whether the writer believes the claim, so it is not neutral.",
      "这个动词不只是转述：它表明了作者是否相信这一说法，所以不是中立的。",
    ],
  },
  [accepts]: {
    zh: "作者接受这一说法",
    why: [
      "Verbs such as *shows*, *demonstrates*, *establishes*, *proves* and *points out* tell the reader that the writer takes the claim as true.",
      "*shows*、*demonstrates*、*establishes*、*proves*、*points out* 这类动词告诉读者，作者认为这一说法是真的。",
    ],
    not: [
      "This verb does not present the claim as true: it either reports it neutrally or casts doubt on it.",
      "这个动词没有把这一说法当作真的：它要么中立地转述，要么对其表示怀疑。",
    ],
  },
  [doubts]: {
    zh: "作者怀疑这一说法",
    why: [
      "Verbs such as *claims*, *alleges*, *insists*, *purports* and *asserts without evidence* hint that the writer is not convinced.",
      "*claims*、*alleges*、*insists*、*purports*、*asserts without evidence* 这类动词暗示作者并不信服。",
    ],
    not: [
      "This verb casts no doubt on the claim: it either reports it neutrally or accepts it as true.",
      "这个动词没有对这一说法表示怀疑：它要么中立地转述，要么把它当作真的。",
    ],
  },
};

const stanceLines = `
  Okafor **shows** that the policy reduced unemployment.|${accepts}
  Okafor **claims** that the policy reduced unemployment.|${doubts}
  Okafor **writes** that the policy reduced unemployment.|${neutral}
  The report **demonstrates** that the river is polluted.|${accepts}
  The company **alleges** that the river is clean.|${doubts}
  The report **states** that the river was tested in May.|${neutral}
  Lin **establishes** that the letter was written in 1820.|${accepts}
  The dealer **insists** that the painting is genuine.|${doubts}
  Lin **notes** that the letter is unsigned.|${neutral}
  Garcia **proves** that the bridge design was flawed.|${accepts}
  The builder **purports** to have followed every safety rule.|${doubts}
  Garcia **reports** that the bridge opened in 1998.|${neutral}
  The survey **points out** that most voters are undecided.|${accepts}
  The campaign **claims** that most voters support it.|${doubts}
  The survey **says** that voters were asked in March.|${neutral}
  Rossi **confirms** that the drug lowers blood pressure.|${accepts}
  The advertisement **alleges** that the drug cures every illness.|${doubts}
  Rossi **writes** that the trial lasted two years.|${neutral}
  The historian **demonstrates** that the treaty was signed in secret.|${accepts}
  The minister **insists**, without offering evidence, that no treaty was signed.|${doubts}
  The historian **observes** that the treaty is twelve pages long.|${neutral}
  Ahmed **shows** that the species is declining.|${accepts}
  The hunting club **claims** that the species is thriving.|${doubts}
  Ahmed **states** that the count was made in winter.|${neutral}
  The audit **establishes** that funds were misused.|${accepts}
  The treasurer **asserts**, without records, that every coin is accounted for.|${doubts}
  The audit **reports** that it covered five years.|${neutral}
  Novak **proves** that the poem was written by a woman.|${accepts}
  An anonymous blogger **purports** to have found the poet's lost diary.|${doubts}
  Novak **notes** that the poem was first printed in 1851.|${neutral}
`;

/** stanceStep asks what a reporting verb shows about the writer's view of a source. */
export const stanceStep = point(
  "the-writers-stance",
  t("The Writer's Stance", "作者的立场"),
  t(
    "A reporting verb tells the reader not only what a source does, but also what **you**, the writer, think of it.\n\n- **Neutral** verbs report without judging: *says*, *writes*, *states*, *reports*, *notes*, *observes*.\n- **Accepting** verbs present the claim as true: *shows*, *demonstrates*, *establishes*, *proves*, *confirms*, *points out*.\n- **Doubting** verbs suggest the claim may be false: *claims*, *alleges*, *insists*, *purports*, *asserts* (especially *without evidence*).\n\nThe same sentence changes meaning with the verb: *Okafor **shows** that the policy worked* means you agree; *Okafor **claims** that the policy worked* means you are not convinced. Choose the verb that matches your real view, and be ready to support it.",
    "转述动词告诉读者的不只是资料做了什么，还有**你**这位作者对它的看法。\n\n- **中立**的动词只转述不评判：*says、writes、states、reports、notes、observes*。\n- **接受**的动词把说法当作真的：*shows、demonstrates、establishes、proves、confirms、points out*。\n- **怀疑**的动词暗示说法可能是假的：*claims、alleges、insists、purports、asserts*（尤其是 *without evidence*）。\n\n换一个动词，同一个句子的意思就变了：*Okafor **shows** that the policy worked* 表示你赞同；*Okafor **claims** that the policy worked* 表示你并不信服。选择与你真实看法相符的动词，并准备好为它提供依据。",
  ),
  labelChoice(
    ["What does the reporting verb in bold show about the writer's view?", "加粗的转述动词表明了作者怎样的看法？"],
    stanceLines,
    stanceLabels,
  ),
);

// Choosing a paraphrase.

/** paraphraseBank gives a source; its wrong options are patchwriting, then a paraphrase that changes the meaning. */
const paraphraseBank = bars(
  `
  Source (Mendes, 2019): "Urban gardens provide residents with fresh food and a rare opportunity to meet their neighbors."|City gardens, Mendes (2019) argues, do more than feed people: they also bring neighbors together who might otherwise never meet.|Urban gardens give residents fresh food and an unusual chance to meet their neighbors (Mendes, 2019).|Mendes (2019) argues that urban gardens have become the main source of fresh food for most city residents, more than shops.
  Source (Park, 2021): "Students who sleep fewer than seven hours tend to perform worse on memory tests."|According to Park (2021), students who get less than seven hours of sleep usually do less well when their memory is tested.|Students who sleep under seven hours tend to do worse on memory tests (Park, 2021).|Park (2021) shows that any student who sleeps more than seven hours a night is guaranteed good results on memory tests.
  Source (Haddad, 2018): "The collapse of the fishing industry left many coastal towns without a reason to exist."|Haddad (2018) explains that when fishing failed, many seaside towns lost the very thing that had kept them alive.|The fall of the fishing industry left many coastal towns with no reason to exist (Haddad, 2018).|Haddad (2018) claims that the coastal towns themselves caused the collapse of the fishing industry by taking too many fish.
  Source (Ortiz, 2020): "Bilingual children often show greater flexibility when switching between tasks."|Children who speak two languages, Ortiz (2020) finds, frequently move from one task to another more easily.|Bilingual children frequently show more flexibility when changing between tasks (Ortiz, 2020).|Ortiz (2020) finds that bilingual children are always better students than children who speak only one language.
  Source (Kim, 2017): "Public libraries have quietly become the last free indoor spaces in many cities."|In many cities, Kim (2017) observes, the public library is now one of the only places indoors where no one has to pay.|Public libraries have silently become the final free indoor spaces in many cities (Kim, 2017).|Kim (2017) observes that public libraries in many cities should start charging their visitors for entry to stay open.
  Source (Volkov, 2022): "Remote work has reduced commuting but blurred the boundary between home and office."|Volkov (2022) notes a trade-off: working from home cuts travel time, yet it makes it harder to keep work and home life apart.|Remote work has cut commuting but blurred the line between home and office (Volkov, 2022).|Volkov (2022) notes that remote work has made commuting longer while keeping home and office life clearly apart.
  Source (Adeyemi, 2016): "Early exposure to music appears to support the development of language skills."|Adeyemi (2016) suggests that hearing music from a young age may help children learn language.|Early contact with music seems to support the growth of language skills (Adeyemi, 2016).|Adeyemi (2016) proves that music lessons are the only way young children can learn a language.
  Source (Bauer, 2015): "The new law was intended to protect renters, but it has made landlords reluctant to rent at all."|Bauer (2015) argues that a law meant to help renters has backfired, leading many landlords to stop renting their property.|The new law was meant to protect renters, but it has made landlords unwilling to rent at all (Bauer, 2015).|Bauer (2015) argues that the new law has made renting much easier for everyone, landlords and renters alike, in every city.
  Source (Santos, 2023): "Coral reefs cover less than one percent of the ocean floor but shelter a quarter of all marine species."|Although reefs take up only a tiny fraction of the seabed, Santos (2023) points out, they are home to about one in four ocean species.|Coral reefs cover under one percent of the ocean floor but house a quarter of all sea species (Santos, 2023).|Santos (2023) points out that coral reefs cover a quarter of the ocean floor and shelter less than one percent of sea species.
  Source (Nakamura, 2019): "Handwriting notes leads to deeper understanding than typing them, because it forces students to summarize."|Nakamura (2019) argues that students who take notes by hand understand more, since they cannot copy every word and must condense ideas instead.|Writing notes by hand leads to deeper understanding than typing them, because it makes students summarize (Nakamura, 2019).|Nakamura (2019) argues that typing notes helps students summarize better than handwriting.
  Source (Fischer, 2020): "Tourism brought jobs to the island but drove up the price of housing beyond the reach of local families."|Fischer (2020) finds that visitors created work on the island while making homes too expensive for the people who lived there.|Tourism brought work to the island but pushed housing prices beyond the reach of local families (Fischer, 2020).|Fischer (2020) finds that tourism brought jobs to the island and also lowered housing prices for the local families who lived there.
  Source (Owusu, 2018): "Most plastic in the ocean comes not from ships but from rivers that carry waste from inland cities."|Owusu (2018) traces the ocean's plastic mainly to rivers that wash rubbish down from cities far from the coast, rather than to ships.|Most ocean plastic comes not from ships but from rivers carrying waste from inland cities (Owusu, 2018).|Owusu (2018) traces most of the ocean's plastic to ships dumping their waste at sea, rather than to rivers from inland cities.
  Source (Laurent, 2021): "Children who are praised for effort rather than intelligence are more willing to attempt hard problems."|Laurent (2021) reports that when children are praised for working hard instead of for being clever, they take on difficult problems more readily.|Children praised for effort rather than intelligence are more willing to try hard problems (Laurent, 2021).|Laurent (2021) reports that praising children for intelligence makes them try harder problems.
  Source (Ibrahim, 2017): "The invention of refrigeration changed not only what people ate but where they could live."|Refrigeration, Ibrahim (2017) argues, reshaped both diets and the map of where people settled, since food could now be kept in hot places.|The invention of refrigeration changed not just what people ate but where they could live (Ibrahim, 2017).|Ibrahim (2017) argues that refrigeration changed where people lived but had no effect on what they ate.
  Source (Moreau, 2022): "Electric cars produce no exhaust, yet the electricity that charges them may still come from burning coal."|Moreau (2022) cautions that although electric cars give off no fumes themselves, their power may still be generated by coal plants.|Electric cars make no exhaust, yet the electricity charging them may still come from burning coal (Moreau, 2022).|Moreau (2022) cautions that electric cars produce as much exhaust as gas cars, even when they are charged with electricity from coal.
  Source (Chen, 2016): "Workers who take short breaks every hour make fewer errors than those who work straight through."|Chen (2016) finds that people who pause briefly each hour make fewer mistakes than colleagues who never stop.|Workers who take brief breaks each hour make fewer mistakes than those who work straight through (Chen, 2016).|Chen (2016) finds that workers who never stop for a break during the day make fewer mistakes than colleagues who pause every hour.
  Source (Delgado, 2019): "Social media did not create political division, but it has made that division more visible."|Delgado (2019) argues that political divides existed before social media, which has simply brought them into plain view.|Social media did not cause political division, but it has made that division more visible (Delgado, 2019).|Delgado (2019) argues that social media created the political divisions that did not exist before it and made them more visible.
  Source (Ward, 2020): "Most new businesses fail not because of poor ideas but because they run out of cash."|Ward (2020) explains that new companies usually close because they run out of money, not because their ideas are bad.|Most new businesses fail not due to bad ideas but because they run out of cash (Ward, 2020).|Ward (2020) explains that most new businesses fail because their ideas are poor, even when they still have plenty of money left.
  Source (Petrov, 2018): "Wolves returning to the park changed the behavior of deer, which in turn allowed trees to recover."|Petrov (2018) describes a chain of effects: once wolves came back, deer moved differently, and this gave the trees a chance to grow again.|Wolves coming back to the park changed how deer behaved, which in turn let trees recover (Petrov, 2018).|Petrov (2018) describes how deer returning to the park drove the wolves away.
  Source (Afolabi, 2021): "Learning a second language in adulthood is slower but by no means impossible."|Adults can still master a new language, Afolabi (2021) argues, even if it takes them longer than children.|Learning a second language as an adult is slower but in no way impossible (Afolabi, 2021).|Afolabi (2021) argues that adults cannot learn a second language at all, however long they spend studying it.
  Source (Grant, 2017): "Cities that invest in public transport see less traffic within a decade."|Grant (2017) finds that within ten years of spending on buses and trains, cities have fewer cars clogging their roads.|Cities that invest in public transport see less traffic within ten years (Grant, 2017).|Grant (2017) finds that public transport increases traffic in cities.
  Source (Ruiz, 2023): "The museum's visitors spend an average of eight seconds looking at each painting."|According to Ruiz (2023), a typical museum visitor gives each painting only about eight seconds of attention.|The museum's visitors spend an average of eight seconds looking at every painting (Ruiz, 2023).|Ruiz (2023) reports that a typical museum visitor spends about eight minutes studying each painting in the collection.
  Source (Tanaka, 2015): "The town's population fell by half after the factory closed, as young families left to find work."|Tanaka (2015) records that when the factory shut, young families moved away for jobs, and the town lost half its people.|The town's population dropped by half after the factory closed, as young families left to find work (Tanaka, 2015).|Tanaka (2015) records that the town's population doubled after the factory closed.
  Source (Hughes, 2020): "Reading fiction may improve our ability to understand what other people are feeling."|Hughes (2020) suggests that reading novels and stories could help us grasp other people's emotions.|Reading fiction may improve our ability to understand what others are feeling (Hughes, 2020).|Hughes (2020) proves that people who read novels and stories are always kinder than people who read none.
  Source (Mbeki, 2019): "Solar panels have become so cheap that in many countries they are now the least expensive source of new electricity."|Mbeki (2019) reports that the price of solar power has dropped so far that it is now the cheapest way to add electricity in many nations.|Solar panels have become so cheap that in many countries they are now the cheapest source of new electricity (Mbeki, 2019).|Mbeki (2019) reports that solar panels remain the most expensive source of electricity.
  Source (Costa, 2022): "Teenagers who have a part-time job learn to manage their time, but long hours can hurt their grades."|Costa (2022) finds that working part-time teaches teenagers to organize their time, though too many hours can lower their marks.|Teenagers with a part-time job learn to manage time, but long hours can harm their grades (Costa, 2022).|Costa (2022) finds that part-time jobs always improve teenagers' grades.
  Source (Weber, 2016): "Languages die not when their last speaker passes away, but when parents stop teaching them to their children."|Weber (2016) argues that a language is lost once families stop passing it on to the next generation, long before its last speaker dies.|Languages die not when their last speaker dies, but when parents stop teaching them to their children (Weber, 2016).|Weber (2016) argues that a language dies only when its very last speaker passes away, whatever parents teach their children.
  Source (Singh, 2021): "Planting trees along streets can lower summer temperatures by several degrees."|Singh (2021) finds that rows of street trees can make neighborhoods a few degrees cooler in summer.|Planting trees along streets can reduce summer temperatures by several degrees (Singh, 2021).|Singh (2021) finds that street trees make neighborhoods warmer in summer.
  Source (Eriksen, 2018): "The printing press did not end handwritten books overnight; for decades the two existed side by side."|Eriksen (2018) points out that printed books replaced handwritten ones only gradually, and for many years both were made.|The printing press did not end handwritten books overnight; for decades the two existed together (Eriksen, 2018).|Eriksen (2018) points out that the printing press ended handwritten books almost at once.
  Source (Lopez, 2020): "Volunteers who help others report better health, though it is unclear whether helping causes the benefit."|Lopez (2020) notes that volunteers say they are healthier, while cautioning that we do not know whether volunteering is the reason.|Volunteers who help others report better health, though it is unclear if helping causes the benefit (Lopez, 2020).|Lopez (2020) shows that helping others as a volunteer is what causes the better health volunteers report.
  `,
  2,
);

/** paraphraseStep asks for the acceptable paraphrase of a source. */
export const paraphraseStep = point(
  "choosing-a-paraphrase",
  t("Choosing a Paraphrase", "选择转述"),
  t(
    "An acceptable paraphrase passes three tests at once.\n\n1. **Own words and own structure.** Read the source, look away, and write the idea as you would explain it. If your sentence follows the source clause by clause with a few synonyms swapped in, it is **patchwriting**, which counts as plagiarism even with a citation.\n2. **The same meaning.** A paraphrase must not make the idea stronger, weaker or different: *may improve* is not *proves*, and *a link* is not *a cause*.\n3. **Credit.** Name the author and year, because the idea is still theirs.\n\nA good check is to compare the shape: if you could lay your sentence over the source and see the same skeleton, rewrite it.",
    "可以接受的转述要同时通过三项检验。\n\n1. **自己的词语和自己的结构。**读完原文，移开视线，按你自己解释的方式写出这个观点。如果你的句子逐个分句地跟着原文走，只换了几个同义词，那就是**拼凑式改写**（patchwriting），即使注明出处也算抄袭。\n2. **意思不变。**转述不能让观点变强、变弱或变样：*may improve* 不等于 *proves*，*关联* 也不等于 *因果*。\n3. **注明出处。**写出作者和年份，因为观点仍然是他们的。\n\n一个好的检验方法是比较句子的形状：如果把你的句子叠在原文上能看到同样的骨架，就要重写。",
  ),
  kindedChoice(
    ["Which is an acceptable paraphrase of the source?", "哪一项是对原文可以接受的转述？"],
    paraphraseBank,
    (right) => [
      `*${right}* It restates the idea in new words and a new structure, keeps its meaning exactly, and credits the author and year.`,
      `*${right}* 它用新的词语和新的结构重述观点，准确保留了原意，并注明了作者和年份。`,
    ],
    [
      [
        "*{wrong}* follows the source's sentence clause by clause with a few words swapped: that is patchwriting, plagiarism even with a citation.",
        "*{wrong}* 逐个分句地照搬原句，只换了几个词：这是拼凑式改写，即使注明出处也算抄袭。",
      ],
      [
        "*{wrong}* is in new words, but it changes what the source says, making it stronger, reversed or different.",
        "*{wrong}* 虽然用了新的词语，却改变了原文的意思，使它变得更绝对、相反或不同。",
      ],
    ],
  ),
);

// Finding the break in cohesion.

/** breakLines are four sentences, the number of the one that starts with something new, and what it starts with. */
const breakLines = fields(`
  Last year the city built a new bridge.|The bridge was designed by a young engineer.|A national prize was later given to the engineer.|The prize came with money for her next project.|3|*A national prize*, which is new, instead of the engineer named just before
  The school opened a garden in March.|In the garden, students grow beans and tomatoes.|Most of the tomatoes go to the school kitchen.|A hot lunch is cooked from them every Friday by the kitchen staff.|4|*A hot lunch*, which is new, instead of the kitchen or the tomatoes named just before
  Bees pollinate many crops.|Without these crops, our diet would be much poorer.|A disease is now killing bees in many countries.|The disease spreads quickly through a hive.|3|*A disease*, which is new, instead of the crops or the diet named just before
  The museum bought an old map in May.|The map shows the coast as it looked in 1600.|A small village appears at the mouth of the river on the coast.|That village is now a large port.|3|*A small village*, which is new, instead of the coast named just before
  Many students struggle with fractions.|Fractions are hard because they break the rules of whole numbers.|Those rules tell children that bigger numbers mean bigger amounts.|A teacher in Ohio has found a way around this problem.|4|*A teacher in Ohio*, who is new, instead of the problem or the rules named just before
  The company launched a new phone in June.|The phone has a battery that lasts two days.|That battery was developed in a lab in Seoul.|Three hundred engineers work in the lab.|4|*Three hundred engineers*, who are new, instead of the lab named just before
  A storm hit the coast on Tuesday.|The storm brought winds of over 100 km per hour.|Those winds knocked down power lines across the region.|Thousands of homes lost electricity because of the fallen lines.|4|*Thousands of homes*, which are new, instead of the fallen power lines named just before
  The novel begins with a death.|The death is that of the narrator's father.|His father had kept a secret for forty years.|A letter in a locked drawer reveals the secret.|4|*A letter in a locked drawer*, which is new, instead of the secret named just before
  The town council proposed a new tax.|The tax would pay for road repairs.|Repairs are badly needed on the main highway.|A truck driver was injured there last month by a pothole.|4|*A truck driver*, who is new, instead of the highway named just before
  Rice is the main food of half the world.|Most of that rice is grown in flooded fields.|Methane, a powerful greenhouse gas, is released by flooded fields.|The gas traps heat in the atmosphere.|3|*Methane*, which is new, instead of the flooded fields named just before
  Our team studied sleep in teenagers.|Teenagers need about nine hours of sleep a night.|Most of them get fewer than seven hours.|Early school start times are one reason for this shortfall.|4|*Early school start times*, which are new, instead of the shortfall in sleep named just before
  The library received a large gift.|The gift came from a former student.|She had spent her childhood reading in the library.|Rare books will be bought with the money.|4|*Rare books*, which are new, instead of the gift or the money named earlier
  The factory closed in 2010.|Its closing cost the town 800 jobs.|Many of the workers who lost those jobs moved away.|Empty houses now line the streets they left behind.|4|*Empty houses*, which are new, instead of the workers or the streets named just before
  A new vaccine was tested last year.|The test involved 30,000 volunteers.|A strong immune response was shown by most of the volunteers.|That response lasted at least six months.|3|*A strong immune response*, which is new, instead of the volunteers named just before
  The river floods every spring.|The floods carry rich soil onto the fields.|Farmers plant their crops in that soil.|A good harvest usually follows because of the farmers' planting.|4|*A good harvest*, which is new, instead of the farmers or the crops named just before
  The festival began in 1950.|At first it was a small fair for local farmers.|The farmers sold vegetables and showed their animals.|Fifty thousand visitors now come to it each year.|4|*Fifty thousand visitors*, who are new, instead of the fair or the farmers named just before
  The orchestra hired a new conductor.|The conductor is only twenty-nine years old.|Her age surprised many critics.|A rave review of her first concert appeared in the newspaper.|4|*A rave review*, which is new, instead of the critics named just before
  Coffee was first grown in Ethiopia.|From Ethiopia, it spread to Yemen.|Traders carried it from Yemen to Europe.|London had over three hundred coffee houses by 1700.|4|*London*, which is new, instead of Europe or the coffee named just before
  The study followed 2,000 children.|Each child was tested every year from age five to fifteen.|Reading and math were measured by the tests.|In both subjects, children from homes with many books did best.|3|*Reading and math*, which are new, instead of the tests named just before
  The city planted 10,000 trees.|The trees were chosen to survive hot summers.|Shade from these trees cools the streets.|Lower electricity bills are one result of the cooler streets.|4|*Lower electricity bills*, which are new, instead of the cooler streets named just before
  The ship left port in April.|It carried 200 passengers.|An iceberg was struck by the ship on its fifth night.|The iceberg tore a hole in its side.|3|*An iceberg*, which is new, instead of the ship or the passengers named just before
  The law was passed in 1965.|The law gave every citizen the right to vote.|Unfair tests had kept many citizens from voting.|Those tests were now banned.|3|*Unfair tests*, which are new, instead of the right to vote named just before
  Our survey asked 500 workers about stress.|Stress was highest among nurses.|Nurses often work twelve-hour shifts.|A shortage of staff makes those shifts even harder.|4|*A shortage of staff*, which is new, instead of the shifts named just before
  The painter moved to Paris in 1886.|In Paris he met many young artists.|Bright colors and loose brushwork were what those artists used.|His own paintings soon became brighter.|3|*Bright colors and loose brushwork*, which are new, instead of the artists named just before
  The theater was built in 1890.|It was the largest theater in the city.|A fire destroyed it in 1920.|The fire started in a costume room.|3|*A fire*, which is new, instead of the theater named just before
  The app tracks how much water you drink.|It sends a reminder every two hours.|A study found that the reminders worked.|Users of the app drank 20% more water.|3|*A study*, which is new, instead of the reminders named just before
  The mountain is 5,000 meters high.|Its summit is covered in snow all year.|Climbers from around the world are drawn by the snow.|Most of them reach the top in July.|3|*Climbers*, who are new, instead of the snow named just before
  Our city has a serious traffic problem.|The problem is worst near the old port.|Narrow streets built for carts surround the port.|A new tunnel under those streets has been proposed by the mayor.|4|*A new tunnel*, which is new, instead of the narrow streets named just before
  The school replaced its textbooks with tablets.|The tablets cost less than the books.|Battery problems soon appeared in many of the tablets.|Students had to charge them during lessons.|3|*Battery problems*, which are new, instead of the tablets named just before
  The scientist discovered a new species of frog.|The frog lives only on one mountain.|That mountain is being cleared for farmland.|A plan to protect the frog's forest has been written by local groups.|4|*A plan*, which is new, instead of the mountain or the farmland named just before
`);

const breakBank: ChoiceItem[] = breakLines.map(([s1, s2, s3, s4, broken, why]): ChoiceItem => {
  const k = Number(broken);
  if (!s1 || !s2 || !s3 || !s4 || !why || !(k >= 2 && k <= 4)) throw new Error(`a cohesion line needs four sentences: ${s1}`);
  const shown = [s1, s2, s3, s4].map((s, i) => `(${i + 1}) ${s}`).join(" ");
  return [shown, `Sentence ${k}`, [2, 3, 4].filter((n) => n !== k).map((n) => `Sentence ${n}`)];
});

const breakWhy = new Map(breakLines.map(([s1, , , , , why]) => [s1 ?? "", why ?? ""]));

/** cohesionBreakStep asks which sentence of a passage breaks the order of old before new. */
export const cohesionBreakStep = point(
  "finding-the-break",
  t("Finding the Break", "找出断裂之处"),
  t(
    "To check a paragraph for cohesion, read only the **beginning** of each sentence after the first and ask: has the reader met this already? In a cohesive paragraph each sentence opens with something named in the sentence before, such as *the bridge*, *these crops* or *that battery*, and ends with something new.\n\nThe sentence that breaks the chain opens with a new person, thing or idea, often after *A* or *An*, and pushes the familiar part to its end: *A national prize was later given to the engineer.* The reader must hold the new idea in mind before learning how it connects. The usual fix is to turn the sentence around, often into the active or the passive voice: *The engineer was later given a national prize.*",
    "检查段落是否衔接时，只读第一句之后每个句子的**开头**，并问：读者已经见过这个了吗？在衔接良好的段落里，每个句子都以上一句提到的东西开头，比如 *the bridge*、*these crops*、*that battery*，以新的内容结尾。\n\n打断链条的句子以新的人、事物或想法开头，常常跟在 *A* 或 *An* 后面，并把熟悉的部分推到句末：*A national prize was later given to the engineer.* 读者必须先记住这个新内容，然后才知道它与前文有什么联系。通常的改法是把句子倒过来，常常是在主动语态和被动语态之间转换：*The engineer was later given a national prize.*",
  ),
  choiceGenerator(
    t("Which sentence breaks the flow by starting with something new?", "哪个句子以新内容开头，打断了行文的连贯？"),
    breakBank,
    (right, shown) => {
      const first = shown.replace(/^\(1\) /u, "").split(" (2) ")[0] ?? "";
      return t(
        `**${right}** breaks the flow: it opens with ${breakWhy.get(first) ?? "something new"}. Turn it around so that it starts with what the reader knows.`,
        `**${right}** 打断了行文：它的开头是读者没见过的新内容，而不是上一句刚提到的东西。应该把句子倒过来，让它以读者已知的内容开头。`,
      );
    },
    (wrong) =>
      t(
        `${wrong} opens with something the sentence before it has already named, so it keeps the chain of old before new.`,
        `${wrong.replace("Sentence", "第")}句以上一句已经提到的东西开头，所以保持了先旧后新的链条。`,
      ),
  ),
);

// The real character and action.

/** actorBank gives a sentence; its wrong options take an abstraction for the character, then a weak verb for the action. */
const actorBank = bars(
  `
  The committee's decision was the postponement of the vote.|Character: the committee. Action: decide, and postpone.|Character: the decision. Action: postpone.|Character: the committee. Action: was.
  There was a failure by the engineers to test the brakes.|Character: the engineers. Action: fail to test.|Character: the failure. Action: test.|Character: the engineers. Action: there was.
  The analysis of the data by the team took three weeks.|Character: the team. Action: analyze.|Character: the analysis. Action: took.|Character: the team. Action: took.
  The mayor's announcement of the closure of the park caused anger.|Character: the mayor. Action: announce, and close.|Character: the announcement. Action: caused.|Character: the mayor. Action: caused.
  An increase in prices by the company occurred in May.|Character: the company. Action: increase.|Character: an increase. Action: occurred.|Character: the company. Action: occurred.
  Our recommendation is the reduction of staff hours.|Character: we. Action: recommend, and reduce.|Character: the recommendation. Action: reduce.|Character: we. Action: is.
  The investigation of the fire by the police is ongoing.|Character: the police. Action: investigate.|Character: the investigation. Action: is.|Character: the police. Action: is.
  There was a refusal by the manager to approve the budget.|Character: the manager. Action: refuse to approve.|Character: the refusal. Action: approve.|Character: the manager. Action: there was.
  The completion of the report by the students was late.|Character: the students. Action: complete.|Character: the completion. Action: was.|Character: the students. Action: was.
  Discussion of the plan by the board took place on Friday.|Character: the board. Action: discuss.|Character: the discussion. Action: took place.|Character: the board. Action: took place.
  The court's rejection of the appeal was unanimous.|Character: the court. Action: reject.|Character: the rejection. Action: was.|Character: the court. Action: was.
  The expansion of the airport by the city will require new roads.|Character: the city. Action: expand.|Character: the expansion. Action: require.|Character: the city. Action: will require.
  The teachers' preference is for the use of shorter tests.|Character: the teachers. Action: prefer, and use.|Character: the preference. Action: use.|Character: the teachers. Action: is.
  The movement of the factory to Mexico by the owners happened last year.|Character: the owners. Action: move.|Character: the movement. Action: happened.|Character: the owners. Action: happened.
  There has been a decline in the number of visitors to the museum.|Character: visitors. Action: decline, or come less often.|Character: a decline. Action: has been.|Character: the museum. Action: has been.
  The scientists' discovery of the error led to a correction of the paper.|Character: the scientists. Action: discover, and correct.|Character: the discovery. Action: led.|Character: the scientists. Action: led.
  Approval of the loan by the bank was given in June.|Character: the bank. Action: approve.|Character: the approval. Action: was given.|Character: the bank. Action: was given.
  The government's intention is the improvement of rural schools.|Character: the government. Action: intend to improve.|Character: the intention. Action: improve.|Character: the government. Action: is.
  A review of the safety rules was conducted by the inspectors.|Character: the inspectors. Action: review.|Character: a review. Action: was conducted.|Character: the inspectors. Action: conducted.
  The students' complaint was about the length of the exam.|Character: the students. Action: complain.|Character: the complaint. Action: was.|Character: the students. Action: was.
  There was agreement among the partners on the sale of the company.|Character: the partners. Action: agree to sell.|Character: agreement. Action: sell.|Character: the partners. Action: there was.
  The hospital's reduction of waiting times was a success.|Character: the hospital. Action: reduce.|Character: the reduction. Action: was.|Character: the hospital. Action: was.
  Our assumption was that the shipment would arrive on time.|Character: we. Action: assume.|Character: the assumption. Action: arrive.|Character: we. Action: was.
  The prevention of floods is the purpose of the new dam.|Character: the new dam. Action: prevent.|Character: the prevention. Action: is.|Character: the new dam. Action: is.
  The writer's description of the city is very vivid.|Character: the writer. Action: describe.|Character: the description. Action: is.|Character: the writer. Action: is.
  The creation of new jobs by the program has occurred slowly.|Character: the program. Action: create.|Character: the creation. Action: has occurred.|Character: the program. Action: has occurred.
  The board's selection of a new director was made in secret.|Character: the board. Action: select.|Character: the selection. Action: was made.|Character: the board. Action: was made.
  There is a need for the council to explain its spending.|Character: the council. Action: need to explain.|Character: a need. Action: explain.|Character: the council. Action: there is.
  The measurement of the samples by the lab showed high lead levels.|Character: the lab. Action: measure.|Character: the measurement. Action: showed.|Character: the lab. Action: showed.
  The pilot's response to the warning was a sharp turn.|Character: the pilot. Action: respond, and turn.|Character: the response. Action: was.|Character: the pilot. Action: was.
  `,
  2,
);

/** actorStep asks for the real character and action hidden in a sentence. */
export const actorStep = point(
  "finding-character-and-action",
  t("Finding the Character and the Action", "找出人物和动作"),
  t(
    "Before you can revise a cloudy sentence, you must find what it is really about. Ask two questions.\n\n- **Who is doing something?** That is the **character**, even if it hides in a phrase with *of* or *by*, or behind a possessive: *the committee's decision*, *a failure **by the engineers***.\n- **What are they doing?** That is the **action**, usually hidden in an abstract noun ending in *-tion*, *-ment*, *-ure*, *-al* or *-sis*: *decision* hides *decide*, *failure* hides *fail*, *analysis* hides *analyze*.\n\nTwo traps wait. The abstract noun at the front of the sentence is not the character, because a *decision* does nothing by itself. And the weak verb that holds the sentence together, such as *was*, *occurred*, *took place* or *there was*, is not the action.",
    "要修改一个含混的句子，首先必须找出它真正讲的是什么。问两个问题。\n\n- **谁在做事？**那就是**人物**，即使它藏在 *of*、*by* 引导的短语里，或者藏在所有格后面：*the committee's decision*、*a failure **by the engineers***。\n- **他们在做什么？**那就是**动作**，通常藏在以 *-tion、-ment、-ure、-al、-sis* 结尾的抽象名词里：*decision* 藏着 *decide*，*failure* 藏着 *fail*，*analysis* 藏着 *analyze*。\n\n有两个陷阱。句首的抽象名词不是人物，因为 *decision* 自己什么也做不了。撑起句子的弱动词，比如 *was、occurred、took place、there was*，也不是动作。",
  ),
  kindedChoice(
    ["Who is the real character in this sentence, and what is the real action?", "这个句子真正的人物是谁，真正的动作是什么？"],
    actorBank,
    (right) => [
      `${right} The character is the one doing something, and the action is the verb hidden inside the abstract noun.`,
      `${right} 人物是做事的那一方，动作是藏在抽象名词里的动词。`,
    ],
    [
      [
        "That choice takes the abstract noun for the character, but an abstraction such as a *decision* or a *failure* cannot act by itself.",
        "这个选项把抽象名词当成了人物，但 *decision*、*failure* 这样的抽象概念自己不能行动。",
      ],
      [
        "That choice takes the weak verb for the action, but *was*, *occurred* or *there was* only holds up the sentence; the real action is hidden in a noun.",
        "这个选项把弱动词当成了动作，但 *was*、*occurred*、*there was* 只是撑起句子；真正的动作藏在名词里。",
      ],
    ],
  ),
);

// Spotting the number rule.

const words = "write numbers below 10 as words";
const numerals = "write numbers of 10 and above as numerals";
const noStart = "never begin a sentence with a numeral";
const percents = "write percentages as numerals with %";
const units = "write numbers with units as numerals";
const ranges = "write a range in full";
const allRight = "none: the number is correct";

const numberLabels: Readonly<Record<string, Label>> = {
  [words]: {
    zh: "十以下的数用单词",
    why: [
      "The bold number counts fewer than ten things, so it should be a word, such as *seven* instead of *7*.",
      "加粗的数计数不到十个事物，所以应该写成单词，比如用 *seven* 而不是 *7*。",
    ],
    not: [
      "The bold number is not a small count written as a numeral, so this rule is not the one broken.",
      "加粗的数并不是写成阿拉伯数字的十以下计数，所以违反的不是这条规则。",
    ],
  },
  [numerals]: {
    zh: "十及以上的数用阿拉伯数字",
    why: [
      "The bold number is 10 or more, so it should be a numeral, such as *24* instead of *twenty-four*.",
      "加粗的数是十或更大的数，所以应该写成阿拉伯数字，比如用 *24* 而不是 *twenty-four*。",
    ],
    not: [
      "The bold number is not a large number spelled out in the middle of a sentence, so this rule is not the one broken.",
      "加粗的数并不是在句中被拼写出来的大数，所以违反的不是这条规则。",
    ],
  },
  [noStart]: {
    zh: "句子不能以阿拉伯数字开头",
    why: [
      "The sentence opens with a numeral, which readers stumble over; spell the number out or rewrite the sentence.",
      "句子以阿拉伯数字开头，读者会读得磕绊；应该把数拼写出来，或者改写句子。",
    ],
    not: [
      "The bold number does not stand at the start of the sentence, so this rule does not apply here.",
      "加粗的数不在句首，所以这条规则在这里不适用。",
    ],
  },
  [percents]: {
    zh: "百分数用阿拉伯数字加 %",
    why: [
      "A percentage is always a numeral with the % sign, whatever its size, so *six percent* should be *6%*.",
      "百分数不论大小都用阿拉伯数字加 % 号，所以 *six percent* 应该写成 *6%*。",
    ],
    not: [
      "The bold number is not a percentage, or it is already written as a numeral with %.",
      "加粗的数不是百分数，或者已经写成了阿拉伯数字加 %。",
    ],
  },
  [units]: {
    zh: "带单位的数用阿拉伯数字",
    why: [
      "The bold number goes with a unit of measurement, so it should be a numeral, such as *5 kg* instead of *five kg*.",
      "加粗的数带有计量单位，所以应该写成阿拉伯数字，比如用 *5 kg* 而不是 *five kg*。",
    ],
    not: [
      "The bold number has no unit of measurement, or it is already a numeral before its unit.",
      "加粗的数没有计量单位，或者已经是单位前的阿拉伯数字。",
    ],
  },
  [ranges]: {
    zh: "范围要写完整",
    why: [
      "A range needs *from ... to ...* or *between ... and ...*, or a dash replacing both words; this one mixes a word with a dash.",
      "范围要用 *from ... to ...* 或 *between ... and ...*，或者用连接号同时代替两个词；这里把单词和连接号混用了。",
    ],
    not: [
      "The bold number is not part of a range that mixes *from* or *between* with a dash.",
      "加粗的数不属于把 *from* 或 *between* 与连接号混用的范围。",
    ],
  },
  [allRight]: {
    zh: "没有错误",
    why: [
      "The bold number already follows the rule for its kind: small counts in words, others in numerals, and no numeral at the start.",
      "加粗的数已经符合它那一类的规则：小的计数用单词，其他用阿拉伯数字，句首不用阿拉伯数字。",
    ],
    not: [
      "The bold number breaks one of the rules: check its size, whether it starts the sentence, and whether it has a unit or a % sign.",
      "加粗的数违反了某条规则：检查它的大小、是否在句首，以及是否带单位或 % 号。",
    ],
  },
};

const numberRuleLines = `
  The study included **7** families from the village.|${words}
  The survey reached **twenty-four** teachers in the district.|${numerals}
  **48** students took part in the trial.|${noStart}
  Only **six percent** of the samples were damaged.|${percents}
  Each bag weighed **five kg** when it was full.|${units}
  Participants were aged **from 12–18**.|${ranges}
  The team interviewed **nine** nurses over two weeks.|${allRight}
  We visited **3** schools in the first month.|${words}
  The library added **thirty-six** new computers.|${numerals}
  **12** of the plants died during the drought.|${noStart}
  Prices rose by **fifteen percent** in a single year.|${percents}
  The runners covered **eight km** before noon.|${units}
  The meeting will last **between 2–3** hours.|${ranges}
  Unemployment fell to **4%** last spring.|${allRight}
  The class had only **4** computers to share.|${words}
  The company hired **fifty** new workers.|${numerals}
  **75** people attended the opening night.|${noStart}
  About **twenty percent** of the forest was lost.|${percents}
  The fish measured **thirty cm** from head to tail.|${units}
  The shop is open **from 9–5** on weekdays.|${ranges}
  In all, **63** volunteers answered the call.|${allRight}
  The report describes **2** possible causes.|${words}
  The festival lasted **eleven** days.|${numerals}
  **30** minutes later, the rain stopped.|${noStart}
  Nearly **nine percent** of the votes were spoiled.|${percents}
  The parcel weighed **two kg** after packing.|${units}
  Temperatures ranged **between 20–25** degrees.|${ranges}
  The bridge is **120 m** long.|${allRight}
  The author wrote **5** novels before she turned forty.|${words}
  Twenty-one students took the exam, and **three** of them failed.|${allRight}
`;

/** numberRuleStep asks which rule a number breaks. */
export const numberRuleStep = point(
  "spotting-the-number-rule",
  t("Spotting the Number Rule", "找出违反的数字规则"),
  t(
    "When you proofread, check every number against the rules in order.\n\n1. **Does it start the sentence?** Then it must be words, or the sentence must be rewritten: *Forty-eight students took part*, or *In all, 48 students took part*.\n2. **Is it a percentage or a measurement?** Then it is a numeral, with *%* or a unit: *6%*, *5 kg*.\n3. **Is it part of a range?** Then use *from ... to ...* or *between ... and ...* in full, or a dash alone: *from 12 to 18* or *12–18*, never *from 12–18*.\n4. **Otherwise, how big is it?** Below 10, words (*seven families*); 10 and above, numerals (*24 teachers*).\n\nIf the number passes every check, it is correct as it stands.",
    "校对时，要按顺序用规则检查每一个数。\n\n1. **它在句首吗？**如果是，就必须写成单词，或者改写句子：*Forty-eight students took part*，或者 *In all, 48 students took part*。\n2. **它是百分数或计量数吗？**如果是，就用阿拉伯数字，加 *%* 或单位：*6%*、*5 kg*。\n3. **它是范围的一部分吗？**如果是，就完整地使用 *from ... to ...* 或 *between ... and ...*，或者只用连接号：*from 12 to 18* 或 *12–18*，绝不能写成 *from 12–18*。\n4. **否则，它有多大？**十以下用单词（*seven families*）；十及以上用阿拉伯数字（*24 teachers*）。\n\n如果这个数通过了每一项检查，它就是正确的。",
  ),
  labelChoice(["Which rule does the number in bold break?", "加粗的数违反了哪条规则？"], numberRuleLines, numberLabels),
);

// Naming the problem of tone.

const suits = "it suits the reader";
const casual = "too casual";
const blunt = "too blunt";
const stiff = "too stiff";

const toneLabels: Readonly<Record<string, Label>> = {
  [suits]: {
    zh: "适合读者",
    why: [
      "The message is courteous and direct at once: it says plainly what is needed, gives a reason, and uses the register the reader expects.",
      "这条信息既礼貌又直接：它清楚地说明需要什么，给出理由，并且使用读者所期待的语体。",
    ],
    not: [
      "This message would not land well with its reader: check whether it sounds like a text to a friend, an order, or an old legal letter.",
      "这条信息不会让读者感到舒服：检查它听起来像发给朋友的短信、命令，还是老式的法律公函。",
    ],
  },
  [casual]: {
    zh: "过于随便",
    why: [
      "Slang, abbreviations such as *u* or *lol*, a greeting like *hey*, or missing capitals suit a friend, not this reader at work.",
      "俚语、*u*、*lol* 这样的缩写、*hey* 这样的招呼，或者不用大写，适合对朋友，不适合工作中的这位读者。",
    ],
    not: [
      "The message has no slang, text-style abbreviations or chatty greetings, so it is not too casual.",
      "这条信息没有俚语、短信式缩写或闲聊式的招呼，所以并不过于随便。",
    ],
  },
  [blunt]: {
    zh: "过于生硬",
    why: [
      "The message gives orders, blames, or says no with no courtesy or reason, so the reader is likely to feel pushed or insulted.",
      "这条信息发号施令、指责别人，或者毫无礼貌、不给理由地拒绝，读者很可能觉得受到逼迫或冒犯。",
    ],
    not: [
      "The message does not order, blame or refuse without courtesy, so it is not too blunt.",
      "这条信息没有毫无礼貌地命令、指责或拒绝，所以并不过于生硬。",
    ],
  },
  [stiff]: {
    zh: "过于刻板",
    why: [
      "Phrases such as *pursuant to*, *herewith* or *it is requested that* sound like an old legal document and hide the simple point.",
      "*pursuant to*、*herewith*、*it is requested that* 这样的说法听起来像老式法律文件，掩盖了简单的要点。",
    ],
    not: [
      "The message uses ordinary words, not old legal phrases, so it is not too stiff.",
      "这条信息用的是平常的词语，而不是老式的法律用语，所以并不过于刻板。",
    ],
  },
};

const toneLines = `
  To your manager, asking for a day off: Would it be possible for me to take Friday off? My sister is getting married, and I have finished the report early.|${suits}
  To your manager, asking for a day off: hey can i skip friday?? wedding thing lol|${casual}
  To your manager, asking for a day off: I am taking Friday off. Put it in the calendar.|${blunt}
  To your manager, asking for a day off: It is hereby requested that the undersigned be granted leave of absence on Friday.|${stiff}
  To a client, about a late delivery: I am sorry that your order is late. It will arrive on Tuesday, and we have refunded the shipping cost.|${suits}
  To a client, about a late delivery: oops ur stuff is late, should be there tues|${casual}
  To a client, about a late delivery: Your order is late. These things happen. It will come when it comes.|${blunt}
  To a client, about a late delivery: Pursuant to your inquiry, please be advised that the aforementioned goods shall be dispatched forthwith.|${stiff}
  To a colleague, declining a meeting: Thank you for the invitation. I cannot attend on Monday because of a deadline, but I would be glad to read the notes afterward.|${suits}
  To a colleague, declining a meeting: nah cant make it monday, send notes or whatever|${casual}
  To a colleague, declining a meeting: No. I do not have time for this meeting.|${blunt}
  To a colleague, declining a meeting: The undersigned regrets that attendance at the aforesaid meeting shall not be possible.|${stiff}
  To a new customer, welcoming them: Welcome, and thank you for choosing us. If you have any questions, you can reply to this email at any time.|${suits}
  To a new customer, welcoming them: yo welcome aboard!!! hit us up whenever|${casual}
  To a new customer, welcoming them: Your account is open. Do not contact us unless there is a problem.|${blunt}
  To a new customer, welcoming them: Herewith we acknowledge receipt of your application and confirm the commencement of services.|${stiff}
  To your team, about a mistake you made: I sent the wrong figures in yesterday's report. The corrected version is attached, and I have added a check to prevent this.|${suits}
  To your team, about a mistake you made: my bad guys, wrong numbers yesterday haha, fixed now|${casual}
  To your team, about a mistake you made: The figures were wrong. Someone should have caught it. Here are the right ones.|${blunt}
  To your team, about a mistake you made: It has come to the attention of the writer that an error was contained within the previously circulated document.|${stiff}
  To a supplier, asking for a lower price: Could you offer a lower price if we order 500 units? We would like to make you our main supplier.|${suits}
  To a supplier, asking for a lower price: can u do it cheaper? we buy a lot lol|${casual}
  To a supplier, asking for a lower price: Your prices are too high. Lower them or we will go elsewhere.|${blunt}
  To a supplier, asking for a lower price: It is respectfully submitted that a reduction in the unit price be considered in respect of the order.|${stiff}
  To a job applicant, rejecting them: Thank you for applying. We have chosen another candidate, but we were impressed by your experience and will keep your details on file.|${suits}
  To a job applicant, rejecting them: sorry dude, didnt get it, good luck tho|${casual}
  To a job applicant, rejecting them: You did not get the job. Please do not apply again.|${blunt}
  To a job applicant, rejecting them: We are obliged to inform you that your candidacy has not been successful in respect of the position heretofore advertised.|${stiff}
  To your manager, reporting a delay: The software update will be two days late because testing found a bug. I will send you a new schedule this afternoon.|${suits}
  To your manager, reporting a delay: update's gonna be late, bug stuff, will tell u later|${casual}
`;

/** toneProblemStep asks what is wrong with the tone of a message at work. */
export const toneProblemStep = point(
  "naming-the-tone-problem",
  t("Naming the Tone Problem", "说出语气的问题"),
  t(
    "When you reread a message before sending it, ask how it will sound to **this** reader. Messages at work usually fail in one of three ways.\n\n- **Too casual**: slang, *hey*, *lol*, *u*, missing capitals or a pile of exclamation marks. It suits a friend, not a manager, a client or a stranger.\n- **Too blunt**: orders, blame, or a bare *no* with no thanks and no reason. Even when the news is bad, the reader deserves courtesy.\n- **Too stiff**: old legal phrases such as *pursuant to*, *herewith*, *the undersigned* or *it is requested that*. They make the writer sound distant and hide a simple point.\n\nA message that suits the reader is polite and plain at once: it says what is needed, gives a reason, and offers help where it can.",
    "发送之前重读信息时，要问一问它在**这位**读者听来会怎样。工作中的信息通常在三个方面出问题。\n\n- **过于随便**：俚语、*hey*、*lol*、*u*、不用大写，或者一连串感叹号。这适合对朋友，不适合对经理、客户或陌生人。\n- **过于生硬**：命令、指责，或者光秃秃的一个 *no*，既不道谢也不说明理由。即使消息不好，读者也应该得到礼貌的对待。\n- **过于刻板**：*pursuant to*、*herewith*、*the undersigned*、*it is requested that* 这样的老式法律用语。它们让作者显得疏远，并掩盖了简单的要点。\n\n适合读者的信息既礼貌又平实：它说明需要什么，给出理由，并在可能的时候提供帮助。",
  ),
  labelChoice(["How does this message suit its reader?", "这条信息是否适合它的读者？"], toneLines, toneLabels),
);

// The item that breaks a list.

/** listLines are a lead-in, the form of the list, three items in that form, the odd item and its form. */
const listLines = fields(`
  Steps for opening the shop:|the command form|Unlock the front door.;Turn on the lights.;Count the cash in the till.|Checking the stock.|the -ing form
  Goals of the project:|the to-form|To reduce waste in the kitchens;To lower costs across the company;To train new staff in the first month|Better customer service|a noun phrase
  Headings of the report:|the -ing form|Choosing a site near the station;Raising the money for the building;Hiring staff for the opening|To build the hall|the to-form
  Before the trip, you should:|the command form|Book the tickets.;Pack light.;Check the weather.|Your passport must be renewed.|a full sentence in the passive
  The new manager will be responsible for:|the -ing form|planning the budget;training new staff;reporting to the board|to handle complaints|the to-form
  Our aims this year are:|the to-form|to open two new branches;to hire twenty staff;to raise sales by 10%|improving the website|the -ing form
  Safety rules in the lab:|the command form|Wear goggles at every bench at all times.;Tie back long hair before you light a burner.;Wash your hands before leaving.|No eating or drinking is allowed.|a full sentence
  Topics for the workshop:|the -ing form|Writing clear emails to clients;Running short and focused meetings;Giving useful feedback to colleagues|How to manage your time|a wh-phrase
  The committee wants to:|the plain verb|reduce costs;improve service;expand online sales|the hiring of more staff|a noun phrase
  Chapters of the handbook:|the -ing form|Joining the company;Using the systems;Taking leave|Benefits and pay|a noun phrase
  To set up the printer:|the command form|Plug the cable into the back of the printer.;Load the paper into the lower tray.;Press the green button on the front panel.|The software should then be installed.|a full sentence in the passive
  Skills listed in the job advert:|the noun form|leadership;teamwork;communication|being able to work under pressure|the -ing form
  This course will teach you how to:|the plain verb|write a business plan;manage a budget;pitch to investors|the marketing of products|a noun phrase
  Sections of the proposal:|the noun form|Background;Methods;Budget|Explaining the timeline|the -ing form
  Duties of the volunteer:|the -ing form|greeting visitors at the main entrance;answering questions about the exhibitions;selling tickets at the front desk|to clean the hall after events|the to-form
  On the first day, new staff should:|the command form|Collect their ID cards from the front desk.;Meet the rest of their team over coffee.;Read the safety guide before lunch.|Lunch is in the canteen at noon.|a full sentence
  Reasons for choosing our firm:|the noun phrase|low prices;fast delivery;friendly service|because we have offices in ten cities|a because-clause
  Objectives of the training:|the to-form|To improve the accuracy of invoices;To speed up the handling of orders;To reduce complaints from our customers|Staff should feel more confident|a full sentence
  The app lets users:|the plain verb|track their spending;set a budget;pay their bills|the sharing of receipts|a noun phrase
  Agenda for Monday's meeting:|the noun phrase|Review of last month's sales figures;Plans for the summer opening hours;Questions from staff about the new rota|Deciding the holiday schedule|the -ing form
  Steps in writing a report:|the -ing form|Gathering the data;Analyzing the results;Drafting the text|Edit the final version|the command form
  The guide explains how to:|the plain verb|apply for a visa before arriving in the country;find housing near the university;open a bank account with a local branch|the enrollment of children in school|a noun phrase
  At the end of the course, students will be able to:|the plain verb|read a balance sheet;plan a project from start to finish;lead a meeting with confidence|knowledge of tax law|a noun phrase
  Features of the new phone:|the noun phrase|a larger and brighter screen;a longer battery life;a better camera for photos at night|it charges faster|a full sentence
  Tips for the interview:|the command form|Arrive ten minutes early.;Research the company and its recent work.;Prepare two or three questions to ask the panel.|It is good to dress smartly.|a full sentence
  Responsibilities of the editor:|the -ing form|checking facts;correcting errors;approving headlines|to meet deadlines|the to-form
  Our plan is to:|the plain verb|cut costs;raise prices slightly;win new customers|the opening of a store abroad|a noun phrase
  Headings of the safety manual:|the -ing form|Handling chemicals;Using ladders;Reporting accidents|Fire exits and alarms|a noun phrase
  Things to bring to the conference:|the noun phrase|your badge from the registration desk;a fully charged laptop;a pack of business cards|remember to bring a charger|a command
  To finish the application:|the command form|Fill in the form.;Attach your CV.;Sign the last page.|Payment of the fee.|a noun phrase
`);

const listBank: ChoiceItem[] = listLines.map(([lead, , items, odd], i): ChoiceItem => {
  const others = (items ?? "").split(";").map((s) => s.trim());
  if (!lead || !odd || others.length !== 3) throw new Error(`a list line needs a lead-in, three items and the odd one: ${lead}`);
  const at = i % 4;
  const shownItems = [...others.slice(0, at), odd, ...others.slice(at)];
  const shown = `${lead}\n${shownItems.map((s) => `- ${s}`).join("\n")}`;
  return [shown, odd, [others[i % 3] ?? "", others[(i + 1) % 3] ?? ""]];
});

const listForm = new Map(listLines.map(([, form, , odd, oddForm]) => [odd ?? "", [form ?? "", oddForm ?? ""] as const]));

/** listBreakStep asks which item of a list breaks its grammatical form. */
export const listBreakStep = point(
  "the-item-that-breaks",
  t("The Item That Breaks the List", "破坏列表的那一项"),
  t(
    "To check a list in a draft, first name the form most of its items share: the **-ing form** (*Choosing a site*), the **command form** (*Choose a site.*), the **to-form** (*To choose a site*), a **plain verb** after a lead-in such as *how to*, or a **noun phrase** (*low prices*). Then look for the item that does not share it.\n\nThe odd item is often a full sentence in a list of commands (*Your passport must be renewed*), a noun built from a verb in a list of verbs (*the hiring of staff*), or a *to*-form among *-ing* forms. Reading each item straight after the lead-in helps: *The app lets users track their spending* works, but *The app lets users the sharing of receipts* does not. Rewrite the odd item in the shared form.",
    "检查草稿中的列表时，先说出大多数项共同采用的形式：**-ing 形式**（*Choosing a site*）、**祈使形式**（*Choose a site.*）、**to 不定式形式**（*To choose a site*）、*how to* 这类引导语之后的**动词原形**，或者**名词短语**（*low prices*）。然后找出不采用这种形式的那一项。\n\n不一致的那一项常常是祈使句列表中的完整句子（*Your passport must be renewed*）、动词列表中由动词变来的名词（*the hiring of staff*），或者一串 *-ing* 形式中的 *to* 不定式。把每一项直接接在引导语后面读一读会有帮助：*The app lets users track their spending* 讲得通，*The app lets users the sharing of receipts* 却讲不通。应该把这一项改写成共同的形式。",
  ),
  choiceGenerator(
    t("Which item breaks the form the rest of the list shares?", "哪一项破坏了列表其余各项共同的形式？"),
    listBank,
    (right) => {
      const [form, oddForm] = listForm.get(right) ?? ["", ""];
      return t(
        `**${right}** breaks the list: the other items use ${form}, but this one is ${oddForm}. Rewrite it in ${form}.`,
        `**${right}** 破坏了列表：其他各项都用 ${form}，而这一项是 ${oddForm}。应该把它改写成 ${form}。`,
      );
    },
    (wrong) =>
      t(
        `“${wrong}” shares its form with most of the other items, so it is not the one that breaks the list.`,
        `“${wrong}” 与其他大多数项形式相同，所以它不是破坏列表的那一项。`,
      ),
  ),
);
