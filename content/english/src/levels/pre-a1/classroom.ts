// Pre-A1, unit 4: My Classroom. Things in the classroom, this and that, in, on and under, classroom commands, and
// putting words in the order of an English sentence.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, sentenceCase, vocabularyTopic, word } from "../words.ts";
import { imperativeNot, placeOrderNot, theseNot, wordOrderNot } from "./mistakes.ts";

const classroom = vocabularyTopic({
  id: "pre-a1-words-classroom",
  title: t("The Classroom", "教室"),
  summary: t("The things and people of a classroom.", "教室里的东西和人。"),
  intro: t(
    'In the **classroom**, the **teacher** says: "Take out a **pencil** and a **ruler**, and draw a straight line." These words help you name the things and people you meet at school.',
    "在 **classroom**（教室）里，**teacher**（老师）说：“拿出 **pencil**（铅笔）和 **ruler**（尺子），画一条直线。”这些词帮你说出在学校遇到的东西和人。",
  ),
  prerequisites: [],
  words: [
    word(
      "book books",
      "pages with words and pictures to read, inside a cover",
      "书",
      "I read a {book} about cats. | Open your {books} to page ten.|pens chairs | This {book} has many pictures and stories.",
      "pen chair",
    ),
    word(
      "pen pens",
      "a thing you write with in ink",
      "钢笔；笔",
      "I write my name in ink with a {pen}. | My {pen} has blue ink. | Can I have a {pen}? Mine has no ink.",
      "pencil ruler",
    ),
    word(
      "pencil pencils",
      "a thing you write or draw with; you can rub out what it makes",
      "铅笔",
      "My {pencil} is gray and has an eraser at the end. | Use a {pencil}, so you can rub it out. | My {pencils} are in my bag. They are not sharp.|pens erasers",
      "pen eraser",
    ),
    word(
      "bag bags",
      "a thing you carry your books in",
      "书包；包",
      "Put your books in your {bag}, and take it home. | My school {bag} is heavy on my back. | I carry my {bag} to school.",
      "desk chair",
    ),
    word(
      "desk desks",
      "a table you work or write at",
      "书桌；课桌",
      "I do my homework at my {desk}. | Sit at your {desk}, please. | There are thirty {desks} in our classroom, and each one has a chair.|chairs bags",
      "chair bag",
    ),
    word(
      "chair chairs",
      "a seat for one person, with legs and a back",
      "椅子",
      "Sit on the {chair}, not on the desk. | The {chair} has four legs and a back. | Please put your {chair} under the desk.",
      "desk bag",
    ),
    word(
      "ruler rulers",
      "a long, flat thing for drawing straight lines",
      "尺子",
      "Put your {ruler} on the paper and draw a straight line along it. | How long is your book? Use a {ruler}. | This {ruler} is long and flat. It has numbers on it.",
      "eraser pencil",
    ),
    word(
      "eraser erasers",
      "a small thing for rubbing out pencil marks",
      "橡皮",
      "Oops! A mistake. Can I use your {eraser} to rub it out? | Rub it out with an {eraser}. | My {eraser} is small and pink. It rubs out pencil.",
      "ruler pencil",
    ),
    word(
      "teacher teachers",
      "a person who helps you learn at school",
      "老师",
      "Ms. Li is our English {teacher}. | Listen to your {teacher}. | The {teachers} are in the classroom with the children.|books schools",
      "book school",
    ),
    word(
      "school schools",
      "a place where children go to learn",
      "学校",
      "I go to {school} at eight. | My {school} is big. It has many classrooms. | Children learn at {school}.",
      "classroom teacher",
    ),
    word(
      "classroom classrooms",
      "a room in a school where a class learns",
      "教室",
      "Our {classroom} is room 5 in the school. | This {classroom} is for our class, and that one is for Class 2. | Our school has twenty {classrooms} for twenty classes.|schools teachers",
      "school teacher",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Read what the thing is used for: you write in ink with a *pen*, rub out with an *eraser*, draw straight lines with a *ruler* and carry books in a *bag*.",
        "看清东西的用途：用 *pen* 写出墨水字，用 *eraser* 擦掉，用 *ruler* 画直线，用 *bag* 装书。",
      ),
      meaning: t(
        "*School* is the whole place; a *classroom* is one room in it. A *desk* is where you work, a *chair* where you sit.",
        "*school* 是整个学校；*classroom* 是其中的一个房间。*desk* 是做功课的桌子，*chair* 是坐的椅子。",
      ),
      spell: t(
        "*Pencil* ends in -cil, not -sil; *eraser* has an s said like z; and *classroom* is one word with a double s.",
        "*pencil* 结尾是 -cil，不是 -sil；*eraser* 里的 s 读作 z；*classroom* 是一个词，有双写 s。",
      ),
    },
    notes: `
      book|a story about cats;pages to open to page ten;pictures and stories inside a cover|a book has pages to read; a pen is for writing|book 有页可以读；pen 用来写字|pen=pen is a thing you write with, not pages with words and pictures to read=pen 是写字用的笔，不是有字有图可以读的书;chair=chair is a seat for one person, not pages to read=chair 是一个人坐的椅子，不是可以读的书|book|the double o, said like the oo in *look*|两个 o，读音和 *look* 里的 oo 一样
      pen|writing a name in ink;blue ink;a thing with no ink left|a pen writes in ink; a pencil writes in gray and can be rubbed out|pen 写出墨水字；pencil 写出灰色的字，可以擦掉|pencil=pencil writes in gray that you can rub out, not in ink=pencil 写出可以擦掉的灰色字，不用墨水;ruler=ruler is a flat thing for drawing straight lines, not a thing with ink=ruler 是画直线的扁平尺子，里面没有墨水|pen|the short e, as in *ten*|短元音 e，和 *ten* 一样
      pencil|a gray thing with an eraser at the end;something you can rub out;things in a bag that are not sharp|you can rub out what a pencil makes; a pen writes in ink that stays|pencil 写的可以擦掉；pen 写的是擦不掉的墨水字|pen=pen writes in ink, so you cannot rub out what it makes, and it is never sharp=pen 写的是墨水字，擦不掉，也不会是尖的;eraser=eraser rubs marks out, it does not write or draw them=eraser 是擦掉痕迹的，不能写字画画|pen · cil|the ending -cil, not -sil|结尾是 -cil，不是 -sil
      bag|putting books in it to take home;a heavy one on your back;carrying it to school|a bag is for carrying books; a desk is a table that stays in the classroom|bag 用来装书带着走；desk 是留在教室里的桌子|desk=desk is a table you work at, too big to carry or wear on your back=desk 是做功课的桌子，太大了，不能背着带走;chair=chair is a seat for one person, not a thing you carry books in=chair 是一个人坐的椅子，不是装书的东西|bag|the short a, and g at the end|短元音 a，结尾是 g
      desk|doing homework;where you sit at, please;thirty of them, each with a chair|you work at a desk; you sit on a chair|desk 是做功课的桌子；chair 是坐的椅子|chair=chair is the seat you sit on, not the table you work and write at=chair 是坐的椅子，不是写字做功课的桌子;bag=bag is a thing you carry books in, not a table you work at=bag 是装书的包，不是做功课的桌子|desk|sk at the end|结尾是 sk
      chair|a seat, not a desk;four legs and a back;something put under a desk|a chair is a seat with a back; a desk is a table|chair 是有靠背的椅子；desk 是桌子|desk=desk is a table you work at, with no back to lean on, not a seat=desk 是做功课的桌子，没有靠背，不是坐的;bag=bag is a thing you carry books in, not a seat with legs=bag 是装书的包，不是有腿的椅子|chair|ch at the start and air at the end|开头是 ch，结尾是 air
      ruler|a straight line drawn along it;finding how long a book is;a long, flat thing with numbers|a ruler draws straight lines; an eraser rubs lines out|ruler 用来画直线；eraser 用来擦掉线|eraser=eraser rubs pencil marks out, it does not draw lines or have numbers=eraser 用来擦掉铅笔痕迹，不能画线，上面也没有数字;pencil=pencil writes and draws, but it has no numbers to show how long things are=pencil 用来写和画，上面没有显示长度的数字|ru · ler|the ending -er, not -ar|结尾是 -er，不是 -ar
      eraser|rubbing out a mistake;rubbing something out;a small pink thing that rubs out pencil|an eraser rubs marks out; a pencil makes them|eraser 擦掉痕迹；pencil 写出痕迹|ruler=ruler is for drawing straight lines, not for rubbing marks out=ruler 用来画直线，不是擦痕迹的;pencil=pencil makes marks, it does not rub them out=pencil 写出痕迹，不能擦掉痕迹|e · ra · ser|the s in the middle, said like z|中间的 s 读作 z
      teacher|our English one, Ms. Li;someone you listen to;people in the classroom with the children|a teacher is a person; a school is a place|teacher 是人；school 是地方|book=book is a thing with pages to read, not a person who helps you learn=book 是可以读的书，不是帮你学习的人;school=school is a place, not a person who helps you learn=school 是地方，不是帮你学习的人|tea · cher|ea in the middle and -er at the end|中间是 ea，结尾是 -er
      school|going there at eight;a big place with many classrooms;where children learn|a school is the whole place; a classroom is one room in it|school 是整个学校；classroom 是其中一间|classroom=classroom is one room in a school, and it needs *the* or *my* before it, not the whole place you go to=classroom 只是学校里的一间教室，前面要加 *the* 或 *my*，不是你去上学的整个地方;teacher=teacher is a person who helps you learn, not a place=teacher 是帮你学习的人，不是地方|school|sch said like *sk*|sch 读作 *sk*
      classroom|room 5 in the school;a room for our class and one for Class 2;twenty rooms for twenty classes|a classroom is one room; a school has many of them|classroom 是一间教室；school 里有很多间|school=school is the whole place with many rooms, not one room for a class=school 是有很多房间的整个学校，不是一个班的一间教室;teacher=teacher is a person, not a room=teacher 是人，不是房间|class · room|one word: *class* with a double s, then *room*|是一个词：双写 s 的 *class* 加上 *room*
    `,
  },
});

