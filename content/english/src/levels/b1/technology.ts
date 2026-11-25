// B1, unit 6: Technology in Our Lives. Digital life, online safety, research and design, gadgets, what machines do
// and tech problems; the second conditional. Its relative clauses and combining with them reuse the native topics.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill } from "../a2/kit.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";

const digital = vocabularyTopic({
  id: "b1-words-digital",
  title: t("Digital Life", "数字生活"),
  summary: t(
    "Digital devices; software, hardware and data; accounts, profiles and usernames; browsers and links; updating and installing.",
    "数字设备；软件、硬件和数据；账户、个人资料和用户名；浏览器和链接；更新和安装。",
  ),
  intro: t(
    "To use a website, you open a **browser**, log in to your **account** with a **username**, and maybe **update** your **profile**. These words help you talk about computers, apps and the internet.",
    "用网站时，你打开 **browser**（浏览器），用 **username**（用户名）登录 **account**（账户），也许还会 **update**（更新）你的 **profile**（个人资料）。这些词帮你谈论电脑、应用和互联网。",
  ),
  prerequisites: ["a2-words-technology"],
  words: [
    word(
      "digital",
      "using computers and the internet; showing information as numbers",
      "数字的；数码的",
      "Our world is more and more {digital}, with computers and the internet everywhere. | My {digital} camera stores photos as files, not on film. | Most music is {digital} now: we play it as files on phones.",
      "private anonymous",
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
      "I opened a bank {account} and put my money in it.|browser link | You need your own {account}, with a name and password, to buy things on this website.|browser link | She has two email {accounts}.|browsers links",
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
  teaching: {
    watchOut: {
      complete: t(
        "*Hardware* and *software* are two halves of a computer: *hardware* is the parts you can touch, *software* is the programs. Look for clues like *keyboard* or *program*.",
        "*hardware* 和 *software* 是电脑的两部分：*hardware* 是摸得到的部件，*software* 是程序。留意 *keyboard* 或 *program* 这类线索。",
      ),
      meaning: t(
        "An *account* is your arrangement to use a service, with a name and password; a *profile* is the short description of you that others see. Check whether the meaning talks about using a service or describing a person.",
        "*account* 是使用某项服务的账户，有用户名和密码；*profile* 是别人能看到的关于你的简介。看释义说的是使用服务还是介绍一个人。",
      ),
      spell: t(
        "*Username* is one word: *user* + *name*; so are *software* and *hardware*.",
        "*username* 是一个词：*user* 加 *name*；*software* 和 *hardware* 也都是一个词。",
      ),
    },
    notes: `
      digital|computers and the internet everywhere;a camera storing files;music played as files|digital means using computers or numbers; private means only for one person|digital 是数字的；private 是私人的|private=private means only for one person, not using computers and the internet=private 是私人的，不是数字化的;anonymous=anonymous means with no name given, not using computers or files=anonymous 是匿名的，不是数字化的|a digital camera · digital music|from *digit*, a number|来自 *digit*（数字）
      device|electronics off during a flight;a phone that does many things;a heart rate tool|a device is a machine or tool; a profile is a description of a person|device 是设备；profile 是个人资料|profiles/profile=a profile is a description of a person online, not a machine=profile 是网上的个人资料，不是机器;usernames/username=a username is a name you log in with, not a machine=username 是登录名，不是机器|electronic devices · a small device|*device* is a noun; *devise* is a verb|*device* 是名词；*devise* 是动词
      software|video editing;out of date on a laptop;written for a game company|software is the programs; a username is a name you log in with|software 是软件；username 是用户名|username=a username is a name you log in with, not computer programs=username 是登录名，不是程序;profile=a profile is a description of a person, not computer programs=profile 是个人资料，不是程序|computer software · install software|no plural: some software|没有复数：some software
      hardware|a keyboard and a screen;machines for a computer lab;not the program|hardware is the parts you can touch; software is the programs|hardware 是硬件；software 是软件|software=software is programs, not parts you can touch like a keyboard=software 是程序，不是像键盘那样摸得到的部件;data=data is information, not machines you can touch=data 是信息，不是摸得到的机器;username=a username is a name, not machines for a lab=username 是名字，不是机器;profile=a profile is a description, not computer parts=profile 是个人资料，不是电脑部件|computer hardware · new hardware|*hard* things you can touch|摸得到的 *hard* 部件
      data|sleep information from an app;results of an experiment;mobile internet used up|data is information on a computer; hardware is machines|data 是数据；hardware 是硬件|hardware=hardware is machines you can touch, not information=hardware 是硬件，不是信息;username=a username is one name, not information collected or used up=username 是用户名，不是收集或用掉的信息|collect data · mobile data|*data* takes a singular or plural verb|*data* 可接单数或复数动词
      account|a bank one for money;a name and password to buy things;two for email|an account is an arrangement to use a service; a browser is a program|account 是账户；browser 是浏览器|browser/browsers=a browser is a program for looking at websites, not an arrangement with a bank or service=browser 是看网页的程序，不是银行或服务的账户;link/links=a link is something you click to go to a page, not an arrangement to use a service=link 是点击跳转的链接，不是账户|open an account · log in to your account|*account* has a double c|*account* 双写 c
      profile|a new photo;where she lives;no address on it|a profile describes a person online; a link takes you to a page|profile 是个人资料；link 是链接|browser=a browser is a program, not a description of a person=browser 是程序，不是个人资料;link=a link is something you click, not a description of a person=link 是链接，不是个人资料|update your profile · a profile photo|*profile* also means a side view of a face|*profile* 也指侧面轮廓
      username|typed with a password;forgotten again;no spaces allowed|a username is the name you log in with; a browser is a program|username 是用户名；browser 是浏览器|browser/Browsers=a browser is a program for websites, not the name you log in with=browser 是浏览器，不是登录名;link/Links=a link is something you click, not a name you type with a password=link 是链接，不是和密码一起输入的名字|enter your username · forget your username|one word|是一个词
      browser|opened to go to our website;the one you use;all of them showing a page|a browser is a program for websites; a username is a name|browser 是浏览器；username 是用户名|username/usernames=a username is a name you log in with, not a program you open=username 是登录名，不是要打开的程序;profile/profiles=a profile is a description of a person, not a program you open=profile 是个人资料，不是要打开的程序|a web browser · open your browser|from *browse*: to look around|来自 *browse*：浏览
      link|click to read more;dangerous in emails from strangers;sent to a video|a link takes you to another page; a browser is the program|link 是链接；browser 是浏览器|browser/browsers=a browser is a program, not a word you click to go to another page=browser 是程序，不是点击跳转的文字;username/usernames=a username is a name you log in with, not something you click=username 是用户名，不是点击的东西|click on a link · send a link|also a verb: link two pages|也是动词：link two pages
      update|newest software on a phone;news every hour;new for an app|to update is to make newer; to record is to store sound or pictures|update 是更新；record 是录制|record/recorded=to record is to store sound or pictures, not to make software newer=record 是录制，不是更新;measure/measured=to measure is to find the size of something, not to make it newer=measure 是测量，不是更新;installed=to install is to put a program on, not to add news every hour=install 是安装，不是每小时更新;browser=a browser is a program, not a newer version=browser 是程序，不是新版本;username=a username is a name, not a newer version of an app=username 是用户名，不是新版本|update the software · a new update|noun and verb|既是名词也是动词
      install|a game on a phone;a washing machine;apps from unknown websites|to install is to put a program or machine in; to delete is to remove it|install 是安装；delete 是删除|measured/measure=to measure is to find the size of something, not to put it in=measure 是测量，不是安装;enabled/enable=to enable is to make something possible, not to put a program or machine in=enable 是使能够，不是安装;update=to update is to make something newer, not to put a new machine in=update 是更新，不是安装新机器;delete=to delete is to remove, not to put in=delete 是删除，不是安装|install an app · install a machine|noun *installation*|名词 *installation*
    `,
  },
});

const safety = vocabularyTopic({
  id: "b1-words-online-safety",
  title: t("Online Safety", "网络安全"),
  summary: t(
    "Privacy and security; hackers, spam and scams; cyberbullying; being addicted and addictions; identity; personal, private and anonymous.",
    "隐私和安全；黑客、垃圾邮件和骗局；网络欺凌；上瘾和瘾；身份；个人的、私密的和匿名的。",
  ),
  intro: t(
    "Online, a **hacker** may try to steal your **identity**, a **scam** may ask for your bank details, and **spam** fills your inbox. These words help you stay safe and protect your **privacy** on the internet.",
    "网上，**hacker**（黑客）可能想盗用你的 **identity**（身份），**scam**（骗局）可能骗你的银行信息，**spam**（垃圾邮件）塞满收件箱。这些词帮你在网上保护 **privacy**（隐私）、保证安全。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "privacy",
      "being able to keep your life and your information to yourself",
      "隐私",
      "Check the {privacy} settings so strangers can't see your photos.|spam addiction | Everyone has the right to {privacy}.|spam addiction | I need some {privacy}: I want to be alone, so please knock before you come in.|spam security",
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
      "A {hacker}, a man in his twenties, stole thousands of passwords.|scam spam | {Hackers} got into the bank's computer system.|Scams Spams | The company paid a {hacker} to test its security.|scam spam",
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
      "That email was just a trick to get money: the {scam} asked for my bank details.|hacker identity | My grandma nearly lost her money in a phone {scam}.|hacker identity | Learn how to spot online {scams}.|hackers identities",
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
      "My brother is {addicted} to video games: he plays all night and can't stop. | Some people are so {addicted} to their phones that they can't put them down. | You can get {addicted} to sugar and find it very hard to stop eating it.",
      "used allergic",
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
      "Never share {personal} information, like your address, online.|addicted anonymous | This is my {personal} opinion.|addicted anonymous | She writes her {personal} thoughts in a diary.|addicted anonymous",
      "private anonymous",
    ),
    word(
      "private",
      "only for one person or a small group, not for everyone",
      "私人的；私密的",
      "Our conversation is {private}. Please leave us alone.|addicted anonymous | Make your account {private} so that only friends can see it.|addicted automatic | His parents pay for his {private} school.|addicted anonymous",
      "personal public",
    ),
    word(
      "anonymous",
      "with a name that is not known or not given",
      "匿名的",
      "The police got a phone call that was {anonymous}: the caller didn't give a name.|addicted personal | The writer wants to stay {anonymous}.|addicted personal | The letter was {anonymous}. Nobody knows who wrote it.|addicted personal",
      "private personal",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Privacy* is about keeping your information to yourself; *security* is about being safe from attack. Look for clues like *strangers can't see* or *strong password*.",
        "*privacy* 是不让别人知道你的信息；*security* 是不受攻击、保证安全。留意 *strangers can't see* 或 *strong password* 这类线索。",
      ),
      meaning: t(
        "*Spam* and *scam* look alike, but *spam* is messages you didn't ask for, and a *scam* is a dishonest plan to take your money. Check whether the meaning talks about unwanted messages or cheating.",
        "*spam* 和 *scam* 很像，但 *spam* 是你没要的垃圾信息，*scam* 是骗钱的诡计。看释义说的是垃圾信息还是欺骗。",
      ),
      spell: t(
        "*Anonymous* ends in -ous: a-n-o-n-y-m-o-u-s, with a y in the middle.",
        "*anonymous* 以 -ous 结尾：a-n-o-n-y-m-o-u-s，中间是 y。",
      ),
    },
    notes: `
      privacy|settings so strangers can't see photos;a right everyone has;being alone behind a closed door|privacy is keeping your life to yourself; security is being safe from attack|privacy 是隐私；security 是安全|spam=spam is unwanted messages, not keeping your life to yourself=spam 是垃圾信息，不是隐私;addiction=an addiction is being unable to stop, not keeping your life to yourself=addiction 是成瘾，不是隐私;security=security is being safe from attack, not being alone=security 是安全保障，不是独处|privacy settings · the right to privacy|adjective *private*|形容词 *private*
      security|a strong password;airport bag checks;bank cameras|security is being safe from attack; spam is unwanted messages|security 是安全；spam 是垃圾邮件|spam=spam is unwanted messages, not being safe from attack=spam 是垃圾信息，不是安全;addiction=an addiction is being unable to stop, not being safe=addiction 是成瘾，不是安全|airport security · for security|adjective *secure*|形容词 *secure*
      hacker|a man in his twenties who stole passwords;people inside a bank system;paid to test security|a hacker is a person who breaks into computers; a scam is a dishonest plan|hacker 是黑客；scam 是骗局|scam/Scams=a scam is a dishonest plan, not a person who breaks into computers=scam 是骗局，不是入侵电脑的人;spam/Spams=spam is unwanted messages, not a person=spam 是垃圾信息，不是人|a hacker · hackers got into|verb *hack*|动词 *hack*
      spam|a full inbox;a folder for it;cheap watches|spam is unwanted messages; a hacker is a person|spam 是垃圾邮件；hacker 是黑客|hacker=a hacker is a person, not unwanted messages=hacker 是人，不是垃圾信息;identity=an identity is who someone is, not unwanted messages=identity 是身份，不是垃圾信息|a spam folder · full of spam|no plural|没有复数
      scam|a trick email asking for bank details;a phone call that nearly took grandma's money;ones to spot online|a scam is a dishonest plan to get money; spam is unwanted messages|scam 是骗局；spam 是垃圾邮件|hacker/hackers=a hacker is a person, not a dishonest plan=hacker 是人，不是骗局;identity/identities=an identity is who someone is, not a dishonest plan=identity 是身份，不是骗局|a phone scam · an online scam|*scam* is not *spam*|*scam* 不是 *spam*
      cyberbullying|making young people unhappy;something to tell an adult;strict school rules|cyberbullying is hurting people online; privacy is keeping things to yourself|cyberbullying 是网络欺凌；privacy 是隐私|Privacy/privacy=privacy is keeping your life to yourself, not hurting people online=privacy 是隐私，不是网络欺凌;Security/security=security is being safe from attack, not hurting someone online=security 是安全，不是网络欺凌;identity=an identity is who someone is, not hurting someone online=identity 是身份，不是网络欺凌|stop cyberbullying · report cyberbullying|*cyber-* means online|*cyber-* 表示网络
      addicted|games all night;phones people can't put down;sugar hard to stop|addicted means unable to stop; used to means familiar with|addicted 是上瘾的；used to 是习惯于|used=used to means familiar with something, not unable to stop=used to 是习惯，不是停不下来;allergic=allergic means your body reacts badly, not unable to stop=allergic 是过敏，不是上瘾|addicted to · get addicted|noun *addiction*|名词 *addiction*
      addiction|teenagers and phones;gaming help;hard ones to break|an addiction is being unable to stop; an identity is who you are|addiction 是成瘾；identity 是身份|identity/identities=an identity is who someone is, not being unable to stop=identity 是身份，不是成瘾;hacker=a hacker is a person, not being unable to stop=hacker 是黑客，不是成瘾;privacy/privacies=privacy is keeping your life to yourself, not being unable to stop=privacy 是隐私，不是成瘾|phone addiction · an addiction to|adjective *addicted*|形容词 *addicted*
      identity|a bank account in her name;a thief nobody knows yet;real names hidden online|identity is who someone is; an addiction is being unable to stop|identity 是身份；addiction 是成瘾|addiction/addictions=an addiction is being unable to stop, not who someone is=addiction 是成瘾，不是身份;privacy=privacy is keeping things to yourself, not who someone is=privacy 是隐私，不是身份;securities=security is being safe, not who someone is=security 是安全，不是身份|steal someone's identity · an identity card|plural *identities*|复数 *identities*
      personal|an address not to share;my own opinion;her own thoughts in a diary|personal means about one person; anonymous means with no name|personal 是个人的；anonymous 是匿名的|addicted=addicted means unable to stop, not about one person=addicted 是上瘾的，不是个人的;anonymous=anonymous means with no name given, not about one person's own life=anonymous 是匿名的，不是个人的|personal information · my personal opinion|*personal* is not *personnel*, the staff|*personal* 不是 *personnel*（全体员工）
      private|a conversation to be left alone for;an account only friends can see;a school parents pay for|private means only for one person or a few; anonymous means with no name|private 是私人的；anonymous 是匿名的|addicted=addicted means unable to stop, not only for a few people=addicted 是上瘾的，不是私人的;anonymous=anonymous means with no name given, not only for a few people=anonymous 是匿名的，不是私人的;automatic=automatic means working by itself, not only for friends=automatic 是自动的，不是仅限朋友的|a private school · keep it private|opposite *public*|反义词 *public*
      anonymous|a caller who gave no name;a writer whose name isn't known;a letter nobody knows who wrote|anonymous means with no name given; personal means about one person|anonymous 是匿名的；personal 是个人的|addicted=addicted means unable to stop, not with no name given=addicted 是上瘾的，不是匿名的;personal=personal means about one person, not with the name hidden=personal 是个人的，不是匿名的|stay anonymous · an anonymous letter|stress on *non*: a-NON-y-mous|重音在 *non*
    `,
  },
});

