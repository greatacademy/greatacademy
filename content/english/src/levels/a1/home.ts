// A1, unit 6: Home. Rooms, things at home and housework, there is and there are, prepositions of place, and
// sentences about a room.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, pairUp, sentenceCase, vocabularyTopic, word } from "../words.ts";
import { prepositionsOfPlaceTypeNot, thereIsAndThereAreAskNot, thereIsAndThereAreFixNot, writingAboutARoomWriteNot } from "./mistakes.ts";

const home = vocabularyTopic({
  id: "a1-words-home",
  title: t("Rooms", "房间"),
  summary: t(
    "House, apartment, rooms, doors, windows, walls, floors, stairs and the garden.",
    "房子、公寓、房间、门、窗、墙、地板、楼梯和花园。",
  ),
  intro: t(
    "Our **house** has a red **roof**, big **windows** and a **garden**. My **bedroom** is at the top of the **stairs**. These words help you show someone around your home.",
    "我们的 **house**（房子）有红色的 **roof**（屋顶）、大大的 **windows**（窗户）和一个 **garden**（花园）。我的 **bedroom**（卧室）在 **stairs**（楼梯）上面。这些词帮你带别人参观你的家。",
  ),
  prerequisites: ["a1-words-my-day"],
  words: [
    word(
      "house houses",
      "a building where a family lives",
      "房子",
      "We live in a big {house} with a garden. | Our {house} has two floors. | There are six {houses} on our street.|rooms roofs",
      "room roof",
    ),
    word(
      "room rooms",
      "a part of a house with walls, a floor and a door",
      "房间",
      "Our apartment has four {rooms}: a kitchen, a bathroom and two bedrooms.|walls roofs | This {room} is my bedroom. | Clean your {room}, please! Your toys are all over the floor.",
      "wall roof",
    ),
    word(
      "bedroom bedrooms",
      "a room for sleeping in",
      "卧室",
      "My bed is in my {bedroom}. | I share a {bedroom} with my brother. Our beds are side by side. | The house has three {bedrooms}, and each one has a bed.|bathrooms gardens",
      "bathroom garden",
    ),
    word(
      "bathroom bathrooms",
      "a room where you wash and use the toilet",
      "浴室；卫生间",
      "I brush my teeth in the {bathroom}. | Where is the {bathroom}, please? I need to wash my hands. | After my bath, I dry myself in the {bathroom}.",
      "bedroom garden",
    ),
    word(
      "door doors",
      "a thing you open to go into or out of a room or a building",
      "门",
      "Please close the {door} behind you when you come in. | Someone is at the {door}! | Knock on the {door} before you go in.",
      "window wall",
    ),
    word(
      "window windows",
      "an opening in a wall, with glass, that lets in light",
      "窗户",
      "Open the {window}. It's hot in here. | I can see the park from my {window}. | The sun comes in through the {windows}.|walls floors",
      "wall floor",
    ),
    word(
      "wall walls",
      "one of the sides of a room or a building",
      "墙",
      "There is a clock high up on the {wall} of my bedroom. | Four {walls} go around my room.|floors roofs | Hang the picture on the {wall} of the living room.",
      "floor roof",
    ),
    word(
      "floor floors",
      "the part of a room you walk on; a level of a building",
      "地板；楼层",
      "My shoes are on the {floor}. | We live on the third {floor}. | The cat is sleeping on the {floor}, under the table.",
      "wall roof",
    ),
    word(
      "garden gardens",
      "a place next to a house with grass, flowers or vegetables",
      "花园",
      "We play in the {garden} after school. | Grandpa grows vegetables in his {garden}. | There are flowers in the {garden}.",
      "bathroom roof",
    ),
    word(
      "apartment apartments",
      "a home of several rooms on one floor of a big building",
      "公寓",
      "We live in an {apartment} on the tenth floor. | Our {apartment} has two bedrooms. | There are a hundred {apartments} in this building.|gardens roofs",
      "garden roof",
    ),
    word(
      "stairs",
      "steps that go from one floor to another",
      "楼梯",
      "Go up the {stairs} to my bedroom. | Be careful on the {stairs}! Don't run. | The cat is sleeping on the bottom step of the {stairs}.",
      "walls doors",
    ),
    word(
      "roof roofs",
      "the top of a house or a building",
      "屋顶",
      "The cat is on the {roof}, at the very top of the house! | Our house has a red {roof} on top. | Rain falls on the {roof}.",
      "floor wall",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "Think of where each part is: the *roof* is on top, the *floor* is under your feet, *walls* stand around a room, and *stairs* take you up to another floor.",
        "想想每个部分在哪儿：*roof* 在最上面，*floor* 在脚下，*walls* 围着房间，*stairs* 带你上到另一层。",
      ),
      meaning: t(
        "A *house* is a whole building for a family; an *apartment* is the rooms on one floor of a big building. You sleep in a *bedroom* and wash in a *bathroom*.",
        "*house* 是一家人住的整栋楼；*apartment* 是大楼里某一层的几个房间。在 *bedroom* 睡觉，在 *bathroom* 洗漱。",
      ),
      spell: t(
        "*Bedroom* and *bathroom* are each one word. *Stairs* keeps its s, and *apartment* has a double p.",
        "*bedroom* 和 *bathroom* 都写成一个词。*stairs* 要保留 s，*apartment* 双写 p。",
      ),
    },
    notes: `
      house|a big one with a garden;two floors;six on our street|a house is a whole building; a room is one part of it|house 是整栋房子；room 是其中一间|room/rooms=room is one part inside a building, so it does not have a garden or two floors or stand on a street=room 是房子里的一间，不会带花园、有两层，也不会排在街上;roof/roofs=roof is only the top of a building, not where a family lives=roof 只是房子的顶部，不是一家人住的地方|house|ou said like *out*, and a silent e|ou 读作 *out* 里的音，词尾 e 不发音
      room|a kitchen, a bathroom and two bedrooms;my bedroom;toys all over the floor|a room is a part of a house; a wall is one side of a room|room 是房子里的一间；wall 是房间的一面墙|wall/walls=wall is one side of a room, not a kitchen, a bedroom or a place with a floor full of toys=wall 是房间的一面墙，不是厨房、卧室或满地玩具的地方;roof/roofs=roof is the top of the building, not a kitchen, a bedroom or a place with a floor=roof 是楼顶，不是厨房、卧室或有地板的房间|room|a double o, said like *moon*|双写 o，读作 *moon* 里的音
      bedroom|my bed;sharing with my brother;a bed in each one|a bedroom is for sleeping; a bathroom is for washing|bedroom 用来睡觉；bathroom 用来洗漱|bathroom/bathrooms=bathroom is for washing, so beds are not in it=bathroom 是洗漱的，里面没有床;garden/gardens=garden is outside with grass and flowers, so beds are not in it=garden 在屋外，有草和花，里面没有床|bed · room|one word: *bed* + *room*|是一个词：*bed* 加 *room*
      bathroom|brushing teeth;washing hands;drying after a bath|a bathroom is for washing; a bedroom is for sleeping|bathroom 用来洗漱；bedroom 用来睡觉|bedroom/bedrooms=bedroom is for sleeping, not for brushing teeth, washing hands or drying after a bath=bedroom 是睡觉的，不是刷牙、洗手或洗完澡擦身的地方;garden/gardens=garden is outside with plants, not a room for washing=garden 在屋外，有植物，不是洗漱的房间|bath · room|one word: *bath* + *room*|是一个词：*bath* 加 *room*
      door|closing it behind you;someone waiting at it;knocking before going in|a door is what you go through; a window lets in light|door 是进出的门；window 是透光的窗|window/windows=window lets in light, but you do not walk in through it or knock before going in=window 是透光的，人不从窗户走进来，也不会敲了窗再进去;wall/walls=wall cannot be opened or closed, and you cannot go in through it=wall 不能开关，也不能从墙走进去|door|oor said like *or*|oor 读作 *or*
      window|opening it on a hot day;seeing the park;the sun coming in|a window has glass and lets in light; a wall is solid|window 有玻璃，能透光；wall 是实心的|wall/walls=wall is solid, so you cannot open it, see through it or let the sun in through it=wall 是实心的，不能打开、看不透，阳光也照不进来;floor/floors=floor is what you walk on, not something you open or look out of=floor 是踩在脚下的，不能打开，也不能往外看|win · dow|ow at the end, said like *go*|结尾是 ow，读作 *go* 里的音
      wall|a clock high up;four around my room;a picture hanging on it|a wall is one side of a room; a floor is what you walk on|wall 是房间的侧面；floor 是脚下的地面|floor/floors=floor is under your feet, so a clock is not high up on it, it does not go around a room, and pictures do not hang on it=floor 在脚下，钟不会挂在高处的地板上，地板不围着房间，画也不挂在上面;roof/roofs=roof is the top outside of a building, not inside a bedroom or living room=roof 是楼顶外面，不在卧室或客厅里|wall|a double l, and a said like *all*|双写 l，a 读作 *all* 里的音
      floor|shoes on it;the third level;a cat under the table|the floor is under your feet; a wall is one side of a room|floor 在脚下；wall 是房间的侧面|wall/walls=wall stands up at the side, so shoes do not lie on it, and you do not live *on the third wall*=wall 立在旁边，鞋不会放在墙上，也不说住在 *the third wall*;roof/roofs=roof is the top of a building, not under a table or a level you live on=roof 是楼顶，不在桌子下面，也不是人住的楼层|floor|oor said like *or*|oor 读作 *or*
      garden|playing after school;grandpa's vegetables;flowers|a garden is outside with plants; a bathroom is inside for washing|garden 在屋外，有植物；bathroom 在屋里，用来洗漱|bathroom=bathroom is a room for washing, not a place to grow vegetables, flowers or play outside=bathroom 是洗漱的房间，不是种菜、种花或在外面玩的地方;roof=roof is the top of the house, not a place with grass, vegetables and flowers=roof 是屋顶，不是有草、菜和花的地方|gar · den|ar said like *car*, and -den at the end|ar 读作 *car* 里的音，结尾是 -den
      apartment|a home on the tenth floor;two bedrooms;a hundred in one building|an apartment is a home on one floor of a big building; a garden is outside|apartment 是大楼某层里的家；garden 在屋外|garden/gardens=garden is outside with plants, not a home on the tenth floor with bedrooms=garden 在屋外，有植物，不是十楼上有卧室的家;roof/roofs=roof is the top of a building, not a home with bedrooms, and a building has one roof, not a hundred=roof 是楼顶，不是有卧室的家，一栋楼也只有一个屋顶|a · part · ment|a double p, and -ment at the end|双写 p，结尾是 -ment
      stairs|going up to my bedroom;not running on them;the bottom step|stairs are steps between floors; walls are the sides of a room|stairs 是楼层之间的台阶；walls 是房间的墙|wall/walls=walls stand up at the side, and you do not go up them or step on them=walls 立在旁边，人不会沿着墙往上走，也不会踩在墙上;door/doors=doors are for going into a room, not steps for going up=doors 是进房间用的，不是往上走的台阶|stairs|air said like *air*, and always with s|air 读作 *air*，永远带 s
      roof|the very top of the house;red on top;where rain falls|the roof is on top of a house; the floor is under your feet|roof 在房子顶上；floor 在脚下|floor=floor is under your feet inside, not the top of the house where rain falls=floor 在屋里脚下，不是淋雨的房顶;wall=wall is at the side of the house, not on top=wall 在房子侧面，不在顶上|roof|a double o, said like *moon*|双写 o，读作 *moon* 里的音
    `,
  },
});

