// B1, unit 10: Science and Discovery. Science, research, exploring space, inventions, numbers and amounts, forces and
// matter, and describing change; the past perfect; writing a summary. Its tense consistency reuses the native topic.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const science = vocabularyTopic({
  id: "b1-words-science",
  title: t("Science", "科学"),
  summary: t(
    "Theories; atoms, cells and genes; evolution and gravity; oxygen, chemicals and substances; liquids, solids and particles.",
    "理论；原子、细胞和基因；进化和引力；氧气、化学物质和物质；液体、固体和微粒。",
  ),
  prerequisites: ["b1-words-research-and-design"],
  words: [
    word(
      "theory theories",
      "an idea that tries to explain why something happens",
      "理论；学说",
      "Einstein's {theory} changed the way we think about time.|oxygen gravity | Scientists have several {theories} about why the dinosaurs died.|oxygens liquids | In {theory}, the plan should work.|oxygen liquid",
      "thesis therapy",
    ),
    word(
      "atom atoms",
      "the smallest part of a chemical element",
      "原子",
      "Everything is made of {atoms}.|genes evolutions | A water molecule has three {atoms}: two of hydrogen and one of oxygen.|genes cells | An {atom} is far too small to see.|evolution oxygen",
      "item planet",
      "particle",
    ),
    word(
      "cell cells",
      "the smallest living part of a plant or an animal",
      "细胞",
      "The human body is made of trillions of {cells}.|theories gravities | Under the microscope, we could see the plant {cells}.|theories gravities | Red blood {cells} carry oxygen around the body.|theories liquids",
      "sell shell",
    ),
    word(
      "gene genes",
      "a part of a cell that passes qualities from parents to children",
      "基因",
      "You get your {genes} from your parents.|theories oxygens | Some illnesses are caused by a faulty {gene}.|gravity theory | Scientists found the {gene} that controls eye color.|gravity oxygen",
      "germ general",
    ),
    word(
      "evolution",
      "the slow change of living things over millions of years",
      "进化",
      "Darwin wrote about the {evolution} of animals.|gravity oxygen | Human {evolution} took millions of years.|gravity oxygen | The museum has a room about {evolution}.|gravity liquid",
      "revolution election",
    ),
    word(
      "gravity",
      "the force that pulls things toward the Earth",
      "引力；重力",
      "{Gravity} keeps the moon in orbit around the Earth.|Oxygen Evolution | Astronauts float because there is little {gravity} in space.|oxygen evolution | An apple falls because of {gravity}.|oxygen evolution",
      "gravel energy",
    ),
    word(
      "oxygen",
      "a gas in the air that people, animals and plants need to live",
      "氧气",
      "Fish take {oxygen} from the water.|gravity evolution | There is less {oxygen} at the top of high mountains.|gravity evolution | Plants produce {oxygen}.|gravity evolution",
      "carbon nitrogen",
    ),
    word(
      "chemical chemicals",
      "a substance made by or used in chemistry",
      "化学品；化学物质",
      "Farmers use {chemicals} to kill insects.|genes atoms | This cleaner contains dangerous {chemicals}.|genes theories | The factory leaked a {chemical} into the river.|gene theory",
      "chemist medical",
      "substance",
    ),
    word(
      "substance substances",
      "a type of solid, liquid or gas",
      "物质",
      "Water is the most common {substance} on Earth.|theory evolution | Some {substances} are dangerous to touch.|theories genes | Glue is a sticky {substance}.|theory gene",
      "subject distance",
      "chemical",
    ),
    word(
      "liquid liquids",
      "something such as water or oil that flows",
      "液体",
      "Water is a {liquid} at room temperature.|gravity gene | You can't take {liquids} on the plane in your hand luggage.|genes theories | Pour the {liquid} into a glass.|gene theory",
      "solid gas",
    ),
    word(
      "solid solider solidest",
      "hard, not a liquid or a gas",
      "固体的；坚固的",
      "Ice is water in its {solid} form.|liquid oxygen | The door is made of {solid} wood.|liquid chemical | The ground was frozen {solid}.|liquid oxygen",
      "solar liquid",
    ),
    word(
      "particle particles",
      "a very small piece of something",
      "微粒；颗粒",
      "Tiny {particles} of dust were floating in the light.|theories genes | The air in the city is full of dirty {particles}.|theories genes | A {particle} of sand got into my eye.|theory gene",
      "article partner",
      "atom",
    ),
  ],
});

const research = vocabularyTopic({
  id: "b1-words-research",
  title: t("Research", "研究"),
  summary: t(
    "Observing and observations; hypotheses, conclusions and outcomes; analyzing samples and surveys; investigating, predicting, estimating and calculating.",
    "观察和观察结果；假设、结论和结果；分析样本和调查；调查研究、预测、估计和计算。",
  ),
  prerequisites: ["b1-words-research-and-design"],
  words: [
    word(
      "observe observes observed observing",
      "to watch something carefully to learn about it",
      "观察",
      "Scientists {observed} the birds for three years.|calculated estimated | We {observe} the stars through a telescope.|calculate estimate | She sat quietly, {observing} the animals.|calculating estimating",
      "obey serve",
    ),
    word(
      "observation observations",
      "the careful watching of something; something you notice",
      "观察；观察结果",
      "Write down your {observations} in your notebook.|samples surveys | The patient is in hospital for {observation}.|hypothesis sample | Her {observation} was that the plants grew faster in the light.|sample survey",
      "operation obligation",
    ),
    word(
      "hypothesis",
      "an idea that you test to see if it is true",
      "假设；假说",
      "Our {hypothesis} was that warm water freezes faster.|sample survey | The experiment proved his {hypothesis} wrong.|sample survey | First, form a {hypothesis}; then test it.|sample survey",
      "hypocrite hospital",
    ),
    word(
      "conclusion conclusions",
      "what you decide after thinking about all the facts",
      "结论",
      "What {conclusion} did you reach?|sample survey | It's too early to draw any {conclusions}.|samples surveys | In {conclusion}, the experiment was a success.|sample survey",
      "confusion collection",
    ),
    word(
      "outcome outcomes",
      "the result of an action, a process or an event",
      "结果；结局",
      "We are waiting for the {outcome} of the tests.|hypothesis sample | Nobody knows what the {outcome} of the election will be.|hypothesis sample | The study had two possible {outcomes}.|samples surveys",
      "income outline",
      "conclusion",
    ),
    word(
      "analyze analyzes analyzed analyzing",
      "to study something in detail to understand it",
      "分析",
      "The scientists {analyzed} the water from the river.|predicted estimated | We need to {analyze} the data before we decide.|predict estimate | Computers can {analyze} millions of photos in a minute.|predict estimate",
      "paralyze apologize",
      "investigate",
    ),
    word(
      "sample samples",
      "a small amount of something that shows what the rest is like",
      "样本；样品",
      "The doctor took a blood {sample}.|hypothesis conclusion | We tested {samples} of soil from ten farms.|hypotheses conclusions | The shop gave us free {samples} of the new cheese.|hypotheses conclusions",
      "simple example",
    ),
    word(
      "survey surveys",
      "a set of questions that you ask many people to find out what they think or do",
      "调查",
      "A {survey} showed that most students sleep less than eight hours.|hypothesis conclusion | Please fill in our short online {survey}.|hypothesis outcome | We did a {survey} of 500 people.|hypothesis conclusion",
      "surgery service",
    ),
    word(
      "investigate investigates investigated investigating",
      "to try to find out the facts about something",
      "调查；研究",
      "The police are {investigating} the robbery.|predicting calculating | Scientists are {investigating} why the bees are dying.|calculating estimating | We {investigated} how light affects plant growth.|calculated estimated",
      "invest invite",
      "analyze",
    ),
    word(
      "predict predicts predicted predicting",
      "to say what will happen in the future",
      "预测；预言",
      "The weather forecast {predicts} rain tomorrow.|observes analyzes | Nobody {predicted} that the team would win.|observed analyzed | It's hard to {predict} how prices will change.|observe analyze",
      "protect produce",
    ),
    word(
      "estimate estimates estimated estimating",
      "to guess an amount or a number without counting it exactly",
      "估计；估算",
      "Scientists {estimate} that there are 8 million kinds of animals.|observe analyze | Can you {estimate} how long the journey will take?|observe analyze | The fire caused an {estimated} two million dollars of damage.|observed analyzed",
      "eliminate measure",
    ),
    word(
      "calculate calculates calculated calculating",
      "to find a number or an amount using math",
      "计算",
      "{Calculate} the area of the room.|Observe Investigate | The app {calculates} how many calories you burn.|observes investigates | We {calculated} that the trip would cost 500 dollars.|observed investigated",
      "circulate collect",
    ),
  ],
});

