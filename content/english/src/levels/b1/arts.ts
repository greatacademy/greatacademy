// B1, unit 12: Arts and Entertainment. The arts, film and theater, music, books and stories, entertainment, describing
// art and going out; phrasal verbs; writing a review.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { everyPair, vocabularyTopic, word } from "../words.ts";
import { phrasalVerbsPronounNot } from "./mistakes.ts";

const arts = vocabularyTopic({
  id: "b1-words-arts",
  title: t("The Arts", "艺术"),
  summary: t(
    "Painters, sculptures and exhibitions; artworks and portraits; photography, crafts and pottery; artistic and creativity; masterpieces and canvas.",
    "画家、雕塑和展览；艺术品和肖像；摄影、手工艺和陶器；有艺术天赋的和创造力；杰作和画布。",
  ),
  intro: t(
    "At the **exhibition**, Lin stood in front of a **portrait** painted on a huge **canvas**, then walked past a bronze **sculpture** of a horse. These words help you talk about art, the people who make it and the things they make.",
    "在 **exhibition**（展览）上，林站在一幅画在巨大 **canvas**（画布）上的 **portrait**（肖像）前，然后走过一座青铜马 **sculpture**（雕塑）。这些词帮你谈论艺术、创作艺术的人和他们做出的作品。",
  ),
  prerequisites: ["a1-words-hobbies"],
  words: [
    word(
      "painter painters",
      "a person who paints pictures",
      "画家",
      "Van Gogh was a Dutch {painter} who used thick oil paint and a brush. | Qi Baishi was a famous Chinese {painter} of shrimps and flowers in ink. | The {painter} mixed her colors and worked on the picture for a year.",
      "sculptor photographer",
    ),
    word(
      "sculpture sculptures",
      "a work of art made by shaping stone, wood, metal or clay",
      "雕塑",
      "There is a bronze {sculpture} of a horse in the park that children like to climb on. | The museum has marble {sculptures} from ancient Greece that you can walk all the way around.|paintings portraits | She bent old pieces of metal into a tall {sculpture} of a bird.",
      "painting portrait",
    ),
    word(
      "exhibition exhibitions",
      "a public show of paintings, photos or other things",
      "展览",
      "The {exhibition} of Picasso's paintings at the city gallery ends on Sunday. | The {exhibition} of old photos will be in the town hall until May. | At the end of the year, the school put the students' art on the walls for a two-week {exhibition}.",
      "concert gallery",
    ),
    word(
      "artwork artworks",
      "a painting, a sculpture or another object made by an artist",
      "艺术品",
      "The gallery sells {artworks} by young artists.|artists exhibitions | This {artwork} is made from recycled plastic. | Please don't touch the {artworks} on the walls; the paint is old and breaks easily.|artists exhibitions",
      "artist exhibition",
      "masterpiece",
    ),
    word(
      "portrait portraits",
      "a painting, drawing or photo of a person",
      "肖像；画像",
      "She painted a {portrait} of her grandmother. | {Portraits} of old kings hang on the walls of the castle.|sculptures landscapes | The photographer takes {portraits} of famous people.|sculptures landscapes",
      "sculpture landscape",
    ),
    word(
      "photography",
      "the art or job of taking photos",
      "摄影",
      "He is interested in {photography} and always carries a camera. | She studied {photography} at college and now takes pictures for a newspaper. | The film won an award for its {photography}.",
      "pottery painting",
    ),
    word(
      "craft crafts",
      "making things with your hands, such as baskets, jewelry or furniture",
      "手工艺",
      "The market sells local {crafts}, such as baskets and jewelry.|portraits sculptures | Paper cutting is a traditional Chinese {craft}. | Weaving is a {craft} that takes years to learn.",
      "portrait sculpture",
    ),
    word(
      "pottery",
      "pots, cups and plates made from clay; the craft of making them",
      "陶器；制陶",
      "I'm taking a {pottery} class on Saturdays, where we make bowls from clay. | Jingdezhen is famous for its {pottery}: blue and white cups, plates and vases. | They found pieces of ancient {pottery} under the old city: broken pots and bowls.",
      "sculpture photography",
    ),
    word(
      "artistic",
      "good at art, or connected with art",
      "有艺术天赋的；艺术的",
      "My sister is very {artistic}; she paints and makes her own clothes. | The city has a rich {artistic} life, with galleries, painters and art schools. | He has a lot of {artistic} talent: his drawings and paintings are beautiful.",
      "athletic musical",
    ),
    word(
      "creativity",
      "the ability to make new things or have new ideas",
      "创造力",
      "The teacher encourages {creativity}: she asks students to invent new games and stories. | This job needs a lot of {creativity}, because you have to come up with new ideas for adverts every week. | Art classes help children develop their {creativity} and make things nobody has made before.",
      "curiosity activity",
    ),
    word(
      "masterpiece masterpieces",
      "a work of art that is extremely good, or the best that an artist has made",
      "杰作",
      "The Mona Lisa is Leonardo's greatest {masterpiece}. | The museum is full of {masterpieces}, the best paintings ever made by great artists.|exhibitions crafts | Many people think this novel is the {masterpiece} of its writer, the best book she ever wrote.",
      "exhibition craft",
      "artwork",
    ),
    word(
      "canvas canvases",
      "strong cloth that artists paint on",
      "画布；帆布",
      "The artist stretched a large {canvas} over a wooden frame and began to paint. | Rolled-up {canvases} lay on the floor of her studio, ready to be painted.|sculptures portraits | The tent is made of {canvas}.",
      "sculpture portrait",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Sculpture* and *pottery* are both shaped by hand, but a *sculpture* is a work of art in stone, wood or metal, and *pottery* is pots, cups and plates of clay. Look for stone and metal, or for clay and bowls.",
        "*sculpture* 和 *pottery* 都是手工塑成的，但 *sculpture* 是石头、木头或金属的艺术品，*pottery* 是陶土做的锅、杯和盘。找找句子里是石头金属，还是陶土碗碟。",
      ),
      meaning: t(
        "*Artwork* and *masterpiece* both name a work of art, but only a *masterpiece* is extremely good, the best an artist has made: check whether the meaning says any work or the best one.",
        "*artwork* 和 *masterpiece* 都指艺术作品，但只有 *masterpiece* 是极好的、艺术家最好的作品：看清释义说的是任何作品还是最好的那件。",
      ),
      spell: t(
        "*Exhibition* hides a silent h after the x, and *sculpture* ends in -ture, said like *cher*.",
        "*exhibition* 的 x 后面藏着一个不发音的 h；*sculpture* 结尾是 -ture，读作 *cher*。",
      ),
    },
    notes: `
      painter|a Dutch artist with thick oil paint and a brush;a Chinese artist of shrimps and flowers in ink;mixed colors and a picture worked on for a year|a painter makes pictures with paint; a sculptor shapes stone, wood or metal|painter 用颜料作画；sculptor 用石头、木头或金属雕塑|sculptor/sculptors=sculptor is an artist who shapes stone, wood or metal, not one who puts paint on a picture=sculptor 是用石头、木头或金属塑形的艺术家，不是在画上上色的人;photographer/photographers=photographer takes pictures with a camera, not with paint and a brush=photographer 用相机拍照，不用颜料和画笔|paint · er|ai said like long a, and -er at the end for the person|ai 读长音 a，结尾 -er 表示人
      sculpture|a bronze horse children climb on;marble works from ancient Greece you can walk around;old metal bent into a tall bird|a sculpture is solid and shaped; a painting is flat|sculpture 是立体的雕塑；painting 是平面的画|painting/paintings=painting is a flat picture made with paint, not a solid shape of stone or metal=painting 是用颜料画的平面画，不是石头或金属的立体作品;portrait/portraits=portrait is a picture of a person, flat on paper or canvas, not a solid shape you can walk around=portrait 是画在纸或画布上的人物像，不是能绕着走的立体作品|sculp · ture|the c in sculp-, and the ending -ture said like *cher*|sculp- 里的 c，结尾 -ture 读作 *cher*
      exhibition|Picasso's paintings at the city gallery;old photos in the town hall until May;students' art on the walls for two weeks|an exhibition is a show that lasts for a while; a gallery is the place where shows happen|exhibition 是持续一段时间的展览；gallery 是举办展览的场所|concert=concert is a show of music that people listen to, not pictures or art put up for people to look at=concert 是供人听的音乐演出，不是摆出来供人看的画或艺术品;gallery=gallery is the building or room where art is kept, not a show that opens and closes on certain dates=gallery 是存放艺术品的建筑或房间，不是有起止日期的展览|ex · hi · bi · tion|the silent h after the x: ex**h**ibition|x 后面的 h 不发音：ex**h**ibition
      artwork|pieces sold by young artists;a piece made from recycled plastic;old paint on the walls that breaks easily|an artwork is the thing made; an artist is the person who makes it|artwork 是做出来的作品；artist 是做作品的人|artist/artists=artist is the person who makes art, not the thing that is made=artist 是创作艺术的人，不是创作出来的作品;exhibition/exhibitions=exhibition is a whole show of many works, not one object you can buy, make or touch=exhibition 是由许多作品组成的整场展览，不是能买、能做、能摸的单件作品|art · work|two words joined into one: art + work|两个词连成一个词：art + work
      portrait|a picture painted of a grandmother;old kings on the castle walls;photos of famous people|a portrait shows a person; a landscape shows fields, hills or the sea|portrait 画的是人；landscape 画的是田野、山丘或大海|sculpture/sculptures=sculpture is a solid shape made of stone, wood or metal, not a flat picture you paint, hang or take=sculpture 是石头、木头或金属的立体作品，不是画出、挂起或拍下的平面像;landscape/landscapes=landscape is a picture of fields, hills or the sea, not of a person=landscape 是画田野、山丘或大海的风景画，不是画人的|por · trait|ai in the last part, por-**trait**|最后一块 -trait 里是 ai
      photography|an interest and a camera always carried;college study and pictures for a newspaper;an award a film won|photography is the art of taking photos; a photograph is one photo|photography 是摄影这门艺术；photograph 是一张照片|pottery=pottery is making pots and plates from clay, nothing to do with a camera or photos=pottery 是用陶土做锅碗盘子，和相机、照片无关;painting=painting is making pictures with paint and a brush, not taking them with a camera=painting 是用颜料和画笔作画，不是用相机拍|pho · tog · ra · phy|ph said like f, twice|ph 读 f，出现两次
      craft|baskets and jewelry at the market;traditional Chinese paper cutting;weaving that takes years to learn|a craft is making useful things by hand; a sculpture is a work of art to look at|craft 是手工制作实用的东西；sculpture 是供人观赏的艺术品|portrait/portraits=portrait is a painting or photo of a person, which has nothing to do with making things by hand=portrait 是人物的画像或照片，与手工制作无关;sculpture=sculpture is a work of fine art in stone or metal, not the everyday handwork of a craft=sculpture 是石头或金属的美术作品，不是日常的手工艺|craft|ft at the end, as in *gift*|结尾是 ft，和 *gift* 一样
      pottery|a Saturday class making bowls from clay;Jingdezhen's blue and white cups and vases;broken pots and bowls under an old city|pottery is pots and plates of clay; poetry, which looks alike, is writing in lines|pottery 是陶土做的锅碗盘；长得像的 poetry 是分行写的诗歌|sculpture=sculpture is shaping stone, wood or metal into art, not making pots, cups and bowls=sculpture 是把石头、木头或金属塑成艺术品，不是做锅碗杯盘;photography=photography is taking photos with a camera, not making things from clay=photography 是用相机拍照，不是用陶土做东西|pot · ter · y|the double t|双写 t
      artistic|a sister who paints and makes her own clothes;a city with galleries, painters and art schools;beautiful drawings and paintings|artistic is about art; athletic is about sport|artistic 和艺术有关；athletic 和运动有关|athletic=athletic means strong and good at sport, not good at painting or drawing=athletic 指身体强壮、擅长运动，不是擅长绘画;musical=musical means good at music or connected with music, not with painting and pictures=musical 指擅长音乐或与音乐有关，不是与绘画有关|ar · tis · tic|art + -istic, ending in -tic|art 加 -istic，结尾是 -tic
      creativity|a teacher asking students to invent games and stories;new ideas for adverts every week;art classes and things nobody has made before|creativity is making new things; curiosity is wanting to know|creativity 是创造新东西；curiosity 是想知道|curiosity=curiosity is wanting to know or learn about things, not making new things or ideas=curiosity 是想知道、想了解事物，不是创造新东西、想出新点子;activity=activity is something you do, or being busy, not the ability to have new ideas=activity 是做的事情或忙碌状态，不是想出新点子的能力|cre · a · tiv · i · ty|create drops its e before -ivity|create 去掉 e 再加 -ivity
      masterpiece|Leonardo's greatest painting;the best paintings ever made by great artists;the best book a writer ever wrote|a masterpiece is an extremely good work; an artwork can be any work of art|masterpiece 是极好的杰作；artwork 可以是任何艺术品|exhibition/exhibitions=exhibition is a public show of many works, not one great work by an artist=exhibition 是许多作品的公开展览，不是艺术家的一件杰作;craft/crafts=craft is making useful things by hand, not the very best work of a great artist or writer=craft 是手工制作实用物品，不是大艺术家或作家最好的作品|mas · ter · piece|master + piece, with ie in piece|master 加 piece，piece 里是 ie
      canvas|cloth stretched over a wooden frame;rolled-up cloth on a studio floor;a tent|canvas is the strong cloth; a portrait is a picture of a person that may be painted on it|canvas 是结实的布；portrait 是可以画在上面的人物像|sculpture/sculptures=sculpture is a solid work of stone, wood or metal, not cloth that you paint on or make a tent from=sculpture 是石头、木头或金属的立体作品，不是可以在上面作画或做帐篷的布;portrait/portraits=portrait is the finished picture of a person, not the strong cloth itself=portrait 是画好的人物像，不是那种结实的布本身|can · vas|one s, and -es for more than one: canvas**es**|只有一个 s，复数加 -es：canvas**es**
    `,
  },
});

