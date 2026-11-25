// B2, unit 8: Technology and the Future. Artificial intelligence, innovation, cybersecurity, space, future transport,
// technology in society, prediction, from idea to product, networks, technology and ethics, and transitions; wish and
// if only; the problem-solution essay. Its other topic, cutting wordiness, already exists.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";
import { wishAndIfOnlyWriteNot } from "./mistakes.ts";

const ai = vocabularyTopic({
  id: "b2-words-ai",
  title: t("Artificial Intelligence", "人工智能"),
  summary: t(
    "Automation and automating work; robotics; intelligence and neural networks; chatbots; autonomous machines and sensors; computing and processors; simulations; cyborgs.",
    "自动化；机器人技术；智能和神经网络；聊天机器人；自主机器和传感器；计算和处理器；模拟；半机械人。",
  ),
  intro: t(
    "At the science fair, a **chatbot** answered our questions, a robot arm used a **sensor** to pick up eggs without breaking them, and a poster explained how **automation** is changing factories. These words help you talk about artificial intelligence and the machines it powers.",
    "在科学展上，一个 **chatbot**（聊天机器人）回答我们的问题，一只机械臂靠 **sensor**（传感器）拿起鸡蛋而不弄破，一张海报讲解了 **automation**（自动化）如何改变工厂。这些词帮你谈论人工智能和由它驱动的机器。",
  ),
  prerequisites: ["b1-words-tech-verbs"],
  words: [
    word(
      "automation",
      "the use of machines and computers to do work that people used to do",
      "自动化",
      "{Automation} has replaced many factory jobs with machines. | The bank is investing in {automation} so that computers can do the work of its clerks. | {Automation} could make some jobs disappear as machines take over.",
      "simulation intelligence",
      "robotics",
    ),
    word(
      "automate automates automated automating",
      "to make a process work by machines or computers instead of people",
      "使自动化",
      "The company {automated} its warehouse last year, so robots now pack the boxes.|simulated encrypted | Many boring tasks can be {automated} so that no one has to do them by hand.|simulated encrypted | We {automate} the safety checks, so a program now does them instead of a person.",
      "simulate encrypt",
    ),
    word(
      "robotics",
      "the science of designing and building robots",
      "机器人技术；机器人学",
      "She built a robot for her {robotics} class. | Japan's {robotics} industry builds machines that work in factories. | Advances in {robotics} let surgeons operate with robot arms.",
      "genetics linguistics",
      "automation",
    ),
    word(
      "intelligence",
      "the ability to learn, understand and think",
      "智力；智能",
      "Artificial {intelligence} can now write essays. | Crows show surprising {intelligence} when they solve puzzles. | Tests can't measure every kind of {intelligence}, such as a talent for music.",
      "automation simulation",
    ),
    word(
      "neural",
      "connected with the nerves or the brain, or with computer systems that copy them",
      "神经的",
      "A {neural} network, modeled on the brain, learns from millions of examples. | The disease damages {neural} pathways in the brain. | Scientists measure the {neural} activity in a mouse's brain.",
      "lunar cosmic",
    ),
    word(
      "chatbot chatbots",
      "a computer program that you can have a conversation with",
      "聊天机器人",
      "The bank's {chatbot} answered my question in seconds. | Students chat with {chatbots} to check their grammar.|sensors processors | I asked the {chatbot} for a recipe, and it wrote one for me.",
      "sensor processor",
    ),
    word(
      "autonomous",
      "able to work or decide without being controlled by people; governing itself",
      "自主的；自治的",
      "{Autonomous} cars drive without a human driver. | The drone is fully {autonomous} and flies itself. | The region is {autonomous} and has its own parliament.",
      "neural lunar",
    ),
    word(
      "sensor sensors",
      "a device that notices heat, light, movement or sound",
      "传感器",
      "The light turns on when the {sensor} detects movement. | Modern cars have dozens of {sensors} that notice obstacles.|chatbots cyborgs | A {sensor} in the soil measures its temperature.",
      "chatbot cyborg",
      "processor",
    ),
    word(
      "computing",
      "the use or the study of computers",
      "计算；计算机技术",
      "Cloud {computing} lets you store your files online. | She has a degree in {computing} and writes software for banks. | Quantum {computing} could solve problems far faster than today's computers.",
      "nursing farming",
    ),
    word(
      "processor processors",
      "the main part of a computer that does the calculations",
      "处理器",
      "The new phone has a faster {processor}, so apps open quickly. | Video games need powerful {processors} to do millions of calculations.|chatbots cyborgs | The {processor} heats up when the computer works hard.",
      "chatbot cyborg",
      "sensor",
    ),
    word(
      "simulation simulations",
      "a model of a real situation, often made on a computer, used for study or training",
      "模拟；仿真",
      "Pilots train in a flight {simulation} before they fly a real plane. | Computer {simulations} built from weather data predict the storm's path.|animations stimulations | The computer {simulation}, built from real data, predicted how the virus would spread.",
      "animation stimulation",
    ),
    word(
      "cyborg cyborgs",
      "a being that is part human and part machine",
      "半机械人；赛博格",
      "In the film, the hero is a {cyborg}, half man and half machine, with a metal arm. | Some say people with chips in their bodies are already {cyborgs}.|chatbots sensors | The {cyborg}, part human, could see in the dark with its machine eyes.",
      "chatbot sensor",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *sensor* notices heat, light or movement, while a *processor* does a computer's calculations. Look for words such as *detects*, *measures* or *calculations* that show which one fits.",
        "*sensor* 感知热、光或动作，*processor* 负责计算机的运算。找找 *detects*、*measures* 或 *calculations* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "*Automation* is machines doing work that people used to do, while a *simulation* is a model of a real situation. Check whether the meaning is about doing work or about copying reality.",
        "*automation* 是机器代替人做工作，*simulation* 是对真实情况的模拟。看释义说的是干活，还是模仿现实。",
      ),
      spell: t(
        "*Autonomous* is au · ton · o · mous; *intelligence* has a double l and ends in -ence; *cyborg* starts with cy.",
        "*autonomous* 拆成 au · ton · o · mous；*intelligence* 双写 l，以 -ence 结尾；*cyborg* 以 cy 开头。",
      ),
    },
    notes: `
      automation|machines replacing factory jobs;computers doing clerks' work;machines taking over jobs|automation is machines doing people's work; simulation is a model of a real situation|automation 是自动化；simulation 是模拟|simulation=a simulation is a model for study or training, not machines doing real factory work=simulation 是用于研究或训练的模型，不是机器在工厂里真正干活;intelligence=intelligence is the ability to think, not machines replacing workers=intelligence 是思考能力，不是机器取代工人|au · to · ma · tion|automate drops its e and adds -ion|automate 去掉 e 加 -ion
      automate|robots packing boxes in a warehouse;tasks no one does by hand;a program doing checks instead of a person|to automate is to make machines do a job; to simulate is to copy a real situation|automate 是使自动化；simulate 是模拟|simulate/simulated=simulate copies a situation for practice, but here robots really pack the boxes=simulate 是为练习模拟情境，而这里机器人真的在装箱;encrypt/encrypted=encrypt turns data into code, not makes robots do a job=encrypt 是加密数据，不是让机器人干活|au · to · mate|auto + mate|auto + mate
      robotics|a class where a robot was built;an industry making factory machines;robot arms in surgery|robotics is the science of building robots; genetics is the science of genes|robotics 是机器人学；genetics 是遗传学|genetics=genetics studies genes, not building robots or machines=genetics 研究基因，不是造机器人或机器;linguistics=linguistics studies language, not robot arms=linguistics 研究语言，不是机械臂|ro · bot · ics|robot + ics|robot + ics
      intelligence|machines that write essays;crows solving puzzles;a talent for music|intelligence is the ability to think and learn; automation is machines doing work|intelligence 是智力、智能；automation 是自动化|automation=automation is machines doing jobs, and there is no *artificial automation* or crows showing automation=automation 是机器干活，没有 *artificial automation*，乌鸦也不会表现出自动化;simulation=a simulation is a model, not the ability crows show when solving puzzles=simulation 是模型，不是乌鸦解谜时表现出的能力|in · tel · li · gence|intelli + gence, with a double l|intelli + gence，双写 l
      neural|a network modeled on the brain;pathways in the brain;activity in a mouse's brain|neural is about nerves or the brain; lunar is about the moon|neural 是神经的；lunar 是月球的|lunar=lunar is about the moon, not the brain=lunar 与月球有关，不是大脑;cosmic=cosmic is about space, not pathways in the brain=cosmic 与宇宙有关，不是大脑里的通路|neu · ral|neur + al, with eu|neur + al，有 eu
      chatbot|a bank program answering questions;a program students chat with;a program that wrote a recipe|a chatbot is a program you talk with; a sensor is a device that notices things|chatbot 是聊天机器人；sensor 是传感器|sensor/sensors=a sensor notices heat or movement, but it cannot answer questions or write recipes=sensor 能感知热或动作，但不会回答问题或写菜谱;processor/processors=a processor does calculations inside a computer, but you do not chat with it=processor 在计算机里做运算，但你不会和它聊天|chat · bot|chat + bot, one word|chat + bot，连写成一个词
      autonomous|cars with no human driver;a drone that flies itself;a region with its own parliament|autonomous means working or governing on its own; neural is about the brain|autonomous 是自主的、自治的；neural 是神经的|neural=neural is about the brain, not cars with no driver or a region=neural 与大脑有关，不是无人驾驶的车或地区;lunar=lunar is about the moon, not something that flies itself or governs itself=lunar 与月球有关，不是自己飞行或自治的东西|au · ton · o · mous|auto + nomous|auto + nomous
      sensor|a light that turns on with movement;cars noticing obstacles;a soil thermometer|a sensor notices heat, light or movement; a processor does calculations|sensor 是传感器；processor 是处理器|chatbot/chatbots=a chatbot talks with people, not detects movement or soil temperature=chatbot 与人聊天，不能感知动作或土壤温度;cyborg/cyborgs=a cyborg is part human, not a device in the soil=cyborg 是半人半机器，不是埋在土里的装置|sen · sor|sense + or, with -or|sense + or，以 -or 结尾
      computing|files stored online;a degree for writing software;problems solved faster than today's computers|computing is using or studying computers; nursing is caring for the ill|computing 是计算机技术；nursing 是护理|nursing=nursing is caring for the sick, not storing files or writing software=nursing 是照顾病人，不是存储文件或编写软件;farming=farming is growing food, not solving problems with computers=farming 是种粮食，不是用计算机解决问题|com · put · ing|compute drops its e and adds -ing|compute 去掉 e 加 -ing
      processor|apps opening quickly;millions of calculations in games;a part that heats up when a computer works|a processor does a computer's calculations; a sensor notices things|processor 是处理器；sensor 是传感器|chatbot/chatbots=a chatbot is a program you talk with, not the part that does calculations=chatbot 是聊天程序，不是负责运算的部件;cyborg/cyborgs=a cyborg is part human, not a part inside a phone=cyborg 是半人半机器，不是手机里的零件|pro · ces · sor|process + or|process + or
      simulation|pilot training before a real plane;predictions of a storm's path;a model of how a virus spreads|a simulation is a model of a real situation; an animation is a moving cartoon|simulation 是模拟；animation 是动画|animation/animations=an animation is a cartoon, not a model built from real data that predicts=animation 是动画，不是根据真实数据做出预测的模型;stimulation/stimulations=stimulation makes something more active, not a model for training pilots=stimulation 是刺激，不是训练飞行员的模型|sim · u · la · tion|simulate drops its e and adds -ion|simulate 去掉 e 加 -ion
      cyborg|half man and half machine;people with chips in their bodies;machine eyes on a human|a cyborg is part human and part machine; a chatbot is a program|cyborg 是半机械人；chatbot 是聊天机器人|chatbot/chatbots=a chatbot is only a program, not a being with a metal arm or a human body=chatbot 只是程序，没有金属手臂或人的身体;sensor/sensors=a sensor is a small device, not a person with chips inside=sensor 是小装置，不是体内有芯片的人|cy · borg|cyber + organism, with cy|cyber + organism，以 cy 开头
    `,
  },
});

const innovation = vocabularyTopic({
  id: "b2-words-innovation",
  title: t("Innovation", "创新"),
  summary: t(
    "Cutting-edge and state-of-the-art technology; obsolete and outdated machines; revolutionary, groundbreaking and disruptive ideas; futuristic and high-tech designs; sophisticated, advanced and primitive tools.",
    "尖端的和最先进的技术；过时的和陈旧的机器；革命性的、开创性的和颠覆性的想法；未来感的和高科技的设计；精密的、先进的和原始的工具。",
  ),
  intro: t(
    "The new library looks **futuristic**, with **state-of-the-art** screens on every desk. The old card catalog is **obsolete** now, but we keep it to show how **primitive** libraries once were. These words help you describe how new or old technology is.",
    "新图书馆看上去 **futuristic**（极具未来感），每张桌子上都有 **state-of-the-art**（最先进的）屏幕。旧的卡片目录现在已经 **obsolete**（淘汰）了，但我们留着它，让人看看以前的图书馆有多 **primitive**（简陋）。这些词帮你描述技术的新旧。",
  ),
  prerequisites: ["b1-words-inventions"],
  words: [
    word(
      "cutting-edge",
      "the newest and most advanced",
      "尖端的；最前沿的",
      "The lab uses {cutting-edge} technology: nothing in it is more than a year old. | They sell {cutting-edge} cameras that most shops won't have until next year. | The startup is famous for its {cutting-edge} designs, years ahead of its rivals.",
      "obsolete primitive",
      "state-of-the-art",
    ),
    word(
      "state-of-the-art",
      "using the most modern methods and materials",
      "最先进的",
      "The new hospital has {state-of-the-art} equipment, the best money can buy. | The stadium was built last year and is {state-of-the-art}. | Their factory is a {state-of-the-art} building full of the latest robots.",
      "obsolete primitive",
      "cutting-edge",
    ),
    word(
      "obsolete",
      "no longer used because something newer exists",
      "过时的；淘汰的",
      "Fax machines are now almost {obsolete}: hardly anyone uses them. | Smartphones have made paper maps {obsolete} for many people. | The factory's machines were {obsolete}, so no one could find spare parts.",
      "futuristic groundbreaking",
      "outdated",
    ),
    word(
      "outdated",
      "old-fashioned and no longer useful",
      "过时的；陈旧的",
      "The school's computers are {outdated}; they are fifteen years old. | These {outdated} laws were written for a world without the internet. | His ideas about women are {outdated}; hardly anyone thinks like that anymore.",
      "futuristic groundbreaking",
      "obsolete",
    ),
    word(
      "revolutionary",
      "completely new and causing great change",
      "革命性的",
      "The printing press was a {revolutionary} invention that changed the world. | Her ideas were {revolutionary} at the time, and many people were shocked. | It is a {revolutionary} new treatment that could cure the disease.",
      "obsolete primitive",
      "groundbreaking",
    ),
    word(
      "groundbreaking",
      "making new discoveries; very new and important",
      "开创性的；突破性的",
      "The {groundbreaking} study changed how we treat cancer. | Her work on genes was {groundbreaking} and won her a Nobel Prize. | The film used {groundbreaking} special effects that no one had seen before.",
      "obsolete primitive",
      "revolutionary",
    ),
    word(
      "disruptive",
      "causing problems that stop something from working normally; changing an industry completely",
      "破坏性的；颠覆性的",
      "The streaming service was {disruptive} for the music industry and forced record shops to close. | His {disruptive} behavior, shouting in class, annoyed the teacher. | Strikes are {disruptive} for travelers because trains stop running.",
      "futuristic sophisticated",
    ),
    word(
      "futuristic",
      "very modern and strange, as if from the future",
      "未来派的；极具未来感的",
      "The new museum has a {futuristic} design that looks like a spaceship. | The car looks {futuristic}, like something from a science-fiction film. | The film shows a {futuristic} city in 2200.",
      "obsolete primitive",
      "high-tech",
    ),
    word(
      "high-tech",
      "using the most modern technology",
      "高科技的",
      "Shenzhen is full of {high-tech} companies that make phones and drones. | The house has a {high-tech} kitchen where the fridge orders food by itself. | {High-tech} jobs in software pay well.",
      "primitive obsolete",
      "futuristic",
    ),
    word(
      "sophisticated",
      "complex and advanced; having a lot of experience of the world",
      "精密的；老练的",
      "The bank uses {sophisticated} software that learns from every attack to catch fraud. | She is a {sophisticated} young woman who has lived in five countries. | The thieves used a {sophisticated} method that fooled the police for years.",
      "primitive obsolete",
      "advanced",
    ),
    word(
      "advanced",
      "modern and developed; at a high level",
      "先进的；高级的",
      "The country has very {advanced} medicine, and people live long lives. | She is in the {advanced} class because she learns fast. | The rocket uses {advanced} engines designed this year.",
      "primitive obsolete",
      "sophisticated",
    ),
    word(
      "primitive",
      "very simple and not developed; belonging to an early stage",
      "原始的；简陋的",
      "Early humans used {primitive} stone tools. | The cabin had only {primitive} toilets: just a hole in the ground. | The first computers look {primitive} today.",
      "futuristic sophisticated",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Obsolete* and *primitive* describe old or simple things, while *cutting-edge* and *futuristic* describe the newest. Look for words such as *hardly anyone uses*, *stone tools*, *ahead of its rivals* or *in 2200* that show the age.",
        "*obsolete* 和 *primitive* 形容陈旧或简陋的东西，*cutting-edge* 和 *futuristic* 形容最新的东西。找找 *hardly anyone uses*、*stone tools*、*ahead of its rivals* 或 *in 2200* 这类词，判断新旧。",
      ),
      meaning: t(
        "*Disruptive* means causing problems or changing an industry, while *sophisticated* means complex and advanced. Check whether the meaning is about trouble or about being complex.",
        "*disruptive* 是造成干扰或颠覆行业，*sophisticated* 是精密复杂。看释义说的是麻烦，还是复杂。",
      ),
      spell: t(
        "*Cutting-edge*, *state-of-the-art* and *high-tech* take hyphens before a noun; *groundbreaking* is one word; *obsolete* ends in -ete.",
        "*cutting-edge*、*state-of-the-art* 和 *high-tech* 放在名词前时带连字符；*groundbreaking* 连写成一个词；*obsolete* 以 -ete 结尾。",
      ),
    },
    notes: `
      cutting-edge|technology less than a year old;cameras shops won't have until next year;designs years ahead of rivals|cutting-edge means the newest and most advanced; obsolete means no longer used|cutting-edge 是最前沿的；obsolete 是淘汰的|obsolete=obsolete means no longer used, but nothing here is more than a year old=obsolete 是被淘汰的，而这里的东西都不到一年;primitive=primitive means very simple, not years ahead of rivals=primitive 是简陋的，不是领先对手好几年|cut · ting-edge|cutting + hyphen + edge|cutting + 连字符 + edge
      state-of-the-art|the best equipment money can buy;a stadium built last year;a factory full of the latest robots|state-of-the-art means using the most modern methods; primitive means very simple|state-of-the-art 是最先进的；primitive 是原始的|obsolete=obsolete means no longer used, not built last year with the latest robots=obsolete 是被淘汰的，不是去年新建、满是最新机器人的;primitive=primitive means simple and early, not the best money can buy=primitive 是简陋原始的，不是花钱能买到的最好的|state-of-the-art|four words joined by three hyphens|四个词用三个连字符连起来
      obsolete|fax machines hardly anyone uses;paper maps replaced by phones;machines with no spare parts|obsolete means no longer used because something newer exists; futuristic means as if from the future|obsolete 是淘汰的；futuristic 是极具未来感的|futuristic=futuristic means very new, but hardly anyone uses fax machines now=futuristic 是极新的，而现在几乎没人用传真机;groundbreaking=groundbreaking means new and important, but here things are replaced and have no spare parts=groundbreaking 是开创性的，而这里的东西被取代、连零件都找不到|ob · so · lete|ob + so + lete, ending in -ete|ob + so + lete，以 -ete 结尾
      outdated|computers fifteen years old;laws from before the internet;ideas hardly anyone shares now|outdated means old-fashioned and no longer useful; futuristic means very modern|outdated 是陈旧的；futuristic 是极具未来感的|futuristic=futuristic means as if from the future, but these are fifteen years old=futuristic 像来自未来，而这些已经十五年了;groundbreaking=groundbreaking means new and important, not written for a world without the internet=groundbreaking 是开创性的，不是为没有互联网的世界写的|out · dat · ed|out + date + d|out + date + d
      revolutionary|an invention that changed the world;ideas that shocked people;a treatment that could cure a disease|revolutionary means completely new and causing great change; obsolete means no longer used|revolutionary 是革命性的；obsolete 是淘汰的|obsolete=obsolete means old and unused, not something that changed the world or could cure a disease=obsolete 是过时不用的，不会改变世界或治愈疾病;primitive=primitive means simple and early, not shocking new ideas=primitive 是简陋原始的，不是令人震惊的新想法|rev · o · lu · tion · ar · y|revolution + ary|revolution + ary
      groundbreaking|a study that changed cancer treatment;work that won a Nobel Prize;effects no one had seen before|groundbreaking means making new discoveries; outdated means old-fashioned|groundbreaking 是开创性的；outdated 是陈旧的|obsolete=obsolete means no longer used, not something that changed treatment=obsolete 是淘汰的，不会改变治疗方法;primitive=primitive means simple, not effects no one had seen before=primitive 是简陋的，不是前所未见的特效|ground · break · ing|ground + breaking, one word|ground + breaking，连写成一个词
      disruptive|a service that closed record shops;shouting in class;strikes that stop trains|disruptive means causing problems or changing an industry; sophisticated means complex and advanced|disruptive 是破坏性的、颠覆性的；sophisticated 是精密的|futuristic=futuristic means as if from the future, not shouting in class or stopping trains=futuristic 是极具未来感的，不是在课堂上大喊或让火车停运;sophisticated=sophisticated means complex and advanced, not behavior that annoys a teacher=sophisticated 是精密老练的，不是惹老师生气的行为|dis · rup · tive|disrupt + ive|disrupt + ive
      futuristic|a museum like a spaceship;a car from a science-fiction film;a city in 2200|futuristic means very modern, as if from the future; obsolete means no longer used|futuristic 是极具未来感的；obsolete 是淘汰的|obsolete=obsolete means old and unused, not like a spaceship or a city in 2200=obsolete 是过时不用的，不像宇宙飞船或 2200 年的城市;primitive=primitive means simple and early, not from a science-fiction film=primitive 是简陋原始的，不像科幻片里的东西|fu · tur · is · tic|future drops its e and adds -istic|future 去掉 e 加 -istic
      high-tech|companies making phones and drones;a fridge that orders food;jobs in software|high-tech means using the most modern technology; primitive means very simple|high-tech 是高科技的；primitive 是原始的|primitive=primitive means very simple, not a fridge that orders food by itself=primitive 是简陋的，不会有自己订食物的冰箱;obsolete=obsolete means no longer used, not companies making drones=obsolete 是淘汰的，不是生产无人机的公司|high-tech|high + hyphen + tech|high + 连字符 + tech
      sophisticated|software that learns from attacks;a woman who has lived in five countries;a method that fooled the police for years|sophisticated means complex and advanced, or experienced; primitive means very simple|sophisticated 是精密的、老练的；primitive 是原始的|primitive=primitive means very simple, not software that learns or a method that fooled the police for years=primitive 是简陋的，不是会学习的软件或骗过警察多年的手法;obsolete=obsolete means no longer used, not a woman who has lived in five countries=obsolete 是淘汰的，不能形容在五个国家生活过的女士|so · phis · ti · cat · ed|so + phist + icated, with ph|so + phist + icated，有 ph
      advanced|medicine that helps people live long;a class for fast learners;engines designed this year|advanced means modern and developed, or at a high level; primitive means very simple|advanced 是先进的、高级的；primitive 是原始的|primitive=primitive means very simple, not medicine that helps people live long=primitive 是简陋的，不是让人长寿的医学;obsolete=obsolete means no longer used, not engines designed this year=obsolete 是淘汰的，不是今年设计的发动机|ad · vanced|advance + d|advance + d
      primitive|stone tools of early humans;a hole in the ground for a toilet;the first computers seen today|primitive means very simple or early; sophisticated means complex and advanced|primitive 是原始的、简陋的；sophisticated 是精密的|futuristic=futuristic means as if from the future, not stone tools of early humans=futuristic 是极具未来感的，不是早期人类的石器;sophisticated=sophisticated means complex, not just a hole in the ground=sophisticated 是精密复杂的，不是地上挖个洞|prim · i · tive|prim + itive|prim + itive
    `,
  },
});

