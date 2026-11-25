// A1, unit 7: Free Time. Sports and music, hobbies, parties, verbs for saying and thinking, like and love with -ing,
// and sentences about what people like.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";

const sportsAndMusic = vocabularyTopic({
  id: "a1-words-sports-and-music",
  title: t("Sports and Music", "运动与音乐"),
  summary: t(
    "Sports, games, balls, music and songs, dancing, singing, riding a bike, football, movies and films.",
    "运动、游戏、球、音乐和歌曲，跳舞、唱歌、骑自行车、足球、电影和影片。",
  ),
  intro: t(
    "After school we play **football**. In the evening I **sing** my favorite **song** and **dance** to the **music**. These words help you talk about the sports and music you love.",
    "放学后我们踢 **football**（足球）。晚上我 **sing**（唱）最喜欢的 **song**（歌），跟着 **music**（音乐）**dance**（跳舞）。这些词帮你谈论你喜爱的运动和音乐。",
  ),
  prerequisites: ["a1-words-how-often"],
  words: [
    word(
      "sport sports",
      "a game like football or swimming that you play for exercise",
      "运动；体育",
      "My favorite {sport} is swimming. | Do you play any {sports}? — Yes, basketball.|songs movies | Football is a team {sport}.",
      "song movie",
    ),
    word(
      "game games",
      "something you play, with rules, to have fun",
      "游戏；比赛",
      "Let's play a {game}! — Okay, what game? | We won the {game} three to one. | I like computer {games}.|sports balls",
      "sport ball",
    ),
    word(
      "ball balls",
      "a round thing you throw, kick or hit in games",
      "球",
      "Kick the {ball} to me! | A football is a big round {ball}. | The dog is playing with a {ball}.",
      "game bike",
    ),
    word(
      "music",
      "sounds that people sing or play on instruments",
      "音乐",
      "I listen to {music} on my phone. | What kind of {music} do you like? — Pop! | We sing in {music} class on Friday.",
      "sport game",
    ),
    word(
      "song songs",
      "a short piece of music with words that you sing",
      "歌曲",
      "Let's sing a {song}! | This is my favorite {song}. Listen and sing with me! | We sing English {songs} at school.|games movies",
      "game movie",
    ),
    word(
      "dance dances danced dancing",
      "to move your body to music",
      "跳舞",
      "Can you {dance}? — Yes, I love dancing! | We {danced} at the party, moving our feet all night.|rode sang | She is {dancing}, moving her arms and feet to the music.|riding singing",
      "ride sing",
    ),
    word(
      "sing sings sang sung singing",
      "to make music with your voice",
      "唱歌",
      'Birds {sing} in the morning. | Let\'s {sing} a song for Grandma. | She {sang} "Happy Birthday" at the party.|rode danced',
      "ride dance",
    ),
    word(
      "ride rides rode ridden riding",
      "to sit on a bike or a horse and move on it",
      "骑",
      "I {ride} my bike to school. | Can you {ride} a horse? | We are {riding} our bikes in the park.|singing dancing",
      "sing dance",
    ),
    word(
      "bike bikes",
      "a thing with two wheels that you ride",
      "自行车",
      "I ride my {bike} to school. | My {bike} is red and has a bell. | We left our {bikes} outside the shop.|balls songs",
      "ball song",
    ),
    word(
      "football",
      "a game where two teams kick a ball into a goal; also the ball",
      "足球",
      "In {football}, you kick the ball into a goal. | Kick the {football} into the goal! | Our {football} team has eleven players.",
      "basketball music",
    ),
    word(
      "basketball",
      "a game where two teams throw a ball through a high ring",
      "篮球",
      "In {basketball}, you throw the ball into a high basket. | Tall people are often good at {basketball}, because the basket is high. | Bounce the {basketball} with your hand.",
      "football music",
    ),
    word(
      "movie movies",
      "a story you watch on a screen",
      "电影",
      "Let's watch a {movie} tonight. | This {movie} is very funny. The actors make me laugh. | We go to the {movies} on Saturday.|songs photos",
      "song photo",
    ),
    word(
      "film films",
      "a story told in moving pictures that you watch on a screen",
      "电影；胶卷",
      "Let's watch a {film} on TV this evening. | This {film} is about a girl and her horse, and it lasts two hours. | I like {films} with lots of songs and dancing.|songs photos",
      "song photo",
      "movie",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Football* is kicked into a goal and *basketball* is thrown into a high basket. You *sing* a *song* with your voice, but you *dance* with your body.",
        "*football* 是把球踢进球门，*basketball* 是把球投进高高的篮筐。用嗓子 *sing* 一首 *song*，用身体 *dance*。",
      ),
      meaning: t(
        "A *sport* is played for exercise, a *game* has rules and a winner, and *music* is the sound itself. *Movie* and *film* both mean a story you watch.",
        "*sport* 是为了锻炼的运动，*game* 有规则、分输赢，*music* 是声音本身。*movie* 和 *film* 都是看的故事片。",
      ),
      spell: t(
        "*Football* and *basketball* are each one word. *Sing* goes *sang*, *sung*; *ride* goes *rode*, *ridden*; *dance* drops its e in *dancing*.",
        "*football* 和 *basketball* 都写成一个词。*sing* 变 *sang*、*sung*；*ride* 变 *rode*、*ridden*；*dance* 在 *dancing* 里去掉 e。",
      ),
    },
    notes: `
      sport|swimming;basketball;football as a team game|a sport is played for exercise; a song is music you sing|sport 是锻炼身体的运动；song 是唱的歌|song/songs=song is music you sing, not swimming, basketball or football=song 是唱的歌，不是游泳、篮球或足球;movie/movies=movie is a story you watch, not swimming, basketball or football=movie 是看的故事片，不是游泳、篮球或足球|sport|or said like *for*|or 读作 *for*
      game|something to play;a win three to one;something on a computer|a game has rules and a winner; a sport is played for exercise|game 有规则、分输赢；sport 是锻炼身体的运动|sport/sports=sport is a kind of exercise like swimming, so you do not ask *what game* back, win one three to one, or play it on a computer=sport 是游泳这样的运动，不会反问 *what game*，不说赢了一场运动三比一，也不在电脑上玩;ball/balls=ball is the round thing you play with, not the game you win or play on a computer=ball 是玩的球，不是赢下的比赛或电脑上玩的游戏|game|a silent e that makes the a say its name|词尾 e 不发音，让 a 读字母本音
      ball|kicking it to me;a football;a dog's toy|a ball is the round thing; a game is what you play with it|ball 是圆圆的球；game 是用球玩的游戏|game=game is what you play, not a round thing you kick or a dog plays with=game 是玩的游戏，不是能踢的、狗玩的圆东西;bike=bike has two wheels for riding, not a round thing you kick=bike 有两个轮子，用来骑，不是能踢的圆东西|ball|a double l, and a said like *all*|双写 l，a 读作 *all* 里的音
      music|something on my phone;pop;a class for singing|music is the sounds you sing or play; a sport is exercise|music 是唱出或奏出的声音；sport 是运动|sport=sport is exercise like swimming, not sounds you listen to or a kind like pop=sport 是游泳这样的运动，不是听的声音，也不是流行乐这类;game=game is something with rules that you play, not sounds you listen to or sing in=game 是有规则的游戏，不是听的或唱的声音|mu · sic|u said like *you*, and c at the end said like k|u 读作 *you*，结尾 c 读作 k
      song|singing one together;one to listen and sing with;English ones at school|a song is music with words that you sing; a game is something you play|song 是有歌词、用来唱的；game 是玩的|game/games=game is something you play, not something you sing=game 是玩的，不是唱的;movie/movies=movie is a story you watch, not something you sing=movie 是看的故事片，不是唱的|song|ng at the end, so not *son*|结尾是 ng，不是 *son*
      dance|something someone loves doing;moving our feet at a party;moving arms and feet to music|you dance with your body; you sing with your voice|dance 是用身体跳；sing 是用嗓子唱|sing/sang/singing=sing means to make music with your voice, not to move your feet and arms=sing 是用嗓子唱，不是动手动脚;ride/rode/riding=ride means to sit on a bike or a horse and move on it, not to move your feet to music=ride 是骑车或骑马，不是跟着音乐动脚|dance|a silent e that drops in *dancing*|词尾 e 不发音，*dancing* 里去掉
      sing|birds in the morning;a song for Grandma;Happy Birthday at a party|you sing with your voice; you dance with your body|sing 是用嗓子唱；dance 是用身体跳|dance/danced=dance means to move your body, not to make music with your voice or a song=dance 是动身体，不是用嗓子唱出歌;ride/rode=ride means to sit on a bike or a horse, not to make a song=ride 是骑车或骑马，不是唱歌|sing|the past *sang* and *sung*|过去式是 *sang*，过去分词是 *sung*
      ride|a bike to school;a horse;bikes in the park|you ride a bike or a horse; you sing a song|ride 是骑车或骑马；sing 是唱歌|sing/singing=sing means to make music with your voice, not to sit on a bike or a horse=sing 是用嗓子唱，不是骑车或骑马;dance/dancing=dance means to move your body to music, not to sit on a bike or a horse=dance 是跟着音乐跳舞，不是骑车或骑马|ride|a silent e, and the past *rode*|词尾 e 不发音，过去式是 *rode*
      bike|riding it to school;red with a bell;left outside the shop|a bike has two wheels for riding; a ball is round for kicking|bike 有两个轮子，用来骑；ball 是圆的，用来踢|ball/balls=ball is round and you kick it, not something you ride with a bell=ball 是圆的，用来踢，不能骑，也没有铃铛;song/songs=song is music you sing, not something you ride or leave outside=song 是唱的歌，不能骑，也不能放在外面|bike|a silent e that makes the i say its name|词尾 e 不发音，让 i 读字母本音
      football|kicking into a goal;kicking the ball;a team of eleven|in football you kick the ball; in basketball you throw it|football 用脚踢；basketball 用手投|basketball=basketball is thrown by hand into a high basket, not kicked into a goal, and a team has five players=basketball 用手投进高篮筐，不是踢进球门，一队五人;music=music is sounds you listen to, not a game you kick=music 是听的声音，不是踢的比赛|foot · ball|one word: *foot* + *ball*|是一个词：*foot* 加 *ball*
      basketball|throwing into a high basket;tall players and a high basket;bouncing the ball by hand|in basketball you throw the ball into a basket; in football you kick it|basketball 用手投进篮筐；football 用脚踢|football=football is kicked with your feet into a goal, not thrown or bounced into a high basket=football 用脚踢进球门，不是用手投或拍进高篮筐;music=music is sounds you listen to, not a game with a ball=music 是听的声音，不是用球的比赛|bas · ket · ball|one word: *basket* + *ball*|是一个词：*basket* 加 *ball*
      movie|something to watch tonight;actors who make me laugh;a Saturday trip to the cinema|a movie is a story you watch; a song is music you sing|movie 是看的故事片；song 是唱的歌|song/songs=song is music you listen to or sing, not something you watch, with actors, at the cinema=song 是听或唱的歌，不是在电影院看、有演员演的;photo/photos=photo is one still picture, with no actors and no story to go and watch=photo 是一张静止的照片，没有演员，也没有故事可看|mov · ie|o said like *oo*, and -ie at the end|o 读作 *oo*，结尾是 -ie
      film|something on TV this evening;a two-hour story about a girl and her horse;stories with songs and dancing|a film is a story you watch; a photo is one still picture|film 是看的故事片；photo 是一张静止的照片|song/songs=song is music you sing, not a two-hour story you watch on TV, and it does not have songs in it=song 是唱的歌，不是在电视上看的两小时故事，里面也不会再有歌;photo/photos=photo is one still picture, not a story that moves, lasts two hours or has dancing=photo 是一张静止的照片，不会动，没有两小时，也没有舞蹈|film|lm at the end, so not *flim*|结尾是 lm，不是 *flim*
    `,
  },
});

