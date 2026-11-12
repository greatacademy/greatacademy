// Grade 7: reading of the later units: text and diagrams, correlation and cause, points of view, dialogue, speeches,
// loaded language, a scientific idea over time, observation and inference, and the techniques of advertising.

import type { TopicDef } from "@ga/content";
import { drawn, fourVisuals } from "../../figures.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const diagrams = topic("reading", {
  id: "integrating-text-and-diagrams",
  title: ["Integrating Text and Diagrams", "结合文字与图示"],
  summary: [
    "Diagrams, flow charts and tables carry information that words alone carry poorly; good readers move between the text and the visual.",
    "图示、流程图和表格承载着单靠文字难以表达的信息；好的读者会在文字和图像之间来回参照。",
  ],
  after: ["text-features-in-science"],
  points: [
    label(
      "which-visual-helps",
      ["Which Visual Helps", "哪种图示有帮助"],
      [
        "Each kind of visual does a different job. A **labeled diagram** shows the parts of a thing and where they are. A **flow chart** shows the steps of a process in order, with arrows. A **cycle diagram** shows steps that come back to the start and repeat. A **cross-section** shows the inside of a thing as if it were cut open.",
        "每种图示的作用不同。**标注图**显示一件东西的各个部分及其位置。**流程图**用箭头按顺序显示一个过程的步骤。**循环图**显示回到起点并不断重复的步骤。**剖面图**显示一件东西的内部，好像把它切开了一样。",
      ],
      ["Which visual would best help a reader understand this?", "哪种图示最能帮助读者理解这一点？"],
      `
        the names and places of the parts of a bicycle|a labeled diagram
        the steps a business takes to turn an idea into a product on the shelf|a flow chart
        how money moves from families to businesses as spending and back to families as wages|a cycle diagram
        what the inside of a coin-making machine looks like|a cross-section
        where the buttons and screens are on a cash register|a labeled diagram
        the steps of applying for a bank loan|a flow chart
        how a crop is planted, grown, harvested and planted again each year|a cycle diagram
        the layers inside a bank vault door|a cross-section
        the parts of a paper bill and its security features|a labeled diagram
        what happens step by step when you pay with a card|a flow chart
        how paper is used, recycled into pulp and made into new paper|a cycle diagram
        the inside of an ATM, with its money trays and motors|a cross-section
        the parts of a market stall and what each one is for|a labeled diagram
        the steps of starting a small business|a flow chart
        how a business earns money, spends it on supplies and earns more again|a cycle diagram
        the inside of a piggy bank with its coin slot and stopper|a cross-section
        the parts of a shop's receipt|a labeled diagram
        the order of decisions when choosing what to buy|a flow chart
        the seasons of a farmer's year that repeat every year|a cycle diagram
        what lies inside the walls of an old bank building|a cross-section
        the parts of a cheque and what goes on each line|a labeled diagram
        how a new law on prices goes from an idea to a vote|a flow chart
        how water evaporates, forms clouds, falls as rain and evaporates again|a cycle diagram
        the inside of a vending machine|a cross-section
        the parts of a ship that carried goods for trade|a labeled diagram
        the steps for returning a broken toy to a store|a flow chart
        how a used bottle is collected, melted, made into a new bottle and sold again|a cycle diagram
        the inside of a gold mine, from the surface down to the deepest tunnel|a cross-section
        the parts of a price tag|a labeled diagram
        the steps a factory follows to make a pair of shoes|a flow chart
      `,
      {
        "a labeled diagram": L(
          "标注图",
          "The reader needs to see the parts of a thing and where they are, which a labeled diagram shows.",
          "读者需要看到一件东西的各部分及其位置，标注图能显示这一点。",
          "This is not about naming the parts of a thing and where they are.",
          "这与说出一件东西的各部分及其位置无关。",
        ),
        "a flow chart": L(
          "流程图",
          "The reader needs the steps of a process in order, from start to finish, which a flow chart shows.",
          "读者需要按顺序了解一个过程从开始到结束的步骤，流程图能显示这一点。",
          "This is not a series of steps that go from start to finish.",
          "这不是从开始到结束的一系列步骤。",
        ),
        "a cycle diagram": L(
          "循环图",
          "The steps come back to where they started and repeat, which a cycle diagram shows.",
          "这些步骤回到起点并不断重复，循环图能显示这一点。",
          "These steps do not come back to the start and repeat.",
          "这些步骤并不会回到起点并重复。",
        ),
        "a cross-section": L(
          "剖面图",
          "The reader needs to see inside the thing, as if it were cut open, which a cross-section shows.",
          "读者需要看到东西的内部，好像把它切开一样，剖面图能显示这一点。",
          "This is not about seeing the inside of a thing.",
          "这与看到一件东西的内部无关。",
        ),
      },
    ),
    label(
      "text-or-visual",
      ["Text or Visual", "文字还是图像"],
      [
        "Writers decide what to put in words and what to put in a visual. **Words** are best for reasons, opinions and explanations of why. A **diagram** is best for showing shape, position and how parts fit together. A **table** is best for many exact numbers that readers will compare. Ask yourself which form makes the information easiest to understand.",
        '作者要决定哪些内容用文字表达，哪些用图像表达。**文字**最适合表达原因、观点和对"为什么"的解释。**图示**最适合显示形状、位置以及各部分如何组合在一起。**表格**最适合读者要比较的许多精确数字。问问自己：哪种形式最容易让人理解这些信息？',
      ],
      ["Where is this information best given?", "这条信息最适合用哪种形式给出？"],
      `
        why prices rise when many people want the same thing|in the text
        how the gears inside a cash register fit together|in a diagram
        the prices of twenty items at four different stores|in a table
        the author's opinion about whether allowances teach children to save|in the text
        where the security strip and watermark are on a banknote|in a diagram
        the interest rates of ten banks over five years|in a table
        the reasons a business might fail in its first year|in the text
        the shape and parts of an ancient coin|in a diagram
        the population and income of twelve cities|in a table
        why people trade instead of making everything themselves|in the text
        the layout of a market with stalls, paths and entrances|in a diagram
        the number of hours worked and the pay for each job in a list of thirty jobs|in a table
        how a sales tax affects poor families more than rich ones|in the text
        how the parts of a scale balance a weight against goods|in a diagram
        each month's spending on rent, food and transport for a year|in a table
        what the author learned from running a lemonade stand|in the text
        where each department sits on the floor of a large store|in a diagram
        the exchange rates of fifteen currencies|in a table
        why saving early makes money grow faster|in the text
        how a water wheel turned a mill to grind grain|in a diagram
        the profit of a shop in each of the last ten years|in a table
        an argument that the town should build a farmers' market|in the text
        the parts of a sailing ship that carried goods|in a diagram
        the costs of five phones and the features of each|in a table
        why some goods cost more in winter|in the text
        the arrangement of shelves in a warehouse|in a diagram
        the prices of bread in six countries over twenty years|in a table
        how the author's grandmother saved for her first shop|in the text
        the path a package takes through a sorting center|in a diagram
        the scores of eight brands of shoes in a product test|in a table
      `,
      {
        "in the text": L(
          "用文字",
          "Reasons, opinions, stories and explanations of why are best given in words.",
          '原因、观点、故事和对"为什么"的解释最适合用文字表达。',
          "This information is not a reason, an opinion or an explanation, so words are not the best form.",
          "这条信息不是原因、观点或解释，所以文字不是最好的形式。",
        ),
        "in a diagram": L(
          "用图示",
          "Shape, position and how parts fit together are easiest to understand when you can see them.",
          "形状、位置以及各部分如何组合在一起，看得见时最容易理解。",
          "This information is not about shape or position, so a diagram is not the best form.",
          "这条信息与形状或位置无关，所以图示不是最好的形式。",
        ),
        "in a table": L(
          "用表格",
          "Many exact numbers that readers will compare are easiest to read in rows and columns.",
          "读者要比较的许多精确数字，排成行和列最容易读。",
          "This information is not a set of numbers to compare, so a table is not the best form.",
          "这条信息不是要比较的一组数字，所以表格不是最好的形式。",
        ),
      },
    ),
  ],
});

