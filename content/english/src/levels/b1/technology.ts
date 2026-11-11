// B1, unit 6: Technology in Our Lives. Digital life, online safety, research and design, gadgets, what machines do
// and tech problems; the second conditional. Its relative clauses and combining with them reuse the native topics.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const digital = vocabularyTopic({
  id: "b1-words-digital",
  title: t("Digital Life", "数字生活"),
  summary: t(
    "Digital devices; software, hardware and data; accounts, profiles and usernames; browsers and links; updating and installing.",
    "数字设备；软件、硬件和数据；账户、个人资料和用户名；浏览器和链接；更新和安装。",
  ),
  prerequisites: ["a2-words-technology"],
  words: [
    word(
      "digital",
      "using computers and the internet; showing information as numbers",
      "数字的；数码的",
      "We live in a {digital} world.|automatic anonymous | I have a {digital} camera.|automatic anonymous | Most music is {digital} now.|private personal",
      "online electronic",
    ),
    word(
      "device devices",
      "a machine or a tool, such as a phone or a tablet",
      "设备；装置",
      "Please turn off all electronic {devices} during the flight.|profiles usernames | A phone is a small {device} that does many things.|profile username | This {device} measures your heart rate.|profile username",
      "gadget software",
    ),
    word(
      "software",
      "the programs that a computer uses",
      "软件",
      "You need special {software} to edit videos.|username profile | The {software} on my laptop is out of date.|username profile | She writes {software} for a game company.|username profile",
      "hardware data",
    ),
    word(
      "hardware",
      "the machines and parts of a computer system that you can touch",
      "硬件",
      "The keyboard and the screen are {hardware}.|software data | We need new {hardware} for the computer lab.|username profile | The problem is with the {hardware}, not the program.|username profile",
      "software device",
    ),
    word(
      "data",
      "information, especially facts or numbers stored on a computer",
      "数据",
      "The app collects {data} about your sleep.|hardware username | Scientists studied the {data} from the experiment.|hardware username | I've used all my mobile {data} this month.|hardware username",
      "information software",
    ),
    word(
      "account accounts",
      "an arrangement to use a website or a service, with a name and a password; an arrangement with a bank",
      "账户",
      "I opened an {account} at the bank.|browser link | You need an {account} to buy things on this website.|browser link | She has two email {accounts}.|browsers links",
      "profile username",
    ),
    word(
      "profile profiles",
      "a short description of a person on a website, often with a photo",
      "个人资料；简介",
      "Update your {profile} with a new photo.|browser link | Her {profile} says she lives in Shanghai.|browser link | Never put your address on your {profile}.|browser link",
      "account username",
    ),
    word(
      "username usernames",
      "the name you use to log in to a website or an app",
      "用户名",
      "Enter your {username} and password.|browser link | I forgot my {username} again.|browser link | {Usernames} can't have spaces in them.|Browsers Links",
      "password profile",
    ),
    word(
      "browser browsers",
      "a program that you use to look at websites",
      "浏览器",
      "Open your web {browser} and go to our website.|username profile | Which {browser} do you use?|username profile | This page works in all {browsers}.|usernames profiles",
      "link software",
    ),
    word(
      "link links",
      "a word or a picture on a website or in a message that you click to go to another page",
      "链接",
      "Click on the {link} to read more.|browser username | Don't click {links} in emails from strangers.|browsers usernames | I'll send you the {link} to the video.|browser username",
      "browser website",
    ),
    word(
      "update updates updated updating",
      "to make something newer by adding new information or software; a newer version",
      "更新",
      "My phone needs to {update} its software.|record measure | The news website is {updated} every hour.|installed measured | There's a new {update} for this app.|browser username",
      "install upgrade",
    ),
    word(
      "install installs installed installing",
      "to put a program onto a computer or a phone, or a machine into a place",
      "安装",
      "I {installed} a new game on my phone.|measured enabled | A man came to {install} our new washing machine.|update delete | Don't {install} apps from websites you don't know.|measure enable",
      "update download",
    ),
  ],
});