const film = vocabularyTopic({
  id: "b1-words-film-and-theater",
  title: t("Film and Theater", "电影和戏剧"),
  summary: t(
    "Theaters and stages; scenes and roles; actresses and directors; plots and scripts; performing, performances and rehearsing; comedies.",
    "剧院和舞台；场景和角色；女演员和导演；情节和剧本；表演、演出和排练；喜剧。",
  ),
  intro: t(
    "The **director** stopped the **rehearsal** twice, because the **actress** forgot a line from the **script** in the last **scene**. These words help you talk about plays and films and the people who make them.",
    "**director**（导演）两次叫停排练，因为 **actress**（女演员）在最后一个 **scene**（场景）里忘了 **script**（剧本）上的一句台词。这些词帮你谈论戏剧和电影，以及创作它们的人。",
  ),
  prerequisites: ["a1-words-hobbies"],
  words: [
    word(
      "theater theaters",
      "a building where people go to watch plays",
      "剧院",
      "We went to the {theater} to see a play. | The {theater} was full on the first night of the play, and every seat was taken. | There are many {theaters} in London's West End, where you can see a different play every night.|cinemas galleries",
      "cinema gallery",
    ),
    word(
      "stage stages",
      "the raised area in a theater where actors perform",
      "舞台",
      "The actors came onto the {stage} and the audience began to clap. | She was nervous before going on {stage} in front of five hundred people. | The band played on a big {stage} in the park.",
      "theater script",
    ),
    word(
      "scene scenes",
      "a part of a play or a film that happens in one place",
      "场景；场面",
      "The last {scene} of the film made me cry. | They filmed the beach {scenes} in Hainan.|plots roles | In the first {scene}, two friends meet at a station.",
      "plot role",
    ),
    word(
      "role roles",
      "the character that an actor plays",
      "角色",
      "She plays the {role} of a young doctor. | He got the main {role} in the school play. | One actor played three {roles} in the play: a king, a soldier and a servant.|scenes scripts",
      "scene script",
    ),
    word(
      "actress actresses",
      "a woman who acts in plays or films",
      "女演员",
      "She is a famous Chinese {actress} who has played many roles in films. | The {actress} won an award for her role. | Two {actresses} were chosen for the part.|directors writers",
      "director writer",
    ),
    word(
      "director directors",
      "the person who tells the actors what to do in a film or a play",
      "导演",
      'Zhang Yimou is a well-known film {director} who tells actors where to stand and how to speak. | The {director} shouted "Cut!" and asked the actors to do the scene again. | Many young {directors} learn to run a film set by making short films first.|actors writers',
      "actor writer",
    ),
    word(
      "plot plots",
      "the events that form the story of a book, a film or a play",
      "情节",
      "The {plot} was hard to follow: so many things happened, and I didn't know who the killer was. | I won't tell you the {plot}; you should see it yourself. | Many films have very similar {plots}: a boy meets a girl, they fight, and in the end they fall in love.|roles stages",
      "role stage",
    ),
    word(
      "script scripts",
      "the written words of a play or a film",
      "剧本；脚本",
      "The actors read the {script} together, page by page, for the first time. | She wrote the {script} for the film: every word the actors say. | Don't forget to learn your lines from the {script}.",
      "plot role",
    ),
    word(
      "performance performances",
      "a show of a play, music or dance; how well someone does something",
      "演出；表现",
      "The evening {performance} starts at eight, so the audience should be in their seats by then. | His {performance} as the old king was brilliant, and the audience stood up to clap. | There are two {performances} on Saturday, and tickets for both are sold out.|rehearsals scripts",
      "rehearsal script",
    ),
    word(
      "perform performs performed performing",
      "to act, sing, dance or play music for an audience",
      "表演；演出",
      "The band will {perform} at the festival in front of thousands of fans. | She {performed} a song in front of the whole school.|directed watched | The play has been {performed} on stages all over the world by many different actors.|directed watched",
      "direct watch",
      "rehearse",
    ),
    word(
      "rehearse rehearses rehearsed rehearsing",
      "to practice a play or a piece of music before a performance",
      "排练；彩排",
      "The actors {rehearsed} for six weeks before the first night.|directed watched | We are {rehearsing} our songs again and again for the school concert next week.|directing watching | Let's {rehearse} the last scene once more; we need to practice it before the audience comes.",
      "direct watch",
      "perform",
    ),
    word(
      "comedy comedies",
      "a funny film or play",
      "喜剧",
      "We watched a {comedy} and laughed all evening. | It's a romantic {comedy} about two strangers, full of jokes and a happy ending. | I prefer {comedies} to sad films, because I like to laugh.|tragedies scripts",
      "tragedy script",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Plot*, *script* and *scene* are all parts of a story on stage or screen: the *plot* is what happens, the *script* is the written words, and a *scene* is one part in one place. Ask whether the gap means events, words on paper or one part.",
        "*plot*、*script* 和 *scene* 都和舞台或银幕上的故事有关：*plot* 是发生的情节，*script* 是写下来的台词，*scene* 是在一个地点发生的一段。想想空格指的是情节、纸上的文字还是其中一段。",
      ),
      meaning: t(
        "*Perform* and *rehearse* are both things actors do, but you *rehearse* before the show to practice and *perform* in the show for an audience: check whether the meaning says practice or audience.",
        "*perform* 和 *rehearse* 都是演员做的事，但 *rehearse* 是演出前排练，*perform* 是在观众面前演出：看清释义说的是练习还是观众。",
      ),
      spell: t(
        "*Rehearse* hides *hear* in the middle, re-**hear**-se, and *theater* ends in -er in American English.",
        "*rehearse* 中间藏着 *hear*：re-**hear**-se；*theater* 在美式英语里结尾是 -er。",
      ),
    },
    notes: `
      theater|going to see a play;a full first night with every seat taken;London's West End and a different play every night|a theater shows plays on a stage; a cinema shows films on a screen|theater 在舞台上演戏剧；cinema 在银幕上放电影|cinema/cinemas=cinema is a building where you watch films on a screen, not plays with live actors=cinema 是在银幕上看电影的地方，不是看真人演戏的地方;gallery/galleries=gallery is a building where you look at paintings, not where you sit and watch a play=gallery 是看画的地方，不是坐着看戏的地方|the · a · ter|-er at the end in American English (British *theatre*)|美式结尾是 -er（英式写作 *theatre*）
      stage|actors coming on as the audience claps;nerves before five hundred people;a band playing in the park|the stage is the raised floor where actors stand; the theater is the whole building|stage 是演员站的高台；theater 是整座剧院|theater=theater is the whole building, so you go into it, not onto it or up on it=theater 是整座剧院建筑，只能走进去，不能走上去;script=script is the written words of a play, not a place where people stand and perform=script 是戏剧写下来的台词，不是人站上去表演的地方|stage|a that says its name before the silent e|不发音的 e 前，a 读字母本音
      scene|the last part of a film that made someone cry;parts filmed on a beach in Hainan;two friends meeting at a station first|a scene is one part of a film or play; the plot is the whole story|scene 是电影或戏剧的一段；plot 是整个故事情节|plot/plots=plot is the whole story from start to end, not one part filmed in one place=plot 是从头到尾的整个情节，不是在一个地点拍的一段;role/roles=role is a character an actor plays, not a part of the story that happens in one place=role 是演员扮演的角色，不是在一个地点发生的一段|scene|the silent c after s: s**c**ene|s 后面的 c 不发音：s**c**ene
      role|playing a young doctor;the main part in a school play;a king, a soldier and a servant played by one actor|a role is the character an actor plays; a scene is a part of the story|role 是演员扮演的角色；scene 是故事中的一段|scene/scenes=scene is a part of the story in one place, not a person that an actor plays=scene 是故事中的一个片段，不是演员扮演的人物;script/scripts=script is the written words of the whole play, not one character in it=script 是整部戏的台词，不是其中一个人物|role|o-e said like long o; *roll*, which sounds the same, means to turn over and over|o-e 读长音 o；同音的 *roll* 意思是翻滚
      actress|a famous woman who has played many roles in films;an award for her role;two women chosen for the part|an actress plays a role; a director tells the actors what to do|actress 扮演角色；director 指导演员怎么演|director/directors=director tells the actors what to do and does not play the part herself=director 指导演员怎么演，自己并不扮演角色;writer/writers=writer writes the words of a story, not a person who acts a part=writer 是写故事的人，不是扮演角色的人|ac · tress|actor + -ress, with a double s at the end|act 加 -ress，结尾双写 s
      director|telling actors where to stand and how to speak;shouting "Cut!" and asking for the scene again;running a film set after making short films|a director tells the actors what to do; an actor plays a part|director 指导演员；actor 扮演角色|actor/actors=actor plays a part in front of the camera, not the person who tells everyone where to stand and when to stop=actor 在镜头前演角色，不是指挥大家站位、喊停的人;writer/writers=writer writes the words, not the person who runs the filming=writer 写台词，不是负责拍摄现场的人|di · rec · tor|-or at the end, not -er|结尾是 -or，不是 -er
      plot|so many events and an unknown killer;not telling someone the story before they see it;a boy meeting a girl and falling in love in the end|the plot is what happens in the story; a role is one character in it|plot 是故事里发生的事；role 是其中的一个角色|role/roles=role is a character an actor plays, not the events that happen in the story=role 是演员扮演的角色，不是故事里发生的事件;stage/stages=stage is the raised floor where actors perform, not the events of the story=stage 是演员表演的高台，不是故事中的事件|plot|short o, as in *hot*; *pilot*, which looks alike, flies planes|短元音 o，和 *hot* 一样；长得像的 *pilot* 是飞行员
      script|reading page by page for the first time;every word the actors say in a film;learning lines|the script is the written words; the plot is what happens|script 是写下的台词；plot 是发生的情节|plot=plot is what happens in the story, not the written words that people read and learn=plot 是故事的情节，不是供人读和背的文字;role=role is a character an actor plays, not the pages of words=role 是演员扮演的角色，不是写满台词的纸页|script|scr at the start, three sounds together|开头 scr 三个音连在一起
      performance|an evening show with the audience in their seats;a brilliant old king and a standing audience;two shows on Saturday with tickets sold out|a performance is for an audience; a rehearsal is practice before it|performance 是给观众看的演出；rehearsal 是演出前的排练|rehearsal/rehearsals=rehearsal is practice before the show, with no audience in the seats and no tickets=rehearsal 是演出前的排练，台下没有观众，也不卖票;script/scripts=script is the written words of a play, not a show that people watch=script 是戏剧的台词，不是供人观看的演出|per · for · mance|the ending -ance, not -ence|结尾是 -ance，不是 -ence
      perform|a band and thousands of fans at a festival;singing a song before the whole school;a play on stages all over the world|you perform in the show for an audience; you rehearse before it to practice|perform 是在观众面前演出；rehearse 是演出前排练|direct/directed=direct means to tell the actors what to do, not to sing, act or play in front of people yourself=direct 是指导演员，不是自己在人前唱、演或奏;watch/watched=watch means to look at a show as one of the audience, not to be the one on stage=watch 是作为观众看演出，不是在台上表演的人|per · form|per- at the start and or in the middle|开头是 per-，中间是 or
      rehearse|six weeks before the first night;songs practiced again and again for a concert;practice before the audience comes|you rehearse to practice before a show; you perform in it|rehearse 是演出前练习；perform 是正式演出|direct/directed/directing=direct means to tell the actors what to do, not to practice your own part again and again=direct 是指导演员，不是一遍遍练自己的部分;watch/watched/watching=watch means to look at a show, not to practice it before the audience comes=watch 是观看演出，不是在观众来之前练习|re · hearse|*hear* hidden inside: re-**hear**-se|中间藏着 *hear*：re-**hear**-se
      comedy|laughing all evening;two strangers, jokes and a happy ending;liking to laugh more than sad films|a comedy is funny and ends happily; a tragedy is sad and ends badly|comedy 好笑，结局圆满；tragedy 悲伤，结局不幸|tragedy/tragedies=tragedy is a sad play or film that ends badly, not one that makes you laugh=tragedy 是结局不幸的悲剧，不会让人发笑;script/scripts=script is the written words of a play, not a kind of film that you watch=script 是戏剧的台词，不是一种可以看的影片|com · e · dy|y changes to -ies for more than one: comed**ies**|复数把 y 变成 -ies：comed**ies**
    `,
  },
});

