// A2, everyday words that the units on themes left out: where things are and their shapes, sounds and messages,
// family, food and measures, and everyday ideas. Passages of A2 and above may use them once these batches are taught.

import { type TopicDef, t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { vocabularyTopic, word } from "../words.ts";

const positions = vocabularyTopic({
  id: "a2-words-positions-and-shapes",
  title: t("Where, Who and What Shape", "在哪里、谁和什么形状"),
  summary: t(
    "The top, the middle and inside; among, away, everywhere and nobody; a box, a shape and a fire.",
    "顶部、中间和里面；在……之中、离开、到处和没有人；盒子、形状和火。",
  ),
  intro: t(
    "My cat sleeps in a **box** at the **top** of the stairs, and when I call her, **nobody** comes! These words help you say where things are, what shape they have and who is there.",
    "我的猫睡在楼梯 **top**（顶上）的一个 **box**（盒子）里，可我叫它时，**nobody**（没有谁）过来！这些词帮你说出东西在哪里、是什么形状，以及谁在那儿。",
  ),
  prerequisites: ["a1-words-things-at-home"],
  words: [
    word(
      "top tops",
      "the highest part of something",
      "顶部；上面",
      "We climbed up to the highest part, the {top} of the hill. | Write your name at the {top} of the page, above the first line. | The {top} of the mountain is white with snow.",
      "middle inside",
    ),
    word(
      "middle",
      "the part that is the same distance from all the sides or ends",
      "中间",
      "There is a big table in the {middle} of the room. | I woke up in the {middle} of the night. | She sits in the {middle}, between Tom and Anna.",
      "top inside",
    ),
    word(
      "inside",
      "in a room, a building or a container; not outside",
      "在……里面；在室内",
      "It's raining. Let's play {inside}. | What's {inside} the box? | The children ran {inside} the house when it started to snow.",
      "away middle",
    ),
    word(
      "away",
      "to or at another place; not here",
      "离开；在别处",
      "Go {away}! Don't come into my room. I'm doing my homework. | My grandparents live two hours {away}. | She was scared of the dog, so she ran {away} from it.",
      "inside everywhere",
    ),
    word(
      "everywhere",
      "in all places",
      "到处；处处",
      "I've looked {everywhere}, in every room, but I can't find my keys. | There were people {everywhere} in the market. | Snow was {everywhere}: on the roads, the cars and the trees.",
      "inside away",
    ),
    word(
      "nobody",
      "no person; not anyone",
      "没有人",
      "I knocked on the door, but {nobody} answered. | {Nobody} in my class can swim, so we all need lessons. | The shop was empty. There was {nobody} there.",
      "everyone someone",
    ),
    word(
      "box boxes",
      "a container with straight sides, often made of paper or wood",
      "盒子；箱子",
      "Put the old toys in a {box} and close the lid. | We bought a {box} of chocolates for Grandma. | The kitchen is full of {boxes} because we're moving house.|shapes fires",
      "shape fire",
    ),
    word(
      "shape shapes",
      "the form of something, such as round or square",
      "形状",
      "A ball has a round {shape}. | Cut the paper into a heart {shape}. | Circles and squares are {shapes}.|boxes fires",
      "box fire",
    ),
    word(
      "fire fires",
      "the heat and flames that come when something burns",
      "火；火灾",
      "We sat around the warm {fire} and sang songs. | Call 119 if you see a {fire}! | The {fire} burned the old house to the ground.",
      "box shape",
    ),
    word(
      "among",
      "in the middle of a group of people or things",
      "在……中间；在……之中",
      "I found my pen {among} the books on my desk. | Sitting {among} her friends, she felt happy again. | The little house stands {among} tall trees.",
      "around along",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Inside* and *away* both answer *where*: *inside* means in a room, a building or a box, and *away* means at another place, not here. Look for words like *the box*, *the house* or a distance like *two hours*.",
        "*inside* 和 *away* 都回答“在哪里”：*inside* 是在房间、楼里或盒子里，*away* 是在别处、不在这里。找找 *the box*、*the house* 这类词，或 *two hours* 这样的距离。",
      ),
      meaning: t(
        "*Among* means in the middle of a group of people or things; *around* means on every side of something, and *along* means following a line, such as a road.",
        "*among* 是在一群人或东西当中；*around* 是在某物四周，*along* 是沿着一条线，比如沿着路。",
      ),
      spell: t(
        "*Everywhere* and *nobody* are each one word made of two: every + where and no + body, with no space.",
        "*everywhere* 和 *nobody* 都是由两个词合成的一个词：every + where，no + body，中间不空格。",
      ),
    },
    notes: `
      top|the highest part of a hill;the place on a page above the first line;the snowy highest part of a mountain|the top is the highest part; the middle is halfway between the sides|top 是最高的部分；middle 是正中间|middle=middle is the part halfway between the sides or ends, not the highest part=middle 是两边或两端正中的部分，不是最高的部分;inside=inside is the part in a room or a container, not the highest part of something=inside 是房间或容器里面，不是某物最高的部分|top|a short o, as in *hot*, and p at the end|短元音 o，和 *hot* 一样，结尾是 p
      middle|a table at the center of a room;halfway through the night;a seat between Tom and Anna|the middle is the same distance from the sides; the top is the highest part|middle 到两边距离相等；top 是最高的部分|top=top is the highest part of something, not the part between two sides or halfway through the night=top 是某物最高的部分，不是两边之间或半夜的那一段;inside=inside is the part in a room or a container, not a point between two sides=inside 是房间或容器里面，不是两边之间的位置|mid · dle|the double d, and -le at the end|双写 d，结尾是 -le
      inside|playing in the house because of rain;what a box holds;children running into the house from the snow|inside means in a room or container; away means at another place|inside 是在房间或容器里面；away 是在别的地方|away=away means to or at another place, not in a room, a house or a box=away 是到别处或在别处，不是在房间、房子或盒子里面;middle=middle is the part halfway between the sides, and it is a noun that needs *the*, as in *the middle of the room*=middle 是两边正中间的部分，是名词，要说 *the middle of the room*|in · side|in + side, one word|in + side，合成一个词
      away|someone told to leave a room;grandparents living two hours from here;running from a scary dog|away means to or at another place; inside means in a room or building|away 是到别处或在别处；inside 是在室内|inside=inside means in a room or building, the opposite of going to another place=inside 是在室内，和去别的地方意思相反;everywhere=everywhere means in all places, not to another place, away from here=everywhere 是到处，不是离开这里去别处|a · way|a + way, one word|a + way，合成一个词
      everywhere|looking in every room for keys;people in all parts of a market;snow on the roads, the cars and the trees|everywhere means in all places; inside means only in a room or building|everywhere 是所有地方；inside 只是在室内|inside=inside means only in a room or building, not in all places=inside 只是在室内，不是所有地方;away=away means at another place, not in all places=away 是在别处，不是所有地方|ev · ery · where|every + where, one word, with wh as in *what*|every + where 合成一个词，wh 和 *what* 里的一样
      nobody|a knock on a door that no one answered;a class where no one can swim;an empty shop|nobody means no person; everyone means all the people|nobody 是没有人；everyone 是所有人|everyone=everyone means all the people, the opposite of no person=everyone 是所有人，和“没有人”意思相反;someone=someone means one person is there, not that no person is there=someone 是有一个人，不是一个人也没有|no · bo · dy|no + body, one word|no + body，合成一个词
      box|old toys put in something with a lid;chocolates bought for Grandma;the containers of a family moving house|a box is a container with straight sides; a shape is the form of something|box 是有直边的容器；shape 是东西的形状|shape=shape is the form of something, like round or square, and you cannot put things in it=shape 是东西的形状，比如圆形或方形，里面不能装东西;fire=fire is heat and flames, not a container you put things in=fire 是热和火焰，不是装东西的容器|box|x at the end, and *boxes* with -es|词尾是 x，复数 *boxes* 加 -es
      shape|the roundness of a ball;paper cut like a heart;circles and squares|a shape is the form of something; a box is a container|shape 是形状；box 是容器|box=box is a container with straight sides, not a form like round or heart=box 是有直边的容器，不是圆形或心形这样的形状;fire=fire is heat and flames, not the form of something=fire 是热和火焰，不是东西的形状|shape|sh at the start, and the silent e that makes a say its name|开头是 sh，词尾不发音的 e 让 a 读字母本音
      fire|something warm that people sat around and sang;something burning to call 119 about;flames that burned a house down|a fire is heat and flames; a box is a container|fire 是热和火焰；box 是容器|box=box is a container for things, not heat and flames=box 是装东西的容器，不是热和火焰;shape=shape is the form of something, not heat and flames=shape 是东西的形状，不是热和火焰|fire|i that says its name, and the silent e at the end|i 读字母本音，词尾 e 不发音
      among|a pen in a group of books;sitting in a group of friends;a little house standing in tall trees|among means in the middle of a group; around means on every side|among 是在一群当中；around 是在四周|around=around means on every side of one thing, not in the middle of a group=around 是在某个东西的四周，不是在一群当中;along=along means following a line, like a road or a river, not inside a group=along 是沿着路或河这样的线，不是在一群当中|a · mong|o said like u, as in *son*|o 读作 u，和 *son* 一样
    `,
  },
});