const safety = vocabularyTopic({
  id: "b1-words-online-safety",
  title: t("Online Safety", "网络安全"),
  summary: t(
    "Privacy and security; hackers, spam and scams; cyberbullying; being addicted and addictions; identity; personal, private and anonymous.",
    "隐私和安全；黑客、垃圾邮件和骗局；网络欺凌；上瘾和瘾；身份；个人的、私密的和匿名的。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "privacy",
      "being able to keep your life and your information to yourself",
      "隐私",
      "Check the {privacy} settings on your account.|spam addiction | Everyone has the right to {privacy}.|spam addiction | I need some {privacy}. Please knock before you come in.|spam security",
      "security identity",
    ),
    word(
      "security",
      "being safe from danger, crime or attack; the people and things that keep a place safe",
      "安全；保安",
      "Use a strong password for better {security}.|spam addiction | Airport {security} checked our bags.|spam addiction | The bank has cameras for {security}.|spam addiction",
      "privacy safety",
    ),
    word(
      "hacker hackers",
      "a person who gets into other people's computers without permission",
      "黑客",
      "A {hacker} stole thousands of passwords.|scam spam | {Hackers} got into the bank's computer system.|Scams Spams | The company paid a {hacker} to test its security.|scam spam",
      "scam spam",
    ),
    word(
      "spam",
      "emails or messages that you did not ask for, usually trying to sell something",
      "垃圾邮件",
      "My inbox is full of {spam}.|hacker identity | I put the email in the {spam} folder.|hacker identity | Most of the {spam} I get is about cheap watches.|hacker identity",
      "scam hacker",
    ),
    word(
      "scam scams",
      "a dishonest plan to get money from people",
      "骗局",
      "The email was a {scam}. It asked for my bank details.|hacker identity | My grandma nearly lost her money in a phone {scam}.|hacker identity | Learn how to spot online {scams}.|hackers identities",
      "spam hacker",
    ),
    word(
      "cyberbullying",
      "using the internet or phones to hurt or frighten someone",
      "网络欺凌",
      "{Cyberbullying} can make young people very unhappy.|Privacy Security | If you see {cyberbullying}, tell an adult.|privacy security | Our school has strict rules about {cyberbullying}.|privacy identity",
      "spam scam",
    ),
    word(
      "addicted",
      "unable to stop doing or using something",
      "上瘾的",
      "My brother is {addicted} to video games.|anonymous private | Some people are {addicted} to their phones.|anonymous private | You can get {addicted} to sugar.|anonymous private",
      "addiction personal",
    ),
    word(
      "addiction addictions",
      "the state of being unable to stop doing or using something",
      "瘾；成瘾",
      "Phone {addiction} is a growing problem among teenagers.|identity hacker | He's getting help for his gaming {addiction}.|identity privacy | Some {addictions} are very hard to break.|identities privacies",
      "addicted security",
    ),
    word(
      "identity identities",
      "who someone is",
      "身份",
      "Someone stole her {identity} and opened a bank account in her name.|addiction privacy | The police don't know the {identity} of the thief yet.|addiction privacy | Online, people can hide their real {identities}.|addictions securities",
      "profile privacy",
    ),
    word(
      "personal",
      "belonging to or about one person",
      "个人的",
      "Never share {personal} information online.|addicted anonymous | This is my {personal} opinion.|addicted anonymous | She keeps a {personal} diary.|addicted anonymous",
      "private anonymous",
    ),
    word(
      "private",
      "only for one person or a small group, not for everyone",
      "私人的；私密的",
      "This is a {private} conversation. Please leave us alone.|addicted anonymous | Make your account {private} so that only friends can see it.|addicted automatic | He goes to a {private} school.|addicted anonymous",
      "personal public",
    ),
    word(
      "anonymous",
      "with a name that is not known or not given",
      "匿名的",
      "The police got an {anonymous} phone call.|addicted personal | The writer wants to stay {anonymous}.|addicted personal | The letter was {anonymous}. Nobody knows who wrote it.|addicted personal",
      "private personal",
    ),
  ],
});