const hobbies = vocabularyTopic({
  id: "a1-words-hobbies",
  title: t("Hobbies", "爱好"),
  summary: t(
    "Guitar, piano, painting, photos, teams and parks, fun and free time.",
    "吉他、钢琴、画画、照片、队伍和公园，乐趣和空闲时间。",
  ),
  intro: t(
    "In my **free** time I play the **guitar** and take **photos** in the **park**. It's a lot of **fun**! These words help you talk about the things you like to do.",
    "我在 **free**（空闲）时间弹 **guitar**（吉他），在 **park**（公园）里拍 **photos**（照片）。真是太 **fun**（有趣）了！这些词帮你说出自己喜欢做的事。",
  ),
  prerequisites: ["a1-words-sports-and-music"],
  words: [
    word(
      "hobby hobbies",
      "something you like to do in your free time",
      "爱好",
      "My {hobby} is painting. | What are your {hobbies}? — Reading and chess.|teams parks | Collecting stamps is a fun {hobby}.",
      "team park",
    ),
    word(
      "guitar guitars",
      "a music instrument with six strings that you play with your fingers",
      "吉他",
      "My brother plays the {guitar} and carries it on his back. | A {guitar} has six strings. | He sits on the grass, singing and playing his {guitar}.",
      "piano camera",
    ),
    word(
      "piano pianos",
      "a big music instrument with black and white keys",
      "钢琴",
      "I sit at the {piano} and practice every day. | A {piano} has black and white keys. | There is a big {piano} in the music room. It's too heavy to move.",
      "guitar camera",
    ),
    word(
      "paint paints painted painting",
      "to make a picture with colors and a brush",
      "画；刷漆",
      "I like to {paint} flowers. | We {painted} the wall blue.|wrote pointed | She is {painting} a picture of the sea.|writing pointing",
      "write point",
    ),
    word(
      "photo photos",
      "a picture you take with a camera or a phone",
      "照片",
      "Can I take a {photo} of you? | Look at this {photo} of my family. | I take {photos} of birds.|cameras phones",
      "camera phone",
    ),
    word(
      "camera cameras",
      "a thing you take photos with",
      "相机",
      "I take photos with my {camera}. | This {camera} is new. It takes good pictures. | Smile at the {camera}! I'm taking your picture.",
      "photo piano",
    ),
    word(
      "fun",
      "something you enjoy; enjoyable",
      "乐趣；有趣的",
      "The party was a lot of {fun}! | Have {fun} at the zoo! | Swimming is {fun}. I always laugh in the water.",
      "free together",
    ),
    word(
      "together",
      "with each other",
      "一起",
      "Let's play {together}! | My sister and I walk to school {together}. | We always eat dinner {together}.",
      "alone free",
    ),
    word(
      "favorite favorites",
      "liked more than any other",
      "最喜欢的",
      "Blue is my {favorite} color. | What is your {favorite} food? — Dumplings! | This song is my {favorite}.",
      "free together",
    ),
    word(
      "team teams",
      "a group of people who play or work together",
      "队；团队",
      "There are eleven players in a football {team}. | Our {team} won the game! | Which {team} do you like? — The red team.",
      "hobby park",
    ),
    word(
      "park parks",
      "a big public garden with grass and trees where people play",
      "公园",
      "We play football on the grass in the {park}. | There are many trees in the {park}. | Let's walk the dog in the {park}.",
      "team party",
    ),
    word(
      "free freer freest",
      "not busy; also not costing money",
      "空闲的；免费的",
      "Are you {free} on Saturday? — Yes, I have no plans. | In my {free} time, I read comics. | The museum is {free}. You don't pay.",
      "fun favorite",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *guitar* has six strings and you can carry it; a *piano* has black and white keys and is too heavy to move. You take a *photo* with a *camera*: the photo is the picture, the camera is the thing.",
        "*guitar* 有六根弦，可以背着走；*piano* 有黑白键，重得搬不动。用 *camera* 拍 *photo*：photo 是照片，camera 是相机。",
      ),
      meaning: t(
        "*Free* means not busy or not costing money; *fun* means you enjoy it; *favorite* means liked more than any other.",
        "*free* 是有空或免费；*fun* 是好玩；*favorite* 是最喜欢的。",
      ),
      spell: t(
        "*Hobby* changes y to -ies in *hobbies*; *favorite* has -ite at the end; *together* is one word with th in the middle.",
        "*hobby* 的复数把 y 变成 -ies：*hobbies*；*favorite* 以 -ite 结尾；*together* 是一个词，中间是 th。",
      ),
    },
    notes: `
      hobby|painting;reading and chess;collecting stamps|a hobby is something you do in your free time; a team is a group of players|hobby 是业余爱好；team 是一队人|team/teams=team is a group of people, not painting, reading or collecting stamps=team 是一群人，不是画画、读书或集邮;park/parks=park is a garden where people play, not painting, reading or collecting stamps=park 是玩耍的公园，不是画画、读书或集邮|hob · by|a double b, and y changing to -ies in *hobbies*|双写 b，复数 *hobbies* 里 y 变成 -ies
      guitar|something to carry on his back;six strings;playing on the grass|a guitar has six strings and you can carry it; a piano has keys and is too heavy to carry|guitar 有六根弦，可以背；piano 有琴键，重得背不动|piano=piano has black and white keys and is too heavy to carry or take onto the grass=piano 有黑白键，重得背不动，也搬不到草地上;camera=camera takes photos and has no strings to play=camera 是拍照的，没有弦可弹|gui · tar|a silent u after the g, and -ar at the end|g 后面的 u 不发音，结尾是 -ar
      piano|sitting at it to practice;black and white keys;something too heavy to move|a piano has keys and is heavy; a guitar has strings and is light|piano 有琴键，很重；guitar 有弦，很轻|guitar=guitar has six strings, no keys, and it is light enough to carry, so you do not sit at it=guitar 有六根弦，没有琴键，轻得能背着走，不会坐在它前面;camera=camera takes photos, not something with keys you practice music on=camera 是拍照的，不是有琴键、用来练琴的|pi · an · o|-o at the end, and -os in *pianos*|结尾是 -o，复数是 *pianos*
      paint|flowers;a blue wall;a picture of the sea|you paint with colors and a brush; you write words with a pen|paint 用颜料和画笔画；write 用笔写字|write/wrote/writing=write means to put words on paper, not colors on flowers, a wall or a picture of the sea=write 是写字，不是给花、墙或海景涂颜色;point/pointed/pointing=point means to show something with your finger, not to put colors on it=point 是用手指指，不是涂颜色|paint|ai said like the a in *name*|ai 读作 *name* 里的 a
      photo|one of you;one of my family;birds|a photo is the picture; a camera is the thing you take it with|photo 是照片；camera 是拍照的相机|camera/cameras=camera is the thing you take pictures with, not the picture itself=camera 是拍照的工具，不是照片本身;phone/phones=phone is the thing you call or take pictures with, not the picture of you, your family or birds=phone 是打电话或拍照的工具，不是你、家人或小鸟的照片|pho · to|ph said like f, and -os in *photos*|ph 读作 f，复数是 *photos*
      camera|taking photos with it;something new that takes good pictures;something to smile at|a camera takes pictures; a photo is the picture|camera 是拍照的；photo 是拍出的照片|photo=photo is the picture itself, so it does not take pictures and you do not take photos with it=photo 是照片本身，不会拍照，也不能用它拍照;piano=piano is for playing music, not for taking pictures=piano 是弹奏音乐的，不是拍照的|cam · er · a|c said like k, and an a at the end|c 读作 k，结尾是 a
      fun|a party;a day at the zoo;swimming and laughing|fun means you enjoy it; free means it costs nothing or you are not busy|fun 是好玩；free 是免费或有空|free=free means not busy or not costing money, not something you enjoy or laugh in=free 是有空或免费，不是让人开心、大笑的事;together=together means with each other, and it does not go after *a lot of* or *have*, or say you enjoy swimming=together 是一起，不放在 *a lot of*、*have* 后面，也不能说游泳好玩|fun|a short u, as in *sun*|短元音 u，和 *sun* 一样
      together|playing with each other;my sister and me walking;eating dinner as a family|together means with each other; alone means with nobody else|together 是一起；alone 是独自|alone=alone means with nobody else, but *let's*, *my sister and I* and *we* show more than one person=alone 是独自，可 *let's*、*my sister and I*、*we* 都不止一个人;free=free means not busy or costing nothing, not with each other=free 是有空或免费，不是一起|to · geth · er|one word, with th in the middle|是一个词，中间是 th
      favorite|blue as a color;dumplings as a food;a song|favorite means liked most; free means not busy or costing nothing|favorite 是最喜欢的；free 是有空或免费|free=free means not busy or costing nothing, not liked more than any other=free 是有空或免费，不是最喜欢的;together=together means with each other, and it cannot describe a color, a food or a song=together 是一起，不能形容颜色、食物或歌曲|fa · vor · ite|-ite at the end, so not *favorit*|结尾是 -ite，不是 *favorit*
      team|eleven football players;winners of a game;the red one|a team is a group of players; a hobby is something you like to do|team 是一队人；hobby 是爱好|hobby=hobby is something you like to do, not a group of players who win games=hobby 是爱好，不是一队赢比赛的人;park=park is a garden with grass and trees, not a group of players=park 是有草和树的公园，不是一队人|team|ea said like *eat*|ea 读作 *eat* 里的音
      park|football on the grass;many trees;walking the dog|a park is a public garden; a party is a time to eat and have fun|park 是公共花园；party 是聚会|team=team is a group of players, not a place with grass and trees to walk a dog=team 是一队人，不是有草和树、能遛狗的地方;party=party is a time when people eat and have fun, not a place with grass and trees=party 是吃东西、玩乐的聚会，不是有草和树的地方|park|ar said like *car*, and k at the end|ar 读作 *car* 里的音，结尾是 k
      free|a Saturday with no plans;time after work or school;a museum you don't pay for|free means not busy or not costing money; fun means enjoyable|free 是有空或免费；fun 是好玩|fun=fun means enjoyable, but here the point is having no plans or not paying=fun 是好玩，可这里说的是没有安排或不用付钱;favorite=favorite means liked most, not having no plans or not paying=favorite 是最喜欢的，不是没安排或不用付钱|free|a double e at the end|结尾双写 e
    `,
  },
});

