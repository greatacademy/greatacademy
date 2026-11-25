// A2, unit 11: Festivals and Celebrations. Festivals, wishes, feelings and people together; verbs followed by to; an
// invitation and a reply judged by a model. Subordinating conjunctions, the unit's other grammar, already exist.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";
import { combos, fill, judgedTopic } from "./kit.ts";
import { verbsFollowedByToWriteNot } from "./mistakes.ts";

const festivalWords = vocabularyTopic({
  id: "a2-words-festivals",
  title: t("Festivals", "节日"),
  summary: t(
    "Festivals and celebrating; traditions; lanterns, fireworks, parades and costumes; candles and decorating; weddings and anniversaries.",
    "节日和庆祝；传统；灯笼、烟花、游行和服装；蜡烛和装饰；婚礼和周年纪念日。",
  ),
  intro: t(
    "At the Spring **Festival**, red **lanterns** hang in the streets, a **parade** goes through the town, and **fireworks** light up the sky at night. These words help you talk about festivals, traditions and how people celebrate special days.",
    "春节时，街上挂着红 **lanterns**（灯笼），**parade**（游行队伍）穿过小镇，夜里 **fireworks**（烟花）照亮天空。这些词帮你谈论节日、传统，以及人们怎样庆祝特别的日子。",
  ),
  prerequisites: ["a1-words-parties"],
  words: [
    word(
      "festival festivals",
      "a special day or time when people celebrate something",
      "节日；节",
      "The Spring {Festival} is the most important holiday in China.|Parade Tradition | There's a music {festival} in the park this weekend, with twenty bands on three stages. | Every country has its own {festivals}, special days when people celebrate.|parades traditions",
      "parade tradition",
    ),
    word(
      "celebrate celebrates celebrated celebrating",
      "to do something special because of an important day or good news",
      "庆祝",
      "How do you {celebrate} New Year in your country? | We {celebrated} Grandma's 80th birthday with a big dinner.|decorated wrapped | Let's {celebrate}! You passed the exam!",
      "decorate wrap",
    ),
    word(
      "tradition traditions",
      "something people have done in the same way for a very long time",
      "传统",
      "It's a {tradition} to eat dumplings at New Year in the north of China. | Every family has its own {traditions}, things they have always done in the same way.|festivals costumes | Giving red envelopes is an old {tradition}.",
      "festival costume",
    ),
    word(
      "traditional",
      "done in the same way for a very long time; old in style",
      "传统的",
      "She wore a {traditional} dress in the old style of her grandmother's village. | We cooked a {traditional} dish that our family has made for a hundred years. | Dragon boat racing is a {traditional} sport that is over two thousand years old.",
      "modern special",
    ),
    word(
      "lantern lanterns",
      "a light in a box or a paper ball, often hung up",
      "灯笼",
      "Red {lanterns} hang in the streets at New Year.|candles fireworks | At the Mid-Autumn Festival, children carry paper {lanterns} with lights inside.|candles fireworks | We hung a big red {lantern} over the door.",
      "candle firework",
    ),
    word(
      "firework fireworks",
      "a thing that explodes in the sky with bright colors",
      "烟花",
      "We watched the {fireworks} bang and light up the sky at midnight.|lanterns candles | The {fireworks} were very loud. The dog was scared.|lanterns candles | You can't buy {fireworks} in the city center because they can explode.|lanterns candles",
      "lantern candle",
    ),
    word(
      "parade parades",
      "a lot of people walking through the streets to celebrate, often with music",
      "游行",
      "Thousands of people watched the {parade} walk through the streets. | The band played music at the front of the {parade}. | There's a {parade} through the town on National Day.",
      "festival costume",
    ),
    word(
      "costume costumes",
      "special clothes that make you look like someone or something else",
      "戏服；装扮服装",
      "He wore a tiger {costume} to the party. | The dancers wore beautiful bird {costumes} with wings and feathers.|uniforms traditions | My mom made my {costume} for the school play.",
      "uniform tradition",
    ),
    word(
      "candle candles",
      "a stick of wax with a string in it, which you burn for light",
      "蜡烛",
      "Blow out the {candles} on your birthday cake!|lanterns fireworks | There was no power, so we lit a wax {candle}. | There are ten {candles} on the cake.|lanterns fireworks",
      "lantern firework",
    ),
    word(
      "decorate decorates decorated decorating",
      "to make something look pretty for a special day",
      "装饰",
      "We {decorated} the classroom with paper flowers.|celebrated welcomed | Let's {decorate} the tree with lights. | They are {decorating} the hall for the wedding.|celebrating welcoming",
      "celebrate welcome",
    ),
    word(
      "wedding weddings",
      "the ceremony when two people get married",
      "婚礼",
      "My cousin's {wedding} is in June. She's getting married to Tom. | Everybody danced at the {wedding} after the two of them got married. | They got married at a small {wedding} on the beach.",
      "anniversary festival",
    ),
    word(
      "anniversary anniversaries",
      "the same day as a special day in an earlier year",
      "周年纪念日",
      "My parents' wedding {anniversary} is on May 5th. | Our school opened in 1925, so this year is its 100th {anniversary}. | Ten years after their wedding, they had dinner at a nice restaurant for their {anniversary}.",
      "wedding festival",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Tradition* is a noun and *traditional* is an adjective: say *an old tradition*, but *a traditional dress*. Check whether a noun comes right after the gap.",
        "*tradition* 是名词，*traditional* 是形容词：说 *an old tradition*，但说 *a traditional dress*。看空格后面是不是紧跟着一个名词。",
      ),
      meaning: t(
        "*Wedding* and *anniversary* are different days: the *wedding* is the day two people get married, and an *anniversary* is the same date in a later year.",
        "*wedding* 和 *anniversary* 是不同的日子：*wedding* 是两个人结婚的那天，*anniversary* 是以后每年的同一天。",
      ),
      spell: t(
        "*Anniversary* has a double n, and *celebrate* has e-l-e in the middle: cel · e · brate.",
        "*anniversary* 要双写 n；*celebrate* 中间是 e-l-e：cel · e · brate。",
      ),
    },
    notes: `
      festival|the most important holiday in China;three days of music in a park;special days when people celebrate in every country|a festival is a special time to celebrate; a parade is people walking through the streets|festival 是庆祝的特别时节；parade 是在街上走过的游行队伍|parade=parade is a line of people walking through the streets, not a special day or several days of celebrating=parade 是在街上走过的游行队伍，不是庆祝的特别日子;tradition=tradition is something people have done the same way for a long time, not a special day or a music event=tradition 是人们长期以同样方式做的事，不是特别的日子，也不是音乐活动|fes · ti · val|-al at the end|结尾是 -al
      celebrate|New Year in a country;Grandma's 80th birthday with a big dinner;passing an exam|you celebrate a special day or good news; you decorate a room to make it pretty|celebrate 是庆祝节日或好消息；decorate 是把房间装饰漂亮|decorate=decorate means making a place look pretty, not doing something special for a day or good news=decorate 是把地方装饰漂亮，不是为节日或好消息做特别的事;wrap/wrapped=wrap means covering something with paper, not having a party for a day or good news=wrap 是用纸包东西，不是为节日或好消息庆祝|cel · e · brate|e-l-e in the middle, and the silent e at the end|中间是 e-l-e，词尾 e 不发音
      tradition|eating dumplings at New Year in the north of China;things a family has always done the same way;the old custom of giving red envelopes|a tradition is something done the same way for a long time; a festival is a special day|tradition 是长期沿袭的习俗；festival 是节日|festival=festival is a special day or time, not something people do the same way every year=festival 是节日，不是人们年年照样做的事;costume=costume is special clothes you wear to look like someone else, not something people have done for a long time=costume 是装扮用的服装，不是人们长期沿袭的事|tra · di · tion|-tion at the end, said like *shun*|结尾 -tion 读作 *shun*
      traditional|a dress in the old style of a village;a dish a family has made for a hundred years;a sport over two thousand years old|traditional means done the same way for a long time; modern means new and of today|traditional 是传统的、沿袭已久的；modern 是现代的、新式的|modern=modern means new and of today, the opposite of something done for a very long time=modern 是新式的、现在的，和沿袭很久的意思相反;special=special means different from usual and important, but it says nothing about being done the same way for a long time=special 是与众不同、很重要，但不表示沿袭了很久|tra · di · tion · al|tradition + -al|tradition 加 -al
      lantern|red lights hanging in the streets at New Year;paper lights children carry with lights inside;a big red light hung over a door|a lantern is a light in a paper ball or box that you hang or carry; a candle is a stick of wax|lantern 是挂着或提着的纸灯或灯箱；candle 是蜡烛|candle=candle is a stick of wax that burns, not a paper ball you hang up or carry with a light inside=candle 是燃烧的蜡烛，不是挂起来或里面有灯的纸灯;firework=firework explodes in the sky, so you cannot hang it in the street or carry it=firework 在天上爆炸，不能挂在街上，也不能提着走|lan · tern|-ern at the end|结尾是 -ern
      firework|things that bang and light up the sky at midnight;loud things that scared a dog;things that can explode and that you can't buy in a city center|fireworks explode in the sky; lanterns hang and give a soft light|firework 在天上爆炸；lantern 挂着，发出柔和的光|lantern=lantern is a light in a paper ball or box that hangs quietly and does not explode=lantern 是挂着的纸灯或灯箱，安安静静，不会爆炸;candle=candle is a stick of wax that burns quietly and does not bang or explode=candle 是安静燃烧的蜡烛，不会砰地爆炸|fire · work|fire + work, one word|fire + work，合成一个词
      parade|something thousands watched walk through the streets;something a band played music at the front of;something going through town on National Day|a parade is people walking through the streets; a festival is the whole special day|parade 是游行队伍；festival 是整个节日|festival=festival is a special day or time, which cannot walk, have a front or go through the town=festival 是节日，不会走路，没有队首，也不会穿过小镇;costume=costume is special clothes, which cannot walk through the streets or go through a town=costume 是装扮用的服装，不会在街上走，也不会穿过小镇|pa · rade|a that says its name before the silent e|不发音的 e 前面，a 读字母本音
      costume|a tiger outfit worn to a party;bird outfits with wings and feathers for dancers;clothes Mom made for a school play|a costume makes you look like someone or something else; a uniform is the same clothes for a school or a job|costume 是装扮成别人或别的东西的服装；uniform 是学校或工作的统一服装|uniform/uniforms=uniform is the same clothes everyone wears for a school or a job, not clothes that make you look like a tiger or a bird=uniform 是学校或工作的统一服装，不是装扮成老虎或鸟的服装;tradition=tradition is something done the same way for a long time, not clothes you can wear=tradition 是长期沿袭的事，不是能穿的衣服|cos · tume|u that says its name, as in *use*|u 读字母本音，和 *use* 一样
      candle|things to blow out on a birthday cake;a wax light lit when the power is off;ten things on a cake|a candle is a stick of wax that burns; a lantern is a paper light you hang|candle 是燃烧的蜡烛；lantern 是挂着的纸灯|lantern=lantern is a paper ball or box with a light, not a stick of wax you put on a cake=lantern 是里面有灯的纸灯或灯箱，不是插在蛋糕上的蜡烛;firework=firework explodes in the sky, so you never put it on a cake or blow it out=firework 在天上爆炸，不会插在蛋糕上，也吹不灭|can · dle|-dle at the end, said like *dl*|结尾 -dle 读作 *dl*
      decorate|a classroom made pretty with paper flowers;a tree made pretty with lights;a hall made pretty for a wedding|you decorate a place to make it pretty; you celebrate a special day|decorate 是把地方装饰漂亮；celebrate 是庆祝节日|celebrate=celebrate means doing something special for an important day, and you cannot celebrate a classroom, a tree or a hall=celebrate 是为重要的日子庆祝，不能“庆祝”教室、树或大厅;welcome/welcomed/welcoming=welcome means saying hello to a guest, not making a place look pretty=welcome 是迎接客人，不是把地方装饰漂亮|dec · o · rate|c said like k, and -ate at the end|c 读作 k，结尾是 -ate
      wedding|a cousin getting married in June;dancing after two people got married;two people getting married on a beach|a wedding is the day people get married; an anniversary is the same date in a later year|wedding 是结婚的那天；anniversary 是以后每年的同一天|anniversary=anniversary is the same date in a later year, not the day the two people get married=anniversary 是以后每年的同一天，不是两个人结婚的那天;festival=festival is a special day for many people, like the Spring Festival, not the day two people get married=festival 是许多人一起过的节日，如春节，不是两个人结婚的日子|wed · ding|the double d in the middle|中间双写 d
      anniversary|the date of a parents' wedding;100 years after a school opened;dinner ten years after a wedding|an anniversary is the same date in a later year; a wedding is the day people marry|anniversary 是以后每年的同一天；wedding 是结婚的那天|wedding=wedding is the day two people get married, not the same date years later=wedding 是两个人结婚的那天，不是多年后的同一天;festival=festival is a special day everyone celebrates, like the Spring Festival, not the same date years after one event=festival 是大家一起庆祝的节日，如春节，不是某件事多年后的同一天|an · ni · ver · sa · ry|the double n, and -sary at the end|双写 n，结尾是 -sary
    `,
  },
});