const research = vocabularyTopic({
  id: "b1-words-research-and-design",
  title: t("Research and Design", "研究和设计"),
  summary: t(
    "Technology and scientific research; experiments and laboratories; discovering and discoveries; developing and development; designing, creating and artificial things.",
    "技术和科学研究；实验和实验室；发现；发展和开发；设计、创造和人造的东西。",
  ),
  prerequisites: ["a2-words-machines"],
  words: [
    word(
      "technology technologies",
      "the use of science to make machines and tools; machines and tools made this way",
      "技术；科技",
      "{Technology} has changed the way we work.|Laboratory Discovery | Schools use new {technologies} to help students learn.|laboratories discoveries | Phone {technology} improves every year.|laboratory discovery",
      "science research",
    ),
    word(
      "scientific",
      "of science, or done in the careful way of science",
      "科学的",
      "This is a {scientific} experiment, so we must be careful.|artificial anonymous | There is no {scientific} evidence for this.|artificial automatic | {Scientific} research takes many years.|Artificial Automatic",
      "artificial technology",
    ),
    word(
      "research researches",
      "careful study of a subject to find new facts",
      "研究",
      "She does {research} on brain diseases.|laboratory discovery | {Research} shows that sleep helps memory.|Laboratory Development | The university spends millions on {research}.|discovery experiment",
      "experiment discovery",
    ),
    word(
      "experiment experiments",
      "a scientific test to find out what happens",
      "实验",
      "We did an {experiment} with ice and salt.|laboratory development | The {experiment} showed that plants need light.|laboratory development | Scientists do {experiments} to test their ideas.|laboratories developments",
      "research laboratory",
    ),
    word(
      "laboratory laboratories",
      "a room or a building where scientists work",
      "实验室",
      "The scientists work in a {laboratory}.|discovery experiment | Our school has a new science {laboratory}.|discovery development | The samples were sent to a {laboratory}.|discovery development",
      "experiment research",
    ),
    word(
      "discover discovers discovered discovering",
      "to find or learn something for the first time",
      "发现",
      "Who {discovered} penicillin?|operated recorded | Scientists have {discovered} a new species of frog.|designed created | I {discovered} a great café near my house.|designed created",
      "invent find",
    ),
    word(
      "discovery discoveries",
      "finding or learning something for the first time; something found or learned",
      "发现",
      "The {discovery} of fire changed human life.|technology laboratory | Scientists made an important {discovery}.|development design | The museum shows great {discoveries}, like electricity and penicillin.|laboratories designs",
      "invention development",
    ),
    word(
      "develop develops developed developing",
      "to grow or change into something bigger or better; to make a new product or idea",
      "发展；开发",
      "The company is {developing} a new kind of battery.|discovering recording | Children {develop} very quickly.|discover design | Reading helps you {develop} your English.|discover create",
      "create grow",
    ),
    word(
      "development developments",
      "growth or change; a new event or product",
      "发展；进展",
      "Sleep is important for a child's {development}.|discovery laboratory | There have been new {developments} in the story.|discoveries laboratories | The {development} of the new drug took ten years.|laboratory experiment",
      "discovery research",
    ),
    word(
      "design designs designed designing",
      "to plan how something will look and work; a plan or a drawing of this",
      "设计",
      "She {designs} clothes for a famous brand.|discovers develops | The bridge was {designed} by a young engineer.|discovered researched | I like the {design} of your new phone.|research laboratory",
      "create develop",
    ),
    word(
      "create creates created creating",
      "to make something new",
      "创造；创建",
      "The students {created} a website for their school.|discovered researched | This game was {created} by two teenagers.|discovered researched | The new factory will {create} 500 jobs.|discover research",
      "design develop",
    ),
    word(
      "artificial",
      "made by people; not natural",
      "人造的；人工的",
      "The football pitch has {artificial} grass.|scientific digital | These flowers are {artificial}. They're made of plastic.|scientific digital | {Artificial} intelligence can write and draw.|Scientific Digital",
      "fake scientific",
    ),
  ],
});