const correlation = topic("reading", {
  id: "correlation-or-cause",
  title: ["Correlation or Cause", "相关还是因果"],
  summary: [
    "Two things that happen together do not always cause each other; a third thing may cause both, or the link may be chance, and only a fair test can show a cause.",
    "同时发生的两件事并不一定互为因果；可能有第三件事导致了两者，或者两者的联系只是巧合；只有公平的检验才能证明因果关系。",
  ],
  after: ["cause-and-effect-in-texts", "reading-graphs-in-science"],
  points: [
    label(
      "what-explains-the-link",
      ["What Explains the Link", "如何解释这种联系"],
      [
        "When two things rise and fall together, they are **correlated**. Sometimes **one causes the other**: more rain makes more puddles. Often **a third thing causes both**: ice cream sales and sunburns both rise because of hot weather. And sometimes the link is **only a coincidence**: two numbers happen to move together for no reason at all.",
        "当两件事一起增减时，它们是**相关的**。有时是**一方导致另一方**：雨多了，水坑就多了。常常是**第三件事导致了两者**：冰淇淋销量和晒伤人数都上升，是因为天气炎热。有时这种联系**只是巧合**：两个数字恰好一起变化，毫无原因。",
      ],
      ["What best explains the link?", "什么最能解释这种联系？"],
      `
        More rain fell, and more puddles formed on the playground.|one causes the other
        Ice cream sales and sunburns both rise in the same months.|a third thing causes both
        The number of films an actor made each year rose and fell with the number of pirates in the news.|only a coincidence
        Shops that cut their prices sold more of their goods.|one causes the other
        Towns with more fire trucks have more fires each year.|a third thing causes both
        A team's wins went up in the same years that a far-off country grew more apples.|only a coincidence
        Students who studied longer for the test scored higher.|one causes the other
        Children with bigger feet read better than children with smaller feet.|a third thing causes both
        The price of cheese and the number of new lawyers rose together for ten years.|only a coincidence
        When the factory raised wages, more people applied for jobs there.|one causes the other
        People who carry umbrellas are more likely to have wet shoes.|a third thing causes both
        The sales of a cereal rose in the same years that a river flooded more often.|only a coincidence
        Families that saved more each month had more money at the end of the year.|one causes the other
        Cities with more libraries also have more crime.|a third thing causes both
        A singer's popularity rose in the same years as the price of copper.|only a coincidence
        When the bakery added a second oven, it baked more bread.|one causes the other
        Coat sales and cases of the flu both rise in winter.|a third thing causes both
        The number of letters in the winning word of a spelling bee matched the number of spider bites that year.|only a coincidence
        When the bus fare doubled, fewer people rode the bus.|one causes the other
        Stores that sell more sunscreen also sell more cold drinks.|a third thing causes both
        A football team's scores went up in the same years as sales of a brand of socks.|only a coincidence
        Farmers who watered their crops had larger harvests.|one causes the other
        Bigger houses tend to have more expensive cars parked outside.|a third thing causes both
        The number of TV channels rose in the same years as the height of a famous tree.|only a coincidence
        When the store put up signs for its sale, more people came in.|one causes the other
        Beach towns sell more ice cream and see more drownings in July.|a third thing causes both
        The number of rainy days in Paris matched the number of goals scored by a team in Brazil.|only a coincidence
        When the price of gas rose, people drove less.|one causes the other
        Students who eat breakfast and students who get good grades tend to come from the same homes with regular routines.|a third thing causes both
        The sales of a toy rose in the same months as the number of stars a telescope counted.|only a coincidence
      `,
      {
        "one causes the other": L(
          "一方导致另一方",
          "There is a clear way for the first thing to bring about the second.",
          "第一件事有明显的方式导致第二件事。",
          "There is no clear way for one of these to bring about the other.",
          "其中一件事没有明显的方式导致另一件事。",
        ),
        "a third thing causes both": L(
          "第三件事导致两者",
          "Something else, such as the season, age, size or money, makes both things rise together.",
          "另外的因素，如季节、年龄、大小或财富，使两者一起上升。",
          "No hidden third thing is needed to explain this link.",
          "解释这种联系并不需要一个隐藏的第三因素。",
        ),
        "only a coincidence": L(
          "只是巧合",
          "The two things have nothing to do with each other; their numbers just happened to move together.",
          "这两件事毫不相干，它们的数字只是恰好一起变化。",
          "These two things are connected, so the link is not just chance.",
          "这两件事是有联系的，所以并不只是巧合。",
        ),
      },
    ),
    label(
      "what-would-show-a-cause",
      ["What Would Show a Cause", "怎样才能证明因果"],
      [
        "To show that one thing **causes** another, scientists run a **fair test**: they change one thing on purpose, keep everything else the same and compare the results with a group that did not get the change. **A survey** only shows that two things go together. **A story** about one person shows only what happened once.",
        "要证明一件事**导致**另一件事，科学家会进行**公平检验**：有意改变一个因素，保持其他一切不变，再与没有得到这种改变的一组比较结果。**调查**只能表明两件事同时出现。关于一个人的**故事**只能说明某件事发生过一次。",
      ],
      ["What kind of evidence is this?", "这是哪一种证据？"],
      `
        Half the shops lowered their prices and half did not, and the researchers compared sales.|a fair test
        Researchers asked 500 shoppers how much they spend and how happy they are.|a survey
        One shop owner says she sold more after painting her door red.|a story
        Two groups of plants got the same light and soil, but only one got fertilizer.|a fair test
        A study asked 2,000 people whether they save money and whether they own a home.|a survey
        My uncle says he got rich because he never bought coffee.|a story
        Students were split at random into two groups, and only one group got a lesson on saving.|a fair test
        People were asked how many hours they sleep and how much they earn.|a survey
        A famous banker says she learned everything from her grandmother.|a story
        Half the classes got a longer break and half did not, and their test scores were compared.|a fair test
        A questionnaire asked families about their spending and their health.|a survey
        A man says that a lucky coin made him win the lottery.|a story
        Two identical stores tested different prices for a month and compared sales.|a fair test
        A poll asked a thousand people which store they like best and why.|a survey
        A friend says that her new shoes made her run faster.|a story
        Scientists gave one group of mice a new food and the other group the usual food.|a fair test
        Thousands of adults reported how often they exercise and how often they are sick.|a survey
        One farmer says that playing music to his cows made them give more milk.|a story
        Half the buses got new signs and half did not, and the researchers counted riders.|a fair test
        People leaving a store were asked how long they shopped and how much they spent.|a survey
        A shopkeeper says business improved after she moved the candy to the front.|a story
        Two groups of students used different study methods, and nothing else was changed.|a fair test
        A study collected the income and the number of books in the homes of many families.|a survey
        My neighbor says his tomato plants grew bigger because he talked to them.|a story
        Some towns were chosen at random to get the new tax, and the others were not.|a fair test
        Researchers asked workers about their pay and how much they like their jobs.|a survey
        An athlete says she wins every race when she wears her red socks.|a story
        One group of seeds got salt water and an identical group got fresh water.|a fair test
        People were asked whether they eat breakfast and how well they did at school.|a survey
        A writer says that he writes best after eating chocolate.|a story
      `,
      {
        "a fair test": L(
          "公平检验",
          "One thing was changed on purpose while everything else stayed the same, and the results were compared with a group without the change.",
          "有意改变了一个因素，同时其他一切保持不变，并把结果与没有这种改变的一组相比较。",
          "Nothing was changed on purpose and compared with a group without the change.",
          "并没有有意改变某个因素并与未改变的一组比较。",
        ),
        "a survey": L(
          "调查",
          "Many people were asked about two things, which can show that they go together but not that one causes the other.",
          "向许多人询问了两件事，这能表明两者同时出现，却不能证明一方导致另一方。",
          "This does not ask many people about two things.",
          "这并不是向许多人询问两件事。",
        ),
        "a story": L(
          "个人故事",
          "One person's experience shows only what happened once, which could be chance.",
          "一个人的经历只能说明某件事发生过一次，这可能是巧合。",
          "This is not just one person's experience.",
          "这不只是一个人的经历。",
        ),
      },
    ),
  ],
});