const wishes = vocabularyTopic({
  id: "a2-words-wishes",
  title: t("Wishes and Invitations", "祝福和邀请"),
  summary: t(
    "Congratulations and welcome; invitations and envelopes; special days; wrapping a surprise; dear and luck; mooncakes; midnight.",
    "祝贺和欢迎；请柬和信封；特别的日子；包装惊喜；亲爱的和运气；月饼；午夜。",
  ),
  intro: t(
    "An **invitation** came in a red **envelope**: \"Come to my party at **midnight** on New Year's Eve. It's a **surprise** for Mom!\" These words help you invite, welcome and wish people well on special days.",
    "一份 **invitation**（请柬）装在红 **envelope**（信封）里寄来了：“除夕 **midnight**（午夜）来参加我的派对吧。这是给妈妈的 **surprise**（惊喜）！”这些词帮你在特别的日子里邀请别人、欢迎客人和送上祝福。",
  ),
  prerequisites: ["a2-words-festivals"],
  words: [
    word(
      "congratulations",
      "a word you say when someone has done something good",
      "祝贺；恭喜",
      "{Congratulations} on your new job! | You passed? {Congratulations}! | We sent our {congratulations} to the happy couple.",
      "welcome luck",
    ),
    word(
      "welcome welcomes welcomed welcoming",
      "to say hello to a guest in a friendly way; a word you say to guests",
      "欢迎",
      "{Welcome} to our home! | The children {welcomed} the new student to the class.|surprised wrapped | Thank you! — You're {welcome}.",
      "congratulations surprise",
    ),
    word(
      "invitation invitations",
      "a card or a message that asks you to come to a party or an event",
      "邀请；请柬",
      "Thanks for the {invitation}! I'd love to come. | Did you get Lucy's {invitation} to her wedding? | We sent sixty {invitations} asking friends to come to the party.|envelopes surprises",
      "envelope surprise",
    ),
    word(
      "special",
      "different from usual, and better or more important",
      "特别的",
      "Today is a {special} day. It's my birthday! | We cook {special} food for the festival. | You are very {special} to me.",
      "proud glad",
    ),
    word(
      "wrap wraps wrapped wrapping",
      "to cover something with paper, often a present",
      "包；包装",
      "Can you help me {wrap} this present in paper? | She {wrapped} the gift in red paper so nobody could see it.|decorated welcomed | We spent the evening {wrapping} presents in colorful paper.|decorating welcoming",
      "decorate welcome",
    ),
    word(
      "surprise surprises",
      "something that you did not expect",
      "惊喜；意外",
      "Mom didn't know about the party, so it was a big {surprise} for her. | What a nice {surprise}! I didn't know you were coming. | Life is full of {surprises}.|invitations envelopes",
      "invitation envelope",
    ),
    word(
      "dear",
      "a word at the start of a letter; loved very much",
      "亲爱的",
      "{Dear} Grandma, thank you for the lovely present. | She is a very {dear} friend. | Oh {dear}! I've lost my keys.",
      "welcome proud",
    ),
    word(
      "luck",
      "good things that happen by chance",
      "运气",
      "Good {luck} in your exam! | I found ten yuan in the street. What {luck}! | Red is the color of good {luck} in China.",
      "surprise welcome",
    ),
    word(
      "mooncake mooncakes",
      "a round cake that people eat at the Mid-Autumn Festival",
      "月饼",
      "We eat {mooncakes} at the Mid-Autumn Festival.|envelopes lanterns | This {mooncake} has an egg in the middle. | Grandma gave us a box of sweet {mooncakes} to eat.|envelopes lanterns",
      "envelope lantern",
    ),
    word(
      "envelope envelopes",
      "a paper cover that you put a letter in",
      "信封",
      "Put the letter in the {envelope} and write the address. | At New Year, children get red {envelopes} with money in them.|invitations mooncakes | I put a stamp on the {envelope} and posted the letter inside it.",
      "invitation mooncake",
    ),
    word(
      "midnight",
      "twelve o'clock at night",
      "午夜；半夜十二点",
      "The fireworks start at {midnight}, at twelve o'clock at night. | We stayed up until {midnight}, when the New Year began. | It's after {midnight}. Go to bed!",
      "evening morning",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Welcome* and *congratulations* are both things you say: *welcome* is for a guest who arrives, and *congratulations* is for someone who has done something good, like passing an exam.",
        "*welcome* 和 *congratulations* 都是说出口的话：*welcome* 是对来到的客人说的，*congratulations* 是对做成了好事的人说的，比如考试通过了。",
      ),
      meaning: t(
        "An *invitation* and an *envelope* often arrive together: the *invitation* asks you to come, and the *envelope* is the paper cover it comes in.",
        "*invitation* 和 *envelope* 常常一起寄来：*invitation* 邀请你参加，*envelope* 是装它的纸套。",
      ),
      spell: t(
        "*Congratulations* has a t in the middle where you may hear a ch sound: con · grat · u · la · tions, and it always ends in -s.",
        "*congratulations* 中间写的是 t，听起来却像 ch：con · grat · u · la · tions，而且结尾总有 -s。",
      ),
    },
    notes: `
      congratulations|a new job;passing an exam;good wishes for a happy couple|you say congratulations for something good someone did; you say welcome to a guest|congratulations 是祝贺别人做成了好事；welcome 是迎接客人|welcome=welcome is what you say to a guest who arrives, not to someone who got a job or passed an exam=welcome 是对来到的客人说的，不是对找到工作或考试通过的人说的;luck=luck is good things that happen by chance, and you say *good luck* before something, not after it went well=luck 是碰巧的好运，*good luck* 是事前说的，不是事成之后说的|con · grat · u · la · tions|t in the middle, and -s at the end|中间是 t，结尾有 -s
      welcome|guests arriving at a home;children saying hello to a new student;the answer to "thank you"|you welcome a guest; you congratulate someone on good news|welcome 是迎接客人；congratulations 是祝贺好消息|congratulations=congratulations is what you say for good news, not to a guest or after "thank you"=congratulations 是为好消息说的，不是对客人说的，也不是回答“谢谢”的;surprise/surprised=surprise means giving someone something they did not expect, not saying hello in a friendly way=surprise 是给人意想不到的东西，不是友好地打招呼;wrap=wrap means covering something with paper, not saying hello to someone=wrap 是用纸包东西，不是向人打招呼|wel · come|one l: wel- + come|只有一个 l：wel- + come
      invitation|thanks for being asked to come;Lucy's card asking people to her wedding;cards asking friends to come to a party|an invitation asks you to come; an envelope is the paper cover it comes in|invitation 邀请你参加；envelope 是装它的纸套|envelope=envelope is the paper cover you put a letter in, and it does not ask you to come anywhere=envelope 是装信的纸套，它本身不邀请你去哪里;surprise=surprise is something you did not expect, not a card that asks you to come=surprise 是意想不到的事，不是邀请你参加的卡片|in · vi · ta · tion|-tion at the end, said like *shun*|结尾 -tion 读作 *shun*
      special|a birthday;food cooked for a festival;someone who matters very much|special means different from usual and important; proud means pleased about what you did|special 是与众不同、很重要；proud 是为自己做的事自豪|proud=proud describes how a person feels about something good they did, not a day, food or someone who matters to you=proud 形容人对自己的成就感到自豪，不形容日子、食物或对你重要的人;glad=glad means happy about something, and a day or food cannot be glad=glad 是高兴，日子和食物不会高兴|spe · cial|ci said like *sh*|ci 读作 *sh*
      wrap|a present covered in paper;a gift hidden in red paper;presents covered in colorful paper|you wrap a present by covering it with paper; you decorate a room to make it pretty|wrap 是用纸把礼物包起来；decorate 是把房间装饰漂亮|decorate=decorate means making a place look pretty for a special day, not covering a present in paper=decorate 是为特别的日子把地方装饰漂亮，不是用纸包礼物;welcome=welcome means saying hello to a guest, not covering something with paper=welcome 是迎接客人，不是用纸包东西|wrap|a silent w at the start|开头的 w 不发音
      surprise|a party Mom did not know about;a visit someone did not know about;things in life no one expects|a surprise is something you did not expect; an invitation asks you to come|surprise 是意想不到的事；invitation 是邀请|invitation=invitation is a card or message that asks you to come, not something you did not expect=invitation 是邀请你参加的卡片或消息，不是意想不到的事;envelope=envelope is a paper cover for a letter, not something you did not expect=envelope 是装信的纸套，不是意想不到的事|sur · prise|the first r is easy to forget: s-u-r-p-r-i-s-e|第一个 r 容易漏掉：s-u-r-p-r-i-s-e
      dear|the start of a letter to Grandma;a friend loved very much;what you say when you have lost your keys|dear begins a letter or means loved; welcome is what you say to a guest|dear 用于信的开头或表示亲爱的；welcome 是对客人说的|welcome=welcome is what you say to a guest, not the word that starts a letter or shows you are upset=welcome 是对客人说的，不是信的开头，也不是表示着急的话;proud=proud means pleased about something good you did, not loved or at the start of a letter=proud 是为成就自豪，不是亲爱的，也不是信的开头|dear|ear, as in *near*|ear 和 *near* 里的一样
      luck|wishes before an exam;finding ten yuan in the street;the color red in China|luck is good things that happen by chance; a surprise is something you did not expect|luck 是碰巧的好运；surprise 是意想不到的事|surprise=surprise is something you did not expect, not good things that happen by chance, and it needs *a* before it=surprise 是意想不到的事，不是碰巧的好运，而且前面要加 *a*;welcome=welcome is what you say to a guest, not good things that happen by chance=welcome 是对客人说的话，不是碰巧的好运|luck|ck at the end|结尾是 ck
      mooncake|round cakes eaten at the Mid-Autumn Festival;a cake with an egg in the middle;a box of sweet cakes from Grandma|a mooncake is a round cake for the Mid-Autumn Festival; a lantern is a light|mooncake 是中秋节吃的圆饼；lantern 是灯笼|envelope=envelope is a paper cover for a letter, and you cannot eat it=envelope 是装信的纸套，不能吃;lantern=lantern is a paper light you carry or hang, and you cannot eat it=lantern 是提着或挂着的纸灯，不能吃|moon · cake|moon + cake, one word|moon + cake，合成一个词
      envelope|a paper cover for a letter and an address;red paper covers with money at New Year;a paper cover with a stamp and a letter inside|an envelope is the paper cover; an invitation is the card inside it|envelope 是纸套；invitation 是里面的请柬|invitation=invitation is a card or message asking you to come, not the paper cover you put a letter in=invitation 是邀请你参加的卡片或消息，不是装信的纸套;mooncake=mooncake is a round cake you eat, not a paper cover for a letter or money=mooncake 是吃的圆饼，不是装信或装钱的纸套|en · ve · lope|e-n-v-e-l-o-p-e, with the silent e at the end|e-n-v-e-l-o-p-e，词尾 e 不发音
      midnight|twelve o'clock at night, when fireworks start;the time the New Year began;a late time when someone should go to bed|midnight is twelve o'clock at night; evening is the time before night|midnight 是夜里十二点；evening 是入夜前的傍晚|evening=evening is the time after the afternoon, before night, not twelve o'clock at night=evening 是下午之后、入夜之前的时间，不是夜里十二点;morning=morning is the early part of the day, not twelve o'clock at night=morning 是一天中较早的时候，不是夜里十二点|mid · night|mid + night, with a silent gh|mid + night，gh 不发音
    `,
  },
});