const thingsAtHome = vocabularyTopic({
  id: "a1-words-things-at-home",
  title: t("Things at Home", "家里的东西"),
  summary: t(
    "Sofa, lamp, pictures, TV, computer, toys and cupboard, and where they are.",
    "沙发、台灯、图画、电视、电脑、玩具和柜子，以及它们在哪里。",
  ),
  intro: t(
    "In our living room there is a big **sofa**, a **lamp** **near** the window and a **TV** **between** two **pictures**. These words help you say what is in a room and where it is.",
    "我们的客厅里有一张大 **sofa**（沙发），窗户 **near**（附近）有一盏 **lamp**（台灯），两幅 **pictures**（画）**between**（之间）有一台 **TV**（电视）。这些词帮你说出房间里有什么、在哪里。",
  ),
  prerequisites: ["a1-words-home"],
  words: [
    word(
      "sofa sofas",
      "a long soft seat for two or three people",
      "沙发",
      "We sit on the {sofa} and watch TV. | The cat is sleeping on the {sofa}. | Our {sofa} is big and soft.",
      "lamp cupboard",
    ),
    word(
      "lamp lamps",
      "a thing that gives light, on a table or the floor",
      "灯；台灯",
      "Turn on the {lamp}. It's dark. | There is a {lamp} on my desk. It gives good light for reading. | The {lamp} next to my bed gives a soft light.",
      "sofa toy",
    ),
    word(
      "picture pictures",
      "a drawing, a painting or a photo",
      "图画；照片",
      "There is a {picture} of my family on the wall. | Draw a {picture} of your house. | I like the {pictures} in this book.|lamps toys",
      "lamp toy",
    ),
    word(
      "TV TVs",
      "a box with a screen that shows programs",
      "电视",
      "I watch {TV} after dinner. | What's on {TV} tonight? | We sit on the sofa and watch {TV} together.",
      "lamp computer",
    ),
    word(
      "computer computers",
      "a machine for writing, games and the internet",
      "电脑",
      "I type my homework on the {computer}. | Our school has twenty {computers} for writing and the internet.|TVs sofas | My {computer} is slow today.",
      "TV sofa",
    ),
    word(
      "toy toys",
      "a thing children play with",
      "玩具",
      "Put your {toys} in the box when you finish playing.|lamps pictures | My favorite {toy} is a small red car that I play with. | The baby is playing with a {toy}.",
      "lamp picture",
    ),
    word(
      "cupboard cupboards",
      "a piece of furniture with doors, for keeping things in",
      "柜子；橱柜",
      "The cups are in the {cupboard}. | Close the {cupboard} door. | Put the plates back in the {cupboard}.",
      "sofa lamp",
    ),
    word(
      "between",
      "in the space in the middle of two things",
      "在……之间",
      "The lamp is {between} the bed and the desk, in the middle. | B comes {between} A and C. | Tuesday is {between} Monday and Wednesday.",
      "behind near",
    ),
    word(
      "behind",
      "at the back of something",
      "在……后面",
      "The cat is {behind} the sofa. I can't see it. | The garden is {behind} the house, at the back. | Close the door {behind} you.",
      "between near",
    ),
    word(
      "near nearer nearest",
      "not far from something",
      "在……附近",
      "Our school is {near} my home. I walk there. | Is there a shop {near} here? | Don't sit {near} the window. It's cold.",
      "far between",
    ),
    word(
      "front fronts",
      "the side that faces forward; with *in* and *of*, ahead of something",
      "前面；（in front of）在……前面",
      "The car is in {front} of the house. | I sit at the {front} of the class. | Stand in {front} of the TV and you block it!",
      "behind between",
    ),
    word(
      "large larger largest",
      "big",
      "大的",
      "We have a {large} garden with many trees. It's very big. | A {large} pizza is for four people. | An elephant is a very {large} animal.",
      "small low",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Between* needs two things, as in *between the bed and the desk*; *behind* means at the back; *in front of* means ahead, and it always needs *in* and *of*.",
        "*between* 要有两样东西，比如 *between the bed and the desk*；*behind* 是在后面；*in front of* 是在前面，一定要有 *in* 和 *of*。",
      ),
      meaning: t(
        "A *lamp* gives light, a *TV* shows programs, a *computer* is for writing and the internet, and a *cupboard* has doors for keeping things in.",
        "*lamp* 照明，*TV* 播节目，*computer* 用来写东西、上网，*cupboard* 有门，用来放东西。",
      ),
      spell: t(
        "*Cupboard* is said like *cubbord*: the p is silent. *TV* is written in capitals, and *large* ends in -rge.",
        "*cupboard* 读作 *cubbord*，p 不发音。*TV* 用大写字母，*large* 以 -rge 结尾。",
      ),
    },
    notes: `
      sofa|sitting and watching TV;a sleeping cat;big and soft|a sofa is a long soft seat; a lamp gives light|sofa 是长而软的座位；lamp 是照明的灯|lamp=lamp gives light, so you cannot sit or sleep on it, and it is not soft=lamp 是照明的，不能坐或睡在上面，也不软;cupboard=cupboard has doors for keeping things in, not a soft seat for sitting or sleeping=cupboard 有门，用来放东西，不是坐或睡的软座|so · fa|o said like *go*, and a at the end|o 读作 *go* 里的音，结尾是 a
      lamp|turning it on in the dark;good light for reading;a soft light by the bed|a lamp gives light; a sofa is a seat|lamp 照明；sofa 是座位|sofa=sofa is a seat, and it does not turn on or give light=sofa 是座位，不会开，也不会发光;toy=toy is something children play with, not something that gives light=toy 是孩子玩的，不会发光|lamp|mp at the end|结尾是 mp
      picture|my family on the wall;a drawing of a house;the ones in a book|a picture is a drawing, a painting or a photo; a lamp gives light|picture 是画或照片；lamp 是灯|lamp/lamps=lamp gives light, so it does not show your family, and you do not draw one of a house or find it in a book=lamp 是灯，不会显示你的家人，也不是画出来的房子或书里的插图;toy/toys=toy is something you play with, not a drawing of your family or a house=toy 是玩的，不是画着家人或房子的画|pic · ture|-ture at the end, said like *cher*|结尾是 -ture，读作 *cher*
      TV|watching after dinner;what's on tonight;watching together on the sofa|a TV shows programs; a lamp only gives light|TV 播节目；lamp 只照明|lamp=lamp gives light, but you do not watch it or ask what's on it=lamp 是照明的，人不会看它，也不会问上面在演什么;computer=computer is for writing and the internet, and we say *on the computer*, not *watch computer* or *what's on computer*=computer 用来写东西、上网，说 *on the computer*，不说 *watch computer* 或 *what's on computer*|T · V|two capital letters, T and V|两个大写字母：T 和 V
      computer|typing homework;twenty for writing and the internet;slow today|a computer is for writing and the internet; a TV shows programs|computer 用来写东西、上网；TV 播节目|tv/tvs=TV shows programs to watch, not something you type homework on or use for the internet=TV 是看节目的，不是打作业、上网用的;sofa/sofas=sofa is a seat, not a machine that types or gets slow=sofa 是座位，不是能打字、会变慢的机器|com · pu · ter|u said like *you*, and -ter at the end|u 读作 *you*，结尾是 -ter
      toy|things to put away after playing;a small red car to play with;something a baby plays with|a toy is something children play with; a lamp gives light|toy 是孩子玩的；lamp 是照明的|lamp/lamps=lamp gives light, not something children play with=lamp 是照明的，不是孩子玩的;picture/pictures=picture is something you look at, not a small car you play with=picture 是看的，不是能玩的小汽车|toy|oy said like *boy*|oy 读作 *boy* 里的音
      cupboard|cups inside;its door;plates put back in it|a cupboard has doors for keeping things; a sofa is a seat|cupboard 有门，用来放东西；sofa 是座位|sofa=sofa is a soft seat with no door and nothing kept inside=sofa 是软座，没有门，里面也不放东西;lamp=lamp gives light, with no door and nothing kept inside=lamp 是照明的，没有门，里面也不放东西|cup · board|a silent p: said like *cubbord*|p 不发音，读作 *cubbord*
      between|the lamp in the middle of the bed and the desk;B with A and C;Tuesday with Monday and Wednesday|between is in the middle of two things; behind is at the back|between 是在两者中间；behind 是在后面|behind=behind is at the back of one thing, not in the middle of two=behind 是在某物后面，不是在两者中间;near=near means not far, but it does not put B in the middle of A and C=near 是附近，不能说 B 在 A 和 C 中间|be · tween|a double e in the middle|中间双写 e
      behind|a cat hidden by the sofa;a garden at the back;a door you close as you go|behind means at the back; between means in the middle of two|behind 是在后面；between 是在两者中间|between=between needs two things, as in *between A and B*, but here there is only one=between 要有两样东西，比如 *between A and B*，可这里只有一样;near=near means not far, but the sentences show the back of something, out of sight=near 是附近，可句子说的是在后面、看不见|be · hind|i said like *eye*|i 读作 *eye*
      near|a school I can walk to;a shop not far from here;a cold window|near means not far; far means a long way away|near 是近；far 是远|far=far needs *from* before a place, as in *far from home*, and it is the opposite of near=far 要和 *from* 连用，比如 *far from home*，意思和 near 相反;between=between needs two things, as in *between A and B*, not one place=between 要有两样东西，比如 *between A and B*，不是一个地方|near|ear said like *ear*|ear 读作 *ear*
      front|a car ahead of the house;my seat facing the board;blocking the TV|in front of means ahead; behind means at the back|in front of 是在前面；behind 是在后面|behind=behind does not go between *in* and *of*, and it means at the back, not ahead=behind 不放在 *in* 和 *of* 之间，意思是在后面，不是前面;between=between does not go between *in* and *of*, and it needs two things=between 不放在 *in* 和 *of* 之间，而且要有两样东西|front|o said like the u in *up*|o 读作 *up* 里的 u
      large|a garden with many trees;a pizza for four;an elephant|large means big; small means little|large 是大；small 是小|small=small is the opposite of big, but the garden, the pizza for four and the elephant are big=small 是小，可花园、四人份的披萨和大象都很大;low=low means near the ground, not big in size=low 是低，不是大|large|-rge at the end, said like *larj*|结尾是 -rge，读作 *larj*
    `,
  },
});