const thisAndThat = vocabularyTopic({
  id: "pre-a1-words-this-and-that",
  title: t("This, That, Here and There", "this、that、here 和 there"),
  summary: t("Words for near and far, and for places: in, on, under and where.", "表示远近和位置的词：in、on、under 和 where。"),
  intro: t(
    "**This** is my pen, **here** in my hand, and **that** is your bag, over **there** by the door. These words help you show what is near and far and where things are.",
    "**This**（这）是我的笔，**here**（这里）在我手里；**that**（那）是你的包，在门边 **there**（那里）。这些词帮你指出远近，说出东西在哪里。",
  ),
  prerequisites: ["pre-a1-words-i-and-you"],
  words: [
    word(
      "this",
      "the one thing near you",
      "这；这个",
      "{This} is my pen, here in my hand. | Look at {this} book in my hand. | {This} is my friend Sam, next to me.",
      "that these",
    ),
    word(
      "that that's",
      "the one thing over there, not near you",
      "那；那个",
      "Look at {that} bird up in the sky! | {That} is my house, over there.|This Those | What is {that}, over there?",
      "this those",
    ),
    word(
      "these",
      "the things near you, more than one",
      "这些",
      "{These} are my pens, here on my desk. | Look at {these} pictures here in my book. | Are {these} your shoes, here by the door?",
      "those this",
    ),
    word(
      "those",
      "the things over there, more than one",
      "那些",
      "{Those} are my friends, over there. | Look at {those} birds, far away in the tree! | Are {those} your bags, over there?",
      "these that",
    ),
    word(
      "here",
      "in this place, near me",
      "这里",
      "Come {here}, please. Sit next to me. | Your pen is {here}, in my hand. | {Here} is your book. Take it from my hand.",
      "there where",
    ),
    word(
      "there there's",
      "in that place, not near me; also in *there is* and *there are*",
      "那里；（用在 there is 中）有",
      "Your bag is not here. It is over {there}, by the door. | {There's} a cat on the bed.|Here's Where's | Look over {there}, far away! It's a big bird.",
      "here where",
    ),
    word(
      "in",
      "inside something",
      "在……里面",
      "I am {in} the classroom. | The milk is {in} the cup. | Ben is {in} bed. He is sleeping.",
      "on under",
    ),
    word(
      "on",
      "touching the top or the side of something",
      "在……上面",
      "The picture is {on} the wall. | There is a hat {on} his head. | Write your name {on} the paper.",
      "in under",
    ),
    word(
      "under",
      "below something",
      "在……下面",
      "The dog sleeps {under} the table. It's dark there. | My feet are {under} the desk, on the floor. | It's raining! Come {under} my umbrella.",
      "on in",
    ),
    word(
      "where where's",
      "the word you use to ask about a place",
      "在哪里",
      "{Where} is my pen? It's in your bag. | {Where's} Dad? He's in the garden.|What's Who's | {Where} are you? I'm here!",
      "what who",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Look for *here* or *over there* in the sentence: near things take *this* and *these*, far things take *that* and *those*.",
        "找句子里的 *here* 或 *over there*：近处的用 *this*、*these*，远处的用 *that*、*those*。",
      ),
      meaning: t(
        "*This* and *that* are for one thing, *these* and *those* for more than one. Check two things in the meaning: near or far, and one or more.",
        "*this* 和 *that* 指一个，*these* 和 *those* 指多个。看释义里的两点：近还是远，一个还是多个。",
      ),
      spell: t(
        "*These* and *those* both end in a silent e, and *there* and *where* both end in -ere, not -air.",
        "*these* 和 *those* 都以不发音的 e 结尾，*there* 和 *where* 都以 -ere 结尾，不是 -air。",
      ),
    },
    notes: `
      this|one pen here in my hand;one book in my hand;one friend next to me|this is one thing near you; that is one thing far away|this 指近处的一个；that 指远处的一个|that=that is for one thing over there, but this thing is near you=that 指远处的一个，可这个东西就在你身边;these=these is for more than one thing, but here there is only one=these 指多个，可这里只有一个|this|th at the start and s at the end|开头是 th，结尾是 s
      that|one bird up in the sky;one house over there;one thing over there|that is one thing far away; this is one thing near you|that 指远处的一个；this 指近处的一个|this=this is for one thing near you, but this thing is far away=this 指近处的一个，可这个东西在远处;those=those is for more than one thing, but here there is only one=those 指多个，可这里只有一个|that|th at the start and a short a|开头是 th，a 发短音
      these|pens here on my desk;pictures here in my book;shoes here by the door|these are things near you; those are things far away|these 指近处的多个；those 指远处的多个|those=those is for things over there, but these things are near you=those 指远处的多个，可这些东西就在身边;this=this is for one thing, but here there are more than one=this 只指一个，可这里不止一个|these|ee said as long e, spelled e and a silent e at the end|长 e 音拼作 e，词尾 e 不发音
      those|friends over there;birds far away in a tree;bags over there|those are things far away; these are things near you|those 指远处的多个；these 指近处的多个|these=these is for things near you, but these things are far away=these 指近处的多个，可这些东西在远处;that=that is for one thing, but here there are more than one=that 只指一个，可这里不止一个|those|o says its name, with a silent e at the end|o 读字母本音，词尾 e 不发音
      here|coming to sit next to me;a pen in my hand;a book I give from my hand|here is the place near me; there is a place away from me|here 是我身边；there 是离我远的地方|there=there is a place away from me, not right next to me or in my hand=there 是离我远的地方，不是我身边或我手里;where=where asks about a place, it does not tell one=where 是问地点的，不是说出地点|here|ere at the end, said like *ear*|结尾是 ere，读音像 *ear*
      there|a bag by the door, not here;a cat on the bed;a big bird far away|there is a place away from me; here is near me|there 是远处；here 是我身边|here/here's=here is the place near me, not a place far away=here 是我身边，不是远处;where/where's=where asks about a place, it does not tell one or say that something is there=where 是问地点的，不是说出地点，也不表示有什么东西|there|t and h, then ere, the same ending as *where*|t 和 h 后面是 ere，结尾和 *where* 一样
      in|being inside the classroom;milk inside a cup;lying in bed asleep|in means inside; on means on top|in 是在里面；on 是在上面|on=on means touching the top of something, not inside it=on 是在东西的表面上，不是在里面;under=under means below something, not inside it=under 是在东西下面，不是在里面|in|just i and n|只有 i 和 n
      on|a picture touching the wall;a hat on top of a head;a name on paper|on means touching the top or side; in means inside|on 是在表面上；in 是在里面|in=in means inside something, not touching its top or side=in 是在里面，不是在表面上;under=under means below something, not on its top=under 是在下面，不是在上面|on|just o and n, not *no*|只有 o 和 n，别写成 *no*
      under|a dog in the dark below a table;feet on the floor below a desk;keeping dry below an umbrella|under means below; on means on top|under 是在下面；on 是在上面|on=on means touching the top of something, not below it=on 是在东西上面，不是在下面;in=in means inside something, not below it=in 是在里面，不是在下面|un · der|the ending -er|结尾是 -er
      where|asking for a pen's place;asking for Dad's place;asking for your place|where asks about a place; what asks about a thing|where 问地点；what 问东西|what/what's=what asks about a thing, but the answer here tells a place=what 问的是东西，可回答说的是地点;who/who's=who asks about a person, but the answer here tells a place=who 问的是人，可回答说的是地点|where|wh at the start, with a silent h, and ere at the end|开头是 wh，h 不发音，结尾是 ere
    `,
  },
});