const feelings2 = vocabularyTopic({
  id: "a2-words-feelings-2",
  title: t("More Feelings", "更多感受"),
  summary: t(
    "Excited and exciting; surprised, pleased and glad; nervous and calm; proud and cheerful; upset, embarrassed and jealous.",
    "兴奋的和令人兴奋的；惊讶、满意和高兴；紧张和平静；自豪和开朗；难过、尴尬和嫉妒。",
  ),
  intro: t(
    "Before the school play, Ben was **nervous**, but after it he felt **proud** and very **pleased**, and his little sister was a bit **jealous**. These words help you say exactly how you feel and why.",
    "学校演出前，本很 **nervous**（紧张），演完后他觉得很 **proud**（自豪），也非常 **pleased**（高兴），而他的妹妹有点 **jealous**（嫉妒）。这些词帮你准确地说出自己的感受和原因。",
  ),
  prerequisites: ["a2-words-wishes", "a1-words-feelings"],
  words: [
    word(
      "excited",
      "very happy because something good is going to happen",
      "兴奋的",
      "The children were so {excited} about the trip to the zoo that they couldn't sit still. | I'm so {excited} that I can't stop jumping: we're going to Disneyland tomorrow! | He was too {excited} to sleep the night before his birthday.",
      "exciting calm",
    ),
    word(
      "exciting",
      "making you feel excited",
      "令人兴奋的",
      "The football match was very {exciting}: everyone jumped and shouted. | It's a really {exciting} story about pirates. | Traveling to a new country is {exciting}: there is so much new to see.",
      "excited calm",
    ),
    word(
      "surprised",
      "feeling something because you did not expect it",
      "惊讶的",
      "I was {surprised} to see Tom at the party. I thought he was in London. | I was {surprised} that the test was so easy. | We were {surprised} by the snow. It never snows here in May!",
      "jealous calm",
    ),
    word(
      "pleased",
      "happy about something",
      "高兴的；满意的",
      "I'm very {pleased} with my exam results. | {Pleased} to meet you. | The teacher was {pleased} with our work.",
      "nervous jealous",
    ),
    word(
      "nervous",
      "a little afraid because something is going to happen",
      "紧张的",
      "I'm {nervous} about my job interview tomorrow, and my hands are cold. | She was so {nervous} before the test that her hands were shaking. | Don't be {nervous}. You'll do well.",
      "proud calm",
    ),
    word(
      "proud prouder proudest",
      "happy about something you, or someone close to you, did well",
      "骄傲的；自豪的",
      "My parents were very {proud} of me when I won the prize. | I'm {proud} of my team. They played well. | It was a {proud} day for my family when my sister became a doctor.",
      "nervous jealous",
    ),
    word(
      "glad",
      "happy and pleased",
      "高兴的",
      "I'm {glad} you could come. | We were {glad} to be home after the long trip. | I'm so {glad} it's Friday: no school for two days!",
      "jealous upset",
    ),
    word(
      "upset",
      "unhappy or worried because something bad happened",
      "难过的；不安的",
      "She was {upset} because she lost her ring. | Don't be {upset}. It wasn't your fault. | He got {upset} when his friends laughed at him.",
      "cheerful glad",
    ),
    word(
      "embarrassed",
      "feeling silly because people saw you do something wrong",
      "尴尬的；难为情的",
      "I was so {embarrassed} when I fell over in front of the whole class. | He felt {embarrassed} because he forgot her name. | Don't be {embarrassed}. Everyone makes mistakes.",
      "proud excited",
    ),
    word(
      "calm calmer calmest",
      "quiet and not worried or angry",
      "平静的；镇静的",
      "Stay {calm} and walk to the door. | The sea was {calm} this morning, so we went sailing. | She is always {calm}, even when things go wrong.",
      "nervous upset",
    ),
    word(
      "cheerful",
      "happy and smiling",
      "快乐的；开朗的",
      "Our neighbor is a {cheerful} old man who always says hello. | The room is painted in {cheerful} colors. | She's always {cheerful} in the morning, smiling and singing.",
      "jealous nervous",
    ),
    word(
      "jealous",
      "unhappy because someone has something you want",
      "嫉妒的",
      "He was {jealous} of his brother's new bike because he wanted one too. | Don't be {jealous}. You'll get one too. | My sister gets {jealous} when Mom plays with the baby.",
      "proud cheerful",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Excited* and *exciting* look alike: a person feels *excited*, and the thing that makes them feel that way is *exciting*. Ask whether the gap describes a person's feeling or a match, a story or a trip.",
        "*excited* 和 *exciting* 长得很像：人感到 *excited*（兴奋的），让人兴奋的事物是 *exciting*（令人兴奋的）。看空格描述的是人的感受，还是比赛、故事或旅行。",
      ),
      meaning: t(
        "*Pleased*, *glad* and *cheerful* are happy words, but *jealous* means unhappy because someone else has what you want, and *embarrassed* means feeling silly in front of people.",
        "*pleased*、*glad* 和 *cheerful* 都表示高兴，而 *jealous* 是因为别人有你想要的东西而不开心，*embarrassed* 是在别人面前觉得难为情。",
      ),
      spell: t(
        "*Embarrassed* has a double r and a double s: em · bar · rassed. *Nervous* ends in -ous, not -us.",
        "*embarrassed* 双写 r，也双写 s：em · bar · rassed。*nervous* 以 -ous 结尾，不是 -us。",
      ),
    },
    notes: `
      excited|children who couldn't sit still before a zoo trip;not being able to stop jumping before Disneyland;being unable to sleep before a birthday|excited is how a person feels; exciting describes the thing that makes you feel it|excited 描述人的感受；exciting 描述让人兴奋的事物|exciting=exciting describes a thing like a match or a trip, not how a person feels=exciting 描述比赛、旅行这类事物，不描述人的感受;calm=calm means quiet and not worried, the opposite of being too happy to sit still or sleep=calm 是平静、不着急，和兴奋得坐不住、睡不着正相反|ex · cit · ed|-ed at the end for the feeling|表示感受的结尾是 -ed
      exciting|a football match where everyone jumped and shouted;a story about pirates;so much new to see in a new country|exciting describes a thing; excited describes a person|exciting 描述事物；excited 描述人|excited=excited describes how a person feels, not a match, a story or a trip=excited 描述人的感受，不描述比赛、故事或旅行;calm=calm means quiet and peaceful, the opposite of something that makes people jump and shout=calm 是平静安宁，和让人又跳又叫的事物正相反|ex · cit · ing|-ing at the end for the thing that excites|表示令人兴奋的事物结尾是 -ing
      surprised|seeing Tom at a party when he should be in London;a test that was easier than expected;snow in May|surprised is how you feel when you did not expect something; calm is not worried|surprised 是没想到时的感受；calm 是平静|jealous=jealous means unhappy because someone has what you want, not feeling that something was unexpected=jealous 是因为别人有你想要的东西而不开心，不是觉得意外;calm=calm means quiet and not worried, not shocked by something you did not expect=calm 是平静、不着急，不是因意外而吃惊|sur · prised|the first r is easy to miss: s-u-r|第一个 r 容易漏掉：s-u-r
      pleased|good exam results;meeting someone new;a teacher happy with our work|pleased means happy about something; nervous means a little afraid|pleased 是满意高兴；nervous 是有点害怕|nervous=nervous means a little afraid of something to come, not happy about results or work=nervous 是对将要发生的事有点害怕，不是对结果或作品满意;jealous=jealous means unhappy because someone has what you want, not happy with something=jealous 是因别人有你想要的而不开心，不是满意高兴|pleased|ea for the long e, and s said like z|ea 发长 e 音，s 读作 z
      nervous|a job interview tomorrow and cold hands;shaking hands before a test;a feeling before doing well|nervous means a little afraid before something; calm means not worried|nervous 是事前有点害怕；calm 是不担心|proud=proud means happy about something done well, not afraid of what is coming=proud 是为做好的事自豪，不是害怕将要发生的事;calm=calm means not worried, the opposite of shaking hands and cold fear=calm 是不担心，和手发抖、心里害怕正相反|ner · vous|-ous at the end, not -us|结尾是 -ous，不是 -us
      proud|parents happy that their child won a prize;a team that played well;a family's day when a sister became a doctor|proud means happy about what you or someone close did well; jealous means wanting what someone else has|proud 是为自己或亲近的人做得好而自豪；jealous 是想要别人有的东西|nervous=nervous means a little afraid of something to come, not happy about something done well=nervous 是对将来的事有点害怕，不是为做好的事高兴;jealous=jealous means unhappy because someone has what you want, not happy that someone close did well=jealous 是因别人有你想要的而不开心，不是为亲近的人做得好而高兴|proud|ou, as in *loud*|ou 和 *loud* 里的一样
      glad|a guest who could come;being home after a long trip;two days with no school|glad means happy and pleased; upset means unhappy|glad 是高兴；upset 是难过|jealous=jealous means unhappy because someone has what you want, not happy about good news=jealous 是因别人有你想要的而不开心，不是为好事高兴;upset=upset means unhappy because something bad happened, the opposite of glad=upset 是因坏事而难过，和 glad 意思相反|glad|a short a, as in *bad*|短元音 a，和 *bad* 一样
      upset|losing a ring;something that was not your fault;friends laughing at someone|upset means unhappy because something bad happened; cheerful means happy and smiling|upset 是因坏事难过；cheerful 是快乐开朗|cheerful=cheerful means happy and smiling, the opposite of how you feel when something bad happens=cheerful 是快乐开朗，和遇到坏事时的感受相反;glad=glad means happy and pleased, not unhappy about something bad=glad 是高兴，不是因坏事难过|up · set|up + set, one word, the same in the past|up + set 合成一个词，过去式不变
      embarrassed|falling over in front of the whole class;forgetting someone's name;making a mistake in front of people|embarrassed means feeling silly in front of people; proud means happy about what you did well|embarrassed 是在人前觉得难为情；proud 是为做得好而自豪|proud=proud means happy about something done well, not feeling silly about a fall or a mistake=proud 是为做得好而自豪，不是为摔倒或出错而难为情;excited=excited means very happy about something good to come, not silly about a mistake=excited 是因好事要来而兴奋，不是为出错而难为情|em · bar · rassed|the double r and the double s|双写 r，也双写 s
      calm|walking quietly to the door;a quiet sea good for sailing;staying quiet when things go wrong|calm means quiet and not worried; nervous means a little afraid|calm 是平静、不担心；nervous 是有点害怕|nervous=nervous means a little afraid, not quiet and peaceful=nervous 是有点害怕，不是平静安宁;upset=upset means unhappy because something bad happened, not quiet and peaceful=upset 是因坏事难过，不是平静安宁|calm|a silent l, said like *carm*|l 不发音，读起来像 *carm*
      cheerful|an old neighbor who always says hello;bright, happy colors in a room;smiling and singing in the morning|cheerful means happy and smiling; nervous means a little afraid|cheerful 是快乐开朗；nervous 是有点害怕|jealous=jealous means unhappy because someone has what you want, not happy and smiling=jealous 是因别人有你想要的而不开心，不是快乐开朗;nervous=nervous means a little afraid, not happy and smiling=nervous 是有点害怕，不是快乐开朗|cheer · ful|cheer + -ful with one l|cheer 加 -ful，只有一个 l
      jealous|wanting a brother's new bike too;wanting one too;a sister wanting Mom's time with the baby|jealous means wanting what someone else has; proud means happy about what someone did well|jealous 是想要别人有的东西；proud 是为别人做得好而自豪|proud=proud means happy about something done well, not wanting what someone else has=proud 是为做得好而自豪，不是想要别人有的东西;cheerful=cheerful means happy and smiling, not unhappy because someone has what you want=cheerful 是快乐开朗，不是因别人有你想要的而不开心|jeal · ous|ea said like short e, and -ous at the end|ea 读短元音 e，结尾是 -ous
    `,
  },
});

