// Grade 7: writing skills checked by rule, part one: keeping a summary objective, details of a period, organizing by
// category, reporting numbers from a graph and cutting redundant words.

import type { TopicDef } from "@ga/content";
import { drawn, risingSales } from "../../figures.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const objective = topic("writing", {
  id: "keeping-a-summary-objective",
  title: ["Keeping a Summary Objective", "保持概要的客观性"],
  summary: [
    "An objective summary reports what the author says without judging the author or adding the summary writer's own views.",
    "客观的概要只报告作者说了什么，不评判作者，也不加入概要作者自己的观点。",
  ],
  intro: [
    "*The author explains how wetlands filter storm water* is an objective summary; slipping in *brilliantly* or *I think* turns it into a review. Keeping a summary **objective** means reporting only what the text says.",
    "*The author explains how wetlands filter storm water* 是客观概要；一旦夹入 *brilliantly* 或 *I think*，就变成了读后感。保持概要**客观**，就是只如实报告文本说了什么。",
  ],
  after: ["supporting-details", "fact-and-opinion"],
  points: [
    label(
      "objective-or-not",
      ["Objective or Not", "客观与否"],
      [
        "An **objective** summary sentence reports the author's point with neutral verbs (*argues*, *explains*, *describes*): *The article explains how bees navigate*. A sentence that **judges the author** inserts praise or blame (*brilliantly*, *foolishly*, *whines*, *silly*). A sentence that **gives the writer's own view** adds *I think*, *we should*, or a personal reaction.\n\n> **Watch out.** Praise breaks objectivity just as much as criticism—*makes the excellent point* still **judges the author** and does not belong in an objective summary.",
        "**客观**的概要句用中性动词（*argues*、*explains*、*describes*）报告作者观点：*The article explains how bees navigate*。**评判作者**的句子会塞进夸奖或贬低（*brilliantly*、*foolishly*、*whines*、*silly*）。**加入自己观点**的句子会写出 *I think*、*we should* 或个人感想。\n\n> **注意。** 夸奖和批评一样破坏客观性——*makes the excellent point* 同样属于**评判作者**，不能放进客观概要。",
      ],
      ["What does this sentence from a summary do?", "概要中的这个句子起什么作用？"],
      `
        The author argues that schools should start later in the morning.|objective
        The author foolishly argues that schools should start later in the morning.|judges the author
        I think schools should start later, just as the author says.|gives the writer's own view
        The article explains how bees find their way back to the hive.|objective
        The article brilliantly explains how bees find their way back to the hive.|judges the author
        Everyone should protect bees after reading this.|gives the writer's own view
        The writer describes her first year living in a new country.|objective
        The writer whines about her first year living in a new country.|judges the author
        I would have been much braver than the writer in a new country.|gives the writer's own view
        According to the author, video games can improve problem solving.|objective
        The author wrongly claims that video games can improve problem solving.|judges the author
        In my opinion, video games are a waste of time.|gives the writer's own view
        The report states that the river is cleaner than it was ten years ago.|objective
        The report's silly claim is that the river is cleaner than ten years ago.|judges the author
        We all need to keep the river clean from now on.|gives the writer's own view
        The historian explains why the city walls were built.|objective
        The historian, who clearly knows little, explains why the walls were built.|judges the author
        I find city walls much more interesting than castles.|gives the writer's own view
        The essay claims that homework should be limited to one hour a night.|objective
        The essay makes the excellent point that homework should be limited.|judges the author
        Personally, I would get rid of homework altogether.|gives the writer's own view
        The scientist reports that the new battery lasts twice as long.|objective
        The scientist exaggerates when she reports that the battery lasts longer.|judges the author
        I hope my phone gets one of these new batteries soon.|gives the writer's own view
        The article describes three ways to save water at home.|objective
        The article gives three very obvious ways to save water at home.|judges the author
        My family already does all three of these things.|gives the writer's own view
        The author suggests that cities plant more trees along their streets.|objective
        The author naively suggests that cities plant more trees.|judges the author
        Our town should plant a hundred trees next spring.|gives the writer's own view
      `,
      {
        objective: L(
          "客观",
          "The sentence reports the author's point with a neutral verb and zero personal judgment; it is **objective**.\n\n**Check.** Scan every adjective and adverb: none praise or mock the author, and no *I* or *we should* sneaks in the summary writer's own opinion.",
          "这个句子用中性动词如实报告作者观点，没有任何个人评判，因此是**客观**的。\n\n**检验。** 扫一遍句中的形容词和副词：既没有夸奖或贬低作者，也没有出现 *I* 或 *we should* 等概要作者自己的想法。",
          "This sentence does more than report what the author says.",
          "这个句子不只是报告作者说了什么。",
        ),
        "judges the author": L(
          "评判作者",
          "An evaluative word (*foolishly*, *brilliantly*, *wrongly*, *silly*, *whines*, *excellent*) grades the author's writing or ideas; it **judges the author**.\n\n**Check.** Ask whether you can tell if the summary writer approves or disapproves of the author: yes—that judging word gives away their verdict.",
          "句中的评价词（*foolishly*、*brilliantly*、*wrongly*、*silly*、*whines*、*excellent*）给作者或其观点打了分，属于**评判作者**。\n\n**检验。** 问问自己能不能看出概要作者是在夸还是在贬原作者：能——正是那个评价词暴露了态度。",
          "Nothing in this sentence praises or criticizes the author.",
          "这个句子中没有赞扬或批评作者的词。",
        ),
        "gives the writer's own view": L(
          "加入自己的观点",
          "The sentence steps away from the text to share what the summary writer thinks, wishes, or urges others to do; it **gives the writer's own view**.\n\n**Check.** Spot the first-person or call-to-action cue (*I*, *my*, *we should*, *everyone should*): that belongs in a response essay, not a summary.",
          "这个句子跳出原文，说出概要作者自己的看法、愿望或呼吁，属于**加入自己的观点**。\n\n**检验。** 找到第一人称或呼吁信号（*I*、*my*、*we should*、*everyone should*）：这些属于读后回应，而不属于概要。",
          "This sentence does not add the summary writer's own thoughts.",
          "这个句子没有加入概要作者自己的想法。",
        ),
      },
    ),
    choose(
      "rewriting-it-objectively",
      ["Rewriting It Objectively", "改写成客观的句子"],
      [
        "To revise a biased summary sentence into an objective one, strip out the judging word while keeping the author's exact claim intact: *The author ridiculously claims that zoos help animals* → *The author claims that zoos help animals.*\n\n> **Watch out.** Check two things after cutting the bias: do not swap in an opposite judgment (*wisely*), and do not flip what the author actually argued (*help* → *hurt*).",
        "把带偏见的概要句改客观时，删去评价词，同时原封不动保留作者的真实观点：*The author ridiculously claims that zoos help animals* → *The author claims that zoos help animals.*\n\n> **注意。** 去掉偏见词后核对两点：别换成另一种评价词（*wisely*），也别把作者原意改反（*help* → *hurt*）。",
      ],
      ["Which is the objective version of this summary sentence?", "哪个是这句概要的客观版本？"],
      `
        The author ridiculously claims that zoos help animals.|The author claims that zoos help animals.|The author wisely claims that zoos help animals.|The author claims that zoos hurt animals.
        Sadly, the article says the old theater will close.|The article says the old theater will close.|Happily, the article says the old theater will close.|The article says the old theater will open.
        The writer bravely admits she was afraid of the dark.|The writer admits she was afraid of the dark.|The writer foolishly admits she was afraid of the dark.|The writer says she was never afraid of the dark.
        The author's amazing plan is to build a bike path.|The author's plan is to build a bike path.|The author's terrible plan is to build a bike path.|The author's plan is to close the bike path.
        The scientist rudely dismisses the old theory.|The scientist rejects the old theory.|The scientist kindly dismisses the old theory.|The scientist accepts the old theory.
        The essay unfairly blames parents for the problem.|The essay blames parents for the problem.|The essay rightly blames parents for the problem.|The essay blames teachers for the problem.
        The author shockingly reveals that the river is polluted.|The author reports that the river is polluted.|The author boringly reveals that the river is polluted.|The author reports that the river is clean.
        Obviously, the article argues that phones distract students.|The article argues that phones distract students.|Ridiculously, the article argues that phones distract students.|The article argues that phones help students focus.
        The historian wastes pages describing the king's clothes.|The historian describes the king's clothes.|The historian brilliantly describes the king's clothes.|The historian describes the queen's clothes.
        The writer's touching story is about her grandfather's farm.|The writer's story is about her grandfather's farm.|The writer's dull story is about her grandfather's farm.|The writer's story is about her grandmother's shop.
        The coach makes the weak argument that practice should be longer.|The coach argues that practice should be longer.|The coach makes the strong argument that practice should be longer.|The coach argues that practice should be shorter.
        The author cleverly explains how volcanoes form.|The author explains how volcanoes form.|The author clumsily explains how volcanoes form.|The author explains how earthquakes form.
        The article annoyingly repeats that sugar is harmful.|The article states that sugar is harmful.|The article helpfully repeats that sugar is harmful.|The article states that sugar is healthy.
        The mayor's foolish speech calls for a new stadium.|The mayor's speech calls for a new stadium.|The mayor's inspiring speech calls for a new stadium.|The mayor's speech calls for a new library.
        The author boldly predicts that cars will fly by 2050.|The author predicts that cars will fly by 2050.|The author absurdly predicts that cars will fly by 2050.|The author predicts that cars will never fly.
        The writer complains endlessly about the school lunches.|The writer criticizes the school lunches.|The writer praises endlessly the school lunches.|The writer praises the school lunches.
        The biologist's fascinating article describes deep-sea fish.|The biologist's article describes deep-sea fish.|The biologist's tedious article describes deep-sea fish.|The biologist's article describes river fish.
        The author unwisely recommends a four-day school week.|The author recommends a four-day school week.|The author wisely recommends a four-day school week.|The author recommends a six-day school week.
        The report correctly shows that crime has fallen.|The report shows that crime has fallen.|The report falsely shows that crime has fallen.|The report shows that crime has risen.
        The diary's heartbreaking entries describe the long winter.|The diary's entries describe the long winter.|The diary's boring entries describe the long winter.|The diary's entries describe the short summer.
        The author stubbornly insists that the castle was never attacked.|The author states that the castle was never attacked.|The author rightly insists that the castle was never attacked.|The author states that the castle was attacked often.
        Thankfully, the article says the bridge will be repaired.|The article says the bridge will be repaired.|Unfortunately, the article says the bridge will be repaired.|The article says the bridge will be torn down.
        The inventor's brilliant idea is a solar oven.|The inventor's idea is a solar oven.|The inventor's useless idea is a solar oven.|The inventor's idea is a gas oven.
        The editorial angrily attacks the new parking rule.|The editorial opposes the new parking rule.|The editorial calmly praises the new parking rule.|The editorial supports the new parking rule.
        The author's weird theory is that birds came from dinosaurs.|The author's theory is that birds came from dinosaurs.|The author's wonderful theory is that birds came from dinosaurs.|The author's theory is that dinosaurs came from birds.
        The article lazily lists five ways to sleep better.|The article lists five ways to sleep better.|The article carefully lists five ways to sleep better.|The article lists five ways to wake up earlier.
        The writer proudly describes winning the science fair.|The writer describes winning the science fair.|The writer arrogantly describes winning the science fair.|The writer describes losing the science fair.
        The author pointlessly compares cats and dogs.|The author compares cats and dogs.|The author helpfully compares cats and dogs.|The author compares cats and rabbits.
        The speech wonderfully urges people to vote.|The speech urges people to vote.|The speech annoyingly urges people to vote.|The speech urges people not to vote.
        The researcher's alarming study finds that bees are disappearing.|The researcher's study finds that bees are disappearing.|The researcher's reassuring study finds that bees are disappearing.|The researcher's study finds that bees are increasing.
      `,
      (right) => [
        `The objective revision is: **${right}** The judging word is removed while the author's exact message stays faithful.\n\n**Check.** Confirm two things in this line: no praise or criticism remains, and the author's original claim has not been altered or flipped.`,
        `客观版本是：**${right}** 去掉了评价词，同时忠实保留了作者原意。\n\n**检验。** 核对这句话的两点：既没有任何褒贬词残留，也没有篡改或颠倒原作者的观点。`,
      ],
      [
        [
          "*{wrong}* swaps one judgment for another; the sentence is still not objective.",
          "*{wrong}* 只是用一种评判代替了另一种评判，句子仍然不客观。",
        ],
        [
          "*{wrong}* has no judging word, but it changes what the author actually said.",
          "*{wrong}* 没有表示评判的词，但改变了作者的原意。",
        ],
      ],
    ),
  ],
});

