// A2, unit 10: Technology. Devices, using them, staying in touch and machines; just, already and yet; an email to a
// friend judged by a model.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { interleave, pairUp, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";

const devices = vocabularyTopic({
  id: "a2-words-technology",
  title: t("Devices", "设备"),
  summary: t(
    "The internet, websites and apps; messages and texts; screens, keyboards, laptops and tablets; batteries, charging and passwords.",
    "互联网、网站和应用；消息和短信；屏幕、键盘、笔记本电脑和平板电脑；电池、充电和密码。",
  ),
  prerequisites: ["a1-words-things-at-home"],
  words: [
    word(
      "internet",
      "the network that joins computers all over the world",
      "互联网",
      "I found the answer on the {internet}.|keyboard battery | Is there {internet} in the hotel?|keyboard battery | We can't watch the film. The {internet} isn't working.|password message",
      "keyboard password",
    ),
    word(
      "website websites",
      "a place on the internet with pages about something",
      "网站",
      "You can buy tickets on the museum's {website}.|battery keyboard | Our school has a new {website} with photos of every class.|battery password | This {website} has free recipes.|battery keyboard",
      "battery keyboard",
    ),
    word(
      "app apps",
      "a program that you use on a phone or a tablet",
      "应用程序",
      "I use an {app} to learn new words.|battery keyboard | Download the {app} and you can order food from your phone.|battery screen | My phone has too many {apps}.|keyboards laptops",
      "battery screen",
    ),
    word(
      "message messages messaged messaging",
      "words that you send to someone; to send them",
      "消息；发消息",
      "I sent you a {message}. Did you get it?|screen keyboard | There's a {message} for you from Mom.|screen battery | She {messaged} me to say she was late.|charged typed",
      "screen password",
    ),
    word(
      "text texts texted texting",
      "a written message sent from one phone to another; to send one",
      "短信；发短信",
      '{Text} me when you get home.|Charge Type | I got a {text} from Dad: "I\'m outside."|screen battery | Stop {texting} at the dinner table!|charging deleting',
      "screen charge",
    ),
    word(
      "screen screens",
      "the flat glass part of a phone, a computer or a TV where you see pictures",
      "屏幕",
      "I dropped my phone and broke the {screen}.|password website | Don't sit too close to the {screen}.|keyboard battery | The {screen} is too dark. I can't see anything.|keyboard password",
      "keyboard battery",
    ),
    word(
      "keyboard keyboards",
      "the keys you press to type on a computer",
      "键盘",
      "Some keys on my {keyboard} don't work.|battery website | I spilled tea on the {keyboard}.|password website | This laptop has a small {keyboard}, so typing is hard.|battery password",
      "screen battery",
    ),
    word(
      "laptop laptops",
      "a small computer that you can carry",
      "笔记本电脑",
      "I take my {laptop} to the library to do my homework.|password website | My {laptop} is too heavy to carry every day.|password website | She works on her {laptop} on the train.|password battery",
      "password website",
    ),
    word(
      "tablet tablets",
      "a flat computer with a screen that you touch",
      "平板电脑",
      "My little sister watches cartoons on a {tablet}.|keyboard password | You can read books on a {tablet}.|password battery | The waiter took our order on a {tablet}.|password battery",
      "keyboard password",
    ),
    word(
      "battery batteries",
      "a thing that gives power to a phone, a toy or a clock",
      "电池",
      "My phone's {battery} is low. I need to charge it.|password keyboard | This toy needs two {batteries}.|passwords screens | The {battery} lasts all day.|password website",
      "password screen",
    ),
    word(
      "charge charges charged charging",
      "to put power into a battery",
      "充电",
      "I forgot to {charge} my phone, and now it's dead.|type text | My laptop is {charging}. Don't take the cable out!|typing texting | {Charge} the tablet before the trip.|Text Type",
      "type text",
    ),
    word(
      "password passwords",
      "a secret word you type to open a phone or a computer",
      "密码",
      "Don't tell anyone your {password}.|battery screen | I forgot my {password}, so I can't open my email.|battery keyboard | A good {password} has letters and numbers.|battery screen",
      "battery screen",
    ),
  ],
});

