// Grade 12: writing skills checked by rule: a key term defined for an argument, precise diction, and a risk explained
// clearly and fairly.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const defining = topic("writing", {
  id: "defining-a-term-in-an-argument",
  title: ["Defining a Term in an Argument", "在论证中定义术语"],
  summary: [
    "Stating what a key word such as freedom, success or fair means in an argument, so that the reader and the writer argue about the same thing.",
    "说明 freedom、success 或 fair 之类关键词在论证中的含义，使读者和作者争论的是同一件事。",
  ],
  after: ["facts-definitions-and-examples", "qualifying-a-claim"],
  points: [
    label(
      "what-kind-of-definition",
      ["What Kind of Definition", "哪一种定义"],
      [
        "Arguments often turn on a word that people use in different ways: *freedom*, *success*, *fair*, *art*. A **working definition** says plainly what the writer means by the word in this argument, in other terms, with its limits: *By success I mean a job that pays enough to live on and that the person chose.* A **circular definition** uses the word, or a form of it, to define itself: *Success is being successful.* A **loaded definition** builds the writer's conclusion into the meaning, so the argument is won by definition: *Art is anything that makes me feel deeply.*",
        "论证常常取决于一个人们用法各异的词：*freedom*、*success*、*fair*、*art*。**工作定义**用别的词清楚地说明作者在这个论证中所指的意思，并划出界限：*我所说的成功，是指一份收入足以维持生活、且由本人选择的工作。* **循环定义**用这个词本身或它的变体来定义自己：*成功就是取得成功。* **偏向性定义**把作者的结论放进词义里，使论证靠定义取胜：*艺术就是任何能让我深受感动的东西。*",
      ],
      ["What kind of definition is this?", "这是哪一种定义？"],
      `
        By success I mean a job that pays enough to live on and that the person chose freely.|a working definition
        In this essay, a fair test is one that every student has had equal time to prepare for.|a working definition
        Here, freedom means the absence of rules made by others that a person did not agree to.|a working definition
        By a public space I mean any place that anyone may enter without paying.|a working definition
        I use "poverty" to mean an income below half the national average.|a working definition
        A good teacher, for this argument, is one whose students can explain what they learned.|a working definition
        By "local food" I mean food grown within one hundred miles of where it is sold.|a working definition
        For this essay, a hero is someone who takes a serious risk to help a stranger.|a working definition
        In this argument, "screen time" means hours spent on phones, tablets and computers for fun.|a working definition
        By a "safe" street I mean one with fewer than two crashes a year.|a working definition
        Success is the state of being successful.|a circular definition
        A fair test is one that is fair to everyone.|a circular definition
        Freedom is being free to do things.|a circular definition
        Poverty means being poor.|a circular definition
        A good teacher is a teacher who teaches well.|a circular definition
        Local food is food that is local.|a circular definition
        A hero is someone who acts heroically.|a circular definition
        Art is whatever artists make as art.|a circular definition
        A safe street is a street where people are safe.|a circular definition
        Justice is the quality of being just.|a circular definition
        Art is anything that makes me feel deeply.|a loaded definition
        Success means earning more than your parents did, so most people have failed.|a loaded definition
        A fair test is one that my class always does well on.|a loaded definition
        Freedom is the right to ignore any law I dislike.|a loaded definition
        A good teacher is one who never gives homework.|a loaded definition
        Real food is food my grandmother would recognize, so anything else is junk.|a loaded definition
        A hero is anyone who wears a uniform, so every soldier is a hero.|a loaded definition
        Wasteful spending means any money spent on programs I oppose.|a loaded definition
        A true patriot is someone who agrees with the government.|a loaded definition
        Good music is music that was made before 1990.|a loaded definition
      `,
      {
        "a working definition": L(
          "工作定义",
          "It says in other words what the term means in this argument and sets clear limits that a reader could apply.",
          "它用别的词说明这个术语在本论证中的含义，并划出读者能够应用的清楚界限。",
          "It does not explain the term in other words with clear limits.",
          "它没有用别的词说明这个术语并划出清楚的界限。",
        ),
        "a circular definition": L(
          "循环定义",
          "It defines the word by using the same word or a form of it, so the reader learns nothing new.",
          "它用这个词本身或它的变体来定义这个词，读者什么新东西也学不到。",
          "It does not define the word by repeating the word itself.",
          "它没有用这个词本身来定义这个词。",
        ),
        "a loaded definition": L(
          "偏向性定义",
          "It builds the writer's own preference or conclusion into the meaning, so the argument is decided by definition.",
          "它把作者自己的偏好或结论放进了词义里，使论证靠定义就分出了胜负。",
          "It does not build the writer's conclusion into the meaning.",
          "它没有把作者的结论放进词义里。",
        ),
      },
    ),
    choose(
      "the-definition-that-works",
      ["The Definition That Works", "可用的定义"],
      [
        "A definition that works for an argument is **clear** (it uses words the reader already knows), **limited** (it says what counts and what does not) and **neutral** (a reader on the other side could accept it as a starting point). It does not repeat the word, it does not win the argument by itself, and it is not so broad that everything counts.",
        "适用于论证的定义要**清楚**（用读者已经认识的词）、**有界限**（说明什么算、什么不算）、**中立**（对方的读者也能把它当作出发点接受）。它不重复这个词本身，不靠定义就赢得论证，也不宽泛到什么都算。",
      ],
      ["Which definition would work best in an argument?", "哪个定义最适合用在论证中？"],
      `
        success|a job that pays enough to live on and that the person chose|being successful at whatever you do in life|earning more money than everyone else you know, including your friends and family
        a fair test|a test every student had equal time and help to prepare for|a test that is fair to all who take it|a test that my class always passes easily without having to study for it
        freedom|the absence of rules a person had no say in making|the state of being free to do things|the right to ignore any law or rule that you happen to dislike at the time
        poverty|an income below half of the national average|the condition of being poor and needy|having less money than the rich have
        a good teacher|one whose students can explain what they learned|a teacher who teaches well and is good|one who never gives any homework and always lets the class leave early
        local food|food grown within one hundred miles of where it is sold|food that comes from the local area|food my grandmother would recognize
        a hero|someone who takes a serious risk to help a stranger|a person who acts heroically and bravely|anyone who wears a uniform of any kind, whatever they actually do in it
        a safe street|a street with fewer than two crashes a year|a street where people feel safe and secure|a street that has no cars on it at all, ever
        screen time|hours spent on phones, tablets and computers for fun|the time that people spend on screens|time wasted on useless modern gadgets
        a public space|any place that anyone may enter without paying|a space that is public and open|any place that I personally am allowed to visit whenever I like
        art|a made thing presented to be looked at, heard or read for its own sake|whatever artists make and call art|anything that makes me feel deeply
        bullying|repeated acts meant to hurt someone with less power|the act of being a bully to people|any remark at all that someone does not like hearing about themselves
        a democracy|a state whose leaders are chosen in free and regular elections|a democratic form of government|any country that agrees with ours
        a healthy diet|meals that meet the daily needs for energy and nutrients|a diet that is good for your health|a diet with no sugar or fat whatsoever
        a living wage|pay enough to cover rent, food and travel in that city|a wage that you can live on well|any wage above what workers get now
        an expert|someone with long training and published work in a field|a person who has expertise|anyone who agrees with my view on the subject, whatever their training
        a friend|someone you trust who helps you without asking for payment|a person who is friendly toward you|anyone who likes your posts online
        violence|physical force used to injure people or damage property|violent acts of all kinds|any action at all that I personally find upsetting or unpleasant to watch
        a classic|a book still widely read a century after it was written|a book that is a classic|a book I was forced to read at school
        a waste of money|spending that brings less benefit than it costs|money that is wasted|money spent on programs I oppose
        a small business|a firm with fewer than fifty employees|a business that is small|a shop owned and run by a nice family in our town
        cheating|using help that the rules of a task do not allow|the act of being a cheater|any help from another person at all
        a city|a settlement with more than one hundred thousand people|a place that is a city|any place with tall buildings, busy traffic and lots of noise at night
        an educated person|one who can read, reason and learn new skills alone|a person who has an education|anyone with a university degree
        a fair price|a price that covers costs and a modest profit|a price that is fair to everyone|the lowest price I have ever seen
        nature|land and life that people have not built or planted|the natural world and things in it|beautiful scenery in the country
        a crisis|a sudden danger that needs action within days or weeks|a situation that is a crisis|anything that the news reports
        privacy|control over who sees information about you|the state of being private|the right to do absolutely anything you want in secret
        a good leader|one who sets goals people accept and keeps them working together|a leader who leads well|one who never changes their mind
        a loyal citizen|one who obeys the law and takes part in public life|a citizen who is loyal|one who never criticizes the government
      `,
      (right) => [
        `"${right}" uses plain words, sets limits on what counts and does not decide the argument in advance.`,
        `“${right}”用平实的词，划定了什么算数的界限，也没有预先决定论证的结果。`,
      ],
      [
        ['"{wrong}" defines the term with the term itself, so it explains nothing.', "“{wrong}”用术语本身来定义术语，所以什么也没解释。"],
        [
          '"{wrong}" builds a personal preference or conclusion into the meaning, so a reader on the other side would reject it.',
          "“{wrong}”把个人偏好或结论放进了词义，对方的读者不会接受。",
        ],
      ],
    ),
  ],
});

