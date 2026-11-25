// A2, unit 10: Technology. Devices, using them, staying in touch and machines; just, already and yet; an email to a
// friend judged by a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";

const devices = vocabularyTopic({
  id: "a2-words-technology",
  title: t("Devices", "设备"),
  summary: t(
    "The internet, websites and apps; messages and texts; screens, keyboards, laptops and tablets; batteries, charging and passwords.",
    "互联网、网站和应用；消息和短信；屏幕、键盘、笔记本电脑和平板电脑；电池、充电和密码。",
  ),
  intro: t(
    "My **laptop** has a big **screen** and a quiet **keyboard**, but its **battery** only lasts three hours, so I **charge** it every afternoon. These words help you talk about computers, phones and the internet.",
    "我的 **laptop**（笔记本电脑）有大大的 **screen**（屏幕）和安静的 **keyboard**（键盘），可它的 **battery**（电池）只能用三个小时，所以我每天下午都要 **charge**（充电）。这些词帮你谈论电脑、手机和互联网。",
  ),
  prerequisites: ["a1-words-things-at-home"],
  words: [
    word(
      "internet",
      "the network that joins computers all over the world",
      "互联网",
      "I looked on many websites all over the {internet} and found the answer. | Is there {internet} in the hotel? | We can't watch the film online: the {internet} in the whole house isn't working.",
      "website app",
    ),
    word(
      "website websites",
      "a place on the internet with pages about something",
      "网站",
      "You can buy tickets on the museum's {website}. | Our school has a new {website} with pages of photos of every class. | This {website} has pages of free recipes you can open from any computer.",
      "internet laptop",
    ),
    word(
      "app apps",
      "a program that you use on a phone or a tablet",
      "应用程序",
      "I use this {app} on my phone to learn new words. | Download the {app} and you can order food from your phone. | My phone has too many {apps}.|laptops tablets",
      "laptop tablet",
    ),
    word(
      "message messages messaged messaging",
      "words that you send to someone; to send them",
      "消息；发消息",
      "I sent you a {message}. Did you get it? | There's a {message} for you from Mom.|screen battery | She {messaged} me to say she was late.|charged typed",
      "screen password",
    ),
    word(
      "text texts texted texting",
      "a written message sent from one phone to another; to send one",
      "短信；发短信",
      '{Text} me when you get home. | I got a {text} from Dad: "I\'m outside."|screen battery | Stop {texting} at the dinner table!|charging deleting',
      "charge type",
    ),
    word(
      "screen screens",
      "the flat glass part of a phone, a computer or a TV where you see pictures",
      "屏幕",
      "I dropped my phone and broke the glass {screen}. | Don't sit too close to the TV {screen}. | The {screen} is too dark. I can't see anything.",
      "keyboard battery",
    ),
    word(
      "keyboard keyboards",
      "the keys you press to type on a computer",
      "键盘",
      "Some keys on my {keyboard} don't work. | I spilled tea on the keys of my {keyboard}. | This laptop has a small {keyboard}, so typing is hard.",
      "screen battery",
    ),
    word(
      "laptop laptops",
      "a small computer that you can carry",
      "笔记本电脑",
      "I take my {laptop}, with its screen and keyboard, to the library to do my homework. | My {laptop} is too heavy to carry every day: it weighs three kilos. | She types on the keyboard of her {laptop} on the train.",
      "tablet keyboard",
    ),
    word(
      "tablet tablets",
      "a flat computer with a screen that you touch",
      "平板电脑",
      "My little sister watches cartoons on a {tablet}, touching its flat screen. | You can read books on a {tablet} by touching the screen. | The waiter took our order by touching the screen of his {tablet}.",
      "laptop keyboard",
    ),
    word(
      "battery batteries",
      "a thing that gives power to a phone, a toy or a clock",
      "电池",
      "My phone's {battery} is low. I need to charge it. | This toy needs two {batteries}.|passwords screens | The {battery} gives power all day, so I charge it only at night.",
      "password screen",
    ),
    word(
      "charge charges charged charging",
      "to put power into a battery",
      "充电",
      "I forgot to {charge} my phone, and now it's dead. | My laptop is {charging}. Don't take the cable out!|typing texting | {Charge} the tablet before the trip.",
      "type text",
    ),
    word(
      "password passwords",
      "a secret word you type to open a phone or a computer",
      "密码",
      "Don't tell anyone your {password}. | I can't remember my {password}, so I can't open my email. | A good {password} has letters and numbers.",
      "battery screen",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Internet* usually has *the* in front: *on the internet*, *the internet isn't working*. A *website* is one place on it, so say *a website* or *the museum's website*.",
        "*internet* 前面通常加 *the*：*on the internet*、*the internet isn't working*。*website* 是网上的一个地方，所以说 *a website* 或 *the museum's website*。",
      ),
      meaning: t(
        "A *laptop* and a *tablet* are both computers you can carry, but a *laptop* opens and has a *keyboard*, and a *tablet* is one flat *screen* that you touch.",
        "*laptop* 和 *tablet* 都是能带着走的电脑，但 *laptop* 能打开，有 *keyboard*；*tablet* 是一整块平板 *screen*，用手指触摸。",
      ),
      spell: t(
        "*Battery* changes y to i in the plural: *batteries*. *Password* is pass + word, with a double s, and *keyboard* is key + board.",
        "*battery* 的复数把 y 改成 i：*batteries*。*password* 是 pass + word，双写 s；*keyboard* 是 key + board。",
      ),
    },
    notes: `
      internet|answers found on many websites;a hotel;a film that can't be watched online at home|the internet is the network that joins computers; a website is one place on it|internet 是连接电脑的网络；website 是网上的一个地方|website=website is one place on the internet, not the network that joins all computers=website 是网上的一个地方，不是连接所有电脑的网络;app=app is one program on a phone, not the network that joins all computers=app 是手机上的一个程序，不是连接所有电脑的网络|in · ter · net|inter- + net|inter- + net
      website|a museum selling tickets;a school's pages of class photos;pages of recipes open from any computer|a website is a place on the internet with pages; a laptop is a computer you carry|website 是网上有许多页面的地方；laptop 是可以带着走的电脑|internet=internet is the whole network, so a museum or a school does not have its own internet with pages=internet 是整个网络，博物馆或学校没有自己的“互联网页面”;laptop=laptop is a computer you carry, not a place on the internet with pages=laptop 是可以带着走的电脑，不是网上有页面的地方|web · site|web + site, one word|web + site，合成一个词
      app|a phone program for learning words;ordering food from a phone;too many on a phone|an app is a program on a phone; a laptop and a tablet are machines|app 是手机上的程序；laptop 和 tablet 是机器|laptop/laptops=laptop is a computer you carry, not a program on a phone=laptop 是可以带着走的电脑，不是手机上的程序;tablet/tablets=tablet is a flat computer, not a program you download onto a phone=tablet 是平板电脑，不是下载到手机上的程序|app|short for *application*, with a double p|是 *application* 的缩写，双写 p
      message|words sent and maybe not received;something from Mom;saying she was late|a message is words you send to someone; a screen is where you see them|message 是发给别人的话；screen 是显示画面的地方|screen=screen is the glass part where you see pictures, not words sent to someone=screen 是显示画面的玻璃部分，不是发给别人的话;password=password is a secret word to open a phone, not words sent to someone=password 是开手机的秘密口令，不是发给别人的话;battery=battery gives power to a phone, not words from someone=battery 给手机供电，不是别人发来的话;charge/charged=charge means putting power into a battery, not sending words to someone=charge 是充电，不是给人发消息;type/typed=type means writing on a keyboard, and it does not send the words to anyone=type 是用键盘打字，并不会把话发给别人|mes · sage|the double s, and -age said like *idge*|双写 s，结尾 -age 读作 *idge*
      text|getting home;a note from Dad that he's outside;the dinner table|a text is a message from one phone to another; charge means putting power in a battery|text 是手机之间的短信；charge 是充电|charge/Charge/charging=charge means putting power into a battery, not sending a message=charge 是充电，不是发短信;type/Type=type means writing on a keyboard, and you type words, not a person=type 是用键盘打字，打的是字，不是人;screen=screen is where you see pictures, not a message you get=screen 是显示画面的地方，不是收到的消息;battery=battery gives power, not a message from someone=battery 提供电力，不是别人发来的消息;delete/deleting=delete means taking words away, not writing messages to someone=delete 是删掉文字，不是给人发消息|text|-xt at the end|结尾是 -xt
      screen|broken glass on a dropped phone;sitting too close to a TV;something too dark to see|a screen is where you see pictures; a keyboard is where you type|screen 是看画面的地方；keyboard 是打字的地方|keyboard=keyboard is the keys you press to type, not the glass part where you see pictures=keyboard 是打字的按键，不是看画面的玻璃部分;battery=battery gives power and is inside the machine, not the part you look at=battery 在机器里面供电，不是你看的部分|screen|sc at the start, and a double e|开头是 sc，有两个 e
      keyboard|keys that don't work;tea on the keys;typing that is hard on a small laptop|a keyboard is the keys you type on; a screen is where you see pictures|keyboard 是打字的按键；screen 是看画面的地方|screen=screen is the glass part where you see pictures, not keys you press and type on=screen 是看画面的玻璃部分，不是按下打字的键;battery=battery gives power inside the machine, and it has no keys=battery 在机器里面供电，没有按键|key · board|key + board, one word|key + board，合成一个词
      laptop|homework in a library with a screen and keyboard;three kilos to carry every day;typing on the keyboard on a train|a laptop opens and has a keyboard; a tablet is a flat screen you touch|laptop 能打开，有键盘；tablet 是一块用手触摸的平板屏幕|tablet=tablet is one flat screen you touch, with no keyboard of its own, and it is light=tablet 是用手触摸的一整块屏幕，没有自带键盘，而且很轻;keyboard=keyboard is only the keys you type on, not the whole computer=keyboard 只是打字的按键，不是整台电脑|lap · top|lap + top, one word|lap + top，合成一个词
      tablet|cartoons on a flat screen you touch;books read by touching a screen;a waiter touching a screen to take an order|a tablet is a flat screen you touch; a laptop opens and has a keyboard|tablet 是用手触摸的平板屏幕；laptop 能打开，有键盘|laptop=laptop opens and you type on its keyboard, not a flat screen you touch=laptop 能打开，用键盘打字，不是用手触摸的平板屏幕;keyboard=keyboard is keys you press, and it has no screen to touch=keyboard 是按的键，没有可以触摸的屏幕|tab · let|-let at the end|结尾是 -let
      battery|a phone that is low and needs charging;two in a toy;power all day, charged at night|a battery gives power; a screen shows pictures|battery 提供电力；screen 显示画面|password/passwords=password is a secret word, and it gives no power and cannot be charged=password 是秘密口令，不提供电力，也不能充电;screen/screens=screen shows pictures, and it does not give power or need charging=screen 显示画面，不提供电力，也不用充电|bat · ter · y|the double t; plural *batteries*|双写 t；复数是 *batteries*
      charge|a phone that is now dead;a laptop with a cable in;a tablet before a trip|charge means putting power into a battery; type means writing with keys|charge 是充电；type 是打字|type/typing=type means writing with a keyboard, not putting power into a battery=type 是用键盘打字，不是充电;text/texting=text means sending a message from a phone, not putting power into a battery=text 是发短信，不是充电|charge|-rge at the end, said like *rj*|结尾 -rge 读作 *rj*
      password|something not to tell anyone;email that can't be opened;letters and numbers|a password is a secret word to open something; a battery gives power|password 是打开东西的秘密口令；battery 提供电力|battery=battery gives power, not a secret word you tell, remember or type=battery 提供电力，不是可以告诉别人、记住或输入的秘密口令;screen=screen is where you see pictures, not a secret word=screen 是看画面的地方，不是秘密口令|pass · word|pass + word, with a double s|pass + word，双写 s
    `,
  },
});