const sounds = vocabularyTopic({
  id: "a2-words-sounds-and-messages",
  title: t("Sounds and Messages", "声音和信息"),
  summary: t(
    "Noise, sounds and voices; letters, the radio and touch; secrets, guesses and mistakes.",
    "噪音、声音和嗓音；信、收音机和触摸；秘密、猜测和错误。",
  ),
  intro: t(
    "Tom heard a strange **noise**, then a quiet **voice** on the **radio** told a **secret**: there was a party at school. These words help you talk about what you hear, what you write and what you keep to yourself.",
    "汤姆听到一阵奇怪的 **noise**（响声），接着 **radio**（收音机）里一个轻轻的 **voice**（声音）说出一个 **secret**（秘密）：学校里要开派对。这些词帮你谈论听到的、写下的和藏在心里的事。",
  ),
  prerequisites: ["a2-words-communication"],
  words: [
    word(
      "noise noises",
      "a sound, often one that is loud or not nice",
      "噪音；响声",
      "Please don't make so much {noise}. The baby is sleeping. | What was that loud {noise}? Did something fall? | The old car makes strange {noises}.|voices radios",
      "voice radio",
      "sound",
    ),
    word(
      "sound sounds",
      "something that you hear",
      "声音",
      'I love the {sound} of the sea. | Can you hear that {sound}? I think it\'s a bird. | In "ship", the letters s and h make one {sound}.|letter voice | The {sound} of the rain helps me sleep.',
      "letter voice",
      "noise",
    ),
    word(
      "voice voices",
      "the sounds a person makes when they speak or sing",
      "嗓音；说话声",
      "She has a beautiful singing {voice}. | I can hear people's {voices} talking in the next room.|noises letters | Please speak in a quiet {voice}. We're in the library.",
      "noise letter",
    ),
    word(
      "letter letters",
      "a written message that you send by post; a sign such as A, B or C",
      "信；字母",
      "I wrote a {letter} to my pen friend in Canada. | The English alphabet has 26 {letters}.|radios voices | Did the postman bring any {letters} today?|radios voices",
      "radio voice",
    ),
    word(
      "radio radios",
      "a machine that you listen to music, news and talk on",
      "收音机；广播",
      "My dad listens to the news on the {radio} every morning. | Turn the {radio} down, please. It's too loud. | I heard my favorite song on the {radio}. | Grandma has an old {radio} in the kitchen that plays music all day.",
      "letter voice",
    ),
    word(
      "touch touches touched touching",
      "to put your hand on something",
      "触摸；碰",
      "Please don't {touch} the paintings. | The baby {touched} my face with her small hand.|guessed heard | Be careful! Don't {touch} the hot plate.",
      "guess hear",
    ),
    word(
      "secret secrets",
      "something that you tell nobody, or only a few people",
      "秘密",
      "Can you keep a {secret}? Don't tell anyone. | The party is a {secret}. Mom doesn't know. | Best friends tell each other {secrets} that nobody else knows.|mistakes noises | It's a {secret}, so please don't tell Tom.",
      "mistake noise",
    ),
    word(
      "guess guesses guessed guessing",
      "to give an answer when you are not sure it is right",
      "猜；猜测",
      "{Guess} what? I won the race! | I don't know the answer, so I'll {guess}. | She {guessed} my age: fourteen. She was right!|touched answered",
      "touch answer",
    ),
    word(
      "mistake mistakes",
      "something that is not right",
      "错误",
      "I made three {mistakes} in my spelling test, so I got seven out of ten.|secrets guesses | Sorry, it was a {mistake}. I took your bag. | Everyone makes {mistakes}. That's how we learn.|secrets guesses",
      "secret guess",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Sound*, *noise* and *voice* are all things you hear: a *voice* comes from a person speaking or singing, a *noise* is loud or not nice, and a *sound* can be anything you hear, like the sea or a bird.",
        "*sound*、*noise* 和 *voice* 都是听到的东西：*voice* 是人说话或唱歌的声音，*noise* 是吵闹或难听的声响，*sound* 可以是听到的任何声音，比如海浪声、鸟叫声。",
      ),
      meaning: t(
        "*Letter* has two meanings: a message you write and send by post, and a sign such as A, B or C. Read whether the meaning talks about the post or the alphabet.",
        "*letter* 有两个意思：写好寄出去的信，以及 A、B、C 这样的字母。看释义说的是邮寄还是字母表。",
      ),
      spell: t(
        "*Guess* has a silent u after the g, and *voice* ends in -ce while *noise* ends in -se.",
        "*guess* 的 g 后面有个不发音的 u；*voice* 以 -ce 结尾，而 *noise* 以 -se 结尾。",
      ),
    },
    notes: `
      noise|a loud sound that could wake a baby;a loud sound as if something fell;strange sounds from an old car|a noise is loud or not nice; a voice is the sound of a person speaking|noise 是吵闹或难听的声响；voice 是人说话的声音|voice=voice is the sound of a person speaking or singing, not the sound of a falling thing or a car=voice 是人说话或唱歌的声音，不是东西掉落或汽车发出的声响;radio=radio is a machine you listen to, not a sound that something makes=radio 是用来收听的机器，不是某样东西发出的声响|noise|oi, and -se at the end, said like z|oi 组合，结尾 -se 读作 z
      sound|the sea;something heard that may be a bird;what the letters s and h make in "ship";the rain at night|a sound is anything you hear; a letter is a sign you write|sound 是听到的任何声音；letter 是写出来的字母|letter=letter is a sign you write or a message you send, not something you hear=letter 是写出来的字母或寄出的信，不是听到的东西;voice=voice is the sound of a person, and the sea, a bird or the letters of a word have no voice=voice 是人的声音，大海、鸟或单词里的字母都没有人声|sound|ou, as in *out*|ou 和 *out* 里的一样
      voice|a beautiful singing sound;people talking in the next room;quiet speaking in a library|a voice is the sound of a person speaking or singing; a noise is a loud, unpleasant sound|voice 是人说话唱歌的声音；noise 是吵闹难听的声响|noise=noise is a loud sound that is not nice, not the beautiful or quiet sound of a person speaking or singing=noise 是吵闹难听的声响，不是人说话唱歌时好听或轻柔的声音;letter=letter is a sign you write or a message you send, not a sound people make=letter 是写的字母或寄的信，不是人发出的声音|voice|oi, and -ce at the end, said like s|oi 组合，结尾 -ce 读作 s
      letter|a message to a pen friend in Canada;the signs of the English alphabet;mail the postman brings|a letter is a written message or a sign like A; a voice is a sound|letter 是信或字母；voice 是声音|radio=radio is a machine you listen to, not a message you write or a sign of the alphabet=radio 是收听的机器，不是写的信，也不是字母;voice=voice is the sound a person makes, not something you write or post=voice 是人发出的声音，不是写下或寄出的东西|let · ter|the double t in the middle|中间双写 t
      radio|news every morning;something too loud to turn down;a favorite song playing;an old machine in Grandma's kitchen that plays music|a radio is a machine you listen to; a letter is a written message|radio 是收听的机器；letter 是写的信|letter=letter is a written message, and you cannot listen to news or music on it=letter 是写的信，不能在上面听新闻或音乐;voice=voice is the sound of one person, not a machine you turn down or that plays songs=voice 是一个人的声音，不是可以调小音量、能放歌的机器|ra · di · o|a that says its name, and o at the end|a 读字母本音，词尾是 o
      touch|paintings that must not be handled;a baby's small hand on a face;a hot plate not to be handled|you touch with your hand; you hear with your ears|touch 用手摸；hear 用耳朵听|guess=guess means giving an answer when you are not sure, not putting your hand on something=guess 是不确定时说出答案，不是用手摸;hear=hear means noticing a sound with your ears, not putting your hand on something=hear 是用耳朵听到声音，不是用手摸|touch|ou said like u in *cup*, and -ch at the end|ou 读作 *cup* 里的 u，结尾是 -ch
      guess|news about winning a race;an answer someone is not sure of;someone's age said without knowing it|you guess when you are not sure; you answer when you know|guess 是不确定时猜；answer 是知道时回答|touch=touch means putting your hand on something, not giving an answer you are not sure of=touch 是用手摸，不是说出没把握的答案;answer=answer means replying to a question when you know what to say, not trying when you are not sure=answer 是知道怎么说时回答问题，不是没把握时试着猜|guess|the silent u after g, and the double s|g 后面的 u 不发音，结尾双写 s
      mistake|wrong answers in a spelling test;taking someone's bag by error;something everyone makes while learning|a mistake is something not right; a secret is something you do not tell|mistake 是错误；secret 是不告诉别人的事|secret=secret is something you tell nobody, not something that is wrong=secret 是不告诉别人的事，不是做错的事;guess=guess is an answer you are not sure of, not something you got wrong=guess 是没有把握的回答，不是做错的事|mis · take|mis- + take|mis- 加 take
      secret|something not to tell anyone;a party Mom does not know about;what best friends tell only each other;something not to tell Tom|a secret is something you tell nobody; a mistake is something wrong|secret 是不告诉别人的事；mistake 是做错的事|mistake=mistake is something that is not right, not something you keep from other people=mistake 是做错的事，不是瞒着别人的事;noise=noise is a loud sound, not something you keep from other people=noise 是吵闹的声响，不是瞒着别人的事|se · cret|e that says its name, as in *see*|e 读字母本音，和 *see* 一样
    `,
  },
});

