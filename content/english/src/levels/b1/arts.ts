// B1, unit 12: Arts and Entertainment. The arts, film and theater, music, books and stories, entertainment, describing
// art and going out; phrasal verbs; writing a review.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { fill, judgedTopic } from "../a2/kit.ts";
import { vocabularyTopic, word } from "../words.ts";

const arts = vocabularyTopic({
  id: "b1-words-arts",
  title: t("The Arts", "艺术"),
  summary: t(
    "Painters, sculptures and exhibitions; artworks and portraits; photography, crafts and pottery; artistic and creativity; masterpieces and canvas.",
    "画家、雕塑和展览；艺术品和肖像；摄影、手工艺和陶器；有艺术天赋的和创造力；杰作和画布。",
  ),
  prerequisites: ["a1-words-hobbies"],
  words: [
    word(
      "painter painters",
      "a person who paints pictures",
      "画家",
      "Van Gogh was a Dutch {painter}.|pottery canvas | Qi Baishi was a famous Chinese {painter}.|pottery photography | The {painter} worked on the picture for a year.|pottery canvas",
      "printer painting",
    ),
    word(
      "sculpture sculptures",
      "a work of art made by shaping stone, wood, metal or clay",
      "雕塑",
      "There is a bronze {sculpture} of a horse in the park.|photography creativity | The museum has {sculptures} from ancient Greece.|photographies creativities | She made the {sculpture} out of old pieces of metal.|photography creativity",
      "structure picture",
    ),
    word(
      "exhibition exhibitions",
      "a public show of paintings, photos or other things",
      "展览",
      "There's an {exhibition} of Picasso's paintings at the gallery.|pottery canvas | The {exhibition} opens on Monday.|pottery canvas | The school held an {exhibition} of the students' art.|pottery creativity",
      "examination expedition",
    ),
    word(
      "artwork artworks",
      "a painting, a sculpture or another object made by an artist",
      "艺术品",
      "The gallery sells {artworks} by young artists.|creativities photographies | This {artwork} is made from recycled plastic.|creativity photography | Please don't touch the {artworks}.|creativities photographies",
      "artist homework",
      "masterpiece",
    ),
    word(
      "portrait portraits",
      "a painting, drawing or photo of a person",
      "肖像；画像",
      "She painted a {portrait} of her grandmother.|pottery creativity | {Portraits} of old kings hang on the walls of the castle.|Potteries Creativities | The photographer takes {portraits} of famous people.|potteries creativities",
      "portion passport",
    ),
    word(
      "photography",
      "the art or job of taking photos",
      "摄影",
      "He is interested in {photography} and always carries a camera.|pottery canvas | She studied {photography} at college.|canvas sculpture | The film won an award for its {photography}.|canvas pottery",
      "photograph geography",
    ),
    word(
      "craft crafts",
      "making things with your hands, such as baskets, jewelry or furniture",
      "手工艺",
      "The market sells local {crafts}, such as baskets and jewelry.|portraits canvases | Paper cutting is a traditional Chinese {craft}.|canvas portrait | Weaving is a {craft} that takes years to learn.|canvas portrait",
      "draft crack",
    ),
    word(
      "pottery",
      "pots, cups and plates made from clay; the craft of making them",
      "陶器；制陶",
      "I'm taking a {pottery} class on Saturdays.|canvas masterpiece | Jingdezhen is famous for its {pottery}.|canvas portrait | They found ancient {pottery} under the old city.|canvas creativity",
      "poetry potato",
    ),
    word(
      "artistic",
      "good at art, or connected with art",
      "有艺术天赋的；艺术的",
      "My sister is very {artistic}; she paints and makes her own clothes.|pottery canvas | The city has a rich {artistic} life.|pottery creativity | He has a lot of {artistic} talent.|pottery canvas",
      "athletic artificial",
    ),
    word(
      "creativity",
      "the ability to make new things or have new ideas",
      "创造力",
      "The teacher encourages {creativity} in her students.|canvas masterpiece | This job needs a lot of {creativity}.|pottery portrait | Art classes help children develop their {creativity}.|pottery portrait",
      "activity curiosity",
    ),
    word(
      "masterpiece masterpieces",
      "a work of art that is extremely good, or the best that an artist has made",
      "杰作",
      "The Mona Lisa is Leonardo's {masterpiece}.|pottery craft | The museum is full of {masterpieces}.|creativities photographies | Many people think this novel is a {masterpiece}.|pottery canvas",
      "master piece",
      "artwork",
    ),
    word(
      "canvas canvases",
      "strong cloth that artists paint on",
      "画布；帆布",
      "The artist painted on a large {canvas}.|pottery creativity | Her {canvases} are full of bright colors.|potteries creativities | The tent is made of {canvas}.|pottery creativity",
      "cactus campus",
    ),
  ],
});