const pointsOfView = topic("reading", {
  id: "contrasting-points-of-view",
  title: ["Contrasting Points of View", "对比不同视角"],
  summary: [
    "When readers know something a character does not, the gap, called dramatic irony, creates suspense, humor or sympathy.",
    "当读者知道某个人物不知道的事情时，这种差距被称为戏剧性反讽，它能制造悬念、幽默或同情。",
  ],
  after: ["narrative-point-of-view"],
  points: [
    label(
      "who-knows-more",
      ["Who Knows More", "谁知道得更多"],
      [
        "Writers can give readers and characters different knowledge. When **the reader knows more** than a character, it is **dramatic irony**: we know the robot is a spy, but the family trusts it. Sometimes **a character knows more** than the reader, keeping a secret that the story reveals later. And sometimes **they know the same**: we discover things as the character does.",
        "作者可以让读者和人物掌握不同的信息。当**读者知道得比人物多**时，就是**戏剧性反讽**：我们知道那个机器人是间谍，而这家人却信任它。有时是**人物知道得比读者多**，守着一个故事后来才揭开的秘密。有时则是**两者知道的一样多**：我们与人物同时发现事情。",
      ],
      ["Who knows more here?", "这里谁知道得更多？"],
      `
        The reader has seen the robot send secret messages, but the family trusts it completely.|the reader knows more
        Captain Ora smiles as she gives the order; only on the last page do we learn that she planned the mutiny herself.|a character knows more
        Jin opens the door of the empty station, and we see the strange footprints at the same moment he does.|they know the same
        We know the air in the dome is running out, but the children are still playing happily.|the reader knows more
        The old scientist hums as she works, hiding a discovery the story will not reveal until the end.|a character knows more
        Mira reads the message from Earth, and we read it with her, word by word.|they know the same
        The reader knows that the friendly mayor is really an alien, but the town elects him again.|the reader knows more
        The pilot says, "Trust me," and only later do we learn he already knew about the storm.|a character knows more
        The crew hears a knock on the hull, and we wonder with them what it could be.|they know the same
        We have read the order to shut down the robots, but Unit 7 is still planning a birthday party for its owner.|the reader knows more
        Leo keeps a key in his pocket, and the narrator does not tell us what it opens until the final chapter.|a character knows more
        Nia steps out onto the new planet, and we see its purple sky for the first time with her.|they know the same
        The reader knows the ship's computer has been reprogrammed, but the captain still asks it for advice.|the reader knows more
        The quiet girl seems to know the way through the maze, but the story does not explain how until the end.|a character knows more
        The boy turns on the old radio, and we hear the strange voice with him.|they know the same
        We know the cure has been stolen, but the doctor proudly announces it to the city.|the reader knows more
        The guard nods at the prisoner; only later do we learn that he has been helping her escape.|a character knows more
        The siblings open the time capsule, and we find out what is inside when they do.|they know the same
        The reader knows the bridge has been sabotaged, but the travelers start to cross it.|the reader knows more
        The robot seems to already know what the visitor will say, and the story keeps its secret for many pages.|a character knows more
        Kai wakes up in a strange room, and we learn where he is only as he does.|they know the same
        We know that the "rescue ship" is a trap, but the stranded crew cheers as it lands.|the reader knows more
        The grandmother smiles knowingly at the map, but we are not told why until later.|a character knows more
        The class watches the screen as the first image from the probe arrives, and so do we.|they know the same
        The reader has seen the leader lie, but the citizens believe every word of his speech.|the reader knows more
        The mechanic says nothing about the noise in the engine, and we learn much later that she knew it was a bomb.|a character knows more
        Ava opens the letter, and we learn with her that she has been chosen for the mission.|they know the same
        We know the twin brothers have swapped places, but their teacher does not.|the reader knows more
        The stranger arrives knowing everyone's name, and the story does not explain how until the end.|a character knows more
        The hikers find a door in the hillside, and we discover with them where it leads.|they know the same
      `,
      {
        "the reader knows more": L(
          "读者知道得更多",
          "We know something the character does not, which is dramatic irony.",
          "我们知道人物所不知道的事情，这就是戏剧性反讽。",
          "Here the reader does not know something the character is missing.",
          "这里读者并不知道人物所不知道的事。",
        ),
        "a character knows more": L(
          "人物知道得更多",
          "A character keeps a secret that the story hides from us until later.",
          "一个人物守着一个秘密，故事直到后来才向我们揭开。",
          "Here no character is hiding something from the reader.",
          "这里没有人物向读者隐瞒什么。",
        ),
        "they know the same": L(
          "两者知道的一样多",
          "We discover things at the same moment the character does.",
          "我们与人物在同一时刻发现事情。",
          "Here the reader and the character do not learn things at the same moment.",
          "这里读者和人物并不是同时得知事情。",
        ),
      },
    ),
    label(
      "what-the-gap-creates",
      ["What the Gap Creates", "差距带来什么效果"],
      [
        "Dramatic irony makes readers feel something. When we know a danger the character does not, it creates **suspense**: we want to shout a warning. When the character's mistake is harmless and silly, it creates **humor**. When the character hopes for something we know will not happen, it creates **sympathy**: we feel sorry for them.",
        "戏剧性反讽让读者产生某种感受。当我们知道人物不知道的危险时，就产生**悬念**：我们想大声警告他。当人物的错误无伤大雅而又滑稽时，就产生**幽默**。当人物盼望着我们知道不会发生的事时，就产生**同情**：我们为他感到难过。",
      ],
      ["What does the gap between reader and character mainly create?", "读者和人物之间的差距主要带来什么效果？"],
      `
        We know the alien is hiding behind the door, and the girl reaches for the handle.|suspense
        We know the robot has been told that "break a leg" means good luck, and it tries to break the actor's leg.|humor
        We know the soldier's family has already left the planet, and he is still saving to buy them a gift.|sympathy
        We know the timer on the bomb says one minute, and the engineer stops to tie his shoe.|suspense
        We know the boy's "magic trick" is the cat moving the cup, and he bows proudly to the crowd.|humor
        We know the old dog will not come home, but the child sets out its bowl every night.|sympathy
        We know the bridge is weak, and the heavy truck begins to cross it.|suspense
        We know the uncle's "rare alien fossil" is a chicken bone, and he shows it to the museum.|humor
        We know the letter was never sent, and the girl waits by the mailbox every day.|sympathy
        We know the spy is listening, and the hero begins to explain the plan.|suspense
        We know the android thinks a hug means squeezing as hard as possible, and Grandpa opens his arms.|humor
        We know the city has been destroyed, but the travelers sing about going home.|sympathy
        We know the oxygen is almost gone, and the astronaut stops to take a photo.|suspense
        We know the visitor is the new principal, and the students tell him all the school's secrets.|humor
        We know his best friend has moved away, and the boy saves him a seat at lunch.|sympathy
        We know the floor is a trapdoor, and the thief steps forward to grab the jewel.|suspense
        We know the parrot has learned to copy the teacher's voice, and the class follows its orders.|humor
        We know the rescue ship turned back, and the stranded crew keeps the signal fire burning.|sympathy
        We know the stranger has a weapon, and the guard lets him in.|suspense
        We know the cake is made of salt instead of sugar, and the chef proudly serves it to the judges.|humor
        We know the dog is lost forever, but the girl puts up one more poster.|sympathy
        We know the ice is cracking, and the skater keeps going toward the middle of the lake.|suspense
        We know the "ghost" is the little brother under a sheet, and the older kids run away screaming.|humor
        We know the prize has already gone to someone else, and the inventor works all night to finish.|sympathy
        We know the shark is under the boat, and the diver prepares to jump in.|suspense
        We know the robot cannot taste food, and it gives a long review of the soup.|humor
        We know the mother will not return from the mission, and the girl practices her welcome-home song.|sympathy
        We know the villain has poisoned the cup, and the queen raises it to her lips.|suspense
        We know the king's "invisible cloak" is no cloak at all, and he marches through the town.|humor
        We know the old man's son is not coming, but he sets the table for two.|sympathy
      `,
      {
        suspense: L(
          "悬念",
          "We know of a danger the character cannot see, so we worry about what will happen next.",
          "我们知道人物看不见的危险，所以担心接下来会发生什么。",
          "There is no danger here that makes us worry.",
          "这里没有让我们担心的危险。",
        ),
        humor: L(
          "幽默",
          "The character's mistake is silly and harmless, so the gap makes us laugh.",
          "人物的错误滑稽而无害，所以这种差距让我们发笑。",
          "The mistake here is not silly or harmless, so it does not make us laugh.",
          "这里的错误并不滑稽或无害，所以不会让我们发笑。",
        ),
        sympathy: L(
          "同情",
          "The character hopes for something we know will not happen, so we feel sorry for them.",
          "人物盼望着我们知道不会发生的事，所以我们为他感到难过。",
          "The character here is not hoping for something sad that will not come true.",
          "这里的人物并不是在盼望一件不会实现的伤心事。",
        ),
      },
    ),
  ],
});