const parties = vocabularyTopic({
  id: "a1-words-parties",
  title: t("Parties", "聚会"),
  summary: t(
    "Parties, gifts, invitations, concerts and clubs, enjoying and laughing, chess, drums and kites.",
    "聚会、礼物、邀请、音乐会和社团，享受和大笑，象棋、鼓和风筝。",
  ),
  intro: t(
    "I **invite** my friends to my birthday **party**. They bring a **gift**, we play **chess** and we **laugh** a lot. These words help you plan a party and talk about fun times with friends.",
    "我 **invite**（邀请）朋友来参加我的生日 **party**（聚会）。他们带来 **gift**（礼物），我们下 **chess**（国际象棋），**laugh**（笑）个不停。这些词帮你筹备聚会，谈论和朋友在一起的快乐时光。",
  ),
  prerequisites: ["a1-words-hobbies"],
  words: [
    word(
      "party parties",
      "a time when people meet to eat, talk, dance and have fun",
      "聚会；派对",
      "Come to my birthday {party} on Saturday! | We had a big {party} for the New Year, with food, games and dancing. | There are lots of birthday {parties} in December.|concerts clubs",
      "concert club",
    ),
    word(
      "gift gifts",
      "something you give to someone, often for a birthday",
      "礼物",
      "This {gift} is for you. Open it! Happy birthday! | I got many {gifts} for my birthday.|clubs concerts | Thank you for the lovely {gift}! I will wear it every day.",
      "club concert",
    ),
    word(
      "invite invites invited inviting",
      "to ask someone to come to a party or an event",
      "邀请",
      "I want to {invite} all my friends to my party. | Thank you for {inviting} me!|laughing enjoying | She {invited} ten people to her birthday.|laughed enjoyed",
      "laugh enjoy",
    ),
    word(
      "concert concerts",
      "a show where people play or sing music",
      "音乐会",
      "We went to a {concert}. We sat and listened to the band play. | The school {concert} is on Friday. I'm singing on the stage! | Tickets for the {concert} are ten dollars. The band starts playing at eight.",
      "party gift",
    ),
    word(
      "club clubs",
      "a group of people who meet to do something they like",
      "俱乐部；社团",
      "I'm in the chess {club} at school. | The music {club} meets on Tuesday. | Which {clubs} are you in?|concerts parties",
      "concert party",
    ),
    word(
      "enjoy enjoys enjoyed enjoying",
      "to like doing something",
      "享受；喜欢",
      "Did you {enjoy} the party? — Yes, it was fun! | I {enjoy} reading in bed. | {Enjoy} your lunch!",
      "invite laugh",
    ),
    word(
      "laugh laughs laughed laughing",
      "to make a sound because something is funny",
      "笑；大笑",
      "The movie was so funny. We {laughed}: ha, ha, ha!|cried enjoyed | Why are you {laughing}? What's funny?|crying enjoying | Don't {laugh} at me!",
      "cry enjoy",
    ),
    word(
      "chess",
      "a game for two people on a board with black and white squares",
      "国际象棋",
      "Grandpa and I play {chess} on Sundays. | In {chess}, the king is the most important piece. | {Chess} is a game for two players.",
      "kite drum",
    ),
    word(
      "drum drums",
      "a music instrument that you hit",
      "鼓",
      "He plays the {drums} in the school band.|kites chess | Bang the {drum}! Boom, boom! | The {drum} is very loud.",
      "kite chess",
    ),
    word(
      "kite kites",
      "a light toy on a long string that flies in the wind",
      "风筝",
      "We fly a {kite} on windy days. | My {kite} is high in the sky! | There are many {kites} flying over the park today.|drums gifts",
      "drum gift",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "A *party* is for eating, games and dancing; a *concert* is a show where you sit and listen to music; a *club* is a group that meets again and again.",
        "*party* 是吃东西、做游戏、跳舞的聚会；*concert* 是坐着听音乐的演出；*club* 是定期见面的一群人。",
      ),
      meaning: t(
        "You *invite* someone to come; you *enjoy* something you like; you *laugh* when something is funny. *Chess* is played on a board, a *drum* is hit, and a *kite* flies in the wind.",
        "*invite* 是请人来；*enjoy* 是喜欢、享受；*laugh* 是因为好笑而笑。*chess* 在棋盘上下，*drum* 是敲的，*kite* 在风中飞。",
      ),
      spell: t(
        "*Laugh* hides gh said like f. *Party* becomes *parties*, and *invite* drops its e in *inviting*.",
        "*laugh* 里的 gh 读作 f。*party* 的复数是 *parties*，*invite* 在 *inviting* 里去掉 e。",
      ),
    },
    notes: `
      party|a birthday on Saturday;food, games and dancing for the New Year;birthdays in December|a party is for eating, games and dancing; a concert is a show of music|party 是吃喝玩乐的聚会；concert 是音乐演出|concert/concerts=concert is a show where people sit and listen to music, not a birthday with food, games and dancing=concert 是坐着听音乐的演出，不是有吃有玩有舞跳的生日会;club/clubs=club is a group that meets again and again, not one birthday or New Year with food and games=club 是定期见面的社团，不是一次有吃有玩的生日会或新年聚会|par · ty|y changing to -ies in *parties*|复数 *parties* 里 y 变成 -ies
      gift|something to open on a birthday;many things for my birthday;something to wear every day|a gift is something you give; a club is a group of people|gift 是送的东西；club 是一群人|club/clubs=club is a group of people, not something you open, get for a birthday or wear=club 是一群人，不能打开、收到或穿戴;concert/concerts=concert is a show of music, not something you open, get for a birthday or wear=concert 是音乐演出，不能打开、收到或穿戴|gift|g said like *go*, and ft at the end|g 读作 *go* 里的音，结尾是 ft
      invite|all my friends to a party;thanks for asking me to come;ten people to a birthday|you invite people to come; you enjoy something you like|invite 是请人来；enjoy 是享受|laugh/laughing/laughed=laugh means to make a happy sound, and it does not have people *to* a party after it=laugh 是笑，后面不能跟“请某人来聚会”;enjoy/enjoying/enjoyed=enjoy means to like something, not to ask people to come to a party=enjoy 是享受，不是请人来聚会|in · vite|a silent e that drops in *inviting*|词尾 e 不发音，*inviting* 里去掉
      concert|sitting and listening to a band;singing on the stage;tickets for a band|a concert is a show of music; a party is for eating and dancing|concert 是音乐演出；party 是吃喝跳舞的聚会|party=party is for eating, talking and dancing, not sitting to listen to a band on a stage=party 是吃喝聊天跳舞的，不是坐着听台上乐队演奏;gift=gift is something you give, not a show you go to or sing at=gift 是送的东西，不是去看或上台唱的演出|con · cert|c said like k, then c said like s|第一个 c 读作 k，第二个 c 读作 s
      club|chess at school;music on Tuesday;the ones you are in|a club is a group that meets; a concert is one show|club 是定期见面的社团；concert 是一场演出|concert/concerts=concert is one show of music, not a group you are in that meets every week=concert 是一场音乐演出，不是每周见面、你所在的团体;party/parties=party is one time to have fun, not a group you are in that meets every week=party 是一次聚会，不是每周见面、你所在的团体|club|a short u, as in *bus*|短元音 u，和 *bus* 一样
      enjoy|the party;reading in bed;lunch|you enjoy something you like; you invite someone to come|enjoy 是享受；invite 是请人来|invite=invite means to ask someone to come, but a party you went to, reading or lunch is not a person=invite 是请人来，可去过的聚会、读书、午饭都不是人;laugh=laugh needs *at* before a thing, and it is not liking a party, reading or lunch=laugh 后面要跟 *at* 才能接东西，也不是喜欢聚会、读书或午饭|en · joy|oy at the end, said like *boy*|结尾是 oy，读作 *boy* 里的音
      laugh|ha, ha, ha at a funny movie;asking what's funny;making fun of me|you laugh when something is funny; you cry when you are sad|好笑时 laugh；伤心时 cry|cry/cried/crying=cry means to have tears when you are sad, not to make *ha, ha* sounds at something funny=cry 是伤心流泪，不是因好笑而哈哈笑;enjoy/enjoyed/enjoying=enjoy needs a thing after it, as in *enjoy the movie*, and it is not the sound *ha, ha*=enjoy 后面要跟东西，比如 *enjoy the movie*，也不是哈哈的笑声|laugh|gh said like f, and au said like *ah*|gh 读作 f，au 读作 *ah*
      chess|Grandpa and me on Sundays;a king;a game for two|chess is a board game; a kite is a toy that flies|chess 是棋类游戏；kite 是会飞的玩具|kite=kite is a toy that flies in the wind, not a game with a king for two players=kite 是在风中飞的玩具，不是有国王、两人玩的游戏;drum=drum is something you hit to make music, not a game with a king for two players=drum 是敲着发声的乐器，不是有国王、两人玩的游戏|chess|a double s at the end|结尾双写 s
      drum|playing in a band;boom, boom;very loud|a drum is hit to make music; a kite flies in the wind|drum 敲着发声；kite 在风中飞|kite/kites=kite flies in the wind and makes no boom sound, so it is not played in a band=kite 在风中飞，不会咚咚响，也不在乐队里演奏;chess=chess is a quiet board game, not something you hit or play in a band=chess 是安静的棋类游戏，不是敲的，也不在乐队里演奏|drum|dr at the start, and u as in *up*|开头是 dr，u 读作 *up* 里的 u
      kite|windy days;high in the sky;flying over the park|a kite flies on a string in the wind; a drum is hit to make music|kite 拴着线在风中飞；drum 是敲的乐器|drum/drums=drum is something you hit, and it does not fly in the sky=drum 是敲的，不会飞上天;gift/gifts=gift is something you give, not a toy that flies over the park=gift 是送的东西，不是在公园上空飞的玩具|kite|a silent e that makes the i say its name|词尾 e 不发音，让 i 读字母本音
    `,
  },
});