const housework = vocabularyTopic({
  id: "a1-words-housework",
  title: t("Housework", "家务"),
  summary: t(
    "Cleaning, washing, helping, making, putting things away; dirty dishes and towels.",
    "打扫、洗、帮忙、做、把东西放好；脏盘子和毛巾。",
  ),
  intro: t(
    "On Saturday I **help** Mom. I **wash** the **dirty** **dishes**, and she **cleans** the floor. These words help you talk about the jobs you do at home.",
    "星期六我 **help**（帮）妈妈干活。我 **wash**（洗）**dirty**（脏的）**dishes**（盘子），她 **cleans**（打扫）地板。这些词帮你说出在家做的家务。",
  ),
  prerequisites: ["a1-words-things-at-home"],
  words: [
    word(
      "clean cleans cleaned cleaning cleaner cleanest",
      "not dirty; to make something not dirty",
      "干净的；打扫",
      "I {clean} my room on Saturday, so it isn't dirty. | I washed my hands. They are {clean} now. | Mom is {cleaning} the kitchen.|dirtying owning",
      "dirty own",
    ),
    word(
      "wash washes washed washing",
      "to clean something with water",
      "洗",
      "{Wash} your hands before dinner. | I {wash} the dishes after dinner. | Dad is {washing} the car with soap and water.|watching putting",
      "watch put",
    ),
    word(
      "help helps helped helping",
      "to do something for someone so that it is easier for them",
      "帮助",
      "Can you {help} me, please? This box is big. | I {help} my mom in the kitchen. | Thank you for your {help}!",
      "use own",
    ),
    word(
      "dish dishes",
      "a plate or a bowl; food made in a special way",
      "盘子；菜肴",
      "I wash the plates and other {dishes} after dinner.|towels cupboards | Dumplings are my favorite {dish}. | Put the clean {dishes} on the table for dinner.|towels cupboards",
      "towel cupboard",
    ),
    word(
      "make makes made making",
      "to build or create something; to cook",
      "做；制作",
      "I {make} my bed every morning. | Dad is {making} pizza for dinner.|doing using | We {made} a cake for Mom's birthday.|did used",
      "do use",
    ),
    word(
      "put puts putting",
      "to move something to a place",
      "放",
      "{Put} your shoes under the bed. | Where did you {put} my bag? — It's on the chair. | Please {put} the toys in the box.",
      "own use",
    ),
    word(
      "use uses used using",
      "to do something with a thing",
      "使用",
      "Can I {use} your pen? | We {use} a knife to cut bread. | I'm {using} the computer for my homework.|owning putting",
      "own put",
    ),
    word(
      "dirty dirtier dirtiest",
      "not clean",
      "脏的",
      "Your hands are {dirty}. Go and wash them. | Put the {dirty} clothes in the washing machine. | The floor is {dirty}. Let's clean it.",
      "clean own",
    ),
    word(
      "own owns owned owning",
      "to have something that is yours; belonging to you",
      "拥有；自己的",
      "I have my {own} room. | Do you {own} a car? — Yes, we bought one last year. | My uncle {owns} a shop.|uses helps",
      "use help",
    ),
    word(
      "towel towels",
      "a piece of soft cloth for drying yourself",
      "毛巾",
      "Dry your hands with a {towel}. | Take a {towel} to the beach. | Hang your wet {towel} up after your bath.",
      "dish lamp",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "We *make* a bed, a cake or pizza, but we *do* homework. *Clean* and *dirty* are opposites, so look for a clue like *washed* or *let's clean it*.",
        "我们 *make* 床铺、蛋糕、披萨，但 *do* 作业。*clean* 和 *dirty* 意思相反，找找 *washed*、*let's clean it* 这样的线索。",
      ),
      meaning: t(
        "*Wash* means to clean with water; *use* means to do something with a thing; *own* means it is yours. A *towel* dries you, and a *dish* holds food.",
        "*wash* 是用水洗；*use* 是用某样东西；*own* 是属于自己。*towel* 用来擦干，*dish* 用来盛食物。",
      ),
      spell: t(
        "*Put* stays *put* in the past and doubles t in *putting*; *make* becomes *made*; *dish* adds -es in *dishes*, and *towel* ends in -el.",
        "*put* 的过去式不变，*putting* 双写 t；*make* 变 *made*；*dish* 的复数加 -es；*towel* 以 -el 结尾。",
      ),
    },
    notes: `
      clean|my room so it isn't dirty;washed hands;the kitchen|clean means not dirty; dirty means not clean|clean 是干净；dirty 是脏|dirty/dirtying=dirty is the opposite of clean, but here someone washes or makes things tidy=dirty 是脏，和干净相反，可这里是在洗或收拾干净;own/owning=own means to have something that is yours, not to make it not dirty=own 是拥有，不是弄干净|clean|ea said like *eat*|ea 读作 *eat* 里的音
      wash|hands before dinner;dishes after dinner;a car with soap and water|you wash with water; you watch with your eyes|wash 是用水洗；watch 是用眼睛看|watch/watching=watch means to look at something for a time, not to clean it with water=watch 是观看，不是用水洗;put/putting=put means to move something to a place, not to clean it=put 是放，不是洗|wash|a said like the o in *hot*, and sh at the end|a 读作 *hot* 里的 o，结尾是 sh
      help|a big box;my mom in the kitchen;thanks for doing something for me|you help someone; you use a thing|help 是帮人；use 是用东西|use=use means to do something with a thing, not to make things easier for a person=use 是使用东西，不是帮人;own=own means to have something that is yours, not to do something for someone=own 是拥有，不是帮人做事|help|lp at the end|结尾是 lp
      dish|plates after dinner;dumplings;plates on the table|a dish holds food; a towel dries you|dish 盛食物；towel 用来擦干|towel/towels=towel is soft cloth for drying yourself, not a plate or a bowl, and dumplings are not a towel=towel 是擦身体的软布，不是盘子或碗，饺子也不是毛巾;cupboard/cupboards=cupboard keeps dishes inside, but it is not washed after dinner or eaten=cupboard 是放盘子的柜子，饭后不洗，也不能吃|dish|sh at the end, and -es in *dishes*|结尾是 sh，复数是 *dishes*
      make|my bed;pizza for dinner;a cake for Mom|you make a bed or a cake; you do homework|make 床铺或蛋糕；do 作业|do/doing/did=do goes with homework or a job, not with a bed, pizza or a cake=do 跟作业或工作连用，不跟床铺、披萨或蛋糕;use/using/used=use means to do something with a thing that is already there, not to cook or put it in order=use 是用现成的东西，不是做饭或整理|make|a silent e, and the past *made*|词尾 e 不发音，过去式是 *made*
      put|shoes under the bed;my bag on the chair;toys in the box|you put something in a place; you use it to do something|put 是放到某处；use 是用来做事|own=own means to have something that is yours, not to move it to a place=own 是拥有，不是放到某处;use=use means to do something with a thing, not to move it to a place like under the bed or in a box=use 是使用，不是把东西放到床下或盒子里|put|a short u, and *put* stays the same in the past|短元音 u，过去式不变，还是 *put*
      use|a pen;a knife for cutting;a computer for homework|you use a thing to do something; you own a thing that is yours|use 是用；own 是拥有|own/owning=own means it is yours, but here the thing is being used for a job, and you do not *own* a knife to cut=own 是归你所有，可这里是用东西做事，不说 *own* 一把刀来切;put/putting=put needs a place after it, as in *put it on the table*=put 后面要跟地方，比如 *put it on the table*|use|u said like *you*, and a silent e|u 读作 *you*，词尾 e 不发音
      dirty|hands to wash;clothes for the washing machine;a floor to clean|dirty means not clean; clean means not dirty|dirty 是脏；clean 是干净|clean=clean is the opposite of dirty, but here the hands, clothes or floor need washing=clean 是干净，可这里的手、衣服或地板需要洗;own=own means yours, not needing a wash=own 是自己的，不是需要洗|dir · ty|ir said like *er*, and -ty at the end|ir 读作 *er*，结尾是 -ty
      own|my room for me only;a car we bought;a shop that is my uncle's|own means to have something that is yours; use means to do something with it|own 是拥有；use 是使用|use/uses=use means to do something with a thing, not that it belongs to you, and *my use room* is not English=use 是使用，不是归你所有，也没有 *my use room* 的说法;help/helps=help means to do something for someone, not that a thing is yours=help 是帮人做事，不是某物属于你|own|ow said like *go*, so not like *town*|ow 读作 *go* 里的音，不像 *town*
      towel|drying hands;going to the beach;hanging it up after a bath|a towel dries you; a dish holds food|towel 擦干身体；dish 盛食物|dish=dish holds food, so you do not dry yourself with it, take it to the beach for swimming or hang it up wet after a bath=dish 盛食物，不能擦身体，不是带去海边游泳用的，洗澡后也不会挂起来;lamp=lamp gives light, not something you dry yourself with=lamp 是照明的，不能擦干身体|tow · el|ow said like *cow*, and -el at the end|ow 读作 *cow* 里的音，结尾是 -el
    `,
  },
});