const usingTech = vocabularyTopic({
  id: "a2-words-using-tech",
  title: t("Using Technology", "使用科技"),
  summary: t(
    "Clicking and typing; downloading and uploading; searching, sending and receiving; deleting and printing; switches, buttons and files.",
    "点击和打字；下载和上传；搜索、发送和接收；删除和打印；开关、按钮和文件。",
  ),
  prerequisites: ["a2-words-technology"],
  words: [
    word(
      "click clicks clicked clicking",
      "to press a button on a mouse, or a link on a screen",
      "点击",
      "{Click} on the link to see the photos.|Print Send | I {clicked} the wrong button and lost my work.|printed received | Just {click} here to start the game.|print receive",
      "print send",
    ),
    word(
      "type types typed typing",
      "to write with a keyboard",
      "打字；输入",
      "{Type} your name in the box.|Search Receive | She can {type} very fast without looking at the keys.|print receive | I'm {typing} a message to my friend.|receiving switching",
      "print click",
    ),
    word(
      "download downloads downloaded downloading",
      "to copy something from the internet onto your phone or computer",
      "下载",
      "I {downloaded} a new game last night.|switched printed | You can {download} the app for free.|upload switch | The film is still {downloading}. It's 80% done.|switching clicking",
      "upload switch",
    ),
    word(
      "upload uploads uploaded uploading",
      "to put something from your phone or computer onto the internet",
      "上传",
      "She {uploaded} the photos of the party, so we can all see them.|downloaded switched | {Upload} your homework to the school website by Friday.|Download Switch | It takes a long time to {upload} a big video.|switch print",
      "download receive",
    ),
    word(
      "search searches searched searching",
      "to look carefully for something",
      "搜索；寻找",
      "I {searched} the internet for a cheap flight.|switched clicked | {Search} for the word, and the app will show you its meaning.|Switch Print | We {searched} everywhere for my keys.|switched deleted",
      "switch receive",
    ),
    word(
      "send sends sent sending",
      "to make a message or a letter go to someone",
      "发送；寄",
      "I'll {send} you the photos tonight.|receive switch | Did you {send} the email to your teacher?|receive switch | Grandma {sent} me a birthday card.|received deleted",
      "receive delete",
    ),
    word(
      "receive receives received receiving",
      "to get something that someone sends you",
      "收到",
      "Did you {receive} my message?|send switch | I {received} a letter from my pen pal today.|sent switched | You will {receive} an email with your tickets.|send click",
      "send delete",
    ),
    word(
      "delete deletes deleted deleting",
      "to take away words or a file from a computer or a phone",
      "删除",
      "I {deleted} the photo because I looked terrible in it.|received switched | Don't {delete} that file! I need it.|receive switch | Press this key to {delete} a letter.|receive switch",
      "receive print",
    ),
    word(
      "print prints printed printing",
      "to put words or pictures from a computer onto paper",
      "打印",
      "Can you {print} the tickets? I need them on paper.|switch delete | The printer {prints} ten pages a minute.|switches clicks | I {printed} my essay and gave it to the teacher.|switched received",
      "switch receive",
    ),
    word(
      "switch switches switched switching",
      "to turn a machine on or off; a small thing you press to do this",
      "开关；打开或关上",
      "{Switch} off the light when you leave.|Click Type | Where's the light {switch}?|file click | I {switched} on the TV to watch the news.|clicked printed",
      "click button",
    ),
    word(
      "button buttons",
      "a small thing you press to make a machine work; a small round thing on clothes",
      "按钮；纽扣",
      'Press the red {button} to stop the machine.|file password | Click the "Send" {button}.|file password | A {button} came off my shirt.|file switch',
      "file switch",
    ),
    word(
      "file files",
      "a document or a picture kept on a computer",
      "文件",
      "Save the {file} before you close it.|button switch | I can't open this {file}. It's too big.|button switch | Send me the {files} by email.|buttons switches",
      "button switch",
    ),
  ],
});