const family = vocabularyTopic({
  id: "a2-words-family-food-and-measures",
  title: t("Family, Food and Measures", "家人、食物和度量"),
  summary: t(
    "Grandfathers, grandmothers and age; cheese, chocolate and the cinema; kilometers and meters; quick and bright.",
    "祖父、祖母和年龄；奶酪、巧克力和电影院；千米和米；快的和明亮的。",
  ),
  intro: t(
    "My **grandmother** lives two **kilometers** from the **cinema**, and after a film we always eat hot **chocolate** at her house. These words help you talk about your family, food you like and how far or how long things are.",
    "我的 **grandmother**（外婆）住在离 **cinema**（电影院）两 **kilometers**（公里）的地方，看完电影我们总会去她家喝热 **chocolate**（巧克力）。这些词帮你谈论家人、喜欢的食物，以及东西有多远、多长。",
  ),
  prerequisites: ["a1-words-numbers-to-hundred"],
  words: [
    word(
      "grandfather grandfathers",
      "the father of your father or mother",
      "祖父；外祖父",
      "My {grandfather} is my dad's dad. He is eighty, but he still walks every day. | My {grandfather}, my mother's father, was a farmer, and he loved his cows. | My mom's father and my dad's father are my two {grandfathers}.|grandmothers fathers",
      "grandmother father",
    ),
    word(
      "grandmother grandmothers",
      "the mother of your father or mother",
      "祖母；外祖母",
      "My {grandmother}, my dad's mother, is seventy, and she still works in her garden. | My {grandmother} tells me stories about when my mom was a little girl. | My mom's mother and my dad's mother are my two {grandmothers}.|grandfathers mothers",
      "grandfather mother",
    ),
    word(
      "age ages",
      "how old a person or thing is",
      "年龄",
      "What {age} is your sister? She's twelve. | He started school at the {age} of six. | Children of all {ages} can join the club.|years meters",
      "year meter",
    ),
    word(
      "cheese cheeses",
      "a yellow or white food made from milk",
      "奶酪",
      "I'd like a {cheese} sandwich with ham and tomato, please. | Mice love yellow {cheese} with holes in it. | France makes hundreds of kinds of {cheese} from cow, goat and sheep milk.",
      "chocolate butter",
    ),
    word(
      "chocolate chocolates",
      "a sweet brown food made from cocoa",
      "巧克力",
      "Would you like a cup of hot {chocolate}? | My teacher loves sweet brown {chocolate}, so I bought her a big bar. | Don't eat too much {chocolate}. It's bad for your teeth.",
      "cheese butter",
    ),
    word(
      "cinema cinemas",
      "a building where you go to watch films",
      "电影院",
      "Let's go to the {cinema} tonight. There's a new film. | The {cinema} next to the shopping center shows five films a day. | There are three {cinemas} in our town, so we can see all the new films.|museums libraries",
      "museum library",
    ),
    word(
      "kilometer kilometers",
      "a thousand meters, used to measure long distances",
      "千米；公里",
      "The station is two {kilometers} from my house.|meters liters | I run five {kilometers} every morning.|meters liters | The train goes at 300 {kilometers} an hour.|meters liters",
      "meter liter",
    ),
    word(
      "meter meters",
      "a measure of length; there are 100 centimeters in a meter",
      "米",
      "The wall is two {meters} high.|kilometers liters | She swam a hundred {meters} in two minutes.|kilometers liters | This room is four {meters} long.|kilometers liters",
      "kilometer liter",
    ),
    word(
      "quick quicker quickest",
      "fast; taking only a short time",
      "快的；迅速的",
      "Can I ask a {quick} question? | Walking is {quicker} than taking the bus at this time of day, so we'll get there first.|slower brighter | The {quickest} way to the station is through the park: it takes only five minutes.|slowest brightest",
      "slow bright",
    ),
    word(
      "bright brighter brightest",
      "full of light; strong in color",
      "明亮的；鲜艳的",
      "The sun is very {bright} today. Wear your sunglasses. | She painted her room a {bright} yellow, like the sun. | This is the {brightest} room in the house: the sun comes in all day.|darkest quickest",
      "dark quick",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Meter* and *kilometer* both measure length: a room or a wall is a few *meters*, but a road, a run or a train trip is measured in *kilometers*. Ask how big the distance in the sentence is.",
        "*meter* 和 *kilometer* 都是长度单位：房间或墙有几 *meters*，而道路、跑步或火车行程用 *kilometers* 来量。想想句子里的距离有多大。",
      ),
      meaning: t(
        "*Grandfather* and *grandmother* are the parents of your parents: a *grandfather* is a man and a *grandmother* is a woman. Check whether the meaning says *father of* or *mother of*.",
        "*grandfather* 和 *grandmother* 是父母的父母：*grandfather* 是男的，*grandmother* 是女的。看释义说的是 *father of* 还是 *mother of*。",
      ),
      spell: t(
        "*Cheese* has a double e and ends in -se said like z, and *chocolate* has a quiet middle o: choc · o · late.",
        "*cheese* 有两个 e，结尾 -se 读作 z；*chocolate* 中间的 o 读得很轻：choc · o · late。",
      ),
    },
    notes: `
      grandfather|a dad's dad who is eighty;a mother's father who was a farmer;the fathers of mom and dad|a grandfather is the father of a parent; a grandmother is the mother of a parent|grandfather 是父母的父亲；grandmother 是父母的母亲|grandmother=grandmother is a woman, the mother of a parent, not a father=grandmother 是女性，是父母的母亲，不是父亲;father/fathers=father is your own dad, not your dad's or your mom's father=father 是自己的爸爸，不是爸爸或妈妈的父亲|grand · fa · ther|grand + father, one word|grand + father，合成一个词
      grandmother|a dad's mother who still gardens at seventy;someone telling stories about mom as a little girl;the mothers of mom and dad|a grandmother is the mother of a parent; a mother is your own mom|grandmother 是父母的母亲；mother 是自己的妈妈|grandfather=grandfather is a man, the father of a parent, not a mother=grandfather 是男性，是父母的父亲，不是母亲;mother/mothers=mother is your own mom, not the mother of your mom or dad=mother 是自己的妈妈，不是妈妈或爸爸的母亲|grand · moth · er|grand + mother, one word, with o said like u|grand + mother 合成一个词，o 读作 u
      age|how old a sister is;being six when school started;children of every number of years|your age is how old you are; a year is one unit of time|age 是年龄；year 是一年|year/years=year is one unit of twelve months, so you ask *how old*, not *what year*, and say *at the age of six*=year 是十二个月的时间单位，问年龄说 *how old*，不说 *what year*，要说 *at the age of six*;meter=meter is a measure of length, not how old someone is=meter 是长度单位，不是年龄|age|a that says its name, and g said like j before e|a 读字母本音，e 前面的 g 读作 j
      cheese|a sandwich with ham and tomato;yellow food with holes that mice love;the hundreds of French kinds made from cow, goat and sheep milk|cheese is a food made from milk; chocolate is sweet and brown|cheese 是牛奶做的食物；chocolate 甜甜的、棕色的|chocolate=chocolate is a sweet brown food made from cocoa, not a food made from milk for sandwiches=chocolate 是可可做的甜甜的棕色食物，不是放进三明治的奶制品;butter=butter is a soft yellow fat you spread on bread, with no holes, and we do not count kinds of it=butter 是抹在面包上的软软的黄色油脂，没有孔，也不论“几种”|cheese|the double e, and -se at the end said like z|两个 e，结尾 -se 读作 z
      chocolate|a hot drink in a cup;a sweet brown food a teacher loves;a sweet food bad for teeth|chocolate is sweet and brown; cheese is made from milk and is not sweet|chocolate 甜甜的、棕色的；cheese 是奶做的，不甜|cheese=cheese is a food made from milk that is not sweet, not a sweet hot drink=cheese 是不甜的奶制品，不是甜甜的热饮;butter=butter is a yellow fat for bread, not a sweet brown food or a hot drink=butter 是抹面包的黄色油脂，不是甜甜的棕色食物，也不是热饮|choc · o · late|ch at the start, and a quiet middle o|开头是 ch，中间的 o 读得很轻
      cinema|a place to see a new film tonight;a building showing five films a day;places in town for seeing new films|a cinema is where you watch films; a museum is where you look at old and famous things|cinema 是看电影的地方；museum 是参观古老名贵物品的地方|museum=museum is a building where you look at old and famous things, not where you watch films=museum 是参观古老名贵物品的地方，不是看电影的地方;library=library is a building where you borrow books, not where you watch films=library 是借书的地方，不是看电影的地方|cin · e · ma|c said like s, and a at the end|c 读作 s，词尾是 a
      kilometer|the distance from home to a station;a morning run;the speed of a fast train|a kilometer is a thousand meters; a meter is much shorter|kilometer 是一千米；meter 短得多|meter=meter is a short length, too short for a run, a station far from home or a train's speed=meter 是很短的长度，跑步、车站距离或火车速度都不会这么短;liter=liter measures liquid, not how far or how fast=liter 量的是液体，不是距离或速度|ki · lo · me · ter|kilo + meter, one word|kilo + meter，合成一个词
      meter|how high a wall is;a hundred of them swum in two minutes;how long a room is|a meter is a hundred centimeters; a kilometer is a thousand meters|meter 是一百厘米；kilometer 是一千米|kilometer=kilometer is a thousand meters, much too long for a wall, a room or a two-minute swim=kilometer 是一千米，墙、房间或两分钟游的距离都不会这么长;liter=liter measures liquid, not how high or long something is=liter 量的是液体，不是高度或长度|me · ter|-er at the end; British English writes *metre*|结尾是 -er；英式英语写作 *metre*
      quick|a question that takes a short time;walking that gets there first;a way through the park that takes five minutes|quick means taking a short time; slow means taking a long time|quick 是用时短；slow 是用时长|slow=slow means taking a long time, the opposite of quick=slow 是用时长，和 quick 意思相反;bright=bright means full of light or strong in color, not taking a short time=bright 是明亮或鲜艳，不是用时短|quick|qu said like kw, and ck at the end|qu 读作 kw，结尾是 ck
      bright|a sun that needs sunglasses;a yellow like the sun;the room where the sun comes in all day|bright means full of light; dark means with little or no light|bright 是明亮；dark 是暗|dark/darker/darkest=dark means with little or no light, the opposite of bright=dark 是光线少或没有光，和 bright 意思相反;quick=quick means fast, not full of light or strong in color=quick 是快，不是明亮或鲜艳|bright|igh said like *eye*, with a silent gh|igh 读作 *eye*，gh 不发音
    `,
  },
});

