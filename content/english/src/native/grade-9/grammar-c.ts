// Grade 9: modal perfects as writers use and misuse them, and using a source without plagiarizing it.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

// Modal perfects.

/** ofOrHave are sentences with a modal perfect, its modal and its past participle. */
const ofOrHave = [
  ["I ___ called you, but my phone died.", "should", "called"],
  ["She ___ won the race if she had not tripped.", "could", "won"],
  ["They ___ left already; the lights are off.", "must", "left"],
  ["We ___ taken the train instead.", "should", "taken"],
  ["He ___ helped us if we had asked.", "would", "helped"],
  ["You ___ seen her at the library.", "might", "seen"],
  ["The letter ___ arrived by now.", "should", "arrived"],
  ["I ___ finished sooner with a better map.", "could", "finished"],
  ["The thieves ___ used a ladder.", "must", "used"],
  ["Nobody ___ guessed the ending.", "could", "guessed"],
  ["You ___ warned me about the ice.", "should", "warned"],
  ["She ___ forgotten our meeting; she is never late.", "must", "forgotten"],
  ["We ___ stayed longer if it had not rained.", "would", "stayed"],
  ["He ___ taken the wrong road.", "might", "taken"],
  ["I ___ studied harder for the exam.", "should", "studied"],
  ["They ___ heard the news by now.", "must", "heard"],
  ["The cat ___ eaten the fish.", "could", "eaten"],
  ["You ___ been tired after the long drive.", "must", "been"],
  ["We ___ bought tickets earlier.", "should", "bought"],
  ["She ___ passed if she had studied.", "would", "passed"],
  ["He ___ dropped his wallet in the taxi.", "may", "dropped"],
  ["I ___ known you were coming.", "should", "known"],
  ["The storm ___ knocked down the tree.", "must", "knocked"],
  ["They ___ joined us if they had been free.", "could", "joined"],
  ["You ___ gone to bed earlier.", "should", "gone"],
  ["The children ___ broken the window.", "might", "broken"],
  ["She ___ told him the truth.", "would", "told"],
  ["We ___ missed the turn in the dark.", "must", "missed"],
  ["He ___ called for help.", "could", "called"],
  ["The package ___ come while we were out.", "may", "come"],
] as const;

const ofLines = join(
  ofOrHave.map(([s, modal, participle]) => {
    const blank = s.replace(` ${participle}`, "");
    return `${blank}|${modal} have ${participle}|${modal} of ${participle}|${modal} had ${participle}`;
  }),
);

/** pastIfs are a third conditional with the if-clause blank, the past perfect, and two wrong forms. */
const pastIfs = [
  ["If I ___ about the storm, I would have stayed home.", "had known", "would have known", "have known"],
  ["If she ___ the bus, she would have been on time.", "had caught", "would have caught", "has caught"],
  ["If we ___ earlier, we could have seen the parade.", "had left", "would have left", "have left"],
  ["If he ___ the map, he would not have got lost.", "had checked", "would have checked", "has checked"],
  ["If they ___ harder, they might have won.", "had trained", "would have trained", "have trained"],
  ["If you ___ me, I would have helped.", "had asked", "would have asked", "have asked"],
  ["If the ship ___ the iceberg in time, it would have turned.", "had seen", "would have seen", "has seen"],
  ["If I ___ the recipe, the cake would not have burned.", "had followed", "would have followed", "have followed"],
  ["If the council ___ the bridge, the town would have been cut off.", "had not repaired", "would not have repaired", "has not repaired"],
  ["If she ___ the letter, she would have known the truth.", "had read", "would have read", "has read"],
  ["If we ___ a map, we would not have got lost.", "had brought", "would have brought", "have brought"],
  ["If he ___ his alarm, he would have woken up on time.", "had set", "would have set", "has set"],
  ["If they ___ the tickets, they could have gone to the show.", "had bought", "would have bought", "have bought"],
  ["If I ___ more carefully, I would have seen the mistake.", "had looked", "would have looked", "have looked"],
  ["If she ___ the plants, they would not have died.", "had watered", "would have watered", "has watered"],
  ["If you ___ earlier, you might have caught the train.", "had run", "would have run", "have run"],
  ["If the team ___ harder, it could have won the cup.", "had played", "would have played", "has played"],
  ["If we ___ the warning, we would have stayed inside.", "had heard", "would have heard", "have heard"],
  ["If he ___ his homework, he would have passed.", "had done", "would have done", "has done"],
  ["If I ___ the answer, I would have told you.", "had known", "would have known", "have known"],
  ["If they ___ the door, the dog would not have escaped.", "had locked", "would have locked", "have locked"],
  ["If she ___ the job, she would have moved to Rome.", "had taken", "would have taken", "has taken"],
  ["If we ___ sooner, we could have saved the boat.", "had acted", "would have acted", "have acted"],
  ["If you ___ the instructions, the shelf would not have fallen.", "had followed", "would have followed", "have followed"],
  ["If the doctor ___ the X-ray, she would have found the break.", "had checked", "would have checked", "has checked"],
  ["If I ___ my umbrella, I would not have got wet.", "had taken", "would have taken", "have taken"],
  ["If he ___ the truth, they would have forgiven him.", "had told", "would have told", "has told"],
  ["If they ___ the river, they would have reached the village.", "had crossed", "would have crossed", "have crossed"],
  ["If we ___ the café, we would never have met.", "had not visited", "would not have visited", "have not visited"],
  ["If she ___ her coat, she would not have caught a cold.", "had worn", "would have worn", "has worn"],
] as const;