const cyber = vocabularyTopic({
  id: "b2-words-cyber",
  title: t("Cybersecurity", "网络安全"),
  summary: t(
    "Cybersecurity; encryption and encrypting data; breaches, malware and phishing; firewalls; surveillance; authenticating users and biometric checks; loopholes; hacking.",
    "网络安全；加密和对数据加密；数据泄露、恶意软件和网络钓鱼；防火墙；监控；验证用户身份和生物识别检查；漏洞；黑客攻击。",
  ),
  intro: t(
    "Last week, a **phishing** email pretending to be from our school asked for passwords. Our teacher explained that the school's **firewall** blocks most attacks, and that **encryption** keeps our files safe even if someone steals them. These words help you talk about keeping computers and data safe.",
    "上周，一封冒充学校的 **phishing**（网络钓鱼）邮件索要密码。老师解释说，学校的 **firewall**（防火墙）能挡住大部分攻击，而 **encryption**（加密）即使文件被偷也能保证安全。这些词帮你谈论如何保护电脑和数据。",
  ),
  prerequisites: ["b1-words-online-safety"],
  words: [
    word(
      "cybersecurity",
      "the protection of computers and data from attacks",
      "网络安全",
      "Banks spend millions on {cybersecurity} to keep hackers out. | She works in {cybersecurity}, protecting companies from attacks. | Weak {cybersecurity} let hackers steal patients' data.",
      "malware phishing",
    ),
    word(
      "encryption",
      "changing data into a code so that others cannot read it",
      "加密（技术）",
      "The app uses {encryption} to turn your messages into a secret code. | Without {encryption}, anyone could read your emails. | Strong {encryption} keeps the data safe, even if it is stolen.",
      "phishing surveillance",
      "encrypt",
    ),
    word(
      "encrypt encrypts encrypted encrypting",
      "to change data into a code so that others cannot read it",
      "（给数据）加密",
      "Always {encrypt} files before you send them, so nobody else can read them. | The messages are {encrypted}, so only you can read them.|hacked breached | The software {encrypts} your passwords to keep them safe.|hacks breaches",
      "hack breach",
      "encryption",
    ),
    word(
      "breach breaches",
      "an act of breaking a law or an agreement; a break in security",
      "违反；（安全）漏洞",
      "A data {breach} let hackers steal millions of passwords. | That is a {breach} of contract: you broke our agreement. | Security {breaches} have exposed the data of millions.|firewalls sensors",
      "firewall sensor",
      "loophole",
    ),
    word(
      "malware",
      "software made to damage a computer or steal data",
      "恶意软件",
      "The email contained {malware} that damaged my computer. | {Malware} can steal your bank details. | Install software that removes {malware} from your computer.",
      "encryption cybersecurity",
      "phishing",
    ),
    word(
      "phishing",
      "trying to trick people into giving passwords or bank details, for example with false emails",
      "网络钓鱼",
      "Don't click the link: it's a {phishing} email pretending to be your bank. | {Phishing} attacks often pretend to come from banks. | Train staff to spot {phishing} emails that ask for passwords.",
      "encryption surveillance",
      "malware",
    ),
    word(
      "firewall firewalls",
      "a program that protects a computer network from attacks",
      "防火墙",
      "The {firewall} blocked the attack. | Make sure your {firewall} is turned on to protect your computer. | Companies use {firewalls} to protect their networks.|loopholes breaches",
      "loophole breach",
    ),
    word(
      "surveillance",
      "watching people or places carefully, often secretly",
      "监视；监控",
      "The city is under constant {surveillance}, with cameras on every street. | {Surveillance} cameras watch every corner of the station. | Critics fear mass {surveillance} of citizens by the government.",
      "encryption malware",
    ),
    word(
      "authenticate authenticates authenticated authenticating",
      "to prove that something or someone is real or genuine",
      "验证；鉴定",
      "Use your fingerprint to {authenticate} yourself. | Experts {authenticated} the painting, proving it was a real Picasso.|hacked breached | The app {authenticates} every user before they can log in.|hacks breaches",
      "hack breach",
      "encrypt",
    ),
    word(
      "biometric",
      "using measurements of the body, such as fingerprints or the face, to identify people",
      "生物识别的",
      "The airport uses {biometric} passport checks that scan your face. | {Biometric} data includes fingerprints and face scans. | Some phones have {biometric} locks that open with your fingerprint.",
      "phishing malware",
    ),
    word(
      "loophole loopholes",
      "a mistake in a law or a rule that lets people avoid it",
      "漏洞",
      "The company used a {loophole} in the law to avoid paying tax. | The government closed the {loophole} so nobody could avoid the rule. | There are {loopholes} in the new law that let rich people pay less.|firewalls sensors",
      "firewall sensor",
      "breach",
    ),
    word(
      "hack hacks hacked hacking",
      "to get into someone's computer system without permission",
      "黑客入侵",
      "Someone {hacked} my email account and sent messages to all my friends.|encrypted authenticated | {Hacking} into a computer without permission is a crime.|encrypting authenticating | Criminals try to {hack} bank systems to steal money.",
      "encrypt authenticate",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *encrypt* is to turn data into a secret code, while to *hack* is to break into a system. Look for words such as *so only you can read* or *without permission* that show which one fits.",
        "*encrypt* 是把数据变成密码，*hack* 是闯入系统。找找 *so only you can read* 或 *without permission* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "*Surveillance* is watching people, while *encryption* is hiding data in a code. Check whether the meaning is about watching or about hiding.",
        "*surveillance* 是监视人，*encryption* 是把数据藏进密码里。看释义说的是监视，还是隐藏。",
      ),
      spell: t(
        "*Surveillance* has ei and a double l: sur · veil · lance; *phishing* starts with ph; *loophole* and *firewall* are each one word.",
        "*surveillance* 中有 ei 和双写 l：sur · veil · lance；*phishing* 以 ph 开头；*loophole* 和 *firewall* 都连写成一个词。",
      ),
    },
    notes: `
      cybersecurity|money spent to keep hackers out;a job protecting companies from attacks;weak protection that let data be stolen|cybersecurity is protecting computers from attacks; malware is harmful software|cybersecurity 是网络安全；malware 是恶意软件|malware=malware is harmful software, not something that keeps hackers out or protects companies=malware 是有害软件，不能挡住黑客或保护公司;phishing=phishing is a trick to steal passwords, not a job protecting companies=phishing 是骗取密码的伎俩，不是保护公司的工作|cy · ber · se · cu · ri · ty|cyber + security, one word|cyber + security，连写成一个词
      encryption|messages turned into a secret code;emails nobody else can read;data safe even if stolen|encryption is turning data into code; surveillance is watching people|encryption 是加密；surveillance 是监视|phishing=phishing tricks people into giving passwords, not turns messages into code=phishing 是骗取密码，不是把信息变成密码;surveillance=surveillance is watching people, not keeping stolen data safe=surveillance 是监视人，不能让被偷的数据保持安全|en · cryp · tion|en + crypt + ion, with y|en + crypt + ion，有 y
      encrypt|files nobody else can read;messages only you can read;passwords kept safe|to encrypt is to turn data into code; to hack is to break into a system|encrypt 是加密；hack 是黑客入侵|hack/hacked/hacks=hack breaks into a system, but here only you can read the messages=hack 是闯入系统，而这里只有你能读这些信息;breach/breached/breaches=breach breaks security, not keeps passwords safe=breach 是破坏安全，不是保护密码|en · crypt|en + crypt, with y|en + crypt，有 y
      breach|stolen passwords;a broken agreement;exposed data|a breach is breaking a law or security; a firewall protects a network|breach 是违反、安全漏洞；firewall 是防火墙|firewall/firewalls=a firewall stops attacks, not lets hackers steal or breaks an agreement=firewall 是挡住攻击的，不会让黑客偷东西，也不是违约;sensor/sensors=a sensor notices movement or heat, not breaks a contract=sensor 感知动作或温度，不是违约|breach|br + each, said like *reach*|br + each，读音像 *reach*
      malware|an email that damaged a computer;software that steals bank details;something security software removes|malware is software made to cause harm; encryption protects data|malware 是恶意软件；encryption 是加密|encryption=encryption protects data, not damages a computer or steals details=encryption 是保护数据，不会损坏电脑或偷信息;cybersecurity=cybersecurity is protection, not something you need to remove=cybersecurity 是防护，不是需要清除的东西|mal · ware|mal + ware, from *malicious software*|mal + ware，来自 *malicious software*
      phishing|an email pretending to be your bank;attacks that pretend to come from banks;emails asking for passwords|phishing tricks people with false emails; encryption protects data|phishing 是网络钓鱼；encryption 是加密|encryption=encryption protects messages, not an email pretending to be a bank=encryption 是保护信息，不是冒充银行的邮件;surveillance=surveillance is watching people, not emails asking for passwords=surveillance 是监视，不是索要密码的邮件|phish · ing|ph + ishing, not *fishing*|ph + ishing，不要写成 *fishing*
      firewall|something that blocked an attack;a protection you turn on;protection for company networks|a firewall protects a network; a loophole is a gap in a rule|firewall 是防火墙；loophole 是漏洞|loophole/loopholes=a loophole is a gap that lets people get around a rule, not something that blocks attacks=loophole 是让人钻空子的漏洞，不能挡住攻击;breach/breaches=a breach is a break in security, not a protection you turn on=breach 是安全漏洞，不是可以开启的防护|fire · wall|fire + wall, one word|fire + wall，连写成一个词
      surveillance|cameras on every street;cameras watching a station;the government watching citizens|surveillance is watching people carefully; encryption is hiding data in code|surveillance 是监视；encryption 是加密|encryption=encryption hides data, not watches streets with cameras=encryption 是隐藏数据，不是用摄像头盯着街道;malware=malware is harmful software, not cameras watching a station=malware 是有害软件，不是监视车站的摄像头|sur · veil · lance|sur + veil + lance, with ei and a double l|sur + veil + lance，有 ei 和双写 l
      authenticate|a fingerprint proving who you are;a painting proved to be real;users checked before logging in|to authenticate is to prove something is real; to hack is to break in|authenticate 是验证；hack 是入侵|hack/hacked/hacks=hack breaks into a system, not proves a painting is real=hack 是闯入系统，不是证明画是真迹;breach/breached/breaches=breach breaks security, not checks users before they log in=breach 是破坏安全，不是在登录前核验用户|au · then · ti · cate|authentic + ate|authentic + ate
      biometric|passport checks that scan your face;fingerprints and face scans;locks that open with a fingerprint|biometric means using measurements of the body; phishing means tricking people|biometric 是生物识别的；phishing 是网络钓鱼|phishing=phishing is tricking people with emails, not scanning your face=phishing 是用邮件骗人，不是扫描你的脸;malware=malware is harmful software, not fingerprints or face scans=malware 是有害软件，不是指纹或面部扫描|bi · o · met · ric|bio + metric|bio + metric
      loophole|a gap used to avoid tax;a gap the government closed;gaps that let rich people pay less|a loophole is a gap in a rule; a firewall protects a network|loophole 是漏洞；firewall 是防火墙|firewall/firewalls=a firewall protects a network, not a gap in the law used to avoid tax=firewall 保护网络，不是用来避税的法律漏洞;sensor/sensors=a sensor notices heat or movement, not lets rich people pay less=sensor 感知热或动作，不会让富人少交钱|loop · hole|loop + hole, one word|loop + hole，连写成一个词
      hack|an email account used to send messages;breaking into a computer without permission;criminals attacking bank systems|to hack is to break into a system; to encrypt is to protect data with code|hack 是入侵；encrypt 是加密|encrypt/encrypted/encrypting=encrypt protects data, not sends messages from someone else's account=encrypt 是保护数据，不是盗用别人的账号发消息;authenticate/authenticated/authenticating=authenticate proves who someone is, and it is not a crime=authenticate 是验证身份，并不犯法|hack|h + ack, with ck|h + ack，有 ck
    `,
  },
});

const space = vocabularyTopic({
  id: "b2-words-space-future",
  title: t("Space and the Future", "太空与未来"),
  summary: t(
    "Colonizing other planets and colonization; habitable exoplanets; asteroids and shuttles; weightless astronauts; lunar and Martian landscapes; cosmic rays; extraterrestrial life; propulsion.",
    "殖民其他星球；宜居的系外行星；小行星和航天飞机；失重的宇航员；月球和火星的地貌；宇宙射线；外星生命；推进力。",
  ),
  intro: t(
    "In our astronomy club, we watched a video of **weightless** astronauts eating floating noodles, read about an **asteroid** that will pass close to Earth, and argued about whether any **exoplanet** is **habitable**. These words help you talk about space and our future there.",
    "在天文社，我们看了一段 **weightless**（失重的）宇航员吃漂浮面条的视频，读到一颗将从地球附近经过的 **asteroid**（小行星），还争论有没有哪颗 **exoplanet**（系外行星）是 **habitable**（适合居住的）。这些词帮你谈论太空以及我们在那里的未来。",
  ),
  prerequisites: ["b1-words-space-2"],
  words: [
    word(
      "colonize colonizes colonized colonizing",
      "to take control of a place and send people to live there",
      "殖民；移居",
      "Will humans ever {colonize} Mars and build cities there? | Britain {colonized} many countries and ruled them for centuries.|orbited propelled | Plants quickly {colonized} the island after the volcano, covering it in green.|orbited propelled",
      "orbit propel",
      "colonization",
    ),
    word(
      "colonization",
      "taking control of a place and sending people to live there",
      "殖民（化）",
      "The {colonization} of Mars, with towns full of settlers, may begin this century. | The country suffered under {colonization} by a foreign power for 200 years. | Space {colonization}, sending settlers to other planets, raises many ethical questions.",
      "propulsion gravity",
      "colonize",
    ),
    word(
      "habitable",
      "good enough for people to live in",
      "适合居住的",
      "Scientists are looking for {habitable} planets where people could live. | The old house is no longer {habitable}: the roof has fallen in. | Only a small part of the island is {habitable}; the rest is ice.",
      "weightless cosmic",
    ),
    word(
      "exoplanet exoplanets",
      "a planet that goes around a star other than the sun",
      "系外行星",
      "Astronomers have found over 5,000 {exoplanets} around other stars.|shuttles telescopes | The {exoplanet}, a planet about the size of Earth, goes around a distant star. | Some {exoplanets} may have oceans like Earth's.|shuttles telescopes",
      "shuttle telescope",
      "asteroid",
    ),
    word(
      "asteroid asteroids",
      "a large rock that moves around the sun",
      "小行星",
      "The {asteroid} that hit the earth may have killed the dinosaurs. | The huge rock, an {asteroid}, will pass close to Earth next year. | Companies want to mine {asteroids} for metals.|shuttles telescopes",
      "shuttle telescope",
      "exoplanet",
    ),
    word(
      "shuttle shuttles",
      "a spacecraft that can go into space and come back; a vehicle that makes short trips between two places",
      "航天飞机；（往返）班车",
      "The space {shuttle} carried seven astronauts into orbit and back. | A free {shuttle} bus runs between the hotel and the airport. | {Shuttles} leave every twenty minutes for the city center.|asteroids telescopes",
      "asteroid telescope",
    ),
    word(
      "weightless",
      "having no weight, as in space",
      "失重的",
      "Astronauts are {weightless} in orbit and float around the station. | It feels strange to be {weightless}, with nothing pulling you down. | In the {weightless} cabin, water floats in balls.",
      "habitable cosmic",
    ),
    word(
      "lunar",
      "connected with the moon",
      "月球的；月亮的",
      "The first {lunar} landing, on the moon, took place in 1969. | The Spring Festival follows the {lunar} calendar, based on the moon. | Rocks that astronauts brought back from the {lunar} surface are gray.",
      "solar cosmic",
      "Martian",
    ),
    word(
      "Martian",
      "connected with the planet Mars; an imagined creature from Mars",
      "火星的；火星人",
      "The {Martian} soil is red with iron, like the rest of Mars. | The rover on Mars sent pictures of the {Martian} landscape. | In the story, a {Martian} from the red planet lands in New York.",
      "solar cosmic",
      "lunar",
    ),
    word(
      "cosmic",
      "connected with the whole universe; very great",
      "宇宙的；巨大的",
      "{Cosmic} rays from deep space are dangerous for astronauts. | The telescope studies {cosmic} dust between distant galaxies. | It was a mistake of {cosmic} proportions, the biggest ever made.",
      "lunar solar",
    ),
    word(
      "extraterrestrial",
      "from somewhere other than the earth",
      "外星的；地球外的",
      "Is there {extraterrestrial} life on any planet beyond the earth? | The film is about a friendly {extraterrestrial} from another planet. | Scientists listen for {extraterrestrial} signals from distant stars.",
      "lunar Martian",
    ),
    word(
      "propulsion",
      "the force that pushes something forward",
      "推进（力）",
      "The rocket uses a new kind of {propulsion} to push it forward. | Jet {propulsion} made fast air travel possible. | Nuclear {propulsion} could push spaceships to Mars faster.",
      "colonization gravity",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Habitable* means good enough for people to live in, while *weightless* means having no weight. Look for words such as *where people could live*, *the roof has fallen in* or *float* that show which one fits.",
        "*habitable* 是适合人居住的，*weightless* 是失重的。找找 *where people could live*、*the roof has fallen in* 或 *float* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "An *asteroid* is a large rock moving around the sun, while an *exoplanet* is a planet around another star. Check whether the meaning is about a rock or about a planet.",
        "*asteroid* 是绕太阳运行的大石块，*exoplanet* 是绕其他恒星运行的行星。看释义说的是石块，还是行星。",
      ),
      spell: t(
        "*Extraterrestrial* has a double r: extra · ter · res · tri · al; *Martian* starts with a capital M; *propulsion* ends in -sion.",
        "*extraterrestrial* 中双写 r：extra · ter · res · tri · al；*Martian* 首字母大写 M；*propulsion* 以 -sion 结尾。",
      ),
    },
    notes: `
      colonize|cities built on Mars;countries ruled for centuries;plants covering an island|to colonize is to take a place and live there; to orbit is to go around something|colonize 是殖民、移居；orbit 是绕轨道运行|orbit/orbited=orbit means to go around something, not to build cities or rule countries=orbit 是绕着转，不是建城市或统治国家;propel/propelled=propel means to push forward, not to cover an island with plants=propel 是推动，不是让植物覆盖小岛|col · o · nize|colony drops its y and adds -ize|colony 去掉 y 加 -ize
      colonization|towns of settlers on Mars;200 years under a foreign power;settlers sent to other planets|colonization is taking a place and settling it; propulsion is the force that pushes|colonization 是殖民；propulsion 是推进力|propulsion=propulsion pushes a rocket, not fills towns with settlers=propulsion 推动火箭，不会让城镇住满移民;gravity=gravity pulls things down, not a foreign power ruling a country=gravity 把东西往下拉，不是外国统治一个国家|col · o · ni · za · tion|colonize drops its e and adds -ation|colonize 去掉 e 加 -ation
      habitable|planets where people could live;a house with a fallen roof;an island mostly ice|habitable means good enough to live in; weightless means having no weight|habitable 是适合居住的；weightless 是失重的|weightless=weightless means having no weight, not a place where people could live=weightless 是失重的，不是适合人居住的地方;cosmic=cosmic is about the universe, not a house with a fallen roof=cosmic 与宇宙有关，不能形容屋顶塌了的房子|hab · it · a · ble|habit + able|habit + able
      exoplanet|5,000 found around other stars;a planet the size of Earth;oceans like Earth's|an exoplanet is a planet around another star; a telescope is used to see far|exoplanet 是系外行星；telescope 是望远镜|shuttle/shuttles=a shuttle is a spacecraft people build, not something found around other stars=shuttle 是人造的航天器，不是在其他恒星周围发现的;telescope/telescopes=a telescope is a tool for looking, not a planet with oceans=telescope 是观测工具，不是有海洋的行星|ex · o · plan · et|exo + planet|exo + planet
      asteroid|a rock that killed the dinosaurs;a huge rock passing close to Earth;rocks mined for metals|an asteroid is a large rock moving around the sun; a shuttle is a spacecraft|asteroid 是小行星；shuttle 是航天飞机|shuttle/shuttles=a shuttle carries astronauts, not hit the earth when dinosaurs lived=shuttle 运送宇航员，恐龙时代并没有撞上地球;telescope/telescopes=a telescope is a tool, not a huge rock to mine=telescope 是工具，不是可以采矿的巨石|as · ter · oid|aster + oid|aster + oid
      shuttle|seven astronauts into orbit and back;a free bus to the airport;trips every twenty minutes|a shuttle is a spacecraft or a vehicle making short trips; an asteroid is a rock|shuttle 是航天飞机、班车；asteroid 是小行星|asteroid/asteroids=an asteroid is a rock, not something that carries astronauts or leaves every twenty minutes=asteroid 是石块，不会运送宇航员，也不会每二十分钟发一班;telescope/telescopes=a telescope is for looking, not a bus that runs to the airport=telescope 是用来观测的，不是开往机场的班车|shut · tle|shut + tle, with a double t|shut + tle，双写 t
      weightless|astronauts floating in orbit;nothing pulling you down;water floating in balls|weightless means having no weight; habitable means fit to live in|weightless 是失重的；habitable 是适合居住的|habitable=habitable means people can live there, not that water floats=habitable 是可居住的，不是水会漂浮;cosmic=cosmic is about the universe, not about floating with nothing pulling you down=cosmic 与宇宙有关，不是指没东西往下拉而漂浮|weight · less|weight + less|weight + less
      lunar|a landing on the moon in 1969;a calendar based on the moon;gray rocks from the moon|lunar is about the moon; solar is about the sun|lunar 与月球有关；solar 与太阳有关|solar=solar is about the sun, but here it is the moon=solar 与太阳有关，而这里说的是月亮;cosmic=cosmic is about the whole universe, not just the moon=cosmic 与整个宇宙有关，不只是月球|lu · nar|lun + ar, ending in -ar|lun + ar，以 -ar 结尾
      Martian|red soil like the rest of Mars;pictures from a rover on Mars;a creature from the red planet|Martian is about Mars; solar is about the sun|Martian 与火星有关；solar 与太阳有关|solar=solar is about the sun, not Mars=solar 与太阳有关，不是火星;cosmic=cosmic is about the whole universe, not one red planet=cosmic 与整个宇宙有关，不是一颗红色行星|Mar · tian|Mars + tian, with ti said "sh" and a capital M|Mars + tian，ti 读作 "sh"，首字母大写
      cosmic|rays from deep space;dust between galaxies;the biggest mistake ever|cosmic is about the whole universe, or very great; lunar is about the moon|cosmic 是宇宙的、巨大的；lunar 是月球的|lunar=lunar is about the moon, not deep space or distant galaxies=lunar 与月球有关，不是深空或遥远星系;solar=solar is about the sun, and there is no mistake of *solar proportions*=solar 与太阳有关，没有 *solar proportions* 的说法|cos · mic|cosmos + ic|cosmos + ic
      extraterrestrial|life on any planet beyond the earth;a friendly visitor from another planet;signals from distant stars|extraterrestrial means from beyond the earth; lunar means from the moon|extraterrestrial 是外星的；lunar 是月球的|lunar=lunar is only about the moon, not any planet or distant stars=lunar 只与月球有关，不是任何星球或遥远的恒星;Martian=Martian is only about Mars, not signals from distant stars=Martian 只与火星有关，不是来自遥远恒星的信号|ex · tra · ter · res · tri · al|extra + terrestrial, with a double r|extra + terrestrial，双写 r
      propulsion|a new way to push a rocket;jet travel;nuclear power pushing spaceships|propulsion is the force that pushes forward; gravity is the force that pulls down|propulsion 是推进力；gravity 是引力|colonization=colonization is settling a place, not the force that pushes a rocket=colonization 是殖民，不是推动火箭的力;gravity=gravity pulls things down, not pushes them forward=gravity 是把东西往下拉，不是往前推|pro · pul · sion|propel becomes propulsion, with -sion|propel 变成 propulsion，以 -sion 结尾
    `,
  },
});