const period = topic("writing", {
  id: "using-period-details",
  title: ["Using Details of a Period", "运用时代细节"],
  summary: [
    "Historical fiction comes alive through details that belong to its time and place, and it breaks when an object or habit from another time slips in.",
    "历史小说靠属于那个时代和地方的细节而生动；一旦混入另一个时代的物品或习惯，故事就会露出破绽。",
  ],
  intro: [
    "Hand a knight in 1350 a wax-sealed scroll and readers step right into the castle; hand him a smartphone and the whole illusion shatters. Choosing authentic **period details**—and catching anachronisms—keeps historical fiction believable.",
    "给 1350 年的骑士一卷火漆封口的羊皮纸，读者瞬间置身古堡；如果给他一部智能手机，整场穿越感就会当场破功。选对**时代细节**并揪出时代错误，才能让历史小说令人信服。",
  ],
  after: ["historical-fiction-facts-and-inventions"],
  points: [
    choose(
      "a-detail-that-fits",
      ["A Detail That Fits", "符合时代的细节"],
      [
        "Historical fiction earns trust through accurate everyday details—tools, lighting, transport, writing supplies, and food. Ask *Did this exist in that century and place?* A Roman baker in 100 CE *lit a wood fire in his brick oven*; he never switched on an electric oven.\n\n> **Watch out.** Check the exact year in the prompt—radios existed in 1920, for example, whereas streaming shows and tablets did not.",
        "历史小说靠真实的日常细节赢得信任——工具、照明、交通、书写材料和饮食。动笔前问一句：*那个世纪、那个地方有这种东西吗？*公元 100 年的古罗马面包师会*在砖炉里生木柴火*，绝不会按电烤箱开关。\n\n> **注意。** 盯紧题干给出的具体年代——比如 1920 年已经有收音机，但绝没有流媒体和平板电脑。",
      ],
      ["Which detail fits a story set in this time and place?", "哪个细节符合这个故事的时代和地点？"],
      `
        A Roman town in 100 CE: the baker...|lit a wood fire in his brick oven|switched on his electric oven|set the timer on his microwave
        A medieval castle in 1200: the guard...|lit a torch at the gate|flicked on the gate's floodlights|checked the security camera
        A sailing ship in 1750: the captain...|studied his paper charts by candlelight|checked the ship's position on a GPS screen|radioed the port for directions
        A frontier town in 1870: the doctor...|rode out on horseback to see the sick child|drove her car to see the sick child|sent a text to the sick child's parents
        A Chinese city in 1100: the merchant...|recorded his sales with a brush and ink|typed his sales into a spreadsheet|printed his receipts on a laser printer
        Ancient Egypt in 1300 BCE: the scribe...|wrote on a sheet of papyrus|wrote in a spiral notebook|wrote with a ballpoint pen
        A London street in 1850: the boy...|sold newspapers by shouting the headlines|sold newspapers from a vending machine|read the headlines on his tablet
        A Viking village in 900: the family...|gathered around the central hearth|gathered around the television|turned up the central heating
        A farm in 1800: the girl...|churned the cream into butter by hand|bought butter at the supermarket|mixed the cream in an electric blender
        A Greek city in 450 BCE: the messenger...|ran from the battlefield with the news|telephoned the city with the news|emailed the city with the news
        A mining town in 1849: the miner...|panned for gold in the cold stream|used a metal detector to find gold|watched a video on how to find gold
        A city in 1920: the family...|listened to the radio after dinner|watched a streaming show after dinner|played a video game after dinner
        A Mayan city in 800: the farmer...|planted maize with a digging stick|planted maize with a tractor|watered the maize with sprinklers
        A school in 1890: the pupils...|wrote their sums on slates with chalk|did their sums on calculators|printed their sums from a computer
        A Japanese village in 1600: the traveler...|walked the road in straw sandals|walked the road in rubber sneakers|took the bullet train to the village
        A wagon train in 1846: the pioneers...|cooked beans over an open fire|heated beans in a microwave|ordered pizza for dinner
        A Roman army camp in 50 BCE: the soldier...|sharpened his iron sword|loaded his rifle|charged his flashlight
        A medieval monastery in 1150: the monk...|copied a book by hand|photocopied a book|scanned a book into a computer
        A New York street in 1900: the woman...|rode a horse-drawn streetcar|rode an electric scooter|called a taxi on her phone
        A Persian palace in 500 BCE: the king's servant...|fanned the king with palm leaves|switched on the air conditioning|adjusted the ceiling fan's speed
        A colonial town in 1770: the printer...|set each letter of type by hand|sent the pages to a digital printer|designed the pages on a laptop
        An Inca road in 1450: the runner...|carried a knotted cord of numbers|carried a smartphone with the numbers|carried a printed list of numbers
        A Paris café in 1890: the artist...|sketched the dancers in charcoal|photographed the dancers on his phone|drew the dancers on a tablet
        A cotton mill in 1830: the girl...|worked at a loom powered by a water wheel|worked at a computer-controlled loom|took a break to check her email
        A Scottish island in 1700: the fisherman...|mended his nets by the fire|bought new nylon nets online|used sonar to find the fish
        A city in Mali in 1330: the traveler...|crossed the desert with a camel caravan|crossed the desert in a jeep|flew over the desert in a plane
        A village in 1500: the family...|drew water from the well|turned on the kitchen tap|filled bottles from the water cooler
        A railroad camp in 1865: the workers...|laid the iron rails by hand|laid the rails with a robot|checked the plan on a computer
        A Korean palace in 1450: the scholar...|wrote with a brush on rice paper|wrote with a marker on a whiteboard|typed on a keyboard
        A ship crossing the Atlantic in 1620: the passengers...|ate hard biscuits and salted meat|ate frozen dinners from the freezer|bought snacks from a vending machine
      `,
      (right, shown) => [
        `**${right}** fits ${shown.split(":")[0]} because it uses tools and habits that actually existed then.\n\n**Check.** Compare the technology in **${right}** against the other two options: the wrong choices rely on modern inventions that arrived centuries later.`,
        `**${right}** 符合 ${shown.split(":")[0]} 的背景，因为它用的是当时真实存在的工具和生活方式。\n\n**检验。** 把 **${right}** 里的物件和另两项对比：另两项都依赖晚得多的现代发明。`,
      ],
      [
        [
          "*{wrong}* uses something from a much later time, so it breaks the period.",
          "*{wrong}* 用了一个晚得多的时代才有的东西，破坏了时代感。",
        ],
        ["*{wrong}* uses modern technology that did not exist then.", "*{wrong}* 用了当时还不存在的现代技术。"],
      ],
    ),
    choose(
      "spotting-the-detail-that-breaks-the-period",
      ["Spotting the Detail That Breaks the Period", "找出破坏时代感的细节"],
      [
        "An object or habit dropped into the wrong century is an **anachronism**: a wristwatch in ancient Rome, a zipper on a medieval cloak, or a phone booth in 1860. Revise historical fiction by scanning every noun—clothing, containers, lights, and messages—against the year in the setting.\n\n> **Watch out.** Everyday small objects (*plastic containers*, *zippers*, *fountain pens*, *steel helmets* in ancient Maya) are easy to overlook—test every material and fastening against the era.",
        "放错世纪的物品或习惯叫作**时代错误**（anachronism）：古罗马的手表、中世纪斗篷上的拉链、1860 年的电话亭。修改历史小说时，逐一拿句中的衣着、容器、照明和通讯工具去对照背景年代。\n\n> **注意。** 日常小物件（如*塑料盒*、*拉链*、*钢笔*，或玛雅古城的*钢盔*）最容易漏网——每样材质和装置都要对照时代查一遍。",
      ],
      ["Which sentence does not belong in a story set in this period?", "哪个句子不属于这个时代背景的故事？"],
      `
        Ancient Rome, 100 CE|Marcus checked his wristwatch and hurried to the forum.|Marcus wrapped his toga tightly and hurried to the forum.|Marcus stepped around a cart of olives on the way to the forum.
        A medieval village, 1250|The miller zipped up his jacket against the cold.|The miller pulled his wool cloak around him against the cold.|The miller stamped the frost off his leather boots.
        Colonial Boston, 1770|Sarah snapped a photo of the ships in the harbor.|Sarah watched the ships unload tea in the harbor.|Sarah carried a basket of bread past the harbor.
        Ancient Egypt, 1300 BCE|The workers ate their lunch from plastic containers.|The workers ate bread and onions in the shade of the stones.|The workers dragged the great stone on wooden rollers.
        A wagon train, 1846|At night the children played cards by the light of a flashlight.|At night the children played games by the light of the campfire.|At night the oxen were tied to the wagon wheels.
        Victorian London, 1860|The detective called the police from a phone booth.|The detective blew his whistle to call the police.|The detective's carriage rattled over the cobblestones.
        A Viking ship, 900|The sailors checked the weather forecast before leaving.|The sailors watched the sky and the seabirds before leaving.|The sailors loaded barrels of water before leaving.
        A castle, 1350|The knight read the king's message on his phone.|The knight broke the wax seal on the king's message.|The knight handed the king's message to his squire.
        Ancient Greece, 450 BCE|The athlete tied the laces of his running shoes.|The athlete ran barefoot across the sand of the stadium.|The athlete rubbed olive oil on his arms before the race.
        A frontier farm, 1880|Ma heated the soup on the gas stove.|Ma stirred the soup in the iron pot over the fire.|Ma hung the washing on a line between the trees.
        A pirate ship, 1720|The captain looked at the map on his tablet.|The captain unrolled the old map on the table.|The captain raised his spyglass to the horizon.
        A Tang dynasty city, 750|The poet wrote his poem with a fountain pen.|The poet wrote his poem with a brush on silk.|The poet read his poem aloud in the garden.
        A gold rush camp, 1849|The miners kept their gold in a bank account they checked online.|The miners kept their gold dust in a leather pouch.|The miners slept in canvas tents beside the river.
        Ancient Mesopotamia, 2000 BCE|The scribe wrote the record in a notebook with a pencil.|The scribe pressed the record into a wet clay tablet.|The scribe carried the tablet to the temple.
        A medieval market, 1300|The merchant paid with a credit card.|The merchant paid with silver coins from his purse.|The merchant weighed the spices on a brass scale.
        The Civil War, 1863|The soldier listened to music on his headphones.|The soldier wrote a letter home by candlelight.|The soldier cleaned his musket before the march.
        A Roman villa, 50 CE|The servant switched on the lamps in the dining room.|The servant filled the oil lamps in the dining room.|The servant set bowls of figs on the table.
        A colonial farm, 1750|The farmer drove his pickup truck to the mill.|The farmer drove his ox cart to the mill.|The farmer carried a sack of grain to the mill.
        A 1920s jazz club|The band streamed their song to fans around the world.|The band played their song as couples danced.|The band's trumpet player bowed to the crowd.
        A Mayan city, 700|The king's guards wore steel helmets.|The king's guards wore cotton armor and feathered headdresses.|The king's guards stood at the foot of the pyramid.
        A Victorian school, 1880|The teacher showed a video on the classroom screen.|The teacher wrote the lesson on the blackboard.|The teacher rang a brass bell for the end of class.
        A medieval monastery, 1100|The monks warmed their soup in a microwave.|The monks ate their soup in silence in the hall.|The monks rang the bell for evening prayers.
        Ancient China, 200 BCE|The general sent orders to his troops by radio.|The general sent orders to his troops with flags and drums.|The general rode his horse along the wall.
        A sailing ship, 1800|The crew used a plastic bucket to bail out water.|The crew used wooden buckets to bail out water.|The crew pulled hard on the ropes in the storm.
        A Japanese castle, 1600|The samurai checked the time on the clock tower's digital display.|The samurai watched the shadows to tell the time.|The samurai polished his sword in the courtyard.
        An English village, 1700|The baker printed a sign on the computer for his shop.|The baker painted a sign for his shop.|The baker pulled loaves from the oven with a wooden paddle.
        The pyramids, 2500 BCE|The workers wore sunglasses against the glare.|The workers wore linen cloths against the sun.|The workers sang as they pulled the stone.
        A cowboy camp, 1875|The cowboys warmed their hands over a portable heater.|The cowboys warmed their hands over the fire.|The cowboys drank coffee from tin cups.
        Paris, 1789|The crowd shared the news on social media.|The crowd shouted the news through the streets.|The crowd read the news on posters pasted to the walls.
        The Silk Road, 1000|The caravan leader checked the route on a satellite map.|The caravan leader checked the route by the stars.|The caravan leader traded silk for horses at the oasis.
      `,
      (right, shown) => [
        `The anachronism is: **${right}** That detail did not exist in ${shown}.\n\n**Check.** Spot the out-of-place object or technology in that sentence and compare it with the other two sentences, both of which use genuine items from ${shown}.`,
        `破坏时代感的是：**${right}** 那个物件或做法在 ${shown} 还不存在。\n\n**检验。** 找出这句中穿越时代的物品或技术，再对照另外两句：另两句用的都是 ${shown} 真实存在的事物。`,
      ],
      [
        ["*{wrong}* fits the period: people then really had and did this.", "*{wrong}* 符合时代：当时的人确实有这样的东西、做这样的事。"],
        ["*{wrong}* is a detail that belongs to that time and place.", "*{wrong}* 是属于那个时代和地方的细节。"],
      ],
    ),
  ],
});