const classroomActions = vocabularyTopic({
  id: "pre-a1-words-classroom-actions",
  title: t("Classroom Actions", "课堂动作"),
  summary: t(
    "The verbs of classroom commands: open, close, sit, stand, look, listen, read, write, draw and do.",
    "课堂指令中的动词：open、close、sit、stand、look、listen、read、write、draw 和 do。",
  ),
  intro: t(
    '"**Stand** up, please. **Open** your books and **look** at page six!" These words help you follow what the teacher asks you to do in class.',
    "“请 **stand**（站）起来。**open**（打开）书，**look**（看）第六页！”这些词帮你听懂老师在课上让你做什么。",
  ),
  prerequisites: ["pre-a1-words-classroom"],
  words: [
    word(
      "open opens opened opening",
      "to move a door, a book or a box so you can go in or see inside",
      "打开",
      "{Open} your books to page five. | It's hot. Please {open} the window. | She {opens} the box and finds a cat inside.|closes sits",
      "close sit",
    ),
    word(
      "close closes closed closing",
      "to shut a door, a book or a box",
      "关上；合上",
      "It's cold. Please {close} the door. | {Close} your eyes and go to sleep. | The shop {closes} at six. Then it is not open.|opens stands",
      "open stand",
    ),
    word(
      "sit sits sat sitting",
      "to rest on a chair",
      "坐",
      "{Sit} down on your chair, please. | I {sit} on a chair next to Lily in class. | The tired cat is {sitting} down on the chair.|standing opening",
      "stand open",
    ),
    word(
      "stand stands stood standing",
      "to be on your feet",
      "站",
      "{Stand} up, please, and say your name. | We {stand} in a line at the door, ready to go out. | Tom is {standing} on one leg.|sitting closing",
      "sit close",
    ),
    word(
      "look looks looked looking",
      "to turn your eyes to see something",
      "看",
      "{Look} at the picture on page six. | {Look} up! A big bird in the sky! | She {looks} at the board.|listens sees",
      "listen see",
    ),
    word(
      "listen listens listened listening",
      "to try to hear something",
      "听",
      "{Listen} to the song. | Please {listen} to your teacher. | I {listen} to music in my room.",
      "look open",
    ),
    word(
      "read reads reading",
      "to look at words and understand them",
      "读；阅读",
      "I {read} a book before bed. | Please {read} this word out loud. | She is {reading} a story that her grandpa wrote.|writing listening",
      "write listen",
    ),
    word(
      "write writes wrote written writing",
      "to make letters and words with a pen or pencil",
      "写",
      "{Write} your name at the top. | I {write} words with my pen. | Tom {wrote} a letter and sent it to his grandma.|drew read",
      "draw read",
    ),
    word(
      "draw draws drew drawn drawing",
      "to make a picture with a pencil or pen",
      "画",
      "{Draw} a cat in your book. | I like to {draw} pictures of animals. | She {drew} a big red sun.|wrote read",
      "write read",
    ),
    word(
      "do does did done doing don't doesn't didn't",
      "to act, or to make something happen",
      "做；干",
      "What are you {doing}? I'm reading.|making being | I {do} my homework after school.|make am | {Don't} run in the classroom!|Doesn't Isn't | She {doesn't} like milk.|don't isn't",
      "make be",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Many orders start with the verb, so check what comes after it: *the door* goes with *open* or *close*, *to the song* with *listen*, *at the picture* with *look*.",
        "很多指令以动词开头，所以要看它后面的词：*the door* 搭配 *open* 或 *close*，*to the song* 搭配 *listen*，*at the picture* 搭配 *look*。",
      ),
      meaning: t(
        "*Look* and *listen* are a pair: *look* uses your eyes, *listen* your ears. *Read* is for words someone wrote, *draw* is for making pictures.",
        "*look* 和 *listen* 是一对：*look* 用眼睛，*listen* 用耳朵。*read* 是读别人写的字，*draw* 是画画。",
      ),
      spell: t(
        "Several of these verbs change in the past: *sat*, *stood*, *wrote*, *drew*, *did*. *Listen* has a silent t and *write* a silent w.",
        "这些动词有几个过去式不规则：*sat*、*stood*、*wrote*、*drew*、*did*。*listen* 里的 t 不发音，*write* 里的 w 不发音。",
      ),
    },
    notes: `
      open|books turned to page five;a window on a hot day;a box with a cat inside|you open something to see or go inside; you close it to shut it|open 是打开；close 是关上|close/closes=close means to shut something, the opposite of open=close 是关上，和 open 意思相反;sit/sits=sit means to rest on a chair, not to move a door, a book or a box=sit 是坐在椅子上，不是打开门、书或盒子|o · pen|o says its name, and the ending -en|o 读字母本音，结尾是 -en
      close|a door on a cold day;eyes before sleep;a shop at six that is not open|close means to shut; open means the opposite|close 是关上；open 正好相反|open/opens=open means to move something so you can see or go inside, the opposite of close=open 是打开，和 close 意思相反;stand/stands=stand means to be on your feet, not to shut a door, a book or a box=stand 是站着，不是关上门、书或盒子|close|s said like z, and a silent e at the end|s 读作 z，词尾 e 不发音
      sit|sitting down on a chair;a chair next to Lily;a tired cat on a chair|you sit on a chair; you stand on your feet|sit 是坐在椅子上；stand 是站着|stand/standing=stand means to be up on your feet, not to rest on a chair=stand 是站着，不是坐在椅子上;open/opening=open means to move a door or a book so you can see inside, not to rest on a chair=open 是打开门或书，不是坐着|sit|the past *sat*, and the double t in *sitting*|过去式是 *sat*，*sitting* 双写 t
      stand|getting up to say your name;a line at the door, ready to go out;Tom on one leg|you stand on your feet; you sit on a chair|stand 是站着；sit 是坐在椅子上|sit/sitting=sit means to rest on a chair, not to be up on your feet=sit 是坐在椅子上，不是站着;close/closing=close means to shut a door or a book, not to be on your feet=close 是关上门或书，不是站着|stand|nd at the end, and the past *stood*|结尾是 nd，过去式是 *stood*
      look|a picture on page six;a big bird up in the sky;the board|you look with your eyes; you listen with your ears|look 用眼睛看；listen 用耳朵听|listen/listens=listen means to try to hear something with your ears, not to turn your eyes to it=listen 是用耳朵听，不是用眼睛看;see/sees=see means something comes into your eyes, and it does not go with *at* or *up* the way look does=see 是看见，不能像 look 那样搭配 *at* 或 *up*|look|the double o, said like the oo in *book*|两个 o，读音和 *book* 里的 oo 一样
      listen|a song;your teacher;music in my room|you listen with your ears; you look with your eyes|listen 用耳朵听；look 用眼睛看|look=look means to turn your eyes to something, not to try to hear it=look 是用眼睛看，不是用耳朵听;open=open means to move a door or a book so you can see inside, not to hear something=open 是打开门或书，不是听|lis · ten|the silent t in the middle|中间的 t 不发音
      read|a book before bed;a word said out loud;a story her grandpa wrote|you read words that are already there; you write new ones|read 是读已有的字；write 是写新的字|write/writing=write means to make new letters and words, not to look at words and understand them=write 是写出新的字，不是读懂已有的字;listen/listening=listen means to try to hear something, not to look at words=listen 是用耳朵听，不是看字|read|ea for the long e sound now; in the past it is spelled the same but said *red*|ea 发长 e 音；过去式拼法不变，但读作 *red*
      write|your name at the top;words made with a pen;a letter sent to grandma|you write letters and words; you draw pictures|write 写字；draw 画画|draw/drew=draw means to make a picture, not letters and words=draw 是画画，不是写字;read=read means to look at words and understand them, not to make them=read 是读懂字，不是写字|write|the silent w at the start, and the past *wrote*|开头的 w 不发音，过去式是 *wrote*
      draw|a cat in your book;pictures of animals;a big red sun|you draw pictures; you write words|draw 画画；write 写字|write/wrote=write means to make letters and words, not a picture=write 是写字，不是画画;read=read means to look at words and understand them, not to make a picture=read 是读懂字，不是画画|draw|aw at the end, and the past *drew*|结尾是 aw，过去式是 *drew*
      do|what you are busy with now;homework after school;an order not to run;milk she does not like|you do homework and actions; you make things like a cake|do 用于做作业和做事；make 用于做出东西，比如蛋糕|make/making=make means to build or cook something new, and we say *do my homework*, not *make my homework*=make 是做出新东西，作业要说 *do my homework*，不说 *make my homework*;be/am/being/is/isn't=be tells what or how someone is, and it cannot go before a doing word like *run* or *like*=be 说的是是什么或怎么样，不能放在 *run*、*like* 这类动作词前面;doesn't=doesn't goes with he, she or it, but an order is said to you=doesn't 跟 he、she、it 连用，可命令是对 you 说的;don't=don't goes with I, you, we and they, but here the person is she=don't 跟 I、you、we、they 连用，可这里的人是 she|do|*does* for he, she and it, and the apostrophe in *don't* and *doesn't*|he、she、it 后面用 *does*；*don't* 和 *doesn't* 要加撇号
    `,
  },
});