const ideas = vocabularyTopic({
  id: "a2-words-everyday-ideas",
  title: t("Everyday Ideas", "日常概念"),
  summary: t(
    "Lists, news and facts; results and the brain; simple, clear and perfect; seeming; anyone and somebody; since and instead.",
    "清单、消息和事实；结果和大脑；简单、清楚和完美；似乎；任何人和某人；自从和代替。",
  ),
  intro: t(
    "Before the test, Mia made a **list** of **facts** to learn, and the **result** was **perfect**: ten out of ten! These words help you talk about ideas, information and what happens in everyday life.",
    "考试前，米娅把要记的 **facts**（事实）列成一张 **list**（清单），**result**（结果）很 **perfect**（完美）：满分十分！这些词帮你谈论日常生活中的想法、信息和发生的事。",
  ),
  prerequisites: ["a2-words-useful-words"],
  words: [
    word(
      "list lists",
      "a set of names or things written one below the other",
      "清单；名单",
      "I wrote a shopping {list}: eggs, milk and bread. | Is my name on the {list} of students for the trip? | Make a {list} of things to take on the trip.",
      "fact news",
    ),
    word(
      "simple simpler simplest",
      "easy to understand or do",
      "简单的",
      "The question was very {simple}. Everyone knew the answer. | It's a {simple} recipe with only three things in it. | The rules of the game are {simple}, so even small children can play.",
      "difficult perfect",
      "clear",
    ),
    word(
      "clear clearer clearest clearly",
      "easy to see, hear or understand; with no clouds",
      "清楚的；晴朗的",
      "The water in the lake is so {clear} that we can see the fish at the bottom. | Your answer is short and {clear}: I understand it at once. | Write {clearly} so that everyone can read your words.|brightly quickly",
      "bright difficult",
      "simple",
    ),
    word(
      "seem seems seemed seeming",
      "to look or feel like something",
      "似乎；看起来",
      "You {seem} tired. Did you sleep well? | The new teacher {seems} very nice.|guesses touches | It {seemed} like a good idea at the time.|guessed touched",
      "guess touch",
    ),
    word(
      "anyone",
      "any person, used in questions, after not, or to mean every person",
      "任何人",
      "Is {anyone} at home? | I didn't tell {anyone} your secret. | {Anyone} can learn to swim: you just need some lessons.",
      "nothing something",
      "somebody",
    ),
    word(
      "somebody",
      "a person, when you do not know or do not say who",
      "某人；有人",
      "Listen! {Somebody} is knocking at the door. | {Somebody} has taken my pen, and I want to know who! | I need {somebody} strong to help me carry this box. Can you?",
      "nobody something",
      "anyone",
    ),
    word(
      "news",
      "new information about something that has happened",
      "消息；新闻",
      "Have you heard the {news}? Anna is going to have a baby! | I watch the {news} on TV every evening. | The best {news} of the day was that school was closed.",
      "fact list",
    ),
    word(
      "fact facts",
      "something that is true",
      "事实",
      "It's a {fact} that the earth goes around the sun. | Here are some {facts} about pandas.|results lists | In {fact}, I've never been to Paris.",
      "result list",
    ),
    word(
      "result results",
      "what happens because of something; your mark in an exam",
      "结果；成绩",
      "When will we get our exam {results}?|facts lists | As a {result} of the rain, the game was stopped. | The {result} of the match was 2–1.",
      "fact list",
    ),
    word(
      "brain brains",
      "the part inside your head that you think with",
      "脑；大脑",
      "Your {brain} controls your whole body. | Reading is good for your {brain}. | Use your {brain}! Think about it.",
      "idea fact",
    ),
    word(
      "since",
      "from a time in the past until now; because",
      "自从；因为",
      "I've lived here {since} 2015. | We haven't seen her {since} the party. | {Since} it's raining, let's stay at home.",
      "until ago",
    ),
    word(
      "instead",
      "in place of someone or something",
      "代替；反而",
      "There's no tea, so I'll have coffee {instead}. | Let's walk {instead} of taking the bus. | He didn't study. {Instead}, he watched TV all night.",
      "since ago",
    ),
    word(
      "perfect perfectly",
      "so good that nothing is wrong with it",
      "完美的；完全正确的",
      "The weather was {perfect} for a picnic: sunny, warm and not windy. | Nobody is {perfect}. We all make mistakes. | She speaks English {perfectly}: she never makes a mistake.|simply clearly",
      "simple clear",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Since* goes with a starting point in the past, as in *since 2015*, or means *because* at the start of a sentence; *instead* means in place of something and often comes at the end: *I'll have coffee instead*.",
        "*since* 后面接过去的起点，如 *since 2015*，放在句首时意思是“因为”；*instead* 是“代替”，常放在句末：*I'll have coffee instead*。",
      ),
      meaning: t(
        "*Anyone* and *somebody* both mean a person: *somebody* is one person you do not name, and *anyone* is any person at all, often in questions and after *not*.",
        "*anyone* 和 *somebody* 都指人：*somebody* 是某一个没说出是谁的人，*anyone* 是任何人，常用在疑问句和 *not* 后面。",
      ),
      spell: t(
        "*Seem* is spelled with ee, not like *seam*, *brain* with ai, and *instead* with ea said like short e: in · stead.",
        "*seem* 拼作 ee，别写成 *seam*；*brain* 拼作 ai；*instead* 的 ea 读短元音 e：in · stead。",
      ),
    },
    notes: `
      list|a shopping note of eggs, milk and bread;names of students for a trip;things to take on a trip written down|a list is names or things written one below the other; a fact is something true|list 是一条条写下的名字或东西；fact 是事实|fact=fact is something that is true, not names or things written one below the other=fact 是真实的事，不是一条条写下的名字或东西;news=news is new information about what has happened, not names or things written in a line=news 是关于已发生的事的新消息，不是一条条写下的名字或东西|list|a short i, and -st at the end|短元音 i，结尾是 -st
      simple|a question everyone could answer;a recipe with only three things;rules even small children can follow|simple means easy; difficult means hard to do or understand|simple 是简单；difficult 是难|difficult=difficult means hard to do or understand, the opposite of simple=difficult 是难做或难懂，和 simple 意思相反;perfect=perfect means with nothing wrong, not easy to do or understand=perfect 是完美无缺，不是容易做或容易懂|sim · ple|-le at the end, not -el|结尾是 -le，不是 -el
      clear|lake water you can see fish through;a short answer understood at once;writing everyone can read|clear means easy to see or understand; difficult means hard to understand|clear 是清楚、容易看懂；difficult 是难懂|bright/brightly=bright means full of light or strong in color, not easy to see through or understand=bright 是明亮或鲜艳，不是清澈或容易懂;difficult=difficult means hard to understand, the opposite of clear=difficult 是难懂，和 clear 意思相反;quickly=quickly means fast, and fast writing is often hard to read=quickly 是快，写得快往往不好认|clear|ear, as in *near*, and -ly for *clearly*|ear 和 *near* 里的一样，副词 *clearly* 加 -ly
      seem|someone who looks tired;a new teacher who looks nice;an idea that looked good at the time|seem means to look or feel like something; guess means to answer without being sure|seem 是看起来、似乎；guess 是猜|guess=guess means giving an answer when you are not sure, and it cannot be followed by words like *tired* or *nice*=guess 是没把握时说出答案，后面不能接 *tired*、*nice* 这类词;touch=touch means putting your hand on something, not looking like something=touch 是用手摸，不是看起来像什么|seem|the double e, not *seam*|两个 e，不是 *seam*
      anyone|a question about a person at home;a secret not told to any person;every person learning to swim|anyone means any person; something means a thing|anyone 是任何人；something 是某样东西|nothing=nothing means no thing, not a person, and it never follows *not*=nothing 是什么东西都没有，不指人，也不放在 *not* 后面;something=something means a thing, not a person who is at home, hears a secret or learns to swim=something 指东西，不是在家、听秘密或学游泳的人|an · y · one|any + one, one word, with a said like e|any + one 合成一个词，a 读作 e
      somebody|a person knocking at the door;a person who took a pen;a strong person to help carry a box|somebody means a person you do not name; nobody means no person|somebody 是某个人；nobody 是没有人|nobody=nobody means no person, not a person who is really there=nobody 是没有人，不是确实存在的某个人;something=something means a thing, not a person who knocks, takes a pen or helps=something 指东西，不是会敲门、拿笔或帮忙的人|some · bo · dy|some + body, one word|some + body，合成一个词
      news|a story about Anna having a baby;a TV program every evening;the best thing heard that day|news is new information about what happened; a fact is anything true|news 是刚发生的事的新消息；fact 是任何真实的事|fact=fact is something true that people know, not new information about what has just happened=fact 是人们知道的真实的事，不是刚发生的事的新消息;list=list is names or things written one below the other, not new information=list 是一条条写下的名字或东西，不是新消息|news|ew, and s at the end, but it is not a plural|ew 组合，词尾有 s，但它不是复数
      fact|the earth going around the sun;true things about pandas;what is really true about Paris|a fact is something true; a result is what happens because of something|fact 是事实；result 是结果|result=result is what happens because of something, not something that is simply true=result 是某事造成的结果，不是本来就真实的事;list=list is names or things written one below the other, not something true=list 是一条条写下的东西，不是事实|fact|a short a, and -ct at the end|短元音 a，结尾是 -ct
      result|exam marks;what the rain caused;the score of a match|a result is what happens because of something; a fact is something true|result 是结果；fact 是事实|fact=fact is something true, not a mark or a score you get at the end=fact 是事实，不是最后得到的分数或比分;list=list is names or things written one below the other, not a mark or what something caused=list 是一条条写下的东西，不是分数或造成的结果|re · sult|s said like z|s 读作 z
      brain|what controls the whole body;what reading is good for;what you think with|the brain is the part of your head you think with; an idea is a thought|brain 是用来思考的大脑；idea 是想法|idea=idea is a thought you have, not the part inside your head that controls your body=idea 是脑子里的想法，不是控制身体的器官;fact=fact is something true, not a part of your body=fact 是事实，不是身体的一部分|brain|ai for the long a sound|ai 发长 a 音
      since|living here from 2015 until now;not seeing someone from the party until now;rain as the reason to stay home|since means from a time in the past until now; until means up to a time|since 是从过去某时到现在；until 是直到某时|until=until means up to a time and then stopping, not from a time in the past until now=until 是到某个时间为止，不是从过去某时一直到现在;ago=ago comes after a length of time, as in *two years ago*, never before a date or an event=ago 放在一段时间后面，如 *two years ago*，不放在日期或事件前面|since|s at the start and -ce at the end, both said like s|开头的 s 和结尾的 -ce 都读作 s
      instead|coffee in place of tea;walking in place of the bus;watching TV in place of studying|instead means in place of; since means from a time or because|instead 是代替；since 是自从或因为|since=since means from a time in the past or because, not in place of something=since 是自从或因为，不是代替;ago=ago comes after a length of time, as in *two days ago*, not in place of something=ago 放在一段时间后面，如 *two days ago*，不是代替|in · stead|ea said like short e, as in *head*|ea 读短元音 e，和 *head* 一样
      perfect|sunny, warm weather for a picnic;something no person is;English spoken with no mistakes|perfect means with nothing wrong; simple means easy|perfect 是完美无缺；simple 是简单|simple/simply=simple means easy to do or understand, not with nothing wrong=simple 是简单易懂，不是完美无缺;clear=clear means easy to see, hear or understand, not with no mistakes at all=clear 是清楚易懂，不是一个错误都没有|per · fect|per- at the start, and -ct at the end|开头是 per-，结尾是 -ct
    `,
  },
});

/** topics are the extra word topics of A2. */
export const topics: readonly TopicDef[] = [positions.topic, sounds.topic, family.topic, ideas.topic];

/** vocabulary are the extra words of A2. */
export const vocabulary: readonly WordBatch[] = [positions.batch, sounds.batch, family.batch, ideas.batch];