const diction = topic("writing", {
  id: "choosing-precise-diction",
  title: ["Choosing Precise Diction", "选择精确的措辞"],
  summary: [
    "Replacing vague words such as thing, good, nice and very with words that say exactly what is meant, with the right connotation for the purpose.",
    "把 thing、good、nice、very 之类含糊的词换成准确表达意思、联想意义也符合目的的词。",
  ],
  after: ["connotation-and-precise-words", "formal-style"],
  points: [
    label(
      "is-the-word-right",
      ["Is the Word Right", "这个词用得对吗"],
      [
        "**Diction** is word choice. A word can fail in two ways. It can be **vague**: *thing*, *stuff*, *good*, *bad*, *nice*, *very*, *a lot*, *interesting* tell the reader almost nothing. Or it can have the **wrong connotation**: it means roughly the right thing but carries feelings that do not fit (*The general's stubborn courage saved the city* praises with a word of blame; *The thief was frugal with the stolen money* uses praise for a crime). **Precise** diction names exactly what is meant, with the feeling the writer intends.",
        "**措辞**就是用词。一个词可能以两种方式失败。它可能**含糊**：*thing*、*stuff*、*good*、*bad*、*nice*、*very*、*a lot*、*interesting* 几乎没有告诉读者任何东西。也可能**联想意义不对**：它的意思大致对，却带着不相称的感情（*The general's stubborn courage saved the city* 用一个贬义词去称赞；*The thief was frugal with the stolen money* 对犯罪用了褒义词）。**精确**的措辞准确说出所指，并带着作者想要的感情。",
      ],
      ["What is true of the word in bold?", "加粗的词是什么情况？"],
      `
        The museum had a lot of **stuff** from ancient Egypt.|vague
        The speech was **good**.|vague
        The weather on the trip was **nice**.|vague
        The novel deals with many **things** about growing up.|vague
        The results of the experiment were **interesting**.|vague
        The new law had a **big** effect on farmers.|vague
        The ending of the film was **bad**.|vague
        She felt **weird** about the decision.|vague
        The author uses **stuff** like symbols to show the theme.|vague
        The situation in the city got **really bad**.|vague
        The general's **stubborn** courage saved the city.|the wrong connotation
        The thief was **frugal** with the stolen money.|the wrong connotation
        The nurse **pestered** the patient until he took his medicine and recovered.|the wrong connotation
        The tyrant was **confident** that no one would dare to stop him.|the wrong connotation
        The volunteers **meddled** in the flood rescue and saved dozens.|the wrong connotation
        The dictator's **thrifty** budget left the hospitals without medicine.|the wrong connotation
        The scientist's **nosy** questions led to a cure.|the wrong connotation
        The brave firefighter **lurked** near the burning door.|the wrong connotation
        The kind grandmother **smirked** at the baby.|the wrong connotation
        The champion **bragged** quietly in her modest speech.|the wrong connotation
        The museum held over three hundred **artifacts** from ancient Egypt.|precise
        The speech was **persuasive**.|precise
        The weather on the trip was **mild and dry**.|precise
        The novel explores **friendship, rivalry and loss** in adolescence.|precise
        The results of the experiment were **unexpected**.|precise
        The new law **doubled the cost of water** for farmers.|precise
        The ending of the film was **rushed**.|precise
        She felt **uneasy** about the decision.|precise
        The general's **steadfast** courage saved the city.|precise
        The nurse **persuaded** the patient to take his medicine.|precise
      `,
      {
        vague: L(
          "含糊",
          "The word is so general that it tells the reader almost nothing specific.",
          "这个词太笼统，几乎没有告诉读者任何具体的东西。",
          "The word is not too general to tell the reader something specific.",
          "这个词并没有笼统到说不出具体内容。",
        ),
        "the wrong connotation": L(
          "联想意义不对",
          "The word means roughly the right thing but carries feelings that clash with what the sentence is saying.",
          "这个词的意思大致对，但带着与句意冲突的感情色彩。",
          "The feelings the word carries do not clash with the sentence.",
          "这个词的感情色彩与句子并不冲突。",
        ),
        precise: L(
          "精确",
          "The word names exactly what is meant, with feelings that fit the sentence.",
          "这个词准确说出所指，感情色彩也与句子相符。",
          "The word is too general or carries the wrong feelings.",
          "这个词太笼统，或带着不对的感情色彩。",
        ),
      },
    ),
    choose(
      "the-precise-word",
      ["The Precise Word", "精确的词"],
      [
        "To choose a precise word, ask what exactly you mean and what feeling you want the reader to have. Instead of *walked*, did the person *stroll*, *march*, *limp* or *trudge*? Instead of *said*, did she *whisper*, *insist* or *admit*? A precise word is specific, fits the facts the sentence gives, and carries the right feeling; a vague word says too little, and a word with the wrong connotation says something the writer did not intend.",
        "选择精确的词，要问自己确切的意思是什么、想让读者有什么感受。不说 *walked*，那人是 *stroll*（闲逛）、*march*（行进）、*limp*（跛行）还是 *trudge*（艰难地走）？不说 *said*，她是 *whisper*（低语）、*insist*（坚持）还是 *admit*（承认）？精确的词具体、符合句中给出的事实，并带着恰当的感情；含糊的词说得太少，联想意义不对的词则说出了作者并不想说的东西。",
      ],
      ["Which word is most precise for the sentence?", "哪个词放在句子里最精确？"],
      `
        After the long march, the soldiers ___ into camp, barely lifting their feet.|trudged|went|pranced
        The witness finally ___ that she had lied to the police.|admitted|said|boasted
        The child ___ so that no one in the library would hear.|whispered|talked|bellowed
        The old bridge ___ under the weight of the truck.|groaned|did something|giggled
        The proud parents ___ as their daughter received her prize.|beamed|looked|smirked
        The hungry dog ___ the meat in seconds.|devoured|ate|nibbled
        The judge ___ the lawyer for arriving late.|reprimanded|talked to|praised
        The heavy rain ___ the village, sweeping away homes.|flooded|affected|sprinkled
        The scientist's ___ notes recorded every reading to three decimal places.|meticulous|good|sloppy
        The general's ___ refusal to retreat saved the city.|steadfast|big|pigheaded
        The candidate ___ his rival's plan as costly and unproven.|criticized|talked about|applauded
        The museum's collection is ___, with objects from every continent.|vast|nice|cramped
        The patient's condition ___ overnight, and she went home the next day.|improved|changed|worsened
        The speaker ___ her point by repeating it three times.|emphasized|said|whispered
        The tourists ___ along the beach, in no hurry at all.|strolled|moved|sprinted
        The thief ___ through the window while the guard slept.|crept|went|stomped
        The novel ___ the life of a family over a hundred years.|traces|is about stuff in|skips
        The scientist ___ the theory after the new results came in.|revised|did things to|ignored
        The company ___ its profits by hiding its debts.|inflated|changed|reported honestly
        The hikers ___ the summit just as the sun rose.|reached|got to the thing at|missed
        The teacher's ___ explanation left no student confused.|lucid|nice|muddled
        The audience ___ when the clown fell into the cake.|roared with laughter|reacted|sighed
        The flood ___ the crops, leaving the fields bare.|destroyed|affected|watered
        The witness gave a ___ account, full of exact times and names.|detailed|good|vague
        The village ___ quiet after the soldiers left.|fell|got kind of|stayed noisy
        The singer's voice ___ through the empty hall.|echoed|went|faded out
        The mayor ___ the new park with a short speech.|opened|did|closed
        The cat ___ toward the bird, belly low to the ground.|stalked|went|bounded noisily
        The leader ___ her followers to keep fighting.|urged|told something to|discouraged
        The boy ___ the vase and it shattered on the floor.|knocked over|did something to|polished
        The report ___ the dangers of the new chemical.|warns of|talks about things like|celebrates
      `,
      (right) => [
        `**${right}** names exactly what happens and fits the facts and the feeling of the sentence.`,
        `**${right}** 准确说出了发生的事，也符合句子的事实和感情色彩。`,
      ],
      [
        ["*{wrong}* is too vague; it tells the reader almost nothing specific.", "*{wrong}* 太含糊，几乎没有告诉读者任何具体的东西。"],
        [
          "*{wrong}* is specific, but its meaning or feeling clashes with the rest of the sentence.",
          "*{wrong}* 虽然具体，但它的意思或感情色彩与句子其余部分冲突。",
        ],
      ],
    ),
  ],
});