const music = vocabularyTopic({
  id: "b1-words-music-2",
  title: t("Music", "音乐"),
  summary: t(
    "Bands, orchestras and choirs; instruments and violins; rhythm, melodies, tunes and lyrics; albums; composers and musicians.",
    "乐队、管弦乐团和合唱团；乐器和小提琴；节奏、旋律、曲调和歌词；专辑；作曲家和音乐家。",
  ),
  intro: t(
    "The school **orchestra** played the **melody**, a **choir** of forty sang the **lyrics**, and a little drum kept the **rhythm**. These words help you talk about music, the people who make it and how it sounds.",
    "学校的 **orchestra**（管弦乐团）演奏 **melody**（旋律），四十人的 **choir**（合唱团）唱出 **lyrics**（歌词），一面小鼓打着 **rhythm**（节奏）。这些词帮你谈论音乐、创作音乐的人和音乐的声音。",
  ),
  prerequisites: ["a1-words-sports-and-music"],
  words: [
    word(
      "band bands",
      "a group of people who play popular music together",
      "乐队",
      "My brother plays the drums in a rock {band}. | The {band} played their new song with loud guitars and drums. | Which pop {band} is playing at the music festival tonight?",
      "orchestra choir",
    ),
    word(
      "orchestra orchestras",
      "a large group of musicians who play classical music together",
      "管弦乐团",
      "She plays the violin in the school {orchestra}, with forty other musicians playing classical music. | The {orchestra} played music by Beethoven. | The city has two {orchestras}, each with about eighty players of classical music.|bands choirs",
      "band choir",
      "band choir",
    ),
    word(
      "instrument instruments",
      "an object, such as a piano or a guitar, that you use to play music",
      "乐器；仪器",
      "Can you play a musical {instrument}, such as the piano or the flute? | The guitar is my favorite {instrument}. | The museum has old Chinese {instruments}, such as drums and the pipa.|songs albums",
      "song album",
    ),
    word(
      "violin violins",
      "an instrument with four strings that you hold under your chin",
      "小提琴",
      "She holds the {violin} under her chin and plays it with a bow. | The {violin} has four strings and is played with a bow. | Two {violins}, played under the players' chins, filled the room with music.|pianos guitars",
      "piano guitar",
    ),
    word(
      "rhythm rhythms",
      "a regular pattern of sounds or beats in music",
      "节奏",
      "The song has a strong {rhythm}: boom, boom, boom, like a heartbeat, that makes you want to dance. | Clap your hands to the {rhythm} and keep the beat with your feet. | African drummers play many complex {rhythms}, beating out different patterns at the same time.|melodies tunes",
      "melody tune",
    ),
    word(
      "melody melodies",
      "a tune; a series of musical notes that are nice to listen to",
      "旋律",
      "The song has a beautiful {melody} that you can hum. | I can hum the {melody}, but I can't remember the words. | Chinese folk songs have simple {melodies} that are easy to sing and hum.|rhythms albums",
      "rhythm album",
      "tune",
    ),
    word(
      "lyrics",
      "the words of a song",
      "歌词",
      "I love the music, but I don't understand the {lyrics}. | She wrote the {lyrics} for the band's new song, every word of it. | The song's {lyrics} told the story of growing up in a small town.",
      "melody rhythm",
    ),
    word(
      "album albums",
      "a collection of songs on one record or online",
      "专辑；相册",
      "The band's new {album} of twelve songs comes out online next week. | I bought the band's first {album} on CD, and I still play it in the car. | She has sold millions of {albums}.|melodies concerts",
      "melody concert",
    ),
    word(
      "composer composers",
      "a person who writes music",
      "作曲家",
      "Mozart was a famous {composer} who wrote more than six hundred pieces of music. | The {composer} sat at the piano and wrote down the notes of a new song. | Tan Dun is a Chinese {composer} who wrote the music for the film Hero.|conductors singers",
      "conductor singer",
      "musician",
    ),
    word(
      "musician musicians",
      "a person who plays music, often as a job",
      "音乐家；乐手",
      "My uncle is a professional {musician} who plays the saxophone in a jazz club. | The {musicians} played until midnight.|conductors dancers | You need to practice your instrument every day to become a good {musician}.",
      "conductor dancer",
      "composer",
    ),
    word(
      "tune tunes",
      "a series of musical notes that make a piece of music",
      "曲调；曲子",
      "She was whistling a happy {tune}. | I keep humming that {tune}; I can't get it out of my head. | He played some old {tunes} on the piano.|rhythms albums",
      "rhythm album",
      "melody",
    ),
    word(
      "choir choirs",
      "a group of people who sing together",
      "合唱团",
      "She sings in the school {choir}, where all the members sing and nobody plays an instrument. | The {choir} sang without any instruments at the end of the ceremony. | There are thirty singers in the {choir}.",
      "band orchestra",
      "band orchestra",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Band*, *orchestra* and *choir* are all groups: a *band* plays popular music, an *orchestra* plays classical music on many instruments, and a *choir* only sings. Look for guitars and pop, violins and Beethoven, or singing voices.",
        "*band*、*orchestra* 和 *choir* 都是团体：*band* 演奏流行音乐，*orchestra* 用很多乐器演奏古典音乐，*choir* 只唱歌。找找句子里是吉他和流行乐、小提琴和贝多芬，还是歌声。",
      ),
      meaning: t(
        "*Melody* and *rhythm* are both parts of music: the *melody* is the notes you can hum, and the *rhythm* is the beat you can clap. Check whether the meaning says notes or beats.",
        "*melody* 和 *rhythm* 都是音乐的组成部分：*melody* 是能哼出来的音符，*rhythm* 是能拍出来的节拍。看清释义说的是音符还是节拍。",
      ),
      spell: t(
        "*Rhythm* starts with rh and uses y as its vowel, and *choir* starts with ch said like k: it sounds like *kwire*.",
        "*rhythm* 以 rh 开头，用 y 当元音；*choir* 开头的 ch 读作 k，整个词读起来像 *kwire*。",
      ),
    },
    notes: `
      band|a rock group with drums;a new song with loud guitars and drums;a pop group at a music festival|a band plays popular music; an orchestra plays classical music|band 演奏流行音乐；orchestra 演奏古典音乐|orchestra=orchestra is a large group playing classical music on violins and other instruments, not a rock or pop group=orchestra 是用小提琴等乐器演奏古典音乐的大乐团，不是摇滚或流行乐队;choir=choir is a group that sings, not one that plays drums and guitars=choir 是唱歌的团体，不弹吉他、不打鼓|band|short a, as in *hand*|短元音 a，和 *hand* 一样
      orchestra|a school violin player and forty classical musicians;music by Beethoven;two groups of about eighty classical players|an orchestra is large and plays classical music; a band plays popular music|orchestra 规模大，演奏古典音乐；band 演奏流行音乐|band/bands=band is a small group playing pop or rock, not a large group of classical players=band 是演奏流行或摇滚的小乐队，不是古典乐的大乐团;choir/choirs=choir is a group of singers, not players of violins and other instruments=choir 是一群歌手，不是演奏小提琴等乐器的人|or · ches · tra|ch said like k: or-**k**es-tra|ch 读作 k：or-**k**es-tra
      instrument|the piano or the flute;a favorite guitar;old Chinese drums and the pipa in a museum|an instrument is the object you play; a song is the music you play on it|instrument 是演奏用的乐器；song 是用它演奏的歌曲|song/songs=song is a piece of music with words, not an object such as a guitar or a drum=song 是有歌词的音乐，不是吉他或鼓这样的物件;album/albums=album is a collection of recorded songs, not an object you play music on=album 是一组录好的歌曲，不是用来演奏的物件|in · stru · ment|str in the middle, and -ment at the end|中间是 str，结尾是 -ment
      violin|holding it under the chin and playing with a bow;four strings and a bow;two instruments under players' chins|a violin has four strings and is played with a bow; a guitar has six strings that you pick with your fingers|violin 有四根弦，用弓拉；guitar 有六根弦，用手指拨|piano/pianos=piano is a big instrument with black and white keys that you press, not one you hold under your chin=piano 是有黑白琴键、用手按的大乐器，不能夹在下巴下;guitar/guitars=guitar has six strings that you pick with your fingers, not four played with a bow under your chin=guitar 有六根弦，用手指拨，不是夹在下巴下用弓拉的四弦乐器|vi · o · lin|i-o-l in the middle: vi-o-lin, like *violet*|中间是 i-o-l：vi-o-lin，和 *violet* 的开头一样
      rhythm|a strong beat like a heartbeat that makes you dance;clapping and keeping the beat with the feet;African drummers beating out patterns|rhythm is the pattern of beats; a melody is the line of notes|rhythm 是节拍的规律；melody 是一串音符组成的旋律|melody/melodies=melody is the line of notes you sing or hum, not the beat you clap or drum=melody 是唱或哼的一串音符，不是拍手或打鼓的节拍;tune/tunes=tune is a piece of music you can whistle or hum, not the pattern of beats=tune 是能吹口哨或哼唱的曲调，不是节拍的规律|rhy · thm|rh at the start and y as the vowel: rh-y-th-m|开头是 rh，用 y 当元音：rh-y-th-m
      melody|a beautiful song you can hum;humming without remembering the words;Chinese folk songs easy to sing and hum|a melody is the notes you hum; the rhythm is the beat you clap|melody 是能哼的音符；rhythm 是能拍的节拍|rhythm/rhythms=rhythm is the beat of the music that you clap or dance to, not the notes you hum or sing=rhythm 是拍手或跳舞跟随的节拍，不是哼唱的音符;album/albums=album is a collection of songs, not the line of notes in one song=album 是一组歌曲，不是一首歌里的一串音符|mel · o · dy|y changes to -ies for more than one: melod**ies**|复数把 y 变成 -ies：melod**ies**
      lyrics|loving the music but not understanding;every word of a band's new song;a song telling the story of growing up|lyrics are the words of a song; the melody is the notes|lyrics 是歌曲的词；melody 是音符|melody=melody is the line of notes you hum, not words you can understand or write down=melody 是哼出来的音符，不是能听懂、能写下的词;rhythm=rhythm is the beat of the music, not the words that tell a story=rhythm 是音乐的节拍，不是讲故事的词|lyr · ics|y said like short i, and always -s: the lyrics|y 读短元音 i，常用复数：the lyrics
      album|twelve songs coming out online;a first CD still played in the car;millions sold by a singer|an album is a collection of songs; a concert is a live show|album 是一组歌曲合集；concert 是现场演出|melody/melodies=melody is the notes of one song, not a collection of songs you buy or play=melody 是一首歌的音符，不是能买来播放的歌曲合集;concert/concerts=concert is a live show you go to, not a record of songs that comes out or you play in the car=concert 是去现场看的演出，不是发行出来或在车里播放的唱片|al · bum|-um at the end, as in *drum*|结尾是 -um，和 *drum* 一样
      composer|Mozart's six hundred pieces;writing down notes at the piano;Tan Dun's music for a film|a composer writes music; a conductor leads an orchestra while it plays|composer 写音乐；conductor 指挥乐团演奏|conductor/conductors=conductor stands in front of an orchestra and leads the players, not the person who writes the music=conductor 站在乐团前指挥演奏，不是写音乐的人;singer/singers=singer sings songs, not the person who writes the notes down=singer 是唱歌的人，不是写下音符的人|com · pos · er|compose + -r, with s said like z|compose 加 -r，s 读作 z
      musician|an uncle playing the saxophone in a jazz club;players going on until midnight;practicing an instrument every day|a musician plays music; a composer writes it|musician 演奏音乐；composer 创作音乐|conductor/conductors=conductor leads an orchestra with a stick and does not play an instrument himself=conductor 拿着指挥棒指挥乐团，自己不演奏乐器;dancer/dancers=dancer moves to music, not someone who plays an instrument=dancer 随音乐起舞，不是演奏乐器的人|mu · si · cian|the ending -cian, said like *shun*|结尾 -cian 读作 *shun*
      tune|whistling something happy;humming something that stays in the head;old pieces played on the piano|a tune is a piece of music you can hum; the rhythm is only its beat|tune 是能哼的曲子；rhythm 只是它的节拍|rhythm/rhythms=rhythm is only the beat, not music you can whistle, hum or play as a piece=rhythm 只是节拍，不是可以吹口哨、哼唱或弹奏的曲子;album/albums=album is a collection of songs on a record, not a short piece you whistle or hum=album 是唱片上的一组歌曲，不是能吹口哨或哼的小曲|tune|u-e said like *you*: t-**u**-ne|u-e 读作 *you*：t-**u**-ne
      choir|a school group where nobody plays an instrument;singing without instruments at a ceremony;thirty singers|a choir is a group of singers; a band plays instruments|choir 是一群歌手；band 演奏乐器|band=band is a group that plays guitars and drums, not only singers=band 是弹吉他打鼓的乐队，不只是唱歌的人;orchestra=orchestra is a large group playing instruments, not a group of singers=orchestra 是演奏乐器的大乐团，不是一群歌手|choir|ch said like k, and oir like *wire*: *kwire*|ch 读 k，oir 读作 *wire*：*kwire*
    `,
  },
});

const books = vocabularyTopic({
  id: "b1-words-books-and-stories",
  title: t("Books and Stories", "书和故事"),
  summary: t(
    "Novels and authors; poems, poets and poetry; fiction and biographies; chapters; heroes and villains; tales and legends.",
    "小说和作者；诗、诗人和诗歌；虚构作品和传记；章节；英雄和反派；故事和传说。",
  ),
  intro: t(
    "In the last **chapter** of the **novel**, the **hero** finally catches the **villain**, and the **author** ends the story with a short **poem**. These words help you talk about books, their writers and the people in their stories.",
    "在这本 **novel**（长篇小说）的最后一 **chapter**（章），**hero**（主人公）终于抓住了 **villain**（反派），**author**（作者）用一首短 **poem**（诗）结束了故事。这些词帮你谈论书、作者和书中的人物。",
  ),
  prerequisites: ["a1-words-books"],
  words: [
    word(
      "novel novels",
      "a long written story about people and events that are not real",
      "长篇小说",
      "Dream of the Red Chamber is a famous Chinese {novel}: a long story of more than a hundred chapters about an imagined family. | She's reading a {novel} of five hundred pages about a family that never really lived. | He has written three long {novels}, each with made-up characters and many chapters.|poems biographies",
      "poem biography",
    ),
    word(
      "author authors",
      "the writer of a book",
      "作者",
      "Who is the {author} of this book? I want to read more by the same writer. | J. K. Rowling is the {author} of the Harry Potter books. | The {author} signed copies of her new book.",
      "hero reader",
    ),
    word(
      "poem poems",
      "a piece of writing in short lines, often with words that rhyme",
      "诗",
      "Li Bai wrote a short {poem} about the moon in just four lines. | We had to learn a {poem} by heart, eight short lines that rhyme. | Her short {poems} rhyme and are about nature and love.|novels chapters",
      "novel chapter",
    ),
    word(
      "poet poets",
      "a person who writes poems",
      "诗人",
      "Du Fu was a great {poet} of the Tang dynasty. | The {poet} read her poems to the audience. | A {poet} often writes about love, the moon and the seasons.",
      "poem poetry",
    ),
    word(
      "poetry",
      "poems in general",
      "诗歌",
      "I enjoy reading Chinese {poetry}, especially the short poems of the Tang dynasty. | She has published two books of {poetry}, full of short lines that rhyme. | Tang {poetry}, with its short lines about the moon and rivers, is studied in every school in China.",
      "fiction biography",
    ),
    word(
      "fiction",
      "books and stories about people and events that are not real",
      "虚构作品；小说",
      "I prefer {fiction} to history books, because I like made-up stories. | Science {fiction} is about the future and space. | The story is {fiction}, but it feels very real.",
      "biography poetry",
    ),
    word(
      "biography biographies",
      "the story of a person's life, written by someone else",
      "传记",
      "I'm reading a {biography} of Steve Jobs that tells the true story of his life. | She wrote a {biography} of her famous grandfather, from his birth in 1920 to his death. | {Biographies} of sports stars tell the real stories of their lives and sell well.|novels poems",
      "novel poem",
    ),
    word(
      "chapter chapters",
      "one of the parts that a book is divided into",
      "章；章节",
      "Read the first {chapter} for homework: it's about twenty pages long. | The book is divided into twenty {chapters}, each with its own title.|pages novels | In the last {chapter}, which is thirty pages long, the hero finally comes home.",
      "page novel",
    ),
    word(
      "hero heroes",
      "the main good character in a story; a brave person whom people admire",
      "英雄；男主角",
      "The {hero} of the story saves the city. | The firefighter who saved three children is a local {hero}. | Superheroes are the {heroes} of many films.|villains authors",
      "villain author",
    ),
    word(
      "villain villains",
      "the bad character in a story",
      "反派；恶棍",
      "In the end, the {villain} goes to prison for all his crimes. | The {villain} wants to destroy the world. | The actor usually plays {villains}, bad men that the audience loves to hate.|heroes authors",
      "hero author",
    ),
    word(
      "tale tales",
      "a story, often about imaginary events",
      "故事；传说",
      "My grandmother told us {tales} about dragons.|chapters biographies | It's an old {tale} of love and adventure, told by sailors over many nights. | The book is a collection of fairy {tales}.|chapters biographies",
      "chapter biography",
      "legend",
    ),
    word(
      "legend legends",
      "an old, well-known story that may not be true",
      "传说",
      "There is a {legend} about a white snake that became a woman. | According to {legend}, the lake has no bottom. | The {legends} of King Arthur are very old, and nobody knows if they are true.|chapters biographies",
      "chapter biography",
      "tale",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Poet*, *poem* and *poetry* are easy to mix up: a *poet* is the person, a *poem* is one piece, and *poetry* is poems in general. Ask whether the gap needs a person, one piece or all poems.",
        "*poet*、*poem* 和 *poetry* 很容易混：*poet* 是人，*poem* 是一首诗，*poetry* 是诗歌的总称。想想空格要的是人、一首诗还是所有诗歌。",
      ),
      meaning: t(
        "*Fiction* and *biography* are both kinds of books, but *fiction* is made up and a *biography* tells the true story of a real person's life. Check whether the meaning says not real or a person's life.",
        "*fiction* 和 *biography* 都是书的种类，但 *fiction* 是虚构的，*biography* 讲的是真实人物的一生。看清释义说的是虚构还是某人的生平。",
      ),
      spell: t(
        "*Villain* ends in -ain, not -an, and *hero* adds -es for more than one: *heroes*.",
        "*villain* 结尾是 -ain，不是 -an；*hero* 的复数加 -es：*heroes*。",
      ),
    },
    notes: `
      novel|a long story of a hundred chapters about an imagined family;five hundred pages about a family that never lived;long books with made-up characters|a novel is a long made-up story; a biography is the true story of a real life|novel 是长篇虚构故事；biography 是真实人物的生平|poem/poems=poem is a short piece of writing in lines, not a long story with many chapters=poem 是分行的短篇作品，不是有很多章的长故事;biography/biographies=biography tells the true life of a real person, not a story about people who never lived=biography 讲真实人物的一生，不是关于虚构人物的故事|nov · el|-el at the end, not -le|结尾是 -el，不是 -le
      author|wanting to read more by the same writer;the Harry Potter books;signed copies of a new book|the author writes the book; the hero is a character in it|author 是写书的人；hero 是书中的人物|hero=hero is the main good character inside the story, not the person who wrote the book=hero 是故事里的主人公，不是写书的人;reader=reader is a person who reads a book, not the one who wrote it=reader 是读书的人，不是写书的人|au · thor|au said like *or*, and th in the middle|au 读作 *or*，中间是 th
      poem|four short lines about the moon;eight rhyming lines learned by heart;short rhyming pieces about nature and love|a poem is one short piece in lines; a novel is a long story|poem 是一首分行的短诗；novel 是长篇故事|novel/novels=novel is a long story with many pages and chapters, not a few short lines that rhyme=novel 是有很多页和章节的长篇故事，不是几行押韵的短句;chapter/chapters=chapter is one part of a long book, not a short piece in lines that rhyme=chapter 是长书的一部分，不是押韵的分行短诗|po · em|o and e said apart: po-em|o 和 e 分开读：po-em
      poet|a great writer of the Tang dynasty;reading her own poems to an audience;writing about love, the moon and the seasons|a poet is the person; a poem is what the person writes|poet 是诗人；poem 是诗人写的诗|poem=poem is a piece of writing, not the person who writes it=poem 是一篇作品，不是写诗的人;poetry=poetry is poems in general, not a person who writes them=poetry 是诗歌的总称，不是写诗的人|po · et|-et at the end for the person, -em for the piece|表示人的结尾是 -et，诗是 -em
      poetry|the short poems of the Tang dynasty;two books of short rhyming lines;short lines about the moon and rivers studied in schools|poetry is poems in general; fiction is made-up stories|poetry 是诗歌的总称；fiction 是虚构故事|fiction=fiction is made-up stories in long writing, not poems in short lines=fiction 是用长篇文字写的虚构故事，不是分行的诗;biography=biography is the story of a real person's life, not poems in short lines=biography 是真实人物的生平，不是分行的诗|po · et · ry|poet + -ry|poet 加 -ry
      fiction|made-up stories over history books;the future and space;a story that feels very real|fiction is made-up stories; a biography is a true life story|fiction 是虚构故事；biography 是真实的生平故事|biography=biography is the true story of a real person's life, not something made up=biography 是真实人物的一生，不是虚构的;poetry=poetry is poems in short lines, not stories about made-up people and events=poetry 是分行的诗，不是关于虚构人物和事件的故事|fic · tion|-tion said like *shun*|-tion 读作 *shun*
      biography|the true story of Steve Jobs's life;a famous grandfather from birth to death;the real lives of sports stars|a biography is written by someone else; a novel is a made-up story|biography 由别人写某人的真实生平；novel 是虚构的故事|novel/novels=novel is a made-up story, not the true story of a real person's life=novel 是虚构的故事，不是真实人物的一生;poem/poems=poem is a short piece in lines, not the full story of a life from birth to death=poem 是分行的短诗，不是讲一个人从生到死的完整故事|bi · og · ra · phy|bio- (life) + -graphy (writing), with ph said like f|bio-（生命）加 -graphy（书写），ph 读 f
      chapter|the first twenty pages for homework;twenty parts each with a title;the last thirty pages where the hero comes home|a chapter is one part of a book of many pages; a page is one sheet|chapter 是由很多页组成的一章；page 只是一页|page/pages=page is one side of one sheet of paper, not a part of a book that is many pages long=page 是一张纸的一面，不是很多页长的一章;novel/novels=novel is a whole long book, not one part of it=novel 是一整本长篇书，不是其中一部分|chap · ter|ch at the start, as in *chair*|开头是 ch，和 *chair* 一样
      hero|saving the city;a firefighter who saved three children;superheroes in many films|the hero is the good main character; the villain is the bad one|hero 是正面主角；villain 是反派|villain/villains=villain is the bad character who does crimes, not the good person who saves people=villain 是作恶的反派，不是救人的好人;author/authors=author is the person who writes a book, not a character who saves people in it=author 是写书的人，不是书中救人的角色|he · ro|-es for more than one: hero**es**|复数加 -es：hero**es**
      villain|going to prison for crimes;wanting to destroy the world;bad men the audience loves to hate|the villain is the bad character; the hero is the good one|villain 是反派；hero 是正面主角|hero/heroes=hero is the good main character, not a bad one who does crimes and is hated=hero 是正面主角，不是犯罪、被人恨的坏人;author/authors=author is the writer of the book, not a bad character inside the story=author 是写书的人，不是故事里的坏角色|vil · lain|the double l, and -ain at the end|双写 l，结尾是 -ain
      tale|a grandmother's stories about dragons;love and adventure told by sailors;fairy stories in a book|a tale is a story, often imagined; a biography is a true life story|tale 是故事，多为想象的；biography 是真实的生平|chapter/chapters=chapter is one part of a book, not a whole story that someone tells=chapter 是书的一部分，不是有人讲述的完整故事;biography/biographies=biography is a true story of a real life, not an imagined story about dragons, fairies or adventures=biography 是真实的生平，不是关于龙、仙女或冒险的想象故事|tale|a-e says its name; *tail*, which sounds the same, is an animal's|a-e 读字母本音；同音的 *tail* 是动物的尾巴
      legend|a white snake that became a woman;a lake with no bottom;very old stories of King Arthur nobody knows are true|a legend is an old story that may not be true; a biography tells a real life|legend 是不一定真实的古老传说；biography 讲真实生平|chapter/chapters=chapter is one part of a book, not an old story that people tell and believe=chapter 是书的一部分，不是人们流传的古老故事;biography/biographies=biography is the true story of a real person, not an old story that may not be true=biography 是真实人物的故事，不是未必真实的古老传说|leg · end|g said like j: le-**g**end|g 读 j：le-**g**end
    `,
  },
});