const pastIfLines = join(pastIfs.map((row) => row.join("|")));

/** meanings say in plain words what each modal perfect says about the past. */
const meanings = {
  must: "It is almost certain that this happened.",
  might: "It is possible that this happened.",
  should: "This was the right or expected thing, but it did not happen.",
  cannot: "It is impossible that this happened.",
} as const;

type Sense = keyof typeof meanings;

/** guesses are sentences with a modal perfect and what it says. */
const guesses: readonly (readonly [string, Sense])[] = [
  ["The streets are wet. It must have rained.", "must"],
  ["Her coat is gone. She must have left.", "must"],
  ["The cake is half eaten. Someone must have been hungry.", "must"],
  ["He is late. He might have missed the bus.", "might"],
  ["I can't find my keys. I may have left them at school.", "might"],
  ["The letter is missing. It could have fallen behind the desk.", "might"],
  ["You should have told me about the test.", "should"],
  ["We should have booked a table; the restaurant is full.", "should"],
  ["They ought to have warned the villagers.", "should"],
  ["She can't have written this; she was abroad all year.", "cannot"],
  ["He couldn't have seen us; the room was dark.", "cannot"],
  ["The dog can't have opened the fridge by itself.", "cannot"],
  ["The grass is flattened. A deer must have slept here.", "must"],
  ["All the lights are on. They must have come home.", "must"],
  ["His shoes are muddy. He must have walked across the field.", "must"],
  ["The ground is white. It must have snowed overnight.", "must"],
  ["She hasn't replied. She might have been busy.", "might"],
  ["The bike is gone. Someone may have borrowed it.", "might"],
  ["The window is open. The bird could have flown in that way.", "might"],
  ["He looks upset. He might have heard the news.", "might"],
  ["You should have worn a coat; it is freezing.", "should"],
  ["I should have checked the time before I called.", "should"],
  ["The builders ought to have finished by May.", "should"],
  ["We should have listened to the guide.", "should"],
  ["He can't have stolen the money; he was with me.", "cannot"],
  ["She couldn't have known; nobody told her.", "cannot"],
  ["They can't have finished already; they only started an hour ago.", "cannot"],
  ["The baby couldn't have climbed onto the roof.", "cannot"],
  ["You can't have read the whole book in ten minutes.", "cannot"],
  ["It must have been a mistake; the price is far too low.", "must"],
];

const order: readonly Sense[] = ["must", "might", "should", "cannot"];

const senseLines = join(
  guesses.map(([s, sense], i) => {
    const others = order.filter((o) => o !== sense);
    const a = others[i % 3]!;
    const b = others[(i + 1) % 3]!;
    return `${s}|${meanings[sense]}|${meanings[a]}|${meanings[b]}`;
  }),
);