// This, that, these and those.

const pointedNouns: readonly (readonly [one: string, many: string])[] = [
  ["pen", "pens"],
  ["book", "books"],
  ["bag", "bags"],
  ["cat", "cats"],
  ["desk", "desks"],
  ["chair", "chairs"],
  ["pencil", "pencils"],
  ["ruler", "rulers"],
  ["box", "boxes"],
  ["dog", "dogs"],
  ["eraser", "erasers"],
  ["apple", "apples"],
  ["ball", "balls"],
  ["kite", "kites"],
];

type Pointer = "This" | "That" | "These" | "Those";

const pointerFrames: readonly (readonly [pointer: Pointer, make: (one: string, many: string) => string])[] = [
  ["This", (one) => `___ is my ${one}, here in my hand.`],
  ["That", (one) => `___ is my ${one}, over there.`],
  ["These", (_, many) => `___ are my ${many}, here on my desk.`],
  ["Those", (_, many) => `___ are my ${many}, over there.`],
  ["This", (one) => `___ is your ${one}, here.`],
  ["That", (one) => `___ is your ${one}, over there by the door.`],
  ["These", (_, many) => `___ are your ${many}, here in my bag.`],
  ["Those", (_, many) => `___ are your ${many}, over there on the chair.`],
];

const wrongPointers: Record<Pointer, readonly [Pointer, Pointer]> = {
  This: ["That", "These"],
  That: ["This", "Those"],
  These: ["This", "Those"],
  Those: ["That", "These"],
};

const pointerChoiceBank: readonly ChoiceItem[] = everyPair(pointedNouns, pointerFrames).map(
  ([[one, many], [pointer, make]]): ChoiceItem => [make(one, many), pointer, [...wrongPointers[pointer]]],
);

/** whose are the words for whose that the sentences to change carry along. */
const whose: readonly string[] = ["my", "your", "his", "her"];

