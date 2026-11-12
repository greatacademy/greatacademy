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
  after: ["supporting-details", "fact-and-opinion"],
  points: [
    label(
      "objective-or-not",
      ["Objective or Not", "客观与否"],
      [
        "A summary tells a reader what a text says, not what you think of it. An **objective** sentence reports the author's ideas with neutral verbs such as *argues*, *explains* or *describes*. A sentence that **judges the author** calls the author or the ideas wise, foolish, wrong or brilliant. A sentence that **gives the writer's own view** adds *I think*, *we should* or a lesson of your own. Keep the last two out of a summary; save them for a response.",
        "概要告诉读者一篇文章说了什么，而不是你怎么看它。**客观**的句子用 *argues*、*explains*、*describes* 等中性动词报告作者的观点。**评判作者**的句子会说作者或其观点明智、愚蠢、错误或精彩。**加入自己观点**的句子会加上 *I think*、*we should* 或你自己的教训。概要里不要写后两种句子，把它们留到回应文中去写。",
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
          "The sentence reports what the author says with a neutral verb and adds no judgment.",
          "这个句子用中性动词报告作者说了什么，没有加入评判。",
          "This sentence does more than report what the author says.",
          "这个句子不只是报告作者说了什么。",
        ),
        "judges the author": L(
          "评判作者",
          "A word such as *foolishly*, *brilliantly*, *wrongly* or *silly* judges the author or the ideas.",
          "*foolishly*、*brilliantly*、*wrongly*、*silly* 这样的词在评判作者或其观点。",
          "Nothing in this sentence praises or criticizes the author.",
          "这个句子中没有赞扬或批评作者的词。",
        ),
        "gives the writer's own view": L(
          "加入自己的观点",
          "The sentence tells what the summary writer thinks, wants or would do, which belongs in a response.",
          "这个句子说出概要作者自己的想法、愿望或做法，这些应该写进回应文。",
          "This sentence does not add the summary writer's own thoughts.",
          "这个句子没有加入概要作者自己的想法。",
        ),
      },
    ),
    choose(
      "rewriting-it-objectively",
      ["Rewriting It Objectively", "改写成客观的句子"],
      [
        "To make a summary sentence objective, take out the words that judge or react, and keep the author's idea. *The author ridiculously claims that zoos help animals* becomes *The author claims that zoos help animals.* Do not swap one judgment for another, and do not change what the author actually said.",
        "要把概要中的句子改得客观，就去掉表示评判或反应的词，保留作者的观点。*The author ridiculously claims that zoos help animals* 变成 *The author claims that zoos help animals.* 不要用一种评判代替另一种评判，也不要改变作者的原意。",
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
        `**${right}** The judging word is gone, and the author's idea is reported exactly as it was.`,
        `**${right}** 表示评判的词去掉了，作者的观点被如实报告。`,
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
  after: ["historical-fiction-facts-and-inventions"],
  points: [
    choose(
      "a-detail-that-fits",
      ["A Detail That Fits", "符合时代的细节"],
      [
        "Readers of historical fiction trust a story when its small details fit the period: the tools people used, how they traveled, what they ate, how they lit their homes and passed messages. Before you write a detail, ask: *Did this exist then and there?* A Roman baker lights a wood fire; he does not switch on an oven.",
        "历史小说的读者之所以相信一个故事，是因为其中的小细节符合那个时代：人们用的工具、出行的方式、吃的东西、照明和传递消息的方法。写一个细节之前，先问自己：*那时那地有这种东西吗？* 古罗马的面包师会生木柴火，而不会打开电烤箱。",
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
        `**${right}** fits: it uses what people really had in that time and place (${shown.split(":")[0]}).`,
        `**${right}** 符合时代：它用的是那个时代和地方的人真正拥有的东西（${shown.split(":")[0]}）。`,
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
        "A detail from the wrong time is called an **anachronism**: a clock in ancient Rome, a zipper in a medieval cloak, a telephone in 1800. When you revise historical fiction, read each sentence and check its objects, its ways of traveling and its words against the period.",
        "来自错误时代的细节叫作**时代错误**：古罗马的钟表、中世纪斗篷上的拉链、1800 年的电话。修改历史小说时，要逐句检查其中的物品、出行方式和用词是否符合那个时代。",
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
        `**${right}** does not belong in ${shown}: it uses something from a much later time.`,
        `**${right}** 不属于${shown}的背景：它用了一个晚得多的时代才有的东西。`,
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
  after: ["removing-off-topic-sentences", "text-features"],
  points: [
    label(
      "which-section",
      ["Which Section", "属于哪一部分"],
      [
        "A report on a country is often organized by category. **Geography** covers the land, water and weather. **History** covers what happened in the past. **Economy** covers work, money, farming and trade. **Culture** covers food, festivals, music, language and beliefs. Sorting your notes this way before you write keeps each section focused.",
        "关于一个国家的报告常按类别组织。**地理**写土地、水域和天气。**历史**写过去发生的事。**经济**写工作、金钱、农业和贸易。**文化**写饮食、节日、音乐、语言和信仰。写作前这样整理笔记，能让每一部分都集中在一个方面。",
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
          "The fact is about the land, water or weather, which belongs in geography.",
          "这个事实与土地、水域或天气有关，属于地理部分。",
          "This fact is not about the land, water or weather.",
          "这个事实与土地、水域或天气无关。",
        ),
        history: L(
          "历史",
          "The fact tells about an event or a place from the past, which belongs in history.",
          "这个事实讲的是过去的事件或遗迹，属于历史部分。",
          "This fact is not about an event in the past.",
          "这个事实与过去的事件无关。",
        ),
        economy: L(
          "经济",
          "The fact is about work, money, farming or trade, which belongs in the economy.",
          "这个事实与工作、金钱、农业或贸易有关，属于经济部分。",
          "This fact is not about work, money or trade.",
          "这个事实与工作、金钱或贸易无关。",
        ),
        culture: L(
          "文化",
          "The fact is about food, festivals, language, art or beliefs, which belongs in culture.",
          "这个事实与饮食、节日、语言、艺术或信仰有关，属于文化部分。",
          "This fact is not about food, festivals, language or beliefs.",
          "这个事实与饮食、节日、语言或信仰无关。",
        ),
      },
    ),
    choose(
      "the-fact-that-does-not-belong",
      ["The Fact That Does Not Belong", "不属于这一部分的事实"],
      [
        "Each section of a report has a heading, and every sentence in it should fit that heading. When you revise, read the heading, then check each fact against it. A fact that belongs to another category, even if it is true and interesting, should move to its own section.",
        "报告的每一部分都有标题，其中的每个句子都应该符合这个标题。修改时，先读标题，再逐一检查每个事实。属于另一类别的事实，即使真实有趣，也应该移到它自己的那一部分去。",
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
        `**${right}** is true, but it is not about *${shown.split(":")[0]}*, so it belongs in another section.`,
        `**${right}** 虽然真实，但与 *${shown.split(":")[0]}* 无关，应该放到另一部分。`,
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
  after: ["reading-graphs-in-science"],
  points: [
    choose(
      "describing-the-trend",
      ["Describing the Trend", "描述趋势"],
      [
        "A good sentence about a graph does two things: it names the **trend** (*rose*, *fell*, *stayed the same*) and it gives the **numbers** that prove it, usually the first and last values: *Sales rose each month, from 20 in January to 50 in March.* Check that both the trend and the numbers match the data exactly.",
        "描述图表的好句子要做两件事：说出**趋势**（*rose*、*fell*、*stayed the same*），并给出证明它的**数字**，通常是第一个和最后一个数值：*Sales rose each month, from 20 in January to 50 in March.* 要检查趋势和数字是否都与数据完全一致。",
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
        `**${right}** The trend matches the data, and so do the numbers that back it.`,
        `**${right}** 趋势与数据一致，支持它的数字也一致。`,
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
        "To compare two amounts, choose words that are exact. If one is double the other, it is **twice as many**; if it is a third, it is **one third as many**. If you subtract, say **how many more**: *Team A scored 40 and Team B scored 25, so Team A scored 15 more.* Do the arithmetic before you write the sentence.",
        "比较两个数量时，要选用精确的词。如果一个是另一个的两倍，就是 **twice as many**；如果是三分之一，就是 **one third as many**。如果是相减，就说 **how many more**：*Team A scored 40 and Team B scored 25, so Team A scored 15 more.* 写句子之前先算好。",
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
        `**${right}** The comparison word and the numbers both match the arithmetic.`,
        `**${right}** 比较用词和数字都与计算结果一致。`,
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
  after: ["connotation-and-precise-words"],
  points: [
    choose(
      "the-word-that-repeats",
      ["The Word That Repeats", "重复的词"],
      [
        "A **redundant** word says again what another word already means. *Return* already means *go back*, so *return back* says *back* twice. *Free gift*, *final end*, *past history* and *repeat again* all carry an extra word. Find the word you could remove without losing any meaning.",
        "**冗余**的词重复了另一个词已经表达的意思。*return* 本身就是 *go back* 的意思，所以 *return back* 把 *back* 说了两遍。*free gift*、*final end*、*past history*、*repeat again* 都多了一个词。找出删去后不会丢失任何意思的那个词。",
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
        `**${right}** repeats what another word in *${shown}* already means, so it can go.`,
        `**${right}** 重复了句中另一个词的意思，可以删去。`,
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
        "Wordy sentences hide their point under phrases such as *due to the fact that* (*because*), *at this point in time* (*now*) and *in order to* (*to*). Revise them by replacing a long phrase with one exact word and by cutting repeats. A good revision is shorter **and keeps the meaning**; it does not drop a fact or change who did what.",
        "啰唆的句子把要点藏在 *due to the fact that*（*because*）、*at this point in time*（*now*）、*in order to*（*to*）这样的短语里。修改时，用一个准确的词代替长短语，并删去重复的部分。好的修改更短，**并且保留原意**；不会丢掉事实，也不会改变谁做了什么。",
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
      (right) => [`**${right}** is shorter, but it keeps every fact of the original.`, `**${right}** 更短，但保留了原句的每个事实。`],
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