const peopleTogether = vocabularyTopic({
  id: "a2-words-people-together",
  title: t("People Together", "人与人"),
  summary: t(
    "Hugs, kisses and waves; shaking hands; agreeing and arguing; friendship and jokes; introducing people; everybody; hosts.",
    "拥抱、亲吻和挥手；握手；同意和争吵；友谊和笑话；介绍别人；大家；主人。",
  ),
  intro: t(
    "At the airport, Lily gave her grandma a big **hug** and a **kiss**, then **introduced** her new friend to **everybody**. These words help you talk about meeting people, getting along and being friends.",
    "在机场，莉莉给了奶奶一个大大的 **hug**（拥抱）和一个 **kiss**（亲吻），然后把新朋友 **introduced**（介绍）给 **everybody**（大家）。这些词帮你谈论与人见面、相处和交朋友。",
  ),
  prerequisites: ["a2-words-feelings-2"],
  words: [
    word(
      "hug hugs hugged hugging",
      "to put your arms around someone",
      "拥抱",
      "She {hugged} her mother at the airport with both arms around her.|waved shook | Come here and give me a big {hug}! I've missed you so much. | The two friends {hugged} each other tightly.|waved shook",
      "wave shake",
    ),
    word(
      "kiss kisses kissed kissing",
      "to touch someone with your lips",
      "吻；亲",
      "Grandma {kissed} me on the cheek.|hugged waved | Give Mom a {kiss} goodnight on her cheek. | In some countries, people {kiss} each other on both cheeks when they meet.",
      "hug wave",
    ),
    word(
      "wave waves waved waving",
      "to move your hand from side to side to say hello or goodbye; a line of water moving on the sea",
      "挥手；波浪",
      "She {waved} goodbye from the window of the train.|hugged shook | The children {waved} at the people in the parade.|hugged shook | Big {waves} hit the boat.|hugs shakes",
      "hug shake",
    ),
    word(
      "shake shakes shook shaken shaking",
      "to move something quickly up and down or from side to side",
      "摇；握（手）",
      "When you meet someone, {shake} hands with them. | {Shake} the bottle of juice before you open it, so the fruit mixes in. | The ground {shook} during the earthquake.|waved hugged",
      "wave hug",
    ),
    word(
      "agree agrees agreed agreeing",
      "to have the same idea as someone",
      "同意",
      "I {agree} with you. It's a great idea. | We all {agreed} to meet at six.|argued introduced | My brother and I {agree}: we both want to watch the same film.",
      "argue introduce",
    ),
    word(
      "argue argues argued arguing",
      "to talk angrily with someone because you have different ideas",
      "争吵；争论",
      "My parents sometimes {argue} about money, and they get angry.|agree joke | Stop {arguing}, you two! Shouting won't help.|agreeing joking | They {argued} all night, and now they aren't speaking.|agreed joked",
      "agree joke",
    ),
    word(
      "friendship friendships",
      "being friends",
      "友谊",
      "Their {friendship} started at primary school, and they are still friends now. | True {friendship} is more important than winning: good friends stay together. | A good {friendship} needs time, and the two friends must trust each other.",
      "joke host",
    ),
    word(
      "joke jokes",
      "something funny that you say to make people laugh",
      "笑话",
      "He told a funny {joke}, and everybody laughed. | Don't be angry. It was just a {joke}! | My dad knows lots of {jokes} that make us laugh.|friendships hosts",
      "friendship host",
    ),
    word(
      "introduce introduces introduced introducing",
      "to tell people each other's names when they first meet",
      "介绍",
      "Let me {introduce} my friend Lisa to you: Lisa, this is Tom. | She {introduced} me to her parents.|agreed argued | Can you {introduce} yourself to the class?",
      "agree argue",
    ),
    word(
      "everybody",
      "every person",
      "每个人；大家",
      "{Everybody} loves a good story, so all the children listened. | Is {everybody} here? Are all the students in the room? | Say goodbye to {everybody} before you leave: all your friends and their parents.",
      "nobody somebody",
    ),
    word(
      "host hosts hosted hosting",
      "a person who has guests; to have guests or to hold an event",
      "主人；主办",
      "Our {host} invited us to her home and cooked a wonderful dinner. | Beijing was the {host} city of the 2008 Olympic Games, so the Games were held there. | Thank your {host} for the party before you leave her home.",
      "guest joke",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Hug*, *kiss*, *wave* and *shake* are all things you do when you meet: you *hug* with your arms, *kiss* with your lips, *wave* one hand from far away and *shake* hands with someone close. Look for the arms, the cheek, the window or the hands in the sentence.",
        "*hug*、*kiss*、*wave* 和 *shake* 都是见面时做的事：*hug* 用双臂，*kiss* 用嘴唇，*wave* 是远远地挥一只手，*shake* 是和身边的人握手。在句子里找手臂、脸颊、窗口或双手这些线索。",
      ),
      meaning: t(
        "*Agree* and *argue* look alike but are opposites: when you *agree*, you have the same idea, and when you *argue*, you talk angrily because your ideas are different.",
        "*agree* 和 *argue* 长得像，意思却相反：*agree* 是想法相同，*argue* 是因为想法不同而生气地争吵。",
      ),
      spell: t(
        "*Arguing* drops the e of *argue*, but *agreeing* keeps both e's: agree + -ing. *Friendship* keeps the ie of *friend*.",
        "*arguing* 去掉 *argue* 末尾的 e，而 *agreeing* 保留两个 e：agree + -ing。*friendship* 保留 *friend* 里的 ie。",
      ),
    },
    notes: `
      hug|arms around a mother at an airport;missing someone so much;two friends holding each other tightly|you hug with your arms; you wave with one hand from far away|hug 是用双臂拥抱；wave 是远远地挥手|wave=wave means moving one hand to say hello or goodbye, without putting your arms around anyone=wave 是挥一只手打招呼或告别，不用双臂抱住别人;shake=shake means moving something quickly up and down, not putting your arms around someone=shake 是快速上下摇动，不是用双臂抱住别人|give someone a hug · hug each other|the g doubles: hugged, hugging|g 要双写：hugged、hugging
      kiss|Grandma's lips on a cheek;goodnight on Mom's cheek;both cheeks when people meet|you kiss with your lips; you hug with your arms|kiss 用嘴唇；hug 用双臂|hug=hug means putting your arms around someone, not touching a cheek with your lips=hug 是用双臂抱住别人，不是用嘴唇碰脸颊;wave=wave means moving one hand from far away, and it never touches a cheek=wave 是远远地挥手，碰不到脸颊|give someone a kiss · kiss someone on the cheek|the double s, and -es for *kisses*|双写 s，复数和三单是 *kisses*
      wave|goodbye from a train window;children and the people in a parade;big lines of water hitting a boat|you wave a hand from far away; you shake hands with someone close|wave 是远远地挥手；shake 是和身边的人握手|hug=hug means putting your arms around someone close, not moving your hand from far away, and it is never water on the sea=hug 是抱住身边的人，不是远远地挥手，也不是海上的波浪;shake=shake means moving something quickly up and down, not a hand moving at people far away or water on the sea=shake 是快速上下摇动，不是朝远处的人挥手，也不是海上的波浪|wave goodbye · wave at someone|drop the e before -ing: waving|加 -ing 前去掉 e：waving
      shake|the hands of people who meet;a bottle of juice before opening;the ground in an earthquake|you shake something by moving it quickly up and down; you wave a hand to say hello|shake 是快速上下摇动；wave 是挥手打招呼|wave=wave means moving one hand to say hello or goodbye, not moving hands, a bottle or the ground quickly up and down=wave 是挥一只手打招呼，不是快速摇动双手、瓶子或地面;hug=hug means putting your arms around someone, not moving hands, a bottle or the ground=hug 是用双臂抱住人，不是摇动双手、瓶子或地面|shake hands · shake the bottle|the past is *shook*, not *shaked*|过去式是 *shook*，不是 *shaked*
      agree|a great idea;a meeting time of six;two brothers wanting the same film|you agree when you have the same idea; you argue when your ideas are different|agree 是想法相同；argue 是想法不同而争吵|argue=argue means talking angrily because your ideas are different, the opposite of having the same idea=argue 是因想法不同而生气地争论，和想法相同正相反;introduce=introduce means telling people each other's names, not having the same idea=introduce 是告诉双方彼此的名字，不是想法相同|agree with someone · agree to do something|keep both e's: agreed, agreeing|保留两个 e：agreed、agreeing
      argue|parents angry about money;two people shouting;a night that ended in not speaking|you argue when you talk angrily; you joke to make people laugh|argue 是生气地争吵；joke 是开玩笑逗人笑|agree=agree means having the same idea, not talking angrily=agree 是想法相同，不是生气地争吵;joke/joking/joked=to joke is to say funny things, not to disagree angrily=joke 是开玩笑，不是争吵|argue about something · argue with someone|drop the e: arguing, argued|去掉 e：arguing、argued
      friendship|two people friends since primary school;good friends staying together;two friends who trust each other|friendship is being friends; a joke is something funny you say|friendship 是友谊；joke 是笑话|joke=joke is something funny you say once, not being friends for a long time=joke 是说一次的好笑的话，不是长久的朋友关系;host=host is a person who has guests, not being friends=host 是招待客人的主人，不是朋友关系|a good friendship · true friendship|friend + -ship, keeping the ie|friend 加 -ship，保留 ie
      joke|everybody laughing;something not meant to make anyone angry;a dad making us laugh|a joke is something funny you say; friendship is being friends|joke 是好笑的话；friendship 是友谊|friendship=friendship is being friends, not something funny you tell=friendship 是朋友关系，不是讲出来的好笑的话;host=host is a person who has guests, not something funny you tell=host 是招待客人的主人，不是讲出来的好笑的话|tell a joke · just a joke|the o says its name before the silent e|不发音的 e 前面，o 读字母本音
      introduce|telling Tom the name of a friend Lisa;meeting someone's parents;telling a class your own name|you introduce people by telling them each other's names; you agree when you have the same idea|introduce 是介绍彼此的名字；agree 是想法相同|agree=agree means having the same idea, and you cannot agree a person to someone=agree 是想法相同，不能把一个人 agree 给别人;argue=argue means talking angrily, not telling people each other's names=argue 是生气地争吵，不是介绍彼此的名字|introduce someone to someone · introduce yourself|in · tro · duce, with -duce said like *dyoos*|in · tro · duce，-duce 读作 *dyoos*
      everybody|all the children listening to a story;all the students in the room;all your friends and their parents|everybody means every person; nobody means no person|everybody 是每个人；nobody 是没有人|nobody=nobody means no person, not all the people=nobody 是没有人，不是所有的人;somebody=somebody means one person you do not name, not all the people=somebody 是某一个没说出是谁的人，不是所有的人|everybody · say goodbye to everybody|every + body, one word, and it takes *is*, not *are*|every + body 合成一个词，后面用 *is*，不用 *are*
      host|a woman who invited us and cooked dinner;the city where the 2008 Games were held;the person whose home a party is in|a host has the guests; a guest visits the host|host 是招待客人的主人；guest 是来访的客人|guest=guest is a person who visits someone's home or an event, not the person or place that holds it=guest 是去别人家或参加活动的客人，不是举办的人或地方;joke=joke is something funny you say, not a person or place that holds an event=joke 是好笑的话，不是举办活动的人或地方|thank your host · the host city|the h is said, and -st at the end|h 要发音，结尾是 -st
    `,
  },
});

