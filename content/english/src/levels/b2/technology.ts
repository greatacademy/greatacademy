// B2, unit 8: Technology and the Future. Artificial intelligence, innovation, cybersecurity, space, future transport,
// technology in society, prediction, from idea to product, networks, technology and ethics, and transitions; wish and
// if only; the problem-solution essay. Its other topic, cutting wordiness, already exists.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { interleave, vocabularyTopic, word } from "../words.ts";

const ai = vocabularyTopic({
  id: "b2-words-ai",
  title: t("Artificial Intelligence", "人工智能"),
  summary: t(
    "Automation and automating work; robotics; intelligence and neural networks; chatbots; autonomous machines and sensors; computing and processors; simulations; cyborgs.",
    "自动化；机器人技术；智能和神经网络；聊天机器人；自主机器和传感器；计算和处理器；模拟；半机械人。",
  ),
  prerequisites: ["b1-words-tech-verbs"],
  words: [
    word(
      "automation",
      "the use of machines and computers to do work that people used to do",
      "自动化",
      "{Automation} has replaced many factory jobs.|Simulation Cyborg | The bank is investing in {automation}.|cyborg sensor | {Automation} could make some jobs disappear.|Cyborg Sensor",
      "automobile animation",
      "robotics",
    ),
    word(
      "automate automates automated automating",
      "to make a process work by machines or computers instead of people",
      "使自动化",
      "The company {automated} its warehouse last year.|simulated processed | Many boring tasks can be {automated}.|colonized encrypted | We {automate} the checks with a simple program.|colonize propel",
      "automatic activate",
    ),
    word(
      "robotics",
      "the science of designing and building robots",
      "机器人技术；机器人学",
      "She built a robot for her {robotics} class.|neural lunar | Japan's {robotics} industry builds machines for factories.|neural lunar | Advances in {robotics} have changed surgery.|cyborgs chatbots",
      "robots rhetorics",
      "automation",
    ),
    word(
      "intelligence",
      "the ability to learn, understand and think",
      "智力；智能",
      "Artificial {intelligence} can now write essays.|automation computing | Crows show surprising {intelligence}.|automation robotics | Tests can't measure every kind of {intelligence}.|automation simulation",
      "intelligible diligence",
    ),
    word(
      "neural",
      "connected with the nerves or the brain, or with computer systems that copy them",
      "神经的",
      "A {neural} network learns from millions of examples.|lunar cosmic | The disease damages {neural} pathways in the brain.|autonomous robotic | Scientists study the {neural} activity of mice.|autonomous cosmic",
      "natural neutral",
    ),
    word(
      "chatbot chatbots",
      "a computer program that you can have a conversation with",
      "聊天机器人",
      "The bank's {chatbot} answered my question in seconds.|processor cyborg | Students use {chatbots} to check their grammar.|asteroids cyborgs | I asked the {chatbot} for a recipe.|sensor processor",
      "chatroom robot",
    ),
    word(
      "autonomous",
      "able to work or decide without being controlled by people; governing itself",
      "自主的；自治的",
      "{Autonomous} cars drive without a human driver.|Neural Cosmic | The drone is fully {autonomous}.|neural cosmic | The region is {autonomous} and has its own parliament.|neural robotic",
      "anonymous autumnal",
    ),
    word(
      "sensor sensors",
      "a device that notices heat, light, movement or sound",
      "传感器",
      "The light turns on when the {sensor} detects movement.|chatbot asteroid | Modern cars have dozens of {sensors}.|asteroids cyborgs | A {sensor} measures the temperature of the soil.|chatbot cyborg",
      "censor senator",
      "processor",
    ),
    word(
      "computing",
      "the use or the study of computers",
      "计算；计算机技术",
      "Cloud {computing} lets you store files online.|robotics automation | She has a degree in {computing}.|sensor chatbot | Quantum {computing} could change medicine.|sensor cyborg",
      "commuting competing",
    ),
    word(
      "processor processors",
      "the main part of a computer that does the calculations",
      "处理器",
      "The new phone has a faster {processor}.|sensor chatbot | Video games need powerful {processors}.|sensors chatbots | The {processor} heats up when it works hard.|chatbot simulation",
      "procession professor",
      "sensor",
    ),
    word(
      "simulation simulations",
      "a model of a real situation, often made on a computer, used for study or training",
      "模拟；仿真",
      "Pilots train in a flight {simulation}.|automation robotics | Computer {simulations} predict the storm's path.|cyborgs chatbots | The {simulation} showed how the virus spreads.|automation robotics",
      "stimulation assimilation",
    ),
    word(
      "cyborg cyborgs",
      "a being that is part human and part machine",
      "半机械人；赛博格",
      "In the film, the hero is a {cyborg} with a metal arm.|chatbot sensor | Some say people with smart implants are already {cyborgs}.|chatbots sensors | The {cyborg} could see in the dark.|chatbot processor",
      "cyclone robot",
    ),
  ],
});

