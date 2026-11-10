// The reading unit of the B2 theme Technology and the Future: robots and jobs, the car that drives itself, living on
// Mars, a hack that shut a city down, an algorithm that was wrong, predictions that came true and some that did not, a
// better battery and a day without the network.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "b2-words-ai",
  "b2-words-innovation",
  "b2-words-cyber",
  "b2-words-space-future",
  "b2-words-transport-future",
  "b2-words-tech-in-society",
  "b2-words-prediction",
  "b2-words-making-things",
  "b2-words-networks",
  "b2-words-tech-ethics",
  "b2-words-transitions",
  "wish-and-if-only",
]);

/** readingTechnology is the reading unit of the theme Technology and the Future. */
export const readingTechnology: ReadingUnitDef = {
  id: "b2-reading-technology",
  title: t("Technology and the Future", "科技与未来"),
  passages: [
    passage({
      id: "b2-technology-will-robots-take-our-jobs",
      title: ["Will Robots Take Our Jobs?", "机器人会抢走我们的工作吗？"],
      body: `In the early nineteenth century, a group of English textile workers known as the Luddites broke into factories at night and destroyed the new machines that were replacing them. Their name is still used today for anyone who is afraid of new technology. Yet their fear was not wrong. The machines really did take their jobs, and many of them never found work as good again.

Two hundred years later, the same question is being asked about automation and artificial intelligence. Robots already assemble cars, pack goods in warehouses and clean floors. Software can now write simple reports, answer customers, translate documents and even help doctors read scans. Some experts predict that a large share of the jobs of today could be automated within a few decades.

History offers some hope. Again and again, technology has destroyed certain jobs while creating new ones that nobody could foresee. In 1900, about forty percent of American workers were farmers; today, the number is under two percent, yet most people are employed, in jobs such as internet designer or nurse that hardly anyone had heard of then. Machines also make goods cheaper, which leaves people with more money to spend on other things, and that spending creates work.

However, many experts argue that this time could be different. Earlier machines replaced the power of the body; the new ones are beginning to replace thinking. If computers can do much of the work of lawyers, accountants and programmers, it is not clear which new jobs will be left for people to do. Moreover, the transition can be hard even if the long-term result is positive. A factory worker of fifty who loses his job to a robot does not easily become a software engineer.

What can be done? Most plans focus on education and support. Governments could pay for courses during the whole career of each worker, not only at the start, and support workers while they move from one job to another. Some suggest a tax on robots, or a simple income paid to everyone.

Perhaps the most likely future is not paradise, and not catastrophe either. Some jobs will disappear, many will change, and new ones will emerge. Whether the transformation is fair will depend less on the machines themselves than on the decisions we make about how to share their benefits.`,
      grammar: ["wish-and-if-only"],
      names: ["English", "Luddites", "American"],
      glossed: ["warehouses", "scans", "paradise"],
      questions: [
        [
          ['Why does the writer say the fear of the Luddites was "not wrong"?', '作者为什么说卢德分子的担心"并没有错"？'],
          ["The machines really did take their jobs", "机器确实抢走了他们的工作"],
          [
            ["The machines often broke down at night", "机器经常在夜里出故障"],
            ["They were paid more after the machines came", "机器出现后他们的工资更高了"],
          ],
          [
            '"The machines really did take their jobs, and many of them never found work as good again."',
            "机器确实夺走了他们的工作，其中许多人再也没找到同样好的工作。",
          ],
        ],
        [
          ["What does the example of American farmers show?", "美国农民的例子说明了什么？"],
          ["Technology destroys some jobs but new ones appear", "科技消灭一些工作，但会出现新的工作"],
          [
            ["Most American workers are still farmers", "大多数美国工人仍是农民"],
            ["Robots have replaced every farmer", "机器人已经取代了所有农民"],
          ],
          [
            "Farmers fell from forty percent of workers to under two percent, yet most people are employed in jobs that hardly existed in 1900.",
            "农民在劳动者中的比例从百分之四十降到不足百分之二，但大多数人仍有工作，而这些工作在 1900 年几乎不存在。",
          ],
        ],
        [
          ["Why could this time be different, according to many experts?", "很多专家认为，这次为什么可能有所不同？"],
          ["The new machines are beginning to replace thinking", "新机器开始取代思考"],
          [
            ["The new machines are much more expensive", "新机器贵得多"],
            ["People no longer want to work in factories", "人们不再想在工厂工作"],
          ],
          [
            '"Earlier machines replaced the power of the body; the new ones are beginning to replace thinking."',
            "以前的机器取代的是体力，新的机器开始取代思考。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-technology-the-car-that-drives-itself",
      title: ["The Car That Drives Itself", "自动驾驶的汽车"],
      body: `In several cities in the United States and China, it is now possible to call a taxi with no driver. The car arrives empty, opens its doors, and takes the passenger across the city while the wheel turns by itself. For the people who build such cars, this is the beginning of a revolution. For many others, it is still a slightly worrying experiment.

A self-driving car depends on several sophisticated technologies working together. Cameras and other sensors on the roof and sides of the car build a picture of the world around it many times a second. Careful maps tell it exactly where it is. Software that has learned from millions of kilometers of driving then decides what to do: when to stop, when to change lanes and how to respond to a child who runs into the road.

The arguments for such cars are strong. More than a million people die on the roads every year, and the great majority of accidents are caused by the mistakes of people: drivers who are tired, busy with something else, drunk or just driving too fast. A machine does not get tired or look at its phone. Self-driving cars could also give independence to people who cannot drive, such as the elderly or people who cannot see, and they could make ride-sharing so cheap that not as many families would need to own a car.

However, the obstacles are large. The software handles normal situations well, but roads are full of strange ones: a police officer controlling traffic by hand, a ball rolling across a street, snow that hides the lines on the road. Several accidents with self-driving cars, one of them fatal, have damaged public trust. And there are difficult questions of liability. If a car without a driver hits someone, who is responsible: the passenger, the company that made the car, or the engineers who wrote the software?

Most experts now believe that the transition will be slower than was predicted ten years ago. The first areas to change will probably be those that are easiest to control, such as vehicles carrying goods on highways, buses on fixed routes and taxis in cities with good weather. Many of us may wish we could sleep on the way to work, but for now, most drivers will have to keep their hands on the wheel.`,
      grammar: ["wish-and-if-only"],
      names: ["United", "States", "China"],
      questions: [
        [
          ["How does a self-driving car build a picture of the world around it?", "自动驾驶汽车怎样构建周围世界的图像？"],
          ["With cameras and other sensors", "用摄像头和其他传感器"],
          [
            ["With the help of a driver in another city", "借助另一个城市的司机"],
            ["By asking the passenger where to go", "通过询问乘客要去哪里"],
          ],
          [
            '"Cameras and other sensors on the roof and sides of the car build a picture of the world around it many times a second."',
            "车顶和车身两侧的摄像头、雷达和其他传感器每秒多次构建周围世界的图像。",
          ],
        ],
        [
          ["What is the strongest argument for self-driving cars?", "支持自动驾驶汽车最有力的论点是什么？"],
          ["Most accidents are caused by human mistakes", "大多数事故是人为失误造成的"],
          [
            ["They are cheaper to build than normal cars", "它们的制造成本比普通汽车低"],
            ["They can drive faster than human drivers", "它们比人类司机开得更快"],
          ],
          [
            '"The great majority of accidents are caused by the mistakes of people", and a machine does not get tired or look at its phone.',
            "绝大多数事故由人为失误造成，而机器不会疲劳，也不会看手机。",
          ],
        ],
        [
          ["Where will self-driving vehicles probably come first?", "自动驾驶车辆可能会最先出现在哪里？"],
          ["In situations that are easiest to control, such as highways", "在最容易控制的场景，比如高速公路上"],
          [
            ["In cities with a lot of snow", "在多雪的城市"],
            ["On small roads in the countryside", "在乡村小路上"],
          ],
          [
            '"The first areas to change will probably be those that are easiest to control, such as vehicles carrying goods on highways, buses on fixed routes and taxis in cities with good weather."',
            "最先改变的可能是最容易控制的领域，比如高速公路上的卡车、固定线路的公交车和天气好的城市里的出租车。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-technology-living-on-mars",
      title: ["Living on Mars", "在火星上生活"],
      body: `For more than a century, writers have imagined people living on Mars. Today, several governments and private companies say that it could really happen within a few decades. One company has even said it hopes to send the first people there within ten or fifteen years. But what would it actually be like to live on the red planet?

The first problem is getting there. Depending on the position of the planets, the journey takes between six and nine months. During that time, the people on board would live in a small space, weightless, far from any help. Radiation from the sun and from space is a serious risk, and long times without gravity make the bones and the heart weaker.

Mars itself is not a friendly place. The air is very thin and is made mostly of carbon dioxide, so nobody could breathe it. The average temperature is about sixty degrees below zero, and huge storms can hide the whole planet for weeks. There is water, but mostly as ice under the ground. Everyone would have to live inside closed homes and wear special clothes every time they went outside.

Engineers are working on answers. Instead of carrying everything from Earth, settlers would have to use what they find on Mars. Ice could be melted for drinking water and split into hydrogen and oxygen, for breathing and for rocket fuel. Plants could be grown in special glass houses, using earth from the planet once it has been cleaned. Some designs suggest building homes under the ground, or putting thick layers of rock over them, to protect people from radiation.

Even so, the challenges are not only about technology. Living for years with a small group of people, far from family and friends, with messages to Earth taking up to twenty minutes each way, would test anyone. Scientists study volunteers who spend months together in isolated places, such as stations in Antarctica, to learn how to prepare future teams.

Is it worth it? Those in favor argue that becoming a species of two planets would protect us from a catastrophe on Earth, and that trying would drive innovation, as the journeys to the Moon did. Others reply that the money would be better spent solving problems on our own planet. For now, Mars is still, as it has always been, a place we can only dream about.`,
      grammar: ["wish-and-if-only"],
      names: ["Mars", "Earth", "Antarctica", "Moon"],
      glossed: ["dioxide", "radiation", "settlers"],
      questions: [
        [
          ["What problem does the long journey to Mars cause for the body?", "去火星的漫长旅程会给身体带来什么问题？"],
          ["Without gravity, bones and the heart become weaker", "没有重力，骨骼和心脏会变弱"],
          [
            ["The people on board would eat too much", "飞船上的人会吃得太多"],
            ["The air in the spaceship is too thin", "飞船里的空气太稀薄"],
          ],
          [
            '"Long times without gravity make the bones and the heart weaker", and radiation is a serious risk.',
            "长期没有重力会使骨骼和心脏变弱，辐射也是严重的危险。",
          ],
        ],
        [
          ["How could people living on Mars get water and oxygen?", "在火星上生活的人怎样获得水和氧气？"],
          ["From the ice under the ground", "从地下的冰中获得"],
          [
            ["From the thin air of the planet", "从火星稀薄的空气中获得"],
            ["By bringing all of it from Earth", "全部从地球带去"],
          ],
          [
            '"Ice could be melted for drinking water and split into hydrogen and oxygen, for breathing and for rocket fuel."',
            "冰可以融化成饮用水，还可以分解成氢和氧，用于呼吸和火箭燃料。",
          ],
        ],
        [
          ["Why do psychologists study volunteers in places such as Antarctica?", "心理学家为什么研究在南极等地的志愿者？"],
          ["To learn how to prepare future teams for isolation", "为了学习如何让未来的乘组为与世隔绝做好准备"],
          [
            ["To test new space suits in the cold", "为了在寒冷中测试新的宇航服"],
            ["To find ice that is similar to the ice on Mars", "为了寻找与火星上相似的冰"],
          ],
          [
            'They study volunteers in isolated places "to learn how to prepare future teams" for years with a small group, far from home.',
            "他们研究在偏远地方生活的志愿者，以了解如何让未来的乘组适应多年与一小群人远离家乡的生活。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-technology-the-hack-that-shut-a-city-down",
      title: ["The Hack That Shut a City Down", "让一座城市瘫痪的黑客攻击"],
      body: `One Thursday morning, employees of the council of a small city arrived at work and found that their computers would not start. Instead, each screen showed the same message: the files of the council had been encrypted, and they would be unlocked only if the city paid a lot of digital money within three days.

The city had been hit by ransomware, a kind of malware that keeps the data of its victims closed until they pay. Within hours, almost every service had stopped. Residents could not pay their bills or get documents. The police had to write reports by hand. The computers that managed the water supply kept working, but only because they had not been connected to the rest of the network.

Experts later discovered how the hack had begun. Several weeks earlier, an employee had received an email that seemed to come from a colleague, asking her to open a document. It was phishing. The document installed a small program that gave the hackers access to the network. For weeks, they explored it quietly, found the most important servers and deleted the backups, before finally encrypting everything at once.

The council had a terrible dilemma. Paying would probably have been cheaper and faster, but there was no guarantee that the hackers would keep their promise, and paying would encourage more hacks. The council refused. It took almost four months and several million dollars to build its computer network again, far more than the hackers had asked for.

Hacks like this have become common, and hospitals, schools and small companies are common targets, because they often have outdated software and little money for cybersecurity. Experts say that most hacks could be prevented with simple measures: updating software regularly, using a second password to authenticate when signing in, keeping backups offline, and teaching staff to recognize strange emails.

After the hack, the city did all of these things. "We wish we had done it earlier," one manager admitted. "If only we had spent a small part of what this cost us on protecting ourselves, nothing would have happened." The phishing email, the experts found, had been opened by less than one in twenty employees. It only takes one.`,
      grammar: ["wish-and-if-only"],
      glossed: ["ransomware", "unlocked"],
      questions: [
        [
          ["Why did the computers for the water supply keep working?", "为什么供水系统的电脑仍在正常运行？"],
          ["They were not connected to the rest of the network", "它们没有与网络的其他部分相连"],
          [
            ["The hackers decided to leave them alone", "黑客决定放过它们"],
            ["The city paid the attackers for it", "市政府为此向攻击者付了钱"],
          ],
          [
            'They kept working "only because they had not been connected to the rest of the network."',
            "它之所以还能运行，只是因为它和网络的其他部分是分开的。",
          ],
        ],
        [
          ["How did the attackers get into the network?", "攻击者是怎样进入网络的？"],
          ["Through a document in an email that seemed to come from a colleague", "通过一封看似来自同事的邮件中的文件"],
          [
            ["By breaking into the council offices at night", "夜里闯入市政府办公室"],
            ["By buying a password from an employee", "从一名员工那里买到了密码"],
          ],
          [
            'An employee received a phishing email "that seemed to come from a colleague"; the document installed a program that gave the hackers access.',
            "一名员工收到一封看似来自同事的钓鱼邮件，文件安装了让黑客进入网络的程序。",
          ],
        ],
        [
          ["Why did the council refuse to pay?", "市政府为什么拒绝付钱？"],
          ["There was no guarantee, and paying would encourage more hacks", "没有任何保证，而且付钱会招来更多攻击"],
          [
            ["Paying would have been more expensive than rebuilding", "付钱会比重建系统更贵"],
            ["The police had already caught the hackers", "警察已经抓住了黑客"],
          ],
          [
            'There was "no guarantee that the hackers would keep their promise, and paying would encourage more hacks." Building the network again in fact cost more.',
            "没有保证黑客会守信，而且付钱会招来更多攻击；实际上重建花的钱更多。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-technology-when-an-algorithm-is-wrong",
      title: ["Who Is Responsible When an Algorithm Is Wrong?", "算法出错时谁来负责？"],
      body: `In 2020, the government of a European country used an algorithm to help decide which families might be cheating on child benefits. The idea was efficient: the computer would look at the data of every family and flag those that seemed most at risk, so that the staff could check them. In practice, it was a disaster. Thousands of families who had done nothing wrong were told that they had cheated and ordered to pay back large amounts of money. Some lost their homes; marriages broke up. Later, experts found that the algorithm had seen families with a second nationality as a higher risk.

The scandal brought down the government, but it also raised a question that is becoming more important every year. Algorithms now help to decide who gets a loan, who is invited to a job interview, which patients receive care first and, in some countries, who may leave prison early. When such an algorithm makes a mistake, who is accountable?

The answer is more difficult than it seems. The engineers who built the algorithm may say that they followed the specification they were given. The staff who used it may say that they trusted the computer. The company that sold it may say that its software was used in the wrong way. Meanwhile, the algorithm itself cannot be blamed, and it often cannot even explain its decisions, because it learned its rules from millions of examples in ways that even its designers do not completely understand.

There is another problem. Algorithms learn from data about the past, and the past is full of unfairness. If a company has mostly employed men for jobs in technology in the past, an algorithm that learns from its records may decide that men are better candidates, and repeat the past. The result can be discriminatory even if nobody meant it.

Several governments are now trying to regulate the use of algorithms in important decisions. The plans would require companies to test their algorithms for bias, to keep records of how decisions were made, and to allow people to ask for an explanation and for a review by a real person. Many experts insist that there should always be oversight by people in decisions that really affect the lives of others.

The most important lesson may be simple. An algorithm is a tool, and like any tool, it reflects the decisions of the people who use it. Responsibility cannot be given to a machine.`,
      grammar: ["wish-and-if-only"],
      names: ["European"],
      glossed: ["flag", "scandal", "unfairness"],
      questions: [
        [
          ["What went wrong with the algorithm for child benefits?", "儿童福利算法出了什么问题？"],
          ["Thousands of innocent families were told that they had cheated", "成千上万的家庭被错误地指控欺诈"],
          [
            ["It paid too much money to every family", "它给每个家庭付了太多钱"],
            ["It could not find any families at risk", "它找不出任何有风险的家庭"],
          ],
          [
            '"Thousands of families who had done nothing wrong were told that they had cheated and ordered to pay back large amounts of money."',
            "成千上万的家庭被错误地指控欺诈，并被勒令退还大笔钱款。",
          ],
        ],
        [
          ["Why is it hard to say who is accountable?", "为什么很难说清谁该负责？"],
          ["Each person involved can blame someone else", "每个相关的人都可以把责任推给别人"],
          [
            ["Nobody knows which company built the algorithm", "没人知道算法是哪家公司开发的"],
            ["The law says that machines are responsible", "法律规定机器要负责"],
          ],
          [
            "The engineers point to the specification, the staff to the computer, and the company to the way its software was used.",
            "工程师说按规格办事，官员说信任电脑，公司说软件被错误使用。",
          ],
        ],
        [
          ["How can an algorithm become discriminatory?", "算法怎样会变得带有歧视？"],
          ["It learns from data about an unfair past", "它从反映不公平过去的数据中学习"],
          [
            ["Its designers always want it to be unfair", "设计者总是希望它不公平"],
            ["It refuses to look at any data", "它拒绝查看任何数据"],
          ],
          [
            '"Algorithms learn from data about the past, and the past is full of unfairness", so they can repeat the past even if nobody meant it.',
            "算法从过去的数据中学习，而过去充满不公平，所以即使无人有意，它们也会延续旧的模式。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-technology-predictions-that-came-true",
      title: ["Predictions That Came True, and Some That Didn't", "成真的预言，以及落空的预言"],
      body: `In 1900, an American engineer called John Watkins wrote an article about what life would be like a hundred years later. Some of his predictions were very accurate. He foresaw that people would see pictures from the other side of the world "as if they were there", that photos would be sent across great distances in color, and that people would talk to each other by wireless telephone across continents. In a way, he anticipated television, the internet and the smartphone.

Other predictions were less lucky. He believed that three letters would disappear from the English language because they were not needed, that mosquitoes and flies would be nearly extinct, and that there would be no wild animals outside zoos. Nobody, in his future, would walk very far, because moving walkways would carry them everywhere.

His mixed record is normal. Experts have often been right about the direction of technology but wrong about the small parts and about when things would happen. Seventy years ago, many predicted that by the year 2000 people would travel in flying cars, take holidays on the Moon and live in automated homes run by robots. Few anticipated that the most important change would be a small computer in every pocket.

Some predictions failed in the opposite direction. In 1943, the head of a large computer company is said to have estimated that there was a world market for "maybe five computers". About thirty years ago, a famous expert on the economy suggested that the internet would have no more effect on the economy than the fax machine. Neither of them understood how quickly a new technology can spread once it becomes cheap and useful.

Why is forecasting so hard? One reason is that the future depends not only on what is feasible, but on what people want and are ready to pay for. Flying cars have been possible for decades; they are just too expensive, noisy and dangerous to become common. Another reason is that technologies come together in unexpected ways. The inventors of the telephone and the computer could not have foreseen the smartphone.

The lesson, perhaps, is to doubt every confident prediction a little, even those we read today. As one scientist said as a joke, it is very difficult to make predictions, especially about the future.`,
      grammar: ["wish-and-if-only"],
      names: ["American", "John", "Watkins", "English", "Moon"],
      glossed: ["mosquitoes", "walkways", "fax", "forecasting"],
      questions: [
        [
          ["Which of Watkins's predictions came true?", "沃特金斯的哪一个预言成真了？"],
          ["People would talk by wireless telephone across continents", "人们会用无线电话跨洲通话"],
          [
            ["There would be no wild animals outside zoos", "除了动物园就不会有野生动物"],
            ["Three letters would disappear from English", "英语中会有三个字母消失"],
          ],
          [
            'He foresaw "that people would talk to each other by wireless telephone across continents", which anticipated the smartphone.',
            "他预见了人们会用无线电话跨洲交谈，这预示了手机的出现。",
          ],
        ],
        [
          ["What does the writer say about the record of experts?", "作者怎样评价专家们的预测记录？"],
          ["They were often right about the direction but wrong about the details", "他们常常预测对了方向，却弄错了细节"],
          [
            ["They were almost always completely right", "他们几乎总是完全正确"],
            ["They never predicted anything correctly", "他们从来没有预测对过任何事"],
          ],
          [
            '"Experts have often been right about the direction of technology but wrong about the small parts and about when things would happen."',
            "专家常常对科技的方向判断正确，但在细节和时间上出错。",
          ],
        ],
        [
          ["Why have flying cars not become common?", "飞行汽车为什么没有普及？"],
          ["They are too expensive, noisy and dangerous", "它们太贵、太吵、太危险"],
          [
            ["Nobody has been able to build one", "没有人能造出来"],
            ["The law has banned them everywhere", "法律在所有地方都禁止它们"],
          ],
          [
            '"Flying cars have been possible for decades; they are just too expensive, noisy and dangerous to become common."',
            "飞行汽车几十年前就能造出来了，只是太贵、太吵、太危险，无法普及。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-technology-building-a-better-battery",
      title: ["Building a Better Battery", "打造更好的电池"],
      body: `Almost every device we carry depends on a battery. So, increasingly, do our cars, our buses and the electricity grid itself. Solar energy produces nothing at night and wind turbines stop when the wind drops, so if the world is to give up fossil fuels, it needs cheap and safe ways to store huge amounts of energy. The battery has quietly become one of the most important technologies of the century.

Most batteries today use lithium. The lithium-ion battery, developed about fifty years ago and first sold in 1991, transformed our devices: it is light, holds a lot of energy and can be charged hundreds of times. Its inventors received the Nobel Prize in 2019. Since then, the cost of such batteries has fallen by about ninety percent, which is the main reason why electric cars have become affordable.

Yet lithium-ion batteries have serious drawbacks. The materials they need, such as lithium and cobalt, are dug out of the ground in only a few countries, sometimes in terrible conditions for the workers and the environment. The batteries slowly lose capacity as they age. They can also catch fire if they are damaged, and such fires are very hard to put out.

Engineers around the world are therefore working on other designs. One promising design replaces the liquid inside the battery with a solid material, which could make batteries safer and allow them to hold much more energy. Another uses sodium, which can be made from ordinary salt and is far cheaper and easier to find than lithium, albeit heavier. For the grid, where weight does not matter, some companies are building enormous batteries that use iron, water and air.

Turning a laboratory breakthrough into a commercial product is very difficult. A battery that works well in a test may fail when it is produced by the million, or cost too much to make. Many promising startups have failed at this stage. Each new design must be refined over years, and the factories to produce it can cost billions.

Recycling is part of the answer too. Old batteries have valuable metals in them, and new methods can recover most of them. In the future, the lithium in your phone may come from the battery of a car that was driven twenty years earlier. The better battery, in the end, may not be a single invention but many small improvements, added together.`,
      grammar: ["wish-and-if-only"],
      names: ["Nobel"],
      glossed: ["lithium", "lithium-ion", "cobalt", "sodium", "capacity", "drawbacks"],
      questions: [
        [
          ["Why have electric cars become affordable?", "电动汽车为什么变得买得起了？"],
          ["The cost of lithium-ion batteries has fallen by about ninety percent", "锂离子电池的成本下降了约百分之九十"],
          [
            ["Governments now pay for every electric car", "政府现在为每辆电动车买单"],
            ["Electric cars no longer need batteries", "电动车不再需要电池"],
          ],
          [
            '"The cost of such batteries has fallen by about ninety percent, which is the main reason why electric cars have become affordable."',
            "这类电池的成本下降了约九成，这是电动车变得买得起的主要原因。",
          ],
        ],
        [
          ["What is one advantage of sodium batteries?", "钠电池的一个优点是什么？"],
          ["Sodium is cheaper and easier to find than lithium", "钠比锂更便宜、更容易获得"],
          [
            ["Sodium batteries are lighter than lithium ones", "钠电池比锂电池更轻"],
            ["Sodium batteries never lose capacity", "钠电池永远不会损失容量"],
          ],
          [
            'Sodium "can be made from ordinary salt and is far cheaper and easier to find than lithium, albeit heavier."',
            "钠可以从普通食盐中提取，比锂便宜得多、来源广泛得多，只是更重。",
          ],
        ],
        [
          ["Why do many battery startups fail?", "为什么许多电池初创公司会失败？"],
          ["Turning a laboratory success into a product is very hard", "把实验室成果变成产品非常困难"],
          [
            ["Nobody wants to buy new batteries", "没有人想买新电池"],
            ["Recycling has made new batteries unnecessary", "回收让新电池变得没有必要"],
          ],
          [
            '"Turning a laboratory breakthrough into a commercial product is very difficult": a design may fail in production or cost too much.',
            "把实验室突破变成商业产品极其困难：设计可能在量产时失败，或者成本太高。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-technology-a-day-without-the-network",
      title: ["A Day Without the Network", "没有网络的一天"],
      body: `It began, as these things often do, with a small mistake. Early one morning, an engineer at a large telecommunications company installed a routine update to the software of its network. The update had an error in it. Within minutes, millions of customers lost their phone and broadband connection, and they stayed without it for most of the day.

At first, people assumed it was a problem with their own phone. They switched it off and on again, then walked to the window, holding it in the air. Gradually, they realized that something much bigger had happened. Without connectivity, a shocking number of ordinary things stopped working. Shops that accepted only card payments had to close or ask customers for cash, which few of them carried. Some people could not use public transport, because their tickets were on their phones. Taxi drivers could not find their passengers. Hospitals switched to paper. Worst of all, in some areas, people could not call the emergency services.

The outage revealed how dependent modern life has become on a few networks. Many of the services we rely on every day were designed to be convenient, not to keep working when something goes wrong. When everything is connected, a single problem can spread through all of them at once.

Yet for some people, the day was not completely bad. Reporters who went into the streets found families eating breakfast without screens, colleagues talking instead of sending messages, and strangers asking each other for directions, the time and the news. One woman said it was the first time in years that she had read a book on the train. "I wish it happened more often," a teenager admitted, "but only for a few hours."

When the network came back in the evening, the company apologized and promised to pay its customers back. Governments asked for a report, and experts urged companies and public services to plan for such problems: to keep a backup network, to accept cash, and to make sure that emergency calls could always get through.

For most people, life returned to normal by the next morning. But many said they now keep a little cash in their wallet, a paper map in the car and a written list of important phone numbers at home, just to be safe if the network disappears again.`,
      grammar: ["wish-and-if-only"],
      glossed: ["outage"],
      questions: [
        [
          ["What caused the failure of the network?", "网络故障是什么原因造成的？"],
          ["An error in a software update", "软件更新中的一个错误"],
          [
            ["A storm that damaged the antennas", "一场损坏了天线的风暴"],
            ["An attack by criminals", "罪犯发动的攻击"],
          ],
          [
            'An engineer "installed a routine update to the software of its network. The update had an error in it."',
            "一名工程师给网络软件安装了例行更新，而这个更新里有一个错误。",
          ],
        ],
        [
          ["Why did some shops have to close?", "为什么有些商店不得不关门？"],
          ["They accepted only card payments", "它们只接受刷卡付款"],
          [
            ["Their workers could not get to work", "他们的员工没法上班"],
            ["The electricity had been cut off", "电力被切断了"],
          ],
          [
            '"Shops that accepted only card payments had to close or ask customers for cash, which few of them carried."',
            "只收卡的商店只好关门，或者让顾客付现金，而很少有人带现金。",
          ],
        ],
        [
          ["What did the outage reveal, according to the passage?", "根据文章，这次故障揭示了什么？"],
          ["How dependent modern life is on a few networks", "现代生活多么依赖少数几个网络"],
          [
            ["That paper is better than computers", "纸比电脑更好"],
            ["That most people dislike their phones", "大多数人不喜欢自己的手机"],
          ],
          [
            '"The outage revealed how dependent modern life has become on a few networks."',
            "这次故障揭示了现代生活已经多么依赖少数几个网络。",
          ],
        ],
      ],
    }),
  ],
};