const communication = vocabularyTopic({
  id: "a2-words-communication",
  title: t("Staying in Touch", "保持联系"),
  summary: t(
    "Replying and chatting; information and contacts; connecting, social networks and addresses; explaining and meaning; robots; true.",
    "回复和聊天；信息和联系人；连接、社交网络和地址；解释和意思；机器人；真的。",
  ),
  prerequisites: ["a2-words-using-tech"],
  words: [
    word(
      "reply replies replied replying",
      "to answer a message or a letter; an answer",
      "回复",
      "I sent her a message, but she didn't {reply}.|connect explain | Please {reply} to this email by Friday.|connect mean | Thanks for your {reply}.|network address",
      "connect explain",
    ),
    word(
      "chat chats chatted chatting",
      "to talk in a friendly way",
      "聊天",
      "We {chatted} online for an hour.|connected meant | Let's have a {chat} over coffee.|network address | Stop {chatting} and listen to the teacher.|connecting meaning",
      "connect mean",
    ),
    word(
      "information",
      "facts about something",
      "信息",
      "You can find {information} about the museum on its website.|robots networks | For more {information}, call this number.|address robot | Thanks for the {information}.|network robot",
      "address network",
    ),
    word(
      "contact contacts contacted contacting",
      "to call or write to someone; a person whose number you have",
      "联系；联系人",
      "Please {contact} me if you have any questions.|connect mean | I {contacted} the shop, but nobody answered.|connected explained | Her phone has two hundred {contacts}.|networks robots",
      "connect reply",
    ),
    word(
      "connect connects connected connecting",
      "to join two things; to join a phone or a computer to the internet",
      "连接",
      "{Connect} the printer to your laptop with this cable.|Contact Reply | My phone won't {connect} to the hotel's wifi.|contact reply | A long bridge {connects} the island to the city.|contacts replies",
      "contact reply",
    ),
    word(
      "social",
      "about meeting and spending time with other people",
      "社交的",
      "{Social} media can take a lot of your time.|True Robot | She is very {social} and loves parties.|true robot | We use {social} apps to chat with friends.|true robot",
      "true useful",
    ),
    word(
      "network networks",
      "a group of computers, people or roads that are joined together",
      "网络",
      "All the computers in the school are on one {network}.|address information | The city has a big {network} of subway lines.|address information | Social {networks} help people keep in touch.|addresses robots",
      "address information",
    ),
    word(
      "address addresses",
      "the number, street and town where someone lives; the name you use for email",
      "地址",
      "What's your email {address}?|network information | Write the {address} on the envelope.|network robot | I've moved. Here is my new {address}.|network information",
      "network information",
    ),
    word(
      "explain explains explained explaining",
      "to make something clear so that someone understands it",
      "解释；说明",
      "Can you {explain} this word to me?|mean connect | The teacher {explained} the rules of the game.|meant connected | Let me {explain} why I was late.|mean reply",
      "mean reply",
    ),
    word(
      "mean means meant meaning",
      "to have as its meaning; to want to say or do",
      "意思是；本意是",
      'What does this word {mean}?|explain reply | "Huge" {means} very big.|explains replies | Sorry, I didn\'t {mean} to hurt you.|explain reply',
      "explain reply",
    ),
    word(
      "robot robots",
      "a machine that can move and do jobs like a person",
      "机器人",
      "In the future, {robots} will clean our homes.|networks addresses | This {robot} can play chess.|network address | A {robot} brought the food to our table.|network contact",
      "network address",
    ),
    word(
      "true",
      "right; correct; not false",
      "真的；正确的",
      "Is it {true} that you're moving to Shanghai?|social electric | That's not {true}! I didn't eat your cake!|social electric | It's a {true} story. It happened to my grandpa.|social electric",
      "social useful",
    ),
  ],
});