const innovation = vocabularyTopic({
  id: "b2-words-innovation",
  title: t("Innovation", "创新"),
  summary: t(
    "Cutting-edge and state-of-the-art technology; obsolete and outdated machines; revolutionary, groundbreaking and disruptive ideas; futuristic and high-tech designs; sophisticated, advanced and primitive tools.",
    "尖端的和最先进的技术；过时的和陈旧的机器；革命性的、开创性的和颠覆性的想法；未来感的和高科技的设计；精密的、先进的和原始的工具。",
  ),
  prerequisites: ["b1-words-inventions"],
  words: [
    word(
      "cutting-edge",
      "the newest and most advanced",
      "尖端的；最前沿的",
      "The lab uses {cutting-edge} technology: nothing in it is more than a year old.|obsolete primitive | They sell {cutting-edge} cameras that most shops won't have until next year.|obsolete primitive | The startup is famous for its {cutting-edge} designs, years ahead of its rivals.|outdated primitive",
      "cutting-room double-edged",
      "state-of-the-art",
    ),
    word(
      "state-of-the-art",
      "using the most modern methods and materials",
      "最先进的",
      "The new hospital has {state-of-the-art} equipment, the best money can buy.|obsolete primitive | The stadium was built last year and is {state-of-the-art}.|obsolete outdated | Their factory is a {state-of-the-art} building full of the latest robots.|primitive obsolete",
      "work-of-art state-of-mind",
      "cutting-edge",
    ),
    word(
      "obsolete",
      "no longer used because something newer exists",
      "过时的；淘汰的",
      "Fax machines are now almost {obsolete}: hardly anyone uses them.|futuristic groundbreaking | Smartphones have made paper maps {obsolete} for many people.|futuristic sophisticated | The factory's machines were {obsolete}, so no one could find spare parts.|futuristic groundbreaking",
      "absolute obscene",
      "outdated",
    ),
    word(
      "outdated",
      "old-fashioned and no longer useful",
      "过时的；陈旧的",
      "The school's computers are {outdated}; they are fifteen years old.|futuristic groundbreaking | These {outdated} laws were written for a world without the internet.|futuristic groundbreaking | His ideas about women are {outdated}; hardly anyone thinks like that anymore.|futuristic disruptive",
      "updated outdone",
      "obsolete",
    ),
    word(
      "revolutionary",
      "completely new and causing great change",
      "革命性的",
      "The printing press was a {revolutionary} invention that changed the world.|obsolete primitive | Her ideas were {revolutionary} at the time, and many people were shocked.|obsolete primitive | It is a {revolutionary} new treatment that could cure the disease.|obsolete outdated",
      "evolutionary revolving",
      "groundbreaking",
    ),
    word(
      "groundbreaking",
      "making new discoveries; very new and important",
      "开创性的；突破性的",
      "The {groundbreaking} study changed how we treat cancer.|obsolete primitive | Her work on genes was {groundbreaking} and won her a Nobel Prize.|obsolete outdated | The film used {groundbreaking} special effects that no one had seen before.|obsolete outdated",
      "heartbreaking backbreaking",
      "revolutionary",
    ),
    word(
      "disruptive",
      "causing problems that stop something from working normally; changing an industry completely",
      "破坏性的；颠覆性的",
      "The streaming service was {disruptive} for the music industry and forced record shops to close.|primitive obsolete | His {disruptive} behavior annoyed the teacher.|primitive obsolete | Strikes are {disruptive} for travelers.|primitive sophisticated",
      "destructive distinctive",
    ),
    word(
      "futuristic",
      "very modern and strange, as if from the future",
      "未来派的；极具未来感的",
      "The new museum has a {futuristic} design that looks like a spaceship.|obsolete primitive | The car looks {futuristic}, like something from a science-fiction film.|obsolete outdated | The film shows a {futuristic} city in 2200.|obsolete outdated",
      "fatalistic realistic",
      "high-tech",
    ),
    word(
      "high-tech",
      "using the most modern technology",
      "高科技的",
      "Shenzhen is full of {high-tech} companies that make phones and drones.|primitive obsolete | The house has a {high-tech} kitchen where the fridge orders food by itself.|primitive obsolete | {High-tech} jobs in software pay well.|Primitive Obsolete",
      "high-rise low-key",
      "futuristic",
    ),
    word(
      "sophisticated",
      "complex and advanced; having a lot of experience of the world",
      "精密的；老练的",
      "The bank uses {sophisticated} software that learns from every attack to catch fraud.|primitive obsolete | She is a {sophisticated} young woman who has lived in five countries.|primitive obsolete | The thieves used a {sophisticated} method that fooled the police for years.|primitive obsolete",
      "sophomore complicated",
      "advanced",
    ),
    word(
      "advanced",
      "modern and developed; at a high level",
      "先进的；高级的",
      "The country has very {advanced} medicine, and people live long lives.|primitive obsolete | She is in the {advanced} class because she learns fast.|primitive obsolete | The rocket uses {advanced} engines designed this year.|primitive obsolete",
      "advance adventure",
      "sophisticated",
    ),
    word(
      "primitive",
      "very simple and not developed; belonging to an early stage",
      "原始的；简陋的",
      "Early humans used {primitive} stone tools.|futuristic sophisticated | The cabin had only {primitive} toilets: just a hole in the ground.|futuristic sophisticated | The first computers look {primitive} today.|futuristic sophisticated",
      "private positive",
    ),
  ],
});

const cyber = vocabularyTopic({
  id: "b2-words-cyber",
  title: t("Cybersecurity", "网络安全"),
  summary: t(
    "Cybersecurity; encryption and encrypting data; breaches, malware and phishing; firewalls; surveillance; authenticating users and biometric checks; loopholes; hacking.",
    "网络安全；加密和对数据加密；数据泄露、恶意软件和网络钓鱼；防火墙；监控；验证用户身份和生物识别检查；漏洞；黑客攻击。",
  ),
  prerequisites: ["b1-words-online-safety"],
  words: [
    word(
      "cybersecurity",
      "the protection of computers and data from attacks",
      "网络安全",
      "Banks spend millions on {cybersecurity}.|phishing malware | She works in {cybersecurity}, protecting companies from attacks.|malware phishing | Weak {cybersecurity} put patients' data at risk.|malware phishing",
      "cyberspace security",
    ),
    word(
      "encryption",
      "changing data into a code so that others cannot read it",
      "加密",
      "The app uses {encryption} to protect your messages.|phishing malware | Without {encryption}, anyone could read your emails.|phishing surveillance | Strong {encryption} keeps the data safe.|malware phishing",
      "inscription description",
      "encrypt",
    ),
    word(
      "encrypt encrypts encrypted encrypting",
      "to change data into a code so that others cannot read it",
      "加密",
      "Always {encrypt} files before you send them.|hack breach | The messages are {encrypted}, so only you can read them.|hacked breached | The software {encrypts} your passwords to keep them safe.|hacks breaches",
      "encrust decrypt",
      "encryption",
    ),
    word(
      "breach breaches",
      "an act of breaking a law or an agreement; a break in security",
      "违反；（安全）漏洞",
      "A data {breach} exposed millions of passwords.|firewall loophole | That is a {breach} of contract.|firewall loophole | Security {breaches} have exposed the data of millions.|firewalls sensors",
      "breech bleach",
      "loophole",
    ),
    word(
      "malware",
      "software made to damage a computer or steal data",
      "恶意软件",
      "The email contained {malware}.|encryption cybersecurity | {Malware} can steal your bank details.|Encryption Firewall | Install software that removes {malware}.|encryption firewall",
      "hardware maltreat",
      "phishing",
    ),
    word(
      "phishing",
      "trying to trick people into giving passwords or bank details, for example with false emails",
      "网络钓鱼",
      "Don't click the link: it's a {phishing} email.|encryption firewall | {Phishing} attacks often pretend to come from banks.|Encryption Firewall | Train staff to recognize {phishing}.|encryption biometric",
      "fishing polishing",
      "malware",
    ),
    word(
      "firewall firewalls",
      "a program that protects a computer network from attacks",
      "防火墙",
      "The {firewall} blocked the attack.|loophole breach | Make sure your {firewall} is turned on.|loophole breach | Companies use {firewalls} to protect their networks.|loopholes breaches",
      "fireworks firewood",
    ),
    word(
      "surveillance",
      "watching people or places carefully, often secretly",
      "监视；监控",
      "The city is under constant {surveillance}.|encryption malware | {Surveillance} cameras are everywhere.|Encryption Malware | Critics fear mass {surveillance} of citizens.|encryption malware",
      "survival relevance",
    ),
    word(
      "authenticate authenticates authenticated authenticating",
      "to prove that something or someone is real or genuine",
      "验证；鉴定",
      "Use your fingerprint to {authenticate}.|hack breach | Experts {authenticated} the painting.|hacked breached | The app {authenticates} every user before they can log in.|hacks breaches",
      "authentic automate",
      "encrypt",
    ),
    word(
      "biometric",
      "using measurements of the body, such as fingerprints or the face, to identify people",
      "生物识别的",
      "The airport uses {biometric} passport checks.|phishing malware | {Biometric} data includes fingerprints and face scans.|Phishing Malware | Some phones have {biometric} locks.|phishing malware",
      "biology geometric",
    ),
    word(
      "loophole loopholes",
      "a mistake in a law or a rule that lets people avoid it",
      "漏洞",
      "The company used a {loophole} to avoid paying tax.|firewall malware | The government closed the {loophole}.|firewall malware | There are {loopholes} in the new law.|firewalls sensors",
      "porthole keyhole",
      "breach",
    ),
    word(
      "hack hacks hacked hacking",
      "to get into someone's computer system without permission",
      "黑客入侵",
      "Someone {hacked} my email account and sent messages to all my friends.|encrypted authenticated | {Hacking} into a computer is a crime.|Encrypting Authenticating | Criminals try to {hack} bank systems.|encrypt authenticate",
      "hock haggle",
    ),
  ],
});

