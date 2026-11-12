// Grade 12: the reading unit of the sixth theme, risk and responsibility, from a reactor test that went wrong
// and a wall that was too low to a fog that killed thousands, a book about unsafe cars, a computer bug that did
// not bite, the fear of flying, a principle of caution and a country that decided never to flood again.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const risk = { topic: "words-of-risk-and-uncertainty", weight: 0.3 } as const;
const crisis = { topic: "words-of-crisis-and-response", weight: 0.3 } as const;
const probability = { topic: "reading-risk-and-probability", weight: 0.2 } as const;
const academic10 = { topic: "academic-words-10", weight: 0.1 } as const;
const academic11 = { topic: "academic-words-11", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** riskAndResponsibility is a reading unit of grade 12 on risk and responsibility, crises and the response to them, and how to read the numbers of risk. */
export const riskAndResponsibility: ReadingUnitDef = {
  id: "risk-and-responsibility",
  title: t("Risk and Responsibility", "风险与责任"),
  passages: [
    passage(
      "the-test-that-went-wrong",
      t("The Test That Went Wrong", "出了差错的试验"),
      `In the early hours of April 26, 1986, the operators of the fourth reactor at the Chernobyl nuclear power plant, in what is now Ukraine, began a safety test. They wanted to know whether, if the plant lost electric power, the slowing turbines could keep the cooling pumps running for a short time until backup generators started. The test had been delayed for hours, and the night shift that carried it out had not prepared for it.

To run the test, the operators lowered the reactor's power and switched off several safety systems. The power fell too far, and in trying to raise it, they pulled out more of the control rods that slow the reaction than the rules allowed. The reactor had a dangerous design flaw, one its operators had not been fully told about: under these conditions, its power could rise suddenly and uncontrollably. When the test began, it did. Within seconds, two explosions blew the heavy lid off the reactor and set the building on fire. Radioactive material was thrown high into the air.

The immediate response was heroic and confused. Firefighters climbed onto the roof to fight the fire without knowing how much radiation they faced; many of them died within weeks. Yet the nearby city of Pripyat, home to about fifty thousand people, was not evacuated until the next afternoon. The Soviet government said nothing to the world until two days later, when workers at a nuclear plant in Sweden, more than a thousand kilometers away, detected radiation on their clothes and traced it back to the east.

The fallout spread across much of Europe. A zone of thirty kilometers around the plant was closed, and eventually more than three hundred thousand people were moved from their homes. Thousands of cases of thyroid cancer were later found among people who had been children at the time, mostly because they drank milk from cows that had eaten contaminated grass.

The disaster had many causes: a flawed design, operators who broke rules, a test planned without enough care, and a system in which bad news traveled slowly and secrets were kept. Afterward, the reactors of the same type were changed, and international rules about reporting nuclear accidents were strengthened.

Chernobyl showed that the risk of a technology depends not only on its machines but on the people and institutions that run it. A safe design can be undone by careless use, and a careless system can turn an accident into a catastrophe.`,
      [crisis, risk, academic10, academic2],
      [
        ask(
          t("What was the purpose of the test at Chernobyl?", "切尔诺贝利那次试验的目的是什么？"),
          t(
            "To see if slowing turbines could run the cooling pumps until backup power started",
            "看减速的涡轮机能否在备用电源启动前维持冷却泵运转",
          ),
          [
            t("To find out how much radiation the reactor could release", "弄清反应堆能释放多少辐射"),
            t("To train firefighters to work on the reactor roof", "训练消防员在反应堆屋顶上工作"),
            t("To prove that the reactor needed no safety systems", "证明反应堆不需要任何安全系统"),
          ],
          t(
            "The first paragraph says they wanted to know whether the slowing turbines could keep the cooling pumps running until backup generators started.",
            "第一段说他们想知道在失去电力时，减速的涡轮机能否在备用发电机启动前维持冷却泵运转。",
          ),
        ),
        ask(
          t("How did the world first learn about the disaster?", "世界最初是怎样得知这场灾难的？"),
          t("Workers at a plant in Sweden detected radiation and traced it east", "瑞典一座核电站的工人检测到辐射并追踪到东方"),
          [
            t("The Soviet government announced it the same night", "苏联政府当晚就宣布了"),
            t("The firefighters telephoned newspapers in Europe", "消防员给欧洲的报社打了电话"),
            t("The people of Pripyat wrote letters abroad", "普里皮亚季的居民给国外写信"),
          ],
          t(
            "The third paragraph says the government said nothing until workers at a plant in Sweden detected radiation and traced it back to the east.",
            "第三段说政府一直没有声明，直到瑞典一座核电站的工人检测到辐射并追溯到东方。",
          ),
        ),
        ask(
          t("What does the writer conclude about the risk of a technology?", "作者对技术的风险得出了什么结论？"),
          t("It depends on the people and institutions that run it, not only the machines", "它不仅取决于机器，还取决于运行它的人和机构"),
          [
            t("It can be removed entirely with a better design", "用更好的设计可以完全消除它"),
            t("It is always greater in cold countries than warm ones", "寒冷国家的技术风险总是比温暖国家大"),
            t("It matters only to the workers inside the plant", "它只关系到核电站里的工人"),
          ],
          t(
            "The last paragraph says the risk of a technology depends not only on its machines but on the people and institutions that run it.",
            "最后一段说技术的风险不仅取决于机器，还取决于运行它的人和机构。",
          ),
        ),
      ],
      ["Chernobyl", "Pripyat", "Ukraine", "Soviet", "Union", "Sweden", "Swedish", "Europe", "April"],
    ),
    passage(
      "the-wall-that-was-too-low",
      t("The Wall That Was Too Low", "太矮的海堤"),
      `On March 11, 2011, one of the largest earthquakes ever recorded struck under the sea off the northeast coast of Japan. The nuclear power plant at Fukushima Daiichi, on the coast, did what it was designed to do. Its reactors shut down automatically, and backup diesel generators started to power the pumps that kept the hot fuel cool.

About fifty minutes later, the tsunami arrived. The plant was protected by a seawall less than six meters high. The waves that struck it were roughly thirteen to fifteen meters high. Water poured over the wall and flooded the plant, including the basements where most of the backup generators and electrical equipment were kept. The cooling stopped. Over the following days, the fuel in three reactors melted, explosions damaged several buildings, and radioactive material escaped. More than a hundred thousand people were evacuated from the area.

The disaster was later called foreseeable. Historians and geologists had found evidence that a huge tsunami had struck the same coast in the year 869, more than eleven centuries earlier. A few years before 2011, the plant's own engineers had estimated that a large earthquake in the region could produce a wave of more than fifteen meters at the site. The company and the government regulator had treated such a wave as too unlikely to require immediate action. Studies continued; the wall was not raised.

Why would people ignore such a warning? Part of the answer is how rare events are judged. A wave that comes once in a thousand years seems almost impossible within anyone's career, and the cost of preparing for it is immediate and certain. Yet a plant that runs for fifty years, among many plants along a long coast, faces a far greater chance than the yearly number suggests. And when the consequence is a catastrophe, even a small likelihood can justify a large precaution.

The response to the disaster also carried its own risks. The evacuation, carried out in haste, caused many deaths among elderly and sick people who were moved from hospitals and care homes, far more than were caused directly by radiation.

Investigators concluded that the disaster was made by people as well as by nature. The earthquake and the wave could not be prevented. The decisions about how high to build, where to place the generators, and what to do with a troubling estimate could have been different.`,
      [risk, crisis, probability, academic11, academic1, academic2, academic3],
      [
        ask(
          t("Why did the plant lose its cooling after the tsunami?", "海啸后核电站为什么失去了冷却？"),
          t("Water flooded the basements where backup generators were kept", "海水淹没了存放备用发电机的地下室"),
          [
            t("The earthquake broke every pipe in the reactors", "地震震裂了反应堆的每一根管道"),
            t("The workers switched off the pumps by mistake", "工人误关了水泵"),
            t("The reactors had failed to shut down", "反应堆没能停堆"),
          ],
          t(
            "The second paragraph says water poured over the wall and flooded the basements where most backup generators were kept, so the cooling stopped.",
            "第二段说海水漫过海堤，淹没了存放大部分备用发电机的地下室，冷却随之停止。",
          ),
        ),
        ask(
          t('Why does the writer call the disaster "foreseeable"?', "作者为什么说这场灾难是“可以预见的”？"),
          t("There was evidence of a past tsunami and an estimate of a fifteen-meter wave", "有过去海啸的证据，也有十五米海浪的估算"),
          [
            t("Scientists had predicted the exact day of the earthquake", "科学家预测到了地震的确切日期"),
            t("The seawall had been damaged by a storm the year before", "海堤前一年被风暴损坏了"),
            t("Other plants in Japan had already been flooded", "日本其他核电站已经被淹过"),
          ],
          t(
            "The third paragraph mentions evidence of a huge tsunami in 869 and the engineers' estimate of a wave of more than fifteen meters.",
            "第三段提到了公元 869 年大海啸的证据，以及工程师对超过十五米海浪的估算。",
          ),
        ),
        ask(
          t("Why can a once-in-a-thousand-years wave be more likely than it seems?", "为什么千年一遇的海浪可能比看上去更有可能发生？"),
          t("Over many years and many plants, the chance adds up", "经过多年、涉及多座核电站，这种可能会累积起来"),
          [
            t("Waves become larger every thousand years", "海浪每过一千年就变得更大"),
            t("Earthquakes always come in pairs", "地震总是成对出现"),
            t("The yearly number was calculated incorrectly", "每年的数字算错了"),
          ],
          t(
            "The fourth paragraph says a plant running for fifty years, among many plants along a coast, faces a far greater chance than the yearly number suggests.",
            "第四段说一座运行五十年的核电站，加上沿海众多核电站，面临的可能性远比每年的数字所显示的大。",
          ),
        ),
      ],
      ["Fukushima", "Daiichi", "Japan", "Japanese", "Tokyo", "March", "Jogan"],
    ),
    passage(
      "the-fog-that-killed",
      t("The Fog That Killed", "夺命的雾"),
      `On Friday, December 5, 1952, a thick fog settled over London. Fog was common in the city, but this one was different. A cold, still mass of air lay over the Thames valley like a lid, trapping everything beneath it. Millions of chimneys were burning coal against the cold, and power stations and factories burned more. The smoke could not escape. Within a day, the fog had turned yellow-black and smelled of sulfur.

For five days, London almost stopped. In places, people could not see their own feet. Buses were led through the streets by men walking ahead with torches. Smog drifted indoors, so that a theater had to stop a performance because the audience could no longer see the stage. Cattle at a show were said to have suffocated.

At first, few people understood the scale of the danger. There were no dramatic scenes of destruction. But doctors noticed that their patients with lung and heart diseases were suddenly much worse, and undertakers ran out of coffins. When the weekly figures for deaths were counted, they showed that around four thousand more people than usual had died during the fog and the days just after. Later studies, looking at the following months as well, suggested that the total may have been about twelve thousand.

The response was slow. The government at first argued that nothing much could be done, and that the cost of controlling smoke would be too high for industry and households. But public anger grew, and a committee was set up to investigate. In 1956, Parliament passed the Clean Air Act, which created areas in which only smokeless fuels could be burned and helped households pay to change their heating.

The Great Smog is now seen as a turning point in the understanding of air pollution. It showed that a danger could be deadly without being visible in the usual way. Most of its victims did not die in the street; they died at home or in hospital of illnesses that the smoke made fatal, and the cause appeared only when someone counted.

This is a common pattern in public health. Some of the largest risks are spread thinly across many people and show up only in statistics. A careful reader of such numbers must ask not only how many died, but how many more than usual, a comparison that turns a vague sense of trouble into evidence.`,
      [crisis, risk, probability, academic10, academic2, academic1],
      [
        ask(
          t("Why did the smoke stay over London instead of escaping?", "为什么烟雾滞留在伦敦上空而没有散去？"),
          t("A cold, still mass of air trapped it like a lid", "一团寒冷静止的空气像盖子一样把它困住了"),
          [
            t("The wind blew it back from the sea every night", "每晚海风都把它吹回来"),
            t("The city's buildings were too tall for smoke to pass", "城市的建筑太高，烟雾过不去"),
            t("The government closed every chimney in the city", "政府封闭了城里所有的烟囱"),
          ],
          t(
            "The first paragraph says a cold, still mass of air lay over the valley like a lid, trapping everything beneath it.",
            "第一段说一团寒冷静止的空气像盖子一样压在河谷上空，把下面的一切都困住了。",
          ),
        ),
        ask(
          t("How was the scale of the danger discovered?", "这场危险的规模是怎样被发现的？"),
          t("By counting how many more people than usual had died", "通过统计比平常多死了多少人"),
          [
            t("By photographs of destroyed buildings", "通过被毁建筑的照片"),
            t("By reports from the theaters and cattle shows", "通过剧院和牲畜展览的报告"),
            t("By measuring how far people could see", "通过测量人们能看多远"),
          ],
          t(
            "The third paragraph says the weekly figures showed around four thousand more deaths than usual, and later studies suggested about twelve thousand.",
            "第三段说每周的统计显示比平常多死了约四千人，后来的研究认为总数约为一万二千。",
          ),
        ),
        ask(
          t("What question does the writer say a careful reader of such numbers must ask?", "作者说细心读这类数字的人必须问什么问题？"),
          t("How many more died than usual", "比平常多死了多少人"),
          [
            t("How many people lived in the city", "城里住着多少人"),
            t("How many chimneys were burning coal", "有多少烟囱在烧煤"),
            t("How long the fog lasted each day", "雾每天持续多长时间"),
          ],
          t(
            "The last paragraph says a careful reader must ask not only how many died, but how many more than usual.",
            "最后一段说细心的读者不仅要问死了多少人，还要问比平常多死了多少人。",
          ),
        ),
      ],
      ["London", "Londoners", "December", "Parliament", "Thames", "Britain", "British", "Friday", "Great", "Smog", "Clean", "Air", "Act"],
    ),
    passage(
      "the-book-about-unsafe-cars",
      t("The Book About Unsafe Cars", "一本关于不安全汽车的书"),
      `In 1965, a young lawyer named Ralph Nader published a book with an alarming title: Unsafe at Any Speed. Its argument was that the American car industry knew how to make cars safer but chose not to, because style and low cost sold cars and safety did not. When people were hurt in crashes, Nader wrote, the industry blamed the "nut behind the wheel," the careless driver, rather than the design of the car.

The book's first chapter attacked a popular small car, the Chevrolet Corvair. Its rear suspension, Nader argued, could cause the car to swing out of control in certain sharp turns. He described crashes and lawsuits, and he cited engineers who had warned about the problem. Other chapters dealt with dashboards with sharp edges, steering columns that could pierce a driver's chest in a crash, and the industry's resistance to safety features that already existed.

The book might have been a modest success. What made it famous was the response of General Motors, the company that made the Corvair. It hired private investigators to follow Nader, question his friends and look into his private life, apparently hoping to find something that would discredit him. When this became public, the president of the company was called before a committee of the Senate in 1966 and apologized. Nader later sued the company for invading his privacy and won a settlement, which he used to fund groups that worked for consumers.

The scandal helped to escalate public pressure. Later in 1966, Congress passed a law giving the federal government the power to set safety standards for new cars. Over the following decades, required features such as stronger frames, padded dashboards and collapsible steering columns helped reduce the number of deaths for each mile driven by a large amount.

Whether Nader was entirely fair to the Corvair has been debated. A later government study found that the car was not more likely to roll over than similar cars of its time, and the model that Nader criticized had already been improved. Yet his larger argument proved influential: that the risk of a product depends on its design, and that a company which knows how to reduce a risk has a responsibility to do so.

Nader's case shows how a report about risk can change a whole industry, and how the attempt to silence a critic can make his argument stronger.`,
      [risk, crisis, academic11, academic2, academic3],
      [
        ask(
          t("What was the main argument of Nader's book?", "纳德这本书的主要论点是什么？"),
          t("Car makers could make cars safer but chose not to", "汽车制造商能把车造得更安全，却选择不这样做"),
          [
            t("Drivers caused every crash by being careless", "每起车祸都是由司机粗心造成的"),
            t("Small cars were always safer than large ones", "小车总是比大车更安全"),
            t("The government should ban cars from cities", "政府应该禁止汽车进入城市"),
          ],
          t(
            "The first paragraph says the book argued that the industry knew how to make cars safer but chose not to, because style and low cost sold cars.",
            "第一段说这本书认为汽车业知道如何把车造得更安全，却因款式和低价更好卖而选择不这样做。",
          ),
        ),
        ask(
          t("What made the book famous?", "是什么让这本书出了名？"),
          t("The company hired investigators to dig into Nader's private life", "那家公司雇用调查人员挖掘纳德的私生活"),
          [
            t("It was turned into a popular film", "它被改编成了一部热门电影"),
            t("Nader was elected to the Senate", "纳德当选为参议员"),
            t("It was given away free with every new car", "每辆新车都免费附送这本书"),
          ],
          t(
            "The third paragraph says what made it famous was General Motors hiring private investigators to look into his private life, which became public.",
            "第三段说让它出名的是通用汽车公司雇用私家侦探调查他的私生活，而此事后来被公开了。",
          ),
        ),
        ask(
          t("What does the later study about the Corvair suggest?", "后来关于科维尔的研究说明了什么？"),
          t("Nader may not have been entirely fair to that car", "纳德对那款车的评判可能并不完全公正"),
          [
            t("The Corvair was the most dangerous car ever made", "科维尔是有史以来最危险的车"),
            t("Safety standards had no effect on deaths", "安全标准对死亡人数没有影响"),
            t("General Motors had never improved the model", "通用汽车从未改进过这款车"),
          ],
          t(
            "The fifth paragraph says a later study found the car was not more likely to roll over than similar cars, so whether Nader was fair has been debated.",
            "第五段说后来的研究发现这款车并不比同类车更容易翻车，所以纳德是否公正一直存在争议。",
          ),
        ),
      ],
      [
        "Ralph",
        "Nader",
        "Nader's",
        "Unsafe",
        "Speed",
        "Chevrolet",
        "Corvair",
        "General",
        "Motors",
        "Congress",
        "Senate",
        "American",
        "Americans",
        "Detroit",
      ],
    ),
    passage(
      "the-bug-that-did-not-bite",
      t("The Bug That Did Not Bite", "没有发作的漏洞"),
      `For decades, to save expensive computer memory, programmers stored years with only two digits. The year 1975 was written as 75, and 1999 as 99. It worked well until people began to think about what would happen when the year changed from 99 to 00. A computer might think the date was 1900, not 2000. Bills might be calculated for a negative number of days. Systems that compared dates might crash. The problem became known as the Year 2000 bug, or Y2K.

By the late 1990s, Y2K had become a worldwide concern. Nobody could ascertain how many systems were affected, since the old code ran inside everything from banks and power stations to elevators and hospital equipment, often written by programmers who had long since retired. Governments and companies set up teams to search through millions of lines of code and fix them. Estimates of the total cost around the world ran into the hundreds of billions of dollars. Newspapers carried stories of possible disasters: planes falling from the sky, power failing, money disappearing from bank accounts. Some people stocked up on food and water.

Midnight came on January 1, 2000, and very little happened. There were some failures, such as wrong dates on websites and a few machines that stopped working, but nothing like the catastrophe that had been feared.

Was the fear exaggerated, or did the preparation work? People still disagree. Some argue that the danger had been inflated by companies that sold repair services and by the media, and point out that some countries that spent little also had few problems. Others reply that those countries used fewer computers or relied on software fixed by others, and that the problems found and repaired during testing show that real failures were prevented.

The debate illustrates a difficulty with precaution. When a danger is avoided successfully, it can look as though there was never any danger at all. This is sometimes called the preparedness paradox: the better the preparation, the more it seems to have been unnecessary. The same pattern appears with vaccines, flood defenses and safety rules.

Judging such cases requires evidence about what was found and fixed, not only about what happened in the end. A quiet night is not, by itself, proof either that the danger was real or that it was imagined.`,
      [risk, crisis, probability, academic10, academic1, academic3],
      [
        ask(
          t("Why did storing years with two digits create a problem?", "为什么用两位数存储年份会造成问题？"),
          t("Computers might read 00 as 1900 instead of 2000", "计算机可能把 00 读成 1900 而不是 2000"),
          [
            t("Computers could not store any numbers above 99", "计算机无法存储任何大于 99 的数字"),
            t("Programmers forgot what the two digits meant", "程序员忘了这两位数字的意思"),
            t("Banks refused to accept dates written that way", "银行拒绝接受那样写的日期"),
          ],
          t(
            "The first paragraph says that when the year changed from 99 to 00, a computer might think the date was 1900, not 2000.",
            "第一段说年份从 99 变成 00 时，计算机可能以为日期是 1900 年而不是 2000 年。",
          ),
        ),
        ask(
          t("What do people who think the preparation worked point to?", "那些认为准备工作起了作用的人举出了什么证据？"),
          t("Problems found and repaired during testing", "测试期间发现并修复的问题"),
          [
            t("The planes that fell from the sky in 2000", "2000 年从天上掉下来的飞机"),
            t("The money that disappeared from banks", "从银行消失的钱"),
            t("The food and water that people stored", "人们储存的食物和水"),
          ],
          t(
            "The fourth paragraph says they reply that the problems found and repaired during testing show that real failures were prevented.",
            "第四段说他们回应称，测试期间发现并修复的问题表明真正的故障被预防了。",
          ),
        ),
        ask(
          t('What is the "preparedness paradox"?', "什么是“准备悖论”？"),
          t("The better a danger is prepared for, the more the preparation seems unnecessary", "对危险准备得越好，准备就显得越没必要"),
          [
            t("The more people prepare, the more dangerous a problem becomes", "人们准备得越多，问题就变得越危险"),
            t("Preparing for one danger always causes another", "为一种危险做准备总会引发另一种危险"),
            t("Only the best-prepared countries suffer disasters", "只有准备最充分的国家才会遭受灾难"),
          ],
          t(
            "The fifth paragraph says the paradox is that the better the preparation, the more it seems to have been unnecessary.",
            "第五段说这个悖论是：准备得越好，它就显得越没有必要。",
          ),
        ),
      ],
      ["January", "Y2K", "December", "Y"],
    ),
    passage(
      "the-fear-of-flying",
      t("The Fear of Flying", "对飞行的恐惧"),
      `After the attacks of September 11, 2001, in which hijacked planes were flown into buildings in New York and near Washington, many Americans stopped flying. For months, the number of passengers fell sharply. Some people avoided airports entirely and drove long distances instead. Given the terrible images of that day, their fear was understandable.

Yet the choice to drive was not a safe one. Mile for mile, driving on American roads is far more dangerous than flying on a commercial airline. The German psychologist Gerd Gigerenzer studied what happened next. Comparing the number of road deaths in the year after the attacks with the usual pattern, he found an increase in the months when people were most afraid of flying, especially on the kinds of roads used for long trips. He estimated that about fifteen hundred more Americans died on the roads in the year after the attacks than would otherwise have been expected. That is about half as many as were killed in the attacks themselves.

Gigerenzer explained the pattern with the idea of a "dread risk." People fear most strongly the kind of event in which many die at once, suddenly and in a way they cannot control, such as a plane crash or a terrorist attack. They fear much less the kind of risk that kills the same number of people or more, but one by one and spread out over time, such as car crashes. A single crash of a plane with two hundred passengers makes headlines around the world; two hundred separate road deaths in a week barely make the local news.

None of this means that the fear after the attacks was foolish. People did not know whether more attacks would follow, and the risk was hard to estimate. But it shows how a natural reaction to one danger can lead people into a greater one. The deaths on the roads were a kind of hidden fallout from the attacks, unseen because they happened one at a time.

Gigerenzer argued that the answer is not to tell people their fear is wrong but to give them the numbers in a form they can understand: not "flying is safe," but how many people die for every billion miles traveled by each method. When people can compare risks clearly, they can choose for themselves.`,
      [risk, probability, academic11, academic1, academic3],
      [
        ask(
          t("Why was the choice to drive instead of fly not a safe one?", "为什么选择开车而不是坐飞机并不安全？"),
          t("Mile for mile, driving is far more dangerous than flying", "按里程算，开车比坐飞机危险得多"),
          [
            t("The roads were closed for months after the attacks", "袭击后道路关闭了好几个月"),
            t("Cars were also being used in attacks", "汽车也被用于袭击"),
            t("Most drivers were too tired to drive safely", "大多数司机太累，无法安全驾驶"),
          ],
          t(
            "The second paragraph says that mile for mile, driving on American roads is far more dangerous than flying on a commercial airline.",
            "第二段说按里程计算，在美国道路上开车比乘坐民航飞机危险得多。",
          ),
        ),
        ask(
          t('What is a "dread risk"?', "什么是“恐惧风险”？"),
          t("A sudden event that kills many people at once beyond their control", "一种突然发生、一次夺去许多人生命、人们无法控制的事件"),
          [
            t("A risk that people have never heard of before", "一种人们以前从没听说过的风险"),
            t("Any risk that is reported in the local news", "任何在本地新闻中报道的风险"),
            t("A danger that kills people slowly over many years", "一种在多年间慢慢致人死亡的危险"),
          ],
          t(
            "The third paragraph says people fear most the kind of event in which many die at once, suddenly and in a way they cannot control.",
            "第三段说人们最害怕的是许多人突然同时死去、而且无法控制的那种事件。",
          ),
        ),
        ask(
          t("What does Gigerenzer suggest is the best response to such fears?", "吉仁泽认为应对这种恐惧的最好办法是什么？"),
          t("Giving people clear numbers so they can compare risks themselves", "给人们清楚的数字，让他们自己比较风险"),
          [
            t("Telling people that their fear is foolish", "告诉人们他们的恐惧是愚蠢的"),
            t("Banning people from driving long distances", "禁止人们长途驾驶"),
            t("Hiding the news of plane crashes from the public", "向公众隐瞒飞机失事的新闻"),
          ],
          t(
            "The last paragraph says the answer is to give people the numbers in a form they can understand, so they can compare risks and choose.",
            "最后一段说办法是用人们能理解的方式给出数字，让他们比较风险并自己作出选择。",
          ),
        ),
      ],
      ["Gerd", "Gigerenzer", "September", "American", "Americans", "New", "York", "Washington", "German"],
    ),
    passage(
      "a-principle-of-caution",
      t("A Principle of Caution", "审慎原则"),
      `In 1992, at a meeting of world leaders in Rio de Janeiro, governments signed a declaration on the environment that included an idea now known as the precautionary principle. In one common form, it says that where there are threats of serious or irreversible damage, the lack of full scientific certainty should not be used as a reason for postponing measures to prevent harm.

The idea sounds like common sense. If you smell smoke in a building, you do not wait until you are certain there is a fire before leaving. Science often takes years to settle a question, and some harms, such as the extinction of a species or the poisoning of a water supply, cannot be undone. The principle shifts the burden: instead of requiring proof that something is harmful before acting, it allows action on reasonable suspicion when the stakes are high.

Supporters point to cases in which waiting for certainty proved costly. Warnings about the dangers of asbestos, lead in gasoline and certain chemicals were raised long before action was taken, and in the meantime many people were harmed. Precaution, they argue, would have saved lives.

Critics, however, argue that the principle is less useful than it sounds, and sometimes harmful. Their main objection is that risks exist on all sides. Banning a new technology because it might cause harm also carries a risk: the risk of losing the good it might do. A pesticide may harm insects, but a ban on it may lead to more disease carried by mosquitoes. A new medicine may have unknown side effects, but delaying it may leave patients without treatment. If every possible harm justifies precaution, the principle can be used to justify doing nothing at all, which is itself a choice with consequences.

Some writers have proposed a more careful version. Precaution should be proportionate: commensurate with the size and likelihood of the harm and with the costs of acting. It should compare the risks of acting with the risks of not acting. And it should be provisional, to be revised as evidence comes in.

The debate shows that "better safe than sorry" is not as simple as it sounds. In most real decisions, there is no option that is perfectly safe. The question is never only whether something might be harmful, but how harmful, how likely, and compared with what.`,
      [risk, probability, academic10, academic11, academic2, academic1],
      [
        ask(
          t("What does the precautionary principle allow, according to the passage?", "根据文章，审慎原则允许做什么？"),
          t(
            "Acting on reasonable suspicion of serious harm without full certainty",
            "在不完全确定的情况下，基于对严重危害的合理怀疑采取行动",
          ),
          [
            t("Waiting for full scientific proof before doing anything", "在采取任何行动之前等待充分的科学证明"),
            t("Ignoring any harm that cannot be undone", "忽视任何无法挽回的伤害"),
            t("Banning all new technology permanently", "永久禁止一切新技术"),
          ],
          t(
            "The second paragraph says the principle allows action on reasonable suspicion when the stakes are high, instead of requiring proof first.",
            "第二段说该原则允许在利害重大时基于合理的怀疑采取行动，而不是先要求证据。",
          ),
        ),
        ask(
          t("What is the critics' main objection to the principle?", "批评者对该原则的主要反对意见是什么？"),
          t("Risks exist on all sides, including the risk of not acting", "各方面都有风险，包括不行动的风险"),
          [
            t("Scientists are always certain about harms", "科学家对危害总是很确定"),
            t("Pesticides never cause any harm to insects", "杀虫剂从不伤害昆虫"),
            t("Governments never sign declarations about the environment", "政府从不签署关于环境的宣言"),
          ],
          t(
            "The fourth paragraph says the critics' main objection is that risks exist on all sides, so banning something also carries a risk.",
            "第四段说批评者的主要反对意见是各方面都有风险，所以禁止某种东西本身也带有风险。",
          ),
        ),
        ask(
          t('What does a "proportionate" version of precaution require?', "“相称的”审慎原则要求什么？"),
          t("Matching the action to the size and likelihood of the harm and the costs", "让行动与危害的大小、可能性以及成本相称"),
          [
            t("Taking the strongest action possible against every risk", "对每一种风险都采取最强有力的行动"),
            t("Never changing a decision once it is made", "一旦作出决定就永不改变"),
            t("Considering only the risks of acting, not of waiting", "只考虑行动的风险，而不考虑等待的风险"),
          ],
          t(
            "The fifth paragraph says precaution should be commensurate with the size and likelihood of the harm and with the costs of acting.",
            "第五段说审慎应当与危害的大小和可能性以及行动的成本相称。",
          ),
        ),
      ],
      ["Rio", "Janeiro", "Earth", "Summit", "United", "Nations"],
    ),
    passage(
      "the-country-that-decided-never-to-flood-again",
      t("The Country That Decided Never to Flood Again", "决心不再遭受水灾的国家"),
      `Much of the Netherlands lies below the level of the sea, protected by dikes, dunes and pumps. On the night of January 31, 1953, a powerful storm combined with a high spring tide to drive the North Sea against the southwest of the country. The water rose higher than the dikes had been built to withstand. Hundreds of breaches opened. By morning, large areas were under water. More than eighteen hundred people died, and tens of thousands lost their homes and animals.

The Dutch response was remarkable for its ambition. Within weeks, the government set up a committee of experts to make sure such a disaster could never happen again. The committee did something unusual: it asked how safe was safe enough, and tried to answer with numbers. It weighed the cost of building higher defenses against the value of what they would protect, the people, homes, farms and factories, and the likelihood of floods of different sizes. For the heart of the country, it set a standard that the defenses should withstand a storm expected, on average, only once in ten thousand years.

To meet the standard, the government built the Delta Works, a system of dams, sluices and barriers that shortened the coastline and closed off several sea inlets. The work took decades. When the plan reached the last and widest inlet, the Eastern Scheldt, it ran into opposition. Fishermen and environmental groups pointed out that a solid dam would turn a rich tidal water into a still lake, destroying its oyster and mussel beds and the life around them.

After long debate, the plan was changed. Instead of a closed dam, engineers built a huge barrier with sixty-two gates that stay open in normal weather, letting the tides flow, and close only when a dangerous storm approaches. It cost far more than a dam, but it protected both the land and the life of the estuary. It was completed in 1986.

The Delta Works are now studied around the world, especially as rising seas increase the risk of floods. Their lesson is not only engineering. It is that a society can decide, openly, how much risk it is willing to accept, weigh that against the cost and against other values, and then commit to a plan for generations. The Dutch did not try to make the risk zero, which would have been impossible. They decided how small it had to be.`,
      [crisis, risk, probability, academic11],
      [
        ask(
          t("What was unusual about the Delta Committee's approach?", "三角洲委员会的做法有什么不寻常之处？"),
          t("It tried to answer with numbers how safe was safe enough", "它试图用数字回答多安全才算足够安全"),
          [
            t("It decided to abandon the lowest parts of the country", "它决定放弃国家地势最低的地区"),
            t("It refused to consider the cost of the defenses", "它拒绝考虑防御工程的成本"),
            t("It asked other countries to pay for the work", "它要求其他国家为这项工程出钱"),
          ],
          t(
            "The second paragraph says the committee asked how safe was safe enough and tried to answer with numbers, weighing costs, values and likelihoods.",
            "第二段说委员会提出了多安全才算足够安全的问题，并试图用数字回答，权衡成本、价值和可能性。",
          ),
        ),
        ask(
          t("Why was the plan for the Eastern Scheldt changed?", "东斯海尔德的方案为什么改变了？"),
          t("A solid dam would have destroyed the tidal life of the estuary", "一座实心大坝会毁掉河口的潮汐生态"),
          [
            t("Engineers found that a dam was impossible to build", "工程师发现大坝不可能建成"),
            t("The storm of 1953 had not reached that inlet", "1953 年的风暴没有到达那个入海口"),
            t("The government ran out of money for the project", "政府没钱继续这个工程了"),
          ],
          t(
            "The third paragraph says fishermen and environmental groups pointed out that a solid dam would turn the tidal water into a still lake and destroy its life.",
            "第三段说渔民和环保团体指出，实心大坝会把潮汐水域变成静止的湖泊，毁掉那里的生物。",
          ),
        ),
        ask(
          t("What is the lesson of the Delta Works, according to the writer?", "作者认为三角洲工程的启示是什么？"),
          t("A society can openly decide how much risk to accept and plan for it", "一个社会可以公开决定接受多大的风险，并为之作长远规划"),
          [
            t("Every risk of flooding can be reduced to zero", "每一种洪水风险都可以降为零"),
            t("Engineering is more important than any other value", "工程比任何其他价值都重要"),
            t("Rising seas will make all defenses useless", "海平面上升将使所有防御都失效"),
          ],
          t(
            "The last paragraph says a society can decide openly how much risk to accept, weigh it against cost and other values, and commit to a plan for generations.",
            "最后一段说一个社会可以公开决定愿意接受多大的风险，把它与成本及其他价值相权衡，并为几代人作出规划。",
          ),
        ),
      ],
      ["Netherlands", "Dutch", "Eastern", "Scheldt", "North", "Sea", "Delta", "Works", "Committee", "January", "February", "Holland"],
    ),
  ],
};