const machines = vocabularyTopic({
  id: "a2-words-machines",
  title: t("Machines", "机器"),
  summary: t(
    "Machines, inventing and inventors; wheels, motors and tools; power and electric things; television; useful; already and yet.",
    "机器、发明和发明家；轮子、马达和工具；电力和电动的东西；电视；有用的；already 和 yet。",
  ),
  prerequisites: ["a2-words-communication"],
  words: [
    word(
      "machine machines",
      "a thing with parts that move, which does a job",
      "机器",
      "We have a washing {machine} at home.|tool wheel | This {machine} makes coffee.|wheel inventor | {Machines} do a lot of the work in factories now.|Wheels Inventors",
      "tool wheel",
    ),
    word(
      "invent invents invented inventing",
      "to make something new that did not exist before",
      "发明",
      "Who {invented} the telephone?|powered connected | I want to {invent} a robot that does homework.|power switch | The Chinese {invented} paper a long time ago.|powered switched",
      "power connect",
    ),
    word(
      "inventor inventors",
      "a person who invents things",
      "发明家",
      "Edison was a famous American {inventor}.|machine motor | My brother wants to be an {inventor}.|machine motor | The {inventor} of the bicycle was German.|machine motor",
      "machine motor",
    ),
    word(
      "wheel wheels",
      "a round thing that turns under a car or a bike",
      "轮子",
      "A bike has two {wheels}.|motors tools | The {wheel} is one of the oldest inventions.|power electric | My suitcase has small {wheels}, so it's easy to pull.|tools powers",
      "motor tool",
    ),
    word(
      "power",
      "energy that makes machines work; strength",
      "能量；电力；力量",
      "There's no {power}. All the lights are off.|tool wheel | The wind gives {power} to the machines.|tools wheels | Solar {power} comes from the sun.|tool wheel",
      "tool wheel",
    ),
    word(
      "electric",
      "working with electricity, from a battery or a plug",
      "电的；电动的",
      "My dad drives an {electric} car.|wooden true | Be careful! The {electric} fence will hurt you.|useful true | We cook on an {electric} stove.|true social",
      "useful true",
    ),
    word(
      "television televisions",
      "a machine with a screen that shows programs",
      "电视",
      "We watched the football match on {television}.|machine wheel | Turn off the {television} and go to bed.|wheel tool | There's a big {television} in the living room.|wheel motor",
      "machine radio",
    ),
    word(
      "useful",
      "good for doing something; helping you",
      "有用的",
      "A dictionary is very {useful} when you learn English.|electric true | Thanks for the {useful} tips.|electric wooden | This app isn't very {useful}.|electric true",
      "electric true",
    ),
    word(
      "already",
      "before now, or sooner than expected",
      "已经",
      "I've {already} eaten, thanks.|yet ever | Is it {already} ten o'clock? I must go!|yet ever | She has {already} finished her homework.|yet ever",
      "yet ever",
    ),
    word(
      "yet",
      "until now, in questions and in sentences with not",
      "还；已经（用于疑问句和否定句）",
      "Have you finished {yet}?|ever never | I haven't seen the new film {yet}.|already ever | Is dinner ready {yet}? I'm hungry.|ever never",
      "already ever",
    ),
    word(
      "tool tools",
      "a thing you hold in your hand to do a job, such as a hammer",
      "工具",
      "A hammer is a {tool}.|motor wheel | Dad keeps his {tools} in the garage.|motors powers | You need the right {tool} to fix a bike.|motor power",
      "motor machine",
    ),
    word(
      "motor motors",
      "the part of a machine that makes it move",
      "马达；电动机",
      "This boat has a small {motor}.|tool wheel | The fan's {motor} is broken, so it won't turn.|tool inventor | Electric {motors} are quiet.|tools wheels",
      "tool wheel",
    ),
  ],
});

// The present perfect with just, already and yet.

/** doneThings are a verb, its past participle and the rest of the action. */
const doneThings: readonly (readonly [string, string, string])[] = [
  ["charge", "charged", "the laptop"],
  ["send", "sent", "the email"],
  ["download", "downloaded", "the new app"],
  ["print", "printed", "the tickets"],
  ["delete", "deleted", "the old photos"],
  ["reply", "replied", "to Tom's message"],
  ["switch", "switched", "off the computer"],
  ["upload", "uploaded", "the video"],
  ["read", "read", "the instructions"],
  ["buy", "bought", "the new game"],
  ["pay", "paid", "the bill"],
  ["write", "written", "the report"],
  ["take", "taken", "the photos"],
];

const yetFrames: readonly ((done: readonly [string, string, string]) => ChoiceItem)[] = [
  ([, participle, rest]) => [`Sorry, I haven't ${participle} ${rest} ___.`, "yet", ["already", "just"]],
  ([, participle, rest]) => [`Have you ${participle} ${rest} ___?`, "yet", ["just", "never"]],
  ([, participle, rest]) => [`Don't worry. I've ___ ${participle} ${rest}.`, "already", ["yet", "ever"]],
  ([, participle, rest]) => [`I've ___ ${participle} ${rest}. I did it a minute ago.`, "just", ["yet", "ever"]],
];

const justBank: readonly ChoiceItem[] = interleave(yetFrames.map((frame) => doneThings.map(frame)));

/** jaySubjects are a subject, its form of have, its short form and its negative. */
const jaySubjects: readonly (readonly [string, string, string, string])[] = [
  ["I", "have", "I've", "haven't"],
  ["She", "has", "She's", "hasn't"],
  ["We", "have", "We've", "haven't"],
  ["Tom", "has", "", "hasn't"],
  ["They", "have", "They've", "haven't"],
  ["My dad", "has", "", "hasn't"],
];