const research = vocabularyTopic({
  id: "b1-words-research-and-design",
  title: t("Research and Design", "研究和设计"),
  summary: t(
    "Technology and scientific research; experiments and laboratories; discovering and discoveries; developing and development; designing, creating and artificial things.",
    "技术和科学研究；实验和实验室；发现；发展和开发；设计、创造和人造的东西。",
  ),
  intro: t(
    "Scientists do **research** and **experiments** in a **laboratory** to **discover** new facts, and engineers **design** and **develop** new products. These words help you talk about science, technology and making new things.",
    "科学家在 **laboratory**（实验室）里做 **research**（研究）和 **experiments**（实验），以 **discover**（发现）新事实；工程师则 **design**（设计）并 **develop**（开发）新产品。这些词帮你谈论科学、技术和创造新事物。",
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
      "Our {scientific} experiment must be done carefully, step by step.|artificial anonymous | There is no {scientific} evidence for this.|artificial automatic | {Scientific} research takes many years.|Artificial Automatic",
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
      "We did a science {experiment} with ice and salt.|laboratory development | The {experiment} showed that plants need light.|laboratory development | Scientists do {experiments} to test their ideas.|laboratories developments",
      "research laboratory",
    ),
    word(
      "laboratory laboratories",
      "a room or a building where scientists work",
      "实验室",
      "The scientists work in the {laboratory} on the third floor.|discovery experiment | Our school has a new science {laboratory}.|discovery development | The samples were sent to a {laboratory}.|discovery development",
      "experiment research",
    ),
    word(
      "discover discovers discovered discovering",
      "to find or learn something for the first time",
      "发现",
      "Who {discovered} penicillin?|operated recorded | Scientists have {discovered} a new kind of frog living in the forest.|designed created | I {discovered} a great café near my house that I had never noticed before.|designed created",
      "invent find",
    ),
    word(
      "discovery discoveries",
      "finding or learning something for the first time; something found or learned",
      "发现",
      "The {discovery} of fire changed human life.|technology laboratory | Scientists made an important {discovery}: they found a new planet.|development design | The museum shows great {discoveries}, like electricity and penicillin.|laboratories designs",
      "invention development",
    ),
    word(
      "develop develops developed developing",
      "to grow or change into something bigger or better; to make a new product or idea",
      "发展；开发",
      "The company is {developing} and testing a new kind of battery that it will sell next year.|discovering recording | Children {develop} very quickly, growing and learning every day.|discover design | Reading helps you {develop} your English.|discover create",
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
      "The football pitch has {artificial} grass, not real grass.|scientific digital | These flowers are {artificial}. They're made of plastic.|scientific digital | {Artificial} intelligence can write and draw.|Scientific Digital",
      "fake scientific",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Discover* and *create* are different: you *discover* something that already exists but nobody knew about, and you *create* something that did not exist before. Ask whether the thing was already there.",
        "*discover* 和 *create* 不同：*discover* 是找到本来就存在但没人知道的东西，*create* 是造出原本没有的东西。想一想那个东西是否本来就在。",
      ),
      meaning: t(
        "*Research* is the careful study of a subject; an *experiment* is one scientific test inside that study. Check whether the meaning talks about a whole study or a single test.",
        "*research* 是对一个课题的认真研究；*experiment* 是研究中的一次科学测试。看释义说的是整个研究还是一次测试。",
      ),
      spell: t(
        "*Laboratory* ends in -ory: l-a-b-o-r-a-t-o-r-y; people often shorten it to *lab*.",
        "*laboratory* 以 -ory 结尾：l-a-b-o-r-a-t-o-r-y；人们常简称 *lab*。",
      ),
    },
    notes: `
      technology|how we work;new tools for students;phones improving every year|technology is science used to make machines; a laboratory is a room|technology 是科技；laboratory 是实验室|Laboratory/laboratory/laboratories=a laboratory is a room where scientists work, not the use of science to make tools=laboratory 是实验室，不是科技;Discovery/discovery/discoveries=a discovery is finding something, not machines and tools=discovery 是发现，不是机器和工具|new technology · phone technology|adjective *technological*|形容词 *technological*
      scientific|an experiment done step by step;evidence;research that takes years|scientific means of science; artificial means made by people|scientific 是科学的；artificial 是人造的|artificial/Artificial=artificial means made by people, not done in the careful way of science=artificial 是人造的，不是科学的;anonymous=anonymous means with no name, not of science=anonymous 是匿名的，不是科学的;automatic/Automatic=automatic means working by itself, not of science=automatic 是自动的，不是科学的|scientific research · scientific evidence|from *science*|来自 *science*
      research|brain diseases;sleep and memory;millions spent by a university|research is careful study to find facts; a laboratory is a room|research 是研究；laboratory 是实验室|laboratory/Laboratory=a laboratory is a room, not careful study=laboratory 是实验室，不是研究;discovery=a discovery is something found, not the study itself=discovery 是发现，不是研究本身;Development=development is growth or change, not careful study=development 是发展，不是研究;experiment=an experiment is one test, not all the careful study=experiment 是一次实验，不是全部研究|do research · research on|usually no plural|通常不用复数
      experiment|ice and salt;plants needing light;testing ideas|an experiment is a scientific test; a laboratory is a room|experiment 是实验；laboratory 是实验室|laboratory/laboratories=a laboratory is a room, not a test you do=laboratory 是实验室，不是做的测试;development/developments=development is growth or change, not a test=development 是发展，不是测试|do an experiment · a science experiment|verb too: experiment with|也是动词：experiment with
      laboratory|the third floor;a new science one;samples sent there|a laboratory is a room where scientists work; a discovery is something found|laboratory 是实验室；discovery 是发现|discovery=a discovery is something found, not a room where scientists work=discovery 是发现，不是工作的房间;experiment=an experiment is a test, not a room=experiment 是实验，不是房间;development=development is growth or change, not a room=development 是发展，不是房间|a science laboratory · in the laboratory|short form *lab*|简称 *lab*
      discover|penicillin;a new frog in the forest;a café never noticed before|to discover is to find something for the first time; to create is to make something new|discover 是发现；create 是创造|operated=to operate is to use a machine or do surgery, not to find something first=operate 是操作或做手术，不是发现;recorded=to record is to store sound or pictures, not to find something first=record 是录制，不是发现;designed=to design is to plan something new, not to find something that was there=design 是设计新东西，不是发现已有的;created=to create is to make something new, not to find what was there=create 是创造，不是发现|discover a new species · discover that|noun *discovery*|名词 *discovery*
      discovery|fire;a new planet;electricity and penicillin|a discovery is something found for the first time; a development is a growth or change|discovery 是发现；development 是发展|technology=technology is machines and tools, not finding fire=technology 是科技，不是发现火;laboratory/laboratories=a laboratory is a room, not something found=laboratory 是实验室，不是发现;development=a development is growth or change, not finding a planet=development 是发展，不是发现行星;design/designs=a design is a plan or drawing, not something found=design 是设计，不是发现|make a discovery · the discovery of|from *discover*|来自 *discover*
      develop|a battery tested to sell next year;children growing and learning;your English|to develop is to grow or make a new product; to discover is to find|develop 是发展、开发；discover 是发现|discovering/discover=to discover is to find something that was there, not to make or grow it=discover 是找到已有的，不是开发或成长;recording=to record is to store sound or pictures, not to make a new product=record 是录制，不是开发;design=to design is to plan how something looks, not to grow=design 是设计，不是成长;create=to create is to make something new, not to grow a skill=create 是创造，不是提高能力|develop a product · develop quickly|noun *development*|名词 *development*
      development|a child's growth;news in a story;ten years for a drug|development is growth or change; a discovery is something found|development 是发展；discovery 是发现|discovery/discoveries=a discovery is something found, not growth=discovery 是发现，不是成长;laboratory/laboratories=a laboratory is a room, not growth or change=laboratory 是实验室，不是发展变化;experiment=an experiment is one test, not the ten years of making a drug=experiment 是一次实验，不是十年的研发|a child's development · new developments|from *develop* + *-ment*|由 *develop* 加 *-ment* 构成
      design|clothes for a famous brand;a bridge by an engineer;a new phone's look|to design is to plan how something looks and works; to discover is to find|design 是设计；discover 是发现|discovers/discovered=to discover is to find something that was there, not to plan how it looks=discover 是发现，不是设计;develops=to develop is to grow or work on a product over time, not to plan how clothes look=develop 是开发，不是设计服装;researched=to research is to study, not to plan how a bridge looks=research 是研究，不是设计;research=research is careful study, not how a phone looks=research 是研究，不是外观设计;laboratory=a laboratory is a room, not how a phone looks=laboratory 是实验室，不是外观|design clothes · the design of|the g is silent|g 不发音
      create|a school website;a game by two teenagers;500 jobs|to create is to make something new; to discover is to find|create 是创造；discover 是发现|discovered/discover=to discover is to find something that was there, not to make something new=discover 是发现已有的，不是创造新的;researched/research=to research is to study, not to make something new=research 是研究，不是创造|create a website · create jobs|noun *creation*|名词 *creation*
      artificial|grass that isn't real;plastic flowers;intelligence that can write and draw|artificial means made by people; scientific means of science|artificial 是人造的；scientific 是科学的|scientific/Scientific=scientific means of science, not made by people instead of nature=scientific 是科学的，不是人造的;digital/Digital=digital means using computers, not made of plastic instead of nature=digital 是数字的，不是人造代替天然的|artificial grass · artificial intelligence|opposite *natural*|反义词 *natural*
    `,
  },
});