const gadgets = vocabularyTopic({
  id: "b1-words-gadgets",
  title: t("Gadgets", "小设备"),
  summary: t(
    "Smartphones, headphones and speakers; chargers and cables; drones and printers; microphones and remotes; consoles, gadgets and wireless things.",
    "智能手机、耳机和扬声器；充电器和数据线；无人机和打印机；麦克风和遥控器；游戏机、小设备和无线的东西。",
  ),
  prerequisites: ["a2-words-using-tech"],
  words: [
    word(
      "smartphone smartphones",
      "a mobile phone that can use the internet and run apps",
      "智能手机",
      "Almost every teenager has a {smartphone} to chat with friends.|charger cable | You can take great photos with a {smartphone}.|charger cable | {Smartphones} have changed the way we live.|Chargers Cables",
      "device gadget",
    ),
    word(
      "headphones",
      "a thing that you wear on your ears to listen to music without other people hearing",
      "耳机",
      "Put on your {headphones}. I'm trying to study.|chargers drones | I listen to music on my {headphones} on the bus.|drones printers | These wireless {headphones} cost a lot.|cables manuals",
      "speaker microphone",
    ),
    word(
      "speaker speakers",
      "a machine that sound comes out of; a person who gives a talk",
      "扬声器；音箱；演讲者",
      "The music came from a {speaker} on the wall.|drone printer | Turn the {speakers} up. I can't hear.|drones printers | The {speaker} talked for an hour about climate change.|drone printer",
      "headphones microphone",
    ),
    word(
      "charger chargers",
      "a thing that puts electricity into a battery",
      "充电器",
      "Can I borrow your phone {charger}?|drone remote | I left my {charger} at home, and my battery is dying.|drone remote | Different phones need different {chargers}.|drones remotes",
      "cable battery",
    ),
    word(
      "cable cables",
      "a wire that carries electricity or signals",
      "电缆；数据线",
      "Connect the printer with this {cable}.|drone remote | There are {cables} all over the floor.|drones remotes | Is this {cable} long enough to reach the TV?|drone remote",
      "charger wire",
    ),
    word(
      "drone drones",
      "a small aircraft without a pilot, controlled from the ground",
      "无人机",
      "The {drone} took photos of the beach from the air.|cable charger | Some companies deliver parcels by {drone}.|cable charger | You can't fly {drones} near the airport.|cables chargers",
      "remote console",
    ),
    word(
      "printer printers",
      "a machine that puts words and pictures from a computer onto paper",
      "打印机",
      "The {printer} has run out of paper.|cable remote | Can I use your {printer}? I need a copy of my ticket.|cable remote | The library has three {printers}.|cables remotes",
      "speaker console",
    ),
    word(
      "microphone microphones",
      "a thing you speak into to make your voice louder or to record it",
      "麦克风",
      "The singer held the {microphone} close to her mouth.|charger printer | My laptop's {microphone} isn't working, so they can't hear me.|charger printer | Speak into the {microphone}, please.|charger printer",
      "speaker headphones",
    ),
    word(
      "remote remotes",
      "a small thing that you use to control a TV from a distance; far away",
      "遥控器；遥远的",
      "Where's the {remote}? I want to change the channel.|cable charger | They live in a {remote} village in the mountains.|wireless automatic | Give me the {remote}!|cable charger",
      "console charger",
    ),
    word(
      "console consoles",
      "a machine for playing video games",
      "游戏机",
      "He got a new game {console} for his birthday.|charger cable | We play football games on my {console}.|charger cable | Game {consoles} are expensive.|chargers cables",
      "remote gadget",
    ),
    word(
      "gadget gadgets",
      "a small, useful and often clever machine",
      "小器具；小设备",
      "My dad loves new {gadgets}.|cables chargers | This kitchen {gadget} peels apples in seconds.|cable charger | He's always buying silly {gadgets} online.|cables chargers",
      "device console",
    ),
    word(
      "wireless",
      "without wires",
      "无线的",
      "I use a {wireless} mouse.|automatic anonymous | The café has free {wireless} internet.|remote artificial | {Wireless} headphones are easy to carry.|Remote Artificial",
      "digital remote",
    ),
  ],
});

const machines = vocabularyTopic({
  id: "b1-words-tech-verbs",
  title: t("What Machines Do", "机器能做什么"),
  summary: t(
    "Accessing, operating and replacing; depending and relying; allowing and enabling; communicating and recording; measuring, controlling and automatic machines.",
    "访问、操作和取代；依靠和依赖；允许和使能够；交流和记录；测量、控制和自动的机器。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "access accesses accessed accessing",
      "to be able to get into or use a place or information; the right or the way to do this",
      "访问；使用权",
      "You can {access} your email from any computer.|depend rely | Only staff have {access} to this room.|control record | I can't {access} the website. It's down.|depend rely",
      "enter enable",
    ),
    word(
      "operate operates operated operating",
      "to make a machine work; (of a doctor) to do an operation",
      "操作；做手术",
      "Can you {operate} this machine?|depend rely | The doctors {operated} on her knee.|allowed enabled | The lift is {operated} by a button.|depended relied",
      "control use",
    ),
    word(
      "replace replaces replaced replacing",
      "to take the place of something; to put something new in place of something old",
      "取代；替换",
      "Robots may {replace} some workers in the future.|rely depend | I need to {replace} the battery in my watch.|rely depend | The old bridge was {replaced} by a new one.|relied depended",
      "change repair",
    ),
    word(
      "depend depends depended depending",
      "to need someone or something (depend on); to change because of something (it depends)",
      "依靠；取决于",
      '"Are you coming?" "It {depends} on the weather."|allows enables | Many old people {depend} on their families.|allow enable | We {depend} on electricity for almost everything.|allow enable',
      "rely trust",
      "rely",
    ),
    word(
      "rely relies relied relying",
      "to need someone or something, or to trust that they will help you (rely on)",
      "依赖；信赖",
      "You can {rely} on me. I'll be there.|allow enable | Too many students {rely} on their phones to do sums.|allow enable | Farmers {rely} on rain for their crops.|allow enable",
      "depend trust",
      "depend",
    ),
    word(
      "allow allows allowed allowing",
      "to let someone do something; to make something possible",
      "允许",
      "Phones are not {allowed} in the exam room.|depended relied | My parents don't {allow} me to stay out late.|depend rely | The app {allows} you to send money to friends.|depends relies",
      "let enable",
    ),
    word(
      "enable enables enabled enabling",
      "to make it possible for someone to do something",
      "使能够",
      "The internet {enables} us to work from home.|relies depends | This money will {enable} the school to buy new computers.|rely depend | Glasses {enable} me to see clearly.|rely depend",
      "allow help",
    ),
    word(
      "communicate communicates communicated communicating",
      "to share information or feelings with someone",
      "交流；沟通",
      "We {communicate} by email.|measure depend | Dolphins {communicate} with sounds.|allow depend | It's hard to {communicate} when you don't speak the language.|measure depend",
      "talk record",
    ),
    word(
      "record records recorded recording",
      "to store sounds or pictures so they can be heard or seen again; to write down information",
      "录制；记录",
      "We {recorded} a song in a real studio.|measured depended | Can you {record} the match for me? I'll be out.|measure depend | The nurse {records} your weight in a book.|allows depends",
      "measure save",
    ),
    word(
      "measure measures measured measuring",
      "to find the size, the amount or the speed of something",
      "测量",
      "The nurse {measured} my height.|relied depended | This watch {measures} how far you walk.|relies allows | {Measure} the room before you buy a carpet.|Record Rely",
      "record control",
    ),
    word(
      "control controls controlled controlling",
      "to make something or someone do what you want; the power to do this",
      "控制",
      "You can {control} the lights with your phone.|depend rely | The driver lost {control} of the car.|access record | The pilot {controlled} the plane through the storm.|depended relied",
      "operate manage",
    ),
    word(
      "automatic",
      "working by itself, without a person controlling it",
      "自动的",
      "The doors are {automatic}. They open when you walk up to them.|wireless anonymous | My car has an {automatic} gearbox.|wireless anonymous | The heating is {automatic}. It comes on at six.|wireless anonymous",
      "digital wireless",
    ),
  ],
});