const film = vocabularyTopic({
  id: "b1-words-film-and-theater",
  title: t("Film and Theater", "电影和戏剧"),
  summary: t(
    "Theaters and stages; scenes and roles; actresses and directors; plots and scripts; performing, performances and rehearsing; comedies.",
    "剧院和舞台；场景和角色；女演员和导演；情节和剧本；表演、演出和排练；喜剧。",
  ),
  prerequisites: ["a1-words-hobbies"],
  words: [
    word(
      "theater theaters",
      "a building where people go to watch plays",
      "剧院",
      "We went to the {theater} to see a play.|plot script | The {theater} was full on the first night.|plot comedy | There are many {theaters} in London.|plots scripts",
      "theory there",
    ),
    word(
      "stage stages",
      "the raised area in a theater where actors perform",
      "舞台",
      "The actors came onto the {stage}.|plot script | She was nervous before going on {stage}.|plot script | The band played on a big {stage} in the park.|plot comedy",
      "stake state",
    ),
    word(
      "scene scenes",
      "a part of a play or a film that happens in one place",
      "场景；场面",
      "The last {scene} of the film made me cry.|director actress | They filmed the beach {scenes} in Hainan.|directors actresses | In the first {scene}, two friends meet at a station.|director actress",
      "screen seen",
    ),
    word(
      "role roles",
      "the character that an actor plays",
      "角色",
      "She plays the {role} of a young doctor.|script stage | He got the main {role} in the school play.|script stage | Actors often learn several {roles} at once.|scripts stages",
      "roll rule",
    ),
    word(
      "actress actresses",
      "a woman who acts in plays or films",
      "女演员",
      "She is a famous Chinese {actress}.|script plot | The {actress} won an award for her role.|script plot | Two {actresses} were chosen for the part.|scripts plots",
      "actor address",
    ),
    word(
      "director directors",
      "the person who tells the actors what to do in a film or a play",
      "导演",
      "Zhang Yimou is a well-known film {director}.|plot script | The {director} asked the actors to do the scene again.|plot script | Many young {directors} make short films first.|plots scripts",
      "detective driver",
    ),
    word(
      "plot plots",
      "the events that form the story of a book, a film or a play",
      "情节",
      "The {plot} was hard to follow.|actress director | I won't tell you the {plot}; you should see it yourself.|actress director | Many films have very similar {plots}.|actresses directors",
      "pilot plate",
    ),
    word(
      "script scripts",
      "the written words of a play or a film",
      "剧本；脚本",
      "The actors read the {script} together for the first time.|stage scene | She wrote the {script} for the film.|stage actress | Don't forget to learn your lines from the {script}.|stage scene",
      "scrap strip",
    ),
    word(
      "performance performances",
      "a show of a play, music or dance; how well someone does something",
      "演出；表现",
      "The evening {performance} starts at eight.|plot script | His {performance} as the old king was brilliant.|plot comedy | There are two {performances} on Saturday.|plots scripts",
      "permission performer",
    ),
    word(
      "perform performs performed performing",
      "to act, sing, dance or play music for an audience",
      "表演；演出",
      "The band will {perform} at the festival.|book script | She {performed} a song in front of the whole school.|booked reviewed | The play has been {performed} all over the world.|booked scripted",
      "perfume prefer",
      "rehearse",
    ),
    word(
      "rehearse rehearses rehearsed rehearsing",
      "to practice a play or a piece of music before a performance",
      "排练；彩排",
      "The actors {rehearsed} for six weeks before the first night.|performed staged | We are {rehearsing} for the school concert.|staging scripting | Let's {rehearse} the last scene again.|book script",
      "research reverse",
      "perform",
    ),
    word(
      "comedy comedies",
      "a funny film or play",
      "喜剧",
      "We watched a {comedy} and laughed all evening.|script stage | It's a romantic {comedy} about two strangers.|script stage | I prefer {comedies} to horror films.|scripts stages",
      "comic tragedy",
    ),
  ],
});