const gadgets = vocabularyTopic({
  id: "b1-words-gadgets",
  title: t("Gadgets", "小设备"),
  summary: t(
    "Smartphones, headphones and speakers; chargers and cables; drones and printers; microphones and remotes; consoles, gadgets and wireless things.",
    "智能手机、耳机和扬声器；充电器和数据线；无人机和打印机；麦克风和遥控器；游戏机、小设备和无线的东西。",
  ),
  intro: t(
    "You can play music on **wireless** **headphones** or a **speaker**, fly a **drone**, and charge your **smartphone** with a **charger** and a **cable**. These words help you talk about the gadgets you use every day.",
    "你可以用 **wireless**（无线的）**headphones**（耳机）或 **speaker**（音箱）放音乐，放飞 **drone**（无人机），用 **charger**（充电器）和 **cable**（数据线）给 **smartphone**（智能手机）充电。这些词帮你谈论每天用的小设备。",
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
      "Where's the {remote}? I want to change the channel.|cable charger | They live in a village so {remote} that the nearest shop is 50 kilometers away.|wireless automatic | Give me the {remote}! I want to turn the TV off.|cable charger",
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
      "My dad loves clever new {gadgets}, like a pen that records sound.|cables chargers | This kitchen {gadget} peels apples in seconds.|cable charger | He's always buying silly {gadgets} online.|cables chargers",
      "device console",
    ),
    word(
      "wireless",
      "without wires",
      "无线的",
      "My {wireless} mouse has no cable at all.|automatic anonymous | The café has free {wireless} internet.|remote artificial | {Wireless} headphones are easy to carry.|Remote Artificial",
      "digital remote",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Headphones* and *speakers* both play sound, but only you hear *headphones* on your ears, while *speakers* fill the room. Look for clues like *on the bus* or *I'm trying to study*.",
        "*headphones* 和 *speakers* 都能放声音，但 *headphones* 戴在耳朵上只有你听得到，*speakers* 则让整个房间都听到。留意 *on the bus* 或 *I'm trying to study* 这类线索。",
      ),
      meaning: t(
        "A *charger* puts electricity into a battery; a *cable* is just a wire that carries electricity or signals. Check whether the meaning talks about filling a battery or about a wire.",
        "*charger* 是给电池充电的东西；*cable* 只是传输电或信号的线。看释义说的是给电池充电还是一根线。",
      ),
      spell: t(
        "*Microphone* has ph for the f sound: m-i-c-r-o-p-h-o-n-e, like *headphones* and *smartphone*.",
        "*microphone* 用 ph 发 f 音：m-i-c-r-o-p-h-o-n-e，和 *headphones*、*smartphone* 一样。",
      ),
    },
    notes: `
      smartphone|chatting with friends;great photos;changing how we live|a smartphone is a phone that uses the internet; a charger fills its battery|smartphone 是智能手机；charger 是充电器|charger/Chargers=a charger puts electricity into a battery, not a phone you chat on=charger 是充电器，不是用来聊天的手机;cable/Cables=a cable is a wire, not a phone that takes photos=cable 是线，不是能拍照的手机|a smartphone app · use a smartphone|*smart* + *phone*, one word|*smart* 加 *phone*，一个词
      headphones|on while someone studies;music on the bus;wireless ones that cost a lot|headphones go on your ears; a drone flies|headphones 是耳机；drone 是无人机|chargers=chargers fill batteries, not things you wear on your ears=charger 是充电器，不是戴在耳朵上的;drones=drones fly in the air, not things you listen with=drone 在空中飞，不是用来听的;printers=printers put words on paper, not music in your ears=printer 是打印机，不是耳机;cables=cables are wires, and wireless ones have none=cable 是线，而无线的不会有线;manuals=manuals are books, not things that play music=manual 是说明书，不能放音乐|put on headphones · wireless headphones|usually plural|通常用复数
      speaker|music from the wall;turned up to hear;an hour about climate change|a speaker is where sound comes out, or a person giving a talk; a printer puts words on paper|speaker 是音箱、演讲者；printer 是打印机|drone/drones=a drone is a flying machine, not where sound comes from=drone 是无人机，不是出声音的地方;printer/printers=a printer puts words on paper, not sound or a talk=printer 是打印机，不出声音也不演讲|a loud speaker · the speaker talked|also a person who speaks|也指讲话的人
      charger|borrowed for a phone;left at home with a dying battery;different for each phone|a charger puts electricity into a battery; a drone is a flying machine|charger 是充电器；drone 是无人机|drone/drones=a drone is a flying machine, not something that fills a battery=drone 是无人机，不是充电的东西;remote/remotes=a remote controls a TV, not something that fills a battery=remote 是遥控器，不是充电器|a phone charger · different chargers|from *charge*|来自 *charge*
      cable|connecting a printer;all over the floor;long enough to reach the TV|a cable is a wire; a remote controls a TV from a distance|cable 是电缆、数据线；remote 是遥控器|drone/drones=a drone is a flying machine, not a wire=drone 是无人机，不是线;remote/remotes=a remote works from a distance with no wire=remote 是遥控器，没有线;wire=a wire is one thin metal thread, while a cable holds several wires inside a cover=wire 是单根金属线；cable 是外面包着皮的一束线|a cable · cables on the floor|*cable* also means cable TV|*cable* 也指有线电视
      drone|beach photos from the air;delivering parcels;not near the airport|a drone is a small aircraft without a pilot; a cable is a wire|drone 是无人机；cable 是线|cable/cables=a cable is a wire on the ground, not something that flies=cable 是地上的线，不会飞;charger/chargers=a charger fills a battery, not a flying machine=charger 是充电器，不会飞|fly a drone · by drone|*drone* also means a low, steady noise|*drone* 也指低沉的嗡嗡声
      printer|out of paper;a copy of a ticket;three in a library|a printer puts words onto paper; a remote controls a TV|printer 是打印机；remote 是遥控器|cable/cables=a cable is a wire, not a machine that uses paper=cable 是线，不是用纸的机器;remote/remotes=a remote changes TV channels, not a machine that makes copies=remote 是遥控器，不能打印|a printer · run out of paper|verb *print*|动词 *print*
      microphone|held close to a singer's mouth;a laptop where they can't hear me;speaking into it|a microphone takes in your voice; a printer puts words on paper|microphone 是麦克风；printer 是打印机|charger=a charger fills a battery, not something you speak into=charger 是充电器，不是对着说话的东西;printer=a printer uses paper, not your voice=printer 是用纸的，不是收声音的|speak into the microphone · a microphone|short form *mic*|简称 *mic*
      remote|changing the channel;a village 50 km from a shop;turning the TV off|a remote controls a TV from far away; a cable is a wire|remote 是遥控器、偏远的；cable 是线|cable=a cable is a wire, not what you use to change channels=cable 是线，不是换台的东西;charger=a charger fills a battery, not what changes channels=charger 是充电器，不能换台;wireless=wireless means without wires, not far from shops=wireless 是无线的，不是偏远的;automatic=automatic means working by itself, not far away=automatic 是自动的，不是偏远的|the TV remote · a remote village|short for *remote control*|是 *remote control* 的简称
      console|a birthday game machine;football games;expensive games machines|a console is a machine for video games; a charger fills a battery|console 是游戏机；charger 是充电器|charger/chargers=a charger fills a battery, not a machine for playing games=charger 是充电器，不是游戏机;cable/cables=a cable is a wire, not a machine for playing games=cable 是线，不是游戏机|a game console · play on a console|*console* also means to comfort someone|*console* 也有安慰的意思
      gadget|a pen that records sound;a kitchen apple peeler;silly things bought online|a gadget is a small, clever machine; a cable is a wire|gadget 是小器具；cable 是线|cables/cable=a cable is just a wire, not a clever little machine=cable 只是线，不是巧妙的小机器;chargers/charger=a charger fills a battery, not a clever machine that peels apples=charger 是充电器，不是削苹果的小机器|a kitchen gadget · new gadgets|*dg* in *gadget* sounds like j|*gadget* 里的 *dg* 读作 j 音
      wireless|a mouse with no cable;internet in a café;headphones easy to carry|wireless means without wires; remote means far away|wireless 是无线的；remote 是遥远的|automatic=automatic means working by itself, not without wires=automatic 是自动的，不是无线的;anonymous=anonymous means with no name, not without wires=anonymous 是匿名的，不是无线的;remote/Remote=remote means far away, not without wires=remote 是遥远的，不是无线的;artificial/Artificial=artificial means made by people, not without wires=artificial 是人造的，不是无线的|wireless internet · a wireless mouse|*wire* + *-less*: without wires|*wire* 加 *-less*：没有线
    `,
  },
});