const transport = vocabularyTopic({
  id: "b2-words-transport-future",
  title: t("Future Transport", "未来交通"),
  summary: t(
    "Self-driving cars and autopilot; infrastructure and high-speed rail; ride-sharing and carpooling; scooters and pedaling; navigation and navigating; commuters; logistics.",
    "自动驾驶汽车和自动驾驶仪；基础设施和高速铁路；拼车和合乘；滑板车和踩踏板；导航；通勤者；物流。",
  ),
  intro: t(
    "My uncle is a **commuter** who used to drive two hours a day. Now he takes the **high-speed** train, rents a **scooter** at the station, and uses a **navigation** app to find the quickest way. These words help you talk about how we will travel in the future.",
    "我叔叔是个 **commuter**（通勤者），以前每天要开两个小时车。现在他坐 **high-speed**（高速）列车，在车站租一辆 **scooter**（滑板车），再用 **navigation**（导航）应用找最快的路线。这些词帮你谈论未来的出行方式。",
  ),
  prerequisites: ["b1-words-getting-around"],
  words: [
    word(
      "self-driving",
      "able to drive without a human driver",
      "自动驾驶的",
      "{Self-driving} taxis already carry passengers in some cities, with nobody at the wheel. | The {self-driving} car stopped by itself at the red light. | Who is to blame when a {self-driving} truck crashes with no driver inside?",
      "high-speed ride-sharing",
      "autopilot",
    ),
    word(
      "infrastructure",
      "the basic systems a country needs, such as roads, railways, power and water",
      "基础设施",
      "The country is spending billions on roads, bridges and other {infrastructure}. | Electric cars need charging {infrastructure}, such as charging points on every street. | The storm damaged the city's {infrastructure}, cutting power and water.",
      "logistics navigation",
    ),
    word(
      "high-speed",
      "moving or working very fast",
      "高速的",
      "The {high-speed} train goes from Beijing to Shanghai in four and a half hours. | We need {high-speed} internet for video calls. | China has the world's longest {high-speed} rail network, with trains at 350 kilometers an hour.",
      "self-driving ride-sharing",
    ),
    word(
      "ride-sharing",
      "an arrangement in which people share a car journey, often booked through an app",
      "拼车（服务）",
      "{Ride-sharing} apps let strangers share a taxi and split the fare. | She uses a {ride-sharing} service to get to work with two neighbors. | {Ride-sharing} can mean fewer cars on the road, because each one carries more people.",
      "high-speed self-driving",
      "carpool",
    ),
    word(
      "scooter scooters",
      "a small vehicle with two wheels that you stand on, often with an electric motor",
      "滑板车；小型摩托车",
      "Electric {scooters} are parked everywhere in the city center.|commuters pedals | He rides a {scooter} to school. | You can rent a {scooter} with an app, stand on it and ride away.",
      "commuter pedal",
    ),
    word(
      "autopilot",
      "a system that flies a plane or drives a vehicle without a human controlling it",
      "自动驾驶仪",
      "The plane was flying on {autopilot} while the pilots ate lunch. | The car's {autopilot} keeps it in the middle of the lane. | I was so tired that I did the whole day on {autopilot}.",
      "logistics infrastructure",
      "self-driving",
    ),
    word(
      "navigation",
      "finding your way, or the systems that help you do it",
      "导航",
      "The car's {navigation} system found a faster route. | Ancient sailors used the stars for {navigation}. | Satellite {navigation} has made paper maps less common.",
      "infrastructure logistics",
      "navigate",
    ),
    word(
      "navigate navigates navigated navigating",
      "to find your way to a place; to deal with something difficult",
      "导航；应对",
      "Bees {navigate} by the sun to find their way home. | She {navigated} the narrow streets without a map.|pedaled carpooled | New students must learn to {navigate} the university's rules.",
      "pedal carpool",
      "navigation",
    ),
    word(
      "commuter commuters",
      "a person who travels some distance to work every day",
      "通勤者",
      "The train was full of {commuters} going to work.|scooters pedals | Most {commuters} in the city take the subway to their offices.|scooters pedals | As a {commuter}, she spends two hours a day traveling to work.",
      "scooter pedal",
    ),
    word(
      "pedal pedals pedaled pedaling",
      "to push the parts of a bicycle with your feet to make it move; one of these parts",
      "踩踏板；踏板",
      "She {pedaled} hard up the hill on her bike.|navigated carpooled | You {pedal} a bicycle with your feet. | He was {pedaling} so fast that his legs hurt.|navigating carpooling",
      "navigate carpool",
    ),
    word(
      "carpool carpools carpooled carpooling",
      "to share a car journey with others who are going to the same place; a group that does this",
      "拼车；合伙用车",
      "Four parents {carpool}, taking turns to drive the children to school. | We {carpooled} with our neighbors to save money on gas.|navigated pedaled | {Carpooling} lanes are only for cars with two or more people.|navigating pedaling",
      "navigate pedal",
      "ride-sharing",
    ),
    word(
      "logistics",
      "the planning and organizing of moving goods or people",
      "物流；后勤",
      "The company's {logistics} team plans every delivery. | Drones could change the {logistics} of delivering packages. | The {logistics} of moving a thousand people to a new office are complicated.",
      "infrastructure navigation",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *navigate* is to find your way, while to *pedal* is to push a bicycle with your feet. Look for words such as *without a map*, *by the sun*, *bike* or *legs* that show which one fits.",
        "*navigate* 是找路，*pedal* 是用脚踩自行车。找找 *without a map*、*by the sun*、*bike* 或 *legs* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "*Infrastructure* is the basic systems a country needs, such as roads and power, while *logistics* is the planning of moving goods or people. Check whether the meaning is about systems or about planning.",
        "*infrastructure* 是国家需要的基础系统，如道路和电力，*logistics* 是对货物或人员运送的规划。看释义说的是系统，还是规划。",
      ),
      spell: t(
        "*Self-driving*, *high-speed* and *ride-sharing* have hyphens; *carpool* and *autopilot* are each one word; *pedal* ends in -al, unlike *peddle*.",
        "*self-driving*、*high-speed* 和 *ride-sharing* 带连字符；*carpool* 和 *autopilot* 都连写成一个词；*pedal* 以 -al 结尾，和 *peddle* 不同。",
      ),
    },
    notes: `
      self-driving|taxis with nobody at the wheel;a car stopping by itself;a truck with no driver inside|self-driving means driving without a human driver; high-speed means very fast|self-driving 是自动驾驶的；high-speed 是高速的|high-speed=high-speed means very fast, not having nobody at the wheel=high-speed 是很快的，不是方向盘后没人;ride-sharing=ride-sharing means sharing a journey, but here there is no driver at all=ride-sharing 是拼车，而这里根本没有司机|self-driv · ing|self + hyphen + driving|self + 连字符 + driving
      infrastructure|roads and bridges;charging points on every street;power and water cut by a storm|infrastructure is the basic systems such as roads and power; logistics is planning how goods move|infrastructure 是基础设施；logistics 是物流|logistics=logistics is planning deliveries, not roads, bridges or charging points=logistics 是规划配送，不是道路、桥梁或充电桩;navigation=navigation is finding your way, not power and water systems=navigation 是找路，不是水电系统|in · fra · struc · ture|infra + structure|infra + structure
      high-speed|Beijing to Shanghai in four and a half hours;internet fast enough for video calls;trains at 350 kilometers an hour|high-speed means very fast; self-driving means without a driver|high-speed 是高速的；self-driving 是自动驾驶的|self-driving=self-driving means without a driver, but here the point is speed=self-driving 是无人驾驶，而这里强调的是速度;ride-sharing=ride-sharing means sharing a car, not fast internet=ride-sharing 是拼车，不是高速网络|high-speed|high + hyphen + speed|high + 连字符 + speed
      ride-sharing|strangers splitting a taxi fare;a trip to work with two neighbors;fewer cars carrying more people|ride-sharing is sharing a car journey; self-driving is driving without a driver|ride-sharing 是拼车；self-driving 是自动驾驶的|high-speed=high-speed means very fast, not splitting a fare with strangers=high-speed 是高速的，不是和陌生人分摊车费;self-driving=self-driving means with no driver, not each car carrying more people=self-driving 是无人驾驶，不是每辆车多载人|ride-shar · ing|ride + hyphen + sharing|ride + 连字符 + sharing
      scooter|electric vehicles parked everywhere;a ride to school;something rented with an app and stood on|a scooter is a small two-wheeled vehicle; a commuter is a person|scooter 是滑板车；commuter 是通勤者|commuter/commuters=a commuter is a person, not something parked, rented or stood on=commuter 是人，不能停放、租用或站在上面;pedal/pedals=a pedal is part of a bike, not something you ride to school=pedal 是自行车的一个零件，不是骑去上学的车|scoot · er|scoot + er, with a double o|scoot + er，双写 o
      autopilot|a plane flying while pilots ate;a car kept in its lane;a tired day without thinking|an autopilot flies or drives without a human; logistics is planning deliveries|autopilot 是自动驾驶仪；logistics 是物流|logistics=logistics plans deliveries, not flies a plane while pilots eat=logistics 规划配送，不会在飞行员吃饭时开飞机;infrastructure=infrastructure is roads and power, not a system keeping a car in its lane=infrastructure 是道路和电力，不是让车保持在车道内的系统|au · to · pi · lot|auto + pilot, one word|auto + pilot，连写成一个词
      navigation|a faster route found by a car;sailors using the stars;satellites replacing paper maps|navigation is finding your way; infrastructure is basic systems such as roads|navigation 是导航；infrastructure 是基础设施|infrastructure=infrastructure is roads and power, not sailors using the stars=infrastructure 是道路和电力，不是水手靠星星辨方向;logistics=logistics plans deliveries, not finding a route with satellites=logistics 规划配送，不是用卫星找路线|nav · i · ga · tion|navigate drops its e and adds -ion|navigate 去掉 e 加 -ion
      navigate|bees finding their way home;narrow streets without a map;a university's rules|to navigate is to find your way or deal with something hard; to pedal is to push bike pedals|navigate 是导航、应对；pedal 是踩踏板|pedal/pedaled=pedal means to ride a bike, not to find your way without a map=pedal 是骑车，不是不看地图找路;carpool/carpooled=carpool means to share a car, not bees finding their way or dealing with rules=carpool 是拼车，不是蜜蜂找路或应对规章|nav · i · gate|navi + gate|navi + gate
      commuter|people on a train to work;people taking the subway to offices;two hours a day traveling to work|a commuter travels to work every day; a scooter is a small vehicle|commuter 是通勤者；scooter 是滑板车|scooter/scooters=a scooter is a vehicle, not a person going to work=scooter 是交通工具，不是去上班的人;pedal/pedals=a pedal is part of a bike, not a person who spends two hours traveling=pedal 是自行车零件，不是每天花两小时通勤的人|com · mut · er|commute drops its e and adds -er|commute 去掉 e 加 -er
      pedal|riding a bike up a hill;moving a bicycle with your feet;legs that hurt from riding fast|to pedal is to push a bike's pedals; to navigate is to find your way|pedal 是踩踏板；navigate 是导航|navigate/navigated/navigating=navigate means finding your way, not pushing a bike with your feet=navigate 是找路，不是用脚踩车;carpool/carpooled/carpooling=carpool means sharing a car, not riding a bike so fast your legs hurt=carpool 是拼车，不是骑车骑到腿疼|ped · al|ped + al, not *peddle*|ped + al，不要写成 *peddle*
      carpool|parents taking turns to drive;neighbors sharing a car to save gas;lanes for cars with two or more people|to carpool is to share a car journey; to navigate is to find your way|carpool 是拼车；navigate 是导航|navigate/navigated/navigating=navigate means finding your way, not taking turns to drive children=navigate 是找路，不是轮流开车送孩子;pedal/pedaled/pedaling=pedal means riding a bike, not sharing a car with neighbors=pedal 是骑车，不是和邻居拼车|car · pool|car + pool, one word|car + pool，连写成一个词
      logistics|a team planning deliveries;how packages are delivered;moving a thousand people to an office|logistics is planning how goods or people move; infrastructure is basic systems|logistics 是物流、后勤；infrastructure 是基础设施|infrastructure=infrastructure is roads and power, not a team that plans deliveries=infrastructure 是道路和电力，不是规划配送的团队;navigation=navigation is finding your way, not organizing a move of a thousand people=navigation 是找路，不是组织一千人搬迁|lo · gis · tics|logist + ics, plural in form|logist + ics，形式上是复数
    `,
  },
});