const modalPerfects = topic("grammar", {
  id: "modal-perfects-in-writing",
  title: ["Modal Perfects in Writing", "写作中的情态动词完成式"],
  summary: [
    "*Should have*, *could have*, *must have* and *might have*: never *should of*, never *would have* in the *if* clause of the past, and what each says about the past.",
    "*should have*、*could have*、*must have* 和 *might have*：绝不写成 *should of*，过去的 *if* 从句中不用 *would have*，以及它们各自对过去表达了什么。",
  ],
  intro: [
    "In conversation, *could've* blurs into *could of*, and *If I would have known* slips out unchallenged—yet in formal writing both marks look careless. Mastering **modal perfects** keeps the spelling, past *if*-clauses, and degree of certainty exact.",
    "在口语里，*could've* 常被听成 *could of*，*If I would have known* 也常常脱口而出——但在正式写作中两者都是明显错误。掌握**情态动词完成式**，才能让拼写、过去条件从句和推测语气都准确无误。",
  ],
  after: ["conditional-sentences"],
  points: [
    choose(
      "have-not-of",
      ["Have, Not Of", "是 have，不是 of"],
      [
        "In speech, *should have* sounds like *should've*, which some writers mishear as *should of*. The form is always a modal, then **have**, then a past participle: *should have called*, *could have won*, *must have left*. *Of* is a preposition and cannot follow a modal, and *had* cannot either.\n\n> **Watch out.** Never trust your ear on *'ve*—expand the contraction in your head to **have** (*should have*, *must have*, *would have*), never *of* or *had*.",
        "在口语中，*should have* 听起来像 *should've*，有些人误听成 *should of*。正确的形式总是情态动词加 **have** 再加过去分词：*should have called*、*could have won*、*must have left*。*of* 是介词，不能跟在情态动词后面，*had* 也不能。\n\n> **注意。** 别光凭口语读音拼写 *'ve*——在心里把它还原成完整的 **have**（*should have*、*must have*、*would have*），绝不能写成 *of* 或 *had*。",
      ],
      ["Which words complete the sentence?", "哪组词能补全句子？"],
      ofLines,
      (right) => [
        `*${right}*: a modal, then *have*, then the past participle.\n\n**Check.** Verify the three-word slot pattern: **modal + have + past participle**—*of* is a preposition and *had* cannot follow a modal.`,
        `*${right}*：情态动词，加 *have*，再加过去分词。\n\n**检验。** 核对三词结构：**情态动词 + have + 过去分词**——*of* 是介词，*had* 也不能跟在情态动词后面。`,
      ],
      [
        [
          "*{wrong}* writes down how *have* sounds in speech; *of* cannot follow a modal.",
          "*{wrong}* 是按 *have* 的口语发音写的；*of* 不能跟在情态动词后面。",
        ],
        ["*{wrong}* puts *had* after a modal, which English does not allow.", "*{wrong}* 把 *had* 放在情态动词后面，英语不允许这样。"],
      ],
    ),
    choose(
      "the-past-if-clause",
      ["The Past If Clause", "过去的 if 从句"],
      [
        "A conditional about the past puts the **past perfect** in the *if* clause and *would have*, *could have* or *might have* in the result: *If I **had known** about the storm, I would have stayed home*. *Would have* belongs in the result only; *If I would have known* is a common error in formal writing.\n\n> **Watch out.** Keep *would have* strictly in the result clause—if the blank sits right inside the *if* clause of a past unreal conditional, use **had + past participle**.",
        "关于过去的条件句在 *if* 从句中用**过去完成时**，在结果从句中用 *would have*、*could have* 或 *might have*：*If I **had known** about the storm, I would have stayed home*。*would have* 只属于结果从句；*If I would have known* 是正式写作中的常见错误。\n\n> **注意。** *would have* 只能留在结果从句里——只要空格位于过去虚拟条件句的 *if* 从句中，就用 **had + 过去分词**。",
      ],
      ["Which form completes the *if* clause?", "哪个形式能补全 *if* 从句？"],
      pastIfLines,
      (right, shown) => [
        `"${shown.replace("___", right)}": the *if* clause of the past takes the past perfect.\n\n**Check.** Look at the result clause (*would/could/might have ...*): it describes an unreal past result, which pairs with **had + past participle** (**${right}**) inside the *if* clause.`,
        `“${shown.replace("___", right)}”：过去的 *if* 从句用过去完成时。\n\n**检验。** 看后面的结果分句（*would/could/might have ...*）：它表示与过去事实相反的结果，因此 *if* 从句必须用过去完成时（**${right}**）。`,
      ],
      [
        ["*{wrong}* belongs in the result clause, not in the *if* clause.", "*{wrong}* 属于结果从句，不属于 *if* 从句。"],
        ["*{wrong}* is a present tense, but the sentence is about the past.", "*{wrong}* 是现在时，但句子说的是过去。"],
      ],
    ),
    choose(
      "what-the-modal-perfect-says",
      ["What the Modal Perfect Says", "情态动词完成式表达了什么"],
      [
        "Each modal perfect judges the past differently. *Must have* means the writer is almost **certain** it happened. *Might have*, *may have* and *could have* mean it is **possible**. *Should have* and *ought to have* mean it was the right or expected thing but **did not happen**. *Can't have* and *couldn't have* mean it is **impossible**.\n\n> **Watch out.** Do not confuse *could have* (positive: *possible*) with *couldn't have* (negative: *impossible*), or *must have* (strong certainty) with *should have* (unfulfilled duty or regret).",
        "每个情态动词完成式对过去的判断都不同。*must have* 表示作者几乎**肯定**它发生过。*might have*、*may have* 和 *could have* 表示它**可能**发生过。*should have* 和 *ought to have* 表示那本是正确或应该做的事，但**没有发生**。*can't have* 和 *couldn't have* 表示它**不可能**发生过。\n\n> **注意。** 不要混淆 *could have*（肯定：可能发生）与 *couldn't have*（否定：不可能发生），也别把 *must have*（高度肯定）和 *should have*（本该做却没做）弄混。",
      ],
      ["What does the second sentence say about the past?", "第二句对过去表达了什么？"],
      senseLines,
      (right) => [
        `The modal perfect here says: ${right}\n\n**Check.** Identify the modal verb before *have* (*must* = almost certain, *might/may/could* = possible, *should/ought to* = right/expected but undone, *can't/couldn't* = impossible): it matches this exact judgment.`,
        `这里的情态动词完成式表达的是：${right}\n\n**检验。** 定位 *have* 前面的情态动词（*must* = 几乎肯定，*might/may/could* = 可能，*should/ought to* = 本该如此却未发生，*can't/couldn't* = 不可能），它与该判断完全一致。`,
      ],
      [
        ["That is what a different modal perfect would say.", "那是另一个情态动词完成式表达的意思。"],
        ["That is what yet another modal perfect would say.", "那是又一个情态动词完成式表达的意思。"],
      ],
    ),
  ],
});