const dialogue = topic("reading", {
  id: "how-dialogue-reveals-character",
  title: ["How Dialogue Reveals Character", "对话如何展现人物"],
  summary: [
    "What characters say, and how they say it, shows who they are and moves the plot: revealing a secret, starting a conflict or making a decision.",
    "人物说什么、怎样说，显示出他们是什么样的人，也推动情节发展：揭开秘密、引发冲突或做出决定。",
  ],
  after: ["what-characters-say-and-think"],
  points: [
    label(
      "what-the-words-show",
      ["What the Words Show", "话语显示了什么"],
      [
        "Writers rarely tell you what a character is like; they let the character speak. Short, broken sentences and questions may show someone **nervous**. Bragging about oneself shows someone **boastful**. Offering help or comfort shows someone **kind**. Doubting and testing others shows someone **suspicious**. Listen to the words and to how they are said.",
        "作者很少直接告诉你人物是什么样的，而是让人物自己说话。短促、断断续续的句子和问题可能显示一个人**紧张**。自吹自擂显示一个人**自负**。主动帮助或安慰别人显示一个人**善良**。怀疑和试探别人显示一个人**多疑**。要听人物说了什么，也要听他怎样说。",
      ],
      ["What does this line of dialogue show about the speaker?", "这句对话显示了说话人怎样的性格？"],
      `
        "Is it—um—is it safe? Are you sure? What if the door doesn't open again?"|nervous
        "Nobody in the whole colony can fly a ship like I can. Ask anyone."|boastful
        "You look cold. Here, take my jacket; I'll be fine."|kind
        "You say you came from the north. Then why are your boots covered in red sand?"|suspicious
        "I—I didn't mean to—should I go? I'll go."|nervous
        "I built the first robot in this town, and the second, and the best one too."|boastful
        "Don't cry. We'll find your brother together, I promise."|kind
        "Funny how the alarm broke the same night you arrived."|suspicious
        "W-what was that noise? Did you hear it? Please tell me you heard it."|nervous
        "Of course I won. I always win. It's almost boring."|boastful
        "You can have the last ration. You need it more than I do."|kind
        "Who sent you? And why should I believe a word you say?"|suspicious
        "My hands are shaking. Can we wait a minute? Just one minute?"|nervous
        "They'll write songs about me one day. Mark my words."|boastful
        "Sit down and rest. I'll finish your shift tonight."|kind
        "That's the third time you've asked about the code. Why do you need it?"|suspicious
        "Sorry, sorry—I mean—is this the right room? I think I'm lost."|nervous
        "I could fix that engine with my eyes closed."|boastful
        "If you're scared, you can hold my hand on the way down."|kind
        "Show me your badge again. Slowly."|suspicious
        "What if they don't like me? What if I say the wrong thing?"|nervous
        "Smartest kid in the school? That's me, obviously."|boastful
        "I saved you a seat. I thought you might want company."|kind
        "You knew where the key was before anyone told you. How?"|suspicious
        "Um, I think—maybe—never mind. It's probably nothing."|nervous
        "Without me, this mission would have failed a hundred times."|boastful
        "Take your time. There's no rush, and I'm not going anywhere."|kind
        "Why are you being so nice to me all of a sudden?"|suspicious
        "Is everyone looking at me? Please say they're not looking."|nervous
        "I've climbed every mountain on this planet, and the hard ones twice."|boastful
      `,
      {
        nervous: L(
          "紧张",
          "The broken sentences, repeated questions and worry show that the speaker is nervous.",
          "断断续续的句子、反复的提问和担忧显示说话人很紧张。",
          "The speaker does not sound worried or unsure.",
          "说话人听起来并不担忧或犹豫。",
        ),
        boastful: L(
          "自负",
          "The speaker praises themselves and their own skill, which shows they are boastful.",
          "说话人夸耀自己和自己的本领，显示出他很自负。",
          "The speaker is not praising themselves.",
          "说话人并没有夸耀自己。",
        ),
        kind: L(
          "善良",
          "The speaker offers help, comfort or something of their own to another person, which shows kindness.",
          "说话人向别人提供帮助、安慰或自己的东西，显示出善良。",
          "The speaker is not offering help or comfort to anyone.",
          "说话人并没有向任何人提供帮助或安慰。",
        ),
        suspicious: L(
          "多疑",
          "The speaker doubts the other person and tests their story, which shows suspicion.",
          "说话人怀疑对方，试探对方的说法，显示出多疑。",
          "The speaker does not doubt or question the other person.",
          "说话人并没有怀疑或盘问对方。",
        ),
      },
    ),
    label(
      "how-dialogue-moves-the-plot",
      ["How Dialogue Moves the Plot", "对话如何推动情节"],
      [
        "Good dialogue also makes things happen. A line can **reveal a secret** that changes what everyone knows. It can **start a conflict**, with an insult, a threat or a refusal. Or it can **make a decision** that sends the story in a new direction: *We leave at dawn.*",
        "好的对话还能让事情发生。一句话可以**揭开秘密**，改变大家所知道的事。它可以**引发冲突**，如一句侮辱、一个威胁或一次拒绝。它也可以**做出决定**，让故事转向新的方向：*We leave at dawn.*",
      ],
      ["What does this line do for the plot?", "这句话对情节起什么作用？"],
      `
        "I'm not your sister. I was built in a lab three years ago."|reveals a secret
        "If you touch my ship again, you'll regret it."|starts a conflict
        "That's it. We leave for the mountains at dawn."|makes a decision
        "The captain isn't sick. She's been gone for a week, and no one told you."|reveals a secret
        "No. I won't do it, and you can't make me."|starts a conflict
        "We'll take the river route, even if it's longer."|makes a decision
        "The map you've been following is a fake. I drew it myself."|reveals a secret
        "You call that a plan? A child could do better."|starts a conflict
        "I've made up my mind. I'm going to tell the council the truth."|makes a decision
        "The water in the tanks has been poisoned for days."|reveals a secret
        "Get out of my workshop, and don't come back."|starts a conflict
        "From now on, no one leaves the dome alone."|makes a decision
        "Your father didn't die in the crash. He's alive, on the other moon."|reveals a secret
        "You've been lying to all of us, and I'm done pretending I don't know."|starts a conflict
        "Fine. We'll trust the robot, just this once."|makes a decision
        "The treasure was never in the cave. It's buried under the school."|reveals a secret
        "Say that again, and see what happens."|starts a conflict
        "Pack your bags. We're moving to the city."|makes a decision
        "I'm the one who opened the gate that night."|reveals a secret
        "This is my land, and you're not welcome on it."|starts a conflict
        "I accept the mission. When do we launch?"|makes a decision
        "The message isn't from Earth. It's coming from inside the ship."|reveals a secret
        "You took my place on the team, and I won't forget it."|starts a conflict
        "We'll split up: you search the north tunnels, and I'll take the south."|makes a decision
        "The doctor knew about the virus all along."|reveals a secret
        "I refuse to follow orders from someone like you."|starts a conflict
        "Then it's settled. We turn the ship around."|makes a decision
        "I can read minds. I always could."|reveals a secret
        "Stay away from my brother, or else."|starts a conflict
        "I'll stay behind and hold the door. Go!"|makes a decision
      `,
      {
        "reveals a secret": L(
          "揭开秘密",
          "The line tells something hidden that changes what the characters, and the reader, know.",
          "这句话说出了隐藏的事，改变了人物和读者所知道的情况。",
          "This line does not uncover anything hidden.",
          "这句话并没有揭开任何隐藏的事。",
        ),
        "starts a conflict": L(
          "引发冲突",
          "The line is an insult, a threat or a refusal that sets characters against each other.",
          "这句话是侮辱、威胁或拒绝，让人物之间产生对立。",
          "This line does not set characters against each other.",
          "这句话并没有让人物之间产生对立。",
        ),
        "makes a decision": L(
          "做出决定",
          "The line settles what will happen next and sends the story in a new direction.",
          "这句话确定了接下来要做的事，让故事转向新的方向。",
          "This line does not settle what will happen next.",
          "这句话并没有确定接下来要做的事。",
        ),
      },
    ),
  ],
});