const pointerTypedBank: readonly TypedItem[] = everyPair(
  pointedNouns,
  (["This", "That"] as const).flatMap((pointer) => whose.map((w) => [pointer, w] as const)),
).map(([[one, many], [pointer, w]]): TypedItem => {
  const plural = pointer === "This" ? "These" : "Those";
  return {
    shown: `${pointer} is ${w} ${one}.`,
    accepted: [`${plural} are ${w} ${many}.`],
    wrong: [`${plural} is ${w} ${many}.`, `${plural} are ${w} ${one}.`, `${pointer} are ${w} ${many}.`],
  };
});

const pointerTypedBank2: readonly TypedItem[] = everyPair(
  pointedNouns,
  (["These", "Those"] as const).flatMap((pointer) => whose.map((w) => [pointer, w] as const)),
).map(([[one, many], [pointer, w]]): TypedItem => {
  const single = pointer === "These" ? "This" : "That";
  return {
    shown: `${pointer} are ${w} ${many}.`,
    accepted: [`${single} is ${w} ${one}.`],
    wrong: [`${single} are ${w} ${one}.`, `${single} is ${w} ${many}.`],
  };
});

/** pointerSense says where a pointer word points and how many, in every locale. */
const pointerSense = (near: boolean, many: boolean): Text =>
  t(
    `${near ? "near (here)" : "far (over there)"} and ${many ? "more than one" : "one"}`,
    `${near ? "近处（here）" : "远处（over there）"}、${many ? "多个" : "一个"}`,
  );

/** whyNotPointer says which half of the table a wrong pointer word misreads. */
const whyNotPointer = (wrong: string, _right: string, shown: string): Text => {
  const near = !shown.includes("over there");
  const wrongNear = wrong === "This" || wrong === "These";
  const wrongMany = wrong === "These" || wrong === "Those";
  return wrongNear !== near
    ? t(
        `*${wrong}* points to something ${wrongNear ? "near" : "far"}, but the sentence says *${near ? "here" : "over there"}*.`,
        `*${wrong}* 指${wrongNear ? "近处" : "远处"}的东西，可句子里说的是 *${near ? "here" : "over there"}*。`,
      )
    : t(
        `*${wrong}* is for ${wrongMany ? "more than one" : "one"}, but the verb *${wrongMany ? "is" : "are"}* says ${wrongMany ? "one" : "more than one"}.`,
        `*${wrong}* 用于${wrongMany ? "多个" : "一个"}，可动词 *${wrongMany ? "is" : "are"}* 表示${wrongMany ? "一个" : "多个"}。`,
      );
};

/** changedWords lists the three words that change between a sentence about one and one about more than one. */
const changedWords = (from: string, to: string) => {
  const a = from.replace(/\.$/u, "").split(" ");
  const b = to.replace(/\.$/u, "").split(" ");
  return `*${a[0]}* → *${b[0]}*, *${a[1]}* → *${b[1]}*, *${a.at(-1)}* → *${b.at(-1)}*`;
};

const thisThatTheseThose: TopicDef = {
  id: "this-that-these-those",
  title: t("This, That, These and Those", "this、that、these 和 those"),
  summary: t(
    "This and these are near, that and those are far; these and those are for more than one.",
    "this 和 these 指近处，that 和 those 指远处；these 和 those 用于多个。",
  ),
  intro: t(
    "Point to one ruler in your hand and say *This is my ruler*; point to two rulers across the room and say *Those are my rulers*. English uses four pointing words to show both distance (near vs. far) and number (one vs. more than one)—and the verb and noun must match. In this topic, you choose the right pointer and switch sentences between singular and plural.",
    "指着手里的尺子说 *This is my ruler*，指着远处桌子上的两把尺子说 *Those are my rulers*。英语用四个指示词同时表达远近（近/远）和数量（一个/多个），后面的动词和名词也必须跟着一致。本主题带你选对指示词，并在单复数句子之间自由转换。",
  ),
  prerequisites: ["pre-a1-words-this-and-that", "plural-nouns-with-s"],
  encompasses: [
    { topic: "pre-a1-words-this-and-that", weight: 0.4 },
    { topic: "plural-nouns-with-s", weight: 0.3 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Near or far, one or more", "近还是远，一个还是多个"),
      t(
        "| | one | more than one |\n|---|---|---|\n| near (here) | *this* | *these* |\n| far (over there) | *that* | *those* |\n\n*This is my pen. These are my pens. That is my bag. Those are my bags.*\n\n> **Watch out.** Check *both* clues in the sentence: *here* vs. *over there* tells you near or far, while *is* vs. *are* tells you one or more than one.",
        "| | 一个 | 多个 |\n|---|---|---|\n| 近处（here） | *this* | *these* |\n| 远处（over there） | *that* | *those* |\n\n中文“这些”“那些”后面的名词不变，英语却要全部变成复数：*these pens*，后面的动词也用 *are*。\n\n*This is my pen. These are my pens. That is my bag. Those are my bags.*\n\n> **注意。** 同时核对句中的*两个*线索：*here* / *over there* 决定远近，*is* / *are* 决定一个还是多个。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        pointerChoiceBank,
        (right, shown) => {
          const sense = pointerSense(!shown.includes("over there"), shown.includes(" are "));
          return t(
            `The thing is ${sense.en}, so the word is *${right}*: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Match both clues—distance (*here* -> *this/these*, *over there* -> *that/those*) and verb (*is* -> singular, *are* -> plural)—to confirm *${right}*.`,
            `东西在${sense["zh-CN"]}，所以用 *${right}*：${shown.replace("___", `*${right}*`)}\n\n**检验。** 同时核对远近线索（*here* 配 *this/these*，*over there* 配 *that/those*）与动词（*is* 配单数，*are* 配复数），确认是 *${right}*。`,
          );
        },
        whyNotPointer,
      ),
    ),
    point(
      "change",
      t("Changing one to more than one", "把一个变成多个"),
      t(
        "When *this* becomes *these* and *that* becomes *those*, three words change: *is* becomes *are*, and the noun takes *-s*.\n\n*This is my pen.* → *These are my pens.*\n\n> **Watch out.** Do not stop after changing the first word—always update all *three* spots together: pointer (*this/these* or *that/those*), verb (*is/are*), and noun (*pen/pens*, *box/boxes*).",
        "*this* 变成 *these*、*that* 变成 *those* 时，有三处要变：*is* 变成 *are*，名词加 *-s*。\n\n*This is my pen.* → *These are my pens.*\n\n> **注意。** 不要只改句首第一个词就停手——务必把*三处*一起改过来：指示词（*this/these* 或 *that/those*）、动词（*is/are*）和名词（*pen/pens*、*box/boxes*）。",
      ),
      typedGenerator(
        "sentence",
        t("Write the sentence about more than one, or about one.", "把句子改成说多个的，或改成说一个的。"),
        [...pointerTypedBank, ...pointerTypedBank2],
        (right, shown) =>
          t(
            `Between one and more than one, three words change together, ${changedWords(shown, right)}: ${shown} → ${right}\n\n**Check.** Count the three changes in your sentence—pointer, verb (*is/are*), and noun ending—and confirm the distance (near vs. far) stayed the same.`,
            `一个和多个之间转换时，三处要一起变，${changedWords(shown, right)}：${shown} → ${right}\n\n**检验。** 逐一核对句子里的三处变化——指示词、动词（*is/are*）和名词单复数——同时确认远近关系没有改错。`,
          ),
        theseNot,
      ),
    ),
  ],
};