// Plagiarism.

/** uses are a source with its author, then four ways a student used it: copied, patchwritten, paraphrased and quoted. */
const uses = [
  [
    "Okafor",
    "Cities that plant more trees stay cooler in summer, because leaves shade streets and release water into the air.",
    "Cities that plant more trees stay cooler in summer, because leaves shade streets and release water into the air (Okafor).",
    "Cities that plant extra trees remain cooler in the summer, since leaves shade roads and give off water into the air (Okafor).",
    "According to Okafor, trees cool a city in two ways: their shade blocks the sun, and their leaves add moisture to the air.",
    'Okafor notes that leaves "shade streets and release water into the air."',
  ],
  [
    "Lindqvist",
    "Teenagers who sleep less than eight hours a night are more likely to feel anxious and to struggle in class.",
    "Teenagers who sleep less than eight hours a night are more likely to feel anxious and to struggle in class (Lindqvist).",
    "Teens who sleep under eight hours each night are more likely to feel worried and to have trouble in class (Lindqvist).",
    "Lindqvist links short sleep to both worry and weaker schoolwork among teenagers.",
    'Lindqvist warns that short sleepers are "more likely to feel anxious and to struggle in class."',
  ],
  [
    "Reyes",
    "The printing press made books cheap enough for ordinary families, and reading spread far beyond the monasteries.",
    "The printing press made books cheap enough for ordinary families, and reading spread far beyond the monasteries (Reyes).",
    "The printing press made books inexpensive enough for normal families, and reading spread well beyond the monasteries (Reyes).",
    "Reyes argues that once printing lowered the price of books, reading stopped being a skill mainly of monks.",
    'Reyes writes that printed books became "cheap enough for ordinary families."',
  ],
  [
    "Haddad",
    "Coral reefs cover a tiny part of the ocean floor but shelter about a quarter of all sea species.",
    "Coral reefs cover a tiny part of the ocean floor but shelter about a quarter of all sea species (Haddad).",
    "Coral reefs take up a small part of the sea floor but protect around a quarter of all ocean species (Haddad).",
    "Haddad points out that reefs, though small in area, are home to roughly one in four kinds of sea life.",
    'Haddad observes that reefs "shelter about a quarter of all sea species."',
  ],
  [
    "Moreau",
    "Factory work in the nineteenth century pulled families from farms into crowded cities, where children often worked long shifts.",
    "Factory work in the nineteenth century pulled families from farms into crowded cities, where children often worked long shifts (Moreau).",
    "Factory jobs in the nineteenth century drew families from farms into packed cities, where children frequently worked long hours (Moreau).",
    "Moreau describes how the factories of the eighteen hundreds emptied the countryside and put many city children to work.",
    'Moreau notes that in the new cities "children often worked long shifts."',
  ],
  [
    "Tanaka",
    "Learning a second language early seems to make children better at switching between tasks.",
    "Learning a second language early seems to make children better at switching between tasks (Tanaka).",
    "Learning another language young appears to make children better at changing between tasks (Tanaka).",
    "Tanaka suggests that children who learn two languages may move more easily from one task to another.",
    'Tanaka finds that early language learners seem "better at switching between tasks."',
  ],
  [
    "Osei",
    "Volcanic ash can ground airplanes for days, because the glassy particles melt inside jet engines.",
    "Volcanic ash can ground airplanes for days, because the glassy particles melt inside jet engines (Osei).",
    "Volcanic ash can stop airplanes for days, since the glass-like particles melt within jet engines (Osei).",
    "Osei explains that planes stay on the ground after an eruption because ash turns to glass in a hot engine.",
    'Osei explains that the "glassy particles melt inside jet engines."',
  ],
  [
    "Brennan",
    "Advertisers aim at children because children influence much of what their families buy.",
    "Advertisers aim at children because children influence much of what their families buy (Brennan).",
    "Advertisers target kids because kids affect a lot of what their families purchase (Brennan).",
    "Brennan argues that companies sell to children in order to reach their parents' wallets.",
    'Brennan claims that children "influence much of what their families buy."',
  ],
] as const;