// Verbs followed by to.

/** toVerbs are the start of a sentence with a verb that takes to. */
const toVerbs: readonly string[] = [
  "I want",
  "She hopes",
  "We decided",
  "They plan",
  "My brother needs",
  "Tom promised",
  "I'd like",
  "We agreed",
  "He refused",
];
/** toActions are a verb and the rest of an action. */
const toActions: readonly (readonly [string, string])[] = [
  ["visit", "Grandma at the weekend"],
  ["buy", "a new phone"],
  ["call", "the hotel"],
  ["make", "dumplings for the festival"],
  ["book", "the tickets"],
  ["clean", "the kitchen"],
  ["send", "the invitations"],
  ["learn", "the dragon dance"],
  ["watch", "the lantern parade"],
  ["help", "with the dinner"],
  ["paint", "the lanterns"],
  ["cook", "a big meal"],
];

const toChoiceBank: readonly ChoiceItem[] = everyPair(toVerbs, toActions).map(([start, [verb, rest]]): ChoiceItem => {
  const ing = verb === "make" ? "making" : `${verb}ing`;
  return [`${start} ___ ${rest}. (${verb})`, `to ${verb}`, [verb, ing]];
});

/** toSubjects are a subject and whether it takes a verb with -s. */
const toSubjects: readonly (readonly [string, boolean])[] = [
  ["She", true],
  ["I", false],
  ["My brother", true],
  ["We", false],
  ["Tom", true],
  ["They", false],
  ["My parents", false],
];
/** toVerbForms are a verb that takes to, its form with -s and its past, and whether the item is about the past. */
const toVerbForms: readonly (readonly [string, string, string, boolean])[] = [
  ["want", "wants", "wanted", false],
  ["decide", "decides", "decided", true],
  ["hope", "hopes", "hoped", false],
  ["promise", "promises", "promised", true],
  ["need", "needs", "needed", false],
];
const toRests: readonly string[] = [
  "visit the castle",
  "learn Japanese",
  "go to the festival",
  "stay at home",
  "see the fireworks",
  "help Grandma",
  "find a new job",
  "travel by train",
  "watch the parade",
  "buy some mooncakes",
  "move to the city",
];