const music = vocabularyTopic({
  id: "b1-words-music-2",
  title: t("Music", "音乐"),
  summary: t(
    "Bands, orchestras and choirs; instruments and violins; rhythm, melodies, tunes and lyrics; albums; composers and musicians.",
    "乐队、管弦乐团和合唱团；乐器和小提琴；节奏、旋律、曲调和歌词；专辑；作曲家和音乐家。",
  ),
  prerequisites: ["a1-words-sports-and-music"],
  words: [
    word(
      "band bands",
      "a group of people who play popular music together",
      "乐队",
      "My brother plays the drums in a rock {band}.|violin album | The {band} played their new song.|violin melody | Which {band} is playing at the festival tonight?|lyrics rhythm",
      "bank hand",
    ),
    word(
      "orchestra orchestras",
      "a large group of musicians who play classical music together",
      "管弦乐团",
      "She plays the violin in the school {orchestra}.|lyrics rhythm | The {orchestra} played music by Beethoven.|lyrics rhythm | The city has two {orchestras}.|lyrics rhythms",
      "orchard chorus",
      "band choir",
    ),
    word(
      "instrument instruments",
      "an object, such as a piano or a guitar, that you use to play music",
      "乐器；仪器",
      "Can you play a musical {instrument}?|lyrics rhythm | The guitar is my favorite {instrument}.|lyrics rhythm | The museum has old Chinese {instruments}.|lyrics rhythms",
      "instruction investment",
    ),
    word(
      "violin violins",
      "an instrument with four strings that you hold under your chin",
      "小提琴",
      "She has played the {violin} since she was five.|lyrics choir | The {violin} has four strings.|choir album | Two {violins} and a piano played at the wedding.|choirs albums",
      "violet villain",
    ),
    word(
      "rhythm rhythms",
      "a regular pattern of sounds or beats in music",
      "节奏",
      "The song has a strong {rhythm} that makes you want to dance.|lyrics album | Clap your hands to the {rhythm}.|lyrics album | African music has many complex {rhythms}.|albums choirs",
      "rhyme ritual",
    ),
    word(
      "melody melodies",
      "a tune; a series of musical notes that are nice to listen to",
      "旋律",
      "The song has a beautiful {melody}.|choir album | I can remember the {melody}, but not the words.|lyrics choir | Chinese folk songs have simple {melodies}.|choirs albums",
      "medley memory",
      "tune",
    ),
    word(
      "lyrics",
      "the words of a song",
      "歌词",
      "I love the music, but I don't understand the {lyrics}.|rhythm melody | She wrote the {lyrics} for the band's new song.|violin orchestra | The {lyrics} are about growing up.|orchestra violin",
      "lyrical letters",
    ),
    word(
      "album albums",
      "a collection of songs on one record or online",
      "专辑；相册",
      "The band's new {album} comes out next week.|choir rhythm | This {album} has twelve songs.|choir rhythm | She has sold millions of {albums}.|choirs rhythms",
      "alarm almond",
    ),
    word(
      "composer composers",
      "a person who writes music",
      "作曲家",
      "Mozart was a famous {composer}.|violin album | The {composer} wrote the music for the film.|album rhythm | Tan Dun is a Chinese {composer}.|violin album",
      "computer conductor",
      "musician",
    ),
    word(
      "musician musicians",
      "a person who plays music, often as a job",
      "音乐家；乐手",
      "My uncle is a professional {musician}.|album rhythm | The {musicians} played until midnight.|albums rhythms | You need to practice every day to become a good {musician}.|album rhythm",
      "magician physician",
      "composer",
    ),
    word(
      "tune tunes",
      "a series of musical notes that make a piece of music",
      "曲调；曲子",
      "She was whistling a happy {tune}.|choir violin | I can't get that {tune} out of my head.|choir lyrics | He played some old {tunes} on the piano.|choirs violins",
      "tone tube",
      "melody",
    ),
    word(
      "choir choirs",
      "a group of people who sing together",
      "合唱团",
      "She sings in the school {choir}.|violin lyrics | The {choir} sang at the end of the ceremony.|violin lyrics | There are thirty singers in the {choir}.|violin lyrics",
      "chair chore",
      "band orchestra",
    ),
  ],
});

