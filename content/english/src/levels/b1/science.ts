// B1, unit 10: Science and Discovery. Science, research, exploring space, inventions, numbers and amounts, forces and
// matter, and describing change; the past perfect; writing a summary. Its tense consistency reuses the native topic.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";

const science = vocabularyTopic({
  id: "b1-words-science",
  title: t("Science", "科学"),
  summary: t(
    "Theories; atoms, cells and genes; evolution and gravity; oxygen, chemicals and substances; liquids, solids and particles.",
    "理论；原子、细胞和基因；进化和引力；氧气、化学物质和物质；液体、固体和微粒。",
  ),
  intro: t(
    "Everything is made of tiny **atoms**, living things are made of **cells**, and **gravity** pulls things toward the Earth. These words help you talk about science and how the world works.",
    "万物都由微小的 **atoms**（原子）构成，生物由 **cells**（细胞）构成，**gravity**（引力）把东西拉向地球。这些词帮你谈论科学和世界的运转。",
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
      "Everything, from rocks to water and air, is made of {atoms}.|genes evolutions | A water molecule has three {atoms}: two of hydrogen and one of oxygen.|genes cells | An {atom} is far too small to see.|evolution oxygen",
      "item planet",
      "particle",
    ),
    word(
      "cell cells",
      "the smallest living part of a plant or an animal",
      "细胞",
      "The human body is made of trillions of {cells}.|theories liquids | Under the microscope, we could see the plant {cells}.|theories liquids | Red blood {cells} carry oxygen around the body.|theories liquids",
      "sell shell",
    ),
    word(
      "gene genes",
      "a part of a cell that passes qualities from parents to children",
      "基因",
      "You get your {genes} from your parents.|theories liquids | Some illnesses are caused by a faulty {gene}.|gravity theory | Scientists found the {gene} that controls eye color.|gravity oxygen",
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
  teaching: {
    watchOut: {
      complete: t(
        "*Liquid* and *solid* are opposite states: a *liquid* flows, like water or oil, and a *solid* is hard, like ice. Look for clues like *pour* or *frozen*.",
        "*liquid* 和 *solid* 是相对的状态：*liquid* 会流动，像水和油；*solid* 是硬的，像冰。留意 *pour* 或 *frozen* 这类线索。",
      ),
      meaning: t(
        "*Atom* and *cell* are both tiny parts, but an *atom* is the smallest part of any substance, and a *cell* is the smallest living part of a plant or animal. Check whether the meaning says living.",
        "*atom* 和 *cell* 都是微小的组成部分，但 *atom* 是任何物质的最小单位，*cell* 是动植物最小的有生命的单位。看释义有没有说“有生命的”。",
      ),
      spell: t("*Oxygen* has a y after the x: o-x-y-g-e-n.", "*oxygen* 的 x 后面是 y：o-x-y-g-e-n。"),
    },
    notes: `
      theory|Einstein's idea about time;why dinosaurs died;how a plan should work|a theory is an idea that explains why something happens; oxygen is a gas|theory 是理论；oxygen 是氧气|oxygen/oxygens=oxygen is a gas in the air, not an idea that explains something=oxygen 是空气中的气体，不是理论;gravity=gravity is a force that pulls things down, not an idea someone had=gravity 是引力，不是某人提出的理论;liquids/liquid=a liquid is something that flows, not an idea that explains something=liquid 是液体，不是理论|a theory about · in theory|plural *theories*|复数 *theories*
      atom|rocks, water and air;two of hydrogen and one of oxygen;far too small to see|an atom is the smallest part of an element; a gene passes qualities from parents|atom 是原子；gene 是基因|genes=genes are in living cells, not what rocks and air are made of=gene 存在于生物细胞中，不是岩石和空气的组成;evolutions/evolution=evolution is slow change over millions of years, not a tiny part of something=evolution 是漫长的进化，不是微小的组成部分;cells=cells are living parts, not parts of a water molecule=cell 是有生命的单位，不是水分子的组成;oxygen=oxygen is a gas, not one tiny part too small to see=oxygen 是一种气体，不是一个看不见的微粒;item=an item is one thing on a list, not the smallest part of matter=item 是一项、一件物品，不是原子|made of atoms · an atom of|adjective *atomic*|形容词 *atomic*
      cell|trillions in the human body;plant ones under a microscope;red ones carrying oxygen|a cell is the smallest living part; a theory is an idea|cell 是细胞；theory 是理论|theories=theories are ideas, not the living parts of a body or plant=theory 是想法，不是身体或植物的组成部分;liquids=liquids are things that flow, not the living parts of a body=liquid 是液体，不是身体的组成部分;shell=a shell is the hard outside of an egg or a sea animal, not the smallest living part=shell 是壳，不是细胞|blood cells · plant cells|*cell* sounds like *sell*|*cell* 和 *sell* 读音相同
      gene|what you get from your parents;a faulty one causing illness;eye color|a gene passes qualities from parents to children; gravity is a pulling force|gene 是基因；gravity 是引力|theories=theories are ideas, not what you get from your parents=theory 是想法，不是从父母那里遗传的东西;liquids=liquids are things that flow, not parts passed from parents=liquid 是液体，不是遗传的东西;gravity=gravity is a pulling force, not a part of a cell=gravity 是引力，不是细胞的一部分;theory=a theory is an idea, not a part of a cell that controls eye color=theory 是想法，不是控制眼睛颜色的细胞部分;oxygen=oxygen is a gas, not a part of a cell=oxygen 是气体，不是细胞的一部分;general=a general is a top army officer, not something passed from parents to children=general 是将军，不是基因;germ=a germ is a tiny living thing that can make you ill, not something passed from parents=germ 是病菌，不是基因|genes from parents · a faulty gene|adjective *genetic*|形容词 *genetic*
      evolution|Darwin and animals;millions of years for humans;a museum room|evolution is slow change of living things; gravity is a pulling force|evolution 是进化；gravity 是引力|gravity=gravity is a force that pulls things down, not slow change of living things=gravity 是引力，不是生物的缓慢变化;oxygen=oxygen is a gas, not slow change of living things=oxygen 是气体，不是进化;liquid=a liquid flows, not a slow change of living things=liquid 是液体，不是进化|human evolution · the evolution of|verb *evolve*|动词 *evolve*
      gravity|the moon in orbit;astronauts floating;a falling apple|gravity is a force that pulls things down; oxygen is a gas|gravity 是引力；oxygen 是氧气|oxygen/Oxygen=oxygen is a gas we breathe, not a force that pulls things down=oxygen 是我们呼吸的气体，不是向下拉的力;evolution/Evolution=evolution is slow change of living things, not a force that pulls=evolution 是进化，不是拉力;gravel=gravel is small stones, not the force that pulls things down=gravel 是碎石子，不是引力|because of gravity · little gravity|*gravity* is not *gravel*, small stones|*gravity* 不是 *gravel*（碎石）
      oxygen|what fish take from water;less on high mountains;what plants produce|oxygen is a gas we need to live; gravity is a force|oxygen 是氧气；gravity 是引力|gravity=gravity is a pulling force, not a gas fish or plants take in or give out=gravity 是引力，不是鱼或植物吸入、放出的气体;evolution=evolution is slow change over time, not a gas=evolution 是进化，不是气体;nitrogen=nitrogen makes up most of the air, but it is not the gas we breathe in to live=nitrogen 是氮气，虽占空气大部分，却不是维持生命要吸入的气体|need oxygen · produce oxygen|*oxy-* with a y|*oxy-* 里是 y
      chemical|insect killers;dangerous ones in a cleaner;something leaked into a river|a chemical is a substance used in chemistry; a gene is part of a cell|chemical 是化学品；gene 是基因|genes/gene=genes are parts of living cells, not substances used to kill insects or clean=gene 是细胞的一部分，不是杀虫或清洁用的物质;atoms=atoms are tiny parts of everything, not a product farmers use=atom 是原子，不是农民用的产品;theories/theory=theories are ideas, not substances that can leak=theory 是想法，不是会泄漏的物质;chemist=a chemist is a person who works with chemicals, not a substance=chemist 是化学家，不是化学物质|dangerous chemicals · a chemical leak|also an adjective: a chemical reaction|也是形容词：a chemical reaction
      substance|the most common one on Earth;dangerous to touch;sticky glue|a substance is a solid, liquid or gas; a theory is an idea|substance 是物质；theory 是理论|theory/theories=a theory is an idea, not a solid, liquid or gas=theory 是想法，不是固体、液体或气体;evolution=evolution is slow change of living things, not a type of material=evolution 是进化，不是一种物质;genes/gene=genes are parts of cells, not types of material=gene 是基因，不是物质|a sticky substance · dangerous substances|*sub-* + *stance*|由 *sub-* 加 *stance* 构成
      liquid|water at room temperature;not in hand luggage;poured into a glass|a liquid flows; a gene is part of a cell|liquid 是液体；gene 是基因|gravity=gravity is a pulling force, not something that flows=gravity 是引力，不是会流动的东西;gene/genes=a gene is part of a cell, not something that flows=gene 是基因，不是会流动的东西;theories/theory=theories are ideas, not things you can pour=theory 是想法，不能倒出来|a liquid · pour the liquid|opposite *solid*|反义词 *solid*
      solid|ice as water;a hard wooden door;frozen ground|solid means hard, not liquid or gas; liquid means flowing|solid 是固体的；liquid 是液体的|liquid=liquid means flowing, not hard like ice or wood=liquid 是会流动的，不是像冰或木头那样硬;oxygen=oxygen is a gas, not something hard=oxygen 是气体，不是坚硬的东西;chemical=chemical is about chemistry, not hard wood=chemical 是化学的，不是坚硬的木头|solid wood · frozen solid|*solid* also means strong: a solid table|*solid* 也表示结实：a solid table
      particle|dust floating in the light;dirt in city air;sand in an eye|a particle is a very small piece; a theory is an idea|particle 是微粒；theory 是理论|theories/theory=theories are ideas, not very small pieces of something=theory 是想法，不是微粒;genes/gene=genes are parts of cells, not pieces of dust or sand=gene 是基因，不是灰尘或沙粒|particles of dust · a particle of sand|*particle* is not *article*|*particle* 不是 *article*
    `,
  },
});

const research = vocabularyTopic({
  id: "b1-words-research",
  title: t("Research", "研究"),
  summary: t(
    "Observing and observations; hypotheses, conclusions and outcomes; analyzing samples and surveys; investigating, predicting, estimating and calculating; researchers.",
    "观察和观察结果；假设、结论和结果；分析样本和调查；调查研究、预测、估计和计算；研究人员。",
  ),
  intro: t(
    "A **researcher** starts with a **hypothesis**, collects a **sample**, **analyzes** the data, and reaches a **conclusion**. These words help you talk about how research is done.",
    "**researcher**（研究人员）先提出 **hypothesis**（假设），收集 **sample**（样本），**analyzes**（分析）数据，最后得出 **conclusion**（结论）。这些词帮你谈论研究是怎样进行的。",
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
      "Write down your {observations}, what you saw, in your notebook.|samples surveys | The patient is in hospital for {observation}.|hypothesis sample | Her {observation} was that the plants grew faster in the light.|sample survey",
      "operation obligation",
    ),
    word(
      "hypothesis",
      "an idea that you test to see if it is true",
      "假设；假说",
      "Our {hypothesis}, the idea we wanted to test, was that warm water freezes faster.|sample survey | The experiment proved his {hypothesis} wrong.|sample survey | First, form a {hypothesis}; then test it.|sample survey",
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
      "We are waiting for the {outcome} of the tests.|hypothesis sample | Nobody knows what the {outcome} of the election will be.|hypothesis sample | The study had two possible {outcomes}: success or failure.|samples surveys",
      "income outline",
      "conclusion",
    ),
    word(
      "analyze analyzes analyzed analyzing",
      "to study something in detail to understand it",
      "分析",
      "The scientists {analyzed} the water from the river.|predicted estimated | We need to {analyze} the data in detail before we decide.|predict estimate | Computers can {analyze} millions of photos in a minute.|predict estimate",
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
      "The police are {investigating} the robbery.|predicting calculating | Scientists are {investigating} why the bees are dying.|calculating estimating | We {investigated} how light affects plant growth by doing experiments.|calculated estimated",
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
      "Scientists {estimate}, without counting them all, that there are about 8 million kinds of animals.|observe analyze | Can you {estimate} how long the journey will take?|observe analyze | The fire caused an {estimated} two million dollars of damage.|observed analyzed",
      "eliminate measure",
    ),
    word(
      "calculate calculates calculated calculating",
      "to find a number or an amount using math",
      "计算",
      "{Calculate} the area of the room: multiply the length by the width.|Observe Investigate | The app {calculates} how many calories you burn.|observes investigates | We {calculated} that the trip would cost 500 dollars.|observed investigated",
      "circulate collect",
    ),
    word(
      "researcher researchers",
      "a person who studies something carefully to find new facts",
      "研究人员",
      "{Researchers} have found a new kind of frog.|samples surveys | A {researcher} spent ten years studying these birds.|sample hypothesis | The {researchers} asked 500 students to answer a survey.|samples conclusions",
      "research reporter",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Predict* is about the future and *observe* is about now: you *predict* what will happen, and you *observe* what is happening. Look for *will* or *tomorrow* in the sentence.",
        "*predict* 关于将来，*observe* 关于现在：*predict* 是预测会发生什么，*observe* 是观察正在发生什么。留意句中的 *will* 或 *tomorrow*。",
      ),
      meaning: t(
        "*Estimate* and *calculate* both give a number, but you *estimate* by guessing without counting exactly, and you *calculate* by using math. Check whether the meaning says guess or exact.",
        "*estimate* 和 *calculate* 都得出一个数，但 *estimate* 是不精确地估计，*calculate* 是用数学算出来。看释义说的是估还是算。",
      ),
      spell: t(
        "*Hypothesis* has a y after the h, and its plural is *hypotheses*: h-y-p-o-t-h-e-s-i-s.",
        "*hypothesis* 的 h 后面是 y，复数是 *hypotheses*：h-y-p-o-t-h-e-s-i-s。",
      ),
    },
    notes: `
      observe|birds for three years;stars through a telescope;animals watched quietly|to observe is to watch carefully; to calculate is to find a number with math|observe 是观察；calculate 是计算|calculate/calculated/calculating=to calculate is to find a number using math, not to watch carefully=calculate 是用数学计算，不是仔细观察;estimate/estimated/estimating=to estimate is to guess an amount, not to watch carefully=estimate 是估计数量，不是仔细观察;obey=to obey is to do what you are told, not to watch carefully=obey 是服从，不是观察|observe the stars · observe animals|noun *observation*|名词 *observation*
      observation|what you saw, in a notebook;a patient watched in hospital;plants growing faster in light|an observation is something you notice by watching; a sample is a small amount|observation 是观察结果；sample 是样本|samples/sample=a sample is a small amount that shows what the rest is like, not what you saw=sample 是样本，不是你看到的东西;surveys/survey=a survey is questions you ask people, not what you noticed by watching=survey 是问卷调查，不是观察到的;hypothesis=a hypothesis is an idea to test, not careful watching of a patient=hypothesis 是待检验的想法，不是对病人的观察;obligation=an obligation is something you must do, not careful watching=obligation 是义务，不是观察|make an observation · under observation|from *observe*|来自 *observe*
      hypothesis|an idea about warm water to test;proved wrong by an experiment;formed before testing|a hypothesis is an idea you test; a survey is questions you ask people|hypothesis 是假设；survey 是调查|sample=a sample is a small amount of something, not an idea you test=sample 是样本，不是待检验的想法;survey=a survey is questions for many people, not an idea you test=survey 是问卷调查，不是待检验的想法;hypocrite=a hypocrite is a person who says one thing and does another, not an idea to test=hypocrite 是伪君子，不是假设|form a hypothesis · test a hypothesis|plural *hypotheses*|复数 *hypotheses*
      conclusion|what you reached;too early to draw;the experiment a success|a conclusion is what you decide after the facts; a sample is a small amount|conclusion 是结论；sample 是样本|sample/samples=a sample is a small amount of something, not what you decide after the facts=sample 是样本，不是结论;survey/surveys=a survey is questions you ask people, not what you decide=survey 是问卷调查，不是结论;confusion=confusion is not understanding, not what you decide at the end=confusion 是困惑，不是结论|reach a conclusion · in conclusion|verb *conclude*|动词 *conclude*
      outcome|test results we wait for;an election;success or failure|an outcome is a result; a hypothesis is an idea you test before|outcome 是结果；hypothesis 是假设|hypothesis=a hypothesis is an idea you test before you know, not the result=hypothesis 是事先的假设，不是结果;sample/samples=a sample is a small amount of something, not the result of an event=sample 是样本，不是事件的结果;surveys=surveys are questions for people, not results like success or failure=survey 是问卷调查，不是成功或失败的结果|the outcome of · a possible outcome|*out* + *come*: what comes out|*out* 加 *come*：最后出来的东西
      analyze|water from a river;data in detail;millions of photos|to analyze is to study in detail; to predict is to say what will happen|analyze 是分析；predict 是预测|predict/predicted=to predict is to say what will happen, not to study something in detail=predict 是预测，不是详细研究;estimate/estimated=to estimate is to guess an amount, not to study in detail=estimate 是估计，不是详细分析;paralyze=to paralyze is to make someone unable to move, not to study something closely=paralyze 是使瘫痪，不是分析|analyze data · analyze a sample|British spelling *analyse*; noun *analysis*|英式拼写 *analyse*；名词 *analysis*
      sample|blood taken by a doctor;soil from ten farms;free pieces of cheese|a sample is a small amount that shows what the rest is like; a conclusion is what you decide|sample 是样本、样品；conclusion 是结论|hypothesis/hypotheses=a hypothesis is an idea, not a small amount of blood, soil or cheese=hypothesis 是想法，不是血液、土壤或奶酪的样本;conclusion/conclusions=a conclusion is what you decide, not a small amount of something=conclusion 是结论，不是样本|a blood sample · free samples|*sample* is not *simple*|*sample* 不是 *simple*
      survey|most students sleeping less than eight hours;a short online one;500 people asked|a survey is questions for many people; a hypothesis is an idea you test|survey 是调查；hypothesis 是假设|hypothesis=a hypothesis is an idea you test, not questions you ask many people=hypothesis 是待检验的想法，不是问卷;conclusion=a conclusion is what you decide, not questions you ask=conclusion 是结论，不是问卷;outcome=an outcome is a result, not questions you fill in=outcome 是结果，不是要填的问卷|do a survey · fill in a survey|*survey* is not *surgery*|*survey* 不是 *surgery*
      investigate|police and a robbery;why bees are dying;light and plant growth through experiments|to investigate is to find out the facts; to calculate is to find a number|investigate 是调查研究；calculate 是计算|predicting=to predict is to say what will happen, not to find out what happened=predict 是预测，不是查明事实;calculate/calculating/calculated=to calculate is to find a number, not to find out facts=calculate 是计算数字，不是调查事实;estimating/estimated=to estimate is to guess an amount, not to find out why=estimate 是估计数量，不是查明原因|investigate a crime · investigate why|noun *investigation*|名词 *investigation*
      predict|rain tomorrow;a team nobody thought would win;how prices will change|to predict is to say what will happen; to observe is to watch now|predict 是预测；observe 是观察|observe/observes/observed=to observe is to watch what is happening now, not to say what will happen=observe 是观察现在，不是预测将来;analyze/analyzes/analyzed=to analyze is to study something that exists now, not to say what will happen=analyze 是分析现有的东西，不是预测|predict the weather · hard to predict|noun *prediction*|名词 *prediction*
      estimate|8 million kinds without counting all;how long a journey will take;fire damage of about two million|to estimate is to guess an amount; to observe is to watch|estimate 是估计；observe 是观察|observe/observed=to observe is to watch carefully, not to guess an amount=observe 是观察，不是估计数量;analyze/analyzed=to analyze is to study in detail, not to guess a number roughly=analyze 是详细分析，不是粗略估计;eliminate=to eliminate is to remove completely, not to guess an amount=eliminate 是消除，不是估计|estimate the cost · an estimated|noun and verb|既是名词也是动词
      calculate|length times width;calories burned;a trip costing 500 dollars|to calculate is to find a number using math; to observe is to watch|calculate 是计算；observe 是观察|observe/Observe/observes/observed=to observe is to watch carefully, not to find a number using math=observe 是观察，不是用数学计算;investigate/Investigate/investigates/investigated=to investigate is to find out facts, not to find a number using math=investigate 是调查事实，不是计算;circulate=to circulate is to move around, like blood in the body, not to work out numbers=circulate 是循环、流传，不是计算|calculate the cost · calculate how many|noun *calculation*; a *calculator* does it|名词 *calculation*；计算器是 *calculator*
      researcher|a new kind of frog;ten years with birds;500 students asked|a researcher is a person who studies to find facts; a sample is a small amount|researcher 是研究人员；sample 是样本|samples/Samples/sample=a sample is a small amount of something, not a person who studies=sample 是样本，不是做研究的人;surveys/Surveys=surveys are questions, not people who find new facts=survey 是问卷，不是做研究的人;hypothesis=a hypothesis is an idea, not a person=hypothesis 是想法，不是人;conclusions=conclusions are decisions after facts, not people=conclusion 是结论，不是人|a researcher · researchers have found|from *research* + *-er*|由 *research* 加 *-er* 构成
    `,
  },
});