const society = vocabularyTopic({
  id: "b2-words-tech-in-society",
  title: t("Technology in Society", "社会中的技术"),
  summary: t(
    "Dependence on phones and being dependent; accessibility and accessible design; connectivity; obsessions and being obsessed; technology that isolates; convenience, convenient and inconvenient; intrusive apps.",
    "对手机的依赖；无障碍和便于使用的设计；连接性；痴迷；使人孤立的技术；便利、方便的和不方便的；侵扰性的应用。",
  ),
  intro: t(
    "Our class tried a week without phones. Online shopping lost its **convenience**, some of us felt **isolated** from friends, and one boy admitted he was **obsessed** with checking messages. By Friday, we saw how great our **dependence** on technology is. These words help you talk about how technology affects our lives.",
    "我们班尝试了一周不用手机。网购不再 **convenience**（方便），有些同学觉得和朋友 **isolated**（隔绝）了，还有个男生承认自己 **obsessed**（痴迷）于查看消息。到周五，我们才明白自己对科技的 **dependence**（依赖）有多大。这些词帮你谈论科技如何影响我们的生活。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "dependence",
      "needing something or someone so much that you cannot manage without it",
      "依赖",
      "Our {dependence} on smartphones is growing: many of us cannot manage a day without one. | The country wants to reduce its {dependence} on imported oil. | {Dependence} on painkillers can be dangerous and hard to break.",
      "connectivity accessibility",
      "dependent",
    ),
    word(
      "dependent",
      "needing something or someone to survive or to work",
      "依赖的",
      "Many people are {dependent} on their phones and panic without them. | The town is {dependent} on tourism for jobs. | Young children are {dependent} on their parents for food and care.",
      "intrusive accessible",
      "dependence",
    ),
    word(
      "accessibility",
      "how easy something is for everyone to reach, use or understand, including disabled people",
      "无障碍；可及性",
      "The website was redesigned for {accessibility}, so blind users can read it. | Ramps improve {accessibility} for wheelchair users. | The {accessibility} of the museum for disabled visitors has improved with new lifts.",
      "connectivity dependence",
      "accessible",
    ),
    word(
      "accessible",
      "easy to reach, enter or use; easy to understand",
      "可到达的；易使用的；易懂的",
      "The station is {accessible} to wheelchair users, with lifts to every platform. | Her book makes physics {accessible} to young readers. | The island is only {accessible} by boat.",
      "dependent intrusive",
      "accessibility",
    ),
    word(
      "connectivity",
      "the ability to connect to the internet or to other computers",
      "连接性；联网能力",
      "Rural areas often have poor {connectivity}, so the internet is slow. | The new phone offers better {connectivity} underground, where signals are weak. | Wi-Fi {connectivity} on trains is improving.",
      "dependence obsession",
    ),
    word(
      "obsession obsessions",
      "a thing or a person that you think about all the time",
      "痴迷；困扰",
      "His {obsession} with video games worried his parents. | For many teenagers, checking likes has become their {obsession}. | Her greatest {obsession} is chess: she thinks about it all day.",
      "connectivity accessibility",
      "obsessed",
    ),
    word(
      "obsessed",
      "thinking about something or someone all the time",
      "着迷的；痴迷的",
      "He is {obsessed} with his phone and checks it every minute. | She became {obsessed} with fitness and goes to the gym twice a day. | Why are people so {obsessed} with celebrities?",
      "accessible convenient",
      "obsession",
    ),
    word(
      "isolate isolates isolating",
      "to separate someone from other people",
      "使孤立；隔离",
      "Spending all day online can {isolate} young people from their friends. | Doctors {isolate} patients with the virus so that it doesn't spread. | Working from home is {isolating} for some people, who miss their colleagues.|depending accessing",
      "depend access",
    ),
    word(
      "convenience",
      "being easy, useful or suitable; something that makes life easier",
      "便利；方便",
      "People shop online for {convenience}, because it saves time. | Please reply at your earliest {convenience}. | Dishwashers are a modern {convenience} that saves time.",
      "dependence obsession",
      "convenient",
    ),
    word(
      "convenient",
      "easy, useful or suitable; near and easy to reach",
      "方便的；便利的",
      "Online banking is {convenient} because you can do it from home. | The hotel is in a {convenient} spot next to the station. | Is Friday {convenient} for you? It suits me well.",
      "intrusive dependent",
      "inconvenient",
    ),
    word(
      "inconvenient",
      "causing problems or difficulties; not at a good time",
      "不方便的",
      "The train strike was very {inconvenient} for commuters, who had to find other ways to work. | Sorry, is this an {inconvenient} time? I can call back later. | It's {inconvenient} to live so far from the shops.",
      "accessible intrusive",
      "convenient",
    ),
    word(
      "intrusive",
      "entering someone's private life in an unwelcome way",
      "侵扰的；打扰的",
      "The app asks {intrusive} questions about your health and family that are none of its business. | Many people find targeted ads {intrusive}, as if someone were watching them. | Reporters were criticized for their {intrusive} photos of the grieving family.",
      "accessible convenient",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Accessible* means easy to reach or use, while *intrusive* means entering your private life. Look for words such as *wheelchair*, *by boat* or *none of its business* that show which one fits.",
        "*accessible* 是容易到达或使用的，*intrusive* 是侵扰私生活的。找找 *wheelchair*、*by boat* 或 *none of its business* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "*Connectivity* is the ability to connect to the internet, while *dependence* is needing something so much that you cannot manage without it. Check whether the meaning is about connecting or about needing.",
        "*connectivity* 是联网能力，*dependence* 是离不开某物的依赖。看释义说的是连接，还是需要。",
      ),
      spell: t(
        "*Accessibility* has a double c and a double s; *dependence* ends in -ence; *convenience* ends in -ience.",
        "*accessibility* 中双写 c 和 s；*dependence* 以 -ence 结尾；*convenience* 以 -ience 结尾。",
      ),
    },
    notes: `
      dependence|not managing a day without a phone;relying on imported oil;painkillers that are hard to stop|dependence is needing something too much; connectivity is the ability to connect|dependence 是依赖；connectivity 是连接性|connectivity=connectivity is connecting to the internet, and it does not go with *on oil* or *on painkillers*=connectivity 是联网能力，不和 *on oil* 或 *on painkillers* 搭配;accessibility=accessibility is how easy something is to use, not needing painkillers=accessibility 是易用程度，不是离不开止痛药|de · pend · ence|depend + ence|depend + ence
      dependent|people who panic without their phones;a town relying on tourism;children needing parents for food|dependent means needing something to survive or work; accessible means easy to reach|dependent 是依赖的；accessible 是容易到达的|intrusive=intrusive means entering private life, and it does not go with *on*=intrusive 是侵扰的，不和 *on* 搭配;accessible=accessible means easy to reach, not needing tourism for jobs=accessible 是容易到达的，不是靠旅游业提供工作|de · pend · ent|depend + ent|depend + ent
      accessibility|a website blind users can read;ramps for wheelchairs;lifts for disabled visitors|accessibility is how easy something is for everyone to use; connectivity is connecting to the internet|accessibility 是无障碍；connectivity 是连接性|connectivity=connectivity is about internet signals, not ramps or lifts=connectivity 关乎网络信号，不是坡道或电梯;dependence=dependence is needing something too much, not helping wheelchair users=dependence 是过度依赖，不是方便轮椅使用者|ac · ces · si · bil · i · ty|access + ibility, with a double c and a double s|access + ibility，双写 c 和 s
      accessible|lifts to every platform;physics for young readers;an island reached only by boat|accessible means easy to reach or understand; intrusive means unwelcome in private life|accessible 是可到达的、易懂的；intrusive 是侵扰的|dependent=dependent means needing something, and it goes with *on*, not *to* or *by boat*=dependent 是依赖的，搭配 *on*，不搭配 *to* 或 *by boat*;intrusive=intrusive means unwelcome in private life, not easy for wheelchair users=intrusive 是侵扰的，不是轮椅使用者方便进出|ac · ces · si · ble|access + ible|access + ible
      connectivity|slow internet in rural areas;signals underground;Wi-Fi on trains|connectivity is the ability to connect to the internet; dependence is needing something too much|connectivity 是联网能力；dependence 是依赖|dependence=dependence is needing something too much, not internet signals underground=dependence 是过度依赖，不是地下的网络信号;obsession=obsession is thinking about something all the time, not Wi-Fi on trains=obsession 是痴迷，不是火车上的 Wi-Fi|con · nec · tiv · i · ty|connective + ity, with a double n|connective + ity，双写 n
      obsession|video games that worried parents;checking likes;chess thought about all day|an obsession is something you think about all the time; connectivity is connecting to the internet|obsession 是痴迷；connectivity 是连接性|connectivity/connectivities=connectivity is connecting to the internet, not something that worries parents or fills your thoughts=connectivity 是联网能力，不会让父母担心，也不会占据你的思绪;accessibility/accessibilities=accessibility is how easy something is to use, not chess you think about all day=accessibility 是易用程度，不是整天想着的国际象棋|ob · ses · sion|obsess + ion, with a double s twice|obsess + ion，两处双写 s
      obsessed|checking a phone every minute;the gym twice a day;thinking about celebrities|obsessed means thinking about something all the time; accessible means easy to reach|obsessed 是痴迷的；accessible 是容易到达的|accessible=accessible means easy to reach, and it does not go with *with his phone*=accessible 是容易到达的，不和 *with his phone* 搭配;convenient=convenient means easy and useful, not checking something every minute=convenient 是方便的，不是每分钟都查看|ob · sessed|obsess + ed|obsess + ed
      isolate|young people cut off from friends;patients kept apart so a virus doesn't spread;people who miss their colleagues|to isolate is to separate someone from others; to depend is to need someone|isolate 是使孤立、隔离；depend 是依靠|depend/depending=depend means to need, and it goes with *on*, not separates people from friends=depend 是依靠，搭配 *on*，不是把人和朋友隔开;access/accessing=access means to reach or use, not keep patients apart=access 是进入、使用，不是把病人隔开|i · so · late|iso + late|iso + late
      convenience|online shopping that saves time;a reply when it suits you;machines that make life easier|convenience is being easy or useful; dependence is needing something too much|convenience 是便利；dependence 是依赖|dependence=dependence is needing something too much, not a reason that saves time=dependence 是过度依赖，不是省时的理由;obsession=obsession is thinking about something all the time, not a time that suits you=obsession 是痴迷，不是方便的时间|con · ven · ience|conveni + ence, ending in -ience|conveni + ence，以 -ience 结尾
      convenient|banking from home;a hotel next to the station;a day that suits you|convenient means easy, useful or suitable; intrusive means unwelcome|convenient 是方便的；intrusive 是侵扰的|intrusive=intrusive means unwelcome in private life, not easy to do from home=intrusive 是侵扰的，不是在家就能办的方便;dependent=dependent means needing something, not a day that suits you=dependent 是依赖的，不是合适的日子|con · ven · ient|conveni + ent|conveni + ent
      inconvenient|a strike that forced commuters to find other ways;a bad time to call;living far from the shops|inconvenient means causing difficulties; accessible means easy to reach|inconvenient 是不方便的；accessible 是容易到达的|accessible=accessible means easy to reach, not a strike that causes problems=accessible 是容易到达的，不是造成麻烦的罢工;intrusive=intrusive means entering private life, not living far from the shops=intrusive 是侵扰私生活，不是住得离商店远|in · con · ven · ient|in + convenient|in + convenient
      intrusive|questions that are none of an app's business;ads that feel like being watched;photos of a grieving family|intrusive means entering private life in an unwelcome way; accessible means easy to reach|intrusive 是侵扰的；accessible 是容易到达的|accessible=accessible means easy to reach or understand, not questions that are none of its business=accessible 是易懂易达的，不是多管闲事的问题;convenient=convenient means easy and useful, but these ads and photos are unwelcome=convenient 是方便的，而这些广告和照片令人反感|in · tru · sive|intrude drops de and adds -sive|intrude 去掉 de 加 -sive
    `,
  },
});

const prediction = vocabularyTopic({
  id: "b2-words-prediction",
  title: t("Prediction", "预测"),
  summary: t(
    "Predictions and projections; anticipating, foreseeing and envisaging the future; speculation; likelihood, probability and odds; likely and unlikely; uncertainty.",
    "预测和推算；预料、预见和设想未来；猜测；可能性、概率和机会；可能的和不太可能的；不确定性。",
  ),
  intro: t(
    "Before the school sports day, everyone made a **prediction**. The weather app said rain was **unlikely**, and our teacher said the **odds** of our class winning were low. Against all expectations, we won. These words help you talk about the future and how sure you are about it.",
    "学校运动会前，每个人都做了 **prediction**（预测）。天气应用说下雨的可能 **unlikely**（不太可能），老师说我们班获胜的 **odds**（胜算）很低。出乎所有人的预料，我们赢了。这些词帮你谈论未来，以及你对它有多大把握。",
  ),
  prerequisites: ["b2-words-the-future"],
  words: [
    word(
      "prediction predictions",
      "a statement about what will happen in the future",
      "预测；预言",
      "His {prediction} that the team would lose turned out correct. | Experts made {predictions} about the election, and most were wrong.|uncertainties likelihoods | The weather service's {predictions} are usually accurate.|uncertainties likelihoods",
      "uncertainty likelihood",
      "projection",
    ),
    word(
      "anticipate anticipates anticipated anticipating",
      "to expect something and prepare for it",
      "预期；预料",
      "We {anticipate} heavy traffic, so we'll leave early. | Nobody {anticipated} such a big crowd, so there weren't enough chairs.|ignored postponed | A good chess player {anticipates} the other player's moves and plans ahead.|ignores postpones",
      "ignore postpone",
      "foresee",
    ),
    word(
      "foresee foresees foresaw foreseen foreseeing",
      "to know that something will happen before it does",
      "预见；预知",
      "No one could have {foreseen} the crisis, which came without warning.|ignored postponed | She {foresaw} the problem and solved it in advance.|ignored postponed | I don't {foresee} any difficulties with the plan, so let's start.",
      "ignore postpone",
      "anticipate envisage",
    ),
    word(
      "speculation",
      "guessing about something without knowing all the facts",
      "猜测；推测",
      "There is a lot of {speculation} about who will be the next coach, but nobody knows. | The story is pure {speculation}: there is no evidence for it. | {Speculation} grew that the singer would retire, though she said nothing.",
      "probability likelihood",
    ),
    word(
      "likelihood",
      "how probable it is that something will happen",
      "可能性",
      "What is the {likelihood} of rain tomorrow? Is it high or low? | Smoking increases the {likelihood} of getting cancer. | In all {likelihood}, the meeting will be canceled.",
      "speculation uncertainty",
      "probability",
    ),
    word(
      "probability probabilities",
      "how likely something is to happen, often as a number",
      "概率；可能性",
      "The {probability} of throwing a six is one in six. | There is a high {probability} that prices will rise. | In math class, we calculated {probabilities} with dice.|speculations uncertainties",
      "speculation uncertainty",
      "likelihood odds",
    ),
    word(
      "unlikely",
      "not probable; not expected to happen",
      "不太可能的",
      "It's {unlikely} to rain today; the sky is completely clear. | He is {unlikely} to win, because he has never won a race. | In the {unlikely} event of a fire, use the stairs.",
      "likely certain",
    ),
    word(
      "likely",
      "probable; expected to happen",
      "可能的",
      "It's {likely} to rain later; look at those dark clouds. | She is the most {likely} person to get the job: she has the most experience. | Prices are {likely} to rise again next year, as they have every year.",
      "unlikely uncertain",
    ),
    word(
      "uncertainty uncertainties",
      "a situation in which something is not known or not sure",
      "不确定性",
      "There is great {uncertainty} about the future of the company: nobody knows what will happen. | The {uncertainties} of war made people afraid.|likelihoods probabilities | After weeks of {uncertainty}, the results were finally announced.",
      "likelihood probability",
    ),
    word(
      "envisage envisages envisaged envisaging",
      "to imagine what will happen or what something will be like in the future",
      "设想；展望",
      "The architects {envisage} a city with no cars, full of parks. | I can't {envisage} living anywhere else; this is home. | The plan {envisages} a future with ten new schools by 2035.|ignores postpones",
      "ignore postpone",
      "foresee",
    ),
    word(
      "projection projections",
      "a calculation of what will probably happen, based on what is happening now",
      "预测；推算",
      "Population {projections} based on current trends show the city doubling in size.|speculations uncertainties | Sales were higher than the {projection} the team had calculated. | The {projections}, based on today's data, suggest that sea levels will rise.|speculations uncertainties",
      "speculation uncertainty",
      "prediction",
    ),
    word(
      "odds",
      "how likely something is, often expressed as a ratio",
      "可能性；胜算",
      "The {odds} of winning the lottery are tiny: about one in fifty million. | Against all the {odds}, the small team won the cup. | What are the {odds} that he'll be late again?",
      "speculation uncertainty",
      "probability",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Likely* means something will probably happen, while *unlikely* means it probably will not. Look for clues such as *dark clouds*, *the sky is completely clear* or *has never won* that show which one fits.",
        "*likely* 是很可能发生，*unlikely* 是不太可能发生。找找 *dark clouds*、*the sky is completely clear* 或 *has never won* 这类线索，判断该用哪个。",
      ),
      meaning: t(
        "*Speculation* is guessing without the facts, while *uncertainty* is not knowing what will happen. Check whether the meaning is about guessing or about not being sure.",
        "*speculation* 是缺乏事实依据的猜测，*uncertainty* 是不知道会发生什么。看释义说的是猜测，还是没把握。",
      ),
      spell: t(
        "*Envisage* ends in -age; *foresee* keeps the e of fore-, with the past forms *foresaw* and *foreseen*; *likelihood* is likeli + hood.",
        "*envisage* 以 -age 结尾；*foresee* 保留 fore- 的 e，过去式和过去分词是 *foresaw* 和 *foreseen*；*likelihood* 由 likeli + hood 组成。",
      ),
    },
    notes: `
      prediction|a claim the team would lose;statements about an election;weather forecasts|a prediction is a statement about the future; uncertainty is not knowing|prediction 是预测；uncertainty 是不确定性|uncertainty/uncertainties=uncertainty is not knowing, not something you make that turns out correct=uncertainty 是不确定，不是你做出且被证实正确的东西;likelihood/likelihoods=likelihood is how probable something is, and you do not *make likelihoods*=likelihood 是可能性，不能说 *make likelihoods*|pre · dic · tion|predict + ion|predict + ion
      anticipate|leaving early because of traffic;not enough chairs for a crowd;planning ahead in chess|to anticipate is to expect and prepare; to ignore is to pay no attention|anticipate 是预料；ignore 是忽视|ignore/ignored/ignores=ignore means to pay no attention, but here people prepare by leaving early or planning ahead=ignore 是不理会，而这里人们提前出发或预先筹划;postpone/postponed/postpones=postpone means to delay, not expect traffic or a crowd=postpone 是推迟，不是预料交通拥堵或人群|an · tic · i · pate|anti + cipate|anti + cipate
      foresee|a crisis that came without warning;a problem solved in advance;no difficulties expected|to foresee is to know something will happen before it does; to postpone is to delay|foresee 是预见；postpone 是推迟|ignore/ignored=ignore means to pay no attention, not to solve a problem in advance=ignore 是不理会，不是提前解决问题;postpone/postponed=postpone means to delay, not to know a crisis was coming=postpone 是推迟，不是预知危机|fore · see|fore + see; foresaw, foreseen|fore + see；过去式 foresaw，过去分词 foreseen
      speculation|guesses about the next coach;a story with no evidence;rumors that a singer would retire|speculation is guessing without the facts; probability is how likely something is|speculation 是猜测；probability 是概率|probability=probability is how likely something is, not a story with no evidence=probability 是可能性大小，不是毫无证据的传闻;likelihood=likelihood is how probable something is, not guesses about who the coach will be=likelihood 是可能性，不是对教练人选的猜测|spec · u · la · tion|speculate drops its e and adds -ion|speculate 去掉 e 加 -ion
      likelihood|a high or low chance of rain;a raised chance of cancer;a meeting that will probably be canceled|likelihood is how probable something is; speculation is guessing|likelihood 是可能性；speculation 是猜测|speculation=speculation is guessing, not a chance that is high or low=speculation 是猜测，不是高或低的可能性;uncertainty=uncertainty is not knowing, and there is no *in all uncertainty*=uncertainty 是不确定，没有 *in all uncertainty* 的说法|like · li · hood|likely changes y to i and adds -hood|likely 的 y 变 i 加 -hood
      probability|one in six for a six;a high chance prices will rise;dice in math class|probability is how likely something is, often as a number; uncertainty is not knowing|probability 是概率；uncertainty 是不确定性|speculation/speculations=speculation is guessing, not a number such as one in six=speculation 是猜测，不是像六分之一这样的数字;uncertainty/uncertainties=uncertainty is not knowing, not something you calculate with dice=uncertainty 是不确定，不是用骰子计算出来的|prob · a · bil · i · ty|probable drops -le and adds -ility|probable 去掉 -le 加 -ility
      unlikely|a clear sky with no rain;a runner who has never won;a fire that probably won't happen|unlikely means not expected to happen; likely means expected|unlikely 是不太可能的；likely 是可能的|likely=likely means expected, but the sky is clear and he has never won=likely 是很可能，而天空晴朗，他也从没赢过;certain=certain means sure to happen, but a clear sky makes rain improbable=certain 是一定会，而晴空意味着不太会下雨|un · like · ly|un + likely|un + likely
      likely|dark clouds before rain;the candidate with the most experience;prices that rise every year|likely means expected to happen; unlikely means not expected|likely 是可能的；unlikely 是不太可能的|unlikely=unlikely means not expected, but dark clouds and past years point the other way=unlikely 是不太可能，而乌云和往年的情况恰恰相反;uncertain=uncertain means not sure, but here there are clear signs=uncertain 是不确定，而这里有明显迹象|like · ly|like + ly|like + ly
      uncertainty|nobody knowing a company's future;the fears of war;weeks of waiting for results|uncertainty is not knowing; likelihood is how probable something is|uncertainty 是不确定性；likelihood 是可能性|likelihood/likelihoods=likelihood is how probable something is, not weeks of not knowing=likelihood 是可能性，不是数周的不确定;probability/probabilities=probability is a number, not the fears that made people afraid=probability 是一个数字，不是让人害怕的未知|un · cer · tain · ty|un + certain + ty|un + certain + ty
      envisage|a city with no cars;a home you cannot imagine leaving;schools planned for 2035|to envisage is to imagine the future; to ignore is to pay no attention|envisage 是设想；ignore 是忽视|ignore/ignores=ignore means to pay no attention, not to picture a city full of parks=ignore 是不理会，不是设想满是公园的城市;postpone/postpones=postpone means to delay, not to imagine a future=postpone 是推迟，不是设想未来|en · vis · age|en + vis + age, ending in -age|en + vis + age，以 -age 结尾
      projection|a population doubling based on trends;sales above a calculated figure;sea levels from today's data|a projection is a calculation based on today's facts; speculation is guessing|projection 是推算；speculation 是猜测|speculation/speculations=speculation has no facts, but here the figures come from data and trends=speculation 没有事实依据，而这里的数字来自数据和趋势;uncertainty/uncertainties=uncertainty is not knowing, not a figure the team calculated=uncertainty 是不确定，不是团队算出的数字|pro · jec · tion|project + ion|project + ion
      odds|one in fifty million for the lottery;a small team that won anyway;how likely he is to be late|odds are how likely something is, as a ratio; speculation is guessing|odds 是可能性、胜算；speculation 是猜测|speculation=speculation is guessing, and you cannot say *against all speculation*=speculation 是猜测，不能说 *against all speculation*;uncertainty=uncertainty is not knowing, not a ratio such as one in fifty million=uncertainty 是不确定，不是五千万分之一这样的比例|odds|odd + s, always plural|odd + s，总是复数
    `,
  },
});