const space = vocabularyTopic({
  id: "b2-words-space-future",
  title: t("Space and the Future", "太空与未来"),
  summary: t(
    "Colonizing other planets and colonization; habitable exoplanets; asteroids and shuttles; weightless astronauts; lunar and Martian landscapes; cosmic rays; extraterrestrial life; propulsion.",
    "殖民其他星球；宜居的系外行星；小行星和航天飞机；失重的宇航员；月球和火星的地貌；宇宙射线；外星生命；推进力。",
  ),
  prerequisites: ["b1-words-space-2"],
  words: [
    word(
      "colonize colonizes colonized colonizing",
      "to take control of a place and send people to live there",
      "殖民；移居",
      "Will humans ever {colonize} Mars?|propel encrypt | Britain {colonized} many countries in the past.|propelled orbited | Plants quickly {colonized} the island after the volcano.|propelled orbited",
      "colonel colorize",
      "colonization",
    ),
    word(
      "colonization",
      "taking control of a place and sending people to live there",
      "殖民（化）",
      "The {colonization} of Mars may begin this century.|propulsion asteroid | The country suffered under {colonization}.|propulsion asteroid | Space {colonization} raises many ethical questions.|propulsion shuttle",
      "civilization colonnade",
      "colonize",
    ),
    word(
      "habitable",
      "good enough for people to live in",
      "适合居住的",
      "Scientists are looking for {habitable} planets.|lunar weightless | The old house is no longer {habitable}.|lunar weightless | Only a small part of the island is {habitable}.|lunar cosmic",
      "habitual inhabited",
    ),
    word(
      "exoplanet exoplanets",
      "a planet that goes around a star other than the sun",
      "系外行星",
      "Astronomers have found over 5,000 {exoplanets} around other stars.|shuttles cyborgs | The {exoplanet} is about the size of Earth.|shuttle propulsion | Some {exoplanets} may have water.|shuttles cyborgs",
      "explanation planet",
      "asteroid",
    ),
    word(
      "asteroid asteroids",
      "a large rock that moves around the sun",
      "小行星",
      "An {asteroid} may have killed the dinosaurs.|exoplanet shuttle | The {asteroid} will pass close to Earth.|exoplanet propulsion | Companies want to mine {asteroids} for metals.|shuttles exoplanets",
      "steroid asterisk",
      "exoplanet",
    ),
    word(
      "shuttle shuttles",
      "a spacecraft that can go into space and come back; a vehicle that makes short trips between two places",
      "航天飞机；（往返）班车",
      "The space {shuttle} carried seven astronauts.|asteroid exoplanet | A free {shuttle} bus runs to the airport.|asteroid propulsion | {Shuttles} leave every twenty minutes.|Asteroids Exoplanets",
      "shuffle shutter",
    ),
    word(
      "weightless",
      "having no weight, as in space",
      "失重的",
      "Astronauts are {weightless} in orbit.|habitable lunar | It feels strange to be {weightless}.|habitable lunar | In the {weightless} cabin, water floats in balls.|habitable lunar",
      "weighty wireless",
    ),
    word(
      "lunar",
      "connected with the moon",
      "月球的；月亮的",
      "The {lunar} landing took place in 1969.|Martian habitable | The festival follows the {lunar} calendar.|Martian cosmic | Rocks from the {lunar} surface are gray.|Martian cosmic",
      "solar lunatic",
      "Martian",
    ),
    word(
      "Martian",
      "connected with the planet Mars; an imagined creature from Mars",
      "火星的；火星人",
      "The {Martian} soil is red with iron.|lunar habitable | The rover sent pictures of the {Martian} landscape.|lunar habitable | In the story, a {Martian} lands in New York.|lunar cosmic",
      "martial Marathon",
      "lunar",
    ),
    word(
      "cosmic",
      "connected with the whole universe; very great",
      "宇宙的；巨大的",
      "{Cosmic} rays are dangerous for astronauts.|Lunar Martian | The telescope studies {cosmic} dust.|lunar habitable | It was a mistake of {cosmic} proportions.|lunar habitable",
      "comic cosmetic",
    ),
    word(
      "extraterrestrial",
      "from somewhere other than the earth",
      "外星的；地球外的",
      "Is there {extraterrestrial} life?|lunar habitable | The film is about an {extraterrestrial} who makes friends with a boy.|asteroid exoplanet | Scientists listen for {extraterrestrial} signals.|lunar habitable",
      "terrestrial extraordinary",
    ),
    word(
      "propulsion",
      "the force that pushes something forward",
      "推进（力）",
      "The rocket uses a new kind of {propulsion}.|colonization simulation | Jet {propulsion} made fast air travel possible.|colonization asteroid | Nuclear {propulsion} could take us to Mars faster.|colonization asteroid",
      "promotion repulsion",
    ),
  ],
});

const transport = vocabularyTopic({
  id: "b2-words-transport-future",
  title: t("Future Transport", "未来交通"),
  summary: t(
    "Self-driving cars and autopilot; infrastructure and high-speed rail; ride-sharing and carpooling; scooters and pedaling; navigation and navigating; commuters; logistics.",
    "自动驾驶汽车和自动驾驶仪；基础设施和高速铁路；拼车和合乘；滑板车和踩踏板；导航；通勤者；物流。",
  ),
  prerequisites: ["b1-words-getting-around"],
  words: [
    word(
      "self-driving",
      "able to drive without a human driver",
      "自动驾驶的",
      "{Self-driving} taxis already carry passengers in some cities, with nobody at the wheel.|High-speed Ride-sharing | The {self-driving} car stopped by itself at the red light.|high-speed ride-sharing | Who is to blame when a {self-driving} truck crashes with no driver inside?|high-speed ride-sharing",
      "self-made test-driving",
      "autopilot",
    ),
    word(
      "infrastructure",
      "the basic systems a country needs, such as roads, railways, power and water",
      "基础设施",
      "The country is spending billions on roads, bridges and other {infrastructure}.|logistics navigation | Electric cars need charging {infrastructure}.|logistics autopilot | The storm damaged the city's {infrastructure}, cutting power and water.|logistics navigation",
      "superstructure instruction",
    ),
    word(
      "high-speed",
      "moving or working very fast",
      "高速的",
      "The {high-speed} train goes from Beijing to Shanghai in four and a half hours.|ride-sharing obsessed | We need {high-speed} internet for video calls.|self-driving ride-sharing | China has the world's longest {high-speed} rail network.|ride-sharing obsessed",
      "high-rise speedy",
    ),
    word(
      "ride-sharing",
      "an arrangement in which people share a car journey, often booked through an app",
      "拼车（服务）",
      "{Ride-sharing} apps let strangers share a taxi and split the fare.|High-speed Self-driving | She uses a {ride-sharing} service to get to work with two neighbors.|high-speed self-driving | {Ride-sharing} can mean fewer cars on the road, because each one carries more people.|High-speed Self-driving",
      "time-sharing ride-on",
      "carpool",
    ),
    word(
      "scooter scooters",
      "a small vehicle with two wheels that you stand on, often with an electric motor",
      "滑板车；小型摩托车",
      "Electric {scooters} are everywhere in the city center.|commuters pedals | He rides a {scooter} to school.|commuter pedal | You can rent a {scooter} with an app and leave it anywhere.|commuter pedal",
      "scooper shooter",
    ),
    word(
      "autopilot",
      "a system that flies a plane or drives a vehicle without a human controlling it",
      "自动驾驶仪",
      "The plane was flying on {autopilot} while the pilots ate lunch.|logistics infrastructure | The car's {autopilot} keeps it in the middle of the lane.|logistics infrastructure | I was so tired that I did the whole day on {autopilot}.|logistics infrastructure",
      "autograph copilot",
      "self-driving",
    ),
    word(
      "navigation",
      "finding your way, or the systems that help you do it",
      "导航",
      "The car's {navigation} system found a faster route.|infrastructure logistics | Ancient sailors used the stars for {navigation}.|infrastructure autopilot | Satellite {navigation} has made paper maps less common.|logistics autopilot",
      "negotiation nation",
      "navigate",
    ),
    word(
      "navigate navigates navigated navigating",
      "to find your way to a place; to deal with something difficult",
      "导航；应对",
      "Bees {navigate} by the sun.|pedal carpool | She {navigated} the narrow streets without a map.|pedaled carpooled | New students must learn to {navigate} the university's rules.|pedal carpool",
      "negotiate nominate",
      "navigation",
    ),
    word(
      "commuter commuters",
      "a person who travels some distance to work every day",
      "通勤者",
      "The train was full of {commuters} going to work.|scooters pedals | Most {commuters} in the city take the subway.|scooters logistics | As a {commuter}, she spends two hours a day on the bus.|scooter pedal",
      "computer community",
    ),
    word(
      "pedal pedals pedaled pedaling",
      "to push the parts of a bicycle with your feet to make it move; one of these parts",
      "踩踏板；踏板",
      "She {pedaled} hard up the hill.|navigated carpooled | Push the {pedal} to make the car go faster.|scooter commuter | He was {pedaling} so fast that his legs hurt.|navigating carpooling",
      "peddle petal",
    ),
    word(
      "carpool carpools carpooled carpooling",
      "to share a car journey with others who are going to the same place; a group that does this",
      "拼车；合伙用车",
      "Four parents {carpool} to take the children to school.|navigate isolate | We {carpooled} to save money on gas.|navigated isolated | {Carpooling} lanes are only for cars with two or more people.|Pedaling Navigating",
      "car park carport",
      "ride-sharing",
    ),
    word(
      "logistics",
      "the planning and organizing of moving goods or people",
      "物流；后勤",
      "The company's {logistics} team plans every delivery.|infrastructure navigation | Drones could change the {logistics} of delivering packages.|infrastructure autopilot | The {logistics} of moving a thousand people are complicated.|navigation autopilot",
      "logic statistics",
    ),
  ],
});