const space = vocabularyTopic({
  id: "b1-words-space-2",
  title: t("Exploring Space", "探索太空"),
  summary: t(
    "The universe and galaxies; orbits, telescopes and satellites; spacecraft, missions and launches; astronomers and comets; aliens and explorers.",
    "宇宙和星系；轨道、望远镜和卫星；航天器、任务和发射；天文学家和彗星；外星人和探险家。",
  ),
  prerequisites: ["a2-words-space"],
  words: [
    word(
      "universe universes",
      "everything that exists, including all the stars and planets",
      "宇宙",
      "The {universe} is about 14 billion years old.|comet telescope | Are we alone in the {universe}?|comet satellite | Some scientists think there may be other {universes}.|comets telescopes",
      "university galaxy",
    ),
    word(
      "galaxy galaxies",
      "a very large group of stars",
      "星系",
      "Our sun is one of billions of stars in our {galaxy}.|telescope mission | There are billions of {galaxies} in the universe.|telescopes missions | The nearest {galaxy} to ours is very far away.|telescope mission",
      "gallery planet",
      "universe",
    ),
    word(
      "orbit orbits orbited orbiting",
      "to move around a planet or a star; the path of this movement",
      "绕轨道运行；轨道",
      "The Earth {orbits} the sun once a year.|launches observes | The satellite is now in {orbit} around Mars.|alien mission | The space station {orbited} the Earth sixteen times a day.|launched observed",
      "border order",
    ),
    word(
      "telescope telescopes",
      "a tube with glass in it that makes things far away look bigger",
      "望远镜",
      "We looked at the moon through a {telescope}.|satellite comet | The new space {telescope} can see very distant galaxies.|comet alien | Galileo used a {telescope} to study Jupiter.|comet mission",
      "microscope telephone",
    ),
    word(
      "satellite satellites",
      "a machine sent into space to go around the Earth and send back information",
      "卫星",
      "Weather {satellites} take photos of the clouds.|comets galaxies | The TV signal comes from a {satellite}.|comet galaxy | The moon is the Earth's only natural {satellite}.|comet galaxy",
      "settlement planet",
    ),
    word(
      "spacecraft",
      "a vehicle that travels in space",
      "航天器；宇宙飞船",
      "The {spacecraft} landed safely on Mars.|astronomer galaxy | Three astronauts are on board the {spacecraft}.|galaxy comet | The {spacecraft} took nine years to reach Pluto.|galaxy astronomer",
      "aircraft spaceman",
    ),
    word(
      "mission missions",
      "an important journey or a task, often in space",
      "任务；使命",
      "The {mission} to the moon was a success.|galaxy orbit | NASA is planning new {missions} to Mars.|galaxies comets | Her {mission} is to help children learn to read.|galaxy comet",
      "machine emission",
    ),
    word(
      "launch launches launched launching",
      "to send a rocket or a spacecraft into the sky",
      "发射；推出",
      "China {launched} a new satellite last week.|orbited observed | The rocket will {launch} at six in the morning.|orbit observe | The company is {launching} a new phone in May.|orbiting observing",
      "lunch land",
    ),
    word(
      "astronomer astronomers",
      "a scientist who studies the stars and planets",
      "天文学家",
      "The {astronomer} discovered a new comet.|galaxy orbit | {Astronomers} use powerful telescopes.|Explorers Aliens | She became an {astronomer} because she loved the night sky.|explorer alien",
      "astronaut astrologer",
    ),
    word(
      "comet comets",
      "an object in space made of ice and dust, with a bright tail",
      "彗星",
      "Halley's {Comet} can be seen from Earth every 76 years.|Galaxy Mission | The {comet} had a long, bright tail.|galaxy mission | Some scientists think {comets} brought water to the Earth.|galaxies missions",
      "comment rocket",
    ),
    word(
      "alien aliens",
      "a creature from another planet",
      "外星人",
      "Do you believe in {aliens}?|astronomers missions | The film is about an {alien} who lands in a small town.|astronomer orbit | The children dressed up as green {aliens}.|missions orbits",
      "allien foreigner",
    ),
    word(
      "explorer explorers",
      "a person who travels to places that few people have seen",
      "探险家",
      "The {explorer} crossed the desert on a camel.|alien satellite | Zheng He was a famous Chinese {explorer}.|satellite alien | Early {explorers} drew maps of the coast.|satellites aliens",
      "explosion engineer",
    ),
  ],
});