const making = vocabularyTopic({
  id: "b2-words-making-things",
  title: t("From Idea to Product", "从创意到产品"),
  summary: t(
    "Blueprints and specifications; feasible plans and feasibility; iterating and refining a design; commercializing it; components, assembling and assembly; mechanisms; ingenious ideas.",
    "蓝图和规格；可行的计划和可行性；迭代和完善设计；将其商业化；零部件、组装和装配；机制；巧妙的想法。",
  ),
  intro: t(
    "For our design project, we drew a **blueprint** of a bird feeder, checked that it was **feasible** with the wood we had, and **assembled** it from twenty parts. Then we **refined** it twice so that squirrels could not get in. These words help you talk about designing and making things.",
    "在设计课项目里，我们画了鸟食器的 **blueprint**（设计图），确认用手头的木料是 **feasible**（可行的），再用二十个零件把它 **assembled**（组装）起来。之后我们又 **refined**（改进）了两次，让松鼠钻不进去。这些词帮你谈论设计和制作东西。",
  ),
  prerequisites: ["b1-words-research-and-design"],
  words: [
    word(
      "blueprint blueprints",
      "a detailed plan for a building or a machine; a plan for achieving something",
      "蓝图；规划",
      "The architect showed us the {blueprints}, the detailed drawings for the new library.|components mechanisms | The report offers a {blueprint} for cutting crime, a step-by-step plan. | Engineers studied the {blueprint}, a drawing of every part, before building the engine.",
      "component mechanism",
      "specification",
    ),
    word(
      "specification specifications",
      "a detailed description of how something should be made or what it must do",
      "规格；说明书",
      "The phone was built to exact {specifications}, written down before work began.|components mechanisms | The technical {specifications} list the screen size and battery life.|components mechanisms | The bridge doesn't meet the safety {specifications} written by the government.|components mechanisms",
      "component mechanism",
      "blueprint",
    ),
    word(
      "feasible",
      "possible and practical to do",
      "可行的",
      "Is it {feasible} to build a bridge across the bay, or is it impossible? | The plan is technically {feasible}: it can be done, but it is too expensive. | It isn't {feasible} to finish by Friday; we need another week.",
      "ingenious compatible",
      "feasibility",
    ),
    word(
      "feasibility",
      "how possible and practical something is",
      "可行性",
      "They did a {feasibility} study to see if the airport was possible. | We doubt the {feasibility} of the plan: it may be impossible. | Engineers are testing the {feasibility} of a tunnel under the sea, to see whether it can be built.",
      "assembly mechanism",
      "feasible",
    ),
    word(
      "iterate iterates iterated iterating",
      "to repeat a process, improving it each time",
      "迭代；反复",
      "The team {iterates} quickly, releasing a new, better version every week.|assembles commercializes | We {iterated} on the design ten times before it was right.|assembled commercialized | Good designers keep {iterating}, testing and improving, until users are happy.|assembling commercializing",
      "assemble commercialize",
      "refine",
    ),
    word(
      "refine refines refined refining",
      "to improve something by making small changes; to make a substance pure",
      "完善；提炼",
      "She {refined} her essay until every sentence was clear.|assembled commercialized | Oil is {refined} to make gasoline, removing everything impure.|assembled commercialized | The engineers are {refining} the design, making small changes to make it lighter.|assembling commercializing",
      "assemble commercialize",
      "iterate",
    ),
    word(
      "commercialize commercializes commercialized commercializing",
      "to sell something to make a profit; to make something more about money",
      "使商业化",
      "The university hopes to {commercialize} its new battery by selling it to car makers. | Christmas has become very {commercialized}, all about spending money.|criticized colonized | The company took ten years to {commercialize} the invention and bring it to shops.",
      "criticize colonize",
    ),
    word(
      "component components",
      "one of the parts that a machine or system is made of",
      "部件；组成部分",
      "The factory makes {components}, such as brakes and lights, for cars.|blueprints specifications | Trust is a key {component} of any friendship. | The phone has over a thousand {components}, from tiny chips to screws.|blueprints specifications",
      "blueprint specification",
      "mechanism",
    ),
    word(
      "assemble assembles assembled assembling",
      "to put the parts of something together; to come together in one place",
      "组装；集合",
      "You {assemble} the furniture yourself, putting the pieces together. | A crowd {assembled} outside the palace.|iterated commercialized | Robots are {assembling} the cars, fitting each part in place.|iterating commercializing",
      "iterate commercialize",
      "assembly",
    ),
    word(
      "assembly assemblies",
      "putting the parts of something together; a meeting of many people",
      "装配；集会",
      "The cars move along the {assembly} line as workers add parts. | Every Monday morning, the whole school meets for {assembly} in the hall. | Easy {assembly}: no tools needed to put it together.",
      "feasibility specification",
      "assemble",
    ),
    word(
      "mechanism mechanisms",
      "the parts of a machine that work together; a way of doing something",
      "机械装置；机制",
      "The clock's {mechanism} is made of tiny gears that work together. | The government needs a {mechanism}, a working system, for handling complaints. | The lock has a simple {mechanism} of springs inside.",
      "feasibility blueprint",
      "component",
    ),
    word(
      "ingenious",
      "very clever and original",
      "巧妙的；有独创性的",
      "The {ingenious} little robot can climb walls like a gecko. | He found a really {ingenious} way to fix the leak with a balloon. | The {ingenious} design folds into a small box.",
      "feasible compatible",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "To *refine* is to improve something with small changes, while to *assemble* is to put parts together. Look for words such as *until every sentence was clear*, *lighter* or *the pieces together* that show which one fits.",
        "*refine* 是通过细小改动来完善，*assemble* 是把零件组装起来。找找 *until every sentence was clear*、*lighter* 或 *the pieces together* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "*Feasible* means possible and practical, while *ingenious* means very clever and original. Check whether the meaning is about being possible or about being clever.",
        "*feasible* 是可行的，*ingenious* 是巧妙独到的。看释义说的是能不能做，还是聪不聪明。",
      ),
      spell: t(
        "*Commercialize* has a double m; *ingenious* ends in -ious, unlike *ingenuous*; *feasible* ends in -ible.",
        "*commercialize* 双写 m；*ingenious* 以 -ious 结尾，和 *ingenuous* 不同；*feasible* 以 -ible 结尾。",
      ),
    },
    notes: `
      blueprint|drawings for a new library;a step-by-step plan for cutting crime;a drawing of every part of an engine|a blueprint is a detailed plan or drawing; a component is one part|blueprint 是蓝图；component 是部件|component/components=a component is one part of a machine, not a drawing or a plan=component 是机器的一个部件，不是图纸或计划;mechanism/mechanisms=a mechanism is working parts, not a plan for cutting crime=mechanism 是运转的部件，不是减少犯罪的计划|blue · print|blue + print, one word|blue + print，连写成一个词
      specification|exact details written before work began;a list of screen size and battery life;safety rules a bridge must meet|a specification is a detailed description of what something must be; a component is a part|specification 是规格；component 是部件|component/components=a component is a part, not a written list of screen size and battery life=component 是零件，不是写着屏幕尺寸和电池续航的清单;mechanism/mechanisms=a mechanism is working parts, not safety rules written by a government=mechanism 是运转的部件，不是政府制定的安全标准|spec · i · fi · ca · tion|specify changes y to i and adds -cation|specify 的 y 变 i 加 -cation
      feasible|a bridge that is possible or impossible;a plan that can be done;a deadline that needs another week|feasible means possible and practical; ingenious means very clever|feasible 是可行的；ingenious 是巧妙的|ingenious=ingenious means clever, but here the question is whether it can be done=ingenious 是巧妙的，而这里的问题是能不能做到;compatible=compatible means able to work together, not able to finish by Friday=compatible 是兼容的，不是能否在周五前完成|fea · si · ble|feas + ible, ending in -ible|feas + ible，以 -ible 结尾
      feasibility|a study to see if an airport was possible;a plan that may be impossible;whether a tunnel can be built|feasibility is how possible something is; a mechanism is working parts|feasibility 是可行性；mechanism 是机械装置|assembly=assembly is putting parts together, not checking if something is possible=assembly 是组装，不是检查能否实现;mechanism=a mechanism is working parts, not whether a plan may be impossible=mechanism 是运转的部件，不是计划是否可行|fea · si · bil · i · ty|feasible drops -le and adds -ility|feasible 去掉 -le 加 -ility
      iterate|a better version every week;ten rounds of design;testing and improving until users are happy|to iterate is to repeat a process and improve it each time; to assemble is to put parts together|iterate 是迭代；assemble 是组装|assemble/assembled/assembles/assembling=assemble puts parts together once, not repeats and improves each time=assemble 是组装零件，不是一遍遍改进;commercialize/commercialized/commercializes/commercializing=commercialize means to sell for profit, not test and improve until users are happy=commercialize 是推向市场赚钱，不是反复测试改进|it · er · ate|iter + ate|iter + ate
      refine|an essay made clearer;oil made into gasoline;small changes to make a design lighter|to refine is to improve with small changes or make pure; to assemble is to put together|refine 是完善、提炼；assemble 是组装|assemble/assembled/assembling=assemble puts parts together, not makes sentences clearer or oil pure=assemble 是组装，不是让句子更清楚或让石油更纯;commercialize/commercialized/commercializing=commercialize means to sell for profit, not to remove what is impure=commercialize 是商业化，不是去除杂质|re · fine|re + fine|re + fine
      commercialize|a battery sold to car makers;a holiday all about spending;an invention brought to shops|to commercialize is to sell something for profit; to criticize is to say what is wrong|commercialize 是商业化；criticize 是批评|criticize/criticized=criticize means to say what is wrong, not to make Christmas all about money=criticize 是批评，不是让圣诞节只关乎花钱;colonize/colonized=colonize means to settle a place, not to sell a battery or bring an invention to shops=colonize 是殖民，不是出售电池或把发明推向商店|com · mer · cial · ize|commercial + ize, with a double m|commercial + ize，双写 m
      component|brakes and lights made for cars;a key part of friendship;a thousand parts from chips to screws|a component is one part of a machine or system; a blueprint is a plan|component 是部件；blueprint 是蓝图|blueprint/blueprints=a blueprint is a plan, not brakes, lights, chips or screws=blueprint 是图纸，不是刹车、车灯、芯片或螺丝;specification/specifications=a specification is a written description, not a part such as a brake=specification 是书面规格，不是刹车这样的零件|com · po · nent|com + ponent|com + ponent
      assemble|furniture put together at home;a crowd outside a palace;robots fitting car parts|to assemble is to put parts together or come together; to iterate is to repeat and improve|assemble 是组装、集合；iterate 是迭代|iterate/iterated/iterating=iterate means to repeat and improve, not a crowd gathering outside a palace=iterate 是迭代改进，不是人群聚集在宫殿外;commercialize/commercialized/commercializing=commercialize means to sell for profit, not fit each part in place=commercialize 是商业化，不是把零件装到位|as · sem · ble|as + semble, with a double s|as + semble，双写 s
      assembly|a factory line where workers add parts;a school meeting in the hall;putting something together without tools|assembly is putting parts together or a meeting; feasibility is how possible something is|assembly 是装配、集会；feasibility 是可行性|feasibility=feasibility is how possible something is, not a line where workers add parts or a school meeting=feasibility 是可行性，不是工人加装零件的流水线或学校集会;specification=a specification is a written description, not putting something together=specification 是书面规格，不是组装|as · sem · bly|assemble drops -le and adds -ly|assemble 去掉 -le 加 -ly
      mechanism|tiny gears in a clock;a working system for complaints;springs inside a lock|a mechanism is working parts or a way of doing something; a blueprint is a plan|mechanism 是机械装置、机制；blueprint 是蓝图|feasibility=feasibility is how possible something is, not gears or springs=feasibility 是可行性，不是齿轮或弹簧;blueprint=a blueprint is a drawing, not a working system or springs inside a lock=blueprint 是图纸，不是运转的系统或锁里的弹簧|mech · a · nism|mechan + ism, with ch said "k"|mechan + ism，ch 读作 "k"
      ingenious|a robot that climbs like a gecko;a leak fixed with a balloon;a design that folds into a box|ingenious means very clever and original; feasible means possible|ingenious 是巧妙的；feasible 是可行的|feasible=feasible means possible, but here the point is how clever and original something is=feasible 是可行的，而这里强调的是巧妙新颖;compatible=compatible means able to work together, not a clever way to fix a leak=compatible 是兼容的，不是修漏水的妙招|in · gen · ious|ingeni + ous, unlike *ingenuous*|ingeni + ous，和 *ingenuous* 不同
    `,
  },
});

const networks = vocabularyTopic({
  id: "b2-words-networks",
  title: t("Networks", "网络"),
  summary: t(
    "Telecommunications and broadband; transmitting signals and transmission; frequencies and antennas; streaming and latency; servers, databases and interfaces; compatible devices.",
    "电信和宽带；发送信号和传输；频率和天线；流媒体和延迟；服务器、数据库和界面；兼容的设备。",
  ),
  intro: t(
    "When our village got **broadband**, everything changed. My brother started **streaming** games, though he complains about **latency**, and my mother stores her shop's records in a **database** on a **server** far away. These words help you talk about networks and how information travels.",
    "我们村通了 **broadband**（宽带）以后，一切都变了。我哥哥开始 **streaming**（直播）打游戏，虽然他总抱怨 **latency**（延迟）；我妈妈把店里的记录存在远方某台 **server**（服务器）上的 **database**（数据库）里。这些词帮你谈论网络以及信息如何传输。",
  ),
  prerequisites: ["b1-words-gadgets"],
  words: [
    word(
      "telecommunications",
      "sending information over long distances by phone, radio, the internet and so on",
      "电信",
      "She works for a {telecommunications} company that builds phone networks. | The storm cut {telecommunications} across the region, so no one could call for help. | Modern {telecommunications}, such as phones and the internet, changed how the world does business.",
      "latency streaming",
    ),
    word(
      "broadband",
      "a fast connection to the internet",
      "宽带",
      "Every home in the village now has {broadband}, so everyone can get online fast. | We pay for {broadband} by the month. | Fast {broadband} lets you watch films without waiting.",
      "latency frequency",
    ),
    word(
      "transmit transmits transmitted transmitting",
      "to send a signal, a message or a disease from one place or person to another",
      "传输；传播",
      "The match was {transmitted} live around the world by satellite.|refined iterated | Mosquitoes {transmit} malaria from one person to another. | The satellite is {transmitting} pictures of the storm back to Earth.|refining iterating",
      "refine iterate",
      "transmission",
    ),
    word(
      "transmission",
      "sending out a signal or a program; passing a disease from one to another",
      "传输；播送；传播",
      "The TV {transmission} of the match was cut off by the storm. | Masks reduce the {transmission} of the virus from person to person. | Radio {transmission} from the ship stopped at midnight, and nobody heard from it again.",
      "latency interface",
      "transmit",
    ),
    word(
      "frequency frequencies",
      "the rate at which something happens; the rate at which a radio wave repeats",
      "频率；频繁",
      "The station broadcasts on a {frequency} of 98.6 MHz. | Storms are increasing in {frequency}: they happen more often now. | Dogs can hear sounds at very high {frequencies}.|latencies antennas",
      "latency antenna",
    ),
    word(
      "antenna antennas",
      "a wire or a rod that sends or receives radio signals",
      "天线",
      "The car's {antenna} picks up radio signals. | Phone {antennas} stand on top of the building.|servers databases | Move the {antenna} for a clearer radio signal.",
      "server database",
    ),
    word(
      "streaming",
      "watching or listening to video or music online without downloading it",
      "流媒体；在线播放",
      "Most people watch films on {streaming} services now. | {Streaming} has replaced CDs for most music fans. | Live {streaming} of the concert was watched by millions.",
      "latency frequency",
    ),
    word(
      "latency",
      "the delay before data arrives after it is sent",
      "延迟",
      "Online gamers want low {latency}, because every millisecond of delay counts. | High {latency} makes video calls freeze and lag. | The new network cuts {latency}, the delay, to almost zero.",
      "frequency broadband",
    ),
    word(
      "server servers",
      "a computer that stores data and runs programs for other computers on a network",
      "服务器",
      "The website crashed because the {server} was overloaded. | The company's {servers}, computers that store its data, are in a cold building in the north.|antennas interfaces | All the emails are stored on the {server}.",
      "antenna interface",
      "database",
    ),
    word(
      "database databases",
      "a large store of information kept on a computer",
      "数据库",
      "The police checked his fingerprints against their {database}. | The library has a {database} of old newspapers. | Hackers stole names from the customer {database}.",
      "antenna interface",
      "server",
    ),
    word(
      "interface interfaces",
      "the way a user works with a computer program; a point where two things meet",
      "界面；接口",
      "The app has a clean, simple {interface} with big buttons. | The new {interface}, with clearer menus, is much easier to use. | Voice {interfaces} let you control the TV by speaking.|antennas servers",
      "antenna server",
    ),
    word(
      "compatible",
      "able to work together; able to live or work together without problems",
      "兼容的；合得来的",
      "Is this charger {compatible} with my phone? | The software isn't {compatible} with older computers. | They broke up because they weren't {compatible}.",
      "feasible ingenious",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Latency* is the delay before data arrives, while *frequency* is how often something happens or the rate of a radio wave. Look for words such as *delay*, *millisecond*, *MHz* or *more often* that show which one fits.",
        "*latency* 是数据到达前的延迟，*frequency* 是发生的频繁程度或无线电波的频率。找找 *delay*、*millisecond*、*MHz* 或 *more often* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "A *server* is a computer that stores data and runs programs for others, while an *interface* is the way a user works with a program. Check whether the meaning is about a machine or about what the user sees.",
        "*server* 是为其他计算机存储数据、运行程序的计算机，*interface* 是用户操作程序的界面。看释义说的是机器，还是用户看到的东西。",
      ),
      spell: t(
        "*Telecommunications* has a double m; *antenna* has a double n; *compatible* ends in -ible.",
        "*telecommunications* 双写 m；*antenna* 双写 n；*compatible* 以 -ible 结尾。",
      ),
    },
    notes: `
      telecommunications|a company building phone networks;calls cut by a storm;phones and the internet changing business|telecommunications is sending information over long distances; streaming is watching online|telecommunications 是电信；streaming 是流媒体|latency=latency is a delay, not a company that builds phone networks=latency 是延迟，不是建电话网络的公司;streaming=streaming is watching video online, not the phone lines a storm cut=streaming 是在线看视频，不是被风暴切断的通信|tel · e · com · mu · ni · ca · tions|tele + communications, with a double m|tele + communications，双写 m
      broadband|fast internet in every village home;a monthly internet bill;films without waiting|broadband is a fast internet connection; latency is a delay|broadband 是宽带；latency 是延迟|latency=latency is a delay, and you do not pay for it by the month=latency 是延迟，你不会按月为它付费;frequency=frequency is how often something happens, not a fast connection at home=frequency 是频率，不是家里的高速网络|broad · band|broad + band, one word|broad + band，连写成一个词
      transmit|a match sent live by satellite;malaria passed between people;pictures sent back to Earth|to transmit is to send a signal or pass on a disease; to refine is to improve|transmit 是传输、传播；refine 是完善|refine/refined/refining=refine means to improve with small changes, not send a match live by satellite=refine 是细致改进，不是通过卫星直播比赛;iterate/iterated/iterating=iterate means to repeat and improve, not send pictures of a storm=iterate 是迭代改进，不是传回风暴的照片|trans · mit|trans + mit; transmitted with a double t|trans + mit；transmitted 双写 t
      transmission|a TV signal cut by a storm;a virus passed from person to person;radio messages from a ship|transmission is sending a signal or passing on a disease; latency is a delay|transmission 是传输、传播；latency 是延迟|latency=latency is a delay, not the spread of a virus from person to person=latency 是延迟，不是病毒在人与人之间的传播;interface=an interface is what a user sees, not radio messages from a ship=interface 是用户界面，不是船上发出的无线电信号|trans · mis · sion|transmit becomes transmission, with a double s|transmit 变成 transmission，双写 s
      frequency|a radio station on 98.6 MHz;storms happening more often;very high sounds dogs can hear|frequency is how often something happens or the rate of a wave; latency is a delay|frequency 是频率；latency 是延迟|latency/latencies=latency is a delay, not a radio station's number or how often storms happen=latency 是延迟，不是电台的频率，也不是风暴发生得多频繁;antenna/antennas=an antenna is a rod for signals, not a rate in MHz=antenna 是接收信号的天线，不是以 MHz 计的频率|fre · quen · cy|frequent + cy, dropping the t|frequent 去掉 t 加 cy
      antenna|a rod on a car for radio;rods on top of a building;something moved for a clearer signal|an antenna sends or receives radio signals; a server stores data|antenna 是天线；server 是服务器|server/servers=a server is a computer that stores data, not a rod that picks up radio=server 是存储数据的计算机，不是接收广播的天线;database/databases=a database is stored information, not something that stands on top of a building=database 是存储的信息，不会立在楼顶|an · ten · na|an + tenna, with a double n|an + tenna，双写 n
      streaming|films watched on online services;music that replaced CDs;a concert watched live by millions|streaming is watching or listening online; latency is a delay|streaming 是流媒体；latency 是延迟|latency=latency is a delay, not something that replaced CDs=latency 是延迟，不能取代 CD;frequency=frequency is how often something happens, not a service you watch films on=frequency 是频率，不是看电影的服务|stream · ing|stream + ing|stream + ing
      latency|delay that matters to gamers;video calls that freeze;a delay cut to almost zero|latency is the delay before data arrives; frequency is how often something happens|latency 是延迟；frequency 是频率|frequency=frequency is how often something happens, not a millisecond of delay=frequency 是频繁程度，不是毫秒级的延迟;broadband=broadband is a fast connection, and high broadband does not make calls freeze=broadband 是高速网络，不会让视频通话卡住|la · ten · cy|latent drops its t and adds -cy|latent 去掉 t 加 -cy
      server|a computer overloaded by a website;computers storing a company's data;the place emails are stored|a server is a computer that stores data for others; an antenna sends or receives signals|server 是服务器；antenna 是天线|antenna/antennas=an antenna is a rod for radio signals, not a computer that stores data=antenna 是接收无线电信号的天线，不是存储数据的计算机;interface/interfaces=an interface is what a user sees, not where emails are stored=interface 是用户界面，不是存储邮件的地方|serv · er|serve + r|serve + r
      database|fingerprints checked by police;a store of old newspapers;customer names stolen by hackers|a database is a large store of information; an interface is what a user sees|database 是数据库；interface 是界面|antenna=an antenna picks up signals, not fingerprints or names=antenna 接收信号，不存指纹或姓名;interface=an interface is what you click on, not a store of old newspapers=interface 是你点击的界面，不是旧报纸的存储库|da · ta · base|data + base, one word|data + base，连写成一个词
      interface|big buttons in an app;clearer menus that are easier to use;controlling a TV by speaking|an interface is how a user works with a program; a server stores data|interface 是界面；server 是服务器|antenna/antennas=an antenna picks up radio, not buttons or menus=antenna 接收无线电信号，不是按钮或菜单;server/servers=a server stores data out of sight, not menus you use or a TV you speak to=server 在幕后存储数据，不是你使用的菜单或对着说话的电视|in · ter · face|inter + face|inter + face
      compatible|a charger that works with a phone;software for older computers;a couple who broke up|compatible means able to work or live together; feasible means possible|compatible 是兼容的、合得来的；feasible 是可行的|feasible=feasible means possible, and it does not go with *with my phone*=feasible 是可行的，不和 *with my phone* 搭配;ingenious=ingenious means clever, not able to live together without problems=ingenious 是巧妙的，不是相处融洽|com · pat · i · ble|compat + ible, ending in -ible|compat + ible，以 -ible 结尾
    `,
  },
});