const usingTech = vocabularyTopic({
  id: "a2-words-using-tech",
  title: t("Using Technology", "使用科技"),
  summary: t(
    "Clicking and typing; downloading and uploading; searching, sending and receiving; deleting and printing; switches, buttons and files.",
    "点击和打字；下载和上传；搜索、发送和接收；删除和打印；开关、按钮和文件。",
  ),
  intro: t(
    'I **typed** my essay, **clicked** "Save", **printed** it for my teacher and **uploaded** a copy to the school website. These words help you say what you do on a computer or a phone.',
    "我 **typed**（打）完作文，**clicked**（点击）“保存”，把它 **printed**（打印）出来交给老师，又把一份 **uploaded**（上传）到学校网站。这些词帮你说出在电脑或手机上做的事。",
  ),
  prerequisites: ["a2-words-technology"],
  words: [
    word(
      "click clicks clicked clicking",
      "to press a button on a mouse, or a link on a screen",
      "点击",
      "{Click} on the link to see the photos. | I {clicked} the wrong button and lost my work.|printed sent | Just {click} here to start the game.",
      "print send",
    ),
    word(
      "type types typed typing",
      "to write with a keyboard",
      "打字；输入",
      "{Type} your name in the box with the keyboard.|Print Receive | She can {type} very fast without looking at the keys. | I'm {typing} a message to my friend.|printing receiving",
      "print receive",
    ),
    word(
      "download downloads downloaded downloading",
      "to copy something from the internet onto your phone or computer",
      "下载",
      "I {downloaded} a new game from the internet onto my phone last night.|uploaded deleted | You can {download} the app onto your phone for free. | The film from the internet is still {downloading} onto my laptop. It's 80% done.|uploading deleting",
      "upload delete",
    ),
    word(
      "upload uploads uploaded uploading",
      "to put something from your phone or computer onto the internet",
      "上传",
      "She {uploaded} the photos of the party onto the internet, so we can all see them.|downloaded deleted | {Upload} your homework to the school website by Friday.|Download Delete | It takes a long time to {upload} a big video from your phone to the internet.",
      "download delete",
    ),
    word(
      "search searches searched searching",
      "to look carefully for something",
      "搜索；寻找",
      "I {searched} the internet for a cheap flight.|found switched | {Search} for the word, and the app will show you its meaning.|Find Switch | We {searched} everywhere for my keys.|found switched",
      "find switch",
    ),
    word(
      "send sends sent sending",
      "to make a message or a letter go to someone",
      "发送；寄",
      "I'll {send} you the photos tonight. | Did you {send} the email to your teacher, so she can read it? | Grandma {sent} me a birthday card.|received deleted",
      "receive delete",
    ),
    word(
      "receive receives received receiving",
      "to get something that someone sends you",
      "收到",
      "Did you {receive} my message? I sent it an hour ago, and I want to know if it got to you. | I {received} a letter from my pen pal today.|sent deleted | You will {receive} an email from us with your tickets.",
      "send delete",
    ),
    word(
      "delete deletes deleted deleting",
      "to take away words or a file from a computer or a phone",
      "删除",
      "I {deleted} the photo because I looked terrible in it.|received printed | Don't {delete} that file! I need it. | Press this key to {delete} a letter you typed by mistake.",
      "receive print",
    ),
    word(
      "print prints printed printing",
      "to put words or pictures from a computer onto paper",
      "打印",
      "Can you {print} the tickets? I need them on paper. | The printer {prints} ten pages a minute onto paper.|deletes downloads | I {printed} my essay on paper and gave it to the teacher.|deleted downloaded",
      "delete download",
    ),
    word(
      "switch switches switched switching",
      "to turn a machine on or off; a small thing you press to do this",
      "开关；打开或关上",
      "{Switch} off the light when you leave.|Click Type | Where's the light {switch}?|file password | I {switched} the TV on to watch the news.|clicked typed",
      "click type",
    ),
    word(
      "button buttons",
      "a small thing you press to make a machine work; a small round thing on clothes",
      "按钮；纽扣",
      'Press the small round red {button} to stop the machine. | Click the "Send" {button}. | A {button} came off my shirt.',
      "file switch",
    ),
    word(
      "file files",
      "a document or a picture kept on a computer",
      "文件",
      "Save the {file} before you close it. | I can't open this {file}. It's too big. | Send me the {files} by email.|buttons switches",
      "button switch",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Download* and *upload* go in opposite directions: you *download* something from the internet onto your phone, and you *upload* something from your phone onto the internet. Look for *from* and *onto* or *to*.",
        "*download* 和 *upload* 方向相反：*download* 是从网上存到手机上，*upload* 是从手机放到网上。找找句子里的 *from*、*onto* 或 *to*。",
      ),
      meaning: t(
        "*Send* and *receive* are the two ends of one message: you *send* it to someone, and they *receive* it from you. Ask who the message goes from and who it goes to.",
        "*send* 和 *receive* 是同一条消息的两头：你 *send*（发送）给别人，别人从你那里 *receive*（收到）。想想消息是谁发出、谁收到的。",
      ),
      spell: t(
        "*Receive* has e before i after c: re · ceive. *Download* and *upload* are one word each: down + load, up + load.",
        "*receive* 在 c 后面是 e 在 i 前：re · ceive。*download* 和 *upload* 各是一个词：down + load、up + load。",
      ),
    },
    notes: `
      click|a link to see photos;the wrong button and lost work;starting a game|click means pressing a button or a link; print means putting words on paper|click 是点击按钮或链接；print 是打印到纸上|print/printed=print means putting words or pictures onto paper, not pressing a link or a button=print 是印到纸上，不是点击链接或按钮;send/sent=send means making a message go to someone, not pressing a link or a button=send 是把消息发给别人，不是点击链接或按钮|click|ck at the end|结尾是 ck
      type|a name in a box with a keyboard;typing fast without looking at the keys;a message to a friend|type means writing with a keyboard; print means putting words on paper|type 是用键盘打字；print 是打印到纸上|print/Print/printing=print means putting words onto paper with a printer, not writing them with a keyboard=print 是用打印机印到纸上，不是用键盘打字;receive/Receive/receiving=receive means getting something someone sends, not writing it yourself=receive 是收到别人发来的东西，不是自己写|type|y said like *eye*|y 读作 *eye*
      download|a game from the internet onto a phone;an app for free;a film coming onto a laptop|download means from the internet onto your machine; upload means the other way|download 是从网上存到设备上；upload 方向相反|upload/uploaded/uploading=upload means putting something from your machine onto the internet, the other way=upload 是从设备放到网上，方向相反;delete/deleted/deleting=delete means taking something away, not copying it onto your machine=delete 是删掉，不是存到设备上|down · load|down + load, one word|down + load，合成一个词
      upload|party photos put on the internet;homework sent to a school website;a big video sent from a phone|upload means putting something onto the internet; download means taking it from the internet|upload 是放到网上；download 是从网上取下|download/downloaded/Download=download means copying something from the internet onto your machine, the other way=download 是从网上存到设备上，方向相反;delete/deleted/Delete=delete means taking something away, not putting it somewhere for others to see=delete 是删掉，不是放上去给别人看|up · load|up + load, one word|up + load，合成一个词
      search|a cheap flight on the internet;a word and its meaning in an app;keys looked for everywhere|search means looking carefully for something; find means getting it at the end|search 是仔细寻找；find 是找到|find/found/Find=find means getting what you looked for, and it is not followed by *for*=find 是找到，后面不跟 *for*;switch/switched/Switch=switch means turning a machine on or off, not looking for something=switch 是开关机器，不是寻找|search|ea said like *er*, and -ch at the end|ea 读作 *er*，结尾是 -ch
      send|photos tonight;an email to a teacher so she can read it;a birthday card from Grandma|you send a message to someone; they receive it|send 是发给别人；receive 是收到|receive/received=receive means getting something that someone sends you, not making it go to someone=receive 是收到别人发的，不是发给别人;delete/deleted=delete means taking words or a file away, not making them go to someone=delete 是删掉文字或文件，不是发给别人|send|past *sent*, not *sended*|过去式是 *sent*，不是 *sended*
      receive|a message sent an hour ago;a letter from a pen pal;an email from us with tickets|you receive what someone sends you; you send it to someone|receive 是收到别人发的；send 是发给别人|send/sent=send means making a message go to someone, not getting it from someone=send 是发给别人，不是从别人那里收到;delete/deleted=delete means taking something away, not getting it from someone=delete 是删掉，不是从别人那里收到|re · ceive|e before i after c|c 后面 e 在 i 前
      delete|a terrible photo;a file that is needed;a letter typed by mistake|delete means taking words or a file away; receive means getting something sent to you|delete 是删掉文字或文件；receive 是收到|receive/received=receive means getting something someone sends you, not taking it away=receive 是收到别人发的东西，不是删掉;print/printed=print means putting something onto paper, not taking it away=print 是印到纸上，不是删掉|de · lete|e that says its name before the silent e|不发音的 e 前面，e 读字母本音
      print|tickets needed on paper;ten pages a minute onto paper;an essay on paper for a teacher|print means putting words onto paper; delete means taking them away|print 是印到纸上；delete 是删掉|delete/deletes/deleted=delete means taking words or a file away, not putting them onto paper=delete 是删掉，不是印到纸上;download/downloads/downloaded=download means copying from the internet onto a machine, not onto paper=download 是从网上存到设备上，不是印到纸上|print|-int at the end|结尾是 -int
      switch|a light off when leaving;the light on a wall;a TV on for the news|switch means turning a machine on or off; click means pressing a button on a mouse or a screen|switch 是开关；click 是点击|click/Click/clicked=click means pressing a mouse button or a link, and we do not say *click off the light* or *click the TV on*=click 是点鼠标或链接，不说 *click off the light* 或 *click the TV on*;type/Type/typed=type means writing with a keyboard, not turning something on or off=type 是用键盘打字，不是开关东西;file=file is a document on a computer, not something on a wall for the light=file 是电脑里的文件，不是墙上管灯的东西;password=password is a secret word, not something you press for the light=password 是秘密口令，不是按下开灯的东西|switch|-tch at the end|结尾是 -tch
      button|a small round red thing that stops a machine;"Send" on a screen;something that came off a shirt|a button is a small thing you press, or a round thing on clothes; a file is a document|button 是按的小钮，或衣服上的纽扣；file 是文件|file=file is a document or a picture kept on a computer, not something you press or sew on a shirt=file 是电脑里的文档或图片，不是按的钮，也不是缝在衣服上的;switch=switch turns a light or a machine on or off, and it is not small and round on a shirt or a screen=switch 是开关灯或机器的，不会缝在衬衫上，也不在屏幕上|but · ton|the double t, and -on at the end|双写 t，结尾是 -on
      file|something to save before closing;something too big to open;things to send by email|a file is a document kept on a computer; a button is something you press|file 是电脑里的文件；button 是按的钮|button/buttons=button is something you press, not a document you save, open or send=button 是按的钮，不是保存、打开或发送的文档;switch/switches=switch turns a machine on or off, not a document you save, open or send=switch 是开关，不是保存、打开或发送的文档|file|i that says its name before the silent e|不发音的 e 前面，i 读字母本音
    `,
  },
});