const space = vocabularyTopic({
  id: "b1-words-space-2",
  title: t("Exploring Space", "探索太空"),
  summary: t(
    "The universe and galaxies; orbits, telescopes and satellites; spacecraft, missions and launches; astronomers and comets; aliens and explorers.",
    "宇宙和星系；轨道、望远镜和卫星；航天器、任务和发射；天文学家和彗星；外星人和探险家。",
  ),
  intro: t(
    "An **astronomer** studies the **universe** through a **telescope**, while a **spacecraft** on a **mission** may **orbit** a distant planet. These words help you talk about space and exploring it.",
    "**astronomer**（天文学家）用 **telescope**（望远镜）研究 **universe**（宇宙），执行 **mission**（任务）的 **spacecraft**（航天器）则可能 **orbit**（绕轨道运行）遥远的行星。这些词帮你谈论太空和太空探索。",
  ),
  prerequisites: ["a2-words-space"],
  words: [
    word(
      "universe universes",
      "everything that exists, including all the stars and planets",
      "宇宙",
      "The {universe}, with all its stars and planets, is about 14 billion years old.|comet telescope | Are we alone in the {universe}?|comet satellite | Some scientists think there may be other {universes}.|comets telescopes",
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
      "China {launched} a new satellite into space last week.|orbited observed | The rocket will {launch} at six in the morning.|orbit observe | The company is {launching} a new phone in May.|orbiting observing",
      "lunch land",
    ),
    word(
      "astronomer astronomers",
      "a scientist who studies the stars and planets",
      "天文学家",
      "The {astronomer} discovered a new comet.|galaxy orbit | {Astronomers} use powerful telescopes to study the stars.|Explorers Aliens | She became an {astronomer} because she loved the night sky.|explorer alien",
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
      "Do you believe in {aliens} from other planets?|astronomers missions | The film is about an {alien} who lands in a small town.|astronomer orbit | The children dressed up as green {aliens}.|missions orbits",
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
  teaching: {
    watchOut: {
      complete: t(
        "An *astronomer* studies the stars from the Earth; an *astronaut* travels into space. Look at whether the person stays on the ground or goes up.",
        "*astronomer* 在地球上研究星星；*astronaut* 是飞进太空的人。看这个人是留在地面还是上了太空。",
      ),
      meaning: t(
        "A *galaxy* is one very large group of stars; the *universe* is everything that exists, with billions of galaxies. Check whether the meaning says one group or everything.",
        "*galaxy* 是一个巨大的恒星群；*universe* 是存在的一切，包含数十亿个星系。看释义说的是一个星群还是一切。",
      ),
      spell: t(
        "*Satellite* has one t, a double l, and one t again: s-a-t-e-l-l-i-t-e.",
        "*satellite* 先一个 t，再双写 l，然后又一个 t：s-a-t-e-l-l-i-t-e。",
      ),
    },
    notes: `
      universe|14 billion years old with all its stars;alone in it;maybe others like it|the universe is everything that exists; a comet is one object of ice and dust|universe 是宇宙；comet 是彗星|comet/comets=a comet is one object of ice and dust, not everything that exists=comet 是由冰和尘埃组成的一个天体，不是一切;telescope/telescopes=a telescope is a tool for looking at far things, not everything that exists=telescope 是望远镜，不是宇宙;satellite=a satellite is a machine that goes around the Earth, not everything that exists=satellite 是绕地球的机器，不是宇宙|the universe · in the universe|*uni-* means one: everything as one|*uni-* 表示“一”：万物为一
      galaxy|billions of stars with our sun;billions in the universe;the nearest one far away|a galaxy is a very large group of stars; a telescope is a tool|galaxy 是星系；telescope 是望远镜|telescope/telescopes=a telescope is a tool for looking at far things, not a group of stars=telescope 是望远镜，不是星系;mission/missions=a mission is a journey or task, not a group of stars=mission 是任务，不是星系|our galaxy · the Milky Way galaxy|plural *galaxies*|复数 *galaxies*
      orbit|the Earth around the sun once a year;a satellite around Mars;sixteen times a day|to orbit is to move around a planet or star; to launch is to send up|orbit 是绕轨道运行；launch 是发射|launch/launches/launched=to launch is to send a rocket up, not to keep moving around something=launch 是发射，不是绕着转;observe/observes/observed=to observe is to watch, not to move around something=observe 是观察，不是绕着转;alien=an alien is a creature from another planet, not a path around a planet=alien 是外星人，不是轨道;mission=a mission is a journey or task, not a path around a planet=mission 是任务，不是轨道|in orbit · orbit the Earth|noun and verb|既是名词也是动词
      telescope|the moon looked at through one;seeing distant galaxies;Galileo and Jupiter|a telescope makes far things look bigger; a satellite goes around the Earth|telescope 是望远镜；satellite 是卫星|satellite=a satellite goes around the Earth, not a tube you look through=satellite 是卫星，不是可以透过去看的筒;comet=a comet is an object of ice and dust, not a tool you look through=comet 是彗星，不是观察工具;alien=an alien is a creature, not a tool that sees galaxies=alien 是外星人，不是能看到星系的工具;mission=a mission is a journey, not a tool Galileo used=mission 是任务，不是伽利略用的工具|through a telescope · a space telescope|*tele-* means far|*tele-* 表示“远”
      satellite|photos of clouds;a TV signal;the moon as a natural one|a satellite goes around a planet; a comet is ice and dust with a tail|satellite 是卫星；comet 是彗星|comets/comet=a comet is an object of ice and dust, not a machine that takes photos or sends signals=comet 是彗星，不是拍照或发信号的机器;galaxies/galaxy=a galaxy is a huge group of stars, not something going around the Earth=galaxy 是星系，不是绕地球转的东西|a weather satellite · satellite TV|double l|双写 l
      spacecraft|landing safely on Mars;three astronauts on board;nine years to Pluto|a spacecraft is a vehicle in space; an astronomer is a scientist|spacecraft 是航天器；astronomer 是天文学家|astronomer=an astronomer is a scientist on Earth, not a vehicle that lands on Mars=astronomer 是地上的科学家，不是登陆火星的飞行器;galaxy=a galaxy is a group of stars, not a vehicle=galaxy 是星系，不是飞行器;comet=a comet is ice and dust, not a vehicle with people on board=comet 是彗星，不是载人的飞行器;aircraft=an aircraft flies in the air, not in space=aircraft 是在空中飞的飞机，不去太空;spaceman=a spaceman is a person, not a vehicle=spaceman 是宇航员，是人，不是飞行器|on board the spacecraft · a spacecraft landed|plural is also *spacecraft*|复数也是 *spacecraft*
      mission|a successful trip to the moon;new journeys to Mars;helping children read|a mission is an important journey or task; a galaxy is a group of stars|mission 是任务；galaxy 是星系|galaxy/galaxies=a galaxy is a group of stars, not a journey or task=galaxy 是星系，不是旅程或任务;orbit=an orbit is a path around a planet, not a task=orbit 是轨道，不是任务;comets/comet=comets are objects of ice and dust, not journeys or tasks=comet 是彗星，不是任务|a space mission · on a mission|double s|双写 s
      launch|a satellite sent into space;a rocket at six;a new phone in May|to launch is to send a rocket up or bring out something new; to orbit is to move around|launch 是发射、推出；orbit 是绕行|orbit/orbited/orbiting=to orbit is to move around a planet, not to send something up or bring it out=orbit 是绕行，不是发射或推出;observe/observed/observing=to observe is to watch, not to send or bring out=observe 是观察，不是发射或推出|launch a rocket · launch a product|*launch* is not *lunch*|*launch* 不是 *lunch*
      astronomer|a new comet discovered;powerful telescopes for stars;a love of the night sky|an astronomer studies stars; an explorer travels to new places|astronomer 是天文学家；explorer 是探险家|galaxy=a galaxy is a group of stars, not a person who discovers comets=galaxy 是星系，不是发现彗星的人;orbit=an orbit is a path, not a person=orbit 是轨道，不是人;Explorers/explorer=explorers travel to new places, not study stars through telescopes=explorer 是探险家，不用望远镜研究星星;Aliens/alien=aliens are creatures from other planets, not scientists who love our night sky=alien 是外星人，不是热爱星空的科学家;astrologer=an astrologer claims the stars tell your future, which is not science=astrologer 是占星师，不做科学研究;astronaut=an astronaut travels into space but does not study the stars as a job=astronaut 是宇航员，不以研究星体为职业|an astronomer · astronomers study|not *astronaut*, who goes into space|不是 *astronaut*（宇航员）
      comet|Halley's every 76 years;a long, bright tail;water brought to the Earth|a comet is ice and dust with a tail; a galaxy is a group of stars|comet 是彗星；galaxy 是星系|Galaxy/galaxy/galaxies=a galaxy is a huge group of stars, not one object of ice with a tail=galaxy 是巨大的星群，不是带尾巴的冰体;Mission/mission/missions=a mission is a journey or task, not an object in space=mission 是任务，不是太空中的天体|a comet's tail · Halley's Comet|*comet* is not *comment*|*comet* 不是 *comment*
      alien|creatures from other planets;one landing in a small town;green costumes|an alien is a creature from another planet; an astronomer studies stars|alien 是外星人；astronomer 是天文学家|astronomers/astronomer=astronomers are scientists on Earth, not creatures from other planets=astronomer 是地球上的科学家，不是外星生物;missions=missions are journeys or tasks, not creatures=mission 是任务，不是生物;orbit/orbits=an orbit is a path in space, not a creature=orbit 是轨道，不是生物;allien=allien is a misspelling, and the real word has only one l=allien 拼错了，正确的词只有一个 l|believe in aliens · an alien from Mars|*alien* also means a foreigner in formal English|在正式英语中 *alien* 也指外国人
      explorer|crossing a desert on a camel;Zheng He;maps of the coast|an explorer travels to new places; a satellite goes around the Earth|explorer 是探险家；satellite 是卫星|alien/aliens=an alien is a creature from another planet, not a person who travels to new places=alien 是外星人，不是探险的人;satellite/satellites=a satellite is a machine in space, not a person who crosses deserts or draws maps=satellite 是太空中的机器，不是穿越沙漠、画地图的人;explosion=an explosion is a sudden loud burst, not a person who travels to find new places=explosion 是爆炸，不是探险家|a famous explorer · early explorers|verb *explore*|动词 *explore*
    `,
  },
});

const inventions = vocabularyTopic({
  id: "b1-words-inventions",
  title: t("Inventions", "发明"),
  summary: t(
    "Steam, telephones and microscopes; patents and prototypes; breakthroughs; geniuses and pioneers; innovation, techniques and inventions; brilliant.",
    "蒸汽、电话和显微镜；专利和原型；突破；天才和先驱；创新、技术和发明；杰出的。",
  ),
  intro: t(
    "A **genius** or a **pioneer** may build a **prototype**, get a **patent**, and make a **breakthrough** that becomes a famous **invention**. These words help you talk about new ideas and the people behind them.",
    "**genius**（天才）或 **pioneer**（先驱）可能先造出 **prototype**（原型），申请 **patent**（专利），取得 **breakthrough**（突破），成为著名的 **invention**（发明）。这些词帮你谈论新创意和背后的人。",
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
      "Alexander Graham Bell is known for the {telephone}.|genius pioneer | Can I use your {telephone}?|breakthrough pioneer | Few homes had a {telephone} a hundred years ago.|breakthrough genius",
      "television microphone",
    ),
    word(
      "microscope microscopes",
      "an instrument that makes very small things look bigger",
      "显微镜",
      "We looked at the cells under a {microscope}.|breakthrough pioneer | The {microscope} showed tiny animals in the water.|patent pioneer | Students use {microscopes} in the biology lab.|patents pioneers",
      "telescope microphone",
    ),
    word(
      "patent patents",
      "an official right to be the only one to make or sell an invention",
      "专利",
      "She got a {patent} for her new battery, so nobody else can make it.|genius technique | Edison had more than a thousand {patents}.|geniuses techniques | The company owns the {patent} on this design.|genius pioneer",
      "parent passport",
    ),
    word(
      "prototype prototypes",
      "the first form of a new machine, used to test it",
      "原型；样机",
      "Engineers built a {prototype} of the new car.|breakthrough pioneer | The first {prototype} didn't work, so they tried again.|genius pioneer | They are testing three {prototypes} of the robot.|geniuses pioneers",
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
      "The company is famous for {innovation}: it is always bringing in new ideas.|steam genius | Online banking was a great {innovation}.|steam genius | The fair shows the latest {innovations} in farming.|geniuses patents",
      "invitation information",
      "invention breakthrough",
    ),
    word(
      "technique techniques",
      "a special way of doing something",
      "技巧；技术",
      "The painter used a new {technique}, a special way of mixing colors.|genius steam | Doctors are learning a new surgical {technique}.|genius steam | Good runners practice their breathing {techniques}.|breakthroughs patents",
      "technology mechanic",
    ),
    word(
      "invention inventions",
      "something new that someone has made or designed for the first time",
      "发明；发明物",
      "The printing press was one of the most important {inventions} in history.|geniuses techniques | The light bulb is one of Edison's most famous {inventions}.|geniuses techniques | Paper is a Chinese {invention}.|microscope genius",
      "intention invitation",
      "innovation breakthrough",
    ),
    word(
      "brilliant",
      "very clever, or very good",
      "聪明的；出色的",
      "She's a {brilliant} scientist who has won many prizes. | What a {brilliant} idea! Let's do it. | The film was {brilliant}: I loved every minute.",
      "boring terrible",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Genius* is a person and *brilliant* is an adjective: someone is a *genius*, or a *brilliant* scientist. Look for *a* before the gap with no noun after it.",
        "*genius* 指人，*brilliant* 是形容词：某人是 a *genius*，或者是 a *brilliant* scientist。看空格前有 *a* 而后面没有名词。",
      ),
      meaning: t(
        "A *prototype* is the first test model of a new machine; a *patent* is the official right to be the only one to make it. Check whether the meaning talks about a model or a right.",
        "*prototype* 是新机器的第一个试验样机；*patent* 是独家制造的官方权利。看释义说的是样机还是权利。",
      ),
      spell: t(
        "*Breakthrough* is one word, *break* + *through*, with -ough at the end: b-r-e-a-k-t-h-r-o-u-g-h.",
        "*breakthrough* 是一个词，由 *break* 加 *through* 组成，结尾是 -ough：b-r-e-a-k-t-h-r-o-u-g-h。",
      ),
    },
    notes: `
      steam|out of a kettle;the first trains;cooking fish|steam is the gas from boiling water; a patent is a right to an invention|steam 是蒸汽；patent 是专利|Genius/genius=a genius is a very clever person, not gas from boiling water=genius 是天才，不是开水冒出的气;Patent/patent=a patent is an official right, not hot gas=patent 是专利权，不是热气|steam engine · cook in steam|*steam* is not *smoke*, from fire|*steam* 不是 *smoke*（烟）
      telephone|Bell's famous one;used to call someone;rare a hundred years ago|a telephone lets you talk far away; a pioneer is one of the first people|telephone 是电话；pioneer 是先驱|genius=a genius is a clever person, not a machine Bell made=genius 是天才，不是贝尔造的机器;pioneer=a pioneer is a person, not a machine you use to talk=pioneer 是先驱，不是用来通话的机器;breakthrough=a breakthrough is a discovery, not a machine you borrow=breakthrough 是突破，不是借用的机器|on the telephone · a telephone call|*tele-* + *phone*: far sound|*tele-* 加 *phone*：远方的声音
      microscope|cells looked at under one;tiny animals in water;the biology lab|a microscope makes small things bigger; a patent is a right|microscope 是显微镜；patent 是专利|breakthrough=a breakthrough is a discovery, not a tool you look through=breakthrough 是突破，不是观察工具;pioneer/pioneers=a pioneer is a person, not a tool you look through=pioneer 是先驱，不是观察工具;patent/patents=a patent is an official right, not an instrument in a lab=patent 是专利权，不是实验室仪器|under a microscope · use a microscope|*micro-* means small|*micro-* 表示“小”
      patent|a battery nobody else can make;more than a thousand for Edison;owning a design|a patent is a right to make an invention; a technique is a way of doing something|patent 是专利；technique 是技巧|genius/geniuses=a genius is a clever person, not an official right=genius 是天才，不是官方权利;technique/techniques=a technique is a way of doing something, not a right to be the only maker=technique 是技巧，不是独家制造权;pioneer=a pioneer is a person, not something a company owns=pioneer 是先驱，不是公司拥有的东西|get a patent · own the patent|*patent* is not *parent*|*patent* 不是 *parent*
      prototype|a first new car;one that didn't work;three robots being tested|a prototype is a first test model; a pioneer is one of the first people|prototype 是原型；pioneer 是先驱|breakthrough=a breakthrough is a discovery, not a test model you build=breakthrough 是突破，不是造出来的样机;pioneer/pioneers=a pioneer is a person, not a test model=pioneer 是人，不是样机;genius/geniuses=a genius is a clever person, not a model you test=genius 是天才，不是测试的样机;photograph=a photograph is a picture taken with a camera, not the first model of something new=photograph 是照片，不是原型|build a prototype · test a prototype|*proto-* means first|*proto-* 表示“最初”
      breakthrough|a major new medicine;cancer research;computing|a breakthrough is an important discovery; a pioneer is a person|breakthrough 是突破；pioneer 是先驱|genius/geniuses=a genius is a person, not a discovery=genius 是天才，不是发现;technique=a technique is a way of doing something, not a sudden discovery=technique 是方法，不是重大突破;pioneer/pioneers=a pioneer is one of the first people to do something new, not the discovery itself=pioneer 是最早做某件新事的人，不是发现本身;breakdown=a breakdown is when a machine stops working, not an important discovery=breakdown 是故障、崩溃，不是突破;throughway=a throughway is a big fast road, not a discovery=throughway 是高速公路，不是突破|make a breakthrough · a major breakthrough|one word|是一个词
      genius|Einstein;fixing it in five minutes;Mozart in music|a genius is an extremely clever person; a patent is a right|genius 是天才；patent 是专利|patent=a patent is an official right, not a very clever person=patent 是专利权，不是聪明人;prototype=a prototype is a test model, not a very clever person=prototype 是样机，不是聪明人;general=a general is a top army officer, not a very clever person=general 是将军，不是天才|a genius · a musical genius|plural *geniuses*|复数 *geniuses*
      pioneer|Marie Curie and radioactivity;electric cars;early flight|a pioneer is one of the first to do something; a prototype is a test model|pioneer 是先驱；prototype 是原型|patent/patents=a patent is an official right, not a person who does something first=patent 是专利权，不是先行者;prototype/prototypes=a prototype is a test model, not a person who took risks=prototype 是样机，不是冒险的人|a pioneer of · early pioneers|*pio-neer* rhymes with *engineer*|*pioneer* 和 *engineer* 押韵
      innovation|always bringing in new ideas;online banking;the latest in farming|an innovation is a new idea or method; steam is hot gas|innovation 是创新；steam 是蒸汽|steam=steam is hot gas from water, not a new idea or method=steam 是蒸汽，不是新想法或新方法;genius/geniuses=a genius is a clever person, not a new idea=genius 是天才，不是新想法;patents=patents are rights, not new things on show=patent 是专利权，不是展出的新事物|a great innovation · the latest innovations|verb *innovate*|动词 *innovate*
      technique|a special way of mixing colors;surgery;breathing for runners|a technique is a special way of doing something; a genius is a person|technique 是技巧；genius 是天才|genius=a genius is a clever person, not a way of doing something=genius 是天才，不是做事的方法;steam=steam is hot gas, not a way of doing something=steam 是蒸汽，不是方法;breakthroughs=breakthroughs are discoveries, not ways runners practice=breakthrough 是突破，不是练习的方法;patents=patents are rights, not ways of breathing=patent 是专利权，不是呼吸方法|a new technique · breathing techniques|ends in *-ique*|以 *-ique* 结尾
      invention|the printing press;Edison's light bulb;paper from China|an invention is something made for the first time; a microscope is one tool|invention 是发明；microscope 是显微镜|geniuses=geniuses are clever people, not things made for the first time=genius 是天才，不是发明物;techniques=techniques are ways of doing something, not things that were invented=technique 是方法，不是发明物;microscope=a microscope is one tool, and paper is not a tool to look through=microscope 是显微镜，纸不是观察工具;genius=a genius is a person, and paper is not a person=genius 是人，纸不是人;intention=an intention is something you plan to do, not a new thing someone has made=intention 是打算，不是发明|an important invention · a Chinese invention|verb *invent*|动词 *invent*
      brilliant|a scientist with many prizes;an idea to try;a film I loved|brilliant means very clever or very good; boring means not interesting|brilliant 是聪明的、出色的；boring 是无聊的|boring=boring means not interesting, not very good or clever=boring 是无聊，不是出色;terrible=terrible means very bad, not very good=terrible 是非常糟糕，不是出色|a brilliant idea · brilliant at|double l: b-r-i-l-l-i-a-n-t|双写 l
    `,
  },
});