const actions = vocabularyTopic({
  id: "a1-words-actions",
  title: t("Saying and Thinking", "说和想"),
  summary: t(
    "Say, tell, think, hear, talk, stay, hope, let, begin, end, wish and move.",
    "say、tell、think、hear、talk、stay、hope、let、begin、end、wish 和 move。",
  ),
  intro: t(
    "Grandpa **tells** us a story at night. We **hear** every word and **hope** it has a happy **end**. These words help you talk about what people say, think and do.",
    "爷爷晚上给我们 **tells**（讲）故事。我们 **hear**（听见）每一个字，**hope**（希望）它有个幸福的 **end**（结局）。这些词帮你谈论人们说什么、想什么、做什么。",
  ),
  prerequisites: ["a1-words-little-words-1"],
  words: [
    word(
      "say says said saying",
      "to speak words",
      "说",
      'What did you {say}? I can\'t hear you. | {Say} "thank you" to Grandma. | She {said} "hello" to me.|told talked',
      "tell talk",
    ),
    word(
      "tell tells told telling",
      "to give information to someone with words",
      "告诉；讲",
      "Can you {tell} me the time, please? | Grandpa {tells} us stories at night.|says talks | {Tell} me about your day.",
      "say talk",
    ),
    word(
      "think thinks thought thinking",
      "to use your mind; to believe",
      "想；认为",
      "{Think} before you speak. | What do you {think} of my new dress? — It's pretty! | Let me {think}. Hmm... the answer is ten!",
      "hear hope",
    ),
    word(
      "hear hears heard hearing",
      "to know a sound with your ears",
      "听见",
      "Can you {hear} the birds? | Speak louder, please. I can't {hear} you. | I {heard} a noise in the kitchen.|thought said",
      "think say",
    ),
    word(
      "talk talks talked talking",
      "to speak with someone",
      "谈话；说话",
      "We {talk} on the phone every evening. | Please don't {talk} in the library. | Who are you {talking} to?|saying telling",
      "say tell",
    ),
    word(
      "stay stays stayed staying",
      "to not leave a place",
      "停留；待",
      "{Stay} here and don't go away. I'll be back soon. | We {stayed} at Grandma's house for a week.|moved began | I'm sick, so I {stay} at home today.",
      "move begin",
    ),
    word(
      "hope hopes hoped hoping",
      "to want something to happen",
      "希望",
      "I {hope} you feel better soon! | We {hope} it's sunny tomorrow. | I {hope} you can come again soon.",
      "wish let",
    ),
    word(
      "let lets letting",
      "to allow someone to do something",
      "让；允许",
      "{Let} me see your photo! | My mom {lets} me stay up late on Fridays.|hopes wishes | Please {let} me help you.",
      "hope wish",
    ),
    word(
      "begin begins began begun beginning",
      "to start",
      "开始",
      "The class {begins} at nine and ends at ten.|ends stays | Let's {begin}. Open your books. | The movie {began} at seven and ended at nine.|ended stayed",
      "end stay",
    ),
    word(
      "end ends ended ending",
      "to finish; the last part of something",
      "结束；结尾",
      "The movie {ends} at nine. Then we go home.|begins stays | The story has a happy {end}. | School {ended} at three today, and we all went home.|began stayed",
      "begin stay",
    ),
    word(
      "wish wishes wished wishing",
      "to want something that may not happen; what you want",
      "希望；愿望",
      "Make a {wish} and blow out the candles! | I {wish} I could fly, but people can't. | Best {wishes} for the New Year!|hopes thinks",
      "hope think",
    ),
    word(
      "move moves moved moving",
      "to go to another place; to change the place of something",
      "移动；搬家",
      "Don't {move}! There's a bee on your arm. | We {moved} to a new apartment last year.|stayed began | Can you help me {move} this table?",
      "stay begin",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Say* takes the words themselves, as in *say hello*; *tell* takes a person, as in *tell me*; *talk* takes *to* or *with*. Look at what comes right after the gap.",
        "*say* 后面直接跟说的话，比如 *say hello*；*tell* 后面跟人，比如 *tell me*；*talk* 后面跟 *to* 或 *with*。看空格后面紧跟着什么。",
      ),
      meaning: t(
        "*Hope* is for things that can happen; *wish* is for things that may not, as in *I wish I could fly*. *Begin* is the start and *end* is the finish.",
        "*hope* 用于可能发生的事；*wish* 用于不太可能的事，比如 *I wish I could fly*。*begin* 是开始，*end* 是结束。",
      ),
      spell: t(
        "Watch the past forms: *say* becomes *said*, *tell* becomes *told*, *think* becomes *thought*, *hear* becomes *heard* and *begin* becomes *began*. *Begin* doubles n in *beginning*.",
        "注意过去式：*say* 变 *said*，*tell* 变 *told*，*think* 变 *thought*，*hear* 变 *heard*，*begin* 变 *began*。*begin* 在 *beginning* 里双写 n。",
      ),
    },
    notes: `
      say|words I couldn't hear;thank you to Grandma;hello to me|you say words; you tell a person something|say 后面跟说的话；tell 后面跟人|tell/told=tell needs a person right after it, as in *tell me*, not the words alone or *what did you ...*=tell 后面要直接跟人，比如 *tell me*，不直接跟说的话，也不说 *what did you tell* 来问说了什么;talk/talked=talk means to speak with someone, and it does not have the words *thank you* or *hello* right after it=talk 是和人交谈，后面不直接跟 *thank you* 或 *hello*|say|the past *said*, said like *sed*|过去式是 *said*，读作 *sed*
      tell|the time;stories at night;my day|you tell a person something; you say the words|tell 后面跟人；say 后面跟话|say/says=say does not have a person right after it: you say *something to me*, not *say me*=say 后面不直接跟人：说 *say something to me*，不说 *say me*;talk/talks=talk needs *to* or *with* before a person, not *talk me* or *talk us*=talk 要用 *to* 或 *with* 再跟人，不说 *talk me* 或 *talk us*|tell|a double l, and the past *told*|双写 l，过去式是 *told*
      think|before speaking;an opinion about a dress;working out an answer|you think with your mind; you hear with your ears|think 是用脑想；hear 是用耳朵听|hear=hear means to know a sound with your ears, not to use your mind to work something out=hear 是用耳朵听见，不是动脑想;hope=hope means to want something to happen, not to use your mind or give an opinion=hope 是希望，不是动脑想或发表看法|think|th as in *thin*, and the past *thought*|th 和 *thin* 一样，过去式是 *thought*
      hear|the birds;someone speaking too softly;a noise in the kitchen|you hear with your ears; you think with your mind|hear 是用耳朵听见；think 是用脑想|think/thought=think means to use your mind, not to know a sound with your ears=think 是动脑想，不是用耳朵听见;say/said=say means to speak words, not to know a sound with your ears=say 是说话，不是用耳朵听见|hear|ear said like *ear*, the same sound as *here*|ear 读作 *ear*，和 *here* 同音
      talk|on the phone;in the library;to someone|you talk with someone; you say words|talk 是和人交谈；say 后面跟话|say/saying=say needs the words after it, so it does not end the sentence or go with *on the phone* or *to* alone=say 后面要跟说的话，不能单独结尾，也不跟 *on the phone* 或单独的 *to*;tell/telling=tell needs a person after it, so it does not end the sentence or go with *on the phone* or *to*=tell 后面要跟人，不能单独结尾，也不跟 *on the phone* 或 *to*|talk|a silent l, said like *tork*|l 不发音，读作 *tork*
      stay|waiting here;a week at Grandma's;at home when sick|you stay in a place; you move to another place|stay 是待在原地；move 是换到别处|move/moved=move means to go to another place, but here someone does not leave=move 是去别的地方，可这里人没有离开;begin/began=begin means to start something, not to not leave a place=begin 是开始，不是待着不走|stay|ay at the end, and the past *stayed*|结尾是 ay，过去式是 *stayed*
      hope|feeling better soon;a sunny tomorrow;coming again soon|you hope for something that can happen; you wish for something that may not|hope 用于可能发生的事；wish 用于不太可能的事|wish=wish needs a past form after it, as in *I wish you felt*, not *feel*, *it's* or *can*=wish 后面要用过去式，比如 *I wish you felt*，不跟 *feel*、*it's* 或 *can*;let=let means to allow, and it cannot have *you feel*, *it's* or *you can* after it=let 是允许，后面不能跟 *you feel*、*it's* 或 *you can*|hope|a silent e that makes the o say its name|词尾 e 不发音，让 o 读字母本音
      let|seeing a photo;staying up late;helping you|let means to allow; hope means to want something to happen|let 是允许；hope 是希望|hope/hopes=hope does not have a person and a verb right after it, as in *hope me see*=hope 后面不能直接跟人再跟动词，没有 *hope me see* 的说法;wish/wishes=wish does not have a person and a plain verb right after it, as in *wish me help*=wish 后面不能直接跟人再跟动词原形，没有 *wish me help* 的说法|let|a short e, and *let* stays the same in the past|短元音 e，过去式不变，还是 *let*
      begin|a class at nine;opening our books;a movie at seven|begin is the start; end is the finish|begin 是开始；end 是结束|end/ends/ended=end is the finish, but the sentence names the start, before the end or before opening books=end 是结束，可句子说的是开始，在结束之前或打开书之前;stay/stays/stayed=stay means to not leave, not to start=stay 是待着不走，不是开始|be · gin|the past *began*, and a double n in *beginning*|过去式是 *began*，*beginning* 双写 n
      end|a movie at nine;a happy finish to a story;school at three|end is the finish; begin is the start|end 是结束；begin 是开始|begin/begins/began=begin is the start, but here something finishes and people go home=begin 是开始，可这里事情结束了，大家回家了;stay/stays/stayed=stay means to not leave, but here everyone goes home=stay 是待着不走，可这里大家都回家了|end|nd at the end|结尾是 nd
      wish|blowing out candles;flying like a bird;the New Year|you wish for something that may not happen; you hope for something that can|wish 用于不太可能的事；hope 用于可能发生的事|hope/hopes=hope is for things that can happen, so nobody *makes a hope*, hopes they *could fly*, or sends *best hopes*=hope 用于可能发生的事，没有 *make a hope*，不说希望自己 *could fly*，也不说 *best hopes*;think/thinks=think means to use your mind, not to want something, and there is no *make a think* or *best thinks*=think 是动脑想，不是想要什么，也没有 *make a think* 或 *best thinks*|wish|sh at the end, and -es in *wishes*|结尾是 sh，复数是 *wishes*
      move|keeping still for a bee;going to a new apartment;carrying a table|you move to another place; you stay where you are|move 是挪到别处；stay 是待在原地|stay/stayed=stay means to not leave, the opposite of going to a new place or changing where something is=stay 是待着不走，和搬去新地方或挪动东西相反;begin=begin means to start, not to go somewhere or change where something is=begin 是开始，不是去别处或挪动东西|move|o said like *oo*, and a silent e|o 读作 *oo*，词尾 e 不发音
    `,
  },
});