const problems = vocabularyTopic({
  id: "b1-words-tech-problems",
  title: t("Tech Problems", "技术故障"),
  summary: t(
    "Crashes, errors and bugs; restarting and backups; signals, connections and wifi; being offline; upgrades, settings and manuals.",
    "崩溃、错误和程序缺陷；重启和备份；信号、连接和无线网络；离线；升级、设置和说明书。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "crash crashes crashed crashing",
      "(of a computer) to stop working suddenly; to hit something hard",
      "崩溃；撞车",
      "My laptop {crashed}, and I lost my work.|allowed enabled | The car {crashed} into a tree.|restarted upgraded | The app keeps {crashing}.|allowing enabling",
      "error bug",
    ),
    word(
      "error errors",
      "a mistake",
      "错误",
      "An {error} message came up on the screen.|backup signal | There are a few {errors} in your essay.|backups signals | The computer made an {error}.|backup signal",
      "bug mistake",
    ),
    word(
      "bug bugs",
      "a mistake in a computer program; a small insect",
      "程序缺陷；小虫",
      "The new update fixed a {bug} in the game.|signal backup | There's a {bug} in the program that makes it crash.|signal setting | We found {bugs} in the kitchen.|signals backups",
      "error virus",
    ),
    word(
      "restart restarts restarted restarting",
      "to start again, especially a computer",
      "重启",
      "Try to {restart} your computer.|crash allow | The phone {restarted} on its own.|allowed enabled | After the storm, the trains {restarted} at noon.|allowed enabled",
      "crash upgrade",
    ),
    word(
      "backup backups",
      "a copy of computer files, kept in case the first one is lost",
      "备份",
      "Always make a {backup} of your photos.|signal setting | I lost my phone, but I had a {backup} of everything.|signal setting | The company makes {backups} every night.|signals settings",
      "copy setting",
    ),
    word(
      "signal signals",
      "the waves that carry phone or TV information; a sign or a movement that gives a message",
      "信号",
      "There's no phone {signal} in the mountains.|backup manual | The {signal} is weak in this room.|backup manual | The teacher gave the {signal} to start.|backup manual",
      "connection wifi",
    ),
    word(
      "connection connections",
      "a link between two things, such as a computer and the internet",
      "连接",
      "The internet {connection} is very slow today.|setting manual | Check the {connection} between the printer and the computer.|setting manual | Is there a {connection} between sleep and exam results?|manual backup",
      "signal link",
    ),
    word(
      "wifi",
      "a way to connect to the internet without wires",
      "无线网络",
      "What's the {wifi} password?|manual backup | The hotel has free {wifi}.|manual backup | The {wifi} isn't working in my bedroom.|manual backup",
      "signal connection",
    ),
    word(
      "offline",
      "not connected to the internet",
      "离线的",
      "You can play this game {offline}.|automatic anonymous | The website is {offline} for a few hours.|automatic anonymous | Download the map so you can use it {offline}.|automatic anonymous",
      "online wireless",
    ),
    word(
      "upgrade upgrades upgraded upgrading",
      "to make a machine or a program better or newer; a better or newer one",
      "升级",
      "I {upgraded} my phone to the new model.|crashed restarted | It's time to {upgrade} your software.|crash allow | The airline gave us a free {upgrade}.|crash restart",
      "update replace",
    ),
    word(
      "setting settings",
      "a choice you make about how a machine or a program works",
      "设置",
      "Change the {settings} to make the screen brighter.|backups signals | Go to {settings} and turn off the sound.|backup manual | What's the best {setting} for night photos?|backup manual",
      "manual control",
    ),
    word(
      "manual manuals",
      "a book that tells you how to use a machine",
      "说明书；手册",
      "Read the {manual} before you use the drill.|signal setting | I lost the {manual} for the washing machine.|signal setting | The camera comes with a long {manual}.|signal wifi",
      "setting guide",
    ),
  ],
});

