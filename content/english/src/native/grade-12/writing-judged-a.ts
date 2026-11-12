// Grade 12: writing judged by a model, part one: a profile of a person of conscience, a philosophical essay and a
// review of a work of art.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { after, covers } from "../grade-5/links.ts";
import { criterion, onePiece } from "../grade-5/writing-judged-a.ts";

/** limits are the length limits of a grade 12 essay. */
export const limits = { minWords: 180, maxChars: 5400 };

/** profileBank gives the facts of a person who acted on conscience, for the student to turn into a profile. */
const profileBank: readonly WritingItem[] = [
  {
    task: 'Write a profile of this person of conscience. Facts: Elena Varga, 52, was a quality inspector at a medicine factory for nineteen years. In 2021 she found that test results for a children\'s cough syrup had been copied from old batches. Her manager told her to sign the report anyway. She refused, wrote to the national regulator and was fired two weeks later. The regulator found the syrup contaminated and recalled 400,000 bottles. She now works at a bakery. She says: "I kept thinking of the bottles on kitchen shelves."',
    model:
      'Every morning at five, Elena Varga slides trays of bread into an oven in a small bakery. Four years ago she held a different kind of tray: rows of test tubes from a medicine factory where she had worked as a quality inspector for nineteen years.\n\nIn 2021 she noticed something wrong. The test results for a children\'s cough syrup were not new; they had been copied from old batches. When she raised it, her manager told her to sign the report anyway. Signing would have taken a second. Refusing could cost her career.\n\nShe refused. She wrote to the national regulator, and two weeks later she was fired. Investigators then tested the syrup and found it contaminated. Four hundred thousand bottles were recalled.\n\nAsked why she risked so much, she does not talk about rules or courage. "I kept thinking of the bottles on kitchen shelves," she says. For her, the numbers on a report were never abstract; each stood for a child with a cough and a parent who trusted the label.\n\nVarga paid for her choice with the work she loved. Yet her story shows that safety does not rest only on laws and laboratories. It rests on ordinary people who will not sign their names to a lie.',
  },
  {
    task: 'Write a profile of this person of conscience. Facts: Samuel Okafor, 38, was a police officer for twelve years. In 2019 he saw two colleagues beat a handcuffed teenager in the back of a van. When asked to write that the boy had attacked them, he wrote what he saw instead. He was moved to night duty, colleagues stopped speaking to him, and his car tyres were slashed. Both officers were convicted. He left the force and now trains new officers in ethics. He says: "The uniform is a promise, not a shield."',
    model:
      'In the back of a police van in 2019, a handcuffed teenager was beaten by two officers. A third officer, Samuel Okafor, was watching. What he did next cost him his career on the street.\n\nOkafor had served for twelve years. He knew the unwritten rule: officers protect each other. When he was asked to write that the boy had attacked his colleagues, the easy path was a single false sentence. Instead he wrote what he had seen.\n\nThe punishment was quiet but constant. He was moved to night duty. Colleagues stopped speaking to him in the locker room. One morning he found the tyres of his car slashed. No one was ever charged for that.\n\nHis report, however, held. Both officers were convicted, and the teenager\'s account was believed because a policeman had confirmed it.\n\nOkafor eventually left the force, but he did not leave policing. He now trains new officers in ethics, and he gives them one sentence to remember: "The uniform is a promise, not a shield." By this he means that the badge gives power only on condition that it is used for the public.\n\nHis story matters because loyalty is usually praised. Okafor shows that loyalty to friends can become a betrayal of everyone else, and that one honest report can restore trust in a whole institution.',
  },
  {
    task: 'Write a profile of this person of conscience. Facts: Mei Lin Zhou, 29, was an engineer at a company that built a face-recognition app. In 2022 she learned the company planned to sell the app to a government that tracked protesters. She asked for the deal to be reviewed; her request was ignored. She resigned and published a public letter explaining why. Two other engineers resigned with her. The company cancelled the deal three months later. She now teaches computer science at a college. She says: "Code does what it is told. People have to decide what to tell it."',
    model:
      'Mei Lin Zhou is twenty-nine, and she has already walked away from the best job she ever had.\n\nIn 2022 she was an engineer at a company that built a face-recognition app. The work was exciting and the pay was high. Then she learned that the company planned to sell the app to a government that tracked protesters. The faces in the database would belong to people whose only crime was to march.\n\nZhou did what an employee is supposed to do first: she asked for the deal to be reviewed. Her request was ignored. So she resigned, and she published a public letter explaining exactly why. Two other engineers resigned with her.\n\nFor a while, nothing seemed to change. But three months later the company cancelled the deal. The letter had made the sale a public question, and the company could no longer pretend it was only business.\n\nZhou now teaches computer science at a college, where she asks students to consider not only whether their code works but what it will be used for. "Code does what it is told," she says. "People have to decide what to tell it."\n\nHer story is a reminder that technology is never neutral on its own. The choices that matter are made by the people who build it, and sometimes the most important skill an engineer has is the willingness to say no.',
  },
  {
    task: 'Write a profile of this person of conscience. Facts: Tomas Reyes, 61, was the mayor of a small mining town for ten years. In 2017 a company offered the town five million dollars to allow a new mine above the river. Most residents wanted the money. Water tests showed the mine could poison the river used by three villages downstream. Reyes vetoed the plan and lost the next election. A neighboring town accepted a similar mine and its river was polluted in 2020. Reyes now runs a hardware shop. He says: "The river does not vote, but it still belongs to someone."',
    model:
      'Tomas Reyes lost his job as mayor because he said no to five million dollars.\n\nIn 2017 a mining company made his small town an offer: the money in exchange for permission to open a new mine above the river. For a town with closing shops and young people moving away, it looked like rescue. Most residents wanted to accept.\n\nReyes read the water tests instead. They showed that waste from the mine could poison the river, and that river supplied three villages downstream. Those villagers would not share in the money, and they had no vote in his town.\n\nHe vetoed the plan. At the next election, voters replaced him with a candidate who promised to bring the mine back. Reyes went home and opened a hardware shop.\n\nThree years later a neighboring town accepted a similar mine. In 2020 its river was polluted, and the cleanup is still going on. Some of the people who voted against Reyes have since come into his shop to tell him he was right.\n\nHe explains his choice with a single line: "The river does not vote, but it still belongs to someone." A leader, in his view, answers not only to the people who elect him but to those affected by what he decides.\n\nHis story shows the hardest part of conscience in public life: doing the right thing even when the majority, and your own future, are against you.',
  },
  {
    task: "Write a profile of this person of conscience. Facts: Hannah Brooks, 44, was a nurse in a care home for elderly people. In 2018 she noticed residents were being given sleeping pills without their doctors' orders, to keep them quiet at night. She reported it to the home's owners, who did nothing. She then reported it to the health inspectors and was suspended. Inspectors confirmed the abuse and closed the home. Brooks was cleared and now works at a hospital. She says: \"They could not speak for themselves, so someone had to.\"",
    model:
      "The residents of the care home where Hannah Brooks worked were quiet at night. In 2018 she found out why.\n\nBrooks, a nurse, noticed that elderly residents were being given sleeping pills that no doctor had ordered. The pills kept them drowsy and easy to manage. For the staff, nights were calmer. For the residents, days were lost in a fog they had not chosen.\n\nBrooks first did what loyal staff are told to do: she reported it to the home's owners. They did nothing. She then went to the health inspectors. Her reward was a suspension, as if she, not the drugging, were the problem.\n\nThe inspectors visited and confirmed everything she had said. The home was closed, the residents were moved, and Brooks was cleared of any wrongdoing. She now works at a hospital.\n\nShe does not describe herself as brave. \"They could not speak for themselves, so someone had to,\" she says. The people in that home were old, confused and often without visitors. Their silence was exactly what made them easy to abuse.\n\nBrooks's story shows that the weakest members of a society are protected less by rules than by the people who are close enough to see what is happening and willing to speak. Her choice was simple to describe and costly to make.",
  },
  {
    task: "Write a profile of this person of conscience. Facts: David Ashworth, 70, was a newspaper editor for thirty years. In 1994 the paper's owner, a property developer, ordered him to drop a story showing that the owner's company had bribed city officials. Ashworth published it anyway and was dismissed the next day. Two officials were later jailed. He started a small independent news website that still runs today. He says: \"A newspaper that cannot report on its owner is an advertisement.\"",
    model:
      "In 1994 David Ashworth had a story ready for the front page and an order not to print it.\n\nAshworth was the editor of a city newspaper. His reporters had found evidence that a property developer had bribed city officials to win building permits. The developer happened to own the newspaper. The order came down from the top: drop the story.\n\nHe published it anyway. The next day he was dismissed from the job he had held for years.\n\nThe story did its work. Investigators followed the evidence, and two city officials were later jailed. The developer's projects were reviewed. Ashworth, meanwhile, was out of work at an age when few papers were hiring editors.\n\nInstead of looking for another owner, he started a small independent news website, run by readers' subscriptions. It still runs today, and Ashworth, now seventy, still reads every story before it goes out.\n\nHe explains his decision in one sentence: \"A newspaper that cannot report on its owner is an advertisement.\" News, in his view, is only news if it can reach the people who own it.\n\nAshworth's story matters because the freedom of the press is usually defended against governments. He shows that it can also be threatened from inside, and that it survives only when editors are willing to lose their jobs rather than their independence.",
  },
  {
    task: "Write a profile of this person of conscience. Facts: Amira Hassan, 17, a high school student, discovered that her school's exam results had been raised by teachers to improve the school's ranking. Her own grade had been raised too. She told the school board, knowing her grades might be lowered. Classmates accused her of ruining their university chances. The board confirmed the changes and corrected the grades. Amira's grade fell from an A to a B. She is now studying law. She says: \"A grade I did not earn is a lie with my name on it.\"",
    model:
      "Most students would be happy to discover that their grade had been raised. Amira Hassan, seventeen, was not.\n\nIn her final year of high school, she found that teachers had raised the school's exam results to push it higher in the rankings. Her own grade was among those changed. Reporting it meant risking the A on her record and the university place it might bring.\n\nShe told the school board anyway. The reaction from her classmates was harsh. Some accused her of ruining their chances of getting into university. A few stopped speaking to her for the rest of the year.\n\nThe board investigated and confirmed that the grades had been changed. They were corrected. Amira's own grade fell from an A to a B.\n\nShe now studies law, and she does not regret the trade. \"A grade I did not earn is a lie with my name on it,\" she says. For her, the problem was not only that the school had cheated, but that every student had been made a part of the lie without being asked.\n\nAmira's story is striking because she was young and had the most to lose personally. She shows that conscience is not reserved for adults in powerful jobs. It can belong to anyone who refuses to benefit from a wrong, even when the wrong is in their favor.",
  },
  {
    task: "Write a profile of this person of conscience. Facts: Kenji Watanabe, 55, was a safety engineer at a nuclear power plant. In 2009 he warned in writing that the plant's sea wall was too low for a large tsunami. His bosses said the risk was too small to justify the cost. He repeated the warning three times and was moved to a desk job. In 2015 a large wave flooded the plant's backup generators, though a disaster was avoided. The wall was then raised. He says: \"Rare is not the same as never.\"",
    model:
      "Kenji Watanabe wrote the same warning four times before anyone listened.\n\nIn 2009 he was a safety engineer at a nuclear power plant on the coast. His calculations showed that the plant's sea wall was too low to stop a large tsunami. He put the warning in writing. His bosses replied that the risk was too small to justify the cost of building a higher wall.\n\nWatanabe did not let it go. He repeated the warning three more times. Each time it was filed and ignored, and eventually he was moved from engineering to a desk job where his reports would no longer reach anyone.\n\nIn 2015 a large wave struck the coast. It flooded the plant's backup generators, the machines meant to keep the reactor cool in an emergency. Through luck and quick work, a disaster was avoided. Afterwards, the wall was raised.\n\nWatanabe sums up the lesson in four words: \"Rare is not the same as never.\" An event that happens once in a hundred years will still happen, and when the cost of that event is enormous, a small chance deserves serious attention.\n\nHis story shows how institutions can ignore an inconvenient truth by moving the person who tells it. It also shows that conscience sometimes looks less like a single heroic act than like patient, unpopular repetition.",
  },
  {
    task: "Write a profile of this person of conscience. Facts: Grace Mensah, 47, was an accountant at a charity that raised money for clean water. In 2020 she found that almost half the donations were being spent on the directors' travel and cars. She raised it with the board and was told to keep quiet. She resigned and gave her records to a journalist. The charity was investigated, two directors resigned, and the money was repaid. She now runs a website that checks charities' accounts. She says: \"Every dollar was someone's trust.\"",
    model:
      "Grace Mensah's job was to make the numbers add up. In 2020 they added up to something she could not accept.\n\nShe was the accountant at a charity that raised money for clean water in poor villages. Going through the books, she found that almost half of the donations were being spent on the directors' travel and cars. Each first-class ticket was money that donors believed would become a well.\n\nMensah raised it with the board. She was told to keep quiet and to remember that the charity's reputation was at stake. She saw it the other way: the reputation was exactly what was being abused.\n\nShe resigned and gave her records to a journalist. The story led to an official investigation. Two directors resigned, and the money spent on travel and cars was repaid to the charity.\n\nMensah now runs a website that checks the accounts of charities and shows donors how their money is spent. \"Every dollar was someone's trust,\" she says. For her, a donation is not only money; it is a promise between a stranger and the people the stranger wants to help.\n\nHer story matters because charities depend on trust more than any other kind of organization. When that trust is betrayed, the victims are not only donors but the people in need. Mensah's choice protected both.",
  },
  {
    task: 'Write a profile of this person of conscience. Facts: Pavel Novak, 66, was a soldier in 1993 when his unit was ordered to fire on a crowd of unarmed protesters. He lowered his rifle and told the men beside him to do the same. Several did. He was arrested and spent two years in military prison. After the government fell, he was released and given a medal, which he gave to a protester\'s family. He now drives a bus. He says: "An order does not empty a man of his own judgment."',
    model:
      'In 1993 Pavel Novak was a young soldier standing in a line with a rifle in his hands. In front of him was a crowd of unarmed protesters. The order came to fire.\n\nNovak lowered his rifle. Then he did something even more dangerous: he told the men beside him to do the same. Several of them did. The line that was supposed to fire on the crowd broke apart.\n\nHe was arrested and spent two years in a military prison. A soldier who refuses an order is not treated as a hero by the army that gave it.\n\nWhen the government fell, Novak was released and awarded a medal. He did not keep it. He gave it to the family of a protester who had been killed elsewhere that year, saying it belonged to them more than to him.\n\nToday Novak drives a bus, and few of his passengers know his story. When he speaks about it, he does not describe a moment of glory. "An order does not empty a man of his own judgment," he says.\n\nHis story goes to the heart of conscience. It is easy to believe that responsibility belongs to the person who gives an order. Novak shows that each person in the line still decides what his own hands will do, and that one refusal can give others the courage to refuse.',
  },
  {
    task: 'Write a profile of this person of conscience. Facts: Rosa Delgado, 34, was a scientist at a company that made weed killer. In 2016 her experiments showed the product harmed bees at levels found on farms. Her company wanted to publish only the results that looked safe. She insisted on publishing all the data, and her contract was not renewed. Other scientists confirmed her findings, and the country restricted the product in 2019. She now works at a university. She says: "Leaving out a result is also a way of lying."',
    model:
      'Rosa Delgado did not discover something new so much as refuse to hide something she had found.\n\nIn 2016 she was a scientist at a company that made weed killer. Her experiments showed that the product harmed bees at the levels actually found on farms. Bees pollinate a large share of our food, so the finding was serious.\n\nThe company had other results that looked safer, and it wanted to publish only those. Nothing in the published data would be false; the harmful results would simply be missing. Delgado insisted on publishing all of the data. When her contract ended, it was not renewed.\n\nHer results did not disappear. Scientists at other institutions repeated the experiments and confirmed her findings. In 2019 the country restricted the use of the product.\n\nDelgado now works at a university. "Leaving out a result is also a way of lying," she says. Her point is subtle but important. A report can be accurate in every sentence and still mislead by what it chooses not to show.\n\nHer story shows that in science, conscience often concerns not a dramatic act but a quiet refusal to select the convenient evidence. It also shows why independent confirmation matters: one honest scientist may lose her job, but the truth she found can still be tested by others.',
  },
  {
    task: 'Write a profile of this person of conscience. Facts: Joseph Mwangi, 58, was a judge in a regional court. In 2013 a powerful politician\'s son was charged with causing a fatal car crash while drunk. Joseph was offered a large payment to dismiss the case, then threatened when he refused. He sentenced the son to four years in prison. He was later moved to a remote court and needed police protection for a year. He now teaches at a law school. He says: "If the law bends for the strong, it breaks for the weak."',
    model:
      "In 2013 Judge Joseph Mwangi was asked to put a price on a life, and he refused.\n\nThe case before his regional court was clear. A powerful politician's son had driven drunk and caused a crash that killed a young woman. The evidence was strong. Then came the offer: a large payment if the judge would dismiss the case.\n\nMwangi refused the money. The offer was followed by threats against him and his family. He heard the case anyway and sentenced the son to four years in prison.\n\nThe cost came quickly. He was moved to a remote court far from his home, a transfer that looked very much like a punishment. For a year he needed police protection to go to work.\n\nMwangi now teaches at a law school, and he tells his students a sentence he repeats often: \"If the law bends for the strong, it breaks for the weak.\" In his view, a court that can be bought does not merely make one wrong decision. It tells every poor person that justice is not meant for them.\n\nHis story shows that the rule of law depends on individual people. Laws are written on paper, but they are applied by human beings who can be pressured, flattered or frightened. Mwangi's refusal is a reminder that the independence of a court is only as strong as the judge who sits in it.",
  },
];