const category = topic("writing", {
  id: "organizing-by-category",
  title: ["Organizing by Category", "按类别组织内容"],
  summary: [
    "A report organized by category groups its facts under headings such as land, history, work and daily life, and every fact in a section belongs to its heading.",
    "按类别组织的报告把事实归到地理、历史、经济、文化等标题之下，每一部分里的每个事实都属于该标题。",
  ],
  intro: [
    "Mixing a country's rainfall, independence year, coffee exports, and wedding dances into one jumbled paragraph makes a report hard to follow. **Organizing by category** sorts each fact into its proper section—and weeds out stray facts that belong elsewhere.",
    "把一个国家的降雨量、独立年份、咖啡出口和婚礼舞蹈全混进一段里，报告就会乱成一团。**按类别组织内容**能把每条事实归入对应板块，并筛出放错位置的句子。",
  ],
  after: ["removing-off-topic-sentences", "text-features"],
  points: [
    label(
      "which-section",
      ["Which Section", "属于哪一部分"],
      [
        "Country reports sort notes into four standard sections: **geography** (mountains, rivers, climate), **history** (past events, dates, ancient ruins), **economy** (jobs, farming, money, trade), and **culture** (food, festivals, language, arts, beliefs). For example, *Most families earn their living by growing coffee* belongs in **economy**.\n\n> **Watch out.** Look at the *angle* of the fact: *Growing coffee for income* is **economy**, whereas *A stew eaten at festivals* is **culture**.",
        "介绍国家的报告常把笔记分成四个标准板块：**地理**（山河、气候）、**历史**（往事、年代、古迹）、**经济**（工作、农业、货币、贸易）和**文化**（饮食、节日、语言、艺术、信仰）。例如 *Most families earn their living by growing coffee* 属于**经济**。\n\n> **注意。** 看事实的*切入角度*：*种咖啡谋生*属于**经济**，而*节日吃的传统炖菜*属于**文化**。",
      ],
      ["In a report on a country, which section should this fact go in?", "在一篇关于某个国家的报告中，这个事实应该放在哪一部分？"],
      `
        The highest mountain rises nearly 4,000 meters above the sea.|geography
        The country won its independence in 1821.|history
        Most families earn their living by growing coffee.|economy
        Every spring, villages hold a festival of flowers and music.|culture
        Two long rivers flow from the mountains to the coast.|geography
        An ancient kingdom once ruled the northern valleys.|history
        The country sells most of its copper to other nations.|economy
        The national dish is a stew of beans, corn and peppers.|culture
        The south is covered in thick rain forest.|geography
        The first railroad was built in 1870.|history
        Tourism brings in more money than any other business.|economy
        Most people speak two languages at home.|culture
        Winters in the highlands are cold and dry.|geography
        The old capital was destroyed by an earthquake in 1773.|history
        Fishing boats leave the ports before dawn to bring in the day's catch.|economy
        Weavers make blankets with patterns that tell family stories.|culture
        A desert stretches across the western border.|geography
        Spanish ships first reached the coast in 1502.|history
        Many young people move to the cities to work in factories.|economy
        A traditional dance is performed at every wedding.|culture
        The country has three active volcanoes.|geography
        A long war with its neighbor ended in 1902.|history
        Farmers trade their bananas at a large market every Saturday.|economy
        Children learn songs in an ancient language at school.|culture
        A lake in the north is the largest in the region.|geography
        The first women voted in national elections in 1946.|history
        The country's money is called the colón.|economy
        On the Day of the Dead, families visit graves with candles and food.|culture
        Heavy rains fall from May to November.|geography
        The ruins of a temple built a thousand years ago still stand.|history
      `,
      {
        geography: L(
          "地理",
          "The fact describes landforms, water, or climate, so it belongs under **geography**.\n\n**Check.** Ask whether you could find this detail on a physical or weather map of the country: yes—that confirms geography.",
          "这个事实描述地形、水域或气候，因此归入**地理**。\n\n**检验。** 问问自己能不能在地形图或气候图上查到这条信息：可以，这正是地理板块的内容。",
          "This fact is not about the land, water or weather.",
          "这个事实与土地、水域或天气无关。",
        ),
        history: L(
          "历史",
          "The fact reports a dated past event, earlier ruler, or ancient ruin, so it belongs under **history**.\n\n**Check.** Notice the past-tense milestone or historical timeframe—it tells what happened long ago rather than today's land, work, or customs.",
          "这个事实讲述有年代的往事、古王朝或遗迹，因此归入**历史**。\n\n**检验。** 看句中的过去时间标记或历史事件——它说的是过去发生的事，而不是今天的地形、生计或习俗。",
          "This fact is not about an event in the past.",
          "这个事实与过去的事件无关。",
        ),
        economy: L(
          "经济",
          "The fact concerns how people earn a living, trade goods, farm for sale, or use currency, so it belongs under **economy**.\n\n**Check.** Ask whether the sentence centers on work, goods, income, or money: yes—that puts it squarely in economy.",
          "这个事实涉及谋生方式、商品贸易、农业产出或货币，因此归入**经济**。\n\n**检验。** 问问句子核心是不是工作、商品、收入或金钱：是的，这正好属于经济板块。",
          "This fact is not about work, money or trade.",
          "这个事实与工作、金钱或贸易无关。",
        ),
        culture: L(
          "文化",
          "The fact highlights food, festivals, language, arts, or traditions, so it belongs under **culture**.\n\n**Check.** Ask whether this detail shows how people celebrate, speak, cook, or express traditions: yes—that marks culture.",
          "这个事实写的是饮食、节日、语言、艺术或传统习俗，因此归入**文化**。\n\n**检验。** 问问这条信息展现的是不是人们的节庆、语言、饮食或传统表达：是的，这正是文化板块。",
          "This fact is not about food, festivals, language or beliefs.",
          "这个事实与饮食、节日、语言或信仰无关。",
        ),
      },
    ),
    choose(
      "the-fact-that-does-not-belong",
      ["The Fact That Does Not Belong", "不属于这一部分的事实"],
      [
        "Every sentence under a section heading must match that exact subtopic. Under *Food: Penguins*, *Penguins eat fish, squid, and krill* fits, whereas *Penguins can dive more than 500 meters deep* belongs under *Swimming* or *Movement* instead.\n\n> **Watch out.** All three choices are true facts about the same subject—spot the one that answers a *different* heading.",
        "同一小标题下的每一句都必须紧扣这个小类别。在 *Food: Penguins* 下，*Penguins eat fish, squid, and krill* 切题，而 *Penguins can dive more than 500 meters deep* 应该移去写游泳或行动能力。\n\n> **注意。** 三个选项都是关于同一主题的真实事实——找出回答了*另一个*标题的那一句。",
      ],
      ["Which fact does not belong under this heading?", "哪个事实不属于这个标题？"],
      `
        Food: Desert Foxes|Desert foxes have huge ears that give off heat.|Desert foxes eat insects, lizards and small rodents.|Desert foxes also eat fruit and roots when prey is scarce.
        Homes: Desert Foxes|Desert foxes hunt mostly at night.|Desert foxes dig dens deep in the sand.|A den may have several tunnels and exits.
        Body: Penguins|Penguins live in large groups called colonies.|Penguins have thick layers of fat to stay warm.|Their wings work like flippers in the water.
        Food: Penguins|Penguins can dive more than 500 meters deep.|Penguins eat fish, squid and krill.|Parents bring food back to their chicks in their stomachs.
        Climate: Iceland|Iceland has many fishing towns.|Summers in Iceland are cool and short.|Winters bring long nights and strong winds.
        Economy: Iceland|Iceland's first settlers arrived in 874.|Fishing is one of Iceland's biggest industries.|Hot springs provide cheap power for factories.
        History: Rome|Rome has a warm, dry summer.|Rome was founded, according to legend, in 753 BCE.|Rome became the center of a vast empire.
        Culture: Japan|Japan is made up of thousands of islands.|Many Japanese homes have a family altar.|Cherry blossom festivals are held each spring.
        Geography: Egypt|Egypt's pharaohs built the pyramids.|The Nile River flows north through Egypt.|Most of Egypt is desert.
        Life Cycle: Frogs|Frogs are found on every continent except Antarctica.|Frogs begin life as eggs laid in water.|Tadpoles slowly grow legs and lose their tails.
        Habitat: Polar Bears|Polar bears can weigh up to 700 kilograms.|Polar bears live on the sea ice of the Arctic.|They hunt from the edges of the ice.
        Inventions: Ancient China|Ancient Chinese farmers grew rice in flooded fields.|The Chinese invented paper around 105 CE.|They also invented the compass.
        Farming: The Maya|The Maya built tall pyramids for their kings.|The Maya grew maize, beans and squash.|They cut terraces into hillsides to farm.
        Weather: The Amazon|The Amazon is home to the pink river dolphin.|It rains almost every day in the Amazon.|The air in the rain forest is hot and damp.
        Sports: Brazil|Brazil is the largest country in South America.|Football is the most popular sport in Brazil.|Brazil has won the World Cup five times.
        Diet: Elephants|Elephants live in herds led by an old female.|Elephants eat grass, leaves and bark.|An adult may eat 150 kilograms of food a day.
        Body: Sharks|Sharks are found in every ocean.|Sharks have skeletons made of cartilage, not bone.|Their skin is covered in tiny tooth-like scales.
        Festivals: India|India has the second-largest population in the world.|During Diwali, people light lamps and set off fireworks.|Holi is celebrated with colored powder.
        Rivers: Europe|Europe has many old castles.|The Danube flows through ten countries.|The Rhine carries barges of goods to the sea.
        Food: Mexico|Mexico City was built on the ruins of an Aztec city.|Tortillas made from corn are eaten at most meals.|Mole is a sauce made with chilies and chocolate.
        Homes: Beavers|Beavers have long orange front teeth.|Beavers build lodges of sticks and mud.|The entrance to a lodge is underwater.
        Trade: The Vikings|The Vikings told stories about their gods, such as Thor.|Viking traders sold furs and slaves.|They traveled as far as Baghdad to buy silver and silk.
        Danger: Volcanoes|Volcanoes form where plates of the Earth's crust meet.|Lava can destroy homes and farms.|Clouds of ash can make it hard to breathe.
        Uses: Bamboo|Bamboo is a kind of grass.|Bamboo is used to build houses and bridges.|It can be made into paper and cloth.
        Defense: Castles|Many castles were built on hills.|Castles had thick walls and narrow windows for archers.|A moat full of water kept attackers back.
        Training: Astronauts|The first person in space was Yuri Gagarin.|Astronauts practice spacewalks in deep pools.|They spin in machines to get used to strong forces.
        Movement: Snakes|Some snakes lay eggs, and others give birth to live young.|Snakes move by pushing their scales against the ground.|Some snakes swim by moving their bodies like waves.
        Building: The Great Wall|The Great Wall is visited by millions of tourists.|Workers built the wall from stone, brick and packed earth.|Soldiers and prisoners did much of the work.
        Seasons: Australia|Kangaroos live only in Australia.|Australia's summer comes in December.|Winter in the south can bring snow to the mountains.
        Tools: Early Humans|Early humans lived in caves and shelters.|Early humans made sharp tools by chipping stones.|They also made needles from bone.
      `,
      (right, shown) => [
        `The stray fact is: **${right}** Even though it is true, it does not fit the heading *${shown.split(":")[0]}*.\n\n**Check.** Compare each sentence against *${shown.split(":")[0]}*: the other two directly describe that exact category, while this sentence belongs in a separate section.`,
        `不属于本节的事实是：**${right}** 它虽然真实，但与标题 *${shown.split(":")[0]}* 不符。\n\n**检验。** 把三句话逐一对照 *${shown.split(":")[0]}*：另外两句都紧扣这个类别，只有这一句应该移到别的板块。`,
      ],
      [
        ["*{wrong}* fits the heading, so it belongs in this section.", "*{wrong}* 符合标题，属于这一部分。"],
        ["*{wrong}* is about the same category as the heading.", "*{wrong}* 与标题属于同一类别。"],
      ],
    ),
  ],
});