const useLabels = join(
  uses.flatMap(([, source, copied, patched, paraphrased, quoted]) => [
    `Source: "${source}" Student: ${copied}|copied without quotation marks`,
    `Source: "${source}" Student: ${patched}|patchwriting`,
    `Source: "${source}" Student: ${paraphrased} (cited)|fair paraphrase`,
    `Source: "${source}" Student: ${quoted} (cited)|fair quotation`,
  ]),
);

/** moreFair are more sources with their author, a patchwritten use and a fair paraphrase. */
const moreFair = [
  [
    "Alvarez",
    "Bees visit flowers in a fixed order, which helps them gather nectar with the least effort.",
    "Bees go to flowers in a set order, which helps them collect nectar with the smallest effort (Alvarez).",
    "Alvarez reports that bees save energy by following the same route from flower to flower.",
  ],
  [
    "Chen",
    "Children who read for pleasure tend to have larger vocabularies than those who read only for school.",
    "Kids who read for fun tend to have bigger vocabularies than those who read just for school (Chen).",
    "Chen finds that reading for enjoyment, not only for assignments, goes along with knowing more words.",
  ],
  [
    "Novak",
    "Ancient Romans built roads so straight that some still guide modern highways.",
    "Ancient Romans made roads so direct that some still lead modern highways (Novak).",
    "According to Novak, a few of today's highways still follow the straight lines the Romans laid down.",
  ],
  [
    "Mensah",
    "Plastic bags take hundreds of years to break down, so most of them are still somewhere on Earth.",
    "Plastic bags need hundreds of years to break apart, so most of them are still someplace on Earth (Mensah).",
    "Mensah points out that because plastic bags last for centuries, nearly every one ever made still exists.",
  ],
  [
    "Ibrahim",
    "Regular exercise improves memory by increasing the flow of blood to the brain.",
    "Frequent exercise boosts memory by raising the flow of blood to the brain (Ibrahim).",
    "Ibrahim explains that working out helps people remember because it sends more blood to the brain.",
  ],
  [
    "Kowalski",
    "The first public libraries let workers borrow books they could never have afforded to buy.",
    "The earliest public libraries allowed workers to borrow books they could never have been able to buy (Kowalski).",
    "Kowalski argues that public libraries opened reading to working people who had no money for books.",
  ],
  [
    "Duarte",
    "Wolves returned to the park and changed the behavior of deer, which allowed young trees to grow again.",
    "Wolves came back to the park and altered the behavior of deer, which let young trees grow once more (Duarte).",
    "Duarte shows that the wolves' return made deer move differently, and the forest began to recover.",
  ],
  [
    "Sato",
    "Earthquakes cannot be predicted, but buildings can be designed to sway rather than collapse.",
    "Earthquakes can't be forecast, but buildings can be planned to sway instead of collapse (Sato).",
    "Sato notes that while no one can foresee an earthquake, engineers can make buildings that bend without falling.",
  ],
  [
    "Fischer",
    "Most of the salt people eat comes from bread and ready meals, not from the salt shaker.",
    "Most of the salt people consume comes from bread and prepared meals, not from the salt shaker (Fischer).",
    "Fischer observes that packaged food, more than the salt we add at the table, supplies most of our salt.",
  ],
  [
    "Abara",
    "Students remember more when they test themselves than when they simply reread their notes.",
    "Students recall more when they quiz themselves than when they just reread their notes (Abara).",
    "Abara finds that practice tests fix ideas in memory better than another pass through the notes.",
  ],
  [
    "Lindgren",
    "The telegraph shrank the time it took news to cross an ocean from weeks to minutes.",
    "The telegraph reduced the time it took news to cross an ocean from weeks to minutes (Lindgren).",
    "Lindgren describes how the telegraph let a message reach another continent almost at once.",
  ],
  [
    "Park",
    "Octopuses can change the color of their skin in less than a second to hide from predators.",
    "Octopuses can alter the color of their skin in under a second to hide from hunters (Park).",
    "Park notes that an octopus escapes its enemies by changing color almost instantly.",
  ],
  [
    "Rossi",
    "Cities with good public transport have fewer traffic deaths than cities built around cars.",
    "Cities with strong public transport have fewer traffic deaths than cities designed around cars (Rossi).",
    "Rossi links safer streets to buses and trains: where fewer people drive, fewer die on the roads.",
  ],
  [
    "Nkosi",
    "Music that is learned in childhood is often the last thing a person with memory loss forgets.",
    "Music that is learned in youth is often the final thing a person with memory loss forgets (Nkosi).",
    "Nkosi observes that songs from early life tend to stay with people even as other memories fade.",
  ],
  [
    "Varga",
    "Medieval monks copied books by hand, and a single Bible could take years to finish.",
    "Medieval monks copied books by hand, and one Bible could need years to complete (Varga).",
    "Varga explains that before printing, making one Bible by hand was the work of years.",
  ],
  [
    "Hughes",
    "Wetlands soak up floodwater like a sponge and release it slowly, protecting nearby towns.",
    "Wetlands absorb floodwater like a sponge and let it out slowly, guarding nearby towns (Hughes).",
    "Hughes argues that marshes protect towns by holding back floodwater and letting it drain over time.",
  ],
  [
    "Oduya",
    "Teenagers' body clocks shift later, so early school start times leave many of them tired.",
    "Teens' body clocks move later, so early school start times leave lots of them tired (Oduya).",
    "Oduya explains that teenagers naturally fall asleep and wake later, which makes early classes hard for them.",
  ],
  [
    "Marchetti",
    "The invention of the refrigerator changed diets, because fresh food could be kept for days.",
    "The creation of the refrigerator altered diets, because fresh food could be stored for days (Marchetti).",
    "Marchetti shows how keeping food cold at home let families eat fresh food far more often.",
  ],
  [
    "Bauer",
    "Many birds find their way across continents by sensing the Earth's magnetic field.",
    "Lots of birds find their way across continents by detecting the Earth's magnetic field (Bauer).",
    "Bauer reports that migrating birds seem to steer by the planet's magnetism.",
  ],
  [
    "Quispe",
    "The potato was first grown in the Andes and later fed much of Europe.",
    "The potato was originally grown in the Andes and later fed a lot of Europe (Quispe).",
    "Quispe traces the potato from its first fields in South American mountains to European tables.",
  ],
  [
    "Eriksen",
    "Video calls feel more tiring than meetings in person, because people watch their own faces.",
    "Video calls feel more exhausting than meetings in person, because people look at their own faces (Eriksen).",
    "Eriksen suggests that seeing ourselves on screen is part of why online meetings wear us out.",
  ],
  [
    "Achebe-Lowe",
    "Small farms grow most of the world's food, even though they hold a minority of its farmland.",
    "Small farms produce most of the world's food, although they hold a minority of its farmland (Achebe-Lowe).",
    "Achebe-Lowe points out that farms with little land still feed most of the planet.",
  ],
] as const;