/** philosophyBank gives a philosophical question for the student to answer in a short essay. */
const philosophyBank: readonly WritingItem[] = [
  {
    task: "Write a short philosophical essay on this question: Is it ever right to lie? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By a lie I mean a statement that the speaker believes is false, made in order to make someone else believe it. On this definition, a mistake is not a lie, and neither is a joke that both people understand. I will argue that lying is usually wrong but that it can be right when it is the only way to prevent serious harm to an innocent person.\n\nImagine that a friend is hiding in your house from a man who wants to kill her. The man knocks and asks whether she is inside. If you tell the truth, she will die. Almost everyone feels that you should say she is not there. This shows that honesty is not the only value; it can be outweighed by the duty to protect life.\n\nThe strongest objection is that if we allow lies in some cases, we will start to excuse them in many. Trust depends on people knowing that others will not lie to them, and every exception weakens it.\n\nThis objection is serious, but it shows only that the exception must be narrow. A lie to save a life is very different from a lie to avoid embarrassment. Trust survives when people know that lies are reserved for emergencies.\n\nLying, therefore, is wrong as a rule, but the rule exists to protect people, and it should not be used to sacrifice them.",
  },
  {
    task: "Write a short philosophical essay on this question: Does a person have free will if their choices can be predicted? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By free will I mean the ability to choose according to one's own reasons and desires, without being forced by another person or by something outside oneself. I will argue that a choice can be predictable and still be free.\n\nConsider a close friend who knows that you will always choose chocolate ice cream over vanilla. She can predict your choice with near certainty. Yet nobody forces you; you choose chocolate because you like it. Your choice is predictable precisely because it comes from your own stable preferences. A person whose choices could never be predicted would be acting at random, and randomness is not freedom either.\n\nThe strongest objection is that if a scientist could predict every choice from the state of my brain, then my brain, not I, would be making the decisions. My sense of choosing would be an illusion.\n\nThis objection assumes that I am something separate from my brain and my desires. But my reasons, memories and preferences are part of who I am. If they produce my choice, then I produce my choice. What would make me unfree is a cause that bypasses my reasons, such as a drug or a threat, not a cause that works through them.\n\nPredictability, then, is not the enemy of freedom. A free choice is one that flows from the self, even if someone who knows that self well could see it coming.",
  },
  {
    task: "Write a short philosophical essay on this question: Is it fair that some people are born with greater talents than others? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By fair I mean that people receive what they deserve, so that differences in their lives reflect their own choices and efforts. On this definition, the question is whether talent is something people deserve. I will argue that natural talent is not fair or unfair in itself, but that a society becomes unfair if it rewards talent as if people had earned it.\n\nImagine two babies. One is born with a gift for music; the other is not. Neither has done anything yet. It makes no sense to say the first deserves her gift, because she did nothing to get it. Talent is a matter of luck, like the weather on the day you were born.\n\nThe strongest objection is that talented people still work hard to develop their gifts, so their success is partly earned. A pianist practices for thousands of hours; her rewards are not mere luck.\n\nThis is true, and it shows that effort deserves reward. But the ability to work hard and the chance to practice also depend partly on luck: on health, family and money. The fair response is not to deny talent but to make sure that rewards are not given only to those who began with advantages.\n\nNature is not unfair, because it does not make choices. Societies do. Fairness asks us to treat inborn luck as something to be shared rather than something to be proud of.",
  },
  {
    task: "Write a short philosophical essay on this question: Can a machine ever truly understand language? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By understanding language I mean grasping what words refer to and what they mean, not only producing the right words in the right order. I will argue that producing correct answers is not enough to show understanding, though I cannot rule out that some machine might one day understand.\n\nImagine a man locked in a room with a huge rule book. Notes in Chinese are passed in; he cannot read Chinese, but by following the rules he passes back answers that a Chinese speaker finds perfect. From outside, the room seems to understand. Yet the man understands nothing; he only matches shapes. This suggests that following rules for symbols is not the same as knowing what the symbols mean.\n\nThe strongest objection is that the man is only one part of a larger system that includes the book and the room. The system as a whole might understand, even if the man does not.\n\nThis reply is interesting, but it is hard to see where the understanding would be. The book contains only rules, and the room only paper. If we imagine the man memorizing the whole book, he becomes the entire system, and he still does not know what any word means.\n\nCorrect output, then, is evidence but not proof of understanding. Before we say a machine understands, we need some account of how its symbols connect to the world they are about.",
  },
  {
    task: "Write a short philosophical essay on this question: Should we judge an action by its intentions or by its results? Define the key terms, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By intentions I mean what a person was trying to bring about; by results I mean what actually happened because of the action. I will argue that we should judge the person mainly by intentions and the action mainly by results, because these are two different questions.\n\nImagine two drivers, both slightly over the speed limit on the same dark road. A child runs out in front of the first, and she cannot stop; the child is badly hurt. No child runs in front of the second. Their choices were identical, yet the first caused great harm. Most people feel that the two drivers are equally to blame for speeding, but that the first action was far worse.\n\nThe strongest objection is that only intentions matter morally, because results depend on luck, and nobody should be blamed for luck.\n\nThis objection explains why we judge the drivers as people in the same way. But it cannot explain why the first driver must apologize to the family and pay for the child's care while the second does not. Results create duties even when they come from luck. We cannot pretend that harm did not happen because it was not intended.\n\nJudging well, therefore, means asking two questions: what did this person try to do, and what did the action do? A wise judgment keeps both in view.",
  },
  {
    task: "Write a short philosophical essay on this question: Is a copy of an artwork worth less than the original? Define the key terms, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By an original I mean the object the artist actually made; by a copy I mean an object made by someone else to look exactly like it. By worth I mean the value the work has as art, not its price. I will argue that a perfect copy has the same visual value but lacks the value of history and connection to the artist.\n\nImagine that a painting is copied so perfectly that no expert can tell the two apart. If you had never been told which was which, both would give you the same experience of color and form. In that sense, the copy loses nothing.\n\nThe strongest objection is that the experience of looking is all that matters in art. If two objects look identical, then any preference for the original is snobbery, a love of names and prices rather than beauty.\n\nThis objection is partly right; much of the market for originals is about money. But when we stand before the original, we know that the artist's own hand touched this canvas, and that it has passed through centuries. A letter from a grandparent is worth more than a typed copy of it, even though the words are the same. The original carries a real history that the copy only imitates.\n\nA copy, then, can be a fine way to see a work. But the original keeps a kind of value that cannot be copied: the value of having been there.",
  },
  {
    task: "Write a short philosophical essay on this question: Do we have a duty to help strangers far away? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By a duty I mean something we ought to do, so that failing to do it would be wrong and not merely less kind. I will argue that we do have a duty to help distant strangers when we can do so at little cost to ourselves.\n\nImagine that you are walking past a shallow pond and see a small child drowning. You could save her easily, but your new shoes would be ruined. Nearly everyone agrees that you must save the child, and that caring about the shoes would be monstrous. Yet a small donation, costing about as much as those shoes, can save a child's life far away.\n\nThe strongest objection is that distance matters. We have special duties to people near us, whom we can see and help directly. A child in the pond is our responsibility; a child on another continent is the responsibility of the people around her.\n\nBut distance seems to change only how we feel, not what the child needs or what we can do. If I could save a distant child by pressing a button, it is hard to explain why her life matters less because I cannot see her face.\n\nWe may have stronger duties to family and neighbors. Still, the duty to prevent serious suffering when it costs us little does not stop at a border. The pond is wider than it looks.",
  },
  {
    task: "Write a short philosophical essay on this question: Are you the same person you were ten years ago? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By the same person I mean that the person now and the person then are one individual, not two different people. I will argue that you are the same person because your life forms a connected chain of memories and character, even though almost everything about you has changed.\n\nConsider a ship whose planks are replaced one by one over many years until no original plank remains. Most people still feel it is the same ship, because it has continued to sail, with a single history, while it changed. A person is similar: the cells of the body are replaced, beliefs and tastes change, but each year grows out of the one before.\n\nThe strongest objection is that the connection grows weaker over time. You may remember little of what you thought at seven, and your character at seventeen may be very different. If the links are weak, it seems strange to say that the child and the adult are one person.\n\nThis objection shows that identity comes in degrees of closeness, but not that it breaks. You are linked to your seven-year-old self through overlapping memories, each year connected to the next. A rope can be strong even though no single thread runs its whole length.\n\nSo you are the same person you were ten years ago, but not unchanged. Identity is a story that continues, not a thing that stays still.",
  },
  {
    task: "Write a short philosophical essay on this question: Is happiness the most important thing in life? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By happiness I mean a feeling of pleasure and contentment, the sense that one's life is going well. I will argue that happiness is very important but not the most important thing, because people value some things more than how they feel.\n\nImagine a machine that could give you any experience you want for the rest of your life. You could feel that you were writing a great novel, falling in love or winning a race, while floating in a tank. Your feelings of happiness would be perfect. Yet most people, when asked, would refuse to enter the machine. This suggests that we want not only to feel that we are doing things, but actually to do them, and to be connected to real people.\n\nThe strongest objection is that people refuse the machine only because they are afraid of it or do not trust it. If they truly believed it was safe, they would choose it.\n\nBut even people who trust the machine often say that a life in it would be fake. They want their love to be returned by a real person and their achievements to change the real world. These wants make no sense if happiness is all that matters.\n\nHappiness, then, is a sign that life is going well, but it is not the whole of what makes it go well. Truth, love and real achievement matter in themselves.",
  },
  {
    task: "Write a short philosophical essay on this question: Is it wrong to break an unjust law? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By an unjust law I mean a law that treats some people as having fewer rights than others, or that forces people to do serious wrong. I will argue that breaking an unjust law can be right, but only openly, peacefully and with acceptance of the penalty.\n\nImagine a law that forbids one group of people from sitting in the front seats of a bus. A woman from that group sits in the front and refuses to move. She breaks the law, yet most people today see her act as courageous and right. The law itself was the wrong, and obeying it would have helped the wrong to continue.\n\nThe strongest objection is that if everyone breaks the laws they think are unjust, society will fall apart. People disagree about what is just, and the law is our way of settling those disagreements peacefully.\n\nThis objection is strong, and it explains why the manner of breaking the law matters. A person who breaks a law openly, without violence, and accepts arrest is not rejecting the rule of law. She is appealing to the public's sense of justice and showing respect for the system even while protesting one of its laws.\n\nBreaking an unjust law is not wrong when it is done as a public act of conscience. What would be wrong is to treat every law one dislikes as unjust, or to break laws in secret for private gain.",
  },
  {
    task: "Write a short philosophical essay on this question: Can we know anything for certain? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By knowing something for certain I mean believing it in a way that could not possibly be mistaken. I will argue that we can be certain of very little, but that we can still know many things in a weaker, everyday sense.\n\nImagine that an evil demon, or a scientist with a powerful computer, is feeding you false experiences. Everything you see, hear and touch could be invented. You cannot prove from inside your experience that this is not happening. So you cannot be certain that the world outside exists. Yet even in this case, you cannot doubt that you are thinking, because doubting is itself a kind of thinking.\n\nThe strongest objection is that this kind of doubt is unreasonable. Nobody really believes in the demon, and if we demand certainty for every belief, we will never know anything, which seems absurd.\n\nThe objection is right that such doubt is not a reason to stop trusting our senses. But it does show that our knowledge rests on trust rather than proof. We know that the sun will rise tomorrow in the sense that we have overwhelming evidence, not in the sense that it is impossible for us to be wrong.\n\nCertainty, then, is rare, and perhaps limited to the fact of our own thinking. But knowledge does not require certainty. It requires good reasons and a willingness to change our minds when better reasons appear.",
  },
  {
    task: "Write a short philosophical essay on this question: Should we always keep our promises? Define the key term, take a position, test it with an example or thought experiment, answer the strongest objection, and conclude.",
    model:
      "By a promise I mean a statement in which a person freely commits to doing something, so that the other person may rely on it. I will argue that we should almost always keep our promises, but that a promise can be broken when keeping it would cause serious harm that the promise was never meant to cover.\n\nImagine you promise to meet a friend for lunch at noon. On the way you see a car crash and are the only person who can help an injured driver. If you stop, you will miss lunch. Almost everyone thinks you should stop. Your friend, if she is reasonable, would agree. The promise was about lunch; it was never meant to require you to leave a person bleeding on the road.\n\nThe strongest objection is that promises are valuable precisely because they are firm. If people break them whenever they think they have a good reason, promises will lose their meaning.\n\nThis is an important point. But a promise is firm against ordinary inconvenience, not against emergencies that neither person imagined. When you break a promise for such a reason, you should explain, apologize and make up for it. This shows that you still take the promise seriously.\n\nPromises should be kept, then, in nearly every case. The rare exceptions do not weaken promises; they show that promises exist to serve people, not to trap them.",
  },
];