// Like and love with -ing.

/** likers are a subject and its form of like, love or enjoy. */
const likers: readonly (readonly [subject: string, verb: string, enjoy: boolean])[] = [
  ["I", "like", false],
  ["She", "likes", false],
  ["They", "love", false],
  ["He", "loves", false],
  ["We", "enjoy", true],
  ["Tom", "enjoys", true],
  ["My sister", "likes", false],
  ["My parents", "love", false],
];

/** pastimes are an activity: the verb, its -ing form, a misspelling and the rest. */
const pastimes: readonly (readonly [verb: string, ing: string, misspelled: string, rest: string])[] = [
  ["swim", "swimming", "swiming", ""],
  ["dance", "dancing", "danceing", ""],
  ["ride", "riding", "rideing", " a bike"],
  ["sing", "singing", "singging", " songs"],
  ["play", "playing", "plaing", " chess"],
  ["paint", "painting", "paintting", " pictures"],
  ["read", "reading", "readding", " books"],
  ["watch", "watching", "watchhing", " movies"],
  ["take", "taking", "takeing", " photos"],
  ["run", "running", "runing", " in the park"],
  ["fly", "flying", "fliing", " kites"],
  ["cook", "cooking", "cookking", " for my family"],
  ["draw", "drawing", "drawwing", " animals"],
];