const jayTypedBank: readonly TypedItem[] = pairUp(52, jaySubjects, doneThings).map(
  ([[subject, have, short, not], [verb, participle, rest]], k): TypedItem => {
    const other = have === "have" ? "has" : "have";
    const kind = k % 4;
    if (kind === 0 || kind === 3) {
      const adverb = kind === 0 ? "just" : "already";
      const start = short ? `[${subject} ${have}|${short}]` : `${subject} ${have}`;
      return {
        shown: `${subject} / ${adverb} / ${verb} ${rest}`,
        accepted: [`${start} ${adverb} ${participle} ${rest}.`],
        canonical: `${subject} ${have} ${adverb} ${participle} ${rest}.`,
        wrong: [`${subject} ${have} ${participle} ${rest} ${adverb}.`, `${subject} ${other} ${adverb} ${participle} ${rest}.`],
      };
    }
    if (kind === 1)
      return {
        shown: `${subject} / not / ${verb} ${rest} / yet`,
        accepted: [`${subject} [${not}|${have} not] ${participle} ${rest} yet.`],
        canonical: `${subject} ${not} ${participle} ${rest} yet.`,
        wrong: [`${subject} ${not} ${participle} ${rest} already.`, `${subject} didn't ${verb} ${rest} yet.`],
      };
    const asked =
      subject === "I" || subject === "We" ? "you" : subject === "My dad" ? "your dad" : subject === "Tom" ? subject : subject.toLowerCase();
    const askHave = asked === "you" ? "Have" : have === "has" ? "Has" : "Have";
    return {
      shown: `${asked} / ${verb} ${rest} / yet?`,
      accepted: [`${askHave} ${asked} ${participle} ${rest} yet?`],
      wrong: [
        `Did ${asked} ${participle} ${rest} yet?`,
        verb === participle
          ? `${askHave === "Have" ? "Has" : "Have"} ${asked} ${participle} ${rest} yet?`
          : `${askHave} ${asked} ${verb} ${rest} yet?`,
      ],
    };
  },
);

const presentPerfectJustAlreadyYet: TopicDef = {
  id: "present-perfect-with-just-already-and-yet",
  title: t("Just, Already and Yet", "just、already 和 yet"),
  summary: t(
    "I have just sent it. Have you charged it yet? She has already left. The present perfect for things done, or not done, up to now.",
    "I have just sent it. Have you charged it yet? She has already left. 用现在完成时说到现在为止做了或还没做的事。",
  ),
  prerequisites: ["present-perfect-with-ever-and-never", "a2-words-machines"],
  encompasses: [
    { topic: "present-perfect-with-ever-and-never", weight: 0.4 },
    { topic: "a2-words-machines", weight: 0.1 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "which-word",
      t("Just, already or yet", "just、already 还是 yet"),
      t(
        "These three words go with the present perfect:\n\n- *just* means *a very short time ago*. It goes between *have* and the verb: *I've just sent it.*\n- *already* means *before now*, often sooner than you expected. It goes between *have* and the verb: *Don't worry. I've already paid.*\n- *yet* means *up to now*. It goes in questions and in sentences with *not*, at the end: *Have you finished yet? I haven't finished yet.*",
        "这三个词常和现在完成时一起用：\n\n- *just* 意思是“刚刚”，放在 *have* 和动词之间：*I've just sent it.*\n- *already* 意思是“已经”，常常比预想的早，放在 *have* 和动词之间：*Don't worry. I've already paid.*\n- *yet* 意思是“到现在为止”，用在疑问句和否定句的末尾：*Have you finished yet? I haven't finished yet.*\n\n中文“还没……”对应 *haven't ... yet*，“已经……了”对应 *have already ...*。",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), justBank, (right, shown) =>
        t(
          fill(shown, right),
          `${fill(shown, right)}（${right === "yet" ? "疑问句和否定句末尾用 yet" : right === "already" ? "already 表示“已经”，放在 have 和动词之间" : "just 表示“刚刚”，放在 have 和动词之间"}）`,
        ),
      ),
    ),
    point(
      "write",
      t("Writing with just, already and yet", "用 just、already 和 yet 写句子"),
      t(
        "Write the sentence from the note with *have* or *has* and the past participle. *just* and *already* go before the participle: *She has just sent the email.* *yet* goes at the end of a question or a sentence with *not*: *Have you paid the bill yet? Tom hasn't read the instructions yet.* Do not use *did* with the past participle.",
        "根据笔记写句子，用 *have / has* 加过去分词。*just* 和 *already* 放在过去分词前面：*She has just sent the email.* *yet* 放在疑问句或否定句的末尾：*Have you paid the bill yet? Tom hasn't read the instructions yet.* 不要用 *did* 加过去分词。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), jayTypedBank, (right) =>
        t(right, `${right}（have / has + just / already + 过去分词；……yet 放在句末）`),
      ),
    ),
  ],
};