const society = vocabularyTopic({
  id: "b2-words-tech-in-society",
  title: t("Technology in Society", "社会中的技术"),
  summary: t(
    "Dependence on phones and being dependent; accessibility and accessible design; connectivity; obsessions and being obsessed; technology that isolates; convenience, convenient and inconvenient; intrusive apps.",
    "对手机的依赖；无障碍和便于使用的设计；连接性；痴迷；使人孤立的技术；便利、方便的和不方便的；侵扰性的应用。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "dependence",
      "needing something or someone so much that you cannot manage without it",
      "依赖",
      "Our {dependence} on smartphones is growing.|convenience connectivity | The country wants to reduce its {dependence} on imported oil.|accessibility connectivity | {Dependence} on painkillers can be dangerous.|Accessibility Connectivity",
      "independence dependency",
      "dependent",
    ),
    word(
      "dependent",
      "needing something or someone to survive or to work",
      "依赖的",
      "Many people are {dependent} on their phones and panic without them.|convenient accessible | The town is {dependent} on tourism for jobs.|accessible intrusive | Young children are {dependent} on their parents.|accessible intrusive",
      "independent dependable",
      "dependence",
    ),
    word(
      "accessibility",
      "how easy something is for everyone to reach, use or understand, including disabled people",
      "无障碍；可及性",
      "The website was redesigned for {accessibility}, so blind users can read it.|dependence connectivity | Ramps improve {accessibility} for wheelchair users.|dependence obsession | The {accessibility} of the park has improved since the new bus line opened.|dependence obsession",
      "possibility accessory",
      "accessible",
    ),
    word(
      "accessible",
      "easy to reach, enter or use; easy to understand",
      "可到达的；易使用的；易懂的",
      "The station is {accessible} to wheelchair users.|dependent intrusive | Her book makes physics {accessible} to young readers.|dependent intrusive | The island is only {accessible} by boat.|dependent obsessed",
      "acceptable accessory",
      "accessibility",
    ),
    word(
      "connectivity",
      "the ability to connect to the internet or to other computers",
      "连接性；联网能力",
      "Rural areas often have poor {connectivity}.|dependence obsession | The new phone offers better {connectivity} underground.|dependence obsession | Wi-Fi {connectivity} on trains is improving.|dependence obsession",
      "conductivity creativity",
    ),
    word(
      "obsession obsessions",
      "a thing or a person that you think about all the time",
      "痴迷；困扰",
      "His {obsession} with video games worried his parents.|connectivity accessibility | Checking likes has become an {obsession} for many teenagers.|accessibility connectivity | She has two {obsessions}: football and chess.|dependences conveniences",
      "possession objection",
      "obsessed",
    ),
    word(
      "obsessed",
      "thinking about something or someone all the time",
      "着迷的；痴迷的",
      "He is {obsessed} with his phone and checks it every minute.|accessible convenient | She became {obsessed} with fitness.|accessible convenient | Why are people so {obsessed} with celebrities?|accessible inconvenient",
      "possessed obsolete",
      "obsession",
    ),
    word(
      "isolate isolates isolating",
      "to separate someone from other people",
      "使孤立；隔离",
      "Spending all day online can {isolate} young people from their friends.|depend access | Doctors {isolate} patients with the virus so that it doesn't spread.|depend obsess | Working from home is {isolating} for some people.|depending accessing",
      "insulate violate",
    ),
    word(
      "convenience",
      "being easy, useful or suitable; something that makes life easier",
      "便利；方便",
      "People shop online for {convenience}.|dependence accessibility | Please reply at your earliest {convenience}.|dependence obsession | Dishwashers are a modern {convenience}.|dependence obsession",
      "convenient conference",
      "convenient",
    ),
    word(
      "convenient",
      "easy, useful or suitable; near and easy to reach",
      "方便的；便利的",
      "Online banking is {convenient} because you can do it from home.|inconvenient intrusive | The hotel is in a {convenient} spot next to the station.|inconvenient intrusive | Is Friday {convenient} for you? It suits me well.|inconvenient intrusive",
      "convent convincing",
      "inconvenient",
    ),
    word(
      "inconvenient",
      "causing problems or difficulties; not at a good time",
      "不方便的",
      "The train strike was very {inconvenient} for commuters.|convenient accessible | Sorry, is this an {inconvenient} time? I can call back later.|accessible convenient | It's {inconvenient} to live so far from the shops.|convenient accessible",
      "incompetent inconsistent",
      "convenient",
    ),
    word(
      "intrusive",
      "entering someone's private life in an unwelcome way",
      "侵扰的；打扰的",
      "The app asks {intrusive} questions about your health and family.|accessible convenient | Many people find targeted ads {intrusive}.|accessible convenient | Reporters were criticized for their {intrusive} photos of the grieving family.|accessible convenient",
      "intuitive inclusive",
    ),
  ],
});