const entertainment = vocabularyTopic({
  id: "b1-words-entertainment",
  title: t("Entertainment", "娱乐"),
  summary: t(
    "Entertainment, entertaining and leisure; celebrities and fame; contests; trends, fashion and style; popular; reviewing and recommending.",
    "娱乐、使快乐和闲暇；名人和名气；比赛；潮流、时尚和风格；受欢迎的；评论和推荐。",
  ),
  intro: t(
    "The **celebrity** won a singing **contest** at sixteen, and her **fame** grew fast; now every magazine **reviews** her new songs. These words help you talk about fun, free time and the people everyone talks about.",
    "这位 **celebrity**（名人）十六岁时赢得了歌唱 **contest**（比赛），她的 **fame**（名气）迅速增长；如今每本杂志都会 **review**（评论）她的新歌。这些词帮你谈论娱乐、闲暇和大家都在谈论的人。",
  ),
  prerequisites: ["b1-words-media"],
  words: [
    word(
      "entertainment",
      "films, music, shows and other things that people enjoy",
      "娱乐；娱乐活动",
      "The hotel has live music and other {entertainment} every evening. | She works in the {entertainment} industry, making TV shows and films. | For {entertainment}, we played cards.",
      "fame fashion",
    ),
    word(
      "entertain entertains entertained entertaining",
      "to keep people interested and amused; to invite guests to your home",
      "使快乐；款待",
      "The clown {entertained} the children for an hour.|reviewed recommended | The film is very {entertaining}: we laughed from start to finish.|reviewing recommending | My parents love {entertaining} friends at home with big dinners and games.|reviewing recommending",
      "review recommend",
    ),
    word(
      "leisure",
      "the time when you are not working and can do what you enjoy",
      "闲暇；空闲",
      "What do you do in your {leisure} time? | The town has a new {leisure} center with a pool. | Reading is my favorite {leisure} activity.",
      "fame fashion",
    ),
    word(
      "celebrity celebrities",
      "a famous person, especially in entertainment",
      "名人",
      "The magazine is full of photos of {celebrities}: famous actors, singers and sports stars.|contests fans | She became a {celebrity} after the TV show, and now people stop her in the street. | Many {celebrities} use their fame on social media to sell products to their fans.|contests fans",
      "contest fan",
    ),
    word(
      "fame",
      "being known by many people",
      "名气；名声",
      "She found {fame} as a singer when she was only sixteen. | {Fame} can change people: when everyone knows your name, it's hard to live a normal life. | The town's {fame} comes from its hot springs.",
      "fashion leisure",
    ),
    word(
      "contest contests",
      "a competition",
      "比赛；竞赛",
      "She won a singing {contest} on TV. | The {contest} is open to students under eighteen, and the winner gets a prize. | I entered a photography {contest} and came second out of two hundred people.",
      "trend review",
    ),
    word(
      "trend trends",
      "a general change in what people do or like",
      "趋势；潮流",
      "There is a {trend} toward eating less meat. | Young people follow fashion {trends} on social media.|contests fashions | The {trend} toward working from home has grown every year since 2020.",
      "contest fashion",
    ),
    word(
      "fashion fashions",
      "the style of clothes that is popular at a certain time",
      "时尚；流行款式",
      "She wants to work in {fashion} and design clothes for famous models. | Short skirts are back in {fashion}. | In the 1920s, {fashion} for women changed, and short dresses became popular.",
      "leisure celebrity",
      "style",
    ),
    word(
      "style styles",
      "a particular way of doing or making something; looking fashionable",
      "风格；时髦",
      "I like the {style} of your jacket. | The building is in a traditional Chinese {style}. | She has her own {style} of writing.",
      "trend fame",
      "fashion",
    ),
    word(
      "popular",
      "liked by many people",
      "受欢迎的；流行的",
      "Basketball is {popular} with young people all over China. | The restaurant is {popular} with students. | It's the most {popular} song with teenagers this year.",
      "famous classic",
    ),
    word(
      "review reviews reviewed reviewing",
      "to write your opinion of a film, a book or a show; a piece of writing that does this",
      "评论；写评论",
      "The film got excellent {reviews} in the newspapers.|contests trends | She writes book {reviews} for a newspaper, saying which new books are good or bad.|contests trends | I always read the {reviews} before I buy something online.|contests trends",
      "contest trend",
    ),
    word(
      "recommend recommends recommended recommending",
      "to say that something is good and that someone should try it",
      "推荐",
      "Can you {recommend} a good restaurant? I want to try somewhere new tonight. | I {recommend} this book to anyone who loves adventure. | The doctor {recommended} more rest.|reviewed entertained",
      "review entertain",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Fashion*, *style* and *trend* are close: *fashion* is the clothes that are popular now, *style* is the way something is made or done, and a *trend* is a change in what many people do. Ask whether the gap means clothes, a way of doing or a general change.",
        "*fashion*、*style* 和 *trend* 很接近：*fashion* 是当下流行的服装，*style* 是做事或制作的方式，*trend* 是很多人行为的变化趋势。想想空格指的是服装、方式还是总体变化。",
      ),
      meaning: t(
        "*Celebrity* and *fame* go together but are not the same: a *celebrity* is a famous person, and *fame* is being known by many people. Check whether the meaning names a person or a state.",
        "*celebrity* 和 *fame* 常一起出现但不一样：*celebrity* 是名人，*fame* 是出名这件事。看清释义说的是人还是状态。",
      ),
      spell: t(
        "*Leisure* has ei after the l, said like *zh* in the middle, and *recommend* has one c and a double m.",
        "*leisure* 的 l 后面是 ei，中间读作 *zh*；*recommend* 只有一个 c，但 m 要双写。",
      ),
    },
    notes: `
      entertainment|live music in a hotel every evening;an industry making TV shows and films;playing cards|entertainment is anything people enjoy, such as shows and games; fame is being well known|entertainment 是人们享受的演出、游戏等；fame 是出名|fame=fame is being known by many people, not shows, music or games that people enjoy=fame 是出名，不是人们享受的演出、音乐或游戏;fashion=fashion is the clothes that are popular now, not shows or games for fun=fashion 是流行的服装，不是供人娱乐的演出或游戏|en · ter · tain · ment|entertain + -ment, with ai in the middle|entertain 加 -ment，中间是 ai
      entertain|a clown and children for an hour;a film full of laughs;friends at home with dinners and games|to entertain is to keep people amused; to review is to write what you think of a show|entertain 是让人开心；review 是写对演出的看法|review/reviewed/reviewing=review means to write your opinion of a show or a book, not to amuse people or have guests=review 是写对演出或书的看法，不是逗人开心或招待客人;recommend/recommended/recommending=recommend means to tell someone to try something good, not to keep people amused=recommend 是推荐别人试试好东西，不是让人开心|en · ter · tain|ai in the last part: enter-**tain**|最后一块 -tain 里是 ai
      leisure|free time for hobbies;a new center with a pool;a favorite free-time activity such as reading|leisure is your free time; entertainment is the shows and games you might enjoy in it|leisure 是空闲时间；entertainment 是在空闲时可以享受的演出和游戏|fame=fame is being known by many people, not free time when you are not working=fame 是出名，不是不工作的空闲时间;fashion=fashion is the clothes that are popular now, not time off work=fashion 是流行服装，不是下班后的时间|lei · sure|ei after the l, and s said like *zh*|l 后面是 ei，s 读作 *zh*
      celebrity|famous actors, singers and sports stars in a magazine;being stopped in the street after a TV show;selling products to fans on social media|a celebrity is a famous person; a fan is a person who loves one|celebrity 是名人；fan 是喜欢名人的人|contest/contests=contest is a competition, not a famous person people take photos of=contest 是比赛，不是被人拍照的名人;fan/fans=fan is a person who loves a star, not the famous star whom people know=fan 是喜欢明星的人，不是人人都认识的明星|ce · leb · ri · ty|c said like s at the start, and -ity at the end|开头的 c 读 s，结尾是 -ity
      fame|a singer at only sixteen;everyone knowing your name;hot springs a town is known for|fame is being well known; a celebrity is a famous person|fame 是出名；celebrity 是名人|fashion=fashion is popular clothes, not being known by many people=fashion 是流行服装，不是很多人知道你;leisure=leisure is free time, not being known by many people=leisure 是空闲时间，不是很多人知道你|fame|a-e says its name: f-**a**-me|a-e 读字母本音：f-**a**-me
      contest|a singing competition on TV;a prize for students under eighteen;coming second out of two hundred people|a contest is a competition with a winner; a trend is a change in what people do|contest 是有输赢的比赛；trend 是人们行为的变化|trend=trend is a general change in what people do, not a competition with a winner=trend 是人们行为的总体变化，不是有赢家的比赛;review=review is a piece of writing about a show or book, not a competition you win or enter=review 是对演出或书的评论，不是可以参加和赢得的比赛|con · test|stress on the first part for the noun: **con**test|名词重音在前：**con**test
      trend|eating less meat;fashion on social media;working from home growing since 2020|a trend is a general change in what people do; fashion is the clothes in style|trend 是人们行为的总体变化；fashion 是流行的服装|contest/contests=contest is a competition with a winner, not a change in what people do=contest 是比赛，不是人们行为的变化;fashion/fashions=fashion is the clothes that are popular, not a general change toward doing something=fashion 是流行服装，不是朝某方向的总体变化|trend|tr at the start and nd at the end|开头 tr，结尾 nd
      fashion|designing clothes for models;short skirts coming back;women's clothes in the 1920s|fashion is the popular style of clothes; style is any way of doing or making something|fashion 是流行的服装款式；style 是任何做事或制作的方式|leisure=leisure is free time, not the clothes that are popular=leisure 是空闲时间，不是流行服装;celebrity=celebrity is a famous person, not the style of clothes people wear=celebrity 是名人，不是人们穿的服装款式|fash · ion|sh in the middle, and -ion said like *un*|中间是 sh，结尾 -ion 读作 *un*
      style|the way a jacket is made;a traditional Chinese building;a way of writing of her own|a style is a way of making or doing something; a trend is a change many people follow|style 是制作或做事的方式；trend 是很多人跟随的变化|trend=trend is a change in what many people do, not the way one thing is made or done=trend 是很多人行为的变化，不是某件东西的做法;fame=fame is being well known, not the way something is made or done=fame 是出名，不是东西的做法|style|y said like long i: st-**y**-le|y 读长音 i：st-**y**-le
      popular|basketball with young people all over China;a restaurant students like;the song teenagers like most this year|popular means liked by many people; famous means known by many people|popular 是很多人喜欢；famous 是很多人知道|famous=famous means known by many people, and you say famous for, not famous with=famous 是很多人知道，要说 famous for，不说 famous with;classic=classic means of high quality and loved for a long time, not liked by a group of people right now=classic 是品质高、长久受喜爱，不是现在受某些人喜欢|pop · u · lar|-ar at the end, not -er|结尾是 -ar，不是 -er
      review|excellent words in the newspapers;book writing that says which books are good or bad;reading before buying something online|a review gives an opinion of a show or a product; a contest is a competition|review 是对演出或产品的评价；contest 是比赛|contest/contests=contest is a competition, not a piece of writing that gives an opinion=contest 是比赛，不是表达看法的文章;trend/trends=trend is a change in what people do, not an opinion written about a film, a book or a product=trend 是人们行为的变化，不是对电影、书或产品写的看法|re · view|re- + view, with iew said like *you*|re- 加 view，iew 读作 *you*
      recommend|trying somewhere new tonight;a book for anyone who loves adventure;a doctor and more rest|to recommend is to tell someone to try something; to review is to write your opinion of it|recommend 是推荐别人尝试；review 是写下自己的看法|review/reviewed=review means to write about a show or a book, not to tell someone what they should try or do=review 是写评论，不是告诉别人该试什么、做什么;entertain/entertained=entertain means to amuse people or have guests, not to tell someone what is good to try=entertain 是让人开心或招待客人，不是推荐好东西|rec · om · mend|one c and a double m|一个 c，双写 m
    `,
  },
});