const books = vocabularyTopic({
  id: "b1-words-books-and-stories",
  title: t("Books and Stories", "书和故事"),
  summary: t(
    "Novels and authors; poems, poets and poetry; fiction and biographies; chapters; heroes and villains; tales and legends.",
    "小说和作者；诗、诗人和诗歌；虚构作品和传记；章节；英雄和反派；故事和传说。",
  ),
  prerequisites: ["a1-words-books"],
  words: [
    word(
      "novel novels",
      "a long written story about people and events that are not real",
      "长篇小说",
      "Dream of the Red Chamber is a famous Chinese {novel}.|poet villain | She's reading a {novel} about a family in Shanghai.|poet villain | He has written three {novels}.|poets villains",
      "noble navel",
    ),
    word(
      "author authors",
      "the writer of a book",
      "作者",
      "Who is the {author} of this book?|chapter legend | J. K. Rowling is the {author} of the Harry Potter books.|chapter legend | The {author} signed copies of her new book.|chapter legend",
      "actor editor",
    ),
    word(
      "poem poems",
      "a piece of writing in short lines, often with words that rhyme",
      "诗",
      "Li Bai wrote a {poem} about the moon.|villain biography | We had to learn a {poem} by heart.|villain biography | Her {poems} are about nature and love.|villains biographies",
      "problem poet",
    ),
    word(
      "poet poets",
      "a person who writes poems",
      "诗人",
      "Du Fu was a great {poet} of the Tang dynasty.|poetry fiction | The {poet} read her poems to the audience.|poetry fiction | Many {poets} write about love.|poetries fictions",
      "poem post",
    ),
    word(
      "poetry",
      "poems in general",
      "诗歌",
      "I enjoy reading Chinese {poetry}.|poet chapter | She has published two books of {poetry}.|poet chapter | Tang {poetry} is studied in every school in China.|poet chapter",
      "pottery poem",
    ),
    word(
      "fiction",
      "books and stories about people and events that are not real",
      "虚构作品；小说",
      "I prefer {fiction} to history books.|biography chapter | Science {fiction} is about the future and space.|biography chapter | The story is {fiction}, but it feels very real.|biography chapter",
      "friction function",
    ),
    word(
      "biography biographies",
      "the story of a person's life, written by someone else",
      "传记",
      "I'm reading a {biography} of Steve Jobs.|fiction poetry | She wrote a {biography} of her famous grandfather.|fiction poetry | {Biographies} of sports stars sell well.|Fictions Poetries",
      "geography biology",
    ),
    word(
      "chapter chapters",
      "one of the parts that a book is divided into",
      "章；章节",
      "Read the first {chapter} for homework.|villain legend | The book has twenty {chapters}.|villains legends | In the last {chapter}, the hero finally comes home.|villain legend",
      "character charter",
    ),
    word(
      "hero heroes",
      "the main good character in a story; a brave person whom people admire",
      "英雄；男主角",
      "The {hero} of the story saves the city.|villain chapter | The firefighter is a local {hero}.|villain chapter | Superheroes are the {heroes} of many films.|villains chapters",
      "here heroin",
    ),
    word(
      "villain villains",
      "the bad character in a story",
      "反派；恶棍",
      "In the end, the {villain} goes to prison.|chapter legend | The {villain} wants to destroy the world.|chapter legend | The actor usually plays {villains}.|chapters legends",
      "village violin",
    ),
    word(
      "tale tales",
      "a story, often about imaginary events",
      "故事；传说",
      "My grandmother told us {tales} about dragons.|chapters poets | It's a {tale} of love and adventure.|chapter poet | The book is a collection of fairy {tales}.|chapters poets",
      "tail tile",
      "legend",
    ),
    word(
      "legend legends",
      "an old, well-known story that may not be true",
      "传说",
      "There is a {legend} about a white snake that became a woman.|chapter poet | According to {legend}, the lake has no bottom.|chapter poet | The {legends} of King Arthur are very old.|chapters poets",
      "legal leader",
      "tale",
    ),
  ],
});

const entertainment = vocabularyTopic({
  id: "b1-words-entertainment",
  title: t("Entertainment", "娱乐"),
  summary: t(
    "Entertainment, entertaining and leisure; celebrities and fame; contests; trends, fashion and style; popular; reviewing and recommending.",
    "娱乐、使快乐和闲暇；名人和名气；比赛；潮流、时尚和风格；受欢迎的；评论和推荐。",
  ),
  prerequisites: ["b1-words-media"],
  words: [
    word(
      "entertainment",
      "films, music, shows and other things that people enjoy",
      "娱乐；娱乐活动",
      "The hotel has live music and other {entertainment} every evening.|fame leisure | She works in the {entertainment} industry.|fame trend | For {entertainment}, we played cards.|fame trend",
      "employment environment",
    ),
    word(
      "entertain entertains entertained entertaining",
      "to keep people interested and amused; to invite guests to your home",
      "使快乐；款待",
      "The clown {entertained} the children for an hour.|reviewed recommended | The film is very {entertaining}.|reviewed recommended | My parents love {entertaining} friends at home.|reviewing booking",
      "enter contain",
    ),
    word(
      "leisure",
      "the time when you are not working and can do what you enjoy",
      "闲暇；空闲",
      "What do you do in your {leisure} time?|fame celebrity | The town has a new {leisure} center with a pool.|fame celebrity | Reading is my favorite {leisure} activity.|fame celebrity",
      "pleasure measure",
    ),
    word(
      "celebrity celebrities",
      "a famous person, especially in entertainment",
      "名人",
      "The magazine is full of photos of {celebrities}.|contests trends | She became a {celebrity} after the TV show.|contest trend | Many {celebrities} use social media to sell products.|contests trends",
      "celebration celery",
    ),
    word(
      "fame",
      "being known by many people",
      "名气；名声",
      "She found {fame} as a singer when she was only sixteen.|leisure style | {Fame} can change people.|Leisure Style | The town's {fame} comes from its hot springs.|leisure style",
      "game flame",
    ),
    word(
      "contest contests",
      "a competition",
      "比赛；竞赛",
      "She won a singing {contest} on TV.|trend fashion | The {contest} is open to students under eighteen.|trend fashion | I entered a photography {contest}.|trend fashion",
      "context content",
    ),
    word(
      "trend trends",
      "a general change in what people do or like",
      "趋势；潮流",
      "There is a {trend} toward eating less meat.|contest celebrity | Young people follow fashion {trends} on social media.|contests celebrities | The new {trend} is short videos.|contest celebrity",
      "tend treat",
    ),
    word(
      "fashion fashions",
      "the style of clothes that is popular at a certain time",
      "时尚；流行款式",
      "She wants to work in {fashion}.|leisure fame | Short skirts are back in {fashion}.|leisure fame | {Fashions} change every year.|Leisures Fames",
      "passion faction",
      "style",
    ),
    word(
      "style styles",
      "a particular way of doing or making something; looking fashionable",
      "风格；时髦",
      "I like the {style} of your jacket.|fame leisure | The building is in a traditional Chinese {style}.|fame leisure | She has her own {style} of writing.|fame leisure",
      "smile stale",
      "fashion",
    ),
    word(
      "popular",
      "liked by many people",
      "受欢迎的；流行的",
      "Basketball is very {popular} in China.|leisure fame | The restaurant is {popular} with students.|leisure fame | It's the most {popular} song of the year.|leisure fame",
      "people regular",
    ),
    word(
      "review reviews reviewed reviewing",
      "to write your opinion of a film, a book or a show; a piece of writing that does this",
      "评论；写评论",
      "The film got excellent {reviews}.|contests trends | She {reviews} new books for a newspaper.|entertains applauds | I always read the {reviews} before I buy something online.|contests trends",
      "view preview",
    ),
    word(
      "recommend recommends recommended recommending",
      "to say that something is good and that someone should try it",
      "推荐",
      "Can you {recommend} a good restaurant?|entertain applaud | I {recommend} this book to anyone who loves adventure.|entertain review | The doctor {recommended} more rest.|entertained reviewed",
      "remember command",
    ),
  ],
});