const inventions = vocabularyTopic({
  id: "b1-words-inventions",
  title: t("Inventions", "发明"),
  summary: t(
    "Steam, telephones and microscopes; patents and prototypes; breakthroughs; geniuses and pioneers; innovation, techniques and inventions; brilliant.",
    "蒸汽、电话和显微镜；专利和原型；突破；天才和先驱；创新、技术和发明；杰出的。",
  ),
  prerequisites: ["a2-words-machines"],
  words: [
    word(
      "steam",
      "the hot gas that water becomes when it boils",
      "蒸汽",
      "{Steam} was coming out of the kettle.|Genius Patent | The first trains were driven by {steam}.|patent genius | We cooked the fish in {steam}.|patent genius",
      "smoke stream",
    ),
    word(
      "telephone telephones",
      "a machine that lets you talk to someone far away",
      "电话",
      "Alexander Graham Bell is known for the {telephone}.|genius pioneer | Can I use your {telephone}?|genius pioneer | Few homes had a {telephone} a hundred years ago.|genius pioneer",
      "television microphone",
    ),
    word(
      "microscope microscopes",
      "an instrument that makes very small things look bigger",
      "显微镜",
      "We looked at the cells under a {microscope}.|patent pioneer | The {microscope} showed tiny animals in the water.|patent pioneer | Students use {microscopes} in the biology lab.|patents pioneers",
      "telescope microphone",
    ),
    word(
      "patent patents",
      "an official right to be the only one to make or sell an invention",
      "专利",
      "She got a {patent} for her new kind of battery.|genius technique | Edison had more than a thousand {patents}.|geniuses techniques | The company owns the {patent} on this design.|genius pioneer",
      "parent passport",
    ),
    word(
      "prototype prototypes",
      "the first form of a new machine, used to test it",
      "原型；样机",
      "Engineers built a {prototype} of the new car.|genius pioneer | The first {prototype} didn't work, so they tried again.|genius pioneer | They are testing three {prototypes} of the robot.|geniuses pioneers",
      "photograph protest",
    ),
    word(
      "breakthrough breakthroughs",
      "an important new discovery",
      "突破",
      "The new medicine is a major {breakthrough}.|genius pioneer | Scientists made a {breakthrough} in cancer research.|genius technique | There have been many {breakthroughs} in computing.|geniuses pioneers",
      "breakdown throughway",
      "innovation invention",
    ),
    word(
      "genius geniuses",
      "a person who is extremely clever or skilled",
      "天才",
      "Einstein was a {genius}.|patent prototype | You fixed it in five minutes. You're a {genius}!|patent prototype | Mozart was a musical {genius}.|patent prototype",
      "general generous",
    ),
    word(
      "pioneer pioneers",
      "one of the first people to do something new",
      "先驱；开拓者",
      "Marie Curie was a {pioneer} in the study of radioactivity.|patent prototype | The company was a {pioneer} of electric cars.|patent prototype | Early {pioneers} of flight took great risks.|patents prototypes",
      "engineer passenger",
    ),
    word(
      "innovation innovations",
      "a new idea, method or invention; bringing in new things",
      "创新；新事物",
      "The company is famous for {innovation}.|steam genius | Online banking was a great {innovation}.|steam genius | The fair shows the latest {innovations} in farming.|geniuses patents",
      "invitation information",
      "invention breakthrough",
    ),
    word(
      "technique techniques",
      "a special way of doing something",
      "技巧；技术",
      "The painter used a new {technique}.|genius steam | Doctors are learning a new surgical {technique}.|genius steam | Good runners practice their breathing {techniques}.|geniuses patents",
      "technology mechanic",
    ),
    word(
      "invention inventions",
      "something new that someone has made or designed for the first time",
      "发明；发明物",
      "The printing press was an important {invention}.|genius steam | The light bulb is one of Edison's most famous {inventions}.|geniuses techniques | Paper is a Chinese {invention}.|genius steam",
      "intention invitation",
      "innovation breakthrough",
    ),
    word(
      "brilliant",
      "very clever, or very good",
      "聪明的；出色的",
      "She's a {brilliant} scientist.|steam patent | What a {brilliant} idea!|steam patent | The film was {brilliant}.|steamed patented",
      "brilliance bright-eyed",
    ),
  ],
});

const amounts = vocabularyTopic({
  id: "b1-words-numbers-and-amounts",
  title: t("Numbers and Amounts", "数字和数量"),
  summary: t(
    "Percents and percentages; averages and totals; majorities and minorities; doubling; rates; dozens and billions; maximum and minimum.",
    "百分之……和百分比；平均数和总数；多数和少数；翻倍；比率；一打和十亿；最大值和最小值。",
  ),
  prerequisites: ["a2-words-quantities"],
  words: [
    word(
      "percent",
      "for or out of every hundred",
      "百分之……",
      "Fifty {percent} of the students walk to school.|dozen billion | Prices rose by ten {percent}.|dozen billion | Only five {percent} of the water on Earth is fresh.|dozen billion",
      "per present",
      "percentage",
    ),
    word(
      "percentage percentages",
      "an amount said as a number out of a hundred",
      "百分比",
      "What {percentage} of people own a car?|dozen billion | A high {percentage} of the population lives in cities.|dozen minimum | The {percentage} of young people who smoke has fallen.|dozen billion",
      "passage parentage",
      "percent",
    ),
    word(
      "average averages",
      "the number you get by adding numbers together and dividing by how many there are; usual",
      "平均数；平均的",
      "The {average} age of the students is fifteen.|dozen billion | On {average}, people sleep seven hours a night.|dozen maximum | She is taller than {average}.|dozen billion",
      "advantage everage",
    ),
    word(
      "total totals",
      "the number you get when you add everything together",
      "总数；总计",
      "The {total} cost of the trip was 900 dollars.|dozen billion | In {total}, 200 people came to the meeting.|dozen billion | Add up the numbers and write the {total} at the bottom.|dozen billion",
      "total-up tool",
    ),
    word(
      "majority majorities",
      "more than half of a group",
      "大多数",
      "The {majority} of students passed the exam.|minimum dozen | A large {majority} voted for the new rule.|dozen minimum | The {majority} of people in the survey wanted more parks.|dozen minimum",
      "major maturity",
    ),
    word(
      "minority minorities",
      "less than half of a group",
      "少数",
      "Only a {minority} of people disagreed.|dozen maximum | China has fifty-five ethnic {minorities}.|dozens maximums | A small {minority} of drivers break the speed limit.|dozen maximum",
      "minor memory",
    ),
    word(
      "double doubles doubled doubling",
      "to become twice as big, or to make something twice as big",
      "翻倍；加倍",
      "The population of the city has {doubled} in thirty years.|totaled averaged | Prices will {double} if we wait.|total average | The number of cars is {doubling} every ten years.|totaling averaging",
      "trouble divide",
    ),
    word(
      "rate rates",
      "how fast or how often something happens; a level of payment",
      "比率；速度",
      "The birth {rate} is falling in many countries.|dozen billion | Your heart {rate} goes up when you run.|dozen billion | Interest {rates} are very low at the moment.|dozens billions",
      "rat route",
    ),
    word(
      "dozen dozens",
      "twelve",
      "一打；十二个",
      "I bought a {dozen} eggs.|billion majority | {Dozens} of people were waiting outside.|Majorities Percentages | There are about a {dozen} students in the club.|majority percentage",
      "dozing ten",
    ),
    word(
      "billion billions",
      "a thousand million (1,000,000,000)",
      "十亿",
      "The world population is about eight {billion}.|dozens majorities | The bridge cost two {billion} dollars.|average majority | {Billions} of stars shine in our galaxy.|Majorities Averages",
      "million trillion",
    ),
    word(
      "maximum",
      "the largest amount or number that is possible or allowed",
      "最大值；最高的",
      "The {maximum} speed on this road is eighty kilometers an hour.|minority dozen | The lift can carry a {maximum} of ten people.|minority dozen | Bring a {maximum} of two bags.|minority majority",
      "maximize medium",
    ),
    word(
      "minimum",
      "the smallest amount or number that is possible or allowed",
      "最小值；最低的",
      "You need a {minimum} of three people to play this game.|majority dozen | The {minimum} age for driving is eighteen.|majority billion | Keep the noise to a {minimum}, please.|majority billion",
      "minute medium",
    ),
  ],
});