const speeches = topic("reading", {
  id: "how-a-speaker-builds-an-argument",
  title: ["How a Speaker Builds an Argument", "演讲者如何构建论证"],
  summary: [
    "A speech moves from an opening that grabs listeners, through stories, facts and answers to objections, to a close that calls them to act.",
    "一篇演讲从抓住听众的开头出发，经过故事、事实和对反对意见的回应，到号召听众行动的结尾。",
  ],
  after: ["tracing-an-argument"],
  points: [
    label(
      "the-move-the-speaker-makes",
      ["The Move the Speaker Makes", "演讲者用了哪种手法"],
      [
        "Speakers build an argument with different **moves**. A **personal story** makes the issue human and real. A **fact or statistic** gives proof that can be checked. An **answer to an objection** names what opponents say and shows why it is wrong. A **call to action** tells listeners exactly what to do.",
        "演讲者用不同的**手法**构建论证。**个人故事**让问题变得有血有肉、真实可感。**事实或统计数字**提供可以核实的证据。**回应反对意见**说出对方的观点并说明它为什么错。**号召行动**明确告诉听众该做什么。",
      ],
      ["Which move does the speaker make here?", "演讲者在这里用了哪种手法？"],
      `
        "When I was nine, my grandmother was turned away from the polling place because she could not read."|a personal story
        "In 1960, only one in four adults in this county was allowed to vote."|a fact or statistic
        "Some say change should come slowly. But how slowly would you wait for your own rights?"|an answer to an objection
        "Write to your senator tonight, and tell her that every vote must count."|a call to action
        "I remember the day my father came home from the factory with his hands cut and bleeding."|a personal story
        "Children as young as ten worked twelve hours a day in the mills."|a fact or statistic
        "They tell us the factories cannot afford fair wages. Yet their profits doubled last year."|an answer to an objection
        "Join us on Saturday at the town hall, and bring a neighbor."|a call to action
        "My best friend was not allowed to sit with me on the bus because of the color of her skin."|a personal story
        "Women won the vote in this country only in 1920."|a fact or statistic
        "Some will say protest is impolite. Was it impolite to demand freedom?"|an answer to an objection
        "Sign the petition before you leave this room."|a call to action
        "I once watched a boy in my class hide his lunch because he had nothing in it."|a personal story
        "One in six children in this city goes to bed hungry."|a fact or statistic
        "People claim a free lunch program costs too much. It costs less than one fighter jet."|an answer to an objection
        "Vote yes on the school meal plan next Tuesday."|a call to action
        "The night the river flooded, my family lost everything we owned."|a personal story
        "The river has flooded six times in the last ten years."|a fact or statistic
        "Some say a new wall is too expensive. Rebuilding after every flood costs far more."|an answer to an objection
        "Call the mayor's office tomorrow and ask for the flood wall."|a call to action
        "My mother walked five kilometers every day to reach a school that would accept her."|a personal story
        "Today, millions of girls around the world still cannot go to school."|a fact or statistic
        "They say girls do not need an education. History proves them wrong again and again."|an answer to an objection
        "Give one dollar to the school fund, and a girl will get a book."|a call to action
        "I still remember the sound of the crowd the day the gates were opened."|a personal story
        "Forty thousand people marched on the capital that day."|a fact or statistic
        "Critics say marches change nothing. Then why did the law change a month later?"|an answer to an objection
        "Stand with us, march with us, and do not go home until it is done."|a call to action
        "When I was twelve, I was told I could not join the team because I was a girl."|a personal story
        "Since the new law, the number of girls playing school sports has grown tenfold."|a fact or statistic
      `,
      {
        "a personal story": L(
          "个人故事",
          "The speaker tells something from their own life or someone they know, which makes the issue human.",
          "演讲者讲述自己或身边人的经历，让问题变得有血有肉。",
          "This is not a story from the speaker's own life.",
          "这不是演讲者自己生活中的故事。",
        ),
        "a fact or statistic": L(
          "事实或统计数字",
          "The speaker gives a number, date or fact that listeners could check.",
          "演讲者给出听众可以核实的数字、日期或事实。",
          "This is not a fact or number that could be checked.",
          "这不是可以核实的事实或数字。",
        ),
        "an answer to an objection": L(
          "回应反对意见",
          "The speaker names what the other side says and then shows why it is wrong.",
          "演讲者说出对方的观点，然后说明它为什么错。",
          "The speaker does not name and answer what the other side says.",
          "演讲者并没有说出并回应对方的观点。",
        ),
        "a call to action": L(
          "号召行动",
          "The speaker tells listeners exactly what to do next.",
          "演讲者明确告诉听众接下来该做什么。",
          "The speaker does not tell listeners what to do.",
          "演讲者并没有告诉听众该做什么。",
        ),
      },
    ),
    label(
      "where-the-line-belongs",
      ["Where the Line Belongs", "这句话应该放在哪里"],
      [
        "Most speeches have three parts. The **opening** grabs attention and states the issue: a question, a striking image or a greeting. The **body** gives reasons, stories and evidence, one after another. The **close** sums up and leaves listeners with a strong last line, often a call to act or a hope for the future.",
        "大多数演讲有三个部分。**开头**抓住听众的注意力并提出问题：一个问题、一个引人注目的画面或一句问候。**主体**依次给出理由、故事和证据。**结尾**进行总结，留给听众一句有力的话，常常是号召行动或对未来的期望。",
      ],
      ["Where in a speech does this line most likely belong?", "这句话最可能出现在演讲的哪个部分？"],
      `
        "Friends, neighbors, fellow students: thank you for coming out in the rain tonight."|the opening
        "My second reason is that the new rule would hurt the families who can least afford it."|the body
        "So let us leave here tonight and build the town we all deserve."|the close
        "Imagine a school where every child has a seat, a book and a teacher who knows their name."|the opening
        "Studies from three states show that smaller classes raise reading scores."|the body
        "The future is not something we wait for; it is something we make, starting tomorrow."|the close
        "What would you do if someone told you that your voice did not count?"|the opening
        "In 1965, a new law finally protected the right to vote, but only after years of struggle."|the body
        "Remember this day, and remember that we did not give up."|the close
        "I stand before you today as the daughter of a farmer and a factory worker."|the opening
        "Another reason is that the park is the only green space in our neighborhood."|the body
        "Together, we can make sure that our children inherit a better world."|the close
        "Good morning. I want to talk to you about something that keeps me awake at night."|the opening
        "For example, my cousin waited two years for a place at the clinic."|the body
        "Go home, talk to your families, and vote on Tuesday."|the close
        "Look around this room. One in five of us will be affected by this law."|the opening
        "Opponents argue that the plan is too costly, but the numbers tell a different story."|the body
        "The choice is ours, and the time is now."|the close
        "Thank you, Principal Ortiz, and thank you all for listening."|the opening
        "First, the longer lunch would give students time to eat properly."|the body
        "Let this be the year we finally listen to the people we serve."|the close
        "Picture a city where no one sleeps on the street."|the opening
        "The shelter served 3,000 meals last month, twice as many as last year."|the body
        "If not us, then who? If not now, then when?"|the close
        "Fellow citizens, we have gathered today because our river is dying."|the opening
        "A second problem is the waste that factories pour into the water."|the body
        "Let our grandchildren swim in this river and know that we fought for it."|the close
        "Have you ever been told you were too young to make a difference?"|the opening
        "In my own school, students raised enough money to build a well in Kenya."|the body
        "Never let anyone tell you that you are too young to change the world."|the close
      `,
      {
        "the opening": L(
          "开头",
          "The line greets listeners, asks a question or paints a picture to grab attention and introduce the issue.",
          "这句话问候听众、提出问题或描绘画面，以吸引注意并引出问题。",
          "This line does not greet listeners or introduce the issue.",
          "这句话并没有问候听众或引出问题。",
        ),
        "the body": L(
          "主体",
          "The line gives a reason, an example, a fact or an answer to an objection, which belong in the body.",
          "这句话给出理由、例子、事实或对反对意见的回应，这些属于主体部分。",
          "This line does not give a reason or a piece of evidence.",
          "这句话并没有给出理由或证据。",
        ),
        "the close": L(
          "结尾",
          "The line sums up and leaves a strong last thought or a call to act, which ends a speech.",
          "这句话进行总结，留下有力的最后想法或号召行动，这是演讲的结尾。",
          "This line does not sum up or leave a final thought.",
          "这句话并没有总结或留下最后的想法。",
        ),
      },
    ),
  ],
});

const loaded = topic("reading", {
  id: "loaded-language",
  title: ["Loaded Language", "带倾向性的语言"],
  summary: [
    "Loaded words carry strong positive or negative feelings that push readers to take a side; neutral words describe without judging.",
    "带倾向性的词带有强烈的正面或负面感情，促使读者站队；中性的词只描述，不评判。",
  ],
  after: ["word-choice-and-meaning"],
  points: [
    label(
      "neutral-or-loaded",
      ["Neutral or Loaded", "中性还是带倾向性"],
      [
        "Writers who want to persuade often choose **loaded** words, words with strong feelings attached. The same people can be *heroes* (**loaded in favor**), *protesters* (**neutral**) or *a mob* (**loaded against**). When you read news or speeches, notice the words that try to make you feel something, and ask what a neutral word would be.",
        "想要说服别人的作者常常选用**带倾向性的**词，也就是附带强烈感情的词。同样一群人，可以被称作 *heroes*（**褒义倾向**）、*protesters*（**中性**）或 *a mob*（**贬义倾向**）。阅读新闻或演讲时，要留意那些试图让你产生某种感受的词，并想一想中性的说法是什么。",
      ],
      ["How is the word in italics used?", "斜体词是怎样使用的？"],
      `
        A *crowd* gathered outside the courthouse.|neutral
        A *mob* gathered outside the courthouse.|loaded against
        *Brave defenders of freedom* gathered outside the courthouse.|loaded in favor
        The council *changed* the rule.|neutral
        The council *rammed through* the rule.|loaded against
        The council *wisely reformed* the rule.|loaded in favor
        The mayor *spoke* about the plan.|neutral
        The mayor *ranted* about the plan.|loaded against
        The mayor *inspired the city* with the plan.|loaded in favor
        The company *reduced* its staff.|neutral
        The company *ruthlessly axed* its staff.|loaded against
        The company *bravely streamlined* its staff.|loaded in favor
        The senator *proposed* a new tax.|neutral
        The senator *slapped* a new tax on families.|loaded against
        The senator *championed* a fair new tax.|loaded in favor
        The students *protested* the decision.|neutral
        The students *threw a tantrum* over the decision.|loaded against
        The students *courageously stood up to* the decision.|loaded in favor
        The government *collected* the data.|neutral
        The government *spied on* the people to get the data.|loaded against
        The government *carefully gathered* the data.|loaded in favor
        The leader *made a statement*.|neutral
        The leader *spewed* a statement.|loaded against
        The leader *delivered a powerful message*.|loaded in favor
        The group *met* to discuss the issue.|neutral
        The group *plotted* in secret about the issue.|loaded against
        The group *united* to tackle the issue.|loaded in favor
        The city *built* a new highway.|neutral
        The city *bulldozed homes* for a new highway.|loaded against
        The city *proudly opened* a new highway.|loaded in favor
      `,
      {
        neutral: L(
          "中性",
          "The word simply describes what happened, without pushing the reader to like or dislike it.",
          "这个词只是描述发生了什么，没有促使读者喜欢或厌恶它。",
          "This word carries a feeling, so it is not neutral.",
          "这个词带有感情，所以不是中性的。",
        ),
        "loaded in favor": L(
          "褒义倾向",
          "The words carry warm, admiring feelings that push the reader to approve.",
          "这些词带有温暖、赞赏的感情，促使读者表示赞同。",
          "These words do not push the reader to approve.",
          "这些词并没有促使读者表示赞同。",
        ),
        "loaded against": L(
          "贬义倾向",
          "The words carry ugly, angry feelings that push the reader to disapprove.",
          "这些词带有难听、愤怒的感情，促使读者表示反对。",
          "These words do not push the reader to disapprove.",
          "这些词并没有促使读者表示反对。",
        ),
      },
    ),
    choose(
      "finding-the-neutral-word",
      ["Finding the Neutral Word", "找出中性的词"],
      [
        "To read a loaded text fairly, translate its loaded words into neutral ones. *Scheme* becomes *plan*; *regime* becomes *government*; *cronies* becomes *advisers*; *handout* becomes *payment*. The neutral word names the same thing without telling you how to feel about it.",
        "要公正地阅读一篇带倾向性的文章，就要把其中带倾向性的词换成中性的词。*scheme* 换成 *plan*；*regime* 换成 *government*；*cronies* 换成 *advisers*；*handout* 换成 *payment*。中性的词说的是同一件事，却不告诉你该有什么感受。",
      ],
      ["Which word is a neutral replacement for the loaded word?", "哪个词是这个带倾向性的词的中性替换词？"],
      `
        scheme|plan|plot|trick
        regime|government|dictatorship|tyranny
        cronies|advisers|henchmen|stooges
        handout|payment|freebie|charity
        mob|crowd|rabble|gang
        rant|speech|tirade|outburst
        stubborn|determined|pigheaded|mulish
        cheap|inexpensive|shoddy|trashy
        nosy|curious|prying|meddling
        propaganda|information|lies|spin
        scrawny|thin|bony|skeletal
        reckless|bold|careless|wild
        snooping|looking|spying|prying
        gossip|news|rumor|scandal
        lazy|relaxed|idle|sluggish
        bossy|firm|domineering|pushy
        smirk|smile|sneer|leer
        cronyism|friendship|favoritism|nepotism
        shack|house|hovel|hut
        stench|smell|reek|stink
        horde|group|swarm|pack
        meddle|take part|interfere|intrude
        demand|ask|insist|order
        greedy|ambitious|grasping|selfish
        fanatic|supporter|zealot|extremist
        brainwash|teach|indoctrinate|program
        junk|items|garbage|trash
        clique|group|gang|faction
        gimmick|feature|trick|ploy
        loophole|exception|dodge|trick
      `,
      (right, shown) => [
        `**${right}** names the same thing as *${shown}*, but without the strong feeling that pushes the reader to take a side.`,
        `**${right}** 与 *${shown}* 指的是同一件事，却没有促使读者站队的强烈感情。`,
      ],
      [
        ["*{wrong}* is still loaded, carrying a strong negative feeling.", "*{wrong}* 仍然带有倾向性，附带强烈的负面感情。"],
        ["*{wrong}* is just as loaded as the word it replaces, or even more so.", "*{wrong}* 与它要替换的词一样带有倾向性，甚至更强。"],
      ],
    ),
  ],
});