// In, on and under.

const things: readonly string[] = ["pen", "ball", "cat", "book", "dog", "ruler", "pencil"];
const placesFor: readonly string[] = ["box", "desk", "bed", "chair", "bag", "table"];
type Place = "in" | "on" | "under";
const cue: Record<Place, string> = { in: "inside", on: "on top", under: "below" };

const cueZh: Record<Place, string> = { in: "在里面", on: "在上面", under: "在下面" };

/** placed puts every thing on and under every place, and in only the places that hold things. */
const placed = interleave<readonly [readonly [string, string], Place]>([
  everyPair(things, placesFor).map((pair) => [pair, "on"] as const),
  everyPair(things, placesFor).map((pair) => [pair, "under"] as const),
  everyPair(things, ["box", "bag", "desk"]).map((pair) => [pair, "in"] as const),
]);

const placeChoiceBank: readonly ChoiceItem[] = placed.map(([[thing, place], prep]): ChoiceItem => {
  return [`The ${thing} is ___ the ${place}. (${cue[prep]})`, prep, (["in", "on", "under"] as const).filter((p) => p !== prep)];
});

const placeTypedBank: readonly TypedItem[] = placed.map(([[thing, place], prep]): TypedItem => {
  return {
    shown: `the ${thing} / ${prep} / the ${place} (${cue[prep]})`,
    accepted: [`The ${thing} is ${prep} the ${place}.`],
    wrong: [`The ${thing} is the ${place} ${prep}.`, `The ${thing} ${prep} the ${place}.`, `The ${thing} the ${place} is ${prep}.`],
  };
});

const inOnAndUnder: TopicDef = {
  id: "in-on-and-under",
  title: t("In, On and Under", "in、on 和 under"),
  summary: t("The pen is in the bag: the place word comes before the thing.", "The pen is in the bag：表示位置的词放在东西前面。"),
  intro: t(
    "Say where a ball is: *The ball is in the box* (inside), *on the table* (on top), or *under the bed* (below). Unlike Chinese, English puts the place word *before* the noun and always keeps *is* in the middle. In this topic, you pick the right preposition and build full location sentences in English word order.",
    "说明一个球在哪里：*The ball is in the box*（在里面）、*on the table*（在上面）或 *under the bed*（在下面）。和中文相反，英语把方位词放在名词*前面*，且中间必须保留 *is*。本主题带你选对介词，并按英语语序写出完整的方位句。",
  ),
  prerequisites: ["pre-a1-words-this-and-that", "pre-a1-words-classroom"],
  encompasses: [{ topic: "pre-a1-words-this-and-that", weight: 0.3 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("In, on or under?", "用 in、on 还是 under？"),
      t(
        "*in* = inside: *The pen is in the bag.*\n*on* = on top: *The book is on the desk.*\n*under* = below: *The cat is under the chair.*\n\n> **Watch out.** Picture the spatial cue carefully: *in* means enclosed inside, *on* means resting on top of a surface, and *under* means directly below.",
        "*in* = 在里面：*The pen is in the bag.*\n*on* = 在上面：*The book is on the desk.*\n*under* = 在下面：*The cat is under the chair.*\n\n> **注意。** 在脑中画出位置关系：*in* 表示在内部，*on* 表示在表面上，*under* 表示在正下方。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        placeChoiceBank,
        (right, shown) =>
          t(
            `The note says *${cue[right as Place]}*, and *${right}* means ${cue[right as Place]}: ${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**Check.** Match the spatial meaning back to the bracketed cue (*inside* -> *in*, *on top* -> *on*, *below* -> *under*) to verify *${right}*.`,
            `提示是 *${cue[right as Place]}*（${cueZh[right as Place]}），所以用 *${right}*：${shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`)}\n\n**检验。** 把空间意思对照括号提示（*inside* -> *in*，*on top* -> *on*，*below* -> *under*），确认是 *${right}*。`,
          ),
        (wrong, right) =>
          t(
            `*${wrong}* means ${cue[wrong as Place]}, but the note says *${cue[right as Place]}*.`,
            `*${wrong}* 的意思是${cueZh[wrong as Place]}，可提示说的是 *${cue[right as Place]}*（${cueZh[right as Place]}）。`,
          ),
      ),
    ),
    point(
      "order",
      t("Putting the place word first", "把表示位置的词放在前面"),
      t(
        "English says the place word first and then the thing: *in the bag*, *on the desk*, *under the chair*. Do not forget *is*.\n\n*The pen is in the bag.*\n\n> **Watch out.** Check two common slips: never put *in/on/under* after the place (*the bag in*), and never drop *is* between the subject and the place word.",
        "中文说“在包里”“在桌子上”，表示位置的“里”“上”放在后面；英语正好相反，*in*、*on*、*under* 放在前面：*in the bag*、*on the desk*、*under the chair*。别忘了 *is*。\n\n*The pen is in the bag.*\n\n> **注意。** 避开两个常见失误：不要把 *in/on/under* 放到地点后面（如 *the bag in*），也不要在主语和方位词之间漏掉 *is*。",
      ),
      typedGenerator(
        "sentence",
        t("Write a sentence with these words.", "用这些词写一个句子。"),
        placeTypedBank,
        (right) => {
          const place = right.split(" is ")[1]?.replace(/\.$/u, "") ?? "";
          return t(
            `English says the thing, then *is*, then the place word before the place, not after it: *${place}*. ${right}\n\n**Check.** Verify the order *The [thing] + is + [in/on/under] + the [place].*—with *is* present and the preposition right before the place.`,
            `英语先说东西，再说 *is*，位置词放在地点前面而不是后面：*${place}*。${right}\n\n**检验。** 核对语序 *The [物品] + is + [in/on/under] + the [地点].*——*is* 不能漏，方位词紧贴在地点前面。`,
          );
        },
        placeOrderNot,
      ),
    ),
  ],
};

// Commands.

/** commandRests are, for each verb of a classroom command, the rests it takes. */
const commandRests: readonly (readonly [verb: string, rests: readonly string[]])[] = [
  ["open", ["your book", "the door", "the window", "your bag", "the box", "your eyes", "your books"]],
  ["close", ["your book", "the door", "the window", "your bag", "the box", "your eyes", "your books"]],
  ["look", ["at the board", "at me", "at the picture", "at page six", "at the cat", "at your book", "at the window"]],
  ["listen", ["to your teacher", "to the song", "to me", "to the bird", "to the story", "to your friend"]],
  ["read", ["page five", "the story", "this word", "the book", "your name", "the numbers"]],
  ["write", ["your name", "the word", "the number ten", "a big A", "a small b", "the word cat"]],
  ["draw", ["a cat", "a red flower", "your family", "a line", "a big house", "a dog", "a green tree"]],
  ["sit", ["down", "next to Tom", "on your chair", "next to me", "here"]],
  ["stand", ["up", "in a line", "next to your desk", "here", "next to Anna"]],
];

/** commands are classroom commands, each a verb and the rest, with and without please. */
const commands: readonly (readonly [verb: string, rest: string])[] = interleave([
  commandRests.flatMap(([verb, rests]) => rests.map((rest) => [verb, rest] as const)),
  commandRests.flatMap(([verb, rests]) => rests.map((rest) => [verb, `${rest}, please`] as const)),
]);

const third = (verb: string) => (verb === "do" ? "does" : `${verb}s`);

const commandChoiceBank: readonly ChoiceItem[] = commands.map(
  ([verb, rest]): ChoiceItem => ["", `${sentenceCase(verb)} ${rest}.`, [`You ${verb} ${rest}.`, `${sentenceCase(third(verb))} ${rest}.`]],
);

const dontRests: readonly (readonly [verb: string, rest: string])[] = [
  ["run", "in the classroom"],
  ["stand", "up"],
  ["open", "the door"],
  ["sit", "on the desk"],
  ["look", "at your friend's book"],
  ["write", "on the desk"],
  ["draw", "on the wall"],
  ["close", "your book"],
  ["eat", "in class"],
  ["read", "in the dark"],
];

const dontTypedBank: readonly TypedItem[] = interleave([
  dontRests.map(
    ([verb, rest]): TypedItem => ({
      shown: `not / ${verb} / ${rest}`,
      accepted: [`[Don't|Do not] ${verb} ${rest}.`],
      canonical: `Don't ${verb} ${rest}.`,
      wrong: [`No ${verb} ${rest}.`, `Not ${verb} ${rest}.`, `You don't ${verb} ${rest}.`],
    }),
  ),
  commands.map(
    ([verb, rest]): TypedItem => ({
      shown: `${verb} / ${rest}`,
      accepted: [`${sentenceCase(verb)} ${rest}.`],
      wrong: [`You ${verb} ${rest}.`, `${sentenceCase(third(verb))} ${rest}.`],
    }),
  ),
]);