const machines = vocabularyTopic({
  id: "b1-words-tech-verbs",
  title: t("What Machines Do", "机器能做什么"),
  summary: t(
    "Accessing, operating and replacing; depending and relying; allowing and enabling; communicating and recording; measuring, controlling and automatic machines.",
    "访问、操作和取代；依靠和依赖；允许和使能够；交流和记录；测量、控制和自动的机器。",
  ),
  intro: t(
    "An app may **allow** you to **access** your files, **enable** you to **control** the lights, or **record** and **measure** how far you walk. These words help you talk about what technology lets you do.",
    "一个应用可能 **allow**（允许）你 **access**（访问）文件，**enable**（使能够）你 **control**（控制）灯光，或者 **record**（记录）、**measure**（测量）你走了多远。这些词帮你谈论科技能让你做什么。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "access accesses accessed accessing",
      "to be able to get into or use a place or information; the right or the way to do this",
      "访问；使用权",
      "You can {access} your email from any computer. | Staff need a key card to get {access}: other people can't go into the room.|control help | I can't {access} the website. It's down.",
      "measure record",
    ),
    word(
      "operate operates operated operating",
      "to make a machine work; (of a doctor) to do an operation",
      "操作；做手术",
      "Can you {operate} this machine and make it work? | The doctors {operated} on her knee.|depended relied | The lift is {operated} by a button.",
      "measure record",
    ),
    word(
      "replace replaces replaced replacing",
      "to take the place of something; to put something new in place of something old",
      "取代；替换",
      "Robots may {replace} some workers in the future and do their jobs instead. | I need to {replace} the old battery in my watch with a new one. | The old bridge was {replaced} by a new one.|controlled recorded",
      "control record",
    ),
    word(
      "depend depends depended depending",
      "to need someone or something (depend on); to change because of something (it depends)",
      "依靠；取决于",
      '"Are you coming?" "It {depends} on the weather: if it rains, I\'ll stay home."|operates focuses | Many old people {depend} on their families for food and money. | We humans {depend} on electricity for almost everything we do.',
      "operate focus",
      "rely",
    ),
    word(
      "rely relies relied relying",
      "to need someone or something, or to trust that they will help you (rely on)",
      "依赖；信赖",
      "You can {rely} on me: I'll be there to help, I promise. | Too many students {rely} on their phones to do sums. | Farmers {rely} on rain for their crops.",
      "operate focus",
      "depend",
    ),
    word(
      "allow allows allowed allowing",
      "to let someone do something; to make something possible",
      "允许",
      "Phones are not {allowed} in the exam room: leave them outside.|controlled replaced | My parents don't {allow} me to stay out late: I must be home by nine. | The app {allows} you to send money to friends: it makes it possible.|tells asks",
      "tell ask",
    ),
    word(
      "enable enables enabled enabling",
      "to make it possible for someone to do something",
      "使能够",
      "The internet {enables} us to work from home: it makes it possible.|tells asks | This money will {enable} the school to buy new computers. | Glasses {enable} me to see clearly.",
      "tell ask",
    ),
    word(
      "communicate communicates communicated communicating",
      "to share information or feelings with someone",
      "交流；沟通",
      "We {communicate} by email: we write to each other every day. | Dolphins {communicate} with sounds, talking to each other. | It's hard to {communicate} when you don't speak the language.|operate measure",
      "operate travel",
    ),
    word(
      "record records recorded recording",
      "to store sounds or pictures so they can be heard or seen again; to write down information",
      "录制；记录",
      "We {recorded} a song in a real studio.|measured controlled | Can you {record} the match for me? I'll be out. | The nurse {records} your weight by writing it in a book.|measures controls",
      "measure control",
    ),
    word(
      "measure measures measured measuring",
      "to find the size, the amount or the speed of something",
      "测量",
      "The nurse {measured} my height with a ruler: 1.60 meters.|controlled replaced | This watch {measures} how far you walk, in kilometers.|controls replaces | {Measure} the room before you buy a carpet.",
      "control replace",
    ),
    word(
      "control controls controlled controlling",
      "to make something or someone do what you want; the power to do this",
      "控制",
      "You can {control} the lights with your phone: turn them on and off. | The driver lost {control} of the car, and it went off the road.|track help | The pilot {controlled} the plane through the storm.|measured recorded",
      "measure record",
    ),
    word(
      "automatic",
      "working by itself, without a person controlling it",
      "自动的",
      "The doors are {automatic}. They open when you walk up to them.|wireless anonymous | The {automatic} gearbox in my car changes gear by itself.|wireless anonymous | The heating is {automatic}. It comes on at six.|wireless anonymous",
      "digital wireless",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Depend* and *rely* are always followed by *on*: *depend on*, *rely on*. *Allow* and *enable* are followed by a person and *to*: *allow* me *to* go. Look at the words after the gap.",
        "*depend* 和 *rely* 后面总接 *on*：*depend on*、*rely on*。*allow* 和 *enable* 后面接人再接 *to*：*allow* me *to* go。看空格后面的词。",
      ),
      meaning: t(
        "*Record* and *measure* both deal with information, but you *measure* to find a size or an amount, and you *record* to store it so it can be seen or heard again. Check whether the meaning says find or store.",
        "*record* 和 *measure* 都和信息有关，但 *measure* 是测出大小或数量，*record* 是存下来以后再看再听。看释义说的是测出还是存下。",
      ),
      spell: t(
        "*Rely* changes y to i before -es and -ed: *relies*, *relied*, but keeps it in *relying*.",
        "*rely* 加 -es 和 -ed 时 y 变 i：*relies*、*relied*；但 *relying* 保留 y。",
      ),
    },
    notes: `
      access|email from any computer;a room only staff can enter;a website that is down|to access is to get into or use; to measure is to find a size|access 是访问、进入；measure 是测量|measure=to measure is to find a size or amount, not to get into a website=measure 是测量，不是进入网站;record=to record is to store sound or pictures, not to get into a website=record 是录制，不是访问网站;control=control is power over something, not the way into a room=control 是控制权，不是进门的权利;help=help is support from others, not the way into a room=help 是帮助，不是进门的权利|access a website · have access to|noun and verb|既是名词也是动词
      operate|a machine that works;surgery on a knee;a lift run by a button|to operate is to make a machine work or to do surgery; to measure is to find a size|operate 是操作、做手术；measure 是测量|measure/measured=to measure is to find a size, not to make a machine work=measure 是测量，不是操作机器;record/recorded=to record is to store sound or pictures, not to make a machine work=record 是录制，不是操作机器;depended=to depend on is to need, not to do surgery=depend on 是依靠，不是做手术;relied=to rely on is to trust, not to do surgery=rely on 是依赖，不是做手术|operate a machine · operate on a patient|noun *operation*|名词 *operation*
      replace|robots doing workers' jobs;a new watch battery;a new bridge for an old one|to replace is to put something new in place of the old; to control is to make something do what you want|replace 是替换；control 是控制|control/controlled=to control is to make something do what you want, not to put a new one in its place=control 是控制，不是替换;record/recorded=to record is to store sound or pictures, not to put something new in place=record 是录制，不是替换|replace a battery · replace with|*re-* + *place*: put in place again|*re-* 加 *place*：重新放置
      depend|weather and staying home;food and money from families;electricity for everything|to depend on is to need; to focus on is to give attention to|depend 是依靠、取决于；focus 是集中注意力|operate/operates=to operate is to make a machine work, not to need someone or change because of something=operate 是操作，不是依靠或取决于;focus/focuses=to focus on is to give your attention to, not to need or change because of=focus 是专注于，不是依靠或取决于|depend on · it depends|always with *on*|总是和 *on* 连用
      rely|me being there to help;phones for sums;rain for crops|to rely on is to need or trust; to focus on is to pay attention to|rely 是依赖；focus 是专注|operate=to operate is to make a machine work, not to need or trust someone=operate 是操作机器，不是依赖;focus=to focus on is to pay attention to, not to trust that someone will help=focus 是专注，不是信赖|rely on · you can rely on me|*relies*, *relied*: y becomes i|*relies*、*relied*：y 变 i
      allow|phones left outside an exam;home by nine;an app making payments possible|to allow is to let someone do something; to tell is to give an instruction|allow 是允许；tell 是告诉|controlled=to control is to make something do what you want, not to let it be somewhere=control 是控制，不是允许;replaced=to replace is to put something new instead, not to let it be somewhere=replace 是替换，不是允许;tell/tells=to tell someone to do something is to order it, not to let them=tell 是叫人做，不是允许;ask/asks=to ask someone to do something is to request it, not to let them=ask 是请求，不是允许|allow someone to · not allowed|*allow* rhymes with *now*|*allow* 和 *now* 押韵
      enable|working from home;money for new computers;seeing clearly with glasses|to enable is to make something possible; to ask is to request|enable 是使能够；ask 是请求|tell/tells=to tell someone to do something is to give an order, not to make it possible=tell 是吩咐，不是使能够;ask/asks=to ask someone to do something is to request it, not to make it possible=ask 是请求，不是使能够|enable someone to · enable you to|*en-* + *able*: make able|*en-* 加 *able*：使能够
      communicate|writing by email every day;dolphins and sounds;not speaking the language|to communicate is to share information; to travel is to go from place to place|communicate 是交流；travel 是旅行|operate=to operate is to make a machine work, not to share information=operate 是操作机器，不是交流;travel=to travel is to go from place to place, not to share information=travel 是旅行，不是交流;measure=to measure is to find a size, not to share feelings=measure 是测量，不是交流|communicate by email · communicate with|noun *communication*|名词 *communication*
      record|a song in a studio;a match while I'm out;weight written in a book|to record is to store sound, pictures or information; to measure is to find a size|record 是录制、记录；measure 是测量|measure/measured/measures=to measure is to find a size or amount, not to store it to see again=measure 是测量，不是存下来;control/controlled/controls=to control is to make something do what you want, not to store it=control 是控制，不是记录|record a song · record the match|noun *record*: stress on *REC*; verb: stress on *CORD*|名词重音在 *REC*，动词重音在 *CORD*
      measure|height with a ruler;kilometers walked;a room before buying a carpet|to measure is to find the size or amount; to control is to make something do what you want|measure 是测量；control 是控制|controlled/controls/Control=to control is to make something do what you want, not to find its size=control 是控制，不是测量;replaced/replaces/Replace=to replace is to put something new instead, not to find its size=replace 是替换，不是测量|measure the room · measure your height|noun *measurement*|名词 *measurement*
      control|lights turned on and off by phone;a car going off the road;a plane through a storm|to control is to make something do what you want; to measure is to find a size|control 是控制；measure 是测量|measure/measured=to measure is to find a size, not to make something do what you want=measure 是测量，不是控制;record/recorded=to record is to store sound or pictures, not to make something do what you want=record 是录制，不是控制;track=to lose track of something is to stop knowing where it is, not to stop steering it=lose track 是不知道在哪儿，不是失控;help=help is support from others, not the power to steer a car=help 是帮助，不是驾驶的控制力|lose control · control the lights|double l in *controlled*|*controlled* 双写 l
      automatic|doors that open by themselves;a gearbox changing gear itself;heating that comes on at six|automatic means working by itself; wireless means without wires|automatic 是自动的；wireless 是无线的|wireless=wireless means without wires, not working by itself=wireless 是无线的，不是自动的;anonymous=anonymous means with no name, not working by itself=anonymous 是匿名的，不是自动的|automatic doors · an automatic car|adverb *automatically*|副词 *automatically*
    `,
  },
});