// Seven subjects, five verbs and eleven actions have no common factor, so 385 rows give every combination once.
const toTypedBank: readonly TypedItem[] = combos(385, toSubjects, toVerbForms, toRests).map(
  ([[subject, s], [verb, third, past, isPast], rest]): TypedItem => {
    if (isPast) {
      return {
        shown: `${subject} / ${verb} / ${rest} / yesterday`,
        accepted: [
          `${subject} ${past} to ${rest} yesterday.`,
          `Yesterday ${subject === "I" || subject === "Tom" ? subject : subject.charAt(0).toLowerCase() + subject.slice(1)} ${past} to ${rest}.`,
        ],
        canonical: `${subject} ${past} to ${rest} yesterday.`,
        wrong: [`${subject} ${past} ${rest} yesterday.`, `${subject} ${verb} to ${rest} yesterday.`],
      };
    }
    const form = s ? third : verb;
    return {
      shown: `${subject} / ${verb} / ${rest}`,
      accepted: [`${subject} ${form} to ${rest}.`],
      wrong: [`${subject} ${s ? verb : third} to ${rest}.`, `${subject} ${form} ${rest}.`],
    };
  },
);

/** toVerbIn is the verb that takes to at the start of a sentence, as its learner would look it up. */
const toVerbIn = (sentence: string): string => {
  const start = toVerbs.find((v) => sentence.startsWith(v)) ?? "";
  return start.endsWith("'d like") ? "would like" : (start.split(" ").pop() ?? "");
};