// The second conditional.

/**
 * imagined are the subject of the if-clause, its verb in the past, the base form and the present of that verb, the
 * rest of the if-clause, and the subject, verb and rest of the result.
 */
const imagined: readonly (readonly [string, string, string, string, string, string, string, string])[] = [
  ["I", "had", "have", "have", "a robot", "I", "never cook", ""],
  ["I", "were", "be", "am", "rich", "I", "buy", "a big house"],
  ["she", "lived", "live", "lives", "near the sea", "she", "swim", "every day"],
  ["we", "had", "have", "have", "more time", "we", "visit", "you more often"],
  ["he", "knew", "know", "knows", "the answer", "he", "tell", "us"],
  ["I", "were", "be", "am", "you", "I", "take", "the job"],
  ["they", "won", "win", "win", "the lottery", "they", "travel", "around the world"],
  ["you", "slept", "sleep", "sleep", "more", "you", "feel", "less tired"],
  ["it", "stopped", "stop", "stops", "raining", "we", "go", "out"],
  ["my phone", "worked", "work", "works", "", "I", "call", "you"],
  ["I", "spoke", "speak", "speak", "Chinese", "I", "talk", "to her grandmother"],
  ["he", "were", "be", "is", "taller", "he", "play", "basketball"],
  ["we", "lived", "live", "live", "in the city", "we", "walk", "to school"],
  ["she", "had", "have", "has", "a car", "she", "drive", "to work"],
  ["I", "found", "find", "find", "a wallet in the street", "I", "take", "it to the police"],
  ["you", "practiced", "practice", "practice", "more", "you", "play", "much better"],
  ["the bus", "came", "come", "comes", "on time", "we", "arrive", "at school by eight"],
  ["I", "were", "be", "am", "a bird", "I", "fly", "over the mountains"],
  ["they", "worked", "work", "work", "harder", "they", "pass", "the exam"],
  ["it", "were", "be", "is", "warmer", "we", "have", "lunch outside"],
];

const joinWords = (...parts: readonly string[]) => parts.filter((p) => p !== "").join(" ");
const singular = new Set(["I", "he", "she", "it"]);

/** pastOf is the past of an if-clause as a pattern: were may also be was after I, he, she and it. */
const pastOf = (subject: string, past: string) => (past === "were" && singular.has(subject) ? "[were|was]" : past);
/** wouldOf is the result's subject with would, or with 'd, as a pattern. */
const wouldOf = (subject: string, capital: boolean) => {
  const s = capital ? sentenceCase(subject) : subject;
  return `[${s} would|${s}'d]`;
};

const ifPastChoice: readonly ChoiceItem[] = interleave([
  imagined.map(
    ([s, past, base, present, rest, rs, rv, rr]): ChoiceItem => [
      `${joinWords("If", s, "___", rest)}, ${joinWords(rs, "would", rv, rr)}.`,
      past,
      [`would ${base}`, present],
    ],
  ),
  imagined.map(
    ([s, past, base, present, rest, rs, rv, rr]): ChoiceItem => [
      `${joinWords(sentenceCase(rs), "would", rv, rr, "if", s, "___", rest)}.`,
      past,
      [`would ${base}`, present],
    ],
  ),
]);