const scientificIdea = topic("reading", {
  id: "tracing-a-scientific-idea-over-time",
  title: ["Tracing a Scientific Idea over Time", "追溯一个科学观念的演变"],
  summary: [
    "Scientific ideas change when new tools, new observations or failed predictions appear, and each new idea keeps, revises or drops what came before.",
    "当出现新工具、新观察或预测失败时，科学观念就会改变；每个新观念都会保留、修正或抛弃之前的观念。",
  ],
  after: ["how-an-idea-is-developed", "reading-a-timeline"],
  points: [
    label(
      "what-led-to-the-change",
      ["What Led to the Change", "是什么导致了改变"],
      [
        "Science moves forward when something new forces people to rethink. **A new tool**, such as the wind tunnel or the telescope, lets scientists measure what they could not before. **A new observation**, something noticed in nature or in a test, does not fit the old idea. **A failed prediction**, when the old idea says one thing will happen and something else does, shows that the idea must change.",
        "当有新的东西迫使人们重新思考时，科学就会进步。**新工具**，如风洞或望远镜，让科学家能测量以前无法测量的东西。**新观察**，即在自然中或实验中注意到的某种现象，与旧观念不符。**预测失败**，即旧观念说会发生一件事而实际发生了另一件事，表明这个观念必须改变。",
      ],
      ["What led to the change in the idea?", "是什么导致了观念的改变？"],
      `
        The Wright brothers built a wind tunnel and found that the old tables of lift were wrong.|a new tool
        Watching buzzards twist their wingtips to turn, Wilbur Wright saw a new way to steer.|a new observation
        Early tables said their glider would lift easily, but it barely rose off the sand.|a failed prediction
        High-speed cameras showed that a bee's wings move in a way no one had expected.|a new tool
        Engineers noticed that flat wings worked less well than curved ones, as birds' wings are.|a new observation
        The theory said the plane would stay level at that speed, but it went into a spin.|a failed prediction
        A new kind of air-speed meter let pilots measure exactly how fast they were flying.|a new tool
        Pilots noticed ice forming on their wings and the planes growing heavy.|a new observation
        The designers expected the new wing to be faster, but it shook so hard it nearly broke apart.|a failed prediction
        Radar let scientists track storms that pilots had never been able to see.|a new tool
        A balloonist noticed that the air grew colder the higher he rose.|a new observation
        Engineers predicted the jet would break the sound barrier smoothly, but the controls froze.|a failed prediction
        Computers let designers test thousands of wing shapes without building any.|a new tool
        Scientists noticed that seeds of some trees spin like tiny helicopters as they fall.|a new observation
        The old idea said heavier planes could not fly, but the heavy airliner rose easily.|a failed prediction
        Satellites gave a view of the winds high above the Earth for the first time.|a new tool
        Watching a seagull hang still in the wind, a scientist began to study gliding.|a new observation
        The theory predicted that the propeller would push harder, but it pushed less.|a failed prediction
        A smoke machine in the tunnel let researchers see how air flowed over the wing.|a new tool
        Pilots reported that their compasses spun wildly near certain mountains.|a new observation
        Lilienthal expected his glider to stay steady in the gust, but it crashed.|a failed prediction
        Sensors on the wings recorded the pressure at every point during a flight.|a new tool
        Engineers noticed that small bumps on a wing made the air flow more smoothly.|a new observation
        The test said the plane could carry ten tons, but it could not lift eight.|a failed prediction
        Microscopes showed the tiny grooves on an owl's feathers that make its flight silent.|a new tool
        Observers noticed that geese flying in a V use less energy than geese flying alone.|a new observation
        Scientists predicted that the balloon would rise forever, but it stopped and drifted.|a failed prediction
        A new rocket engine let engineers test speeds that no plane had reached.|a new tool
        Pilots noticed that their planes shook more on hot days than on cold ones.|a new observation
        The model plane was supposed to glide for a minute, but it fell after ten seconds.|a failed prediction
      `,
      {
        "a new tool": L(
          "新工具",
          "A new instrument or machine let people measure or see what they could not before.",
          "一种新的仪器或机器让人们能够测量或看到以前无法测量或看到的东西。",
          "The change here did not come from a new instrument or machine.",
          "这里的改变并不是来自新的仪器或机器。",
        ),
        "a new observation": L(
          "新观察",
          "Someone noticed something in nature or in flight that the old idea did not explain.",
          "有人在自然中或飞行中注意到旧观念无法解释的现象。",
          "The change here did not come from noticing something new.",
          "这里的改变并不是来自注意到新的现象。",
        ),
        "a failed prediction": L(
          "预测失败",
          "The old idea said one thing would happen, and something else happened instead.",
          "旧观念说会发生一件事，实际发生的却是另一件事。",
          "The change here did not come from a prediction that turned out wrong.",
          "这里的改变并不是来自一个落空的预测。",
        ),
      },
    ),
    label(
      "kept-revised-or-dropped",
      ["Kept, Revised or Dropped", "保留、修正还是抛弃"],
      [
        "When a new idea arrives, it treats the old one in one of three ways. Sometimes the old idea is **kept**: later scientists confirm it and build on it. Sometimes it is **revised**: the core stays, but a part is corrected or limited. And sometimes it is **dropped**: the new evidence shows it was simply wrong.",
        "当新观念出现时，它会用三种方式之一来对待旧观念。有时旧观念被**保留**：后来的科学家证实了它，并在此基础上继续发展。有时它被**修正**：核心保留下来，但某一部分被纠正或加以限定。有时它被**抛弃**：新的证据表明它根本就是错的。",
      ],
      ["What happened to the older idea?", "旧观念怎么样了？"],
      `
        Cayley said a plane needs separate parts for lift, push and control; every plane since has followed this.|kept
        Early writers said flapping wings like a bird's were needed to fly; fixed-wing planes proved them wrong.|dropped
        The old lift tables were mostly right, but the Wrights corrected one number that was too high.|revised
        Newton's laws of motion are still used to plan every flight today.|kept
        People once thought that only things lighter than air could fly; heavy airplanes showed this was false.|dropped
        The idea that curved wings give more lift was kept, but engineers learned it works only up to a certain angle.|revised
        Bernoulli's idea about air pressure is still taught as part of how wings work.|kept
        Some thought that humans would never fly faster than sound; test pilots broke that limit in 1947.|dropped
        The early rule for wing size was kept for small planes but changed for very large ones.|revised
        The Wrights' idea of twisting the wings to steer was kept and became today's ailerons.|kept
        An old belief held that the air high up was empty of wind; balloon flights proved it false.|dropped
        The first theory of drag was correct at low speeds but had to be changed for jets.|revised
        Lilienthal's idea that gliders should be tested before engines were added is still followed.|kept
        Some engineers said metal planes would be too heavy to fly; metal airliners fly every day.|dropped
        The old idea that propellers work like screws was kept in part but improved with the idea that they are spinning wings.|revised
        The idea that birds' hollow bones help them fly is still accepted.|kept
        People once believed that flying too high would make pilots go blind; it did not.|dropped
        The rule that a heavier plane needs a longer runway was kept, but the exact numbers were updated.|revised
        The idea that streamlined shapes cut through the air with less drag is still used in every design.|kept
        An early inventor claimed feathers glued to arms would let a man fly; it never worked.|dropped
        The weather rules for pilots were kept but rewritten once radar could see storms.|revised
        The idea that gravity pulls every plane down is as true today as when it was first stated.|kept
        Some scientists said rockets could not work in space because there is no air to push on; they were wrong.|dropped
        The early idea of using a tail to keep a plane steady was kept, though its shape was changed many times.|revised
        Cayley's design of a fixed wing for lift is still the basis of airplanes today.|kept
        An old idea said that people could not breathe at high speeds; fast trains and planes proved it false.|dropped
        The first map of the jet stream was kept but corrected as satellites gave more data.|revised
        The idea that air has weight, first shown centuries ago, is still the starting point of flight science.|kept
        People once thought a giant flying machine would need flapping oars; no successful plane used them.|dropped
        The old idea of a glider's best angle was kept but adjusted for different wing shapes.|revised
      `,
      {
        kept: L(
          "保留",
          "Later scientists confirmed the older idea and still use it, so it was kept.",
          "后来的科学家证实了旧观念，至今仍在使用，所以它被保留了。",
          "The older idea was not simply confirmed and kept.",
          "旧观念并不是简单地被证实并保留下来。",
        ),
        revised: L(
          "修正",
          "The heart of the older idea stayed, but part of it was corrected or limited.",
          "旧观念的核心保留了下来，但其中一部分被纠正或加以限定。",
          "The older idea was not partly kept and partly corrected.",
          "旧观念并不是部分保留、部分修正。",
        ),
        dropped: L(
          "抛弃",
          "New evidence showed the older idea was simply wrong, so it was dropped.",
          "新证据表明旧观念根本就是错的，所以它被抛弃了。",
          "The older idea was not shown to be simply wrong.",
          "旧观念并没有被证明完全错误。",
        ),
      },
    ),
  ],
});