// There is and there are.

const oneThing: readonly string[] = [
  "a lamp",
  "a sofa",
  "a computer",
  "a big window",
  "a picture",
  "an old TV",
  "a cupboard",
  "a desk",
  "a toy box",
];
const manyThings: readonly string[] = [
  "two beds",
  "three chairs",
  "some books",
  "four windows",
  "two lamps",
  "some toys",
  "five pictures",
  "two doors",
];
const rooms: readonly string[] = [
  "in my room",
  "in our house",
  "in the bedroom",
  "in the kitchen",
  "in the apartment",
  "in the living room",
];

/** thereAll are every thing in every room; each bank starts at its own place in them. */
const thereAll = interleave([
  everyPair(oneThing, rooms).map(([thing, room]) => ({ thing, room, be: "is", other: "are" })),
  everyPair(manyThings, rooms).map(([thing, room]) => ({ thing, room, be: "are", other: "is" })),
]);

const thereItems = (skip: number) => [...thereAll.slice(skip), ...thereAll.slice(0, skip)];

const thereChoiceBank: readonly ChoiceItem[] = thereItems(0).map(
  ({ thing, room, be, other }): ChoiceItem => [`There ___ ${thing} ${room}.`, be, [other, "have"]],
);

const thereFixBank: readonly TypedItem[] = thereItems(22).map(({ thing, room, be }, k): TypedItem => {
  const shown = k % 2 === 0 ? `Have ${thing} ${room}.` : `There have ${thing} ${room}.`;
  return {
    shown,
    accepted: [be === "is" ? `[There is|There's] ${thing} ${room}.` : `There are ${thing} ${room}.`],
    canonical: `There ${be} ${thing} ${room}.`,
    wrong: [shown, `There ${be === "is" ? "are" : "is"} ${thing} ${room}.`],
  };
});