const describingArt = vocabularyTopic({
  id: "b1-words-describing-art",
  title: t("Describing Art", "描述艺术"),
  summary: t(
    "Abstract and realistic; colorful, dramatic and vivid; impressive and inspiring; original, imaginative and classic; elegant; dull.",
    "抽象的和逼真的；色彩丰富的、戏剧性的和生动的；令人印象深刻的和鼓舞人心的；原创的、富有想象力的和经典的；优雅的；乏味的。",
  ),
  intro: t(
    "The first painting was **abstract**, just circles and lines, but the next one was so **realistic** that it looked like a photo, with **vivid** reds and yellows. These words help you say what a work of art is like and how it makes you feel.",
    "第一幅画是 **abstract**（抽象的），只有圆圈和线条；下一幅却 **realistic**（逼真的）得像照片，用了 **vivid**（鲜艳的）红色和黄色。这些词帮你描述艺术作品的样子和带给你的感受。",
  ),
  prerequisites: ["b1-words-arts"],
  words: [
    word(
      "abstract",
      "showing shapes and colors, not real people or things",
      "抽象的",
      "I don't understand {abstract} art; it's just shapes and colors to me. | The painting is {abstract}, so everyone sees something different in it. | Kandinsky painted {abstract} pictures of circles and lines, not of people or places.",
      "realistic classic",
    ),
    word(
      "realistic",
      "showing things as they really are",
      "逼真的；现实的",
      "The painting is so {realistic} that it looks like a photo. | The film's picture of life in a hospital is {realistic}: it shows it just as doctors and nurses really live it. | Is it {realistic} to finish this by Friday?",
      "abstract imaginative",
    ),
    word(
      "colorful",
      "having many bright colors",
      "色彩丰富的",
      "The market was full of {colorful} fruit and flowers: red, yellow, orange and green. | She wore a bright, {colorful} dress with red, blue and yellow stripes. | Children love {colorful} picture books full of bright reds and blues.",
      "dull realistic",
      "vivid",
    ),
    word(
      "dramatic",
      "exciting and impressive; sudden and noticeable",
      "戏剧性的；激动人心的",
      "The film has a very {dramatic} ending: the hero falls from a bridge and everyone screams. | The change in the weather was {dramatic}: from hot sun to snow in one day. | The mountains looked {dramatic} against the dark sky as lightning flashed above them.",
      "dull elegant",
    ),
    word(
      "impressive",
      "making you admire something because it is very good or very big",
      "令人印象深刻的",
      "The new museum is a very {impressive} building, huge and made of glass, and visitors stop to admire it. | Her English is {impressive} for someone who started a year ago. | The pianist played without a single mistake: it was a truly {impressive} performance.",
      "dull abstract",
      "inspiring",
    ),
    word(
      "original",
      "new and different, not copied; the first one",
      "原创的；原来的",
      "Her ideas are always very {original}: nobody has thought of them before. | This is a copy; the {original} painting is in Paris. | The {original} version of the song, the first one recorded in 1965, was slower.",
      "ordinary dull",
      "imaginative",
    ),
    word(
      "classic",
      "of a very high quality, and popular for a long time",
      "经典的；一流的",
      "Casablanca is a {classic} film that people still love eighty years later. | The radio station plays {classic} songs that everyone still knows and loves. | Pride and Prejudice is a {classic} novel, still read and loved two hundred years later.",
      "modern dull",
    ),
    word(
      "elegant",
      "beautiful in a simple, graceful way",
      "优雅的；雅致的",
      "She looked very {elegant} in her long black dress. | The hotel's dining room is {elegant}, with simple white tables and soft lights. | The bridge is simple and {elegant}, with one graceful curve over the river.",
      "colorful abstract",
    ),
    word(
      "dull",
      "boring; not bright",
      "乏味的；暗淡的",
      "The film was so {dull} that I fell asleep. | The colors in the painting are {dull} and gray. | The winter day was {dull}, gray and cloudy, with nothing to do.",
      "vivid impressive",
    ),
    word(
      "inspiring",
      "making you want to do something or feel you can do it",
      "鼓舞人心的",
      "The {inspiring} story of a blind runner who won a medal made me want to start running too. | Her speech was very {inspiring}: after it, we all felt we could change the world. | Our {inspiring} teacher made us believe we could all go to university.",
      "dull realistic",
      "impressive",
    ),
    word(
      "imaginative",
      "having or showing new and clever ideas",
      "富有想象力的",
      "The story is very {imaginative}: it's about a city under the sea where fish can talk. | The children made {imaginative} costumes out of paper: one was a dragon and one was a robot. | She's a very {imaginative} writer who invents whole new worlds.",
      "realistic dull",
      "original",
    ),
    word(
      "vivid",
      "very bright in color; very clear in your mind",
      "鲜艳的；生动的",
      "The painting uses {vivid} reds and yellows that shine like the sun. | I still have {vivid} memories of my first day at school: I remember every face. | The book's description of the war is so {vivid} that you feel you are there.",
      "dull abstract",
      "colorful",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Impressive* and *inspiring* both praise something, but *impressive* means you admire how good or big it is, and *inspiring* means it makes you want to do something yourself. Look for admiring, or for wanting to act.",
        "*impressive* 和 *inspiring* 都是夸赞，但 *impressive* 是佩服它好或大，*inspiring* 是让你自己也想去做。找找句子里是佩服，还是想行动。",
      ),
      meaning: t(
        "*Original* and *classic* can both describe a famous film: *original* means new and not copied, and *classic* means very good and loved for a long time. Check whether the meaning says new or long loved.",
        "*original* 和 *classic* 都能形容有名的电影：*original* 是新颖、非抄袭的，*classic* 是品质极高、长久受喜爱的。看清释义说的是新，还是长久受欢迎。",
      ),
      spell: t(
        "*Colorful* ends in one l, -ful, and *imaginative* keeps the a of *imagine*: imagin-**a**-tive.",
        "*colorful* 结尾 -ful 只有一个 l；*imaginative* 保留了 *imagine* 的 a：imagin-**a**-tive。",
      ),
    },
    notes: `
      abstract|art that is just shapes and colors;a painting everyone sees differently;circles and lines, not people or places|abstract art shows shapes and colors; realistic art shows things as they really are|abstract 画的是形状和颜色；realistic 按事物本来的样子画|realistic=realistic means showing things as they really are, not just shapes and colors=realistic 是按事物本来的样子呈现，不只是形状和颜色;classic=classic means very good and loved for a long time, not made of shapes instead of real things=classic 是品质高、长久受喜爱，不是用形状代替真实事物|ab · stract|str in the middle, and -act at the end|中间是 str，结尾是 -act
      realistic|a painting that looks like a photo;hospital life as doctors and nurses really live it;finishing by Friday|realistic means like real life; abstract means only shapes and colors|realistic 是像真实生活；abstract 只有形状和颜色|abstract=abstract means showing only shapes and colors, not things as they really are=abstract 是只呈现形状和颜色，不是事物本来的样子;imaginative=imaginative means full of new, clever ideas, not true to real life=imaginative 是充满新奇想法，不是贴近真实生活|re · al · is · tic|real + -istic|real 加 -istic
      colorful|red, yellow, orange and green fruit and flowers;a dress with red, blue and yellow stripes;picture books of bright reds and blues|colorful means having many bright colors; dull means not bright|colorful 是色彩丰富；dull 是暗淡|dull=dull means gray and not bright, not full of many bright colors=dull 是灰暗不鲜亮，不是色彩丰富;realistic=realistic means true to real life, not full of many bright colors=realistic 是贴近真实，不是色彩丰富|col · or · ful|-ful with one l at the end|结尾 -ful 只有一个 l
      dramatic|a hero falling from a bridge and everyone screaming;hot sun turning to snow in one day;mountains under flashing lightning|dramatic means exciting or sudden; dull means boring|dramatic 是激动人心或突然的；dull 是乏味的|dull=dull means boring or gray, not exciting, sudden or impressive=dull 是乏味或灰暗，不是激动人心、突然或壮观;elegant=elegant means simple and graceful, not exciting or sudden=elegant 是简洁优雅，不是激动人心或突然|dra · mat · ic|drama + -tic|drama 加 -tic
      impressive|a huge glass museum visitors admire;English after only a year;a pianist without a single mistake|impressive makes you admire how good or big something is; inspiring makes you want to act|impressive 让人佩服它好或大；inspiring 让人想去行动|dull=dull means boring, not something that makes people admire it=dull 是乏味，不会让人佩服;abstract=abstract means only shapes and colors, not good or big enough to admire=abstract 是只有形状和颜色，不是好得或大得让人佩服|im · pres · sive|the double s, and -ive at the end|双写 s，结尾是 -ive
      original|ideas nobody has thought of;the real painting in Paris, not the copy;the first recording in 1965|original means new and not copied, or the first one; ordinary means normal and not special|original 是新颖、非抄袭或最初的；ordinary 是普通的|ordinary=ordinary means normal and not special, not new or the first one=ordinary 是普通、不特别，不是新颖的或最初的;dull=dull means boring, not new or the first of its kind=dull 是乏味，不是新颖的或最初的|o · rig · i · nal|g said like j: o-ri-**g**i-nal|g 读 j：o-ri-**g**i-nal
      classic|Casablanca still loved eighty years later;songs everyone still knows;a novel read two hundred years later|classic means very good and loved for a long time; modern means new and of today|classic 是长久受喜爱的经典；modern 是现代的|modern=modern means new and of the present time, not loved for a very long time=modern 是新的、当代的，不是长久受喜爱的;dull=dull means boring, not so good that people still love it years later=dull 是乏味，不是好到多年后仍受喜爱|clas · sic|the double s, and -ic at the end; *classical* is for old serious music|双写 s，结尾 -ic；*classical* 用于古典音乐
      elegant|a long black dress;simple white tables and soft lights;one graceful curve over a river|elegant means beautiful in a simple, graceful way; colorful means bright with many colors|elegant 是简洁优雅；colorful 是色彩缤纷|colorful=colorful means full of bright colors, not simple and graceful=colorful 是色彩鲜艳，不是简洁优雅;abstract=abstract means only shapes and colors, not beautiful in a simple, graceful way=abstract 是只有形状和颜色，不是简洁优雅|el · e · gant|-ant at the end, not -ent|结尾是 -ant，不是 -ent
      dull|falling asleep at a film;gray colors in a painting;a gray, cloudy winter day with nothing to do|dull means boring or not bright; vivid means very bright or clear|dull 是乏味或暗淡；vivid 是鲜艳或清晰|vivid=vivid means very bright or very clear, not boring or gray=vivid 是鲜艳或清晰，不是乏味灰暗;impressive=impressive means good enough to admire, not boring or gray=impressive 是好到让人佩服，不是乏味灰暗|dull|the double l at the end|结尾双写 l
      inspiring|a blind runner's medal and wanting to run too;a speech after which we felt we could change the world;a teacher making us believe in university|inspiring makes you want to do something; impressive makes you admire something|inspiring 让人想去做；impressive 让人佩服|dull=dull means boring, not something that makes you want to act=dull 是乏味，不会让人想行动;realistic=realistic means true to life, not something that makes you believe you can do more=realistic 是贴近真实，不会让人相信自己能做得更多|in · spir · ing|inspire drops its e before -ing|inspire 去掉 e 再加 -ing
      imaginative|a city under the sea with talking fish;paper costumes of a dragon and a robot;a writer inventing new worlds|imaginative means full of new, clever ideas; realistic means like real life|imaginative 是富有想象力；realistic 是贴近现实|realistic=realistic means true to real life, not full of invented ideas=realistic 是贴近现实，不是充满想象;dull=dull means boring, not full of new and clever ideas=dull 是乏味，不是充满新奇想法|i · mag · i · na · tive|imagine keeps its a: imagin-**a**-tive|保留 imagine 的 a：imagin-**a**-tive
      vivid|reds and yellows shining like the sun;memories of every face on a first day;a war description so clear you feel there|vivid means very bright or very clear; dull means not bright or boring|vivid 是鲜艳或清晰；dull 是暗淡或乏味|dull=dull means not bright and not clear, the opposite of shining colors or sharp memories=dull 是暗淡模糊，和鲜亮的颜色或清晰的记忆正相反;abstract=abstract means made of shapes, not very bright or very clear=abstract 是由形状构成，不是鲜艳或清晰|viv · id|each i said short, as in *it*: v-**i**-v-**i**-d|每个 i 都读短音，和 *it* 一样：v-**i**-v-**i**-d
    `,
  },
});