/** likeAll are every liker with every pastime. */
const likeAll = everyPair(likers, pastimes).map(([[subject, verb, enjoy], [base, ing, misspelled, rest]]) => ({
  subject,
  verb,
  enjoy,
  base,
  ing,
  misspelled,
  rest,
}));

/** likeItems are all the pairs starting at the given place, so each bank opens on different sentences. */
const likeItems = (from: number) => [...likeAll.slice(from), ...likeAll.slice(0, from)];

const likeChoiceBank: readonly ChoiceItem[] = likeItems(0).map(
  ({ subject, verb, base, ing, misspelled, rest }): ChoiceItem => [
    `${subject} ${verb} ___${rest}. (${base})`,
    ing,
    [
      base,
      base.endsWith("y") && !base.endsWith("ay") ? `${base.slice(0, -1)}ies` : /(ch|sh|s|x|o)$/u.test(base) ? `${base}es` : `${base}s`,
      misspelled,
    ],
  ],
);

const likeSpellBank: readonly TypedItem[] = likeItems(44).map(
  ({ subject, verb, base, ing, misspelled, rest }): TypedItem => ({
    shown: `${subject} ${verb} ___${rest}. (${base})`,
    accepted: [ing],
    wrong: [misspelled, base],
  }),
);

const likeFixBank: readonly TypedItem[] = likeItems(83).map(
  ({ subject, verb, enjoy, base, ing, rest }): TypedItem => ({
    shown: `${subject} ${verb} ${base}${rest}.`,
    accepted: [enjoy ? `${subject} ${verb} ${ing}${rest}.` : `${subject} ${verb} [${ing}|to ${base}]${rest}.`],
    canonical: `${subject} ${verb} ${ing}${rest}.`,
    wrong: [
      `${subject} ${verb} ${base}${rest}.`,
      ...(enjoy ? [`${subject} ${verb} to ${base}${rest}.`] : [`${subject} ${verb} ${base}s${rest}.`]),
    ],
  }),
);

/** ingRule says how a verb makes its -ing form, in every locale. */
const ingRule = (verb: string, ing: string): Text =>
  ing === `${verb}ing`
    ? t(
        `Most verbs just add *-ing* with no other change, and *${verb}* is one of them`,
        `大多数动词直接加 *-ing*，不做其他变化，*${verb}* 也是这样`,
      )
    : ing === `${verb.slice(0, -1)}ing`
      ? t(`*${verb}* ends in *e*, so it drops the *e* before *-ing*`, `*${verb}* 以 *e* 结尾，去掉 *e* 再加 *-ing*`)
      : t(
          `*${verb}* is short and ends in one vowel and one consonant, so it doubles the last letter`,
          `*${verb}* 是以一个元音加一个辅音结尾的短动词，所以双写最后一个字母`,
        );

