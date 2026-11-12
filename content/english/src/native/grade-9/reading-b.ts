// Grade 9: reading of the later units: character foils, speculative fiction, how ideas unfold in a text, weighing
// claims about health, a perspective from another culture and a subject told in two mediums.

import type { TopicDef } from "@ga/content";
import { type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const foils = topic("reading", {
  id: "character-foils",
  title: ["Character Foils", "衬托人物"],
  summary: [
    "How a writer sets one character beside another whose contrasting traits make the first one's qualities stand out.",
    "作者如何把一个人物放在另一个性格形成对比的人物旁边，使前者的特点更加突出。",
  ],
  after: ["comparing-two-characters", "dynamic-and-static-characters"],
  points: [
    label(
      "the-trait-the-foil-highlights",
      ["The Trait the Foil Highlights", "衬托人物突出了什么特点"],
      [
        "A **foil** is a character whose qualities contrast with another's, usually the main character's. The contrast works like a dark cloth behind a jewel: it makes the main character's traits shine. A reckless friend beside a careful hero highlights the hero's **caution**; a cruel brother beside a gentle one highlights his **kindness**. To read a foil, find what the two characters do differently in a similar situation, and ask which trait of the main character the difference shows.",
        "**衬托人物**（foil）是性格与另一个人物（通常是主人公）形成对比的人物。这种对比就像宝石后面的深色衬布，让主人公的特点更加醒目。谨慎的英雄身边有个鲁莽的朋友，就突出了英雄的**谨慎**；温和的人身边有个残忍的兄弟，就突出了他的**善良**。要读懂衬托人物，就找出两个人物在相似处境中的不同做法，问问这种不同显示了主人公的哪个特点。",
      ],
      ["Which trait of the main character does the foil highlight?", "衬托人物突出了主人公的哪个特点？"],
      `
        While his friend charges into the dark cave shouting, Arun stops, lights a lamp and tests the floor.|caution
        Her sister keeps the whole cake for herself; Lin cuts hers into pieces for the neighbors' children.|generosity
        His cousin runs from the fire; Omar runs back in for the old man trapped upstairs.|courage
        The other clerk lies to the boss to cover his mistake; Grace admits hers at once.|honesty
        Her rival gives up after one failed audition; Nadia practices every night for a year.|perseverance
        The prince boasts of every victory; his brother never speaks of the battles he won.|humility
        One guard kicks the beggar aside; the other gives him his own coat.|kindness
        While his partner rushes to sign the deal, Leo reads every line of the contract twice.|caution
        His brother spends every coin on himself; Sam saves his to pay for their mother's medicine.|generosity
        Her friend hides behind the wall; Maya steps out to face the bully.|courage
        His teammate claims the goal was his; Ben says plainly that the pass made the goal.|honesty
        The other climbers turn back at the first storm; Tenzing waits it out and climbs on.|perseverance
        The new manager takes credit for every success; the old one always thanked his team.|humility
        Her stepsister mocks the stray dog; Ella feeds it and finds it a home.|kindness
        While her friend dives into the unknown river, Rosa checks the current first.|caution
        His friend keeps the reward money; Kofi shares it with everyone who helped in the search.|generosity
        When the wolves appear, the merchant climbs a tree; the shepherd girl stands between the wolves and her flock.|courage
        His partner forges the test results; the young scientist reports the failure exactly as it happened.|honesty
        Her classmates quit the hard puzzle after ten minutes; Hana works on it all weekend.|perseverance
        The champion struts before the crowd; the old master bows to his opponent.|humility
        One brother laughs at the injured bird; the other carries it home and nurses it.|kindness
        His cousin trusts every stranger on the road; Tomas watches each one closely before speaking.|caution
        Her friend keeps the best seat for herself; Priya gives hers to the old woman on the bus.|generosity
        The soldiers drop their weapons and flee; the young drummer keeps beating the march.|courage
        The other witness changes his story to please the judge; Anna repeats exactly what she saw.|honesty
        The other students drop the language class in the first month; Diego studies on through the winter.|perseverance
        His rival wants statues built in his honor; the general asks only to be buried among his soldiers.|humility
        The landlord evicts the widow in the snow; his son secretly pays her rent.|kindness
        While her teammate sprints ahead and loses the path, Ines marks each turn on her map.|caution
        His friend demands payment for fixing the roof; Yusuf fixes it for free.|generosity
      `,
      {
        caution: L(
          "谨慎",
          "The foil rushes in carelessly, which makes the main character's careful checking stand out.",
          "衬托人物冒冒失失地冲上去，使主人公的小心检查更加突出。",
          "The contrast here is not between rushing in and acting carefully.",
          "这里的对比不在于冒失和谨慎。",
        ),
        generosity: L(
          "慷慨",
          "The foil keeps things for himself or herself, which makes the main character's giving stand out.",
          "衬托人物把东西留给自己，使主人公的给予更加突出。",
          "The contrast here is not between keeping things and giving them away.",
          "这里的对比不在于独占和给予。",
        ),
        courage: L(
          "勇敢",
          "The foil runs or hides from danger, which makes the main character's bravery stand out.",
          "衬托人物在危险面前逃跑或躲藏，使主人公的勇敢更加突出。",
          "The contrast here is not between fleeing danger and facing it.",
          "这里的对比不在于逃避危险和直面危险。",
        ),
        honesty: L(
          "诚实",
          "The foil lies or cheats, which makes the main character's truthfulness stand out.",
          "衬托人物撒谎或作弊，使主人公的诚实更加突出。",
          "The contrast here is not between lying and telling the truth.",
          "这里的对比不在于撒谎和说实话。",
        ),
        perseverance: L(
          "坚持",
          "The foil gives up early, which makes the main character's refusal to quit stand out.",
          "衬托人物早早放弃，使主人公的坚持不懈更加突出。",
          "The contrast here is not between giving up and keeping on.",
          "这里的对比不在于放弃和坚持。",
        ),
        humility: L(
          "谦逊",
          "The foil boasts or seeks glory, which makes the main character's modesty stand out.",
          "衬托人物自吹自擂或追求荣耀，使主人公的谦逊更加突出。",
          "The contrast here is not between boasting and modesty.",
          "这里的对比不在于自夸和谦逊。",
        ),
        kindness: L(
          "善良",
          "The foil is cruel or cold to someone weak, which makes the main character's kindness stand out.",
          "衬托人物对弱者残忍或冷漠，使主人公的善良更加突出。",
          "The contrast here is not between cruelty and kindness to someone weak.",
          "这里的对比不在于对弱者的残忍和善良。",
        ),
      },
    ),
    label(
      "what-the-pairing-does",
      ["What the Pairing Does", "人物配对的作用"],
      [
        "Writers pair characters for different purposes. A foil can **sharpen a trait** of the main character, as in the cases above. A pair can **show two answers to one problem**, so that the story weighs two ways of living, such as staying home or leaving. And a foil can **mark how far the hero has changed**: a character who stays the same shows, by contrast, how much the main character has grown.",
        "作者把人物配对有不同的目的。衬托人物可以**突出主人公的某个特点**，如上一部分所示。一对人物可以**展示对同一问题的两种回答**，让故事权衡两种生活方式，比如留在家乡还是离开。衬托人物还可以**标示英雄改变了多少**：一个始终不变的人物，通过对比显示出主人公成长了多少。",
      ],
      ["What does this pairing of characters mainly do?", "这组人物配对主要起什么作用？"],
      `
        One sister marries and stays in the village; the other leaves for the city; the novel follows both lives side by side.|shows two answers to one problem
        At the start, Jin and his friend are both bullies; by the end, Jin defends the new boy while his friend is as cruel as ever.|marks how far the hero has changed
        The cowardly squire trembles at every noise, and beside him the knight's calm seems even greater.|sharpens a trait
        Two brothers lose their father: one seeks revenge, the other seeks forgiveness, and the play follows where each path leads.|shows two answers to one problem
        At the reunion, Mara's old friend still talks only of money, and the reader sees how much Mara has learned to value other things.|marks how far the hero has changed
        Next to his loud, careless roommate, the young doctor's quiet care for every patient stands out.|sharpens a trait
        Faced with the same war, one friend joins the army and the other refuses to fight; the story weighs both choices.|shows two answers to one problem
        The prince's childhood companion is still spoiled and lazy when they meet again, proving how much the prince has grown in exile.|marks how far the hero has changed
        The greedy innkeeper makes the poor traveler's honesty look all the brighter.|sharpens a trait
        Two scientists discover the same thing: one sells it to the army, one gives it to the world.|shows two answers to one problem
        When Lena visits her old school, her former best friend is still afraid of everything Lena has learned to face.|marks how far the hero has changed
        The boastful knight in the next tent makes the hero's silence before battle seem wise.|sharpens a trait
        One immigrant clings to the old language and customs; her daughter embraces the new country; the novel shows both.|shows two answers to one problem
        At the end, the hero meets the man he once was in the form of a young thief, and sees how far he has come.|marks how far the hero has changed
        Beside her impatient sister, Ruth's patience with their dying grandmother seems almost saintly.|sharpens a trait
        Two friends inherit the farm: one sells it and moves away, the other stays and fights the drought.|shows two answers to one problem
        The old gang leader has not changed in twenty years, and seeing him, the reader measures how much the narrator has.|marks how far the hero has changed
        The general's rash officer charges into every trap, and the general's caution looks all the more like wisdom.|sharpens a trait
        Two young poets: one writes to please the court, one writes the truth and is exiled.|shows two answers to one problem
        The girl's cousin is still jealous and petty at the wedding, while the girl has learned to forgive.|marks how far the hero has changed
        Next to the lazy apprentice, the hardworking one seems even more devoted.|sharpens a trait
        Faced with the same injustice, one lawyer obeys the law and one breaks it; the story weighs both.|shows two answers to one problem
        When Ali meets his old teammate, who still blames others for every loss, the reader sees how Ali has learned responsibility.|marks how far the hero has changed
        The selfish uncle makes the boy's sacrifice for his sister seem greater.|sharpens a trait
        Two queens rule neighboring lands, one by fear and one by love; the story follows both kingdoms.|shows two answers to one problem
        At the end, the narrator's brother is still the angry boy he was, and the narrator has grown into a calm man.|marks how far the hero has changed
        The gossiping maid makes the quiet servant's loyalty more striking.|sharpens a trait
        One twin trusts machines, one trusts people; the novel tests both ways of facing the future.|shows two answers to one problem
        The villain was once the hero's closest friend, and his unchanged ambition shows how the hero's has faded.|marks how far the hero has changed
        Beside his trembling companion on the cliff, the climber's steady hands look all the steadier.|sharpens a trait
      `,
      {
        "sharpens a trait": L(
          "突出某个特点",
          "The foil's opposite behavior makes one trait of the main character stand out more clearly.",
          "衬托人物相反的行为使主人公的某个特点更清楚地显现出来。",
          "The pairing does more than make one trait stand out: it compares two paths or measures a change.",
          "这组配对不只是突出某个特点：它比较两条道路或衡量一种变化。",
        ),
        "shows two answers to one problem": L(
          "展示对同一问题的两种回答",
          "Two characters face the same problem and choose differently, and the story follows both choices.",
          "两个人物面对同一个问题做出不同选择，故事追踪两种选择的结果。",
          "The two characters are not making different choices about the same problem.",
          "这两个人物并不是对同一个问题做出不同的选择。",
        ),
        "marks how far the hero has changed": L(
          "标示英雄的变化",
          "A character who has stayed the same shows, by contrast, how much the main character has grown.",
          "一个始终没变的人物通过对比显示出主人公成长了多少。",
          "The pairing does not measure how much the main character has changed over time.",
          "这组配对并没有衡量主人公随时间改变了多少。",
        ),
      },
    ),
  ],
});

const speculative = topic("reading", {
  id: "reading-speculative-fiction",
  title: ["Reading Speculative Fiction", "阅读推想小说"],
  summary: [
    "How science fiction, dystopias and alternate histories build worlds that differ from ours, and how their difference comments on the present.",
    "科幻小说、反乌托邦小说和架空历史如何构建与我们不同的世界，以及这种不同如何评论当下。",
  ],
  after: ["comparing-stories-of-one-genre", "how-modern-stories-use-old-tales"],
  points: [
    label(
      "the-kind-of-speculative-story",
      ["The Kind of Speculative Story", "推想小说的种类"],
      [
        "**Speculative fiction** asks *what if?* and builds a world that answers. **Science fiction** imagines what new science or technology might do: robots, space travel, cures. A **dystopia** shows a society that seems orderly but is controlled and unjust. An **alternate history** changes one event of the past and follows what might have happened. A **utopia** imagines a society that seems perfect, though such stories often hint at the cost.",
        "**推想小说**提出*如果……会怎样？*并构建一个回答这个问题的世界。**科幻小说**想象新的科学或技术可能带来什么：机器人、太空旅行、治愈疾病的方法。**反乌托邦小说**展示一个看似有序、实则受控制而不公正的社会。**架空历史**改变过去的某个事件，推演可能发生的结果。**乌托邦小说**想象一个看似完美的社会，不过这类故事常常暗示其代价。",
      ],
      ["What kind of speculative story is this?", "这是哪种推想小说？"],
      `
        A scientist builds a machine that lets people share their dreams, and the first test goes wrong.|science fiction
        In the city of the future, every citizen's mood is checked daily, and anyone found sad is taken away.|dystopia
        The story imagines that the ancient library of Alexandria was never burned, and follows a world centuries ahead in science.|alternate history
        On a peaceful island, there is no money, no crime and no hunger, and everyone works only four hours a day.|utopia
        A crew wakes from a hundred-year sleep on a ship bound for a distant star.|science fiction
        Books are banned, and firemen are paid to burn any that are found.|dystopia
        What if the steam engine had been invented in ancient Rome? The novel follows an empire of railways.|alternate history
        In a valley hidden from the world, people live in perfect harmony and no one has ever told a lie.|utopia
        A girl discovers that her best friend is an android built to look human.|science fiction
        The government assigns every child a job at birth and a partner at eighteen, and no one may choose.|dystopia
        The story follows a world in which the Black Death never reached Europe.|alternate history
        Machines do all the work, and humans spend their days in art, study and play, without want.|utopia
        A virus that makes people forget their names spreads across the planet, and a doctor races to stop it.|science fiction
        Cameras watch every room, and the posters say that the Leader sees everything.|dystopia
        In this version of history, the Spanish Armada won, and England became part of a Spanish empire.|alternate history
        A city is planned so perfectly that no one is ever poor, ill or unhappy, or so its rulers say.|utopia
        Miners on the moon find a strange crystal that seems to be alive.|science fiction
        Only those who score highest on a yearly test are allowed to have children.|dystopia
        The novel imagines that Columbus's ships sank in a storm and the Americas met Europe two centuries later.|alternate history
        On a faraway planet, a people without war or property welcome the first human visitors.|utopia
        A boy builds a robot dog that learns to feel jealous of his new sister.|science fiction
        People are sorted into districts by their wealth, and the poorest must send children to fight in yearly games.|dystopia
        What if the printing press had been invented in China and never reached the West? The story explores the result.|alternate history
        A group of friends found a village where all decisions are made together and every person is equal.|utopia
        Engineers test the first elevator to space, and a cable begins to fray.|science fiction
        Citizens are given a pill each morning that keeps them calm and obedient.|dystopia
        The story follows a world in which the dinosaurs never died out and humans evolved beside them.|alternate history
        A traveler arrives in a land where disease has been banished and everyone lives two hundred years.|utopia
        A message arrives from a star thirty light-years away, and the world must decide how to answer.|science fiction
        Every word spoken in public is recorded, and certain words have been made illegal.|dystopia
      `,
      {
        "science fiction": L(
          "科幻小说",
          "The story imagines what new science or technology could do: machines, space, medicine or contact with other worlds.",
          "故事想象新的科学或技术可能带来什么：机器、太空、医学或与其他世界的接触。",
          "The story is not mainly about what new science or technology could do.",
          "这个故事主要不是关于新的科学或技术可能带来什么。",
        ),
        dystopia: L(
          "反乌托邦",
          "The society is controlled and unjust, with its people watched, sorted or forced to obey.",
          "这个社会受到控制、很不公正，人们被监视、被分类或被迫服从。",
          "The story does not show a society of control and injustice.",
          "这个故事并没有展示一个受控制而不公正的社会。",
        ),
        "alternate history": L(
          "架空历史",
          "One event of the real past is changed, and the story follows how history might have gone instead.",
          "真实历史中的一个事件被改变，故事推演历史可能会怎样发展。",
          "The story does not change a real event of the past.",
          "这个故事并没有改变过去的真实事件。",
        ),
        utopia: L(
          "乌托邦",
          "The story imagines a society that seems perfect, free of want, war or injustice.",
          "故事想象一个看似完美、没有匮乏、战争或不公的社会。",
          "The society here is not presented as ideal or perfect.",
          "这里的社会并没有被描绘成理想或完美的。",
        ),
      },
    ),
    label(
      "what-the-imagined-world-says",
      ["What the Imagined World Says", "想象的世界在说什么"],
      [
        "A speculative world is a mirror of our own. It can **warn about a present trend**, pushing something already happening, such as surveillance or pollution, to an extreme. It can **question what makes us human**, through machines, clones or aliens that think and feel. Or it can **imagine a better way to live**, holding up a model that shows what our world lacks. Ask what in our world the story's difference points to.",
        "推想的世界是我们自己世界的一面镜子。它可以**对当下的趋势发出警告**，把监控或污染之类已经在发生的事推向极端；可以通过会思考、有感情的机器、克隆人或外星人，**追问人之为人的意义**；也可以**设想更好的生活方式**，提供一个范例，显示我们的世界缺少什么。问问故事中的不同指向我们世界的什么。",
      ],
      ["What is this imagined world mainly doing?", "这个想象的世界主要在做什么？"],
      `
        In the story, people spend so long in virtual worlds that cities crumble around their unmoving bodies.|warns about a present trend
        An android begs not to be switched off, saying it is afraid of the dark.|questions what makes us human
        In the imagined city, every child has a garden, and no one is ever too busy to listen to a neighbor.|imagines a better way to live
        The sea has risen over every coast, and the last cities float on rafts of plastic.|warns about a present trend
        A clone discovers she was made only to provide organs for the person she was copied from, and asks whether her life is her own.|questions what makes us human
        On the island, decisions are made only after every voice is heard, and there has not been a war in five hundred years.|imagines a better way to live
        Advertising is beamed directly into people's dreams, and no one can sleep without hearing a jingle.|warns about a present trend
        Aliens who have no word for *lie* cannot understand why humans need trust.|questions what makes us human
        The future town has no cars, and everyone walks, cycles and knows the names of the trees.|imagines a better way to live
        Every purchase, word and step is tracked, and a single score decides where each person may live.|warns about a present trend
        A robot that has read every poem ever written wonders whether it truly understands grief.|questions what makes us human
        In the imagined country, the old are honored as teachers, and no one is ever left alone.|imagines a better way to live
        Water has become so scarce that the rich buy rain while the poor drink what they can find.|warns about a present trend
        A scientist uploads her mind into a computer and asks whether the copy is really her.|questions what makes us human
        The visitors find a society where work is shared, so that no one works too much and no one too little.|imagines a better way to live
        News is written by machines that tell each reader only what he or she already believes.|warns about a present trend
        A man falls in love with a voice program and must decide whether its love is real.|questions what makes us human
        In the valley, everyone grows their own food and trades freely, and hunger is unknown.|imagines a better way to live
        Antibiotics have stopped working, and a scratch from a rose can kill.|warns about a present trend
        A boy raised by robots must learn what it means to cry.|questions what makes us human
        In the imagined school, children learn whatever they are curious about, and no one is ever graded.|imagines a better way to live
        A company owns the rights to people's memories and can delete them if bills go unpaid.|warns about a present trend
        A creature built from spare parts reads books and asks its maker why it was made.|questions what makes us human
        The new colony on Mars has no rich and no poor, and its people vote on everything together.|imagines a better way to live
        Forests have vanished, and children have only seen trees in museums.|warns about a present trend
        An alien learns to laugh and asks the humans whether that makes it one of them.|questions what makes us human
        In the dreamed city, every building is powered by the sun and the air is as clean as a mountain's.|imagines a better way to live
        Only the people who own the machines have jobs, and everyone else waits in endless lines for food.|warns about a present trend
        A robot that saves a child refuses to say it was just following its program.|questions what makes us human
        In the land beyond the mountains, strangers are welcomed as guests, and no one has ever built a wall.|imagines a better way to live
      `,
      {
        "warns about a present trend": L(
          "对当下趋势发出警告",
          "The story pushes something already happening in our world to an extreme, so that readers see where it might lead.",
          "故事把我们世界中已经在发生的事推向极端，让读者看到它可能导致什么。",
          "The story does not push a present trend to a dangerous extreme.",
          "这个故事并没有把当下的趋势推向危险的极端。",
        ),
        "questions what makes us human": L(
          "追问人之为人",
          "A machine, a clone or an alien that thinks and feels makes the reader ask what being human really means.",
          "一个会思考、有感情的机器、克隆人或外星人让读者追问做人到底意味着什么。",
          "No being here makes the reader ask what it means to be human.",
          "这里没有让读者追问人之为人的存在。",
        ),
        "imagines a better way to live": L(
          "设想更好的生活方式",
          "The world is a model of how life could be better, which shows by contrast what our own world lacks.",
          "这个世界是生活可以变得更好的范例，通过对比显示出我们的世界缺少什么。",
          "The world here is not offered as a better way to live.",
          "这里的世界并不是作为更好的生活方式提出的。",
        ),
      },
    ),
  ],
});

const unfold = topic("reading", {
  id: "how-ideas-unfold-in-a-text",
  title: ["How Ideas Unfold in a Text", "文章中观点的展开"],
  summary: [
    "How an author orders and connects ideas across a whole text, introducing, developing, qualifying and drawing them together.",
    "作者如何在整篇文章中安排和连接观点：引入、展开、限定和归纳。",
  ],
  after: ["tracking-a-central-idea"],
  points: [
    label(
      "the-move-this-paragraph-makes",
      ["The Move This Paragraph Makes", "这一段在全文中起什么作用"],
      [
        "In a long essay, each paragraph makes a **move** in the unfolding of the ideas. It may **introduce** the central idea, often with a hook. It may **develop** the idea with evidence or an example. It may **qualify** it, admitting a limit or an exception (*This is not always true...*). It may **turn** to a new or opposing idea (*But others see it differently...*). Or it may **draw together** what has come before into a conclusion.",
        "在一篇长文章中，每个段落都在观点的展开中**起一定作用**。它可能**引入**中心观点，常常以一个吸引人的开头；可能用证据或例子**展开**这个观点；可能**限定**它，承认某个局限或例外（*This is not always true...*）；可能**转向**一个新的或相反的观点（*But others see it differently...*）；也可能把前面的内容**归纳**成结论。",
      ],
      ["What move does this paragraph make in the essay?", "这一段在文章中起什么作用？"],
      `
        Every morning, millions of people wake to an alarm, and few ask whether waking so early is good for them. This essay argues that schools start too early.|introduces the idea
        In one district that moved its start time from 7:30 to 8:30, attendance rose by eight percent and car accidents among teenage drivers fell.|develops the idea
        Later start times are not a cure for every problem, of course; students who stay up too late will still be tired.|qualifies the idea
        Yet some parents argue that later start times make it harder for them to get to work.|turns to another view
        Taken together, the research, the results and the voices of students point to one conclusion: school should begin later.|draws it together
        Imagine a city where no one throws anything away. That city is closer than you think.|introduces the idea
        In Kamikatsu, Japan, residents sort their waste into forty-five categories, and the town recycles about eighty percent of it.|develops the idea
        Such a system may not work everywhere; a small town is easier to organize than a city of millions.|qualifies the idea
        Critics, however, say that recycling uses so much energy that it barely helps the planet.|turns to another view
        In the end, the question is not whether we can waste nothing, but whether we can waste much less, and the answer is yes.|draws it together
        We think of libraries as quiet places full of old books, but the library of today is something new.|introduces the idea
        The library on Elm Street now lends tools, teaches coding and hosts a weekly clinic for new immigrants.|develops the idea
        Not every library can afford such programs, and some still struggle to buy books.|qualifies the idea
        Some city leaders, though, argue that in a digital age, libraries are no longer needed at all.|turns to another view
        So the library has not died; it has changed, and the change has made it more needed, not less.|draws it together
        Most people think of bees as insects that sting, but our food supply depends on them.|introduces the idea
        About a third of the crops we eat, from apples to almonds, rely on bees to carry pollen.|develops the idea
        Bees are not the only pollinators, it is true; birds, bats and other insects do some of the work.|qualifies the idea
        Some farmers, however, believe that pesticides are worth the risk to bees because they protect the harvest.|turns to another view
        Protecting bees, then, is not a matter of loving insects but of feeding ourselves.|draws it together
        The phone in your pocket holds more computing power than the computers that sent people to the moon.|introduces the idea
        A study of five hundred students found that those who kept their phones out of the room scored higher on tests.|develops the idea
        This does not mean phones are always harmful; used well, they can help students learn.|qualifies the idea
        Others claim that banning phones in school would leave students unprepared for the modern world.|turns to another view
        The evidence suggests a middle path: phones have a place in learning, but not on every desk at every moment.|draws it together
        A century ago, few people had ever traveled more than fifty miles from home.|introduces the idea
        Cheap flights have made it possible for millions to visit other countries every year.|develops the idea
        Travel has not reached everyone equally, though; most people in the world have still never flown.|qualifies the idea
        Climate scientists, on the other hand, warn that air travel is one of the fastest-growing sources of pollution.|turns to another view
        The age of travel, then, has opened the world, but it asks us to think about the price of every journey.|draws it together
      `,
      {
        "introduces the idea": L(
          "引入观点",
          "The paragraph opens the essay, often with a hook, and presents the central idea or question.",
          "这一段是文章的开头，常常用一个吸引人的开场，提出中心观点或问题。",
          "The paragraph does not open the essay with its central idea.",
          "这一段并不是以中心观点开启全文。",
        ),
        "develops the idea": L(
          "展开观点",
          "The paragraph supports the idea with evidence, facts or an example.",
          "这一段用证据、事实或例子来支持观点。",
          "The paragraph does not support the idea with evidence or an example.",
          "这一段并没有用证据或例子来支持观点。",
        ),
        "qualifies the idea": L(
          "限定观点",
          "The paragraph admits a limit or an exception to the idea, making the argument more careful.",
          "这一段承认观点的某个局限或例外，使论证更加严谨。",
          "The paragraph does not admit a limit or an exception to the idea.",
          "这一段并没有承认观点的局限或例外。",
        ),
        "turns to another view": L(
          "转向另一种观点",
          "The paragraph turns to a different or opposing view, often with *but*, *however* or *on the other hand*.",
          "这一段转向一个不同或相反的观点，常用 *but*、*however* 或 *on the other hand*。",
          "The paragraph does not turn to a different or opposing view.",
          "这一段并没有转向不同或相反的观点。",
        ),
        "draws it together": L(
          "归纳总结",
          "The paragraph gathers what came before into a conclusion, often with *then*, *in the end* or *taken together*.",
          "这一段把前面的内容归纳成结论，常用 *then*、*in the end* 或 *taken together*。",
          "The paragraph does not gather the essay into a conclusion.",
          "这一段并没有把全文归纳成结论。",
        ),
      },
    ),
    label(
      "how-the-ideas-are-connected",
      ["How the Ideas Are Connected", "观点之间如何连接"],
      [
        "Authors connect ideas in recognizable patterns. One idea may **build on** another, each step depending on the last, like links in a chain. Ideas may be **set side by side** as equal parts of a whole, such as three reasons or three examples. Or one idea may **answer** another, as a solution answers a problem or a reply answers a question. Words such as *therefore* and *as a result* signal building; *also* and *another* signal equal parts; *the answer* and *to solve this* signal answers.",
        "作者用可辨认的模式连接观点。一个观点可能**建立在**另一个观点**之上**，每一步都依赖前一步，像链条一样环环相扣。几个观点可能作为一个整体中平等的部分**并列**，比如三个理由或三个例子。一个观点也可能**回应**另一个观点，就像解决办法回应问题，答复回应提问。*therefore*、*as a result* 这样的词表示递进；*also*、*another* 表示并列；*the answer*、*to solve this* 表示回应。",
      ],
      ["How is the second idea connected to the first?", "第二个观点与第一个观点是什么关系？"],
      `
        Glaciers are melting faster than ever. As a result, sea levels are rising along every coast.|builds on the first
        One reason to learn music is that it trains memory. Another is that it teaches patience.|set side by side
        Many old bridges in the city are cracking. To solve this, engineers propose a ten-year plan of repairs.|answers the first
        Bacteria can become resistant to antibiotics. Therefore, doctors must prescribe them with care.|builds on the first
        Exercise strengthens the heart. It also improves sleep.|set side by side
        Why do some birds fly south in winter? The answer lies in the food they need.|answers the first
        The printing press made books cheaper. Because books were cheaper, more people learned to read.|builds on the first
        The first benefit of a garden is fresh food. A second is time spent outdoors.|set side by side
        Many students feel lonely in their first year. The school has started a mentoring program to help.|answers the first
        The river was dammed. This in turn flooded the valley above it.|builds on the first
        Wind is one source of clean energy. Sunlight is another.|set side by side
        Traffic jams waste hours of every driver's week. A new rail line is one way to reduce them.|answers the first
        The town's factory closed. Consequently, many young families moved away.|builds on the first
        Reading improves vocabulary. Reading also builds empathy.|set side by side
        How can a small island survive rising seas? Its people are building walls and moving homes uphill.|answers the first
        Plants take in carbon dioxide. Thus forests help to slow the warming of the planet.|builds on the first
        One cause of the war was trade. Another was religion.|set side by side
        Food is wasted in every supermarket. Some cities now require stores to give unsold food to shelters.|answers the first
        The bees disappeared from the valley. With fewer bees, the orchards produced less fruit.|builds on the first
        A good leader listens. A good leader also admits mistakes.|set side by side
        Why did the ancient city fall? Historians point to a long drought.|answers the first
        The cost of housing rose sharply. So many workers could no longer afford to live near their jobs.|builds on the first
        Volunteering helps the community. In addition, it helps the volunteer build skills.|set side by side
        Ships were losing their way in the fog. The lighthouse was built to guide them.|answers the first
        The new vaccine stopped the disease from spreading. As a result, schools were able to reopen.|builds on the first
        Cats are popular pets because they are independent. Dogs are popular because they are loyal.|set side by side
        Students struggle to focus after lunch. Some schools have moved recess to before the meal.|answers the first
        Steam engines powered the first factories. Factories, in turn, drew millions of people to the cities.|builds on the first
        The museum displays ancient tools. It also holds paintings from five centuries.|set side by side
        Many languages are dying out. Linguists are recording the last speakers before they are gone.|answers the first
      `,
      {
        "builds on the first": L(
          "建立在前者之上",
          "The second idea follows from the first, like the next link in a chain; words such as *therefore* or *as a result* often signal it.",
          "第二个观点由第一个观点推出，像链条中的下一环；常用 *therefore* 或 *as a result* 等词表示。",
          "The second idea does not follow from the first as a result or a next step.",
          "第二个观点并不是第一个观点的结果或下一步。",
        ),
        "set side by side": L(
          "并列",
          "The two ideas are equal parts of a whole, such as two reasons or two examples; words such as *also* or *another* often signal it.",
          "两个观点是一个整体中平等的部分，如两个理由或两个例子；常用 *also* 或 *another* 等词表示。",
          "The two ideas are not equal parts of a whole set side by side.",
          "这两个观点并不是并列的平等部分。",
        ),
        "answers the first": L(
          "回应前者",
          "The second idea answers the first, as a solution answers a problem or a reply answers a question.",
          "第二个观点回应第一个观点，就像解决办法回应问题，答复回应提问。",
          "The second idea is not a solution or an answer to the first.",
          "第二个观点并不是对第一个观点的解决办法或回答。",
        ),
      },
    ),
  ],
});

const health = topic("reading", {
  id: "weighing-health-claims",
  title: ["Weighing Health Claims", "权衡健康类说法"],
  summary: [
    "How to judge claims about food, medicine and the body: the kind of evidence behind them, who stands to gain and the warning signs of a weak claim.",
    "如何判断关于食物、药物和身体的说法：背后是什么样的证据，谁会从中获利，以及站不住脚的说法有哪些警示信号。",
  ],
  after: ["evaluating-a-scientific-argument"],
  points: [
    label(
      "the-evidence-behind-the-claim",
      ["The Evidence Behind the Claim", "说法背后的证据"],
      [
        "Health claims rest on very different kinds of evidence. A **personal story** (*It worked for my aunt!*) is vivid but proves little, because one case may be chance. A **small or animal study** is a start, but its results may not hold for people in general. A **large controlled study** compares many people who did and did not get a treatment, and is much stronger. A **review of many studies** weighs all the research together and is the strongest of all.",
        "健康类说法所依据的证据差别很大。**个人经历**（*It worked for my aunt!*）生动，却证明不了什么，因为一个案例可能只是巧合。**小规模研究或动物实验**是个开端，但其结果未必适用于一般人。**大规模对照研究**比较许多接受和未接受某种治疗的人，说服力要强得多。**对多项研究的综述**把所有研究放在一起衡量，是最有力的证据。",
      ],
      ["What kind of evidence supports this claim?", "这个说法依据的是哪种证据？"],
      `
        "I drank celery juice every morning for a week, and my headaches disappeared," writes a blogger.|a personal story
        In a test on twenty mice, a new compound slowed the growth of tumors.|a small or animal study
        Researchers gave 10,000 adults either the vaccine or a dummy shot, and the vaccinated group had 90 percent fewer cases.|a large controlled study
        Scientists combined the results of 48 studies on salt and blood pressure involving over 200,000 people.|a review of many studies
        A famous athlete says she owes her energy to a special brand of water.|a personal story
        Twelve volunteers who took the supplement for a month reported feeling more alert.|a small or animal study
        Over five years, 20,000 people were randomly assigned either to walk daily or to keep their usual habits, and heart attacks were compared.|a large controlled study
        A team reviewed every trial of the drug published in the past thirty years and pooled the results.|a review of many studies
        "My grandfather smoked every day and lived to ninety-five," says a man online.|a personal story
        Rats fed a diet high in sugar learned mazes more slowly than rats on a normal diet.|a small or animal study
        Six thousand children were randomly given either fluoride rinses or plain water, and their cavities were counted for three years.|a large controlled study
        An analysis of 120 studies concluded that regular exercise lowers the risk of depression.|a review of many studies
        A neighbor says that wearing a copper bracelet cured her aching joints.|a personal story
        In a study of fifteen students, those who chewed gum before a test scored slightly higher.|a small or animal study
        A trial in forty hospitals compared 8,000 patients given the new treatment with 8,000 given the old one.|a large controlled study
        Researchers gathered all the studies on screen time and sleep and weighed the evidence together.|a review of many studies
        A celebrity credits her clear skin to a diet of only raw fruit.|a personal story
        A drug that cured a disease in monkeys is now being tested for safety.|a small or animal study
        Thousands of pregnant women were randomly given either the vitamin or a placebo, and the health of their babies was compared.|a large controlled study
        A review of sixty trials found no clear evidence that the popular herb prevents colds.|a review of many studies
        "Ever since I started sleeping with the window open, I haven't caught a single cold," says a forum post.|a personal story
        Eight patients who tried the new therapy showed some improvement.|a small or animal study
        In a ten-year trial, 30,000 people were assigned either a low-fat or a normal diet, and their health was tracked.|a large controlled study
        Scientists pooled the data from 85 studies on coffee and found it was linked to a slightly longer life.|a review of many studies
        A shop owner swears that the magnetic insoles he sells cured his back pain.|a personal story
        Fruit flies given the chemical lived twice as long as those without it.|a small or animal study
        A study randomly gave 12,000 smokers either a nicotine patch or a dummy patch and counted how many quit.|a large controlled study
        A team examined every major study on sugar taxes from around the world and compared the results.|a review of many studies
        "My son stopped eating gluten and now he never misbehaves," a mother writes.|a personal story
        In a trial of ten dogs, a new pain medicine seemed to work faster than the old one.|a small or animal study
      `,
      {
        "a personal story": L(
          "个人经历",
          "The claim rests on one person's experience, which is vivid but may be chance and proves little.",
          "这个说法依据的是一个人的经历，虽然生动，但可能只是巧合，证明不了什么。",
          "The claim rests on research, not on one person's experience.",
          "这个说法依据的是研究，而不是某一个人的经历。",
        ),
        "a small or animal study": L(
          "小规模或动物研究",
          "The research used only a few people or only animals, so the results may not hold for people in general.",
          "这项研究只用了少数人或只用了动物，所以结果未必适用于一般人。",
          "This evidence is not a small study or a study only in animals.",
          "这一证据并不是小规模研究或仅限于动物的研究。",
        ),
        "a large controlled study": L(
          "大规模对照研究",
          "Many people were divided into groups that did and did not receive the treatment, and the groups were compared.",
          "许多人被分成接受和未接受治疗的组，然后对这些组进行比较。",
          "This is not one large study comparing a treated group with an untreated one.",
          "这不是一项比较治疗组与未治疗组的大规模研究。",
        ),
        "a review of many studies": L(
          "多项研究的综述",
          "The results of many studies were gathered and weighed together, which gives the strongest evidence.",
          "许多研究的结果被汇集起来一起衡量，这是最有力的证据。",
          "This evidence is not a review that weighs many studies together.",
          "这一证据并不是把许多研究放在一起衡量的综述。",
        ),
      },
    ),
    label(
      "the-warning-sign",
      ["The Warning Sign", "警示信号"],
      [
        "Weak health claims often show the same **warning signs**. The claim may **promise too much**: a miracle cure, instant results, or a remedy for every illness. The source may **stand to profit**, selling the very product it praises. The claim may **twist a real finding**, turning a link into a cause or a result in mice into a promise for people. Or it may **appeal to fear or to nature**, saying that something is dangerous because it is *chemical* or safe because it is *natural*.",
        "站不住脚的健康说法往往有相同的**警示信号**。说法可能**承诺过多**：神奇疗法、立竿见影，或包治百病。信息来源可能**从中获利**，推销的正是它夸赞的产品。说法可能**歪曲真实的研究结果**，把相关说成因果，把老鼠身上的结果说成对人的承诺。也可能**诉诸恐惧或“天然”**，说某样东西因为是*化学的*所以危险，或者因为是*天然的*所以安全。",
      ],
      ["Which warning sign does this claim show?", "这个说法显示出哪种警示信号？"],
      `
        This one tea cures colds, cancer, heartache and hair loss, in just three days!|promises too much
        The article praising the vitamin was written by the company that makes it.|stands to profit
        A study found that people who eat breakfast are healthier, so the headline says breakfast makes you healthy.|twists a real finding
        Avoid this shampoo: it contains chemicals!|appeals to fear or nature
        Lose twenty pounds in a week without changing what you eat!|promises too much
        The doctor recommending the diet also sells the diet's meal plans on his website.|stands to profit
        A chemical slowed aging in worms, and the advertisement claims it will keep you young.|twists a real finding
        This remedy is made only from herbs, so it cannot possibly harm you.|appeals to fear or nature
        One pill a day, and you will never be sick again.|promises too much
        The study showing that the energy drink improves focus was paid for by the energy drink company.|stands to profit
        Researchers found a link between coffee and long life, and the blog says coffee adds ten years to your life.|twists a real finding
        Vaccines are full of unnatural substances, so keep them away from your children.|appeals to fear or nature
        This cream erases every wrinkle overnight, guaranteed.|promises too much
        The influencer who swears by the protein powder is paid for every bottle sold through her link.|stands to profit
        A study of twelve people found a small effect, and the advertisement calls it a scientific breakthrough.|twists a real finding
        Our water is pure and natural, unlike the dangerous tap water full of chemicals.|appeals to fear or nature
        Cure any illness with the power of this ancient crystal.|promises too much
        The magazine praising the mattress earns money from every reader who buys one.|stands to profit
        People who own dogs are healthier, so the ad claims a dog will cure your high blood pressure.|twists a real finding
        Everything grown with chemicals is poison; eat only what nature intended.|appeals to fear or nature
        The juice cleanse removes every toxin from your body in one weekend.|promises too much
        The clinic offering the treatment is also the only place that sells it.|stands to profit
        A drug killed cancer cells in a dish, and the headline says a cure for cancer has been found.|twists a real finding
        Microwaves are unnatural and destroy all the goodness in your food.|appeals to fear or nature
        With these magic socks, you will run faster, sleep better and never feel tired.|promises too much
        The review calling the supplement safe was written by a man who owns shares in the company.|stands to profit
        Researchers found that children who play outside more have better eyesight, and the ad claims its outdoor toys cure poor vision.|twists a real finding
        Medicines from the pharmacy are dangerous chemicals, but this root from the forest is pure.|appeals to fear or nature
        Never get sick again with this one simple breathing trick!|promises too much
        The website warning against tap water is run by a company that sells water filters.|stands to profit
      `,
      {
        "promises too much": L(
          "承诺过多",
          "The claim promises a miracle: instant results, guaranteed success or a cure for everything.",
          "这个说法承诺奇迹：立竿见影、保证成功或包治百病。",
          "The claim does not promise a miracle or instant results.",
          "这个说法并没有承诺奇迹或立竿见影的效果。",
        ),
        "stands to profit": L(
          "来源从中获利",
          "The person or company making the claim earns money if you believe it, which gives a reason to be doubtful.",
          "提出这个说法的人或公司会因为你相信它而赚钱，这就是值得怀疑的理由。",
          "The problem here is not that the source earns money from the claim.",
          "这里的问题不在于信息来源会从这个说法中赚钱。",
        ),
        "twists a real finding": L(
          "歪曲真实结果",
          "A real study is stretched beyond what it showed, turning a link into a cause or a small result into a big promise.",
          "一项真实的研究被引申到超出其结果的范围，把相关说成因果，把小结果说成大承诺。",
          "No real study is being stretched beyond what it showed.",
          "这里并没有把一项真实研究引申到超出其结果的范围。",
        ),
        "appeals to fear or nature": L(
          "诉诸恐惧或“天然”",
          "The claim calls something dangerous because it is *chemical* or *unnatural*, or safe because it is *natural*, without evidence.",
          "这个说法没有证据，只因为某样东西是*化学的*或*不天然的*就说它危险，或因为是*天然的*就说它安全。",
          "The claim does not rest on the idea that *natural* is safe or *chemical* is dangerous.",
          "这个说法并不是基于“天然就安全、化学就危险”的想法。",
        ),
      },
    ),
  ],
});

const culture = topic("reading", {
  id: "perspective-from-another-culture",
  title: ["A Perspective from Another Culture", "来自另一种文化的视角"],
  summary: [
    "How a story from another culture reflects its values and customs, and how a reader can understand them without judging by his or her own culture alone.",
    "来自另一种文化的故事如何反映其价值观和习俗，以及读者如何理解它们，而不只用自己的文化来评判。",
  ],
  after: ["inferring-an-authors-point-of-view", "contrasting-points-of-view"],
  points: [
    label(
      "the-value-the-story-reflects",
      ["The Value the Story Reflects", "故事反映的价值观"],
      [
        "Stories carry the **values** of the cultures they come from, often without stating them. A story may show **respect for elders and ancestors**, when the old are obeyed and the dead honored. It may show **duty to family or community** placed above a person's own wishes. It may honor **hospitality to guests**, when strangers must be fed and protected. Or it may prize **harmony with nature**, when people must take only what they need. Look at what the characters are praised or punished for.",
        "故事常常不加说明地承载着其所属文化的**价值观**。一个故事可能表现**对长辈和祖先的尊敬**，老人受到服从，逝者受到敬奉；可能表现把**对家庭或集体的责任**放在个人愿望之上；可能推崇**对客人的款待**，陌生人必须得到饮食和保护；也可能看重**与自然的和谐**，人们只能取所需。看看人物因为什么受到赞扬或惩罚。",
      ],
      ["Which value does this detail of the story reflect?", "故事中的这个细节反映了哪种价值观？"],
      `
        Before every meal, the family sets a bowl of rice before the photographs of their grandparents.|respect for elders and ancestors
        Though she longs to study in the city, the eldest daughter stays to run the shop after her father falls ill.|duty to family or community
        A traveler knocks at night, and the poor farmer gives him the family's only bed.|hospitality to guests
        The hunter thanks the spirit of the deer and uses every part of it, wasting nothing.|harmony with nature
        The village waits in silence until the oldest woman has spoken before any decision is made.|respect for elders and ancestors
        The young man gives up his own plans to rebuild the village well with his neighbors.|duty to family or community
        Even an enemy who asks for shelter must be given food and protected for three days.|hospitality to guests
        The fishermen never fish in the spawning season, so that the river will feed their grandchildren.|harmony with nature
        On the festival day, the whole family visits the graves to sweep them and leave flowers.|respect for elders and ancestors
        The son sends half of every paycheck home to support his parents and younger brothers.|duty to family or community
        When the stranger arrives, the host washes his feet and serves him first at the table.|hospitality to guests
        Before cutting a tree, the woodcutter asks its permission and plants two more in its place.|harmony with nature
        The boy who speaks rudely to his grandfather is punished by the whole village.|respect for elders and ancestors
        Every family in the village sends one person to help bring in a neighbor's harvest.|duty to family or community
        A desert family shares its last water with a lost traveler, and the story praises them for it.|hospitality to guests
        The farmers leave a corner of each field uncut for the birds and the poor.|harmony with nature
        The grandmother's stories are listened to as if they were law.|respect for elders and ancestors
        The girl marries the man her family has chosen, putting their needs before her own.|duty to family or community
        In the story, the greatest shame is to turn away a guest hungry.|hospitality to guests
        The people of the mountain believe the river is alive and must never be fouled.|harmony with nature
        Each new year, the family tells the names of their ancestors back seven generations.|respect for elders and ancestors
        When the flood comes, the whole town works through the night to save one family's house.|duty to family or community
        The host insists that his guest take the best piece of meat, though his own children are hungry.|hospitality to guests
        The shepherds move their flocks each season so that no pasture is grazed bare.|harmony with nature
        The young chief does nothing without first asking the council of elders.|respect for elders and ancestors
        The brothers pool all their savings so that the youngest can go to university for the family.|duty to family or community
        The traveler is offered tea three times, and refusing it would insult the house.|hospitality to guests
        The villagers believe that if they take more fish than they need, the sea will stop giving.|harmony with nature
        The old man's walking stick is kept in the place of honor long after his death.|respect for elders and ancestors
        A neighbor who refuses to help build the school is shunned by the village.|duty to family or community
      `,
      {
        "respect for elders and ancestors": L(
          "尊敬长辈和祖先",
          "The old are obeyed and the dead are honored, which shows that the culture values its elders and ancestors.",
          "老人受到服从，逝者受到敬奉，这表明这种文化看重长辈和祖先。",
          "The detail is not about honoring the old or the dead.",
          "这个细节说的不是敬奉老人或逝者。",
        ),
        "duty to family or community": L(
          "对家庭或集体的责任",
          "A person puts the needs of the family or the community above his or her own wishes.",
          "一个人把家庭或集体的需要放在自己的愿望之上。",
          "The detail is not about putting the family or the community before oneself.",
          "这个细节说的不是把家庭或集体放在自己之前。",
        ),
        "hospitality to guests": L(
          "款待客人",
          "A guest or a stranger must be welcomed, fed and protected, even at a cost to the host.",
          "客人或陌生人必须受到欢迎、得到饮食和保护，即使主人要为此付出代价。",
          "The detail is not about how a guest or a stranger must be treated.",
          "这个细节说的不是该如何对待客人或陌生人。",
        ),
        "harmony with nature": L(
          "与自然和谐",
          "People take only what they need from nature and treat it with respect, so that it will last.",
          "人们只从自然中取所需，并尊重它，使它得以延续。",
          "The detail is not about how people treat the natural world.",
          "这个细节说的不是人们如何对待自然。",
        ),
      },
    ),
    label(
      "reading-across-cultures",
      ["Reading Across Cultures", "跨文化阅读"],
      [
        "When a story comes from a culture different from our own, a careful reader **understands the custom in its own setting**, asking what it means to the people who practice it. A careless reader **judges by his or her own culture alone**, calling a custom strange or wrong only because it is unfamiliar. A third mistake is to **treat one story as the whole culture**, assuming that every person from that place thinks and acts the same way.",
        "当一个故事来自与我们不同的文化时，细心的读者会**在其自身背景中理解习俗**，问问它对践行它的人意味着什么。粗心的读者则**只用自己的文化来评判**，仅仅因为陌生就说某个习俗奇怪或错误。第三种错误是**把一个故事当作整个文化**，以为来自那个地方的每个人都以同样的方式思考和行事。",
      ],
      ["Which kind of reading does this reader's response show?", "这位读者的回应体现了哪种阅读方式？"],
      `
        "The family bows to the photographs because, in their culture, the dead are still part of the family."|understands it in its own setting
        "Talking to dead people's photos is just weird."|judges by one's own culture alone
        "So everyone in that country must spend their evenings at the graves of their ancestors."|treats one story as the whole culture
        "The girl stays home because the story's world places duty to family above personal ambition."|understands it in its own setting
        "She's a coward for not following her dreams like a normal person would."|judges by one's own culture alone
        "All the women in that region must give up school to care for their parents."|treats one story as the whole culture
        "Refusing the tea would insult the host, so the traveler accepts it three times."|understands it in its own setting
        "Why would anyone drink three cups of tea they don't want? That's silly."|judges by one's own culture alone
        "Now I know that every family there drinks tea exactly three times with guests."|treats one story as the whole culture
        "The hunter thanks the deer because his people believe animals give themselves as gifts."|understands it in its own setting
        "Thanking an animal you've just killed makes no sense."|judges by one's own culture alone
        "All the people of that tribe must be hunters who pray to animals."|treats one story as the whole culture
        "The arranged marriage in the story reflects how the family's needs shape important choices in that world."|understands it in its own setting
        "Arranged marriages are just wrong, and the characters should have known better."|judges by one's own culture alone
        "This story proves that nobody from that country ever marries for love."|treats one story as the whole culture
        "The elders speak first because, in the village, age is a source of wisdom."|understands it in its own setting
        "Waiting for old people to talk first is a waste of everyone's time."|judges by one's own culture alone
        "In that culture, young people are never allowed to speak."|treats one story as the whole culture
        "The host gives the stranger his own bed because, in the desert, turning a traveler away could mean his death."|understands it in its own setting
        "Letting a stranger sleep in your house is foolish and dangerous."|judges by one's own culture alone
        "Everyone from the desert lets strangers sleep in their homes."|treats one story as the whole culture
        "The son sends money home because supporting parents is seen as a sacred duty in the story's world."|understands it in its own setting
        "He should keep his money for himself, like any sensible adult."|judges by one's own culture alone
        "Every young man from that country sends all his wages to his parents."|treats one story as the whole culture
        "The fishermen's rule about the spawning season shows how carefully the community protects its future."|understands it in its own setting
        "Not fishing when the fish are there is just bad business."|judges by one's own culture alone
        "The people of that coast must never break any rule about nature."|treats one story as the whole culture
        "The festival meal is eaten in silence because silence there is a sign of respect."|understands it in its own setting
        "Eating without talking sounds like the most boring dinner ever."|judges by one's own culture alone
        "So nobody in that country ever talks during a meal."|treats one story as the whole culture
      `,
      {
        "understands it in its own setting": L(
          "在其自身背景中理解",
          "The reader explains the custom by what it means to the people of the story's culture.",
          "这位读者从习俗对故事中那种文化的人意味着什么来解释它。",
          "The reader does not explain the custom by what it means to the people who practice it.",
          "这位读者并没有从习俗对践行者的意义来解释它。",
        ),
        "judges by one's own culture alone": L(
          "只用自己的文化评判",
          "The reader calls the custom strange or wrong only because it is unfamiliar, measuring it by his or her own culture.",
          "这位读者仅仅因为陌生就说这个习俗奇怪或错误，用自己的文化来衡量它。",
          "The reader is not calling the custom strange or wrong because it is unfamiliar.",
          "这位读者并没有因为陌生就说这个习俗奇怪或错误。",
        ),
        "treats one story as the whole culture": L(
          "把一个故事当作整个文化",
          "The reader assumes that every person from that culture acts as the characters of one story do.",
          "这位读者以为那种文化中的每个人都会像一个故事里的人物那样行事。",
          "The reader does not assume that one story shows how everyone in the culture acts.",
          "这位读者并没有以为一个故事就代表了那种文化中所有人的行为。",
        ),
      },
    ),
  ],
});

const mediums = topic("reading", {
  id: "a-subject-in-two-mediums",
  title: ["A Subject in Two Mediums", "两种媒介中的同一题材"],
  summary: [
    "How one subject is shown in two mediums, such as a poem and a painting or a story and a film, and what each medium can emphasize or leave out.",
    "同一个题材如何在两种媒介中表现，比如一首诗和一幅画、一个故事和一部电影，以及每种媒介能强调什么、会省略什么。",
  ],
  after: ["comparing-a-play-and-its-production", "comparing-a-poem-and-a-story"],
  points: [
    label(
      "what-the-medium-can-do",
      ["What the Medium Can Do", "媒介能做到什么"],
      [
        "Each medium has its own strengths. A **painting or photograph** shows a whole scene at once and can freeze a single moment in rich detail, but it cannot easily show time passing or thoughts. A **written text** can enter a character's mind and move freely through time. A **film** combines moving images, sound and music to show action as it happens. A **piece of music** works directly on feeling, without words or pictures.",
        "每种媒介都有自己的长处。**绘画或照片**能一下子呈现整个场景，以丰富的细节定格一个瞬间，但很难表现时间的流逝或人的想法。**文字作品**能进入人物的内心，在时间中自由穿行。**电影**把活动的画面、声音和音乐结合起来，展现正在发生的动作。**音乐作品**不用文字也不用图画，直接作用于情感。",
      ],
      ["Which medium is best suited to do this?", "哪种媒介最适合做到这一点？"],
      `
        Show every face in a crowded market at a single frozen moment, in rich color.|a painting or photograph
        Reveal what a soldier is secretly thinking as he marches to the front.|a written text
        Show a horse race from start to finish, with thundering hooves and a roaring crowd.|a film
        Stir a feeling of rising hope without any words or images.|a piece of music
        Capture the exact light on a field of wheat at one moment of sunset.|a painting or photograph
        Jump back forty years to a character's childhood and then return to the present in a sentence.|a written text
        Let the audience hear the storm and see the ship tossing on the waves as it happens.|a film
        Express the grief of a funeral through slow, low notes alone.|a piece of music
        Freeze the instant a dancer leaps, with every muscle visible.|a painting or photograph
        Explain in the narrator's own voice why she never forgave her brother.|a written text
        Show a chase through city streets, with screeching tires and swelling music.|a film
        Build a feeling of joy that rises and falls like a dance, with no story at all.|a piece of music
        Show a whole battlefield, from the generals on the hill to the wounded in the mud, in one view.|a painting or photograph
        Tell what a character remembers, fears and hopes, all in one paragraph.|a written text
        Let viewers watch an actor's face change as he hears terrible news.|a film
        Create a mood of calm through a gentle melody repeated again and again.|a piece of music
        Capture the expression of a refugee child in a single, unforgettable image.|a painting or photograph
        Describe the slow passing of thirty years in a few sentences.|a written text
        Combine the sound of footsteps, a creaking door and a sudden scream to frighten the audience.|a film
        Make listeners feel the excitement of a festival with fast drums and bright horns.|a piece of music
        Show the details of a still life, a bowl of fruit and a candle, so that each texture can be studied.|a painting or photograph
        Let the reader know that the smiling character is secretly planning revenge.|a written text
        Show a spaceship launch, with roaring engines, shaking ground and a countdown.|a film
        Express the loneliness of a winter night through a single slow violin.|a piece of music
        Preserve exactly what a city street looked like on one afternoon in 1910.|a painting or photograph
        Explore a character's argument with herself as she decides whether to leave home.|a written text
        Let the audience watch a flower bloom in seconds, through sped-up images and soft music.|a film
        Raise a feeling of triumph with a full orchestra and no words.|a piece of music
        Show a mountain landscape in a way the viewer can take in all at once.|a painting or photograph
        Tell the story of a family across three generations, moving freely between them.|a written text
      `,
      {
        "a painting or photograph": L(
          "绘画或照片",
          "A still image shows a whole scene at once and freezes a single moment in rich detail.",
          "静止的图像一下子呈现整个场景，以丰富的细节定格一个瞬间。",
          "The task needs more than one frozen image: time passing, thoughts, sound or movement.",
          "这项任务需要的不只是一幅定格的图像：时间流逝、内心想法、声音或运动。",
        ),
        "a written text": L(
          "文字作品",
          "Words can enter a character's mind and move freely through time.",
          "文字能进入人物内心，在时间中自由穿行。",
          "The task depends on images, sound or music more than on entering a mind or moving through time.",
          "这项任务更依赖图像、声音或音乐，而不是进入内心或穿行时间。",
        ),
        "a film": L(
          "电影",
          "Moving images, sound and music together show action as it happens.",
          "活动的画面、声音和音乐结合起来，展现正在发生的动作。",
          "The task does not need moving images combined with sound.",
          "这项任务并不需要把活动画面和声音结合起来。",
        ),
        "a piece of music": L(
          "音乐作品",
          "Music works directly on feeling, without words or pictures.",
          "音乐不用文字也不用图画，直接作用于情感。",
          "The task needs words or pictures, not feeling alone.",
          "这项任务需要文字或图画，而不仅仅是情感。",
        ),
      },
    ),
    label(
      "what-the-second-version-changes",
      ["What the Second Version Changes", "第二个版本改变了什么"],
      [
        "When a subject moves from one medium to another, the new version makes choices. It may **emphasize** a part, giving it more weight than the original did. It may **leave out** something the original included. Or it may **add** something that was never there: a new scene, a new character or a sound. Ask what the change does: what it makes the audience notice, feel or miss.",
        "当一个题材从一种媒介转到另一种媒介时，新版本会做出选择。它可能**强调**某一部分，比原作更加突出它；可能**省略**原作中有的东西；也可能**增加**原作中从没有的东西：新的场景、新的人物或声音。问问这种改变起什么作用：它让观众注意到、感受到或错过了什么。",
      ],
      ["How does the second version change the first?", "第二个版本如何改变了第一个版本？"],
      `
        The poem mentions the storm in one line; the painting fills its whole canvas with black clouds and lightning.|emphasizes a part
        The novel spends three chapters on the hero's childhood; the film begins when he is already a grown man.|leaves something out
        The story has no music, but the film adds a lullaby that the mother sings in every scene.|adds something new
        The myth tells of the flood briefly; the painting shows the drowning city in terrible detail.|emphasizes a part
        The play has a character who comments on the action, but the film cuts her entirely.|leaves something out
        The film invents a talking dog to keep the lonely heroine company.|adds something new
        The poem describes the soldier's face in passing; the photograph is a close-up of only his eyes.|emphasizes a part
        In the book, the hero's thoughts fill whole pages; the film shows only what he does.|leaves something out
        The painting of the story places a small child in the corner, watching, who is not in the original.|adds something new
        The story gives the battle a single paragraph; the film makes it a twenty-minute sequence.|emphasizes a part
        The opera keeps the love story of the novel but drops its long scenes of politics.|leaves something out
        The film adds a scene in which the villain shows kindness to his daughter, which the novel never includes.|adds something new
        The diary mentions the bombing once; the documentary returns to its ruins again and again.|emphasizes a part
        The film version of the poem leaves out the final stanza, which asked a question.|leaves something out
        The illustrated edition adds a map of the hero's journey.|adds something new
        The legend mentions the queen's sorrow briefly; the song is entirely about her grief.|emphasizes a part
        The graphic novel cuts the narrator's long descriptions of the landscape.|leaves something out
        The stage version adds a chorus that sings between the scenes.|adds something new
        The article mentions the old woman's hands; the painting makes them the center of the picture.|emphasizes a part
        The film drops the novel's subplot about the hero's brother.|leaves something out
        The musical gives the shy servant a song of her own, which she never has in the play.|adds something new
        The short story mentions the rain once; the film keeps it falling through every scene.|emphasizes a part
        The children's version of the epic leaves out its darkest battles.|leaves something out
        The painter adds a rainbow over the ruined city that the poem does not mention.|adds something new
        The memoir mentions the author's first teacher in one sentence; the film builds a whole story around her.|emphasizes a part
        The radio play cannot show the characters' faces, so the costumes described in the novel disappear.|leaves something out
        The film adds a narrator's voice that reads letters the characters write.|adds something new
        The poem mentions the empty chair once; the photograph shows only the chair.|emphasizes a part
        The film of the novel leaves out the ending in which the hero grows old.|leaves something out
        The dance version adds a duet in which two rivals move as if they were one.|adds something new
      `,
      {
        "emphasizes a part": L(
          "强调某一部分",
          "Something brief in the first version becomes large and central in the second.",
          "第一个版本中一笔带过的东西在第二个版本中变得重要而突出。",
          "The second version does not make a brief part of the first large and central.",
          "第二个版本并没有把第一个版本中简短的部分变得重要而突出。",
        ),
        "leaves something out": L(
          "省略某些内容",
          "Something in the first version is missing from the second.",
          "第一个版本中有的东西在第二个版本中没有了。",
          "Nothing from the first version has been left out here.",
          "这里并没有省略第一个版本中的内容。",
        ),
        "adds something new": L(
          "增加新内容",
          "The second version includes something that was never in the first: a scene, a character, a sound or an image.",
          "第二个版本包含了第一个版本中从没有的东西：一个场景、一个人物、一种声音或一个图像。",
          "The second version does not add anything that was not in the first.",
          "第二个版本并没有增加第一个版本中没有的东西。",
        ),
      },
    ),
  ],
});

/** readingTopics9b are the reading topics of the later units of grade 9. */
export const readingTopics9b: readonly TopicDef[] = [foils, speculative, unfold, health, culture, mediums];