const describingArt = vocabularyTopic({
  id: "b1-words-describing-art",
  title: t("Describing Art", "描述艺术"),
  summary: t(
    "Abstract and realistic; colorful, dramatic and vivid; impressive and inspiring; original, imaginative and classic; elegant; dull.",
    "抽象的和逼真的；色彩丰富的、戏剧性的和生动的；令人印象深刻的和鼓舞人心的；原创的、富有想象力的和经典的；优雅的；乏味的。",
  ),
  prerequisites: ["b1-words-arts"],
  words: [
    word(
      "abstract",
      "showing shapes and colors, not real people or things",
      "抽象的",
      "I don't understand {abstract} art; it's just shapes and colors to me.|realistic pottery | The painting is {abstract}, so everyone sees something different in it.|realistic canvas | Kandinsky painted {abstract} pictures.|canvas pottery",
      "absent attract",
    ),
    word(
      "realistic",
      "showing things as they really are",
      "逼真的；现实的",
      "The painting is so {realistic} that it looks like a photo.|abstract imaginative | The film gives a {realistic} picture of life in a hospital.|abstract canvas | Is it {realistic} to finish this by Friday?|abstract colorful",
      "relative logistic",
    ),
    word(
      "colorful",
      "having many bright colors",
      "色彩丰富的",
      "The market was full of {colorful} fruit and flowers.|pottery canvas | She wore a {colorful} dress to the party.|applause pottery | Children love {colorful} picture books.|applause pottery",
      "careful powerful",
      "vivid",
    ),
    word(
      "dramatic",
      "exciting and impressive; sudden and noticeable",
      "戏剧性的；激动人心的",
      "The film has a very {dramatic} ending.|applause canvas | There has been a {dramatic} change in the weather.|canvas elegant | The mountains looked {dramatic} against the dark sky.|applause canvas",
      "democratic drastic",
    ),
    word(
      "impressive",
      "making you admire something because it is very good or very big",
      "令人印象深刻的",
      "The new museum is a very {impressive} building.|applause canvas | Her English is {impressive} for someone who started a year ago.|dull abstract | That was an {impressive} performance.|applause canvas",
      "expressive impossible",
      "inspiring",
    ),
    word(
      "original",
      "new and different, not copied; the first one",
      "原创的；原来的",
      "Her ideas are always very {original}.|applause canvas | This is a copy; the {original} painting is in Paris.|dull vivid | The {original} version of the song was slower.|applause canvas",
      "ordinary organic",
      "imaginative",
    ),
    word(
      "classic",
      "of a very high quality, and popular for a long time",
      "经典的；一流的",
      "Casablanca is a {classic} film that people still love eighty years later.|applause canvas | The radio station plays {classic} songs that everyone still knows and loves.|applause canvas | Pride and Prejudice is a {classic} novel.|applause canvas",
      "classical class",
    ),
    word(
      "elegant",
      "beautiful in a simple, graceful way",
      "优雅的；雅致的",
      "She looked very {elegant} in her long black dress.|applause canvas | The hotel has an {elegant} dining room.|applause canvas | The design of the bridge is simple and {elegant}.|applause canvas",
      "elephant relevant",
    ),
    word(
      "dull",
      "boring; not bright",
      "乏味的；暗淡的",
      "The film was so {dull} that I fell asleep.|impressive inspiring | The colors in the painting are {dull} and gray.|vivid colorful | It was a {dull} winter day.|applause canvas",
      "doll full",
    ),
    word(
      "inspiring",
      "making you want to do something or feel you can do it",
      "鼓舞人心的",
      "The film tells an {inspiring} story about a blind runner.|applause canvas | Her speech was very {inspiring}.|applause canvas | He is an {inspiring} teacher.|applause canvas",
      "inspecting aspiring",
      "impressive",
    ),
    word(
      "imaginative",
      "having or showing new and clever ideas",
      "富有想象力的",
      "It's an {imaginative} story about a city under the sea.|dull realistic | The children made {imaginative} costumes out of paper.|applause canvas | She's a very {imaginative} writer.|applause canvas",
      "imaginary immature",
      "original",
    ),
    word(
      "vivid",
      "very bright in color; very clear in your mind",
      "鲜艳的；生动的",
      "The painting uses {vivid} reds and yellows.|applause canvas | I have {vivid} memories of my first day at school.|applause canvas | The book gives a {vivid} description of the war.|applause canvas",
      "valid livid",
      "colorful",
    ),
  ],
});

