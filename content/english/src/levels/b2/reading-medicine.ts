// The reading unit of the B2 theme Science, Ethics and Medicine: antibiotics that stop working, the first heart
// transplant, editing genes, placebos, loneliness, a trial that went wrong, animals in laboratories and burnout.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "b2-words-medicine",
  "b2-words-organs",
  "b2-words-ethics",
  "b2-words-research-2",
  "b2-words-genetics",
  "b2-words-science-verbs",
  "b2-words-mental-health",
  "b2-words-health-systems",
  "b2-words-scientific-adjectives",
  "b2-words-animals-and-people",
  "b2-words-risk",
  "modals-of-deduction",
  "past-modals",
]);

/** readingMedicine is the reading unit of the theme Science, Ethics and Medicine. */
export const readingMedicine: ReadingUnitDef = {
  id: "b2-reading-medicine",
  title: t("Science, Ethics and Medicine", "科学、伦理与医学"),
  passages: [
    passage({
      id: "b2-medicine-how-antibiotics-stopped-working",
      title: ["How Antibiotics Stopped Working", "抗生素为何失灵"],
      body: `In 1928, a Scottish scientist called Alexander Fleming returned to his laboratory in London after a holiday and noticed something strange. A dish of bacteria that he had left on a table had been contaminated by a mould, a kind of tiny plant that grows on old food, and around it, the bacteria had died. "Something in the mould must be destroying them," he thought; it could not be an accident. The substance that the mould produced, which he called penicillin, became the first antibiotic.

Antibiotics transformed medicine. Before them, an infection from a small cut could be fatal, and infections of the lungs caused the deaths of millions of people every year. Operations were very dangerous, because patients often died of infections after them. By 1955, doctors could cure most of these infections with a few doses of medication.

Fleming himself, however, gave a warning. Bacteria, he explained, can change. When an antibiotic destroys most of the bacteria in a body, a few that happen to have a useful mutation may survive. They grow in number, and soon the medication no longer works against them. The more often antibiotics are used, the faster this happens.

Fleming was right. Today, some bacteria cannot be destroyed by any of the antibiotics that we have. Doctors call them "superbugs". One large study found that infections that no antibiotic could cure played a part in the deaths of more than a million people in 2019, and experts estimate that the number could rise considerably by 2050.

Why has this happened? Part of the reason is that antibiotics have been used in careless ways. Many patients ask for them when they have a cold, which is caused by a virus, although antibiotics have no effect on viruses. Others stop taking their medication as soon as they feel better, which allows the strongest bacteria to survive. On many farms, animals are given antibiotics every day, not because they are ill, but to make them grow faster.

At the same time, few new antibiotics have been developed in recent decades. A new medication costs a pharmaceutical company over a billion dollars to develop, and because a new antibiotic should be used as little as possible, it earns little money.

What can be done? Physicians are being asked to give antibiotics only when they are necessary, and governments are banning their use to make farm animals grow. Some scientists are searching for new antibiotics in unexpected places, such as the ground under forests and the floor of the ocean. Nevertheless, most experts agree that, unless these efforts succeed, we may return to a world in which a small cut can be fatal again.`,
      grammar: ["modals-of-deduction"],
      names: ["Alexander", "Fleming", "London", "Scottish"],
      glossed: ["penicillin", "superbugs", "mould"],
      questions: [
        [
          ["What did Fleming notice when he returned from his holiday?", "弗莱明度假回来后注意到了什么？"],
          ["Bacteria had died around a mould in a dish", "培养皿里霉菌周围的细菌死了"],
          [
            ["A new kind of bacteria had grown on his table", "他的桌上长出了一种新细菌"],
            ["His laboratory had been cleaned while he was away", "他不在时实验室被打扫过了"],
          ],
          [
            '"Around it, the bacteria had died." The substance the mould produced became penicillin.',
            "霉菌周围的细菌死了，霉菌产生的物质后来成为青霉素。",
          ],
        ],
        [
          ["According to Fleming's warning, why do antibiotics stop working?", "按照弗莱明的警告，抗生素为什么会失效？"],
          ["A few bacteria with a useful mutation survive and multiply", "少数带有有利突变的细菌存活下来并大量繁殖"],
          [
            ["Patients become immune to the medication itself", "病人对药物本身产生了免疫"],
            ["Antibiotics lose their strength when they are stored", "抗生素在储存中失去了药效"],
          ],
          [
            '"A few that happen to have a useful mutation may survive. They grow in number, and soon the medication no longer works against them."',
            "少数碰巧带有有利突变的细菌存活下来并繁殖，药物就不再对它们起作用。",
          ],
        ],
        [
          ["Why have few new antibiotics been developed?", "为什么新研发的抗生素很少？"],
          ["They cost a lot to develop but earn little money", "研发成本很高，却赚不到多少钱"],
          [
            ["Governments have banned research on bacteria", "政府禁止了对细菌的研究"],
            ["Scientists believe that the old ones are good enough", "科学家认为旧的抗生素已经足够好"],
          ],
          [
            'A new medication costs over a billion dollars, and a new antibiotic "should be used as little as possible", so "it earns little money."',
            "一种新药的研发要花十多亿美元，而新抗生素应尽量少用，所以赚不到多少钱。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-medicine-the-first-heart-transplant",
      title: ["The First Heart Transplant", "第一例心脏移植"],
      body: `On the night of 2 December 1967, a young woman called Denise Darvall was hit by a car in Cape Town, South Africa. She suffered terrible injuries to her brain, and the doctors at the hospital determined that she could not be saved. Her father was asked a question that no one had ever been asked before: would he consent to the heart of his daughter being given to another patient?

The patient was Louis Washkansky, a man of fifty-three with chronic heart disease. He was dying, and he knew it. When the surgeon, Christiaan Barnard, explained that the operation had never been done on a living person, Washkansky accepted at once. He had nothing to lose.

The operation began early the next morning and went on for about five hours. The team of Barnard took out the heart of Washkansky and replaced it with the heart of the donor. Then came the moment that everyone was waiting for. The new heart was given a small electric charge, and it began to beat. Barnard is said to have whispered, "It's going to work."

The news spread around the world within hours. Newspapers called it a wonder, and Barnard became famous in a single day. However, the operation also raised difficult ethical questions. When exactly is a person dead? Is it when the heart stops, or when the brain stops working? Who should decide which patient receives an organ? People still argue about these questions today.

Washkansky lived for eighteen days. His body accepted the heart, but his immunity had been made weak by the medication that stopped his body from refusing the new organ, and he died of a lung infection. Many of the transplants that followed in the next few years also failed, and some doctors argued that they should never have been tried.

The breakthrough came around 1983 with a new medication that allowed the body to accept a new organ without making it so weak. Today, about eight thousand heart transplants are performed every year, and most patients live for more than ten years after the operation.

The greatest problem now is not the operation but the lack of donors. In many countries, thousands of people are waiting for an organ, and many of them will die before one becomes available. Some countries have changed their laws so that everyone is a donor unless they say no. It is a controversial policy, but it reminds us that every transplant begins with a decision made by a family on the worst day of their lives.`,
      grammar: ["past-modals"],
      names: ["Christiaan", "Barnard", "Louis", "Washkansky", "Cape", "Town", "South", "Africa", "Denise", "Darvall"],
      questions: [
        [
          ["Why did Washkansky accept the operation at once?", "瓦什坎斯基为什么立刻接受了手术？"],
          ["He was dying and had nothing to lose", "他快要死了，没有什么可失去的"],
          [
            ["He had seen the operation succeed many times", "他见过这种手术多次成功"],
            ["The father of the donor had asked him to", "捐献者的父亲请他这样做"],
          ],
          [
            '"He was dying, and he knew it... He had nothing to lose." The operation had never been done before.',
            "他快要死了，自己也知道，没有什么可失去的；这种手术以前从未做过。",
          ],
        ],
        [
          ["What did Washkansky die of?", "瓦什坎斯基死于什么？"],
          ["A lung infection, after his body was made weak by medication", "药物削弱了他的身体之后，他死于肺部感染"],
          [
            ["His body refused the new heart after a few days", "几天后他的身体排斥了新的心脏"],
            ["A mistake that the surgeons made during the operation", "外科医生在手术中犯的一个错误"],
          ],
          [
            '"His body accepted the heart, but his immunity had been made weak by the medication... and he died of a lung infection."',
            "他的身体接受了心脏，但药物削弱了他的免疫力，他死于肺部感染。",
          ],
        ],
        [
          ["What is the greatest problem with heart transplants today?", "如今心脏移植最大的问题是什么？"],
          ["There are not enough donors", "捐献者不够"],
          [
            ["Most patients live for less than a year", "大多数病人活不过一年"],
            ["The operation is still too dangerous to perform", "这种手术仍然太危险，无法进行"],
          ],
          [
            '"The greatest problem now is not the operation but the lack of donors." Most patients now live for more than ten years.',
            "现在最大的问题不是手术本身，而是缺少捐献者；如今大多数病人能活十年以上。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-medicine-should-we-edit-genes",
      title: ["Should We Edit Genes?", "我们应该编辑基因吗？"],
      body: `In 2018, a scientist in China called He Jiankui announced that he had done something no one had done before. He had changed the DNA of two embryos, and the twin girls born from them were, he said, immune to a dangerous virus. Instead of praise, he was criticized by scientists around the world. He was later sent to prison.

Why did his work cause such controversy? To understand it, we need to understand what has become possible. Since 2012, scientists have been able to use a method called CRISPR to change genes, cutting out or replacing tiny parts of the DNA of an organism in a very precise way. The method is cheap, fast and accurate, and it is already used in laboratories all over the world.

People who support it emphasize its benefits. Thousands of illnesses are caused by a single mutation in one gene, and many of them are inherited from parents. In clinical trials, CRISPR has already been used to cure patients with a serious blood disease, and the results have been impressive. In the future, it may help us to cure other illnesses, to breed plants that survive droughts, or to end diseases carried by insects.

Few people are against helping a patient who is ill. The real dilemma is about embryos. When the genes of an embryo are changed, the change is inherited by all its future children and grandchildren. A mistake would not affect only one person, but generations of people who never consented to it.

There are other worries, too. Some argue that if parents are allowed to prevent illnesses, some will soon want to choose other traits, such as how tall or how intelligent a child will be. If only the rich could afford this, the method could increase inequality, creating a society divided by biology. Others maintain that changing the DNA of people is just wrong, because it turns children into products to be designed.

Those who support it reply that these fears are too great. They argue that if we could prevent a child from suffering a terrible disease, it would be wrong not to do so, and that firm laws could prevent the method from being used badly.

Most scientists today take a middle position. They support changing genes to cure patients, but they insist that changing embryos should not be allowed until the method has been proved safe and society has agreed on clear principles. The debate will go on, because the question it raises is one of the most important of our time: how far should we go in changing what we are?`,
      names: ["CRISPR", "China", "He", "Jiankui"],
      questions: [
        [
          ["Why is changing the genes of an embryo a special dilemma?", "为什么改变胚胎的基因是一个特殊的难题？"],
          ["The change is passed on to all its future children", "这种改变会传给它未来所有的后代"],
          [
            ["Embryos are too small for CRISPR to work on", "胚胎太小，CRISPR 无法操作"],
            ["It is much more expensive than curing a patient", "这比治疗病人贵得多"],
          ],
          [
            '"When the genes of an embryo are changed, the change is inherited by all its future children and grandchildren."',
            "胚胎的基因一旦改变，它未来所有的子孙都会继承这种改变。",
          ],
        ],
        [
          ["How could editing embryos increase inequality?", "编辑胚胎怎么会加剧不平等？"],
          ["Only the rich might be able to afford it", "可能只有富人负担得起"],
          [
            ["It would only work for some groups of people", "它只对某些人群有效"],
            ["Poor countries would forbid it by law", "贫穷国家会依法禁止它"],
          ],
          [
            '"If only the rich could afford this, the method could increase inequality, creating a society divided by biology."',
            "如果只有富人负担得起，这种方法就会加剧不平等，造成一个按生物特征分化的社会。",
          ],
        ],
        [
          ["What middle position do most scientists take?", "大多数科学家持什么中间立场？"],
          ["Use it to cure patients, but not on embryos until it is proved safe", "用它治疗病人，但在证明安全之前不用于胚胎"],
          [
            ["Stop all research on genes until there are new laws to control it", "在出台新的管控法律之前停止一切基因研究"],
            ["Allow parents to choose any traits they want for their children", "允许父母为孩子选择任何想要的特征"],
          ],
          [
            "They support changing genes to cure patients, but insist that changing embryos should not be allowed until the method has been proved safe.",
            "他们支持通过改变基因来治疗病人，但坚持在方法被证明安全之前不允许改变胚胎。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-medicine-why-placebos-work",
      title: ["Why Placebos Work", "安慰剂为何有效"],
      body: `During the Second World War, an American doctor called Henry Beecher was working in a field hospital when the supply of medicine for pain ran out. With nothing else to offer, a nurse gave a badly hurt soldier an injection of salt and water but told him that it was a strong medicine against pain. To the surprise of Beecher, the soldier relaxed, and his pain seemed to decrease. Beecher had seen the power of the placebo.

A placebo is a treatment with no active substance in it, such as a sugar pill. In theory, it should have no effect at all. Yet in study after study, patients who receive a placebo report that they feel better. Placebos have been shown to reduce pain and the symptoms of anxiety and depression.

This is why the placebo plays such an important part in clinical trials. In a trial of a new medication, patients are divided into two groups by a computer. One group receives the medication, and the other receives a placebo that looks the same. The patients do not know who receives which, and the doctors do not know either. The medication is considered useful only if it works better than the placebo. This methodology helps to minimize bias, because the beliefs of the patients and the doctors cannot affect the results.

How can a pill with nothing in it work? Scientists believe that what we expect plays an important role. When we expect to feel less pain, the brain produces its own natural substances against pain. Pictures of the brain have demonstrated that these changes are real, not imagined. Even small things matter: two pills work better than one, and expensive placebos work better than cheap ones.

Perhaps the most unexpected result is that placebos may work even when patients know what they are. In one experiment, patients with a chronic stomach condition were given pills and told the truth: there was no medication in them. Many of them still reported that their symptoms improved.

Placebos also have a dark side, known as the nocebo effect: the harm of expecting harm. Patients who are warned about the side effects of a medication sometimes experience them even when they have been given a placebo. Doctors therefore face a dilemma: they must give patients honest information about risks without making them expect to suffer.

This does not mean that illnesses are imagined, or that placebos can cure serious diseases. A placebo cannot destroy bacteria or repair a damaged organ. But it reminds us that our feelings and our bodies are connected, and that the way doctors speak to their patients may be part of the treatment.`,
      names: ["Henry", "Beecher", "American"],
      glossed: ["nocebo"],
      questions: [
        [
          ["Why does a clinical trial give one group a placebo?", "为什么临床试验要给一组人安慰剂？"],
          ["To see whether the medication works better than nothing", "为了看药物是否比什么都不用更有效"],
          [
            ["Because there is not enough medication for everyone", "因为药物不够每个人用"],
            ["To protect the doctors from the side effects", "为了保护医生免受副作用"],
          ],
          [
            '"The medication is considered useful only if it works better than the placebo." This also helps to minimize bias.',
            "只有比安慰剂更有效，药物才被认为有用；这也有助于减少偏差。",
          ],
        ],
        [
          ["What have pictures of the brain demonstrated?", "大脑图像证明了什么？"],
          ["The changes caused by a placebo are real", "安慰剂引起的变化是真实的"],
          [
            ["Placebos only work on people with depression", "安慰剂只对抑郁的人有效"],
            ["Cheap placebos work better than expensive ones", "便宜的安慰剂比贵的更有效"],
          ],
          [
            '"Pictures of the brain have demonstrated that these changes are real, not imagined." In fact, expensive placebos work better.',
            "大脑图像证明这些变化是真实的，不是想象的；而且贵的安慰剂效果反而更好。",
          ],
        ],
        [
          ["What is the dilemma that the nocebo effect creates for doctors?", "反安慰剂效应给医生带来了什么难题？"],
          ["Warning patients about side effects can cause those effects", "提醒病人副作用可能反而引起这些副作用"],
          [
            ["Patients refuse medication when they know it is a placebo", "病人一知道是安慰剂就拒绝服用"],
            ["Placebos are too cheap for hospitals to buy", "安慰剂太便宜，医院不愿购买"],
          ],
          [
            'Patients who are warned about side effects sometimes experience them even on a placebo, so doctors must inform them "without making them expect to suffer."',
            "被提醒副作用的病人即使服用安慰剂也会出现副作用，所以医生必须如实告知，又不能让他们预期受苦。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-medicine-loneliness-as-a-health-risk",
      title: ["Loneliness as a Health Risk", "孤独是一种健康风险"],
      body: `For most of history, loneliness has been seen as a private problem, something to discuss with friends, not with doctors. In recent years, however, scientists have begun to see it as a serious threat to public health.

The evidence is strong. In 2010, an American scientist called Julianne Holt-Lunstad analyzed the results of 148 studies of more than 300,000 people. She found that the risk of dying during the studies was much higher for people with weak relationships than for people with strong ones. Being cut off from others, she argued, was as great a risk as smoking fifteen cigarettes a day, and greater than being overweight or getting too little exercise.

How can a feeling affect the body? Scientists believe that, for most of history, being alone was dangerous. A person who was far from the group could easily be caught by predators. As a result, the body responds to loneliness as it does to a threat: it produces more of the hormones of stress, sleep gets worse, and the body changes in other harmful ways. Over many years, these changes may play a part in heart disease, depression and the loss of memory.

It is important to see the difference between loneliness and being alone. Many people live alone and feel completely happy, while others feel lonely in a crowded room or even in a marriage. Loneliness is the distance between the relationships we have and the relationships we want. It is subjective, which makes it difficult to measure, although scientists have developed lists of questions that assess it in a reliable way.

Who is most at risk? Elderly people who have lost a partner or who cannot leave their homes are an obvious group. To the surprise of many, however, a number of surveys indicate that young adults now say they feel lonely more often than any other age group. Some blame social media, while others point to the decline of clubs, churches and other places where people used to meet.

Some governments have responded. In 2018, Britain gave one of its ministers the job of reducing loneliness, and Japan followed in 2021. Some doctors now send lonely patients to groups such as garden clubs, choirs or volunteering, as well as giving them medication.

The answer, scientists say, does not need to be difficult. Regular contact with other people, even short conversations with neighbors or shop assistants, can improve wellbeing. In the end, the best medicine for loneliness may be the simplest one: other people.`,
      names: ["Julianne", "Holt-Lunstad", "Britain", "Japan", "American"],
      questions: [
        [
          ["What did Holt-Lunstad compare the risk of being cut off from others to?", "霍尔特-伦斯塔德把与他人隔绝的风险比作什么？"],
          ["Smoking fifteen cigarettes a day", "每天抽十五支烟"],
          [
            ["Getting too little exercise every week", "每周运动太少"],
            ["Being overweight", "超重"],
          ],
          [
            'It was "as great a risk as smoking fifteen cigarettes a day, and greater than being overweight or getting too little exercise."',
            "她认为这种风险相当于每天抽十五支烟，比超重或缺乏运动更大。",
          ],
        ],
        [
          ["How is loneliness different from being alone?", "孤独和独处有什么不同？"],
          ["It is the gap between the relationships we have and those we want", "它是我们拥有的关系与想要的关系之间的差距"],
          [
            ["It only happens to people who live alone or have lost a partner", "它只发生在独居或失去伴侣的人身上"],
            ["It is objective, so a doctor can measure it exactly", "它是客观的，所以医生可以精确地测量"],
          ],
          [
            '"Loneliness is the distance between the relationships we have and the relationships we want." Many people live alone and feel happy.',
            "孤独是我们拥有的关系和想要的关系之间的距离；很多人独居却很快乐。",
          ],
        ],
        [
          ["Which group do surveys show is surprisingly lonely?", "调查显示哪个群体出人意料地孤独？"],
          ["Young adults", "年轻人"],
          [
            ["Elderly people", "老年人"],
            ["Doctors", "医生"],
          ],
          [
            '"To the surprise of many... young adults now say they feel lonely more often than any other age group." Elderly people are the obvious group, not the surprising one.',
            "出乎很多人意料，年轻人说自己感到孤独的频率比其他年龄组都高；老年人是显而易见的群体。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-medicine-the-trial-that-went-wrong",
      title: ["The Trial That Went Wrong", "出了差错的试验"],
      body: `In March 2006, eight healthy young men arrived at a clinic of Northwick Park Hospital in London. They had volunteered to take part in a clinical trial of a new medication for illnesses in which the body harms its own cells. Each of them would be paid about three thousand dollars.

It was the first time that the medication had been given to people. Before the trial, it had been given to animals such as monkeys, at doses hundreds of times higher, with no serious effects. The scientists were confident that the dose they had chosen was safe.

At eight in the morning, six of the men were given the medication, while two received a placebo. Within an hour, the first man complained of a terrible headache. Soon all six were in great pain, with high fevers. Their immunity had turned against their own bodies. By the evening, they were in intensive care, and a number of their organs were failing. Doctors worked for weeks to save their lives. All six survived, but some suffered permanent damage.

Experts were asked to determine what had gone wrong. They revealed that the medication worked in a different way in people than in the animals on which it had been tried. They also identified mistakes in the design of the trial. All six volunteers had received the medication within a few minutes of each other. If the scientists had given it to one person first and waited, they would have detected the problem before anyone else was harmed.

The trial led to important changes. Today, when a hazardous medication is first given to people, volunteers receive it one at a time, often with a day between them. The first dose must be far lower than before, and it is calculated from its effects on the cells of people, not only on animals.

The story raised difficult ethical questions as well. Had the volunteers really understood the risks when they gave their consent? Was it right to pay them so much that students and unemployed people might not think carefully about the risk? Should the trial have been allowed at all?

Disasters like this one almost never happen. Every year, thousands of trials take place without any problems, and without volunteers who accept risks, no new medication could ever be developed. Nevertheless, the trial at Northwick Park is still a warning that every new treatment is uncertain, and that precautions are there for a reason.`,
      grammar: ["past-modals"],
      names: ["London", "Northwick", "Park"],
      questions: [
        [
          ["Why were the scientists confident that the dose was safe?", "科学家为什么确信剂量是安全的？"],
          ["Much higher doses had caused no serious effects in animals", "在动物身上，高得多的剂量也没有造成严重影响"],
          [
            ["The medication had been used on people for years", "这种药已经在人身上用了很多年"],
            ["The volunteers had been tested for allergies", "志愿者已经做过过敏检查"],
          ],
          [
            'It had been given to animals "at doses hundreds of times higher, with no serious effects."',
            "这种药曾以高几百倍的剂量用于动物，没有严重影响。",
          ],
        ],
        [
          ["What mistake in the design of the trial did the experts identify?", "专家发现试验设计中有什么错误？"],
          ["All six volunteers received the medication within minutes", "六名志愿者在几分钟内都用了药"],
          [
            ["Two of the eight men received a placebo instead", "八人中有两人用的是安慰剂"],
            ["The volunteers were paid too little to take the risk", "志愿者冒这个险得到的报酬太少"],
          ],
          [
            '"All six volunteers had received the medication within a few minutes of each other." If one had been given it first, the problem would have been detected.',
            "六名志愿者几分钟内先后用药；如果先给一个人用药并等待，本可以发现问题。",
          ],
        ],
        [
          ["What is one ethical question that the story raised?", "这件事引出了哪个伦理问题？"],
          ["Whether high pay made volunteers ignore the risk", "高报酬是否让志愿者忽视了风险"],
          [
            ["Whether monkeys should receive placebos", "猴子是否应该用安慰剂"],
            ["Whether the hospital should have been closed", "这家医院是否应该关闭"],
          ],
          [
            '"Was it right to pay them so much that students and unemployed people might not think carefully about the risk?"',
            "付给他们那么多钱，以至于学生和失业者可能不会仔细考虑风险，这样做对吗？",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-medicine-animals-in-laboratories",
      title: ["Animals in Laboratories", "实验室里的动物"],
      body: `Every year, millions of animals are used in scientific research around the world, most of them mice, but also fish, birds, rabbits, dogs and monkeys. They are used to check the safety of new medications, to study diseases and to understand how the body works. Few subjects in science are as controversial.

People who support animal research emphasize its achievements. Almost every major breakthrough in medicine of the last century, from vaccines to the first organ transplants, depended on experiments on animals. Before a new medication is given to people, the law in most countries requires it to be tried on animals first, in order to identify harmful effects. Those who support it argue that it would be wrong to give people treatments that nobody had checked at all.

Those who oppose it give two types of reasons. The first is moral. Many animals used in research suffer pain, stress and fear, and most of them are put to death at the end of the experiments. If animals can suffer, they argue, causing them to suffer for our benefit cannot be justified, just as it would not be justified to do the same to a person.

The second reason is scientific. The bodies of mice are very different from the bodies of people, and a medication that is safe for a mouse may be dangerous for a person, as some trials have shown. Most medications that succeed in animals later fail in trials on people, which suggests that experiments on animals do not always predict what will happen in people.

Most scientists accept that the current situation has serious problems. For decades, many have followed a principle with three parts: replace animals with other methods wherever possible, reduce the number of animals used, and improve experiments to cause as little suffering as possible. In many countries, every experiment must be accepted by a group of experts who assess whether its benefits justify the harm.

New technologies may eventually make many experiments on animals no longer necessary. Scientists can now grow tiny organs from the cells of people, and computers can simulate how a substance will affect the body. In 2022, the United States changed its law so that new medications no longer have to be tried on animals if other methods can demonstrate that they are safe.

For now, however, most scientists believe that animals cannot be replaced completely. The question is not only whether we can do without them, but how much suffering we are prepared to accept for the health of people.`,
      names: ["United", "States"],
      questions: [
        [
          ["What is the scientific reason against animal research?", "反对动物实验的科学理由是什么？"],
          ["Results in animals often do not predict results in people", "动物身上的结果往往不能预测人身上的结果"],
          [
            ["Animals in laboratories suffer pain and fear", "实验室里的动物遭受痛苦和恐惧"],
            ["Experiments on animals are too expensive", "动物实验太贵了"],
          ],
          [
            '"Most medications that succeed in animals later fail in trials on people." Pain and fear are the moral reason, not the scientific one.',
            "大多数在动物身上成功的药物后来在人体试验中失败；痛苦和恐惧是道德理由，不是科学理由。",
          ],
        ],
        [
          ["Which of these is part of the principle that many scientists follow?", "下面哪一项是许多科学家遵循的原则的一部分？"],
          ["Reduce the number of animals used", "减少使用动物的数量"],
          [
            ["Use only mice and never monkeys", "只用老鼠，从不用猴子"],
            ["Test every medication on people first", "每种药都先在人身上测试"],
          ],
          [
            "The principle has three parts: replace animals where possible, reduce their number, and improve experiments to cause less suffering.",
            "这一原则有三部分：尽可能替代动物，减少数量，改进实验以减少痛苦。",
          ],
        ],
        [
          ["What did the United States change in 2022?", "美国在 2022 年做了什么改变？"],
          ["Medications no longer always have to be tried on animals", "药物不再总是必须在动物身上试验"],
          [
            ["All experiments on animals were banned in every state", "所有州都禁止了动物实验"],
            ["Computers were made to replace all trials on people", "用计算机取代所有人体试验"],
          ],
          [
            'New medications "no longer have to be tried on animals if other methods can demonstrate that they are safe."',
            "如果其他方法能证明安全，新药不再必须在动物身上试验。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-medicine-burnout-at-work",
      title: ["Burnout at Work", "工作倦怠"],
      body: `Maya was twenty-nine and, by any measure, had done very well. She worked for a large advertising company, earned a high salary and had been promoted two times in three years. She also worked twelve hours a day, answered emails at midnight and had not taken a holiday in eighteen months. One Monday morning, she sat in her car outside her office and found that she could not make herself get out. "I wasn't sad, exactly," she says. "I just felt empty. I couldn't care about anything."

Maya was suffering from burnout. The word was first used in 1974 by an American doctor, Herbert Freudenberger, to describe the condition of the volunteers at a clinic where he worked, and his own condition, too. In 2019, the World Health Organization recognized burnout as a problem caused by chronic stress at work that has not been managed well.

The World Health Organization describes three signs of burnout. The first is feeling tired all the time, in a way that a weekend of rest does not cure. The second is distance from your job, often in the form of negative feelings about work and colleagues. The third is a feeling that one is no longer achieving anything.

Burnout is not the same as depression, although a person can suffer from both. Its causes lie mainly in the conditions of work, not in the person. Experts have identified a number of things that increase the risk: too heavy a workload, a lack of control over your work, small rewards, conflict with colleagues and a feeling that the company is not fair. People in caring jobs, such as nurses, teachers and social workers, are especially vulnerable.

For many years, the common advice was to cope alone, by exercising, sleeping more or doing yoga. These things can help, but experts increasingly argue that they are not enough. Telling a nurse who is completely worn out to do yoga, while she still has to care for two times as many patients as she should, will not solve the problem. Real answers, they say, require employers to change the conditions that cause burnout: a reasonable workload, reasonable hours and managers who listen.

Maya took three months off work and saw a therapist, who helped her understand why she had found it so hard to say no. When she returned, she negotiated a shorter week and stopped checking her emails after seven in the evening. "The work didn't change," she says. "What changed was that I stopped believing I had to do all of it. If I'd understood that earlier, I could have avoided a lot of pain."`,
      grammar: ["past-modals"],
      names: ["Maya", "Herbert", "Freudenberger", "World", "Health", "Organization", "American"],
      questions: [
        [
          ["Which of these is one of the three signs of burnout?", "下面哪一项是倦怠的三个迹象之一？"],
          ["Negative feelings about work and colleagues", "对工作和同事的负面情绪"],
          [
            ["Sadness after the death of a friend", "朋友去世后的悲伤"],
            ["Being promoted too quickly", "升职太快"],
          ],
          [
            "The three signs are tiredness that rest does not cure, distance from your job with negative feelings, and a feeling of achieving nothing.",
            "三个迹象是休息也无法消除的疲惫、对工作的疏离和负面情绪，以及一事无成的感觉。",
          ],
        ],
        [
          ["Where do the causes of burnout mainly lie?", "倦怠的原因主要在哪里？"],
          ["In the conditions of work", "在工作条件中"],
          [
            ["In the personality of the worker", "在员工的性格中"],
            ["In a lack of exercise and sleep", "在缺乏运动和睡眠中"],
          ],
          ['"Its causes lie mainly in the conditions of work, not in the person."', "倦怠的原因主要在于工作条件，而不在于个人。"],
        ],
        [
          ["What does Maya say changed after she returned to work?", "玛雅说她回去工作后什么改变了？"],
          ["She stopped believing she had to do all the work", "她不再认为所有工作都得自己做"],
          [
            ["Her company gave her much less work", "公司给她的工作少了很多"],
            ["She moved to a different job", "她换了一份工作"],
          ],
          [
            '"The work didn\'t change... What changed was that I stopped believing I had to do all of it."',
            "工作本身没变，变的是她不再认为所有事都得自己做。",
          ],
        ],
      ],
    }),
  ],
};