const problems = vocabularyTopic({
  id: "b1-words-tech-problems",
  title: t("Tech Problems", "技术故障"),
  summary: t(
    "Crashes, errors and bugs; restarting and backups; signals, connections and wifi; being offline; upgrades, settings and manuals.",
    "崩溃、错误和程序缺陷；重启和备份；信号、连接和无线网络；离线；升级、设置和说明书。",
  ),
  intro: t(
    "When your laptop **crashes**, you may see an **error** message, have to **restart** it, or lose work you didn't keep a **backup** of. These words help you describe what goes wrong with technology and how to fix it.",
    "笔记本电脑 **crashes**（崩溃）时，你可能会看到 **error**（错误）提示，需要 **restart**（重启），或者丢掉没有 **backup**（备份）的文件。这些词帮你描述科技出了什么问题、怎么解决。",
  ),
  prerequisites: ["b1-words-digital"],
  words: [
    word(
      "crash crashes crashed crashing",
      "(of a computer) to stop working suddenly; to hit something hard",
      "崩溃；撞车",
      "My laptop suddenly {crashed} and stopped working, and I lost my work. | The car {crashed} into a tree at high speed and was badly damaged.|turned pulled | The app keeps {crashing}: it suddenly stops working, and I lose what I typed.|restarting upgrading",
      "restarted upgraded",
    ),
    word(
      "error errors",
      "a mistake",
      "错误",
      "When I clicked save, the screen showed this {error} message: something had gone wrong.|backup signal | There are a few {errors} in your essay.|backups signals | The computer made a small {error} in the sum, so the answer was wrong.|backup signal",
      "bug mistake",
    ),
    word(
      "bug bugs",
      "a mistake in a computer program; a small insect",
      "程序缺陷；小虫",
      "The new update fixed a {bug} in the game that made it freeze.|signal backup | There's a {bug} in the program that makes it crash.|signal setting | We found little {bugs} crawling on the kitchen floor.|signals backups",
      "error virus",
    ),
    word(
      "restart restarts restarted restarting",
      "to start again, especially a computer",
      "重启",
      "Try to {restart} your computer: turn it off and on again. | The phone went black for a second, then {restarted} and turned back on.|crashed upgraded | After the storm, the trains stopped, but they {restarted} at noon and ran normally again.|crashed upgraded",
      "crash upgrade",
    ),
    word(
      "backup backups",
      "a copy of computer files, kept in case the first one is lost",
      "备份",
      "Always make a {backup} of your photos in case you lose your phone.|signal setting | I lost my phone, but I had a {backup} of everything.|signal setting | The company makes {backups}, copies of all its files, every night.|signals settings",
      "copy setting",
    ),
    word(
      "signal signals",
      "the waves that carry phone or TV information; a sign or a movement that gives a message",
      "信号",
      "There's no phone {signal} in the mountains.|backup manual | The {signal} is weak in this room, so my calls keep dropping.|backup manual | The teacher gave the {signal} to start by raising her hand.|backup manual",
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
      "What's the {wifi} password? I want to get online.|manual backup | The hotel has free {wifi}, so you can use the internet in your room.|manual backup | The {wifi} isn't working in my bedroom, so I can't get online.|manual backup",
      "signal connection",
    ),
    word(
      "offline",
      "not connected to the internet",
      "离线的",
      "When you are {offline}, with no internet, you can still play this game. | The website is {offline} for a few hours: nobody can open it. | Download the map so you can use it when you are {offline} and have no internet.",
      "online available",
    ),
    word(
      "upgrade upgrades upgraded upgrading",
      "to make a machine or a program better or newer; a better or newer one",
      "升级",
      "I {upgraded} my old phone, and now it's faster and has more space.|crashed restarted | It's time to {upgrade} your software to the newest version. | The airline gave us a free {upgrade} to first class.",
      "crash restart",
    ),
    word(
      "setting settings",
      "a choice you make about how a machine or a program works",
      "设置",
      "Change the {settings} to make the screen brighter.|backups signals | Go to {settings} and turn off the sound.|backup manual | Choose the night {setting} on your camera for photos in the dark.|backup manual",
      "manual control",
    ),
    word(
      "manual manuals",
      "a book that tells you how to use a machine",
      "说明书；手册",
      "Read the {manual} before you use the drill.|signal setting | I lost the {manual} for the washing machine, so I don't know how to use it.|signal setting | The camera comes with a long {manual} that explains every button.|signal wifi",
      "setting guide",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Crash* and *restart* are verbs, so they change: *it crashed*, *it keeps crashing*. *Error*, *bug*, *backup* and *setting* are nouns that take a plural *-s*. Look at the words before the gap.",
        "*crash* 和 *restart* 是动词，要变形：*it crashed*、*it keeps crashing*。*error*、*bug*、*backup*、*setting* 是名词，复数加 *-s*。看空格前面的词。",
      ),
      meaning: t(
        "A *bug* and an *error* are both mistakes, but a *bug* is a mistake hidden in a program, while an *error* is any mistake, including one in an essay. Check whether the meaning talks about a program.",
        "*bug* 和 *error* 都是错误，但 *bug* 是程序里藏着的毛病，*error* 指任何错误，作文里的也算。看释义说的是不是程序。",
      ),
      spell: t(
        "*Wifi* is also written *Wi-Fi*; *offline* and *backup* are written as one word.",
        "*wifi* 也写作 *Wi-Fi*；*offline* 和 *backup* 都连写成一个词。",
      ),
    },
    notes: `
      crash|a laptop losing work;a car hitting a tree;an app that stops suddenly|to crash is to stop working suddenly or to hit something; to restart is to start again|crash 是崩溃、撞车；restart 是重启|restarted/restarting=to restart is to start again, not to stop working suddenly=restart 是重新启动，不是突然停止;upgraded/upgrading=to upgrade is to make something newer, not to stop working suddenly=upgrade 是升级，不是崩溃;turned=to turn into something is to become it, not to hit it and be damaged=turn into 是变成，不是撞上;pulled=to pull into a place is to drive into it and stop, not to hit it hard=pull into 是开进去停下，不是撞上|crash into · the computer crashed|noun and verb: *a crash*|也是名词：*a crash*
      error|a message that something went wrong;mistakes in an essay;a wrong sum|an error is any mistake; a bug is a mistake in a program|error 是任何错误；bug 是程序缺陷|backup/backups=a backup is a copy of files, not a mistake=backup 是备份，不是错误;signal/signals=a signal is the waves that carry phone information, not a mistake=signal 是信号，不是错误|an error message · make an error|*rr* in the middle|中间双写 *rr*
      bug|a game that froze;a program that crashes;insects on the floor|a bug is a mistake in a program or a small insect; an error is any mistake|bug 是程序缺陷或小虫；error 是任何错误|signal/signals=a signal carries phone or TV information, it is not a mistake or an insect=signal 是信号，不是缺陷或虫子;backup/backups=a backup is a copy of files, not a mistake or an insect=backup 是备份，不是缺陷或虫子;setting=a setting is a choice about how a program works, not a mistake in it=setting 是设置，不是缺陷|fix a bug · a bug in the program|two meanings: program mistake and insect|两个意思：程序缺陷和小虫
      restart|turning a computer off and on;a phone coming back on;trains running again|to restart is to start again; to crash is to stop suddenly|restart 是重启；crash 是崩溃|crash/crashed=to crash is to stop working suddenly, not to start again=crash 是崩溃，不是重新开始;upgrade/upgraded=to upgrade is to make something newer, not to start it again=upgrade 是升级，不是重启|restart your computer · restart the game|*re-* + *start*: start again|*re-* 加 *start*：重新开始
      backup|photos kept in case of loss;everything saved before a phone was lost;copies made every night|a backup is a copy kept in case the first is lost; a setting is a choice about how a machine works|backup 是备份；setting 是设置|signal/signals=a signal carries phone information, it is not a copy of files=signal 是信号，不是备份;setting/settings=a setting is a choice about how a machine works, not a copy of files=setting 是设置，不是备份|make a backup · a backup of your files|noun *backup* is one word; verb *back up* is two|名词 *backup* 连写；动词 *back up* 分开
      signal|phones in the mountains;calls dropping in a room;a teacher raising a hand|a signal is the waves that carry phone information, or a sign; a connection is a link between two things|signal 是信号；connection 是连接|backup=a backup is a copy of files, not waves that carry calls or a sign=backup 是备份，不是信号;manual=a manual is a book that explains a machine, not the waves that carry phone information or a sign=manual 是说明书，不是信号|no signal · a weak signal|verb *signal*: to give a sign|也是动词：发信号
      connection|slow internet;a printer linked to a computer;sleep and exam results|a connection is a link between two things; a signal is the waves that carry information|connection 是连接、关联；signal 是信号|setting=a setting is a choice about how a machine works, not a link between two things=setting 是设置，不是连接;manual=a manual is a book that explains a machine, not a link=manual 是说明书，不是连接;backup=a backup is a copy of files, not a link between two things=backup 是备份，不是关联|internet connection · a connection between|verb *connect* + *-ion*|动词 *connect* 加 *-ion*
      wifi|a password to get online;internet in a hotel room;no internet in a bedroom|wifi is a way to connect to the internet without wires; a signal is the waves that carry information|wifi 是无线网络；signal 是信号|manual=a manual is a book that explains a machine, not a way to get online=manual 是说明书，不是无线网络;backup=a backup is a copy of files, not a way to get online=backup 是备份，不是无线网络|free wifi · the wifi password|also written *Wi-Fi*|也写作 *Wi-Fi*
      offline|a game played with no internet;a website nobody can open;a map used with no internet|offline means not connected to the internet; online means connected|offline 是离线的；online 是在线的|online=online means connected to the internet, the opposite of having no internet=online 是在线的，和没有网络正相反;available=available means ready to use, not cut off from the internet=available 是可用的，不是离线的|go offline · use it offline|opposite of *online*|反义词 *online*
      upgrade|an old phone made faster;software to the newest version;a seat in first class|to upgrade is to make something better or newer; to restart is to start it again|upgrade 是升级；restart 是重启|crashed/crash=to crash is to stop working suddenly, not to make something better=crash 是崩溃，不是升级;restarted/restart=to restart is to start again, not to make something newer=restart 是重启，不是升级|upgrade your phone · a free upgrade|noun and verb|既是名词也是动词
      setting|a brighter screen;turning off the sound;night photos on a camera|a setting is a choice about how a machine works; a manual is a book that explains it|setting 是设置；manual 是说明书|backups/backup=a backup is a copy of files, not a choice about how a machine works=backup 是备份，不是设置;signals=signals carry phone information, they are not choices about a screen=signal 是信号，不是设置;manual=a manual is a book about a machine, not a choice you make on it=manual 是说明书，不是设置|change the settings · go to settings|from *set* + *-ting*: double t|*set* 加 *-ting*：双写 t
      manual|reading before using a drill;not knowing how to use a washing machine;every button of a camera explained|a manual is a book that tells you how to use a machine; a setting is a choice about how it works|manual 是说明书；setting 是设置|signal=a signal carries phone information, it is not a book you read=signal 是信号，不是说明书;setting=a setting is a choice on a machine, not a book about it=setting 是设置，不是说明书;wifi=wifi is a way to get online, not a book that explains a machine=wifi 是无线网络，不是说明书|read the manual · a user manual|adjective *manual*: done by hand|形容词 *manual*：手动的
    `,
  },
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

/** imaginePeople are a person, the pronoun that stands for them, and whether the present takes -s after them. */
const imaginePeople: readonly (readonly [string, string, boolean])[] = [
  ["Sam", "he", true],
  ["Lucy", "she", true],
  ["my cousins", "they", false],
  ["we", "we", false],
  ["you", "you", false],
  ["I", "I", false],
  ["my sister", "she", true],
  ["our neighbors", "they", false],
];

/** imagineActs are the past, base form and present with -s of a verb, the rest of the if-part, and the verb and rest of the result. */
const imagineActs: readonly (readonly [string, string, string, string, string, string])[] = [
  ["had", "have", "has", "a faster computer", "finish", "the work sooner"],
  ["knew", "know", "knows", "how to code", "build", "a game"],
  ["lived", "live", "lives", "near the beach", "go", "swimming every day"],
  ["owned", "own", "owns", "a 3D printer", "make", "toys"],
  ["spoke", "speak", "speaks", "Japanese", "travel", "to Tokyo"],
  ["won", "win", "wins", "a lot of money", "buy", "a new laptop"],
  ["got", "get", "gets", "up earlier", "have", "time for breakfast"],
  ["used", "use", "uses", "the phone less", "sleep", "better"],
  ["found", "find", "finds", "a lost dog", "take", "it home"],
  ["practiced", "practice", "practices", "more", "play", "the guitar well"],
  ["saw", "see", "sees", "a ghost", "run", "away"],
  ["drove", "drive", "drives", "to school", "save", "a lot of time"],
  ["ate", "eat", "eats", "less sugar", "feel", "healthier"],
];

/** imaginedRows builds imagined situations for every person and act, with the name in the clause that comes first. */
const imaginedRows = (nameFirstInIf: boolean) =>
  everyPair(imaginePeople, imagineActs).map(([[person, pronoun, s], [past, base, third, rest, rv, rr]]) => {
    const [ifSubject, resultSubject] = nameFirstInIf ? [person, pronoun] : [pronoun, person];
    return [ifSubject, past, base, s ? third : base, rest, resultSubject, rv, rr] as const;
  });

/** imaginedIfFirst and imaginedResultFirst are the situations for sentences that start with the if-part or the result. */
const imaginedIfFirst = [...imagined, ...imaginedRows(true)];
const imaginedResultFirst = [...imagined, ...imaginedRows(false)];

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
  imaginedIfFirst.map(
    ([s, past, base, present, rest, rs, rv, rr]): ChoiceItem => [
      `${joinWords("If", s, "___", rest)}, ${joinWords(rs, "would", rv, rr)}.`,
      past,
      [`would ${base}`, present],
    ],
  ),
  imaginedResultFirst.map(
    ([s, past, base, present, rest, rs, rv, rr]): ChoiceItem => [
      `${joinWords(sentenceCase(rs), "would", rv, rr, "if", s, "___", rest)}.`,
      past,
      [`would ${base}`, present],
    ],
  ),
]);