const communication = vocabularyTopic({
  id: "a2-words-communication",
  title: t("Staying in Touch", "保持联系"),
  summary: t(
    "Replying and chatting; information and contacts; connecting, social networks and addresses; explaining and meaning; robots; true.",
    "回复和聊天；信息和联系人；连接、社交网络和地址；解释和意思；机器人；真的。",
  ),
  intro: t(
    "I sent Lily a **message** asking for her new **address**, and she **replied** at once, so we **chatted** for an hour and she **explained** how to get to her house. These words help you keep in touch with people and share information.",
    "我给莉莉发消息问她的新 **address**（地址），她马上 **replied**（回复）了，于是我们 **chatted**（聊天）了一个小时，她还 **explained**（说明）了怎么去她家。这些词帮你和别人保持联系、交流信息。",
  ),
  prerequisites: ["a2-words-using-tech"],
  words: [
    word(
      "reply replies replied replying",
      "to answer a message or a letter; an answer",
      "回复",
      "I sent her a message, but she didn't {reply} to it: no answer came back. | Please {reply} to this email by Friday. | Thanks for your quick {reply} to my letter.|question address",
      "ask explain",
    ),
    word(
      "chat chats chatted chatting",
      "to talk in a friendly way",
      "聊天",
      "We {chatted} happily online for an hour about our holidays.|argued shouted | Let's have a friendly {chat} over coffee.|fight shout | Stop {chatting} and laughing with your friend, and listen to the teacher.|arguing shouting",
      "argue shout",
    ),
    word(
      "information",
      "facts about something",
      "信息",
      "You can find {information} about the museum on its website. | For more {information}, call this number. | Thanks for all the useful {information} about the trip.",
      "address network",
    ),
    word(
      "contact contacts contacted contacting",
      "to call or write to someone; a person whose number you have",
      "联系；联系人",
      "Please {contact} me if you have any questions. | I {contacted} the shop by phone, but nobody answered.|connected replied | Her phone has two hundred {contacts}, people whose numbers she has.|networks robots",
      "connect reply",
    ),
    word(
      "connect connects connected connecting",
      "to join two things; to join a phone or a computer to the internet",
      "连接",
      "{Connect} the printer to your laptop with this cable.|Contact Reply | My phone won't {connect} to the hotel's wifi. | A long bridge {connects} the island to the city.|contacts replies",
      "contact reply",
    ),
    word(
      "social",
      "about meeting and spending time with other people",
      "社交的",
      "{Social} media can take a lot of your time.|True Electric | She is very {social} and loves parties. | We use {social} apps to chat with friends.",
      "true electric",
    ),
    word(
      "network networks",
      "a group of computers, people or roads that are joined together",
      "网络",
      "All the computers in the school are on one {network}. | The city has a big {network} of subway lines. | Social {networks} help people keep in touch.|addresses robots",
      "address information",
    ),
    word(
      "address addresses",
      "the number, street and town where someone lives; the name you use for email",
      "地址",
      "What's your email {address}? | Write the {address} on the envelope.|network robot | I've moved to a new house. Here is my new {address}: 5 Park Road.|network robot",
      "network information",
    ),
    word(
      "explain explains explained explaining",
      "to make something clear so that someone understands it",
      "解释；说明",
      "Can you {explain} this word to me? | The teacher {explained} the rules of the game.|meant replied | Let me {explain} why I was late.",
      "mean reply",
    ),
    word(
      "mean means meant meaning",
      "to have as its meaning; to want to say or do",
      "意思是；本意是",
      'What does this word {mean}? | "Huge" {means} very big.|explains replies | Sorry, I didn\'t {mean} to hurt you.',
      "explain reply",
    ),
    word(
      "robot robots",
      "a machine that can move and do jobs like a person",
      "机器人",
      "In the future, {robots} will clean our homes.|networks addresses | This {robot} can play chess. | A {robot} brought the food to our table.|network address",
      "network address",
    ),
    word(
      "true",
      "right; correct; not false",
      "真的；正确的",
      "Is it {true} that you're moving to Shanghai? | That's not {true}! I didn't eat your cake! | It's a {true} story. It happened to my grandpa.",
      "social electric",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Information* has no plural: say *some information* or *a piece of information*, never *an information* or *informations*. *Reply* needs *to* before the person or the message: *reply to this email*.",
        "*information* 没有复数：说 *some information* 或 *a piece of information*，不能说 *an information* 或 *informations*。*reply* 后面接人或消息时要加 *to*：*reply to this email*。",
      ),
      meaning: t(
        "*Explain* and *mean* are both about making words clear: a word *means* something, and a person *explains* it to someone. Say *What does this word mean?*, but *Can you explain this word to me?*",
        "*explain* 和 *mean* 都和弄清意思有关：词语 *mean*（意思是）什么，人把它 *explain*（解释）给别人听。说 *What does this word mean?*，但说 *Can you explain this word to me?*",
      ),
      spell: t(
        "*Reply* changes y to i before -es and -ed: *replies*, *replied*. *Chat* doubles its t: *chatted*, *chatting*. *Address* has a double d and a double s.",
        "*reply* 加 -es 或 -ed 时 y 改成 i：*replies*、*replied*。*chat* 双写 t：*chatted*、*chatting*。*address* 双写 d，也双写 s。",
      ),
    },
    notes: `
      reply|a message with no answer back;an email to answer by Friday;a quick answer to a letter|reply means answering a message; ask means saying a question|reply 是回复消息；ask 是提问|ask=ask means saying a question, not answering a message that someone sent you=ask 是提问，不是回复别人发来的消息;explain=explain means making something clear, and you do not explain to an email or a message=explain 是把事情说清楚，不能“explain to”一封邮件或消息;question=question is what you ask, not the answer you send back=question 是提出的问题，不是发回去的答复;address=address is where someone lives, not an answer to a letter=address 是住址，不是对信的答复|re · ply|y to i: *replies*, *replied*|y 改 i：*replies*、*replied*
      chat|talking happily online about holidays;a friendly talk over coffee;talking and laughing with a friend in class|chat means talking in a friendly way; argue means talking angrily|chat 是友好地聊天；argue 是生气地争吵|argue/argued/arguing=argue means talking angrily because you do not agree, not talking in a friendly way=argue 是因意见不同而生气地争吵，不是友好地聊天;shout/shouted/shouting=shout means saying something very loudly, not a friendly talk=shout 是大声喊叫，不是友好地聊天;fight=fight is angry, not a friendly talk over coffee=fight 是打架或争吵，不是友好地聊天|chat|double the t: *chatted*, *chatting*|双写 t：*chatted*、*chatting*
      information|a museum on its website;calling a number to learn more;useful facts about a trip|information is facts about something; an address is where someone lives|information 是关于某事的信息；address 是住址|address=address is where someone lives or the name you use for email, not facts about something=address 是住址或邮箱名，不是关于某事的信息;network=network is a group of things joined together, not facts about something=network 是连在一起的一组东西，不是关于某事的信息|in · for · ma · tion|-tion at the end, and no plural|结尾是 -tion，没有复数
      contact|someone to call with questions;a shop called by phone;two hundred people whose numbers she has|contact means calling or writing to someone; connect means joining two things|contact 是联系某人；connect 是把两样东西连起来|connect/connected=connect means joining two things or joining to the internet, not calling or writing to a person=connect 是把两样东西连起来或连上网，不是给人打电话写信;reply/replied=reply means answering a message, and you reply *to* someone, so you do not reply a shop or reply me=reply 是回复消息，要说 reply *to*，不能说 reply a shop 或 reply me;network/networks=network is a group of things joined together, not one person whose number you have=network 是连在一起的一组东西，不是存了号码的某个人;robot/robots=robot is a machine, not a person whose number you have=robot 是机器，不是存了号码的人|con · tact|-act at the end|结尾是 -act
      connect|a printer and a laptop with a cable;a phone and hotel wifi;a bridge between an island and a city|connect means joining two things; contact means calling or writing to someone|connect 是把两样东西连起来；contact 是联系某人|contact/Contact/contacts=contact means calling or writing to a person, not joining two things with a cable, wifi or a bridge=contact 是联系某人，不是用线、wifi 或桥把东西连起来;reply/Reply/replies=reply means answering a message, not joining two things=reply 是回复消息，不是把两样东西连起来|con · nect|the double n, and -ct at the end|双写 n，结尾是 -ct
      social|media that takes time;someone who loves parties;apps for chatting with friends|social means about spending time with other people; true means right and not false|social 是社交的；true 是真的|true/True=true means right and not false, not about spending time with people=true 是真的、对的，不是社交的;electric/Electric=electric means working with electricity, not about spending time with people=electric 是用电的，不是社交的|so · cial|ci said like *sh*|ci 读作 *sh*
      network|all the school's computers on one;subway lines in a city;sites that help people keep in touch|a network is a group of things joined together; an address is where someone lives|network 是连在一起的一组东西；address 是住址|address/addresses=address is where someone lives or the name you use for email, not a group of things joined together=address 是住址或邮箱名，不是连在一起的一组东西;information=information is facts about something, not a group of computers or lines joined together=information 是信息，不是连在一起的电脑或线路;robot/robots=robot is a machine that moves, not a group of things joined together=robot 是会动的机器，不是连在一起的一组东西|net · work|net + work, one word|net + work，合成一个词
      address|an email name;writing on an envelope;5 Park Road after a move|an address is where someone lives or the name for email; a network is things joined together|address 是住址或邮箱名；network 是连在一起的东西|network=network is a group of things joined together, not where someone lives or an email name=network 是连在一起的一组东西，不是住址或邮箱名;information=information is facts about something, not the street and town where someone lives=information 是信息，不是住的街道和城镇;robot=robot is a machine, and you cannot write it on an envelope or live at it=robot 是机器，不能写在信封上，也不能住在那里|ad · dress|a double d and a double s|双写 d，也双写 s
      explain|a word made clear;the rules of a game from a teacher;why someone was late|explain means making something clear to someone; mean means having a meaning|explain 是向别人解释清楚；mean 是意思是|mean/meant=mean is what a word does, not what a person does to make it clear to someone=mean 是词语的意思，不是人向别人解释;reply/replied=reply means answering a message, not making rules or a word clear=reply 是回复消息，不是把规则或词语讲清楚|ex · plain|ai for the long a sound|ai 发长 a 音
      mean|the meaning of a word;"huge" and very big;not wanting to hurt someone|mean means having a meaning or wanting to do something; explain means making it clear|mean 是意思是或本意；explain 是解释清楚|explain/explains=explain is what a person does to make something clear, and a word does not explain itself=explain 是人把事情讲清楚，词语不会自己解释;reply/replies=reply means answering a message, not having a meaning=reply 是回复消息，不是表示某种意思|mean|past *meant*, with ea said like short e|过去式 *meant*，ea 读短元音 e
      robot|machines cleaning homes in the future;a machine that plays chess;a machine bringing food to a table|a robot is a machine that moves and works like a person; a network is things joined together|robot 是像人一样干活的机器；network 是连在一起的东西|network/networks=network is a group of things joined together, and it cannot clean, play chess or bring food=network 是连在一起的一组东西，不会打扫、下棋或送菜;address/addresses=address is where someone lives, and it cannot clean, play chess or bring food=address 是住址，不会打扫、下棋或送菜|ro · bot|o that says its name, then -bot|o 读字母本音，后面是 -bot
      true|moving to Shanghai;not eating someone's cake;a story that happened to a grandpa|true means right and not false; social means about meeting people|true 是真的；social 是社交的|social=social means about meeting and spending time with people, not right or not false=social 是社交的，不是真实的;electric=electric means working with electricity, not right or not false=electric 是用电的，不是真实的|true|-ue at the end, said like *oo*|结尾 -ue 读作 *oo*
    `,
  },
});