const thereQuestionBank: readonly TypedItem[] = thereItems(5).map(({ thing, room, be }): TypedItem => {
  const any = thing.replace(/^(some|two|three|four|five)\b/u, "any");
  const asked = be === "is" ? thing : any;
  return {
    shown: `There ${be} ${thing} ${room}.`,
    accepted: [`${sentenceCase(be)} there ${asked} ${room}?`],
    wrong: [`There ${be} ${asked} ${room}?`, `Have ${asked} ${room}?`],
  };
});

/** thereReason says why a thing takes there is or there are, in every locale. */
const thereReason = (thing: string, be: string): Text =>
  be === "is"
    ? t(`*${thing}* is one thing, so it takes *There is*`, `*${thing}* 是一样东西，所以用 *There is*`)
    : t(`*${thing}* is more than one thing, so it takes *There are*`, `*${thing}* 是多样东西，所以用 *There are*`);

/** haveNotThere says why have cannot say what is in a place, in every locale. */
const haveNotThere = t(
  "*have* says what a person owns; to say what is in a place, English starts with *There is* or *There are*, not with *have* as Chinese uses 有.",
  "*have* 说的是某人拥有什么；说某处有什么，英语要用 *There is* 或 *There are* 开头，不能像中文“有”那样用 *have*。",
);