const goingOut = vocabularyTopic({
  id: "b1-words-going-out",
  title: t("Going Out", "外出娱乐"),
  summary: t(
    "Bookings, admission and rows; premieres; applause and applauding; venues and nightlife; spectators; gigs, carnivals and circuses.",
    "预订、入场和座位排；首映；掌声和鼓掌；场馆和夜生活；观众；演出、狂欢节和马戏团。",
  ),
  intro: t(
    "We made a **booking** for the **premiere**, sat in the front **row**, and at the end the whole cinema burst into **applause**. These words help you plan a night out and talk about shows, tickets and crowds.",
    "我们 **booking**（预订）了 **premiere**（首映）的座位，坐在第一 **row**（排），结束时全场爆发出 **applause**（掌声）。这些词帮你安排外出的夜晚，谈论演出、门票和观众。",
  ),
  prerequisites: ["a2-words-festivals"],
  words: [
    word(
      "booking bookings",
      "an arrangement to have a seat, a table or a room at a certain time",
      "预订",
      "I made the {booking} for a table for four at seven o'clock. | The theater doesn't take {bookings} by phone.|admissions venues | Can I change my {booking} to Saturday?",
      "admission venue",
    ),
    word(
      "admission",
      "the money you pay to go into a place; being allowed to enter",
      "入场费；入场",
      "{Admission} to the museum is free. | {Admission} to the zoo costs ten dollars for adults, paid at the gate. | Children under five get free {admission}.",
      "booking applause",
    ),
    word(
      "row rows",
      "a line of seats in a theater or a cinema",
      "（座位的）排",
      "We sat in the front {row} of seats, close to the stage. | Our seats are numbers 12 and 13 in {row} F. | There are thirty {rows} of seats in the hall.|bookings venues",
      "booking venue",
    ),
    word(
      "premiere premieres",
      "the first public performance of a play or the first showing of a film",
      "首映；首演",
      "The film stars came to the {premiere} in Shanghai. | The {premiere} of the new play is on Friday: it will be the very first time an audience sees it. | We had tickets for the {premiere}, the first showing of the film before anyone else saw it.",
      "rehearsal gig",
    ),
    word(
      "applause",
      "the noise of people clapping their hands to show that they enjoyed something",
      "掌声",
      "The singer came back on stage to loud {applause}. | There was {applause} at the end of the speech. | Let's give a round of {applause} to our speaker!",
      "admission nightlife",
      "applaud",
    ),
    word(
      "applaud applauds applauded applauding",
      "to clap your hands to show that you enjoyed something",
      "鼓掌",
      "Everyone stood up and {applauded}, clapping loudly at the end of the show.|performed rehearsed | The audience {applauded} for five minutes, clapping their hands until they hurt.|performed rehearsed | We {applaud} at the end of a performance to thank the actors.",
      "perform rehearse",
      "applause",
    ),
    word(
      "venue venues",
      "the place where an event such as a concert or a match happens",
      "（活动）场馆；场地",
      "The concert {venue} holds 20,000 people. | We need to find a {venue} for the wedding: a hall or a garden big enough for two hundred guests. | The city has many music {venues}, from small clubs to big stadiums.|bookings premieres",
      "booking premiere",
    ),
    word(
      "nightlife",
      "the entertainment, such as bars, clubs and concerts, that is available at night",
      "夜生活",
      "The city is famous for its {nightlife}: bars and clubs that stay open until morning. | There isn't much {nightlife} in our small town; everything closes at nine. | Students enjoy the {nightlife} near the university.",
      "admission applause",
    ),
    word(
      "spectator spectators",
      "a person who watches an event, especially a sport",
      "观众（尤指体育比赛）",
      "Thousands of {spectators} sat in the stands and watched the match.|venues gigs | The {spectators} cheered when the runner crossed the line.|venues gigs | One {spectator} ran onto the field.",
      "venue gig",
    ),
    word(
      "gig gigs",
      "a performance of popular music",
      "（流行音乐）演出",
      "My brother's band has a {gig} on Saturday night. | We went to a {gig} in a small club and danced to the band all night. | The band played over a hundred {gigs} last year.|premieres circuses",
      "premiere circus",
    ),
    word(
      "carnival carnivals",
      "a public festival with music and dancing in the streets",
      "狂欢节",
      "The {carnival} in Rio de Janeiro, with samba dancers in the streets, is famous all over the world. | People wear colorful costumes and dance through the streets at the {carnival}. | The town holds a summer {carnival} every year, and the main street is closed for the parade.",
      "circus premiere",
    ),
    word(
      "circus circuses",
      "a show with acrobats, clowns and sometimes animals, often in a big tent",
      "马戏团；马戏表演",
      "We took the children to the {circus} to see the clowns and acrobats. | The {circus} came to town for a week and put up its big tent in the park. | Many {circuses} no longer use animals, such as lions and elephants, in their shows.|carnivals gigs",
      "carnival gig",
    ),
  ],
  teaching: {
    watchOut: {
      complete: t(
        "*Gig*, *circus* and *carnival* are all shows, but a *gig* is pop music in a club or hall, a *circus* has clowns and acrobats in a big tent, and a *carnival* fills the streets with music and dancing. Look for a band, a tent or a street parade.",
        "*gig*、*circus* 和 *carnival* 都是演出，但 *gig* 是俱乐部或礼堂里的流行音乐演出，*circus* 是大帐篷里的小丑和杂技，*carnival* 是满街的音乐和舞蹈。找找句子里是乐队、帐篷还是街头游行。",
      ),
      meaning: t(
        "*Applause* and *applaud* are the same idea in two forms: *applause* is the noise of clapping, a thing, and *applaud* is to clap, an action. Check whether the meaning says a noise or to do something.",
        "*applause* 和 *applaud* 是同一个意思的两种形式：*applause* 是掌声，是名词；*applaud* 是鼓掌，是动作。看清释义说的是声音还是做某事。",
      ),
      spell: t(
        "*Premiere* ends in -iere, with an e at the end, and *applaud* and *applause* both start with a double p.",
        "*premiere* 结尾是 -iere，最后还有一个 e；*applaud* 和 *applause* 开头都双写 p。",
      ),
    },
    notes: `
      booking|a table for four at seven o'clock;a theater that takes none by phone;changing to Saturday|a booking keeps a seat or a table for you; admission is going in, or the money for it|booking 是为你预留座位或桌子；admission 是入场或入场费|admission/admissions=admission is going into a place or the money you pay at the door, not a seat or a table kept for you at a certain time=admission 是入场或门口付的钱，不是为你预留某个时间的座位或桌子;venue/venues=venue is the place where an event happens, not an arrangement to keep a seat=venue 是举办活动的场地，不是预留座位的安排|book · ing|book + -ing, with oo as in *look*|book 加 -ing，oo 和 *look* 一样
      admission|a free museum;ten dollars at the zoo gate;children under five going in free|admission is going in, or the money for it; a booking keeps a seat for later|admission 是入场或入场费；booking 是提前预留座位|booking=booking keeps a seat or a table for a certain time, not the money you pay to go in=booking 是预留某个时间的座位，不是进门付的钱;applause=applause is the noise of clapping, not going in or the money for it=applause 是掌声，不是入场或入场费|ad · mis · sion|the double s, and -sion said like *shun*|双写 s，-sion 读作 *shun*
      row|the front line of seats close to the stage;seats 12 and 13 in letter F;thirty lines of seats in the hall|a row is a line of seats; a venue is the whole place|row 是一排座位；venue 是整个场地|booking/bookings=booking is an arrangement to keep a seat, not the line the seats stand in=booking 是预留座位的安排，不是座位排成的一排;venue/venues=venue is the whole place where an event happens, not one line of seats inside it=venue 是整个活动场地，不是其中的一排座位|row|ow said like long o, as in *show*|ow 读长音 o，和 *show* 一样
      premiere|film stars in Shanghai;the very first time an audience sees a new play;the first showing of a film|a premiere is the first public showing; a rehearsal is practice with no audience|premiere 是首次公开演出；rehearsal 是没有观众的排练|rehearsal=rehearsal is practice before the show, with no audience and no tickets=rehearsal 是演出前的排练，没有观众，也不卖票;gig=gig is a pop music show, not the first showing of a film or a play=gig 是流行音乐演出，不是电影或戏剧的首映|pre · miere|-iere at the end, with an e after the r|结尾是 -iere，r 后面还有一个 e
      applause|a singer coming back to loud clapping;clapping at the end of a speech;a round of clapping for a speaker|applause is the noise of clapping; to applaud is to clap|applause 是掌声；applaud 是鼓掌的动作|admission=admission is going into a place or the money for it, not the noise of clapping=admission 是入场或入场费，不是掌声;nightlife=nightlife is bars and clubs open at night, not the noise of people clapping=nightlife 是夜间的酒吧和俱乐部，不是掌声|ap · plause|the double p, and -ause at the end|双写 p，结尾是 -ause
      applaud|everyone standing and clapping loudly;five minutes of clapping until the hands hurt;thanking the actors|to applaud is to clap; to perform is to be the one on stage|applaud 是鼓掌；perform 是在台上表演|perform/performed=perform means to act, sing or play for an audience, not to clap for the people on stage=perform 是为观众表演，不是给台上的人鼓掌;rehearse/rehearsed=rehearse means to practice before a show, not to clap at the end of it=rehearse 是演出前排练，不是演出后鼓掌|ap · plaud|the double p, and au said like *aw*|双写 p，au 读作 *aw*
      venue|a concert place for 20,000 people;a hall or garden for two hundred wedding guests;small clubs and big stadiums|a venue is the place where an event happens; a booking keeps a seat there|venue 是活动场地；booking 是在那里预留座位|booking/bookings=booking is an arrangement to keep a seat or a room, not the place itself=booking 是预留座位或房间的安排，不是场地本身;premiere/premieres=premiere is the first showing of a film or play, not a place that holds people=premiere 是首映，不是能容纳人的场地|ven · ue|-ue at the end, said like *you*|结尾 -ue 读作 *you*
      nightlife|bars and clubs open until morning;a small town where everything closes at nine;students near the university|nightlife is what you can do at night; admission is going into a place|nightlife 是夜间娱乐；admission 是入场|admission=admission is going into a place or the money for it, not bars and clubs at night=admission 是入场或入场费，不是夜间的酒吧和俱乐部;applause=applause is the noise of clapping, not things to do at night=applause 是掌声，不是夜里可做的事|night · life|night + life joined, with silent gh|night 和 life 连写，gh 不发音
      spectator|thousands in the stands at a match;cheering a runner crossing the line;one person running onto the field|a spectator watches an event; a venue is the place where it happens|spectator 是观看比赛的人；venue 是比赛场地|venue/venues=venue is the place where an event happens, so it cannot watch, cheer or run=venue 是活动场地，不会观看、欢呼或跑动;gig/gigs=gig is a pop music show, not a person who watches a match=gig 是流行音乐演出，不是看比赛的人|spec · ta · tor|-or at the end, not -er|结尾是 -or，不是 -er
      gig|a brother's band on Saturday night;dancing to a band in a small club;more than a hundred shows by a band in a year|a gig is a pop music show; a premiere is the first showing of a film or play|gig 是流行音乐演出；premiere 是电影或戏剧的首映|premiere/premieres=premiere is the first showing of a film or a play, not a band playing in a club=premiere 是电影或戏剧的首映，不是乐队在俱乐部演出;circus/circuses=circus is a show of clowns and acrobats in a tent, not a band playing pop music=circus 是帐篷里的小丑和杂技表演，不是乐队演奏流行乐|gig|g said hard at the start and the end, as in *go*|开头和结尾的 g 都读硬音，和 *go* 一样
      carnival|samba dancers in Rio's streets;costumes and dancing through the streets;a parade on a closed main street|a carnival fills the streets with music and dancing; a circus is a show in a tent|carnival 是满街音乐舞蹈的狂欢节；circus 是帐篷里的表演|circus=circus is a show of clowns and acrobats inside a big tent, not dancing in the streets=circus 是大帐篷里的小丑和杂技，不是街头舞蹈;premiere=premiere is the first showing of a film or play, not a festival in the streets=premiere 是首映，不是街头节日|car · ni · val|-al at the end, not -le|结尾是 -al，不是 -le
      circus|clowns and acrobats for the children;a big tent in the park for a week;lions and elephants in shows|a circus is a show with clowns and acrobats in a tent; a carnival is a street festival|circus 是帐篷里有小丑和杂技的表演；carnival 是街头节日|carnival/carnivals=carnival is a festival with music and dancing in the streets, not a show in a tent with clowns and animals=carnival 是街头音乐舞蹈节，不是帐篷里有小丑和动物的表演;gig/gigs=gig is a pop music show, not a show with clowns, acrobats or animals=gig 是流行音乐演出，没有小丑、杂技或动物|cir · cus|c said like s, then like k: **s**ir-**k**us|第一个 c 读 s，第二个 c 读 k
    `,
  },
});

// Phrasal verbs.

/**
 * phrasals are sentences with a phrasal verb: the sentence with its small word missing, the small word, two wrong
 * small words, the phrasal verb, its meaning here and two meanings it does not have.
 */
const handPhrasals: readonly (readonly [string, string, readonly [string, string], string, string, readonly [string, string]])[] = [
  ["I can't hear the TV. Can you turn it ___?", "up", ["down", "off"], "turn up", "make louder", ["leave the ground", "become an adult"]],
  ["The music is too loud! Please turn it ___.", "down", ["up", "in"], "turn down", "make quieter", ["phone again", "learn a fact"]],
  [
    "He tried to stop smoking many times, but he always gave ___ after a week.",
    "up",
    ["back", "away"],
    "give up",
    "stop trying",
    ["start wearing", "write on paper"],
  ],
  [
    "Can you look ___ my cat while I'm on holiday?",
    "after",
    ["up", "into"],
    "look after",
    "take care of",
    ["move to a later time", "stop sleeping"],
  ],
  ["I need to find ___ what time the train leaves.", "out", ["up", "over"], "find out", "learn a fact", ["make quieter", "remove clothes"]],
  [
    "Let me look ___ the word in the dictionary.",
    "up",
    ["after", "out"],
    "look up",
    "search for in a book or online",
    ["become an adult", "refuse"],
  ],
  ["We ran ___ of milk, so I went to the shop.", "out", ["up", "off"], "run out of", "have no more of", ["return", "start wearing"]],
  [
    "I'm really looking forward ___ the holidays.",
    "to",
    ["at", "for"],
    "look forward to",
    "be happy about something that will happen",
    ["stop working", "remove clothes"],
  ],
  ["She grew ___ in a small village in the mountains.", "up", ["out", "on"], "grow up", "become an adult", ["make louder", "phone again"]],
  ["Our car broke ___ on the motorway.", "down", ["up", "out"], "break down", "stop working", ["take care of", "learn a fact"]],
  ["Please carry ___ with your work while I'm out.", "on", ["off", "up"], "carry on", "continue", ["refuse", "leave the ground"]],
  ["What time did you wake ___ this morning?", "up", ["on", "off"], "wake up", "stop sleeping", ["continue", "disappoint"]],
  [
    "Fill ___ the form with your name and address.",
    "in",
    ["on", "at"],
    "fill in",
    "write information in a form",
    ["return", "stop working"],
  ],
  ["The plane took ___ at six o'clock.", "off", ["up", "on"], "take off", "leave the ground", ["make quieter", "have no more of"]],
  [
    "Put ___ your coat; it's cold outside.",
    "on",
    ["off", "out"],
    "put on",
    "start wearing",
    ["stop trying", "search for in a book or online"],
  ],
  ["Take ___ your shoes before you come in.", "off", ["on", "up"], "take off", "remove clothes", ["become an adult", "continue"]],
  ["Write ___ my phone number so you don't forget it.", "down", ["off", "in"], "write down", "write on paper", ["stop sleeping", "refuse"]],
  [
    "I'm busy now. I'll call you ___ in ten minutes.",
    "back",
    ["out", "off"],
    "call back",
    "phone again",
    ["start wearing", "stop working"],
  ],
  [
    "Don't throw ___ those bottles; we can recycle them.",
    "away",
    ["off", "in"],
    "throw away",
    "put in the rubbish",
    ["learn a fact", "continue"],
  ],
  [
    "The meeting has been put ___ until Friday because the manager is ill.",
    "off",
    ["on", "up"],
    "put off",
    "move to a later time",
    ["make louder", "remove clothes"],
  ],
  [
    "Can I try ___ these jeans before I buy them?",
    "on",
    ["in", "up"],
    "try on",
    "put on to see if it fits",
    ["phone again", "have no more of"],
  ],
  [
    "My grandmother brought ___ six children on her own.",
    "up",
    ["out", "off"],
    "bring up",
    "care for a child until it is an adult",
    ["leave the ground", "make quieter"],
  ],
  [
    "Do you get ___ well with your sister?",
    "on",
    ["off", "up"],
    "get on with",
    "have a friendly relationship with",
    ["stop trying", "move to a later time"],
  ],
  [
    "I can't work ___ the answer to this math question.",
    "out",
    ["in", "off"],
    "work out",
    "find the answer to",
    ["start wearing", "return"],
  ],
  [
    "The teacher told us to hand ___ our homework on Monday.",
    "in",
    ["on", "at"],
    "hand in",
    "give work to a teacher",
    ["stop sleeping", "disappoint"],
  ],
  ["Hurry up! The bus is going to leave without us. Come ___!", "on", ["off", "down"], "come on", "hurry", ["write on paper", "refuse"]],
  ["When will you come ___ from your trip?", "back", ["on", "off"], "come back", "return", ["take care of", "make louder"]],
  [
    "Pick ___ your clothes from the floor, please.",
    "up",
    ["on", "off"],
    "pick up",
    "lift from a surface",
    ["learn a fact", "become an adult"],
  ],
  ["We set ___ early to avoid the traffic.", "off", ["on", "down"], "set off", "start a journey", ["phone again", "stop working"]],
  ["She turned ___ the job because the pay was too low.", "down", ["up", "on"], "turn down", "refuse", ["leave the ground", "hurry"]],
  [
    "Please turn ___ the lights when you leave the room.",
    "off",
    ["on", "up"],
    "turn off",
    "stop a light or a machine with a switch",
    ["continue", "start wearing"],
  ],
  ["You promised to come. Don't let me ___!", "down", ["up", "off"], "let down", "disappoint", ["make louder", "learn a fact"]],
  ["The fire alarm went ___ in the middle of the night.", "off", ["in", "up"], "go off", "start ringing", ["take care of", "return"]],
];

/** phrasalDoers are people who do the things in phrasalFrames. */
const phrasalDoers = ["Tom", "Anna", "My dad", "Our neighbor", "My cousin", "The new student", "Grandma"] as const;