// An email to a friend.

const emailBank: readonly WritingItem[] = [
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I've just got a new puppy. His name is Max, and he's very small and funny. He has already eaten one of my shoes! What have you done this week? Have you finished your exams yet? Write soon! Lily",
    model:
      "Hi Lily,\n\nThanks for your email. A new puppy, how lovely! Max sounds very funny, but keep your shoes away from him! I've just finished my exams, and I think they went well. The math exam was hard, but English was easy. This weekend I'm going to relax and see a film with my cousin. Can you send me a photo of Max?\n\nLove,\nAmy",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hello! We moved to our new flat last week. It's bigger than the old one, and I have my own room now. But I don't know anybody here yet. How is school? Have you started basketball again? Ben",
    model:
      "Hi Ben,\n\nCongratulations on the new flat! It's great that you have your own room now. Don't worry, you will make new friends soon. School is fine. We have a new science teacher, and she is really nice. Yes, I've started basketball again, and we have a match on Saturday. When can I come and see your new flat?\n\nSee you,\nJack",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I'm in London with my parents. It's raining every day, but the museums are amazing. Yesterday we saw a real dinosaur. What are you doing this summer? Are you going anywhere? Mei",
    model:
      "Dear Mei,\n\nThanks for your email from London! A real dinosaur sounds amazing, even with all the rain. This summer I'm staying at home for the first two weeks. Then my family is going to visit my grandparents by the sea. I'm going to swim every day. I've never been to London. What has been your favorite museum so far?\n\nBest wishes,\nLin",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi, I have a problem. My laptop is broken, and I need it for my homework. Do you know a good shop to repair it? Also, did you watch the football match last night? Sam",
    model:
      "Hi Sam,\n\nSorry to hear about your laptop! There's a good shop next to the bookstore in the mall. They repaired my phone last year, and it was cheap. You can use my old laptop until yours is ready, if you like. Yes, I watched the match. It was great, and our team won 2-1! Are you free on Saturday to play?\n\nYour friend,\nLeo",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! Guess what? I've just joined a dance class. We practice twice a week, and it's really fun. What about you? Have you found a new hobby? Let's meet soon! Sara",
    model:
      "Hi Sara,\n\nThat's great news! I didn't know you liked dancing. I haven't found a new hobby yet, but I've started to learn the guitar with my uncle. It's difficult, and my fingers hurt! Maybe I can play a song for you soon. Are you free next Sunday afternoon? We could go to the park and have ice cream.\n\nLove,\nKate",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hello from Canada! It's very cold here, and we have lots of snow. Yesterday I went skiing for the first time and fell ten times! Is it cold where you live? What did you do last weekend? Tom",
    model:
      "Hi Tom,\n\nThanks for your email! Skiing sounds fun, but ten times is a lot! I hope you didn't hurt yourself. It isn't very cold here. It's about fifteen degrees, and it's sunny. Last weekend I went to my friend's birthday party, and we played games all afternoon. Are you going to try skiing again?\n\nBest,\nDavid",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! My birthday is next Friday, and I'm going to have a small party at home. Can you come? Also, I've lost the book you lent me. I'm so sorry! Anna",
    model:
      "Hi Anna,\n\nThank you for the invitation! Yes, I'd love to come to your party on Friday. What time does it start? Don't worry about the book. I've already read it, and it wasn't very expensive. Maybe it's under your bed! This week I've been very busy with school projects, but I'm free on Friday evening.\n\nSee you soon,\nGrace",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I'm bored. My parents have taken my phone because I played games until midnight. I can only use the computer for homework. What are you reading at the moment? Can you recommend a good book? Max",
    model:
      "Hi Max,\n\nOh no, no phone! But maybe your parents are right. I'm reading a great book about a boy who lives on an island. It's exciting, and the ending is a surprise. You can borrow it when I finish it. I've just started a new game too, but I only play on weekends now. How long will your parents keep your phone?\n\nTake care,\nOscar",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I want to learn to cook. Last night I made dinner for my family for the first time. The rice was fine, but the fish was terrible! Do you cook? What's your favorite dish? Lucy",
    model:
      "Hi Lucy,\n\nWell done for cooking dinner! Don't worry about the fish. Fish is difficult. I cook sometimes with my mom. My favorite dish is tomato and egg noodles because it's quick and easy. I can send you the recipe if you like. Have you tried making dumplings? We could make some together next weekend.\n\nLove,\nJenny",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I've just started at a new school. The building is very old, but the teachers are kind. I sit next to a girl from Brazil. Do you still go to the same school? What's new with you? Ella",
    model:
      "Hi Ella,\n\nIt was nice to hear from you! Your new school sounds interesting, and it's great that the teachers are kind. Is your new friend from Brazil learning Chinese? Yes, I still go to the same school. The big news is that I've joined the school band. I play the drums! Our first concert is next month. Do you have any clubs at your new school?\n\nBest wishes,\nZoe",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hello! I'm going to visit your city next month with my family. We'll be there for three days. What should we see? Can we meet? Paul",
    model:
      "Hi Paul,\n\nGreat news! I'm so happy you're coming. You should see the old town and the night market. The food there is cheap and really good. You can also take a boat on the river. Of course we can meet! I can show you my favorite places. Which days will you be here, and where are you going to stay?\n\nSee you soon,\nKevin",
  },
  {
    task: "Answer your friend's email.",
    source:
      "Hi! I have some sad news. My cat Snow died last week. She was fifteen years old. I miss her very much. How are you? Have you had a good month? Rosa",
    model:
      "Dear Rosa,\n\nI'm so sorry about Snow. She was a lovely cat, and I know how much you loved her. Fifteen years is a long and happy life for a cat. My month has been OK. I've had a lot of tests, but they're finished now. Would you like to come to my house this weekend? We could watch a film together.\n\nLots of love,\nHelen",
  },
];