const wouldChoice: readonly ChoiceItem[] = interleave([
  imaginedIfFirst.map(
    ([s, past, , , rest, rs, rv, rr]): ChoiceItem => [
      `${joinWords("If", s, past, rest)}, ${joinWords(rs, "___", rr)}.`,
      `would ${rv}`,
      [`will ${rv}`, `would to ${rv}`],
    ],
  ),
  imaginedResultFirst.map(
    ([s, past, , , rest, rs, rv, rr]): ChoiceItem => [
      `${joinWords(sentenceCase(rs), "___", rr, "if", s, past, rest)}.`,
      `would ${rv}`,
      [`will ${rv}`, `would to ${rv}`],
    ],
  ),
]);

const imaginedTyped: readonly TypedItem[] = interleave([
  imaginedIfFirst.map(
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
  imaginedResultFirst.map(
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
  const check =
    right === "were"
      ? t(
          "**Check.** Spot *would* in the result clause: the situation is imagined, and *be* takes *were* for every subject in the *if*-clause.",
          "**检验。** 看结果句里的 *would*：这是假设想象的情况，*if* 从句里 *be* 对所有人称都用 *were*。",
        )
      : t(
          `**Check.** Spot *would* in the result clause: the situation is imagined, so the *if*-clause takes the past simple (*${right}*), not *would* or the present.`,
          `**检验。** 看结果句里的 *would*：这是假设想象的情况，所以 *if* 从句用一般过去时（*${right}*），不用 *would* 或现在时。`,
        );
  return t(`${rule.en}: ${fill(shown, right)}\n\n${check.en}`, `${rule["zh-CN"]}：${fill(shown, right)}\n\n${check["zh-CN"]}`);
};

/** whyNotIfPast explains would or the present in the if-part of a second conditional. */
const whyNotIfPast = (wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t("*would* never goes inside the *if*-clause of a second conditional.", "第二条件句的 *if* 从句里不能用 *would*。")
    : t(
        `*${wrong}* is the present simple, which is for a real possibility. The *would* in the result shows this situation is imagined.`,
        `*${wrong}* 是一般现在时，用于真实可能。结果部分有 *would*，说明这是想象的情况，不能用现在时。`,
      );

/** wouldWhy explains would and the base form in the result of a second conditional. */
const wouldWhy = (right: string, shown: string): Text =>
  t(
    `The *if*-part is in the past, so the situation is only imagined, and the result takes *would* and the base form: ${fill(shown, right)}\n\n**Check.** Verify the pairing: past simple in the *if*-clause → *would* + plain verb (no *to*, not *will*) in the result.`,
    `*if* 部分用了过去时，说明是想象的情况，结果部分用 *would* 加动词原形：${fill(shown, right)}\n\n**检验。** 核对搭配：*if* 从句用一般过去时 → 结果主句用 *would* + 动词原形（不加 *to*，也不用 *will*）。`,
  );

/** whyNotWould explains will or would to in the result of a second conditional. */
const whyNotWould = (_wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        "*will* is for a real future possibility and does not pair with an imagined past-tense *if*-clause.",
        "*will* 用于真实将来可能，不能和表示想象的过去时 *if* 从句搭配。",
      )
    : t("*would* is followed directly by the base verb, never by *to*.", "*would* 后面直接接动词原形，从不加 *to*。");

/** imaginedWriteWhy explains how a second conditional is put together, with the comma when the if-part comes first. */
const imaginedWriteWhy = (right: string): Text =>
  right.startsWith("If ")
    ? t(
        `For an imagined situation, the *if*-part takes the past simple, then a comma, and the result takes *would* and the base form: ${right}\n\n**Check.** Check all three marks: past simple after *If* (no *would*), a comma between the clauses, and *would/'d* + base verb in the result.`,
        `想象的情况，*if* 部分用一般过去时，后面加逗号，结果部分用 *would* 加动词原形：${right}\n\n**检验。** 核对三处：*If* 从句用一般过去时（不加 *would*）、两句间有逗号、结果主句用 *would/'d* + 动词原形。`,
      )
    : t(
        `For an imagined situation, the result takes *would* and the base form, and the *if*-part after it takes the past simple, with no comma: ${right}\n\n**Check.** Check all three marks: *would/'d* + base verb first, no comma before *if*, and past simple after *if*.`,
        `想象的情况，结果部分用 *would* 加动词原形，后面的 *if* 部分用一般过去时，不加逗号：${right}\n\n**检验。** 核对三处：先写 *would/'d* + 动词原形、*if* 前不加逗号、*if* 后用一般过去时。`,
      );

const secondConditional: TopicDef = {
  id: "second-conditional",
  title: t("If I Had, I Would", "如果我有，我就会（第二条件句）"),
  summary: t(
    "If I had a robot, I would never cook. An imagined situation takes the past after if and would in the result; If I were you is the usual form with be.",
    "If I had a robot, I would never cook。想象的情况在 if 后面用过去时，结果用 would；be 动词通常用 If I were you。",
  ),
  intro: t(
    "To imagine a different present or an unlikely future—*If we had faster trains, we would visit every weekend*—English shifts the *if*-clause to the past simple and uses *would* + base verb in the result.",
    "想象与现在不同或不太可能的情况（*If we had faster trains, we would visit every weekend*）时，英语把 *if* 从句动词往过去退一步，结果主句用 *would* + 动词原形。",
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
        "To talk about a situation you only imagine, now or in the future, use *if* + the **past simple**, and *would* in the result:\n\n- *If I **had** a robot, I would never cook.* (I don't have one.)\n- *If she **lived** near the sea, she would swim every day.* (She doesn't.)\n\nWith *be*, use *were* for every person: *If I **were** you, I would take the job.*\n\n> **Watch out.** The past simple here signals imagination, not past time—and never put *would* inside the *if*-clause (*If I would have* is wrong).",
        "说只是想象的情况（现在或将来）时，用 *if* 加**一般过去时**，结果部分用 *would*：\n\n- *If I **had** a robot, I would never cook.*（我其实没有。）\n- *If she **lived** near the sea, she would swim every day.*（她其实不住在海边。）\n\n*be* 动词对所有人称都用 *were*：*If I **were** you, I would take the job.*\n\n> **注意。** 这里的过去时表示假设想象，不是过去时间；且 *if* 从句里绝不能放 *would*（*If I would have* 是错的）。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), ifPastChoice, ifPastWhy, whyNotIfPast),
    ),
    point(
      "result",
      t("Would in the result", "结果部分用 would"),
      t(
        "The result of an imagined situation takes *would* + the base form: *If I were rich, I **would buy** a big house.* You may write *I'd* for *I would*.\n\n> **Watch out.** Do not use *will* with a past-tense *if*-clause, and never add *to* after *would* (*would to buy* is wrong).",
        "想象情况的结果用 *would* 加动词原形：*If I were rich, I **would buy** a big house.* *I would* 可以写成 *I'd*。\n\n> **注意。** 过去时的 *if* 从句不能配 *will*，且 *would* 后面从不加 *to*（*would to buy* 是错的）。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), wouldChoice, wouldWhy, whyNotWould),
    ),
    point(
      "write",
      t("Writing second conditionals", "写第二条件句"),
      t(
        "Write the sentence from the note about an imagined situation. The arrow → means the *if*-part comes first, with a comma: *imagine: if I have a robot → I never cook* becomes *If I had a robot, I would never cook.* The arrow ← means the result comes first, with no comma: *I would never cook if I had a robot.*\n\n> **Watch out.** Use *were* for *be* after *if* (*If I were...*), keep the verb after *would* in its plain form, and only add a comma when *If* starts the sentence.",
        "根据笔记写一个关于想象情况的句子。箭头 → 表示 *if* 部分在前，后面加逗号：*imagine: if I have a robot → I never cook* 写成 *If I had a robot, I would never cook.* 箭头 ← 表示结果在前，不加逗号：*I would never cook if I had a robot.*\n\n> **注意。** *if* 后的 *be* 用 *were*，*would* 后面用动词原形，只有 *If* 在句首时才加逗号。",
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