/** likeVerbOf finds the verb like, love or enjoy in a sentence. */
const likeVerbOf = (sentence: string) => sentence.match(/\b(likes?|loves?|enjoys?)\b/u)?.[1] ?? "like";

const likeAndLove: TopicDef = {
  id: "like-and-love-with-ing",
  title: t("Like Swimming, Love Dancing", "like swimming、love dancing：喜欢做某事"),
  summary: t(
    "I like swimming. She loves dancing. After like, love and enjoy, a verb takes -ing.",
    "I like swimming. She loves dancing. 在 like、love 和 enjoy 后面，动词用 -ing 形式。",
  ),
  intro: t(
    "Say what someone enjoys doing: *Tom enjoys taking photos.* and *My parents love cooking.* English does not stack two plain verbs side by side (*Tom enjoys take*), so the activity verb takes *-ing*. In this topic, you choose, spell, and fix *-ing* verbs after *like*, *love*, and *enjoy*.",
    "表达某人喜欢做什么，英语说 *Tom enjoys taking photos.* 和 *My parents love cooking.* 两个原形动词不能直接并列（不能说 *Tom enjoys take*），后面的活动动词要变成 *-ing* 形式。本主题带你选择、拼写并改正 *like*、*love*、*enjoy* 后的 *-ing* 动词。",
  ),
  prerequisites: ["present-simple", "a1-words-sports-and-music"],
  encompasses: [
    { topic: "present-simple", weight: 0.2 },
    { topic: "a1-words-sports-and-music", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("A verb after like", "like 后面的动词"),
      t(
        "After *like*, *love* and *enjoy*, a second verb takes *-ing*: *I like swimming. She loves dancing. We enjoy playing chess.*\n\nThe second verb never takes *-s*: not *She likes dances*.\n\n> **Watch out.** Only the *first* verb (*like/likes*, *love/loves*, *enjoy/enjoys*) changes for the subject—the second verb always takes *-ing* with exact spelling (*dancing*, *swimming*, *riding*).",
        "在 *like*、*love* 和 *enjoy* 后面，第二个动词用 *-ing* 形式：*I like swimming. She loves dancing. We enjoy playing chess.*\n\n中文说“我喜欢游泳”，两个动词直接连在一起；英语不能说 *I like swim*，第二个动词也不能加 *-s*。\n\n> **注意。** 只有*第一个*动词（*like/likes*、*love/loves*、*enjoy/enjoys*）随主语变化——第二个动词一律用拼写正确的 *-ing* 形式（*dancing*、*swimming*、*riding*）。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        likeChoiceBank,
        (right, shown) => {
          const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
          return t(
            `After *${likeVerbOf(shown)}*, a second verb takes *-ing*, never *-s*: ${sentence}\n\n**Check.** Confirm that *${right}* ends in *-ing* and follows the *-ing* spelling rule for the base verb in brackets.`,
            `*${likeVerbOf(shown)}* 后面的第二个动词用 *-ing* 形式，不加 *-s*：${sentence}\n\n**检验。** 确认 *${right}* 以 *-ing* 结尾，且符合括号中原形动词的 *-ing* 拼写规则。`,
          );
        },
        (wrong, _right, shown, position) =>
          position === 0
            ? t(
                `*${wrong}* puts two verbs side by side, as Chinese does, but after *${likeVerbOf(shown)}* the second verb needs *-ing*.`,
                `*${wrong}* 像中文一样把两个动词直接连在一起，可 *${likeVerbOf(shown)}* 后面的第二个动词要用 *-ing*。`,
              )
            : position === 1
              ? t(
                  `*${wrong}* gives the second verb *-s*, but only the first verb changes for the subject.`,
                  `*${wrong}* 给第二个动词加了 *-s*，可只有第一个动词随主语变化。`,
                )
              : t(
                  `*${wrong}* has *-ing*, but it is not spelled right: drop a last *e*, double one last consonant only after one short vowel, and otherwise just add *-ing*.`,
                  `*${wrong}* 加了 *-ing*，可拼写不对：以不发音的 *e* 结尾的去 *e*，只有一个短元音加一个辅音结尾时才双写辅音，其他直接加 *-ing*。`,
                ),
      ),
    ),
    point(
      "spell",
      t("Spelling the -ing form", "拼写 -ing 形式"),
      t(
        "Add *-ing*: *read → reading*. Drop a last *e*: *dance → dancing*, *ride → riding*. Double one last consonant after one short vowel: *swim → swimming*, *run → running*.\n\n> **Watch out.** Do not double a consonant after two vowels (*read* -> *reading*, *paint* -> *painting*, *cook* -> *cooking*) or drop *y* before *-ing* (*play* -> *playing*, *fly* -> *flying*).",
        "直接加 *-ing*：*read → reading*。以不发音的 *e* 结尾的去 *e*：*dance → dancing*、*ride → riding*。以一个短元音加一个辅音结尾的双写辅音：*swim → swimming*、*run → running*。\n\n> **注意。** 两个元音字母后面不要双写（*read* -> *reading*、*paint* -> *painting*、*cook* -> *cooking*），以 *y* 结尾的词也不要去 *y*（*play* -> *playing*、*fly* -> *flying*）。",
      ),
      typedGenerator("word-form", t("Type the verb with -ing.", "输入动词的 -ing 形式。"), likeSpellBank, (right, shown) => {
        const base = shown.match(/\((.*)\)$/u)?.[1] ?? "";
        const sentence = shown.replace(/ \(.*\)$/u, "").replace("___", `*${right}*`);
        const rule = ingRule(base, right);
        return t(
          `${rule.en}: ${sentence}\n\n**Check.** Check the ending of *${base}*—verify whether it drops silent *e*, doubles one final consonant after one short vowel, or just adds *-ing*.`,
          `${rule["zh-CN"]}：${sentence}\n\n**检验。** 核对原形 *${base}* 的词尾——确认该去不发音的 *e*、双写单辅音，还是直接加 *-ing*。`,
        );
      }),
    ),
    point(
      "fix",
      t("Fixing the second verb", "改正第二个动词"),
      t(
        "Each sentence puts two verbs side by side, as Chinese does: *We enjoy play chess.* → *We enjoy playing chess.* Give the second one *-ing*. After *like* and *love* you may also write *to* and the verb (*I like to swim*), but after *enjoy* only *-ing* is right.\n\n> **Watch out.** Never write *enjoy to [verb]*—*enjoy* always takes *-ing*—and never write *to* + *-ing* together.",
        "每个句子都像中文一样把两个动词直接连在一起：*We enjoy play chess.* → *We enjoy playing chess.* 把第二个动词改成 *-ing* 形式。在 *like* 和 *love* 后面也可以用 *to* 加动词（*I like to swim*），但 *enjoy* 后面只能用 *-ing*。\n\n> **注意。** 绝不能写 *enjoy to [动词]*（*enjoy* 后面只能用 *-ing*），也绝不能把 *to* 和 *-ing* 混在一起用。",
      ),
      typedGenerator("sentence-pattern", t("Fix the sentence.", "改正这个句子。"), likeFixBank, (right, shown) =>
        t(
          `Two verbs cannot stand side by side: after *${likeVerbOf(shown)}*, the second verb takes *-ing*: ${shown} → ${right}\n\n**Check.** Confirm that *${likeVerbOf(shown)}* kept its right subject agreement while the activity verb directly after it now carries *-ing*.`,
          `两个动词不能直接连在一起：*${likeVerbOf(shown)}* 后面的第二个动词要用 *-ing* 形式：${shown} → ${right}\n\n**检验。** 确认 *${likeVerbOf(shown)}* 与主语保持一致，紧随其后的活动动词已改为正确的 *-ing* 形式。`,
        ),
      ),
    ),
  ],
};

// Writing about likes.

/** fans are people who like things, and whether their verb takes -s. */
const fans: readonly (readonly [who: string, s: boolean])[] = [
  ["Ben", true],
  ["Mia", true],
  ["I", false],
  ["My brother", true],
  ["Anna", true],
  ["My friends", false],
  ["Grandpa", true],
];