const machines = vocabularyTopic({
  id: "a2-words-machines",
  title: t("Machines", "机器"),
  summary: t(
    "Machines, inventing and inventors; wheels, motors and tools; power and electric things; television; useful; already and yet.",
    "机器、发明和发明家；轮子、马达和工具；电力和电动的东西；电视；有用的；already 和 yet。",
  ),
  intro: t(
    "My grandfather was an **inventor**: he built a **machine** with four **wheels** and an **electric** **motor** that carried his **tools** around the garden. These words help you talk about machines, inventions and how things work.",
    "我爷爷是一位 **inventor**（发明家）：他造了一台 **machine**（机器），有四个 **wheels**（轮子）和一台 **electric**（电动的）**motor**（马达），能在花园里帮他运 **tools**（工具）。这些词帮你谈论机器、发明以及东西是怎样运转的。",
  ),
  prerequisites: ["a2-words-communication"],
  words: [
    word(
      "machine machines",
      "a thing with parts that move, which does a job",
      "机器",
      "We have a washing {machine} at home. | This {machine}, with parts that move, makes coffee for the whole office. | {Machines} do a lot of the work in factories now, with no person holding them.|Tools Wheels",
      "tool wheel",
    ),
    word(
      "invent invents invented inventing",
      "to make something new that did not exist before",
      "发明",
      "Who {invented} the telephone, a machine that didn't exist before?|discovered built | I want to {invent} a new kind of robot that nobody has ever made. | The Chinese {invented} paper, which did not exist before, a long time ago.|discovered built",
      "discover build",
    ),
    word(
      "inventor inventors",
      "a person who invents things",
      "发明家",
      "Edison was a famous American {inventor} who made the first light bulbs. | My brother wants to be an {inventor} and make new machines. | The {inventor} of the bicycle was German.",
      "invent explorer",
    ),
    word(
      "wheel wheels",
      "a round thing that turns under a car or a bike",
      "轮子",
      "A bike has two {wheels}.|motors tools | The round {wheel} is one of the oldest inventions. | My suitcase has small {wheels}, so it's easy to pull.|motors tools",
      "motor tool",
    ),
    word(
      "power",
      "energy that makes machines work; strength",
      "能量；电力；力量",
      "There's no {power}. All the lights are off. | The wind gives {power} to the machines.|tools wheels | Solar {power} comes from the sun.",
      "tool wheel",
    ),
    word(
      "electric",
      "working with electricity, from a battery or a plug",
      "电的；电动的",
      "My dad's new car is {electric}: he plugs it in every night. | Be careful! The {electric} fence will give you a shock. | Our stove is {electric}, so we plug it into the wall.",
      "wooden plastic",
    ),
    word(
      "television televisions",
      "a machine with a screen that shows programs",
      "电视",
      "We watched the football match on {television}. | Turn off the {television} with its bright screen and go to bed. | There's a big {television} with a screen in the living room.",
      "radio tool",
    ),
    word(
      "useful",
      "good for doing something; helping you",
      "有用的",
      "A dictionary is very {useful} when you learn English. | Thanks for the {useful} tips. | This app isn't very {useful}.",
      "careful electric",
    ),
    word(
      "already",
      "before now, or sooner than expected",
      "已经",
      "I've {already} eaten, thanks. | Is it {already} ten o'clock? I must go! | She has {already} finished her homework.",
      "yet ever",
    ),
    word(
      "yet",
      "until now, in questions and in sentences with not",
      "还；已经（用于疑问句和否定句）",
      "Have you finished {yet}? | I haven't seen the new film {yet}. | Is dinner ready {yet}? I'm hungry.",
      "ever never",
    ),
    word(
      "tool tools",
      "a thing you hold in your hand to do a job, such as a hammer",
      "工具",
      "A hammer is a {tool}. | Dad keeps his hand {tools}, like hammers, in the garage.|machines motors | You need the right {tool} in your hand to fix a bike.",
      "machine motor",
    ),
    word(
      "motor motors",
      "the part of a machine that makes it move",
      "马达；电动机",
      "This boat has a small {motor} that makes it move. | The fan's {motor} is broken, so it won't turn. | Electric {motors} that make cars move are quiet.|wheels tools",
      "wheel tool",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Already* and *yet* both talk about time up to now: *already* goes in positive sentences, often before the verb, and *yet* goes at the end of questions and of sentences with *not*: *I've already eaten*, but *Have you eaten yet?*",
        "*already* 和 *yet* 都说到现在为止的时间：*already* 用在肯定句里，常放在动词前；*yet* 放在疑问句和含 *not* 的句子末尾：*I've already eaten*，但 *Have you eaten yet?*",
      ),
      meaning: t(
        "A *tool* and a *machine* both help you do a job, but you hold a *tool* like a hammer in your hand, and a *machine* has parts that move and does the job itself.",
        "*tool* 和 *machine* 都帮你干活，但 *tool*（工具）像锤子一样拿在手里用，*machine*（机器）有会动的部件，自己完成工作。",
      ),
      spell: t(
        "*Inventor* ends in -or, not -er: in · ven · tor. *Television* has s said like the s in *usual*: tel · e · vi · sion.",
        "*inventor* 以 -or 结尾，不是 -er：in · ven · tor。*television* 里的 s 读音和 *usual* 里的 s 一样：tel · e · vi · sion。",
      ),
    },
    notes: `
      machine|a washing one at home;something with moving parts making coffee for an office;factory work with no person holding anything|a machine has moving parts and does a job; a tool is held in your hand|machine 有会动的部件，自己干活；tool 拿在手里用|tool/Tools=tool is a thing you hold in your hand, like a hammer, not something with moving parts that works by itself=tool 是拿在手里用的东西，如锤子，不是有活动部件、自己干活的东西;wheel/Wheels=wheel is one round part that turns, not a whole thing that does a job=wheel 只是转动的圆形部件，不是能完成工作的整台东西|ma · chine|ch said like *sh*, and -ine said like *een*|ch 读作 *sh*，-ine 读作 *een*
      invent|a telephone that didn't exist before;a new kind of robot no one has made;paper that did not exist before|invent means making something new that did not exist before; discover means finding something that was already there|invent 是发明前所未有的东西；discover 是发现本来就有的东西|discover/discovered=discover means finding something that was already there, not making something new=discover 是发现本来就有的东西，不是创造新东西;build/built=build means making something by putting parts together, and it does not mean the idea is new=build 是把部件组装起来，不表示这个东西是新发明的|in · vent|in + vent|in + vent
      inventor|Edison and the first light bulbs;a brother wanting to make new machines;the bicycle's maker|an inventor is a person who invents; invent is the verb|inventor 是发明家；invent 是动词|invent=invent is the verb, so it cannot follow *an* or *the* as a person=invent 是动词，不能放在 *an* 或 *the* 后面当人用;explorer=explorer travels to places nobody knows, not a person who makes new machines or bicycles=explorer 是去未知地方探险的人，不是造新机器或自行车的人|in · ven · tor|-or at the end, not -er|结尾是 -or，不是 -er
      wheel|two on a bike;one of the oldest inventions;small ones that make a suitcase easy to pull|a wheel is a round thing that turns; a motor makes a machine move|wheel 是转动的圆东西；motor 让机器动起来|motor/motors=motor is the part that makes a machine move, not the round things a bike or suitcase rolls on=motor 是让机器动起来的部件，不是自行车或箱子底下滚动的圆东西;tool/tools=tool is a thing you hold to do a job, not a round thing that turns=tool 是拿着干活的东西，不是转动的圆东西|wheel|wh at the start, and a double e|开头是 wh，有两个 e
      power|no lights on;the wind and machines;the sun|power is energy that makes machines work; a tool is a thing you hold|power 是让机器运转的能量；tool 是拿在手里的工具|tool/tools=tool is a thing you hold in your hand, not energy that makes lights or machines work=tool 是拿在手里的东西，不是让灯或机器运转的能量;wheel/wheels=wheel is a round thing that turns, not energy from the wind or the sun=wheel 是转动的圆东西，不是来自风或太阳的能量|pow · er|ow, as in *now*|ow 和 *now* 里的一样
      electric|a car plugged in every night;a fence that gives a shock;a stove plugged into the wall|electric means working with electricity; wooden means made of wood|electric 是用电的；wooden 是木制的|wooden=wooden means made of wood, and wood cannot be plugged in or give a shock=wooden 是木制的，木头不能插电，也不会电人;plastic=plastic is a material, and a plastic thing does not need a plug or give a shock=plastic 是一种材料，塑料东西不用插电，也不会电人|e · lec · tric|-ic at the end|结尾是 -ic
      television|a football match;something with a bright screen to turn off at bedtime;a big one with a screen in the living room|a television has a screen that shows programs; a radio has only sound|television 有显示节目的屏幕；radio 只有声音|radio=radio has only sound and no screen, so you cannot watch a match on it=radio 只有声音，没有屏幕，不能看比赛;tool=tool is a thing you hold to do a job, not a machine with a screen=tool 是拿着干活的东西，不是有屏幕的机器|tel · e · vi · sion|-sion at the end, said like *zhun*|结尾 -sion 读作 *zhun*
      useful|a dictionary for learning English;tips that help;an app that does not help|useful means good for doing something; careful means paying attention|useful 是有用的；careful 是小心的|careful=careful describes a person who pays attention, not a thing that helps you=careful 形容小心的人，不形容帮得上忙的东西;electric=electric means working with electricity, not helping you=electric 是用电的，不是有帮助的|use · ful|use + -ful with one l|use 加 -ful，只有一个 l
      already|having eaten;ten o'clock coming sooner than expected;finished homework|already means before now or sooner than expected; yet goes in questions and with not|already 是已经；yet 用在疑问句和否定句|yet=yet goes at the end of questions and sentences with *not*, not before the verb in a positive sentence=yet 放在疑问句和否定句末尾，不放在肯定句的动词前;ever=ever means at any time, mostly in questions, not before now in a positive sentence=ever 是曾经、任何时候，多用于疑问句，不用来表示“已经”|al · read · y|one l: al- + ready|只有一个 l：al- + ready
      yet|finishing something;a new film not seen;dinner for someone hungry|yet means until now in questions and sentences with not; ever means at any time|yet 用于疑问句和否定句，表示到现在为止；ever 是任何时候|ever=ever means at any time, and it does not go at the end of these questions about now=ever 是任何时候，不放在这些问“现在”的句子末尾;never=never means at no time, and it cannot go with *haven't* or at the end of a question=never 是从不，不能和 *haven't* 连用，也不放在疑问句末尾|yet|y at the start, and a short e|开头是 y，短元音 e
      tool|a hammer;hand things like hammers in a garage;the right thing in the hand to fix a bike|a tool is held in your hand to do a job; a machine has moving parts|tool 拿在手里干活；machine 有会动的部件|machine/machines=machine has parts that move and works by itself, not something you hold in your hand like a hammer=machine 有活动部件，自己运转，不是像锤子那样拿在手里的;motor/motors=motor is the part that makes a machine move, not a thing you hold to fix something=motor 是让机器动起来的部件，不是拿在手里修东西的|tool|oo, as in *food*|oo 和 *food* 里的一样
      motor|something that makes a small boat move;a broken part that stops a fan turning;quiet things that make cars move|a motor is the part that makes a machine move; a wheel is a round thing that turns|motor 是让机器动起来的部件；wheel 是转动的圆东西|wheel/wheels=wheel is a round thing that turns, but it does not make the machine move by itself=wheel 是转动的圆东西，但它自己不能让机器动起来;tool/tools=tool is a thing you hold in your hand, not the part inside a machine that makes it move=tool 是拿在手里的东西，不是机器里让它动起来的部件|mo · tor|-or at the end|结尾是 -or
    `,
  },
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
  ([, participle, rest]) => [`She hasn't ${participle} ${rest} ___.`, "yet", ["already", "just"]],
  ([, participle, rest]) => [`Has Tom ${participle} ${rest} ___?`, "yet", ["just", "never"]],
  ([, participle, rest]) => [`We've ___ ${participle} ${rest}, so we can go now.`, "already", ["yet", "ever"]],
  ([, participle, rest]) => [`Look! Dad has ___ ${participle} ${rest}. He did it a second ago.`, "just", ["yet", "ever"]],
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

// Each pair of a subject and a thing done comes twice, so it is asked in two of the four ways.
const jayTypedBank: readonly TypedItem[] = everyPair(jaySubjects, doneThings)
  .flatMap((row) => [row, row])
  .map(([[subject, have, short, not], [verb, participle, rest]], k): TypedItem => {
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
  });

/** jayReason says why a sentence takes just, already or yet, and where the word goes. */
const jayReason = (word: string, sentence: string): Text => {
  if (word === "yet")
    return sentence.endsWith("?")
      ? t("It is a question about up to now, so *yet* goes at the end", "这是询问到现在为止的情况的问句，所以 *yet* 放在句末")
      : t(
          "The sentence has *not*: it is not done up to now, so *yet* goes at the end",
          "句子里有 *not*，到现在还没做，所以 *yet* 放在句末",
        );
  if (word === "already")
    return t(
      "It was done before now, sooner than you might think, so *already* goes between *have* and the past participle",
      "这件事在此之前就已经做了，比想象的早，所以 *already* 放在 *have* 和过去分词之间",
    );
  return t(
    "It was done a very short time ago, so *just* goes between *have* and the past participle",
    "这件事刚刚做完，所以 *just* 放在 *have* 和过去分词之间",
  );
};

/** whyNotJay explains a wrong word among just, already, yet, ever and never. */
const whyNotJay = (wrong: string): Text => {
  if (wrong === "yet")
    return t(
      "*yet* goes in questions and in sentences with *not*, but this sentence says the thing is done.",
      "*yet* 用在疑问句和否定句里，但这句说的是事情已经做了。",
    );
  if (wrong === "ever")
    return t(
      "*ever* asks about any time in your life, in questions. This sentence says when the thing was done.",
      "*ever* 用在疑问句里，问一生中任何时候。这句说的是事情什么时候做的。",
    );
  if (wrong === "never")
    return t(
      "*never* goes before the past participle in a statement, not at the end of a question.",
      "*never* 放在陈述句的过去分词前面，不能放在疑问句末尾。",
    );
  return t(
    `*${wrong}* goes between *have* and the past participle in a statement, not at the end of a question or negative sentence.`,
    `*${wrong}* 用在陈述句的 *have* 和过去分词之间，不能放在疑问句或否定句末尾。`,
  );
};

const presentPerfectJustAlreadyYet: TopicDef = {
  id: "present-perfect-with-just-already-and-yet",
  title: t("Just, Already and Yet", "just、already 和 yet"),
  summary: t(
    "I have just sent it. Have you charged it yet? She has already left. The present perfect for things done, or not done, up to now.",
    "I have just sent it. Have you charged it yet? She has already left. 用现在完成时说到现在为止做了或还没做的事。",
  ),
  intro: t(
    "When you give a quick status update—*I've just emailed the file*, *She has already replied*, *I haven't checked it yet*—each little word (*just, already, yet*) has its own meaning and its own slot in the sentence.",
    "同步进展时（*I've just emailed the file*、*She has already replied*、*I haven't checked it yet*），*just*、*already*、*yet* 不仅意思不同，在句子里的位置也各有固定规则。",
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
        "These three words go with the present perfect:\n\n- *just* means *a very short time ago*. It goes between *have* and the verb: *I've just sent it.*\n- *already* means *before now*, often sooner than you expected. It goes between *have* and the verb: *Don't worry. I've already paid.*\n- *yet* means *up to now*. It goes in questions and in sentences with *not*, at the end: *Have you finished yet? I haven't finished yet.*\n\n> **Watch out.** Check both position and sentence type: a blank at the very end of a question or *haven't/hasn't* sentence takes *yet*, never *already* or *just*.",
        "这三个词常和现在完成时一起用：\n\n- *just* 意思是“刚刚”，放在 *have* 和动词之间：*I've just sent it.*\n- *already* 意思是“已经”，常常比预想的早，放在 *have* 和动词之间：*Don't worry. I've already paid.*\n- *yet* 意思是“到现在为止”，用在疑问句和否定句的末尾：*Have you finished yet? I haven't finished yet.*\n\n> **注意。** 同时看位置和句型：疑问句或 *haven't/hasn't* 否定句的末尾用 *yet*，不要把 *already* 或 *just* 放到那里。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        justBank,
        (right, shown) => {
          const reason = jayReason(right, shown);
          return t(
            `${reason.en}: ${fill(shown, right)}\n\n**Check.** Verify both slot and meaning: ${right === "yet" ? "*yet* sits at the end of a question or negative" : `*${right}* sits between *have/has* and the past participle in a statement`}.`,
            `${reason["zh-CN"]}：${fill(shown, right)}\n\n**检验。** 核对位置和意思：${right === "yet" ? "*yet* 位于疑问句或否定句末尾" : `*${right}* 位于陈述句的 *have/has* 与过去分词之间`}。`,
          );
        },
        whyNotJay,
      ),
    ),
    point(
      "write",
      t("Writing with just, already and yet", "用 just、already 和 yet 写句子"),
      t(
        "Write the sentence from the note with *have* or *has* and the past participle. *just* and *already* go before the participle: *She has just sent the email.* *yet* goes at the end of a question or a sentence with *not*: *Have you paid the bill yet? Tom hasn't read the instructions yet.*\n\n> **Watch out.** Never use *did* with a past participle (*Did you paid...?* is wrong), and match *have* vs. *has* to the subject.",
        "根据笔记写句子，用 *have / has* 加过去分词。*just* 和 *already* 放在过去分词前面：*She has just sent the email.* *yet* 放在疑问句或否定句的末尾：*Have you paid the bill yet? Tom hasn't read the instructions yet.*\n\n> **注意。** 不要把 *did* 和过去分词混用（*Did you paid...?* 是错的），并核对主语该配 *have* 还是 *has*。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), jayTypedBank, (right) => {
        const word = right.includes(" just ") ? "just" : right.includes(" already ") ? "already" : "yet";
        const reason = jayReason(word, right);
        return t(
          `${reason.en}, and the verb is *have* or *has* with the past participle: ${right}\n\n**Check.** Verify three things: *have/has* agrees with the subject, the verb is a past participle, and *${word}* sits in its proper slot.`,
          `${reason["zh-CN"]}，动词用 *have / has* 加过去分词：${right}\n\n**检验。** 核对三处：*have/has* 与主语一致、动词用过去分词、*${word}* 放对了位置。`,
        );
      }),
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
  intro: t(
    "A warm reply keeps a conversation going: *Hi Leo, Thanks for your email! Congrats on winning the race. I've just joined the chess club at school. How is your new bike? See you, Mia.* Reacting to your friend's news first makes the email feel personal.",
    "热络的回信能让对话继续下去：*Hi Leo, Thanks for your email! Congrats on winning the race. I've just joined the chess club at school. How is your new bike? See you, Mia.* 先回应对方的近况，信就显得真诚自然。",
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
      "An email to a friend is friendly and short:\n\n- Begin with *Hi* or *Dear* and the name.\n- Answer their email first: *A new puppy, how lovely!* Answer their questions too.\n- Then give your news: *I've just finished my exams.*\n- Ask a question: *Can you send me a photo?*\n- End with *Love*, *See you* or *Best wishes* and your name.\n\n> **Watch out.** Read your friend's email carefully so you answer every question they asked—do not only talk about yourself.",
      "给朋友的电子邮件要友好、简短：\n\n- 开头写 *Hi* 或 *Dear* 加对方的名字。\n- 先回应对方的邮件：*A new puppy, how lovely!* 也要回答对方的问题。\n- 然后讲你的近况：*I've just finished my exams.*\n- 问一个问题：*Can you send me a photo?*\n- 结尾写 *Love*、*See you* 或 *Best wishes* 和你的名字。\n\n> **注意。** 仔细读完朋友的来信，确保回应了对方提的每一个问题——不要只顾着说自己的事。",
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