const prediction = vocabularyTopic({
  id: "b2-words-prediction",
  title: t("Prediction", "预测"),
  summary: t(
    "Predictions and projections; anticipating, foreseeing and envisaging the future; speculation; likelihood, probability and odds; likely and unlikely; uncertainty.",
    "预测和推算；预料、预见和设想未来；猜测；可能性、概率和机会；可能的和不太可能的；不确定性。",
  ),
  prerequisites: ["b2-words-the-future"],
  words: [
    word(
      "prediction predictions",
      "a statement about what will happen in the future",
      "预测；预言",
      "His {prediction} that the team would lose was correct.|uncertainty likelihood | Experts made {predictions} about the election, and most were wrong.|uncertainties odds | The weather service's {predictions} are usually accurate.|uncertainties odds",
      "production prescription",
      "projection",
    ),
    word(
      "anticipate anticipates anticipated anticipating",
      "to expect something and prepare for it",
      "预期；预料",
      "We {anticipate} heavy traffic, so we'll leave early.|refine iterate | Nobody {anticipated} such a big crowd, so there weren't enough chairs.|refined iterated | A good chess player {anticipates} the other player's moves.|refines iterates",
      "participate antagonize",
      "foresee",
    ),
    word(
      "foresee foresees foresaw foreseen foreseeing",
      "to know that something will happen before it does",
      "预见；预知",
      "No one could have {foreseen} the crisis.|refined assembled | She {foresaw} the problem and solved it in advance.|iterated assembled | I don't {foresee} any difficulties with the plan.|iterate assemble",
      "forgive oversee",
      "anticipate envisage",
    ),
    word(
      "speculation",
      "guessing about something without knowing all the facts",
      "猜测；推测",
      "There is a lot of {speculation} about who will be the next coach, but nobody knows.|likelihood probability | The story is pure {speculation}: there is no evidence for it.|probability likelihood | {Speculation} grew that the singer would retire.|Probability Likelihood",
      "spectacle specification",
    ),
    word(
      "likelihood",
      "how probable it is that something will happen",
      "可能性",
      "What is the {likelihood} of rain tomorrow?|speculation uncertainty | Smoking increases the {likelihood} of cancer.|speculation uncertainty | In all {likelihood}, the meeting will be canceled.|speculation uncertainty",
      "livelihood likeness",
      "probability",
    ),
    word(
      "probability probabilities",
      "how likely something is to happen, often as a number",
      "概率；可能性",
      "The {probability} of throwing a six is one in six.|speculation uncertainty | There is a high {probability} that prices will rise.|speculation projection | In math class, we calculated {probabilities} with dice.|speculations uncertainties",
      "possibility profitability",
      "likelihood odds",
    ),
    word(
      "unlikely",
      "not probable; not expected to happen",
      "不太可能的",
      "It's {unlikely} to rain today; the sky is completely clear.|likely obvious | He is {unlikely} to win, because he has never won a race.|likely certain | In the {unlikely} event of a fire, use the stairs.|certain obvious",
      "unlike unlucky",
    ),
    word(
      "likely",
      "probable; expected to happen",
      "可能的",
      "It's {likely} to rain later; look at those dark clouds.|unlikely uncertain | She is the most {likely} person to get the job: she has the most experience.|unlikely uncertain | Prices are {likely} to rise again next year, as they have every year.|unlikely uncertain",
      "lovely lively",
    ),
    word(
      "uncertainty uncertainties",
      "a situation in which something is not known or not sure",
      "不确定性",
      "There is great {uncertainty} about the future of the company.|likelihood probability | The {uncertainties} of war made people afraid.|probabilities projections | After weeks of {uncertainty}, the results were finally announced.|likelihood probability",
      "certainty unsteadiness",
    ),
    word(
      "envisage envisages envisaged envisaging",
      "to imagine what will happen or what something will be like in the future",
      "设想；展望",
      "The architects {envisage} a city with no cars.|refine assemble | I can't {envisage} living anywhere else.|refining assembling | The plan {envisages} ten new schools by 2035.|refines assembles",
      "envy visit",
      "foresee",
    ),
    word(
      "projection projections",
      "a calculation of what will probably happen, based on what is happening now",
      "预测；推算",
      "Population {projections} show the city doubling in size.|speculations uncertainties | Sales were higher than the {projection}.|uncertainty likelihood | The {projections} suggest that sea levels will rise.|speculations uncertainties",
      "protection production",
      "prediction",
    ),
    word(
      "odds",
      "how likely something is, often expressed as a ratio",
      "可能性；胜算",
      "The {odds} of winning the lottery are tiny.|uncertainty speculation | Against all the {odds}, the small team won the cup.|uncertainty likelihood | What are the {odds} that he'll be late again?|speculation uncertainty",
      "ends adds",
      "probability",
    ),
  ],
});

const making = vocabularyTopic({
  id: "b2-words-making-things",
  title: t("From Idea to Product", "从创意到产品"),
  summary: t(
    "Blueprints and specifications; feasible plans and feasibility; iterating and refining a design; commercializing it; components, assembling and assembly; mechanisms; ingenious ideas.",
    "蓝图和规格；可行的计划和可行性；迭代和完善设计；将其商业化；零部件、组装和装配；机制；巧妙的想法。",
  ),
  prerequisites: ["b1-words-research-and-design"],
  words: [
    word(
      "blueprint blueprints",
      "a detailed plan for a building or a machine; a plan for achieving something",
      "蓝图；规划",
      "The architect showed us the {blueprints} for the new library.|mechanisms components | The report offers a {blueprint} for cutting crime.|component assembly | Engineers studied the {blueprint} before building the engine.|assembly feasibility",
      "fingerprint footprint",
      "specification",
    ),
    word(
      "specification specifications",
      "a detailed description of how something should be made or what it must do",
      "规格；说明书",
      "The phone was built to exact {specifications}.|mechanisms assemblies | The technical {specifications} list the screen size and battery life.|mechanisms assemblies | The bridge doesn't meet the safety {specifications}.|mechanisms assemblies",
      "speculation specialization",
      "blueprint",
    ),
    word(
      "feasible",
      "possible and practical to do",
      "可行的",
      "Is it {feasible} to build a bridge across the bay?|ingenious compatible | The plan is technically {feasible} but too expensive.|obsessed intrusive | It isn't {feasible} to finish by Friday; we need another week.|ingenious compatible",
      "visible flexible",
      "feasibility",
    ),
    word(
      "feasibility",
      "how possible and practical something is",
      "可行性",
      "They did a {feasibility} study before building the airport.|blueprint mechanism | We doubt the {feasibility} of the plan.|assembly specification | Engineers are testing the {feasibility} of a tunnel under the sea.|assembly blueprint",
      "flexibility visibility",
      "feasible",
    ),
    word(
      "iterate iterates iterated iterating",
      "to repeat a process, improving it each time",
      "迭代；反复",
      "The team {iterates} quickly, releasing a new version every week.|assembles commercializes | We {iterated} on the design ten times before it was right.|assembled commercialized | Good designers keep {iterating} until users are happy.|assembling commercializing",
      "irritate imitate",
      "refine",
    ),
    word(
      "refine refines refined refining",
      "to improve something by making small changes; to make a substance pure",
      "完善；提炼",
      "She {refined} her essay until every sentence was clear.|assembled commercialized | Oil is {refined} to make gasoline.|iterated commercialized | The engineers are {refining} the design to make it lighter.|commercializing envisaging",
      "define confine",
      "iterate",
    ),
    word(
      "commercialize commercializes commercialized commercializing",
      "to sell something to make a profit; to make something more about money",
      "使商业化",
      "The university hopes to {commercialize} its new battery.|isolate pedal | Christmas has become very {commercialized}.|iterated refined | The company took ten years to {commercialize} the invention.|isolate pedal",
      "commercial criticize",
    ),
    word(
      "component components",
      "one of the parts that a machine or system is made of",
      "部件；组成部分",
      "The factory makes {components} for cars.|feasibilities projections | Trust is a key {component} of any friendship.|blueprint specification | The phone has over a thousand {components}.|feasibilities projections",
      "opponent competent",
      "mechanism",
    ),
    word(
      "assemble assembles assembled assembling",
      "to put the parts of something together; to come together in one place",
      "组装；集合",
      "You {assemble} the furniture yourself.|iterate commercialize | A crowd {assembled} outside the palace.|iterated commercialized | Robots are {assembling} the cars.|iterating commercializing",
      "resemble assume",
      "assembly",
    ),
    word(
      "assembly assemblies",
      "putting the parts of something together; a meeting of many people",
      "装配；集会",
      "The cars move along the {assembly} line.|feasibility specification | The school holds an {assembly} every Monday morning.|feasibility specification | Easy {assembly}: no tools needed.|feasibility mechanism",
      "assembler ascent",
      "assemble",
    ),
    word(
      "mechanism mechanisms",
      "the parts of a machine that work together; a way of doing something",
      "机械装置；机制",
      "The clock's {mechanism} is made of tiny gears.|feasibility blueprint | The government needs a {mechanism} for handling complaints.|feasibility likelihood | The lock has a simple {mechanism}.|feasibility specification",
      "mechanic organism",
      "component",
    ),
    word(
      "ingenious",
      "very clever and original",
      "巧妙的；有独创性的",
      "The {ingenious} little robot can climb walls like a gecko.|feasible compatible | He found a really {ingenious} way to fix the leak with a balloon.|feasible compatible | The {ingenious} design folds into a small box.|feasible compatible",
      "ingenuous genius",
    ),
  ],
});