const likeVerbs: readonly string[] = ["like", "love", "enjoy"];

const likeNotes = Array.from({ length: 42 }, (_, k) => {
  const [who, s] = fans[k % fans.length] ?? ["Ben", true];
  const verb = likeVerbs[k % likeVerbs.length] ?? "like";
  const [v1, ing1, , r1] = pastimes[k % pastimes.length] ?? pastimes[0] ?? ["swim", "swimming", "", ""];
  const second = k % 2 === 1 ? pastimes[(k + 5) % pastimes.length] : undefined;
  const verbForm = s ? `${verb}s` : verb;
  const note = second ? `${who} / ${verb} / ${v1}${r1} + ${second[0]}${second[3]}` : `${who} / ${verb} / ${v1}${r1}`;
  const ings = second ? `${ing1}${r1} and ${second[1]}${second[3]}` : `${ing1}${r1}`;
  const tos = second ? `to ${v1}${r1} and (to )${second[0]}${second[3]}` : `to ${v1}${r1}`;
  const bases = second ? `${v1}${r1} and ${second[0]}${second[3]}` : `${v1}${r1}`;
  return {
    note,
    right: `${who} ${verbForm} ${ings}.`,
    pattern: verb === "enjoy" ? `${who} ${verbForm} ${ings}.` : `${who} ${verbForm} [${ings}|${tos}].`,
    wrong: [`${who} ${verbForm} ${bases}.`, `${who} ${s ? verb : `${verb}s`} ${ings}.`],
    toIng: `${who} ${verbForm} to ${ings}.`,
  };
});

const likesChoiceBank: readonly ChoiceItem[] = likeNotes.map(
  ({ note, right, wrong, toIng }, k): ChoiceItem => [note, right, k % 2 === 0 ? [...wrong, toIng] : wrong],
);
const likesTypedBank: readonly TypedItem[] = likeNotes.map(
  ({ note, right, pattern, wrong }): TypedItem => ({
    shown: note,
    accepted: [pattern],
    canonical: right,
    wrong,
  }),
);

/** likesWhy explains a sentence about what someone likes: the -s on the first verb and -ing on each activity. */
const likesWhy = (right: string): Text => {
  const verb = likeVerbOf(right);
  const s = verb.endsWith("s");
  return t(
    `*${verb}* ${s ? "takes *-s* after one person" : "takes no *-s* after *I* or more than one"}, and each activity after it takes *-ing*: ${right}\n\n**Check.** Check both spots: *${verb}* agrees with the subject (${s ? "singular -> *-s*" : "*I*/plural -> no *-s*"}), and every activity after it carries *-ing* (never *to + -ing*).`,
    `*${verb}* ${s ? "在单数第三人称主语后加 *-s*" : "在 *I* 或复数主语后不加 *-s*"}，后面的每项活动都用 *-ing* 形式：${right}\n\n**检验。** 核对两处：*${verb}* 与主语一致（${s ? "单数加 *-s*" : "*I* 或复数不加 *-s*"}），后面的每项活动都用 *-ing*（不写 *to + -ing*）。`,
  );
};

const writingAboutLikes: TopicDef = {
  id: "writing-about-likes",
  title: t("Writing About Likes", "写喜欢的事"),
  summary: t(
    "Turn notes into sentences: Ben / like / ride a bike becomes Ben likes riding a bike.",
    "把笔记写成句子：Ben / like / ride a bike 写成 Ben likes riding a bike.",
  ),
  intro: t(
    "Turn a hobby note like `Mia / enjoy / paint pictures + fly kites` into a full sentence: *Mia enjoys painting pictures and flying kites.* Both pieces have to be right—third-person *-s* on *like/love/enjoy* when the subject is one person, and *-ing* on every activity that follows. In this topic, you pick and write hobby sentences from notes.",
    "把爱好笔记 `Mia / enjoy / paint pictures + fly kites` 写成完整句子：*Mia enjoys painting pictures and flying kites.* 两处都要对——单数主语后的 *like/love/enjoy* 加 *-s*，后面的每项活动动词都改成 *-ing*。本主题带你根据笔记写出规范的爱好句子。",
  ),
  prerequisites: ["like-and-love-with-ing", "joining-with-and-but-or"],
  encompasses: [
    { topic: "like-and-love-with-ing", weight: 0.4 },
    { topic: "joining-with-and-but-or", weight: 0.2 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives a person, a verb and one or two activities. The sentence gives *like*, *love* or *enjoy* an *-s* after one person, turns each activity into *-ing*, and joins two of them with *and*.\n\n*Ben / like / ride a bike + play chess* → *Ben likes riding a bike and playing chess.*\n\n> **Watch out.** When there are two activities joined by *and*, *both* verbs must take *-ing*—and never mix *to* with *-ing* (*to riding* is wrong).",
        "笔记给出一个人、一个动词和一两项活动。写成句子时，单数主语后的 *like*、*love*、*enjoy* 加 *-s*，每项活动改成 *-ing* 形式，两项活动用 *and* 连接。\n\n*Ben / like / ride a bike + play chess* → *Ben likes riding a bike and playing chess.*\n\n> **注意。** 有两项活动用 *and* 连接时，*两个*动词都要变成 *-ing* 形式；且绝不能把 *to* 和 *-ing* 混用（*to riding* 是错的）。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"),
        likesChoiceBank,
        (right) => likesWhy(right),
        (_wrong, _right, _shown, position) =>
          position === 0
            ? t(
                "This leaves the activities as plain verbs, but after *like*, *love* and *enjoy* each one takes *-ing*.",
                "这句的活动用了动词原形，可 *like*、*love*、*enjoy* 后面的每个动词都要用 *-ing*。",
              )
            : position === 1
              ? t(
                  "This gets the *-s* on *like*, *love* or *enjoy* wrong: it takes *-s* after one person, and none after *I* or more than one.",
                  "这句的 *like*、*love* 或 *enjoy* 词尾错了：单数第三人称主语后加 *-s*，*I* 和复数主语后不加。",
                )
              : t(
                  "This puts *to* before the *-ing* form, but *to* goes with a plain verb; after *like*, *love* and *enjoy* the *-ing* form follows directly.",
                  "这句在 *-ing* 形式前加了 *to*，可 *to* 后面跟动词原形；*like*、*love*、*enjoy* 后面直接跟 *-ing* 形式。",
                ),
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Write a whole sentence for the note: the person, *like*, *love* or *enjoy* with *-s* after one person, and each activity with *-ing*, joined by *and*—for example, *My friends / love / swim + sing songs* → *My friends love swimming and singing songs.* Start with a capital letter and end with a period.\n\n> **Watch out.** Check the subject first (*I* and *My friends* take *no -s*; *Ben*, *Mia*, *Grandpa*, and *My brother* take *-s*), then check every *-ing* spelling.",
        "根据笔记写一个完整的句子：先写人，再写 *like*、*love* 或 *enjoy*（单数第三人称主语后加 *-s*），每项活动用 *-ing* 形式，用 *and* 连接，例如 *My friends / love / swim + sing songs* → *My friends love swimming and singing songs.* 句首大写，句末加句号。\n\n> **注意。** 先核对主语（*I*、*My friends* 不加 *-s*；*Ben*、*Mia*、*Grandpa*、*My brother* 加 *-s*），再逐一核对 *-ing* 拼写。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), likesTypedBank, (right) =>
        likesWhy(right),
      ),
    ),
  ],
};

/** topics are the topics of the unit Free Time. */
export const topics: readonly TopicDef[] = [
  sportsAndMusic.topic,
  hobbies.topic,
  parties.topic,
  actions.topic,
  likeAndLove,
  writingAboutLikes,
];

/** vocabulary are the words the unit Free Time teaches. */
export const vocabulary: readonly WordBatch[] = [sportsAndMusic.batch, hobbies.batch, parties.batch, actions.batch];