const ethics = vocabularyTopic({
  id: "b2-words-tech-ethics",
  title: t("Technology and Ethics", "科技与伦理"),
  summary: t(
    "Accountability and being accountable; misusing technology; discriminatory algorithms; unintended effects; oversight; liability and being liable; acting ethically; manipulative and exploitative design; trustworthy systems.",
    "问责和负有责任；滥用技术；歧视性的算法；意外的后果；监督；法律责任和负有法律责任；合乎伦理地行事；操纵性的和剥削性的设计；可信赖的系统。",
  ),
  intro: t(
    "In our debate on AI, one team argued that hiring software can be **discriminatory** and that apps use **manipulative** tricks. The other team said AI can be **trustworthy** if companies are held **accountable** for it. These words help you talk about right and wrong in technology.",
    "在关于人工智能的辩论中，一队认为招聘软件可能具有 **discriminatory**（歧视性），应用程序会用 **manipulative**（操纵性的）伎俩。另一队则认为，只要公司被追究 **accountable**（责任），人工智能就可以是 **trustworthy**（值得信赖的）。这些词帮你谈论科技中的是非对错。",
  ),
  prerequisites: ["b2-words-ethics"],
  words: [
    word(
      "accountability",
      "being responsible for what you do and having to explain it",
      "问责；责任",
      "There must be {accountability} when a self-driving car kills someone: someone must answer for it. | The public demands more {accountability} from tech companies, so that they explain their decisions. | Without {accountability}, leaders can do what they like and never explain themselves.",
      "discrimination manipulation",
      "accountable liability",
    ),
    word(
      "accountable",
      "responsible for your actions and expected to explain them",
      "负有责任的",
      "Companies must be held {accountable} for their algorithms. | Who is {accountable} for this mistake? Who must explain it? | Ministers are {accountable} to parliament and must answer its questions.",
      "trustworthy manipulative",
      "liable",
    ),
    word(
      "misuse misuses misused misusing",
      "to use something in a wrong or harmful way",
      "滥用；误用",
      "The company {misused} its customers' data, selling it without asking.|modernized assembled | Some apps {misuse} your location to sell ads. | He was fired for {misusing} company money on holidays.|modernizing assembling",
      "modernize assemble",
    ),
    word(
      "discriminatory",
      "treating people unfairly because of their race, sex, age and so on",
      "歧视性的",
      "The hiring software was {discriminatory}: it rejected most women. | {Discriminatory} laws that treated people unfairly because of race were finally removed. | The bank's lending rules were {discriminatory} against older people.",
      "trustworthy accountable",
    ),
    word(
      "unintended",
      "not planned or meant",
      "非故意的；意外的",
      "Social media had {unintended} effects on teenagers' sleep that nobody planned. | The new law had {unintended} consequences that its writers never expected. | The joke caused {unintended} offense; he didn't mean to hurt anyone.",
      "trustworthy accountable",
    ),
    word(
      "oversight",
      "watching something to make sure it is done properly; a mistake made because you did not notice",
      "监督；疏忽",
      "The agency has {oversight} of the banks, checking that they follow the rules. | AI needs human {oversight} to make sure it works properly. | Leaving out her name was a simple {oversight}: nobody noticed.",
      "manipulation discrimination",
      "accountability",
    ),
    word(
      "liability liabilities",
      "legal responsibility for something; a person or thing that causes problems",
      "法律责任；累赘",
      "The company denied {liability} for the accident and refused to pay. | The driver has {liability} for the damage and must pay for it. | His bad temper is a real {liability} for the team, causing problems in every match.",
      "oversight manipulation",
      "accountability liable",
    ),
    word(
      "liable",
      "legally responsible for paying for damage or loss",
      "负有法律责任的",
      "The owner is {liable} for any damage the dog causes and must pay for it. | You may be {liable} to pay a fine. | Who is {liable} to pay if a robot hurts someone?",
      "trustworthy compatible",
      "accountable liability",
    ),
    word(
      "ethically",
      "in a way that is morally right",
      "合乎道德地",
      "Was it {ethically} right to test the drug on children? | The company promised to act {ethically}, doing what is morally right. | {Ethically}, the experiment raises serious moral questions.",
      "electrically ethnically",
    ),
    word(
      "manipulative",
      "controlling people cleverly and unfairly to get what you want",
      "操纵性的",
      "The app uses {manipulative} tricks to keep you scrolling. | Her {manipulative} boyfriend made her feel guilty to control her. | {Manipulative} ads trick children who don't know better.",
      "trustworthy accountable",
      "exploitative",
    ),
    word(
      "exploitative",
      "using people unfairly for your own advantage",
      "剥削性的",
      "The factory was accused of {exploitative} working conditions. | Some games are {exploitative}, pushing children to spend real money. | They pay workers almost nothing; it's {exploitative}.",
      "trustworthy accountable",
      "manipulative",
    ),
    word(
      "trustworthy",
      "able to be trusted",
      "值得信赖的",
      "Is this news website {trustworthy}? Its stories always check out. | We need AI that is {trustworthy} and safe. | She has always been honest and {trustworthy}.",
      "manipulative discriminatory",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Liable* means legally responsible to pay, while *trustworthy* means able to be trusted. Look for words such as *pay*, *damage* or *a fine* that show someone must pay.",
        "*liable* 是负有赔付的法律责任，*trustworthy* 是值得信赖的。找找 *pay*、*damage* 或 *a fine* 这类词，它们说明有人必须赔钱。",
      ),
      meaning: t(
        "*Oversight* is watching to make sure something is done properly, or a mistake from not noticing, while *liability* is legal responsibility. Check whether the meaning is about watching or about having to pay.",
        "*oversight* 是监督，也可指没注意到造成的疏忽；*liability* 是法律责任。看释义说的是监督，还是要承担赔偿。",
      ),
      spell: t(
        "*Accountability* has a double c; *discriminatory* ends in -atory; *exploitative* ends in -ative.",
        "*accountability* 双写 c；*discriminatory* 以 -atory 结尾；*exploitative* 以 -ative 结尾。",
      ),
    },
    notes: `
      accountability|someone answering for a car crash;companies explaining decisions;leaders who must explain themselves|accountability is being responsible and having to explain; manipulation is controlling people unfairly|accountability 是问责；manipulation 是操纵|discrimination=discrimination is treating people unfairly, not having to answer for a crash=discrimination 是歧视，不是要为事故负责;manipulation=manipulation is controlling people, but the public wants companies to explain themselves=manipulation 是操纵人，而公众要的是公司做出解释|ac · count · a · bil · i · ty|accountable drops -le and adds -ility|accountable 去掉 -le 加 -ility
      accountable|companies held responsible for algorithms;who must explain a mistake;ministers answering parliament|accountable means responsible and expected to explain; trustworthy means able to be trusted|accountable 是负有责任的；trustworthy 是值得信赖的|trustworthy=trustworthy means honest, and you cannot be *held trustworthy* or *trustworthy to parliament*=trustworthy 是可信的，不能说 *held trustworthy* 或 *trustworthy to parliament*;manipulative=manipulative means controlling people, not answering questions=manipulative 是操纵人的，不是回答质询|ac · count · a · ble|account + able|account + able
      misuse|data sold without asking;location used to sell ads;company money spent on holidays|to misuse is to use something wrongly; to modernize is to make it modern|misuse 是滥用；modernize 是使现代化|modernize/modernized/modernizing=modernize means to make modern, not to sell data without asking or spend money on holidays=modernize 是使现代化，不是擅自出售数据或拿公款度假;assemble/assembled/assembling=assemble means to put parts together, not to use a location to sell ads=assemble 是组装，不是利用位置信息卖广告|mis · use|mis + use|mis + use
      discriminatory|software that rejected women;laws unfair because of race;rules against older people|discriminatory means treating people unfairly because of who they are; trustworthy means reliable|discriminatory 是歧视性的；trustworthy 是值得信赖的|trustworthy=trustworthy means able to be trusted, not rejecting most women=trustworthy 是可信的，不会拒绝大多数女性;accountable=accountable means responsible, not unfair to older people=accountable 是负有责任的，不是对老年人不公|dis · crim · i · na · to · ry|discriminate drops its e and adds -ory|discriminate 去掉 e 加 -ory
      unintended|effects nobody planned;consequences nobody expected;offense he didn't mean|unintended means not planned; trustworthy means able to be trusted|unintended 是意外的；trustworthy 是值得信赖的|trustworthy=trustworthy means reliable, not effects nobody planned=trustworthy 是可靠的，不是没人计划过的影响;accountable=accountable means responsible, not offense he did not mean=accountable 是负有责任的，不是无意造成的冒犯|un · in · tend · ed|un + intended|un + intended
      oversight|an agency checking banks;humans watching AI;a name left out by mistake|oversight is watching to check, or a mistake from not noticing; manipulation is controlling people|oversight 是监督、疏忽；manipulation 是操纵|manipulation=manipulation is controlling people unfairly, not checking that banks follow rules=manipulation 是不正当地控制人，不是检查银行是否守规;discrimination=discrimination is unfair treatment, not a name nobody noticed was missing=discrimination 是歧视，不是没注意到漏了名字|o · ver · sight|over + sight, one word|over + sight，连写成一个词
      liability|refusing to pay for an accident;a driver who must pay for damage;a temper that causes problems|liability is legal responsibility or something that causes problems; oversight is watching|liability 是法律责任、累赘；oversight 是监督|oversight=oversight is watching or a small mistake, not responsibility to pay for damage=oversight 是监督或疏忽，不是赔偿损失的责任;manipulation=manipulation is controlling people, not something a company refuses to pay for=manipulation 是操纵人，不是公司拒绝赔付的东西|li · a · bil · i · ty|liable drops -le and adds -ility|liable 去掉 -le 加 -ility
      liable|a dog owner who must pay;a fine you may have to pay;paying if a robot hurts someone|liable means legally responsible to pay; trustworthy means reliable|liable 是负有法律责任的；trustworthy 是值得信赖的|trustworthy=trustworthy means able to be trusted, not having to pay for damage=trustworthy 是可信的，不是必须赔偿损失;compatible=compatible means able to work together, not having to pay a fine=compatible 是兼容的，不是必须交罚款|li · a · ble|li + able|li + able
      ethically|testing a drug on children;acting in a morally right way;moral questions about an experiment|ethically means in a morally right way; ethnically is about race|ethically 是合乎道德地；ethnically 与种族有关|electrically=electrically is about electricity, not whether testing on children is right=electrically 与电有关，不是在儿童身上试药是否正当;ethnically=ethnically is about race and culture, not doing what is morally right=ethnically 与种族文化有关，不是做道德上正确的事|eth · i · cal · ly|ethical + ly, with th|ethical + ly，有 th
      manipulative|tricks to keep you scrolling;a boyfriend who used guilt to control;ads that trick children|manipulative means controlling people unfairly; trustworthy means reliable|manipulative 是操纵性的；trustworthy 是值得信赖的|trustworthy=trustworthy means honest, not tricks to keep you scrolling=trustworthy 是可信的，不是让你停不下来的伎俩;accountable=accountable means responsible, not using guilt to control someone=accountable 是负有责任的，不是用愧疚感控制别人|ma · nip · u · la · tive|manipulate drops its e and adds -ive|manipulate 去掉 e 加 -ive
      exploitative|unfair factory conditions;games pushing children to spend;workers paid almost nothing|exploitative means using people unfairly for gain; trustworthy means reliable|exploitative 是剥削性的；trustworthy 是值得信赖的|trustworthy=trustworthy means able to be trusted, not paying workers almost nothing=trustworthy 是可信的，不是几乎不给工人工资;accountable=accountable means responsible, not pushing children to spend real money=accountable 是负有责任的，不是诱导孩子花真钱|ex · ploit · a · tive|exploit + ative|exploit + ative
      trustworthy|a website whose stories check out;AI that is safe;an honest person|trustworthy means able to be trusted; manipulative means controlling people unfairly|trustworthy 是值得信赖的；manipulative 是操纵性的|manipulative=manipulative means controlling people, but here stories check out and she is honest=manipulative 是操纵人的，而这里报道属实、她也诚实;discriminatory=discriminatory means unfair to some people, not safe and honest=discriminatory 是歧视性的，不是安全诚实|trust · wor · thy|trust + worthy, one word|trust + worthy，连写成一个词
    `,
  },
});

const transitions = vocabularyTopic({
  id: "b2-words-transitions",
  title: t("Transitions", "转变"),
  summary: t(
    "Transitions and transformation; progression and advancement; upheaval and disruption; stagnation and stagnant economies; momentum; trajectories; modernizing and modernization.",
    "过渡和转型；进展和进步；剧变和中断；停滞和停滞的经济；势头；轨迹；现代化。",
  ),
  intro: t(
    "Our town went through a **transformation** when the factory closed. After years of **stagnation**, a new tech park brought **momentum** back, though the change caused some **upheaval** for older workers. These words help you talk about how things change and develop over time.",
    "工厂关闭后，我们镇经历了一场 **transformation**（转变）。经过多年的 **stagnation**（停滞），一个新的科技园重新带来了 **momentum**（发展势头），不过这一变化也给年长的工人带来了一些 **upheaval**（动荡）。这些词帮你谈论事物如何随时间变化和发展。",
  ),
  prerequisites: ["b2-words-change-verbs"],
  words: [
    word(
      "transition transitions",
      "a change from one state or system to another",
      "过渡；转变",
      "The {transition} from petrol to electric cars will take decades. | The country made a peaceful {transition} from army rule to democracy. | Moving to secondary school is a big {transition} for children.",
      "stagnation momentum",
      "transformation",
    ),
    word(
      "transformation",
      "a complete change in the appearance or character of something",
      "转变；变革",
      "The city has undergone a {transformation} in the last ten years: you would not recognize it. | Digital {transformation} is completely changing every business. | Her {transformation} from shy girl to star was amazing.",
      "stagnation momentum",
      "transition",
    ),
    word(
      "progression",
      "the process of developing or moving forward gradually",
      "进展；发展",
      "The drug slows the {progression} of the disease as it gets worse. | There is a natural {progression} from walking to running. | Career {progression}, moving up step by step, is slow in this company.",
      "stagnation upheaval",
      "advancement",
    ),
    word(
      "advancement",
      "progress or development; moving to a higher job",
      "进步；晋升",
      "Technological {advancement} has made life easier. | There are few chances for {advancement} to a higher job here. | The {advancement} of science depends on curiosity.",
      "stagnation upheaval",
      "progression",
    ),
    word(
      "upheaval",
      "a big change that causes a lot of confusion and worry",
      "剧变；动荡",
      "The revolution caused great social {upheaval}, with chaos everywhere. | Moving house to a new country was a huge {upheaval} for the children. | The industry is going through a period of {upheaval} and confusion.",
      "momentum stagnation",
      "disruption",
    ),
    word(
      "disruption",
      "a problem that stops something from continuing normally; a big change to an industry",
      "中断；扰乱",
      "The strike caused {disruption} to train services, and many were canceled. | Heavy snow caused {disruption} across the country, closing roads. | AI could cause huge {disruption} in the job market, changing it completely.",
      "momentum advancement",
      "upheaval",
    ),
    word(
      "stagnation",
      "a state of not growing, moving or developing",
      "停滞；萧条",
      "Years of economic {stagnation}, with no growth, left people poorer. | The company wants to avoid {stagnation} by investing in new ideas. | Wages suffered from long {stagnation}, not rising for a decade.",
      "momentum advancement",
      "stagnant",
    ),
    word(
      "stagnant",
      "not growing or developing; not flowing and therefore dirty",
      "停滞的；不流动的",
      "The economy has been {stagnant} for years, with no growth. | Mosquitoes breed in {stagnant} water that does not flow. | Sales remained {stagnant} despite the new ads.",
      "dynamic flourishing",
      "stagnation",
    ),
    word(
      "momentum",
      "the force that keeps something moving or developing",
      "势头；动力",
      "The campaign is gaining {momentum} as more people sign up. | The team lost {momentum} after the break and stopped scoring. | A heavy ball rolling downhill has more {momentum}.",
      "stagnation trajectory",
    ),
    word(
      "trajectory trajectories",
      "the path that something follows as it moves; the way something develops",
      "轨迹；发展轨迹",
      "The rocket's {trajectory}, its path through the sky, was calculated by computer. | Her career has followed an upward {trajectory}. | The ball's {trajectory} curved to the left and into the goal.",
      "momentum stagnation",
    ),
    word(
      "modernize modernizes modernized modernizing",
      "to make something more modern by using new methods or equipment",
      "使现代化",
      "The government plans to {modernize} the railways with faster trains. | The hotel was {modernized} last year with new rooms.|stagnated transmitted | They are {modernizing} the factory with robots.|stagnating transmitting",
      "stagnate transmit",
      "modernization",
    ),
    word(
      "modernization",
      "the process of making something modern",
      "现代化",
      "The {modernization} of the army, with new equipment, cost billions. | China's rapid {modernization}, with new cities and railways, changed millions of lives. | The old school needs {modernization}: new computers and heating.",
      "stagnation upheaval",
      "modernize",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Momentum* is the force that keeps something going, while *stagnation* is not growing at all. Look for words such as *gaining*, *sign up*, *no growth* or *not rising* that show which one fits.",
        "*momentum* 是推动事物前进的势头，*stagnation* 是完全不增长。找找 *gaining*、*sign up*、*no growth* 或 *not rising* 这类词，判断该用哪个。",
      ),
      meaning: t(
        "An *upheaval* is a big change that causes confusion and worry, while *progression* is gradual development. Check whether the meaning is about sudden trouble or about step-by-step growth.",
        "*upheaval* 是引起混乱和担忧的剧变，*progression* 是逐步发展。看释义说的是突然的动荡，还是一步步的发展。",
      ),
      spell: t(
        "*Trajectory* has j: tra · jec · to · ry; *upheaval* is up + heave + al, dropping the e; *stagnant* ends in -ant.",
        "*trajectory* 中有 j：tra · jec · to · ry；*upheaval* 是 up + heave + al，去掉 e；*stagnant* 以 -ant 结尾。",
      ),
    },
    notes: `
      transition|petrol cars to electric cars;army rule to democracy;moving to secondary school|a transition is a change from one state to another; stagnation is not changing|transition 是过渡；stagnation 是停滞|stagnation=stagnation is not changing, but here something moves from one state to another=stagnation 是停滞，而这里是从一种状态转到另一种;momentum=momentum is a force that keeps something going, not a change from army rule to democracy=momentum 是推动力，不是从军政府到民主的转变|tran · si · tion|transit + ion|transit + ion
      transformation|a city you would not recognize;businesses completely changing;a shy girl who became a star|a transformation is a complete change; stagnation is no change|transformation 是彻底的转变；stagnation 是停滞|stagnation=stagnation is no change, but you would not recognize the city=stagnation 是没有变化，而这座城市已认不出来了;momentum=momentum is a force that keeps things going, not a shy girl becoming a star=momentum 是推动力，不是害羞女孩变成明星|trans · for · ma · tion|transform + ation|transform + ation
      progression|a disease getting worse;walking leading to running;moving up step by step|progression is gradual development; upheaval is sudden confusion|progression 是逐步发展；upheaval 是剧变|stagnation=stagnation is not developing, but here a disease gets worse step by step=stagnation 是停滞，而这里疾病在逐步恶化;upheaval=upheaval is sudden chaos, not a natural step from walking to running=upheaval 是突然的动荡，不是从走到跑的自然过程|pro · gres · sion|progress + ion|progress + ion
      advancement|technology making life easier;chances for a higher job;science driven by curiosity|advancement is progress or moving to a higher job; stagnation is no growth|advancement 是进步、晋升；stagnation 是停滞|stagnation=stagnation is no growth, not something that made life easier=stagnation 是停滞，不会让生活更便利;upheaval=upheaval is confusion and worry, not a chance for a higher job=upheaval 是混乱和担忧，不是晋升的机会|ad · vance · ment|advance + ment, keeping the e|advance + ment，保留 e
      upheaval|chaos after a revolution;a move to a new country;a confusing time in an industry|an upheaval is a big change causing confusion; momentum is a force that keeps things going|upheaval 是剧变、动荡；momentum 是势头|momentum=momentum is a force that keeps things going, not chaos everywhere=momentum 是推动力，不是到处混乱;stagnation=stagnation is no change, but moving country is a huge change=stagnation 是没有变化，而移居国外是巨大的变化|up · heav · al|up + heave + al, dropping the e|up + heave + al，去掉 e
      disruption|canceled trains during a strike;roads closed by snow;a job market changed completely|disruption is a problem that stops normal work, or a big change; advancement is progress|disruption 是中断、扰乱；advancement 是进步|momentum=momentum keeps things going, but here trains are canceled and roads closed=momentum 是让事情持续推进，而这里火车停运、道路封闭;advancement=advancement is progress, not canceled trains=advancement 是进步，不是火车停运|dis · rup · tion|disrupt + ion|disrupt + ion
      stagnation|an economy with no growth;something new ideas avoid;wages not rising for a decade|stagnation is not growing or developing; momentum is the force of moving forward|stagnation 是停滞；momentum 是势头|momentum=momentum keeps things growing, but here there is no growth=momentum 是推动增长的力，而这里毫无增长;advancement=advancement is progress, not wages that did not rise for ten years=advancement 是进步，不是十年不涨的工资|stag · na · tion|stagnate drops its e and adds -ion|stagnate 去掉 e 加 -ion
      stagnant|an economy with no growth;water that does not flow;sales that stayed the same|stagnant means not growing or not flowing; flourishing means growing well|stagnant 是停滞的、不流动的；flourishing 是蓬勃发展的|dynamic=dynamic means full of energy and change, not an economy with no growth=dynamic 是充满活力的，不是毫无增长的经济;flourishing=flourishing means growing well, not water that does not flow=flourishing 是蓬勃发展的，不是不流动的水|stag · nant|stagn + ant, ending in -ant|stagn + ant，以 -ant 结尾
      momentum|a campaign more people join;a team that stopped scoring after a break;a heavy ball rolling downhill|momentum is the force that keeps something moving; stagnation is not moving|momentum 是势头、动量；stagnation 是停滞|stagnation=stagnation is not moving, and you do not *gain stagnation* as people sign up=stagnation 是停滞，人越来越多时不会 *gain stagnation*;trajectory=a trajectory is a path, and a ball does not have *more trajectory*=trajectory 是轨迹，球不会有 *more trajectory*|mo · men · tum|moment + um|moment + um
      trajectory|a rocket's path through the sky;a career going upward;a ball curving into the goal|a trajectory is the path something follows; momentum is the force behind it|trajectory 是轨迹；momentum 是势头|momentum=momentum is a force, not a path through the sky or a curve to the left=momentum 是一种力，不是空中的路径或向左的弧线;stagnation=stagnation is not moving, not an upward path=stagnation 是停滞，不是向上的轨迹|tra · jec · to · ry|tra + ject + ory, with j|tra + ject + ory，有 j
      modernize|railways with faster trains;a hotel with new rooms;a factory with robots|to modernize is to make something modern; to stagnate is to stop developing|modernize 是使现代化；stagnate 是停滞|stagnate/stagnated/stagnating=stagnate means to stop developing, not to add new rooms or robots=stagnate 是停滞不前，不是增加新房间或机器人;transmit/transmitted/transmitting=transmit means to send a signal, not to give railways faster trains=transmit 是传输信号，不是给铁路换更快的火车|mod · ern · ize|modern + ize|modern + ize
      modernization|new equipment for an army;new cities and railways in China;new computers and heating for a school|modernization is making something modern; stagnation is no development|modernization 是现代化；stagnation 是停滞|stagnation=stagnation is no development, not new equipment or new cities=stagnation 是停滞，不是新装备或新城市;upheaval=upheaval is confusion and worry, not new computers and heating=upheaval 是混乱和担忧，不是新电脑和暖气|mod · ern · i · za · tion|modernize drops its e and adds -ation|modernize 去掉 e 加 -ation
    `,
  },
});