/** whyNotTo explains a verb after want, hope or decide without to, or with -ing. */
const whyNotTo = (wrong: string, _right: string, shown: string, position: number): Text => {
  const verb = toVerbIn(shown);
  return position === 0
    ? t(
        `*${wrong}* leaves out *to*. After *${verb}*, English puts *to* before the next plain verb.`,
        `*${wrong}* 漏了 *to*。在 *${verb}* 后面，下一个动词原形前必须加 *to*。`,
      )
    : t(
        `*${wrong}* uses the *-ing* form, but *${verb}* takes *to* plus the plain verb, not *-ing*.`,
        `*${wrong}* 用了 *-ing* 形式，但 *${verb}* 后面接 *to* 加动词原形，不接 *-ing*。`,
      );
};

/** firstToVerb is the first verb of a written sentence, in the form it takes there. */
const firstToVerb = (sentence: string): string => {
  const forms = toVerbForms.flatMap(([verb, third, past]) => [third, past, verb]);
  return forms.find((form) => new RegExp(`\\b${form}\\b`, "u").test(sentence)) ?? "";
};

const verbsFollowedByTo: TopicDef = {
  id: "verbs-followed-by-to",
  title: t("Want To, Decide To", "want to、decide to：动词后接 to"),
  summary: t(
    "I want to go. She decided to stay. We hope to see you. Some verbs take to and the first form of another verb after them.",
    "I want to go. She decided to stay. We hope to see you. 有些动词后面接 to 加另一个动词的原形。",
  ),
  intro: t(
    "In *She plans to invite her cousins*, two verbs stand next to each other, linked by *to*. Verbs of wishing, deciding and planning (*want, hope, decide, plan, need, promise*) always connect to the next verb with *to* + base form.",
    "在 *She plans to invite her cousins* 里，两个动词靠 *to* 连在一起。表示想要、决定、计划的动词（*want、hope、decide、plan、need、promise*）后面总是接 *to* + 动词原形。",
  ),
  prerequisites: ["present-simple", "a2-words-events"],
  encompasses: [
    { topic: "present-simple", weight: 0.2 },
    { topic: "a2-words-events", weight: 0.1 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "form",
      t("To and the verb", "to 加动词"),
      t(
        "After *want*, *would like*, *hope*, *decide*, *plan*, *need*, *promise*, *agree* and *refuse*, use *to* and the first form of the next verb:\n\n- *I want to buy a new phone.*\n- *We decided to stay at home.*\n- *He refused to clean the kitchen.*\n\n> **Watch out.** Never drop *to* (*I want buy* is wrong) and never use *-ing* after these verbs (*We decided staying* is wrong).",
        "在 *want*、*would like*、*hope*、*decide*、*plan*、*need*、*promise*、*agree* 和 *refuse* 后面，用 *to* 加下一个动词的原形：\n\n- *I want to buy a new phone.*\n- *We decided to stay at home.*\n- *He refused to clean the kitchen.*\n\n> **注意。** 中文说“我想买”，两个动词直接连在一起，但英语中间不能省 *to*（*I want buy* 是错的），也不要接 *-ing*（*We decided staying* 是错的）。",
      ),
      choiceGenerator(
        t("Choose the words for the gap.", "选出填入空白处的词。"),
        toChoiceBank,
        (right, shown) => {
          const verb = toVerbIn(shown);
          return t(
            `*${verb}* is one of the verbs that take *to* and the first form of the next verb: ${fill(shown, right)}\n\n**Check.** Verify the pattern right after *${verb}*: *to* + plain verb (*${right}*), with no *-ing* and no *-s*.`,
            `*${verb}* 属于后面接 *to* 加下一个动词原形的动词：${fill(shown, right)}\n\n**检验。** 核对 *${verb}* 后面的结构：*to* + 动词原形（*${right}*），既不加 *-ing* 也不加 *-s*。`,
          );
        },
        whyNotTo,
      ),
    ),
    point(
      "write",
      t("Writing with want to and decided to", "用 want to 和 decided to 写句子"),
      t(
        "Write the sentence from the note. The first verb changes: *-s* after *he*, *she* and one person (*She wants*), *-ed* for the past (*We decided*). The second verb never changes: *to* and its first form.\n\n*She wants to visit the castle. They decided to stay at home yesterday.*\n\n> **Watch out.** Put the *-s* or *-ed* only on the first verb—never on the verb after *to* (*She wants to visits* is wrong).",
        "根据笔记写句子。第一个动词要变：*he*、*she* 和单个人后面加 *-s*（*She wants*），过去的事加 *-ed*（*We decided*）。第二个动词永远不变：*to* 加原形。\n\n*She wants to visit the castle. They decided to stay at home yesterday.*\n\n> **注意。** 只有第一个动词随主语或时态变化，*to* 后面的动词永远保持原形（*She wants to visits* 是错的）。",
      ),
      typedGenerator(
        "sentence",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        toTypedBank,
        (right) => {
          const first = firstToVerb(right);
          const how = right.includes("yesterday")
            ? t("takes *-ed* for the past", "因为是过去的事，加 *-ed*")
            : first.endsWith("s")
              ? t("takes *-s* after one person", "单个人作主语时加 *-s*")
              : t("stays plain after this subject", "在这个主语后面用原形");
          return t(
            `The first verb ${how.en} (*${first}*), and the second is always *to* with its first form: ${right}\n\n**Check.** Check both verbs: the first (*${first}*) matches the subject and tense, and the second stays *to* + plain verb.`,
            `第一个动词${how["zh-CN"]}（*${first}*），第二个动词总是 *to* 加原形：${right}\n\n**检验。** 核对两个动词：第一个（*${first}*）符合主语和时态，第二个保持 *to* + 动词原形。`,
          );
        },
        verbsFollowedByToWriteNot,
      ),
    ),
  ],
};

// An invitation and a reply.