const thereIsAndThereAre: TopicDef = {
  id: "there-is-and-there-are",
  title: t("There Is and There Are", "there is 和 there are"),
  summary: t(
    "There is a lamp. There are two beds. English says what is in a place with there is and there are.",
    "There is a lamp. There are two beds. 英语用 there is 和 there are 说某处有什么。",
  ),
  intro: t(
    "To say what is in a living room, English says *There is a big window* (one thing) and *There are three chairs* (more than one)—never *Have a big window*. In this topic, you match *There is* and *There are* to singular and plural items, replace *Have* mistakes, and ask *Is there…?* / *Are there…?* questions.",
    "说客厅里有什么，英语说 *There is a big window*（单数）和 *There are three chairs*（复数）——绝不说 *Have a big window*。本主题带你区分 *There is* 与 *There are*、改正误用 *Have* 的句子，并写出 *Is there…?* / *Are there…?* 问句。",
  ),
  prerequisites: ["plural-nouns-with-s", "a1-words-home"],
  encompasses: [
    { topic: "plural-nouns-with-s", weight: 0.3 },
    { topic: "a1-words-home", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("There is or there are", "there is 还是 there are"),
      t(
        "To say what is in a place, start with *there*: *There is a lamp in my room.* Use *is* for one thing and *are* for more: *There are two beds.*\n\nThe short form of *there is* is *there's*.\n\n> **Watch out.** Look *after* the blank to decide between *is* and *are*: *a/an* + singular noun takes *is*, while a number or *some* + plural noun takes *are*—and never use *have* after *There*.",
        "说某处有什么，句子以 *there* 开头：*There is a lamp in my room.* 一样东西用 *is*，多样东西用 *are*：*There are two beds.*\n\n*there is* 的缩写是 *there's*。\n\n> **注意。** 看空白*后面*的名词来定 *is* 还是 *are*：*a/an* 加单数用 *is*，数字或 *some* 加复数用 *are*；*There* 后面绝不能接 *have*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        thereChoiceBank,
        (right, shown) => {
          const thing = shown.split("___ ")[1]?.split(" in ")[0] ?? "";
          const reason = thereReason(thing, right);
          return t(
            `${reason.en}: ${shown.replace("___", `*${right}*`)}\n\n**Check.** Check whether *${thing}* is singular (*is*) or plural (*are*), and confirm the sentence uses *There ${right}*, never *have*.`,
            `${reason["zh-CN"]}：${shown.replace("___", `*${right}*`)}\n\n**检验。** 核对 *${thing}* 是单数（*is*）还是复数（*are*），并确认用的是 *There ${right}* 而非 *have*。`,
          );
        },
        (wrong, _right, shown) => {
          const thing = shown.split("___ ")[1]?.split(" in ")[0] ?? "";
          if (wrong === "have") return haveNotThere;
          return wrong === "are"
            ? t(`*are* is for more than one thing, but *${thing}* is one.`, `*are* 用于多样东西，可 *${thing}* 只是一样。`)
            : t(`*is* is for one thing, but *${thing}* is more than one.`, `*is* 用于一样东西，可 *${thing}* 不止一样。`);
        },
      ),
    ),
    point(
      "fix",
      t("Not have, but there is", "不用 have，用 there is"),
      t(
        "Chinese says *yǒu* (有) for both *have* and *there is*, so learners write *Have a lamp in my room.* In English, a place does not *have* here: say *There is a lamp in my room.*\n\n> **Watch out.** Replace *Have* or *There have* with *There is* (singular) or *There are* (plural)—never leave *have* in the sentence.",
        "中文“有”既表示 *have*，也表示 *there is*，所以学习者常写 *Have a lamp in my room.* 或 *There have two beds.* 说某处有某物时，英语要用 *There is* 或 *There are*：*There is a lamp in my room.*\n\n> **注意。** 把 *Have* 或 *There have* 换成 *There is*（单数）或 *There are*（复数）——句中绝不能保留 *have*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Fix the sentence. Start with There.", "改正这个句子，以 There 开头。"),
        thereFixBank,
        (right) => {
          const be = right.startsWith("There is") ? "is" : "are";
          const thing = right.replace(/^There (is|are) /u, "").split(" in ")[0] ?? "";
          const reason = thereReason(thing, be);
          return t(
            `A place does not *have* things in English; to say what is in it, start with *There*. ${reason.en}: ${right}\n\n**Check.** Verify that *have* is gone and that *There ${be}* matches the number of *${thing}*.`,
            `英语里地点不能 *have* 东西；说某处有什么，要以 *There* 开头。${reason["zh-CN"]}：${right}\n\n**检验。** 确认 *have* 已去掉，且 *There ${be}* 与 *${thing}* 的单复数一致。`,
          );
        },
        thereIsAndThereAreFixNot,
      ),
    ),
    point(
      "ask",
      t("Is there? Are there?", "Is there? Are there?"),
      t(
        "For a question, put *is* or *are* first: *Is there a lamp in your room? Are there any toys?* In a question, *some* and a number become *any*.\n\n> **Watch out.** Make *all* required changes together: swap *There is/are* to *Is/Are there*, switch *some* or a plural number (*two*, *three*) to *any*, and end with a question mark.",
        "疑问句把 *is* 或 *are* 放到句首：*Is there a lamp in your room? Are there any toys?* 疑问句中，*some* 和数字要换成 *any*。\n\n> **注意。** 几处改动要一起做：把 *There is/are* 倒装成 *Is/Are there*，把复数前的 *some* 或数字（*two*、*three*）换成 *any*，句末加问号。",
      ),
      typedGenerator(
        "sentence",
        t("Make the sentence a question.", "把句子改成疑问句。"),
        thereQuestionBank,
        (right, shown) => {
          const be = right.split(" ")[0] ?? "";
          const changed = / any /u.test(right) && !/ any /u.test(shown);
          return t(
            `For a question, put *${be}* before *there*${changed ? ", and *some* or a number becomes *any*" : " and end with a question mark"}: ${right}\n\n**Check.** Verify the question frame: *${be} there* at the front, ${changed ? "*any* before the plural noun, " : ""}and a question mark at the end.`,
            `疑问句把 *${be}* 放到 *there* 前面${changed ? "，*some* 或数字要换成 *any*" : "，句末用问号"}：${right}\n\n**检验。** 核对问句结构：句首是 *${be} there*，${changed ? "复数名词前已换成 *any*，" : ""}句末是问号。`,
          );
        },
        thereIsAndThereAreAskNot,
      ),
    ),
  ],
};

// Prepositions of place.