const amounts = vocabularyTopic({
  id: "b1-words-numbers-and-amounts",
  title: t("Numbers and Amounts", "数字和数量"),
  summary: t(
    "Percents and percentages; averages and totals; majorities and minorities; doubling; rates; dozens and billions; maximum and minimum.",
    "百分之……和百分比；平均数和总数；多数和少数；翻倍；比率；一打和十亿；最大值和最小值。",
  ),
  intro: t(
    "You can give an amount as a **percent**, an **average** or a **total**, or say that the **majority** wanted something and only a **minority** didn't. These words help you talk about numbers and results.",
    "你可以用 **percent**（百分之……）、**average**（平均数）或 **total**（总数）来说一个数量，也可以说 **majority**（大多数）想要什么，只有 **minority**（少数）不想要。这些词帮你谈论数字和结果。",
  ),
  prerequisites: ["a2-words-quantities"],
  words: [
    word(
      "percent",
      "for or out of every hundred",
      "百分之……",
      "Half of the 100 students, or fifty {percent}, walk to school. | Prices rose by ten {percent}, from 200 to 220 dollars. | Of every 100 liters of water on Earth, only about three are fresh: just three {percent}.",
      "dozen times",
      "percentage",
    ),
    word(
      "percentage percentages",
      "an amount said as a number out of a hundred",
      "百分比",
      "The {percentage} of people who own a car has risen from 40 to 60 out of every hundred. | A high {percentage} of the population, 80 out of every 100 people, lives in cities. | The {percentage} of young people who smoke has fallen from 20 to 10 out of every hundred.",
      "total maximum",
      "percent",
    ),
    word(
      "average averages",
      "the number you get by adding numbers together and dividing by how many there are; usual",
      "平均数；平均的",
      "The {average} age of the students is fifteen: add their ages and divide by the number of students. | Seven hours a night is the {average}: some people sleep more and some less. | Most women are shorter than her: she is well above the {average} height.|total maximum",
      "total minimum",
    ),
    word(
      "total totals",
      "the number you get when you add everything together",
      "总数；总计",
      "The {total} cost of the trip, with hotel, food and flights added together, was 900 dollars. | A {total} of 200 people came to the meeting: 120 adults and 80 children.|maximum minimum | Add up the numbers and write the {total} at the bottom.|average maximum",
      "average minimum",
    ),
    word(
      "majority majorities",
      "more than half of a group",
      "大多数",
      "The {majority} of students passed the exam: 90 out of 100. | A large {majority}, 80 percent, voted for the new rule. | The {majority} of people in the survey, more than half, wanted more parks.",
      "minority total",
    ),
    word(
      "minority minorities",
      "less than half of a group",
      "少数",
      "Only a small {minority} of people, about ten percent, disagreed. | China has fifty-five ethnic {minorities}.|majorities totals | A small {minority} of drivers, only about five in a hundred, break the speed limit.",
      "majority total",
    ),
    word(
      "double doubles doubled doubling",
      "to become twice as big, or to make something twice as big",
      "翻倍；加倍",
      "The population of the city has {doubled} in thirty years, from one million to two million.|divided totaled | Prices will {double}, from 50 to 100 dollars, if we wait. | The number of cars is {doubling} every ten years: 1,000, then 2,000, then 4,000.|dividing totaling",
      "divide total",
    ),
    word(
      "rate rates",
      "how fast or how often something happens; a level of payment",
      "比率；速度",
      "The birth {rate}, the number of babies born for every 1,000 people, is falling in many countries. | Your heart {rate} goes up when you run. | Interest {rates} are very low at the moment.|totals averages",
      "total average",
    ),
    word(
      "dozen dozens",
      "twelve",
      "一打；十二个",
      "I bought a {dozen} eggs: twelve in one box. | {Dozens} of people, maybe forty or fifty, were waiting outside.|Billions Hundreds | There are about a {dozen} students in the club: twelve or thirteen.",
      "billion hundred",
    ),
    word(
      "billion billions",
      "a thousand million (1,000,000,000)",
      "十亿",
      "The world population is about eight {billion}: 8,000,000,000 people. | The bridge cost two {billion} dollars: 2,000,000,000. | {Billions} of stars, more than 100,000,000,000, shine in our galaxy.|Dozens Hundreds",
      "dozen hundred",
    ),
    word(
      "maximum",
      "the largest amount or number that is possible or allowed",
      "最大值；最高的",
      "The {maximum} speed on this road is 80 kilometers an hour: never drive faster. | The lift can carry a {maximum} of ten people: no more. | Bring a {maximum} of two bags: no more than that.",
      "minimum total",
    ),
    word(
      "minimum",
      "the smallest amount or number that is possible or allowed",
      "最小值；最低的",
      "You need a {minimum} of three people to play this game: two is not enough. | The {minimum} age for driving is eighteen: younger people can't drive. | Keep the noise to a {minimum}, please: the baby is sleeping.",
      "maximum majority",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Maximum* and *minimum* are opposites: the *maximum* is the most allowed, the *minimum* is the least. Look for *no more* or *not enough* in the sentence.",
        "*maximum* 和 *minimum* 意思相反：*maximum* 是允许的最多，*minimum* 是最少。留意句中的 *no more* 或 *not enough*。",
      ),
      meaning: t(
        "*Average* and *total* both come from adding numbers, but the *total* is the sum, and the *average* is the sum divided by how many numbers there are. Check whether the meaning says divide.",
        "*average* 和 *total* 都要把数加起来，但 *total* 是总和，*average* 是总和再除以个数。看释义有没有说“除以”。",
      ),
      spell: t(
        "*Percent* can be one word or two: *percent* or *per cent*; *percentage* adds -age.",
        "*percent* 可以写成一个词，也可以分开：*percent* 或 *per cent*；*percentage* 加 -age。",
      ),
    },
    notes: `
      percent|half of 100 students;200 to 220 dollars;three liters in every hundred|percent means out of every hundred; a dozen is twelve|percent 是百分之……；dozen 是一打|dozen=a dozen is twelve things, not a number out of every hundred=dozen 是十二个，不是每一百中的几个;times=times shows how many times bigger, not a number out of every hundred=times 表示倍数，不是百分比|ten percent · fifty percent of|the sign is %|符号是 %
      percentage|car owners out of every hundred;80 in every 100 living in cities;young smokers out of every hundred|a percentage is an amount out of a hundred; a total is everything added together|percentage 是百分比；total 是总数|total=a total is everything added together, not an amount out of every hundred=total 是总和，不是百分比;maximum=a maximum is the most allowed, not an amount out of every hundred=maximum 是最大值，不是百分比|a high percentage · the percentage of|no number before it, unlike *percent*|前面不加数字，和 *percent* 不同
      average|ages added and divided;more or less than seven hours;taller than most women|the average is the sum divided by how many; the total is the sum|average 是平均数；total 是总数|total=the total is everything added together, not divided by how many=total 是总和，没有除以个数;minimum=the minimum is the smallest allowed, but some people sleep less=minimum 是最小值，但有人睡得更少;maximum=the maximum is the most possible, and no one is above it=maximum 是最大值，没人能超过它|on average · the average age|also an adjective: an average day|也是形容词：an average day
      total|hotel, food and flights added together;120 adults and 80 children;numbers added up|the total is everything added together; the average is the sum divided by how many|total 是总数；average 是平均数|average=an average is the sum divided by how many, not everything added together=average 是平均数，不是总和;minimum=a minimum is the smallest allowed, not everything added together=minimum 是最小值，不是总和;maximum=a maximum is the most allowed, not the number who really came=maximum 是最多允许的人数，不是实际来的人数|in total · a total of|verb too: the bill totaled 50 dollars|也是动词：the bill totaled 50 dollars
      majority|90 out of 100 passing;80 percent voting for a rule;more than half of a survey|the majority is more than half; the minority is less than half|majority 是大多数；minority 是少数|minority=a minority is less than half, not 80 or 90 percent=minority 是少数，不是百分之八九十;total=the total is all of them, not most of them=total 是全部，不是大多数|the majority of · a large majority|opposite *minority*|反义词 *minority*
      minority|about ten percent who disagreed;55 ethnic groups in China;five drivers in a hundred who speed|the minority is less than half; the majority is more than half|minority 是少数；majority 是大多数|majority/majorities=a majority is more than half, not a small group=majority 是大多数，不是一小部分;total/totals=a total is everything added together, not a small part of a group=total 是总数，不是一小部分|a small minority · ethnic minorities|opposite *majority*|反义词 *majority*
      double|one million to two million;50 to 100 dollars;1,000 then 2,000 then 4,000|to double is to become twice as big; to divide is to split into parts|double 是翻倍；divide 是分开|divide/divided/dividing=to divide is to split into parts, not to become twice as big=divide 是分成几份，不是翻倍;total/totaled/totaling=to total is to add up to a number, not to become twice as big=total 是合计，不是翻倍|double in size · prices doubled|also an adjective: a double room|也是形容词：a double room
      rate|babies born for every 1,000 people;a heart going up;low interest|a rate is how fast or often something happens; a total is everything added|rate 是比率、速度；total 是总数|total/totals=a total is everything added together, not how fast or often something happens=total 是总和，不是比率;average/averages=an average is the sum divided by how many, not how often something happens per 1,000=average 是平均数，不是每千人的比率|the birth rate · heart rate|*rate* is not *rat*|*rate* 不是 *rat*
      dozen|twelve eggs in a box;forty or fifty people;twelve or thirteen students|a dozen is twelve; a hundred is 100|dozen 是十二个；hundred 是一百|billion/Billions=a billion is a thousand million, not twelve=billion 是十亿，不是十二;hundred/Hundreds=a hundred is 100, not twelve=hundred 是一百，不是十二|a dozen eggs · dozens of|no -s after a number: two dozen eggs|数字后面不加 -s：two dozen eggs
      billion|8,000,000,000 people;2,000,000,000 dollars;more than 100,000,000,000 stars|a billion is a thousand million; a hundred is 100|billion 是十亿；hundred 是一百|dozen/Dozens=a dozen is twelve, not a thousand million=dozen 是十二，不是十亿;hundred/Hundreds=a hundred is 100, not a thousand million=hundred 是一百，不是十亿|eight billion · billions of|no -s after a number: two billion dollars|数字后面不加 -s：two billion dollars
      maximum|80 km an hour and no faster;ten people and no more;two bags and no more|the maximum is the most allowed; the minimum is the least|maximum 是最大值；minimum 是最小值|minimum=a minimum is the least allowed, not the most=minimum 是最少，不是最多;total=a total is everything added up, not the most allowed=total 是总数，不是允许的最大值|a maximum of · the maximum speed|opposite *minimum*|反义词 *minimum*
      minimum|two players not enough;no driving under eighteen;quiet for a sleeping baby|the minimum is the least allowed; the maximum is the most|minimum 是最小值；maximum 是最大值|maximum=a maximum is the most allowed, not the least=maximum 是最多，不是最少;majority=a majority is more than half of a group, not the least amount=majority 是大多数，不是最少的量|a minimum of · keep it to a minimum|opposite *maximum*|反义词 *maximum*
    `,
  },
});