const numbers = topic("writing", {
  id: "reporting-numbers-from-a-graph",
  title: ["Reporting Numbers from a Graph", "根据图表报告数字"],
  summary: [
    "Writing about data means naming the trend and backing it with exact numbers from the graph, and comparing amounts with words such as twice, half and more than.",
    "写数据就要说出趋势，并用图表中的精确数字支持它，还要用 twice、half、more than 等词比较数量。",
  ],
  intro: [
    "Writing *Bike riders went up* leaves readers guessing how much; writing *Riders rose from 20 on Monday to 50 on Wednesday* proves the trend with exact data. **Reporting numbers from a graph** pairs accurate direction with exact figures and arithmetic.",
    "只写 *Bike riders went up* 让读者无从得知涨了多少；写 *Riders rose from 20 on Monday to 50 on Wednesday* 才用精确数字坐实了趋势。**根据图表报告数字**要求方向、数值和比较运算全部精准。",
  ],
  after: ["reading-graphs-in-science"],
  points: [
    choose(
      "describing-the-trend",
      ["Describing the Trend", "描述趋势"],
      [
        "A crisp data sentence names the **direction** (*rose*, *fell*, *stayed the same*, *rose then fell*) and anchors it with the **exact values** from the data: *Sales rose each month, from 20 in January to 50 in March.*\n\n> **Watch out.** Check *both* halves of the option—one distractor flips the direction (rose vs. fell), and the other gets the direction right but misquotes a number.",
        "准确的数据句要同时做到两件事：说清**方向**（*rose*、*fell*、*stayed the same*、*rose then fell*），并配上数据中的**精确数值**：*Sales rose each month, from 20 in January to 50 in March.*\n\n> **注意。** 核对选项的两半——一个干扰项会把升降方向说反，另一个方向对却把数字抄错。",
      ],
      ["Which sentence reports these data correctly?", "哪个句子正确报告了这些数据？"],
      `
        Bike riders: Mon 20, Tue 35, Wed 50|Riders rose each day, from 20 on Monday to 50 on Wednesday.|Riders fell each day, from 50 on Monday to 20 on Wednesday.|Riders rose each day, from 20 on Monday to 35 on Wednesday.
        Ice on the lake (cm): Jan 30, Feb 20, Mar 5|The ice thinned each month, from 30 cm in January to 5 cm in March.|The ice thickened each month, from 5 cm in January to 30 cm in March.|The ice thinned each month, from 30 cm in January to 20 cm in March.
        Library visitors: 2021 400, 2022 400, 2023 400|Visitors stayed the same, at 400 each year.|Visitors rose each year, from 400 to 800.|Visitors stayed the same, at 200 each year.
        Plant height (cm): Week 1 2, Week 2 5, Week 3 9|The plant grew each week, from 2 cm to 9 cm.|The plant shrank each week, from 9 cm to 2 cm.|The plant grew each week, from 2 cm to 5 cm.
        Temperature (°C): 6 a.m. 10, noon 22, 6 p.m. 15|The temperature rose from 10°C to 22°C at noon, then fell to 15°C.|The temperature fell all day, from 22°C to 10°C.|The temperature rose from 10°C to 15°C at noon, then fell to 22°C.
        Birds counted: 2019 80, 2020 60, 2021 40|The number of birds fell each year, from 80 to 40.|The number of birds rose each year, from 40 to 80.|The number of birds fell each year, from 80 to 60.
        Car sales: Q1 100, Q2 150, Q3 200|Car sales rose each quarter, from 100 to 200.|Car sales fell each quarter, from 200 to 100.|Car sales rose each quarter, from 150 to 250.
        Rainfall (mm): Jun 10, Jul 80, Aug 120|Rainfall rose from 10 mm in June to 120 mm in August.|Rainfall fell from 120 mm in June to 10 mm in August.|Rainfall rose from 10 mm in June to 80 mm in August.
        Price of a ticket (\\$): 2020 5, 2021 7, 2022 9|The ticket price rose each year, from \\$5 to \\$9.|The ticket price fell each year, from \\$9 to \\$5.|The ticket price rose each year, from \\$5 to \\$7.
        Students walking to school: Sep 50, Oct 50, Nov 50|The number walking stayed at 50 each month.|The number walking rose from 50 to 100.|The number walking stayed at 40 each month.
        Water in a tank (L): 8 a.m. 100, 10 a.m. 70, noon 40|The water fell from 100 L at 8 a.m. to 40 L at noon.|The water rose from 40 L at 8 a.m. to 100 L at noon.|The water fell from 100 L at 8 a.m. to 70 L at noon.
        Wolves in the park: 1995 14, 2000 100, 2005 170|The number of wolves rose from 14 in 1995 to 170 in 2005.|The number of wolves fell from 170 in 1995 to 14 in 2005.|The number of wolves rose from 14 in 1995 to 100 in 2005.
        Hours of daylight: Jun 15, Sep 12, Dec 9|Daylight fell from 15 hours in June to 9 hours in December.|Daylight rose from 9 hours in June to 15 hours in December.|Daylight fell from 15 hours in June to 12 hours in December.
        Visitors to the museum: Mon 300, Tue 120, Wed 300|Visitors dropped from 300 to 120 on Tuesday, then returned to 300.|Visitors rose each day, from 120 to 300.|Visitors dropped from 300 to 200 on Tuesday, then returned to 300.
        Weight of a puppy (kg): Month 1 2, Month 2 4, Month 3 7|The puppy gained weight each month, from 2 kg to 7 kg.|The puppy lost weight each month, from 7 kg to 2 kg.|The puppy gained weight each month, from 2 kg to 4 kg.
        Snow depth (cm): Dec 40, Jan 60, Feb 20|Snow rose from 40 cm to 60 cm in January, then fell to 20 cm.|Snow fell each month, from 60 cm to 20 cm.|Snow rose from 40 cm to 80 cm in January, then fell to 20 cm.
        Shop profits (\\$): 2021 900, 2022 600, 2023 300|Profits fell each year, from \\$900 to \\$300.|Profits rose each year, from \\$300 to \\$900.|Profits fell each year, from \\$900 to \\$600.
        Runners in the race: 2020 200, 2021 250, 2022 250|Runners rose from 200 to 250, then stayed at 250.|Runners fell from 250 to 200, then stayed at 200.|Runners rose each year, from 200 to 300.
        Speed of a cart (m/s): 1 s 2, 2 s 4, 3 s 6|The cart sped up each second, from 2 m/s to 6 m/s.|The cart slowed down each second, from 6 m/s to 2 m/s.|The cart sped up each second, from 2 m/s to 4 m/s.
        Trees planted: 2018 30, 2019 60, 2020 90|Trees planted rose each year, from 30 to 90.|Trees planted fell each year, from 90 to 30.|Trees planted rose each year, from 30 to 60.
        Phone battery (%): 9 a.m. 100, noon 60, 3 p.m. 20|The battery fell from 100% at 9 a.m. to 20% at 3 p.m.|The battery rose from 20% at 9 a.m. to 100% at 3 p.m.|The battery fell from 100% at 9 a.m. to 60% at 3 p.m.
        Fish caught: Mon 12, Tue 12, Wed 12|The catch stayed the same, at 12 fish each day.|The catch rose each day, from 12 to 36 fish.|The catch stayed the same, at 10 fish each day.
        Bus riders: 2019 5,000, 2020 2,000, 2021 4,000|Riders fell to 2,000 in 2020, then rose to 4,000 in 2021.|Riders rose each year, from 2,000 to 5,000.|Riders fell to 2,000 in 2020, then rose to 5,000 in 2021.
        Height of a tide (m): 6 a.m. 1, noon 4, 6 p.m. 1|The tide rose from 1 m to 4 m at noon, then fell back to 1 m.|The tide fell from 4 m to 1 m all day.|The tide rose from 1 m to 3 m at noon, then fell back to 1 m.
        Books borrowed: Jan 200, Feb 250, Mar 300|Borrowing rose each month, from 200 to 300 books.|Borrowing fell each month, from 300 to 200 books.|Borrowing rose each month, from 200 to 250 books.
        Air pollution (units): 2010 80, 2015 50, 2020 30|Pollution fell from 80 units in 2010 to 30 in 2020.|Pollution rose from 30 units in 2010 to 80 in 2020.|Pollution fell from 80 units in 2010 to 50 in 2020.
        Coins in a jar: Week 1 10, Week 2 25, Week 3 45|The coins rose each week, from 10 to 45.|The coins fell each week, from 45 to 10.|The coins rose each week, from 10 to 25.
        Students in the club: Sep 8, Oct 16, Nov 24|The club grew each month, from 8 to 24 students.|The club shrank each month, from 24 to 8 students.|The club grew each month, from 8 to 16 students.
        Rabbits on the island: 2000 500, 2001 2,000, 2002 800|Rabbits rose to 2,000 in 2001, then fell to 800.|Rabbits fell each year, from 2,000 to 500.|Rabbits rose to 2,000 in 2001, then fell to 500.
        Average test score: Test 1 70, Test 2 75, Test 3 85|Scores rose with each test, from 70 to 85.|Scores fell with each test, from 85 to 70.|Scores rose with each test, from 70 to 75.
      `,
      (right) => [
        `The accurate report is: **${right}** Both the direction of change and every quoted figure match the dataset.\n\n**Check.** Match the first value, any turning point, and the final value in this sentence directly against the prompt's numbers: every single one aligns.`,
        `准确的数据报告是：**${right}** 变化方向和每个数值都与原始数据完全一致。\n\n**检验。** 把句中的起始值、转折点（如有）和末尾值逐一与题干数据核对：每一项都分毫不差。`,
      ],
      [
        ["*{wrong}* gets the trend backward: the data move the other way.", "*{wrong}* 把趋势说反了：数据的变化方向正好相反。"],
        ["*{wrong}* names the trend but gives a number that is not in the data.", "*{wrong}* 说对了趋势，但给出的数字与数据不符。"],
      ],
    ),
    choose(
      "comparing-two-amounts",
      ["Comparing Two Amounts", "比较两个数量"],
      [
        "Exact comparison words turn raw numbers into clear insights: use **twice as many** (2×), **three times as tall** (3×), **half as much** (½), or subtraction (**15 more**, **30 fewer**). For *Team A: 40; Team B: 25*, subtract 40 − 25 to get *Team A scored 15 more*.\n\n> **Watch out.** Check *which* group is larger so you do not reverse the comparison (*Pine is three times as tall as oak* when the oak is actually taller).",
        "精准的比较用词能把数字变成清晰结论：用倍数（**twice as many**、**three times as tall**、**half as much**）或差值（**15 more**、**30 fewer**）。如 *Team A: 40; Team B: 25*，用 40 − 25 得出 *Team A scored 15 more*。\n\n> **注意。** 先确认*哪一方*更大，别把比较方向写反（比如橡树更高却写成松树是橡树的三倍高）。",
      ],
      ["Which sentence compares these amounts correctly?", "哪个句子正确比较了这两个数量？"],
      `
        Class A read 40 books; Class B read 20.|Class A read twice as many books as Class B.|Class A read half as many books as Class B.|Class A read 10 more books than Class B.
        The oak is 30 meters tall; the pine is 10 meters tall.|The oak is three times as tall as the pine.|The oak is twice as tall as the pine.|The pine is three times as tall as the oak.
        Maya ran 8 km; Leo ran 5 km.|Maya ran 3 km farther than Leo.|Maya ran 5 km farther than Leo.|Leo ran 3 km farther than Maya.
        The red tank holds 50 liters; the blue tank holds 100.|The red tank holds half as much as the blue tank.|The red tank holds twice as much as the blue tank.|The red tank holds 25 liters less than the blue tank.
        In June, 60 people came; in July, 90 came.|Thirty more people came in July than in June.|Sixty more people came in July than in June.|Thirty fewer people came in July than in June.
        A cat weighs 4 kg; a dog weighs 20 kg.|The dog weighs five times as much as the cat.|The dog weighs four times as much as the cat.|The cat weighs five times as much as the dog.
        Store A sold 150 hats; Store B sold 50.|Store A sold three times as many hats as Store B.|Store A sold twice as many hats as Store B.|Store A sold 50 more hats than Store B.
        Ana scored 18 points; Ben scored 12.|Ana scored 6 more points than Ben.|Ana scored 12 more points than Ben.|Ben scored 6 more points than Ana.
        The movie lasted 120 minutes; the play lasted 60.|The movie lasted twice as long as the play.|The movie lasted three times as long as the play.|The play lasted twice as long as the movie.
        A bus carries 45 people; a van carries 15.|A bus carries three times as many people as a van.|A bus carries 15 more people than a van.|A van carries three times as many people as a bus.
        Town A has 8,000 people; Town B has 2,000.|Town A has four times as many people as Town B.|Town A has twice as many people as Town B.|Town A has 2,000 more people than Town B.
        The first jar holds 25 coins; the second holds 100.|The first jar holds one fourth as many coins as the second.|The first jar holds half as many coins as the second.|The first jar holds four times as many coins as the second.
        It rained 70 mm in April and 40 mm in May.|It rained 30 mm more in April than in May.|It rained 40 mm more in April than in May.|It rained 30 mm less in April than in May.
        The adult ticket costs \\$12; the child ticket costs \\$6.|The adult ticket costs twice as much as the child ticket.|The adult ticket costs \\$12 more than the child ticket.|The child ticket costs twice as much as the adult ticket.
        One plant grew 9 cm; the other grew 3 cm.|The first plant grew three times as much as the other.|The first plant grew 3 cm more than the other.|The other plant grew three times as much as the first.
        The library has 600 novels and 200 poetry books.|The library has 400 more novels than poetry books.|The library has 200 more novels than poetry books.|The library has 400 fewer novels than poetry books.
        Team Red has 10 players; Team Blue has 15.|Team Blue has 5 more players than Team Red.|Team Blue has twice as many players as Team Red.|Team Red has 5 more players than Team Blue.
        A whale is 20 meters long; a shark is 5 meters long.|The whale is four times as long as the shark.|The whale is 5 meters longer than the shark.|The shark is four times as long as the whale.
        Last year, 300 people voted; this year, 900 voted.|Three times as many people voted this year.|Twice as many people voted this year.|Three times as many people voted last year.
        The river is 80 km long; the canal is 20 km long.|The canal is one fourth as long as the river.|The canal is half as long as the river.|The canal is four times as long as the river.
        Sam saved \\$45; Kim saved \\$30.|Sam saved \\$15 more than Kim.|Sam saved \\$30 more than Kim.|Kim saved \\$15 more than Sam.
        The north field gave 200 kg of apples; the south field gave 400 kg.|The south field gave twice as many apples as the north field.|The south field gave 100 kg more than the north field.|The north field gave twice as many apples as the south field.
        A train goes 150 km an hour; a car goes 100 km an hour.|The train goes 50 km an hour faster than the car.|The train goes 100 km an hour faster than the car.|The car goes 50 km an hour faster than the train.
        In a survey, 75 students chose pizza and 25 chose pasta.|Three times as many students chose pizza as pasta.|Twice as many students chose pizza as pasta.|Three times as many students chose pasta as pizza.
        The red book has 240 pages; the blue book has 120.|The red book has twice as many pages as the blue book.|The red book has 240 more pages than the blue book.|The blue book has twice as many pages as the red book.
        Jo slept 9 hours; Max slept 6.|Jo slept 3 hours more than Max.|Jo slept 6 hours more than Max.|Max slept 3 hours more than Jo.
        Factory A makes 500 cars a day; Factory B makes 100.|Factory A makes five times as many cars as Factory B.|Factory A makes four times as many cars as Factory B.|Factory B makes five times as many cars as Factory A.
        The gym holds 400 people; the hall holds 200.|The hall holds half as many people as the gym.|The hall holds twice as many people as the gym.|The hall holds 100 fewer people than the gym.
        The tall tower is 90 m high; the short tower is 60 m high.|The tall tower is 30 m higher than the short tower.|The tall tower is twice as high as the short tower.|The short tower is 30 m higher than the tall tower.
        In May, 12 birds nested; in June, 36 nested.|Three times as many birds nested in June.|Twice as many birds nested in June.|Three times as many birds nested in May.
      `,
      (right) => [
        `The accurate comparison is: **${right}** Both the arithmetic and the direction of comparison match the two figures.\n\n**Check.** Verify the math directly (divide for *times/half/one fourth*, or subtract for *more/farther/higher*) and confirm the larger item sits on the larger side of the sentence.`,
        `准确的比较是：**${right}** 数值运算和大小方向都与题干完全吻合。\n\n**检验。** 亲自验算一次（倍数或分数做除法，多多少或高多少做减法），再确认较大的一方确实放在句子中表示更大的位置。`,
      ],
      [
        ["*{wrong}* uses the wrong multiple or the wrong difference; check the arithmetic.", "*{wrong}* 用错了倍数或差值，要检查计算。"],
        ["*{wrong}* gets the numbers wrong or turns the comparison around.", "*{wrong}* 数字有误，或者把比较的方向弄反了。"],
      ],
    ),
  ],
});