const imperatives: TopicDef = {
  id: "imperatives",
  title: t("Commands", "祈使句"),
  summary: t("Open your book. Don't stand up. A command starts with the verb.", "Open your book. Don't stand up. 祈使句以动词开头。"),
  intro: t(
    "When a teacher says *Close the window, please.* or *Don't write on the desk.*, there is no *you* at the front and no *-s* on the verb. English commands begin straight with the base verb—or with *Don't* + base verb to tell someone not to act. In this topic, you recognize and write both positive and negative classroom commands.",
    "老师说 *Close the window, please.* 或 *Don't write on the desk.* 时，句首没有 *you*，动词也不加 *-s*。英语祈使句直接以动词原形开头，否定指令则用 *Don't* 加动词原形。本主题带你辨认并写出肯定与否定两类课堂祈使句。",
  ),
  prerequisites: ["pre-a1-words-classroom-actions"],
  encompasses: [{ topic: "pre-a1-words-classroom-actions", weight: 0.4 }],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Spotting a command", "认出祈使句"),
      t(
        "A command tells someone what to do. It starts with the verb, with no *you* and no *-s*: *Open your book. Sit down, please.*\n\n> **Watch out.** A sentence starting with *You* (*You open your book.*) is a statement, not a command, and a command verb never takes *-s* (*Opens*).",
        "祈使句告诉别人做什么。它以动词原形开头，不用 *you*，动词也不加 *-s*：*Open your book. Sit down, please.*\n\n> **注意。** 以 *You* 开头的句子（如 *You open your book.*）是陈述句，不是祈使句；祈使句的动词也绝不加 *-s*（如 *Opens*）。",
      ),
      choiceGenerator(
        t("Which one is a classroom command?", "哪一句是课堂指令？"),
        commandChoiceBank,
        (right) =>
          t(
            `${right} A command starts with the plain verb, *${right.split(" ")[0]}*, with no *you* before it and no *-s* on it.\n\n**Check.** Look at the very first word—it is a plain base verb (not *You* and not a verb ending in *-s*), directing someone to act.`,
            `${right} 祈使句以动词原形 *${right.split(" ")[0]}* 开头，前面没有 *you*，动词也不加 *-s*。\n\n**检验。** 看句首第一个词——它是不带 *-s* 的动词原形，前面没有 *You*，直接发出指令。`,
          ),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This starts with *you*, so it says what someone does; a command leaves out *you* and starts with the verb.",
                "这句以 *you* 开头，是在陈述某人做什么；祈使句不用 *you*，直接以动词开头。",
              )
            : t("This verb has *-s*, but a command always uses the plain verb.", "这里的动词加了 *-s*，可祈使句总用动词原形。"),
      ),
    ),
    point(
      "write",
      t("Writing commands, and don't", "写祈使句和 don't"),
      t(
        "To tell someone not to do something, put *Don't* before the verb: *Don't run. Don't stand up.* Do not use *No* or *Not*.\n\n> **Watch out.** When the prompt starts with `not /`, always begin with *Don't* (or *Do not*) followed by the plain verb—never write *No run.* or *Not run.*",
        "叫别人不要做某事，在动词前加 *Don't*：*Don't run. Don't stand up.* 不能像中文“不要”那样直接用 *No* 或 *Not*。\n\n> **注意。** 提示以 `not /` 开头时，必须用 *Don't*（或 *Do not*）加动词原形——不要写成 *No run.* 或 *Not run.*",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a command with these words.", "用这些词写一句祈使句。"),
        dontTypedBank,
        (right) =>
          right.startsWith("Don't")
            ? t(
                `To tell someone not to do something, put *Don't* before the plain verb, not *No* or *Not*: ${right}\n\n**Check.** Confirm the sentence starts with *Don't* (or *Do not*), keeps the verb plain with no *-s*, and ends with a period.`,
                `叫别人不要做某事，在动词原形前加 *Don't*，不用 *No* 或 *Not*：${right}\n\n**检验。** 确认句子以 *Don't*（或 *Do not*）开头，后面的动词保持原形不加 *-s*，并以句号结尾。`,
              )
            : t(
                `A command starts with the plain verb, with no *you* before it and no *-s* on it: ${right}\n\n**Check.** Confirm the sentence starts straight with the capitalized base verb (no *You*, no *-s*) and ends with a period.`,
                `祈使句以动词原形开头，前面没有 *you*，动词也不加 *-s*：${right}\n\n**检验。** 确认句子直接以大写的动词原形开头（无 *You*、无 *-s*），并以句号结尾。`,
              ),
        imperativeNot,
      ),
    ),
  ],
};

// Words in order.

/** orderedSentences are short sentences of this level, to be put in order. */
const orderedSentences: readonly string[] = [
  "This is my pen.",
  "I am ten years old.",
  "My sister has a cat.",
  "The book is on the desk.",
  "We are in the classroom.",
  "Tom has two brothers.",
  "Her bag is red.",
  "They are my friends.",
  "The cat is under the bed.",
  "I have a big dog.",
  "Our teacher is very kind.",
  "These are my books.",
  "My mom is at home.",
  "The pens are in the bag.",
  "His name is Ben.",
  "Anna is my best friend.",
  "I have three pencils.",
  "That is a green chair.",
  "My dad is a teacher.",
  "The dog is in the garden.",
  "We have a white cat.",
  "She is not sad.",
  "My grandma has gray hair.",
  "Those are my shoes.",
  "The ruler is on the chair.",
  "I am in the classroom.",
  "Lily has a pink bag.",
  "It is a red apple.",
  "Their house is big.",
  "My friends are at school.",
  "The baby is very small.",
  "He has a blue pen.",
  "You are my friend.",
  "The eraser is in my bag.",
  "Sam is eight years old.",
  "My family is very big.",
];