const physics = vocabularyTopic({
  id: "b1-words-physics",
  title: t("Forces and Matter", "力和物质"),
  summary: t(
    "Force, motion and speed; friction; magnets and magnetic; reflecting; mass and volume; surfaces and layers; elements.",
    "力、运动和速度；摩擦力；磁铁和有磁性的；反射；质量和体积；表面和层；元素。",
  ),
  intro: t(
    "**Gravity** is one **force**; **friction** is another, and it slows down **motion** when one **surface** moves over another. These words help you talk about how things move and what they are made of.",
    "引力是一种 **force**（力）；**friction**（摩擦力）是另一种，当一个 **surface**（表面）在另一个上移动时，它会减慢 **motion**（运动）。这些词帮你谈论物体怎样运动、由什么构成。",
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
      "The {mass} of the Earth, the amount of matter in it, is huge.|friction motion | Heavier objects have more {mass}: more matter inside them.|friction motion | A {mass} of people gathered in the square.|speed friction",
      "mess math",
    ),
    word(
      "volume volumes",
      "the amount of space that something fills; how loud a sound is",
      "体积；音量",
      "What is the {volume} of this box?|friction motion | Please turn down the {volume}.|friction motion | The {volume} of traffic, the number of cars on the road, has increased.|friction motion",
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
  teaching: {
    watchOut: {
      complete: t(
        "*Magnet* is a noun and *magnetic* is an adjective: you pick up pins with a *magnet*, but iron is a *magnetic* metal. Look at whether a noun comes after the gap.",
        "*magnet* 是名词，*magnetic* 是形容词：用 *magnet* 吸起大头针，但铁是 *magnetic* 金属。看空格后面是否跟着名词。",
      ),
      meaning: t(
        "*Mass* and *volume* both measure an object, but *mass* is how much matter is in it, and *volume* is how much space it fills. Check whether the meaning says matter or space.",
        "*mass* 和 *volume* 都是物体的量，但 *mass* 是物质有多少，*volume* 是占多大空间。看释义说的是物质还是空间。",
      ),
      spell: t(
        "*Friction* is spelled with -ction: f-r-i-c-t-i-o-n; *fiction* has no r.",
        "*friction* 以 -ction 结尾：f-r-i-c-t-i-o-n；*fiction* 里没有 r。",
      ),
    },
    notes: `
      force|wind knocking down a tree;gravity pulling things down;pushing and pulling|a force makes things move or change shape; a layer covers a surface|force 是力；layer 是层|layer/layers=a layer covers a surface, not a power that makes things move=layer 是覆盖物的一层，不是让物体移动的力;surface/surfaces=a surface is the outside of something, not a power that moves it=surface 是表面，不是力;volume=volume is the space something fills, not a power that pulls=volume 是体积，不是拉力|the force of · forces of nature|*force* is also a verb: force someone to go|*force* 也是动词：force someone to go
      motion|a boat making me sick;Newton's three laws;a goal in slow replay|motion is moving; mass is the amount of matter|motion 是运动；mass 是质量|mass=mass is the amount of matter, not moving=mass 是物质的量，不是运动;volume=volume is space or loudness, not moving=volume 是体积或音量，不是运动;element=an element is a simple substance, not moving=element 是元素，不是运动;lotion=lotion is a cream for your skin, not moving=lotion 是护肤乳液，不是运动|in slow motion · laws of motion|*motion* is not *emotion*|*motion* 不是 *emotion*
      speed|300 km an hour;light;slower near schools|speed is how fast something moves; mass is the amount of matter|speed 是速度；mass 是质量|mass=mass is the amount of matter, not how fast something moves=mass 是物质的量，不是速度;layer=a layer covers a surface, not how fast something moves=layer 是层，不是速度;surface=a surface is the outside of something, not how fast drivers go=surface 是表面，不是速度|at a speed of · high speed|also a verb: speed up|也是动词：speed up
      friction|tires helping a car stop;heat from rubbing hands;oil between engine parts|friction makes it hard for surfaces to move; volume is space|friction 是摩擦力；volume 是体积|Volume/volume=volume is space or loudness, not the force between two surfaces=volume 是体积或音量，不是两个表面之间的力;Mass/mass=mass is the amount of matter, not the force that slows a moving surface=mass 是物质的量，不是阻碍表面移动的力;layer=a layer covers a surface, not a force that oil reduces=layer 是层，不是油能减少的力;fraction=a fraction is a part of a number, like a half, not a force=fraction 是分数，不是摩擦力|reduce friction · because of friction|*friction* is not *fiction*|*friction* 不是 *fiction*
      magnet|pins picked up;photos on a fridge;a compass needle|a magnet pulls iron; a surface is the outside of something|magnet 是磁铁；surface 是表面|surface/surfaces=a surface is the outside of something, not metal that pulls iron=surface 是表面，不是吸铁的金属;element/elements=an element is a simple substance, not something that picks up pins=element 是元素，不是吸大头针的东西;layer=a layer covers a surface, not a needle that points north=layer 是层，不是指北的针|a fridge magnet · a small magnet|adjective *magnetic*|形容词 *magnetic*
      magnetic|iron as a metal;the Earth's field;a card's strip|magnetic means able to pull iron; surface is the outside|magnetic 是有磁性的；surface 是表面|surface=a surface is the outside of something, not able to pull iron=surface 是表面，不是有磁性的;motion=motion is moving, not able to pull iron=motion 是运动，不是有磁性的;volume=volume is space or loudness, not able to pull iron=volume 是体积或音量，不是有磁性的;magic=magic is tricks or powers that seem impossible, not the power to pull iron=magic 是魔法，不是吸铁的性质;metallic=metallic means made of or like metal, and most metal cannot pull iron=metallic 是金属的，而大多数金属并不能吸铁|a magnetic field · a magnetic strip|from *magnet* + *-ic*|由 *magnet* 加 *-ic* 构成
      reflect|a mirror and light;a face in water;white clothes and the sun's heat|to reflect is to send back light or heat; to force is to push|reflect 是反射；force 是强迫|layers/layered/layer=to layer is to put one thing over another, not to send back light=layer 是一层层铺，不是反射光;forces/forced/force=to force is to push or make someone do something, not to send back light=force 是强迫，不是反射;react=to react is to respond to something, not to send back light=react 是作出反应，不是反射|reflect light · reflected in the water|noun *reflection*|名词 *reflection*
      mass|the Earth's matter;more matter in heavier objects;people gathered in a square|mass is the amount of matter; friction is a force between surfaces|mass 是质量；friction 是摩擦力|friction=friction is the force between two surfaces, not the amount of matter=friction 是摩擦力，不是物质的量;motion=motion is moving, not the amount of matter=motion 是运动，不是物质的量;speed=speed is how fast something moves, not a large group of people=speed 是速度，不是一大群人;mess=a mess is an untidy state, not the amount of matter=mess 是乱七八糟，不是质量|the mass of · a mass of people|*mass* is not *mess*|*mass* 不是 *mess*
      volume|space in a box;sound turned down;cars on the road|volume is space or loudness; motion is moving|volume 是体积、音量；motion 是运动|friction=friction is a force between surfaces, not space or loudness=friction 是摩擦力，不是体积或音量;motion=motion is moving, not space, loudness or an amount=motion 是运动，不是体积、音量或数量|turn down the volume · the volume of|*volume* is also one book of a set|*volume* 也指一套书中的一册
      surface|moon dust;oil floating on water;kitchen tops to clean|a surface is the outside or top of something; friction is a force|surface 是表面；friction 是摩擦力|friction/frictions=friction is a force, not the outside of something=friction 是一种力，不是物体的表面;motion/motions=motion is moving, not the top of something=motion 是运动，不是物体的顶面|the surface of · kitchen surfaces|*surface* is not *service*|*surface* 不是 *service*
      layer|thin ice on a lake;three in a cake;clothes in cold weather|a layer covers a surface or lies between things; speed is how fast|layer 是层；speed 是速度|speed/speeds=speed is how fast something moves, not something that covers a surface=speed 是速度，不是覆盖物;motion/motions=motion is moving, not something that lies between things=motion 是运动，不是夹在中间的东西|a thin layer · layers of clothes|*layer* is not *lawyer*|*layer* 不是 *lawyer*
      element|gold;118 known;hydrogen as the lightest|an element is a simple substance; motion is moving|element 是元素；motion 是运动|motion/motions=motion is moving, not a simple substance like gold=motion 是运动，不是像金子那样的物质;friction/frictions=friction is a force, not a substance like hydrogen=friction 是力，不是像氢那样的物质|a chemical element · 118 elements|*element* is not *elephant*|*element* 不是 *elephant*
    `,
  },
});

const change = vocabularyTopic({
  id: "b1-words-describing-change",
  title: t("Describing Change", "描述变化"),
  summary: t(
    "Gradual and gradually; rapid and rapidly; steady and steadily; slight and slightly; significant and constant; temporary and permanent.",
    "逐渐的和逐渐地；迅速的和迅速地；稳定的和稳定地；轻微的和稍微；显著的和持续不断的；暂时的和永久的。",
  ),
  intro: t(
    "A change can be **gradual** or **rapid**, **slight** or **significant**, **temporary** or **permanent**. These words help you describe how much and how fast things change.",
    "变化可以是 **gradual**（逐渐的）或 **rapid**（迅速的），**slight**（轻微的）或 **significant**（显著的），**temporary**（暂时的）或 **permanent**（永久的）。这些词帮你描述事物变化的幅度和速度。",
  ),
  prerequisites: ["b1-words-change"],
  words: [
    word(
      "gradual",
      "happening slowly, over a long time",
      "逐渐的",
      "There has been a {gradual} rise in temperatures, slowly, over a hundred years. | Learning a language is a {gradual} process: you get better little by little. | The change was so {gradual} that nobody noticed it.|rapid significant",
      "rapid temporary",
      "gradually steady",
    ),
    word(
      "gradually",
      "slowly, over a long time",
      "逐渐地",
      "The weather {gradually} got warmer, day by day, over the spring. | {Gradually}, after many months, she began to understand the language.|Rapidly Suddenly | The town has {gradually} become a city over two hundred years.",
      "rapidly suddenly",
      "gradual steadily",
    ),
    word(
      "rapid",
      "happening very quickly",
      "迅速的",
      "The city has seen {rapid} growth: it doubled in five years. | There was a {rapid} change in the weather: in ten minutes the sun was gone and it was snowing. | She made {rapid} progress in English and was fluent in six months.",
      "gradual slight",
      "rapidly",
    ),
    word(
      "rapidly",
      "very quickly",
      "迅速地",
      "Prices are rising {rapidly}: they went up by half in one month. | The illness spread {rapidly}, and in a week the whole town was sick. | Technology is changing {rapidly}: phones are out of date in a year or two.",
      "gradually slightly",
      "rapid",
    ),
    word(
      "steady",
      "continuing at the same speed or level",
      "稳定的；平稳的",
      "There has been a {steady} increase in visitors: about 100 more every year. | He has had a {steady} job at the bank for twenty years. | Keep the ladder {steady} while I climb.",
      "sudden temporary",
      "steadily gradual",
    ),
    word(
      "steadily",
      "at a regular, even rate",
      "稳定地；不断地",
      "The number of students has grown {steadily}, by about the same amount each year. | It rained {steadily} all day without stopping. | Prices have risen {steadily} for ten years, a little every year.",
      "rapidly suddenly",
      "steady gradually",
    ),
    word(
      "slight",
      "small; not important or serious",
      "轻微的；微小的",
      "I have a {slight} headache, but it's not bad. | There's a {slight} problem with the computer, nothing serious. | She speaks English with a {slight} accent: you can hardly hear it.",
      "significant rapid",
      "slightly",
    ),
    word(
      "slightly",
      "a little",
      "稍微；略微",
      "I feel {slightly} better today, but I'm still quite ill. | The price went up {slightly}, from 100 to 101 dollars.|rapidly steadily | This shirt is {slightly} big for me, but I can still wear it.",
      "totally completely",
      "slight",
    ),
    word(
      "significant",
      "large or important enough to notice",
      "显著的；重要的",
      "There has been a {significant} fall in crime: about 40 percent. | This is a {significant} discovery that will change medicine. | Did anything {significant} happen while I was away?",
      "slight temporary",
    ),
    word(
      "constant",
      "happening all the time, or staying the same",
      "持续不断的；恒定的",
      "The {constant} noise from the road, day and night, keeps me awake. | Keep the water at a {constant} temperature that never changes. | She is in {constant} pain that never goes away.",
      "temporary rapid",
    ),
    word(
      "temporary",
      "lasting for only a short time",
      "暂时的；临时的",
      "She has a {temporary} job for the summer. | The road is closed, but it's only {temporary}. | We moved to a {temporary} home for a few weeks after the fire.",
      "permanent constant",
    ),
    word(
      "permanent",
      "lasting for a very long time or forever",
      "永久的；长期的",
      "Smoking can cause {permanent} damage to your lungs that never heals. | She's tired of summer jobs and is looking for a {permanent} job. | Is this a {permanent} address or a temporary one?",
      "temporary slight",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "The adjective describes a noun and the -ly adverb describes a verb: a *rapid* change, but prices rise *rapidly*. Look at whether the gap comes before a noun or after a verb.",
        "形容词修饰名词，-ly 副词修饰动词：a *rapid* change，但 prices rise *rapidly*。看空格是在名词前还是动词后。",
      ),
      meaning: t(
        "*Temporary* and *permanent* are opposites: *temporary* lasts only a short time, *permanent* lasts a very long time or forever. Check how long the meaning says it lasts.",
        "*temporary* 和 *permanent* 意思相反：*temporary* 只持续很短时间，*permanent* 持续很久或永远。看释义说持续多久。",
      ),
      spell: t(
        "*Gradual* becomes *gradually* with a double l: g-r-a-d-u-a-l-l-y; *steady* changes y to i: *steadily*.",
        "*gradual* 变成 *gradually* 要双写 l：g-r-a-d-u-a-l-l-y；*steady* 把 y 变成 i：*steadily*。",
      ),
    },
    notes: `
      gradual|temperatures over a hundred years;getting better little by little;a change nobody noticed|gradual means happening slowly; rapid means happening very quickly|gradual 是逐渐的；rapid 是迅速的|rapid=rapid means very quick, not slow over a long time=rapid 是迅速的，不是长时间慢慢地;temporary=temporary means lasting a short time, not happening slowly=temporary 是暂时的，不是逐渐的;significant=significant means large enough to notice, but nobody noticed this change=significant 是显著的，但这个变化没人注意到|a gradual rise · a gradual process|adverb *gradually*|副词 *gradually*
      gradually|warmer day by day;understanding after many months;a town becoming a city over 200 years|gradually means slowly over a long time; suddenly means all at once|gradually 是逐渐地；suddenly 是突然地|rapidly/Rapidly=rapidly means very quickly, not slowly over a long time=rapidly 是很快地，不是慢慢地;suddenly/Suddenly=suddenly means all at once, not little by little=suddenly 是突然地，不是一点点地|gradually got warmer · gradually became|double l before -y|-y 前双写 l
      rapid|a city doubled in five years;snow in ten minutes;fluent in six months|rapid means very quick; gradual means slow|rapid 是迅速的；gradual 是逐渐的|gradual=gradual means slow over a long time, not very quick=gradual 是缓慢的，不是迅速的;slight=slight means small, not very quick=slight 是轻微的，不是迅速的|rapid growth · rapid progress|adverb *rapidly*|副词 *rapidly*
      rapidly|prices up by half in a month;a whole town sick in a week;phones out of date in a year|rapidly means very quickly; gradually means slowly|rapidly 是迅速地；gradually 是逐渐地|gradually=gradually means slowly over a long time, not very quickly=gradually 是慢慢地，不是很快地;slightly=slightly means a little, not very quickly=slightly 是稍微，不是迅速地|rise rapidly · spread rapidly|adjective *rapid* + *-ly*|形容词 *rapid* 加 *-ly*
      steady|100 more visitors every year;twenty years at a bank;a ladder that doesn't move|steady means continuing at the same level; sudden means happening all at once|steady 是稳定的；sudden 是突然的|sudden=sudden means happening all at once, not continuing at the same speed=sudden 是突然的，不是持续平稳的;temporary=temporary means lasting a short time, not continuing for years=temporary 是暂时的，不是持续多年的|a steady increase · a steady job|adverb *steadily*|副词 *steadily*
      steadily|the same amount each year;rain without stopping all day;a little every year for ten years|steadily means at an even rate; suddenly means all at once|steadily 是稳定地；suddenly 是突然地|rapidly=rapidly means very quickly, not at an even rate=rapidly 是很快地，不是平稳地;suddenly=suddenly means all at once, not at an even rate over time=suddenly 是突然地，不是持续平稳地|grow steadily · rain steadily|y becomes i: *steadily*|y 变 i：*steadily*
      slight|a headache that's not bad;a problem that's nothing serious;an accent you can hardly hear|slight means small; significant means large enough to notice|slight 是轻微的；significant 是显著的|significant=significant means large enough to notice, not small and not serious=significant 是显著的，不是轻微的;rapid=rapid means very quick, not small=rapid 是迅速的，不是轻微的|a slight headache · a slight accent|adverb *slightly*|副词 *slightly*
      slightly|better but still quite ill;100 to 101 dollars;a bit big but still wearable|slightly means a little; totally means completely|slightly 是稍微；totally 是完全|totally=totally means completely, not a little=totally 是完全，不是稍微;rapidly=rapidly means very quickly, not by a small amount=rapidly 是迅速地，不是稍微;steadily=steadily means at an even rate over time, not by one small amount=steadily 是持续平稳地，不是一次小小的变化;completely=completely means in every way, to the end, which is the opposite of a little=completely 是彻底、全部，和稍微正好相反|slightly better · slightly too big|adjective *slight* + *-ly*|形容词 *slight* 加 *-ly*
      significant|crime down about 40 percent;a discovery that will change medicine;anything important while away|significant means large or important enough to notice; slight means small|significant 是显著的；slight 是轻微的|slight=slight means small and not important, not large enough to notice=slight 是轻微的，不是显著的;temporary=temporary means lasting a short time, not important=temporary 是暂时的，不是重要的|a significant change · something significant|noun *significance*|名词 *significance*
      constant|road noise day and night;water that never changes;pain that never goes away|constant means happening all the time; temporary means lasting a short time|constant 是持续不断的；temporary 是暂时的|temporary=temporary means lasting a short time, not all the time=temporary 是暂时的，不是一直持续;rapid=rapid means very quick, not happening all the time=rapid 是迅速的，不是持续不断的|constant noise · a constant temperature|*constant* is not *consonant*|*constant* 不是 *consonant*
      temporary|a summer job;a closed road;a home for a few weeks after a fire|temporary means for a short time; permanent means forever|temporary 是暂时的；permanent 是永久的|permanent=permanent means lasting forever, not only a short time=permanent 是永久的，不是短期的;constant=constant means happening all the time, not lasting only a short time=constant 是持续不断的，不是暂时的|a temporary job · only temporary|*tempor-* is about time|*tempor-* 和时间有关
      permanent|lung damage that never heals;a job after summer jobs;an address that isn't temporary|permanent means lasting forever; temporary means for a short time|permanent 是永久的；temporary 是暂时的|temporary=temporary means lasting a short time, not forever=temporary 是暂时的，不是永久的;slight=slight means small, not lasting forever=slight 是轻微的，不是永久的|permanent damage · a permanent job|ends in *-ent*|以 *-ent* 结尾
    `,
  },
});