const redundancy = topic("writing", {
  id: "eliminating-redundancy",
  title: ["Eliminating Redundancy", "删除冗余"],
  summary: [
    "Redundant words repeat what other words already say, as in return back or free gift; cutting them makes writing clear and strong without changing its meaning.",
    "冗余的词重复了其他词已经表达的意思，如 return back 或 free gift；删去它们能让文字清楚有力，而不改变原意。",
  ],
  intro: [
    "*We will advance forward at 6 a.m. in the morning* says *forward* twice and *morning* twice. **Eliminating redundancy** trims repeated meanings and bloated filler so every word earns its keep.",
    "*We will advance forward at 6 a.m. in the morning* 把“向前”和“早上”各说了两遍。**删除冗余**就是删掉语义重复和凑字数的表达，让每个词都物尽其用。",
  ],
  after: ["connotation-and-precise-words"],
  points: [
    choose(
      "the-word-that-repeats",
      ["The Word That Repeats", "重复的词"],
      [
        "A **redundant** word repeats meaning already built into a neighboring word: *return* already means *go back*, so *return back* says *back* twice—just like *free gift*, *final end*, *past history*, and *repeat again*. Cut the echo word without losing a shred of meaning.\n\n> **Watch out.** Test by deleting the suspect word and reading the sentence aloud—if the sentence still carries 100% of its original information, that word was redundant.",
        "**冗余**词重复了相邻词语里已经包含的意思：*return* 本身就有“回来”的意思，所以 *return back* 把 *back* 说了两遍；*free gift*、*final end*、*past history*、*repeat again* 都是如此。删掉重复词，句意毫发无损。\n\n> **注意。** 试着把可疑词划掉再读一遍——如果句子仍保留 100% 的原信息，那个词就是冗余的。",
      ],
      ["Which word in the sentence is redundant?", "句子中哪个词是多余的？"],
      `
        We will return back after lunch.|back|after|lunch
        Every visitor got a free gift at the door.|free|visitor|door
        The final end of the story surprised everyone.|final|story|everyone
        Our past history shows that we can win.|past|shows|win
        Please repeat that again for the class.|again|please|class
        The two twins wore matching coats.|two|matching|coats
        She gave a brief summary of the book in short.|in short|brief|book
        Let's join together to clean the park.|together|clean|park
        The puppy was small in size.|in size|puppy|small
        We met at 6 a.m. in the morning.|in the morning|met|6 a.m.
        The new innovation saved the factory money.|new|saved|factory
        He nodded his head in agreement.|his head|nodded|agreement
        The circle was round in shape.|in shape|circle|round
        Please RSVP please by Friday.|please|RSVP|Friday
        Add an extra bonus point for neatness.|extra|point|neatness
        The ice was frozen solid.|frozen|ice|solid
        Each and every student must sign up.|and every|student|sign
        The end result was a tie.|end|result|tie
        We need to plan ahead for the trip.|ahead|plan|trip
        The sky was blue in color.|in color|sky|blue
        Her personal opinion was that the plan would fail.|personal|opinion|fail
        The dog followed after me all the way home.|after|followed|home
        I shrugged my shoulders and walked away.|my shoulders|shrugged|walked
        It was an unexpected surprise to see her there.|unexpected|surprise|there
        The baby was born in the year 2020.|the year|baby|born
        We will advance forward to the next hill.|forward|advance|hill
        The future plans of the club are exciting.|future|plans|club
        The essay should be ten pages in length.|in length|essay|ten pages
        The completely finished painting hung in the hall.|completely|painting|hall
        The tall skyscraper towered over the city.|tall|skyscraper|city
      `,
      (right, shown) => [
        `**${right}** echoes meaning already carried by another word in *${shown}*, so it can be cut.\n\n**Check.** Read the sentence again with **${right}** deleted: every fact remains intact, whereas deleting either of the other options removes real information.`,
        `**${right}** 重复了 *${shown}* 中另一个词已表达的意思，可以删去。\n\n**检验。** 把 **${right}** 删掉再读原句：所有信息丝毫不减，而删去另外两项中的任何一个都会丢失信息。`,
      ],
      [
        ["*{wrong}* carries meaning that the sentence needs.", "*{wrong}* 带有句子需要的意思。"],
        ["Removing *{wrong}* would lose information.", "删去 *{wrong}* 会丢失信息。"],
      ],
    ),
    choose(
      "the-concise-version",
      ["The Concise Version", "简洁的版本"],
      [
        "Wordy sentences bury simple points inside bloated phrases: *due to the fact that* → **because**, *at this point in time* → **now**, *in order to* → **to**, *made a decision* → **decided**. Tighten the sentence by replacing padded phrases and cutting echoes while preserving **every original fact**.\n\n> **Watch out.** Do not pick the shortest option blindly—one short distractor drops a key fact or flips the meaning (*cannot* → *can*, *next Monday* → *last Monday*).",
        "啰唆句把简单意思埋在冗长短语里：*due to the fact that* → **because**，*at this point in time* → **now**，*in order to* → **to**，*made a decision* → **decided**。精简时换掉拖沓短语并删去重复，同时完整保留**每一条原事实**。\n\n> **注意。** 别光挑字数最短的——其中一个短干扰项会漏掉关键事实或把意思改反（如 *cannot* 变成 *can*、*next Monday* 变成 *last Monday*）。",
      ],
      ["Which is the best concise version of the sentence?", "哪个是这个句子最好的简洁版本？"],
      `
        Due to the fact that it was raining, the game was canceled.|Because it was raining, the game was canceled.|Due to the fact that it rained, the game was canceled because of rain.|The game was canceled.
        At this point in time, we are not able to answer.|We cannot answer now.|At this point in time right now, we cannot answer.|We can answer now.
        In order to win the race, she trained every single day.|To win the race, she trained every day.|In order to win, she trained each and every single day.|She trained to lose the race.
        The reason why he was late was because the bus broke down.|He was late because the bus broke down.|The reason was because why the bus broke down and he was late.|The bus was late.
        In my personal opinion, I think the book is excellent.|I think the book is excellent.|In my own personal opinion, I think and believe the book is excellent.|The book is excellent, everyone agrees.
        She made a decision to join the team.|She decided to join the team.|She made a decision and decided to join the team.|She decided to leave the team.
        There are many students who walk to school.|Many students walk to school.|There are many students who are walking on foot to school.|No students walk to school.
        The meeting will take place on Monday of next week.|The meeting is next Monday.|The meeting will take place and happen on Monday of next week.|The meeting was last Monday.
        He is a person who is very kind.|He is very kind.|He is a person who is a very kind person.|He is a person.
        We came to the conclusion that the plan would work.|We concluded that the plan would work.|We came to the final conclusion and concluded that the plan would work.|We concluded that the plan would fail.
        In the event that it snows, school will close.|If it snows, school will close.|In the event that it snows snow, school will close.|School will close.
        The fact is that the river is rising quickly.|The river is rising quickly.|The fact of the matter is that the river is rising very quickly.|The river is falling quickly.
        It is important to note that the store closes at nine.|The store closes at nine.|It is very important to note and remember that the store closes at nine.|The store opens at nine.
        She has the ability to speak three languages.|She can speak three languages.|She has the ability and skill to be able to speak three languages.|She can speak two languages.
        They conducted an investigation into the fire.|They investigated the fire.|They conducted an investigation and investigated the fire.|They started the fire.
        For the purpose of saving money, we walked.|To save money, we walked.|For the purpose of saving money and to save it, we walked.|We walked.
        The bridge was built during the period of the 1800s.|The bridge was built in the 1800s.|The bridge was built during the period of time of the 1800s.|The bridge was built in the 1900s.
        A large number of people came to the fair.|Many people came to the fair.|A large number of many people came to the fair.|A few people came to the fair.
        He spoke in a loud voice.|He spoke loudly.|He spoke in a loud and noisy voice.|He spoke softly.
        Despite the fact that she was tired, she kept running.|Although she was tired, she kept running.|Despite the fact that she was tired and weary, she kept on running.|She was tired, so she stopped running.
        The teacher gave an explanation of the rule.|The teacher explained the rule.|The teacher gave an explanation and explained the rule.|The student explained the rule.
        We are in agreement that the trip was fun.|We agree that the trip was fun.|We are all in total agreement that the trip was fun.|We agree that the trip was boring.
        At the present time, the museum is closed.|The museum is closed now.|At the present time currently, the museum is closed.|The museum is open now.
        She is in possession of the only key.|She has the only key.|She is in possession of and holds the only key.|She has a key.
        The scientists performed an analysis of the water.|The scientists analyzed the water.|The scientists performed an analysis and analyzed the water.|The water was analyzed by no one.
        Until such time as the storm ends, stay inside.|Until the storm ends, stay inside.|Until such time as the storm ends and is over, stay inside.|After the storm ends, stay inside.
        The movie was long in length and boring.|The movie was long and boring.|The movie was long in length and time, and boring.|The movie was short and boring.
        He made an attempt to climb the wall.|He tried to climb the wall.|He made an attempt and tried to climb the wall.|He climbed the wall.
        With regard to the test, it will be on Friday.|The test will be on Friday.|With regard to and about the test, it will be on Friday.|The test was on Friday.
        It was a dark night, and it was very dark.|It was a very dark night.|It was a dark night, and the night was very dark.|It was a bright night.
      `,
      (right) => [
        `The best concise revision is: **${right}** It trims every extra word while keeping all the original facts intact.\n\n**Check.** Compare this line with the original sentence: who did what, when, and why all stay the same, yet every padded phrase and repetition is gone.`,
        `最好的简洁改写是：**${right}** 删掉了所有多余词，同时原封不动保留了全部事实。\n\n**检验。** 把它和原句逐项对照：谁做了什么、何时、为何全都未变，但凑字数的短语和重复词已清理干净。`,
      ],
      [
        ["*{wrong}* is still wordy: it keeps or even adds repeated words.", "*{wrong}* 仍然啰唆：它保留甚至增加了重复的词。"],
        ["*{wrong}* is short, but it drops or changes part of the meaning.", "*{wrong}* 虽然短，却丢掉或改变了部分意思。"],
      ],
    ),
  ],
});

/** writingTopics7a are the first rule-checked writing topics of grade 7. */
export const writingTopics7a: readonly TopicDef[] = [
  objective,
  period,
  category,
  drawn(numbers, { "describing-the-trend": risingSales }),
  redundancy,
];