const goingOut = vocabularyTopic({
  id: "b1-words-going-out",
  title: t("Going Out", "外出娱乐"),
  summary: t(
    "Bookings, admission and rows; premieres; applause and applauding; venues and nightlife; spectators; gigs, carnivals and circuses.",
    "预订、入场和座位排；首映；掌声和鼓掌；场馆和夜生活；观众；演出、狂欢节和马戏团。",
  ),
  prerequisites: ["a2-words-festivals"],
  words: [
    word(
      "booking bookings",
      "an arrangement to have a seat, a table or a room at a certain time",
      "预订",
      "I made a {booking} for a table for four at seven o'clock.|venue gig | The theater doesn't take {bookings} by phone.|venues gigs | Can I change my {booking} to Saturday?|venue gig",
      "looking cooking",
    ),
    word(
      "admission",
      "the money you pay to go into a place; being allowed to enter",
      "入场费；入场",
      "{Admission} to the museum is free.|Applause Nightlife | {Admission} costs ten dollars for adults.|Applause Nightlife | Children under five get free {admission}.|applause nightlife",
      "permission mission",
    ),
    word(
      "row rows",
      "a line of seats in a theater or a cinema",
      "（座位的）排",
      "We sat in the front {row}.|venue gig | Our seats are in {row} F.|venue gig | There are thirty {rows} of seats in the hall.|venues gigs",
      "raw roll",
    ),
    word(
      "premiere premieres",
      "the first public performance of a play or the first showing of a film",
      "首映；首演",
      "The film stars came to the {premiere} in Shanghai.|applause admission | The {premiere} of the new play is on Friday.|applause admission | We had tickets for the {premiere}.|applause admission",
      "premier prayer",
    ),
    word(
      "applause",
      "the noise of people clapping their hands to show that they enjoyed something",
      "掌声",
      "The singer came back on stage to loud {applause}.|admission nightlife | There was {applause} at the end of the speech.|admission nightlife | Let's give a round of {applause} to our speaker!|admission nightlife",
      "applaud apples",
      "applaud",
    ),
    word(
      "applaud applauds applauded applauding",
      "to clap your hands to show that you enjoyed something",
      "鼓掌",
      "Everyone stood up and {applauded}.|booked admitted | The audience {applauded} for five minutes.|booked rowed | We {applaud} at the end of the performance.|book row",
      "applause apply",
      "applause",
    ),
    word(
      "venue venues",
      "the place where an event such as a concert or a match happens",
      "（活动）场馆；场地",
      "The concert {venue} holds 20,000 people.|applause admission | We need to find a {venue} for the wedding.|applause premiere | The city has many music {venues}.|applauses premieres",
      "avenue revenue",
    ),
    word(
      "nightlife",
      "the entertainment, such as bars, clubs and concerts, that is available at night",
      "夜生活",
      "The city is famous for its {nightlife}.|admission applause | There isn't much {nightlife} in our small town.|admission applause | Students enjoy the {nightlife} near the university.|admission applause",
      "lifetime nightmare",
    ),
    word(
      "spectator spectators",
      "a person who watches an event, especially a sport",
      "观众（尤指体育比赛）",
      "Thousands of {spectators} watched the match.|venues gigs | The {spectators} cheered when the runner crossed the line.|venues gigs | One {spectator} ran onto the field.|venue gig",
      "speculator inspector",
    ),
    word(
      "gig gigs",
      "a performance of popular music",
      "（流行音乐）演出",
      "My brother's band has a {gig} on Saturday night.|row admission | We went to a {gig} in a small club.|row admission | The band played over a hundred {gigs} last year.|rows premieres",
      "jig dig",
    ),
    word(
      "carnival carnivals",
      "a public festival with music and dancing in the streets",
      "狂欢节",
      "The {carnival} in Rio de Janeiro is famous all over the world.|admission row | People wear colorful costumes at the {carnival}.|admission row | The town holds a summer {carnival} every year.|admission row",
      "cannibal capital",
    ),
    word(
      "circus circuses",
      "a show with acrobats, clowns and sometimes animals, often in a big tent",
      "马戏团；马戏表演",
      "We took the children to the {circus}.|row admission | The {circus} came to town for a week.|row admission | Many {circuses} no longer use animals.|rows admissions",
      "circle cirrus",
    ),
  ],
});