const furniture: readonly string[] = ["lamp", "sofa", "bed", "desk", "chair", "cupboard", "TV", "window", "door"];
const small: readonly string[] = ["ball", "cat", "dog", "bag", "book", "toy car", "phone"];
const large: readonly string[] = ["table", "bed", "chair", "desk", "sofa"];
const near: readonly string[] = ["shop", "school", "park", "station", "zoo", "hospital"];

type Scene = { readonly text: string; readonly right: string; readonly wrong: readonly string[] };

/** scene k describes where one thing is from another, without naming the word. */
const scene = (k: number): Scene => {
  const j = Math.floor(k / 7);
  const gap = 1 + (Math.floor(j / furniture.length) % (furniture.length - 2));
  const a = furniture[j % furniture.length] ?? "lamp";
  const b = furniture[(j + gap) % furniture.length] ?? "bed";
  const c = furniture[(j + gap + 1) % furniture.length] ?? "desk";
  const s = small[j % small.length] ?? "ball";
  const l = large[(j + Math.floor(j / small.length)) % large.length] ?? "table";
  switch (k % 7) {
    case 0:
      return {
        text: `You can't see the ${s}. The ${l} is in front of it. The ${s} is ___ the ${l}.`,
        right: "behind",
        wrong: ["in front of", "between"],
      };
    case 1:
      return { text: `The ${a} is behind the ${b}, so the ${b} is ___ the ${a}.`, right: "in front of", wrong: ["behind", "between"] };
    case 2:
      return { text: `The ${a} and the ${b} are side by side. The ${a} is ___ the ${b}.`, right: "next to", wrong: ["between", "under"] };
    case 3:
      return {
        text: `The ${a} is on the left, the ${c} is on the right, and the ${b} is in the middle. The ${b} is ___ the ${a} and the ${c}.`,
        right: "between",
        wrong: ["behind", "in front of"],
      };
    case 4:
      return {
        text: `The ${s} is on the floor, and the ${l} is over it. The ${s} is ___ the ${l}.`,
        right: "under",
        wrong: ["on", "behind"],
      };
    case 5:
      return { text: `The ${l} is under the ${s}, so the ${s} is ___ the ${l}.`, right: "on", wrong: ["under", "between"] };
    default:
      return {
        text: `The ${near[j % near.length] ?? "shop"} is only ${["two", "three", "five"][Math.floor(j / near.length) % 3]} minutes from my home. It's ___ my home.`,
        right: "near",
        wrong: ["between", "under"],
      };
  }
};

const scenes = (from: number, count: number): readonly Scene[] => {
  const seen = new Map<string, Scene>();
  for (let k = from; seen.size < count && k < from + 1000; k++) {
    const s = scene(k);
    if (!seen.has(s.text)) seen.set(s.text, s);
  }
  return [...seen.values()];
};

const placeChoiceBank: readonly ChoiceItem[] = scenes(0, 120).map(({ text, right, wrong }): ChoiceItem => [text, right, wrong]);
const placeTypedBank: readonly TypedItem[] = scenes(500, 110).map(
  ({ text, right, wrong }): TypedItem => ({ shown: text, accepted: [right], wrong }),
);

/** placeMeaning says what each place word means, in every locale. */
const placeMeaning: Record<string, Text> = {
  behind: t("at the back of something, hidden by it", "在……后面，被它挡住"),
  "in front of": t("at the front of something, the other way round from *behind*", "在……前面，和 *behind* 相反"),
  "next to": t("side by side with something", "紧挨着"),
  between: t("in the middle of two things", "在两者之间"),
  under: t("below something", "在……下面"),
  on: t("on top of something", "在……上面"),
  near: t("not far from something", "在……附近，不远"),
};

const placeWhy = (right: string, shown: string) => {
  const stop = shown.lastIndexOf(". ", shown.indexOf("___"));
  const sentence = shown.slice(stop < 0 ? 0 : stop + 2).replace("___", `*${right}*`);
  return t(
    `*${right}* means ${placeMeaning[right]?.en}, which is just what the words before it describe: ${sentence}\n\n**Check.** Picture the two objects from the clue sentence—check which object is the subject of the final sentence and confirm *${right}* puts it in the exact spot described.`,
    `*${right}* 的意思是${placeMeaning[right]?.["zh-CN"]}，正是前面描述的位置：${sentence}\n\n**检验。** 按前一句在脑中摆出两样东西的位置——看清最后一句的主语是哪一样，确认 *${right}* 准确说出了它的位置。`,
  );
};

/** whyNotPlace says what a wrong place word means, which the scene does not describe. */
const whyNotPlace = (wrong: string): Text =>
  t(
    `*${wrong}* means ${placeMeaning[wrong]?.en}, but that is not where the words before the gap put it.`,
    `*${wrong}* 的意思是${placeMeaning[wrong]?.["zh-CN"]}，可前面描述的位置不是这样。`,
  );

const prepositionsOfPlace: TopicDef = {
  id: "prepositions-of-place",
  title: t("Next To, Behind and Between", "next to、behind 和 between"),
  summary: t("The lamp is next to the bed. The cat is between the chairs.", "The lamp is next to the bed. The cat is between the chairs."),
  intro: t(
    "If the lamp is on the left, the desk is on the right, and the bed is in the middle, then *The bed is between the lamp and the desk.* Everyday place words—*next to*, *behind*, *in front of*, *between*, *near*, *on*, and *under*—pin down exact positions before the noun. In this topic, you read spatial clues and choose or type the matching place preposition.",
    "如果台灯在左、书桌在右、床在中间，就可以说 *The bed is between the lamp and the desk.* 英语用 *next to*、*behind*、*in front of*、*between*、*near*、*on* 和 *under* 等方位词放在名词前精确定位。本主题带你根据空间描述选择并写出对应的方位词。",
  ),
  prerequisites: ["in-on-and-under", "a1-words-things-at-home"],
  encompasses: [
    { topic: "in-on-and-under", weight: 0.4 },
    { topic: "a1-words-things-at-home", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Where things are", "东西在哪里"),
      t(
        "*next to*: side by side. *behind*: at the back. *in front of*: at the front, the other way round from *behind*. *between*: in the middle of two things. *near*: not far. And *in*, *on* and *under*.\n\nThe word comes before the place: *The cat is behind the sofa.*\n\n> **Watch out.** Watch reversed sentences carefully: if A is *behind* B, then B is *in front of* A—check *which* object sits before `is ___`.",
        "*next to*：紧挨着。*behind*：在后面。*in front of*：在前面，和 *behind* 相反。*between*：在两者之间。*near*：在附近。还有 *in*、*on*、*under*。\n\n中文说“在沙发后面”，方位词放在后面；英语正好相反，方位词放在前面：*The cat is behind the sofa.*\n\n> **注意。** 留心主宾互换的句子：如果 A 在 B 后面（*behind*），那么 B 就在 A 前面（*in front of*）——一定要看清 `is ___` 前面是哪样东西。",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), placeChoiceBank, placeWhy, whyNotPlace),
    ),
    point(
      "type",
      t("Writing the place words", "写出方位词"),
      t(
        "Read where the things are and type the word or words: *behind*, *in front of*, *next to*, *between*, *near*, *on* or *under*—for example, *The shop is two minutes from my home. It's **near** my home.*\n\n> **Watch out.** Do not drop small words in multi-word prepositions: write all three words of *in front of* and both words of *next to*.",
        "读一读东西的位置，输入方位词：*behind*、*in front of*、*next to*、*between*、*near*、*on* 或 *under*，例如 *The shop is two minutes from my home. It's **near** my home.*\n\n> **注意。** 多词方位短语不要漏词：*in front of* 三个词要写全，*next to* 两个词要写全。",
      ),
      typedGenerator(
        "word-form",
        t("Type the word or words for the gap.", "输入填入空白处的词。"),
        placeTypedBank,
        placeWhy,
        prepositionsOfPlaceTypeNot,
      ),
    ),
  ],
};