const fairLines = join([
  ...uses.map(([author, source, copied, patched, paraphrased]) => `Source (${author}): "${source}"|${paraphrased}|${copied}|${patched}`),
  ...moreFair.map(
    ([author, source, patched, paraphrased]) =>
      `Source (${author}): "${source}"|${paraphrased}|${source.replace(/\.$/u, "")} (${author}).|${patched}`,
  ),
]);

/** citing are facts a reader can check anywhere, and facts that came from one source. */
const commonKnowledge = [
  "The Earth orbits the Sun once a year.",
  "Water freezes at zero degrees Celsius.",
  "World War II ended in 1945.",
  "Paris is the capital of France.",
  "Shakespeare wrote Hamlet.",
  "The heart pumps blood around the body.",
  "The Pacific is the largest ocean.",
  "Plants need sunlight to grow.",
  "The Great Wall is in China.",
  "George Washington was the first president of the United States.",
  "The Moon orbits the Earth.",
  "Mount Everest is the highest mountain on Earth.",
  "There are seven continents.",
  "The Nile flows through Egypt.",
  "Humans need oxygen to live.",
];

const fromASource = [
  "A 2019 survey found that 62 percent of teenagers sleep less than eight hours.",
  "One historian argues that the war was lost in its first month.",
  "A study of 3,000 students found that music lessons improved memory.",
  "According to one estimate, the city lost a fifth of its trees in a decade.",
  "A researcher found that bees can recognize human faces.",
  "One critic calls the novel the finest of its century.",
  "A report counted 240 species of bird in the park last spring.",
  "Recent measurements show the glacier shrank by 30 meters in one year.",
  "An economist predicts that prices will rise by four percent next year.",
  "A survey of nurses found that most work more than one night shift a week.",
  "A 2021 study found that walking for twenty minutes a day lowers stress.",
  "One biographer claims the painter was happiest in his last years.",
  "A poll of 1,200 voters showed that most favor a new library.",
  "Researchers estimate that the forest stores ten million tonnes of carbon.",
  "A local report says traffic on the bridge doubled after it reopened.",
];