/** phrasalFrames are sentences with {who}, the small word, two wrong small words, the phrasal verb and its meaning here. */
const phrasalFrames: readonly (readonly [string, string, readonly [string, string], string, string])[] = [
  ["{who} grew ___ in a small village.", "up", ["out", "on"], "grow up", "become an adult"],
  ["{who} gave ___ after trying three times.", "up", ["back", "away"], "give up", "stop trying"],
  ["{who} looked ___ the word in a dictionary.", "up", ["after", "out"], "look up", "search for in a book or online"],
  ["{who} looked ___ our cat while we were away.", "after", ["up", "into"], "look after", "take care of"],
  ["{who} found ___ the answer on the internet.", "out", ["up", "over"], "find out", "learn a fact"],
  ["{who} woke ___ at five this morning.", "up", ["on", "off"], "wake up", "stop sleeping"],
  ["{who} filled ___ the form and signed it.", "in", ["on", "at"], "fill in", "write information in a form"],
  ["{who} put ___ a warm coat and went out.", "on", ["off", "out"], "put on", "start wearing"],
  ["{who} took ___ the wet boots at the door.", "off", ["on", "up"], "take off", "remove clothes"],
  ["{who} wrote ___ the address on a piece of paper.", "down", ["off", "in"], "write down", "write on paper"],
  ["{who} called me ___ an hour later.", "back", ["out", "off"], "call back", "phone again"],
  ["{who} threw ___ the old newspapers.", "away", ["off", "in"], "throw away", "put in the rubbish"],
  ["{who} turned ___ the job offer.", "down", ["up", "on"], "turn down", "refuse"],
  ["{who} set ___ before sunrise.", "off", ["on", "down"], "set off", "start a journey"],
  ["{who} came ___ from the trip last night.", "back", ["on", "off"], "come back", "return"],
  ["{who} tried ___ the jacket in the shop.", "on", ["in", "up"], "try on", "put on to see if it fits"],
  ["{who} worked ___ the answer in two minutes.", "out", ["in", "off"], "work out", "find the answer to"],
  ["{who} handed ___ the homework a day late.", "in", ["on", "at"], "hand in", "give work to a teacher"],
  ["{who} picked ___ the pen from the floor.", "up", ["on", "off"], "pick up", "lift from a surface"],
  ["{who} turned ___ the lights and went to bed.", "off", ["on", "up"], "turn off", "stop a light or a machine with a switch"],
  ["{who} turned ___ the radio because it was too quiet.", "up", ["down", "off"], "turn up", "make louder"],
  ["{who} turned ___ the music because the baby was asleep.", "down", ["up", "in"], "turn down", "make quieter"],
];

/** phrasals are the hand-written sentences and one for every person with every frame, with the wrong meanings of the hand-written one. */
const phrasals: readonly (readonly [string, string, readonly [string, string], string, string, readonly [string, string]])[] = [
  ...handPhrasals,
  ...everyPair(phrasalFrames, phrasalDoers).map(([[frame, particle, wrong, verb, meaning], who]) => {
    const wrongMeanings = handPhrasals.find(([, , , v, m]) => v === verb && m === meaning)?.[5] ?? ["", ""];
    return [frame.replace("{who}", who), particle, wrong, verb, meaning, wrongMeanings] as const;
  }),
];

const particleChoice: readonly ChoiceItem[] = phrasals.map(([s, right, wrong]): ChoiceItem => [s, right, wrong]);

const meaningChoice: readonly ChoiceItem[] = phrasals.map(
  ([s, particle, , verb, meaning, wrong]): ChoiceItem => [`${s.replace("___", particle)} → ${verb}`, meaning, wrong],
);

/**
 * separable are phrasal verbs that take an object pronoun between the verb and the small word: the context with a gap,
 * the verb as it appears, the small word and the pronoun.
 */
const handSeparable: readonly (readonly [string, string, string, string])[] = [
  ["The music is too loud. Please ___.", "turn", "down", "it"],
  ["I can't hear the radio. Can you ___?", "turn", "up", "it"],
  ["It's dark in here. Where's the light? Can you ___?", "turn", "on", "it"],
  ["The TV is still on. Please ___ before you go to bed.", "turn", "off", "it"],
  ["Your coat is on the floor. Please ___.", "pick", "up", "it"],
  ["Here's your coat. You should ___; it's cold.", "put", "on", "it"],
  ["Your shoes are wet. Please ___ before you come in.", "take", "off", "them"],
  ["Your toys are everywhere. Please ___.", "put", "away", "them"],
  ["This milk is old. You should ___.", "throw", "away", "it"],
  ["I like this jacket. Can I ___?", "try", "on", "it"],
  ["Here is the form. Please ___ and sign it.", "fill", "in", "it"],
  ["That's a good idea. Let me ___ before I forget it.", "write", "down", "it"],
  ["I don't know this word. I'll ___ in the dictionary.", "look", "up", "it"],
  ["Anna phoned while you were out. Can you ___?", "call", "back", "her"],
  ["The baby is sleeping. Please don't ___.", "wake", "up", "her"],
  ["You borrowed my book last month. Please ___.", "give", "back", "it"],
  ["The meeting isn't urgent. Let's ___ until next week.", "put", "off", "it"],
  ["The new computer is still in its box. Can you help me ___?", "set", "up", "it"],
  ["This puzzle is very hard. I can't ___.", "work", "out", "it"],
  ["The essay is finished. We have to ___ tomorrow.", "hand", "in", "it"],
  ["The kitchen is a mess. Let's ___.", "clean", "up", "it"],
  ["I promised to help him, and I won't ___.", "let", "down", "him"],
  ["They offered him the job, but he ___.", "turned", "down", "it"],
  ["Here are your sunglasses. Why don't you ___? It's very sunny.", "put", "on", "them"],
  ["I lent Tom 20 dollars, and he still hasn't ___.", "paid", "back", "me"],
  ["The radio was broken, so my dad ___ to fix it.", "took", "apart", "it"],
  ["Those old magazines are useless. Let's ___.", "throw", "out", "them"],
  ["The children finish school at three. I'll ___ then.", "pick", "up", "them"],
  ["There's a mistake in this sentence. Please ___ and write it again.", "cross", "out", "it"],
  ["When you finish the book, please ___ on the shelf.", "put", "back", "it"],
  ["I've got some old clothes. I'm going to ___ to charity.", "give", "away", "them"],
  ["The computer is very slow. Try to ___ and on again.", "turn", "off", "it"],
];

/** objectScenes are a sentence about a thing or a person, the verb and small word to do to it, and its pronoun. */
const objectScenes: readonly (readonly [string, string, string, string])[] = [
  ["Your coat is on the floor.", "pick", "up", "it"],
  ["The toys are on the floor.", "pick", "up", "them"],
  ["It's cold, and here is your hat.", "put", "on", "it"],
  ["Here are your gloves.", "put", "on", "them"],
  ["Your boots are muddy.", "take", "off", "them"],
  ["Your jacket is wet.", "take", "off", "it"],
  ["This bread is old.", "throw", "away", "it"],
  ["These bananas are bad.", "throw", "away", "them"],
  ["It's dark in here, and here's the lamp.", "turn", "on", "it"],
  ["Nobody is watching the TV.", "turn", "off", "it"],
  ["The lights are still on.", "turn", "off", "them"],
  ["The radio is too loud.", "turn", "down", "it"],
  ["I can't hear the music.", "turn", "up", "it"],
  ["Here is my new address.", "write", "down", "it"],
  ["I don't know these words.", "look", "up", "them"],
  ["Here are the forms.", "fill", "in", "them"],
  ["That's my pen.", "give", "back", "it"],
  ["Those are my books.", "give", "back", "them"],
  ["The dishes are dry now.", "put", "away", "them"],
  ["Your clothes are clean now.", "put", "away", "them"],
  ["The kitchen is a mess.", "clean", "up", "it"],
  ["Anna phoned.", "call", "back", "her"],
  ["Your dad phoned.", "call", "back", "him"],
  ["The children are at the park.", "pick", "up", "them"],
];

/** requestFrames ask for something to be done, with a gap for the phrasal verb and its pronoun. */
const requestFrames = ["Please ___.", "Can you ___?", "Could you ___, please?", "Don't forget to ___.", "I'll ___ later."] as const;

/** separable are the hand-written items and one for every scene with every request. */
const separable: readonly (readonly [string, string, string, string])[] = [
  ...handSeparable,
  ...everyPair(objectScenes, requestFrames).map(
    ([[scene, verb, particle, pronoun], frame]) => [`${scene} ${frame}`, verb, particle, pronoun] as const,
  ),
];

const pronounTyped: readonly TypedItem[] = separable.map(
  ([s, verb, particle, pronoun]): TypedItem => ({
    shown: `${s} (${verb} ${particle} · ${pronoun})`,
    accepted: [`${verb} ${pronoun} ${particle}`],
    wrong: [`${verb} ${particle} ${pronoun}`],
  }),
);

/** phrasalOf finds the phrasal verb of a gapped sentence. */
const phrasalOf = (shown: string) =>
  phrasals.find(([s]) => s === shown) ?? phrasals.find(([s]) => shown.startsWith(s.replace(/___.*$/u, "")));

/** verbWithMeaning is the first phrasal verb that has a meaning. */
const verbWithMeaning = (meaning: string): string | undefined => phrasals.find(([, , , , m]) => m === meaning)?.[3];

/** whyNotParticle explains a small word that makes another phrasal verb or none that fits. */
const whyNotParticle = (wrong: string, _right: string, shown: string): Text => {
  const [, , , verb = "", meaning = ""] = phrasalOf(shown) ?? [];
  const base = verb.split(" ")[0] ?? "";
  const other = phrasals.find(([, , , v]) => v === `${base} ${wrong}` || v.startsWith(`${base} ${wrong} `));
  return other
    ? t(
        `*${other[3]}* means *${other[4]}*, which does not match the meaning needed in this sentence.`,
        `*${other[3]}* 的意思是 *${other[4]}*，与这句话需要的意思不符。`,
      )
    : t(`*${base} ${wrong}* does not mean *${meaning}* in English.`, `英语里 *${base} ${wrong}* 并不表示 *${meaning}*。`);
};

const phrasalVerbs: TopicDef = {
  id: "phrasal-verbs",
  title: t("Phrasal Verbs", "短语动词"),
  summary: t(
    "turn down, find out, give up, look after: a verb and a small word together often mean something new; an object pronoun goes between them: turn it down.",
    "turn down, find out, give up, look after：动词和一个小词合在一起常常有新的意思；宾语代词放在两者中间：turn it down。",
  ),
  intro: t(
    "Change one small particle and the whole meaning flips: *turn on* (start), *turn off* (stop), *turn up* (louder), *turn down* (quieter or refuse). And when the object is a pronoun like *it* or *them*, it slides right into the middle: *turn it down*.",
    "换一个小词，整个意思就变了：*turn on*（打开）、*turn off*（关掉）、*turn up*（调大）、*turn down*（调小或拒绝）。如果宾语是 *it* 或 *them* 这样的代词，必须放进中间：*turn it down*。",
  ),
  prerequisites: ["b1-words-little-words-5", "present-perfect-or-past-simple"],
  encompasses: [{ topic: "b1-words-little-words-5", weight: 0.1 }],
  xp: 25,
  strand: "grammar",
  knowledgePoints: [
    point(
      "particle",
      t("The small word", "小词"),
      t(
        "A **phrasal verb** is a verb with a small word such as *up, down, on, off, out, back, in, away*. The small word changes the meaning, so the right one matters:\n\n- *Turn **up** the music* (make it louder) / *Turn **down** the music* (make it quieter).\n- *Put **on** your coat* (start wearing it) / *Take **off** your shoes* (remove them).\n- *Look **up** a word* (in a dictionary) / *Look **after** a child* (take care of it).\n\n> **Watch out.** Do not translate the small word literally from Chinese—read the whole sentence to see which verb + particle pair matches the situation.",
        "**短语动词**是动词加一个小词，比如 *up, down, on, off, out, back, in, away*。小词会改变意思，所以要选对：\n\n- *Turn **up** the music*（调大声）/ *Turn **down** the music*（调小声）。\n- *Put **on** your coat*（穿上）/ *Take **off** your shoes*（脱下）。\n- *Look **up** a word*（查词典）/ *Look **after** a child*（照顾）。\n\n> **注意。** 不要按中文字面硬译小词——通读整句语境，选出与句意匹配的“动词 + 小词”固定搭配。",
      ),
      choiceGenerator(
        t("Choose the small word that completes the phrasal verb.", "选出构成短语动词的小词。"),
        particleChoice,
        (right, shown) => {
          const [, , , verb = "", meaning = ""] = phrasalOf(shown) ?? [];
          return t(
            `The sentence needs the meaning *${meaning}*, and that is *${verb}*, so the small word is *${right}*: ${fill(shown, right)}\n\n**Check.** Substitute *${meaning}* back into the sentence—it matches the context and confirms *${verb}*.`,
            `这句需要表达 *${meaning}* 的意思，也就是 *${verb}*，所以小词是 *${right}*：${fill(shown, right)}\n\n**检验。** 把 *${meaning}* 代回原句验证——句意完全通顺，印证了短语动词 *${verb}*。`,
          );
        },
        whyNotParticle,
      ),
    ),
    point(
      "meaning",
      t("What a phrasal verb means", "短语动词的意思"),
      t(
        "The meaning of a phrasal verb is often not the meaning of its two words added together: *give up* means *stop trying*, not *give* + *up*. *Break down* means *stop working*, for a machine; *bring up* a child means *care for it until it is an adult*.\n\n> **Watch out.** Do not guess from the base verb alone—test each candidate meaning inside the sentence to see which one actually makes sense.",
        "短语动词的意思常常不是两个词意思的简单相加：*give up* 的意思是“放弃”，不是 *give* + *up*。*Break down* 指机器“出故障”；*bring up* a child 指“把孩子抚养长大”。\n\n> **注意。** 不要只看前面的动词字面猜意思——把选项放进整句话里检验，看哪一个意思与上下文严丝合缝。",
      ),
      choiceGenerator(
        t("What does the phrasal verb mean in this sentence?", "这个短语动词在句中是什么意思？"),
        meaningChoice,
        (right, shown) => {
          const [sentence = "", verb = ""] = shown.split(" → ");
          return t(
            `In this sentence *${verb}* means *${right}*, which the rest of the sentence makes clear: ${sentence}\n\n**Check.** Replace *${verb}* in the sentence with *${right}*—the sentence keeps the exact same meaning.`,
            `在这句话里，*${verb}* 的意思是 *${right}*，句子的其他部分说明了这一点：${sentence}\n\n**检验。** 用 *${right}* 替换句中的 *${verb}*——整句话的意思完全不变。`,
          );
        },
        (wrong, _right, shown) => {
          const verb = shown.split(" → ")[1] ?? "";
          const owner = verbWithMeaning(wrong);
          return owner
            ? t(`*${wrong}* is what *${owner}* means, not *${verb}*.`, `*${wrong}* 是 *${owner}* 的意思，不是 *${verb}* 的意思。`)
            : t(`*${verb}* does not mean *${wrong}* in this sentence.`, `在这句话里，*${verb}* 不是 *${wrong}* 的意思。`);
        },
      ),
    ),
    point(
      "pronoun",
      t("Turn it down, not turn down it", "说 turn it down，不说 turn down it"),
      t(
        "With many phrasal verbs, the object can go after the small word or between the two parts: *turn down **the music*** or *turn **the music** down*.\n\nBut an **object pronoun** (*it, them, her, him, me*) always goes **between** the verb and the small word:\n\n- *Turn **it** down.* — not *Turn down it.*\n- *Pick **them** up.* — not *Pick up them.*\n- *Call **her** back.* — not *Call back her.*\n\n> **Watch out.** Never put a pronoun like *it*, *them*, *him* or *her* after the particle (*turn down it* is always wrong).",
        "许多短语动词的宾语可以放在小词后面，也可以放在两部分中间：*turn down **the music*** 或 *turn **the music** down*。\n\n但**宾语代词**（*it, them, her, him, me*）总是放在动词和小词**中间**：\n\n- *Turn **it** down.*，不说 *Turn down it.*\n- *Pick **them** up.*，不说 *Pick up them.*\n- *Call **her** back.*，不说 *Call back her.*\n\n> **注意。** 绝不要把 *it、them、him、her* 这类代词放在小词后面（*turn down it* 永远是错的）。",
      ),
      typedGenerator(
        "word-form",
        t("Type the phrasal verb with the pronoun in brackets in the right place.", "输入短语动词，把括号中的代词放在正确的位置。"),
        pronounTyped,
        (right, shown) => {
          const [verb = "", pronoun = "", particle = ""] = right.split(" ");
          return t(
            `An object pronoun goes between the verb and the small word: ${fill(shown, right)}\n\n**Check.** Verify the three-word order: verb (*${verb}*) + pronoun (*${pronoun}*) + particle (*${particle}*).`,
            `宾语代词放在动词和小词中间：${fill(shown, right)}\n\n**检验。** 核对三词顺序：动词（*${verb}*）+ 代词（*${pronoun}*）+ 小词（*${particle}*）。`,
          );
        },
        phrasalVerbsPronounNot,
      ),
    ),
  ],
};