// Writing about a room.

const roomThings: readonly (readonly [thing: string, many: boolean])[] = [
  ["a desk", false],
  ["a lamp", false],
  ["two chairs", true],
  ["a big sofa", false],
  ["some books", true],
  ["a picture", false],
  ["three toys", true],
  ["a small table", false],
  ["a computer", false],
];

const roomPlaces: readonly string[] = [
  "next to the window",
  "behind the door",
  "near the bed",
  "under the window",
  "in front of the cupboard",
];

const roomItems = pairUp(42, roomThings, roomPlaces).map(([[thing, many], place]) => ({
  note: `${thing} / ${place}`,
  right: `There ${many ? "are" : "is"} ${thing} ${place}.`,
  pattern: many ? `There are ${thing} ${place}.` : `[There is|There's] ${thing} ${place}.`,
  wrongBe: `There ${many ? "is" : "are"} ${thing} ${place}.`,
  have: `Have ${thing} ${place}.`,
}));

const roomChoiceBank: readonly ChoiceItem[] = roomItems.map(({ note, right, wrongBe, have }): ChoiceItem => [note, right, [wrongBe, have]]);
const roomTypedBank: readonly TypedItem[] = roomItems.map(
  ({ note, right, pattern, wrongBe, have }): TypedItem => ({
    shown: note,
    accepted: [pattern],
    canonical: right,
    wrong: [wrongBe, have],
  }),
);

/** roomWhy explains a sentence about a room from its note: there is or there are, then the thing, then the place. */
const roomWhy = (right: string, shown: string): Text => {
  const [thing = "", place = ""] = shown.split(" / ");
  const be = right.startsWith("There is") ? "is" : "are";
  const reason = thereReason(thing, be);
  return t(
    `${reason.en}; then comes the thing, and the place *${place}* goes at the end: ${right}\n\n**Check.** Verify the order *There ${be} + ${thing} + ${place}.*—matching *${be}* to *${thing}* and keeping the place at the end.`,
    `${reason["zh-CN"]}；后面先写东西，位置 *${place}* 放在句末：${right}\n\n**检验。** 核对语序 *There ${be} + ${thing} + ${place}.*——确认 *${be}* 与 *${thing}* 单复数一致，且方位短语放在句末。`,
  );
};

const writingAboutARoom: TopicDef = {
  id: "writing-about-a-room",
  title: t("Writing About a Room", "描写一个房间"),
  summary: t(
    "Turn notes into sentences: a desk / next to the window becomes There is a desk next to the window.",
    "把笔记写成句子：a desk / next to the window 写成 There is a desk next to the window.",
  ),
  intro: t(
    "Turn a room note like `two chairs / near the bed` into natural English: *There are two chairs near the bed.* Start with *There is* or *There are* to match the item, name the item next, and place the location phrase at the end. In this topic, you pick and write clean room-description sentences.",
    "把房间笔记 `two chairs / near the bed` 写成自然的英语：*There are two chairs near the bed.* 先按物品单复数用 *There is* 或 *There are* 开头，再写物品，最后把位置放在句末。本主题带你选出并写出规范的房间描写句。",
  ),
  prerequisites: ["there-is-and-there-are", "prepositions-of-place"],
  encompasses: [
    { topic: "there-is-and-there-are", weight: 0.3 },
    { topic: "prepositions-of-place", weight: 0.3 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives a thing and a place. The sentence starts with *There is* for one thing or *There are* for more, then the thing, then the place.\n\n*a desk / next to the window* → *There is a desk next to the window.*\n\n> **Watch out.** Never start with *Have* (*Have a desk…*), and check whether the item is singular (*a lamp* -> *There is*) or plural (*some books* -> *There are*).",
        "笔记给出一样东西和一个位置。写成句子时，一样东西用 *There is* 开头，多样东西用 *There are*，后面先写东西，再写位置。\n\n*a desk / next to the window* → *There is a desk next to the window.*\n\n中文常把位置放在前面（“窗户旁边有一张书桌”），英语一般把位置放在句末。\n\n> **注意。** 绝不用 *Have* 开头（如 *Have a desk…*），同时核对物品是单数（*a lamp* -> *There is*）还是复数（*some books* -> *There are*）。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"),
        roomChoiceBank,
        (right, shown) => roomWhy(right, shown),
        (wrong, _right, _shown, position) =>
          position === 0
            ? wrong.startsWith("There are")
              ? t("This uses *are*, but the note gives just one thing.", "这句用了 *are*，可笔记里只有一样东西。")
              : t("This uses *is*, but the note gives more than one thing.", "这句用了 *is*，可笔记里不止一样东西。")
            : haveNotThere,
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Write a whole sentence for the note: *There is* for one thing or *There are* for more, then the thing, then the place—for example, *some books / under the window* → *There are some books under the window.* Start with a capital letter and end with a period.\n\n> **Watch out.** Keep every word of the note's item and place phrase intact, and put the place phrase at the end of the sentence.",
        "根据笔记写一个完整的句子：一样东西用 *There is*，多样东西用 *There are*，后面先写东西，再写位置，例如 *some books / under the window* → *There are some books under the window.* 句首大写，句末加句号。\n\n> **注意。** 完整保留笔记中的物品和方位短语，并把方位短语放在句末。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the note.", "根据笔记写一个句子。"),
        roomTypedBank,
        roomWhy,
        writingAboutARoomWriteNot,
      ),
    ),
  ],
};

/** topics are the topics of the unit Home. */
export const topics: readonly TopicDef[] = [
  home.topic,
  thingsAtHome.topic,
  housework.topic,
  thereIsAndThereAre,
  prepositionsOfPlace,
  writingAboutARoom,
];

/** vocabulary are the words the unit Home teaches. */
export const vocabulary: readonly WordBatch[] = [home.batch, thingsAtHome.batch, housework.batch];