const networks = vocabularyTopic({
  id: "b2-words-networks",
  title: t("Networks", "网络"),
  summary: t(
    "Telecommunications and broadband; transmitting signals and transmission; frequencies and antennas; streaming and latency; servers, databases and interfaces; compatible devices.",
    "电信和宽带；发送信号和传输；频率和天线；流媒体和延迟；服务器、数据库和界面；兼容的设备。",
  ),
  prerequisites: ["b1-words-gadgets"],
  words: [
    word(
      "telecommunications",
      "sending information over long distances by phone, radio, the internet and so on",
      "电信",
      "She works for a {telecommunications} company that builds phone networks.|latency streaming | The storm cut {telecommunications} across the region, so no one could call for help.|latency streaming | {Telecommunications} have changed how the world does business.|Latencies Frequencies",
      "telescope communities",
    ),
    word(
      "broadband",
      "a fast connection to the internet",
      "宽带",
      "Every home in the village now has {broadband}.|latency frequency | We pay for {broadband} by the month.|latency transmission | Fast {broadband} lets you watch films without waiting.|latency frequency",
      "broadcast headband",
    ),
    word(
      "transmit transmits transmitted transmitting",
      "to send a signal, a message or a disease from one place or person to another",
      "传输；传播",
      "The match was {transmitted} live around the world.|refined iterated | Mosquitoes {transmit} malaria.|stream iterate | The satellite is {transmitting} pictures of the storm.|refining iterating",
      "transform transit",
      "transmission",
    ),
    word(
      "transmission",
      "sending out a signal or a program; passing a disease from one to another",
      "传输；播送；传播",
      "The {transmission} was interrupted by the storm.|latency frequency | Masks reduce the {transmission} of the virus.|latency frequency | Radio {transmission} from the ship stopped at midnight.|latency interface",
      "transition admission",
      "transmit",
    ),
    word(
      "frequency frequencies",
      "the rate at which something happens; the rate at which a radio wave repeats",
      "频率；频繁",
      "The station broadcasts on a {frequency} of 98.6 MHz.|latency antenna | Storms are increasing in {frequency}.|latency interface | Dogs can hear sounds at very high {frequencies}.|latencies antennas",
      "frequent fluency",
    ),
    word(
      "antenna antennas",
      "a wire or a rod that sends or receives radio signals",
      "天线",
      "The car's {antenna} picks up radio signals.|server database | Phone {antennas} stand on top of the building.|servers databases | Move the {antenna} for a clearer picture.|database interface",
      "anthem antler",
    ),
    word(
      "streaming",
      "watching or listening to video or music online without downloading it",
      "流媒体；在线播放",
      "Most people watch films on {streaming} services now.|latency frequency | {Streaming} has replaced CDs for most music fans.|Latency Frequency | Live {streaming} of the concert was watched by millions.|latency broadband",
      "steaming screaming",
    ),
    word(
      "latency",
      "the delay before data arrives after it is sent",
      "延迟",
      "Online gamers want low {latency}, because every millisecond counts.|frequency bandwidth | High {latency} makes video calls freeze.|frequency broadband | The new network cuts {latency} to almost zero.|frequency broadband",
      "laziness tendency",
    ),
    word(
      "server servers",
      "a computer that stores data and runs programs for other computers on a network",
      "服务器",
      "The website crashed because the {server} was overloaded.|antenna interface | The company's {servers} are in a cold building in the north.|antennas interfaces | All the emails are stored on the {server}.|antenna interface",
      "service waiter",
      "database",
    ),
    word(
      "database databases",
      "a large store of information kept on a computer",
      "数据库",
      "The police checked his fingerprints against their {database}.|antenna interface | The library has a {database} of old newspapers.|frequency latency | Hackers stole names from the customer {database}.|antenna interface",
      "data base databank",
      "server",
    ),
    word(
      "interface interfaces",
      "the way a user works with a computer program; a point where two things meet",
      "界面；接口",
      "The app has a clean, simple {interface}.|antenna server | The new {interface} is much easier to use.|latency frequency | Voice {interfaces} let you control the TV by speaking.|antennas servers",
      "interference surface",
    ),
    word(
      "compatible",
      "able to work together; able to live or work together without problems",
      "兼容的；合得来的",
      "Is this charger {compatible} with my phone?|feasible ingenious | The software isn't {compatible} with older computers.|feasible ingenious | They broke up because they weren't {compatible}.|feasible ingenious",
      "comparable compassionate",
    ),
  ],
});