const physics = vocabularyTopic({
  id: "b1-words-physics",
  title: t("Forces and Matter", "力和物质"),
  summary: t(
    "Force, motion and speed; friction; magnets and magnetic; reflecting; mass and volume; surfaces and layers; elements.",
    "力、运动和速度；摩擦力；磁铁和有磁性的；反射；质量和体积；表面和层；元素。",
  ),
  prerequisites: ["b1-words-science"],
  words: [
    word(
      "force forces",
      "the power that makes something move or change shape",
      "力；力量",
      "The {force} of the wind knocked down the tree.|layer surface | Gravity is the {force} that pulls things down.|layer volume | Pushing and pulling are both {forces}.|layers surfaces",
      "fork fence",
    ),
    word(
      "motion",
      "moving, or the way something moves",
      "运动；移动",
      "The {motion} of the boat made me feel sick.|mass volume | Newton wrote three laws of {motion}.|mass element | The film shows the goal in slow {motion}.|mass volume",
      "emotion lotion",
    ),
    word(
      "speed speeds",
      "how fast something moves",
      "速度",
      "The train travels at a {speed} of 300 kilometers an hour.|mass layer | Light travels at a very high {speed}.|mass layer | Drivers must reduce their {speed} near schools.|mass surface",
      "spend seed",
    ),
    word(
      "friction",
      "the force that makes it hard for one surface to move over another",
      "摩擦；摩擦力",
      "{Friction} between the tires and the road helps a car stop.|Volume Mass | Rubbing your hands together makes heat because of {friction}.|volume mass | Oil reduces the {friction} between the parts of an engine.|volume layer",
      "fiction fraction",
    ),
    word(
      "magnet magnets",
      "a piece of metal that pulls iron toward it",
      "磁铁",
      "The {magnet} picked up all the pins.|surface element | We put photos on the fridge with {magnets}.|surfaces elements | A compass needle is a small {magnet}.|surface layer",
      "magnetic magazine",
      "magnetic",
    ),
    word(
      "magnetic",
      "able to pull iron, like a magnet",
      "有磁性的；磁的",
      "Iron is a {magnetic} metal.|surface motion | The Earth has a {magnetic} field.|surface volume | This card has a {magnetic} strip.|surface volume",
      "magic metallic",
      "magnet",
    ),
    word(
      "reflect reflects reflected reflecting",
      "to send back light, heat or sound from a surface",
      "反射；映出",
      "The mirror {reflects} light.|layers forces | Her face was {reflected} in the water.|layered forced | White clothes {reflect} the heat of the sun.|layer force",
      "react collect",
    ),
    word(
      "mass masses",
      "the amount of matter in something; a large amount",
      "质量；大量",
      "The {mass} of the Earth is huge.|friction magnetic | Heavier objects have more {mass}.|magnetic reflect | A {mass} of people gathered in the square.|speed friction",
      "mess math",
    ),
    word(
      "volume volumes",
      "the amount of space that something fills; how loud a sound is",
      "体积；音量",
      "What is the {volume} of this box?|friction motion | Please turn down the {volume}.|friction motion | The {volume} of traffic has increased.|friction motion",
      "value column",
    ),
    word(
      "surface surfaces",
      "the outside or the top part of something",
      "表面",
      "The {surface} of the moon is covered in dust.|friction motion | Oil floats on the {surface} of water.|friction motion | Clean all the kitchen {surfaces}.|frictions motions",
      "service surprise",
    ),
    word(
      "layer layers",
      "an amount of something that covers a surface, or lies between other things",
      "层",
      "A thin {layer} of ice covered the lake.|speed motion | The cake has three {layers}.|speeds motions | Wear several {layers} of clothes in cold weather.|speeds motions",
      "lawyer player",
    ),
    word(
      "element elements",
      "a simple substance, such as gold or oxygen, that cannot be split into other substances",
      "元素；要素",
      "Gold is a chemical {element}.|motion friction | There are 118 known {elements}.|motions frictions | Hydrogen is the lightest {element}.|motion friction",
      "elephant elevator",
    ),
  ],
});

const change = vocabularyTopic({
  id: "b1-words-describing-change",
  title: t("Describing Change", "描述变化"),
  summary: t(
    "Gradual and gradually; rapid and rapidly; steady and steadily; slight and slightly; significant and constant; temporary and permanent.",
    "逐渐的和逐渐地；迅速的和迅速地；稳定的和稳定地；轻微的和稍微；显著的和持续不断的；暂时的和永久的。",
  ),
  prerequisites: ["b1-words-change"],
  words: [
    word(
      "gradual",
      "happening slowly, over a long time",
      "逐渐的",
      "There has been a {gradual} rise in temperatures.|gradually rapidly | Learning a language is a {gradual} process.|gradually slightly | The change was so {gradual} that nobody noticed it.|gradually steadily",
      "graduate grateful",
      "gradually steady",
    ),
    word(
      "gradually",
      "slowly, over a long time",
      "逐渐地",
      "The weather {gradually} got warmer.|gradual rapid | {Gradually}, she began to understand the language.|Gradual Rapid | The town has {gradually} become a city.|gradual steady",
      "graduated generally",
      "gradual steadily",
    ),
    word(
      "rapid",
      "happening very quickly",
      "迅速的",
      "The city has seen {rapid} growth.|rapidly gradually | There was a {rapid} change in the weather.|rapidly slightly | She made {rapid} progress in English.|rapidly steadily",
      "rabbit rigid",
      "rapidly",
    ),
    word(
      "rapidly",
      "very quickly",
      "迅速地",
      "Prices are rising {rapidly}.|rapid gradual | The illness spread {rapidly}.|rapid slight | Technology is changing {rapidly}.|rapid permanent",
      "rarely rapidity",
      "rapid",
    ),
    word(
      "steady",
      "continuing at the same speed or level",
      "稳定的；平稳的",
      "There has been a {steady} increase in visitors.|steadily rapidly | He has a {steady} job at the bank.|steadily slightly | Keep the ladder {steady} while I climb.|steadily rapidly",
      "study ready",
      "steadily gradual",
    ),
    word(
      "steadily",
      "at a regular, even rate",
      "稳定地；不断地",
      "The number of students has grown {steadily}.|steady gradual | It rained {steadily} all day.|steady rapid | Prices have risen {steadily} for ten years.|steady slight",
      "suddenly sadly",
      "steady gradually",
    ),
    word(
      "slight",
      "small; not important or serious",
      "轻微的；微小的",
      "I have a {slight} headache.|slightly steadily | There's a {slight} problem with the computer.|slightly rapidly | She speaks English with a {slight} accent.|slightly gradually",
      "light slim",
      "slightly",
    ),
    word(
      "slightly",
      "a little",
      "稍微；略微",
      "I feel {slightly} better today.|slight rapid | The price went up {slightly}.|slight gradual | This shirt is {slightly} too big.|slight steady",
      "lightly slowly",
      "slight",
    ),
    word(
      "significant",
      "large or important enough to notice",
      "显著的；重要的",
      "There has been a {significant} fall in crime.|slightly rapidly | This is a {significant} discovery.|rapidly gradually | Did anything {significant} happen while I was away?|temporary rapidly",
      "signature magnificent",
    ),
    word(
      "constant",
      "happening all the time, or staying the same",
      "持续不断的；恒定的",
      "The {constant} noise from the road keeps me awake.|slightly rapidly | Keep the water at a {constant} temperature.|slightly rapidly | She is in {constant} pain.|slightly gradually",
      "content consonant",
    ),
    word(
      "temporary",
      "lasting for only a short time",
      "暂时的；临时的",
      "She has a {temporary} job for the summer.|permanent constant | The road is closed, but it's only {temporary}.|permanent constant | We moved to a {temporary} home after the fire.|rapidly slightly",
      "contemporary temperature",
    ),
    word(
      "permanent",
      "lasting for a very long time or forever",
      "永久的；长期的",
      "Smoking can cause {permanent} damage to your lungs.|rapidly slightly | She's looking for a {permanent} job.|slightly rapidly | Is this a {permanent} address or a temporary one?|temporary slightly",
      "payment pertinent",
    ),
  ],
});