// Writing a review.

const reviewBank: readonly WritingItem[] = [
  {
    task: "Write a review of a film you have seen recently for a student website.",
    model:
      "The Last Lighthouse\n\nThe Last Lighthouse is an adventure film about a girl called Mei who lives with her grandfather in a lighthouse on a small island. When a storm destroys their boat, she has to find a way to save him.\n\nThe best thing about the film is the photography. The scenes of the sea and the storm are so dramatic and realistic that I felt as if I were on the island myself. The young actress who plays Mei is also brilliant: she is funny, brave and completely believable.\n\nHowever, the film is not perfect. The middle part is rather slow, and some of the characters, especially the villain, are not very original. I also guessed the ending long before it came.\n\nOverall, I would recommend The Last Lighthouse to anyone who enjoys adventure stories and beautiful scenery. It is not a masterpiece, but it is an exciting and inspiring film that the whole family can enjoy. I give it four stars out of five.",
  },
  {
    task: "Write a review of a book you have read for your school magazine.",
    model:
      "The Silent Garden\n\nThe Silent Garden is a novel by a young author about a boy who moves to a new town after his parents divorce. He finds an old garden behind his grandmother's house, and as he brings it back to life, he slowly learns to deal with his feelings.\n\nWhat I liked most was the way the story is told. The author writes in short, simple chapters, and her descriptions of the garden are so vivid that I could almost smell the flowers. The main character is very realistic, and I think many teenagers will recognize themselves in him.\n\nOn the other hand, the book has some weaknesses. Some of the other characters, such as his teachers, are quite dull, and the ending felt a little rushed after such a slow beginning.\n\nIn spite of this, I really enjoyed The Silent Garden, and I would recommend it to students who like quiet, thoughtful stories rather than action. It is a book that stays in your mind for a long time.",
  },
  {
    task: "Write a review of a concert or a music show you have been to for a local news website.",
    model:
      "The Riverside Band at the City Hall\n\nLast Saturday, the Riverside Band played to a full house at the City Hall. The band, which is made up of five young musicians from our town, performed songs from their new album as well as some of their older hits.\n\nThe concert was excellent in many ways. The singer has a powerful voice, and the drummer kept a strong rhythm that made the whole audience want to dance. The lighting was impressive too, with colorful lights that changed with every song. When they played their most popular song at the end, everyone stood up and applauded.\n\nThe only disappointment was the sound in the first half. It was sometimes too loud, and it was hard to hear the lyrics. The venue was also very hot, and the drinks were expensive.\n\nAll in all, it was a great night out. If you get the chance to see the Riverside Band, I strongly recommend that you book your tickets early, because they are becoming more popular every month.",
  },
  {
    task: "Write a review of an exhibition you have visited for a culture blog.",
    model:
      "Colors of the Silk Road at the National Museum\n\nColors of the Silk Road is a new exhibition at the National Museum that shows art and crafts from the countries along the old trade routes between China and Europe. There are paintings, pottery, carpets and jewelry, some of them more than a thousand years old.\n\nThe exhibition is beautifully organized. Each room shows one part of the journey, and there are clear labels in Chinese and English that explain the history of each object. My favorite part was a room full of colorful silk, where you can see how the patterns changed from east to west. There is also an interactive area where children can try weaving.\n\nMy only criticism is that the exhibition is very popular, so it is crowded at weekends. It was sometimes difficult to see the smaller objects. Admission is also quite expensive at 80 yuan.\n\nNevertheless, I would definitely recommend a visit. Go on a weekday morning if you can, and allow at least two hours. It is an inspiring way to learn about history.",
  },
  {
    task: "Write a review of a TV series you have watched for an English learning website.",
    model:
      "Hospital Street\n\nHospital Street is a drama series about the doctors and nurses in a busy city hospital. Each episode follows a few patients, while the longer story is about a young doctor, Dr. Lin, during her first year at work.\n\nThe series has a lot going for it. The plots are exciting, and every episode ends with a dramatic moment that makes you want to watch the next one immediately. The actors are excellent, especially the actress who plays Dr. Lin. The series also gives a realistic picture of how hard hospital workers work, which I found inspiring.\n\nHowever, some viewers may find it too sad. Many patients have serious illnesses, and some episodes made me cry. I also think the love story between two of the doctors is not very original and takes up too much time.\n\nIn conclusion, Hospital Street is one of the best series I have watched this year. I recommend it to anyone who enjoys drama, but it is not suitable for young children. For English learners, it is also useful because the characters speak clearly and there are subtitles.",
  },
  {
    task: "Write a review of a play or a school show you have seen for your school website.",
    model:
      "The School Play: A Midsummer Night's Dream\n\nLast week, the drama club performed Shakespeare's comedy A Midsummer Night's Dream in the school hall. It tells the story of four young lovers who get lost in a magic forest, where fairies play tricks on them.\n\nThe performance was a great success. The students had clearly rehearsed for many weeks, and they spoke the difficult old English with confidence. The funniest scenes were with a group of workers who try to put on a play of their own, and the audience laughed out loud. The costumes, which the students made themselves, were imaginative and colorful.\n\nThere were a few problems, though. Some of the younger actors spoke too quietly, so people at the back could not hear them. The changes between scenes were also slow, and the play lasted almost three hours.\n\nOverall, it was an entertaining evening, and the drama club should be proud of what they achieved. I would recommend that everyone goes to see their next play. It is a wonderful way to discover Shakespeare.",
  },
  {
    task: "Write a review of a video game or an app for a technology website for teenagers.",
    model:
      "Island Builder\n\nIsland Builder is a game for phones and tablets in which you design and look after your own island. You start with an empty beach and slowly build houses, farms and shops, and invite visitors to live there.\n\nThe game has many good points. The graphics are bright and colorful, and the music is calm and relaxing. It also encourages creativity, because there is no right way to build your island. I especially liked the fact that the game teaches you how to manage money: if you spend too much, your island gets into debt.\n\nOn the negative side, the game can be expensive. Although it is free to download, you have to pay for many of the best buildings, and it is easy to spend a lot of money without noticing. Some players may also find it boring after a few weeks, as there are no real challenges.\n\nTo sum up, Island Builder is a fun and relaxing game for players who enjoy designing and planning. I would recommend it, but parents should turn off in-app purchases first.",
  },
  {
    task: "Write a review of a restaurant or a café you have been to for a food website.",
    model:
      "The Green Bowl\n\nThe Green Bowl is a small vegetarian café that opened last month near the main square. It serves soups, salads, noodles and cakes, all made with fresh vegetables from local farms.\n\nI went there for lunch with two friends, and we were very impressed. The food was delicious and colorful, and the portions were generous. My mushroom noodles were the best I have ever eaten, and the homemade chocolate cake was perfect. The café itself is bright and elegant, with plants everywhere, and the staff were friendly and helpful.\n\nThe main problem is that the café is too small. There are only eight tables, so you usually have to wait, and it is quite noisy when it is full. The prices are also a little high for students: lunch for one costs about 70 yuan.\n\nAll in all, I highly recommend The Green Bowl, even if you are not a vegetarian. I suggest that you make a booking or go early, especially at weekends. It is worth the wait.",
  },
  {
    task: "Write a review of a festival or a big event you have been to for a travel website.",
    model:
      "The Lantern Festival in the Old Town\n\nEvery year, on the fifteenth day of the first month, the old town holds a lantern festival. This year, I went with my family, and it was an evening I will never forget.\n\nThe best part was the lanterns themselves. There were thousands of them, in every shape you can imagine, from dragons and fish to famous buildings. When they were all lit up over the river, the effect was magical. There were also stalls selling traditional food and crafts, and a group of musicians played folk music in the main square.\n\nHowever, the festival has become a victim of its own success. It was so crowded that we could hardly move in some streets, and we had to wait an hour for a bus home. It was also difficult to find a place to sit down.\n\nDespite the crowds, I would recommend the festival to anyone visiting the area in February. My advice is to arrive early, wear comfortable shoes and keep your children close to you. It is a wonderful way to experience local culture.",
  },
  {
    task: "Write a review of a museum or a tourist attraction you have visited for an English-language guidebook.",
    model:
      "The Science and Space Museum\n\nThe Science and Space Museum is a large modern museum on the edge of the city. It has five floors of exhibitions about physics, the human body and space exploration, and a planetarium where you can watch films about the universe.\n\nThe museum is an excellent day out for families and students. Almost everything is interactive: you can test your reactions, see how electricity works and even sit in a model of a spacecraft. The staff are enthusiastic and explain things clearly. The film in the planetarium was the highlight of my visit; it was like flying through the stars.\n\nThere are a few disadvantages. The café is expensive and the food is not very good, so I suggest that you bring your own lunch. Some of the machines were also broken when I visited, which was disappointing for the children.\n\nOverall, I would strongly recommend the Science and Space Museum. Allow at least four hours, and buy tickets online to avoid the queue. Admission is free for children under twelve.",
  },
  {
    task: "Write a review of a song or an album you like for a music blog.",
    model:
      "Summer Roads by Lily Zhao\n\nSummer Roads is the second album by the singer and composer Lily Zhao. It has eleven songs, most of them about traveling, growing up and leaving home.\n\nThe album is a big step forward from her first one. Her voice is warm and clear, and the melodies are simple but beautiful; I could not get the first song out of my head for days. What makes the album special, though, is the lyrics. They tell small, honest stories that many young people will recognize, such as the song about a last evening with school friends.\n\nNot every song works equally well. Three or four of the songs in the middle sound very similar, and one rock song with loud guitars feels out of place on such a quiet album.\n\nIn conclusion, Summer Roads is a lovely album, perfect for long journeys or quiet evenings. If you like gentle pop music with meaningful words, I would definitely recommend it. I am already looking forward to her next one.",
  },
  {
    task: "Write a review of a sports event or a match you have watched for a sports website.",
    model:
      "The City Marathon\n\nLast Sunday, more than twenty thousand runners took part in the City Marathon, and I was one of the thousands of spectators who watched along the river.\n\nThe event was very well organized. The route, which passes the main sights of the city, was clearly marked, and there were water stations every few kilometers. The atmosphere was fantastic: bands played music along the streets, and the crowd cheered every runner, from the professional athletes at the front to the people in funny costumes at the back. Seeing the winner cross the line in a new record time was a thrilling moment.\n\nThe main problem for spectators was transport. Many roads were closed and the buses were crowded, so it took me almost two hours to get home. There were also not enough toilets near the finish.\n\nOverall, I would recommend watching, or even running, the City Marathon next year. It is an inspiring event that brings the whole city together. Just remember to plan your journey home before you go.",
  },
];

const writingAReview = judgedTopic({
  id: "writing-a-review",
  title: t("Writing a Review", "写评论"),
  summary: t(
    "Write a review of 150 to 200 words of a film, a book, a show or an exhibition: what it is, what is good and bad about it, and whether you recommend it.",
    "写一篇 150 到 200 词的评论，评一部电影、一本书、一场演出或一个展览：它是什么，好在哪里、不好在哪里，你是否推荐。",
  ),
  intro: t(
    "A balanced review helps readers decide if a film, book or show is for them: give a brief overview without spoilers, weigh both strengths and weaknesses with specific examples, and finish with a clear recommendation.",
    "一篇公允的评论能帮读者决定要不要看一部电影、一本书或一场演出：简短介绍且不剧透，用具体例子兼谈优点与不足，最后给出明确的推荐结论。",
  ),
  prerequisites: ["writing-an-opinion-paragraph"],
  encompasses: [{ topic: "writing-an-opinion-paragraph", weight: 0.3 }],
  criteria: ["b1-review-what-it-is", "b1-review-good-and-bad", "b1-review-recommendation"],
  point: {
    id: "review",
    title: t("What it is, good and bad, and a recommendation", "是什么、优缺点和推荐"),
    explanation: t(
      "A review tells readers what something is like and whether they should try it. Plan four paragraphs:\n\n1. **What it is**: the name and the type, and a short description without the ending: *The Last Lighthouse is an adventure film about a girl who lives in a lighthouse.*\n2. **What is good**, with examples: *The best thing about the film is the photography. The scenes of the storm are so dramatic that...*\n3. **What is not so good**: *However, the middle part is rather slow.*\n4. **Your recommendation**: who would enjoy it and why: *Overall, I would recommend it to anyone who enjoys adventure stories.*\n\n> **Watch out.** Do not spoil the ending or write only praise—include a title, balance strengths with at least one weakness, and state clearly who you recommend it to.",
      "评论告诉读者某样东西怎么样、值不值得去看。分四段来写：\n\n1. **它是什么**：名称和类型，加上不透露结局的简短介绍：*The Last Lighthouse is an adventure film about a girl who lives in a lighthouse.*\n2. **好在哪里**，举例说明：*The best thing about the film is the photography. The scenes of the storm are so dramatic that...*\n3. **不足之处**：*However, the middle part is rather slow.*\n4. **你的推荐**：谁会喜欢，为什么：*Overall, I would recommend it to anyone who enjoys adventure stories.*\n\n> **注意。** 不要剧透结局，也不要一味夸赞——加上标题，既谈亮点也谈至少一处不足，并在结尾明确说出推荐给哪类读者。",
    ),
  },
  question: t(
    "Write a review of 150 to 200 words in English with a title. Say what it is, what is good and what is not so good about it, and whether you recommend it and to whom.",
    "用英语写一篇 150 到 200 词的评论，加上标题。说明它是什么，哪些地方好、哪些地方不够好，以及你是否推荐、推荐给谁。",
  ),
  bank: reviewBank,
  limits: { minWords: 130, maxChars: 1900 },
  what: t("review", "评论"),
});

/** topics are the topics of the unit Arts and Entertainment. */
export const topics: readonly TopicDef[] = [
  arts.topic,
  film.topic,
  music.topic,
  books.topic,
  entertainment.topic,
  describingArt.topic,
  goingOut.topic,
  phrasalVerbs,
  writingAReview,
];

/** vocabulary are the words the unit Arts and Entertainment teaches. */
export const vocabulary: readonly WordBatch[] = [
  arts.batch,
  film.batch,
  music.batch,
  books.batch,
  entertainment.batch,
  describingArt.batch,
  goingOut.batch,
];