const ethics = vocabularyTopic({
  id: "b2-words-tech-ethics",
  title: t("Technology and Ethics", "科技与伦理"),
  summary: t(
    "Accountability and being accountable; misusing technology; discriminatory algorithms; unintended effects; oversight; liability and being liable; acting ethically; manipulative and exploitative design; trustworthy systems.",
    "问责和负有责任；滥用技术；歧视性的算法；意外的后果；监督；法律责任和负有法律责任；合乎伦理地行事；操纵性的和剥削性的设计；可信赖的系统。",
  ),
  prerequisites: ["b2-words-ethics"],
  words: [
    word(
      "accountability",
      "being responsible for what you do and having to explain it",
      "问责；责任",
      "There must be {accountability} when a self-driving car kills someone.|stagnation latency | The public demands more {accountability} from tech companies.|stagnation latency | Without {accountability}, leaders can do what they like.|stagnation momentum",
      "accessibility account",
      "accountable liability",
    ),
    word(
      "accountable",
      "responsible for your actions and expected to explain them",
      "负有责任的",
      "Companies must be held {accountable} for their algorithms.|trustworthy manipulative | Who is {accountable} for this mistake?|trustworthy unintended | Ministers are {accountable} to parliament.|unintended trustworthy",
      "accountant countable",
      "liable",
    ),
    word(
      "misuse misuses misused misusing",
      "to use something in a wrong or harmful way",
      "滥用；误用",
      "The company {misused} its customers' data.|assembled modernized | Some apps {misuse} your location to sell ads.|assemble modernize | He was fired for {misusing} company money.|assembling modernizing",
      "mislead amuse",
    ),
    word(
      "discriminatory",
      "treating people unfairly because of their race, sex, age and so on",
      "歧视性的",
      "The hiring software was {discriminatory}: it rejected most women.|trustworthy accountable | {Discriminatory} laws were finally removed.|Trustworthy Accountable | The bank's lending rules were {discriminatory} against older people.|trustworthy accountable",
      "discretionary discriminating",
    ),
    word(
      "unintended",
      "not planned or meant",
      "非故意的；意外的",
      "Social media had {unintended} effects on teenagers' sleep.|trustworthy accountable | The new law had {unintended} consequences.|trustworthy accountable | The joke caused {unintended} offense.|trustworthy accountable",
      "untended uninterested",
    ),
    word(
      "oversight",
      "watching something to make sure it is done properly; a mistake made because you did not notice",
      "监督；疏忽",
      "The agency has {oversight} of the banks.|liability accountability | AI needs human {oversight}.|liability manipulation | The missing name was an {oversight}, not a deliberate decision.|accountability liability",
      "overview insight",
      "accountability",
    ),
    word(
      "liability liabilities",
      "legal responsibility for something; a person or thing that causes problems",
      "法律责任；累赘",
      "The company denied {liability} for the accident.|oversight transmission | The driver has {liability} for the damage.|oversight transmission | His temper is a {liability} for the team.|transmission stagnation",
      "reliability ability",
      "accountability liable",
    ),
    word(
      "liable",
      "legally responsible for paying for damage or loss",
      "负有法律责任的",
      "The owner is {liable} for any damage the dog causes.|trustworthy unintended | You may be {liable} to pay a fine.|trustworthy compatible | Who is {liable} if a robot hurts someone?|trustworthy compatible",
      "likable reliable",
      "accountable liability",
    ),
    word(
      "ethically",
      "in a way that is morally right",
      "合乎道德地",
      "Was it {ethically} right to test the drug on children?|liable accountable | The company promised to act {ethically}.|liable accountable | {Ethically}, the experiment raises serious questions.|Liable Accountable",
      "ethnically electrically",
    ),
    word(
      "manipulative",
      "controlling people cleverly and unfairly to get what you want",
      "操纵性的",
      "The app uses {manipulative} tricks to keep you scrolling.|trustworthy accountable | Her {manipulative} boyfriend made her feel guilty all the time.|trustworthy accountable | {Manipulative} ads target children who don't know better.|Trustworthy Accountable",
      "manipulation imaginative",
      "exploitative",
    ),
    word(
      "exploitative",
      "using people unfairly for your own advantage",
      "剥削性的",
      "The factory was accused of {exploitative} working conditions.|trustworthy accountable | Some games are {exploitative}, pushing children to spend real money.|trustworthy accountable | They pay workers almost nothing; it's {exploitative}.|trustworthy accountable",
      "exploratory explosive",
      "manipulative",
    ),
    word(
      "trustworthy",
      "able to be trusted",
      "值得信赖的",
      "Is this news website {trustworthy}? Its stories always check out.|manipulative discriminatory | We need AI that is {trustworthy} and safe.|manipulative exploitative | She has always been honest and {trustworthy}.|manipulative exploitative",
      "trusting worthless",
    ),
  ],
});

const transitions = vocabularyTopic({
  id: "b2-words-transitions",
  title: t("Transitions", "转变"),
  summary: t(
    "Transitions and transformation; progression and advancement; upheaval and disruption; stagnation and stagnant economies; momentum; trajectories; modernizing and modernization.",
    "过渡和转型；进展和进步；剧变和中断；停滞和停滞的经济；势头；轨迹；现代化。",
  ),
  prerequisites: ["b2-words-change-verbs"],
  words: [
    word(
      "transition transitions",
      "a change from one state or system to another",
      "过渡；转变",
      "The {transition} to electric cars will take decades.|stagnation momentum | The country made a peaceful {transition} to democracy.|stagnation trajectory | Moving to secondary school is a big {transition}.|stagnation momentum",
      "translation transmission",
      "transformation",
    ),
    word(
      "transformation",
      "a complete change in the appearance or character of something",
      "转变；变革",
      "The city has undergone a {transformation} in the last ten years.|stagnation momentum | Digital {transformation} is changing every business.|stagnation momentum | Her {transformation} from shy girl to star was amazing.|stagnation momentum",
      "transportation information",
      "transition",
    ),
    word(
      "progression",
      "the process of developing or moving forward gradually",
      "进展；发展",
      "The drug slows the {progression} of the disease.|stagnation upheaval | There is a natural {progression} from walking to running.|stagnation upheaval | Career {progression} is slow in this company.|upheaval latency",
      "procession regression",
      "advancement",
    ),
    word(
      "advancement",
      "progress or development; moving to a higher job",
      "进步；晋升",
      "Technological {advancement} has made life easier.|stagnation upheaval | There are few chances for {advancement} in this job.|stagnation upheaval | The {advancement} of science depends on curiosity.|stagnation upheaval",
      "advertisement announcement",
      "progression",
    ),
    word(
      "upheaval",
      "a big change that causes a lot of confusion and worry",
      "剧变；动荡",
      "The revolution caused great social {upheaval}.|momentum latency | Moving house was an {upheaval} for the children.|stagnation momentum | The industry is going through a period of {upheaval}.|momentum latency",
      "upgrade heaven",
      "disruption",
    ),
    word(
      "disruption",
      "a problem that stops something from continuing normally; a big change to an industry",
      "中断；扰乱",
      "The strike caused {disruption} to train services.|momentum advancement | Heavy snow caused {disruption} across the country.|momentum advancement | AI could cause huge {disruption} in the job market.|momentum latency",
      "destruction interruption",
      "upheaval",
    ),
    word(
      "stagnation",
      "a state of not growing, moving or developing",
      "停滞；萧条",
      "Years of economic {stagnation} left people poorer.|momentum advancement | The company wants to avoid {stagnation} by investing in new ideas.|momentum advancement | Wages suffered from long {stagnation}.|momentum advancement",
      "stagnant starvation",
      "stagnant",
    ),
    word(
      "stagnant",
      "not growing or developing; not flowing and therefore dirty",
      "停滞的；不流动的",
      "The economy has been {stagnant} for years.|trustworthy compatible | Mosquitoes breed in {stagnant} water.|trustworthy compatible | Sales remained {stagnant} despite the new ads.|trustworthy compatible",
      "stagnation pregnant",
      "stagnation",
    ),
    word(
      "momentum",
      "the force that keeps something moving or developing",
      "势头；动力",
      "The campaign is gaining {momentum} as more people sign up.|stagnation upheaval | The team lost {momentum} after the break.|stagnation trajectory | A heavy ball has more {momentum}.|stagnation trajectory",
      "moment monument",
    ),
    word(
      "trajectory trajectories",
      "the path that something follows as it moves; the way something develops",
      "轨迹；发展轨迹",
      "The rocket's {trajectory} was calculated by computer.|momentum stagnation | Her career has followed an upward {trajectory}.|momentum stagnation | The {trajectories} of the two planets will cross.|momentums stagnations",
      "tragedy territory",
    ),
    word(
      "modernize modernizes modernized modernizing",
      "to make something more modern by using new methods or equipment",
      "使现代化",
      "The government plans to {modernize} the railways.|stagnate transmit | The hotel was {modernized} last year.|stagnated transmitted | They are {modernizing} the factory with robots.|transmitting stagnating",
      "moderate memorize",
      "modernization",
    ),
    word(
      "modernization",
      "the process of making something modern",
      "现代化",
      "The {modernization} of the army cost billions.|stagnation upheaval | China's rapid {modernization} changed millions of lives.|stagnation upheaval | The old school needs {modernization}.|stagnation upheaval",
      "moderation memorization",
      "modernize",
    ),
  ],
});