const wouldChoice: readonly ChoiceItem[] = interleave([
  imagined.map(
    ([s, past, , , rest, rs, rv, rr]): ChoiceItem => [
      `${joinWords("If", s, past, rest)}, ${joinWords(rs, "___", rr)}.`,
      `would ${rv}`,
      [`will ${rv}`, `would to ${rv}`],
    ],
  ),
  imagined.map(
    ([s, past, , , rest, rs, rv, rr]): ChoiceItem => [
      `${joinWords(sentenceCase(rs), "___", rr, "if", s, past, rest)}.`,
      `would ${rv}`,
      [`will ${rv}`, `would to ${rv}`],
    ],
  ),
]);

const imaginedTyped: readonly TypedItem[] = interleave([
  imagined.map(
    ([s, past, base, present, rest, rs, rv, rr]): TypedItem => ({
      shown: `imagine: if ${joinWords(s, base, rest)} → ${joinWords(rs, rv, rr)}`,
      accepted: [`${joinWords("If", s, pastOf(s, past), rest)}, ${joinWords(wouldOf(rs, false), rv, rr)}.`],
      canonical: `${joinWords("If", s, past, rest)}, ${joinWords(rs, "would", rv, rr)}.`,
      wrong: [
        `${joinWords("If", s, present, rest)}, ${joinWords(rs, "will", rv, rr)}.`,
        `${joinWords("If", s, "would", base, rest)}, ${joinWords(rs, "would", rv, rr)}.`,
      ],
    }),
  ),
  imagined.map(
    ([s, past, base, present, rest, rs, rv, rr]): TypedItem => ({
      shown: `imagine: ${joinWords(rs, rv, rr)} ← if ${joinWords(s, base, rest)}`,
      accepted: [`${joinWords(wouldOf(rs, true), rv, rr, "if", s, pastOf(s, past), rest)}.`],
      canonical: `${joinWords(sentenceCase(rs), "would", rv, rr, "if", s, past, rest)}.`,
      wrong: [
        `${joinWords(sentenceCase(rs), "will", rv, rr, "if", s, present, rest)}.`,
        `${joinWords(sentenceCase(rs), "would", rv, rr, "if", s, "would", base, rest)}.`,
      ],
    }),
  ),
]);

/** ifPastWhy explains the past simple in the if-part of a second conditional. */
const ifPastWhy = (right: string, shown: string): Text => {
  const rule =
    right === "were"
      ? t(
          "The situation is only imagined, so the *if*-part takes the past simple, and *be* takes *were* for every person",
          "这是想象的情况，所以 *if* 部分用一般过去时，*be* 对所有人称都用 *were*",
        )
      : t(
          "The situation is only imagined, so the *if*-part takes the past simple, which here does not mean past time",
          "这是想象的情况，所以 *if* 部分用一般过去时，这里的过去时不表示过去的时间",
        );
  return t(`${rule.en}: ${fill(shown, right)}`, `${rule["zh-CN"]}：${fill(shown, right)}`);
};