const keepsCapital = (w: string) =>
  w === "I" ||
  (/^[A-Z][a-z]+$/u.test(w) &&
    !["This", "My", "The", "We", "Her", "They", "Our", "These", "That", "She", "Those", "It", "Their", "He", "You"].includes(w));

const wordsOf = (s: string) => s.slice(0, -1).split(" ");

/** scramble lists the words of a sentence in another order, every second word first. */
const scramble = (s: string) => {
  const words = wordsOf(s).map((w, i) => (i === 0 && !keepsCapital(w) ? w.toLowerCase() : w));
  const odd = words.filter((_, i) => i % 2 === 1);
  const even = words.filter((_, i) => i % 2 === 0);
  return [...odd, ...even].join(" / ");
};

const chineseOrder = (s: string) => {
  // The place or thing before the verb, as a word-for-word Chinese order would put it.
  const words = wordsOf(s);
  return `${[words[0], ...words.slice(2), words[1]].join(" ")}.`;
};

const swapFirst = (s: string) => {
  const words = wordsOf(s);
  const second = words[1] ?? "";
  const first = words[0] ?? "";
  const firstLower = keepsCapital(first) ? first : first.toLowerCase();
  return `${sentenceCase(second)} ${firstLower} ${words.slice(2).join(" ")}.`;
};

const orderChoiceBank: readonly ChoiceItem[] = orderedSentences.map((s): ChoiceItem => [scramble(s), s, [chineseOrder(s), swapFirst(s)]]);

const orderTypedBank: readonly TypedItem[] = orderedSentences.map(
  (s): TypedItem => ({
    shown: scramble(s),
    accepted: [s],
    wrong: [chineseOrder(s), swapFirst(s)],
  }),
);

const verbs = new Set(["is", "am", "are", "has", "have"]);

/** partsOf splits a sentence into who or what, the verb and the rest. */
const partsOf = (s: string) => {
  const words = wordsOf(s);
  const at = words.findIndex((w) => verbs.has(w));
  return { who: words.slice(0, at).join(" "), verb: words[at] ?? "", rest: words.slice(at + 1).join(" ") };
};

/** orderWhy shows the three parts of a sentence in their English order. */
const orderWhy = (right: string): Text => {
  const { who, verb, rest } = partsOf(right);
  return t(
    `An English sentence starts with who or what (*${who}*), then the verb (*${verb}*), then the rest (*${rest}*): ${right}\n\n**Check.** Read the three blocks in order—*${who}* + *${verb}* + *${rest}*—with a capital letter at the start and a period at the end.`,
    `英语句子先说谁或什么（*${who}*），再说动词（*${verb}*），最后是其余部分（*${rest}*）：${right}\n\n**检验。** 按“主语（*${who}*）+ 动词（*${verb}*）+ 其余部分（*${rest}*）”三段顺读一遍，并确认句首大写、句末有句号。`,
  );
};

/** whyNotOrder explains a wrong order by where the verb must stand. */
const whyNotOrder = (_wrong: string, _right: string, _shown: string, position: number): Text =>
  position === 0
    ? t(
        "This puts the verb at the end of the sentence; in English the verb comes right after who or what the sentence is about.",
        "这句把动词放到了句末；英语里动词要紧跟在主语（谁或什么）后面。",
      )
    : t(
        "This swaps the first two words, breaking the subject-then-verb order of an English statement.",
        "这句把前两个词颠倒了，破坏了英语陈述句“先主语、后动词”的语序。",
      );

const wordsInOrder: TopicDef = {
  id: "writing-words-in-order",
  title: t("Words in Order", "把词排成句子"),
  summary: t(
    "Put words in the order of an English sentence: who, then the verb, then the rest.",
    "按英语句子的顺序排列词：先说谁，再说动词，最后是其余部分。",
  ),
  intro: t(
    "Take the jumbled words *is / bag / red / her* and arrange them: *Her bag is red.* Every English statement follows one dependable track—who or what first, then the verb, then the rest. In this topic, you pick and write sentences in natural English word order.",
    "把打乱的词 *is / bag / red / her* 排成句子：*Her bag is red.* 英语陈述句遵循一条稳定的主线——先说谁或什么，再接动词，最后接其余部分。本主题带你选出并写出语序自然的英语句子。",
  ),
  prerequisites: ["writing-capitals-and-periods"],
  encompasses: [{ topic: "writing-capitals-and-periods", weight: 0.3 }],
  xp: 15,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("Choosing the right order", "选出正确的语序"),
      t(
        "An English sentence goes: who or what, then the verb, then the rest.\n\n*My sister* (who) *has* (verb) *a cat* (the rest).\n*The book* (what) *is* (verb) *on the desk* (the rest).\n\n> **Watch out.** Find the verb (*am*, *is*, *are*, *have*, *has*) first—it sits right after the subject, never at the very end of the sentence.",
        "英语句子的顺序是：先说谁或什么，再说动词，最后是其余部分。\n\n*My sister*（谁）*has*（动词）*a cat*（其余）。\n*The book*（什么）*is*（动词）*on the desk*（其余）。\n\n不要把动词放在最后，也不要漏掉 *is*。\n\n> **注意。** 先找出动词（*am*、*is*、*are*、*have*、*has*）——它必须紧跟在主语后面，绝不能放到句末。",
      ),
      choiceGenerator(
        t("Which sentence puts these words in the right order?", "哪个句子把这些词排对了？"),
        orderChoiceBank,
        orderWhy,
        whyNotOrder,
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Put the words in order and write the sentence: *is / Ben / name / his* → *His name is Ben.* Start with a capital letter and end with a period.\n\n> **Watch out.** Count that you used every given word exactly once, put the verb right after the subject, and add a capital letter at the start and a period at the end.",
        "把词排好顺序，写出句子：*is / Ben / name / his* → *His name is Ben.* 句首大写，句末加句号。\n\n> **注意。** 数一数给出的每个词是否都恰好用了一次，动词是否紧跟主语，并记得句首大写、句末加句号。",
      ),
      typedGenerator(
        "sentence",
        t("Put the words in order and write the sentence.", "把词排好顺序，写出句子。"),
        orderTypedBank,
        orderWhy,
        wordOrderNot,
      ),
    ),
  ],
};

/** topics are the topics of the unit My Classroom. */
export const topics: readonly TopicDef[] = [
  classroom.topic,
  thisAndThat.topic,
  classroomActions.topic,
  thisThatTheseThose,
  inOnAndUnder,
  imperatives,
  wordsInOrder,
];

/** vocabulary are the words the unit My Classroom teaches. */
export const vocabulary: readonly WordBatch[] = [classroom.batch, thisAndThat.batch, classroomActions.batch];