// Wish and if only.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const pronouns = new Set(["I", "you", "he", "she", "it", "we", "they"]);
const plural = new Set(["you", "we", "they", "my parents"]);

/**
 * wishNows are wishes about the present: the fact, the opener, the subject, the right form, a wrong form in the present
 * and a wrong form in the past perfect, then the rest of the sentence.
 */
const handWishNows: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ["I don't know the answer.", "I wish", "I", "knew", "know", "had known", "the answer"],
  ["I can't swim.", "I wish", "I", "could", "can", "could have", "swim"],
  ["It's raining.", "I wish", "it", "weren't", "isn't", "hadn't been", "raining"],
  ["We don't have a garden.", "If only", "we", "had", "have", "had had", "a garden"],
  ["My apartment is so small.", "I wish", "my apartment", "were", "is", "had been", "bigger"],
  ["She lives far away.", "I wish", "she", "lived", "lives", "had lived", "closer"],
  ["I'm not tall enough for the team.", "I wish", "I", "were", "am", "had been", "taller"],
  ["He doesn't speak English.", "If only", "he", "spoke", "speaks", "had spoken", "English"],
  ["I have to work this weekend.", "I wish", "I", "didn't have to", "don't have to", "hadn't had to", "work this weekend"],
  ["They live in a noisy street.", "I wish", "they", "didn't live", "don't live", "hadn't lived", "in such a noisy street"],
  ["I don't understand this chapter.", "I wish", "I", "understood", "understand", "had understood", "this chapter"],
  ["My phone is so slow.", "If only", "my phone", "were", "is", "had been", "faster"],
  ["We can't afford a car.", "I wish", "we", "could", "can", "could have", "afford a car"],
  ["You aren't here with us.", "I wish", "you", "were", "are", "had been", "here with us"],
  ["I don't have enough time.", "I wish", "I", "had", "have", "had had", "more time"],
  ["I'm so tired today.", "If only", "I", "weren't", "am not", "hadn't been", "so tired today"],
  ["We live so far from the sea.", "I wish", "we", "lived", "live", "had lived", "nearer the sea"],
  ["I can't drive.", "If only", "I", "could", "can", "could have", "drive"],
  ["The museum doesn't open on Mondays.", "I wish", "the museum", "opened", "opens", "had opened", "on Mondays"],
  ["She doesn't like her job.", "I wish", "she", "liked", "likes", "had liked", "her job more"],
  ["I don't know anyone in this city.", "I wish", "I", "knew", "know", "had known", "more people in this city"],
  ["Our teacher gives us so much homework.", "I wish", "our teacher", "gave", "gives", "had given", "us less homework"],
  ["I'm not good at math.", "If only", "I", "were", "am", "had been", "better at math"],
  ["The robot doesn't understand my accent.", "I wish", "the robot", "understood", "understands", "had understood", "my accent"],
  ["My laptop doesn't have a camera.", "I wish", "my laptop", "had", "has", "had had", "a camera"],
  ["It's so expensive to live here.", "I wish", "it", "weren't", "isn't", "hadn't been", "so expensive to live here"],
  ["I can't remember her name.", "If only", "I", "could", "can", "could have", "remember her name"],
  ["We don't own this apartment.", "I wish", "we", "owned", "own", "had owned", "this apartment"],
  ["The app doesn't work offline.", "I wish", "the app", "worked", "works", "had worked", "offline"],
  ["He's always late.", "I wish", "he", "weren't", "isn't", "hadn't been", "always late"],
  ["I don't have a dog.", "If only", "I", "had", "have", "had had", "a dog"],
  ["My parents don't trust me.", "I wish", "my parents", "trusted", "trust", "had trusted", "me"],
];

/**
 * wishPasts are regrets about the past: the fact, the opener, the subject, the right form in the past perfect, a wrong
 * form in the past simple and a wrong form in the present perfect, then the rest of the sentence.
 */
const handWishPasts: readonly (readonly [string, string, string, string, string, string, string])[] = [
  ["I didn't back up my files.", "If only", "I", "had backed up", "backed up", "have backed up", "my files"],
  ["I didn't study for the test.", "I wish", "I", "had studied", "studied", "have studied", "for the test"],
  ["We missed the train.", "I wish", "we", "hadn't missed", "didn't miss", "haven't missed", "the train"],
  ["She didn't come to the party.", "I wish", "she", "had come", "came", "has come", "to the party"],
  ["I said something rude.", "I wish", "I", "hadn't said", "didn't say", "haven't said", "that"],
  ["They sold the old house.", "If only", "they", "hadn't sold", "didn't sell", "haven't sold", "the old house"],
  ["I didn't take a photo.", "I wish", "I", "had taken", "took", "have taken", "a photo"],
  ["He forgot my birthday.", "I wish", "he", "hadn't forgotten", "didn't forget", "hasn't forgotten", "my birthday"],
  ["We didn't book a table.", "If only", "we", "had booked", "booked", "have booked", "a table"],
  ["I ate too much.", "I wish", "I", "hadn't eaten", "didn't eat", "haven't eaten", "so much"],
  ["You didn't tell me earlier.", "I wish", "you", "had told", "told", "have told", "me earlier"],
  ["I clicked on the link.", "If only", "I", "hadn't clicked", "didn't click", "haven't clicked", "on that link"],
  ["I didn't learn an instrument as a child.", "I wish", "I", "had learned", "learned", "have learned", "an instrument as a child"],
  ["We didn't save any money last year.", "I wish", "we", "had saved", "saved", "have saved", "some money last year"],
  ["The company ignored the warnings.", "If only", "the company", "hadn't ignored", "didn't ignore", "hasn't ignored", "the warnings"],
  ["I lost my wallet.", "I wish", "I", "hadn't lost", "didn't lose", "haven't lost", "my wallet"],
  ["She didn't see the film.", "I wish", "she", "had seen", "saw", "has seen", "the film with us"],
  ["I didn't bring an umbrella.", "If only", "I", "had brought", "brought", "have brought", "an umbrella"],
  ["They didn't listen to the experts.", "I wish", "they", "had listened", "listened", "have listened", "to the experts"],
  ["I sent the email too soon.", "I wish", "I", "hadn't sent", "didn't send", "haven't sent", "the email so soon"],
  ["We didn't visit Grandma last summer.", "I wish", "we", "had visited", "visited", "have visited", "Grandma last summer"],
  ["He didn't wear a helmet.", "If only", "he", "had worn", "wore", "has worn", "a helmet"],
  ["I chose the wrong course.", "I wish", "I", "hadn't chosen", "didn't choose", "haven't chosen", "this course"],
  ["Nobody warned us.", "I wish", "someone", "had warned", "warned", "has warned", "us"],
  ["I didn't go to bed early.", "I wish", "I", "had gone", "went", "have gone", "to bed earlier"],
  ["We bought the cheap phone.", "If only", "we", "hadn't bought", "didn't buy", "haven't bought", "the cheap phone"],
  ["I didn't apply for the job.", "I wish", "I", "had applied", "applied", "have applied", "for the job"],
  ["You didn't call me.", "I wish", "you", "had called", "called", "have called", "me"],
  ["I didn't read the instructions.", "If only", "I", "had read", "read", "have read", "the instructions"],
  ["She left the door open.", "I wish", "she", "hadn't left", "didn't leave", "hasn't left", "the door open"],
  ["I didn't charge my phone.", "I wish", "I", "had charged", "charged", "have charged", "my phone"],
  ["They cut down the old tree.", "If only", "they", "hadn't cut", "didn't cut", "haven't cut", "down the old tree"],
];

/** wishPeople are the subjects of the generated wishes, each one person. */
const wishPeople = ["Tom", "Anna", "my sister", "my brother", "our neighbor", "Mr. Lee"] as const;

/** wishNowActs are a fact about now after the subject, the right form, the present and past perfect forms, and the rest. */
const wishNowActs: readonly (readonly [string, string, string, string, string])[] = [
  ["doesn't have a car", "had", "has", "had had", "a car"],
  ["doesn't know the way", "knew", "knows", "had known", "the way"],
  ["can't drive", "could", "can", "could have", "drive"],
  ["isn't here", "were", "is", "had been", "here"],
  ["works on Sundays", "didn't work", "doesn't work", "hadn't worked", "on Sundays"],
  ["lives so far away", "lived", "lives", "had lived", "closer"],
  ["doesn't speak English", "spoke", "speaks", "had spoken", "English"],
  ["is always busy", "weren't", "isn't", "hadn't been", "always busy"],
  ["doesn't like dogs", "liked", "likes", "had liked", "dogs"],
  ["smokes", "didn't smoke", "doesn't smoke", "hadn't smoked", ""],
  ["doesn't eat vegetables", "ate", "eats", "had eaten", "vegetables"],
  ["plays loud music at night", "didn't play", "doesn't play", "hadn't played", "loud music at night"],
  ["can't come to the wedding", "could", "can", "could have", "come to the wedding"],
  ["is so shy", "weren't", "isn't", "hadn't been", "so shy"],
];

/** wishPastActs are a fact about the past after the subject, the past perfect, past simple and present perfect forms, and the rest. */
const wishPastActs: readonly (readonly [string, string, string, string, string])[] = [
  ["missed the bus", "hadn't missed", "didn't miss", "hasn't missed", "the bus"],
  ["didn't call me", "had called", "called", "has called", "me"],
  ["sold the bike", "hadn't sold", "didn't sell", "hasn't sold", "the bike"],
  ["didn't come to the party", "had come", "came", "has come", "to the party"],
  ["broke the window", "hadn't broken", "didn't break", "hasn't broken", "the window"],
  ["didn't see the match", "had seen", "saw", "has seen", "the match"],
  ["lost the tickets", "hadn't lost", "didn't lose", "hasn't lost", "the tickets"],
  ["didn't wait for us", "had waited", "waited", "has waited", "for us"],
  ["moved to another city", "hadn't moved", "didn't move", "hasn't moved", "to another city"],
  ["didn't take the job", "had taken", "took", "has taken", "the job"],
  ["told everyone the secret", "hadn't told", "didn't tell", "hasn't told", "everyone the secret"],
  ["didn't write back", "had written", "wrote", "has written", "back"],
  ["forgot the keys", "hadn't forgotten", "didn't forget", "hasn't forgotten", "the keys"],
  ["didn't say goodbye", "had said", "said", "has said", "goodbye"],
];

/** wishRows crosses wishPeople with acts, alternating I wish and If only. */
const wishRows = (acts: readonly (readonly [string, string, string, string, string])[]) =>
  acts.flatMap(([fact, right, one, two, rest], a) =>
    wishPeople.map(
      (who, k) =>
        [
          `${who.charAt(0).toUpperCase()}${who.slice(1)} ${fact}.`,
          (a + k) % 3 === 0 ? "If only" : "I wish",
          who,
          right,
          one,
          two,
          rest,
        ] as const,
    ),
  );

/** wishNows are the hand-written wishes about the present, then those from people and acts. */
const wishNows = [...handWishNows, ...wishRows(wishNowActs)];

/** wishPasts are the hand-written regrets about the past, then those from people and acts. */
const wishPasts = [...handWishPasts, ...wishRows(wishPastActs)];

const wishNowChoice: readonly ChoiceItem[] = wishNows.map(
  ([fact, opener, s, right, present, perfect, rest]): ChoiceItem => [
    `${fact} ${joinWords(opener, s, "___", rest)}.`,
    right,
    [present, perfect],
  ],
);

const wishPastChoice: readonly ChoiceItem[] = wishPasts.map(
  ([fact, opener, s, right, past, perfect, rest]): ChoiceItem => [`${fact} ${joinWords(opener, s, "___", rest)}.`, right, [past, perfect]],
);

/** nowPattern is the subject and the verb of a wish about the present, accepting was beside were after a singular subject. */
function nowPattern(subject: string, right: string): string {
  const one = !plural.has(subject);
  if (right === "were") return `${subject} ${one ? "[were|was]" : "were"}`;
  if (right === "weren't") return `${subject} ${one ? "[weren't|wasn't|were not|was not]" : "[weren't|were not]"}`;
  if (right.startsWith("didn't ")) return `${subject} [didn't|did not] ${right.slice(7)}`;
  return `${subject} ${right}`;
}

/** pastPattern is the subject and the verb of a regret about the past, accepting 'd and had not. */
function pastPattern(subject: string, right: string): string {
  if (right.startsWith("hadn't ")) {
    const pp = right.slice(7);
    return pronouns.has(subject) ? `[${subject} hadn't|${subject} had not] ${pp}` : `${subject} [hadn't|had not] ${pp}`;
  }
  const pp = right.slice(4);
  return pronouns.has(subject) ? `[${subject} had|${subject}'d] ${pp}` : `${subject} had ${pp}`;
}

const wishTyped: readonly TypedItem[] = interleave([
  wishNows.map(
    ([fact, opener, s, right, present, perfect, rest]): TypedItem => ({
      shown: `${fact} → ${opener} …`,
      accepted: [`${joinWords(opener, nowPattern(s, right), rest)}.`],
      canonical: `${joinWords(opener, s, right, rest)}.`,
      wrong: [`${joinWords(opener, s, present, rest)}.`, `${joinWords(opener, s, perfect, rest)}.`],
    }),
  ),
  wishPasts.map(
    ([fact, opener, s, right, past, perfect, rest]): TypedItem => ({
      shown: `${fact} → ${opener} …`,
      accepted: [`${joinWords(opener, pastPattern(s, right), rest)}.`],
      canonical: `${joinWords(opener, s, right, rest)}.`,
      wrong: [`${joinWords(opener, s, past, rest)}.`, `${joinWords(opener, s, perfect, rest)}.`],
    }),
  ),
]);

/** wishPresentOf maps the shown sentence of a wish about now to the present form it steps back from. */
const wishPresentOf = new Map(wishNowChoice.map(([shown, , wrong]) => [shown, wrong[0] ?? ""]));

/** wereNote is the remark that were serves every subject in a wish. */
const wereNote = (right: string): Text =>
  right.startsWith("were") ? t(", and *were* serves every subject", "，而且任何主语都可以用 *were*") : t("", "");

/** wishNowWhy explains the step back into the past in a wish about the present. */
const wishNowWhy = (right: string, shown: string): Text => {
  const present = wishPresentOf.get(shown) ?? "";
  const were = wereNote(right);
  return t(
    `A wish about now steps the verb one tense back into the past, so *${present}* becomes *${right}*${were.en}: ${fill(shown, right)}\n\n**Check.** The reality is in the present, so the verb after *wish* / *if only* steps back one tense into the past simple (*${right}*).`,
    `对现在的愿望要把动词往后退一个时态，用过去式，所以 *${present}* 变成 *${right}*${were["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 现实情况在现在，所以 *wish* / *if only* 后面的动词往后退一步，用一般过去式（*${right}*）。`,
  );
};

/** whyNotWishNow explains the present or the past perfect in a wish about the present. */
const whyNotWishNow = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* is the present tense, which states a fact rather than an unreal wish about now.`,
        `*${wrong}* 是现在时，说的是事实本身，不能用来表达与现在相反的愿望。`,
      )
    : t(
        `*${wrong}* uses *have/had*, which points back to a past regret instead of a wish about now.`,
        `*${wrong}* 用了完成时结构，指向的是过去的遗憾，而不是对现在的愿望。`,
      );

/** wishPastWhy explains the past perfect in a regret about the past. */
const wishPastWhy = (right: string, shown: string): Text =>
  t(
    `A regret about the past steps the verb back past the past simple, into the past perfect, *had* and the past participle: ${fill(shown, right)}\n\n**Check.** Because the missed event already happened in the past, *wish* / *if only* requires *had/hadn't* + past participle (*${right}*).`,
    `后悔过去时，动词要比一般过去时再往后退一步，用过去完成时，即 *had* 加过去分词：${fill(shown, right)}\n\n**检验。** 既然事件已发生在过去，*wish* / *if only* 后面就必须用 *had/hadn't* + 过去分词（*${right}*）。`,
  );

/** whyNotWishPast explains the past simple or the present perfect in a regret about the past. */
const whyNotWishPast = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*${wrong}* is the past simple, which *wish* uses for a present wish rather than a past regret.`,
        `*${wrong}* 是一般过去时，*wish* 用它表达对现在的愿望，不能表达对过去的遗憾。`,
      )
    : t(
        `*${wrong}* is the present perfect, which never follows *wish* or *if only* for a past regret.`,
        `*${wrong}* 是现在完成时，*wish* 或 *if only* 后面不能用现在完成时来后悔过去。`,
      );

/** wishFactOf maps the canonical answer of a written wish to its fact, its verb form and whether it is about the past. */
const wishFactOf = new Map<string, { readonly fact: string; readonly right: string; readonly past: boolean }>([
  ...wishNows.map(([fact, opener, s, right, , , rest]) => [`${joinWords(opener, s, right, rest)}.`, { fact, right, past: false }] as const),
  ...wishPasts.map(([fact, opener, s, right, , , rest]) => [`${joinWords(opener, s, right, rest)}.`, { fact, right, past: true }] as const),
]);

/** wishWriteWhy explains which tense a written wish takes from its fact, and that it reverses the fact. */
const wishWriteWhy = (canonical: string): Text => {
  const item = wishFactOf.get(canonical);
  if (item === undefined)
    return t(
      `${canonical}\n\n**Check.** Verify the verb steps back one tense and reverses the polarity of the fact.`,
      `${canonical}\n\n**检验。** 核对动词已向后退一个时态，且正负与事实相反。`,
    );
  const fact = item.fact.replace(/[.!]$/u, "");
  return item.past
    ? t(
        `The fact is about the past (*${fact}*), so the regret takes the past perfect, *${item.right}*, and says the opposite of the fact: ${canonical}\n\n**Check.** Confirm the polarity flips from the past fact and the verb uses *had/hadn't* + past participle (*${item.right}*).`,
        `这个事实是关于过去的（*${fact}*），所以遗憾用过去完成时 *${item.right}*，并说出与事实相反的情况：${canonical}\n\n**检验。** 确认正负与过去事实相反，且动词用了 *had/hadn't* + 过去分词（*${item.right}*）。`,
      )
    : t(
        `The fact is about now (*${fact}*), so the wish steps the verb back into the past, *${item.right}*, and says the opposite of the fact: ${canonical}\n\n**Check.** Confirm the polarity flips from the present fact and the verb steps back into the past simple (*${item.right}*).`,
        `这个事实是关于现在的（*${fact}*），所以愿望把动词往后退一步，用过去式 *${item.right}*，并说出与事实相反的情况：${canonical}\n\n**检验。** 确认正负与现在事实相反，且动词已往后退一步用一般过去式（*${item.right}*）。`,
      );
};