// The past perfect.

/**
 * earlier are sentences with the past perfect: the sentence with a gap, the verb to use, the right form, two wrong
 * forms, and the earlier and the later of the two events, or empty strings when the sentence has no two events to order.
 */
const earlier: readonly (readonly [string, string, string, readonly [string, string], string, string])[] = [
  ["When we arrived, the film ___.", "start", "had started", ["has started", "had start"], "The film started.", "We arrived."],
  [
    "When I got to the station, the train ___.",
    "leave",
    "had left",
    ["has left", "had leaved"],
    "The train left.",
    "I got to the station.",
  ],
  ["She was tired because she ___ all day.", "work", "had worked", ["has worked", "had work"], "She worked all day.", "She was tired."],
  [
    "By the time the police came, the thief ___.",
    "escape",
    "had escaped",
    ["has escaped", "had escape"],
    "The thief escaped.",
    "The police came.",
  ],
  ["I couldn't get in because I ___ my key.", "lose", "had lost", ["have lost", "had losed"], "I lost my key.", "I couldn't get in."],
  [
    "After he ___ his homework, he watched TV.",
    "finish",
    "had finished",
    ["has finished", "had finish"],
    "He finished his homework.",
    "He watched TV.",
  ],
  [
    "The ground was wet because it ___ in the night.",
    "rain",
    "had rained",
    ["has rained", "had rain"],
    "It rained in the night.",
    "The ground was wet.",
  ],
  ["When I phoned Anna, she ___ to bed.", "go", "had gone", ["has gone", "had went"], "Anna went to bed.", "I phoned Anna."],
  ["We weren't hungry because we ___ lunch.", "eat", "had eaten", ["have eaten", "had ate"], "We ate lunch.", "We weren't hungry."],
  ["Before that trip, he ___ on a plane.", "never be", "had never been", ["has never been", "had never be"], "", ""],
  [
    "When the teacher arrived, the students ___ the test.",
    "begin",
    "had begun",
    ["have begun", "had began"],
    "The students began the test.",
    "The teacher arrived.",
  ],
  ["I recognized her because I ___ her before.", "meet", "had met", ["have met", "had meet"], "I met her.", "I recognized her."],
  ["The shop ___ by the time we got there.", "close", "had closed", ["has closed", "had close"], "The shop closed.", "We got there."],
  [
    "She showed me the dress she ___.",
    "buy",
    "had bought",
    ["has bought", "had buyed"],
    "She bought the dress.",
    "She showed me the dress.",
  ],
  ["By 2010, my parents ___ in Beijing for twenty years.", "live", "had lived", ["have lived", "had live"], "", ""],
  [
    "After the scientists ___ the results, they wrote a report.",
    "check",
    "had checked",
    ["have checked", "had check"],
    "The scientists checked the results.",
    "They wrote a report.",
  ],
  ["When we reached the top, the sun ___.", "rise", "had risen", ["has risen", "had rose"], "The sun rose.", "We reached the top."],
  ["I didn't watch the film because I ___ it.", "see", "had seen", ["have seen", "had saw"], "I saw the film.", "I didn't watch the film."],
  ["The party ___ when we arrived.", "end", "had ended", ["has ended", "had end"], "The party ended.", "We arrived."],
  [
    "She ___ the letter before I could stop her.",
    "send",
    "had sent",
    ["has sent", "had sended"],
    "She sent the letter.",
    "I tried to stop her.",
  ],
  [
    "When I opened the fridge, someone ___ all the milk.",
    "drink",
    "had drunk",
    ["has drunk", "had drank"],
    "Someone drank all the milk.",
    "I opened the fridge.",
  ],
  [
    "The plane ___ off before we got to the airport.",
    "take",
    "had taken",
    ["has taken", "had took"],
    "The plane took off.",
    "We got to the airport.",
  ],
  ["Tom was happy because he ___ the race.", "win", "had won", ["has won", "had winned"], "Tom won the race.", "Tom was happy."],
  [
    "When the firefighters arrived, the fire ___ the whole building.",
    "destroy",
    "had destroyed",
    ["has destroyed", "had destroy"],
    "The fire destroyed the building.",
    "The firefighters arrived.",
  ],
  [
    "After she ___ the email, she turned off the computer.",
    "write",
    "had written",
    ["has written", "had wrote"],
    "She wrote the email.",
    "She turned off the computer.",
  ],
  ["I knew the way because I ___ there many times.", "be", "had been", ["have been", "had be"], "", ""],
  ["By the end of the day, we ___ fifty kilometers.", "walk", "had walked", ["have walked", "had walk"], "", ""],
  ["When I got home, my brother ___ dinner.", "cook", "had cooked", ["has cooked", "had cook"], "My brother cooked dinner.", "I got home."],
  [
    "The scientist was famous because she ___ a new planet.",
    "discover",
    "had discovered",
    ["has discovered", "had discover"],
    "She discovered a new planet.",
    "She was famous.",
  ],
  [
    "Before the meeting started, the manager ___ everyone.",
    "call",
    "had called",
    ["has called", "had call"],
    "The manager called everyone.",
    "The meeting started.",
  ],
  [
    "We found out that the museum ___ to a new building.",
    "move",
    "had moved",
    ["has moved", "had move"],
    "The museum moved.",
    "We found out.",
  ],
  [
    "When the guests arrived, I ___ the table.",
    "prepare",
    "had prepared",
    ["have prepared", "had prepare"],
    "I prepared the table.",
    "The guests arrived.",
  ],
  [
    "He was sad because his friends ___ his birthday.",
    "forget",
    "had forgotten",
    ["have forgotten", "had forgot"],
    "His friends forgot his birthday.",
    "He was sad.",
  ],
  [
    "The room was quiet because the children ___ asleep.",
    "fall",
    "had fallen",
    ["have fallen", "had fell"],
    "The children fell asleep.",
    "The room was quiet.",
  ],
  ["By the time I was ten, I ___ three countries.", "visit", "had visited", ["have visited", "had visit"], "", ""],
  ["She told us that she ___ the book twice.", "read", "had read", ["has read", "had readed"], "She read the book twice.", "She told us."],
  ["When we got home, we realized we ___ the door.", "not lock", "hadn't locked", ["haven't locked", "hadn't lock"], "", ""],
  ["She ___ to London before, so everything was new to her.", "not be", "hadn't been", ["hasn't been", "hadn't be"], "", ""],
  ["He failed the test because he ___.", "not study", "hadn't studied", ["hasn't studied", "hadn't study"], "", ""],
  ["I ___ the news, so I was surprised when she told me.", "not hear", "hadn't heard", ["haven't heard", "hadn't hear"], "", ""],
  ["The tickets were still in my bag; I ___ them!", "not use", "hadn't used", ["haven't used", "hadn't use"], "", ""],
  ["When the teacher asked for the homework, Max ___ it.", "not finish", "hadn't finished", ["hasn't finished", "hadn't finish"], "", ""],
  ["We ___ each other for ten years when we met again.", "not see", "hadn't seen", ["haven't seen", "hadn't saw"], "", ""],
  ["I ___ a car before, so I was nervous.", "not drive", "hadn't driven", ["haven't driven", "hadn't drove"], "", ""],
  ["They ___ snow before they moved to Canada.", "not see", "hadn't seen", ["haven't seen", "hadn't saw"], "", ""],
  ["She was nervous because she ___ in public before.", "not speak", "hadn't spoken", ["hasn't spoken", "hadn't spoke"], "", ""],
  ["When I checked my phone, he still ___ my message.", "not answer", "hadn't answered", ["hasn't answered", "hadn't answer"], "", ""],
  ["The guests arrived, but I ___ the food yet.", "not prepare", "hadn't prepared", ["haven't prepared", "hadn't prepare"], "", ""],
  ["He ___ any Chinese before he came to Beijing.", "not learn", "hadn't learned", ["hasn't learned", "hadn't learn"], "", ""],
  ["The road was dry; it ___ for weeks.", "not rain", "hadn't rained", ["hasn't rained", "hadn't rain"], "", ""],
  ["I ___ my umbrella, so I got wet.", "not bring", "hadn't brought", ["haven't brought", "hadn't bringed"], "", ""],
  ["The baby was crying because she ___ all afternoon.", "not sleep", "hadn't slept", ["hasn't slept", "hadn't sleeped"], "", ""],
];