const observation = topic("reading", {
  id: "distinguishing-observation-and-inference",
  title: ["Observation and Inference", "观察与推断"],
  summary: [
    "An observation is what was seen or measured; an inference is a conclusion drawn from it; a prediction says what will happen next, and good inferences stay close to the evidence.",
    "观察是看到或测量到的东西；推断是从观察中得出的结论；预测说明接下来会发生什么；好的推断不会远离证据。",
  ],
  after: ["making-inferences", "reading-about-an-experiment"],
  points: [
    label(
      "observation-inference-or-prediction",
      ["Observation, Inference or Prediction", "观察、推断还是预测"],
      [
        "Science writing mixes three kinds of statements. An **observation** reports what was seen, heard or measured: *The paper plane flew 6 meters.* An **inference** explains what the observations mean: *The longer wings gave it more lift.* A **prediction** says what will happen in a test not yet done: *A plane with even longer wings will fly farther.*",
        "科学写作中混合着三种陈述。**观察**报告看到、听到或测量到的东西：*The paper plane flew 6 meters.* **推断**解释观察结果意味着什么：*The longer wings gave it more lift.* **预测**说明在尚未进行的检验中会发生什么：*A plane with even longer wings will fly farther.*",
      ],
      ["What kind of statement is this?", "这是哪一种陈述？"],
      `
        The paper plane flew 6 meters before it landed.|an observation
        The longer wings probably gave the plane more lift.|an inference
        A plane with even longer wings will fly farther.|a prediction
        The kite rose to 30 meters in a wind of 20 kilometers an hour.|an observation
        The kite flew higher because the wind was stronger.|an inference
        If the wind doubles, the kite will rise even higher.|a prediction
        The balloon shrank when we put it in the freezer.|an observation
        The cold air inside the balloon must take up less space.|an inference
        A balloon left in the sun will grow larger.|a prediction
        The heavier glider landed four seconds sooner than the lighter one.|an observation
        Extra weight seems to pull a glider down faster.|an inference
        Adding another coin will make it land sooner still.|a prediction
        The paper helicopter spun as it fell.|an observation
        The bent blades probably catch the air and make it turn.|an inference
        With longer blades, it will spin more slowly.|a prediction
        The bird flapped its wings twelve times in five seconds.|an observation
        The bird was likely trying to gain height quickly.|an inference
        When it reaches the warm air above the field, it will stop flapping.|a prediction
        The smoke curled upward over the top of the wing.|an observation
        The air must move faster over the curved top.|an inference
        A flatter wing will show less curling smoke.|a prediction
        The model plane turned left every time it was thrown.|an observation
        One wing is probably bent more than the other.|an inference
        If we straighten the wing, it will fly straight.|a prediction
        The thermometer on the plane read minus 40 degrees at 10,000 meters.|an observation
        The air gets colder as you go higher.|an inference
        At 12,000 meters, the temperature will be even lower.|a prediction
        The parachute with holes fell more slowly than the one without.|an observation
        The holes seem to keep the parachute steady.|an inference
        A parachute with more holes will fall even more steadily.|a prediction
      `,
      {
        "an observation": L(
          "观察",
          "The statement reports only what was seen or measured, with no explanation.",
          "这个陈述只报告看到或测量到的东西，没有解释。",
          "This statement does more than report what was seen or measured.",
          "这个陈述的内容不只是报告看到或测量到的东西。",
        ),
        "an inference": L(
          "推断",
          "The statement explains what the observations mean, often with words like probably, must or seems.",
          "这个陈述解释观察结果意味着什么，常带有 probably、must 或 seems 这样的词。",
          "This statement does not explain what the observations mean.",
          "这个陈述并没有解释观察结果意味着什么。",
        ),
        "a prediction": L(
          "预测",
          "The statement says what will happen in a test that has not yet been done.",
          "这个陈述说明在尚未进行的检验中会发生什么。",
          "This statement is not about a test that has not yet been done.",
          "这个陈述与尚未进行的检验无关。",
        ),
      },
    ),
    label(
      "a-fair-inference",
      ["A Fair Inference", "合理的推断"],
      [
        "Not every inference is a good one. A **reasonable inference** explains the observation and stays close to it. An inference **goes beyond the evidence** when it claims much more than one test could show. And a statement that **only restates the observation** in other words is not an inference at all: it adds no explanation.",
        "并不是每个推断都是好的推断。**合理的推断**能解释观察结果，并且不远离它。当推断声称的内容远远超出一次检验所能证明的范围时，它就**超出了证据**。而用别的话**只是重述观察结果**的陈述根本不是推断：它没有增加任何解释。",
      ],
      ["How good is this inference?", "这个推断怎么样？"],
      `
        Observation: The plane with bigger wings flew farther. Inference: Bigger wings may give more lift.|a reasonable inference
        Observation: The plane with bigger wings flew farther. Inference: Bigger wings are the secret to all flight.|goes beyond the evidence
        Observation: The plane with bigger wings flew farther. Inference: The plane that flew farther had bigger wings.|only restates the observation
        Observation: The kite flew higher in the stronger wind. Inference: Stronger wind may lift the kite more.|a reasonable inference
        Observation: The kite flew higher in the stronger wind. Inference: Wind is the only thing that matters for kites.|goes beyond the evidence
        Observation: The kite flew higher in the stronger wind. Inference: When the wind was stronger, the kite was higher.|only restates the observation
        Observation: The heavy glider landed sooner. Inference: Extra weight may make a glider sink faster.|a reasonable inference
        Observation: The heavy glider landed sooner. Inference: Heavy things can never fly.|goes beyond the evidence
        Observation: The heavy glider landed sooner. Inference: The glider that landed sooner was the heavy one.|only restates the observation
        Observation: The balloon grew in the sun. Inference: Warm air inside may take up more space.|a reasonable inference
        Observation: The balloon grew in the sun. Inference: The sun makes everything grow.|goes beyond the evidence
        Observation: The balloon grew in the sun. Inference: In the sun, the balloon got bigger.|only restates the observation
        Observation: The bird stopped flapping in the warm air. Inference: Rising warm air may hold the bird up.|a reasonable inference
        Observation: The bird stopped flapping in the warm air. Inference: All birds can fly forever without flapping.|goes beyond the evidence
        Observation: The bird stopped flapping in the warm air. Inference: The bird did not flap when the air was warm.|only restates the observation
        Observation: The paper helicopter with longer blades fell more slowly. Inference: Longer blades may catch more air.|a reasonable inference
        Observation: The paper helicopter with longer blades fell more slowly. Inference: Real helicopters need no engine.|goes beyond the evidence
        Observation: The paper helicopter with longer blades fell more slowly. Inference: The slower helicopter had the longer blades.|only restates the observation
        Observation: The plane turned left every throw. Inference: One wing may be bent.|a reasonable inference
        Observation: The plane turned left every throw. Inference: All paper planes turn left.|goes beyond the evidence
        Observation: The plane turned left every throw. Inference: Each time it was thrown, the plane went left.|only restates the observation
        Observation: The parachute with holes fell more steadily. Inference: The holes may let air out evenly.|a reasonable inference
        Observation: The parachute with holes fell more steadily. Inference: Holes make every object safer.|goes beyond the evidence
        Observation: The parachute with holes fell more steadily. Inference: The steadier parachute was the one with holes.|only restates the observation
        Observation: The thermometer read lower at greater heights. Inference: The air may get colder as you rise.|a reasonable inference
        Observation: The thermometer read lower at greater heights. Inference: Space must be frozen solid.|goes beyond the evidence
        Observation: The thermometer read lower at greater heights. Inference: Higher up, the temperature reading was lower.|only restates the observation
        Observation: The smooth ball flew shorter than the dimpled one. Inference: Dimples may help a ball fly farther.|a reasonable inference
        Observation: The smooth ball flew shorter than the dimpled one. Inference: Every object should have dimples.|goes beyond the evidence
        Observation: The smooth ball flew shorter than the dimpled one. Inference: The dimpled ball flew farther than the smooth one.|only restates the observation
      `,
      {
        "a reasonable inference": L(
          "合理的推断",
          "It offers a likely explanation of the observation and does not claim more than the test showed.",
          "它对观察结果给出了一个可能的解释，并没有声称超出检验所显示的内容。",
          "This inference either claims too much or explains nothing.",
          "这个推断要么说得太多，要么什么也没解释。",
        ),
        "goes beyond the evidence": L(
          "超出了证据",
          "It claims far more than one test could show, often about everything or every case.",
          "它声称的内容远远超出一次检验所能证明的，常常涉及一切或所有情况。",
          "This inference does not claim more than the test could show.",
          "这个推断并没有声称超出检验所能证明的内容。",
        ),
        "only restates the observation": L(
          "只是重述观察结果",
          "It says the same thing as the observation in other words and adds no explanation.",
          "它用别的话说了与观察结果相同的事，没有增加任何解释。",
          "This statement adds an explanation, so it does more than restate the observation.",
          "这个陈述增加了解释，所以不只是重述观察结果。",
        ),
      },
    ),
  ],
});