// Phrasal verbs.

/**
 * phrasals are sentences with a phrasal verb: the sentence with its small word missing, the small word, two wrong
 * small words, the phrasal verb, its meaning here and two meanings it does not have.
 */
const phrasals: readonly (readonly [string, string, readonly [string, string], string, string, readonly [string, string]])[] = [
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

const particleChoice: readonly ChoiceItem[] = phrasals.map(([s, right, wrong]): ChoiceItem => [s, right, wrong]);

const meaningChoice: readonly ChoiceItem[] = phrasals.map(
  ([s, particle, , verb, meaning, wrong]): ChoiceItem => [`${s.replace("___", particle)} → ${verb}`, meaning, wrong],
);

/**
 * separable are phrasal verbs that take an object pronoun between the verb and the small word: the context with a gap,
 * the verb as it appears, the small word and the pronoun.
 */
const separable: readonly (readonly [string, string, string, string])[] = [
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

const pronounTyped: readonly TypedItem[] = separable.map(
  ([s, verb, particle, pronoun]): TypedItem => ({
    shown: `${s} (${verb} ${particle} · ${pronoun})`,
    accepted: [`${verb} ${pronoun} ${particle}`],
    wrong: [`${verb} ${particle} ${pronoun}`],
  }),
);

/** phrasalOf finds the phrasal verb of a gapped sentence. */
const phrasalOf = (shown: string) => phrasals.find(([s]) => s === shown || shown.startsWith(s.replace(/___.*$/u, "")));

/** verbWithMeaning is the first phrasal verb that has a meaning. */
const verbWithMeaning = (meaning: string): string | undefined => phrasals.find(([, , , , m]) => m === meaning)?.[3];

/** whyNotParticle explains a small word that makes another phrasal verb or none that fits. */
const whyNotParticle = (wrong: string, right: string, shown: string): Text => {
  const [, , , verb = "", meaning = ""] = phrasalOf(shown) ?? [];
  const base = verb.split(" ")[0] ?? "";
  const other = phrasals.find(([, , , v]) => v === `${base} ${wrong}` || v.startsWith(`${base} ${wrong} `));
  return other
    ? t(
        `*${other[3]}* means *${other[4]}*, which does not fit here. The sentence needs *${verb}*, which means *${meaning}*.`,
        `*${other[3]}* 的意思是 *${other[4]}*，放在这里不合适。这句需要 *${verb}*，意思是 *${meaning}*。`,
      )
    : t(
        `*${base} ${wrong}* does not mean *${meaning}*. That meaning takes *${right}*: *${verb}*.`,
        `*${base} ${wrong}* 没有 *${meaning}* 的意思。这个意思要用 *${right}*：*${verb}*。`,
      );
};

const phrasalVerbs: TopicDef = {
  id: "phrasal-verbs",
  title: t("Phrasal Verbs", "短语动词"),
  summary: t(
    "turn down, find out, give up, look after: a verb and a small word together often mean something new; an object pronoun goes between them: turn it down.",
    "turn down, find out, give up, look after：动词和一个小词合在一起常常有新的意思；宾语代词放在两者中间：turn it down。",
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
        "A **phrasal verb** is a verb with a small word such as *up, down, on, off, out, back, in, away*. The small word changes the meaning, so the right one matters:\n\n- *Turn **up** the music* (make it louder) / *Turn **down** the music* (make it quieter).\n- *Put **on** your coat* (start wearing it) / *Take **off** your shoes* (remove them).\n- *Look **up** a word* (in a dictionary) / *Look **after** a child* (take care of it).\n\nRead the whole sentence: the context tells you which small word fits.",
        "**短语动词**是动词加一个小词，比如 *up, down, on, off, out, back, in, away*。小词会改变意思，所以要选对：\n\n- *Turn **up** the music*（调大声）/ *Turn **down** the music*（调小声）。\n- *Put **on** your coat*（穿上）/ *Take **off** your shoes*（脱下）。\n- *Look **up** a word*（查词典）/ *Look **after** a child*（照顾）。\n\n读完整个句子：上下文告诉你哪个小词合适。中文用“上”“下”“开”“关”这样的补语表达类似的意思，但英语的小词常常不能按字面翻译。",
      ),
      choiceGenerator(
        t("Choose the small word that completes the phrasal verb.", "选出构成短语动词的小词。"),
        particleChoice,
        (right, shown) => {
          const [, , , verb = "", meaning = ""] = phrasalOf(shown) ?? [];
          return t(
            `The sentence needs the meaning *${meaning}*, and that is *${verb}*, so the small word is *${right}*: ${fill(shown, right)}`,
            `这句需要表达 *${meaning}* 的意思，也就是 *${verb}*，所以小词是 *${right}*：${fill(shown, right)}`,
          );
        },
        whyNotParticle,
      ),
    ),
    point(
      "meaning",
      t("What a phrasal verb means", "短语动词的意思"),
      t(
        "The meaning of a phrasal verb is often not the meaning of its two words added together: *give up* means *stop trying*, not *give* + *up*. *Break down* means *stop working*, for a machine; *bring up* a child means *care for it until it is an adult*.\n\nLearn each phrasal verb with an example sentence, and use the context to work out what it means.",
        "短语动词的意思常常不是两个词意思的简单相加：*give up* 的意思是“放弃”，不是 *give* + *up*。*Break down* 指机器“出故障”；*bring up* a child 指“把孩子抚养长大”。\n\n每个短语动词都和例句一起记，并借助上下文推断它的意思。",
      ),
      choiceGenerator(
        t("What does the phrasal verb mean in this sentence?", "这个短语动词在句中是什么意思？"),
        meaningChoice,
        (right, shown) => {
          const [sentence = "", verb = ""] = shown.split(" → ");
          return t(
            `In this sentence *${verb}* means *${right}*, which the rest of the sentence makes clear: ${sentence}`,
            `在这句话里，*${verb}* 的意思是 *${right}*，句子的其他部分说明了这一点：${sentence}`,
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
        "With many phrasal verbs, the object can go after the small word or between the two parts: *turn down **the music*** or *turn **the music** down*.\n\nBut an **object pronoun** (*it, them, her, him, me*) always goes **between** the verb and the small word:\n\n- *Turn **it** down.* — not *Turn down it.*\n- *Pick **them** up.* — not *Pick up them.*\n- *Call **her** back.* — not *Call back her.*\n\nType the verb, the pronoun and the small word in that order.",
        "许多短语动词的宾语可以放在小词后面，也可以放在两部分中间：*turn down **the music*** 或 *turn **the music** down*。\n\n但**宾语代词**（*it, them, her, him, me*）总是放在动词和小词**中间**：\n\n- *Turn **it** down.*，不说 *Turn down it.*\n- *Pick **them** up.*，不说 *Pick up them.*\n- *Call **her** back.*，不说 *Call back her.*\n\n按动词、代词、小词的顺序输入。",
      ),
      typedGenerator(
        "word-form",
        t("Type the phrasal verb with the pronoun in brackets in the right place.", "输入短语动词，把括号中的代词放在正确的位置。"),
        pronounTyped,
        (right, shown) => t(fill(shown, right), `${fill(shown, right)}（代词放在动词和小词中间）`),
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
  prerequisites: ["writing-an-opinion-paragraph"],
  encompasses: [{ topic: "writing-an-opinion-paragraph", weight: 0.3 }],
  criteria: ["b1-review-what-it-is", "b1-review-good-and-bad", "b1-review-recommendation"],
  point: {
    id: "review",
    title: t("What it is, good and bad, and a recommendation", "是什么、优缺点和推荐"),
    explanation: t(
      "A review tells readers what something is like and whether they should try it. Plan four paragraphs:\n\n1. **What it is**: the name and the type, and a short description without the ending: *The Last Lighthouse is an adventure film about a girl who lives in a lighthouse.*\n2. **What is good**, with examples: *The best thing about the film is the photography. The scenes of the storm are so dramatic that...*\n3. **What is not so good**: *However, the middle part is rather slow.*\n4. **Your recommendation**: who would enjoy it and why: *Overall, I would recommend it to anyone who enjoys adventure stories.*\n\nUse describing words (*dramatic, vivid, dull, original, impressive*), linking words (*however, on the other hand, overall, in conclusion*) and a title. Don't tell the whole plot or the ending!",
      "评论告诉读者某样东西怎么样、值不值得去看。分四段来写：\n\n1. **它是什么**：名称和类型，加上不透露结局的简短介绍：*The Last Lighthouse is an adventure film about a girl who lives in a lighthouse.*\n2. **好在哪里**，举例说明：*The best thing about the film is the photography. The scenes of the storm are so dramatic that...*\n3. **不足之处**：*However, the middle part is rather slow.*\n4. **你的推荐**：谁会喜欢，为什么：*Overall, I would recommend it to anyone who enjoys adventure stories.*\n\n用描述性的词（*dramatic, vivid, dull, original, impressive*）、连接词（*however, on the other hand, overall, in conclusion*），并加一个标题。不要把整个情节或结局都讲出来！中文影评常常只说好或只说坏，英语的评论一般好坏都谈，最后给出明确的推荐。",
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