const invitationBank: readonly WritingItem[] = [
  {
    task: "Write an invitation to your birthday party.",
    model:
      "Dear Sam,\n\nI'm having a birthday party next Saturday, June 12th, and I'd like you to come! It's at my house, 25 Green Street, from three o'clock to six. We are going to play games in the garden and have a big cake. My mom will make pizza too. Please tell me by Thursday if you can come.\n\nSee you soon,\nLily",
  },
  {
    task: "Write an invitation to a picnic in the park.",
    model:
      "Hi everybody,\n\nLet's have a picnic in People's Park this Sunday! We can meet at the main gate at eleven o'clock. Please bring some food or drinks to share. I'll bring a big blanket and a ball, so we can play football after lunch. If it rains, we'll go to my house instead. Can you come?\n\nTom",
  },
  {
    task: "Write an invitation to a Mid-Autumn Festival dinner at your home.",
    model:
      "Dear Mr. and Mrs. Brown,\n\nWe would like to invite you to dinner at our home for the Mid-Autumn Festival. It's on Friday, September 17th, at seven o'clock. We live in Flat 8, Building 3, on River Road. My parents are going to cook a traditional dinner, and after that we will eat mooncakes and look at the full moon. We hope you can come.\n\nBest wishes,\nWang Lei",
  },
  {
    task: "Write an invitation to your school concert.",
    model:
      "Dear Grandma and Grandpa,\n\nOur school is having a concert next Friday evening, and I'm going to play the piano! It starts at half past six in the school hall. The concert is free, and there will be drinks and snacks after it. Mom will pick you up at six. I really want you to be there. Please come!\n\nLove,\nMia",
  },
  {
    task: "Write an invitation to a film night at your home.",
    model:
      "Hi Jack,\n\nDo you want to come to a film night at my house on Saturday? A few friends from our class are coming too. We're going to watch the new space film and eat lots of popcorn. Come at about seven o'clock. My address is 14 Park Road, near the supermarket. Let me know if you can come!\n\nCheers,\nDavid",
  },
  {
    task: "Write an invitation to your sister's wedding for a friend of the family.",
    model:
      "Dear Mrs. Chen,\n\nMy sister Anna is getting married, and our family would like to invite you to her wedding. It is on Saturday, October 2nd, at the Garden Hotel on Lake Street. The wedding starts at eleven o'clock, and lunch will follow. Please reply by September 15th so we know how many guests are coming.\n\nBest wishes,\nThe Li family",
  },
  {
    task: "Reply to the invitation and say yes.",
    source: "Hi! I'm having a barbecue in my garden on Sunday at four o'clock. There will be music and lots of food. Can you come? Mark",
    model:
      "Hi Mark,\n\nThanks for the invitation! Yes, I'd love to come to your barbecue on Sunday. I'll be there at four. Can I bring something? I can make a fruit salad or bring some drinks. Is it OK if my brother comes too? He loves barbecues! See you on Sunday.\n\nBest,\nPeter",
  },
  {
    task: "Reply to the invitation and say no, with a reason.",
    source:
      "Dear friend, we are having a party for our grandparents' 50th wedding anniversary on Saturday evening at the Rose Restaurant. We would love you to come! Ella",
    model:
      "Dear Ella,\n\nThank you very much for the invitation. Fifty years is wonderful! I'm really sorry, but I can't come on Saturday evening. My family is going to visit my aunt in another city that weekend, and we're leaving on Friday. Please say congratulations to your grandparents from me. I hope you have a lovely party.\n\nLove,\nSophie",
  },
  {
    task: "Reply to the invitation and say yes.",
    source:
      "Hello! Our class is going to watch the Lantern Festival parade together on Tuesday evening. We will meet at the school gate at six. Do you want to come with us? Ms. Lin",
    model:
      "Dear Ms. Lin,\n\nThank you for asking me. Yes, I would like to come to the parade with the class on Tuesday. I will meet you at the school gate at six o'clock. Should I bring a lantern? My grandfather made me a beautiful red one, and I would like to carry it. I'm very excited!\n\nBest wishes,\nZhou Jie",
  },
  {
    task: "Reply to the invitation and say no, with a reason.",
    source:
      "Hi! Do you want to come to the beach with my family on Saturday? We're leaving at eight in the morning and coming back in the evening. Zoe",
    model:
      "Hi Zoe,\n\nThanks so much for asking me! I'd really love to come, but I can't this Saturday. I have a big math exam on Monday, and I need to study all weekend. My parents won't let me go out. Maybe we can go to the beach together next month, after the exams? Have a great time!\n\nLove,\nAmy",
  },
  {
    task: "Reply to the invitation and say yes.",
    source:
      "Dear neighbor, we are having a small party on the first floor to welcome the new families in our building. It's on Friday at seven. Everybody is welcome! The Wus",
    model:
      "Dear Mr. and Mrs. Wu,\n\nThank you for your kind invitation. My husband and I would be glad to come to the party on Friday at seven. It's a lovely idea to welcome the new families. We will bring some homemade cookies. We look forward to meeting everybody.\n\nBest wishes,\nMaria Garcia, Flat 4B",
  },
  {
    task: "Reply to the invitation and say no, with a reason.",
    source: "Hi! I've got two tickets for the football final next Wednesday evening. Would you like to come with me? Ben",
    model:
      "Hi Ben,\n\nWow, tickets for the final! Thank you for thinking of me. I'm so sorry, but I can't come on Wednesday evening. It's my mom's birthday, and we are having dinner at a restaurant with the whole family. Why don't you ask Tom? He loves football too. Tell me all about the match on Thursday!\n\nSee you,\nLeo",
  },
];

const writingAnInvitationAndAReply = judgedTopic({
  id: "writing-an-invitation-and-a-reply",
  title: t("Writing an Invitation and a Reply", "写邀请和回复"),
  summary: t(
    "Write an invitation that says what, when and where, or a reply that says yes, or says no with a reason.",
    "写一份邀请，说明是什么活动、什么时间、在哪里；或者写一封回复，接受邀请，或者说明理由并拒绝。",
  ),
  intro: t(
    "A good invitation gives every practical detail—*Join us for a picnic on Sunday at 11:00 in River Park!*—and a polite reply thanks the host first, then clearly accepts or declines with a reason.",
    "一份好邀请会把实用信息写全（*Join us for a picnic on Sunday at 11:00 in River Park!*），而礼貌的回复总是先道谢，再明确答应或说明理由婉拒。",
  ),
  prerequisites: ["writing-a-short-note", "will-for-the-future"],
  encompasses: [
    { topic: "writing-a-short-note", weight: 0.3 },
    { topic: "will-for-the-future", weight: 0.2 },
  ],
  criteria: ["a2-invitation-details", "a1-reader-and-name", "a1-sentences"],
  point: {
    id: "invitation",
    title: t("What, when and where; yes or no", "什么、何时、何地；接受还是拒绝"),
    explanation: t(
      "**An invitation** says what the event is, when it is and where it is: *I'm having a birthday party next Saturday at my house, from three to six.* Then ask: *Can you come?*\n\n**A reply** thanks the writer first: *Thanks for the invitation!* Then say yes (*I'd love to come*) or no with a reason (*I'm sorry, but I can't come. We're visiting my aunt that weekend.*)\n\n> **Watch out.** When saying no, never write a blunt *No, I can't*—add *I'm sorry* and a short reason, and remember to open with a greeting and close with your name.",
      "**邀请**要说明是什么活动、什么时间、在哪里：*I'm having a birthday party next Saturday at my house, from three to six.* 然后问：*Can you come?*\n\n**回复**先感谢对方：*Thanks for the invitation!* 然后接受（*I'd love to come*），或者说明理由并拒绝（*I'm sorry, but I can't come. We're visiting my aunt that weekend.*）。\n\n> **注意。** 拒绝时不要生硬地只说 *No, I can't*，要加上 *I'm sorry* 和简短理由，并记得写全称呼和署名。",
    ),
  },
  question: t(
    "Write five to eight sentences in English: the invitation or the reply the task asks for.",
    "根据题目用英语写五到八句话：写一份邀请或一封回复。",
  ),
  bank: invitationBank,
  limits: { minWords: 40, maxChars: 900 },
  what: t("text", "文字"),
});

/** topics are the topics of the unit Festivals and Celebrations. */
export const topics: readonly TopicDef[] = [
  festivalWords.topic,
  wishes.topic,
  feelings2.topic,
  peopleTogether.topic,
  verbsFollowedByTo,
  writingAnInvitationAndAReply,
];

/** vocabulary are the words the unit Festivals and Celebrations teaches. */
export const vocabulary: readonly WordBatch[] = [festivalWords.batch, wishes.batch, feelings2.batch, peopleTogether.batch];