const wishAndIfOnly: TopicDef = {
  id: "wish-and-if-only",
  title: t("Wish and If Only", "wish 和 if only"),
  summary: t(
    "I wish I knew how it worked. If only we had backed it up! A wish about the present takes the past simple; a regret about the past takes the past perfect.",
    "I wish I knew how it worked. If only we had backed it up! 对现在的愿望用一般过去时，对过去的遗憾用过去完成时。",
  ),
  intro: t(
    "When your phone dies mid-call, you sigh *I wish I had a spare charger* (about now) or *If only I had charged it last night!* (about the past). English signals unreal wishes by stepping the verb one tense back.",
    "通话中途手机没电，你会叹气说 *I wish I had a spare charger*（希望现在不同）或 *If only I had charged it last night!*（后悔过去）。英语通过把动词往后退一个时态来标出与事实相反的愿望。",
  ),
  prerequisites: ["third-conditional"],
  encompasses: [
    { topic: "second-conditional", weight: 0.3 },
    { topic: "third-conditional", weight: 0.3 },
  ],
  xp: 30,
  strand: "grammar",
  knowledgePoints: [
    point(
      "present",
      t("Wishing the present were different", "希望现在不同"),
      t(
        "To wish that something **now** were different, put the verb after *wish* or *if only* one step back into the **past**, as in a second conditional:\n\n- *I don't know the answer.* → *I **wish** I **knew** the answer.*\n- *I can't swim.* → *If only I **could** swim.*\n- *It's raining.* → *I wish it **weren't** raining.* (*wasn't* is also common after *I*, *he*, *she* and *it*.)\n\nThe past form does not mean past time here: it shows that the wish is not true. *If only* is stronger than *I wish*.\n\n> **Watch out.** Never use the present tense after *wish* (*I wish I know* is wrong), and do not confuse *wish* (unreal) with *hope* (possible: *I hope it stops raining*).",
        "希望**现在**的情况不同时，把 *wish* 或 *if only* 后面的动词往后退一步，用**过去式**，和第二条件句一样：\n\n- *I don't know the answer.* → *I **wish** I **knew** the answer.*\n- *I can't swim.* → *If only I **could** swim.*\n- *It's raining.* → *I wish it **weren't** raining.*（在 *I*、*he*、*she*、*it* 后面也常用 *wasn't*。）\n\n这里的过去式不表示过去的时间，而是表示愿望与事实相反。*If only* 的语气比 *I wish* 更强。\n\n> **注意。** *wish* 后面不能用现在时（*I wish I know* 是错的），也不要把 *wish*（与事实相反）和 *hope*（可能实现：*I hope it stops raining*）混用。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), wishNowChoice, wishNowWhy, whyNotWishNow),
    ),
    point(
      "past",
      t("Regretting the past", "后悔过去"),
      t(
        "To regret something that **happened** (or didn't happen) in the past, use *wish* or *if only* with the **past perfect**, *had* + past participle, as in a third conditional:\n\n- *I didn't back up my files.* → *If only I **had backed up** my files!*\n- *I said something rude.* → *I wish I **hadn't said** that.*\n\n> **Watch out.** Neither the past simple (*I wish I studied*) nor the present perfect (*I wish I have studied*) expresses a past regret—always step all the way back to *had/hadn't* + past participle.",
        "后悔过去**发生**（或没有发生）的事时，*wish* 或 *if only* 后面用**过去完成时**，即 *had* 加过去分词，和第三条件句一样：\n\n- *I didn't back up my files.* → *If only I **had backed up** my files!*\n- *I said something rude.* → *I wish I **hadn't said** that.*\n\n中文“我真后悔没复习”“要是当时没说那句话就好了”靠“当时”“后悔”表达时间，英语则要靠 *had* 加过去分词。\n\n> **注意。** 一般过去时（*I wish I studied*）和现在完成时（*I wish I have studied*）都不能用来后悔过去——必须一路退到 *had/hadn't* + 过去分词。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), wishPastChoice, wishPastWhy, whyNotWishPast),
    ),
    point(
      "write",
      t("Writing wishes and regrets", "写愿望和遗憾"),
      t(
        "Turn the fact into a wish with the words given. A fact about **now** takes the past simple; a fact about the **past** takes the past perfect. A wish reverses the fact, so a negative fact becomes positive and a positive fact becomes negative:\n\n- *I can't drive. → If only …* becomes *If only I could drive.*\n- *We missed the train. → I wish …* becomes *I wish we hadn't missed the train.*\n\nYou may write *I'd* for *I had*, *had not* for *hadn't*, and *was* for *were* after *I*, *he*, *she* and *it*.\n\n> **Watch out.** Remember both changes at once: flip positive/negative from the original fact, **and** step the tense back (now → past simple; past → *had* + past participle).",
        "用给出的开头把事实改写成愿望。关于**现在**的事实用一般过去时，关于**过去**的事实用过去完成时。愿望与事实相反，所以否定的事实变成肯定，肯定的事实变成否定：\n\n- *I can't drive. → If only …* 写成 *If only I could drive.*\n- *We missed the train. → I wish …* 写成 *I wish we hadn't missed the train.*\n\n可以把 *I had* 写成 *I'd*，把 *hadn't* 写成 *had not*，*I*、*he*、*she*、*it* 后面的 *were* 也可以写成 *was*。\n\n> **注意。** 两步变化别漏掉任何一步：既要把原事实的正负反过来，又要让时态往后退一步（现在 → 一般过去时；过去 → *had* + 过去分词）。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Turn the fact into a wish with the words given.", "用给出的开头把事实改写成愿望。"),
        wishTyped,
        wishWriteWhy,
        wishAndIfOnlyWriteNot,
      ),
    ),
  ],
};

// Writing a problem-solution essay.

const problemBank: readonly WritingItem[] = [
  {
    task: "Many teenagers spend so much time on their phones that their sleep and schoolwork suffer. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "Most teenagers now own a smartphone, and many of them use it for more than six hours a day. The problem is not the phone itself but what it replaces: sleep, homework, exercise and conversation. Apps are designed to keep users scrolling, and young people, whose self-control is still developing, find it especially hard to stop. As a result, teachers report students who arrive tired and unable to concentrate.\n\nOne solution would be for schools to ban phones during the school day. Students would hand in their phones in the morning and collect them when they leave. Several countries have already introduced such rules, and some schools report calmer classrooms and better results. However, a ban only covers the hours when students are already supervised. It does nothing about the late-night scrolling that causes most of the damage to sleep.\n\nA second solution would be to teach families how to manage screen time at home. Schools could run short courses for parents and students that explain how apps capture attention and how to use the time limits built into most phones. Families might agree, for example, to leave all phones in the kitchen at night. The difficulty is that this approach depends on parents taking part, and the busiest families may be the least likely to attend.\n\nIn conclusion, both measures have a place, but I believe the second would work better. A school ban is easy to introduce, yet it protects students only when they are least at risk. Habits formed at home, by contrast, affect the evening and the night, when phones do the most harm. Ideally, schools should combine a daytime ban with support for families.",
  },
  {
    task: "Traffic jams in large cities waste time, money and fuel. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "In many large cities, drivers spend dozens of hours a year sitting in traffic. Congestion wastes time and fuel, delays buses and deliveries, and fills the air with exhaust fumes that harm residents' health. It is caused mainly by the number of private cars, most of which carry only one person, and by roads that were built for far smaller populations.\n\nOne solution would be to charge drivers a fee for entering the city center at busy times. Cameras would read license plates, and drivers would pay automatically. London and Singapore have used such systems for years, and traffic in the charging zones fell noticeably after they were introduced. The money raised could be spent on public transport. On the other hand, the charge is unpopular, and critics argue that it is unfair to people on low incomes who have no other way to get to work.\n\nA second solution would be to make public transport so fast, cheap and frequent that people choose to leave their cars at home. This would mean new bus lanes, more trains at rush hour and lower fares. Its great advantage is that it gives people a better choice rather than punishing them. However, it is extremely expensive and slow to build, and a new metro line can take ten years to complete.\n\nOn balance, I believe a congestion charge would work better in the short term, because it reduces traffic immediately and pays for itself. Nevertheless, it will only be accepted if drivers can see an alternative. The best approach, therefore, is to use the money from the charge to improve public transport, so that the two solutions support each other.",
  },
  {
    task: "Many elderly people find it difficult to use online services such as banking, booking appointments and paying bills. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "More and more everyday services have moved online. Banks are closing branches, doctors' appointments are booked through apps, and some train tickets can only be bought on a phone. For many elderly people, this is a serious problem. Some have never used a computer, others have poor eyesight or shaking hands, and many are afraid of making a mistake or being cheated. As a result, they may miss appointments, pay higher prices or depend completely on relatives.\n\nOne solution would be to offer free digital skills classes for older people in libraries and community centers. Volunteers, including students, could teach them step by step how to use a smartphone, how to recognize a scam and how to pay a bill safely. Classes like these already exist in some cities and are very popular. However, learning takes time, and some people, particularly the very old, may never feel confident online.\n\nA second solution would be for governments to require important services to keep a non-digital option, such as a telephone line answered by a real person or a counter where people can pay in cash. This would guarantee that nobody is excluded, whatever their skills. The drawback is cost: companies argue that keeping offices and staff for a small number of customers is expensive, and they may pass that cost on to everyone.\n\nIn my view, the second solution would work better, because it protects everyone at once, including those who cannot learn new skills. Classes are valuable and should continue, but they cannot help a ninety-year-old with dementia. A society that moves its services online has a duty to make sure that its oldest citizens are not left behind.",
  },
  {
    task: "Online scams and phishing messages trick more and more ordinary people out of their money. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "Almost everyone has received a message that pretends to come from a bank, a delivery company or even a friend, asking them to click a link or share a password. These phishing messages are becoming more convincing, partly because criminals now use artificial intelligence to write them. Thousands of people lose their savings every year, and the victims are often elderly or simply busy and distracted.\n\nOne solution would be to educate the public about how scams work. Banks, schools and television campaigns could teach people a few simple rules: never share a password, check the sender's address, and call the bank directly if a message seems urgent. Education is cheap and can reach millions of people. However, scams change constantly, and even well-informed people can be fooled when they are tired or worried.\n\nA second solution would be to make banks and technology companies responsible for stopping scams before they reach customers. Phone networks could block fake numbers, email services could filter suspicious messages more strictly, and banks could delay unusual payments until the customer confirms them. In some countries, banks must now repay victims, which gives them a strong reason to invest in protection. The main difficulty is that stricter checks may annoy customers and slow down genuine payments.\n\nIn conclusion, I believe the second solution would be more effective. Education places the responsibility on individuals, who cannot be careful every minute of every day. Companies, in contrast, can stop millions of scams with a single change to their systems. Public education should continue, but the most important defense must be built into the technology itself.",
  },
  {
    task: "Millions of old phones, laptops and other devices are thrown away every year, creating a growing mountain of electronic waste. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "The world produces more than fifty million tons of electronic waste every year, and only a small part of it is properly recycled. Old phones and laptops contain valuable metals, but also toxic substances such as lead and mercury. When they are dumped or burned, these substances pollute soil and water, often in poorer countries where the waste is sent. The problem is growing because devices are cheap, quickly outdated and difficult to repair.\n\nOne solution would be to make recycling easier and more rewarding. Shops that sell electronics could be required to take back old devices for free, and customers could receive a discount on their next purchase in return. This would stop many devices from ending up in drawers or bins. However, recycling electronics is complicated and costly, and it does not reduce the number of devices being made in the first place.\n\nA second solution would be to pass laws that force manufacturers to make products that last longer and can be repaired. Batteries would have to be replaceable, spare parts would have to be available for several years, and software updates would continue for older models. The European Union has already moved in this direction. The drawback is that companies may raise their prices, and they argue that such rules slow down innovation.\n\nOn balance, I believe the second solution would work better, because it tackles the cause of the problem rather than its result. Recycling deals with devices that have already been thrown away, while repairable products mean that fewer are thrown away at all. Ideally, both measures would be introduced together, but longer-lasting design should come first.",
  },
  {
    task: "False news stories spread quickly on social media and can mislead millions of people. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "False news is not new, but social media has made it spread faster than ever before. A shocking story, whether true or not, can reach millions of people within hours, because platforms show users the posts that attract the most clicks and comments. Research suggests that false stories are shared more often than true ones. The consequences can be serious: people have refused vaccines, attacked innocent neighbors and voted on the basis of lies.\n\nOne solution would be to require social media companies to remove false stories quickly. Platforms could employ more fact-checkers and use software to detect misleading posts, and governments could fine companies that fail to act. This would reduce the amount of false news that users see. However, deciding what is false is not always simple, and critics fear that governments or companies could use such powers to silence opinions they dislike.\n\nA second solution would be to teach people, especially young people, how to judge what they read online. Schools could include lessons on checking sources, recognizing manipulated photos and noticing when a headline is designed to make readers angry. People who learn these skills are less likely to believe and share false stories. The difficulty is that education takes years to have an effect and cannot reach adults who have already left school.\n\nIn my opinion, education would work better in the long run. Removing posts treats the symptoms, and it raises difficult questions about freedom of speech. Teaching people to think critically, by contrast, protects them against false news of every kind, including types that do not exist yet. Platforms should still act against the most dangerous lies, but an informed public is the strongest defense.",
  },
  {
    task: "Automation and robots are replacing workers in factories and warehouses, and many people fear losing their jobs. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "Robots and automated systems can now do many jobs that once needed human workers, from packing boxes in warehouses to checking products on factory lines. For companies, automation means lower costs and fewer mistakes. For workers, however, it can mean losing a job they have done for decades, often in towns where there are few other employers. Without help, those workers may face long periods of unemployment and poverty.\n\nOne solution would be to retrain workers whose jobs are at risk. Governments and companies could pay for courses that prepare people for jobs that machines cannot easily do, such as maintaining robots, caring for the elderly or installing solar panels. Workers would keep part of their wages while they study. This approach gives people a future rather than simply compensating them. However, not everyone can retrain easily, especially older workers, and there is no guarantee that new jobs will be available nearby.\n\nA second solution would be to tax companies that replace workers with machines and use the money to support people who lose their jobs. The payments could last for several years while people search for new work. This would share the benefits of automation more fairly. The drawback is that such a tax might discourage companies from investing in new technology, or encourage them to move their factories to other countries.\n\nOn balance, I believe retraining would work better, because work gives people not only an income but also a sense of purpose. Payments can protect people for a while, but they do not help them build a new career. A tax could be useful, however, if the money were spent on paying for the training itself.",
  },
  {
    task: "Many students now use AI chatbots to write their homework for them instead of doing it themselves. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "AI chatbots can now write a reasonable essay, solve a math problem or summarize a book in a few seconds. Many students have discovered that they can hand in this work as their own. The problem is not only that it is dishonest. Homework exists so that students practice, and a student who lets a machine do the thinking does not learn. Teachers also lose an important way of seeing what their students understand.\n\nOne solution would be to use software that detects text written by AI. Schools could check every piece of homework and punish students who are caught. This might discourage some students from cheating. However, detection tools are unreliable: they sometimes accuse honest students, especially those writing in a second language, and clever students can easily rewrite AI text so that it is not detected.\n\nA second solution would be to change the kind of work that students are set. More writing could be done in class, by hand or on computers without internet access. Homework could ask students to reflect on their own experience, to prepare for a discussion or to explain their thinking aloud to the teacher. Some teachers might even ask students to use a chatbot and then criticize its answer. The difficulty is that this requires teachers to redesign their courses, which takes time and training.\n\nIn conclusion, I believe that changing the tasks would work much better than trying to catch cheaters. Detection turns teachers into police officers and still fails. Well-designed tasks, on the other hand, make cheating pointless and teach students to use AI wisely. Schools should therefore give teachers the time and support they need to rethink homework.",
  },
  {
    task: "People who live in rural areas often have slow or unreliable internet connections. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "In many countries, fast broadband is available in almost every city home, while villages only a few kilometers away have slow and unreliable connections. This digital divide matters more each year. Without good connectivity, rural students struggle with online homework, small businesses cannot sell their products online, and people cannot work from home. As a result, young people often move to cities, and villages lose their population.\n\nOne solution would be for the government to pay for fiber-optic cables to be laid to every rural community. Private companies have little reason to do this themselves, because it is expensive to dig long distances to reach a small number of customers. Public money could cover the gap, as it once did for electricity and telephone lines. The connection would be fast and would last for decades. However, the cost is enormous, and in mountains or on islands, the work could take many years.\n\nA second solution would be to use satellite internet. New networks of small satellites can already provide fast connections almost anywhere, with only a dish on the roof. This would bring remote homes online in weeks rather than years. On the other hand, the equipment and monthly fees are expensive for many families, the service can be affected by bad weather, and a few private companies would control an essential service.\n\nOn balance, I believe that fiber cables would work better in the long term, because they are more reliable and can be shared fairly. Satellites, however, are a sensible temporary answer for the most remote places. Governments should therefore build fiber networks step by step, while helping families in remote areas pay for satellite connections in the meantime.",
  },
  {
    task: "Cyberbullying among teenagers is increasing, and victims often feel they cannot escape it. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "Bullying used to end when a child left school and went home. Today it can follow them everywhere, through messages, comments and photos shared online at any time of day or night. Cyberbullying is particularly harmful because hurtful posts can be seen by hundreds of people and may never disappear completely. Victims often feel ashamed and alone, and some suffer from anxiety and depression as a result.\n\nOne solution would be to make social media platforms act more quickly against bullying. They could make it easier to report abusive messages, respond to reports within hours and ban users who repeatedly harass others. Some platforms already use software to warn users before they post an offensive comment. However, platforms have millions of users, and bullies can simply create new accounts. Moreover, much cyberbullying happens in private group chats that companies cannot see.\n\nA second solution would be for schools to treat cyberbullying as seriously as bullying in the classroom. Schools could teach students how their words affect others, train teachers to recognize the signs, and give victims a trusted adult to talk to. When cases are reported, the school could work with both families to stop the behavior. The difficulty is that teachers are already busy, and some parents refuse to accept that their child is responsible.\n\nIn my view, the school-based approach would be more effective. Technology can remove individual posts, but it cannot change the behavior behind them. Cyberbullies are usually classmates of their victims, so the school community is the place where the problem starts and where it can best be solved. Platforms must still do their part, but schools are in the strongest position to help.",
  },
  {
    task: "Online shopping has led to huge numbers of delivery vans on city streets and large amounts of packaging waste. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "Online shopping is convenient: with a few clicks, almost anything can arrive at our door the next day. However, this convenience has a cost. Delivery vans now fill city streets, adding to traffic and air pollution, and every parcel comes wrapped in cardboard and plastic, much of which is thrown away. Fast delivery makes the problem worse, because vans often travel half empty in order to meet promised times.\n\nOne solution would be to encourage customers to collect parcels from local pickup points, such as lockers at train stations or small shops. A single van could then deliver dozens of parcels to one place instead of stopping at every house. Customers could be offered a discount for choosing this option. However, many people prefer home delivery, especially those who are elderly, disabled or without a car, and they may be unwilling to change their habits.\n\nA second solution would be for governments to set rules on packaging. Companies could be required to use boxes that fit their products, to choose materials that can be recycled, or to offer reusable packaging that customers return. Some countries already charge companies for the packaging they put on the market. The drawback is that such rules increase costs for businesses, particularly small ones, and the extra cost may be passed on to customers.\n\nOn balance, I believe pickup points would work better, because they reduce both traffic and packaging at the same time, since parcels collected in groups need less protection. Packaging rules tackle only one side of the problem. Nevertheless, the two measures are not alternatives, and cities would benefit most from introducing them together.",
  },
  {
    task: "Data centers that run the internet and artificial intelligence use enormous amounts of electricity and water. Write a problem-solution essay that explains the problem, proposes two solutions and judges which would work better.",
    model:
      "Every search, video and chatbot answer is processed in a data center, a building full of servers that run day and night. As artificial intelligence grows, these centers need more and more electricity, and many also use large amounts of water to keep their machines cool. In some regions, data centers already use a significant share of all the electricity produced, and in dry areas, local residents worry that their water supply is at risk.\n\nOne solution would be to require data centers to run entirely on renewable energy. Companies could build solar and wind farms next to their centers or buy clean power from the grid, and governments could refuse permission for new centers that rely on coal or gas. This would sharply reduce their carbon emissions. However, renewable energy is not always available when it is needed, and building enough of it takes time. It also does nothing to reduce the amount of water used.\n\nA second solution would be to make data centers more efficient. Engineers are developing processors that need less power, cooling systems that reuse the same water, and software that runs AI models with far fewer calculations. Some centers even use their waste heat to warm nearby homes. The difficulty is that greater efficiency often leads to greater use: when computing becomes cheaper, people simply do more of it.\n\nIn conclusion, I believe that renewable energy would make the bigger difference, because it addresses the emissions that cause climate change, whatever the level of demand. Efficiency is valuable, but its benefits may be canceled out by growth. Governments should insist on clean energy for every new data center, while also supporting research into more efficient technology.",
  },
];

const problemSolutionEssay = judgedTopic({
  id: "writing-a-problem-solution-essay",
  title: t("Writing a Problem-Solution Essay", "写问题解决类议论文"),
  summary: t(
    "Write an essay of 250 to 300 words that explains a problem the task names, proposes two solutions, and judges which would work better.",
    "写一篇 250 到 300 词的议论文：解释题目给出的问题，提出两种解决办法，并判断哪一种效果更好。",
  ),
  intro: t(
    "When tackling urban food waste, a strong problem-solution essay diagnoses the root cause first, tests two concrete remedies along with their real limits, and ends with a reasoned judgment on which one works better.",
    "探讨城市食物浪费这类议题时，好的问题解决类议论文先剖析问题成因，再分别提出两种具体方案并如实点出局限，最后在结尾权衡判断哪一种更有效。",
  ),
  prerequisites: ["writing-an-opinion-essay"],
  encompasses: [{ topic: "writing-an-opinion-essay", weight: 0.4 }],
  criteria: [
    "b2-problem-explained",
    "b2-problem-solutions",
    "b2-problem-drawbacks",
    "b2-problem-judgment",
    "b2-essay-linking",
    "b2-neutral-register",
  ],
  point: {
    id: "problem-solution-essay",
    title: t("A problem, two solutions, a judgment", "一个问题，两种办法，一个判断"),
    explanation: t(
      "A problem-solution essay explains a problem and argues for the best way to deal with it. Plan four paragraphs:\n\n1. **The problem**: say what it is, what causes it and who it affects, with a fact or an example: *As a result, teachers report students who arrive tired.*\n2. **The first solution**: say how it would work and what it would change, then name a limit: *One solution would be to ... However, ...*\n3. **The second solution**: the same, just as fully: *A second solution would be to ... The difficulty is that ...*\n4. **Your judgment**: say which solution would work better, or how the two should be combined, and why: *On balance, I believe the second would work better, because ...*\n\nUse *would* for solutions that do not exist yet: *Students would hand in their phones in the morning.* Keep a neutral, formal tone, with no contractions.\n\n> **Watch out.** Do not list only the benefits of each solution—acknowledge a real drawback for **both** options so your final judgment sounds fair and persuasive.",
      "问题解决类议论文解释一个问题，并论证解决它的最好办法。安排四段：\n\n1. **问题**：说明问题是什么、由什么引起、影响了谁，并给出事实或例子：*As a result, teachers report students who arrive tired.*\n2. **第一种办法**：说明它怎样实施、会带来什么改变，再指出它的局限：*One solution would be to ... However, ...*\n3. **第二种办法**：同样充分地展开：*A second solution would be to ... The difficulty is that ...*\n4. **你的判断**：说明哪种办法效果更好，或者两者应该怎样结合，并说明理由：*On balance, I believe the second would work better, because ...*\n\n描述尚未实施的办法时用 *would*：*Students would hand in their phones in the morning.* 语气中立、正式，不用缩写。\n\n> **注意。** 不要只写办法的好处——**两种**方案都要如实交代现实局限，这样最后的判断才显得客观有说服力。",
    ),
  },
  question: t(
    "Write a problem-solution essay of 250 to 300 words in English. Explain the problem, propose two solutions in separate paragraphs, and judge which would work better.",
    "用英语写一篇 250 到 300 词的问题解决类议论文。解释问题，分段提出两种解决办法，并判断哪一种效果更好。",
  ),
  bank: problemBank,
  limits: { minWords: 220, maxChars: 3200 },
  what: t("problem-solution essay", "问题解决类议论文"),
});

/** topics are the topics of the unit Technology and the Future. */
export const topics: readonly TopicDef[] = [
  ai.topic,
  innovation.topic,
  cyber.topic,
  space.topic,
  transport.topic,
  society.topic,
  prediction.topic,
  making.topic,
  networks.topic,
  ethics.topic,
  transitions.topic,
  wishAndIfOnly,
  problemSolutionEssay,
];

/** vocabulary are the word batches of the unit Technology and the Future. */
export const vocabulary: readonly WordBatch[] = [
  ai.batch,
  innovation.batch,
  cyber.batch,
  space.batch,
  transport.batch,
  society.batch,
  prediction.batch,
  making.batch,
  networks.batch,
  ethics.batch,
  transitions.batch,
];