/** reviewBank describes an original work of art for the student to review. */
const reviewBank: readonly WritingItem[] = [
  {
    task: "Write a review of this work. An exhibition, \"Hands at Work,\" shows sixty black-and-white photographs of workers' hands: a baker's floury knuckles, a welder's scarred palms, a pianist's fingers, a fisherman's knotted rope burns. There are no faces. Each photograph is printed very large, and the captions give only the job and the number of years worked. The last room shows the photographer's own hands, holding a camera.",
    model:
      "\"Hands at Work\" is a simple idea carried out with great care, and it is one of the most moving exhibitions I have seen this year.\n\nThe show contains sixty black-and-white photographs of workers' hands: a baker's floury knuckles, a welder's scarred palms, a pianist's fingers, a fisherman's rope burns. There are no faces, and each caption gives only the job and the number of years worked.\n\nLeaving out the faces is the photographer's boldest choice, and it works. Without faces, we cannot judge people by their age, beauty or expression. We are left with what their work has done to them, and the scars become a kind of biography. A caption such as \"Welder, 31 years\" next to a palm marked by burns says more than a long interview could.\n\nThe large prints add to this effect. A hand three feet high shows every line and callus, so the viewer has to look closely at things usually ignored.\n\nThe show is not perfect. After forty photographs, the rooms begin to feel repetitive, and a smaller selection might have kept each image sharper in the memory.\n\nThe final room, however, rescues the rhythm. The photographer's own hands, holding a camera, remind us that looking is also work. Anyone interested in photography, or in the lives behind ordinary jobs, should see this exhibition.",
  },
  {
    task: 'Write a review of this work. A novel, "The Lighthouse Keeper\'s Daughter," is told in letters that a girl writes to her mother, who has left the family. The girl lives on a tiny island with her silent father. The letters are never sent; she keeps them in a tin. Over 300 pages, she grows from eight to eighteen, and her spelling and sentences change with her age. The mother never appears.',
    model:
      "\"The Lighthouse Keeper's Daughter\" is a quiet, patient novel that turns a simple device into a portrait of a whole childhood.\n\nThe book is told entirely in letters that a girl writes to her mother, who has left the family. The girl lives on a tiny island with her silent father, and she keeps the unsent letters in a tin. Across three hundred pages she grows from eight to eighteen.\n\nThe author's most impressive achievement is the way the language grows with the narrator. The early letters are misspelled and breathless; the later ones are careful and controlled. We watch a mind develop without being told about it, and when the eighteen-year-old writes a short, cool letter, the change is heartbreaking.\n\nThe decision never to show the mother is equally effective. Because she never answers, every letter is a question that hangs in the air, and the reader feels the girl's loneliness directly.\n\nThe novel has a weakness: the father remains too silent. We learn so little about him that some of the girl's feelings toward him are hard to understand, and the final chapters would have been stronger if he had been more clearly drawn.\n\nEven so, this is a rare novel that trusts its readers to fill the silences. Readers who enjoy slow, character-driven books will find it unforgettable.",
  },
  {
    task: 'Write a review of this work. A film, "Night Bus," follows the passengers of one bus on a single route through a city from midnight to dawn. There is no main character; the camera stays inside the bus, and passengers get on and off. A nurse, a drunk student, a cleaner and an old man appear. The only music is what the driver plays on his radio. The film is ninety minutes long.',
    model:
      '"Night Bus" is a small film with a big heart, though its strict form is both its strength and its limit.\n\nThe film follows the passengers of one bus on a single route through a city from midnight to dawn. There is no main character, and the camera never leaves the bus. People get on and off: a nurse finishing a shift, a drunk student, a cleaner, an old man who rides to the end and back.\n\nThe director\'s choice to keep the camera inside the bus creates a sense of closeness. We see the city only through rain-streaked windows, so it becomes a blur, and the faces inside become the real landscape. Strangers sit inches apart and never speak, and the film makes their silence feel full of stories.\n\nThe music is used just as cleverly. The only songs are those the driver plays on his radio, so the soundtrack feels like part of the night rather than an instruction about what to feel.\n\nThe cost of this approach is that some passengers vanish just as they become interesting. The nurse\'s story, hinted at through a phone call, deserved more than ten minutes.\n\nStill, when dawn finally lights the windows, the effect is remarkably moving. "Night Bus" will reward patient viewers who enjoy films about ordinary people, though those who want a strong plot may find it slow.',
  },
  {
    task: "Write a review of this work. A concert by a young pianist included three pieces: a short, quiet piece by a living composer, a long and very loud sonata from the nineteenth century, and a set of folk dances. She played without sheet music. Between pieces she spoke to the audience about each work. Her loud playing was sometimes harsh, but the quiet passages drew complete silence from the hall.",
    model:
      "The young pianist's concert last night was uneven but often thrilling, and it showed a musician who is most powerful when she is quietest.\n\nThe programme was well chosen: a short, quiet piece by a living composer, a long and very loud nineteenth-century sonata, and a set of folk dances. She played everything from memory and spoke to the audience between pieces, explaining what to listen for.\n\nHer talks were a real strength. In two minutes she made the modern piece, which might have puzzled the audience, sound like an invitation. When she played it, the hall was so silent that a single cough sounded like a crash.\n\nThe sonata was less successful. In its loudest passages, her playing became harsh, as if she were fighting the piano rather than shaping the sound. The music's power turned into noise, and some of its long melodies were lost under the force.\n\nThe folk dances, however, brought the evening to a joyful end. Her rhythms were crisp, and she clearly enjoyed the music's humor, which spread through the audience.\n\nThis is a pianist to follow. Her sense of quiet and her gift for talking about music already make her concerts special. If she learns to bring the same control to her loudest playing, she will become a major artist.",
  },
  {
    task: 'Write a review of this work. A public sculpture, "The Listening Bench," was placed in a city park. It is a long bronze bench with metal ears sculpted along its back. When someone sits and speaks, their voice is carried through tubes to the other end of the bench, thirty feet away. Children shout into it; strangers sometimes talk. Some residents call it ugly. It cost the city 200,000 dollars.',
    model:
      '"The Listening Bench" is not beautiful, but it is one of the best pieces of public art the city has bought in years.\n\nThe work is a long bronze bench with metal ears sculpted along its back. When someone sits and speaks, tubes carry the voice to the other end of the bench, thirty feet away. Two strangers, sitting far apart, can talk as if they were side by side.\n\nThe sculpture\'s great achievement is that it changes how people behave. Children shout into it and laugh at the echo. On a quiet afternoon, I watched two strangers at opposite ends begin talking about the weather and end up discussing their families. A park bench is usually where people sit alone; this one invites them to connect.\n\nThe design supports this purpose. The ears make it obvious, even to a child, that the bench is meant for listening, so no sign is needed to explain it.\n\nSome residents call it ugly, and they have a point. The metal ears are odd and slightly unsettling, and the bronze looks heavy among the trees. At 200,000 dollars, it is fair to ask whether a more graceful design was possible.\n\nYet public art should be judged by what it does in public, and this bench does something rare: it makes strangers talk. Anyone passing through the park should sit down and try it.',
  },
  {
    task: 'Write a review of this work. A play, "The Inheritance," takes place in one living room over a single evening. Three adult siblings meet after their father\'s funeral to divide his belongings. As they argue over a clock, a painting and a box of letters, old secrets come out. The set is crowded with real furniture. The play runs two hours with no interval, and the ending is left open.',
    model:
      "\"The Inheritance\" is a sharp, painful family drama whose cramped setting becomes part of its meaning.\n\nThe play takes place in one living room over a single evening. Three adult siblings meet after their father's funeral to divide his belongings. As they argue over a clock, a painting and a box of letters, old secrets come out.\n\nThe playwright's cleverest idea is to let the objects carry the story. The clock reveals who visited the father and who did not; the painting reveals who was loved most; the letters, opened late in the evening, reveal a secret about the mother that changes everything. Arguments about things become arguments about the past.\n\nThe crowded set adds to the tension. Real furniture fills the stage, so the actors keep bumping into chairs and tables, and the siblings seem trapped among their father's possessions just as they are trapped in old roles.\n\nRunning two hours without an interval is a risk, and around the ninetieth minute the arguments start to repeat themselves. Twenty minutes could have been cut.\n\nThe open ending will frustrate some viewers, since we never learn who takes the letters. But it suits a play about families, where nothing is ever fully settled. Anyone who has ever argued with a brother or sister will recognize these people, and should see the play.",
  },
  {
    task: "Write a review of this work. A collection of poems, \"Small Hours,\" contains forty short poems written between midnight and dawn by a poet who works night shifts at a hospital. Most poems are under ten lines and use no rhyme. Subjects include coffee machines, a dying patient's hands, the sound of rain on a car park and the poet's sleeping children. The last poem is a single line.",
    model:
      "\"Small Hours\" is a modest book of large feelings, and its best poems capture a world most of us sleep through.\n\nThe collection contains forty short poems written between midnight and dawn by a poet who works night shifts at a hospital. Most are under ten lines and use no rhyme. Their subjects range from coffee machines and rain on a car park to a dying patient's hands and the poet's sleeping children.\n\nThe poems' shortness is their greatest strength. Each one catches a single moment, like a flash of light in a dark corridor, and stops before it can explain itself. In one poem, the hum of a vending machine at 3 a.m. becomes the only voice that answers the speaker, and the loneliness is clear without being named.\n\nThe poet's mix of subjects is also effective. Poems about death sit beside poems about coffee, which reflects how a night shift really feels: tragedy and boredom in the same hour.\n\nSome readers may find the style too plain. A few poems read like notes rather than finished work, and the lack of music in the lines can make them flat when read aloud.\n\nThe final poem, a single line, is unforgettable, and it shows how much this poet can do with very little. Readers who like quiet, honest poetry, and anyone who has worked through the night, will treasure this book.",
  },
  {
    task: 'Write a review of this work. A video game, "The Last Garden," puts the player in charge of a garden on a dying planet. There are no enemies and no weapons. Each day the player chooses which plants to water with a limited supply. Plants that are not watered die forever. The music changes as the garden grows or shrinks. A game lasts about six hours, and there are several possible endings.',
    model:
      '"The Last Garden" is a gentle game with a hard heart, and it achieves something few games attempt: it makes the player feel the weight of every choice.\n\nThe player looks after a garden on a dying planet. There are no enemies and no weapons. Each day you choose which plants to water with a limited supply, and any plant left dry dies forever. A game lasts about six hours and can end in several ways.\n\nThe limited water is a brilliant design choice. Because there is never enough, every day becomes a small moral decision. Do you save the rare flower or the plant that feeds the others? By the third hour, I was hesitating over choices that would have meant nothing in another game.\n\nThe music deepens this effect. It grows richer as the garden thrives and thinner as it shrinks, so the player hears the consequences of each choice without reading any numbers.\n\nThe game\'s slowness will not suit everyone. There is little variety in the daily routine, and the middle hours can feel repetitive, especially for players used to faster games.\n\nThe endings, however, reward patience. Each reflects the kind of gardener you have been, and mine left me thinking for days. "The Last Garden" is best for players who want a game to make them reflect rather than to test their reflexes.',
  },
  {
    task: 'Write a review of this work. A museum exhibition, "Lost Words," displays objects connected to languages that are no longer spoken: a carved stick used for counting, recordings of the last speaker of a language, a dictionary handwritten by a missionary, a child\'s song with no translation. Visitors can listen to each recording through headphones. The labels are short, and the rooms are dimly lit.',
    model:
      '"Lost Words" is a haunting exhibition that turns the disappearance of languages into something visitors can hear and feel.\n\nThe show displays objects connected to languages that are no longer spoken: a carved counting stick, a dictionary handwritten by a missionary, a child\'s song with no translation, and recordings of the last speakers of several languages, which visitors hear through headphones.\n\nThe recordings are the heart of the exhibition. Listening to an old woman speak a language that died with her is a startling experience. You cannot understand a word, yet the rhythm and warmth of her voice make clear how much has been lost. No label could make the point so powerfully.\n\nThe design supports the mood. The rooms are dimly lit, so each object seems to glow in its own small space, and the hush makes visitors speak in whispers, as if in a place of mourning.\n\nThe short labels, however, are a weakness. Visitors are left wanting to know more: why these languages died, who the speakers were, and what is being done to save languages still in danger. The exhibition moves the heart but does not always inform the mind.\n\nEven so, few museum visits are as memorable. "Lost Words" is suitable for older children and adults, and anyone who speaks more than one language will leave thinking about what their own words carry.',
  },
  {
    task: "Write a review of this work. A building, the new city library, is a glass cube on a busy square. Inside, the shelves are arranged in a spiral ramp that rises five floors. There are no walls between floors. Reading tables face the windows. Visitors complain that the building is noisy and hot in summer. It is open until midnight and has become popular with students.",
    model:
      "The new city library is a bold, beautiful building that succeeds as a public space even while it struggles as a place to read.\n\nThe library is a glass cube on a busy square. Inside, the shelves are arranged along a spiral ramp that rises five floors without walls between them, and reading tables face the windows. It stays open until midnight.\n\nThe spiral is the building's finest idea. Walking up the ramp, you pass every subject in order, so browsing becomes a journey through knowledge. The open space also means that from any point you can see people reading above and below you, which creates a quiet sense of shared purpose.\n\nThe glass walls connect the library to the city. At night the lit cube glows above the square, inviting passers-by in, and the late hours have made it a favorite with students who have nowhere quiet at home.\n\nYet the same openness causes real problems. Without walls, sound travels freely, and conversations on one floor can be heard five floors away. The glass also traps heat, and in summer the reading tables by the windows are uncomfortably hot.\n\nThese are not small complaints for a library. Still, the building has done what many libraries fail to do: it has made people want to come. Better cooling and some quiet rooms would turn a striking building into a great one.",
  },
  {
    task: 'Write a review of this work. A television series, "The Border," has eight episodes, each told from the point of view of a different person living in a village divided by a new border: a farmer, a soldier, a teacher, a smuggler, a child and others. The same events appear in several episodes from different angles. The series is filmed in two languages with subtitles.',
    model:
      "\"The Border\" is an ambitious and intelligent series that shows how one event can look completely different depending on where you stand.\n\nThe series has eight episodes, each told from the point of view of a different person in a village divided by a new border: a farmer, a soldier, a teacher, a smuggler, a child and others. The same events reappear across several episodes, seen from different angles.\n\nThis structure is the show's great strength. A scene that looks like cruelty in the farmer's episode looks like fear in the soldier's, and like a game in the child's. By the fourth episode, viewers stop asking who is right and start asking how anyone could know. The series makes understanding, not judgment, its goal.\n\nFilming in two languages adds realism and reinforces the theme. The characters often cannot understand each other, and the subtitles remind viewers that we can read both sides while the villagers cannot.\n\nThe structure does have a cost. Repeated scenes can feel slow, and some episodes, especially the smuggler's, add little that is new.\n\nOverall, however, \"The Border\" is one of the most thoughtful dramas of the year. It asks patience of its viewers but rewards them with a rare kind of sympathy. It is especially worth watching for anyone interested in how conflicts look from the inside.",
  },
  {
    task: 'Write a review of this work. A cookbook, "Grandmother\'s Table," collects eighty recipes from grandmothers in twenty countries. Each recipe comes with a photograph of the grandmother and a short story she tells about the dish. Measurements are sometimes vague, such as "a handful of flour." Some ingredients are hard to find outside their home countries.',
    model:
      '"Grandmother\'s Table" is less a cookbook than a collection of lives told through food, and it is all the better for it.\n\nThe book gathers eighty recipes from grandmothers in twenty countries. Each recipe is accompanied by a photograph of the grandmother and a short story she tells about the dish: who taught it to her, when it was cooked, what it meant.\n\nThe stories are the book\'s greatest treasure. A simple bean soup becomes unforgettable when its cook explains that it fed her family through a long war. The photographs, showing lined faces and floury hands, give each recipe a human presence that ordinary cookbooks lack. Reading the book feels like being invited into eighty kitchens.\n\nThe editors\' decision to keep each grandmother\'s own way of measuring is charming but frustrating. Instructions such as "a handful of flour" or "cook until it smells right" respect the tradition, yet they will leave inexperienced cooks guessing. A short note with exact amounts would not have spoiled the voice.\n\nSome ingredients are also hard to find outside their home countries, and the book offers few substitutes.\n\nThese faults matter if you want reliable dinners. But as a record of family memory and a celebration of the people who keep cultures alive, "Grandmother\'s Table" is a delight. It would make an excellent gift for confident cooks and for anyone who loves stories.',
  },
];