const citeLabels = join([...commonKnowledge.map((f) => `${f}|common knowledge`), ...fromASource.map((f) => `${f}|needs a citation`)]);

const plagiarism = topic("writing", {
  id: "avoiding-plagiarism",
  title: ["Avoiding Plagiarism", "避免抄袭"],
  summary: [
    "Using a source honestly: copied words in quotation marks, a paraphrase in your own words and structure, a citation for each idea that came from someone else, and none for common knowledge.",
    "诚实地使用资料：抄录的词句要加引号，转述要用自己的词语和句式，来自他人的每个观点都要注明出处，常识则不需要。",
  ],
  intro: [
    "Swapping *big* for *large* in someone else's sentence and tacking on a citation at the end is still **patchwriting**, not honest paraphrasing. Knowing when to quote, how to rebuild an idea in your own structure, and what requires a citation keeps your research completely honest.",
    "照搬别人的句子结构、只把几个词换成同义词，就算末尾附了出处依然属于**拼凑改写**，而不是合理转述。分清何时引用、如何用自己的句式重述观点、以及哪些事实需要注明出处，才能做到诚实治学。",
  ],
  after: ["paraphrasing-a-source"],
  points: [
    label(
      "fair-use-or-plagiarism",
      ["Fair Use or Plagiarism", "合理使用还是抄袭"],
      [
        "Copying a source's words without **quotation marks** is plagiarism, even with a citation. So is **patchwriting**: keeping the source's sentence and swapping a few words for synonyms. A **fair paraphrase** restates the idea in your own words and your own structure, and cites the author. A **fair quotation** puts the author's exact words in quotation marks, and cites them too.\n\n> **Watch out.** Adding `(Author)` at the end never excuses missing quotation marks or patchwriting—if the exact wording or sentence skeleton still belongs to the source, it is plagiarism.",
        "照抄资料的原话而不加**引号**是抄袭，即使注明了出处也一样。**拼凑改写**也是抄袭：保留原句结构，只把几个词换成同义词。**合理转述**用你自己的词语和句式重述观点，并注明作者。**合理引用**把作者的原话放在引号里，同样要注明出处。\n\n> **注意。** 在句末加上 `(作者)` 并不能抵消漏加引号或拼凑改写——只要原话或原句骨架仍照搬原文，就构成抄袭。",
      ],
      ["How does the student use the source?", "这个学生是如何使用资料的？"],
      useLabels,
      {
        "copied without quotation marks": L(
          "照抄而未加引号",
          "The student's sentence is the source's sentence word for word, with no quotation marks.\n\n**Check.** Compare the student's text word by word against the Source: the wording is identical and lacks quotation marks, so even a citation cannot save it.",
          "学生的句子与原句一字不差，而且没有加引号。\n\n**检验。** 把学生句与原文逐词比对：用词完全照搬却未加引号，哪怕附了出处也是照抄。",
          "The student did not copy the source word for word without quotation marks.",
          "这个学生并没有一字不差地照抄而不加引号。",
        ),
        patchwriting: L(
          "拼凑改写",
          "The student kept the source's sentence and only swapped some words for synonyms.\n\n**Check.** Line up the clauses of the student's sentence under the Source: the clause order and skeleton stay the same, with only isolated synonyms swapped in.",
          "学生保留了原句的结构，只把一些词换成了同义词。\n\n**检验。** 把学生句和原文逐分句对齐：句式骨架原封不动，只是零星换了几个近义词。",
          "The student did not just swap words in the source's sentence.",
          "这个学生并不只是替换了原句中的词。",
        ),
        "fair paraphrase": L(
          "合理转述",
          "The student restated the idea in new words and a new structure, and cited the author.\n\n**Check.** Compare both vocabulary *and* sentence structure against the Source: both are freshly built, the core idea stays accurate, and the author is credited.",
          "学生用新的词语和句式重述了观点，并注明了作者。\n\n**检验。** 同时对照用词和句式：两者都重新组织过，原意准确，且注明了作者。",
          "The student did not restate the idea in their own words and structure.",
          "这个学生没有用自己的词语和句式重述观点。",
        ),
        "fair quotation": L(
          "合理引用",
          "The author's exact words are in quotation marks, and the author is named.\n\n**Check.** Look for the quotation marks around the borrowed phrase and the author's name in the sentence: both exact wording and credit are properly marked.",
          "作者的原话放在了引号里，并点明了作者。\n\n**检验。** 检查借用的原话是否放在引号里，且句中注明了作者：原词和出处都标得清清楚楚。",
          "The student did not put the author's exact words in quotation marks.",
          "这个学生没有把作者的原话放在引号里。",
        ),
      },
    ),
    choose(
      "the-fair-paraphrase",
      ["The Fair Paraphrase", "合理的转述"],
      [
        "To paraphrase fairly, read the source, look away, and write the idea as you would explain it to a friend; then check that no phrase of the source survives without quotation marks, and cite the author. A version that follows the source word by word, even with synonyms, is not your own.\n\n> **Watch out.** Do not let a handful of synonym swaps (*kids* for *children*, *alter* for *change*) fool you—overlay the candidate sentence on the original; if the clause order matches step for step, it is patchwriting.",
        "要合理地转述，先读原文，然后移开视线，像给朋友解释那样写下这个观点；再检查有没有原文的短语未加引号就留了下来，并注明作者。逐字跟随原文的版本，即使换了同义词，也不是你自己的。\n\n> **注意。** 别被换几个同义词（如把 *children* 换成 *kids*）蒙蔽——把选项叠在原句上对照，只要分句顺序一步步照搬，就是拼凑改写。",
      ],
      ["Which is a fair paraphrase of the source?", "哪个是对这段资料的合理转述？"],
      fairLines,
      (right) => [
        `"${right}" restates the idea in new words and a new structure, and names the author.\n\n**Check.** Compare the sentence skeleton against the Source: it reorganizes the clauses in fresh words while preserving the meaning and crediting the author.`,
        `“${right}”用新的词语和句式重述了观点，并点明了作者。\n\n**检验。** 把句式骨架与原文对照：分句和措辞都已重新组织，意思准确无误，并且注明了作者。`,
      ],
      [
        ['"{wrong}" copies the source word for word without quotation marks.', "“{wrong}”一字不差地照抄了原文，而且没有加引号。"],
        ['"{wrong}" keeps the source\'s sentence and only swaps some words.', "“{wrong}”保留了原句，只替换了一些词。"],
      ],
    ),
    label(
      "what-needs-a-citation",
      ["What Needs a Citation", "什么需要注明出处"],
      [
        "**Common knowledge**, facts that most readers know or can find in any reference book, needs no citation: *Water freezes at zero degrees Celsius*. A statistic, a finding, an estimate or someone's opinion came from **one source**, so it **needs a citation**: *A 2019 survey found that 62 percent of teenagers sleep less than eight hours*. When in doubt, cite.\n\n> **Watch out.** Any specific number from a survey, study, poll, or measurement—and any individual scholar's argument or estimate—is *never* common knowledge and must always be cited.",
        "**常识**，即大多数读者都知道或在任何参考书中都能查到的事实，不需要注明出处：*Water freezes at zero degrees Celsius*。统计数字、研究发现、估计或某人的观点来自**某个特定来源**，所以**需要注明出处**：*A 2019 survey found that 62 percent of teenagers sleep less than eight hours*。拿不准的时候，就注明出处。\n\n> **注意。** 任何来自调查、研究、民调或测量的具体数字，以及某位学者个人的论断或估算，都*绝不是*常识，必须注明出处。",
      ],
      ["Does this sentence need a citation?", "这个句子需要注明出处吗？"],
      citeLabels,
      {
        "common knowledge": L(
          "常识",
          "Most readers know this, and any reference book states it.\n\n**Check.** Ask whether you would need a specific study or author to verify this fact: no—it is basic, widely established reference knowledge.",
          "大多数读者都知道这一点，任何参考书都有记载。\n\n**检验。** 问问自己核实这条事实需不需要找某项特定研究或作者：不需要，它是人尽皆知的基础常识。",
          "This is a finding, a number or an opinion from one source.",
          "这是来自某个特定来源的发现、数字或观点。",
        ),
        "needs a citation": L(
          "需要注明出处",
          "This is a finding, a number or an opinion that came from one source.\n\n**Check.** Spot the source-specific cue (a survey, study, estimate, measurement, or individual claim): because a reader could ask *'Says who?'*, it requires a citation.",
          "这是来自某个特定来源的发现、数字或观点。\n\n**检验。** 认出特定来源的标志（调查、研究、估算、测量或个人论断）：读者完全可以追问“这是谁说的？”，因此必须注明出处。",
          "Most readers know this, and any reference book states it.",
          "大多数读者都知道这一点，任何参考书都有记载。",
        ),
      },
    ),
  ],
});

/** grammarTopics9c are the topics of grade 9 added for modal perfects and the honest use of sources. */
export const grammarTopics9c: readonly TopicDef[] = [modalPerfects, plagiarism];