const perfectChoice: readonly ChoiceItem[] = earlier.map(([s, verb, right, wrong]): ChoiceItem => [`${s} (${verb})`, right, wrong]);

const bothAtOnce = "Both happened at the same time.";
const firstChoice: readonly ChoiceItem[] = earlier
  .filter(([, , , , first]) => first !== "")
  .map(([s, , right, , first, then]): ChoiceItem => [s.replace("___", right), first, [then, bothAtOnce]]);

const perfectTyped: readonly TypedItem[] = interleave([
  earlier.filter(([, verb]) => !verb.startsWith("not ")),
  earlier.filter(([, verb]) => verb.startsWith("not ")),
]).map(
  ([s, verb, right, wrong]): TypedItem => ({
    shown: `${s} (${verb})`,
    accepted: right.startsWith("hadn't ") ? [right, right.replace("hadn't ", "had not ")] : [right],
    wrong: [...wrong],
  }),
);

const pastPerfect: TopicDef = {
  id: "past-perfect",
  title: t("The Past Perfect", "过去完成时"),
  summary: t(
    "When we arrived, the film had started. Had with a past participle is for the earlier of two past events; hadn't with a participle says it had not happened.",
    "When we arrived, the film had started. had 加过去分词表示两件过去的事里更早发生的那件；hadn't 加过去分词表示那时还没发生。",
  ),
  prerequisites: ["present-perfect-or-past-simple"],
  encompasses: [
    { topic: "past-simple-irregular", weight: 0.1 },
    { topic: "present-perfect-or-past-simple", weight: 0.2 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("Had and the past participle", "had 加过去分词"),
      t(
        "The past perfect is ***had*** + **past participle** for every person: *I had started, she had started, they had gone*. The negative is ***hadn't*** (*had not*): *We hadn't eaten.*\n\nRegular verbs add *-ed* (*start → had started*); many common verbs have their own participle: *go → had gone, eat → had eaten, see → had seen, take → had taken, write → had written*.\n\nDo not use *has* or *have* in a story about the past: *When we arrived, the film **had** started*, not *has started*.",
        "过去完成时是 ***had*** + **过去分词**，所有人称都一样：*I had started, she had started, they had gone*。否定是 ***hadn't***（*had not*）：*We hadn't eaten.*\n\n规则动词加 *-ed*（*start → had started*）；许多常用动词有自己的过去分词：*go → had gone, eat → had eaten, see → had seen, take → had taken, write → had written*。\n\n讲过去的事时不要用 *has* 或 *have*：*When we arrived, the film **had** started*，不说 *has started*。",
      ),
      choiceGenerator(
        t("Choose the past perfect of the verb in brackets.", "选出括号中动词的过去完成时。"),
        perfectChoice,
        (right, shown) => t(fill(shown, right), `${fill(shown, right)}（过去完成时：had / hadn't + 过去分词）`),
      ),
    ),
    point(
      "first",
      t("The earlier of two past events", "两件过去的事里更早的一件"),
      t(
        "When you tell about two things that happened in the past, the past perfect shows which one happened **first**:\n\n- *When we arrived, the film **had started**.* (The film started first; then we arrived.)\n- *When we arrived, the film **started**.* (We arrived, and then it started.)\n\nThe verb in the past simple (*arrived*) is the later event; the verb with *had* is the earlier one, even if it comes second in the sentence.",
        "讲过去发生的两件事时，过去完成时表示哪一件**先**发生：\n\n- *When we arrived, the film **had started**.*（电影先开始，我们后到。）\n- *When we arrived, the film **started**.*（我们到了，电影接着开始。）\n\n用一般过去时的动词（*arrived*）是后发生的事；带 *had* 的动词是先发生的事，即使它在句子里排在后面。中文常用“已经”“早就”表示先后，英语靠动词的形式表示。",
      ),
      choiceGenerator(t("Which happened first?", "哪件事先发生？"), firstChoice, (right, shown) =>
        t(`${shown} → ${right}`, `${shown} → ${right}（带 had 的动词是先发生的事）`),
      ),
    ),
    point(
      "write",
      t("Writing the past perfect", "写过去完成时"),
      t(
        "Type the past perfect of the verb in brackets: *had* + the past participle. When the brackets say *not*, write *hadn't* (or *had not*) + the past participle: *(not lock)* → *hadn't locked*. When they say *never*, put it between *had* and the participle: *had never been*.",
        "输入括号中动词的过去完成时：*had* + 过去分词。括号里有 *not* 时，写 *hadn't*（或 *had not*）+ 过去分词：*(not lock)* → *hadn't locked*。有 *never* 时，把它放在 *had* 和过去分词之间：*had never been*。",
      ),
      typedGenerator(
        "word-form",
        t("Type the past perfect of the verb in brackets.", "输入括号中动词的过去完成时。"),
        perfectTyped,
        (right, shown) => t(fill(shown, right), `${fill(shown, right)}（had / hadn't + 过去分词）`),
      ),
    ),
  ],
};

/** hadnt is the short form that the topic The Past Perfect teaches. */
const hadnt: WordBatch = { topic: "past-perfect", words: ["hadn't"] };

// Writing a summary.