// The past perfect.

/**
 * earlier are sentences with the past perfect: the sentence with a gap, the verb to use, the right form, two wrong
 * forms, and the earlier and the later of the two events, or empty strings when the sentence has no two events to order.
 */
const handEarlier: readonly (readonly [string, string, string, readonly [string, string], string, string])[] = [
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

/** laterEvents are a clause with when for the later event, and that event as a sentence. */
const laterEvents: readonly (readonly [string, string])[] = [
  ["When we got there", "We got there."],
  ["When I arrived", "I arrived."],
  ["When Tom got home", "Tom got home."],
  ["When my parents came back", "My parents came back."],
  ["When the police arrived", "The police arrived."],
  ["When Anna woke up", "Anna woke up."],
  ["When we finally found the place", "We finally found the place."],
  ["By the time the taxi came", "The taxi came."],
  ["By the time I finished work", "I finished work."],
];

/** earlierEvents are a subject, the verb, its past perfect, two wrong forms, and the event as a sentence. */
const earlierEvents: readonly (readonly [string, string, string, readonly [string, string], string])[] = [
  ["the show", "start", "had started", ["has started", "had start"], "The show started."],
  ["everyone", "leave", "had left", ["has left", "had leaved"], "Everyone left."],
  ["the shop", "close", "had closed", ["has closed", "had close"], "The shop closed."],
  ["the rain", "stop", "had stopped", ["has stopped", "had stop"], "The rain stopped."],
  ["the others", "eat", "had eaten", ["have eaten", "had ate"], "The others ate."],
  ["the bus", "go", "had gone", ["has gone", "had went"], "The bus went."],
  ["the meeting", "finish", "had finished", ["has finished", "had finish"], "The meeting finished."],
  ["the snow", "melt", "had melted", ["has melted", "had melt"], "The snow melted."],
  ["the sun", "set", "had set", ["has set", "had setted"], "The sun set."],
  ["the lesson", "begin", "had begun", ["has begun", "had began"], "The lesson began."],
  ["the guests", "arrive", "had arrived", ["have arrived", "had arrive"], "The guests arrived."],
];

/** earlier are the hand-written sentences and one for every later event with every earlier one. */
const earlier: readonly (readonly [string, string, string, readonly [string, string], string, string])[] = [
  ...handEarlier,
  ...everyPair(laterEvents, earlierEvents).map(
    ([[when, then], [subject, verb, right, wrong, first]]) => [`${when}, ${subject} ___.`, verb, right, wrong, first, then] as const,
  ),
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

/** verbOf is the verb in brackets at the end of shown, without not or never. */
const verbOf = (shown: string) => (/\(([^)]+)\)$/u.exec(shown)?.[1] ?? "").replace(/^(not|never) /u, "");

/** participleRule names the past perfect of a verb: had or hadn't, and its participle, regular or not. */
function participleRule(right: string, shown: string): Text {
  const base = verbOf(shown);
  const participle = right.split(" ").pop() ?? "";
  const had = right.startsWith("hadn't") ? "hadn't" : "had";
  const stem = base.replace(/[ey]$/u, "");
  const regular = participle.endsWith("ed") && participle.startsWith(stem);
  return regular
    ? t(
        `The past perfect is *${had}* and the past participle for every person, and *${base}* is regular, so it is *${participle}*`,
        `过去完成时是 *${had}* 加过去分词，所有人称都一样；*${base}* 是规则动词，过去分词是 *${participle}*`,
      )
    : t(
        `The past perfect is *${had}* and the past participle for every person, and the participle of *${base}* is *${participle}*`,
        `过去完成时是 *${had}* 加过去分词，所有人称都一样；*${base}* 的过去分词是 *${participle}*`,
      );
}

/** whyNotPerfect explains has or have in a story about the past, or a form that is not the participle. */
const whyNotPerfect = (wrong: string, _right: string, shown: string, position: number): Text => {
  const base = verbOf(shown);
  const form = wrong.split(" ").pop() ?? "";
  if (position === 0)
    return t(
      `*${wrong.split(" ")[0]}* makes the present perfect, not the past perfect needed in a story set in the past.`,
      `*${wrong.split(" ")[0]}* 构成的是现在完成时，不是过去背景故事里需要的过去完成时。`,
    );
  if (form === base)
    return t(
      `*${form}* is the base form, not the past participle required after *had*.`,
      `*${form}* 是动词原形，不是 *had* 后要求的过去分词。`,
    );
  if (form.endsWith("ed"))
    return t(`*${form}* is not a valid form—*${base}* is irregular.`, `没有 *${form}* 这个词——*${base}* 是不规则动词。`);
  return t(
    `*${form}* is the past simple, not the past participle required after *had*.`,
    `*${form}* 是一般过去式，不是 *had* 后要求的过去分词。`,
  );
};

/** perfectIn finds the verb with had in a sentence. */
const perfectIn = (sentence: string) => /\bhad(n't)? \w+/u.exec(sentence)?.[0] ?? "had";

/** firstWhy explains which event the past perfect puts first. */
const firstWhy = (right: string, shown: string): Text =>
  t(
    `*${perfectIn(shown)}* is the past perfect, so it is the earlier event: ${shown} → ${right}\n\n**Check.** Compare the two verb forms: the clause with *had* + past participle (*${perfectIn(shown)}*) happened first, and the past-simple clause happened second.`,
    `*${perfectIn(shown)}* 是过去完成时，表示先发生的事：${shown} → ${right}\n\n**检验。** 对比两个动词：带 *had* + 过去分词（*${perfectIn(shown)}*）的事件先发生，一般过去时的事件后发生。`,
  );

/** whyNotFirst explains the later event, or the two events at the same time. */
const whyNotFirst = (wrong: string, _right: string, shown: string): Text =>
  wrong === bothAtOnce
    ? t(
        `*${perfectIn(shown)}* marks an earlier past event, showing that one happened before the other—not at the same time.`,
        `*${perfectIn(shown)}* 标出更早发生的过去事件，说明两件事有先后，不是同时发生。`,
      )
    : t(
        `*${wrong}* is the event in the past simple, which marks the later event rather than the earlier one.`,
        `*${wrong}* 用的是一般过去时，表示后发生的那件事，而不是先发生的那件。`,
      );

const pastPerfect: TopicDef = {
  id: "past-perfect",
  title: t("The Past Perfect", "过去完成时"),
  summary: t(
    "When we arrived, the film had started. Had with a past participle is for the earlier of two past events; hadn't with a participle says it had not happened.",
    "When we arrived, the film had started. had 加过去分词表示两件过去的事里更早发生的那件；hadn't 加过去分词表示那时还没发生。",
  ),
  intro: t(
    "When a story looks back from one past moment to an even earlier one—*By the time the train reached the station, the storm had already passed*—English marks the earlier event with *had* + past participle.",
    "当故事从一个过去的时间点再往前追溯更早发生的事（*By the time the train reached the station, the storm had already passed*），英语用 *had* + 过去分词来标出先发生的事件。",
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
        "The past perfect is ***had*** + **past participle** for every person: *I had started, she had started, they had gone*. The negative is ***hadn't*** (*had not*): *We hadn't eaten.*\n\nRegular verbs add *-ed* (*start → had started*); many common verbs have their own participle: *go → had gone, eat → had eaten, see → had seen, take → had taken, write → had written*.\n\n> **Watch out.** Do not use *has/have* in a past narrative (*When we arrived, the film has started* is wrong), and use the third form (past participle), not the past simple (*had went* is wrong).",
        "过去完成时是 ***had*** + **过去分词**，所有人称都一样：*I had started, she had started, they had gone*。否定是 ***hadn't***（*had not*）：*We hadn't eaten.*\n\n规则动词加 *-ed*（*start → had started*）；许多常用动词有自己的过去分词：*go → had gone, eat → had eaten, see → had seen, take → had taken, write → had written*。\n\n> **注意。** 过去语境里不要用 *has/have*（*has started* 是错的），且 *had* 后面用第三态过去分词而不是一般过去式（*had went* 是错的）。",
      ),
      choiceGenerator(
        t("Choose the past perfect of the verb in brackets.", "选出括号中动词的过去完成时。"),
        perfectChoice,
        (right, shown) => {
          const rule = participleRule(right, shown);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Verify both pieces of *${right}*: *had/hadn't* (never *has/have*) plus the third form (past participle).`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对 *${right}* 的两部分：用 *had/hadn't*（不用 *has/have*）加第三态过去分词。`,
          );
        },
        whyNotPerfect,
      ),
    ),
    point(
      "first",
      t("The earlier of two past events", "两件过去的事里更早的一件"),
      t(
        "When you tell about two things that happened in the past, the past perfect shows which one happened **first**:\n\n- *When we arrived, the film **had started**.* (The film started first; then we arrived.)\n- *When we arrived, the film **started**.* (We arrived, and then it started.)\n\nThe verb in the past simple (*arrived*) is the later event; the verb with *had* is the earlier one, even if it comes second in the sentence.\n\n> **Watch out.** Do not judge by word order—the clause with *had* + participle is always the earlier event, even when it appears at the end of the sentence.",
        "讲过去发生的两件事时，过去完成时表示哪一件**先**发生：\n\n- *When we arrived, the film **had started**.*（电影先开始，我们后到。）\n- *When we arrived, the film **started**.*（我们到了，电影接着开始。）\n\n用一般过去时的动词（*arrived*）是后发生的事；带 *had* 的动词是先发生的事，即使它在句子里排在后面。\n\n> **注意。** 不要按前后语序猜测——带 *had* + 过去分词的分句永远是更早发生的事，哪怕它写在句尾。",
      ),
      choiceGenerator(t("Which happened first?", "哪件事先发生？"), firstChoice, firstWhy, whyNotFirst),
    ),
    point(
      "write",
      t("Writing the past perfect", "写过去完成时"),
      t(
        "Type the past perfect of the verb in brackets: *had* + the past participle. When the brackets say *not*, write *hadn't* (or *had not*) + the past participle: *(not lock)* → *hadn't locked*. When they say *never*, put it between *had* and the participle: *had never been*.\n\n> **Watch out.** Place *never* between *had* and the participle (*had never seen*, not *never had seen*), and check irregular participles carefully (*written, taken, eaten, gone*).",
        "输入括号中动词的过去完成时：*had* + 过去分词。括号里有 *not* 时，写 *hadn't*（或 *had not*）+ 过去分词：*(not lock)* → *hadn't locked*。有 *never* 时，把它放在 *had* 和过去分词之间：*had never been*。\n\n> **注意。** *never* 放在 *had* 和过去分词之间（*had never seen*），并核对不规则过去分词的拼写（*written、taken、eaten、gone*）。",
      ),
      typedGenerator(
        "word-form",
        t("Type the past perfect of the verb in brackets.", "输入括号中动词的过去完成时。"),
        perfectTyped,
        (right, shown) => {
          const rule = participleRule(right, shown);
          return t(
            `${rule.en}: ${fill(shown, right)}\n\n**Check.** Verify that *had / hadn't / had never* is followed by the exact past participle of *${verbOf(shown)}*.`,
            `${rule["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 确认 *had / hadn't / had never* 后面接的是 *${verbOf(shown)}* 准确的过去分词。`,
          );
        },
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
  title: t("Summarizing a Text", "概括文章"),
  summary: t(
    "Summarize a short text in 50 to 80 words, in your own words, with its main point and key details only.",
    "用自己的话把一篇短文概括成 50 到 80 词，只写主要观点和关键细节。",
  ),
  intro: t(
    "A strong summary distills a 180-word article into a tight 60-word paragraph without copying sentences or adding opinions: state the central idea first, keep only the essential facts, and leave out side examples.",
    "好的摘要能把 180 词的短文浓缩成 60 词左右的紧凑段落，既不照抄原句也不夹带个人看法：先点明主旨，只保留关键事实，删去次要例子。",
  ),
  prerequisites: ["writing-a-paragraph"],
  encompasses: [{ topic: "writing-a-paragraph", weight: 0.2 }],
  criteria: ["b1-summary-main-point", "b1-summary-key-details", "b1-summary-own-words"],
  point: {
    id: "summary",
    title: t("The main point in your own words", "用自己的话写主要观点"),
    explanation: t(
      "A summary tells a reader who has not read a text what it says, in far fewer words:\n\n- **Start with the main point** of the whole text, often in one sentence: *The idea that we use only ten percent of our brains is a myth.*\n- **Add only the key details** that support it: the important facts, steps or reasons. Leave out examples, small details and anything repeated.\n- **Use your own words**: do not copy whole sentences. Change the words and join ideas: *Many people believe... but scientists say this is a myth* → *The idea that... is a myth.*\n- **Do not add your opinion** or information that is not in the text.\n\n> **Watch out.** Stay within the 50–80 word range, avoid lifting whole sentences verbatim from the passage, and keep personal opinions (*I think...*) out of the summary.",
      "摘要是用少得多的词告诉没读过原文的人原文讲了什么：\n\n- **先写全文的主要观点**，常常一句话就够：*The idea that we use only ten percent of our brains is a myth.*\n- **只加支持它的关键细节**：重要的事实、步骤或原因。省掉例子、小细节和重复的内容。\n- **用自己的话**：不要整句照抄。换个说法，把意思合并：*Many people believe... but scientists say this is a myth* → *The idea that... is a myth.*\n- **不要加自己的看法**，也不要加原文没有的信息。\n\n> **注意。** 字数控制在 50–80 词左右，不要整句照搬原文，也不要加入 *I think...* 这类个人观点。",
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