const riskClearly = topic("writing", {
  id: "explaining-a-risk-clearly",
  title: ["Explaining a Risk Clearly", "清楚地说明风险"],
  summary: [
    "Writing about a danger so that readers learn its real size: absolute numbers, a fair comparison and calm words, rather than alarm or false comfort.",
    "写到某种危险时，让读者了解它的真实大小：给出绝对数字、公平的比较和冷静的措辞，而不是制造恐慌或虚假的安慰。",
  ],
  after: ["reading-risk-and-probability", "keeping-an-objective-tone"],
  points: [
    label(
      "how-the-risk-is-told",
      ["How the Risk Is Told", "风险是怎样讲述的"],
      [
        "A writer who explains a risk can mislead in two directions. An **alarming** statement gives only a relative change or a frightening story, or uses words such as *deadly*, *soaring* and *shocking*, so readers fear more than the numbers justify. A **falsely reassuring** statement waves the risk away with words like *perfectly safe*, *nothing to worry about* or *only a tiny chance*, without numbers. A **clear and fair** statement gives the absolute numbers, compares them with something familiar, and uses calm words.",
        "说明风险的作者可能从两个方向误导读者。**制造恐慌**的说法只给出相对变化或吓人的故事，或使用 *deadly*、*soaring*、*shocking* 之类的词，让读者的恐惧超过数字所能支持的程度。**虚假安慰**的说法用 *perfectly safe*、*nothing to worry about* 或 *only a tiny chance* 之类的话把风险一笔带过，却不给数字。**清楚公正**的说法给出绝对数字，与熟悉的事物比较，并使用冷静的措辞。",
      ],
      ["How does this sentence tell the risk?", "这个句子是怎样讲述风险的？"],
      `
        Shocking new study: the pill doubles your risk of a deadly clot!|alarming
        Cases of the illness have soared by 50% in a single year!|alarming
        A girl in our town died after swimming in the lake, so the lake is a killer.|alarming
        Phone towers may be silently poisoning our children.|alarming
        Eating bacon raises your cancer risk by 18%, experts warn.|alarming
        Living near the airport triples your chance of the disease!|alarming
        Deadly bacteria found in school water fountains!|alarming
        Night shifts make you twice as likely to fall ill.|alarming
        A terrifying number of cyclists are hit on the new road.|alarming
        The new drug carries a hidden risk that doctors won't tell you about.|alarming
        The pill is perfectly safe, so there is nothing to worry about.|falsely reassuring
        The chance of an accident at the plant is tiny, so relax.|falsely reassuring
        The lake has always been fine for swimming.|falsely reassuring
        There is no evidence of any risk from the towers at all, ever.|falsely reassuring
        Bacon has been eaten for centuries, so it cannot be harmful.|falsely reassuring
        Flooding here is so rare it is not worth thinking about.|falsely reassuring
        Don't worry, side effects only happen to other people.|falsely reassuring
        My grandfather worked nights for forty years and was never ill.|falsely reassuring
        The road is completely safe if you are careful.|falsely reassuring
        Experts agree the vaccine has absolutely no side effects of any kind.|falsely reassuring
        The pill raises the risk of a clot from about 2 to about 4 in 10,000 women a year.|clear and fair
        Cases rose from 10 to 15 per 100,000 people, still fewer than flu deaths.|clear and fair
        About 1 in 50,000 swimmers drowns in the lake each year, less than on the coast.|clear and fair
        Studies have found no rise in illness near towers, though research continues.|clear and fair
        Eating bacon daily raises the lifetime risk of bowel cancer from about 6 to about 7 in 100.|clear and fair
        Near the airport, about 3 in 1,000 people have the disease, compared with 1 in 1,000 elsewhere.|clear and fair
        Tests found the bacteria in 2 of 40 fountains; they have been shut and cleaned.|clear and fair
        Night workers have about 8 cases per 1,000, compared with 4 per 1,000 for day workers.|clear and fair
        Twelve cyclists were hurt on the road last year, out of about 40,000 who used it.|clear and fair
        About 1 in 10,000 patients has a serious reaction, which doctors list on the label.|clear and fair
      `,
      {
        alarming: L(
          "制造恐慌",
          "It uses only a relative change, a single frightening case or dramatic words, so the risk seems larger than it is.",
          "它只用相对变化、单个吓人的案例或夸张的词语，让风险显得比实际更大。",
          "It does not make the risk sound larger than the numbers show.",
          "它没有让风险听起来比数字显示的更大。",
        ),
        "falsely reassuring": L(
          "虚假安慰",
          "It dismisses the risk with comforting words, a tradition or one lucky case, and gives no numbers.",
          "它用安慰的话、传统或一个幸运的案例把风险一笔带过，不给出任何数字。",
          "It does not wave the risk away without numbers.",
          "它没有在不给数字的情况下把风险一笔带过。",
        ),
        "clear and fair": L(
          "清楚公正",
          "It gives absolute numbers, often with a comparison, in calm words, so readers can judge the risk.",
          "它用冷静的措辞给出绝对数字，常常还有比较，读者可以自己判断风险。",
          "It leaves out the absolute numbers or colors them with alarm or comfort.",
          "它省去了绝对数字，或用恐慌或安慰给数字染了色。",
        ),
      },
    ),
    choose(
      "the-clearest-statement",
      ["The Clearest Statement", "最清楚的说法"],
      [
        "When you write about a risk, give the **baseline** and the **change** as absolute numbers (*from 2 to 4 in 10,000*), say **who** and **over what time** (*women taking the pill, each year*), and where it helps, compare it with a familiar risk. Keep the words calm: let the numbers carry the weight. Leave out *deadly*, *soaring* and *shocking*, and leave out *perfectly safe* and *nothing to worry about*.",
        "写到风险时，要用绝对数字给出**基线**和**变化**（*从万分之二到万分之四*），说明**对谁**、**在多长时间内**（*服药的女性，每年*），在有帮助的地方与一种熟悉的风险作比较。措辞保持冷静：让数字说话。去掉 *deadly*、*soaring* 和 *shocking*，也去掉 *perfectly safe* 和 *nothing to worry about*。",
      ],
      ["Which statement explains the risk most clearly and fairly?", "哪个说法最清楚、最公正地说明了风险？"],
      `
        a pill and blood clots|It raises the yearly risk from about 2 to about 4 in 10,000 women.|Shocking: the pill doubles your risk of a deadly clot!|The pill is perfectly safe, so stop worrying about clots.
        a new road and cyclists|Twelve of about 40,000 cyclists were hurt there last year.|The road is a death trap for every cyclist who uses it.|The road is completely safe for everyone if cyclists are just careful enough.
        bacon and cancer|Eating it daily raises lifetime risk from about 6 to about 7 in 100.|Bacon lovers face an 18% higher risk of deadly cancer!|Bacon has been eaten for centuries, so it is harmless.
        a lake and drowning|About 1 in 50,000 swimmers drowns there each year.|Our killer lake has claimed another young life this summer!|The lake has always been fine, so there is no danger.
        living near an airport|About 3 in 1,000 nearby residents have the disease, against 1 in 1,000 elsewhere.|Airport neighbors face triple the risk of a terrible disease!|People have lived near airports for years without any harm.
        a vaccine's side effects|About 1 in 100,000 people has a serious reaction.|The vaccine hides a terrifying risk that officials won't admit!|The vaccine has no side effects of any kind whatsoever.
        night shifts and illness|Night workers have about 8 cases per 1,000, day workers about 4.|Night shifts double your chance of falling ill, experts warn!|Plenty of people work nights for many years and stay perfectly healthy, so relax.
        a river flood|The town has about a 1 in 100 chance of a major flood each year.|Experts fear a catastrophic flood could strike at any moment!|Floods here are so rare that they are not really worth thinking about at all, ever.
        a drug and liver damage|About 3 in 10,000 users suffer liver damage, usually reversible.|This popular drug is quietly destroying people's livers!|Only a tiny number of people are harmed, so ignore it.
        bacteria in fountains|Tests found bacteria in 2 of 40 fountains, now shut and cleaned.|Deadly germs are lurking in the drinking water at every one of our children's schools!|There is nothing in the water that could harm anyone.
        phone towers|Large studies have found no rise in illness near towers.|Phone towers may be silently poisoning our families!|Towers are totally harmless, and anyone who asks is foolish.
        air pollution and asthma|Asthma rates near the highway are about 12 in 100, against 8 in 100 farther away.|Toxic air is choking our children on a massive scale!|Air in this city is perfectly clean, so there is no problem.
        a ski slope|About 2 skiers in 1,000 are injured on that slope each season.|The slope is a terrifying place where skiers are maimed!|Nobody really gets hurt skiing if they know what they are doing.
        sunburn and skin cancer|Regular sunburn raises lifetime skin cancer risk from about 2 to about 4 in 100.|Sun lovers are doubling their chances of deadly cancer!|A little sun never hurt anyone, so forget the sunscreen.
        a food additive|Studies found no harm at doses below 50 milligrams a day.|This sinister chemical is lurking in all your favorite foods!|Additives are tested, so they are always completely safe.
        a bridge|Engineers rate the bridge safe for loads under 20 tons; heavier trucks are banned.|This crumbling bridge could collapse beneath you at any moment!|The bridge has stood for decades, so it will always stand.
        an earthquake|The city has about a 1 in 50 chance of a major quake in any year.|A killer quake is coming, and the city is not ready!|Big quakes almost never happen here, so there is no reason at all to prepare for one.
        a diving board|About 4 in 10,000 divers hurt themselves on the high board each year.|The high board is maiming swimmers every week!|Diving is safe for everyone, so there is no need for rules.
        mobile phones while driving|Drivers on phones crash about 4 times as often as others: about 4 rather than 1 in 100,000 trips.|Phones turn drivers into deadly menaces on our roads!|Good drivers can use their phones safely, so it is fine.
        a heat wave|Deaths among people over 75 rose from about 10 to about 14 per 100,000 in the week.|Killer heat is sweeping the nation, claiming lives everywhere!|Heat waves are just summer weather, nothing to fear.
        a playground|About 5 in 1,000 children are hurt at playgrounds each year, mostly in falls.|Our city's playgrounds have become dangerous zones for helpless young children every single day!|Children never really get hurt at playgrounds.
        a gene and heart disease|Carriers have about a 20 in 100 lifetime risk, against 10 in 100 for others.|This gene doubles your odds of a deadly heart attack!|Genes do not really matter if you live well.
        a medicine during pregnancy|About 1 in 1,000 babies is affected, compared with 1 in 2,000 without it.|The medicine doubles the threat to unborn babies!|Mothers have taken it for years, so it is fine.
        a chemical plant|The plant's chance of a major leak is estimated at 1 in 10,000 per year.|The plant is a ticking time bomb in our neighborhood!|The plant is so modern that a leak is simply impossible.
        lightning|About 1 in a million people is struck each year, mostly outdoors in storms.|Lightning could strike you anywhere, at any time!|Lightning never strikes people, so storms are harmless.
        flu|Flu kills about 10 in 100,000 people in a typical year, mostly over 65.|Flu is a deadly killer stalking every household!|Flu is really just a bad cold for nearly everyone, so there is no need to worry about it.
        a factory's noise|Workers there have hearing loss at about 15 in 100, against 5 in 100 elsewhere.|The factory is deafening its workers at a shocking rate!|A bit of noise never hurt anyone's ears.
        a sports injury|About 3 in 100 players tear a knee ligament each season.|Players are being crippled on the field every single weekend of the season!|Real athletes never get injured if they train hard.
        a hospital infection|About 4 in 100 patients catch an infection during a stay.|Hospitals are breeding grounds for deadly superbugs!|Hospitals are clean, so infections almost never happen.
        a dog breed and bites|About 2 in 10,000 owners of the breed report a serious bite each year.|This vicious breed is a menace to every family!|My dog would never bite anyone, so the breed is safe.
      `,
      (right) => [
        `"${right}" gives absolute numbers, says who is affected and over what time, and uses calm words.`,
        `“${right}”给出了绝对数字，说明了受影响的人和时间范围，措辞也很冷静。`,
      ],
      [
        [
          '"{wrong}" uses dramatic words or only a relative change, so the risk sounds larger than it is.',
          "“{wrong}”用了夸张的词或只给出相对变化，让风险听起来比实际更大。",
        ],
        [
          '"{wrong}" waves the risk away with comfort or one case, and gives no numbers.',
          "“{wrong}”用安慰的话或一个案例把风险一笔带过，没有给出数字。",
        ],
      ],
    ),
  ],
});

/** writingTopics12 are the rule-checked writing topics of grade 12. */
export const writingTopics12: readonly TopicDef[] = [defining, diction, riskClearly];