const summaryBank: readonly WritingItem[] = [
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "In 1928, the Scottish scientist Alexander Fleming was studying bacteria in his laboratory in London. Before he went on holiday, he left several dishes of bacteria on a table. When he came back a few weeks later, he noticed something strange. A blue-green mold had grown on one of the dishes, and around the mold, the bacteria had died. Fleming realized that the mold was producing a substance that killed bacteria. He called it penicillin. At first, few people were interested in his discovery, and it was difficult to produce penicillin in large amounts. More than ten years later, two other scientists, Howard Florey and Ernst Chain, found a way to make it in large quantities. During the Second World War, penicillin saved the lives of thousands of soldiers. Today, medicines based on Fleming's discovery are used all over the world, and they have saved millions of lives. Fleming, Florey and Chain won the Nobel Prize in 1945.",
    model:
      "In 1928, Alexander Fleming noticed that a mold growing on a dish in his laboratory had killed the bacteria around it. He named the substance it produced penicillin. Making it in large amounts was difficult until Howard Florey and Ernst Chain found a method over ten years later. Penicillin saved many soldiers in the Second World War, and medicines based on it have since saved millions of lives.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "Many people believe that we use only ten percent of our brains, but scientists say this is a myth. Modern brain scans show that we use almost every part of the brain, even when we are asleep. Different areas have different jobs. One part controls movement, another controls language, and another stores memories. Even simple actions, such as picking up a cup of coffee, use many parts of the brain at the same time. The brain is also very hungry. Although it is only about two percent of the body's weight, it uses around twenty percent of the body's energy. If a small part of the brain is damaged, for example after an accident, the person may lose an ability such as speaking or walking. This would not happen if ninety percent of the brain were unused. Nobody knows exactly where the ten percent myth came from, but it has appeared in many films and advertisements.",
    model:
      "The idea that people use only ten percent of their brains is a myth. Brain scans show that almost every part of the brain is active, even during sleep, and each area has its own job, such as movement or language. The brain uses about a fifth of the body's energy, and damage to even a small part can take away an ability, which shows that the whole brain is needed.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "Bees are very important for the food we eat. When they fly from flower to flower to collect nectar, they carry pollen with them. This helps plants to produce fruit and seeds. About a third of the food that people eat, including apples, strawberries, almonds and many vegetables, depends on bees and other insects. However, in many parts of the world, the number of bees is falling. Scientists have found several reasons for this. Farmers use chemicals to kill insects that damage crops, but these chemicals can also harm bees. Many of the wild flowers that bees need have disappeared because land has been turned into farms, roads and houses. Climate change and diseases are also making life harder for bees. To help, some cities are planting more flowers in parks and on roofs, and some countries have banned the most dangerous chemicals. People can also help by growing flowers in their gardens or on their balconies.",
    model:
      "Bees carry pollen between flowers, so about a third of the food people eat depends on them and other insects. Their numbers are falling because of farm chemicals, the loss of wild flowers to farms, roads and houses, climate change and disease. To protect them, some cities are planting more flowers and some countries have banned the most harmful chemicals, while individuals can grow flowers at home.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "For thousands of years, people have looked at the night sky and wondered whether we are alone in the universe. Today, scientists are searching for life on other planets in several ways. One method is to send spacecraft to places in our own solar system that might have water, such as Mars and some of the moons of Jupiter and Saturn. Robots on Mars have found signs that rivers and lakes once covered parts of the planet, so tiny living things may have lived there long ago. Another method is to study planets that go around other stars. Astronomers have now found more than five thousand of these planets. By looking at the light that passes through their air, they hope to find gases that are produced by living things. A third method is to listen for radio signals from intelligent beings. So far, no one has found any clear evidence of life beyond Earth, but many scientists believe it is only a matter of time.",
    model:
      "Scientists are looking for life beyond Earth in three main ways. They send spacecraft to places in our solar system that may have water, such as Mars, where rivers once flowed. They study the air of planets around other stars for gases made by living things. They also listen for radio signals. No clear evidence has been found yet, but many scientists expect to find some in the future.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "Most people have heard that it takes about twenty-one days to form a new habit, but recent research suggests that the real number is much higher. In one study at a university in London, ninety-six volunteers each chose a new healthy habit, such as drinking a glass of water after breakfast or going for a run before dinner. Every day, they reported whether they had done it and how automatic it felt. On average, it took sixty-six days before the new behavior felt automatic, but the time varied greatly. For some people, it took only eighteen days, while for others it took more than eight months. Simple habits, like drinking water, became automatic much faster than difficult ones, like doing fifty sit-ups. The researchers also found some good news: missing one day did not seriously harm the process. So if you want to change your life, be patient, keep going, and don't give up after one bad day.",
    model:
      "Contrary to the popular belief that a habit takes twenty-one days to form, a London study found that it took volunteers sixty-six days on average for a new behavior to feel automatic. The time ranged from eighteen days to over eight months, and simple habits formed faster than difficult ones. Missing a single day did not spoil the process, so patience matters more than perfection.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "The Great Pacific Garbage Patch is an area of the ocean between California and Hawaii where huge amounts of plastic have collected. Ocean currents move in a circle there and bring rubbish from many countries to the same place. Some people imagine it as an island of plastic that you could walk on, but this is not true. Most of the plastic has broken into tiny pieces, many smaller than a grain of rice, which float on or just below the surface. This makes it very difficult to clean. Scientists estimate that the area is about three times the size of France and contains around eighty thousand tons of plastic. The pieces are dangerous for sea animals. Turtles mistake plastic bags for jellyfish, and fish and birds eat small pieces, which can then enter the food that humans eat. Several organizations are now trying to collect the plastic, but experts agree that the most important step is to stop more plastic from reaching the sea.",
    model:
      "The Great Pacific Garbage Patch is a huge area between California and Hawaii where ocean currents have collected about eighty thousand tons of plastic. It is not a solid island; most of the plastic has broken into tiny floating pieces, which are hard to remove. These harm sea animals and can enter human food. Some groups are collecting the plastic, but stopping more from reaching the sea matters most.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "Sleep is not just a time when the body rests. Scientists now know that the brain is very busy while we sleep. During the night, it sorts the information we have collected during the day and moves important memories into long-term storage. In experiments, students who slept after learning a list of words remembered more of them the next day than students who stayed awake. Sleep also helps the brain to clean itself. While we sleep, fluid flows through the brain and washes away waste that builds up during the day. Without enough sleep, people find it harder to concentrate, make more mistakes and feel more stressed. Over many years, a lack of sleep has been connected to heart disease and other health problems. Doctors recommend that teenagers sleep eight to ten hours a night, but surveys show that many get much less, often because they use phones and computers late in the evening.",
    model:
      "While we sleep, the brain is active: it stores important memories, so people remember more of what they learned if they sleep afterwards, and it washes away waste. Too little sleep makes it harder to concentrate and can lead to health problems such as heart disease. Teenagers need eight to ten hours a night, but many sleep much less, often because of late-night screen use.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "In the early 1800s, most people in Europe lived in the countryside and worked on farms. Then the invention of the steam engine changed everything. Steam engines could power machines in factories, and soon factories were producing cloth, iron and other goods much faster and more cheaply than people could by hand. Millions of people moved from villages to cities to work in the new factories. Cities such as Manchester in England grew very rapidly. Life in these cities was often hard. Workers, including young children, worked twelve or more hours a day in dangerous conditions, and many families lived in small, crowded houses without clean water. Steam engines were also used in trains and ships, which made it possible to travel and transport goods much faster than before. Over time, laws were passed to protect workers and children, and living conditions slowly improved. This period, known as the Industrial Revolution, created the modern world we live in today.",
    model:
      "In the Industrial Revolution of the 1800s, the steam engine allowed factories to produce goods quickly and cheaply, so millions of Europeans moved from farms to fast-growing cities. Factory workers, including children, worked long hours in dangerous conditions and lived in crowded housing. Steam trains and ships also made transport much faster. Laws gradually improved conditions, and the period shaped the modern world.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "Why is the sky blue? Sunlight looks white, but it is actually made of all the colors of the rainbow. Each color travels as a wave, and the waves of different colors have different lengths. Red light has the longest waves, and blue and violet light have the shortest. When sunlight enters the Earth's atmosphere, it hits tiny particles of gas in the air. These particles scatter short blue waves in all directions much more than long red waves. So when we look up at the sky, we see blue light coming from every direction. Violet light is scattered even more than blue, but our eyes are less sensitive to violet, and some of it is absorbed high in the atmosphere, so the sky looks blue rather than purple. At sunrise and sunset, sunlight has to travel through much more air to reach us. Most of the blue light is scattered away before it arrives, so we see more red and orange instead.",
    model:
      "Sunlight contains all colors, and blue light has shorter waves than red. Gas particles in the air scatter short blue waves in all directions much more than long red ones, so the sky looks blue from everywhere. Violet is scattered even more, but our eyes are less sensitive to it. At sunrise and sunset, light passes through more air, the blue is scattered away, and the sky looks red and orange.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "In 2014, a European spacecraft called Rosetta became the first to go into orbit around a comet. The mission had begun ten years earlier, when Rosetta was launched from South America. To reach the comet, it traveled more than six billion kilometers and passed close to Earth three times and Mars once, using their gravity to increase its speed. For almost three years, Rosetta was in a deep sleep to save energy. When it woke up, scientists on Earth celebrated. A few months later, it sent a small robot called Philae down to the comet's surface. The landing did not go as planned: Philae bounced and came to rest in the shadow of a cliff, where its solar panels got little light. Even so, it sent back useful information before its batteries ran out. Rosetta studied the comet for two years and found that its ice was different from the water on Earth. In 2016, the mission ended when Rosetta was landed gently on the comet.",
    model:
      "The European spacecraft Rosetta, launched in 2004, became the first to orbit a comet in 2014 after a ten-year journey that used the gravity of Earth and Mars. It sent a small robot, Philae, to the surface; although the landing went wrong, Philae still sent back data. Rosetta studied the comet for two years, finding that its ice differed from Earth's water, and ended its mission by landing on it in 2016.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "Octopuses are among the most intelligent animals in the sea. They have large brains for their size, and most of their nerve cells are not in their heads but in their eight arms. This means that each arm can taste, touch and even make simple decisions on its own. In laboratories, octopuses have learned to open jars to get food, find their way through mazes and recognize individual people. Some have escaped from their tanks at night, crossed the floor and climbed into other tanks to eat the fish there before returning home. In the wild, some octopuses collect coconut shells and carry them across the sea floor to use later as a shelter, which is a kind of tool use that was once thought to be only human. Octopuses can also change the color and texture of their skin in less than a second to hide from enemies. Surprisingly, most of them live for only one or two years.",
    model:
      "Octopuses are very intelligent sea animals with large brains, and most of their nerve cells are in their arms, which can act independently. In laboratories they open jars, solve mazes and recognize people, and some even escape their tanks to hunt. Wild octopuses carry coconut shells to use as shelters and can change their skin color in a moment to hide, yet most live only one or two years.",
  },
  {
    task: "Summarize the text in 50 to 80 words.",
    source:
      "Earthquakes happen because the outer layer of the Earth is broken into huge pieces called plates. These plates move very slowly, only a few centimeters a year, about as fast as your fingernails grow. In some places, two plates push against each other or slide past each other. Because the edges of the plates are rough, they get stuck, and pressure builds up over many years. When the pressure becomes too great, the rocks suddenly break and move, and the energy is released as waves that shake the ground. This is an earthquake. Scientists measure the strength of earthquakes using a scale on which each step means about thirty times more energy. They can say which areas are most at risk, but they still cannot predict exactly when an earthquake will happen. For this reason, countries such as Japan and Chile have strict building rules, and children practice what to do in an earthquake at school.",
    model:
      "Earthquakes happen because the Earth's outer layer is made of slowly moving plates. Where plates meet, their edges get stuck and pressure builds up for years until the rocks suddenly break, sending out waves that shake the ground. Scientists can identify dangerous areas but cannot predict exactly when an earthquake will strike, so countries like Japan and Chile use strict building rules and teach children what to do.",
  },
];