const ads = topic("reading", {
  id: "advertising-techniques",
  title: ["Advertising Techniques", "广告手法"],
  summary: [
    "Ads persuade with techniques such as the bandwagon, a famous face, snob appeal and fear, and they mix checkable facts with vague claims and opinions.",
    "广告用从众、名人代言、势利诉求和恐惧等手法进行说服，并把可核实的事实与含糊的说法和观点混在一起。",
  ],
  after: ["loaded-language", "authors-purpose"],
  points: [
    label(
      "naming-the-technique",
      ["Naming the Technique", "辨认广告手法"],
      [
        "Advertisers use a few techniques again and again. The **bandwagon** says everyone is buying it, so you should too. A **testimonial** uses a famous or trusted person who says they love it. **Snob appeal** says it is for special, rich or stylish people, so buying it makes you one of them. **Fear** warns that something bad will happen if you do not buy it.",
        "广告商反复使用几种手法。**从众**说人人都在买，所以你也应该买。**名人代言**用著名或可信的人说他们喜欢这件商品。**势利诉求**说它是为特别、富有或时髦的人准备的，买了它你就成了其中一员。**恐惧诉求**警告说如果你不买，就会发生不好的事。",
      ],
      ["Which technique does this ad use?", "这则广告用了哪种手法？"],
      `
        "Join the millions who already drink FizzUp every day!"|the bandwagon
        "Olympic champion Maya Cruz never runs without her SwiftStep shoes."|a testimonial
        "The Luxe watch: made for the few who expect the very best."|snob appeal
        "Is your home really safe tonight? Without a LockMax alarm, you can't be sure."|fear
        "Everyone at school has a Zapp phone. Don't be the only one without it."|the bandwagon
        "Famous chef Leo Park says, 'I cook only with Golden Grove oil.'"|a testimonial
        "Velvet Club cards: not everyone qualifies."|snob appeal
        "Germs are everywhere. Protect your family with CleanAll spray."|fear
        "Over a million families have switched to BrightBank. What are you waiting for?"|the bandwagon
        "Pop star Jade says, 'I never leave home without Shine lip gloss.'"|a testimonial
        "Royal Estates: homes for those who have truly arrived."|snob appeal
        "Don't let a cavity ruin your smile. Use GuardTooth twice a day."|fear
        "The whole town is talking about the new Burger Barn. Come see why!"|the bandwagon
        "Doctor Amy Lin, a heart surgeon, takes VitaPlus every morning."|a testimonial
        "Diamond Air: first class, for those who settle for nothing less."|snob appeal
        "One spark is all it takes. Is your smoke alarm working?"|fear
        "Nine out of ten gamers already use PowerPad. Join the crowd."|the bandwagon
        "Football legend Sam Okoro drinks Rush energy water before every game."|a testimonial
        "The Prestige pen, for people of rare taste."|snob appeal
        "Your old tires could fail on a wet road. Get new GripTires today."|fear
        "Be part of the movement: get your RunFit band today, like everyone else."|the bandwagon
        "Astronaut Kim Lee trusts only TimePro watches."|a testimonial
        "Elite Academy: where tomorrow's leaders are made."|snob appeal
        "Hackers are after your passwords. Get SafeNet before it's too late."|fear
        "The most popular cereal in America. Millions can't be wrong."|the bandwagon
        "TV host Rosa Diaz says SoftGlow is the only lotion she uses."|a testimonial
        "Monarch Hotels: luxury for the chosen few."|snob appeal
        "Without SunShield, the sun could damage your skin for life."|fear
        "Everyone's wearing CoolKicks this summer. Are you?"|the bandwagon
        "Tennis star Ana Silva swears by FlexGrip rackets."|a testimonial
      `,
      {
        "the bandwagon": L(
          "从众",
          "The ad says that everyone or millions are already using it, so you should join them.",
          "广告说人人或数以百万计的人都已经在用了，所以你也应该加入。",
          "This ad does not say that everyone is using it.",
          "这则广告并没有说人人都在用。",
        ),
        "a testimonial": L(
          "名人代言",
          "The ad uses a famous or trusted person who says they use or love the product.",
          "广告用著名或可信的人说他们使用或喜爱这件商品。",
          "This ad does not use a famous or trusted person.",
          "这则广告并没有用著名或可信的人。",
        ),
        "snob appeal": L(
          "势利诉求",
          "The ad says the product is for special, rich or stylish people, so buying it makes you one of them.",
          "广告说这件商品是为特别、富有或时髦的人准备的，买了它你就成了其中一员。",
          "This ad does not say the product is only for special people.",
          "这则广告并没有说这件商品只为特别的人准备。",
        ),
        fear: L(
          "恐惧诉求",
          "The ad warns that something bad will happen to you if you do not buy the product.",
          "广告警告说如果你不买这件商品，就会有不好的事发生在你身上。",
          "This ad does not warn of something bad happening.",
          "这则广告并没有警告会有不好的事发生。",
        ),
      },
    ),
    label(
      "fact-or-claim-in-an-ad",
      ["Fact or Claim in an Ad", "广告中的事实与说法"],
      [
        "Ads mix three kinds of statements. **A fact you can check** gives something exact that could be tested: a price, a size, a number of hours. **A vague claim** sounds impressive but means almost nothing: *the best*, *amazing results*, *up to fifty percent*. **An opinion** tells how someone feels: *you'll love it*, *the tastiest snack ever*.",
        "广告混合了三种陈述。**可核实的事实**给出可以检验的确切内容：价格、尺寸、小时数。**含糊的说法**听起来很了不起，却几乎没有意义：*the best*、*amazing results*、*up to fifty percent*。**观点**说出某人的感受：*you'll love it*、*the tastiest snack ever*。",
      ],
      ["What kind of statement is this?", "这是哪一种陈述？"],
      `
        "The battery lasts ten hours on one charge."|a fact you can check
        "Results so amazing, you won't believe your eyes!"|a vague claim
        "You'll love the fresh taste."|an opinion
        "Each bottle holds 500 milliliters."|a fact you can check
        "Up to fifty percent better!"|a vague claim
        "The most delicious cookie ever made."|an opinion
        "The jacket costs forty-nine dollars."|a fact you can check
        "Works like magic!"|a vague claim
        "Kids think it's the coolest backpack around."|an opinion
        "The phone weighs 150 grams."|a fact you can check
        "Clinically proven to help!"|a vague claim
        "It's simply the best shampoo you'll ever try."|an opinion
        "Free delivery on orders over thirty dollars."|a fact you can check
        "New and improved formula!"|a vague claim
        "Our pizza tastes like home."|an opinion
        "The bike has 21 gears."|a fact you can check
        "Feel the difference instantly!"|a vague claim
        "You'll wonder how you lived without it."|an opinion
        "The tablet's screen measures 25 centimeters."|a fact you can check
        "Unbeatable value!"|a vague claim
        "The comfiest shoes on the planet."|an opinion
        "The store opens at nine every morning."|a fact you can check
        "Scientifically advanced technology!"|a vague claim
        "Families everywhere adore our soup."|an opinion
        "Each pack contains twelve granola bars."|a fact you can check
        "Helps fight germs!"|a vague claim
        "The coziest blanket you'll ever own."|an opinion
        "The guarantee lasts two years."|a fact you can check
        "A whole new level of clean!"|a vague claim
        "This game is pure fun from start to finish."|an opinion
      `,
      {
        "a fact you can check": L(
          "可核实的事实",
          "It gives something exact, such as a price, a size or a number, that could be tested.",
          "它给出可以检验的确切内容，如价格、尺寸或数字。",
          "This statement does not give anything exact that could be tested.",
          "这个陈述并没有给出可以检验的确切内容。",
        ),
        "a vague claim": L(
          "含糊的说法",
          "It sounds impressive but gives nothing exact to test: better than what, by how much, proven by whom?",
          "它听起来很了不起，却没有给出可以检验的确切内容：比什么好？好多少？由谁证明？",
          "This statement is not an impressive-sounding phrase with nothing exact in it.",
          "这个陈述不是空洞而听起来了不起的说法。",
        ),
        "an opinion": L(
          "观点",
          "It tells how someone feels about the product, which cannot be proved true or false.",
          "它说出某人对商品的感受，无法证明真假。",
          "This statement is not just a feeling about the product.",
          "这个陈述不只是对商品的感受。",
        ),
      },
    ),
  ],
});

/** readingTopics7b are the reading topics of the later units of grade 7. */
export const readingTopics7b: readonly TopicDef[] = [
  drawn(diagrams, { "which-visual-helps": fourVisuals }),
  correlation,
  pointsOfView,
  dialogue,
  speeches,
  loaded,
  scientificIdea,
  observation,
  ads,
];