// Wish and if only.

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const pronouns = new Set(["I", "you", "he", "she", "it", "we", "they"]);
const plural = new Set(["you", "we", "they", "my parents"]);

/**
 * wishNows are wishes about the present: the fact, the opener, the subject, the right form, a wrong form in the present
 * and a wrong form in the past perfect, then the rest of the sentence.
 */
const wishNows: readonly (readonly [string, string, string, string, string, string, string])[] = [
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
const wishPasts: readonly (readonly [string, string, string, string, string, string, string])[] = [
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

const regrets = new Set(wishPasts.map(([, opener, s, right, , , rest]) => `${joinWords(opener, s, right, rest)}.`));

/** wishNote explains in Chinese which verb form a wish takes. */
function wishNote(sentence: string): string {
  if (regrets.has(sentence)) return "对过去的遗憾，用过去完成时 had 加过去分词";
  return "对现在的愿望，用一般过去时，be 用 were，能力用 could";
}

const wishAndIfOnly: TopicDef = {
  id: "wish-and-if-only",
  title: t("Wish and If Only", "wish 和 if only"),
  summary: t(
    "I wish I knew how it worked. If only we had backed it up! A wish about the present takes the past simple; a regret about the past takes the past perfect.",
    "I wish I knew how it worked. If only we had backed it up! 对现在的愿望用一般过去时，对过去的遗憾用过去完成时。",
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
        "To wish that something **now** were different, put the verb after *wish* or *if only* one step back into the **past**, as in a second conditional:\n\n- *I don't know the answer.* → *I **wish** I **knew** the answer.*\n- *I can't swim.* → *If only I **could** swim.*\n- *It's raining.* → *I wish it **weren't** raining.* (*wasn't* is also common after *I*, *he*, *she* and *it*.)\n\nThe past form does not mean past time here: it shows that the wish is not true. *If only* is stronger than *I wish*. Do not confuse *wish* with *hope*: we *hope* for things that may happen (*I hope it stops raining*), but we *wish* for things that are not true.",
        "希望**现在**的情况不同时，把 *wish* 或 *if only* 后面的动词往后退一步，用**过去式**，和第二条件句一样：\n\n- *I don't know the answer.* → *I **wish** I **knew** the answer.*\n- *I can't swim.* → *If only I **could** swim.*\n- *It's raining.* → *I wish it **weren't** raining.*（在 *I*、*he*、*she*、*it* 后面也常用 *wasn't*。）\n\n这里的过去式不表示过去的时间，而是表示愿望与事实相反。*If only* 的语气比 *I wish* 更强。中文说“我希望我知道答案”“要是我会游泳就好了”，动词不变形，所以中国学生常写成 *I wish I know*。还要分清 *wish* 和 *hope*：可能发生的事用 *hope*（*I hope it stops raining*），与事实相反的事才用 *wish*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), wishNowChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（对现在的愿望，用一般过去时，be 用 were，能力用 could）`),
      ),
    ),
    point(
      "past",
      t("Regretting the past", "后悔过去"),
      t(
        "To regret something that **happened** (or didn't happen) in the past, use *wish* or *if only* with the **past perfect**, *had* + past participle, as in a third conditional:\n\n- *I didn't back up my files.* → *If only I **had backed up** my files!*\n- *I said something rude.* → *I wish I **hadn't said** that.*\n\nThe past simple is wrong here: *I wish I studied* is a wish about the present (that you were a person who studies), not a regret about last week. The present perfect (*I wish I have studied*) is never right after *wish*.",
        "后悔过去**发生**（或没有发生）的事时，*wish* 或 *if only* 后面用**过去完成时**，即 *had* 加过去分词，和第三条件句一样：\n\n- *I didn't back up my files.* → *If only I **had backed up** my files!*\n- *I said something rude.* → *I wish I **hadn't said** that.*\n\n这里不能用一般过去时：*I wish I studied* 是对现在的愿望（希望自己是个爱学习的人），不是后悔上周没复习。*wish* 后面也从不用现在完成时（*I wish I have studied* 是错的）。中文“我真后悔没复习”“要是当时没说那句话就好了”靠“当时”“后悔”表达时间，英语则要靠 *had* 加过去分词。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), wishPastChoice, (right, shown) =>
        t(fill(shown, right), `${fill(shown, right)}（对过去的遗憾，用过去完成时 had 加过去分词）`),
      ),
    ),
    point(
      "write",
      t("Writing wishes and regrets", "写愿望和遗憾"),
      t(
        "Turn the fact into a wish with the words given. A fact about **now** takes the past simple; a fact about the **past** takes the past perfect. A wish reverses the fact, so a negative fact becomes positive and a positive fact becomes negative:\n\n- *I can't drive. → If only …* becomes *If only I could drive.*\n- *We missed the train. → I wish …* becomes *I wish we hadn't missed the train.*\n\nYou may write *I'd* for *I had*, *had not* for *hadn't*, and *was* for *were* after *I*, *he*, *she* and *it*.",
        "用给出的开头把事实改写成愿望。关于**现在**的事实用一般过去时，关于**过去**的事实用过去完成时。愿望与事实相反，所以否定的事实变成肯定，肯定的事实变成否定：\n\n- *I can't drive. → If only …* 写成 *If only I could drive.*\n- *We missed the train. → I wish …* 写成 *I wish we hadn't missed the train.*\n\n可以把 *I had* 写成 *I'd*，把 *hadn't* 写成 *had not*，*I*、*he*、*she*、*it* 后面的 *were* 也可以写成 *was*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Turn the fact into a wish with the words given.", "用给出的开头把事实改写成愿望。"),
        wishTyped,
        (right) => t(right, `${right}（${wishNote(right)}）`),
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
      "A problem-solution essay explains a problem and argues for the best way to deal with it. Plan four paragraphs:\n\n1. **The problem**: say what it is, what causes it and who it affects, with a fact or an example: *As a result, teachers report students who arrive tired.*\n2. **The first solution**: say how it would work and what it would change, then name a limit: *One solution would be to ... However, ...*\n3. **The second solution**: the same, just as fully: *A second solution would be to ... The difficulty is that ...*\n4. **Your judgment**: say which solution would work better, or how the two should be combined, and why: *On balance, I believe the second would work better, because ...*\n\nUse *would* for solutions that do not exist yet: *Students would hand in their phones in the morning.* Be honest about each solution's weaknesses; a judgment is convincing only when both options have been weighed fairly. Keep a neutral, formal tone, with no contractions.",
      "问题解决类议论文解释一个问题，并论证解决它的最好办法。安排四段：\n\n1. **问题**：说明问题是什么、由什么引起、影响了谁，并给出事实或例子：*As a result, teachers report students who arrive tired.*\n2. **第一种办法**：说明它怎样实施、会带来什么改变，再指出它的局限：*One solution would be to ... However, ...*\n3. **第二种办法**：同样充分地展开：*A second solution would be to ... The difficulty is that ...*\n4. **你的判断**：说明哪种办法效果更好，或者两者应该怎样结合，并说明理由：*On balance, I believe the second would work better, because ...*\n\n描述尚未实施的办法时用 *would*：*Students would hand in their phones in the morning.* 中文写作常常只列出办法的好处，英语议论文则要如实写出每种办法的不足；只有公平地权衡过两种办法，判断才有说服力。语气中立、正式，不用缩写。",
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