const summarizingAText = judgedTopic({
  id: "summarizing-a-text",
  title: t("Writing a Summary", "写摘要"),
  summary: t(
    "Summarize a short text in 50 to 80 words, in your own words, with its main point and key details only.",
    "用自己的话把一篇短文概括成 50 到 80 词，只写主要观点和关键细节。",
  ),
  prerequisites: ["writing-a-paragraph"],
  encompasses: [{ topic: "writing-a-paragraph", weight: 0.2 }],
  criteria: ["b1-summary-main-point", "b1-summary-key-details", "b1-summary-own-words"],
  point: {
    id: "summary",
    title: t("The main point in your own words", "用自己的话写主要观点"),
    explanation: t(
      "A summary tells a reader who has not read a text what it says, in far fewer words:\n\n- **Start with the main point** of the whole text, often in one sentence: *The idea that we use only ten percent of our brains is a myth.*\n- **Add only the key details** that support it: the important facts, steps or reasons. Leave out examples, small details, numbers that do not matter and anything repeated.\n- **Use your own words**: do not copy whole sentences. Change the words and join ideas: *Many people believe... but scientists say this is a myth* → *The idea that... is a myth.*\n- **Do not add your opinion** or information that is not in the text.\n\nA good way to start: read the text twice, underline the most important sentence of each part, then close the text and write.",
      "摘要是用少得多的词告诉没读过原文的人原文讲了什么：\n\n- **先写全文的主要观点**，常常一句话就够：*The idea that we use only ten percent of our brains is a myth.*\n- **只加支持它的关键细节**：重要的事实、步骤或原因。省掉例子、小细节、不重要的数字和重复的内容。\n- **用自己的话**：不要整句照抄。换个说法，把意思合并：*Many people believe... but scientists say this is a myth* → *The idea that... is a myth.*\n- **不要加自己的看法**，也不要加原文没有的信息。\n\n好方法是：把原文读两遍，在每一部分最重要的句子下面画线，然后合上原文再写。中文概括常常照搬原文的句子，英语的摘要要求换成自己的话。",
    ),
  },
  question: t(
    "Read the text. Write a summary of 50 to 80 words in English: give the main point and the key details in your own words, without your opinion.",
    "阅读短文，用英语写一篇 50 到 80 词的摘要：用自己的话写出主要观点和关键细节，不加自己的看法。",
  ),
  bank: summaryBank,
  limits: { minWords: 40, maxChars: 700 },
  what: t("summary", "摘要"),
});

/** topics are the topics of the unit Science and Discovery. */
export const topics: readonly TopicDef[] = [
  science.topic,
  research.topic,
  space.topic,
  inventions.topic,
  amounts.topic,
  physics.topic,
  change.topic,
  pastPerfect,
  summarizingAText,
];

/** vocabulary are the words the unit Science and Discovery teaches. */
export const vocabulary: readonly WordBatch[] = [
  science.batch,
  research.batch,
  space.batch,
  inventions.batch,
  amounts.batch,
  physics.batch,
  change.batch,
  hadnt,
];