/** judgedTopics12a are the first writing topics of grade 12 judged by a model. */
export const judgedTopics12a: readonly TopicDef[] = [
  {
    id: "writing-a-profile-of-a-person-of-conscience",
    title: t("Writing a Profile of a Person of Conscience", "写一位有良知者的人物特写"),
    summary: t(
      "Write a profile that turns the facts about a person into a story centered on a moral choice, its cost, and why it matters to others.",
      "写一篇人物特写，把关于一个人的事实写成以一个道德抉择为中心的故事，写出它的代价以及它对他人的意义。",
    ),
    prerequisites: after("reading-an-investigative-report", "choosing-precise-diction"),
    encompasses: covers(0.2, "reading-an-investigative-report"),
    xp: 24,
    strand: "writing",
    criteria: ["g12-profile-choice", "g12-profile-detail", "g12-profile-meaning"].map(criterion),
    knowledgePoints: [
      point(
        "the-moment-of-choice",
        t("The Moment of Choice", "抉择的时刻"),
        t(
          "Build the profile around **the moment of choice**: what the person saw, what they were told to do, what they did instead and what it cost them. Open with a concrete scene or a striking fact rather than a summary: *Every morning at five, Elena Varga slides trays of bread into an oven.* Then go back to the choice.",
          "围绕**抉择的时刻**来写这篇特写：这个人看到了什么、被要求做什么、实际做了什么、为此付出了什么代价。用一个具体场景或一个醒目的事实开头，而不是概述：*Every morning at five, Elena Varga slides trays of bread into an oven.* 然后再回到那个抉择。",
        ),
        writingGenerator(
          t(
            "Write the profile in English, opening with a concrete scene or fact and centering it on the person's choice and its cost.",
            "用英语写这篇人物特写，以一个具体场景或事实开头，并以这个人的抉择及其代价为中心。",
          ),
          profileBank,
          ["g12-profile-choice", "g12-profile-detail", "g12-profile-meaning"],
          limits,
          onePiece,
        ),
      ),
      point(
        "why-the-choice-matters",
        t("Why the Choice Matters", "这个抉择为什么重要"),
        t(
          "Use the facts precisely, with numbers and the person's own words, and explain what the quotation shows: *For her, the numbers on a report were never abstract.* End by saying **why the choice matters** beyond this one person, without turning the profile into praise or a sermon.",
          "准确地使用事实，包括数字和这个人自己的话，并解释引语说明了什么：*For her, the numbers on a report were never abstract.* 结尾说明这个抉择**为什么重要**，其意义超出这一个人，但不要把特写写成颂词或说教。",
        ),
        writingGenerator(
          t(
            "Write the profile in English, using the facts and the person's own words precisely and ending with why the choice matters to others.",
            "用英语写这篇人物特写，准确使用事实和这个人自己的话，并以这个抉择对他人的意义结尾。",
          ),
          profileBank,
          ["g12-profile-detail", "g12-profile-meaning", "g12-profile-choice"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-philosophical-essay",
    title: t("Writing a Philosophical Essay", "写哲学短文"),
    summary: t(
      "Write a short philosophical essay that defines its key term, takes a position, tests it with an example or thought experiment, and answers the strongest objection.",
      "写一篇哲学短文，定义关键术语，表明立场，用一个例子或思想实验检验它，并回应最有力的反对意见。",
    ),
    prerequisites: after("following-a-thought-experiment", "defining-a-term-in-an-argument", "writing-a-critique-of-an-argument"),
    encompasses: covers(0.2, "following-a-thought-experiment", "defining-a-term-in-an-argument"),
    xp: 24,
    strand: "writing",
    criteria: ["g12-philosophy-definition", "g12-philosophy-case", "g12-philosophy-objection"].map(criterion),
    knowledgePoints: [
      point(
        "terms-and-a-position",
        t("Terms and a Position", "术语与立场"),
        t(
          "Begin by **defining** the key term in plain words with clear limits: *By a lie I mean a statement that the speaker believes is false, made in order to make someone else believe it.* Then state your **position** in one sentence, and test it with a case: an example or a thought experiment that brings out what most people would say.",
          "开头用平实的词**定义**关键术语，并划出清楚的界限：*By a lie I mean a statement that the speaker believes is false, made in order to make someone else believe it.* 然后用一句话表明你的**立场**，并用一个情形检验它：一个例子或一个思想实验，引出多数人会给出的回答。",
        ),
        writingGenerator(
          t(
            "Write the essay in English, defining the key term, stating your position and testing it with an example or thought experiment.",
            "用英语写这篇短文，定义关键术语，表明立场，并用一个例子或思想实验检验它。",
          ),
          philosophyBank,
          ["g12-philosophy-definition", "g12-philosophy-case", "g12-philosophy-objection"],
          limits,
          onePiece,
        ),
      ),
      point(
        "the-strongest-objection",
        t("The Strongest Objection", "最有力的反对意见"),
        t(
          "Then state **the strongest objection** to your position fairly, as its supporters would put it, and **answer** it: show what it gets right and why your position still holds, or how it must be limited. End with a conclusion that says what your reasoning has shown.",
          "然后公正地陈述对你立场**最有力的反对意见**，就像其支持者会表述的那样，并**回应**它：指出它对的地方，以及为什么你的立场仍然成立，或者必须加上什么限制。最后用结论说明你的推理表明了什么。",
        ),
        writingGenerator(
          t(
            "Write the essay in English, stating the strongest objection to your position fairly and answering it before you conclude.",
            "用英语写这篇短文，在得出结论之前，公正地陈述对你立场最有力的反对意见并作出回应。",
          ),
          philosophyBank,
          ["g12-philosophy-case", "g12-philosophy-objection", "g12-philosophy-definition"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-review-of-a-work-of-art",
    title: t("Writing a Review of a Work of Art", "写艺术作品评论"),
    summary: t(
      "Write a review that describes a work briefly, judges it with reasons tied to specific features and their effects, weighs a weakness, and ends with a clear verdict.",
      "写一篇评论，简要描述作品，用与具体特点及其效果相联系的理由评判它，衡量一处不足，并以明确的结论结尾。",
    ),
    prerequisites: after("evaluating-a-review", "choosing-precise-diction"),
    encompasses: covers(0.2, "evaluating-a-review"),
    xp: 24,
    strand: "writing",
    criteria: ["g12-review-description", "g12-review-reasons", "g12-review-verdict"].map(criterion),
    knowledgePoints: [
      point(
        "what-the-work-is",
        t("What the Work Is", "作品是什么"),
        t(
          "Open with your overall judgment in a sentence, then **describe** the work briefly so a reader who has not seen it knows what it is: its form, its subject and its most important features. Description should be short and accurate; it prepares for the judgment rather than replacing it.",
          "开头用一句话给出你的总体评判，然后简要**描述**作品，让没看过的读者知道它是什么：它的形式、主题和最重要的特点。描述要简短准确；它为评判做准备，而不是取代评判。",
        ),
        writingGenerator(
          t(
            "Write the review in English, opening with your overall judgment and a brief, accurate description of the work.",
            "用英语写这篇评论，开头给出你的总体评判，并简要准确地描述作品。",
          ),
          reviewBank,
          ["g12-review-description", "g12-review-reasons", "g12-review-verdict"],
          limits,
          onePiece,
        ),
      ),
      point(
        "judgment-with-reasons",
        t("Judgment with Reasons", "有理由的评判"),
        t(
          "Support every judgment with **a specific feature and its effect**: *Leaving out the faces is the photographer's boldest choice, because without them we see what work has done to people.* Name at least one weakness fairly, and end with a **verdict** that says who the work is for.",
          "每个评判都要用**一个具体特点及其效果**来支持：*Leaving out the faces is the photographer's boldest choice, because without them we see what work has done to people.* 公正地指出至少一处不足，并以一个说明作品适合谁的**结论**结尾。",
        ),
        writingGenerator(
          t(
            "Write the review in English, supporting each judgment with a specific feature and its effect, naming a weakness and ending with a verdict.",
            "用英语写这篇评论，每个评判都用具体特点及其效果来支持，指出一处不足，并以结论结尾。",
          ),
          reviewBank,
          ["g12-review-reasons", "g12-review-verdict", "g12-review-description"],
          limits,
          onePiece,
        ),
      ),
    ],
  },
];