const writingAnEmailToAFriend = judgedTopic({
  id: "writing-an-email-to-a-friend",
  title: t("Writing an Email to a Friend", "给朋友写电子邮件"),
  summary: t(
    "Write an email of six to eight sentences to a friend: answer their news, tell yours, and ask a question.",
    "给朋友写一封六到八句话的电子邮件：回应对方的消息，讲讲你的近况，再问一个问题。",
  ),
  prerequisites: ["writing-a-short-note", "past-simple-irregular"],
  encompasses: [
    { topic: "writing-a-short-note", weight: 0.3 },
    { topic: "past-simple-irregular", weight: 0.2 },
  ],
  criteria: ["a2-email-answers", "a2-email-news-and-question", "a1-reader-and-name", "a1-sentences"],
  point: {
    id: "email",
    title: t("Answer, news and a question", "回应、近况和提问"),
    explanation: t(
      "An email to a friend is friendly and short:\n\n- Begin with *Hi* or *Dear* and the name.\n- Answer their email first: *A new puppy, how lovely!* Answer their questions too.\n- Then give your news: *I've just finished my exams.*\n- Ask a question: *Can you send me a photo?*\n- End with *Love*, *See you* or *Best wishes* and your name.",
      "给朋友的电子邮件要友好、简短：\n\n- 开头写 *Hi* 或 *Dear* 加对方的名字。\n- 先回应对方的邮件：*A new puppy, how lovely!* 也要回答对方的问题。\n- 然后讲你的近况：*I've just finished my exams.*\n- 问一个问题：*Can you send me a photo?*\n- 结尾写 *Love*、*See you* 或 *Best wishes* 和你的名字。",
    ),
  },
  question: t(
    "Read your friend's email. Write a reply of six to eight sentences in English: answer their news and questions, tell your news, and ask a question.",
    "读朋友的邮件，用英语写六到八句话的回信：回应对方的消息和问题，讲讲你的近况，再问一个问题。",
  ),
  bank: emailBank,
  limits: { minWords: 45, maxChars: 1000 },
  what: t("email", "电子邮件"),
});

/** topics are the topics of the unit Technology. */
export const topics: readonly TopicDef[] = [
  devices.topic,
  usingTech.topic,
  communication.topic,
  machines.topic,
  presentPerfectJustAlreadyYet,
  writingAnEmailToAFriend,
];

/** vocabulary are the words the unit Technology teaches. */
export const vocabulary: readonly WordBatch[] = [devices.batch, usingTech.batch, communication.batch, machines.batch];