/** whyNotIfPast explains would or the present in the if-part of a second conditional. */
const whyNotIfPast = (wrong: string, right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*would* never goes in the *if*-part. An imagined situation takes the past simple, *${right}*.`,
        `*if* 部分不能用 *would*。想象的情况要用一般过去时 *${right}*。`,
      )
    : t(
        `*${wrong}* is the present, which is for a real possibility. The result has *would*, so the situation is only imagined, and the *if*-part takes *${right}*.`,
        `*${wrong}* 是一般现在时，用于真实的可能。结果部分用了 *would*，说明是想象的情况，*if* 部分要用 *${right}*。`,
      );

/** wouldWhy explains would and the base form in the result of a second conditional. */
const wouldWhy = (right: string, shown: string): Text =>
  t(
    `The *if*-part is in the past, so the situation is only imagined, and the result takes *would* and the base form: ${fill(shown, right)}`,
    `*if* 部分用了过去时，说明是想象的情况，结果部分用 *would* 加动词原形：${fill(shown, right)}`,
  );

/** whyNotWould explains will or would to in the result of a second conditional. */
const whyNotWould = (_wrong: string, right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        `*will* is for a real possibility, so it does not go with an *if*-part in the past. Use *${right}*.`,
        `*will* 用于真实的可能，不能和过去时的 *if* 部分搭配。要用 *${right}*。`,
      )
    : t(`*would* is never followed by *to*. Use *${right}*.`, `*would* 后面从不加 *to*。要用 *${right}*。`);

/** imaginedWriteWhy explains how a second conditional is put together, with the comma when the if-part comes first. */
const imaginedWriteWhy = (right: string): Text =>
  right.startsWith("If ")
    ? t(
        `For an imagined situation, the *if*-part takes the past simple, then a comma, and the result takes *would* and the base form: ${right}`,
        `想象的情况，*if* 部分用一般过去时，后面加逗号，结果部分用 *would* 加动词原形：${right}`,
      )
    : t(
        `For an imagined situation, the result takes *would* and the base form, and the *if*-part after it takes the past simple, with no comma: ${right}`,
        `想象的情况，结果部分用 *would* 加动词原形，后面的 *if* 部分用一般过去时，不加逗号：${right}`,
      );

const secondConditional: TopicDef = {
  id: "second-conditional",
  title: t("If I Had, I Would", "如果我有，我就会（第二条件句）"),
  summary: t(
    "If I had a robot, I would never cook. An imagined situation takes the past after if and would in the result; If I were you is the usual form with be.",
    "If I had a robot, I would never cook。想象的情况在 if 后面用过去时，结果用 would；be 动词通常用 If I were you。",
  ),
  prerequisites: ["first-conditional", "was-and-were"],
  encompasses: [
    { topic: "first-conditional", weight: 0.3 },
    { topic: "was-and-were", weight: 0.1 },
  ],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "if-part",
      t("The past after if", "if 后面用过去时"),
      t(
        "To talk about a situation you only imagine, now or in the future, use *if* + the **past simple**, and *would* in the result:\n\n- *If I **had** a robot, I would never cook.* (I don't have one.)\n- *If she **lived** near the sea, she would swim every day.* (She doesn't.)\n\nThe past here does not mean past time; it shows that the situation is not real. Do not use *would* after *if*: not *If I would have*. With *be*, use *were* for every person: *If I **were** you, I would take the job.* (In speech, *If I was* is also heard.)\n\nCompare the first conditional, for things that may really happen: *If it rains, we will stay at home.*",
        "说只是想象的情况（现在或将来）时，用 *if* 加**一般过去时**，结果部分用 *would*：\n\n- *If I **had** a robot, I would never cook.*（我其实没有。）\n- *If she **lived** near the sea, she would swim every day.*（她其实不住在海边。）\n\n这里的过去时不表示过去的时间，而表示情况不是真的。中文用“要是……就……”加语气表达想象，英语却靠动词往过去退一步。*if* 后面不用 *would*：不能说 *If I would have*。*be* 动词对所有人称都用 *were*：*If I **were** you, I would take the job.*（口语里也有人说 *If I was*。）\n\n比较第一条件句，说真的可能发生的事：*If it rains, we will stay at home.*",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), ifPastChoice, ifPastWhy, whyNotIfPast),
    ),
    point(
      "result",
      t("Would in the result", "结果部分用 would"),
      t(
        "The result of an imagined situation takes *would* + the base form: *If I were rich, I **would buy** a big house.* *Will* is for real possibilities, so it does not go with a past *if*-part, and *would* is never followed by *to*. You may write *I'd* for *I would*.",
        "想象情况的结果用 *would* 加动词原形：*If I were rich, I **would buy** a big house.* *will* 用于真实的可能，不能和过去时的 *if* 部分搭配；*would* 后面也从不加 *to*。*I would* 可以写成 *I'd*。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), wouldChoice, wouldWhy, whyNotWould),
    ),
    point(
      "write",
      t("Writing second conditionals", "写第二条件句"),
      t(
        "Write the sentence from the note about an imagined situation. The arrow → means the *if*-part comes first, with a comma: *imagine: if I have a robot → I never cook* becomes *If I had a robot, I would never cook.* The arrow ← means the result comes first, with no comma: *I would never cook if I had a robot.*",
        "根据笔记写一个关于想象情况的句子。箭头 → 表示 *if* 部分在前，后面加逗号：*imagine: if I have a robot → I never cook* 写成 *If I had a robot, I would never cook.* 箭头 ← 表示结果在前，不加逗号：*I would never cook if I had a robot.*",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a second conditional sentence from the note.", "根据笔记写一个第二条件句。"),
        imaginedTyped,
        imaginedWriteWhy,
      ),
    ),
  ],
};

/** topics are the topics of the unit Technology in Our Lives. */
export const topics: readonly TopicDef[] = [
  digital.topic,
  safety.topic,
  research.topic,
  gadgets.topic,
  machines.topic,
  problems.topic,
  secondConditional,
];

/** vocabulary are the words the unit Technology in Our Lives teaches. */
export const vocabulary: readonly WordBatch[] = [
  digital.batch,
  safety.batch,
  research.batch,
  gadgets.batch,
  machines.batch,
  problems.batch,
];
